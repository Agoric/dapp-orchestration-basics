//@ts-nocheck
import { Coin, type CoinSDKType } from "../../../cosmos/base/v1beta1/coin.js";
import { Params, type ParamsSDKType } from "./types.js";
import { BinaryReader, BinaryWriter } from "../../../binary.js";
import {type JsonSafe } from "../../../json-safe.js";
import { isSet } from "../../../helpers.js";
export interface QueryParamsRequest {}
export interface QueryParamsRequestProtoMsg {
  typeUrl: "/cyber.resources.v1beta1.QueryParamsRequest";
  value: Uint8Array;
}
export interface QueryParamsRequestSDKType {}
export interface QueryParamsResponse {
  params: Params;
}
export interface QueryParamsResponseProtoMsg {
  typeUrl: "/cyber.resources.v1beta1.QueryParamsResponse";
  value: Uint8Array;
}
export interface QueryParamsResponseSDKType {
  params: ParamsSDKType;
}
export interface QueryInvestmintRequest {
  amount: Coin;
  resource: string;
  length: bigint;
}
export interface QueryInvestmintRequestProtoMsg {
  typeUrl: "/cyber.resources.v1beta1.QueryInvestmintRequest";
  value: Uint8Array;
}
export interface QueryInvestmintRequestSDKType {
  amount: CoinSDKType;
  resource: string;
  length: bigint;
}
export interface QueryInvestmintResponse {
  amount: Coin;
}
export interface QueryInvestmintResponseProtoMsg {
  typeUrl: "/cyber.resources.v1beta1.QueryInvestmintResponse";
  value: Uint8Array;
}
export interface QueryInvestmintResponseSDKType {
  amount: CoinSDKType;
}
function createBaseQueryParamsRequest(): QueryParamsRequest {
  return {};
}
export const QueryParamsRequest = {
  typeUrl: "/cyber.resources.v1beta1.QueryParamsRequest",
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
      typeUrl: "/cyber.resources.v1beta1.QueryParamsRequest",
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
  typeUrl: "/cyber.resources.v1beta1.QueryParamsResponse",
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
      typeUrl: "/cyber.resources.v1beta1.QueryParamsResponse",
      value: QueryParamsResponse.encode(message).finish()
    };
  }
};
function createBaseQueryInvestmintRequest(): QueryInvestmintRequest {
  return {
    amount: Coin.fromPartial({}),
    resource: "",
    length: BigInt(0)
  };
}
export const QueryInvestmintRequest = {
  typeUrl: "/cyber.resources.v1beta1.QueryInvestmintRequest",
  encode(message: QueryInvestmintRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.amount !== undefined) {
      Coin.encode(message.amount, writer.uint32(10).fork()).ldelim();
    }
    if (message.resource !== "") {
      writer.uint32(18).string(message.resource);
    }
    if (message.length !== BigInt(0)) {
      writer.uint32(24).uint64(message.length);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryInvestmintRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryInvestmintRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.amount = Coin.decode(reader, reader.uint32());
          break;
        case 2:
          message.resource = reader.string();
          break;
        case 3:
          message.length = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryInvestmintRequest {
    return {
      amount: isSet(object.amount) ? Coin.fromJSON(object.amount) : undefined,
      resource: isSet(object.resource) ? String(object.resource) : "",
      length: isSet(object.length) ? BigInt(object.length.toString()) : BigInt(0)
    };
  },
  toJSON(message: QueryInvestmintRequest): JsonSafe<QueryInvestmintRequest> {
    const obj: any = {};
    message.amount !== undefined && (obj.amount = message.amount ? Coin.toJSON(message.amount) : undefined);
    message.resource !== undefined && (obj.resource = message.resource);
    message.length !== undefined && (obj.length = (message.length || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<QueryInvestmintRequest>): QueryInvestmintRequest {
    const message = createBaseQueryInvestmintRequest();
    message.amount = object.amount !== undefined && object.amount !== null ? Coin.fromPartial(object.amount) : undefined;
    message.resource = object.resource ?? "";
    message.length = object.length !== undefined && object.length !== null ? BigInt(object.length.toString()) : BigInt(0);
    return message;
  },
  fromProtoMsg(message: QueryInvestmintRequestProtoMsg): QueryInvestmintRequest {
    return QueryInvestmintRequest.decode(message.value);
  },
  toProto(message: QueryInvestmintRequest): Uint8Array {
    return QueryInvestmintRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryInvestmintRequest): QueryInvestmintRequestProtoMsg {
    return {
      typeUrl: "/cyber.resources.v1beta1.QueryInvestmintRequest",
      value: QueryInvestmintRequest.encode(message).finish()
    };
  }
};
function createBaseQueryInvestmintResponse(): QueryInvestmintResponse {
  return {
    amount: Coin.fromPartial({})
  };
}
export const QueryInvestmintResponse = {
  typeUrl: "/cyber.resources.v1beta1.QueryInvestmintResponse",
  encode(message: QueryInvestmintResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.amount !== undefined) {
      Coin.encode(message.amount, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryInvestmintResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryInvestmintResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.amount = Coin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryInvestmintResponse {
    return {
      amount: isSet(object.amount) ? Coin.fromJSON(object.amount) : undefined
    };
  },
  toJSON(message: QueryInvestmintResponse): JsonSafe<QueryInvestmintResponse> {
    const obj: any = {};
    message.amount !== undefined && (obj.amount = message.amount ? Coin.toJSON(message.amount) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryInvestmintResponse>): QueryInvestmintResponse {
    const message = createBaseQueryInvestmintResponse();
    message.amount = object.amount !== undefined && object.amount !== null ? Coin.fromPartial(object.amount) : undefined;
    return message;
  },
  fromProtoMsg(message: QueryInvestmintResponseProtoMsg): QueryInvestmintResponse {
    return QueryInvestmintResponse.decode(message.value);
  },
  toProto(message: QueryInvestmintResponse): Uint8Array {
    return QueryInvestmintResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryInvestmintResponse): QueryInvestmintResponseProtoMsg {
    return {
      typeUrl: "/cyber.resources.v1beta1.QueryInvestmintResponse",
      value: QueryInvestmintResponse.encode(message).finish()
    };
  }
};