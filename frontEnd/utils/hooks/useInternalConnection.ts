import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

function useInternetConnection() {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        // Subscribe to network state updates
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsOnline(!!(state.isConnected && state.isInternetReachable));
        });

        // Check the initial network status
        NetInfo.fetch().then(state => {
            setIsOnline(!!(state.isConnected && state.isInternetReachable));
        });

        // Unsubscribe to avoid memory leaks
        return () => {
            unsubscribe();
        };
    }, []);

    return isOnline;
}

export default useInternetConnection;
