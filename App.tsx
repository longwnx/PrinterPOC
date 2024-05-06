import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {createRef} from 'react';
import SunmiScreen from 'screens/sunmi-v2';
import FindPage from 'components/FindPrinter.tsx';
import HomePage from 'screens/home';

export const navigationRef = createRef<any>();

export function navigate(name: string, params?: any) {
  navigationRef.current?.navigate(name, params);
}

const App = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={{
            headerTitle: 'Printer Demo',
          }}
        />
        <Stack.Screen
          name="Find"
          options={{
            headerTitle: 'Find Printer',
          }}
          component={FindPage}
        />
        <Stack.Screen
          name="Sunmi"
          options={{
            headerTitle: 'Sunmi Printer',
          }}
          component={SunmiScreen}
        />
        {/*<Stack.Screen*/}
        {/*  name="Discovery"*/}
        {/*  options={{*/}
        {/*    headerTitle: 'Sunmi Printer',*/}
        {/*  }}*/}
        {/*  component={Discovery}*/}
        {/*/>*/}
        {/*<Stack.Screen*/}
        {/*  name="SimplePrint"*/}
        {/*  options={{*/}
        {/*    headerTitle: 'Sunmi Printer',*/}
        {/*  }}*/}
        {/*  component={SimplePrint}*/}
        {/*/>*/}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
