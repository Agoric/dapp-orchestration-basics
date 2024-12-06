//@ts-nocheck
import { Params, type ParamsSDKType } from "./genesis.js";
import { BinaryReader, BinaryWriter } from "../../../binary.js";
import { isSet } from "../../../helpers.js";
import {type JsonSafe } from "../../../json-safe.js";
/** MsgRegisterClockContract is the Msg/RegisterClockContract request type. */
export interface MsgRegisterClockContract {
  /** The address of the sender. */
  senderAddress: string;
  /** The address of the contract to register. */
  contractAddress: string;
}
export interface MsgRegisterClockContractProtoMsg {
  typeUrl: "/cyber.clock.v1.MsgRegisterClockContract";
  value: Uint8Array;
}
/** MsgRegisterClockContract is the Msg/RegisterClockContract request type. */
export interface MsgRegisterClockContractSDKType {
  sender_address: string;
  contract_address: string;
}
/**
 * MsgRegisterClockContractResponse defines the response structure for executing
 * a MsgRegisterClockContract message.
 */
export interface MsgRegisterClockContractResponse {}
export interface MsgRegisterClockContractResponseProtoMsg {
  typeUrl: "/cyber.clock.v1.MsgRegisterClockContractResponse";
  value: Uint8Array;
}
/**
 * MsgRegisterClockContractResponse defines the response structure for executing
 * a MsgRegisterClockContract message.
 */
export interface MsgRegisterClockContractResponseSDKType {}
/** MsgUnregisterClockContract is the Msg/UnregisterClockContract request type. */
export interface MsgUnregisterClockContract {
  /** The address of the sender. */
  senderAddress: string;
  /** The address of the contract to unregister. */
  contractAddress: string;
}
export interface MsgUnregisterClockContractProtoMsg {
  typeUrl: "/cyber.clock.v1.MsgUnregisterClockContract";
  value: Uint8Array;
}
/** MsgUnregisterClockContract is the Msg/UnregisterClockContract request type. */
export interface MsgUnregisterClockContractSDKType {
  sender_address: string;
  contract_address: string;
}
/**
 * MsgUnregisterClockContractResponse defines the response structure for
 * executing a MsgUnregisterClockContract message.
 */
export interface MsgUnregisterClockContractResponse {}
export interface MsgUnregisterClockContractResponseProtoMsg {
  typeUrl: "/cyber.clock.v1.MsgUnregisterClockContractResponse";
  value: Uint8Array;
}
/**
 * MsgUnregisterClockContractResponse defines the response structure for
 * executing a MsgUnregisterClockContract message.
 */
export interface MsgUnregisterClockContractResponseSDKType {}
/** MsgUnjailClockContract is the Msg/UnjailClockContract request type. */
export interface MsgUnjailClockContract {
  /** The address of the sender. */
  senderAddress: string;
  /** The address of the contract to unjail. */
  contractAddress: string;
}
export interface MsgUnjailClockContractProtoMsg {
  typeUrl: "/cyber.clock.v1.MsgUnjailClockContract";
  value: Uint8Array;
}
/** MsgUnjailClockContract is the Msg/UnjailClockContract request type. */
export interface MsgUnjailClockContractSDKType {
  sender_address: string;
  contract_address: string;
}
/**
 * MsgUnjailClockContractResponse defines the response structure for executing a
 * MsgUnjailClockContract message.
 */
export interface MsgUnjailClockContractResponse {}
export interface MsgUnjailClockContractResponseProtoMsg {
  typeUrl: "/cyber.clock.v1.MsgUnjailClockContractResponse";
  value: Uint8Array;
}
/**
 * MsgUnjailClockContractResponse defines the response structure for executing a
 * MsgUnjailClockContract message.
 */
export interface MsgUnjailClockContractResponseSDKType {}
/**
 * MsgUpdateParams is the Msg/UpdateParams request type.
 * 
 * Since: cosmos-sdk 0.47
 */
export interface MsgUpdateParams {
  /** authority is the address of the governance account. */
  authority: string;
  /**
   * params defines the x/clock parameters to update.
   * 
   * NOTE: All parameters must be supplied.
   */
  params: Params;
}
export interface MsgUpdateParamsProtoMsg {
  typeUrl: "/cyber.clock.v1.MsgUpdateParams";
  value: Uint8Array;
}
/**
 * MsgUpdateParams is the Msg/UpdateParams request type.
 * 
 * Since: cosmos-sdk 0.47
 */
export interface MsgUpdateParamsSDKType {
  authority: string;
  params: ParamsSDKType;
}
/**
 * MsgUpdateParamsResponse defines the response structure for executing a
 * MsgUpdateParams message.
 * 
 * Since: cosmos-sdk 0.47
 */
export interface MsgUpdateParamsResponse {}
export interface MsgUpdateParamsResponseProtoMsg {
  typeUrl: "/cyber.clock.v1.MsgUpdateParamsResponse";
  value: Uint8Array;
}
/**
 * MsgUpdateParamsResponse defines the response structure for executing a
 * MsgUpdateParams message.
 * 
 * Since: cosmos-sdk 0.47
 */
export interface MsgUpdateParamsResponseSDKType {}
function createBaseMsgRegisterClockContract(): MsgRegisterClockContract {
  return {
    senderAddress: "",
    contractAddress: ""
  };
}
export const MsgRegisterClockContract = {
  typeUrl: "/cyber.clock.v1.MsgRegisterClockContract",
  encode(message: MsgRegisterClockContract, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.senderAddress !== "") {
      writer.uint32(10).string(message.senderAddress);
    }
    if (message.contractAddress !== "") {
      writer.uint32(18).string(message.contractAddress);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgRegisterClockContract {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRegisterClockContract();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.senderAddress = reader.string();
          break;
        case 2:
          message.contractAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgRegisterClockContract {
    return {
      senderAddress: isSet(object.senderAddress) ? String(object.senderAddress) : "",
      contractAddress: isSet(object.contractAddress) ? String(object.contractAddress) : ""
    };
  },
  toJSON(message: MsgRegisterClockContract): JsonSafe<MsgRegisterClockContract> {
    const obj: any = {};
    message.senderAddress !== undefined && (obj.senderAddress = message.senderAddress);
    message.contractAddress !== undefined && (obj.contractAddress = message.contractAddress);
    return obj;
  },
  fromPartial(object: Partial<MsgRegisterClockContract>): MsgRegisterClockContract {
    const message = createBaseMsgRegisterClockContract();
    message.senderAddress = object.senderAddress ?? "";
    message.contractAddress = object.contractAddress ?? "";
    return message;
  },
  fromProtoMsg(message: MsgRegisterClockContractProtoMsg): MsgRegisterClockContract {
    return MsgRegisterClockContract.decode(message.value);
  },
  toProto(message: MsgRegisterClockContract): Uint8Array {
    return MsgRegisterClockContract.encode(message).finish();
  },
  toProtoMsg(message: MsgRegisterClockContract): MsgRegisterClockContractProtoMsg {
    return {
      typeUrl: "/cyber.clock.v1.MsgRegisterClockContract",
      value: MsgRegisterClockContract.encode(message).finish()
    };
  }
};
function createBaseMsgRegisterClockContractResponse(): MsgRegisterClockContractResponse {
  return {};
}
export const MsgRegisterClockContractResponse = {
  typeUrl: "/cyber.clock.v1.MsgRegisterClockContractResponse",
  encode(_: MsgRegisterClockContractResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgRegisterClockContractResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRegisterClockContractResponse();
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
  fromJSON(_: any): MsgRegisterClockContractResponse {
    return {};
  },
  toJSON(_: MsgRegisterClockContractResponse): JsonSafe<MsgRegisterClockContractResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgRegisterClockContractResponse>): MsgRegisterClockContractResponse {
    const message = createBaseMsgRegisterClockContractResponse();
    return message;
  },
  fromProtoMsg(message: MsgRegisterClockContractResponseProtoMsg): MsgRegisterClockContractResponse {
    return MsgRegisterClockContractResponse.decode(message.value);
  },
  toProto(message: MsgRegisterClockContractResponse): Uint8Array {
    return MsgRegisterClockContractResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgRegisterClockContractResponse): MsgRegisterClockContractResponseProtoMsg {
    return {
      typeUrl: "/cyber.clock.v1.MsgRegisterClockContractResponse",
      value: MsgRegisterClockContractResponse.encode(message).finish()
    };
  }
};
function createBaseMsgUnregisterClockContract(): MsgUnregisterClockContract {
  return {
    senderAddress: "",
    contractAddress: ""
  };
}
export const MsgUnregisterClockContract = {
  typeUrl: "/cyber.clock.v1.MsgUnregisterClockContract",
  encode(message: MsgUnregisterClockContract, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.senderAddress !== "") {
      writer.uint32(10).string(message.senderAddress);
    }
    if (message.contractAddress !== "") {
      writer.uint32(18).string(message.contractAddress);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgUnregisterClockContract {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUnregisterClockContract();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.senderAddress = reader.string();
          break;
        case 2:
          message.contractAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgUnregisterClockContract {
    return {
      senderAddress: isSet(object.senderAddress) ? String(object.senderAddress) : "",
      contractAddress: isSet(object.contractAddress) ? String(object.contractAddress) : ""
    };
  },
  toJSON(message: MsgUnregisterClockContract): JsonSafe<MsgUnregisterClockContract> {
    const obj: any = {};
    message.senderAddress !== undefined && (obj.senderAddress = message.senderAddress);
    message.contractAddress !== undefined && (obj.contractAddress = message.contractAddress);
    return obj;
  },
  fromPartial(object: Partial<MsgUnregisterClockContract>): MsgUnregisterClockContract {
    const message = createBaseMsgUnregisterClockContract();
    message.senderAddress = object.senderAddress ?? "";
    message.contractAddress = object.contractAddress ?? "";
    return message;
  },
  fromProtoMsg(message: MsgUnregisterClockContractProtoMsg): MsgUnregisterClockContract {
    return MsgUnregisterClockContract.decode(message.value);
  },
  toProto(message: MsgUnregisterClockContract): Uint8Array {
    return MsgUnregisterClockContract.encode(message).finish();
  },
  toProtoMsg(message: MsgUnregisterClockContract): MsgUnregisterClockContractProtoMsg {
    return {
      typeUrl: "/cyber.clock.v1.MsgUnregisterClockContract",
      value: MsgUnregisterClockContract.encode(message).finish()
    };
  }
};
function createBaseMsgUnregisterClockContractResponse(): MsgUnregisterClockContractResponse {
  return {};
}
export const MsgUnregisterClockContractResponse = {
  typeUrl: "/cyber.clock.v1.MsgUnregisterClockContractResponse",
  encode(_: MsgUnregisterClockContractResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgUnregisterClockContractResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUnregisterClockContractResponse();
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
  fromJSON(_: any): MsgUnregisterClockContractResponse {
    return {};
  },
  toJSON(_: MsgUnregisterClockContractResponse): JsonSafe<MsgUnregisterClockContractResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgUnregisterClockContractResponse>): MsgUnregisterClockContractResponse {
    const message = createBaseMsgUnregisterClockContractResponse();
    return message;
  },
  fromProtoMsg(message: MsgUnregisterClockContractResponseProtoMsg): MsgUnregisterClockContractResponse {
    return MsgUnregisterClockContractResponse.decode(message.value);
  },
  toProto(message: MsgUnregisterClockContractResponse): Uint8Array {
    return MsgUnregisterClockContractResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgUnregisterClockContractResponse): MsgUnregisterClockContractResponseProtoMsg {
    return {
      typeUrl: "/cyber.clock.v1.MsgUnregisterClockContractResponse",
      value: MsgUnregisterClockContractResponse.encode(message).finish()
    };
  }
};
function createBaseMsgUnjailClockContract(): MsgUnjailClockContract {
  return {
    senderAddress: "",
    contractAddress: ""
  };
}
export const MsgUnjailClockContract = {
  typeUrl: "/cyber.clock.v1.MsgUnjailClockContract",
  encode(message: MsgUnjailClockContract, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.senderAddress !== "") {
      writer.uint32(10).string(message.senderAddress);
    }
    if (message.contractAddress !== "") {
      writer.uint32(18).string(message.contractAddress);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgUnjailClockContract {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUnjailClockContract();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.senderAddress = reader.string();
          break;
        case 2:
          message.contractAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgUnjailClockContract {
    return {
      senderAddress: isSet(object.senderAddress) ? String(object.senderAddress) : "",
      contractAddress: isSet(object.contractAddress) ? String(object.contractAddress) : ""
    };
  },
  toJSON(message: MsgUnjailClockContract): JsonSafe<MsgUnjailClockContract> {
    const obj: any = {};
    message.senderAddress !== undefined && (obj.senderAddress = message.senderAddress);
    message.contractAddress !== undefined && (obj.contractAddress = message.contractAddress);
    return obj;
  },
  fromPartial(object: Partial<MsgUnjailClockContract>): MsgUnjailClockContract {
    const message = createBaseMsgUnjailClockContract();
    message.senderAddress = object.senderAddress ?? "";
    message.contractAddress = object.contractAddress ?? "";
    return message;
  },
  fromProtoMsg(message: MsgUnjailClockContractProtoMsg): MsgUnjailClockContract {
    return MsgUnjailClockContract.decode(message.value);
  },
  toProto(message: MsgUnjailClockContract): Uint8Array {
    return MsgUnjailClockContract.encode(message).finish();
  },
  toProtoMsg(message: MsgUnjailClockContract): MsgUnjailClockContractProtoMsg {
    return {
      typeUrl: "/cyber.clock.v1.MsgUnjailClockContract",
      value: MsgUnjailClockContract.encode(message).finish()
    };
  }
};
function createBaseMsgUnjailClockContractResponse(): MsgUnjailClockContractResponse {
  return {};
}
export const MsgUnjailClockContractResponse = {
  typeUrl: "/cyber.clock.v1.MsgUnjailClockContractResponse",
  encode(_: MsgUnjailClockContractResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgUnjailClockContractResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUnjailClockContractResponse();
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
  fromJSON(_: any): MsgUnjailClockContractResponse {
    return {};
  },
  toJSON(_: MsgUnjailClockContractResponse): JsonSafe<MsgUnjailClockContractResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgUnjailClockContractResponse>): MsgUnjailClockContractResponse {
    const message = createBaseMsgUnjailClockContractResponse();
    return message;
  },
  fromProtoMsg(message: MsgUnjailClockContractResponseProtoMsg): MsgUnjailClockContractResponse {
    return MsgUnjailClockContractResponse.decode(message.value);
  },
  toProto(message: MsgUnjailClockContractResponse): Uint8Array {
    return MsgUnjailClockContractResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgUnjailClockContractResponse): MsgUnjailClockContractResponseProtoMsg {
    return {
      typeUrl: "/cyber.clock.v1.MsgUnjailClockContractResponse",
      value: MsgUnjailClockContractResponse.encode(message).finish()
    };
  }
};
function createBaseMsgUpdateParams(): MsgUpdateParams {
  return {
    authority: "",
    params: Params.fromPartial({})
  };
}
export const MsgUpdateParams = {
  typeUrl: "/cyber.clock.v1.MsgUpdateParams",
  encode(message: MsgUpdateParams, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.authority !== "") {
      writer.uint32(10).string(message.authority);
    }
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateParams {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authority = reader.string();
          break;
        case 2:
          message.params = Params.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgUpdateParams {
    return {
      authority: isSet(object.authority) ? String(object.authority) : "",
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined
    };
  },
  toJSON(message: MsgUpdateParams): JsonSafe<MsgUpdateParams> {
    const obj: any = {};
    message.authority !== undefined && (obj.authority = message.authority);
    message.params !== undefined && (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    return obj;
  },
  fromPartial(object: Partial<MsgUpdateParams>): MsgUpdateParams {
    const message = createBaseMsgUpdateParams();
    message.authority = object.authority ?? "";
    message.params = object.params !== undefined && object.params !== null ? Params.fromPartial(object.params) : undefined;
    return message;
  },
  fromProtoMsg(message: MsgUpdateParamsProtoMsg): MsgUpdateParams {
    return MsgUpdateParams.decode(message.value);
  },
  toProto(message: MsgUpdateParams): Uint8Array {
    return MsgUpdateParams.encode(message).finish();
  },
  toProtoMsg(message: MsgUpdateParams): MsgUpdateParamsProtoMsg {
    return {
      typeUrl: "/cyber.clock.v1.MsgUpdateParams",
      value: MsgUpdateParams.encode(message).finish()
    };
  }
};
function createBaseMsgUpdateParamsResponse(): MsgUpdateParamsResponse {
  return {};
}
export const MsgUpdateParamsResponse = {
  typeUrl: "/cyber.clock.v1.MsgUpdateParamsResponse",
  encode(_: MsgUpdateParamsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateParamsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateParamsResponse();
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
  fromJSON(_: any): MsgUpdateParamsResponse {
    return {};
  },
  toJSON(_: MsgUpdateParamsResponse): JsonSafe<MsgUpdateParamsResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgUpdateParamsResponse>): MsgUpdateParamsResponse {
    const message = createBaseMsgUpdateParamsResponse();
    return message;
  },
  fromProtoMsg(message: MsgUpdateParamsResponseProtoMsg): MsgUpdateParamsResponse {
    return MsgUpdateParamsResponse.decode(message.value);
  },
  toProto(message: MsgUpdateParamsResponse): Uint8Array {
    return MsgUpdateParamsResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgUpdateParamsResponse): MsgUpdateParamsResponseProtoMsg {
    return {
      typeUrl: "/cyber.clock.v1.MsgUpdateParamsResponse",
      value: MsgUpdateParamsResponse.encode(message).finish()
    };
  }
};