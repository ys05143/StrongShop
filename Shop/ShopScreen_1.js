import React from 'react';
import styled from 'styled-components/native';
import { Text, View, SafeAreaView, Button, Animated, ScrollView, StyleSheet, PanResponder, ActivityIndicator } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
//pages
import IntroduceShop from './IntroduceShop';
import Gallery from './Gallery';
import Merchandise_2 from './Merchandise_2';
import ReviewList from './ReviewList';
//components
import TotalView from '../components/TotalView';
//constants
import AppWindow from '../constants/AppWindow';
import Color from '../constants/Color';

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;

const TAB_HEIGHT = 50;
const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

///////////////////////////////
const Intro = styled.TouchableOpacity`
    justify-content: center;
`;
///////////////////////////////////
//업체이름으로 서버에 요청할 정보(첫화면 구성시에 사용, flatlist 사용하는 페이지에서는 해당 페이지에서 따로 서버에 추가요청)
const DATA = {
  shopName: '올댓오토모빌',
  representImg: 'https://www.bmw.co.kr/content/dam/bmw/common/all-models/4-series/convertible/2020/highlights/bmw-4-series-convertible-st-xxl.jpg.asset.1627482997959.jpg',
  introduceText: '안녕하세요 올댓오토모빌 입니다~!!\n항상 찾아주시는 고객님 감사드리고, 최선을 다하겠습니다.\n화이팅!!!',
  coord: {latitude: 37.547167222, longitude: 127.068899861},
  region: '서울특별시 광진구 동일로30길 32',
  gallery: [{
                id: 1,
                thumbnail : 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
            },{
                id: 2,
                thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
            },{
                id: 3,
                thumbnail : 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
            },{
                id: 4,
                thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
            },{
                id: 5,
                thumbnail : 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
            },{
                id: 6,
                thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
            },{
                id: 7,
                thumbnail : 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
            },{
                id: 8,
                thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
            },{
                id: 9,
                thumbnail : 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
            },{
                id: 10,
                thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
            },{
                id: 11,
                thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
            },{
                id: 12,
                thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
            },{
                id: 13,
                thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
            },{
                id: 14,
                thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
            },{
                id: 15,
                thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
            },{
                id: 16,
                thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
            },{
                id: 17,
                thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
            },{
                id: 18,
                thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
            },{
                id: 19,
                thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
            },{
                id: 20,
                thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
            },{
                id: 21,
                thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
            },{
                id: 22,
                thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
            }],
  merchandise: {tinting: [{
                            name: 'T70 05',
                            text: '투과율: 6 / 차단률: 70',
                            price: 100000
                        },{
                            name: 'T70 15',
                            text: '투과율: 15 / 차단률: 68',
                            price: 200000
                        },{
                            name: 'T70 35',
                            text: '투과율: 35 / 차단률: 68',
                            price: 300000
                        },{
                            name: 'T70 36',
                            text: '투과율: 35 / 차단률: 68',
                            price: 300000
                        },{
                            name: 'T70 37',
                            text: '투과율: 35 / 차단률: 68',
                            price: 300000
                        },{
                            name: 'T70 38',
                            text: '투과율: 35 / 차단률: 68',
                            price: 300000
                        },{
                            name: 'T70 39',
                            text: '투과율: 35 / 차단률: 68',
                            price: 300000
                        },{
                            name: 'T70 40',
                            text: '투과율: 35 / 차단률: 68',
                            price: 300000
                        },{
                            name: 'T70 41',
                            text: '투과율: 35 / 차단률: 68',
                            price: 300000
                        },{
                            name: 'T70 42',
                            text: '투과율: 35 / 차단률: 68',
                            price: 300000
                        },{
                            name: 'T70 43',
                            text: '투과율: 35 / 차단률: 68',
                            price: 300000
                        },{
                            name: 'T70 44',
                            text: '투과율: 35 / 차단률: 68',
                            price: 300000
                        },{
                            name: 'T70 45',
                            text: '투과율: 35 / 차단률: 68',
                            price: 300000
                        },{
                            name: 'T70 46',
                            text: '투과율: 35 / 차단률: 68',
                            price: 300000
                        },{
                            name: 'T70 47',
                            text: '투과율: 35 / 차단률: 68',
                            price: 300000
                        },{
                            name: 'T70 48',
                            text: '투과율: 35 / 차단률: 68',
                            price: 300000
                        },{
                            name: 'T70 49',
                            text: '투과율: 35 / 차단률: 68',
                            price: 300000
                        },{
                            name: 'T70 50',
                            text: '투과율: 35 / 차단률: 68',
                            price: 300000
                        }]},
  review: [{
            id:1,
            name: '공진우',
            images : 'https://www.netcarshow.com/Hyundai-Kona_Electric-2021-1280-03.jpg',
            text: '너무 친절하게 잘 해주셨습니다.',
            profileImg: require('../resource/character1.png'),
        },{
            id:2,
            name: '김영우',
            images: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
            text: '그냥 그래요',
            profileImg: null,
        },{
            id:3,
            name: '이승진',
            images: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
            text: '다음차도 여기서 하고싶어요!',
            profileImg: require('../resource/character3.png'),
        },{
            id:4,
            name: '허지훈',
            images: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
            text: '불친절한 직원이 있습니다.',
            profileImg: require('../resource/character4.png'),
        }]
}

const Tab = createMaterialTopTabNavigator();

function ShopScreen_1(props){
  const [isLoading, setIsLoading] = React.useState(false);
  const [totalFirst, setTotalFirst] = React.useState(true);
  const [Pan, setPan] = React.useState(new Animated.ValueXY({x: 0, y: 0}));
  const [shopData, setShopData] = React.useState(DATA);
  const twinkle = new Animated.Value(0);

  function setInitial(){
    if(totalFirst !== true){
      //setPan(new Animated.ValueXY({x: 0, y: 0}));
      Animated.spring(
        Pan, // Auto-multiplexed
        { toValue: { x: 0, y: 0 },
            useNativeDriver: true } // Back to zero
        ).start();
      setTotalFirst(true);
    }
  }

  const headerTranslateY = Pan.y.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, HEADER_SCROLL_DISTANCE],
    extrapolate: 'clamp',
  });
  
  // our opacity animated from 0 to 1 and our opacity will be 0
  const imageOpacity = Pan.y.interpolate({
    inputRange: [-HEADER_SCROLL_DISTANCE, -HEADER_SCROLL_DISTANCE / 2, 0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 1, 0, 0],
    extrapolate: 'clamp',
  });
  const textOpacity = Pan.y.interpolate({
    inputRange: [-HEADER_SCROLL_DISTANCE, -HEADER_SCROLL_DISTANCE / 2, 0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0, 1, 1],
    extrapolate: 'clamp',
  });
  const imageTranslateY = Pan.y.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 100],
    extrapolate: 'clamp',
  });
  
  // change header title size from 1 to 0.9
  const titleScale = Pan.y.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0.95],
    extrapolate: 'clamp',
  });
  // change header title y-axis
  const titleTranslateY = Pan.y.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 0],
    extrapolate: 'clamp',
  });

  function getPan(val){
    setPan(val);
  }
  function getTotalFirst(bool){
    setTotalFirst(bool);
  }

  const twinkleMove = Animated.loop(
    Animated.sequence([
      Animated.timing(
        twinkle,
        {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }
      ),
      Animated.timing(
        twinkle,
        {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }
      )
    ]),
    {
      iterations: -1,
      isInteraction: false,
      useNativeDriver: true,
    }
  ).start();

  React.useEffect(()=> {
    setIsLoading(true);
    //캐시 확인 후 필요시 서버요청
    let newDATA = {...DATA};
    newDATA.introduceText = '안녕하세요 바뀌었습니다.';
    setShopData(newDATA);
    setTimeout(()=>{setIsLoading(false)}, 2000);
  },[])

    
  return(
    <TotalView>
      <Animated.View
        style={[styles.header]}>
        {!isLoading && <Animated.Image
        style={[
            styles.headerBackground,
            {
            opacity: imageOpacity,
            transform: [{ translateY: imageTranslateY }],
            },
        ]}
        source={{uri: DATA.representImg}}
        />}
        {!isLoading && <Animated.View
          style={[
            styles.subTitleView,
            {
              opacity: imageOpacity,
              transform: [{ translateY: imageTranslateY }],
            }
          ]}>
            <Text style={{color: 'white', fontFamily: 'DoHyeon-Regular', fontSize: 25}}>{DATA.shopName}</Text>
        </Animated.View>}
    </Animated.View>
    <Animated.View
        style={[
        styles.topBar,
        {
            transform: [{ scale: titleScale }, { translateY: titleTranslateY }],
        },
        ]}>
        <View style={{width: 35}}>
          <Icon name="chevron-back-outline" size={35} color={'white'} onPress={()=>{props.navigation.goBack()}}></Icon>
        </View>
        <Animated.View
          style={[null,{
            opacity: textOpacity,
          }]}>
          <Intro onPress={()=>{setInitial();}}>
            <Text style={styles.title}>{DATA.shopName}</Text>
          </Intro>
        </Animated.View>
        {!totalFirst && <Animated.View style={[{marginLeft: 15}, {opacity: twinkle}]}>
          <Text style={{color: 'white'}}>{'<- 업체명을 터치하시면\n원래상태로 돌아갑니다.'}</Text>
        </Animated.View>}  
    </Animated.View>
    <Animated.View
      style={{
        position: 'absolute',
        width: '100%',
        transform: [{ translateY: Pan.y }],
        height: HEIGHT-HEADER_MIN_HEIGHT,
        marginTop: HEADER_MAX_HEIGHT,
      }}
    >
      {!isLoading ? <Tab.Navigator backBehavior={'none'} screenOptions={{
                                                            swipeEnabled: false, 
                                                            tabBarIndicatorStyle: {backgroundColor: Color.main},
                                                            tabBarActiveTintColor: Color.main,
                                                            tabBarContentContainerStyle: {height: TAB_HEIGHT}}}>
                                                                                      
          <Tab.Screen name="소개" children={({navigation})=><IntroduceShop name={'소개'} navigation={navigation} introduceText={shopData.introduceText} coord={shopData.coord} region={shopData.region} Pan={Pan} getPan={getPan} totalFirst={totalFirst} getTotalFirst={getTotalFirst}/>}/>
          <Tab.Screen name="작업갤러리" children={({navigation})=><Gallery name={'작업 갤러리'} navigation={navigation} shopName={shopData.shopName} gallery={shopData.gallery} Pan={Pan} getPan={getPan} totalFirst={totalFirst} getTotalFirst={getTotalFirst}/>}/>
          <Tab.Screen name="취급상품" children={({navigation})=><Merchandise_2 name={'취급상품'} navigation={navigation} shopName={shopData.shopName} merchandise={shopData.merchandise} Pan={Pan} getPan={getPan} totalFirst={totalFirst} getTotalFirst={getTotalFirst}/>}/>
          <Tab.Screen name="리뷰" children={({navigation})=><ReviewList name={'리뷰'} navigation={navigation} shopName={shopData.shopName} review={shopData.review} Pan={Pan} getPan={getPan} totalFirst={totalFirst} getTotalFirst={getTotalFirst}/>}/>
          
      </Tab.Navigator> : 
      <ActivityIndicator size = 'large' color= {'white'}/>}
      </Animated.View>
  </TotalView>
  );
}

const styles = StyleSheet.create({
saveArea: {
  flex: 1,
  backgroundColor: '#eff3fb',
},
/*card: {
  flexDirection: 'row',
  alignItems: 'center',
  shadowColor: '#402583',
  backgroundColor: '#ffffff',
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 1,
  borderRadius: 10,
  marginHorizontal: 12,
  marginTop: 12,
  paddingHorizontal: 16,
  paddingVertical: 12,
},*/
header: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: Color.main,
  alignItems: 'center',
  overflow: 'hidden',
  height: HEIGHT,
},
headerBackground: {
  top: 0,
  left: 0,
  right: 0,
  width: '90%',
  marginTop: HEADER_MIN_HEIGHT,
  height: HEADER_MAX_HEIGHT*0.5,
  resizeMode: 'cover',
},
topBar: {
  height: HEADER_MIN_HEIGHT,
  width: '100%',
  alignItems: 'center',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  flexDirection: 'row',
},
title: {
  color: 'white',
  fontSize: 30,
  fontFamily: 'DoHyeon-Regular',
},
avatar: {
  height: 54,
  width: 54,
  resizeMode: 'contain',
  borderRadius: 54 / 2,
},
fullNameText: {
  fontSize: 16,
  marginLeft: 24,
},
box: {
  backgroundColor: "#61dafb",
  width: 80,
  height: 80,
  borderRadius: 4,
},
subTitleView: {
  width: '90%',
  marginTop: 15,
  height: 30,
},
});
  

export default ShopScreen_1;