import React from 'react';
import styled from 'styled-components/native';
import { Text, View, SafeAreaView, Button, Animated, ScrollView, StyleSheet, PanResponder, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
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
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;
const HOMEINDICATOR = AppWindow.HomeIndicator;
const NOTCH = AppWindow.IOS_notch;

const TAB_HEIGHT = 50;
const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

///////////////////////////////
const Intro = styled.TouchableOpacity`
    justify-content: center;

`;

const Tab = createMaterialTopTabNavigator();

function ShopScreen_1(props){
  const [totalFirst, setTotalFirst] = React.useState(false);
  const [Pan, setPan] = React.useState(new Animated.ValueXY({ x: 0, y: -HEADER_SCROLL_DISTANCE }));
  const [shopData, setShopData] = React.useState({companyName: '',companyImg: 'https://picsum.photos/0'});
  const [companyId, setCompanyId] = React.useState(props.route.params.companyId);
  const twinkle = new Animated.Value(0);
  const [isLoading, setIsLoading] = React.useState(true);
    
  React.useEffect(()=>{
    getData()
  },[]);

  async function getData(){
      try{
        setIsLoading(true);
        const auth = await checkJwt();
        if(auth !== null){
            const response = await axios({
                method: 'GET',
                url : `${server.url}/api/companyinfo/${companyId}`,
                headers : {Auth: auth},
            })
            const rawData = response.data.data;
            //console.log(rawData);
            const newData = {
              companyName : rawData.company_name,
              companyImg : rawData.backgroundImageUrl,
            }
            setShopData(newData);
            setIsLoading(false);
        }
        else{
            console.log("no login");
        }
      }
      catch{e=>{
          //console.log(e);
          Alert.alert(
              '오류',
              'shopScreen 오류',
              [
                  {text: '확인', onPress: () => {}},
              ],
              { cancelable: false }
          );}
      }  
  }

  function moveTab(){
    if(totalFirst !== true){
      //setPan(new Animated.ValueXY({x: 0, y: 0}));
      Animated.spring(
        Pan, // Auto-multiplexed
        { toValue: { x: 0, y: 0 },
            useNativeDriver: true } // Back to zero
        ).start();
      setTotalFirst(true);
    }
    else{
      Animated.spring(
        Pan, // Auto-multiplexed
        { toValue: { x: 0, y: -HEADER_SCROLL_DISTANCE },
            useNativeDriver: true } // Back to zero
        ).start();
      setTotalFirst(false);
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
    
  return(
    <View style={{backgroundColor:'white', width: '100%', height: '100%'}}>
      <View style={{flex: 1, marginTop: NOTCH}}>
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
          source={{uri: shopData.companyImg}}
          />}
          {!isLoading && <Animated.View
            style={[
              styles.subTitleView,
              {
                opacity: imageOpacity,
                transform: [{ translateY: imageTranslateY }],
              }
            ]}>
              {/* <TouchableOpacity onPress={()=>{moveTab();}} disabled={!totalFirst} style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: 'black', fontFamily: 'DoHyeon-Regular', fontSize: 25}}>{shopData.companyName}</Text>
                <Icon name="chevron-up-outline" color={'black'} size={20} style={{marginLeft: 5}}/>
              </TouchableOpacity> */}
          </Animated.View>}
        </Animated.View>
        <View>
          <Animated.View
            style={[
            styles.topBar,
            {
                transform: [{ scale: titleScale }, { translateY: titleTranslateY }],
            },
            ]}>
            <Animated.View
              // style={[null,{
              //   opacity: textOpacity,
              // }]}
              >
              {(!isLoading )&& <TouchableOpacity style={{marginLeft: 5, flexDirection:'row', alignItems: 'center'}} onPress={()=>{moveTab();}}>
                <View onPress={()=>{moveTab();}} style={{justifyContent: 'center'}}>
                  <Text style={styles.title}>{shopData.companyName}</Text>
                </View>
                <Icon name={totalFirst ? "chevron-up-outline": "chevron-down-outline"} color={'black'} size={25}/>
              </TouchableOpacity>}
            </Animated.View>
          </Animated.View>
          <View style={{width: 35, position: 'absolute' , height: HEADER_MIN_HEIGHT, justifyContent: 'center'}}>
            <Icon name="chevron-back-outline" size={35} color={'black'} onPress={()=>{props.navigation.goBack()}}></Icon>
          </View>  
        </View>
        <Animated.View
          style={{
            position: 'absolute',
            width: '100%',
            transform: [{ translateY: Pan.y }],
            height: HEIGHT-HEADER_MIN_HEIGHT+HOMEINDICATOR,
            marginTop: HEADER_MAX_HEIGHT,
          }}
        >
          {!isLoading ? <Tab.Navigator backBehavior={'none'} screenOptions={{
                                                              swipeEnabled: true, 
                                                              tabBarIndicatorStyle: {backgroundColor: Color.main},
                                                              tabBarActiveTintColor: Color.main,
                                                              tabBarContentContainerStyle: {height: TAB_HEIGHT}}}>
                                                                                 
            <Tab.Screen name="소개" children={({navigation})=><IntroduceShop name={'소개'} navigation={navigation} companyId={companyId}/>}/>
            <Tab.Screen name="작업갤러리" children={({navigation})=><Gallery name={'작업 갤러리'} navigation={navigation} companyId={companyId}/>}/>
            <Tab.Screen name="취급상품" children={({navigation})=><Merchandise_2 name={'취급상품'} navigation={navigation} companyId={companyId}/>}/>
            <Tab.Screen name="리뷰" children={({navigation})=><ReviewList name={'리뷰'} navigation={navigation} companyId={companyId}/>}/>
            
          </Tab.Navigator> : 
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent'}}>
            <ActivityIndicator size = 'large' color= {'white'}/>
          </View>}
        </Animated.View>
      </View>
    </View>
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
  backgroundColor: 'white',
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
  justifyContent: 'center',
  top: 0,
  left: 0,
  right: 0,
  flexDirection: 'row',
  borderColor: 'lightgray',
  borderBottomWidth: 1,
},
title: {
  color: 'black',
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