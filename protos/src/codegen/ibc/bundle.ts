//@ts-nocheck
import * as _119 from "./applications/interchain_accounts/controller/v1/controller.js";
import * as _120 from "./applications/interchain_accounts/controller/v1/query.js";
import * as _121 from "./applications/interchain_accounts/controller/v1/tx.js";
import * as _122 from "./applications/interchain_accounts/genesis/v1/genesis.js";
import * as _123 from "./applications/interchain_accounts/host/v1/host.js";
import * as _124 from "./applications/interchain_accounts/host/v1/query.js";
import * as _125 from "./applications/interchain_accounts/v1/account.js";
import * as _126 from "./applications/interchain_accounts/v1/metadata.js";
import * as _127 from "./applications/interchain_accounts/v1/packet.js";
import * as _128 from "./applications/transfer/v1/authz.js";
import * as _129 from "./applications/transfer/v1/genesis.js";
import * as _130 from "./applications/transfer/v1/query.js";
import * as _131 from "./applications/transfer/v1/transfer.js";
import * as _132 from "./applications/transfer/v1/tx.js";
import * as _133 from "./applications/transfer/v2/packet.js";
import * as _134 from "./core/channel/v1/channel.js";
import * as _135 from "./core/channel/v1/genesis.js";
import * as _136 from "./core/channel/v1/query.js";
import * as _137 from "./core/channel/v1/tx.js";
import * as _138 from "./core/client/v1/client.js";
import * as _139 from "./core/client/v1/genesis.js";
import * as _140 from "./core/client/v1/query.js";
import * as _141 from "./core/client/v1/tx.js";
import * as _142 from "./core/commitment/v1/commitment.js";
import * as _143 from "./core/connection/v1/connection.js";
import * as _144 from "./core/connection/v1/genesis.js";
import * as _145 from "./core/connection/v1/query.js";
import * as _146 from "./core/connection/v1/tx.js";
import * as _147 from "./lightclients/localhost/v1/localhost.js";
import * as _148 from "./lightclients/solomachine/v1/solomachine.js";
import * as _149 from "./lightclients/solomachine/v2/solomachine.js";
import * as _150 from "./lightclients/tendermint/v1/tendermint.js";
export namespace ibc {
  export namespace applications {
    export namespace interchain_accounts {
      export namespace controller {
        export const v1 = {
          ..._119,
          ..._120,
          ..._121
        };
      }
      export namespace genesis {
        export const v1 = {
          ..._122
        };
      }
      export namespace host {
        export const v1 = {
          ..._123,
          ..._124
        };
      }
      export const v1 = {
        ..._125,
        ..._126,
        ..._127
      };
    }
    export namespace transfer {
      export const v1 = {
        ..._128,
        ..._129,
        ..._130,
        ..._131,
        ..._132
      };
      export const v2 = {
        ..._133
      };
    }
  }
  export namespace core {
    export namespace channel {
      export const v1 = {
        ..._134,
        ..._135,
        ..._136,
        ..._137
      };
    }
    export namespace client {
      export const v1 = {
        ..._138,
        ..._139,
        ..._140,
        ..._141
      };
    }
    export namespace commitment {
      export const v1 = {
        ..._142
      };
    }
    export namespace connection {
      export const v1 = {
        ..._143,
        ..._144,
        ..._145,
        ..._146
      };
    }
  }
  export namespace lightclients {
    export namespace localhost {
      export const v1 = {
        ..._147
      };
    }
    export namespace solomachine {
      export const v1 = {
        ..._148
      };
      export const v2 = {
        ..._149
      };
    }
    export namespace tendermint {
      export const v1 = {
        ..._150
      };
    }
  }
}