import React from 'react';
import { Text,Animated,PanResponder,View } from 'react-native';
import NaverMapView, {Circle, Marker, Path, Polyline, Polygon} from "react-native-nmap";
import axios from 'axios';
import styled from 'styled-components/native';
import { useIsFocused } from '@react-navigation/native';
//constants
import AppWindow from '../constants/AppWindow';

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;

const TAB_HEIGHT = 50;
const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const MapView = styled.View`
    width: 90%;
    height: 150px;
    background-color: white;
    margin-top: 5px;
`;
const AddressView = styled.View`
    width: 100%;
    height: 250px;
    background-color: white;
    margin-top: 10px;
    padding: 10px 15px;
`;
const IntroView = styled.View`
    width: 100%;
    margin-top: 10px;
    padding: 10px 15px;
    background-color: white;
`;
const Total = styled.ScrollView``;

function IntroduceShop(props){
    const scrollY = React.useRef(new Animated.Value(0)).current; 
    const P0 = {latitude: 37.547167222, longitude: 127.068899861};
    const [coord, setCoord] = React.useState(props.coord);

    const isFocused = useIsFocused();
 
    /*React.useEffect(() => {
        if (isFocused) {
            axios({
                method: 'GET' ,
                url : 'http://api.vworld.kr/req/address?service=address&request=getCoord&key=98C4A0B1-90CD-30F6-B7D0-9F5A0DC9F18B&type=ROAD&address=서울시 광진구 동일로30길 32-7' ,
            })
            .then(res => {
                const point = res.data.response.result.point ;
                setCoord({latitude: Number(point.y) , longitude : Number(point.x) });
                console.log(point);
            })
            .catch(e => console.log(e) ) ;
        }
    }, [isFocused]);*/

       
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
        <>
            <Animated.View
            style={{
                position: 'absolute',
                width: '100%',
                height: HEIGHT-HEADER_MIN_HEIGHT-TAB_HEIGHT,
            }}
            >
                <Animated.ScrollView 
                scrollEnabled={true}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }], // event.nativeEvent.contentOffset.x to scrollX
                    { useNativeDriver: true,
                    listener: (e)=>{}}, // use native driver for animation: ;
                )}>
                    <IntroView>
                        <Text style={{fontSize: 35, fontFamily: 'EastSeaDokdo-Regular'}}>인사말</Text>
                        <View style={{width: '100%', alignItems: 'center'}}>
                            <View style={{width: '90%', marginTop: 5}}>
                                <Text>{props.introduceText}</Text>
                            </View>
                        </View>
                    </IntroView>
                    {isFocused && 
                    <AddressView>
                        <Text style={{fontSize: 35, fontFamily: 'EastSeaDokdo-Regular'}}>위치</Text>
                        <View style={{width: '100%', alignItems: 'center'}}>
                            <View style={{width: '90%', marginTop: 5}}>
                                <Text>{props.region}</Text>
                            </View>
                            <MapView>
                                <NaverMapView style={{width: '100%', height: '100%'}}
                                                    scrollGesturesEnabled={true}
                                                    showsMyLocationButton={true}
                                                    center={{...coord, zoom: 16}}>
                                    <Marker coordinate={coord} onClick={() => console.warn('onClick! marker')}/>
                                </NaverMapView>
                            </MapView>
                        </View>
                    </AddressView>}
                </Animated.ScrollView>
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
        
        </>
    )

    
}

export default IntroduceShop;