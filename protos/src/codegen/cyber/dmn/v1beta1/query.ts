//@ts-nocheck
import { Params, type ParamsSDKType, Thought, type ThoughtSDKType, ThoughtStats, type ThoughtStatsSDKType } from "./types.js";
import { Coin, type CoinSDKType } from "../../../cosmos/base/v1beta1/coin.js";
import { BinaryReader, BinaryWriter } from "../../../binary.js";
import {type JsonSafe } from "../../../json-safe.js";
import { isSet } from "../../../helpers.js";
export interface QueryParamsRequest {}
export interface QueryParamsRequestProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.QueryParamsRequest";
  value: Uint8Array;
}
export interface QueryParamsRequestSDKType {}
export interface QueryParamsResponse {
  params: Params;
}
export interface QueryParamsResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.QueryParamsResponse";
  value: Uint8Array;
}
export interface QueryParamsResponseSDKType {
  params: ParamsSDKType;
}
export interface QueryThoughtParamsRequest {
  program: string;
  name: string;
}
export interface QueryThoughtParamsRequestProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtParamsRequest";
  value: Uint8Array;
}
export interface QueryThoughtParamsRequestSDKType {
  program: string;
  name: string;
}
export interface QueryThoughtResponse {
  thought: Thought;
}
export interface QueryThoughtResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtResponse";
  value: Uint8Array;
}
export interface QueryThoughtResponseSDKType {
  thought: ThoughtSDKType;
}
export interface QueryThoughtStatsResponse {
  thoughtStats: ThoughtStats;
}
export interface QueryThoughtStatsResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtStatsResponse";
  value: Uint8Array;
}
export interface QueryThoughtStatsResponseSDKType {
  thought_stats: ThoughtStatsSDKType;
}
export interface QueryThoughtsRequest {}
export interface QueryThoughtsRequestProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsRequest";
  value: Uint8Array;
}
export interface QueryThoughtsRequestSDKType {}
export interface QueryThoughtsResponse {
  thoughts: Thought[];
}
export interface QueryThoughtsResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsResponse";
  value: Uint8Array;
}
export interface QueryThoughtsResponseSDKType {
  thoughts: ThoughtSDKType[];
}
export interface QueryThoughtsStatsRequest {}
export interface QueryThoughtsStatsRequestProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsStatsRequest";
  value: Uint8Array;
}
export interface QueryThoughtsStatsRequestSDKType {}
export interface QueryThoughtsStatsResponse {
  thoughtsStats: ThoughtStats[];
}
export interface QueryThoughtsStatsResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsStatsResponse";
  value: Uint8Array;
}
export interface QueryThoughtsStatsResponseSDKType {
  thoughts_stats: ThoughtStatsSDKType[];
}
export interface QueryThoughtsFeesRequest {}
export interface QueryThoughtsFeesRequestProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsFeesRequest";
  value: Uint8Array;
}
export interface QueryThoughtsFeesRequestSDKType {}
export interface QueryThoughtsFeesResponse {
  fees: Coin[];
}
export interface QueryThoughtsFeesResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsFeesResponse";
  value: Uint8Array;
}
export interface QueryThoughtsFeesResponseSDKType {
  fees: CoinSDKType[];
}
function createBaseQueryParamsRequest(): QueryParamsRequest {
  return {};
}
export const QueryParamsRequest = {
  typeUrl: "/cyber.dmn.v1beta1.QueryParamsRequest",
  encode(_: QueryParamsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryParamsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryParamsRequest();
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
  fromJSON(_: any): QueryParamsRequest {
    return {};
  },
  toJSON(_: QueryParamsRequest): JsonSafe<QueryParamsRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<QueryParamsRequest>): QueryParamsRequest {
    const message = createBaseQueryParamsRequest();
    return message;
  },
  fromProtoMsg(message: QueryParamsRequestProtoMsg): QueryParamsRequest {
    return QueryParamsRequest.decode(message.value);
  },
  toProto(message: QueryParamsRequest): Uint8Array {
    return QueryParamsRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryParamsRequest): QueryParamsRequestProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.QueryParamsRequest",
      value: QueryParamsRequest.encode(message).finish()
    };
  }
};
function createBaseQueryParamsResponse(): QueryParamsResponse {
  return {
    params: Params.fromPartial({})
  };
}
export const QueryParamsResponse = {
  typeUrl: "/cyber.dmn.v1beta1.QueryParamsResponse",
  encode(message: QueryParamsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryParamsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryParamsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryParamsResponse {
    return {
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined
    };
  },
  toJSON(message: QueryParamsResponse): JsonSafe<QueryParamsResponse> {
    const obj: any = {};
    message.params !== undefined && (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryParamsResponse>): QueryParamsResponse {
    const message = createBaseQueryParamsResponse();
    message.params = object.params !== undefined && object.params !== null ? Params.fromPartial(object.params) : undefined;
    return message;
  },
  fromProtoMsg(message: QueryParamsResponseProtoMsg): QueryParamsResponse {
    return QueryParamsResponse.decode(message.value);
  },
  toProto(message: QueryParamsResponse): Uint8Array {
    return QueryParamsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryParamsResponse): QueryParamsResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.QueryParamsResponse",
      value: QueryParamsResponse.encode(message).finish()
    };
  }
};
function createBaseQueryThoughtParamsRequest(): QueryThoughtParamsRequest {
  return {
    program: "",
    name: ""
  };
}
export const QueryThoughtParamsRequest = {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtParamsRequest",
  encode(message: QueryThoughtParamsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.program !== "") {
      writer.uint32(10).string(message.program);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryThoughtParamsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryThoughtParamsRequest();
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
  fromJSON(object: any): QueryThoughtParamsRequest {
    return {
      program: isSet(object.program) ? String(object.program) : "",
      name: isSet(object.name) ? String(object.name) : ""
    };
  },
  toJSON(message: QueryThoughtParamsRequest): JsonSafe<QueryThoughtParamsRequest> {
    const obj: any = {};
    message.program !== undefined && (obj.program = message.program);
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },
  fromPartial(object: Partial<QueryThoughtParamsRequest>): QueryThoughtParamsRequest {
    const message = createBaseQueryThoughtParamsRequest();
    message.program = object.program ?? "";
    message.name = object.name ?? "";
    return message;
  },
  fromProtoMsg(message: QueryThoughtParamsRequestProtoMsg): QueryThoughtParamsRequest {
    return QueryThoughtParamsRequest.decode(message.value);
  },
  toProto(message: QueryThoughtParamsRequest): Uint8Array {
    return QueryThoughtParamsRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryThoughtParamsRequest): QueryThoughtParamsRequestProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.QueryThoughtParamsRequest",
      value: QueryThoughtParamsRequest.encode(message).finish()
    };
  }
};
function createBaseQueryThoughtResponse(): QueryThoughtResponse {
  return {
    thought: Thought.fromPartial({})
  };
}
export const QueryThoughtResponse = {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtResponse",
  encode(message: QueryThoughtResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.thought !== undefined) {
      Thought.encode(message.thought, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryThoughtResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryThoughtResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.thought = Thought.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryThoughtResponse {
    return {
      thought: isSet(object.thought) ? Thought.fromJSON(object.thought) : undefined
    };
  },
  toJSON(message: QueryThoughtResponse): JsonSafe<QueryThoughtResponse> {
    const obj: any = {};
    message.thought !== undefined && (obj.thought = message.thought ? Thought.toJSON(message.thought) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryThoughtResponse>): QueryThoughtResponse {
    const message = createBaseQueryThoughtResponse();
    message.thought = object.thought !== undefined && object.thought !== null ? Thought.fromPartial(object.thought) : undefined;
    return message;
  },
  fromProtoMsg(message: QueryThoughtResponseProtoMsg): QueryThoughtResponse {
    return QueryThoughtResponse.decode(message.value);
  },
  toProto(message: QueryThoughtResponse): Uint8Array {
    return QueryThoughtResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryThoughtResponse): QueryThoughtResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.QueryThoughtResponse",
      value: QueryThoughtResponse.encode(message).finish()
    };
  }
};
function createBaseQueryThoughtStatsResponse(): QueryThoughtStatsResponse {
  return {
    thoughtStats: ThoughtStats.fromPartial({})
  };
}
export const QueryThoughtStatsResponse = {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtStatsResponse",
  encode(message: QueryThoughtStatsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.thoughtStats !== undefined) {
      ThoughtStats.encode(message.thoughtStats, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryThoughtStatsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryThoughtStatsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.thoughtStats = ThoughtStats.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryThoughtStatsResponse {
    return {
      thoughtStats: isSet(object.thoughtStats) ? ThoughtStats.fromJSON(object.thoughtStats) : undefined
    };
  },
  toJSON(message: QueryThoughtStatsResponse): JsonSafe<QueryThoughtStatsResponse> {
    const obj: any = {};
    message.thoughtStats !== undefined && (obj.thoughtStats = message.thoughtStats ? ThoughtStats.toJSON(message.thoughtStats) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryThoughtStatsResponse>): QueryThoughtStatsResponse {
    const message = createBaseQueryThoughtStatsResponse();
    message.thoughtStats = object.thoughtStats !== undefined && object.thoughtStats !== null ? ThoughtStats.fromPartial(object.thoughtStats) : undefined;
    return message;
  },
  fromProtoMsg(message: QueryThoughtStatsResponseProtoMsg): QueryThoughtStatsResponse {
    return QueryThoughtStatsResponse.decode(message.value);
  },
  toProto(message: QueryThoughtStatsResponse): Uint8Array {
    return QueryThoughtStatsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryThoughtStatsResponse): QueryThoughtStatsResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.QueryThoughtStatsResponse",
      value: QueryThoughtStatsResponse.encode(message).finish()
    };
  }
};
function createBaseQueryThoughtsRequest(): QueryThoughtsRequest {
  return {};
}
export const QueryThoughtsRequest = {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsRequest",
  encode(_: QueryThoughtsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryThoughtsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryThoughtsRequest();
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
  fromJSON(_: any): QueryThoughtsRequest {
    return {};
  },
  toJSON(_: QueryThoughtsRequest): JsonSafe<QueryThoughtsRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<QueryThoughtsRequest>): QueryThoughtsRequest {
    const message = createBaseQueryThoughtsRequest();
    return message;
  },
  fromProtoMsg(message: QueryThoughtsRequestProtoMsg): QueryThoughtsRequest {
    return QueryThoughtsRequest.decode(message.value);
  },
  toProto(message: QueryThoughtsRequest): Uint8Array {
    return QueryThoughtsRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryThoughtsRequest): QueryThoughtsRequestProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsRequest",
      value: QueryThoughtsRequest.encode(message).finish()
    };
  }
};
function createBaseQueryThoughtsResponse(): QueryThoughtsResponse {
  return {
    thoughts: []
  };
}
export const QueryThoughtsResponse = {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsResponse",
  encode(message: QueryThoughtsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.thoughts) {
      Thought.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryThoughtsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryThoughtsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.thoughts.push(Thought.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryThoughtsResponse {
    return {
      thoughts: Array.isArray(object?.thoughts) ? object.thoughts.map((e: any) => Thought.fromJSON(e)) : []
    };
  },
  toJSON(message: QueryThoughtsResponse): JsonSafe<QueryThoughtsResponse> {
    const obj: any = {};
    if (message.thoughts) {
      obj.thoughts = message.thoughts.map(e => e ? Thought.toJSON(e) : undefined);
    } else {
      obj.thoughts = [];
    }
    return obj;
  },
  fromPartial(object: Partial<QueryThoughtsResponse>): QueryThoughtsResponse {
    const message = createBaseQueryThoughtsResponse();
    message.thoughts = object.thoughts?.map(e => Thought.fromPartial(e)) || [];
    return message;
  },
  fromProtoMsg(message: QueryThoughtsResponseProtoMsg): QueryThoughtsResponse {
    return QueryThoughtsResponse.decode(message.value);
  },
  toProto(message: QueryThoughtsResponse): Uint8Array {
    return QueryThoughtsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryThoughtsResponse): QueryThoughtsResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsResponse",
      value: QueryThoughtsResponse.encode(message).finish()
    };
  }
};
function createBaseQueryThoughtsStatsRequest(): QueryThoughtsStatsRequest {
  return {};
}
export const QueryThoughtsStatsRequest = {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsStatsRequest",
  encode(_: QueryThoughtsStatsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryThoughtsStatsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryThoughtsStatsRequest();
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
  fromJSON(_: any): QueryThoughtsStatsRequest {
    return {};
  },
  toJSON(_: QueryThoughtsStatsRequest): JsonSafe<QueryThoughtsStatsRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<QueryThoughtsStatsRequest>): QueryThoughtsStatsRequest {
    const message = createBaseQueryThoughtsStatsRequest();
    return message;
  },
  fromProtoMsg(message: QueryThoughtsStatsRequestProtoMsg): QueryThoughtsStatsRequest {
    return QueryThoughtsStatsRequest.decode(message.value);
  },
  toProto(message: QueryThoughtsStatsRequest): Uint8Array {
    return QueryThoughtsStatsRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryThoughtsStatsRequest): QueryThoughtsStatsRequestProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsStatsRequest",
      value: QueryThoughtsStatsRequest.encode(message).finish()
    };
  }
};
function createBaseQueryThoughtsStatsResponse(): QueryThoughtsStatsResponse {
  return {
    thoughtsStats: []
  };
}
export const QueryThoughtsStatsResponse = {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsStatsResponse",
  encode(message: QueryThoughtsStatsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.thoughtsStats) {
      ThoughtStats.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryThoughtsStatsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryThoughtsStatsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.thoughtsStats.push(ThoughtStats.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryThoughtsStatsResponse {
    return {
      thoughtsStats: Array.isArray(object?.thoughtsStats) ? object.thoughtsStats.map((e: any) => ThoughtStats.fromJSON(e)) : []
    };
  },
  toJSON(message: QueryThoughtsStatsResponse): JsonSafe<QueryThoughtsStatsResponse> {
    const obj: any = {};
    if (message.thoughtsStats) {
      obj.thoughtsStats = message.thoughtsStats.map(e => e ? ThoughtStats.toJSON(e) : undefined);
    } else {
      obj.thoughtsStats = [];
    }
    return obj;
  },
  fromPartial(object: Partial<QueryThoughtsStatsResponse>): QueryThoughtsStatsResponse {
    const message = createBaseQueryThoughtsStatsResponse();
    message.thoughtsStats = object.thoughtsStats?.map(e => ThoughtStats.fromPartial(e)) || [];
    return message;
  },
  fromProtoMsg(message: QueryThoughtsStatsResponseProtoMsg): QueryThoughtsStatsResponse {
    return QueryThoughtsStatsResponse.decode(message.value);
  },
  toProto(message: QueryThoughtsStatsResponse): Uint8Array {
    return QueryThoughtsStatsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryThoughtsStatsResponse): QueryThoughtsStatsResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsStatsResponse",
      value: QueryThoughtsStatsResponse.encode(message).finish()
    };
  }
};
function createBaseQueryThoughtsFeesRequest(): QueryThoughtsFeesRequest {
  return {};
}
export const QueryThoughtsFeesRequest = {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsFeesRequest",
  encode(_: QueryThoughtsFeesRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryThoughtsFeesRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryThoughtsFeesRequest();
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
  fromJSON(_: any): QueryThoughtsFeesRequest {
    return {};
  },
  toJSON(_: QueryThoughtsFeesRequest): JsonSafe<QueryThoughtsFeesRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<QueryThoughtsFeesRequest>): QueryThoughtsFeesRequest {
    const message = createBaseQueryThoughtsFeesRequest();
    return message;
  },
  fromProtoMsg(message: QueryThoughtsFeesRequestProtoMsg): QueryThoughtsFeesRequest {
    return QueryThoughtsFeesRequest.decode(message.value);
  },
  toProto(message: QueryThoughtsFeesRequest): Uint8Array {
    return QueryThoughtsFeesRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryThoughtsFeesRequest): QueryThoughtsFeesRequestProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsFeesRequest",
      value: QueryThoughtsFeesRequest.encode(message).finish()
    };
  }
};
function createBaseQueryThoughtsFeesResponse(): QueryThoughtsFeesResponse {
  return {
    fees: []
  };
}
export const QueryThoughtsFeesResponse = {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsFeesResponse",
  encode(message: QueryThoughtsFeesResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.fees) {
      Coin.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryThoughtsFeesResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryThoughtsFeesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 3:
          message.fees.push(Coin.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryThoughtsFeesResponse {
    return {
      fees: Array.isArray(object?.fees) ? object.fees.map((e: any) => Coin.fromJSON(e)) : []
    };
  },
  toJSON(message: QueryThoughtsFeesResponse): JsonSafe<QueryThoughtsFeesResponse> {
    const obj: any = {};
    if (message.fees) {
      obj.fees = message.fees.map(e => e ? Coin.toJSON(e) : undefined);
    } else {
      obj.fees = [];
    }
    return obj;
  },
  fromPartial(object: Partial<QueryThoughtsFeesResponse>): QueryThoughtsFeesResponse {
    const message = createBaseQueryThoughtsFeesResponse();
    message.fees = object.fees?.map(e => Coin.fromPartial(e)) || [];
    return message;
  },
  fromProtoMsg(message: QueryThoughtsFeesResponseProtoMsg): QueryThoughtsFeesResponse {
    return QueryThoughtsFeesResponse.decode(message.value);
  },
  toProto(message: QueryThoughtsFeesResponse): Uint8Array {
    return QueryThoughtsFeesResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryThoughtsFeesResponse): QueryThoughtsFeesResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsFeesResponse",
      value: QueryThoughtsFeesResponse.encode(message).finish()
    };
  }
};