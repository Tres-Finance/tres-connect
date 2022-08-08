import { useCallback, useEffect, useState } from 'react';
import './App.css'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import { Stack } from '@mui/material';
import { setupInpageImpersonator } from './inpage';

const App = () => {
  const [isImpersonating, setIsImpersonating] = useState(false)
  const [address, setAddress] = useState<string>('')


  const getActiveTabId = async (): Promise<number> => {
    return (await chrome.tabs.query({ active: true, currentWindow: true }))[0].id || 0
  }

  const startImpersonation = async (address: string) => {
    await chrome.scripting.executeScript({
      func: (address) => {
        window.impersonator?.startImpersonation(address)
      },
      args: [address],
      target: {
        tabId: await getActiveTabId()
      },
      world: 'MAIN',
    });

    setIsImpersonating(true)

  }

  const stopImpersonation = async () => {
    await chrome.scripting.executeScript({
      func: (address) => {
        window.impersonator?.stopImpersonation()
      },
      args: [address],
      target: {
        tabId: await getActiveTabId()
      },
      world: 'MAIN',
    });

    setIsImpersonating(false)
  }

  const getImpersonationAddress = async (): Promise<string | undefined> => {
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

    return address;
  }

  const loadInpageScript = async () => {
    console.debug("Loading inpage script")
    await chrome.scripting.executeScript({
      func: setupInpageImpersonator,
      args: [],
      target: {
        tabId: await getActiveTabId()
      },
      world: 'MAIN',
    });

    console.debug("Inpage script loaded")
  }

  const setLastUsedAddress = (address: string) => {
    chrome.storage.sync.set({'address': address}, () => {
      setAddress(address)
    });
  }

  const getLastUsedAddress = async (): Promise<string | undefined> => {
    const { address } = await chrome.storage.sync.get('address')
    return address
  }

  const loadAndSetImpersonationAddress = useCallback(async () => {
      console.log("Getting impersonation status");
      await loadInpageScript();
      
      const lastUsedAddress = await getLastUsedAddress()
      const currentImpersonationAddress = await getImpersonationAddress()

      setAddress(currentImpersonationAddress || lastUsedAddress || '')
      setIsImpersonating(!!currentImpersonationAddress)
  }, [])


  // handle isImpersonating change
  useEffect(() => {
    if (isImpersonating) {
      setLastUsedAddress(address)
    } 

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, ([tab]) => {    
      if (!tab) {
        // when devtools of the extension are open, the tabs array is empty
        return;
      }    
      chrome.action.setBadgeText({
        text: isImpersonating ? 'ON' : '',
        tabId: tab.id
      }, () => {});    
     })


  }, [isImpersonating])

  // on mount
  useEffect(() => {
    chrome.action.setBadgeBackgroundColor(
      {color: '#ff0000'},  // red
      () => { /* ... */ },
    );
    loadAndSetImpersonationAddress().catch(console.error);
  }, []);

  const handleClick = () => {
    if (isImpersonating) {
      stopImpersonation()
    } else {
      startImpersonation(address)
    }
  }

  return (
    <div>
      <Box>
        <Stack spacing={2}>
          <Button variant='contained' onClick={handleClick}>{isImpersonating ? 'Stop' : 'Start'}</Button>
          <TextField
            label="Address"
            variant="outlined"
            disabled={isImpersonating}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Stack>
      </Box>
    </div>
  )
}

export default App
