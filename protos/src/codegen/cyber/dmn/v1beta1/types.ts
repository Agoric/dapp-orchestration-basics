//@ts-nocheck
import { Coin, type CoinSDKType } from "../../../cosmos/base/v1beta1/coin.js";
import { BinaryReader, BinaryWriter } from "../../../binary.js";
import { isSet } from "../../../helpers.js";
import {type JsonSafe } from "../../../json-safe.js";
export interface Params {
  maxSlots: number;
  maxGas: number;
  feeTtl: number;
}
export interface ParamsProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.Params";
  value: Uint8Array;
}
export interface ParamsSDKType {
  max_slots: number;
  max_gas: number;
  fee_ttl: number;
}
export interface Thought {
  program: string;
  trigger: Trigger;
  load: Load;
  name: string;
  particle: string;
}
export interface ThoughtProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.Thought";
  value: Uint8Array;
}
export interface ThoughtSDKType {
  program: string;
  trigger: TriggerSDKType;
  load: LoadSDKType;
  name: string;
  particle: string;
}
export interface Trigger {
  period: bigint;
  block: bigint;
}
export interface TriggerProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.Trigger";
  value: Uint8Array;
}
export interface TriggerSDKType {
  period: bigint;
  block: bigint;
}
export interface Load {
  input: string;
  gasPrice: Coin;
}
export interface LoadProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.Load";
  value: Uint8Array;
}
export interface LoadSDKType {
  input: string;
  gas_price: CoinSDKType;
}
export interface ThoughtStats {
  program: string;
  name: string;
  calls: bigint;
  fees: bigint;
  gas: bigint;
  lastBlock: bigint;
}
export interface ThoughtStatsProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.ThoughtStats";
  value: Uint8Array;
}
export interface ThoughtStatsSDKType {
  program: string;
  name: string;
  calls: bigint;
  fees: bigint;
  gas: bigint;
  last_block: bigint;
}
function createBaseParams(): Params {
  return {
    maxSlots: 0,
    maxGas: 0,
    feeTtl: 0
  };
}
export const Params = {
  typeUrl: "/cyber.dmn.v1beta1.Params",
  encode(message: Params, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.maxSlots !== 0) {
      writer.uint32(8).uint32(message.maxSlots);
    }
    if (message.maxGas !== 0) {
      writer.uint32(16).uint32(message.maxGas);
    }
    if (message.feeTtl !== 0) {
      writer.uint32(24).uint32(message.feeTtl);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Params {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.maxSlots = reader.uint32();
          break;
        case 2:
          message.maxGas = reader.uint32();
          break;
        case 3:
          message.feeTtl = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Params {
    return {
      maxSlots: isSet(object.maxSlots) ? Number(object.maxSlots) : 0,
      maxGas: isSet(object.maxGas) ? Number(object.maxGas) : 0,
      feeTtl: isSet(object.feeTtl) ? Number(object.feeTtl) : 0
    };
  },
  toJSON(message: Params): JsonSafe<Params> {
    const obj: any = {};
    message.maxSlots !== undefined && (obj.maxSlots = Math.round(message.maxSlots));
    message.maxGas !== undefined && (obj.maxGas = Math.round(message.maxGas));
    message.feeTtl !== undefined && (obj.feeTtl = Math.round(message.feeTtl));
    return obj;
  },
  fromPartial(object: Partial<Params>): Params {
    const message = createBaseParams();
    message.maxSlots = object.maxSlots ?? 0;
    message.maxGas = object.maxGas ?? 0;
    message.feeTtl = object.feeTtl ?? 0;
    return message;
  },
  fromProtoMsg(message: ParamsProtoMsg): Params {
    return Params.decode(message.value);
  },
  toProto(message: Params): Uint8Array {
    return Params.encode(message).finish();
  },
  toProtoMsg(message: Params): ParamsProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.Params",
      value: Params.encode(message).finish()
    };
  }
};
function createBaseThought(): Thought {
  return {
    program: "",
    trigger: Trigger.fromPartial({}),
    load: Load.fromPartial({}),
    name: "",
    particle: ""
  };
}
export const Thought = {
  typeUrl: "/cyber.dmn.v1beta1.Thought",
  encode(message: Thought, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.program !== "") {
      writer.uint32(10).string(message.program);
    }
    if (message.trigger !== undefined) {
      Trigger.encode(message.trigger, writer.uint32(18).fork()).ldelim();
    }
    if (message.load !== undefined) {
      Load.encode(message.load, writer.uint32(26).fork()).ldelim();
    }
    if (message.name !== "") {
      writer.uint32(34).string(message.name);
    }
    if (message.particle !== "") {
      writer.uint32(42).string(message.particle);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Thought {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseThought();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.program = reader.string();
          break;
        case 2:
          message.trigger = Trigger.decode(reader, reader.uint32());
          break;
        case 3:
          message.load = Load.decode(reader, reader.uint32());
          break;
        case 4:
          message.name = reader.string();
          break;
        case 5:
          message.particle = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Thought {
    return {
      program: isSet(object.program) ? String(object.program) : "",
      trigger: isSet(object.trigger) ? Trigger.fromJSON(object.trigger) : undefined,
      load: isSet(object.load) ? Load.fromJSON(object.load) : undefined,
      name: isSet(object.name) ? String(object.name) : "",
      particle: isSet(object.particle) ? String(object.particle) : ""
    };
  },
  toJSON(message: Thought): JsonSafe<Thought> {
    const obj: any = {};
    message.program !== undefined && (obj.program = message.program);
    message.trigger !== undefined && (obj.trigger = message.trigger ? Trigger.toJSON(message.trigger) : undefined);
    message.load !== undefined && (obj.load = message.load ? Load.toJSON(message.load) : undefined);
    message.name !== undefined && (obj.name = message.name);
    message.particle !== undefined && (obj.particle = message.particle);
    return obj;
  },
  fromPartial(object: Partial<Thought>): Thought {
    const message = createBaseThought();
    message.program = object.program ?? "";
    message.trigger = object.trigger !== undefined && object.trigger !== null ? Trigger.fromPartial(object.trigger) : undefined;
    message.load = object.load !== undefined && object.load !== null ? Load.fromPartial(object.load) : undefined;
    message.name = object.name ?? "";
    message.particle = object.particle ?? "";
    return message;
  },
  fromProtoMsg(message: ThoughtProtoMsg): Thought {
    return Thought.decode(message.value);
  },
  toProto(message: Thought): Uint8Array {
    return Thought.encode(message).finish();
  },
  toProtoMsg(message: Thought): ThoughtProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.Thought",
      value: Thought.encode(message).finish()
    };
  }
};
function createBaseTrigger(): Trigger {
  return {
    period: BigInt(0),
    block: BigInt(0)
  };
}
export const Trigger = {
  typeUrl: "/cyber.dmn.v1beta1.Trigger",
  encode(message: Trigger, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.period !== BigInt(0)) {
      writer.uint32(8).uint64(message.period);
    }
    if (message.block !== BigInt(0)) {
      writer.uint32(16).uint64(message.block);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Trigger {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTrigger();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.period = reader.uint64();
          break;
        case 2:
          message.block = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Trigger {
    return {
      period: isSet(object.period) ? BigInt(object.period.toString()) : BigInt(0),
      block: isSet(object.block) ? BigInt(object.block.toString()) : BigInt(0)
    };
  },
  toJSON(message: Trigger): JsonSafe<Trigger> {
    const obj: any = {};
    message.period !== undefined && (obj.period = (message.period || BigInt(0)).toString());
    message.block !== undefined && (obj.block = (message.block || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<Trigger>): Trigger {
    const message = createBaseTrigger();
    message.period = object.period !== undefined && object.period !== null ? BigInt(object.period.toString()) : BigInt(0);
    message.block = object.block !== undefined && object.block !== null ? BigInt(object.block.toString()) : BigInt(0);
    return message;
  },
  fromProtoMsg(message: TriggerProtoMsg): Trigger {
    return Trigger.decode(message.value);
  },
  toProto(message: Trigger): Uint8Array {
    return Trigger.encode(message).finish();
  },
  toProtoMsg(message: Trigger): TriggerProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.Trigger",
      value: Trigger.encode(message).finish()
    };
  }
};
function createBaseLoad(): Load {
  return {
    input: "",
    gasPrice: Coin.fromPartial({})
  };
}
export const Load = {
  typeUrl: "/cyber.dmn.v1beta1.Load",
  encode(message: Load, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.input !== "") {
      writer.uint32(10).string(message.input);
    }
    if (message.gasPrice !== undefined) {
      Coin.encode(message.gasPrice, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Load {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLoad();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.input = reader.string();
          break;
        case 2:
          message.gasPrice = Coin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Load {
    return {
      input: isSet(object.input) ? String(object.input) : "",
      gasPrice: isSet(object.gasPrice) ? Coin.fromJSON(object.gasPrice) : undefined
    };
  },
  toJSON(message: Load): JsonSafe<Load> {
    const obj: any = {};
    message.input !== undefined && (obj.input = message.input);
    message.gasPrice !== undefined && (obj.gasPrice = message.gasPrice ? Coin.toJSON(message.gasPrice) : undefined);
    return obj;
  },
  fromPartial(object: Partial<Load>): Load {
    const message = createBaseLoad();
    message.input = object.input ?? "";
    message.gasPrice = object.gasPrice !== undefined && object.gasPrice !== null ? Coin.fromPartial(object.gasPrice) : undefined;
    return message;
  },
  fromProtoMsg(message: LoadProtoMsg): Load {
    return Load.decode(message.value);
  },
  toProto(message: Load): Uint8Array {
    return Load.encode(message).finish();
  },
  toProtoMsg(message: Load): LoadProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.Load",
      value: Load.encode(message).finish()
    };
  }
};
function createBaseThoughtStats(): ThoughtStats {
  return {
    program: "",
    name: "",
    calls: BigInt(0),
    fees: BigInt(0),
    gas: BigInt(0),
    lastBlock: BigInt(0)
  };
}
export const ThoughtStats = {
  typeUrl: "/cyber.dmn.v1beta1.ThoughtStats",
  encode(message: ThoughtStats, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.program !== "") {
      writer.uint32(10).string(message.program);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.calls !== BigInt(0)) {
      writer.uint32(24).uint64(message.calls);
    }
    if (message.fees !== BigInt(0)) {
      writer.uint32(32).uint64(message.fees);
    }
    if (message.gas !== BigInt(0)) {
      writer.uint32(40).uint64(message.gas);
    }
    if (message.lastBlock !== BigInt(0)) {
      writer.uint32(48).uint64(message.lastBlock);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): ThoughtStats {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseThoughtStats();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.program = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.calls = reader.uint64();
          break;
        case 4:
          message.fees = reader.uint64();
          break;
        case 5:
          message.gas = reader.uint64();
          break;
        case 6:
          message.lastBlock = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ThoughtStats {
    return {
      program: isSet(object.program) ? String(object.program) : "",
      name: isSet(object.name) ? String(object.name) : "",
      calls: isSet(object.calls) ? BigInt(object.calls.toString()) : BigInt(0),
      fees: isSet(object.fees) ? BigInt(object.fees.toString()) : BigInt(0),
      gas: isSet(object.gas) ? BigInt(object.gas.toString()) : BigInt(0),
      lastBlock: isSet(object.lastBlock) ? BigInt(object.lastBlock.toString()) : BigInt(0)
    };
  },
  toJSON(message: ThoughtStats): JsonSafe<ThoughtStats> {
    const obj: any = {};
    message.program !== undefined && (obj.program = message.program);
    message.name !== undefined && (obj.name = message.name);
    message.calls !== undefined && (obj.calls = (message.calls || BigInt(0)).toString());
    message.fees !== undefined && (obj.fees = (message.fees || BigInt(0)).toString());
    message.gas !== undefined && (obj.gas = (message.gas || BigInt(0)).toString());
    message.lastBlock !== undefined && (obj.lastBlock = (message.lastBlock || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<ThoughtStats>): ThoughtStats {
    const message = createBaseThoughtStats();
    message.program = object.program ?? "";
    message.name = object.name ?? "";
    message.calls = object.calls !== undefined && object.calls !== null ? BigInt(object.calls.toString()) : BigInt(0);
    message.fees = object.fees !== undefined && object.fees !== null ? BigInt(object.fees.toString()) : BigInt(0);
    message.gas = object.gas !== undefined && object.gas !== null ? BigInt(object.gas.toString()) : BigInt(0);
    message.lastBlock = object.lastBlock !== undefined && object.lastBlock !== null ? BigInt(object.lastBlock.toString()) : BigInt(0);
    return message;
  },
  fromProtoMsg(message: ThoughtStatsProtoMsg): ThoughtStats {
    return ThoughtStats.decode(message.value);
  },
  toProto(message: ThoughtStats): Uint8Array {
    return ThoughtStats.encode(message).finish();
  },
  toProtoMsg(message: ThoughtStats): ThoughtStatsProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.ThoughtStats",
      value: ThoughtStats.encode(message).finish()
    };
  }
};