import React from 'react';
import styled from 'styled-components';
import { Text, View, Image, Animated,ScrollView, PanResponder, ActivityIndicator, Easing } from 'react-native';
import axios from 'axios';
import AppWindow from '../constants/AppWindow';
import { result } from 'lodash';

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;

const TAB_HEIGHT = 50;
const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

//shopName 의 gallery의 contents를 받아와야함 
const DATA = [{
    id: 1,
    contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'},
                {page: 2, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'}],
},{
    id: 2,
    contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
                {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
    id: 3,
    contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: "avante"},
                {page: 2, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'}],
},{
    id: 4,
    contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
                {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
    id: 5,
    contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: "avante"},
                {page: 2, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'}],
},{
    id: 6,
    contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
                {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
    id: 7,
    contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: "avante"},
                {page: 2, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'}],
},{
    id: 8,
    contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
                {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
    id: 9,
    contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: "avante"},
                {page: 2, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'}],
},{
    id: 10,
    contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
                {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
    id: 11,
    contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
                {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
    id: 12,
    contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
                {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
    id: 13,
    contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
                {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
    id: 14,
    contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
                {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
    id: 15,
    contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
                {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
    id: 16,
    contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
                {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
    id: 17,
    contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
                {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
    id: 18,
    contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
                {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
    id: 19,
    contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
                {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
    id: 20,
    contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
                {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
    id: 21,
    contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
                {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
    id: 22,
    contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
                {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
}];

//flatlist 이기때문에 추가로 데이터들이 더 필요하다. 일정 갯수만큼 스크롤이 하단에 다다르면 서버에 요청해야함.
const AfterDATA = [{
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
}];

const ImageView = styled.TouchableOpacity`
    width: ${WIDTH/3}px;
    height: ${WIDTH/3}px;
    background-color: #ffffff;
    padding: 1px;
`;
const Total = styled.View`
    width: 100%;
    height: ${HEIGHT-HEADER_MIN_HEIGHT-TAB_HEIGHT}px;
    align-items: center;
`;

function Gallery(props){
    const [shopName, setShopName] = React.useState(props.shopName);
    const scrollY = React.useRef(new Animated.Value(0)).current; 
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    async function getContents(name, id){
        try{
            /*const result = await axios({
                                        method: 'GET' ,
                                        url : '' , //name, id 사용
                                    });
            props.navigation.navigate("DetailGallery", {contents:result.response});*/
            props.navigation.navigate("DetailGallery", {contents:DATA[id-1].contents});
            return 0;
        }
        catch (error){
            console.log(error);
            return -1;
        }
    }

    const renderItem = ({ item }) => {
        
        return(
            <ImageView onPress={()=>{getContents(shopName, item.id);}}>
                <Image style={{height:'100%',width:'100%',}} source={{uri:item.thumbnail}}  resizeMode='stretch'/>
            </ImageView>
        );
    };

    const [first, setFirst] = React.useState(props.totalFirst);
    const [last, setLast] = React.useState(false);
    const pan = React.useRef(props.Pan).current;

    React.useEffect(()=>{
        setFirst(props.totalFirst);
        setLast(false);
    },[props.totalFirst]);

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
        ],{
            useNativeDriver: false,
            listener: (e)=>{props.getPan(pan);}
        }),
        onPanResponderRelease: () => {
        if(first){
            Animated.spring(
            pan, // Auto-multiplexed
            { toValue: { x: 0, y: first === true ? -HEADER_SCROLL_DISTANCE : 0 },
                useNativeDriver: true } // Back to zero
            ).start();
            props.getTotalFirst(false);
            //setFirst(false);
        }
        if(last){
            Animated.spring(
            pan, // Auto-multiplexed
            { toValue: { x: 0, y: last === true ? HEADER_SCROLL_DISTANCE : 0 },
                useNativeDriver: true } // Back to zero
            ).start();
            setLast(false);
            props.getTotalFirst(true);
            //setFirst(true);
        }
        },
    });

    return(
        <Total>
            <Animated.View
            style={{
                position: 'absolute',
                width: '100%',
                height: HEIGHT-HEADER_MIN_HEIGHT-TAB_HEIGHT,
            }}
            >
                <Animated.FlatList
                    data={props.gallery}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    numColumns={3}
                    scrollEnabled={true}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }], // event.nativeEvent.contentOffset.x to scrollX
                        { useNativeDriver: true,
                        listener: (e)=>{console.log(e.nativeEvent.contentOffset.y)}}, // use native driver for animation: ;
                    )}
                    onRefresh={()=>{console.log("refresh")}}
                    refreshing={isRefreshing}
                    />
            </Animated.View>
            {(first||last)&&<Animated.View
                style={{
                position: 'absolute',
                transform: [{ translateY: pan.y }],
                width: '100%',
                backgroundColor: 'transparent',
                height: 2*HEIGHT,
                }}
                {...panResponder.panHandlers}
            >
                </Animated.View>}
        </Total>
    );
}

export default Gallery;