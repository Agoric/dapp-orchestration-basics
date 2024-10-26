//@ts-nocheck
import { Pool, type PoolSDKType, PoolMetadata, type PoolMetadataSDKType, PoolBatch, type PoolBatchSDKType, DepositMsgState, type DepositMsgStateSDKType, WithdrawMsgState, type WithdrawMsgStateSDKType, SwapMsgState, type SwapMsgStateSDKType, Params, type ParamsSDKType } from "./liquidity.js";
import { BinaryReader, BinaryWriter } from "../../../binary.js";
import { isSet } from "../../../helpers.js";
import {type JsonSafe } from "../../../json-safe.js";
/**
 * records the state of each pool after genesis export or import, used to check
 * variables
 */
export interface PoolRecord {
  pool: Pool;
  poolMetadata: PoolMetadata;
  poolBatch: PoolBatch;
  depositMsgStates: DepositMsgState[];
  withdrawMsgStates: WithdrawMsgState[];
  swapMsgStates: SwapMsgState[];
}
export interface PoolRecordProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.PoolRecord";
  value: Uint8Array;
}
/**
 * records the state of each pool after genesis export or import, used to check
 * variables
 */
export interface PoolRecordSDKType {
  pool: PoolSDKType;
  pool_metadata: PoolMetadataSDKType;
  pool_batch: PoolBatchSDKType;
  deposit_msg_states: DepositMsgStateSDKType[];
  withdraw_msg_states: WithdrawMsgStateSDKType[];
  swap_msg_states: SwapMsgStateSDKType[];
}
/** GenesisState defines the liquidity module's genesis state. */
export interface GenesisState {
  /** params defines all the parameters for the liquidity module. */
  params: Params;
  poolRecords: PoolRecord[];
}
export interface GenesisStateProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.GenesisState";
  value: Uint8Array;
}
/** GenesisState defines the liquidity module's genesis state. */
export interface GenesisStateSDKType {
  params: ParamsSDKType;
  pool_records: PoolRecordSDKType[];
}
function createBasePoolRecord(): PoolRecord {
  return {
    pool: Pool.fromPartial({}),
    poolMetadata: PoolMetadata.fromPartial({}),
    poolBatch: PoolBatch.fromPartial({}),
    depositMsgStates: [],
    withdrawMsgStates: [],
    swapMsgStates: []
  };
}
export const PoolRecord = {
  typeUrl: "/cyber.liquidity.v1beta1.PoolRecord",
  encode(message: PoolRecord, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.pool !== undefined) {
      Pool.encode(message.pool, writer.uint32(10).fork()).ldelim();
    }
    if (message.poolMetadata !== undefined) {
      PoolMetadata.encode(message.poolMetadata, writer.uint32(18).fork()).ldelim();
    }
    if (message.poolBatch !== undefined) {
      PoolBatch.encode(message.poolBatch, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.depositMsgStates) {
      DepositMsgState.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    for (const v of message.withdrawMsgStates) {
      WithdrawMsgState.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    for (const v of message.swapMsgStates) {
      SwapMsgState.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): PoolRecord {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePoolRecord();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pool = Pool.decode(reader, reader.uint32());
          break;
        case 2:
          message.poolMetadata = PoolMetadata.decode(reader, reader.uint32());
          break;
        case 3:
          message.poolBatch = PoolBatch.decode(reader, reader.uint32());
          break;
        case 4:
          message.depositMsgStates.push(DepositMsgState.decode(reader, reader.uint32()));
          break;
        case 5:
          message.withdrawMsgStates.push(WithdrawMsgState.decode(reader, reader.uint32()));
          break;
        case 6:
          message.swapMsgStates.push(SwapMsgState.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): PoolRecord {
    return {
      pool: isSet(object.pool) ? Pool.fromJSON(object.pool) : undefined,
      poolMetadata: isSet(object.poolMetadata) ? PoolMetadata.fromJSON(object.poolMetadata) : undefined,
      poolBatch: isSet(object.poolBatch) ? PoolBatch.fromJSON(object.poolBatch) : undefined,
      depositMsgStates: Array.isArray(object?.depositMsgStates) ? object.depositMsgStates.map((e: any) => DepositMsgState.fromJSON(e)) : [],
      withdrawMsgStates: Array.isArray(object?.withdrawMsgStates) ? object.withdrawMsgStates.map((e: any) => WithdrawMsgState.fromJSON(e)) : [],
      swapMsgStates: Array.isArray(object?.swapMsgStates) ? object.swapMsgStates.map((e: any) => SwapMsgState.fromJSON(e)) : []
    };
  },
  toJSON(message: PoolRecord): JsonSafe<PoolRecord> {
    const obj: any = {};
    message.pool !== undefined && (obj.pool = message.pool ? Pool.toJSON(message.pool) : undefined);
    message.poolMetadata !== undefined && (obj.poolMetadata = message.poolMetadata ? PoolMetadata.toJSON(message.poolMetadata) : undefined);
    message.poolBatch !== undefined && (obj.poolBatch = message.poolBatch ? PoolBatch.toJSON(message.poolBatch) : undefined);
    if (message.depositMsgStates) {
      obj.depositMsgStates = message.depositMsgStates.map(e => e ? DepositMsgState.toJSON(e) : undefined);
    } else {
      obj.depositMsgStates = [];
    }
    if (message.withdrawMsgStates) {
      obj.withdrawMsgStates = message.withdrawMsgStates.map(e => e ? WithdrawMsgState.toJSON(e) : undefined);
    } else {
      obj.withdrawMsgStates = [];
    }
    if (message.swapMsgStates) {
      obj.swapMsgStates = message.swapMsgStates.map(e => e ? SwapMsgState.toJSON(e) : undefined);
    } else {
      obj.swapMsgStates = [];
    }
    return obj;
  },
  fromPartial(object: Partial<PoolRecord>): PoolRecord {
    const message = createBasePoolRecord();
    message.pool = object.pool !== undefined && object.pool !== null ? Pool.fromPartial(object.pool) : undefined;
    message.poolMetadata = object.poolMetadata !== undefined && object.poolMetadata !== null ? PoolMetadata.fromPartial(object.poolMetadata) : undefined;
    message.poolBatch = object.poolBatch !== undefined && object.poolBatch !== null ? PoolBatch.fromPartial(object.poolBatch) : undefined;
    message.depositMsgStates = object.depositMsgStates?.map(e => DepositMsgState.fromPartial(e)) || [];
    message.withdrawMsgStates = object.withdrawMsgStates?.map(e => WithdrawMsgState.fromPartial(e)) || [];
    message.swapMsgStates = object.swapMsgStates?.map(e => SwapMsgState.fromPartial(e)) || [];
    return message;
  },
  fromProtoMsg(message: PoolRecordProtoMsg): PoolRecord {
    return PoolRecord.decode(message.value);
  },
  toProto(message: PoolRecord): Uint8Array {
    return PoolRecord.encode(message).finish();
  },
  toProtoMsg(message: PoolRecord): PoolRecordProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.PoolRecord",
      value: PoolRecord.encode(message).finish()
    };
  }
};
function createBaseGenesisState(): GenesisState {
  return {
    params: Params.fromPartial({}),
    poolRecords: []
  };
}
export const GenesisState = {
  typeUrl: "/cyber.liquidity.v1beta1.GenesisState",
  encode(message: GenesisState, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.poolRecords) {
      PoolRecord.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): GenesisState {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenesisState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        case 2:
          message.poolRecords.push(PoolRecord.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): GenesisState {
    return {
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined,
      poolRecords: Array.isArray(object?.poolRecords) ? object.poolRecords.map((e: any) => PoolRecord.fromJSON(e)) : []
    };
  },
  toJSON(message: GenesisState): JsonSafe<GenesisState> {
    const obj: any = {};
    message.params !== undefined && (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    if (message.poolRecords) {
      obj.poolRecords = message.poolRecords.map(e => e ? PoolRecord.toJSON(e) : undefined);
    } else {
      obj.poolRecords = [];
    }
    return obj;
  },
  fromPartial(object: Partial<GenesisState>): GenesisState {
    const message = createBaseGenesisState();
    message.params = object.params !== undefined && object.params !== null ? Params.fromPartial(object.params) : undefined;
    message.poolRecords = object.poolRecords?.map(e => PoolRecord.fromPartial(e)) || [];
    return message;
  },
  fromProtoMsg(message: GenesisStateProtoMsg): GenesisState {
    return GenesisState.decode(message.value);
  },
  toProto(message: GenesisState): Uint8Array {
    return GenesisState.encode(message).finish();
  },
  toProtoMsg(message: GenesisState): GenesisStateProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.GenesisState",
      value: GenesisState.encode(message).finish()
    };
  }
};