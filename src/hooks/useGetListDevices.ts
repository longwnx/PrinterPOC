import {useCallback, useContext} from 'react';
import {
  BLEPrinter,
  IBLEPrinter,
  INetPrinter,
  IUSBPrinter,
} from 'react-native-thermal-receipt-printer-image-qr';
import {HomePageContext} from 'screens/home/HomeContextProvider.tsx';
import {Platform} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

const printerList: Record<string, any> = {
  ble: BLEPrinter,
  // net: NetPrinter,
  // usb: USBPrinter,
};

export interface SelectedPrinter
  extends Partial<IUSBPrinter & IBLEPrinter & INetPrinter> {
  printerType?: keyof typeof printerList;
}

const useGetListDevices = () => {
  const {
    selectedValue,
    setSelectedValue,
    loading,
    setLoading,
    devices,
    setDevices,
    setSelectedNetPrinter,
    selectedNetPrinter,
    selectedPrinter,
    setSelectedPrinter,
  } = useContext(HomePageContext);

  const requestBluetoothPermission = async () => {
    try {
      const status = await check(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.BLUETOOTH
          : PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      );
      if (status !== RESULTS.GRANTED) {
        const permissionStatus = await request(
          Platform.OS === 'ios'
            ? PERMISSIONS.IOS.BLUETOOTH
            : PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        );
        if (permissionStatus === RESULTS.GRANTED) {
          return RESULTS.GRANTED;
        }
      } else {
        return RESULTS.GRANTED;
      }
    } catch (error) {}
  };

  const getListDevices = useCallback(async () => {
    const hasPermission = await requestBluetoothPermission();
    if (hasPermission) {
      try {
        await BLEPrinter.init();
        const data = await BLEPrinter.getDeviceList();
        setDevices(data);
        setSelectedPrinter(data[0]);
      } catch (err) {
        console.log('err', err);
      }
    }
    // const Printer = printerList[0];
    console.log('run', printerList[0]);

    // if (selectedValue === DevicesEnum.blu) {
    //   await Printer.init();
    //   setLoading(false);
    //   return;
    // }
    // requestAnimationFrame(async () => {
    //   try {
    //     await Printer.init();
    //     const results = await Printer.getDeviceList();
    //     console.log('re', results);
    //     setDevices(
    //       results?.map((item: any) => ({
    //         ...item,
    //         printerType: selectedValue,
    //       })),
    //     );
    //   } catch (err) {
    //     console.warn(err);
    //   } finally {
    //     setLoading(false);
    //   }
    // });
  }, [setDevices, setSelectedPrinter]);

  return {
    getListDevices,
    loading,
    devices,
    selectedValue,
    setSelectedValue,
    setLoading,
    printerList,
    setSelectedNetPrinter,
    selectedNetPrinter,
    selectedPrinter,
    setSelectedPrinter,
    setDevices,
    requestBluetoothPermission,
  };
};

export default useGetListDevices;
