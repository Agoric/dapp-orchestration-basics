// @ts-check
import { E, getInterfaceOf } from '@endo/far';
import { AmountMath, AssetKind } from '@agoric/ertp/src/amountMath.js';
import { allValues, mapValues } from '../src/objectTools.js';
import { seatLike } from './wallet-tools.js';
import {
  makeNameProxy,
  makeAgoricNames,
} from '../tools/ui-kit-goals/name-service-client.js';

const { entries, fromEntries, keys } = Object;

/**
 * @import {Brand, Issuer} from '@agoric/ertp/src/types.js';
 */

/**
 * @typedef {{
 *   brand: Record<string, Promise<Brand>> & { timer: unknown }
 *   issuer: Record<string, Promise<Issuer>>
 *   instance: Record<string, Promise<Instance>>
 *   installation: Record<string, Promise<Installation>>
 * }} WellKnown
 */

/**
 * @typedef {{
 *   assetKind: Map<Brand, AssetKind>
 * }} WellKnownKinds
 */

/**
 * @param {import('ava').ExecutionContext} t
 * @param {{
 *   wallet: import('./wallet-tools.js').MockWallet;
 *   queryTool: Pick<import('../tools/ui-kit-goals/queryKit.js').QueryTool, 'queryData'>;
 * }} mine
 * @param {{
 *   rxAddr: string,
 *   toSend: AmountKeywordRecord;
 * }} shared
 */
export const payerPete = async (
  t,
  { wallet, queryTool },
  { rxAddr, toSend },
) => {
  const hub = await makeAgoricNames(queryTool);
  /** @type {WellKnown} */
  // @ts-expect-error XXX
  const agoricNames = makeNameProxy(hub);

  const instance = await agoricNames.instance.postalService;

  t.log('Pete offers to send to', rxAddr, 'via contract', instance);
  /** @type {import('@agoric/smart-wallet/src/offers.js').OfferSpec} */
  const sendOffer = {
    id: 'peteSend1',
    invitationSpec: {
      source: 'contract',
      instance,
      publicInvitationMaker: 'makeSendInvitation',
      invitationArgs: [rxAddr],
    },
    proposal: { give: toSend },
  };
  t.snapshot(sendOffer, 'client sends offer');
  const updates = await E(wallet.offers).executeOffer(sendOffer);

  const seat = seatLike(updates);
  const payouts = await E(seat).getPayoutAmounts();
  for (const [kwd, amt] of entries(payouts)) {
    const { brand } = amt;
    const kind = AssetKind.NAT; // TODO: handle non-fungible amounts
    t.log('Pete payout should be empty', kwd, amt);
    t.deepEqual(amt, AmountMath.makeEmpty(brand, kind));
  }
};

const trackDeposits = async (t, initial, purseUpdates, toSend) =>
  allValues(
    fromEntries(
      entries(initial).map(([name, _update]) => {
        const amtP = purseUpdates[name].next().then(u => {
          const expected = AmountMath.add(initial[name], toSend[name]);
          t.log('updated balance', name, u.value);
          t.deepEqual(u.value, expected);
          return u.value;
        });
        return [name, amtP];
      }),
    ),
  );

/**
 * Rose expects to receive `shared.toSend` amounts.
 * She expects initial balances to be empty;
 * and relies on `wellKnown.assetKind` to make an empty amount from a brand.
 *
 * @param {import('ava').ExecutionContext} t
 * @param {{ wallet: import('./wallet-tools.js').MockWallet, }} mine
 * @param {{ toSend: AmountKeywordRecord }} shared
 */
export const receiverRose = async (t, { wallet }, { toSend }) => {
  console.time('rose');
  console.timeLog('rose', 'before notifiers');
  const purseNotifier = mapValues(toSend, amt =>
    wallet.peek.purseUpdates(amt.brand),
  );
  console.timeLog('rose', 'after notifiers; before initial');

  const initial = await allValues(
    mapValues(purseNotifier, pn => pn.next().then(u => u.value)),
  );
  console.timeLog('rose', 'got initial', initial);
  t.log('Rose initial', initial);
  t.deepEqual(keys(initial), keys(toSend));

  const done = await trackDeposits(t, initial, purseNotifier, toSend);
  t.log('Rose got balance updates', keys(done));
  t.deepEqual(keys(done), keys(toSend));
};

/**
 * Rex expects to receive `shared.toSend` amounts.
 * Rex doesn't check his initial balances
 *
 * @param {import('ava').ExecutionContext} t
 * @param {{ wallet: import('./wallet-tools.js').MockWallet, }} mine
 * @param {{ toSend: AmountKeywordRecord }} shared
 */
export const receiverRex = async (t, { wallet }, { toSend }) => {
  const purseUpdates = await allValues(
    mapValues(toSend, amt => E(wallet.peek).purseUpdates(amt.brand)),
  );

  const initial = await allValues(
    mapValues(purseUpdates, up =>
      E(up)
        .next()
        .then(u => u.value),
    ),
  );

  const done = await trackDeposits(t, initial, purseUpdates, toSend);

  t.log('Rex got balance updates', keys(done));
  t.deepEqual(keys(done), keys(toSend));
};

export const senderContract = async (
  t,
  { zoe, terms: { postalService: instance, destAddr: addr1 } },
) => {
  const iIssuer = await E(zoe).getInvitationIssuer();
  const iBrand = await E(iIssuer).getBrand();
  const postalService = E(zoe).getPublicFacet(instance);
  const purse = await E(iIssuer).makeEmptyPurse();

  const noInvitations = AmountMath.make(iBrand, harden([]));
  const pmt1 = await E(purse).withdraw(noInvitations);

  t.log(
    'senderContract: E(',
    getInterfaceOf(await postalService),
    ').sendTo(',
    addr1,
    ',',
    noInvitations,
    ')',
  );
  const sent = await E(postalService).sendTo(addr1, pmt1);
  t.deepEqual(sent, noInvitations);
};
