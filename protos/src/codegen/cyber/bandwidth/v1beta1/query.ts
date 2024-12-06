//@ts-nocheck
import { NeuronBandwidth, type NeuronBandwidthSDKType, Params, type ParamsSDKType } from "./types.js";
import { BinaryReader, BinaryWriter } from "../../../binary.js";
import {type JsonSafe } from "../../../json-safe.js";
import { Decimal, isSet } from "../../../helpers.js";
export interface QueryLoadRequest {}
export interface QueryLoadRequestProtoMsg {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryLoadRequest";
  value: Uint8Array;
}
export interface QueryLoadRequestSDKType {}
export interface QueryLoadResponse {
  load: string;
}
export interface QueryLoadResponseProtoMsg {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryLoadResponse";
  value: Uint8Array;
}
export interface QueryLoadResponseSDKType {
  load: string;
}
export interface QueryPriceRequest {}
export interface QueryPriceRequestProtoMsg {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryPriceRequest";
  value: Uint8Array;
}
export interface QueryPriceRequestSDKType {}
export interface QueryPriceResponse {
  price: string;
}
export interface QueryPriceResponseProtoMsg {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryPriceResponse";
  value: Uint8Array;
}
export interface QueryPriceResponseSDKType {
  price: string;
}
export interface QueryTotalBandwidthRequest {}
export interface QueryTotalBandwidthRequestProtoMsg {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryTotalBandwidthRequest";
  value: Uint8Array;
}
export interface QueryTotalBandwidthRequestSDKType {}
export interface QueryTotalBandwidthResponse {
  totalBandwidth: bigint;
}
export interface QueryTotalBandwidthResponseProtoMsg {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryTotalBandwidthResponse";
  value: Uint8Array;
}
export interface QueryTotalBandwidthResponseSDKType {
  total_bandwidth: bigint;
}
export interface QueryNeuronBandwidthRequest {
  neuron: string;
}
export interface QueryNeuronBandwidthRequestProtoMsg {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryNeuronBandwidthRequest";
  value: Uint8Array;
}
export interface QueryNeuronBandwidthRequestSDKType {
  neuron: string;
}
export interface QueryNeuronBandwidthResponse {
  neuronBandwidth: NeuronBandwidth;
}
export interface QueryNeuronBandwidthResponseProtoMsg {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryNeuronBandwidthResponse";
  value: Uint8Array;
}
export interface QueryNeuronBandwidthResponseSDKType {
  neuron_bandwidth: NeuronBandwidthSDKType;
}
export interface QueryParamsRequest {}
export interface QueryParamsRequestProtoMsg {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryParamsRequest";
  value: Uint8Array;
}
export interface QueryParamsRequestSDKType {}
export interface QueryParamsResponse {
  params: Params;
}
export interface QueryParamsResponseProtoMsg {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryParamsResponse";
  value: Uint8Array;
}
export interface QueryParamsResponseSDKType {
  params: ParamsSDKType;
}
function createBaseQueryLoadRequest(): QueryLoadRequest {
  return {};
}
export const QueryLoadRequest = {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryLoadRequest",
  encode(_: QueryLoadRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryLoadRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryLoadRequest();
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
  fromJSON(_: any): QueryLoadRequest {
    return {};
  },
  toJSON(_: QueryLoadRequest): JsonSafe<QueryLoadRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<QueryLoadRequest>): QueryLoadRequest {
    const message = createBaseQueryLoadRequest();
    return message;
  },
  fromProtoMsg(message: QueryLoadRequestProtoMsg): QueryLoadRequest {
    return QueryLoadRequest.decode(message.value);
  },
  toProto(message: QueryLoadRequest): Uint8Array {
    return QueryLoadRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryLoadRequest): QueryLoadRequestProtoMsg {
    return {
      typeUrl: "/cyber.bandwidth.v1beta1.QueryLoadRequest",
      value: QueryLoadRequest.encode(message).finish()
    };
  }
};
function createBaseQueryLoadResponse(): QueryLoadResponse {
  return {
    load: ""
  };
}
export const QueryLoadResponse = {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryLoadResponse",
  encode(message: QueryLoadResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.load !== "") {
      writer.uint32(10).string(Decimal.fromUserInput(message.load, 18).atomics);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryLoadResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryLoadResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.load = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryLoadResponse {
    return {
      load: isSet(object.load) ? String(object.load) : ""
    };
  },
  toJSON(message: QueryLoadResponse): JsonSafe<QueryLoadResponse> {
    const obj: any = {};
    message.load !== undefined && (obj.load = message.load);
    return obj;
  },
  fromPartial(object: Partial<QueryLoadResponse>): QueryLoadResponse {
    const message = createBaseQueryLoadResponse();
    message.load = object.load ?? "";
    return message;
  },
  fromProtoMsg(message: QueryLoadResponseProtoMsg): QueryLoadResponse {
    return QueryLoadResponse.decode(message.value);
  },
  toProto(message: QueryLoadResponse): Uint8Array {
    return QueryLoadResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryLoadResponse): QueryLoadResponseProtoMsg {
    return {
      typeUrl: "/cyber.bandwidth.v1beta1.QueryLoadResponse",
      value: QueryLoadResponse.encode(message).finish()
    };
  }
};
function createBaseQueryPriceRequest(): QueryPriceRequest {
  return {};
}
export const QueryPriceRequest = {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryPriceRequest",
  encode(_: QueryPriceRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPriceRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPriceRequest();
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
  fromJSON(_: any): QueryPriceRequest {
    return {};
  },
  toJSON(_: QueryPriceRequest): JsonSafe<QueryPriceRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<QueryPriceRequest>): QueryPriceRequest {
    const message = createBaseQueryPriceRequest();
    return message;
  },
  fromProtoMsg(message: QueryPriceRequestProtoMsg): QueryPriceRequest {
    return QueryPriceRequest.decode(message.value);
  },
  toProto(message: QueryPriceRequest): Uint8Array {
    return QueryPriceRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryPriceRequest): QueryPriceRequestProtoMsg {
    return {
      typeUrl: "/cyber.bandwidth.v1beta1.QueryPriceRequest",
      value: QueryPriceRequest.encode(message).finish()
    };
  }
};
function createBaseQueryPriceResponse(): QueryPriceResponse {
  return {
    price: ""
  };
}
export const QueryPriceResponse = {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryPriceResponse",
  encode(message: QueryPriceResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.price !== "") {
      writer.uint32(10).string(Decimal.fromUserInput(message.price, 18).atomics);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPriceResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPriceResponse();
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
  fromJSON(object: any): QueryPriceResponse {
    return {
      price: isSet(object.price) ? String(object.price) : ""
    };
  },
  toJSON(message: QueryPriceResponse): JsonSafe<QueryPriceResponse> {
    const obj: any = {};
    message.price !== undefined && (obj.price = message.price);
    return obj;
  },
  fromPartial(object: Partial<QueryPriceResponse>): QueryPriceResponse {
    const message = createBaseQueryPriceResponse();
    message.price = object.price ?? "";
    return message;
  },
  fromProtoMsg(message: QueryPriceResponseProtoMsg): QueryPriceResponse {
    return QueryPriceResponse.decode(message.value);
  },
  toProto(message: QueryPriceResponse): Uint8Array {
    return QueryPriceResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryPriceResponse): QueryPriceResponseProtoMsg {
    return {
      typeUrl: "/cyber.bandwidth.v1beta1.QueryPriceResponse",
      value: QueryPriceResponse.encode(message).finish()
    };
  }
};
function createBaseQueryTotalBandwidthRequest(): QueryTotalBandwidthRequest {
  return {};
}
export const QueryTotalBandwidthRequest = {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryTotalBandwidthRequest",
  encode(_: QueryTotalBandwidthRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryTotalBandwidthRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryTotalBandwidthRequest();
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
  fromJSON(_: any): QueryTotalBandwidthRequest {
    return {};
  },
  toJSON(_: QueryTotalBandwidthRequest): JsonSafe<QueryTotalBandwidthRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<QueryTotalBandwidthRequest>): QueryTotalBandwidthRequest {
    const message = createBaseQueryTotalBandwidthRequest();
    return message;
  },
  fromProtoMsg(message: QueryTotalBandwidthRequestProtoMsg): QueryTotalBandwidthRequest {
    return QueryTotalBandwidthRequest.decode(message.value);
  },
  toProto(message: QueryTotalBandwidthRequest): Uint8Array {
    return QueryTotalBandwidthRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryTotalBandwidthRequest): QueryTotalBandwidthRequestProtoMsg {
    return {
      typeUrl: "/cyber.bandwidth.v1beta1.QueryTotalBandwidthRequest",
      value: QueryTotalBandwidthRequest.encode(message).finish()
    };
  }
};
function createBaseQueryTotalBandwidthResponse(): QueryTotalBandwidthResponse {
  return {
    totalBandwidth: BigInt(0)
  };
}
export const QueryTotalBandwidthResponse = {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryTotalBandwidthResponse",
  encode(message: QueryTotalBandwidthResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.totalBandwidth !== BigInt(0)) {
      writer.uint32(8).uint64(message.totalBandwidth);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryTotalBandwidthResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryTotalBandwidthResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.totalBandwidth = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryTotalBandwidthResponse {
    return {
      totalBandwidth: isSet(object.totalBandwidth) ? BigInt(object.totalBandwidth.toString()) : BigInt(0)
    };
  },
  toJSON(message: QueryTotalBandwidthResponse): JsonSafe<QueryTotalBandwidthResponse> {
    const obj: any = {};
    message.totalBandwidth !== undefined && (obj.totalBandwidth = (message.totalBandwidth || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<QueryTotalBandwidthResponse>): QueryTotalBandwidthResponse {
    const message = createBaseQueryTotalBandwidthResponse();
    message.totalBandwidth = object.totalBandwidth !== undefined && object.totalBandwidth !== null ? BigInt(object.totalBandwidth.toString()) : BigInt(0);
    return message;
  },
  fromProtoMsg(message: QueryTotalBandwidthResponseProtoMsg): QueryTotalBandwidthResponse {
    return QueryTotalBandwidthResponse.decode(message.value);
  },
  toProto(message: QueryTotalBandwidthResponse): Uint8Array {
    return QueryTotalBandwidthResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryTotalBandwidthResponse): QueryTotalBandwidthResponseProtoMsg {
    return {
      typeUrl: "/cyber.bandwidth.v1beta1.QueryTotalBandwidthResponse",
      value: QueryTotalBandwidthResponse.encode(message).finish()
    };
  }
};
function createBaseQueryNeuronBandwidthRequest(): QueryNeuronBandwidthRequest {
  return {
    neuron: ""
  };
}
export const QueryNeuronBandwidthRequest = {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryNeuronBandwidthRequest",
  encode(message: QueryNeuronBandwidthRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.neuron !== "") {
      writer.uint32(10).string(message.neuron);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryNeuronBandwidthRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryNeuronBandwidthRequest();
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
  fromJSON(object: any): QueryNeuronBandwidthRequest {
    return {
      neuron: isSet(object.neuron) ? String(object.neuron) : ""
    };
  },
  toJSON(message: QueryNeuronBandwidthRequest): JsonSafe<QueryNeuronBandwidthRequest> {
    const obj: any = {};
    message.neuron !== undefined && (obj.neuron = message.neuron);
    return obj;
  },
  fromPartial(object: Partial<QueryNeuronBandwidthRequest>): QueryNeuronBandwidthRequest {
    const message = createBaseQueryNeuronBandwidthRequest();
    message.neuron = object.neuron ?? "";
    return message;
  },
  fromProtoMsg(message: QueryNeuronBandwidthRequestProtoMsg): QueryNeuronBandwidthRequest {
    return QueryNeuronBandwidthRequest.decode(message.value);
  },
  toProto(message: QueryNeuronBandwidthRequest): Uint8Array {
    return QueryNeuronBandwidthRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryNeuronBandwidthRequest): QueryNeuronBandwidthRequestProtoMsg {
    return {
      typeUrl: "/cyber.bandwidth.v1beta1.QueryNeuronBandwidthRequest",
      value: QueryNeuronBandwidthRequest.encode(message).finish()
    };
  }
};
function createBaseQueryNeuronBandwidthResponse(): QueryNeuronBandwidthResponse {
  return {
    neuronBandwidth: NeuronBandwidth.fromPartial({})
  };
}
export const QueryNeuronBandwidthResponse = {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryNeuronBandwidthResponse",
  encode(message: QueryNeuronBandwidthResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.neuronBandwidth !== undefined) {
      NeuronBandwidth.encode(message.neuronBandwidth, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryNeuronBandwidthResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryNeuronBandwidthResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.neuronBandwidth = NeuronBandwidth.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryNeuronBandwidthResponse {
    return {
      neuronBandwidth: isSet(object.neuronBandwidth) ? NeuronBandwidth.fromJSON(object.neuronBandwidth) : undefined
    };
  },
  toJSON(message: QueryNeuronBandwidthResponse): JsonSafe<QueryNeuronBandwidthResponse> {
    const obj: any = {};
    message.neuronBandwidth !== undefined && (obj.neuronBandwidth = message.neuronBandwidth ? NeuronBandwidth.toJSON(message.neuronBandwidth) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryNeuronBandwidthResponse>): QueryNeuronBandwidthResponse {
    const message = createBaseQueryNeuronBandwidthResponse();
    message.neuronBandwidth = object.neuronBandwidth !== undefined && object.neuronBandwidth !== null ? NeuronBandwidth.fromPartial(object.neuronBandwidth) : undefined;
    return message;
  },
  fromProtoMsg(message: QueryNeuronBandwidthResponseProtoMsg): QueryNeuronBandwidthResponse {
    return QueryNeuronBandwidthResponse.decode(message.value);
  },
  toProto(message: QueryNeuronBandwidthResponse): Uint8Array {
    return QueryNeuronBandwidthResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryNeuronBandwidthResponse): QueryNeuronBandwidthResponseProtoMsg {
    return {
      typeUrl: "/cyber.bandwidth.v1beta1.QueryNeuronBandwidthResponse",
      value: QueryNeuronBandwidthResponse.encode(message).finish()
    };
  }
};
function createBaseQueryParamsRequest(): QueryParamsRequest {
  return {};
}
export const QueryParamsRequest = {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryParamsRequest",
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
      typeUrl: "/cyber.bandwidth.v1beta1.QueryParamsRequest",
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
  typeUrl: "/cyber.bandwidth.v1beta1.QueryParamsResponse",
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
      typeUrl: "/cyber.bandwidth.v1beta1.QueryParamsResponse",
      value: QueryParamsResponse.encode(message).finish()
    };
  }
};