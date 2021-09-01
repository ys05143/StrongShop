import React from 'react';
import styled from 'styled-components';
import { Text, View, SafeAreaView, Button, Animated, ScrollView, StyleSheet, PanResponder } from 'react-native';
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
const IntroView = styled.View`
    height: ${HEIGHT/3}px;
    width: 100%;
    padding: 5px;
    background-color: ${Color.main};
`;
const Intro = styled.TouchableOpacity`
    justify-content: center;
`;
const ContentView = styled.View`
    width: 100%;
    border: 1px solid #00ff00;
`;
const IntroText = styled.Text`
    font-size: ${WIDTH*0.09}px;
    margin-left: 20px;
    color: #ffffff;
`;
///////////////////////////////////

const Tab = createMaterialTopTabNavigator();

function ShopScreen_1(props){
  const [totalFirst, setTotalFirst] = React.useState(true);
  const [Pan, setPan] = React.useState(new Animated.ValueXY({x: 0, y: 0}));

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
    inputRange: [-HEADER_SCROLL_DISTANCE, -HEADER_SCROLL_DISTANCE / 2, 0, +HEADER_SCROLL_DISTANCE / 2, +HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 1, 0, 0],
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

  /*React.useEffect(()=>{
    setFirst(true);
  },[]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      if(first){
        pan.setValue({
          x: 0,
          y: 0
        })
        pan.setOffset({
          x: 0,
          y: first === true? 0 : -HEADER_SCROLL_DISTANCE
        });
      }
      if(last){
        pan.setValue({
          x: 0,
          y: 0
        })
        console.log(first);
          pan.setOffset({
            x: 0,
            y: last === true?  -HEADER_SCROLL_DISTANCE : 0
          });         
      }},
    onPanResponderMove: Animated.event([
      null,
      {
        dx: pan.x,
        dy: pan.y,
      },
    ],{useNativeDriver: false}),
    onPanResponderRelease: () => {
      if(first){
        Animated.spring(
          pan, // Auto-multiplexed
          { toValue: { x: 0, y: first === true ? -HEADER_SCROLL_DISTANCE : 0 },
            useNativeDriver: true } // Back to zero
        ).start();
        setFirst(false);
      }
      if(last){
        Animated.spring(
          pan, // Auto-multiplexed
          { toValue: { x: 0, y: last === true ? HEADER_SCROLL_DISTANCE : 0 },
            useNativeDriver: true } // Back to zero
        ).start();
        setLast(false);
        setFirst(true);
      }
    },
  });*/

    
  return(
    <TotalView>
      <Animated.View
      style={{
        position: 'absolute',
        width: '100%',
        transform: [{ translateY: Pan.y }],
        height: HEIGHT-HEADER_MIN_HEIGHT,
        marginTop: HEADER_MAX_HEIGHT,
        zIndex: 15,
      }}
    >
      <Tab.Navigator style={{ paddingTop: 0}} backBehavior={'none'} screenOptions={{
                                                                                    swipeEnabled: false, 
                                                                                    tabBarIndicatorStyle: {backgroundColor: Color.main},
                                                                                    tabBarActiveTintColor: Color.main,
                                                                                    tabBarContentContainerStyle: {height: TAB_HEIGHT}}}>
                                                                                      
          <Tab.Screen name="소개" children={({navigation})=><IntroduceShop name={'소개'} navigation={navigation} Pan={Pan} getPan={getPan} totalFirst={totalFirst} getTotalFirst={getTotalFirst}/>}/>
          <Tab.Screen name="작업갤러리" children={({navigation})=><Gallery name={'작업 갤러리'} navigation={navigation} Pan={Pan} getPan={getPan} totalFirst={totalFirst} getTotalFirst={getTotalFirst}/>}/>
          <Tab.Screen name="취급상품" children={({navigation})=><Merchandise_2 name={'취급상품'} navigation={navigation} Pan={Pan} getPan={getPan} totalFirst={totalFirst} getTotalFirst={getTotalFirst}/>}/>
          <Tab.Screen name="리뷰" children={({navigation})=><ReviewList name={'리뷰'} navigation={navigation} Pan={Pan} getPan={getPan} totalFirst={totalFirst} getTotalFirst={getTotalFirst}/>}/>
          
      </Tab.Navigator>
      </Animated.View>
    
      <Animated.View
        style={[styles.header]}>
        <Animated.Image
        style={[
            styles.headerBackground,
            {
            opacity: imageOpacity,
            transform: [{ translateY: imageTranslateY }],
            },
        ]}
        source={require('../resource/Sonata.png')}
        />
    </Animated.View>
    <Animated.View
        style={[
        styles.topBar,
        {
            transform: [{ scale: titleScale }, { translateY: titleTranslateY }],
        },
        ]}>
        <Icon name="chevron-back-outline" size={35} color={'white'} onPress={()=>{}}></Icon>
        <Intro onPress={()=>{setInitial();}}>
          <Text style={styles.title}>ALL THAT AUTOMOBILE</Text>
        </Intro>
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
  overflow: 'hidden',
  height: HEIGHT,
},
headerBackground: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  width: null,
  height: HEADER_MAX_HEIGHT,
  resizeMode: 'cover',
},
topBar: {
  marginTop: 10,
  height: 40,
  alignItems: 'center',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  flexDirection: 'row',
},
title: {
  color: 'white',
  fontSize: 25,
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
});
  

export default ShopScreen_1;