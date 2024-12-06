//@ts-nocheck
import { BinaryReader, BinaryWriter } from "../../../binary.js";
import { Decimal, isSet } from "../../../helpers.js";
import {type JsonSafe } from "../../../json-safe.js";
export interface Params {
  recoveryPeriod: bigint;
  adjustPricePeriod: bigint;
  basePrice: string;
  baseLoad: string;
  maxBlockBandwidth: bigint;
}
export interface ParamsProtoMsg {
  typeUrl: "/cyber.bandwidth.v1beta1.Params";
  value: Uint8Array;
}
export interface ParamsSDKType {
  recovery_period: bigint;
  adjust_price_period: bigint;
  base_price: string;
  base_load: string;
  max_block_bandwidth: bigint;
}
export interface NeuronBandwidth {
  neuron: string;
  remainedValue: bigint;
  lastUpdatedBlock: bigint;
  maxValue: bigint;
}
export interface NeuronBandwidthProtoMsg {
  typeUrl: "/cyber.bandwidth.v1beta1.NeuronBandwidth";
  value: Uint8Array;
}
export interface NeuronBandwidthSDKType {
  neuron: string;
  remained_value: bigint;
  last_updated_block: bigint;
  max_value: bigint;
}
export interface Price {
  price: string;
}
export interface PriceProtoMsg {
  typeUrl: "/cyber.bandwidth.v1beta1.Price";
  value: Uint8Array;
}
export interface PriceSDKType {
  price: string;
}
function createBaseParams(): Params {
  return {
    recoveryPeriod: BigInt(0),
    adjustPricePeriod: BigInt(0),
    basePrice: "",
    baseLoad: "",
    maxBlockBandwidth: BigInt(0)
  };
}
export const Params = {
  typeUrl: "/cyber.bandwidth.v1beta1.Params",
  encode(message: Params, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.recoveryPeriod !== BigInt(0)) {
      writer.uint32(8).uint64(message.recoveryPeriod);
    }
    if (message.adjustPricePeriod !== BigInt(0)) {
      writer.uint32(16).uint64(message.adjustPricePeriod);
    }
    if (message.basePrice !== "") {
      writer.uint32(26).string(Decimal.fromUserInput(message.basePrice, 18).atomics);
    }
    if (message.baseLoad !== "") {
      writer.uint32(34).string(Decimal.fromUserInput(message.baseLoad, 18).atomics);
    }
    if (message.maxBlockBandwidth !== BigInt(0)) {
      writer.uint32(40).uint64(message.maxBlockBandwidth);
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
          message.recoveryPeriod = reader.uint64();
          break;
        case 2:
          message.adjustPricePeriod = reader.uint64();
          break;
        case 3:
          message.basePrice = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        case 4:
          message.baseLoad = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        case 5:
          message.maxBlockBandwidth = reader.uint64();
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
      recoveryPeriod: isSet(object.recoveryPeriod) ? BigInt(object.recoveryPeriod.toString()) : BigInt(0),
      adjustPricePeriod: isSet(object.adjustPricePeriod) ? BigInt(object.adjustPricePeriod.toString()) : BigInt(0),
      basePrice: isSet(object.basePrice) ? String(object.basePrice) : "",
      baseLoad: isSet(object.baseLoad) ? String(object.baseLoad) : "",
      maxBlockBandwidth: isSet(object.maxBlockBandwidth) ? BigInt(object.maxBlockBandwidth.toString()) : BigInt(0)
    };
  },
  toJSON(message: Params): JsonSafe<Params> {
    const obj: any = {};
    message.recoveryPeriod !== undefined && (obj.recoveryPeriod = (message.recoveryPeriod || BigInt(0)).toString());
    message.adjustPricePeriod !== undefined && (obj.adjustPricePeriod = (message.adjustPricePeriod || BigInt(0)).toString());
    message.basePrice !== undefined && (obj.basePrice = message.basePrice);
    message.baseLoad !== undefined && (obj.baseLoad = message.baseLoad);
    message.maxBlockBandwidth !== undefined && (obj.maxBlockBandwidth = (message.maxBlockBandwidth || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<Params>): Params {
    const message = createBaseParams();
    message.recoveryPeriod = object.recoveryPeriod !== undefined && object.recoveryPeriod !== null ? BigInt(object.recoveryPeriod.toString()) : BigInt(0);
    message.adjustPricePeriod = object.adjustPricePeriod !== undefined && object.adjustPricePeriod !== null ? BigInt(object.adjustPricePeriod.toString()) : BigInt(0);
    message.basePrice = object.basePrice ?? "";
    message.baseLoad = object.baseLoad ?? "";
    message.maxBlockBandwidth = object.maxBlockBandwidth !== undefined && object.maxBlockBandwidth !== null ? BigInt(object.maxBlockBandwidth.toString()) : BigInt(0);
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
      typeUrl: "/cyber.bandwidth.v1beta1.Params",
      value: Params.encode(message).finish()
    };
  }
};
function createBaseNeuronBandwidth(): NeuronBandwidth {
  return {
    neuron: "",
    remainedValue: BigInt(0),
    lastUpdatedBlock: BigInt(0),
    maxValue: BigInt(0)
  };
}
export const NeuronBandwidth = {
  typeUrl: "/cyber.bandwidth.v1beta1.NeuronBandwidth",
  encode(message: NeuronBandwidth, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.neuron !== "") {
      writer.uint32(10).string(message.neuron);
    }
    if (message.remainedValue !== BigInt(0)) {
      writer.uint32(16).uint64(message.remainedValue);
    }
    if (message.lastUpdatedBlock !== BigInt(0)) {
      writer.uint32(24).uint64(message.lastUpdatedBlock);
    }
    if (message.maxValue !== BigInt(0)) {
      writer.uint32(32).uint64(message.maxValue);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): NeuronBandwidth {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNeuronBandwidth();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.neuron = reader.string();
          break;
        case 2:
          message.remainedValue = reader.uint64();
          break;
        case 3:
          message.lastUpdatedBlock = reader.uint64();
          break;
        case 4:
          message.maxValue = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): NeuronBandwidth {
    return {
      neuron: isSet(object.neuron) ? String(object.neuron) : "",
      remainedValue: isSet(object.remainedValue) ? BigInt(object.remainedValue.toString()) : BigInt(0),
      lastUpdatedBlock: isSet(object.lastUpdatedBlock) ? BigInt(object.lastUpdatedBlock.toString()) : BigInt(0),
      maxValue: isSet(object.maxValue) ? BigInt(object.maxValue.toString()) : BigInt(0)
    };
  },
  toJSON(message: NeuronBandwidth): JsonSafe<NeuronBandwidth> {
    const obj: any = {};
    message.neuron !== undefined && (obj.neuron = message.neuron);
    message.remainedValue !== undefined && (obj.remainedValue = (message.remainedValue || BigInt(0)).toString());
    message.lastUpdatedBlock !== undefined && (obj.lastUpdatedBlock = (message.lastUpdatedBlock || BigInt(0)).toString());
    message.maxValue !== undefined && (obj.maxValue = (message.maxValue || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<NeuronBandwidth>): NeuronBandwidth {
    const message = createBaseNeuronBandwidth();
    message.neuron = object.neuron ?? "";
    message.remainedValue = object.remainedValue !== undefined && object.remainedValue !== null ? BigInt(object.remainedValue.toString()) : BigInt(0);
    message.lastUpdatedBlock = object.lastUpdatedBlock !== undefined && object.lastUpdatedBlock !== null ? BigInt(object.lastUpdatedBlock.toString()) : BigInt(0);
    message.maxValue = object.maxValue !== undefined && object.maxValue !== null ? BigInt(object.maxValue.toString()) : BigInt(0);
    return message;
  },
  fromProtoMsg(message: NeuronBandwidthProtoMsg): NeuronBandwidth {
    return NeuronBandwidth.decode(message.value);
  },
  toProto(message: NeuronBandwidth): Uint8Array {
    return NeuronBandwidth.encode(message).finish();
  },
  toProtoMsg(message: NeuronBandwidth): NeuronBandwidthProtoMsg {
    return {
      typeUrl: "/cyber.bandwidth.v1beta1.NeuronBandwidth",
      value: NeuronBandwidth.encode(message).finish()
    };
  }
};
function createBasePrice(): Price {
  return {
    price: ""
  };
}
export const Price = {
  typeUrl: "/cyber.bandwidth.v1beta1.Price",
  encode(message: Price, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.price !== "") {
      writer.uint32(10).string(Decimal.fromUserInput(message.price, 18).atomics);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Price {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePrice();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.price = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Price {
    return {
      price: isSet(object.price) ? String(object.price) : ""
    };
  },
  toJSON(message: Price): JsonSafe<Price> {
    const obj: any = {};
    message.price !== undefined && (obj.price = message.price);
    return obj;
  },
  fromPartial(object: Partial<Price>): Price {
    const message = createBasePrice();
    message.price = object.price ?? "";
    return message;
  },
  fromProtoMsg(message: PriceProtoMsg): Price {
    return Price.decode(message.value);
  },
  toProto(message: Price): Uint8Array {
    return Price.encode(message).finish();
  },
  toProtoMsg(message: Price): PriceProtoMsg {
    return {
      typeUrl: "/cyber.bandwidth.v1beta1.Price",
      value: Price.encode(message).finish()
    };
  }
};