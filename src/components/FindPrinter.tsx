import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  NetPrinter,
  NetPrinterEventEmitter,
  RN_THERMAL_RECEIPT_PRINTER_EVENTS,
} from 'react-native-thermal-receipt-printer-image-qr';
import Loading from './Loading';

import {navigate} from '../../App';
import HomeContextProvider from 'screens/home/HomeContextProvider.tsx';
import {useGetListDevices} from 'hooks';

export interface DeviceType {
  host: string;
  port: string;
  device_name?: string;
  printerType?: string;
}

const FindPrinter = () => {
  const {setDevices, loading, setLoading, devices} = useGetListDevices();
  React.useEffect(() => {
    if (devices?.length === 0) {
      setLoading(true);
      NetPrinterEventEmitter.addListener(
        RN_THERMAL_RECEIPT_PRINTER_EVENTS.EVENT_NET_PRINTER_SCANNED_SUCCESS,
        (printers: DeviceType[]) => {
          console.log({printers});
          if (printers) {
            console.log({printers});
            setLoading(false);
            setDevices(printers);
          }
        },
      );
      (async () => {
        const results = await NetPrinter.getDeviceList();
        console.log({results});
      })();
    }
    return () => {
      NetPrinterEventEmitter.removeAllListeners(
        RN_THERMAL_RECEIPT_PRINTER_EVENTS.EVENT_NET_PRINTER_SCANNED_SUCCESS,
      );
      NetPrinterEventEmitter.removeAllListeners(
        RN_THERMAL_RECEIPT_PRINTER_EVENTS.EVENT_NET_PRINTER_SCANNED_ERROR,
      );
    };
  }, [devices?.length, setDevices, setLoading]);

  const onSelectedPrinter = (printer: any) => {
    navigate('Home', {printer});
  };

  if (loading) {
    return <Loading loading={true} text={'Finding'} />;
  }

  return (
    <View style={styles.container}>
      {devices?.length > 0 &&
        devices?.map((item: any, index: number) => {
          const onPress = () => onSelectedPrinter(item);
          return (
            <TouchableOpacity key={`printer-item-${index}`} onPress={onPress}>
              <Text>{item.host}</Text>
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

const FindPage = React.memo(props => {
  return (
    <HomeContextProvider {...props}>
      <FindPrinter {...props} />
    </HomeContextProvider>
  );
});

export default FindPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
