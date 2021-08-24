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
}];

const ImageView = styled.TouchableOpacity`
    width: ${WIDTH/3}px;
    height: ${WIDTH/3}px;
    background-color: #ffffff;
    padding: 1px;
`;
const Total = styled.View`
    width: 100%;
    height: 100%;
    align-items: center;
`;

function Gallery(props){
    

    const renderItem = ({ item }) => {
        
        return(
            <ImageView onPress={()=>{props.navigation.navigate("DetailGallery", {contents:item.contents});}}>
                <Image style={{height:'100%',width:'100%',}} source={{uri:item.thumbnail}}  resizeMode='stretch'/>
            </ImageView>
        );
    };

    return(
        <Total>
            <FlatList
                data={DATA}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={3}
                />
        </Total>
    );
}

export default Gallery;