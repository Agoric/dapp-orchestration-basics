import { E } from '@endo/far';

import { allValues, zip } from '../objectTools.js';
import { sanitizePathSegment } from './start-contract.js';

/// <reference types="@agoric/vats/src/core/types-ambient"/>

/**
 * @import {ERef} from '@endo/far';
 * @import {GovernableStartFn, GovernanceFacetKit} from '@agoric/governance/src/types.js';
 * @import {StartParams, StartResult} from '@agoric/zoe/src/zoeService/utils.js';
 */

const { values } = Object;

/**
 * @typedef {StartResult<
 *   typeof import('@agoric/governance/src/committee.js').start
 * >} CommitteeStart
 */

/**
 * cf. packages/inter-protocol/src/econCommitteeCharter.js
 */
export const INVITATION_MAKERS_DESC = 'charter member invitation';

export const COMMITTEES_ROOT = 'committees'; // cf startEconCommittee.js in agoric-sdk

export const CONTRACT_ELECTORATE = 'Electorate';

export const ParamTypes = /** @type {const} */ ({
  AMOUNT: 'amount',
  BRAND: 'brand',
  INSTALLATION: 'installation',
  INSTANCE: 'instance',
  INVITATION: 'invitation',
  NAT: 'nat',
  RATIO: 'ratio',
  STRING: 'string',
  PASSABLE_RECORD: 'record',
  TIMESTAMP: 'timestamp',
  RELATIVE_TIME: 'relativeTime',
  UNKNOWN: 'unknown',
});

/**
 * Like startGovernedInstance but with parameterized committeeCreatorFacet
 *
 * @template {GovernableStartFn} SF
 * @param {{
 *   zoe: ERef<ZoeService>;
 *   governedContractInstallation: ERef<Installation<SF>>;
 *   issuerKeywordRecord?: IssuerKeywordRecord;
 *   terms: Record<string, unknown>;
 *   privateArgs: Parameters<SF>[1];
 *   label: string;
 * }} zoeArgs
 * @param {{
 *   governedParams: Record<string, unknown>;
 *   timer: ERef<import('@agoric/time').TimerService>;
 *   contractGovernor: ERef<Installation>;
 *   governorTerms: Record<string, unknown>;
 *   committeeCreatorFacet: CommitteeStart['creatorFacet'];
 * }} govArgs
 * @returns {Promise<GovernanceFacetKit<SF>>}
 */
export const startMyGovernedInstance = async (
  {
    zoe,
    governedContractInstallation,
    issuerKeywordRecord,
    terms,
    privateArgs,
    label,
  },
  {
    governedParams,
    timer,
    contractGovernor,
    governorTerms,
    committeeCreatorFacet,
  },
) => {
  console.log('Getting poser invitation...');

  const poserInvitationP = E(committeeCreatorFacet).getPoserInvitation();
  const [initialPoserInvitation, electorateInvitationAmount] =
    await Promise.all([
      poserInvitationP,
      E(E(zoe).getInvitationIssuer()).getAmountOf(poserInvitationP),
    ]);

  const fullGovernorTerms = await allValues({
    timer,
    governedContractInstallation,
    governed: {
      terms: {
        ...terms,
        governedParams: {
          [CONTRACT_ELECTORATE]: {
            type: ParamTypes.INVITATION,
            value: electorateInvitationAmount,
          },
          ...governedParams,
        },
      },
      issuerKeywordRecord,
      label,
    },
    ...governorTerms,
  });
  const governorFacets = await E(zoe).startInstance(
    contractGovernor,
    {},
    fullGovernorTerms,
    harden({
      governed: await allValues({
        ...privateArgs,
        initialPoserInvitation,
      }),
    }),
    `${label}-governor`,
  );
  const [instance, publicFacet, creatorFacet, adminFacet] = await Promise.all([
    E(governorFacets.creatorFacet).getInstance(),
    E(governorFacets.creatorFacet).getPublicFacet(),
    E(governorFacets.creatorFacet).getCreatorFacet(),
    E(governorFacets.creatorFacet).getAdminFacet(),
  ]);
  /** @type {GovernanceFacetKit<SF>} */
  const facets = harden({
    instance,
    publicFacet,
    governor: governorFacets.instance,
    creatorFacet,
    adminFacet,
    governorCreatorFacet: governorFacets.creatorFacet,
    governorAdminFacet: governorFacets.adminFacet,
  });
  return facets;
};

/**
 * @param {*} creatorFacet
 * @param {ERef<import('@agoric/vats').NameHub>} namesByAddress
 * @param {Record<string, string>} voterAddresses
 */
export const inviteToMyCharter = async (
  creatorFacet,
  namesByAddress,
  voterAddresses,
) =>
  Promise.all(
    values(voterAddresses).map(async addr => {
      const debugName = `econ charter member ${addr}`;
      const depositFacet = E(namesByAddress).lookup(addr, 'depositFacet');
      const invitation = await E(creatorFacet).makeCharterMemberInvitation();
      return E(depositFacet)
        .receive(invitation)
        .catch(err => console.error(`failed deposit to ${debugName}`, err));
    }),
  );
harden(inviteToMyCharter);

/**
 * @param {string} contractName
 * @param {BootstrapPowers} powers
 * @param {*} config
 */
export const startMyCharter = async (contractName, powers, config) => {
  const committeeName = `${contractName}Committee`;
  const charterName = `${contractName}Charter`;

  const {
    consume: { namesByAddress, zoe },
    // @ts-expect-error space
    produce: { [`${charterName}Kit`]: produceKit },
    installation: {
      consume: { binaryVoteCounter: counterP, econCommitteeCharter: installP },
    },
    instance: {
      // @ts-expect-error space
      produce: { [charterName]: instanceP },
    },
  } = powers;
  const {
    [committeeName]: { voterAddresses },
  } = config?.options || {};
  assert(voterAddresses, 'no voter addresses???');

  const [charterInstall, counterInstall] = await Promise.all([
    installP,
    counterP,
  ]);
  const terms = await allValues({
    binaryVoteCounterInstallation: counterInstall,
  });

  const startResult = await E(zoe).startInstance(
    charterInstall,
    undefined,
    terms,
    undefined,
    'econCommitteeCharter',
  );
  instanceP.resolve(startResult.instance);
  produceKit.resolve(startResult);

  await inviteToMyCharter(
    startResult.creatorFacet,
    namesByAddress,
    voterAddresses,
  );
  return startResult;
};
harden(startMyCharter);

/**
 * @param {string} contractName
 * @param {BootstrapPowers} powers
 * @param {*} config
 */
export const startMyCommittee = async (contractName, powers, config) => {
  const committeeName = `${contractName}Committee`;
  const {
    consume: { board, chainStorage, namesByAddress, startUpgradable },
    // @ts-expect-error space
    produce: { [`${committeeName}Kit`]: produceKit },
    installation: {
      consume: { committee },
    },
    instance: {
      // @ts-expect-error space
      produce: { [committeeName]: produceInstance },
    },
  } = powers;
  const {
    [committeeName]: { voterAddresses },
  } = config?.options || {};
  assert(voterAddresses, 'no voter addresses???');

  const committeesNode = await E(chainStorage).makeChildNode(COMMITTEES_ROOT);
  const storageNode = await E(committeesNode).makeChildNode(
    sanitizePathSegment(committeeName),
  );
  const marshaller = await E(board).getPublishingMarshaller();

  const privateArgs = {
    storageNode,
    marshaller,
  };

  const started = await E(startUpgradable)({
    label: committeeName,
    installation: await committee,
    terms: { committeeName, committeeSize: values(voterAddresses).length },
    privateArgs,
  });
  produceKit.resolve(started);
  produceInstance.resolve(started.instance);
  console.log(committeeName, 'started');

  /** @param {[string, Promise<Invitation>][]} addrInvitations */
  const distributeInvitations = async addrInvitations => {
    await Promise.all(
      addrInvitations.map(async ([addr, invitationP]) => {
        const debugName = `econ committee member ${addr}`;
        const depositFacet = E(namesByAddress).lookup(addr, 'depositFacet');
        await E.when(invitationP, invitation =>
          E(depositFacet).receive(invitation),
        ).catch(err => console.error(`failed deposit to ${debugName}`, err));
      }),
    );
  };

  /** @type {Promise<Invitation>[]} */
  const invitations = await E(started.creatorFacet).getVoterInvitations();

  await distributeInvitations(zip(values(voterAddresses), invitations));
  return started;
};
