import React from 'react';
import styled from 'styled-components';
import { Text, View, Image, Animated,ScrollView } from 'react-native';
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

function Gallery(props){
    const scrollY = React.useRef(new Animated.Value(0)).current; 
    const renderItem = ({ item }) => {
        
        return(
            <ImageView onPress={()=>{props.navigation.navigate("DetailGallery", {contents:item.contents});}}>
                <Image style={{height:'100%',width:'100%',}} source={{uri:item.thumbnail}}  resizeMode='stretch'/>
            </ImageView>
        );
    };

    function sendScrollTurn(){
        props.getScrollTurn(true);
    }

    /*<Animated.FlatList
                data={DATA}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={3}
                scrollEnabled={props.scrollEnabled}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }], // event.nativeEvent.contentOffset.x to scrollX
                    { useNativeDriver: true,
                    listener: (e)=>{if(e.nativeEvent.contentOffset.y === 0) sendScrollTurn();}}, // use native driver for animation: ;
                )}
                />*/

    return(
        <Total>
            <Animated.FlatList
                data={DATA}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={3}
                nestedScrollEnabled={true}
                scrollEnabled={props.scrollEnabled}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }], // event.nativeEvent.contentOffset.x to scrollX
                    { useNativeDriver: true,
                    listener: (e)=>{if(e.nativeEvent.contentOffset.y === 0) props.getScrollTurn(true);}}, // use native driver for animation: ;
                )}
                />
        </Total>
    );
}

export default Gallery;