declare global {
    interface Window {
        ethereum: {
            request: (...args: any[]) => Promise<any>;
            send?: (methodOrPayload: string | JsonRpcRequest, paramsOrCallback: Array<unknown> | JsonRpcCallback) => Promise<JsonRpcResponse> | void;
            enable?: () => Promise<any>;
            sendAsync?: (payload: JsonRpcRequest, callback: JsonRpcCallback) => void;
            emit: (event: string, data: any) => void;
            selectedAddress: string;
        }
        impersonator: {
            address?: string
            mockedFunctionsUndoers: {
                [key: string]: CallableFunction
            }
            stopImpersonation: () => void,
            startImpersonation: (address: string, triggerAccountsChanged: boolean) => void,
            originalAddress?: string
        }
    }
}

interface JsonRpcRequest {
    id: string | undefined;
    jsonrpc: '2.0';
    method: string;
    params?: Array<any>;
}

interface JsonRpcResponse {
    id: string | undefined;
    jsonrpc: '2.0';
    method: string;
    result?: unknown;
    error?: Error;
}

type JsonRpcCallback = (error: Error | null, response: JsonRpcResponse) => unknown;


export const setupInpageImpersonator = () => {

    const patchRequest = () => {
        if (window.impersonator.mockedFunctionsUndoers['request']) {
            return;
        }

        const request = window.ethereum.request;
        window.ethereum.request = (args: { method: string }) => {
            if (args.method === 'eth_requestAccounts' || args.method === 'eth_accounts') {
                return Promise.resolve([window.impersonator.address]);
            }
            return request(args);
        }

        window.impersonator.mockedFunctionsUndoers['request'] = () => {
            window.ethereum.request = request;
        }
    }

    // https://docs.metamask.io/guide/ethereum-provider.html#legacy-methods
    const patchSend = () => {
        if (window.impersonator.mockedFunctionsUndoers['send']) {
            return;
        }

        const send = window.ethereum.send;
        if (send) {
            window.ethereum.send = (methodOrPayload: string | JsonRpcRequest, paramsOrCallback: Array<unknown> | JsonRpcCallback): Promise<JsonRpcResponse> | void =>{
                if (typeof methodOrPayload === 'string') {
                    if (methodOrPayload === 'eth_requestAccounts' || methodOrPayload === 'eth_accounts') {
                        return Promise.resolve({
                            id: '1234879123407',
                            jsonrpc: '2.0',
                            method: methodOrPayload,
                            result: [window.impersonator.address]
                        });
                    }
                
                } else {
                    // payload
                    if (methodOrPayload.method === 'eth_requestAccounts' || methodOrPayload.method === 'eth_accounts') {
                        // callback
                        if (typeof paramsOrCallback === 'function') {
                            paramsOrCallback(null, {
                                id: methodOrPayload.id,
                                jsonrpc: '2.0',
                                method: methodOrPayload.method,
                                result: [window.impersonator.address]
                            });

                        }
                        // params                  
                        else {
                            return Promise.resolve({
                                id: methodOrPayload.id,
                                jsonrpc: '2.0',
                                method: methodOrPayload.method,
                                result: [window.impersonator.address]
                            });
                        }
                    }
                }
                return send(methodOrPayload, paramsOrCallback);
            }

            window.impersonator.mockedFunctionsUndoers['send'] = () => {
                window.ethereum.send = send;
            }
        }
    }

    // https://docs.metamask.io/guide/ethereum-provider.html#legacy-methods
    const patchEnable = () => {
        if (window.impersonator.mockedFunctionsUndoers['enable']) {
            return;
        }

        const enable = window.ethereum.enable;
        if (enable) {
            window.ethereum.enable = () => {
                return Promise.resolve({
                    id: '1234567890',
                    jsonrpc: '2.0',
                    method: 'eth_requestAccounts',
                    result: [window.impersonator.address]
                });
            }

            window.impersonator.mockedFunctionsUndoers['enable'] = () => {
                window.ethereum.enable = enable;
            }
        }
    }

    // https://docs.metamask.io/guide/ethereum-provider.html#legacy-methods
    const patchSendAsync = () => {
        if (window.impersonator.mockedFunctionsUndoers['sendAsync']) {
            return;
        }

        const sendAsync = window.ethereum.sendAsync;
        if (sendAsync) {
            window.ethereum.sendAsync = (payload: JsonRpcRequest, callback: JsonRpcCallback): void => {
                if (payload.method === 'eth_requestAccounts' || payload.method === 'eth_accounts') {
                    callback(null, {
                        id: '1234567890',
                        jsonrpc: '2.0',
                        method: 'eth_requestAccounts',
                        result: [window.impersonator.address]
                    });
                } else {
                    sendAsync(payload, callback);
                }
            }

            window.impersonator.mockedFunctionsUndoers['sendAsync'] = () => {
                window.ethereum.sendAsync = sendAsync;
            }
        }
    }


    const patchSelectedAddress = () => {
        if (window.impersonator.mockedFunctionsUndoers['selectedAddress']) {
            return;
        }

        window.impersonator.originalAddress = window.ethereum.selectedAddress;
        window.ethereum.selectedAddress = window.impersonator.address || '';

        window.impersonator.mockedFunctionsUndoers['selectedAddress'] = () => {
            window.ethereum.selectedAddress = window.impersonator.originalAddress || '';
        }
    }    

    const patchAllFunctions = () => {
        patchRequest();
        patchSend();
        patchSendAsync();
        patchEnable();
        patchSelectedAddress()
    }

    const unpatchAllFunctions = () => {
        for (const mockedFunctionName of Object.keys(window.impersonator.mockedFunctionsUndoers)) {
            const undoer = window.impersonator.mockedFunctionsUndoers[mockedFunctionName];
            undoer();
            delete window.impersonator.mockedFunctionsUndoers[mockedFunctionName];
        }
    }


    const startImpersonation = (address: string, triggerAccountsChanged: boolean) => {
        console.debug('start impersonation', address);
        window.impersonator.address = address;
        patchAllFunctions();

        if (triggerAccountsChanged) {
            window.ethereum.emit('accountsChanged', [window.impersonator.address]);
        }

    }

    const stopImpersonation = () => {
        console.debug('stop impersonation', window.impersonator?.address);
        unpatchAllFunctions();

        const originalAddress = window.impersonator.originalAddress;

        delete window.impersonator.address;

        window.ethereum.emit('accountsChanged', [originalAddress]);

    }

    if (!window.impersonator) {
        window.impersonator = { mockedFunctionsUndoers: {}, stopImpersonation, startImpersonation };
        console.log('[Impersonator::inpage.js]. Injected');
    }
}

setupInpageImpersonator()