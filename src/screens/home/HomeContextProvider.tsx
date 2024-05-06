import React, {createContext, Dispatch, SetStateAction, useState} from 'react';
import {DevicesEnum} from 'contants/enum.ts';
import {
  BLEPrinter,
  NetPrinter,
  USBPrinter,
} from 'react-native-thermal-receipt-printer-image-qr';
import {SelectedPrinter} from 'hooks/useGetListDevices.ts';
import {DeviceType} from 'components/FindPrinter.tsx';

export interface HomePageContextData {
  selectedValue: string | number;
  loading: boolean;
  setSelectedValue: Dispatch<SetStateAction<string>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  printerList: Record<string, any>;
  devices: any[];
  setDevices: Dispatch<SetStateAction<never[]>>;
  selectedPrinter: SelectedPrinter;
  setSelectedPrinter: Dispatch<SetStateAction<SelectedPrinter>>;
  selectedNetPrinter: DeviceType;
  setSelectedNetPrinter: Dispatch<SetStateAction<DeviceType>>;
}

export const HomePageContext = createContext<HomePageContextData>(
  {} as HomePageContextData,
);

export const PORT: string = '9100';

const HomeContextProvider = ({children}: {children?: React.ReactNode}) => {
  const printerList: Record<string, any> = {
    ble: BLEPrinter,
    net: NetPrinter,
    usb: USBPrinter,
  };
  const [selectedValue, setSelectedValue] = useState<keyof typeof printerList>(
    DevicesEnum.blu,
  );

  const [selectedNetPrinter, setSelectedNetPrinter] = useState<DeviceType>({
    device_name: 'My Net Printer',
    host: '192.168.123.1', // your host
    port: PORT, // your port
    printerType: DevicesEnum.net,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [devices, setDevices] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState<SelectedPrinter>({});
  return (
    <HomePageContext.Provider
      value={{
        selectedValue,
        setSelectedValue,
        printerList,
        loading,
        setLoading,
        devices,
        setDevices,
        selectedPrinter,
        setSelectedPrinter,
        selectedNetPrinter,
        setSelectedNetPrinter,
      }}>
      {children}
    </HomePageContext.Provider>
  );
};

export default HomeContextProvider;
