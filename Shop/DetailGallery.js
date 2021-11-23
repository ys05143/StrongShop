import React from 'react';
import styled from 'styled-components/native';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper';
import TotalView from '../components/TotalView';
import TopBar from '../components/TopBar';
import _ from 'lodash';
//constants
import Color from '../constants/Color';
import AppWindow from '../constants/AppWindow';

const TOPBAR = AppWindow.TopBar;
///////////////////////////////
const ImageView = styled.View`
    flex: 1;
    width: 100%;
    padding: 5px;
    background-color: white;
`;
const TextView = styled.View`
    flex: 1;
    width: 100%;
    padding: 5px;
    border: 1px solid lightgray;
`;
///////////////////////////////////
  
function DetailGallery(props){
    const [contents, setContents]=React.useState(props.route.params.contents);
    return(
        <TotalView color={'white'} notchColor={'white'} homeIndicatorColor={'white'}>
            <TopBar>
                <TouchableOpacity style={{padding: 5}}>
                    <Icon name="chevron-back-outline" size={30} color={'black'} onPress={()=>{props.navigation.goBack()}}></Icon>
                </TouchableOpacity>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>게시물</Text>
                <TouchableOpacity>
                    <Text style={{fontSize: 15, marginRight: 5}} onPress={()=>{alert('save')}}>저장</Text>
                </TouchableOpacity>
            </TopBar>
            <View style={{flex:2}}>
                <Swiper activeDotColor={Color.main}>
                    {_.map(contents, (item)=>{
                        return(
                            <ImageView key={item.id}>
                                <FastImage style={{height:'100%',width:'100%'}} source={{uri: item.imageUrl}} resizeMode='contain'/>
                            </ImageView>
                        );})}
                </Swiper>
            </View>
            <TextView>
                <Text>{props.route.params.text}</Text>
            </TextView>
        </TotalView>
    );
}

export default DetailGallery;