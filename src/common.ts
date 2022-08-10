// badge impersonation status
const setBadgeImpersonationStatus = async (isImpersonating: boolean): Promise<void> => {
    const tabId = await getActiveTabId()
    return chrome.action.setBadgeText({
        text: isImpersonating ? 'ON' : '',
        tabId
    }, () => { });
}

export const updateBadgeImpersonationStatus = async (): Promise<void> => {
    return setBadgeImpersonationStatus(
        await getIsImpersonating()
    )
}


// isImpersonating
export const getIsImpersonating = async (): Promise<boolean> => {
    const { isImpersonating } = await chrome.storage.local.get('isImpersonating')
    return isImpersonating || false
}

export const setIsImpersonating = async (status: boolean): Promise<void> => {
    setBadgeImpersonationStatus(status)
    return chrome.storage.local.set({ isImpersonating: status })
}

// lastUsedAddress
export const getLastUsedAddress = async (): Promise<string | undefined> => {
    const { address } = await chrome.storage.local.get('address')
    return address
}

export const setLastUsedAddress = async (address: string): Promise<void> => {
    return chrome.storage.local.set({ 'address': address })
}

// active tab ids
export const getActiveTabId = async (): Promise<number> => {
    return (await chrome.tabs.query({ active: true, currentWindow: true }))[0].id || 0
}

// start/stop impersonation
export const startImpersonation = async (address: string): Promise<chrome.scripting.InjectionResult<void>[]> => {
    setIsImpersonating(true)
    setLastUsedAddress(address)
    return chrome.scripting.executeScript({
        func: (address) => {
            window.impersonator?.startImpersonation(address, true)
        },
        args: [address],
        target: {
            tabId: await getActiveTabId()
        },
        world: 'MAIN',
    });
}

export const stopImpersonation = async (): Promise<chrome.scripting.InjectionResult<void>[]> => {
    setIsImpersonating(false)
    return chrome.scripting.executeScript({
        func: (address) => {
            window.impersonator?.stopImpersonation()
        },
        args: [],
        target: {
            tabId: await getActiveTabId()
        },
        world: 'MAIN',
    });
}

export const getImpersonationAddress = async (): Promise<string | undefined> => {
    const [{ result: address }] = await chrome.scripting.executeScript({
        func: () => {
            return window.impersonator?.address
        },
        args: [],
        target: {
            tabId: await getActiveTabId()
        },
        world: 'MAIN',
    });

    setIsImpersonating(!!address)
    
    return address;
}