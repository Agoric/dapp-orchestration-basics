//@ts-nocheck
import { Coin, type CoinSDKType } from "../../../cosmos/base/v1beta1/coin.js";
import { BinaryReader, BinaryWriter } from "../../../binary.js";
import { isSet, Decimal } from "../../../helpers.js";
import {type JsonSafe } from "../../../json-safe.js";
/**
 * MsgCreatePool defines an sdk.Msg type that supports submitting a create
 * liquidity pool tx.
 * 
 * See:
 * https://github.com/gravity-devs/liquidity/blob/develop/x/liquidity/spec/04_messages.md
 */
export interface MsgCreatePool {
  poolCreatorAddress: string;
  /**
   * id of the target pool type, must match the value in the pool. Only
   * pool-type-id 1 is supported.
   */
  poolTypeId: number;
  /** reserve coin pair of the pool to deposit. */
  depositCoins: Coin[];
}
export interface MsgCreatePoolProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.MsgCreatePool";
  value: Uint8Array;
}
/**
 * MsgCreatePool defines an sdk.Msg type that supports submitting a create
 * liquidity pool tx.
 * 
 * See:
 * https://github.com/gravity-devs/liquidity/blob/develop/x/liquidity/spec/04_messages.md
 */
export interface MsgCreatePoolSDKType {
  pool_creator_address: string;
  pool_type_id: number;
  deposit_coins: CoinSDKType[];
}
/** MsgCreatePoolResponse defines the Msg/CreatePool response type. */
export interface MsgCreatePoolResponse {}
export interface MsgCreatePoolResponseProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.MsgCreatePoolResponse";
  value: Uint8Array;
}
/** MsgCreatePoolResponse defines the Msg/CreatePool response type. */
export interface MsgCreatePoolResponseSDKType {}
/**
 * `MsgDepositWithinBatch defines` an `sdk.Msg` type that supports submitting
 * a deposit request to the batch of the liquidity pool.
 * Deposit is submitted to the batch of the Liquidity pool with the specified
 * `pool_id`, `deposit_coins` for reserve.
 * This request is stacked in the batch of the liquidity pool, is not processed
 * immediately, and is processed in the `endblock` at the same time as other
 * requests.
 * 
 * See:
 * https://github.com/gravity-devs/liquidity/blob/develop/x/liquidity/spec/04_messages.md
 */
export interface MsgDepositWithinBatch {
  depositorAddress: string;
  /** id of the target pool */
  poolId: bigint;
  /** reserve coin pair of the pool to deposit */
  depositCoins: Coin[];
}
export interface MsgDepositWithinBatchProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.MsgDepositWithinBatch";
  value: Uint8Array;
}
/**
 * `MsgDepositWithinBatch defines` an `sdk.Msg` type that supports submitting
 * a deposit request to the batch of the liquidity pool.
 * Deposit is submitted to the batch of the Liquidity pool with the specified
 * `pool_id`, `deposit_coins` for reserve.
 * This request is stacked in the batch of the liquidity pool, is not processed
 * immediately, and is processed in the `endblock` at the same time as other
 * requests.
 * 
 * See:
 * https://github.com/gravity-devs/liquidity/blob/develop/x/liquidity/spec/04_messages.md
 */
export interface MsgDepositWithinBatchSDKType {
  depositor_address: string;
  pool_id: bigint;
  deposit_coins: CoinSDKType[];
}
/**
 * MsgDepositWithinBatchResponse defines the Msg/DepositWithinBatch response
 * type.
 */
export interface MsgDepositWithinBatchResponse {}
export interface MsgDepositWithinBatchResponseProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.MsgDepositWithinBatchResponse";
  value: Uint8Array;
}
/**
 * MsgDepositWithinBatchResponse defines the Msg/DepositWithinBatch response
 * type.
 */
export interface MsgDepositWithinBatchResponseSDKType {}
/**
 * `MsgWithdrawWithinBatch` defines an `sdk.Msg` type that supports submitting
 * a withdraw request to the batch of the liquidity pool.
 * Withdraw is submitted to the batch from the Liquidity pool with the
 * specified `pool_id`, `pool_coin` of the pool.
 * This request is stacked in the batch of the liquidity pool, is not processed
 * immediately, and is processed in the `endblock` at the same time as other
 * requests.
 * 
 * See:
 * https://github.com/gravity-devs/liquidity/blob/develop/x/liquidity/spec/04_messages.md
 */
export interface MsgWithdrawWithinBatch {
  withdrawerAddress: string;
  /** id of the target pool */
  poolId: bigint;
  poolCoin: Coin;
}
export interface MsgWithdrawWithinBatchProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.MsgWithdrawWithinBatch";
  value: Uint8Array;
}
/**
 * `MsgWithdrawWithinBatch` defines an `sdk.Msg` type that supports submitting
 * a withdraw request to the batch of the liquidity pool.
 * Withdraw is submitted to the batch from the Liquidity pool with the
 * specified `pool_id`, `pool_coin` of the pool.
 * This request is stacked in the batch of the liquidity pool, is not processed
 * immediately, and is processed in the `endblock` at the same time as other
 * requests.
 * 
 * See:
 * https://github.com/gravity-devs/liquidity/blob/develop/x/liquidity/spec/04_messages.md
 */
export interface MsgWithdrawWithinBatchSDKType {
  withdrawer_address: string;
  pool_id: bigint;
  pool_coin: CoinSDKType;
}
/**
 * MsgWithdrawWithinBatchResponse defines the Msg/WithdrawWithinBatch response
 * type.
 */
export interface MsgWithdrawWithinBatchResponse {}
export interface MsgWithdrawWithinBatchResponseProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.MsgWithdrawWithinBatchResponse";
  value: Uint8Array;
}
/**
 * MsgWithdrawWithinBatchResponse defines the Msg/WithdrawWithinBatch response
 * type.
 */
export interface MsgWithdrawWithinBatchResponseSDKType {}
/**
 * `MsgSwapWithinBatch` defines an sdk.Msg type that supports submitting a swap
 * offer request to the batch of the liquidity pool. Submit swap offer to the
 * liquidity pool batch with the specified the `pool_id`, `swap_type_id`,
 * `demand_coin_denom` with the coin and the price you're offering
 * and `offer_coin_fee` must be half of offer coin amount * current
 * `params.swap_fee_rate` and ceil for reservation to pay fees. This request is
 * stacked in the batch of the liquidity pool, is not processed immediately, and
 * is processed in the `endblock` at the same time as other requests. You must
 * request the same fields as the pool. Only the default `swap_type_id` 1 is
 * supported.
 * 
 * See: https://github.com/gravity-devs/liquidity/tree/develop/doc
 * https://github.com/gravity-devs/liquidity/blob/develop/x/liquidity/spec/04_messages.md
 */
export interface MsgSwapWithinBatch {
  /** address of swap requester */
  swapRequesterAddress: string;
  /**
   * id of swap type, must match the value in the pool. Only `swap_type_id` 1 is
   * supported.
   */
  poolId: bigint;
  /** id of swap type. Must match the value in the pool. */
  swapTypeId: number;
  /** offer sdk.coin for the swap request, must match the denom in the pool. */
  offerCoin: Coin;
  /**
   * denom of demand coin to be exchanged on the swap request, must match the
   * denom in the pool.
   */
  demandCoinDenom: string;
  /**
   * half of offer coin amount * params.swap_fee_rate and ceil for reservation
   * to pay fees.
   */
  offerCoinFee: Coin;
  /**
   * limit order price for the order, the price is the exchange ratio of X/Y
   * where X is the amount of the first coin and Y is the amount
   * of the second coin when their denoms are sorted alphabetically.
   */
  orderPrice: string;
}
export interface MsgSwapWithinBatchProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.MsgSwapWithinBatch";
  value: Uint8Array;
}
/**
 * `MsgSwapWithinBatch` defines an sdk.Msg type that supports submitting a swap
 * offer request to the batch of the liquidity pool. Submit swap offer to the
 * liquidity pool batch with the specified the `pool_id`, `swap_type_id`,
 * `demand_coin_denom` with the coin and the price you're offering
 * and `offer_coin_fee` must be half of offer coin amount * current
 * `params.swap_fee_rate` and ceil for reservation to pay fees. This request is
 * stacked in the batch of the liquidity pool, is not processed immediately, and
 * is processed in the `endblock` at the same time as other requests. You must
 * request the same fields as the pool. Only the default `swap_type_id` 1 is
 * supported.
 * 
 * See: https://github.com/gravity-devs/liquidity/tree/develop/doc
 * https://github.com/gravity-devs/liquidity/blob/develop/x/liquidity/spec/04_messages.md
 */
export interface MsgSwapWithinBatchSDKType {
  swap_requester_address: string;
  pool_id: bigint;
  swap_type_id: number;
  offer_coin: CoinSDKType;
  demand_coin_denom: string;
  offer_coin_fee: CoinSDKType;
  order_price: string;
}
/** MsgSwapWithinBatchResponse defines the Msg/Swap response type. */
export interface MsgSwapWithinBatchResponse {}
export interface MsgSwapWithinBatchResponseProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.MsgSwapWithinBatchResponse";
  value: Uint8Array;
}
/** MsgSwapWithinBatchResponse defines the Msg/Swap response type. */
export interface MsgSwapWithinBatchResponseSDKType {}
function createBaseMsgCreatePool(): MsgCreatePool {
  return {
    poolCreatorAddress: "",
    poolTypeId: 0,
    depositCoins: []
  };
}
export const MsgCreatePool = {
  typeUrl: "/cyber.liquidity.v1beta1.MsgCreatePool",
  encode(message: MsgCreatePool, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.poolCreatorAddress !== "") {
      writer.uint32(10).string(message.poolCreatorAddress);
    }
    if (message.poolTypeId !== 0) {
      writer.uint32(16).uint32(message.poolTypeId);
    }
    for (const v of message.depositCoins) {
      Coin.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgCreatePool {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreatePool();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poolCreatorAddress = reader.string();
          break;
        case 2:
          message.poolTypeId = reader.uint32();
          break;
        case 4:
          message.depositCoins.push(Coin.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgCreatePool {
    return {
      poolCreatorAddress: isSet(object.poolCreatorAddress) ? String(object.poolCreatorAddress) : "",
      poolTypeId: isSet(object.poolTypeId) ? Number(object.poolTypeId) : 0,
      depositCoins: Array.isArray(object?.depositCoins) ? object.depositCoins.map((e: any) => Coin.fromJSON(e)) : []
    };
  },
  toJSON(message: MsgCreatePool): JsonSafe<MsgCreatePool> {
    const obj: any = {};
    message.poolCreatorAddress !== undefined && (obj.poolCreatorAddress = message.poolCreatorAddress);
    message.poolTypeId !== undefined && (obj.poolTypeId = Math.round(message.poolTypeId));
    if (message.depositCoins) {
      obj.depositCoins = message.depositCoins.map(e => e ? Coin.toJSON(e) : undefined);
    } else {
      obj.depositCoins = [];
    }
    return obj;
  },
  fromPartial(object: Partial<MsgCreatePool>): MsgCreatePool {
    const message = createBaseMsgCreatePool();
    message.poolCreatorAddress = object.poolCreatorAddress ?? "";
    message.poolTypeId = object.poolTypeId ?? 0;
    message.depositCoins = object.depositCoins?.map(e => Coin.fromPartial(e)) || [];
    return message;
  },
  fromProtoMsg(message: MsgCreatePoolProtoMsg): MsgCreatePool {
    return MsgCreatePool.decode(message.value);
  },
  toProto(message: MsgCreatePool): Uint8Array {
    return MsgCreatePool.encode(message).finish();
  },
  toProtoMsg(message: MsgCreatePool): MsgCreatePoolProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.MsgCreatePool",
      value: MsgCreatePool.encode(message).finish()
    };
  }
};
function createBaseMsgCreatePoolResponse(): MsgCreatePoolResponse {
  return {};
}
export const MsgCreatePoolResponse = {
  typeUrl: "/cyber.liquidity.v1beta1.MsgCreatePoolResponse",
  encode(_: MsgCreatePoolResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgCreatePoolResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreatePoolResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(_: any): MsgCreatePoolResponse {
    return {};
  },
  toJSON(_: MsgCreatePoolResponse): JsonSafe<MsgCreatePoolResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgCreatePoolResponse>): MsgCreatePoolResponse {
    const message = createBaseMsgCreatePoolResponse();
    return message;
  },
  fromProtoMsg(message: MsgCreatePoolResponseProtoMsg): MsgCreatePoolResponse {
    return MsgCreatePoolResponse.decode(message.value);
  },
  toProto(message: MsgCreatePoolResponse): Uint8Array {
    return MsgCreatePoolResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgCreatePoolResponse): MsgCreatePoolResponseProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.MsgCreatePoolResponse",
      value: MsgCreatePoolResponse.encode(message).finish()
    };
  }
};
function createBaseMsgDepositWithinBatch(): MsgDepositWithinBatch {
  return {
    depositorAddress: "",
    poolId: BigInt(0),
    depositCoins: []
  };
}
export const MsgDepositWithinBatch = {
  typeUrl: "/cyber.liquidity.v1beta1.MsgDepositWithinBatch",
  encode(message: MsgDepositWithinBatch, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.depositorAddress !== "") {
      writer.uint32(10).string(message.depositorAddress);
    }
    if (message.poolId !== BigInt(0)) {
      writer.uint32(16).uint64(message.poolId);
    }
    for (const v of message.depositCoins) {
      Coin.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgDepositWithinBatch {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDepositWithinBatch();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.depositorAddress = reader.string();
          break;
        case 2:
          message.poolId = reader.uint64();
          break;
        case 3:
          message.depositCoins.push(Coin.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgDepositWithinBatch {
    return {
      depositorAddress: isSet(object.depositorAddress) ? String(object.depositorAddress) : "",
      poolId: isSet(object.poolId) ? BigInt(object.poolId.toString()) : BigInt(0),
      depositCoins: Array.isArray(object?.depositCoins) ? object.depositCoins.map((e: any) => Coin.fromJSON(e)) : []
    };
  },
  toJSON(message: MsgDepositWithinBatch): JsonSafe<MsgDepositWithinBatch> {
    const obj: any = {};
    message.depositorAddress !== undefined && (obj.depositorAddress = message.depositorAddress);
    message.poolId !== undefined && (obj.poolId = (message.poolId || BigInt(0)).toString());
    if (message.depositCoins) {
      obj.depositCoins = message.depositCoins.map(e => e ? Coin.toJSON(e) : undefined);
    } else {
      obj.depositCoins = [];
    }
    return obj;
  },
  fromPartial(object: Partial<MsgDepositWithinBatch>): MsgDepositWithinBatch {
    const message = createBaseMsgDepositWithinBatch();
    message.depositorAddress = object.depositorAddress ?? "";
    message.poolId = object.poolId !== undefined && object.poolId !== null ? BigInt(object.poolId.toString()) : BigInt(0);
    message.depositCoins = object.depositCoins?.map(e => Coin.fromPartial(e)) || [];
    return message;
  },
  fromProtoMsg(message: MsgDepositWithinBatchProtoMsg): MsgDepositWithinBatch {
    return MsgDepositWithinBatch.decode(message.value);
  },
  toProto(message: MsgDepositWithinBatch): Uint8Array {
    return MsgDepositWithinBatch.encode(message).finish();
  },
  toProtoMsg(message: MsgDepositWithinBatch): MsgDepositWithinBatchProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.MsgDepositWithinBatch",
      value: MsgDepositWithinBatch.encode(message).finish()
    };
  }
};
function createBaseMsgDepositWithinBatchResponse(): MsgDepositWithinBatchResponse {
  return {};
}
export const MsgDepositWithinBatchResponse = {
  typeUrl: "/cyber.liquidity.v1beta1.MsgDepositWithinBatchResponse",
  encode(_: MsgDepositWithinBatchResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgDepositWithinBatchResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDepositWithinBatchResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(_: any): MsgDepositWithinBatchResponse {
    return {};
  },
  toJSON(_: MsgDepositWithinBatchResponse): JsonSafe<MsgDepositWithinBatchResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgDepositWithinBatchResponse>): MsgDepositWithinBatchResponse {
    const message = createBaseMsgDepositWithinBatchResponse();
    return message;
  },
  fromProtoMsg(message: MsgDepositWithinBatchResponseProtoMsg): MsgDepositWithinBatchResponse {
    return MsgDepositWithinBatchResponse.decode(message.value);
  },
  toProto(message: MsgDepositWithinBatchResponse): Uint8Array {
    return MsgDepositWithinBatchResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgDepositWithinBatchResponse): MsgDepositWithinBatchResponseProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.MsgDepositWithinBatchResponse",
      value: MsgDepositWithinBatchResponse.encode(message).finish()
    };
  }
};
function createBaseMsgWithdrawWithinBatch(): MsgWithdrawWithinBatch {
  return {
    withdrawerAddress: "",
    poolId: BigInt(0),
    poolCoin: Coin.fromPartial({})
  };
}
export const MsgWithdrawWithinBatch = {
  typeUrl: "/cyber.liquidity.v1beta1.MsgWithdrawWithinBatch",
  encode(message: MsgWithdrawWithinBatch, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.withdrawerAddress !== "") {
      writer.uint32(10).string(message.withdrawerAddress);
    }
    if (message.poolId !== BigInt(0)) {
      writer.uint32(16).uint64(message.poolId);
    }
    if (message.poolCoin !== undefined) {
      Coin.encode(message.poolCoin, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgWithdrawWithinBatch {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgWithdrawWithinBatch();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.withdrawerAddress = reader.string();
          break;
        case 2:
          message.poolId = reader.uint64();
          break;
        case 3:
          message.poolCoin = Coin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgWithdrawWithinBatch {
    return {
      withdrawerAddress: isSet(object.withdrawerAddress) ? String(object.withdrawerAddress) : "",
      poolId: isSet(object.poolId) ? BigInt(object.poolId.toString()) : BigInt(0),
      poolCoin: isSet(object.poolCoin) ? Coin.fromJSON(object.poolCoin) : undefined
    };
  },
  toJSON(message: MsgWithdrawWithinBatch): JsonSafe<MsgWithdrawWithinBatch> {
    const obj: any = {};
    message.withdrawerAddress !== undefined && (obj.withdrawerAddress = message.withdrawerAddress);
    message.poolId !== undefined && (obj.poolId = (message.poolId || BigInt(0)).toString());
    message.poolCoin !== undefined && (obj.poolCoin = message.poolCoin ? Coin.toJSON(message.poolCoin) : undefined);
    return obj;
  },
  fromPartial(object: Partial<MsgWithdrawWithinBatch>): MsgWithdrawWithinBatch {
    const message = createBaseMsgWithdrawWithinBatch();
    message.withdrawerAddress = object.withdrawerAddress ?? "";
    message.poolId = object.poolId !== undefined && object.poolId !== null ? BigInt(object.poolId.toString()) : BigInt(0);
    message.poolCoin = object.poolCoin !== undefined && object.poolCoin !== null ? Coin.fromPartial(object.poolCoin) : undefined;
    return message;
  },
  fromProtoMsg(message: MsgWithdrawWithinBatchProtoMsg): MsgWithdrawWithinBatch {
    return MsgWithdrawWithinBatch.decode(message.value);
  },
  toProto(message: MsgWithdrawWithinBatch): Uint8Array {
    return MsgWithdrawWithinBatch.encode(message).finish();
  },
  toProtoMsg(message: MsgWithdrawWithinBatch): MsgWithdrawWithinBatchProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.MsgWithdrawWithinBatch",
      value: MsgWithdrawWithinBatch.encode(message).finish()
    };
  }
};
function createBaseMsgWithdrawWithinBatchResponse(): MsgWithdrawWithinBatchResponse {
  return {};
}
export const MsgWithdrawWithinBatchResponse = {
  typeUrl: "/cyber.liquidity.v1beta1.MsgWithdrawWithinBatchResponse",
  encode(_: MsgWithdrawWithinBatchResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgWithdrawWithinBatchResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgWithdrawWithinBatchResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(_: any): MsgWithdrawWithinBatchResponse {
    return {};
  },
  toJSON(_: MsgWithdrawWithinBatchResponse): JsonSafe<MsgWithdrawWithinBatchResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgWithdrawWithinBatchResponse>): MsgWithdrawWithinBatchResponse {
    const message = createBaseMsgWithdrawWithinBatchResponse();
    return message;
  },
  fromProtoMsg(message: MsgWithdrawWithinBatchResponseProtoMsg): MsgWithdrawWithinBatchResponse {
    return MsgWithdrawWithinBatchResponse.decode(message.value);
  },
  toProto(message: MsgWithdrawWithinBatchResponse): Uint8Array {
    return MsgWithdrawWithinBatchResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgWithdrawWithinBatchResponse): MsgWithdrawWithinBatchResponseProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.MsgWithdrawWithinBatchResponse",
      value: MsgWithdrawWithinBatchResponse.encode(message).finish()
    };
  }
};
function createBaseMsgSwapWithinBatch(): MsgSwapWithinBatch {
  return {
    swapRequesterAddress: "",
    poolId: BigInt(0),
    swapTypeId: 0,
    offerCoin: Coin.fromPartial({}),
    demandCoinDenom: "",
    offerCoinFee: Coin.fromPartial({}),
    orderPrice: ""
  };
}
export const MsgSwapWithinBatch = {
  typeUrl: "/cyber.liquidity.v1beta1.MsgSwapWithinBatch",
  encode(message: MsgSwapWithinBatch, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.swapRequesterAddress !== "") {
      writer.uint32(10).string(message.swapRequesterAddress);
    }
    if (message.poolId !== BigInt(0)) {
      writer.uint32(16).uint64(message.poolId);
    }
    if (message.swapTypeId !== 0) {
      writer.uint32(24).uint32(message.swapTypeId);
    }
    if (message.offerCoin !== undefined) {
      Coin.encode(message.offerCoin, writer.uint32(34).fork()).ldelim();
    }
    if (message.demandCoinDenom !== "") {
      writer.uint32(42).string(message.demandCoinDenom);
    }
    if (message.offerCoinFee !== undefined) {
      Coin.encode(message.offerCoinFee, writer.uint32(50).fork()).ldelim();
    }
    if (message.orderPrice !== "") {
      writer.uint32(58).string(Decimal.fromUserInput(message.orderPrice, 18).atomics);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSwapWithinBatch {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSwapWithinBatch();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.swapRequesterAddress = reader.string();
          break;
        case 2:
          message.poolId = reader.uint64();
          break;
        case 3:
          message.swapTypeId = reader.uint32();
          break;
        case 4:
          message.offerCoin = Coin.decode(reader, reader.uint32());
          break;
        case 5:
          message.demandCoinDenom = reader.string();
          break;
        case 6:
          message.offerCoinFee = Coin.decode(reader, reader.uint32());
          break;
        case 7:
          message.orderPrice = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgSwapWithinBatch {
    return {
      swapRequesterAddress: isSet(object.swapRequesterAddress) ? String(object.swapRequesterAddress) : "",
      poolId: isSet(object.poolId) ? BigInt(object.poolId.toString()) : BigInt(0),
      swapTypeId: isSet(object.swapTypeId) ? Number(object.swapTypeId) : 0,
      offerCoin: isSet(object.offerCoin) ? Coin.fromJSON(object.offerCoin) : undefined,
      demandCoinDenom: isSet(object.demandCoinDenom) ? String(object.demandCoinDenom) : "",
      offerCoinFee: isSet(object.offerCoinFee) ? Coin.fromJSON(object.offerCoinFee) : undefined,
      orderPrice: isSet(object.orderPrice) ? String(object.orderPrice) : ""
    };
  },
  toJSON(message: MsgSwapWithinBatch): JsonSafe<MsgSwapWithinBatch> {
    const obj: any = {};
    message.swapRequesterAddress !== undefined && (obj.swapRequesterAddress = message.swapRequesterAddress);
    message.poolId !== undefined && (obj.poolId = (message.poolId || BigInt(0)).toString());
    message.swapTypeId !== undefined && (obj.swapTypeId = Math.round(message.swapTypeId));
    message.offerCoin !== undefined && (obj.offerCoin = message.offerCoin ? Coin.toJSON(message.offerCoin) : undefined);
    message.demandCoinDenom !== undefined && (obj.demandCoinDenom = message.demandCoinDenom);
    message.offerCoinFee !== undefined && (obj.offerCoinFee = message.offerCoinFee ? Coin.toJSON(message.offerCoinFee) : undefined);
    message.orderPrice !== undefined && (obj.orderPrice = message.orderPrice);
    return obj;
  },
  fromPartial(object: Partial<MsgSwapWithinBatch>): MsgSwapWithinBatch {
    const message = createBaseMsgSwapWithinBatch();
    message.swapRequesterAddress = object.swapRequesterAddress ?? "";
    message.poolId = object.poolId !== undefined && object.poolId !== null ? BigInt(object.poolId.toString()) : BigInt(0);
    message.swapTypeId = object.swapTypeId ?? 0;
    message.offerCoin = object.offerCoin !== undefined && object.offerCoin !== null ? Coin.fromPartial(object.offerCoin) : undefined;
    message.demandCoinDenom = object.demandCoinDenom ?? "";
    message.offerCoinFee = object.offerCoinFee !== undefined && object.offerCoinFee !== null ? Coin.fromPartial(object.offerCoinFee) : undefined;
    message.orderPrice = object.orderPrice ?? "";
    return message;
  },
  fromProtoMsg(message: MsgSwapWithinBatchProtoMsg): MsgSwapWithinBatch {
    return MsgSwapWithinBatch.decode(message.value);
  },
  toProto(message: MsgSwapWithinBatch): Uint8Array {
    return MsgSwapWithinBatch.encode(message).finish();
  },
  toProtoMsg(message: MsgSwapWithinBatch): MsgSwapWithinBatchProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.MsgSwapWithinBatch",
      value: MsgSwapWithinBatch.encode(message).finish()
    };
  }
};
function createBaseMsgSwapWithinBatchResponse(): MsgSwapWithinBatchResponse {
  return {};
}
export const MsgSwapWithinBatchResponse = {
  typeUrl: "/cyber.liquidity.v1beta1.MsgSwapWithinBatchResponse",
  encode(_: MsgSwapWithinBatchResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSwapWithinBatchResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSwapWithinBatchResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(_: any): MsgSwapWithinBatchResponse {
    return {};
  },
  toJSON(_: MsgSwapWithinBatchResponse): JsonSafe<MsgSwapWithinBatchResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgSwapWithinBatchResponse>): MsgSwapWithinBatchResponse {
    const message = createBaseMsgSwapWithinBatchResponse();
    return message;
  },
  fromProtoMsg(message: MsgSwapWithinBatchResponseProtoMsg): MsgSwapWithinBatchResponse {
    return MsgSwapWithinBatchResponse.decode(message.value);
  },
  toProto(message: MsgSwapWithinBatchResponse): Uint8Array {
    return MsgSwapWithinBatchResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgSwapWithinBatchResponse): MsgSwapWithinBatchResponseProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.MsgSwapWithinBatchResponse",
      value: MsgSwapWithinBatchResponse.encode(message).finish()
    };
  }
};