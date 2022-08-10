import { getIsImpersonating, getLastUsedAddress } from "../common";

const setupOnInpageScriptLoaded = async () => {
  const [isImpersonating, lastUsedAddress] = await Promise.all([getIsImpersonating(), getLastUsedAddress()])

  if (isImpersonating && lastUsedAddress) {
    // when inpage is loaded, it sends an "impersonator-ready" event
    // we then ask it to start impersonating the last used address
    window.addEventListener("message", (event) => {
      if (event.data.type && (event.data.type == "impersonator-ready")) {
        console.log("Page script received: ", event.data)
        window.postMessage({ type: 'impersonator-start', address: lastUsedAddress, triggerAccountsChanged: false })
      }
    })
  }
}

const injectScript = async () => {
  try {
    const container = document.head || document.documentElement;
    const scriptTag = document.createElement('script');
    scriptTag.setAttribute('async', 'false');
    const url = chrome.runtime.getURL('static/js/inpage.js')
    scriptTag.setAttribute('src', url);
    container.insertBefore(scriptTag, container.children[0]);
    container.removeChild(scriptTag);
  } catch (error) {
    console.error('Tres-Connect Inpage injection failed.', error);
  }
}

const main = async () => {
  await setupOnInpageScriptLoaded()
  await injectScript()
  console.log("content script loaded")
}

main()
