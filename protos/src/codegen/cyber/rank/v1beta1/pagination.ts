//@ts-nocheck
import { BinaryReader, BinaryWriter } from "../../../binary.js";
import { isSet } from "../../../helpers.js";
import {type JsonSafe } from "../../../json-safe.js";
export interface PageRequest {
  page: number;
  perPage: number;
}
export interface PageRequestProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.PageRequest";
  value: Uint8Array;
}
export interface PageRequestSDKType {
  page: number;
  per_page: number;
}
export interface PageResponse {
  total: number;
}
export interface PageResponseProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.PageResponse";
  value: Uint8Array;
}
export interface PageResponseSDKType {
  total: number;
}
function createBasePageRequest(): PageRequest {
  return {
    page: 0,
    perPage: 0
  };
}
export const PageRequest = {
  typeUrl: "/cyber.rank.v1beta1.PageRequest",
  encode(message: PageRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.page !== 0) {
      writer.uint32(8).uint32(message.page);
    }
    if (message.perPage !== 0) {
      writer.uint32(16).uint32(message.perPage);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): PageRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePageRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.page = reader.uint32();
          break;
        case 2:
          message.perPage = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): PageRequest {
    return {
      page: isSet(object.page) ? Number(object.page) : 0,
      perPage: isSet(object.perPage) ? Number(object.perPage) : 0
    };
  },
  toJSON(message: PageRequest): JsonSafe<PageRequest> {
    const obj: any = {};
    message.page !== undefined && (obj.page = Math.round(message.page));
    message.perPage !== undefined && (obj.perPage = Math.round(message.perPage));
    return obj;
  },
  fromPartial(object: Partial<PageRequest>): PageRequest {
    const message = createBasePageRequest();
    message.page = object.page ?? 0;
    message.perPage = object.perPage ?? 0;
    return message;
  },
  fromProtoMsg(message: PageRequestProtoMsg): PageRequest {
    return PageRequest.decode(message.value);
  },
  toProto(message: PageRequest): Uint8Array {
    return PageRequest.encode(message).finish();
  },
  toProtoMsg(message: PageRequest): PageRequestProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.PageRequest",
      value: PageRequest.encode(message).finish()
    };
  }
};
function createBasePageResponse(): PageResponse {
  return {
    total: 0
  };
}
export const PageResponse = {
  typeUrl: "/cyber.rank.v1beta1.PageResponse",
  encode(message: PageResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.total !== 0) {
      writer.uint32(8).uint32(message.total);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): PageResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePageResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.total = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): PageResponse {
    return {
      total: isSet(object.total) ? Number(object.total) : 0
    };
  },
  toJSON(message: PageResponse): JsonSafe<PageResponse> {
    const obj: any = {};
    message.total !== undefined && (obj.total = Math.round(message.total));
    return obj;
  },
  fromPartial(object: Partial<PageResponse>): PageResponse {
    const message = createBasePageResponse();
    message.total = object.total ?? 0;
    return message;
  },
  fromProtoMsg(message: PageResponseProtoMsg): PageResponse {
    return PageResponse.decode(message.value);
  },
  toProto(message: PageResponse): Uint8Array {
    return PageResponse.encode(message).finish();
  },
  toProtoMsg(message: PageResponse): PageResponseProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.PageResponse",
      value: PageResponse.encode(message).finish()
    };
  }
};