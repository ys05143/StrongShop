import React, { useRef } from "react";
import styled from 'styled-components/native';
import { Text, View, SafeAreaView, Button, Animated, ScrollView, StyleSheet, Image, PanResponder, } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from "react-native-vector-icons/Ionicons";
//components
import TotalView from '../components/TotalView';
//constants
import AppWindow from '../constants/AppWindow';
import Color from '../constants/Color';

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;

const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;


//shopName 의 gallery를 받아와야함 
const DATA = [{
  id: 1,
  thumbnail : 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
  contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'},
              {page: 2, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'}],
},{
  id: 2,
  thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
  contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
              {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
  id: 3,
  thumbnail : 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
  contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: "avante"},
              {page: 2, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'}],
},{
  id: 4,
  thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
  contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
              {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
  id: 5,
  thumbnail : 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
  contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: "avante"},
              {page: 2, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'}],
},{
  id: 6,
  thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
  contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
              {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
  id: 7,
  thumbnail : 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
  contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: "avante"},
              {page: 2, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'}],
},{
  id: 8,
  thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
  contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
              {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
  id: 9,
  thumbnail : 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
  contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: "avante"},
              {page: 2, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'}],
},{
  id: 10,
  thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
  contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
              {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
  id: 11,
  thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
  contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
              {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
  id: 12,
  thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
  contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
              {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
  id: 13,
  thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
  contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
              {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
  id: 14,
  thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
  contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
              {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
  id: 15,
  thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
  contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
              {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
  id: 16,
  thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
  contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
              {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
  id: 17,
  thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
  contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
              {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
  id: 18,
  thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
  contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
              {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
  id: 19,
  thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
  contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
              {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
  id: 20,
  thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
  contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
              {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
}];
///////////////////////////////


const ImageView = styled.TouchableOpacity`
    width: ${WIDTH/3}px;
    height: ${WIDTH/3}px;
    background-color: #ffffff;
    padding: 1px;
`;
const Total = styled.View`
    width: 100%;
    height: ${HEIGHT-60}px;
    align-items: center;
    border: 2px solid #ff0000;
`;

const IntroView = styled.View`
    height: ${HEIGHT/3}px;
    width: 100%;
    padding: 5px;
    background-color: ${Color.main};
`;
const Intro = styled.View`
    justify-content: center;
`;
const TurnView = styled.TouchableOpacity`
  width: 100%;
  height: 30px;`;

const ContentView = styled.View`
    width: 100%;
    border: 1px solid #00ff00;
`;
const IntroText = styled.Text`
    font-size: ${WIDTH*0.09}px;
    margin-left: 20px;
    color: #ffffff;
`;
const BtnView = styled.View`
    width: 100%;
    height: 80px;
`;
const Btn = styled.TouchableOpacity`
    border-radius: 50px;
    background-color: #B2EBF4;
    width: 120px;
    height: 60px;
    align-items : center;
    justify-content: center;
`;
///////////////////////////////////

const Tab = createMaterialTopTabNavigator();

function ShopScreen_Test(props){
    const [scrollTurn, setScrollTurn] = React.useState(true);
    const scrollY = React.useRef(new Animated.Value(0)).current; 
    const [first, setFirst] = React.useState(true);
    const pan = useRef(new Animated.ValueXY({x: 0, y: 0})).current;

    const headerTranslateY = pan.y.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, HEADER_SCROLL_DISTANCE],
      extrapolate: 'clamp',
    });
    
    // our opacity animated from 0 to 1 and our opacity will be 0
    const imageOpacity = pan.y.interpolate({
      inputRange: [-HEADER_SCROLL_DISTANCE, -HEADER_SCROLL_DISTANCE / 2, 0, +HEADER_SCROLL_DISTANCE / 2, +HEADER_SCROLL_DISTANCE],
      outputRange: [0, 0, 1, 0, 0],
      extrapolate: 'clamp',
    });
    const imageTranslateY = pan.y.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });
    
    // change header title size from 1 to 0.9
    const titleScale = pan.y.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0.95],
      extrapolate: 'clamp',
    });
    // change header title y-axis
    const titleTranslateY = pan.y.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 0, 0],
      extrapolate: 'clamp',
    });

    function getScrollTurn(bool){
      setScrollTurn(bool);
    }

    const renderItem = ({ item }) => {
        
      return(
          <ImageView onPress={()=>{}}>
              <Image style={{height:'100%',width:'100%',}} source={{uri:item.thumbnail}}  resizeMode='stretch'/>
          </ImageView>
      );
  };

  React.useEffect(()=>{
    setFirst(true);
  },[]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.setValue({
        x: 0,
        y: 0
      })
      console.log(first);
        pan.setOffset({
          x: 0,
          y: first === true? 0 : HEADER_SCROLL_DISTANCE
        });
      },
    onPanResponderMove: Animated.event([
      null,
      {
        dx: pan.x,
        dy: pan.y,
      },
    ],{useNativeDriver: false}),
    onPanResponderRelease: () => {
      console.log(first);
      Animated.spring(
        pan, // Auto-multiplexed
        { toValue: { x: 0, y: first === true ? HEADER_SCROLL_DISTANCE : 0 },
          useNativeDriver: true } // Back to zero
      ).start();
      setFirst(false);
    },
  });

      
    return(
      <TotalView>
        
        <Animated.View
        style={{
          position: 'absolute',
          transform: [{ translateY: pan.y }],
          width: '100%',
          height: HEIGHT-HEADER_MIN_HEIGHT,
          marginTop: HEADER_MIN_HEIGHT,
          zIndex: 15,
        }}
      >
          <View style={{width: '100%', height: 40, backgroundColor: 'blue'}}/>
          <Animated.FlatList
                data={DATA}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={3}
                scrollEnabled={true}
                style={{backgroundColor: 'white'}}
                />
        </Animated.View>

        {<Animated.View
        style={{
          position: 'absolute',
          transform: [{ translateY: pan.y }],
          width: '100%',
          backgroundColor: 'red',
          height: HEIGHT-HEADER_MIN_HEIGHT,
          marginTop: HEADER_MIN_HEIGHT,
          zIndex: 15,
        }}
        {...panResponder.panHandlers}
      >
        </Animated.View>}
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
                <Intro>
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
  

export default ShopScreen_Test;