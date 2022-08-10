import { useCallback, useEffect, useState } from 'react';
import './App.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import { Stack } from '@mui/material';
import {
  getImpersonationAddress,
  getLastUsedAddress,
  startImpersonation,
  stopImpersonation
} from './common';

const App = () => {
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [address, setAddress] = useState<string>('');

  const loadAndSetImpersonationAddress = useCallback(async () => {
    console.log('Getting impersonation status');

    const currentImpersonationAddress = await getImpersonationAddress();
    const lastUsedAddress = await getLastUsedAddress();
    const updatedAddress = currentImpersonationAddress || lastUsedAddress;

    if (updatedAddress) {
      setAddress(updatedAddress);
    }
    setIsImpersonating(!!currentImpersonationAddress);
  }, []);

  // on mount
  useEffect(() => {
    loadAndSetImpersonationAddress().catch(console.error);
  }, []);

  const handleClick = () => {
    if (isImpersonating) {
      stopImpersonation().then(() => {
        setIsImpersonating(false);
      });
    } else {
      startImpersonation(address).then(() => {
        setIsImpersonating(true);
      });
    }
  };

  return (
    <div>
      <Box>
        <Stack spacing={2}>
          <Button variant="contained" onClick={handleClick}>
            {isImpersonating ? 'Stop' : 'Start'}
          </Button>
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
  );
};

export default App;
