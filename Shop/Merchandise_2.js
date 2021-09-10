import React from 'react';
import _ from 'lodash';
import styled from 'styled-components/native';
import { ScrollView, Text,View, Animated, PanResponder } from 'react-native';
//constants
import Color from '../constants/Color';
//pages
import TintingDetail from './TintingDetail';
import BlackBoxDetail from './BlackBoxDetail';
import AppWindow from '../constants/AppWindow';

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;

const TAB_HEIGHT = 50;
const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const merchadiseList= [
{
    name: '틴팅',
    title: 'Tinting',
},{
    name: '블랙박스',
    title: 'BlackBox',
},{
    name: '유리막코팅',
    title: 'GlassCoating',
},{
    name: '하부코팅',
    title: 'UnderCoating',
},{
    name: 'PPF',
    title: 'PPF',
},{
    name: '하부방음',
    title: 'UnderDeafening',
},
];

const Total = styled.View`
    width: 100%;
    height: ${HEIGHT-HEADER_MIN_HEIGHT-TAB_HEIGHT}px;
    align-items: center;
`;

const Option = styled.ScrollView`
    height: 70px;
    flex-direction: row;
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: white;
`;
const OptionView = styled.View`
    width: 90px;
    height: 60px;
    justify-content: center;
    align-items: center;
`;
const OptionName = styled.TouchableOpacity`
    padding: 5px;
    border-radius: 10px;
    border: 2px solid gray;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 40px;
`;

function Merchandise_2(props){
    //props로 받은 shopName으로 서버에 그 shop의 정보 요청
    //이후 asyncstorage 캐시도 필요할듯.
    const [shopName, setShopName] = React.useState(props.shopName);
    const [show, setShow] = React.useState('Tinting');
    const [tintingList, setTintingList] = React.useState(props.merchandise.tinting);

    const scrollY = React.useRef(new Animated.Value(0)).current; 
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
                <View>
                    <Option horizontal={true} contentContainerStyle={{alignItems: 'center'}}>
                        {_.map(merchadiseList, (item) => {
                            return(
                                <OptionView key={item.title}>
                                    <OptionName style={{borderColor: show === item.title ? Color.main : 'gray'}} onPress={()=>{setShow(item.title)}}>
                                        <Text style={{color: show === item.title ? Color.main : 'gray'}}>{item.name}</Text>
                                    </OptionName>
                                </OptionView>
                            );}
                        )}
                    </Option>
                </View>

                <Animated.ScrollView
                scrollEnabled={true}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }], // event.nativeEvent.contentOffset.x to scrollX
                    { useNativeDriver: true,
                    listener: (e)=>{}}, // use native driver for animation: ;
                )}>
                    {show === 'Tinting' && <TintingDetail list={tintingList}></TintingDetail>}
                    {show === 'BlackBox' && <BlackBoxDetail>{shopName}</BlackBoxDetail>}
                </Animated.ScrollView>   
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
    )
}

export default Merchandise_2;