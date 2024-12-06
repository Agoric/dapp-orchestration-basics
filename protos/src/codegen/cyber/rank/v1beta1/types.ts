//@ts-nocheck
import { BinaryReader, BinaryWriter } from "../../../binary.js";
import { Decimal, isSet } from "../../../helpers.js";
import {type JsonSafe } from "../../../json-safe.js";
export interface Params {
  calculationPeriod: bigint;
  dampingFactor: string;
  tolerance: string;
}
export interface ParamsProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.Params";
  value: Uint8Array;
}
export interface ParamsSDKType {
  calculation_period: bigint;
  damping_factor: string;
  tolerance: string;
}
export interface RankedParticle {
  particle: string;
  rank: bigint;
}
export interface RankedParticleProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.RankedParticle";
  value: Uint8Array;
}
export interface RankedParticleSDKType {
  particle: string;
  rank: bigint;
}
function createBaseParams(): Params {
  return {
    calculationPeriod: BigInt(0),
    dampingFactor: "",
    tolerance: ""
  };
}
export const Params = {
  typeUrl: "/cyber.rank.v1beta1.Params",
  encode(message: Params, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.calculationPeriod !== BigInt(0)) {
      writer.uint32(8).int64(message.calculationPeriod);
    }
    if (message.dampingFactor !== "") {
      writer.uint32(18).string(Decimal.fromUserInput(message.dampingFactor, 18).atomics);
    }
    if (message.tolerance !== "") {
      writer.uint32(26).string(Decimal.fromUserInput(message.tolerance, 18).atomics);
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
          message.calculationPeriod = reader.int64();
          break;
        case 2:
          message.dampingFactor = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        case 3:
          message.tolerance = Decimal.fromAtomics(reader.string(), 18).toString();
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
      calculationPeriod: isSet(object.calculationPeriod) ? BigInt(object.calculationPeriod.toString()) : BigInt(0),
      dampingFactor: isSet(object.dampingFactor) ? String(object.dampingFactor) : "",
      tolerance: isSet(object.tolerance) ? String(object.tolerance) : ""
    };
  },
  toJSON(message: Params): JsonSafe<Params> {
    const obj: any = {};
    message.calculationPeriod !== undefined && (obj.calculationPeriod = (message.calculationPeriod || BigInt(0)).toString());
    message.dampingFactor !== undefined && (obj.dampingFactor = message.dampingFactor);
    message.tolerance !== undefined && (obj.tolerance = message.tolerance);
    return obj;
  },
  fromPartial(object: Partial<Params>): Params {
    const message = createBaseParams();
    message.calculationPeriod = object.calculationPeriod !== undefined && object.calculationPeriod !== null ? BigInt(object.calculationPeriod.toString()) : BigInt(0);
    message.dampingFactor = object.dampingFactor ?? "";
    message.tolerance = object.tolerance ?? "";
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
      typeUrl: "/cyber.rank.v1beta1.Params",
      value: Params.encode(message).finish()
    };
  }
};
function createBaseRankedParticle(): RankedParticle {
  return {
    particle: "",
    rank: BigInt(0)
  };
}
export const RankedParticle = {
  typeUrl: "/cyber.rank.v1beta1.RankedParticle",
  encode(message: RankedParticle, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.particle !== "") {
      writer.uint32(10).string(message.particle);
    }
    if (message.rank !== BigInt(0)) {
      writer.uint32(16).uint64(message.rank);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): RankedParticle {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRankedParticle();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.particle = reader.string();
          break;
        case 2:
          message.rank = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): RankedParticle {
    return {
      particle: isSet(object.particle) ? String(object.particle) : "",
      rank: isSet(object.rank) ? BigInt(object.rank.toString()) : BigInt(0)
    };
  },
  toJSON(message: RankedParticle): JsonSafe<RankedParticle> {
    const obj: any = {};
    message.particle !== undefined && (obj.particle = message.particle);
    message.rank !== undefined && (obj.rank = (message.rank || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<RankedParticle>): RankedParticle {
    const message = createBaseRankedParticle();
    message.particle = object.particle ?? "";
    message.rank = object.rank !== undefined && object.rank !== null ? BigInt(object.rank.toString()) : BigInt(0);
    return message;
  },
  fromProtoMsg(message: RankedParticleProtoMsg): RankedParticle {
    return RankedParticle.decode(message.value);
  },
  toProto(message: RankedParticle): Uint8Array {
    return RankedParticle.encode(message).finish();
  },
  toProtoMsg(message: RankedParticle): RankedParticleProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.RankedParticle",
      value: RankedParticle.encode(message).finish()
    };
  }
};