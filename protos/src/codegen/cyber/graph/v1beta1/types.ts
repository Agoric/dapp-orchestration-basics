//@ts-nocheck
import { BinaryReader, BinaryWriter } from "../../../binary.js";
import { isSet } from "../../../helpers.js";
import {type JsonSafe } from "../../../json-safe.js";
export interface Link {
  from: string;
  to: string;
}
export interface LinkProtoMsg {
  typeUrl: "/cyber.graph.v1beta1.Link";
  value: Uint8Array;
}
export interface LinkSDKType {
  from: string;
  to: string;
}
function createBaseLink(): Link {
  return {
    from: "",
    to: ""
  };
}
export const Link = {
  typeUrl: "/cyber.graph.v1beta1.Link",
  encode(message: Link, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.from !== "") {
      writer.uint32(10).string(message.from);
    }
    if (message.to !== "") {
      writer.uint32(18).string(message.to);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Link {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLink();
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
  fromJSON(object: any): Link {
    return {
      from: isSet(object.from) ? String(object.from) : "",
      to: isSet(object.to) ? String(object.to) : ""
    };
  },
  toJSON(message: Link): JsonSafe<Link> {
    const obj: any = {};
    message.from !== undefined && (obj.from = message.from);
    message.to !== undefined && (obj.to = message.to);
    return obj;
  },
  fromPartial(object: Partial<Link>): Link {
    const message = createBaseLink();
    message.from = object.from ?? "";
    message.to = object.to ?? "";
    return message;
  },
  fromProtoMsg(message: LinkProtoMsg): Link {
    return Link.decode(message.value);
  },
  toProto(message: Link): Uint8Array {
    return Link.encode(message).finish();
  },
  toProtoMsg(message: Link): LinkProtoMsg {
    return {
      typeUrl: "/cyber.graph.v1beta1.Link",
      value: Link.encode(message).finish()
    };
  }
};