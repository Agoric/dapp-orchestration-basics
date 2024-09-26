import { Any } from '@agoric/cosmic-proto/google/protobuf/any.js';
import { CosmosResponse } from '@agoric/cosmic-proto/icq/v1/packet.js';
// import {
//   RequestQuery,
//   ResponseQuery,
// } from '@agoric/cosmic-proto/tendermint/abci/types.js';
import { encodeBase64, btoa } from '@endo/base64';
import { toRequestQueryJson } from '@agoric/cosmic-proto';
// import { IBCChannelID, VTransferIBCEvent, type IBCPacket } from '@agoric/vats';
import { VTRANSFER_IBC_EVENT } from '@agoric/internal/src/action-types.js';
import { FungibleTokenPacketData } from '@agoric/cosmic-proto/ibc/applications/transfer/v2/packet.js';
// import type { PacketSDKType } from '@agoric/cosmic-proto/ibc/core/channel/v1/channel.js';
import { LOCALCHAIN_DEFAULT_ADDRESS } from '@agoric/vats/tools/fake-bridge.js';
import {
  makeQueryPacket,
  makeTxPacket,
} from '@agoric/orchestration/src/utils/packet.js';
// import { ChainAddress } from '@agoric/orchestration/src/orchestration-api.js';

// interface EncoderI<T> {
//   encode: (message: T) => {
//     finish: () => Uint8Array;
//   };
//   fromPartial: (partial: Partial<T>) => T;
//   typeUrl: string;
// }

const toPacket = obj => btoa(JSON.stringify(obj));

/**
 * Build a response "packet bytes string" we'd expect to see from a Msg
 * Response
 *
 * XXX support multiple responses in a single message
 *
 * @param Encoder
 * @param message
 */
export function buildMsgResponseString(Encoder, message) {
  const encodedMsg = Encoder.encode(Encoder.fromPartial(message)).finish();

  // cosmos-sdk double Any encodes
  const encodedAny = Any.encode(
    Any.fromPartial({
      value: Any.encode(
        Any.fromPartial({
          typeUrl: Encoder.typeUrl,
          value: encodedMsg,
        }),
      ).finish(),
    }),
  ).finish();

  return toPacket({
    result: encodeBase64(encodedAny),
  });
}

/**
 * Build an example error packet for a failed Tx Msg
 * @param msg
 */
export function buildMsgErrorString(
  msg = 'ABCI code: 5: error handling packet: see events for details',
) {
  return toPacket({
    error: msg,
  });
}

/**
 * Build a response "packet bytes string" we'd expect to see from a Query
 * request
 *
 * XXX accept multiple queries at once
 *
 * @param Encoder
 * @param query
 * @param opts
 */
export function buildQueryResponseString(
  Encoder,
  query,
  opts = {
    value: new Uint8Array(),
    height: 0n,
    index: 0n,
    code: 0,
    log: '',
    info: '',
    codespace: '',
  },
) {
  const encodedResp = CosmosResponse.encode(
    CosmosResponse.fromPartial({
      responses: [
        {
          key: Encoder.encode(Encoder.fromPartial(query)).finish(),
          ...opts,
        },
      ],
    }),
  ).finish();

  return toPacket({
    result: toPacket({ data: encodeBase64(encodedResp) }),
  });
}

/**
 * Build a tx packet string for the mocked dibc bridge handler
 * @param {Array<{
 *  value: Uint8Array,
 *  typeUrl: string
 * }>} msgs
 *
 * @returns {string}
 */
export function buildTxPacketString(msgs) {
  return btoa(makeTxPacket(msgs.map(Any.toJSON)));
}

/**
 * Build a query packet string for the mocked dibc bridge handler
 * @param {Array} msgs
 * @param opts
 * @returns {string}
 */
export function buildQueryPacketString(msgs, opts = {}) {
  return btoa(makeQueryPacket(msgs.map(msg => toRequestQueryJson(msg, opts))));
}

/**
 * `buildVTransferEvent` can be used with `transferBridge` to simulate incoming
 * and outgoing IBC fungible tokens transfers to a LocalChain account.
 *
 * It defaults to simulating incoming transfers. To simulate an outgoing one,
 * ensure `sender=agoric1fakeLCAAddress` and  this after LocalChainBridge
 * receives the outgoing MsgTransfer,
 *
 * @example
 * ```js
 * const { mocks: { transferBridge } = await commonSetup(t);
 * await E(transferBridge).fromBridge(
 *  buildVTransferEvent({
 *    receiver: 'agoric1fakeLCAAddress',
 *    amount: 10n,
 *    denom: 'uatom',
 *  }),
 * );
 * ```
 *
 * XXX integrate vlocalchain and vtransfer ScopedBridgeManagers
 * in test supports.
 */
export const buildVTransferEvent = ({
  event = 'acknowledgementPacket',
  sender = 'cosmos1AccAddress',
  receiver = LOCALCHAIN_DEFAULT_ADDRESS,
  target = LOCALCHAIN_DEFAULT_ADDRESS,
  amount = 10n,
  denom = 'uatom',
  destinationChannel = 'channel-0',
  sourceChannel = 'channel-405',
  sequence = 0n,
} = {}) => ({
  type: VTRANSFER_IBC_EVENT,
  blockHeight: 0,
  blockTime: 0,
  event,
  acknowledgement: btoa(JSON.stringify({ result: 'AQ==' })),
  relayer: 'agoric123',
  target,
  packet: {
    data: btoa(
      JSON.stringify(
        FungibleTokenPacketData.fromPartial({
          amount: String(amount),
          denom,
          sender,
          receiver,
        }),
      ),
    ),
    destination_channel: destinationChannel,
    source_channel: sourceChannel,
    destination_port: 'transfer',
    source_port: 'transfer',
    sequence,
  },
});
