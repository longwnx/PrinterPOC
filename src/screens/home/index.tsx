import {Picker} from '@react-native-picker/picker';
import React, {createContext, useCallback, useEffect, useRef} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BLEPrinter,
  ColumnAlignment,
  COMMANDS,
} from 'react-native-thermal-receipt-printer-image-qr';
import {navigate} from '../../../App'; // import AntIcon from 'react-native-vector-icons/AntDesign';
// import QRCode from 'react-native-qrcode-svg';
import {Loading} from '../../components';
// @ts-ignore
import EscPosEncoder from 'esc-pos-encoder';
import {useConnectPrinter, useGetListDevices} from '../../hooks';
import HomeContextProvider from './HomeContextProvider';
import ImgToBase64 from 'react-native-image-base64';

const deviceWidth = Dimensions.get('window').width;

export interface HomePageContextData {}

export const HomePageContext = createContext<HomePageContextData>(
  {} as HomePageContextData,
);

const HomeScreen = ({route}: any) => {
  const {
    getListDevices,
    loading,
    setLoading,
    selectedValue,
    setSelectedValue,
    devices,
    printerList,
    setSelectedNetPrinter,
    selectedNetPrinter,
    selectedPrinter,
    setSelectedPrinter,
  } = useGetListDevices();

  const {connect} = useConnectPrinter();

  const QrRef = useRef<any>(null);

  useEffect(() => {
    if (route.params?.printer) {
      setSelectedNetPrinter({
        ...selectedNetPrinter,
        ...route.params.printer,
      });
    }
  }, [route?.params?.printer, selectedNetPrinter, setSelectedNetPrinter]);

  useEffect(() => {
    // setLoading(true);
    getListDevices();
  }, [getListDevices]);

  const handleConnectSelectedPrinter = useCallback(async () => {
    setLoading(true);
    await connect();
  }, [connect, setLoading]);

  const handlePrint = async () => {
    try {
      // const Printer = printerList[selectedValue];
      BLEPrinter.printText('<C>sample text</C>', {
        cut: false,
      });
      BLEPrinter.printImage(
        'https://media-cdn.tripadvisor.com/media/photo-m/1280/1b/3a/bd/b5/the-food-bill.jpg',
        {
          imageWidth: 590,
        },
      );
      BLEPrinter.printBill('<C>sample text</C>', {beep: false});
    } catch (err) {
      console.warn(err);
    }
  };

  const handlePrintBill = async () => {
    let address = '13 Phạm Hùng, nam từ Liêm';
    const BOLD_ON = COMMANDS.TEXT_FORMAT.TXT_BOLD_ON;
    const BOLD_OFF = COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF;
    const CENTER = COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT;
    const OFF_CENTER = COMMANDS.TEXT_FORMAT.TXT_ALIGN_LT;
    try {
      BLEPrinter.printText(`${CENTER}${BOLD_ON} BILLING ${BOLD_OFF}\n`);
      BLEPrinter.printText(`${CENTER}${address}${OFF_CENTER}`);
      BLEPrinter.printText('090 3399 031 555\n');
      BLEPrinter.printText('Date : 15- 09 - 2021 /15 : 29 : 57 / Admin');
      BLEPrinter.printText('Product : Total - 4 / No. (1,2,3,4)\n');
      BLEPrinter.printText(
        `${CENTER}${COMMANDS.HORIZONTAL_LINE.HR_80MM}${CENTER}`,
      );
      let orderList = [
        ['1. Skirt Palas Labuh Muslimah Fashion', 'x2', '500$'],
        ['2. BLOUSE ROPOL VIRAL MUSLIMAH FASHION', 'x4222', '500$'],
        [
          '3. Women Crew Neck Button Down Ruffle Collar Loose Blouse',
          'x1',
          '30000000000000$',
        ],
        ['4. Retro Buttons Up Full Sleeve Loose', 'x10', '200$'],
        ['5. Retro Buttons Up', 'x10', '200$'],
      ];
      let columnAlignment = [
        ColumnAlignment.LEFT,
        ColumnAlignment.CENTER,
        ColumnAlignment.RIGHT,
      ];
      let columnWidth = [46 - (7 + 12), 7, 12];
      const header = ['Product list', 'Qty', 'Price'];
      BLEPrinter.printColumnsText(header, columnWidth, columnAlignment, [
        `${BOLD_ON}`,
        '',
        '',
      ]);
      BLEPrinter.printText(
        `${CENTER}${COMMANDS.HORIZONTAL_LINE.HR3_80MM}${CENTER}`,
      );
      for (let i in orderList) {
        BLEPrinter.printColumnsText(
          orderList[i],
          columnWidth,
          columnAlignment,
          [`${BOLD_OFF}`, '', ''],
        );
      }
      BLEPrinter.printText('\n');

      BLEPrinter.printBill(`${CENTER}Thank you\n`, {beep: false});
    } catch (err) {
      console.warn(err);
    }
  };

  const printBuild = useCallback(async () => {
    let address = '2700 S123 Grand Ave, Los Angeles, CA 90007223, USA.';
    const BOLD_ON = COMMANDS.TEXT_FORMAT.TXT_BOLD_ON;
    const BOLD_OFF = COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF;
    const CENTER = COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT;
    const OFF_CENTER = COMMANDS.TEXT_FORMAT.TXT_ALIGN_LT;
    const data = await ImgToBase64.getBase64String(
      'https://media-cdn.tripadvisor.com/media/photo-m/1280/1b/3a/bd/b5/the-food-bill.jpg',
    );
    console.log('ImgToBase64', data);
    try {
      await BLEPrinter.printImageBase64(data, {
        imageWidth: 589,
      });
    } catch (error) {
      console.log('error', error);
    }
  }, []);

  const handlePrintBillWithImage = async () => {
    BLEPrinter.printImage(require('assets/Order.png'), {
      imageWidth: 575,
    });
    // BLEPrinter.printBill('', {beep: false});
  };

  const findPrinter = () => {
    navigate('Find');
  };

  const onChangeText = (text: string) => {
    setSelectedNetPrinter({...selectedNetPrinter, host: text});
  };

  const _renderNet = () => (
    <>
      <Text style={[styles.text, {color: 'black', marginLeft: 0}]}>
        Your printer ip....
      </Text>
      <TextInput
        style={{
          borderBottomWidth: 1,
          height: 45,
        }}
        placeholder={'Your printer port...'}
        value={selectedNetPrinter?.host}
        onChangeText={onChangeText}
      />
      <View
        style={{
          marginTop: 10,
        }}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: 'grey', height: 30}]}
          // disabled={!selectedPrinter?.device_name}
          onPress={findPrinter}>
          {/*<AntIcon name={'search1'} color={'white'} size={18} />*/}
          <Text style={styles.text}>Find your printers</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const _renderOther = () => (
    <>
      <Text>Select printer: </Text>
      <Picker
        selectedValue={selectedPrinter}
        onValueChange={setSelectedPrinter}>
        {devices !== undefined &&
          devices?.length > 0 &&
          devices?.map((item: any, index) => (
            <Picker.Item
              label={item.device_name}
              value={item}
              key={`printer-item-${index}`}
            />
          ))}
      </Picker>
    </>
  );

  return (
    <View style={styles.container}>
      {/* Printers option */}
      <View style={styles.section}>
        <Text style={styles.title}>Select printer type: </Text>
        <Picker
          selectedValue={String(selectedValue)}
          mode="dropdown"
          // onValueChange={handleChangePrinterType}
        >
          {Object.keys(printerList).map((item, index) => (
            <Picker.Item
              label={item.toUpperCase()}
              value={item}
              key={`printer-type-item-${index}`}
            />
          ))}
        </Picker>
      </View>
      {/* Printers List */}
      <View style={styles.section}>
        {selectedValue === 'net' ? _renderNet() : _renderOther()}
        {/* Buttons Connect */}
        <View
          style={[
            styles.buttonContainer,
            {
              marginTop: 50,
            },
          ]}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleConnectSelectedPrinter}>
            {/*<AntIcon name={'disconnect'} color={'white'} size={18} />*/}
            <Text style={styles.text}>Connect</Text>
          </TouchableOpacity>
        </View>
        {/* Button Print sample */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: 'blue'}]}
            onPress={handlePrint}>
            {/*<AntIcon name={'printer'} color={'white'} size={18} />*/}
            <Text style={styles.text}>Print sample</Text>
          </TouchableOpacity>
        </View>
        {/* Button Print bill */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: 'blue'}]}
            onPress={handlePrintBill}>
            {/*<AntIcon name={'profile'} color={'white'} size={18} />*/}
            <Text style={styles.text}>Print bill</Text>
          </TouchableOpacity>
        </View>
        {/* Button Print bill With Image */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: 'blue'}]}
            onPress={handlePrintBillWithImage}>
            {/*<AntIcon name={'profile'} color={'white'} size={18} />*/}
            <Text style={styles.text}>Print bill With Image</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: 'blue'}]}
            onPress={printBuild}>
            {/*<AntIcon name={'profile'} color={'white'} size={18} />*/}
            <Text style={styles.text}>In thur</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.qr}>
          {/*<QRCode value="hey" getRef={(el: any) => (QrRef = el)} />*/}
        </View>
      </View>
      <Loading loading={loading} />
    </View>
  );
};

const HomePage = React.memo(props => {
  return (
    <HomeContextProvider {...props}>
      <HomeScreen {...props} />
    </HomeContextProvider>
  );
});

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    // backgroundColor: 'red',
  },
  section: {},
  rowDirection: {
    flexDirection: 'row',
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    height: 40,
    width: deviceWidth / 1.5,
    alignSelf: 'center',
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  text: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  title: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  qr: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});
