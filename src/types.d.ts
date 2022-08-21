export interface ExtendedWindow extends Window {
  ethereum: {
    request: (...args: any[]) => Promise<any>;
    send?: (
      methodOrPayload: string | JsonRpcRequest,
      paramsOrCallback: Array<unknown> | JsonRpcCallback
    ) => Promise<JsonRpcResponse> | void;
    enable?: () => Promise<any>;
    sendAsync?: (payload: JsonRpcRequest, callback: JsonRpcCallback) => void;
    emit: (event: string, data: any) => void;
    selectedAddress: string;
  };
  impersonator: {
    address?: string;
    mockedFunctionsUndoers: {
      [key: string]: CallableFunction;
    };
    stopImpersonation: () => void;
    startImpersonation: (address: string, triggerAccountsChanged: boolean) => void;
    originalAddress?: string;
  };
}

export interface JsonRpcRequest {
  id: string | undefined;
  jsonrpc: '2.0';
  method: string;
  params?: Array<any>;
}

export interface JsonRpcResponse {
  id: string | undefined;
  jsonrpc: '2.0';
  method: string;
  result?: unknown;
  error?: Error;
}

export type JsonRpcCallback = (error: Error | null, response: JsonRpcResponse) => unknown;
