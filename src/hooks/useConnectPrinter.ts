import {BLEPrinter} from 'react-native-thermal-receipt-printer-image-qr';
import {useCallback, useContext} from 'react';
import {HomePageContext} from 'screens/home/HomeContextProvider.tsx';

const useConnectPrinter = () => {
  const {selectedPrinter, setLoading, devices} = useContext(HomePageContext);
  const connect = useCallback(async () => {
    try {
      if (devices[0].inner_mac_address) {
        const data = await BLEPrinter.connectPrinter(
          selectedPrinter?.inner_mac_address?.toString() || '',
        );
        console.log('data', data);
      }
    } catch (err) {
      console.log('err', err);
      console.warn(err);
    } finally {
      setLoading(false);
    }
  }, [selectedPrinter?.inner_mac_address, devices, setLoading]);

  return {connect};
};

export default useConnectPrinter;
