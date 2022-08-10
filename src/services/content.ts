import { getIsImpersonating, getLastUsedAddress } from "../common";

export {}

const injectScript = async () => {

  const [isImpersonating, lastUsedAddress] = await Promise.all([getIsImpersonating(), getLastUsedAddress()])
  console.log(isImpersonating, lastUsedAddress)

  try {
    const container = document.head || document.documentElement;
    const scriptTag = document.createElement('script');
    scriptTag.setAttribute('async', 'false');
    const url = chrome.runtime.getURL('static/js/inpage.js')
    scriptTag.setAttribute('src', url);
    if (isImpersonating) {
      // TODO: inject a script that waits for "onLoad" event from inpage.js, then start impersonation via sending a message
      scriptTag.setAttribute('onload', `window.impersonator.startImpersonation("${lastUsedAddress}", false)`);
    }    
    container.insertBefore(scriptTag, container.children[0]);
    container.removeChild(scriptTag);
  } catch (error) {
    console.error('Provider injection failed.', error);
  }
}

const main = async () => {
  await injectScript()
  console.log("content script loaded")
}

main()
