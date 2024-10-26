//@ts-nocheck
import { BinaryReader, BinaryWriter } from "../../../binary.js";
import {type JsonSafe } from "../../../json-safe.js";
import { isSet } from "../../../helpers.js";
export interface QueryGraphStatsRequest {}
export interface QueryGraphStatsRequestProtoMsg {
  typeUrl: "/cyber.graph.v1beta1.QueryGraphStatsRequest";
  value: Uint8Array;
}
export interface QueryGraphStatsRequestSDKType {}
export interface QueryGraphStatsResponse {
  cyberlinks: bigint;
  particles: bigint;
}
export interface QueryGraphStatsResponseProtoMsg {
  typeUrl: "/cyber.graph.v1beta1.QueryGraphStatsResponse";
  value: Uint8Array;
}
export interface QueryGraphStatsResponseSDKType {
  cyberlinks: bigint;
  particles: bigint;
}
function createBaseQueryGraphStatsRequest(): QueryGraphStatsRequest {
  return {};
}
export const QueryGraphStatsRequest = {
  typeUrl: "/cyber.graph.v1beta1.QueryGraphStatsRequest",
  encode(_: QueryGraphStatsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryGraphStatsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGraphStatsRequest();
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
  fromJSON(_: any): QueryGraphStatsRequest {
    return {};
  },
  toJSON(_: QueryGraphStatsRequest): JsonSafe<QueryGraphStatsRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<QueryGraphStatsRequest>): QueryGraphStatsRequest {
    const message = createBaseQueryGraphStatsRequest();
    return message;
  },
  fromProtoMsg(message: QueryGraphStatsRequestProtoMsg): QueryGraphStatsRequest {
    return QueryGraphStatsRequest.decode(message.value);
  },
  toProto(message: QueryGraphStatsRequest): Uint8Array {
    return QueryGraphStatsRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryGraphStatsRequest): QueryGraphStatsRequestProtoMsg {
    return {
      typeUrl: "/cyber.graph.v1beta1.QueryGraphStatsRequest",
      value: QueryGraphStatsRequest.encode(message).finish()
    };
  }
};
function createBaseQueryGraphStatsResponse(): QueryGraphStatsResponse {
  return {
    cyberlinks: BigInt(0),
    particles: BigInt(0)
  };
}
export const QueryGraphStatsResponse = {
  typeUrl: "/cyber.graph.v1beta1.QueryGraphStatsResponse",
  encode(message: QueryGraphStatsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.cyberlinks !== BigInt(0)) {
      writer.uint32(8).uint64(message.cyberlinks);
    }
    if (message.particles !== BigInt(0)) {
      writer.uint32(16).uint64(message.particles);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryGraphStatsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGraphStatsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.cyberlinks = reader.uint64();
          break;
        case 2:
          message.particles = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryGraphStatsResponse {
    return {
      cyberlinks: isSet(object.cyberlinks) ? BigInt(object.cyberlinks.toString()) : BigInt(0),
      particles: isSet(object.particles) ? BigInt(object.particles.toString()) : BigInt(0)
    };
  },
  toJSON(message: QueryGraphStatsResponse): JsonSafe<QueryGraphStatsResponse> {
    const obj: any = {};
    message.cyberlinks !== undefined && (obj.cyberlinks = (message.cyberlinks || BigInt(0)).toString());
    message.particles !== undefined && (obj.particles = (message.particles || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<QueryGraphStatsResponse>): QueryGraphStatsResponse {
    const message = createBaseQueryGraphStatsResponse();
    message.cyberlinks = object.cyberlinks !== undefined && object.cyberlinks !== null ? BigInt(object.cyberlinks.toString()) : BigInt(0);
    message.particles = object.particles !== undefined && object.particles !== null ? BigInt(object.particles.toString()) : BigInt(0);
    return message;
  },
  fromProtoMsg(message: QueryGraphStatsResponseProtoMsg): QueryGraphStatsResponse {
    return QueryGraphStatsResponse.decode(message.value);
  },
  toProto(message: QueryGraphStatsResponse): Uint8Array {
    return QueryGraphStatsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryGraphStatsResponse): QueryGraphStatsResponseProtoMsg {
    return {
      typeUrl: "/cyber.graph.v1beta1.QueryGraphStatsResponse",
      value: QueryGraphStatsResponse.encode(message).finish()
    };
  }
};