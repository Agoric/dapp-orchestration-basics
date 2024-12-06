//@ts-nocheck
import { Coin, type CoinSDKType } from "../../../cosmos/base/v1beta1/coin.js";
import { BinaryReader, BinaryWriter } from "../../../binary.js";
import { isSet } from "../../../helpers.js";
import {type JsonSafe } from "../../../json-safe.js";
export interface Params {
  maxRoutes: number;
}
export interface ParamsProtoMsg {
  typeUrl: "/cyber.grid.v1beta1.Params";
  value: Uint8Array;
}
export interface ParamsSDKType {
  max_routes: number;
}
export interface Route {
  source: string;
  destination: string;
  name: string;
  value: Coin[];
}
export interface RouteProtoMsg {
  typeUrl: "/cyber.grid.v1beta1.Route";
  value: Uint8Array;
}
export interface RouteSDKType {
  source: string;
  destination: string;
  name: string;
  value: CoinSDKType[];
}
export interface Value {
  value: Coin[];
}
export interface ValueProtoMsg {
  typeUrl: "/cyber.grid.v1beta1.Value";
  value: Uint8Array;
}
export interface ValueSDKType {
  value: CoinSDKType[];
}
function createBaseParams(): Params {
  return {
    maxRoutes: 0
  };
}
export const Params = {
  typeUrl: "/cyber.grid.v1beta1.Params",
  encode(message: Params, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.maxRoutes !== 0) {
      writer.uint32(8).uint32(message.maxRoutes);
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
          message.maxRoutes = reader.uint32();
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
      maxRoutes: isSet(object.maxRoutes) ? Number(object.maxRoutes) : 0
    };
  },
  toJSON(message: Params): JsonSafe<Params> {
    const obj: any = {};
    message.maxRoutes !== undefined && (obj.maxRoutes = Math.round(message.maxRoutes));
    return obj;
  },
  fromPartial(object: Partial<Params>): Params {
    const message = createBaseParams();
    message.maxRoutes = object.maxRoutes ?? 0;
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
      typeUrl: "/cyber.grid.v1beta1.Params",
      value: Params.encode(message).finish()
    };
  }
};
function createBaseRoute(): Route {
  return {
    source: "",
    destination: "",
    name: "",
    value: []
  };
}
export const Route = {
  typeUrl: "/cyber.grid.v1beta1.Route",
  encode(message: Route, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.source !== "") {
      writer.uint32(10).string(message.source);
    }
    if (message.destination !== "") {
      writer.uint32(18).string(message.destination);
    }
    if (message.name !== "") {
      writer.uint32(26).string(message.name);
    }
    for (const v of message.value) {
      Coin.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Route {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRoute();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.source = reader.string();
          break;
        case 2:
          message.destination = reader.string();
          break;
        case 3:
          message.name = reader.string();
          break;
        case 4:
          message.value.push(Coin.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Route {
    return {
      source: isSet(object.source) ? String(object.source) : "",
      destination: isSet(object.destination) ? String(object.destination) : "",
      name: isSet(object.name) ? String(object.name) : "",
      value: Array.isArray(object?.value) ? object.value.map((e: any) => Coin.fromJSON(e)) : []
    };
  },
  toJSON(message: Route): JsonSafe<Route> {
    const obj: any = {};
    message.source !== undefined && (obj.source = message.source);
    message.destination !== undefined && (obj.destination = message.destination);
    message.name !== undefined && (obj.name = message.name);
    if (message.value) {
      obj.value = message.value.map(e => e ? Coin.toJSON(e) : undefined);
    } else {
      obj.value = [];
    }
    return obj;
  },
  fromPartial(object: Partial<Route>): Route {
    const message = createBaseRoute();
    message.source = object.source ?? "";
    message.destination = object.destination ?? "";
    message.name = object.name ?? "";
    message.value = object.value?.map(e => Coin.fromPartial(e)) || [];
    return message;
  },
  fromProtoMsg(message: RouteProtoMsg): Route {
    return Route.decode(message.value);
  },
  toProto(message: Route): Uint8Array {
    return Route.encode(message).finish();
  },
  toProtoMsg(message: Route): RouteProtoMsg {
    return {
      typeUrl: "/cyber.grid.v1beta1.Route",
      value: Route.encode(message).finish()
    };
  }
};
function createBaseValue(): Value {
  return {
    value: []
  };
}
export const Value = {
  typeUrl: "/cyber.grid.v1beta1.Value",
  encode(message: Value, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.value) {
      Coin.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Value {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValue();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.value.push(Coin.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Value {
    return {
      value: Array.isArray(object?.value) ? object.value.map((e: any) => Coin.fromJSON(e)) : []
    };
  },
  toJSON(message: Value): JsonSafe<Value> {
    const obj: any = {};
    if (message.value) {
      obj.value = message.value.map(e => e ? Coin.toJSON(e) : undefined);
    } else {
      obj.value = [];
    }
    return obj;
  },
  fromPartial(object: Partial<Value>): Value {
    const message = createBaseValue();
    message.value = object.value?.map(e => Coin.fromPartial(e)) || [];
    return message;
  },
  fromProtoMsg(message: ValueProtoMsg): Value {
    return Value.decode(message.value);
  },
  toProto(message: Value): Uint8Array {
    return Value.encode(message).finish();
  },
  toProtoMsg(message: Value): ValueProtoMsg {
    return {
      typeUrl: "/cyber.grid.v1beta1.Value",
      value: Value.encode(message).finish()
    };
  }
};