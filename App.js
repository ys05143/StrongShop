
import React from 'react';
import styled from 'styled-components/native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon  from "react-native-vector-icons/Ionicons";
import { DefaultTheme, DataTable, Provider as PaperProvider } from 'react-native-paper';
import MainScreen from './Main/MainScreen';
import PackageScreen_1 from './NewCarPackage/PackageScreen_1';
import PackageScreen_2 from './NewCarPackage/PackageScreen_2';
import PackageScreen_3 from './NewCarPackage/PackageScreen_3';
import PackageScreen_4 from './NewCarPackage/PackageScreen_4';
import PackageScreen_5 from './NewCarPackage/PackageScreen_5';
import ShopScreen_1 from './Shop/ShopScreen_1';
import ShopScreen_Test from './Shop/ShopScreen_Test';
import AnimatedTest from './Shop/AnimatedTest';
import DetailGallery from './Shop/DetailGallery';
import MyPageScreen from './Mypage/MypageScreen';
import RecordScreen from './Mypage/RecordScreen';
import MapTest from './Shop/MapTest';
import PackageScreen_3_2 from './NewCarPackage/PackageScreen_3_2';
import PackageScreen_3_2_2 from './NewCarPackage/PackageScreen_3_2_2';
import PackageScreen_3_3 from './NewCarPackage/PackageScreen3_3';
import DetailOptionScreen from './NewCarPackage/DetailOptionScreen';
import Test_ShopScreen from './Shop/Test_ShopScreen';
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
        {/* 신차패키지 4 */}
        {<Stack.Screen name="PackageScreen_4" component={PackageScreen_4} options={{headerShown:false}}/>}
        {/* 신차패키지 5 */}
        {<Stack.Screen name="PackageScreen_5" component={PackageScreen_5} options={{headerShown:false}}/>}
        {/* 업체페이지 5 */}
        {<Stack.Screen name="ShopScreen_1" component={ShopScreen_1} options={{headerShown:false}}/>}
        {/* 업체 작업갤러리 상세 */}
        {<Stack.Screen name="DetailGallery" component={DetailGallery} options={{headerShown:false}}/>}
        {/* 마이페이지 */}
        {<Stack.Screen name="MyPageScreen" component={MyPageScreen} options={{headerShown:false}}/>}
        {/* 과거 기록 페이지 */}
        {<Stack.Screen name="RecordScreen" component={RecordScreen} options={{headerShown:false}}/>}
        {/* 지도test */}
        {<Stack.Screen name="MapTest" component={MapTest} options={{headerShown:false}}/>}
        {/* 업체 작업갤러리 상세 test */}
        {<Stack.Screen name="ShopScreen_Test" component={ShopScreen_Test} options={{headerShown:false}}/>}
        {/* 애니메이션 test */}
        {<Stack.Screen name="AnimatedTest" component={AnimatedTest} options={{headerShown:false}}/>}
        {/* 신차패키지 3 ver 2.0 */}
        {<Stack.Screen name="PackageScreen_3_2" component={PackageScreen_3_2} options={{headerShown:false}}/>}
        {/* 신차패키지 3 ver 2.0 */}
        {<Stack.Screen name="PackageScreen_3_2_2" component={PackageScreen_3_2_2} options={{headerShown:false}}/>}
        {/* 신차패키지 3 ver 3.0 */}
        {<Stack.Screen name="PackageScreen_3_3" component={PackageScreen_3_3} options={{headerShown:false}}/>}
        {/* DetailOption 고르기 */}
        {<Stack.Screen name="DetailOptionScreen" component={DetailOptionScreen} options={{headerShown:false}}/>}
        {/* 업체페이지 Test Ver */}
        {<Stack.Screen name="Test_ShopScreen" component={Test_ShopScreen} options={{headerShown:false}}/>}

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;