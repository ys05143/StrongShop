import React from 'react';
import styled from 'styled-components';
import { Text, View, Image, Animated,ScrollView, PanResponder } from 'react-native';
import AppWindow from '../constants/AppWindow';

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;

const TAB_HEIGHT = 50;
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
},{
    id: 21,
    thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
    contents : [{page: 1, uri: 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png', text: 'sonata'},
                {page: 2, uri: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png', text: 'avante'}],
},{
    id: 22,
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
    height: ${HEIGHT-HEADER_MIN_HEIGHT-TAB_HEIGHT}px;
    align-items: center;
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
                    data={DATA}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    numColumns={3}
                    nestedScrollEnabled={true}
                    scrollEnabled={true}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }], // event.nativeEvent.contentOffset.x to scrollX
                        { useNativeDriver: true,
                        listener: (e)=>{if(e.nativeEvent.contentOffset.y === 0) setLast(true)}}, // use native driver for animation: ;
                    )}
                    />
            </Animated.View>
            {(first||last)&&<Animated.View
                style={{
                position: 'absolute',
                transform: [{ translateY: pan.y }],
                width: '100%',
                backgroundColor: 'tranparent',
                height: 2*HEIGHT,
                }}
                {...panResponder.panHandlers}
            >
                </Animated.View>}
        </Total>
    );
}

export default Gallery;