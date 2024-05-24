// import { useState, useContext, useEffect } from 'react';
import { useState, useEffect } from 'react';
import { AmountMath } from '@agoric/ertp';
import { ConnectWalletButton, useAgoric, AgoricWalletConnection } from '@agoric/react-components';

import { usePurse } from '../hooks/usePurse';
import { stringifyAmountValue } from '@agoric/web-components';
import type { CopyBag } from '../types';
import { useContractStore } from '../store/contract';
import { makeCopyBag } from '@endo/patterns';
import { E } from '@endo/far';


const joinDao = (
    wallet: AgoricWalletConnection,
  ) => {
    const { instance, brands } = useContractStore.getState();
    if (!instance) throw Error('no contract instance');

    console.log(brands)

    const choices: [string, bigint][] = [
      ['MembershipCard2', 1n],
    ];

    const choiceBag = makeCopyBag(choices);
    console.log(brands)

    const want = { 
        NewMembership: { 
            brand: brands?.Membership, 
            value: choiceBag 
        }, 
        DaoTokens: { 
            brand: brands?.DaoToken, 
            value: 10n
        }, 
    };

    const give = {  };
  
    wallet?.makeOffer(
      {
        source: 'contract',
        instance,
        publicInvitationMaker: 'makeJoinInvitation',
      },
      { give, want },
      undefined,
      (update: { status: string; data?: unknown }) => {
        if (update.status === 'error') {
            console.log(`Offer error: ${update.data}`)
        }
        if (update.status === 'accepted') {
            console.log('Offer accepted')
        }
        if (update.status === 'refunded') {
            console.log('Offer refunded')
        }
      },
    );
  };

const Proposals = () => {

    const [newTitle, setNewTitle] = useState('');
    const [newDetails, setNewDetails] = useState('');
    const { instance, brands, proposals } = useContractStore.getState();
    const daoPurse = usePurse('DaoToken');
    const membershipPurse = usePurse('Membership');

    const { walletConnection } = useAgoric();
    
    useEffect(() => {
        // ...
    }, [walletConnection, instance]);

    const handleCreateProposal = async (newTitle: string, newDetails: string) => {
        if (!walletConnection) {
            alert("Please connect your wallet.");
            return;
        }
        if (!newTitle || !newDetails) {
            alert("Please fill in both title and details for the proposal.");
            return;
        }
    
        try {
            const { instance } = useContractStore.getState();
            
            const createProposalOffer = {
                give: {}, // nothing to give for creating a proposal
                want: {},
            };
    
            walletConnection.makeOffer(
                {
                    source: 'contract',
                    instance,
                    publicInvitationMaker: 'createProposalInvitation',
                },
                createProposalOffer,
                {title: newTitle, details: newDetails},
                (update: any) => {
                    if (update.status === 'accepted') {
                        console.log('Proposal creation accepted:', update);
                    } else {
                        console.log('Proposal creation failed:', update);
                    }
                }
            );
        } catch (error) {
            console.error("Error creating proposal:", error);
            alert("Failed to create proposal.");
        }
    };

    const voteOnProposal = async (proposalId: any, voteFor: any) => {
        if (!walletConnection) {
            alert("Please connect your wallet.");
            return;
        }

        const voteOffer = {
            give: {
                Votes: { brand: brands?.DaoToken, value: 10n },
                CurrentMembership: { brand: brands?.Membership, value: makeCopyBag([]) }
            },
            want: {
                NewMembership: { brand: brands?.Membership, value: makeCopyBag([]) },
            },
        };

        const voteDetails = {
            voteFor: voteFor ? 10n : undefined,
            voteAgainst: !voteFor ? 10n : undefined,
        };
        
        walletConnection.makeOffer(
            {
                source: 'contract',
                instance,
                publicInvitationMaker: 'makeVoteInvitation',
                proposalId,
                voteFor,
            },
            voteOffer,
            {proposalId: proposalId, ...voteDetails},
            (update: any) => {
                console.log('Vote update:', update);
            }
        );
    };
    
    
    return (
        <div className="flex justify-center items-start space-x-4 p-4">
            {/* Wallet Section */}
            <div className="daisyui-card w-96 bg-base-100 shadow-xl flex-1">
                <div className="daisyui-card-body text-center">
                    <h2 className="daisyui-card-title">Membership/Tokens</h2>
                    <ConnectWalletButton className="daisyui-btn daisyui-btn-outline daisyui-btn-primary" />
                    {walletConnection && (
                        <div>
                            <div>
                                <b>DaoToken: </b>
                                {daoPurse ? (
                                    stringifyAmountValue(
                                        AmountMath.make(
                                            daoPurse?.currentAmount.brand,
                                            daoPurse?.currentAmount.value,
                                        ),
                                        daoPurse.displayInfo.assetKind,
                                        daoPurse.displayInfo.decimalPlaces,
                                    )
                                ) : (
                                    <i>Fetching balance...</i>
                                )}
                            </div>
                            <div>
                                <b>Membership: </b>
                                {membershipPurse ? (
                                    <ul>
                                        {(membershipPurse.currentAmount.value as CopyBag).payload.map(([name, number]) => (
                                            <li key={name}>{name}-{String(number)}</li>
                                        ))}
                                    </ul>
                                ) : 'None'}
                            </div>
                            <button onClick={() => joinDao(walletConnection)} className="daisyui-btn daisyui-btn-primary mt-4">
                                Join DAO
                            </button>
                        </div>
                    )}
                </div>
            </div>
    
            {/* Proposals Section */}
            <div className="daisyui-card w-96 bg-base-100 shadow-xl flex-1">
                <div className="daisyui-card-body text-center">
                    <h2 className="daisyui-card-title">Proposals</h2>
                    
                    {
                    proposals?.map((proposal: any) => (

                        <div key={proposal.id} className="mb-4 p-2 border-b">
                            <h3>{proposal.title.title}</h3>
                            <p>{proposal.title.details}</p>
                            <button onClick={() => voteOnProposal(proposal.id, true)} className="daisyui-btn daisyui-btn-primary mr-2">
                                Vote For
                            </button>
                            <button onClick={() => voteOnProposal(proposal.id, false)} className="daisyui-btn daisyui-btn-primary">
                                Vote Against
                            </button>
                        </div>
                        
                    ))
                    }


                    <h3 className="daisyui-card-title">Create Proposal</h3>
                    <div>
                        <input type="text" placeholder="Title" className="input input-bordered w-full max-w-xs" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                        <textarea placeholder="Details" className="textarea textarea-bordered w-full max-w-xs" value={newDetails} onChange={e => setNewDetails(e.target.value)} />
                        <button onClick={() => handleCreateProposal(newTitle, newDetails)} className="daisyui-btn daisyui-btn-primary mt-2">
                        Create New Proposal
                    </button>
                    </div>
                </div>
            </div>
        </div>
    );
    
  };


export { Proposals }