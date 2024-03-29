
import React from 'react';
import { View, Text, Platform, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging';
import {Notification} from "react-native-in-app-message";
import { navigationRef } from './Main/MainPage';
import * as RootNavigation from './Main/MainPage';
import storage from './function/storage';
import SplashScreen from 'react-native-splash-screen'

import PaymentScreen from './Payment/PaymentScreen';
import Pay from './Payment/Pay';
import PayFail from './Payment/PayFail';

import DetailGallery from './Shop/DetailGallery';

import MyPageScreen from './Mypage/MypageScreen';
import Certification from './Mypage/Certification';
import RecordScreen from './Mypage/RecordScreen';
import RegisterReviewScreen from './Mypage/RegisterReviewScreen';
import RegisterMyCar from './Mypage/RegisterMyCar';

import MainPage from './Main/MainPage';

import NcpPage_1 from './NewCarPackage/NcpPage_1';
import NcpPage_2 from './NewCarPackage/NcpPage_2';
import NcpPage_3 from './NewCarPackage/NcpPage_3';

import Context from './function/Context';
import SelectBiddingPage from './Main/SelectBiddingPage';
import CompanyPage from './Shop/CompanyPage';
import CarePage_1 from './Care/CarePage_1';
import CarePage_2 from './Care/CarePage_2';
import CarePage_3 from './Care/CarePage_3';
import CareProgressPage from './Care/CareProgressPage';
import NcpProgressPage from './NewCarPackage/NcpProgressPage';
import LoginPage from './Main/LoginPage';
import AlarmPage from './Main/AlarmPage';
import ChatPage from './Main/ChatPage';

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
      else if(index === '215'){
        title = remoteMessage.data.name;
        content = '업체에서 케어 시공을 시작했습니다.';
      }
      else if(index === '002'){
          title = remoteMessage.notification.title;
          content = remoteMessage.notification.body;
      }
      
      if(index === '200' || index === '201' || index === '210' || index === '211' || index === '212' || index === '213' || index === '214' || index === '215'){
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
      if(index === '200' || index === '201' || index === '210' || index === '211' || index === '212' || index === '213' || index === '214' || index === '215'){
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
        RootNavigation.navigate("MainPage");
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

        {/* 메인화면 */}
        {<Stack.Screen name="MainPage" component={MainPage} options={{headerShown:false}}/>}

        {/* 로그인 화면 */}
        {<Stack.Screen name="LoginPage" component={LoginPage} options={{headerShown:false}}/>}

        {/* 알림 화면 */}
        {<Stack.Screen name="AlarmPage" component={AlarmPage} options={{headerShown:false}}/>}

        {/* 채팅 화면 */}
        {<Stack.Screen name="ChatPage" component={ChatPage} options={{headerShown:false}}/>}

        {/* 신차패키지 1 */}
        {<Stack.Screen name="NcpPage_1" component={NcpPage_1} options={{headerShown:false}}/>}

        {/* 신차패키지 2 */}
        {<Stack.Screen name="NcpPage_2" component={NcpPage_2} options={{headerShown:false}}/>}

        {/* 신차패키지 3 */}
        {<Stack.Screen name="NcpPage_3" component={NcpPage_3} options={{headerShown:false}}/>}

        {/* 신차패키지 '시공 중' 페이지 */}
        {<Stack.Screen name="NcpProgressPage" component={NcpProgressPage} options={{headerShown:false}}/>}


        {/* 입찰 선택 페이지 */}
        {<Stack.Screen name="SelectBiddingPage" component={SelectBiddingPage} options={{headerShown:false}}/>}

        {/* 케어페이지 1 */}
        {<Stack.Screen name="CarePage_1" component={CarePage_1} options={{headerShown:false}}/>}

        {/* 케어페이지 2 */}
        {<Stack.Screen name="CarePage_2" component={CarePage_2} options={{headerShown:false}}/>}

        {/* 케어페이지 3 */}
        {<Stack.Screen name="CarePage_3" component={CarePage_3} options={{headerShown:false}}/>}
        
        {/* 케어 '시공 중' 화면 */}
        {<Stack.Screen name="CareProgressPage" component={CareProgressPage} options={{headerShown:false}}/>}

        {/* 결제페이지 */}
        {<Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{headerShown:false}}/>}
        {/* 결제 화면 */}
        {<Stack.Screen name="Pay" component={Pay} options={{headerShown:false}}/>}
        {/* 결제 실패 화면 */}
        {<Stack.Screen name="PayFail" component={PayFail} options={{headerShown:false}}/>}

        {/* 업체페이지 */}
        {<Stack.Screen name="CompanyPage" component={CompanyPage} options={{headerShown:false}}/>}
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

        {/* 사용자 차량 등록 페이지 Beta (케어 페이지가 Card버전일때 사용)*/}
        {<Stack.Screen name="RegisterMyCar" component={RegisterMyCar} options={{headerShown:false}}/>}

      </Stack.Navigator>
    </NavigationContainer>
    <Notification hideStatusBar={false} customComponent={alarmComponent()} ref={inAppMessage} onPress={()=>{RootNavigation.navigate('MainPage'), inAppMessage.current?.hide()}} />
    </React.Fragment>
    </Context>
    </>
  );
};

export default App;