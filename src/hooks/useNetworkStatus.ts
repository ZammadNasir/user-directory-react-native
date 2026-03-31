import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

function getConnectionState(state: NetInfoState) {
  const isOnline = Boolean(
    state.isConnected && state.isInternetReachable !== false,
  );
  const details = state.details;
  const cellularGeneration =
    details && 'cellularGeneration' in details
      ? details.cellularGeneration
      : null;
  const isExpensive =
    details && 'isConnectionExpensive' in details
      ? Boolean(details.isConnectionExpensive)
      : false;
  const isSlow =
    isExpensive || cellularGeneration === '2g' || cellularGeneration === '3g';

  return { isOnline, isSlow };
}

export function useNetworkStatus() {
  const [status, setStatus] = useState({ isOnline: true, isSlow: false });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setStatus(getConnectionState(state));
    });

    NetInfo.fetch().then(state => {
      setStatus(getConnectionState(state));
    });

    return unsubscribe;
  }, []);

  return status;
}
