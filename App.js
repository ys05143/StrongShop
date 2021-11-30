
import React from 'react';
import styled from 'styled-components/native';
import { View, Text, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging';
import {Notification} from "react-native-in-app-message";
import { navigationRef } from './Main/MainScreen';
import * as RootNavigation from './Main/MainScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from './function/storage';

import MainScreen from './Main/MainScreen';
import LoginScreen from './Main/LoginScreen';
import AlarmScreen from './Main/AlarmScreen';
import ChatListScreen from './Mypage/ChatListScreen';
import ChatScreen from './Main/ChatScreen';
import PackageScreen_2 from './NewCarPackage/PackageScreen_2';
import PackageScreen_3 from './NewCarPackage/PackageScreen_3';
import PackageScreen_4 from './NewCarPackage/PackageScreen_4';
import PackageScreen_5 from './NewCarPackage/PackageScreen_5';
import ShopScreen_1 from './Shop/ShopScreen_1';
import AnimatedTest from './Shop/AnimatedTest';
import DetailGallery from './Shop/DetailGallery';
import MyPageScreen from './Mypage/MypageScreen';
import RecordScreen from './Mypage/RecordScreen';
import RegisterReviewScreen from './Mypage/RegisterReviewScreen';
import ProgressScreen from './Main/ProgressScreen';

import Past_PackageScreen_3_1 from './NewCarPackage/Past_PackageScreen_3_1';
import Past_PackageScreen_3_2 from './NewCarPackage/Past_PackageScreen_3_2';
import Past_PackageScreen_3_2_2 from './NewCarPackage/Past_PackageScreen_3_2_2';
import DetailOptionScreen from './NewCarPackage/DetailOptionScreen';
import Test_ShopScreen from './Shop/Test_ShopScreen';
import Temp from './Temp';

const Stack = createStackNavigator();

function App (props) {
  const inAppMessage = React.useRef();
  const [alarmContent, setAlarmContent] = React.useState({title: '', content: ''});

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  React.useEffect(()=>{
    requestUserPermission().catch((e) =>{ console.log('firebase errror')});
    messaging().getToken().then(res=>{console.log(res)});
    //RootNavigation.navigate("MainScreen");
  },[]);

  React.useEffect(()=>{
    const unsubscribe = messaging().onMessage( async remoteMessage => {
      //console.log('foreground messgage arrived!',JSON.stringify(remoteMessage));
      const index = remoteMessage.data.index;

      let title = '알림';
      let content = '';

      if(index === '200'){
          title = '입찰';
          content = '입찰이 도착했습니다.';
      }
      else if(index === '201'){
          title = '입찰 종료';
          content = '입찰 시간이 만료되었습니다.';
      }
      else if(index === '210'){
          title = '사진 등록';
          content = '업체에서 검수 사진을 등록했습니다.';
      }
      else if(index === '211'){
          title = '검수 완료';
          content = '검수가 완료되었습니다.';
      }
      else if(index === '212'){
          title = '사진 등록';
          content = '업체에서 시공 사진을 등록했습니다.';
      }
      else if(index === '213'){
          title = '시공 완료';
          content = '시공이 완료되었습니다.';
      }
      else if(index === '214'){
          title = '리뷰';
          content = '시공이 완료되었습니다.';
      }
      
      if(index !== '002' || index !== '000'){
        const alarmList = await storage.fetch("Alarm");
        //console.log('main Async',alarmList);
        let newAlarm = alarmList !== null ? [...alarmList] : [];
        const length = newAlarm.length;
        
        newAlarm.push({
            id: remoteMessage.messageId,
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
      else{
        setAlarmContent({title: title, content: content});
        inAppMessage.current?.show();
      }
      });

      return unsubscribe;
  },[]);

  React.useEffect(()=>{
      const unsubscribe = messaging().onNotificationOpenedApp(async remoteMessage => {
        const index = remoteMessage.data.index;

        let title = '알림';
        let content = '';

        if(index === '200'){
            title = '입찰';
            content = '입찰이 도착했습니다.';
        }
        else if(index === '201'){
            title = '입찰 종료';
            content = '입찰 시간이 만료되었습니다.';
        }
        else if(index === '210'){
            title = '사진 등록';
            content = '업체에서 검수 사진을 등록했습니다.';
        }
        else if(index === '211'){
            title = '검수 완료';
            content = '검수가 완료되었습니다.';
        }
        else if(index === '212'){
            title = '사진 등록';
            content = '업체에서 시공 사진을 등록했습니다.';
        }
        else if(index === '213'){
            title = '시공 완료';
            content = '시공이 완료되었습니다.';
        }
        else if(index === '214'){
            title = '리뷰';
            content = '시공이 완료되었습니다.';
        }
        
        if(index !== '002' || index !== '000'){
          const alarmList = await storage.fetch("Alarm");
          //console.log('main Async',alarmList);
          let newAlarm = alarmList !== null ? [...alarmList] : [];
          const length = newAlarm.length;
          
          newAlarm.push({
              id: remoteMessage.messageId,
              alarmType: index,
              date: remoteMessage.data.time,
              isRead: false,
              title: title,
              content: content,
          });

          await storage.store("Alarm", newAlarm);
        }
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


  return (
    <>
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
        {/* 신차패키지 3 ver 3.0*/}
        {<Stack.Screen name="PackageScreen_3" component={PackageScreen_3} options={{headerShown:false}}/>}
        {/* 신차패키지 4 */}
        {<Stack.Screen name="PackageScreen_4" component={PackageScreen_4} options={{headerShown:false}}/>}
        {/* 신차패키지 5 */}
        {<Stack.Screen name="PackageScreen_5" component={PackageScreen_5} options={{headerShown:false}}/>}
        {/* 업체페이지 */}
        {<Stack.Screen name="ShopScreen_1" component={ShopScreen_1} options={{headerShown:false}}/>}
        {/* 업체 작업갤러리 상세 */}
        {<Stack.Screen name="DetailGallery" component={DetailGallery} options={{headerShown:false}}/>}
        {/* 마이페이지 */}
        {<Stack.Screen name="MyPageScreen" component={MyPageScreen} options={{headerShown:false}}/>}
        {/* 과거 기록 페이지 */}
        {<Stack.Screen name="RecordScreen" component={RecordScreen} options={{headerShown:false}}/>}
        {/* 리뷰 등록 페이지 */}
        {<Stack.Screen name="RegisterReviewScreen" component={RegisterReviewScreen} options={{headerShown:false}}/>}
        {/* 시공중 페이지 */}
        {<Stack.Screen name="ProgressScreen" component={ProgressScreen} options={{headerShown:false}}/>}

        {/* 애니메이션 test */}
        {<Stack.Screen name="AnimatedTest" component={AnimatedTest} options={{headerShown:false}}/>}
        {/* 신차패키지 3 ver 2.0 */}
        {<Stack.Screen name="Past_PackageScreen_3_2" component={Past_PackageScreen_3_2} options={{headerShown:false}}/>}
        {/* 신차패키지 3 ver 2.0 */}
        {<Stack.Screen name="Past_PackageScreen_3_2_2" component={Past_PackageScreen_3_2_2} options={{headerShown:false}}/>}
        {/* 신차패키지 3 ver 1.0 */}
        {<Stack.Screen name="Past_PackageScreen_3_1" component={Past_PackageScreen_3_1} options={{headerShown:false}}/>}
        {/* DetailOption 고르기 */}
        {<Stack.Screen name="DetailOptionScreen" component={DetailOptionScreen} options={{headerShown:false}}/>}
        {/* 업체페이지 Test Ver */}
        {<Stack.Screen name="Test_ShopScreen" component={Test_ShopScreen} options={{headerShown:false}}/>}


      </Stack.Navigator>
    </NavigationContainer>
    <Notification hideStatusBar={false} customComponent={alarmComponent()} ref={inAppMessage} onPress={()=>{RootNavigation.navigate('MainScreen'), inAppMessage.current?.hide()}} />
    </React.Fragment>
    </>
  );
};

export default App;