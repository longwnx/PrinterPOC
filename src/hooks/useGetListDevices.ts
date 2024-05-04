import {useCallback, useContext} from 'react';
import {DevicesEnum} from 'contants/enum';
import {
  BLEPrinter,
  IBLEPrinter,
  INetPrinter,
  IUSBPrinter,
  NetPrinter,
  USBPrinter,
} from 'react-native-thermal-receipt-printer-image-qr';
import {HomePageContext} from 'screens/home/HomeContextProvider.tsx';

const printerList: Record<string, any> = {
  ble: BLEPrinter,
  net: NetPrinter,
  usb: USBPrinter,
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

  const getListDevices = useCallback(async () => {
    const Printer = printerList[selectedValue];
    if (selectedValue === DevicesEnum.net) {
      await Printer.init();
      setLoading(false);
      return;
    }
    requestAnimationFrame(async () => {
      try {
        await Printer.init();
        const results = await Printer.getDeviceList();
        setDevices(
          results?.map((item: any) => ({
            ...item,
            printerType: selectedValue,
          })),
        );
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    });
  }, [selectedValue, setDevices, setLoading]);

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
  };
};

export default useGetListDevices;
