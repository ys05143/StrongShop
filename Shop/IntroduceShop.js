import React from 'react';
import { Text,Animated,PanResponder,View, ScrollView, Alert, ActivityIndicator, Linking } from 'react-native';
import NaverMapView, {Circle, Marker, Path, Polyline, Polygon} from "react-native-nmap";
import styled from 'styled-components/native';
import { useIsFocused } from '@react-navigation/native';
import Icon from "react-native-vector-icons/Ionicons";
//constants
import AppWindow from '../constants/AppWindow';
import Row from '../components/Row';
//constant
import Color from '../constants/Color';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;

const TAB_HEIGHT = 50;
const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const MapView = styled.View`
    width: 95%;
    height: 300px;
    background-color: white;
    margin-top: 5px;
    border: 2px solid lightgray;
`;
const AddressView = styled.View`
    width: 100%;
    background-color: white;
    margin-top: 10px;
    padding: 15px;
`;
const IntroView = styled.View`
    width: 100%;
    padding: 15px;
    background-color: white;
`;
const TextView = styled.View`
    width: 100%;
    margin-top: 10px;
    flex-direction: row;
    align-items: center;
`;
const LinkView = styled.TouchableOpacity`
    height: 35px;
    border-radius: 5px;
    flex-direction: row;
    align-items: center;
    background-color: #f4f4f4;
    padding: 0px 15px;
`;
const DATA = {
    introduceText : null,
    coord : {latitude: 0, longitude: 0},
    region : null,
    blogUrl: null,
    siteUrl: null,
    snsUrl: null,
    phoneNum: null,
}

const Total = styled.View`
    flex: 1;
`;

function IntroduceShop(props){ 
    const [isLoading, setIsLoading] = React.useState(false);
    const [infoData, setInfoData] = React.useState(DATA);
    
    const isFocused = useIsFocused();
    React.useEffect(()=>{
        if(isFocused) getData();
    },[isFocused]);

    async function getData(){
        try{
            setIsLoading(true);
            const auth = await checkJwt();
            if(auth !== null){
                const response = await axios({
                    method: 'GET',
                    url : `${server.url}/api/companyinfo/${props.companyId}`,
                    headers : {Auth: auth},
                }).catch(e=>console.log(e))
                const rawData = response.data.data;
                //console.log('introduce',rawData);
                const newData = {
                    introduceText : rawData.introduction,
                    coord : {latitude: parseFloat(rawData.latitude), longitude: parseFloat(rawData.longitude)},
                    region : rawData.address+' '+rawData.detailAddress,
                    blogUrl: rawData.blogUrl,
                    siteUrl: rawData.siteUrl,
                    snsUrl: rawData.snsUrl,
                    phoneNum: rawData.contact,
                }
                setInfoData(newData);
                setIsLoading(false);
            }
            else{
                console.log("no login");
            }
        }
        catch{e=>{
            //console.log(e);
            Alert.alert(
                '오류',
                'ReviewList 오류',
                [
                    {text: '확인', onPress: () => {}},
                ],
                { cancelable: false }
            );}
        }  
    }

    function MoveToUrl(url){
        if(url.startsWith('http')){
            Linking.openURL(url);
        }
        else{
            Linking.openURL('https://'+url);
        }

    }
    function MoveToInstagram(id){
        Linking.openURL('instagram://user?username='+id)
        .catch((e) => {
            console.log(e);
            Linking.openURL('https://www.instagram.com/'+id);
        })
    }
    function MoveToCall(phone){
        Linking.openURL('tel:'+phone);
    }
 
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

       
    // const [first, setFirst] = React.useState(props.totalFirst);
    // const [last, setLast] = React.useState(false);
    //const scrollY = React.useRef(new Animated.Value(0)).current;
    //const pan = React.useRef(props.Pan).current;

    // React.useEffect(()=>{
    //     setFirst(props.totalFirst);
    //     setLast(false);
    // },[props.totalFirst]);

    // const panResponder = PanResponder.create({
    //     onStartShouldSetPanResponder: () => true,
    //     onPanResponderGrant: () => {
    //     if(first){
    //         pan.setValue({
    //             x: 0,
    //             y: 0
    //         })
    //         pan.setOffset({
    //             x: 0,
    //             y: first === true? 0 : -HEADER_SCROLL_DISTANCE
    //         });
    //     }
    //     if(last){
    //         pan.setValue({
    //             x: 0,
    //             y: 0
    //         })
    //         console.log(first);
    //         pan.setOffset({
    //             x: 0,
    //             y: last === true?  -HEADER_SCROLL_DISTANCE : 0
    //         });         
    //     }},
    //     onPanResponderMove: Animated.event([
    //     null,
    //     {
    //         dx: pan.x,
    //         dy: pan.y,
    //     },
    //     ],{
    //         useNativeDriver: false,
    //         listener: (e)=>{props.getPan(pan);}
    //     }),
    //     onPanResponderRelease: () => {
    //     if(first){
    //         Animated.spring(
    //         pan, // Auto-multiplexed
    //         { toValue: { x: 0, y: first === true ? -HEADER_SCROLL_DISTANCE : 0 },
    //             useNativeDriver: true } // Back to zero
    //         ).start();
    //         props.getTotalFirst(false);
    //         //setFirst(false);
    //     }
    //     if(last){
    //         Animated.spring(
    //         pan, // Auto-multiplexed
    //         { toValue: { x: 0, y: last === true ? HEADER_SCROLL_DISTANCE : 0 },
    //             useNativeDriver: true } // Back to zero
    //         ).start();
    //         setLast(false);
    //         props.getTotalFirst(true);
    //         //setFirst(true);
    //     }
    //     },
    // });

    return(
        <Total>
            {!isLoading ? <ScrollView scrollEnabled={true}>
                <IntroView>
                    <Text style={{fontSize: 30, fontFamily: 'DoHyeon-Regular'}}>인사말</Text>
                    <View style={{width: '100%'}}>
                        <TextView style={{marginTop: 20}}>
                            <Text style={{fontSize: 15}}>{infoData.introduceText}</Text>
                        </TextView>
                        <Row style={{alignItems: 'center', marginTop: 10}}>
                            <Icon name={'call'} size={15} style={{marginRight: 10}}/>
                            <LinkView  onPress={()=>{MoveToCall(infoData.phoneNum)}}>
                                <Text style={{fontSize: 15}}>{infoData.phoneNum}</Text>
                            </LinkView>
                        </Row>
                        <Row style={{alignItems: 'center', marginTop: 10}}>
                            <Icon name={'globe-outline'} size={15} style={{marginRight: 10}}/>
                            <LinkView onPress={()=>{MoveToUrl(infoData.siteUrl)}}>
                                <Text style={{fontSize: 15}}>{infoData.siteUrl}</Text>
                            </LinkView>
                        </Row>
                        <Row style={{alignItems: 'center', marginTop: 10}}>
                            <Icon name={'link-outline'} size={15} style={{marginRight: 10}}/>
                            <LinkView onPress={()=>{MoveToUrl(infoData.blogUrl)}}>
                                <Text style={{fontSize: 15}}>{infoData.blogUrl}</Text>
                            </LinkView>
                        </Row>
                        <Row style={{alignItems: 'center', marginTop: 10}}>
                            <Icon name={'logo-instagram'} size={15} style={{marginRight: 10}}/>
                            <LinkView onPress={()=>{MoveToInstagram(infoData.snsUrl)}}>
                                <Text style={{fontSize: 15}}>{'@'+infoData.snsUrl}</Text>
                            </LinkView>
                        </Row>
                    </View>
                </IntroView>
                {isFocused && 
                <AddressView>
                    <Text style={{fontSize: 30, fontFamily: 'DoHyeon-Regular'}}>위치</Text>
                    <View style={{width: '100%', alignItems: 'center'}}>
                        <TextView style={{marginVertical: 15}}>
                            <Text style={{fontSize: 15}}>{infoData.region}</Text>
                        </TextView>
                        <MapView>
                            <NaverMapView style={{width: '100%', height: '100%'}}
                                                scrollGesturesEnabled={true}
                                                showsMyLocationButton={true}
                                                center={{...infoData.coord, zoom: 16}}>
                                <Marker coordinate={infoData.coord} onClick={() => console.warn('onClick! marker')}/>
                            </NaverMapView>
                        </MapView>
                    </View>
                </AddressView>}
            </ScrollView>:
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent'}}>
                <ActivityIndicator size = 'small' color= {Color.main}/>
            </View>}
        </Total>
    )

    
}

export default IntroduceShop;