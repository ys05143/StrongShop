import React from 'react';
import styled from 'styled-components';
import { Text, View, FlatList,Image } from 'react-native';
import AppWindow from '../constants/AppWindow';
import Icon from "react-native-vector-icons/Ionicons";

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;

//shopName 의 gallery를 받아와야함 
const DATA = [{
    id: 1,
    thumbnail : require('../resource/Avante.png'),
    images : ['../resource/Avante.png', '../resource/Sonata.png'],
},{
    id: 2,
    thumbnail : require('../resource/Sonata.png'),
    images : ['../resource/Sonata.png', '../resource/Avante.png', '../resource/Sonata2.png'],
},{
    id: 3,
    thumbnail : require('../resource/Avante.png'),
    images : ['../resource/Avante.png'],
},{
    id: 4,
    thumbnail : require('../resource/Sonata.png'),
    images : ['../resource/Sonata.png', '../resource/Avante.png'],
},{
    id: 5,
    thumbnail : require('../resource/Avante.png'),
    images : ['../resource/Avante.png', '../resource/Sonata.png'],
},{
    id: 6,
    thumbnail : require('../resource/Sonata.png'),
    images : ['../resource/Sonata.png', '../resource/Avante.png'],
},{
    id: 7,
    thumbnail : require('../resource/Avante.png'),
    images : ['../resource/Avante.png', '../resource/Sonata.png'],
},{
    id: 8,
    thumbnail : require('../resource/Sonata.png'),
    images : ['../resource/Sonata.png', '../resource/Avante.png'],
},{
    id: 9,
    thumbnail : require('../resource/Avante.png'),
    images : ['../resource/Avante.png', '../resource/Sonata.png'],
},{
    id: 10,
    thumbnail : require('../resource/Sonata.png'),
    images : ['../resource/Sonata.png', '../resource/Avante.png'],
},{
    id: 11,
    thumbnail : require('../resource/Avante.png'),
    images : ['../resource/Avante.png', '../resource/Sonata.png'],
}];

const ImageView = styled.TouchableOpacity`
    width: ${WIDTH/3}px;
    height: ${WIDTH/3}px;
    background-color: #ffffff;
`;
const ContentView = styled.View`
    height: ${HEIGHT*2/3}px;
    width: 100%;
    position: absolute;
    background-color: #ffffff;
`;

function Gallery(props){
    const [choose, setChoose]=React.useState(null);

    const renderItem = ({ item }) => {
        
        return(
            <ImageView onPress={()=>{setChoose(item);}}>
                <Image style={{height:'100%',width:'100%'}} source={item.thumbnail} resizeMode='stretch'/>
            </ImageView>
        );
    };

    return(
        <>
            <FlatList
                data={DATA}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={3}
                style={{position: 'absolute'}}
                />
                {choose !== null && 
            <ContentView>
                <Image style={{height:'100%',width:'100%'}} source={choose.thumbnail} resizeMode='stretch'/>
                <Icon name="chevron-back-outline" size={35} color={'black'} onPress={()=>{setChoose(null)}} style={{position: 'absolute', marginTop: 5}}></Icon>
            </ContentView>}
        </>
    );
}

export default Gallery;