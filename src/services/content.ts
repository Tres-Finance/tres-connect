export { }


const injectScript = () => {
  try {
    const container = document.head || document.documentElement;
    const scriptTag = document.createElement('script');
    scriptTag.setAttribute('async', 'false');
    const url = chrome.runtime.getURL('static/js/inpage.js')
    scriptTag.setAttribute('src', url);
    const 
    scriptTag.setAttribute('onload', 'window.impersonator.startImpersonation("0x3904b3cc9b0ce0c0248d5dbdc7d57af3d0e0dd70", false)');
    container.insertBefore(scriptTag, container.children[0]);
    container.removeChild(scriptTag);
  } catch (error) {
    console.error('Provider injection failed.', error);
  }
}

const main = async () => {
  console.debug("Loading inpage script")
  injectScript()
  console.log("content script loaded")
}

main()
