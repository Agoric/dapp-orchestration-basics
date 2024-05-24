// @ts-check

/* eslint-disable import/order -- https://github.com/endojs/endo/issues/1235 */
import { test as anyTest } from './prepare-test-env-ava.js';

import { createRequire } from 'module';
import { E } from '@endo/far';
import { makeCopyBag } from '@endo/patterns';
import { makeNodeBundleCache } from '@endo/bundle-source/cache.js';
import { makeZoeKitForTest } from '@agoric/zoe/tools/setup-zoe.js';
import { AmountMath, AssetKind, makeIssuerKit } from '@agoric/ertp';


/** @typedef {typeof import('../src/dao.contract.js').start} AssetContractFn */

const myRequire = createRequire(import.meta.url);
const contractPath = myRequire.resolve(
  `../src/dao.contract.js`,
);

/** @type {import('ava').TestFn<Awaited<ReturnType<makeTestContext>>>} */
const test = anyTest;


/**
 * Tests assume access to the zoe service and that contracts are bundled.
 *
 * See test-bundle-source.js for basic use of bundleSource().
 * Here we use a bundle cache to optimize running tests multiple times.
 *
 * @param {unknown} _t
 */
const makeTestContext = async _t => {
  const { zoeService: zoe, feeMintAccess } = makeZoeKitForTest();
  const bundleCache = await makeNodeBundleCache('bundles/', {}, s => import(s));
  const bundle = await bundleCache.load(contractPath, 'assetContract');
  return { zoe, bundle, bundleCache, feeMintAccess };
};

test.before(async t => (t.context = await makeTestContext(t)));

test('Install the contract', async t => {
  const { zoe, bundle } = t.context;
  const installation = await E(zoe).install(bundle);
  t.log(installation);
  t.is(typeof installation, 'object');
});

test('Start the DAO contract and test joining', async t => {
  const { zoe, bundle } = t.context;
  const installation = E(zoe).install(bundle);
  const daoTokenKit = makeIssuerKit('DummyDaoToken', AssetKind.NAT);
  const membershipKit = makeIssuerKit('DummyMembership', AssetKind.COPY_BAG);

  const issuers = { 
    TokenIssuer: daoTokenKit.issuer, 
    MembershipIssuer: membershipKit.issuer 
  };

  const terms = { 
    DaoTerms: {
      DaoToken: AmountMath.make(daoTokenKit.brand, 10n),
      Membership: AmountMath.make(membershipKit.brand, 10n),
    }
  };

  const { instance } = await E(zoe).startInstance(installation, issuers, terms);

  /** @type {[string, bigint][]} */
  const choices = [
    ['MembershipCard1', 1n],
  ];

  const contractTerms = await E(zoe).getTerms(instance)
  const membershipCardBag = makeCopyBag(choices);
  const publicFacet = E(zoe).getPublicFacet(instance);
  const membershipBrand = contractTerms.brands.Membership
  const membershipIssuer = contractTerms.issuers.Membership 
  const daoTokenBrand = contractTerms.brands.DaoToken 
  const daoTokenIssuer = contractTerms.issuers.DaoToken 
  const joinInvitation = E(publicFacet).makeJoinInvitation()
  const newMembership =  AmountMath.make(membershipBrand, membershipCardBag)
  const votingTokens = AmountMath.make(daoTokenBrand, 10n)

  // joining the DAO
  const joinOffer = {
    give: {},
    want: { NewMembership: newMembership, DaoTokens: votingTokens },
  };
  
  const seat = await E(zoe).offer(joinInvitation, joinOffer, {});
  const payoutMembership = await E(seat).getPayout('NewMembership');
  const payoutDaoTokens = await E(seat).getPayout('DaoTokens');

  
  const createProposalInvitation = E(publicFacet).createProposalInvitation('New Funding Proposal', 'Allocate funds for marketing.')

  const createProposalOffer = {
    give: {
  
    },
    want: {
    
    },
    exit: { onDemand: null }, //
  };

  const createProposalSeat = await E(zoe).offer(createProposalInvitation, createProposalOffer, {}, {title: "t", details: "d"});

  // console.log(`test proposal Id: ${proposalId}`)

  t.truthy(payoutMembership, 'User should receive a Membership NFT upon joining');
  t.truthy(newMembership.brand === payoutMembership.getAllegedBrand())

  const voteInvitation = await E(publicFacet).makeVoteInvitation();
  const requiredDaoTokens = 10n; // num of DAO tokens required to vote

  /** @type {[string, bigint][]} */
  const currentMembershipDetails = [
    ['MembershipCard1', 1n],
  ];

  /** @type {[string, bigint][]} */
  const updatedMembershipDetails = [
    ['MembershipCard2', 1n],
  ];

  const currentMembershipBag = makeCopyBag(currentMembershipDetails);
  const updatedMembershipBag = makeCopyBag(updatedMembershipDetails);
  const currentMembership = AmountMath.make(membershipBrand, currentMembershipBag);
  const updatedMembership = AmountMath.make(membershipBrand, updatedMembershipBag);
  const daoTokenPurse = daoTokenIssuer.makeEmptyPurse();
  daoTokenPurse.deposit(payoutDaoTokens); // dposit existing DAO tokens
  const daoTokensWithdrawn = await E(daoTokenPurse).withdraw(AmountMath.make(daoTokenBrand, requiredDaoTokens));
  const membershipPurse = membershipIssuer.makeEmptyPurse();
  membershipPurse.deposit(payoutMembership); // deposit existing membership
  const membershipWithdrawal = await E(membershipPurse).withdraw(currentMembership);

  const voteOffer = {
    give: {
      CurrentMembership: currentMembership,
      Votes: AmountMath.make(daoTokenBrand, requiredDaoTokens),
    },
    want: {
      NewMembership: updatedMembership
    },
    // exit: { onDemand: null }, //
  };

  const voteSeat = await E(zoe).offer(voteInvitation, voteOffer, {
    CurrentMembership: membershipWithdrawal,
    Votes: daoTokensWithdrawn,
  }, {proposalId: 1n, voteFor: true});

  const voteResult = await E(voteSeat).getOfferResult();

  // retriev the payout of the membership NFT after voting
  const votePayouts = await E(voteSeat).getPayouts();
  const votePayoutMembership = await votePayouts.NewMembership;

  t.is(voteResult, 'Vote accepted. 10 DaoTokens spent.', 'User with Membership NFT and DAO tokens should be able to vote');
  t.truthy(votePayoutMembership, 'User should receive back the Membership NFT after voting');
  const votePayoutMembershipAmount = await E(membershipIssuer).getAmountOf(votePayoutMembership)
  t.truthy(votePayoutMembershipAmount.value.payload[0][0] == "MembershipCard2", 'The brand of the returned Membership NFT should match the expected brand');
});