//@ts-nocheck
import { Trigger, type TriggerSDKType, Load, type LoadSDKType, Params, type ParamsSDKType } from "./types.js";
import { Coin, type CoinSDKType } from "../../../cosmos/base/v1beta1/coin.js";
import { BinaryReader, BinaryWriter } from "../../../binary.js";
import { isSet } from "../../../helpers.js";
import {type JsonSafe } from "../../../json-safe.js";
export interface MsgCreateThought {
  program: string;
  trigger: Trigger;
  load: Load;
  name: string;
  particle: string;
}
export interface MsgCreateThoughtProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgCreateThought";
  value: Uint8Array;
}
export interface MsgCreateThoughtSDKType {
  program: string;
  trigger: TriggerSDKType;
  load: LoadSDKType;
  name: string;
  particle: string;
}
export interface MsgForgetThought {
  program: string;
  name: string;
}
export interface MsgForgetThoughtProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgForgetThought";
  value: Uint8Array;
}
export interface MsgForgetThoughtSDKType {
  program: string;
  name: string;
}
export interface MsgChangeThoughtParticle {
  program: string;
  name: string;
  particle: string;
}
export interface MsgChangeThoughtParticleProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtParticle";
  value: Uint8Array;
}
export interface MsgChangeThoughtParticleSDKType {
  program: string;
  name: string;
  particle: string;
}
export interface MsgChangeThoughtName {
  program: string;
  name: string;
  newName: string;
}
export interface MsgChangeThoughtNameProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtName";
  value: Uint8Array;
}
export interface MsgChangeThoughtNameSDKType {
  program: string;
  name: string;
  new_name: string;
}
export interface MsgChangeThoughtInput {
  program: string;
  name: string;
  input: string;
}
export interface MsgChangeThoughtInputProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtInput";
  value: Uint8Array;
}
export interface MsgChangeThoughtInputSDKType {
  program: string;
  name: string;
  input: string;
}
export interface MsgChangeThoughtGasPrice {
  program: string;
  name: string;
  gasPrice: Coin;
}
export interface MsgChangeThoughtGasPriceProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtGasPrice";
  value: Uint8Array;
}
export interface MsgChangeThoughtGasPriceSDKType {
  program: string;
  name: string;
  gas_price: CoinSDKType;
}
export interface MsgChangeThoughtPeriod {
  program: string;
  name: string;
  period: bigint;
}
export interface MsgChangeThoughtPeriodProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtPeriod";
  value: Uint8Array;
}
export interface MsgChangeThoughtPeriodSDKType {
  program: string;
  name: string;
  period: bigint;
}
export interface MsgChangeThoughtBlock {
  program: string;
  name: string;
  block: bigint;
}
export interface MsgChangeThoughtBlockProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtBlock";
  value: Uint8Array;
}
export interface MsgChangeThoughtBlockSDKType {
  program: string;
  name: string;
  block: bigint;
}
export interface MsgUpdateParams {
  authority: string;
  params: Params;
}
export interface MsgUpdateParamsProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgUpdateParams";
  value: Uint8Array;
}
export interface MsgUpdateParamsSDKType {
  authority: string;
  params: ParamsSDKType;
}
export interface MsgCreateThoughtResponse {}
export interface MsgCreateThoughtResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgCreateThoughtResponse";
  value: Uint8Array;
}
export interface MsgCreateThoughtResponseSDKType {}
export interface MsgForgetThoughtResponse {}
export interface MsgForgetThoughtResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgForgetThoughtResponse";
  value: Uint8Array;
}
export interface MsgForgetThoughtResponseSDKType {}
export interface MsgChangeThoughtParticleResponse {}
export interface MsgChangeThoughtParticleResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtParticleResponse";
  value: Uint8Array;
}
export interface MsgChangeThoughtParticleResponseSDKType {}
export interface MsgChangeThoughtNameResponse {}
export interface MsgChangeThoughtNameResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtNameResponse";
  value: Uint8Array;
}
export interface MsgChangeThoughtNameResponseSDKType {}
export interface MsgChangeThoughtInputResponse {}
export interface MsgChangeThoughtInputResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtInputResponse";
  value: Uint8Array;
}
export interface MsgChangeThoughtInputResponseSDKType {}
export interface MsgChangeThoughtGasPriceResponse {}
export interface MsgChangeThoughtGasPriceResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtGasPriceResponse";
  value: Uint8Array;
}
export interface MsgChangeThoughtGasPriceResponseSDKType {}
export interface MsgChangeThoughtPeriodResponse {}
export interface MsgChangeThoughtPeriodResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtPeriodResponse";
  value: Uint8Array;
}
export interface MsgChangeThoughtPeriodResponseSDKType {}
export interface MsgChangeThoughtBlockResponse {}
export interface MsgChangeThoughtBlockResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtBlockResponse";
  value: Uint8Array;
}
export interface MsgChangeThoughtBlockResponseSDKType {}
export interface MsgUpdateParamsResponse {}
export interface MsgUpdateParamsResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgUpdateParamsResponse";
  value: Uint8Array;
}
export interface MsgUpdateParamsResponseSDKType {}
function createBaseMsgCreateThought(): MsgCreateThought {
  return {
    program: "",
    trigger: Trigger.fromPartial({}),
    load: Load.fromPartial({}),
    name: "",
    particle: ""
  };
}
export const MsgCreateThought = {
  typeUrl: "/cyber.dmn.v1beta1.MsgCreateThought",
  encode(message: MsgCreateThought, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
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
  decode(input: BinaryReader | Uint8Array, length?: number): MsgCreateThought {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateThought();
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
  fromJSON(object: any): MsgCreateThought {
    return {
      program: isSet(object.program) ? String(object.program) : "",
      trigger: isSet(object.trigger) ? Trigger.fromJSON(object.trigger) : undefined,
      load: isSet(object.load) ? Load.fromJSON(object.load) : undefined,
      name: isSet(object.name) ? String(object.name) : "",
      particle: isSet(object.particle) ? String(object.particle) : ""
    };
  },
  toJSON(message: MsgCreateThought): JsonSafe<MsgCreateThought> {
    const obj: any = {};
    message.program !== undefined && (obj.program = message.program);
    message.trigger !== undefined && (obj.trigger = message.trigger ? Trigger.toJSON(message.trigger) : undefined);
    message.load !== undefined && (obj.load = message.load ? Load.toJSON(message.load) : undefined);
    message.name !== undefined && (obj.name = message.name);
    message.particle !== undefined && (obj.particle = message.particle);
    return obj;
  },
  fromPartial(object: Partial<MsgCreateThought>): MsgCreateThought {
    const message = createBaseMsgCreateThought();
    message.program = object.program ?? "";
    message.trigger = object.trigger !== undefined && object.trigger !== null ? Trigger.fromPartial(object.trigger) : undefined;
    message.load = object.load !== undefined && object.load !== null ? Load.fromPartial(object.load) : undefined;
    message.name = object.name ?? "";
    message.particle = object.particle ?? "";
    return message;
  },
  fromProtoMsg(message: MsgCreateThoughtProtoMsg): MsgCreateThought {
    return MsgCreateThought.decode(message.value);
  },
  toProto(message: MsgCreateThought): Uint8Array {
    return MsgCreateThought.encode(message).finish();
  },
  toProtoMsg(message: MsgCreateThought): MsgCreateThoughtProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgCreateThought",
      value: MsgCreateThought.encode(message).finish()
    };
  }
};
function createBaseMsgForgetThought(): MsgForgetThought {
  return {
    program: "",
    name: ""
  };
}
export const MsgForgetThought = {
  typeUrl: "/cyber.dmn.v1beta1.MsgForgetThought",
  encode(message: MsgForgetThought, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.program !== "") {
      writer.uint32(10).string(message.program);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgForgetThought {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgForgetThought();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.program = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgForgetThought {
    return {
      program: isSet(object.program) ? String(object.program) : "",
      name: isSet(object.name) ? String(object.name) : ""
    };
  },
  toJSON(message: MsgForgetThought): JsonSafe<MsgForgetThought> {
    const obj: any = {};
    message.program !== undefined && (obj.program = message.program);
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },
  fromPartial(object: Partial<MsgForgetThought>): MsgForgetThought {
    const message = createBaseMsgForgetThought();
    message.program = object.program ?? "";
    message.name = object.name ?? "";
    return message;
  },
  fromProtoMsg(message: MsgForgetThoughtProtoMsg): MsgForgetThought {
    return MsgForgetThought.decode(message.value);
  },
  toProto(message: MsgForgetThought): Uint8Array {
    return MsgForgetThought.encode(message).finish();
  },
  toProtoMsg(message: MsgForgetThought): MsgForgetThoughtProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgForgetThought",
      value: MsgForgetThought.encode(message).finish()
    };
  }
};
function createBaseMsgChangeThoughtParticle(): MsgChangeThoughtParticle {
  return {
    program: "",
    name: "",
    particle: ""
  };
}
export const MsgChangeThoughtParticle = {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtParticle",
  encode(message: MsgChangeThoughtParticle, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.program !== "") {
      writer.uint32(10).string(message.program);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.particle !== "") {
      writer.uint32(26).string(message.particle);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgChangeThoughtParticle {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgChangeThoughtParticle();
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
          message.particle = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgChangeThoughtParticle {
    return {
      program: isSet(object.program) ? String(object.program) : "",
      name: isSet(object.name) ? String(object.name) : "",
      particle: isSet(object.particle) ? String(object.particle) : ""
    };
  },
  toJSON(message: MsgChangeThoughtParticle): JsonSafe<MsgChangeThoughtParticle> {
    const obj: any = {};
    message.program !== undefined && (obj.program = message.program);
    message.name !== undefined && (obj.name = message.name);
    message.particle !== undefined && (obj.particle = message.particle);
    return obj;
  },
  fromPartial(object: Partial<MsgChangeThoughtParticle>): MsgChangeThoughtParticle {
    const message = createBaseMsgChangeThoughtParticle();
    message.program = object.program ?? "";
    message.name = object.name ?? "";
    message.particle = object.particle ?? "";
    return message;
  },
  fromProtoMsg(message: MsgChangeThoughtParticleProtoMsg): MsgChangeThoughtParticle {
    return MsgChangeThoughtParticle.decode(message.value);
  },
  toProto(message: MsgChangeThoughtParticle): Uint8Array {
    return MsgChangeThoughtParticle.encode(message).finish();
  },
  toProtoMsg(message: MsgChangeThoughtParticle): MsgChangeThoughtParticleProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtParticle",
      value: MsgChangeThoughtParticle.encode(message).finish()
    };
  }
};
function createBaseMsgChangeThoughtName(): MsgChangeThoughtName {
  return {
    program: "",
    name: "",
    newName: ""
  };
}
export const MsgChangeThoughtName = {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtName",
  encode(message: MsgChangeThoughtName, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.program !== "") {
      writer.uint32(10).string(message.program);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.newName !== "") {
      writer.uint32(26).string(message.newName);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgChangeThoughtName {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgChangeThoughtName();
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
          message.newName = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgChangeThoughtName {
    return {
      program: isSet(object.program) ? String(object.program) : "",
      name: isSet(object.name) ? String(object.name) : "",
      newName: isSet(object.newName) ? String(object.newName) : ""
    };
  },
  toJSON(message: MsgChangeThoughtName): JsonSafe<MsgChangeThoughtName> {
    const obj: any = {};
    message.program !== undefined && (obj.program = message.program);
    message.name !== undefined && (obj.name = message.name);
    message.newName !== undefined && (obj.newName = message.newName);
    return obj;
  },
  fromPartial(object: Partial<MsgChangeThoughtName>): MsgChangeThoughtName {
    const message = createBaseMsgChangeThoughtName();
    message.program = object.program ?? "";
    message.name = object.name ?? "";
    message.newName = object.newName ?? "";
    return message;
  },
  fromProtoMsg(message: MsgChangeThoughtNameProtoMsg): MsgChangeThoughtName {
    return MsgChangeThoughtName.decode(message.value);
  },
  toProto(message: MsgChangeThoughtName): Uint8Array {
    return MsgChangeThoughtName.encode(message).finish();
  },
  toProtoMsg(message: MsgChangeThoughtName): MsgChangeThoughtNameProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtName",
      value: MsgChangeThoughtName.encode(message).finish()
    };
  }
};
function createBaseMsgChangeThoughtInput(): MsgChangeThoughtInput {
  return {
    program: "",
    name: "",
    input: ""
  };
}
export const MsgChangeThoughtInput = {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtInput",
  encode(message: MsgChangeThoughtInput, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.program !== "") {
      writer.uint32(10).string(message.program);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.input !== "") {
      writer.uint32(26).string(message.input);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgChangeThoughtInput {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgChangeThoughtInput();
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
          message.input = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgChangeThoughtInput {
    return {
      program: isSet(object.program) ? String(object.program) : "",
      name: isSet(object.name) ? String(object.name) : "",
      input: isSet(object.input) ? String(object.input) : ""
    };
  },
  toJSON(message: MsgChangeThoughtInput): JsonSafe<MsgChangeThoughtInput> {
    const obj: any = {};
    message.program !== undefined && (obj.program = message.program);
    message.name !== undefined && (obj.name = message.name);
    message.input !== undefined && (obj.input = message.input);
    return obj;
  },
  fromPartial(object: Partial<MsgChangeThoughtInput>): MsgChangeThoughtInput {
    const message = createBaseMsgChangeThoughtInput();
    message.program = object.program ?? "";
    message.name = object.name ?? "";
    message.input = object.input ?? "";
    return message;
  },
  fromProtoMsg(message: MsgChangeThoughtInputProtoMsg): MsgChangeThoughtInput {
    return MsgChangeThoughtInput.decode(message.value);
  },
  toProto(message: MsgChangeThoughtInput): Uint8Array {
    return MsgChangeThoughtInput.encode(message).finish();
  },
  toProtoMsg(message: MsgChangeThoughtInput): MsgChangeThoughtInputProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtInput",
      value: MsgChangeThoughtInput.encode(message).finish()
    };
  }
};
function createBaseMsgChangeThoughtGasPrice(): MsgChangeThoughtGasPrice {
  return {
    program: "",
    name: "",
    gasPrice: Coin.fromPartial({})
  };
}
export const MsgChangeThoughtGasPrice = {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtGasPrice",
  encode(message: MsgChangeThoughtGasPrice, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.program !== "") {
      writer.uint32(10).string(message.program);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.gasPrice !== undefined) {
      Coin.encode(message.gasPrice, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgChangeThoughtGasPrice {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgChangeThoughtGasPrice();
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
          message.gasPrice = Coin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgChangeThoughtGasPrice {
    return {
      program: isSet(object.program) ? String(object.program) : "",
      name: isSet(object.name) ? String(object.name) : "",
      gasPrice: isSet(object.gasPrice) ? Coin.fromJSON(object.gasPrice) : undefined
    };
  },
  toJSON(message: MsgChangeThoughtGasPrice): JsonSafe<MsgChangeThoughtGasPrice> {
    const obj: any = {};
    message.program !== undefined && (obj.program = message.program);
    message.name !== undefined && (obj.name = message.name);
    message.gasPrice !== undefined && (obj.gasPrice = message.gasPrice ? Coin.toJSON(message.gasPrice) : undefined);
    return obj;
  },
  fromPartial(object: Partial<MsgChangeThoughtGasPrice>): MsgChangeThoughtGasPrice {
    const message = createBaseMsgChangeThoughtGasPrice();
    message.program = object.program ?? "";
    message.name = object.name ?? "";
    message.gasPrice = object.gasPrice !== undefined && object.gasPrice !== null ? Coin.fromPartial(object.gasPrice) : undefined;
    return message;
  },
  fromProtoMsg(message: MsgChangeThoughtGasPriceProtoMsg): MsgChangeThoughtGasPrice {
    return MsgChangeThoughtGasPrice.decode(message.value);
  },
  toProto(message: MsgChangeThoughtGasPrice): Uint8Array {
    return MsgChangeThoughtGasPrice.encode(message).finish();
  },
  toProtoMsg(message: MsgChangeThoughtGasPrice): MsgChangeThoughtGasPriceProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtGasPrice",
      value: MsgChangeThoughtGasPrice.encode(message).finish()
    };
  }
};
function createBaseMsgChangeThoughtPeriod(): MsgChangeThoughtPeriod {
  return {
    program: "",
    name: "",
    period: BigInt(0)
  };
}
export const MsgChangeThoughtPeriod = {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtPeriod",
  encode(message: MsgChangeThoughtPeriod, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.program !== "") {
      writer.uint32(10).string(message.program);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.period !== BigInt(0)) {
      writer.uint32(24).uint64(message.period);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgChangeThoughtPeriod {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgChangeThoughtPeriod();
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
          message.period = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgChangeThoughtPeriod {
    return {
      program: isSet(object.program) ? String(object.program) : "",
      name: isSet(object.name) ? String(object.name) : "",
      period: isSet(object.period) ? BigInt(object.period.toString()) : BigInt(0)
    };
  },
  toJSON(message: MsgChangeThoughtPeriod): JsonSafe<MsgChangeThoughtPeriod> {
    const obj: any = {};
    message.program !== undefined && (obj.program = message.program);
    message.name !== undefined && (obj.name = message.name);
    message.period !== undefined && (obj.period = (message.period || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<MsgChangeThoughtPeriod>): MsgChangeThoughtPeriod {
    const message = createBaseMsgChangeThoughtPeriod();
    message.program = object.program ?? "";
    message.name = object.name ?? "";
    message.period = object.period !== undefined && object.period !== null ? BigInt(object.period.toString()) : BigInt(0);
    return message;
  },
  fromProtoMsg(message: MsgChangeThoughtPeriodProtoMsg): MsgChangeThoughtPeriod {
    return MsgChangeThoughtPeriod.decode(message.value);
  },
  toProto(message: MsgChangeThoughtPeriod): Uint8Array {
    return MsgChangeThoughtPeriod.encode(message).finish();
  },
  toProtoMsg(message: MsgChangeThoughtPeriod): MsgChangeThoughtPeriodProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtPeriod",
      value: MsgChangeThoughtPeriod.encode(message).finish()
    };
  }
};
function createBaseMsgChangeThoughtBlock(): MsgChangeThoughtBlock {
  return {
    program: "",
    name: "",
    block: BigInt(0)
  };
}
export const MsgChangeThoughtBlock = {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtBlock",
  encode(message: MsgChangeThoughtBlock, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.program !== "") {
      writer.uint32(10).string(message.program);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.block !== BigInt(0)) {
      writer.uint32(24).uint64(message.block);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgChangeThoughtBlock {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgChangeThoughtBlock();
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
          message.block = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgChangeThoughtBlock {
    return {
      program: isSet(object.program) ? String(object.program) : "",
      name: isSet(object.name) ? String(object.name) : "",
      block: isSet(object.block) ? BigInt(object.block.toString()) : BigInt(0)
    };
  },
  toJSON(message: MsgChangeThoughtBlock): JsonSafe<MsgChangeThoughtBlock> {
    const obj: any = {};
    message.program !== undefined && (obj.program = message.program);
    message.name !== undefined && (obj.name = message.name);
    message.block !== undefined && (obj.block = (message.block || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<MsgChangeThoughtBlock>): MsgChangeThoughtBlock {
    const message = createBaseMsgChangeThoughtBlock();
    message.program = object.program ?? "";
    message.name = object.name ?? "";
    message.block = object.block !== undefined && object.block !== null ? BigInt(object.block.toString()) : BigInt(0);
    return message;
  },
  fromProtoMsg(message: MsgChangeThoughtBlockProtoMsg): MsgChangeThoughtBlock {
    return MsgChangeThoughtBlock.decode(message.value);
  },
  toProto(message: MsgChangeThoughtBlock): Uint8Array {
    return MsgChangeThoughtBlock.encode(message).finish();
  },
  toProtoMsg(message: MsgChangeThoughtBlock): MsgChangeThoughtBlockProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtBlock",
      value: MsgChangeThoughtBlock.encode(message).finish()
    };
  }
};
function createBaseMsgUpdateParams(): MsgUpdateParams {
  return {
    authority: "",
    params: Params.fromPartial({})
  };
}
export const MsgUpdateParams = {
  typeUrl: "/cyber.dmn.v1beta1.MsgUpdateParams",
  encode(message: MsgUpdateParams, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.authority !== "") {
      writer.uint32(10).string(message.authority);
    }
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateParams {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authority = reader.string();
          break;
        case 2:
          message.params = Params.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgUpdateParams {
    return {
      authority: isSet(object.authority) ? String(object.authority) : "",
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined
    };
  },
  toJSON(message: MsgUpdateParams): JsonSafe<MsgUpdateParams> {
    const obj: any = {};
    message.authority !== undefined && (obj.authority = message.authority);
    message.params !== undefined && (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    return obj;
  },
  fromPartial(object: Partial<MsgUpdateParams>): MsgUpdateParams {
    const message = createBaseMsgUpdateParams();
    message.authority = object.authority ?? "";
    message.params = object.params !== undefined && object.params !== null ? Params.fromPartial(object.params) : undefined;
    return message;
  },
  fromProtoMsg(message: MsgUpdateParamsProtoMsg): MsgUpdateParams {
    return MsgUpdateParams.decode(message.value);
  },
  toProto(message: MsgUpdateParams): Uint8Array {
    return MsgUpdateParams.encode(message).finish();
  },
  toProtoMsg(message: MsgUpdateParams): MsgUpdateParamsProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgUpdateParams",
      value: MsgUpdateParams.encode(message).finish()
    };
  }
};
function createBaseMsgCreateThoughtResponse(): MsgCreateThoughtResponse {
  return {};
}
export const MsgCreateThoughtResponse = {
  typeUrl: "/cyber.dmn.v1beta1.MsgCreateThoughtResponse",
  encode(_: MsgCreateThoughtResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgCreateThoughtResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateThoughtResponse();
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
  fromJSON(_: any): MsgCreateThoughtResponse {
    return {};
  },
  toJSON(_: MsgCreateThoughtResponse): JsonSafe<MsgCreateThoughtResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgCreateThoughtResponse>): MsgCreateThoughtResponse {
    const message = createBaseMsgCreateThoughtResponse();
    return message;
  },
  fromProtoMsg(message: MsgCreateThoughtResponseProtoMsg): MsgCreateThoughtResponse {
    return MsgCreateThoughtResponse.decode(message.value);
  },
  toProto(message: MsgCreateThoughtResponse): Uint8Array {
    return MsgCreateThoughtResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgCreateThoughtResponse): MsgCreateThoughtResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgCreateThoughtResponse",
      value: MsgCreateThoughtResponse.encode(message).finish()
    };
  }
};
function createBaseMsgForgetThoughtResponse(): MsgForgetThoughtResponse {
  return {};
}
export const MsgForgetThoughtResponse = {
  typeUrl: "/cyber.dmn.v1beta1.MsgForgetThoughtResponse",
  encode(_: MsgForgetThoughtResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgForgetThoughtResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgForgetThoughtResponse();
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
  fromJSON(_: any): MsgForgetThoughtResponse {
    return {};
  },
  toJSON(_: MsgForgetThoughtResponse): JsonSafe<MsgForgetThoughtResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgForgetThoughtResponse>): MsgForgetThoughtResponse {
    const message = createBaseMsgForgetThoughtResponse();
    return message;
  },
  fromProtoMsg(message: MsgForgetThoughtResponseProtoMsg): MsgForgetThoughtResponse {
    return MsgForgetThoughtResponse.decode(message.value);
  },
  toProto(message: MsgForgetThoughtResponse): Uint8Array {
    return MsgForgetThoughtResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgForgetThoughtResponse): MsgForgetThoughtResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgForgetThoughtResponse",
      value: MsgForgetThoughtResponse.encode(message).finish()
    };
  }
};
function createBaseMsgChangeThoughtParticleResponse(): MsgChangeThoughtParticleResponse {
  return {};
}
export const MsgChangeThoughtParticleResponse = {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtParticleResponse",
  encode(_: MsgChangeThoughtParticleResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgChangeThoughtParticleResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgChangeThoughtParticleResponse();
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
  fromJSON(_: any): MsgChangeThoughtParticleResponse {
    return {};
  },
  toJSON(_: MsgChangeThoughtParticleResponse): JsonSafe<MsgChangeThoughtParticleResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgChangeThoughtParticleResponse>): MsgChangeThoughtParticleResponse {
    const message = createBaseMsgChangeThoughtParticleResponse();
    return message;
  },
  fromProtoMsg(message: MsgChangeThoughtParticleResponseProtoMsg): MsgChangeThoughtParticleResponse {
    return MsgChangeThoughtParticleResponse.decode(message.value);
  },
  toProto(message: MsgChangeThoughtParticleResponse): Uint8Array {
    return MsgChangeThoughtParticleResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgChangeThoughtParticleResponse): MsgChangeThoughtParticleResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtParticleResponse",
      value: MsgChangeThoughtParticleResponse.encode(message).finish()
    };
  }
};
function createBaseMsgChangeThoughtNameResponse(): MsgChangeThoughtNameResponse {
  return {};
}
export const MsgChangeThoughtNameResponse = {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtNameResponse",
  encode(_: MsgChangeThoughtNameResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgChangeThoughtNameResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgChangeThoughtNameResponse();
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
  fromJSON(_: any): MsgChangeThoughtNameResponse {
    return {};
  },
  toJSON(_: MsgChangeThoughtNameResponse): JsonSafe<MsgChangeThoughtNameResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgChangeThoughtNameResponse>): MsgChangeThoughtNameResponse {
    const message = createBaseMsgChangeThoughtNameResponse();
    return message;
  },
  fromProtoMsg(message: MsgChangeThoughtNameResponseProtoMsg): MsgChangeThoughtNameResponse {
    return MsgChangeThoughtNameResponse.decode(message.value);
  },
  toProto(message: MsgChangeThoughtNameResponse): Uint8Array {
    return MsgChangeThoughtNameResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgChangeThoughtNameResponse): MsgChangeThoughtNameResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtNameResponse",
      value: MsgChangeThoughtNameResponse.encode(message).finish()
    };
  }
};
function createBaseMsgChangeThoughtInputResponse(): MsgChangeThoughtInputResponse {
  return {};
}
export const MsgChangeThoughtInputResponse = {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtInputResponse",
  encode(_: MsgChangeThoughtInputResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgChangeThoughtInputResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgChangeThoughtInputResponse();
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
  fromJSON(_: any): MsgChangeThoughtInputResponse {
    return {};
  },
  toJSON(_: MsgChangeThoughtInputResponse): JsonSafe<MsgChangeThoughtInputResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgChangeThoughtInputResponse>): MsgChangeThoughtInputResponse {
    const message = createBaseMsgChangeThoughtInputResponse();
    return message;
  },
  fromProtoMsg(message: MsgChangeThoughtInputResponseProtoMsg): MsgChangeThoughtInputResponse {
    return MsgChangeThoughtInputResponse.decode(message.value);
  },
  toProto(message: MsgChangeThoughtInputResponse): Uint8Array {
    return MsgChangeThoughtInputResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgChangeThoughtInputResponse): MsgChangeThoughtInputResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtInputResponse",
      value: MsgChangeThoughtInputResponse.encode(message).finish()
    };
  }
};
function createBaseMsgChangeThoughtGasPriceResponse(): MsgChangeThoughtGasPriceResponse {
  return {};
}
export const MsgChangeThoughtGasPriceResponse = {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtGasPriceResponse",
  encode(_: MsgChangeThoughtGasPriceResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgChangeThoughtGasPriceResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgChangeThoughtGasPriceResponse();
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
  fromJSON(_: any): MsgChangeThoughtGasPriceResponse {
    return {};
  },
  toJSON(_: MsgChangeThoughtGasPriceResponse): JsonSafe<MsgChangeThoughtGasPriceResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgChangeThoughtGasPriceResponse>): MsgChangeThoughtGasPriceResponse {
    const message = createBaseMsgChangeThoughtGasPriceResponse();
    return message;
  },
  fromProtoMsg(message: MsgChangeThoughtGasPriceResponseProtoMsg): MsgChangeThoughtGasPriceResponse {
    return MsgChangeThoughtGasPriceResponse.decode(message.value);
  },
  toProto(message: MsgChangeThoughtGasPriceResponse): Uint8Array {
    return MsgChangeThoughtGasPriceResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgChangeThoughtGasPriceResponse): MsgChangeThoughtGasPriceResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtGasPriceResponse",
      value: MsgChangeThoughtGasPriceResponse.encode(message).finish()
    };
  }
};
function createBaseMsgChangeThoughtPeriodResponse(): MsgChangeThoughtPeriodResponse {
  return {};
}
export const MsgChangeThoughtPeriodResponse = {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtPeriodResponse",
  encode(_: MsgChangeThoughtPeriodResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgChangeThoughtPeriodResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgChangeThoughtPeriodResponse();
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
  fromJSON(_: any): MsgChangeThoughtPeriodResponse {
    return {};
  },
  toJSON(_: MsgChangeThoughtPeriodResponse): JsonSafe<MsgChangeThoughtPeriodResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgChangeThoughtPeriodResponse>): MsgChangeThoughtPeriodResponse {
    const message = createBaseMsgChangeThoughtPeriodResponse();
    return message;
  },
  fromProtoMsg(message: MsgChangeThoughtPeriodResponseProtoMsg): MsgChangeThoughtPeriodResponse {
    return MsgChangeThoughtPeriodResponse.decode(message.value);
  },
  toProto(message: MsgChangeThoughtPeriodResponse): Uint8Array {
    return MsgChangeThoughtPeriodResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgChangeThoughtPeriodResponse): MsgChangeThoughtPeriodResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtPeriodResponse",
      value: MsgChangeThoughtPeriodResponse.encode(message).finish()
    };
  }
};
function createBaseMsgChangeThoughtBlockResponse(): MsgChangeThoughtBlockResponse {
  return {};
}
export const MsgChangeThoughtBlockResponse = {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtBlockResponse",
  encode(_: MsgChangeThoughtBlockResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgChangeThoughtBlockResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgChangeThoughtBlockResponse();
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
  fromJSON(_: any): MsgChangeThoughtBlockResponse {
    return {};
  },
  toJSON(_: MsgChangeThoughtBlockResponse): JsonSafe<MsgChangeThoughtBlockResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgChangeThoughtBlockResponse>): MsgChangeThoughtBlockResponse {
    const message = createBaseMsgChangeThoughtBlockResponse();
    return message;
  },
  fromProtoMsg(message: MsgChangeThoughtBlockResponseProtoMsg): MsgChangeThoughtBlockResponse {
    return MsgChangeThoughtBlockResponse.decode(message.value);
  },
  toProto(message: MsgChangeThoughtBlockResponse): Uint8Array {
    return MsgChangeThoughtBlockResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgChangeThoughtBlockResponse): MsgChangeThoughtBlockResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtBlockResponse",
      value: MsgChangeThoughtBlockResponse.encode(message).finish()
    };
  }
};
function createBaseMsgUpdateParamsResponse(): MsgUpdateParamsResponse {
  return {};
}
export const MsgUpdateParamsResponse = {
  typeUrl: "/cyber.dmn.v1beta1.MsgUpdateParamsResponse",
  encode(_: MsgUpdateParamsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateParamsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateParamsResponse();
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
  fromJSON(_: any): MsgUpdateParamsResponse {
    return {};
  },
  toJSON(_: MsgUpdateParamsResponse): JsonSafe<MsgUpdateParamsResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgUpdateParamsResponse>): MsgUpdateParamsResponse {
    const message = createBaseMsgUpdateParamsResponse();
    return message;
  },
  fromProtoMsg(message: MsgUpdateParamsResponseProtoMsg): MsgUpdateParamsResponse {
    return MsgUpdateParamsResponse.decode(message.value);
  },
  toProto(message: MsgUpdateParamsResponse): Uint8Array {
    return MsgUpdateParamsResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgUpdateParamsResponse): MsgUpdateParamsResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgUpdateParamsResponse",
      value: MsgUpdateParamsResponse.encode(message).finish()
    };
  }
};