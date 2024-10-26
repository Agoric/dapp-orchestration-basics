//@ts-nocheck
import { PageRequest, type PageRequestSDKType, PageResponse, type PageResponseSDKType } from "./pagination.js";
import { Params, type ParamsSDKType, RankedParticle, type RankedParticleSDKType } from "./types.js";
import { BinaryReader, BinaryWriter } from "../../../binary.js";
import {type JsonSafe } from "../../../json-safe.js";
import { isSet } from "../../../helpers.js";
export interface QueryParamsRequest {}
export interface QueryParamsRequestProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryParamsRequest";
  value: Uint8Array;
}
export interface QueryParamsRequestSDKType {}
export interface QueryParamsResponse {
  params: Params;
}
export interface QueryParamsResponseProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryParamsResponse";
  value: Uint8Array;
}
export interface QueryParamsResponseSDKType {
  params: ParamsSDKType;
}
export interface QueryRankRequest {
  particle: string;
}
export interface QueryRankRequestProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryRankRequest";
  value: Uint8Array;
}
export interface QueryRankRequestSDKType {
  particle: string;
}
export interface QueryRankResponse {
  rank: bigint;
}
export interface QueryRankResponseProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryRankResponse";
  value: Uint8Array;
}
export interface QueryRankResponseSDKType {
  rank: bigint;
}
export interface QuerySearchRequest {
  particle: string;
  pagination?: PageRequest;
}
export interface QuerySearchRequestProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QuerySearchRequest";
  value: Uint8Array;
}
export interface QuerySearchRequestSDKType {
  particle: string;
  pagination?: PageRequestSDKType;
}
export interface QuerySearchResponse {
  result: RankedParticle[];
  pagination?: PageResponse;
}
export interface QuerySearchResponseProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QuerySearchResponse";
  value: Uint8Array;
}
export interface QuerySearchResponseSDKType {
  result: RankedParticleSDKType[];
  pagination?: PageResponseSDKType;
}
export interface QueryTopRequest {
  pagination?: PageRequest;
}
export interface QueryTopRequestProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryTopRequest";
  value: Uint8Array;
}
export interface QueryTopRequestSDKType {
  pagination?: PageRequestSDKType;
}
export interface QueryIsLinkExistRequest {
  from: string;
  to: string;
  address: string;
}
export interface QueryIsLinkExistRequestProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryIsLinkExistRequest";
  value: Uint8Array;
}
export interface QueryIsLinkExistRequestSDKType {
  from: string;
  to: string;
  address: string;
}
export interface QueryIsAnyLinkExistRequest {
  from: string;
  to: string;
}
export interface QueryIsAnyLinkExistRequestProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryIsAnyLinkExistRequest";
  value: Uint8Array;
}
export interface QueryIsAnyLinkExistRequestSDKType {
  from: string;
  to: string;
}
export interface QueryLinkExistResponse {
  exist: boolean;
}
export interface QueryLinkExistResponseProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryLinkExistResponse";
  value: Uint8Array;
}
export interface QueryLinkExistResponseSDKType {
  exist: boolean;
}
export interface QueryNegentropyPartilceRequest {
  particle: string;
}
export interface QueryNegentropyPartilceRequestProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryNegentropyPartilceRequest";
  value: Uint8Array;
}
export interface QueryNegentropyPartilceRequestSDKType {
  particle: string;
}
export interface QueryNegentropyParticleResponse {
  entropy: bigint;
}
export interface QueryNegentropyParticleResponseProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryNegentropyParticleResponse";
  value: Uint8Array;
}
export interface QueryNegentropyParticleResponseSDKType {
  entropy: bigint;
}
export interface QueryNegentropyRequest {}
export interface QueryNegentropyRequestProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryNegentropyRequest";
  value: Uint8Array;
}
export interface QueryNegentropyRequestSDKType {}
export interface QueryNegentropyResponse {
  negentropy: bigint;
}
export interface QueryNegentropyResponseProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryNegentropyResponse";
  value: Uint8Array;
}
export interface QueryNegentropyResponseSDKType {
  negentropy: bigint;
}
export interface QueryKarmaRequest {
  neuron: string;
}
export interface QueryKarmaRequestProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryKarmaRequest";
  value: Uint8Array;
}
export interface QueryKarmaRequestSDKType {
  neuron: string;
}
export interface QueryKarmaResponse {
  karma: bigint;
}
export interface QueryKarmaResponseProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryKarmaResponse";
  value: Uint8Array;
}
export interface QueryKarmaResponseSDKType {
  karma: bigint;
}
function createBaseQueryParamsRequest(): QueryParamsRequest {
  return {};
}
export const QueryParamsRequest = {
  typeUrl: "/cyber.rank.v1beta1.QueryParamsRequest",
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
      typeUrl: "/cyber.rank.v1beta1.QueryParamsRequest",
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
  typeUrl: "/cyber.rank.v1beta1.QueryParamsResponse",
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
      typeUrl: "/cyber.rank.v1beta1.QueryParamsResponse",
      value: QueryParamsResponse.encode(message).finish()
    };
  }
};
function createBaseQueryRankRequest(): QueryRankRequest {
  return {
    particle: ""
  };
}
export const QueryRankRequest = {
  typeUrl: "/cyber.rank.v1beta1.QueryRankRequest",
  encode(message: QueryRankRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.particle !== "") {
      writer.uint32(10).string(message.particle);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryRankRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryRankRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.particle = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryRankRequest {
    return {
      particle: isSet(object.particle) ? String(object.particle) : ""
    };
  },
  toJSON(message: QueryRankRequest): JsonSafe<QueryRankRequest> {
    const obj: any = {};
    message.particle !== undefined && (obj.particle = message.particle);
    return obj;
  },
  fromPartial(object: Partial<QueryRankRequest>): QueryRankRequest {
    const message = createBaseQueryRankRequest();
    message.particle = object.particle ?? "";
    return message;
  },
  fromProtoMsg(message: QueryRankRequestProtoMsg): QueryRankRequest {
    return QueryRankRequest.decode(message.value);
  },
  toProto(message: QueryRankRequest): Uint8Array {
    return QueryRankRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryRankRequest): QueryRankRequestProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QueryRankRequest",
      value: QueryRankRequest.encode(message).finish()
    };
  }
};
function createBaseQueryRankResponse(): QueryRankResponse {
  return {
    rank: BigInt(0)
  };
}
export const QueryRankResponse = {
  typeUrl: "/cyber.rank.v1beta1.QueryRankResponse",
  encode(message: QueryRankResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.rank !== BigInt(0)) {
      writer.uint32(8).uint64(message.rank);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryRankResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryRankResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.rank = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryRankResponse {
    return {
      rank: isSet(object.rank) ? BigInt(object.rank.toString()) : BigInt(0)
    };
  },
  toJSON(message: QueryRankResponse): JsonSafe<QueryRankResponse> {
    const obj: any = {};
    message.rank !== undefined && (obj.rank = (message.rank || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<QueryRankResponse>): QueryRankResponse {
    const message = createBaseQueryRankResponse();
    message.rank = object.rank !== undefined && object.rank !== null ? BigInt(object.rank.toString()) : BigInt(0);
    return message;
  },
  fromProtoMsg(message: QueryRankResponseProtoMsg): QueryRankResponse {
    return QueryRankResponse.decode(message.value);
  },
  toProto(message: QueryRankResponse): Uint8Array {
    return QueryRankResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryRankResponse): QueryRankResponseProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QueryRankResponse",
      value: QueryRankResponse.encode(message).finish()
    };
  }
};
function createBaseQuerySearchRequest(): QuerySearchRequest {
  return {
    particle: "",
    pagination: undefined
  };
}
export const QuerySearchRequest = {
  typeUrl: "/cyber.rank.v1beta1.QuerySearchRequest",
  encode(message: QuerySearchRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.particle !== "") {
      writer.uint32(10).string(message.particle);
    }
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QuerySearchRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQuerySearchRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.particle = reader.string();
          break;
        case 2:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QuerySearchRequest {
    return {
      particle: isSet(object.particle) ? String(object.particle) : "",
      pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined
    };
  },
  toJSON(message: QuerySearchRequest): JsonSafe<QuerySearchRequest> {
    const obj: any = {};
    message.particle !== undefined && (obj.particle = message.particle);
    message.pagination !== undefined && (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QuerySearchRequest>): QuerySearchRequest {
    const message = createBaseQuerySearchRequest();
    message.particle = object.particle ?? "";
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageRequest.fromPartial(object.pagination) : undefined;
    return message;
  },
  fromProtoMsg(message: QuerySearchRequestProtoMsg): QuerySearchRequest {
    return QuerySearchRequest.decode(message.value);
  },
  toProto(message: QuerySearchRequest): Uint8Array {
    return QuerySearchRequest.encode(message).finish();
  },
  toProtoMsg(message: QuerySearchRequest): QuerySearchRequestProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QuerySearchRequest",
      value: QuerySearchRequest.encode(message).finish()
    };
  }
};
function createBaseQuerySearchResponse(): QuerySearchResponse {
  return {
    result: [],
    pagination: undefined
  };
}
export const QuerySearchResponse = {
  typeUrl: "/cyber.rank.v1beta1.QuerySearchResponse",
  encode(message: QuerySearchResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.result) {
      RankedParticle.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QuerySearchResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQuerySearchResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result.push(RankedParticle.decode(reader, reader.uint32()));
          break;
        case 2:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QuerySearchResponse {
    return {
      result: Array.isArray(object?.result) ? object.result.map((e: any) => RankedParticle.fromJSON(e)) : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined
    };
  },
  toJSON(message: QuerySearchResponse): JsonSafe<QuerySearchResponse> {
    const obj: any = {};
    if (message.result) {
      obj.result = message.result.map(e => e ? RankedParticle.toJSON(e) : undefined);
    } else {
      obj.result = [];
    }
    message.pagination !== undefined && (obj.pagination = message.pagination ? PageResponse.toJSON(message.pagination) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QuerySearchResponse>): QuerySearchResponse {
    const message = createBaseQuerySearchResponse();
    message.result = object.result?.map(e => RankedParticle.fromPartial(e)) || [];
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageResponse.fromPartial(object.pagination) : undefined;
    return message;
  },
  fromProtoMsg(message: QuerySearchResponseProtoMsg): QuerySearchResponse {
    return QuerySearchResponse.decode(message.value);
  },
  toProto(message: QuerySearchResponse): Uint8Array {
    return QuerySearchResponse.encode(message).finish();
  },
  toProtoMsg(message: QuerySearchResponse): QuerySearchResponseProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QuerySearchResponse",
      value: QuerySearchResponse.encode(message).finish()
    };
  }
};
function createBaseQueryTopRequest(): QueryTopRequest {
  return {
    pagination: undefined
  };
}
export const QueryTopRequest = {
  typeUrl: "/cyber.rank.v1beta1.QueryTopRequest",
  encode(message: QueryTopRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryTopRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryTopRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryTopRequest {
    return {
      pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined
    };
  },
  toJSON(message: QueryTopRequest): JsonSafe<QueryTopRequest> {
    const obj: any = {};
    message.pagination !== undefined && (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryTopRequest>): QueryTopRequest {
    const message = createBaseQueryTopRequest();
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageRequest.fromPartial(object.pagination) : undefined;
    return message;
  },
  fromProtoMsg(message: QueryTopRequestProtoMsg): QueryTopRequest {
    return QueryTopRequest.decode(message.value);
  },
  toProto(message: QueryTopRequest): Uint8Array {
    return QueryTopRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryTopRequest): QueryTopRequestProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QueryTopRequest",
      value: QueryTopRequest.encode(message).finish()
    };
  }
};
function createBaseQueryIsLinkExistRequest(): QueryIsLinkExistRequest {
  return {
    from: "",
    to: "",
    address: ""
  };
}
export const QueryIsLinkExistRequest = {
  typeUrl: "/cyber.rank.v1beta1.QueryIsLinkExistRequest",
  encode(message: QueryIsLinkExistRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.from !== "") {
      writer.uint32(10).string(message.from);
    }
    if (message.to !== "") {
      writer.uint32(18).string(message.to);
    }
    if (message.address !== "") {
      writer.uint32(26).string(message.address);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryIsLinkExistRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryIsLinkExistRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.from = reader.string();
          break;
        case 2:
          message.to = reader.string();
          break;
        case 3:
          message.address = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryIsLinkExistRequest {
    return {
      from: isSet(object.from) ? String(object.from) : "",
      to: isSet(object.to) ? String(object.to) : "",
      address: isSet(object.address) ? String(object.address) : ""
    };
  },
  toJSON(message: QueryIsLinkExistRequest): JsonSafe<QueryIsLinkExistRequest> {
    const obj: any = {};
    message.from !== undefined && (obj.from = message.from);
    message.to !== undefined && (obj.to = message.to);
    message.address !== undefined && (obj.address = message.address);
    return obj;
  },
  fromPartial(object: Partial<QueryIsLinkExistRequest>): QueryIsLinkExistRequest {
    const message = createBaseQueryIsLinkExistRequest();
    message.from = object.from ?? "";
    message.to = object.to ?? "";
    message.address = object.address ?? "";
    return message;
  },
  fromProtoMsg(message: QueryIsLinkExistRequestProtoMsg): QueryIsLinkExistRequest {
    return QueryIsLinkExistRequest.decode(message.value);
  },
  toProto(message: QueryIsLinkExistRequest): Uint8Array {
    return QueryIsLinkExistRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryIsLinkExistRequest): QueryIsLinkExistRequestProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QueryIsLinkExistRequest",
      value: QueryIsLinkExistRequest.encode(message).finish()
    };
  }
};
function createBaseQueryIsAnyLinkExistRequest(): QueryIsAnyLinkExistRequest {
  return {
    from: "",
    to: ""
  };
}
export const QueryIsAnyLinkExistRequest = {
  typeUrl: "/cyber.rank.v1beta1.QueryIsAnyLinkExistRequest",
  encode(message: QueryIsAnyLinkExistRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.from !== "") {
      writer.uint32(10).string(message.from);
    }
    if (message.to !== "") {
      writer.uint32(18).string(message.to);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryIsAnyLinkExistRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryIsAnyLinkExistRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.from = reader.string();
          break;
        case 2:
          message.to = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryIsAnyLinkExistRequest {
    return {
      from: isSet(object.from) ? String(object.from) : "",
      to: isSet(object.to) ? String(object.to) : ""
    };
  },
  toJSON(message: QueryIsAnyLinkExistRequest): JsonSafe<QueryIsAnyLinkExistRequest> {
    const obj: any = {};
    message.from !== undefined && (obj.from = message.from);
    message.to !== undefined && (obj.to = message.to);
    return obj;
  },
  fromPartial(object: Partial<QueryIsAnyLinkExistRequest>): QueryIsAnyLinkExistRequest {
    const message = createBaseQueryIsAnyLinkExistRequest();
    message.from = object.from ?? "";
    message.to = object.to ?? "";
    return message;
  },
  fromProtoMsg(message: QueryIsAnyLinkExistRequestProtoMsg): QueryIsAnyLinkExistRequest {
    return QueryIsAnyLinkExistRequest.decode(message.value);
  },
  toProto(message: QueryIsAnyLinkExistRequest): Uint8Array {
    return QueryIsAnyLinkExistRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryIsAnyLinkExistRequest): QueryIsAnyLinkExistRequestProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QueryIsAnyLinkExistRequest",
      value: QueryIsAnyLinkExistRequest.encode(message).finish()
    };
  }
};
function createBaseQueryLinkExistResponse(): QueryLinkExistResponse {
  return {
    exist: false
  };
}
export const QueryLinkExistResponse = {
  typeUrl: "/cyber.rank.v1beta1.QueryLinkExistResponse",
  encode(message: QueryLinkExistResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.exist === true) {
      writer.uint32(8).bool(message.exist);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryLinkExistResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryLinkExistResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.exist = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryLinkExistResponse {
    return {
      exist: isSet(object.exist) ? Boolean(object.exist) : false
    };
  },
  toJSON(message: QueryLinkExistResponse): JsonSafe<QueryLinkExistResponse> {
    const obj: any = {};
    message.exist !== undefined && (obj.exist = message.exist);
    return obj;
  },
  fromPartial(object: Partial<QueryLinkExistResponse>): QueryLinkExistResponse {
    const message = createBaseQueryLinkExistResponse();
    message.exist = object.exist ?? false;
    return message;
  },
  fromProtoMsg(message: QueryLinkExistResponseProtoMsg): QueryLinkExistResponse {
    return QueryLinkExistResponse.decode(message.value);
  },
  toProto(message: QueryLinkExistResponse): Uint8Array {
    return QueryLinkExistResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryLinkExistResponse): QueryLinkExistResponseProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QueryLinkExistResponse",
      value: QueryLinkExistResponse.encode(message).finish()
    };
  }
};
function createBaseQueryNegentropyPartilceRequest(): QueryNegentropyPartilceRequest {
  return {
    particle: ""
  };
}
export const QueryNegentropyPartilceRequest = {
  typeUrl: "/cyber.rank.v1beta1.QueryNegentropyPartilceRequest",
  encode(message: QueryNegentropyPartilceRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.particle !== "") {
      writer.uint32(10).string(message.particle);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryNegentropyPartilceRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryNegentropyPartilceRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.particle = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryNegentropyPartilceRequest {
    return {
      particle: isSet(object.particle) ? String(object.particle) : ""
    };
  },
  toJSON(message: QueryNegentropyPartilceRequest): JsonSafe<QueryNegentropyPartilceRequest> {
    const obj: any = {};
    message.particle !== undefined && (obj.particle = message.particle);
    return obj;
  },
  fromPartial(object: Partial<QueryNegentropyPartilceRequest>): QueryNegentropyPartilceRequest {
    const message = createBaseQueryNegentropyPartilceRequest();
    message.particle = object.particle ?? "";
    return message;
  },
  fromProtoMsg(message: QueryNegentropyPartilceRequestProtoMsg): QueryNegentropyPartilceRequest {
    return QueryNegentropyPartilceRequest.decode(message.value);
  },
  toProto(message: QueryNegentropyPartilceRequest): Uint8Array {
    return QueryNegentropyPartilceRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryNegentropyPartilceRequest): QueryNegentropyPartilceRequestProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QueryNegentropyPartilceRequest",
      value: QueryNegentropyPartilceRequest.encode(message).finish()
    };
  }
};
function createBaseQueryNegentropyParticleResponse(): QueryNegentropyParticleResponse {
  return {
    entropy: BigInt(0)
  };
}
export const QueryNegentropyParticleResponse = {
  typeUrl: "/cyber.rank.v1beta1.QueryNegentropyParticleResponse",
  encode(message: QueryNegentropyParticleResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.entropy !== BigInt(0)) {
      writer.uint32(8).uint64(message.entropy);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryNegentropyParticleResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryNegentropyParticleResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.entropy = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryNegentropyParticleResponse {
    return {
      entropy: isSet(object.entropy) ? BigInt(object.entropy.toString()) : BigInt(0)
    };
  },
  toJSON(message: QueryNegentropyParticleResponse): JsonSafe<QueryNegentropyParticleResponse> {
    const obj: any = {};
    message.entropy !== undefined && (obj.entropy = (message.entropy || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<QueryNegentropyParticleResponse>): QueryNegentropyParticleResponse {
    const message = createBaseQueryNegentropyParticleResponse();
    message.entropy = object.entropy !== undefined && object.entropy !== null ? BigInt(object.entropy.toString()) : BigInt(0);
    return message;
  },
  fromProtoMsg(message: QueryNegentropyParticleResponseProtoMsg): QueryNegentropyParticleResponse {
    return QueryNegentropyParticleResponse.decode(message.value);
  },
  toProto(message: QueryNegentropyParticleResponse): Uint8Array {
    return QueryNegentropyParticleResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryNegentropyParticleResponse): QueryNegentropyParticleResponseProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QueryNegentropyParticleResponse",
      value: QueryNegentropyParticleResponse.encode(message).finish()
    };
  }
};
function createBaseQueryNegentropyRequest(): QueryNegentropyRequest {
  return {};
}
export const QueryNegentropyRequest = {
  typeUrl: "/cyber.rank.v1beta1.QueryNegentropyRequest",
  encode(_: QueryNegentropyRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryNegentropyRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryNegentropyRequest();
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
  fromJSON(_: any): QueryNegentropyRequest {
    return {};
  },
  toJSON(_: QueryNegentropyRequest): JsonSafe<QueryNegentropyRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<QueryNegentropyRequest>): QueryNegentropyRequest {
    const message = createBaseQueryNegentropyRequest();
    return message;
  },
  fromProtoMsg(message: QueryNegentropyRequestProtoMsg): QueryNegentropyRequest {
    return QueryNegentropyRequest.decode(message.value);
  },
  toProto(message: QueryNegentropyRequest): Uint8Array {
    return QueryNegentropyRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryNegentropyRequest): QueryNegentropyRequestProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QueryNegentropyRequest",
      value: QueryNegentropyRequest.encode(message).finish()
    };
  }
};
function createBaseQueryNegentropyResponse(): QueryNegentropyResponse {
  return {
    negentropy: BigInt(0)
  };
}
export const QueryNegentropyResponse = {
  typeUrl: "/cyber.rank.v1beta1.QueryNegentropyResponse",
  encode(message: QueryNegentropyResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.negentropy !== BigInt(0)) {
      writer.uint32(8).uint64(message.negentropy);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryNegentropyResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryNegentropyResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.negentropy = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryNegentropyResponse {
    return {
      negentropy: isSet(object.negentropy) ? BigInt(object.negentropy.toString()) : BigInt(0)
    };
  },
  toJSON(message: QueryNegentropyResponse): JsonSafe<QueryNegentropyResponse> {
    const obj: any = {};
    message.negentropy !== undefined && (obj.negentropy = (message.negentropy || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<QueryNegentropyResponse>): QueryNegentropyResponse {
    const message = createBaseQueryNegentropyResponse();
    message.negentropy = object.negentropy !== undefined && object.negentropy !== null ? BigInt(object.negentropy.toString()) : BigInt(0);
    return message;
  },
  fromProtoMsg(message: QueryNegentropyResponseProtoMsg): QueryNegentropyResponse {
    return QueryNegentropyResponse.decode(message.value);
  },
  toProto(message: QueryNegentropyResponse): Uint8Array {
    return QueryNegentropyResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryNegentropyResponse): QueryNegentropyResponseProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QueryNegentropyResponse",
      value: QueryNegentropyResponse.encode(message).finish()
    };
  }
};
function createBaseQueryKarmaRequest(): QueryKarmaRequest {
  return {
    neuron: ""
  };
}
export const QueryKarmaRequest = {
  typeUrl: "/cyber.rank.v1beta1.QueryKarmaRequest",
  encode(message: QueryKarmaRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.neuron !== "") {
      writer.uint32(10).string(message.neuron);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryKarmaRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryKarmaRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.neuron = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryKarmaRequest {
    return {
      neuron: isSet(object.neuron) ? String(object.neuron) : ""
    };
  },
  toJSON(message: QueryKarmaRequest): JsonSafe<QueryKarmaRequest> {
    const obj: any = {};
    message.neuron !== undefined && (obj.neuron = message.neuron);
    return obj;
  },
  fromPartial(object: Partial<QueryKarmaRequest>): QueryKarmaRequest {
    const message = createBaseQueryKarmaRequest();
    message.neuron = object.neuron ?? "";
    return message;
  },
  fromProtoMsg(message: QueryKarmaRequestProtoMsg): QueryKarmaRequest {
    return QueryKarmaRequest.decode(message.value);
  },
  toProto(message: QueryKarmaRequest): Uint8Array {
    return QueryKarmaRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryKarmaRequest): QueryKarmaRequestProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QueryKarmaRequest",
      value: QueryKarmaRequest.encode(message).finish()
    };
  }
};
function createBaseQueryKarmaResponse(): QueryKarmaResponse {
  return {
    karma: BigInt(0)
  };
}
export const QueryKarmaResponse = {
  typeUrl: "/cyber.rank.v1beta1.QueryKarmaResponse",
  encode(message: QueryKarmaResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.karma !== BigInt(0)) {
      writer.uint32(8).uint64(message.karma);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryKarmaResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryKarmaResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.karma = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryKarmaResponse {
    return {
      karma: isSet(object.karma) ? BigInt(object.karma.toString()) : BigInt(0)
    };
  },
  toJSON(message: QueryKarmaResponse): JsonSafe<QueryKarmaResponse> {
    const obj: any = {};
    message.karma !== undefined && (obj.karma = (message.karma || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<QueryKarmaResponse>): QueryKarmaResponse {
    const message = createBaseQueryKarmaResponse();
    message.karma = object.karma !== undefined && object.karma !== null ? BigInt(object.karma.toString()) : BigInt(0);
    return message;
  },
  fromProtoMsg(message: QueryKarmaResponseProtoMsg): QueryKarmaResponse {
    return QueryKarmaResponse.decode(message.value);
  },
  toProto(message: QueryKarmaResponse): Uint8Array {
    return QueryKarmaResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryKarmaResponse): QueryKarmaResponseProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QueryKarmaResponse",
      value: QueryKarmaResponse.encode(message).finish()
    };
  }
};