import React, {memo, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {usePrintersDiscovery} from 'react-native-esc-pos-printer';
import {Button, PrintersList, ScreenTitle} from '../components';
import {type NavigationProp, useNavigation} from '@react-navigation/native';
import type {RootStackParamList} from '../navigation/RootNavigator';
import {PrintersDiscovery} from 'react-native-esc-pos-printer/src/discovery/PrintersDiscovery.tsx';
import type {DeviceInfo} from 'react-native-esc-pos-printer/src/discovery/types.ts';

type DiscoveryNavigationProp = NavigationProp<
  RootStackParamList,
  'SimplePrint'
>;

export const Discovery = memo(() => {
  const {start, printerError, isDiscovering, printers} = usePrintersDiscovery();

  const navigation = useNavigation<DiscoveryNavigationProp>();
  PrintersDiscovery.onDiscovery((deviceInfo: DeviceInfo[]) => {
    console.log('asdads', deviceInfo);
    // setPrinters(deviceInfo);
  });

  useEffect(() => {
    PrintersDiscovery.onDiscovery((deviceInfo: DeviceInfo[]) => {
      console.log('asdads', deviceInfo);
      // setPrinters(deviceInfo);
    });
  }, []);

  console.log('printers', printers);
  return (
    <View style={styles.container}>
      <View style={styles.contentCotainer}>
        <ScreenTitle title={'Discovery'} />
      </View>
      <PrintersList
        onPress={printer => {
          console.log('printer', printer);
          if (printer) {
            navigation.navigate('SimplePrint', {printer});
          }
        }}
        printers={printers}
      />
      <View style={styles.contentCotainer}>
        <Button
          loading={isDiscovering}
          title="Search"
          onPress={() => start()}
        />
        {printerError ? (
          <Text style={styles.errorText}>{printerError.message}</Text>
        ) : null}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcf9f9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  contentCotainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 20,
  },
});
