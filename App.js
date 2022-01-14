
import React from 'react';
import styled from 'styled-components/native';
import { View, Text, Platform, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging';
import {Notification} from "react-native-in-app-message";
import { navigationRef } from './Main/MainScreen';
import * as RootNavigation from './Main/MainScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from './function/storage';
import SplashScreen from 'react-native-splash-screen'

import MainScreen from './Main/MainScreen';
import LoginScreen from './Main/LoginScreen';
import AlarmScreen from './Main/AlarmScreen';
import ChatListScreen from './Mypage/ChatListScreen';
import ChatScreen from './Main/ChatScreen';
import PackageScreen_2 from './NewCarPackage/PackageScreen_2';
import PackageScreen_3 from './NewCarPackage/PackageScreen_3';
import PackageScreen_4 from './NewCarPackage/PackageScreen_4';
import PackageScreen_5 from './NewCarPackage/PackageScreen_5';

import PaymentScreen from './Payment/PaymentScreen';
import Pay from './Payment/Pay';
import PayFinish from './Payment/PayFinish';

import ShopScreen_1 from './Shop/ShopScreen_1';
import DetailGallery from './Shop/DetailGallery';
import MyPageScreen from './Mypage/MypageScreen';
import Certification from './Mypage/Certification';
import RecordScreen from './Mypage/RecordScreen';
import RegisterReviewScreen from './Mypage/RegisterReviewScreen';
import ProgressScreen from './Main/ProgressScreen';

import Temp from './Temp';
import SearchScreen from './NewCarPackage/SearchScreen';
import ProgressScreen_2 from './Main/ProgressScreen_2';
import PackageScreen_3_2 from './NewCarPackage/PackageScreen_3_2';
import Context from './function/Context';

const Stack = createStackNavigator();

function App (props) {
  const inAppMessage = React.useRef();
  const [alarmContent, setAlarmContent] = React.useState({title: '', content: ''});

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission(
      // {
      //   alert: true,
      //   announcement: false,
      //   badge: true,
      //   carPlay: true,
      //   provisional: false,
      //   sound: true,
      //   providesAppNotificationSettings: false,
      // }
    );
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  React.useEffect(()=>{
    requestUserPermission()
    .then(res => {
      messaging().getToken()
      .then(res=>{console.log(res)})
      .catch(e=>{console.log(e)})
    })
    .catch((e) =>{ console.log('firebase errror')});
  },[]);

  React.useEffect(()=>{  //foreground
    const unsubscribe = messaging().onMessage( async remoteMessage => {
      //alert('foreground messgage arrived!',JSON.stringify(remoteMessage));
      const index = remoteMessage.data.index;
      let title = '알림';
      let content = 'foreground';
      console.log('foreground\n'+JSON.stringify(remoteMessage));

      if(index === '200'){
          title = '입찰';
          content = '입찰이 도착했습니다.';
      }
      else if(index === '201'){
          title = '입찰 종료';
          content = '입찰 시간이 만료되었습니다.';
      }
      else if(index === '210'){
          title = remoteMessage.data.name;
          content = '업체에서 검수 사진을 등록했습니다.';
      }
      else if(index === '211'){
          title = remoteMessage.data.name;
          content = '검수가 완료되었습니다.';
      }
      else if(index === '212'){
          title = remoteMessage.data.name;
          content = '업체에서 시공 사진을 등록했습니다.';
      }
      else if(index === '213'){
          title = remoteMessage.data.name;
          content = '시공이 완료되었습니다.';
      }
      else if(index === '214'){
          title = '리뷰';
          content = '리뷰를 작성해보세요.';
      }
      else if(index === '002'){
          title = remoteMessage.notification.title;
          content = remoteMessage.notification.body;
      }
      
      if(index === '200' || index === '201' || index === '210' || index === '211' || index === '212' || index === '213' || index === '214'){
        const alarmList = await storage.fetch("Alarm");
        let newAlarm = alarmList !== null ? [...alarmList] : [];
        const length = newAlarm.length;
        newAlarm.push({
            messageId: remoteMessage.messageId,
            alarmType: index,
            date: remoteMessage.data.time,
            isRead: false,
            title: title,
            content: content,
        });
        await storage.store("Alarm", newAlarm);
      }
      if(index === '200' || index === '201' || index === '210' || index === '211' || index === '212' || index === '213' || index === '214'){
        setAlarmContent({title: title, content: content});
        inAppMessage.current?.show();
      }
      else if(index === '002'){
        setAlarmContent({title: title, content: content});
        inAppMessage.current?.show();
      }
      else{

      }
    });
      return unsubscribe;
  },[]);

  React.useEffect(()=>{ // background message open by touching
      const unsubscribe = messaging().onNotificationOpenedApp(async remoteMessage => {
        RootNavigation.navigate("MainScreen");
      });
      return unsubscribe;
  },[])

  function alarmComponent(){
    return(
      <View style={{width: '100%', padding: 10}}>
        <Text style={{fontWeight: 'bold', fontSize: 20, marginBottom: 5}}>{alarmContent.title}</Text>
        <Text>{alarmContent.content}</Text>
      </View>
    )

  }

  React.useEffect(() => { 
    setTimeout(() => { 
      SplashScreen.hide(); 
    }, 1500); }
  , []);
  
  return (
    <>
    <Context>
    <React.Fragment>
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        
        { /* 개발시 보는 임시 첫화면 */}
        {/* {<Stack.Screen name="Temp" component={Temp} options={{headerShown:false}}/>} */}
        {/* 메인화면 */}
        {<Stack.Screen name="MainScreen" component={MainScreen} options={{headerShown:false}}/>}
        {/* 로그인 화면 */}
        {<Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown:false}}/>}
        {/* 알림 화면 */}
        {<Stack.Screen name="AlarmScreen" component={AlarmScreen} options={{headerShown:false}}/>}
        {/* 채팅목록 화면 */}
        {<Stack.Screen name="ChatListScreen" component={ChatListScreen} options={{headerShown:false}}/>}
        {/* 채팅 화면 */}
        {<Stack.Screen name="ChatScreen" component={ChatScreen} options={{headerShown:false}}/>}

        {/* 신차패키지 2 */}
        {<Stack.Screen name="PackageScreen_2" component={PackageScreen_2} options={{headerShown:false}}/>}
        {/* 검색페이지 */}
        {<Stack.Screen name="SearchScreen" component={SearchScreen} options={{headerShown:false}}/>}
        {/* 신차패키지 3 ver 3.0*/}
        {<Stack.Screen name="PackageScreen_3" component={PackageScreen_3} options={{headerShown:false}}/>}
        {/* 신차패키지 4 */}
        {<Stack.Screen name="PackageScreen_4" component={PackageScreen_4} options={{headerShown:false}}/>}
        {/* 신차패키지 5 */}
        {<Stack.Screen name="PackageScreen_5" component={PackageScreen_5} options={{headerShown:false}}/>}

        {/* 결제페이지 */}
        {<Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{headerShown:false}}/>}
        {/* 결제 화면 */}
        {<Stack.Screen name="Pay" component={Pay} options={{headerShown:false}}/>}
        {/* 결제 완료 화면 */}
        {<Stack.Screen name="PayFinish" component={PayFinish} options={{headerShown:false}}/>}

        {/* 업체페이지 */}
        {<Stack.Screen name="ShopScreen_1" component={ShopScreen_1} options={{headerShown:false}}/>}
        {/* 업체 작업갤러리 상세 */}
        {<Stack.Screen name="DetailGallery" component={DetailGallery} options={{headerShown:false}}/>}
        {/* 마이페이지 */}
        {<Stack.Screen name="MyPageScreen" component={MyPageScreen} options={{headerShown:false}}/>}
        {/* 휴대폰인증 */}
        {<Stack.Screen name="Certification" component={Certification} options={{headerShown:false}}/>}
        {/* 과거 기록 페이지 */}
        {<Stack.Screen name="RecordScreen" component={RecordScreen} options={{headerShown:false}}/>}
        {/* 리뷰 등록 페이지 */}
        {<Stack.Screen name="RegisterReviewScreen" component={RegisterReviewScreen} options={{headerShown:false}}/>}
        {/* 시공중 페이지 */}
        {<Stack.Screen name="ProgressScreen" component={ProgressScreen} options={{headerShown:false}}/>}
        {/* 시공중 페이지 */}
        {<Stack.Screen name="ProgressScreen_2" component={ProgressScreen_2} options={{headerShown:false}}/>}

        {/* 신차패키지 3 ver 3.0*/}
        {<Stack.Screen name="PackageScreen_3_2" component={PackageScreen_3_2} options={{headerShown:false}}/>}
      </Stack.Navigator>
    </NavigationContainer>
    <Notification hideStatusBar={false} customComponent={alarmComponent()} ref={inAppMessage} onPress={()=>{RootNavigation.navigate('MainScreen'), inAppMessage.current?.hide()}} />
    </React.Fragment>
    </Context>
    </>
  );
};

export default App;