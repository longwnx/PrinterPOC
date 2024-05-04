import {DevicesEnum} from 'contants/enum.ts';
import {
  BLEPrinter,
  NetPrinter,
  USBPrinter,
} from 'react-native-thermal-receipt-printer-image-qr';
import {Alert} from 'react-native';
import {useCallback, useContext} from 'react';
import {HomePageContext} from 'screens/home/HomeContextProvider.tsx';

const useConnectPrinter = () => {
  const {selectedValue, selectedPrinter, selectedNetPrinter, setLoading} =
    useContext(HomePageContext);
  const connect = useCallback(async () => {
    try {
      switch (
        selectedValue === DevicesEnum.net
          ? selectedNetPrinter.printerType
          : selectedPrinter.printerType
      ) {
        case 'ble':
          if (selectedPrinter?.inner_mac_address) {
            await BLEPrinter.connectPrinter(
              selectedPrinter?.inner_mac_address || '',
            );
          }
          break;
        case 'net':
          if (!selectedNetPrinter) {
            break;
          }
          try {
            // if (connected) {
            // await NetPrinter.closeConn();
            // setConnected(!connected);
            // }
            const status = await NetPrinter.connectPrinter(
              selectedNetPrinter?.host || '',
              9100,
            );
            setLoading(false);
            Alert.alert(
              'Connect successfully!',
              `Connected to ${status.host ?? 'Printers'} !`,
            );
            // setConnected(true);
          } catch (err) {
            Alert.alert('Connect failed!', `${err} !`);
          }
          break;
        case 'usb':
          if (selectedPrinter?.vendor_id) {
            await USBPrinter.connectPrinter(
              selectedPrinter?.vendor_id || '',
              selectedPrinter?.product_id || '',
            );
          }
          break;
        default:
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  }, [
    selectedValue,
    selectedNetPrinter,
    selectedPrinter.printerType,
    selectedPrinter?.inner_mac_address,
    selectedPrinter?.vendor_id,
    selectedPrinter?.product_id,
    setLoading,
  ]);

  return {connect};
};

export default useConnectPrinter;
