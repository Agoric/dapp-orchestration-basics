//@ts-nocheck
import { Coin, type CoinSDKType } from "../../../cosmos/base/v1beta1/coin.js";
import { BinaryReader, BinaryWriter } from "../../../binary.js";
import { isSet } from "../../../helpers.js";
import {type JsonSafe } from "../../../json-safe.js";
export interface Params {
  maxSlots: number;
  halvingPeriodVoltBlocks: number;
  halvingPeriodAmpereBlocks: number;
  baseInvestmintPeriodVolt: number;
  baseInvestmintPeriodAmpere: number;
  minInvestmintPeriod: number;
  baseInvestmintAmountVolt: Coin;
  baseInvestmintAmountAmpere: Coin;
}
export interface ParamsProtoMsg {
  typeUrl: "/cyber.resources.v1beta1.Params";
  value: Uint8Array;
}
export interface ParamsSDKType {
  max_slots: number;
  halving_period_volt_blocks: number;
  halving_period_ampere_blocks: number;
  base_investmint_period_volt: number;
  base_investmint_period_ampere: number;
  min_investmint_period: number;
  base_investmint_amount_volt: CoinSDKType;
  base_investmint_amount_ampere: CoinSDKType;
}
function createBaseParams(): Params {
  return {
    maxSlots: 0,
    halvingPeriodVoltBlocks: 0,
    halvingPeriodAmpereBlocks: 0,
    baseInvestmintPeriodVolt: 0,
    baseInvestmintPeriodAmpere: 0,
    minInvestmintPeriod: 0,
    baseInvestmintAmountVolt: Coin.fromPartial({}),
    baseInvestmintAmountAmpere: Coin.fromPartial({})
  };
}
export const Params = {
  typeUrl: "/cyber.resources.v1beta1.Params",
  encode(message: Params, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.maxSlots !== 0) {
      writer.uint32(8).uint32(message.maxSlots);
    }
    if (message.halvingPeriodVoltBlocks !== 0) {
      writer.uint32(16).uint32(message.halvingPeriodVoltBlocks);
    }
    if (message.halvingPeriodAmpereBlocks !== 0) {
      writer.uint32(24).uint32(message.halvingPeriodAmpereBlocks);
    }
    if (message.baseInvestmintPeriodVolt !== 0) {
      writer.uint32(32).uint32(message.baseInvestmintPeriodVolt);
    }
    if (message.baseInvestmintPeriodAmpere !== 0) {
      writer.uint32(40).uint32(message.baseInvestmintPeriodAmpere);
    }
    if (message.minInvestmintPeriod !== 0) {
      writer.uint32(48).uint32(message.minInvestmintPeriod);
    }
    if (message.baseInvestmintAmountVolt !== undefined) {
      Coin.encode(message.baseInvestmintAmountVolt, writer.uint32(58).fork()).ldelim();
    }
    if (message.baseInvestmintAmountAmpere !== undefined) {
      Coin.encode(message.baseInvestmintAmountAmpere, writer.uint32(66).fork()).ldelim();
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
          message.halvingPeriodVoltBlocks = reader.uint32();
          break;
        case 3:
          message.halvingPeriodAmpereBlocks = reader.uint32();
          break;
        case 4:
          message.baseInvestmintPeriodVolt = reader.uint32();
          break;
        case 5:
          message.baseInvestmintPeriodAmpere = reader.uint32();
          break;
        case 6:
          message.minInvestmintPeriod = reader.uint32();
          break;
        case 7:
          message.baseInvestmintAmountVolt = Coin.decode(reader, reader.uint32());
          break;
        case 8:
          message.baseInvestmintAmountAmpere = Coin.decode(reader, reader.uint32());
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
      halvingPeriodVoltBlocks: isSet(object.halvingPeriodVoltBlocks) ? Number(object.halvingPeriodVoltBlocks) : 0,
      halvingPeriodAmpereBlocks: isSet(object.halvingPeriodAmpereBlocks) ? Number(object.halvingPeriodAmpereBlocks) : 0,
      baseInvestmintPeriodVolt: isSet(object.baseInvestmintPeriodVolt) ? Number(object.baseInvestmintPeriodVolt) : 0,
      baseInvestmintPeriodAmpere: isSet(object.baseInvestmintPeriodAmpere) ? Number(object.baseInvestmintPeriodAmpere) : 0,
      minInvestmintPeriod: isSet(object.minInvestmintPeriod) ? Number(object.minInvestmintPeriod) : 0,
      baseInvestmintAmountVolt: isSet(object.baseInvestmintAmountVolt) ? Coin.fromJSON(object.baseInvestmintAmountVolt) : undefined,
      baseInvestmintAmountAmpere: isSet(object.baseInvestmintAmountAmpere) ? Coin.fromJSON(object.baseInvestmintAmountAmpere) : undefined
    };
  },
  toJSON(message: Params): JsonSafe<Params> {
    const obj: any = {};
    message.maxSlots !== undefined && (obj.maxSlots = Math.round(message.maxSlots));
    message.halvingPeriodVoltBlocks !== undefined && (obj.halvingPeriodVoltBlocks = Math.round(message.halvingPeriodVoltBlocks));
    message.halvingPeriodAmpereBlocks !== undefined && (obj.halvingPeriodAmpereBlocks = Math.round(message.halvingPeriodAmpereBlocks));
    message.baseInvestmintPeriodVolt !== undefined && (obj.baseInvestmintPeriodVolt = Math.round(message.baseInvestmintPeriodVolt));
    message.baseInvestmintPeriodAmpere !== undefined && (obj.baseInvestmintPeriodAmpere = Math.round(message.baseInvestmintPeriodAmpere));
    message.minInvestmintPeriod !== undefined && (obj.minInvestmintPeriod = Math.round(message.minInvestmintPeriod));
    message.baseInvestmintAmountVolt !== undefined && (obj.baseInvestmintAmountVolt = message.baseInvestmintAmountVolt ? Coin.toJSON(message.baseInvestmintAmountVolt) : undefined);
    message.baseInvestmintAmountAmpere !== undefined && (obj.baseInvestmintAmountAmpere = message.baseInvestmintAmountAmpere ? Coin.toJSON(message.baseInvestmintAmountAmpere) : undefined);
    return obj;
  },
  fromPartial(object: Partial<Params>): Params {
    const message = createBaseParams();
    message.maxSlots = object.maxSlots ?? 0;
    message.halvingPeriodVoltBlocks = object.halvingPeriodVoltBlocks ?? 0;
    message.halvingPeriodAmpereBlocks = object.halvingPeriodAmpereBlocks ?? 0;
    message.baseInvestmintPeriodVolt = object.baseInvestmintPeriodVolt ?? 0;
    message.baseInvestmintPeriodAmpere = object.baseInvestmintPeriodAmpere ?? 0;
    message.minInvestmintPeriod = object.minInvestmintPeriod ?? 0;
    message.baseInvestmintAmountVolt = object.baseInvestmintAmountVolt !== undefined && object.baseInvestmintAmountVolt !== null ? Coin.fromPartial(object.baseInvestmintAmountVolt) : undefined;
    message.baseInvestmintAmountAmpere = object.baseInvestmintAmountAmpere !== undefined && object.baseInvestmintAmountAmpere !== null ? Coin.fromPartial(object.baseInvestmintAmountAmpere) : undefined;
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
      typeUrl: "/cyber.resources.v1beta1.Params",
      value: Params.encode(message).finish()
    };
  }
};