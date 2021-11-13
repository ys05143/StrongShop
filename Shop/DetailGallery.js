import React from 'react';
import styled from 'styled-components/native';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import Swiper from 'react-native-swiper';
import TotalView from '../components/TotalView';
import _ from 'lodash';
//constants
import Color from '../constants/Color';
import AppWindow from '../constants/AppWindow';

const TOPBAR = AppWindow.TopBar;
///////////////////////////////
const ImageView = styled.View`
    flex: 2;
    width: 100%;
    padding: 5px;
    background-color: #000000;
`;
const TextView = styled.View`
    flex: 1;
    width: 100%;
    padding: 5px;
`;
///////////////////////////////////
  
function DetailGallery(props){
    const [contents, setContents]=React.useState(props.route.params.contents);
    return(
        <TotalView>
            <View style={{width: '100%', height: TOPBAR, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily: 'DoHyeon-Regular', fontSize: 25}}>게시물</Text>
            </View>
            <Swiper activeDotColor={Color.main}>
                {_.map(contents, (item)=>{
                    return(
                        <View key={item.page} style={{flex: 1}}>
                            <ImageView>
                                <Image style={{height:'100%',width:'100%'}} source={{uri: item.uri}} resizeMode='stretch'/>
                            </ImageView>
                            <TextView>
                                <Text>{item.text}</Text>
                            </TextView>
                        </View>
                    );})}
            </Swiper>
            <TouchableOpacity style={{height: TOPBAR, justifyContent: 'center', position: 'absolute'}}>
                <Icon name="chevron-back-outline" size={35} color={'black'} onPress={()=>{ props.navigation.goBack() }}></Icon>
            </TouchableOpacity>
        </TotalView>
    );
}

export default DetailGallery;