/**
 * @format
 */
import React from 'react';
import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import storage from './function/storage';

messaging().setBackgroundMessageHandler(async (remoteMessage) => { //backbground
    const index = remoteMessage.data.index;
    let title = '알림';
    let content = 'background';
    console.log('background\n'+JSON.stringify(remoteMessage));

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
    // if(true){
    const alarmList = await storage.fetch("Alarm");
    //console.log('main Async',alarmList);
    let newAlarm = alarmList !== null ? [...alarmList] : [];
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
});

// messaging()
//   .getIsHeadless()
//   .then(isHeadless => {
//     // do sth with isHeadless
//   });

function HeadlessCheck({ isHeadless }) {
    if (isHeadless) {
      // App has been launched in the background by iOS, ignore
      console.log('hello');
      return null;
    }
    return <App/>;
  }

// AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent(appName, () => HeadlessCheck);
