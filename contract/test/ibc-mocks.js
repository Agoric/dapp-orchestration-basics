import {
  QueryBalanceRequest,
  QueryBalanceResponse,
} from '@agoric/cosmic-proto/cosmos/bank/v1beta1/query.js';
import {
  MsgBeginRedelegate,
  MsgBeginRedelegateResponse,
  MsgDelegate,
  MsgDelegateResponse,
  MsgUndelegate,
  MsgUndelegateResponse,
} from '@agoric/cosmic-proto/cosmos/staking/v1beta1/tx.js';
import {
  MsgWithdrawDelegatorReward,
  MsgWithdrawDelegatorRewardResponse,
} from '@agoric/cosmic-proto/cosmos/distribution/v1beta1/tx.js';
// import type { Timestamp } from '@agoric/cosmic-proto/google/protobuf/timestamp.js';
import {
  buildMsgResponseString,
  buildQueryResponseString,
  buildMsgErrorString,
  buildTxPacketString,
  buildQueryPacketString,
} from './ibc-mocks-dep.js';

/**
 * TODO: provide mappings to cosmos error codes (and module specific error codes)
 * see https://github.com/Agoric/agoric-sdk/issues/9629 for more details about
 * error messages over ibc
 */
export const errorAcknowledgments = {
  error5: buildMsgErrorString(
    'ABCI code: 5: error handling packet: see events for details',
  ),
};

const delegation = {
  amount: {
    denom: 'uatom',
    amount: '10',
  },
  delegatorAddress: 'cosmos1test',
  validatorAddress: 'cosmosvaloper1test',
};
const redelegation = {
  delegatorAddress: 'cosmos1test',
  validatorSrcAddress: 'cosmosvaloper1test',
  validatorDstAddress: 'cosmosvaloper2test',
  amount: {
    denom: 'uatom',
    amount: '10',
  },
};

export const UNBOND_PERIOD_SECONDS = 5n;

const getUnbondingTime = () => ({
  seconds: UNBOND_PERIOD_SECONDS,
  nanos: 0,
});

export const protoMsgMocks = {
  delegate: {
    msg: buildTxPacketString([MsgDelegate.toProtoMsg(delegation)]),
    ack: buildMsgResponseString(MsgDelegateResponse, {}),
  },
  undelegate: {
    msg: buildTxPacketString([MsgUndelegate.toProtoMsg(delegation)]),
    ack: buildMsgResponseString(MsgUndelegateResponse, {
      completionTime: getUnbondingTime(),
    }),
  },
  redelegate: {
    msg: buildTxPacketString([MsgBeginRedelegate.toProtoMsg(redelegation)]),
    ack: buildMsgResponseString(MsgBeginRedelegateResponse, {
      completionTime: getUnbondingTime(),
    }),
  },
  withdrawReward: {
    msg: buildTxPacketString([
      MsgWithdrawDelegatorReward.toProtoMsg(delegation),
    ]),
    ack: buildMsgResponseString(MsgWithdrawDelegatorRewardResponse, {
      amount: [{ amount: '1', denom: 'uatom' }],
    }),
  },
  queryBalance: {
    msg: buildQueryPacketString([
      QueryBalanceRequest.toProtoMsg({
        address: 'cosmos1test',
        denom: 'uatom',
      }),
    ]),
    ack: buildQueryResponseString(QueryBalanceResponse, {
      balance: { amount: '0', denom: 'uatom' },
    }),
  },
};

export function createMockAckMap(mockMap) {
  const res = Object.values(mockMap).reduce((acc, { msg, ack }) => {
    acc[msg] = ack;
    return acc;
  }, {});
  return res;
}

export const defaultMockAckMap = createMockAckMap(protoMsgMocks);
