import React from 'react';
import styled from 'styled-components';
import { Text,Image, FlatList,View, Animated, PanResponder } from 'react-native';
import AppWindow from '../constants/AppWindow';

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;

const TAB_HEIGHT = 50;
const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const Total = styled.View`
    width: 100%;
    height: ${HEIGHT-HEADER_MIN_HEIGHT-TAB_HEIGHT}px;
    align-items: center;
`;
const ReviewView = styled.View`
    width: ${WIDTH*0.9}px;
    border-radius: 15px;
    background-color: #e5e5e5;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    margin-bottom: 10px;
`;
const NameView = styled.View`
    width: 100%;
    height: 60px;
    flex-direction: row;
    align-items: center;
`;
const ProfileImg = styled.View`
    width: 40px;
    height: 40px;
    border-radius:50px;
    background-color: white;
    overflow: hidden;
`;
const Name = styled.Text`
    margin-left: 10px;
`;

const ContentView = styled.View`
    width: 100%;
    border-radius: 10px;
    padding: 10px;
    background-color: white;
`;
const Content = styled.Text`
    margin-top: 5px;
`;
const ContentImg = styled.View`
    width: ${WIDTH*0.9-40}px;
    height: ${WIDTH*0.9-40}px;
    border-radius: 15px;
    overflow: hidden;
`;

const DATA=[{
    id:1,
    name: '공진우',
    images : 'https://www.netcarshow.com/Hyundai-Kona_Electric-2021-1280-03.jpg',
    text: '너무 친절하게 잘 해주셨습니다.',
    profileImg: require('../resource/character1.png'),
},{
    id:2,
    name: '김영우',
    images: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
    text: '그냥 그래요',
    profileImg: null,
},{
    id:3,
    name: '이승진',
    images: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
    text: '다음차도 여기서 하고싶어요!',
    profileImg: require('../resource/character3.png'),
},{
    id:4,
    name: '허지훈',
    images: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
    text: '불친절한 직원이 있습니다.',
    profileImg: require('../resource/character4.png'),
}];

function ReviewList(props){
    const scrollY = React.useRef(new Animated.Value(0)).current; 
    function renderItem({item}){
        return(
            <View style={{width: WIDTH, alignItems: 'center'}}>
            <ReviewView key={item.id}>
                <NameView>
                    <ProfileImg>
                        <Image  source={item.profileImg===null ? require('../resource/default_profile.png') : item.profileImg} style={{height:'100%',width:'100%',}} resizeMode='contain'/>
                    </ProfileImg>
                    <Name>{item.name}</Name>
                </NameView>
                <ContentView>
                    <ContentImg>
                        <Image source={{uri: item.images}} style={{width:'100%', height: '100%'}} resizeMode='cover'></Image>
                    </ContentImg>
                    <Content>{item.text}</Content>
                </ContentView>
            </ReviewView>
            </View>
        );
    }
    
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
                paddingTop: 10,
            }}
            >
                <Animated.FlatList data={DATA}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
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
    )
}

export default ReviewList;