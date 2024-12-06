//@ts-nocheck
import { Link, type LinkSDKType } from "./types.js";
import { BinaryReader, BinaryWriter } from "../../../binary.js";
import { isSet } from "../../../helpers.js";
import {type JsonSafe } from "../../../json-safe.js";
export interface MsgCyberlink {
  neuron: string;
  links: Link[];
}
export interface MsgCyberlinkProtoMsg {
  typeUrl: "/cyber.graph.v1beta1.MsgCyberlink";
  value: Uint8Array;
}
export interface MsgCyberlinkSDKType {
  neuron: string;
  links: LinkSDKType[];
}
export interface MsgCyberlinkResponse {}
export interface MsgCyberlinkResponseProtoMsg {
  typeUrl: "/cyber.graph.v1beta1.MsgCyberlinkResponse";
  value: Uint8Array;
}
export interface MsgCyberlinkResponseSDKType {}
function createBaseMsgCyberlink(): MsgCyberlink {
  return {
    neuron: "",
    links: []
  };
}
export const MsgCyberlink = {
  typeUrl: "/cyber.graph.v1beta1.MsgCyberlink",
  encode(message: MsgCyberlink, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.neuron !== "") {
      writer.uint32(10).string(message.neuron);
    }
    for (const v of message.links) {
      Link.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgCyberlink {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCyberlink();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.neuron = reader.string();
          break;
        case 2:
          message.links.push(Link.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgCyberlink {
    return {
      neuron: isSet(object.neuron) ? String(object.neuron) : "",
      links: Array.isArray(object?.links) ? object.links.map((e: any) => Link.fromJSON(e)) : []
    };
  },
  toJSON(message: MsgCyberlink): JsonSafe<MsgCyberlink> {
    const obj: any = {};
    message.neuron !== undefined && (obj.neuron = message.neuron);
    if (message.links) {
      obj.links = message.links.map(e => e ? Link.toJSON(e) : undefined);
    } else {
      obj.links = [];
    }
    return obj;
  },
  fromPartial(object: Partial<MsgCyberlink>): MsgCyberlink {
    const message = createBaseMsgCyberlink();
    message.neuron = object.neuron ?? "";
    message.links = object.links?.map(e => Link.fromPartial(e)) || [];
    return message;
  },
  fromProtoMsg(message: MsgCyberlinkProtoMsg): MsgCyberlink {
    return MsgCyberlink.decode(message.value);
  },
  toProto(message: MsgCyberlink): Uint8Array {
    return MsgCyberlink.encode(message).finish();
  },
  toProtoMsg(message: MsgCyberlink): MsgCyberlinkProtoMsg {
    return {
      typeUrl: "/cyber.graph.v1beta1.MsgCyberlink",
      value: MsgCyberlink.encode(message).finish()
    };
  }
};
function createBaseMsgCyberlinkResponse(): MsgCyberlinkResponse {
  return {};
}
export const MsgCyberlinkResponse = {
  typeUrl: "/cyber.graph.v1beta1.MsgCyberlinkResponse",
  encode(_: MsgCyberlinkResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgCyberlinkResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCyberlinkResponse();
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
  fromJSON(_: any): MsgCyberlinkResponse {
    return {};
  },
  toJSON(_: MsgCyberlinkResponse): JsonSafe<MsgCyberlinkResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgCyberlinkResponse>): MsgCyberlinkResponse {
    const message = createBaseMsgCyberlinkResponse();
    return message;
  },
  fromProtoMsg(message: MsgCyberlinkResponseProtoMsg): MsgCyberlinkResponse {
    return MsgCyberlinkResponse.decode(message.value);
  },
  toProto(message: MsgCyberlinkResponse): Uint8Array {
    return MsgCyberlinkResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgCyberlinkResponse): MsgCyberlinkResponseProtoMsg {
    return {
      typeUrl: "/cyber.graph.v1beta1.MsgCyberlinkResponse",
      value: MsgCyberlinkResponse.encode(message).finish()
    };
  }
};