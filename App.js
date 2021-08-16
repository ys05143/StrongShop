
import * as React from 'react';
import styled from 'styled-components';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon  from "react-native-vector-icons/Ionicons";
import { DefaultTheme, DataTable, Provider as PaperProvider } from 'react-native-paper';
import MainScreen from './Main/MainScreen';
import PackageScreen_1 from './NewCarPackage/PackageScreen_1';
import PackageScreen_2 from './NewCarPackage/PackageScreen_2';
import PackageScreen_3 from './NewCarPackage/PackageScreen_3';
import Temp from './Temp';

const Button = styled.TouchableOpacity`
    padding-left: 10px;
    justify-content: center;
    align-items: center;
`;
const Stack = createStackNavigator();

function App (props) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerLeft: (props)=>(
          <Button {...props}>
            <BackIcon />
          </Button>),
        headerStyle:{backgroundColor:'#f45111'},
      }}>
        
        { /* 개발시 보는 임시 첫화면 */}
        {<Stack.Screen name="Temp" component={Temp} options={{headerShown:false}}/>}
        {/* 메인화면 */}
        {<Stack.Screen name="MainScreen" component={MainScreen} options={{headerShown:false}}/>}
        {/* 신차패키지 1 */}
        {<Stack.Screen name="PackageScreen_1" component={PackageScreen_1} options={{headerShown:false}}/>}
        {/* 신차패키지 2 */}
        {<Stack.Screen name="PackageScreen_2" component={PackageScreen_2} options={{headerShown:false}}/>}
        {/* 신차패키지 3 */}
        {<Stack.Screen name="PackageScreen_3" component={PackageScreen_3} options={{headerShown:false}}/>}

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;