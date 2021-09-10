import React from 'react';
import styled from 'styled-components/native';
import { Text, View, SafeAreaView, Button, Image } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import Swiper from 'react-native-swiper';
import TotalView from '../components/TotalView';
import Row from '../components/Row';
import AppWindow from '../constants/AppWindow';
import _ from 'lodash';

const WIDTH = AppWindow.width;
///////////////////////////////
const ImageView = styled.View`
    flex: 2;
    width: 100%;
    padding: 5px;
    background-color: #000000;
`;
const Intro = styled.View`
    width: 80%;
`;
const TextView = styled.View`
    flex: 1;
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
  
function DetailGallery(props){
    const [contents, setContents]=React.useState(props.route.params.contents);
    return(
            <Swiper  activeDotColor={'#000000'}>
                {_.map(contents, (item)=>{
                    return(
                        <TotalView key={item.page}>
                            <ImageView>
                                <Image style={{height:'100%',width:'100%'}} source={{uri: item.uri}} resizeMode='stretch'/>
                                <Icon name="chevron-back-outline" style={{position: 'absolute', marginTop: 5}} size={35} color={'white'} onPress={()=>{ props.navigation.goBack() }}></Icon>
                            </ImageView>
                            <TextView>
                                <Text>{item.text}</Text>
                            </TextView>
                        </TotalView>
                    );})}
            </Swiper>
    );
}

export default DetailGallery;