import React from 'react';
import styled from 'styled-components/native';
import { Appbar , Title , Text , Card, Divider , Avatar , IconButton, Button, Dialog, Portal, Paragraph, Provider as PaperProvider, Badge } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, Alert, ActivityIndicator, TouchableOpacity, Animated, View } from 'react-native';
import Swiper from 'react-native-swiper';
import { useIsFocused } from '@react-navigation/native';
import Icon from "react-native-vector-icons/Ionicons";
import FastImage from 'react-native-fast-image';
import moment from 'moment';
//component
import Row from '../components/Row';
//constants
import Color from '../constants/Color';
//function
import storage from '../function/storage';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';
import checkErrorCode from '../function/checkErrorCode';
import TotalView from '../components/TotalView';
//navigation
import { createNavigationContainerRef } from '@react-navigation/native';
import { userContext } from '../function/Context';

export const navigationRef = createNavigationContainerRef();
export function navigate(name, params) {
    if (navigationRef.isReady()) {
      navigationRef.navigate(name, params);
    }
    else{

    }
}

const PolicySeperator = styled.View`
    width: 1px;
    height: 13px;
    border-right-width: 1px;
    border-color: gray;
    margin-right: 5px;
    margin-left: 5px;
`;
const PolicyText = styled.Text`
    color: gray;
`;

const RowCenter = styled.View`
    flex-direction: row;
    align-items: center;
`;

const TopBar = styled.View`
    height: 60px;
    width: 100%;
    padding-right: 10px;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    background-color: ${Color.main};
`;

const MenuButton = styled.TouchableOpacity`
    border: 1px lightgray;
    margin-left: 20px;
    margin-right: 20px;
    flex: 1;
    height: 170px;
    border-radius: 10px;
    background-color: white;
`;

const styles = {
    title : {
        color: 'white',
        padding: 15 ,
        fontFamily: 'DoHyeon-Regular',
        fontSize: 35 ,
    } ,
    text : {
        fontSize: 25 ,
        padding: 10 ,
        fontFamily: 'DoHyeon-Regular',
    } ,
    subText : {
        padding: 10 ,
    },
    card : {
        margin: 10,
        width: 150,
        height: '80%',
        elevation: 1,
    } ,
    divider :  {
        marginTop: 20 ,
        borderWidth: 3 ,
        borderColor: 'rgb(240,240,240)'
    } ,
    cover : {
        width: 150 ,
        height: '50%',
        backgroundColor: 'lightgray'
    } ,
    icon : {
        backgroundColor: 'transparent' ,
        alignSelf: 'flex-end'
    }
}


// 당신의 차량 DATA
const DATA = [
    {
        orderId: 1,
        carImage: 'https://picsum.photos/0' ,
        carName: '아반떼' ,
        state: 3 , // 출고지 지정
        time: Date() ,
        companyName: '카샵',
    } ,
    {
        orderId: 2,
        carImage: 'https://picsum.photos/0' ,
        carName: '소나타' ,
        state: 4 , // 신차검수
        time: Date() ,
        companyName: '올댓오토모빌',
    } ,
    {
        orderId: 3,
        carImage: 'https://picsum.photos/100' ,
        carName: '티볼리' ,
        state: 5 , // 시공중
        time: Date() ,
        companyName: '카컴온',
    } ,
    {
        orderId: 4,
        carImage: 'https://picsum.photos/200' ,
        carName: '코나' ,
        state: 6 , // 시공완료
        time: Date() ,
        companyName: '레츠드릴',
    } ,
    {
        orderId: 5,
        carImage: 'https://picsum.photos/200' ,
        carName: 'K3' ,
        state: 1 , // 입찰중
        time: Date() ,
        companyName: '상수카샵',
    } ,
    {
        orderId: 6,
        carImage: 'https://picsum.photos/200' ,
        carName: 'K5' ,
        state: 2 , // 업체선정
        time: Date() ,
        companyName: '대구카닥터',
    }
]

function MainScreen( props ) {
    const [changeView,setChangeView] = React.useState(true);
    const [existingDialog, setExistingDialog] = React.useState(false);
    const [currentOrder, setCurrentOrder] = React.useState(null);
    const [myOrderList, setMyOrderList] = React.useState([]);
    const [orderTimeList, setOrderTimeList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const scrollY = React.useRef(new Animated.Value(0)).current;
    
    const context = React.useContext(userContext);

    const isFocused = useIsFocused();
    React.useEffect(()=>{
        if(isFocused) {
            getData();
        }
    },[isFocused]);

    const hideDialog = () => setExistingDialog(false);

    async function CheckAsync(){
        try{
            const response = await storage.fetch('BidOrder');
            if(response !== null){
                console.log('async has orderData: ', response);
                setCurrentOrder(response);
                setExistingDialog(true);
            }
            else{
                console.log('async has null')
                props.navigation.navigate("PackageScreen_2");
                setExistingDialog(false);
            }
        }
        catch (error){
            console.log(error);
        }
    }

    async function CancelExisting(){
        try{
            console.log("cancel BidOrder")
            await AsyncStorage.removeItem('BidOrder', ()=>{
                props.navigation.navigate("PackageScreen_2");
                setExistingDialog(false);
            });
        }
        catch(error){
            console.log(error);
        }
    }
    
    async function OKExisting(){
        if(currentOrder.processPage === 1){
            props.navigation.navigate("PackageScreen_2");
            setExistingDialog(false);
        }
        else if(currentOrder.processPage === 2){
            props.navigation.navigate("PackageScreen_3");
            setExistingDialog(false);
        }
        else if(currentOrder.processPage === 3){
            props.navigation.navigate("PackageScreen_4");
            setExistingDialog(false);
        }
    }

    function StateMove(orderId, state, carName, time){
        if(state === 1 || state === 2) props.navigation.navigate("PackageScreen_5",{carName: carName, orderId: orderId, createdTime: time});
        //else if(state === 3 || state === 4 || state === 5 || state === 6 || state === 7) props.navigation.navigate("ProgressScreen", {orderId: orderId, state: state });
        else if(state === 3 || state === 4 || state === 5 || state === 6 || state === 7) props.navigation.navigate("ProgressScreen_2", {orderId: orderId, state: state });
    }

    async function getData(){
        try{
            setIsLoading(true);
            const auth = await checkJwt();
            if(auth !== null){
                const myOrderResponse = await axios({
                    method: 'GET',
                    url : `${server.url}/api/orders/user`,
                    headers : {Auth: auth},
                })
                .then(res => {
                    //console.log(res);
                    const curTime = Date.now();
                    let rawData = res.data.data;
                    //console.log(rawData);
                    if(rawData !== null){
                        rawData.map(item => {
                            item['details'] = JSON.parse(item.details) ;
                        })
                        let newData = [];
                        let timeData = [];
                        rawData.map(item => { 
                            newData.push({
                                orderId: item.id, 
                                carName: item.details.carName, 
                                state: translateState(item.state), 
                                time: item.created_time, 
                                carImage: null,
                                bidNum: item.bidcount,
                            });
                            timeData.push(moment.duration(moment(item.created_time).add(48, 'hours').diff(moment(curTime))).asSeconds());
                        });
                        setMyOrderList(newData.reverse());
                        setOrderTimeList(timeData.reverse());
                        //console.log(newData);
                    }
                    else{
                        setMyOrderList([]);
                        //console.log(newData);
                    }
                    checkNewAlarm();
                    setIsLoading(false);
                })
                .catch(e=>{
                    checkErrorCode(e, props.navigation);
                })
            }
            else{
                console.log("no login");
                setMyOrderList([]);
                setIsLoading(false);
            }
        }
        catch{e=>{
            Alert.alert(
                '네트워크 오류',
                '다시 시도해주세요.',
                [
                    {text: '확인', onPress: () => {}},
                ],
                { cancelable: false }
            );}
        }
        
    }

    async function CancelOrder(orderId){
        try{
            setIsLoading(true);
            const auth = await checkJwt();
            if(auth !== null){
                const response = await axios({
                    method: 'DELETE',
                    url : `${server.url}/api/orders/${orderId}`,
                    headers : {Auth: auth},
                })
                .then(res => {
                    getData();
                })
                .catch(e=>{
                    checkErrorCode(e);
                })
            }
            else{
                console.log("no login");
            }
        }
        catch{e=>{
            Alert.alert(
                '입찰 삭제 오류',
                '다시 시도해주세요.',
                [
                    {text: '확인', onPress: () => {}},
                ],
                { cancelable: false }
            );}
        }
    }

    async function checkNewAlarm(){
        try{
            let savedLength = await storage.fetch("NumAlarm");
            if(savedLength === null) savedLength = 0
            let newAlarms = await storage.fetch("Alarm");
            let newLength
            if(newAlarms === null){
                newLength = 0;
            }
            else{
                newLength = newAlarms.length
            }
            if( savedLength !== newLength){
                context.setIsNewAlarm(true);
            }
        }
        catch{
            console.log("cache 오류");
        }
    }
    
    function translateState(state){
        const item = {
            'BIDDING' : 1,
            'BIDDING_COMPLETE' : 2,
            'DESIGNATING_SHIPMENT_LOCATION' : 3,
            'CAR_EXAMINATION' : 4,
            'CAR_EXAMINATION_FIN' : 5,
            'CONSTRUCTING' : 6,
            'CONSTRUCTION_COMPLETED' : 7,
        }
        return item[state];
    }
    
    async function MoveMypage(){
        const auth = await checkJwt();
        if(auth !== null){
            props.navigation.navigate("MyPageScreen");
        }
        else{
            Alert.alert(
                '요청',
                '로그인을 하셔야 합니다.',
                [
                    {text: '확인', onPress: () => {props.navigation.navigate("LoginScreen")}},
                ],
                { cancelable: false }
            );
        }
    }

    async function SendTestData(){
        const receipt = {
            processPage: 3,
            carName: 'AVANTE HYBRID',
            options: 
            { tinting: true,
                detailTinting: 
                { LUMA: true,
                    SOLAR: true,
                    RAINBOW: false,
                    RAYNO: false,
                    ANY: false,
                    ETC: '' },
                ppf: false,
                detailPpf: { ETC: '' },
                blackbox: true,
                detailBlackbox: { FINETECH: false, INAVI: false, ANY: true, ETC: '' },
                battery: false,
                detailBattery: false,
                afterblow: false,
                detailAfterblow: { ANY: false, ETC: '' },
                soundproof: false,
                detailSoundproof: { ANY: false, ETC: '' },
                wrapping: true,
                detailWrapping: { DESIGN: '호랑이' },
                glasscoating: false,
                undercoating: false },
            require: '하하하하하하하',
            region: 'seoul' 
        }
        const region = 'seoul';
        let i;
        const auth = await checkJwt();
        for(i=0; i<100; i++){
            if(auth !== null){
                const response = await axios({
                    method: 'POST',
                    url : `${server.url}/api/orders` ,
                    data : {
                        details: JSON.stringify(receipt),
                        region: region,
                    },
                    headers : {Auth: auth},
                });
            }
            console.log('POST',i);
        }
    }


    function useInterval(callback, delay) {
        const savedCallback = React.useRef();
        
        // Remember the latest callback.
        React.useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);
        
        // Set up the interval.
        React.useEffect(() => {
            function tick() {
            savedCallback.current();
            }
            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay]);
    }

    useInterval(()=>{
        let newTime = [];
        orderTimeList.map(item => {
            newTime.push(item>0 ? item-60 : 0);
        })
        setOrderTimeList(newTime);
    }, 60000);

    function convertTime(time){
        let hour=0;
        let minute=0;
        let second=0;
        if(time>0){
            const target = parseInt(time);
            hour = parseInt(target/3600);
            minute = parseInt((target - hour*3600)/60);
            second = parseInt((target-hour*3600-minute*60));
        }
        
        return {
            hour: hour.toString().padStart(2,0),
            minute: minute.toString().padStart(2,0),
            second: second.toString().padStart(2,0),
        };
    }

    function askCancelOptions(orderId){
        Alert.alert(
            '진행중인 입찰을 중단하겠습니까?',
            '되돌릴 수 없습니다.',
            [
              {text: '취소', onPress: () => {}},
              {text: '확인', onPress: () => { CancelOrder(orderId);}}
            ],
            { cancelable: true }
        );
    }

    const headerTranslateY = scrollY.interpolate({
        inputRange: [0, 200, 300],
        outputRange: [100, 100 ,0],
        extrapolate: 'clamp',
      });
    
    return(
        <TotalView notchColor={Color.main}>
            <TopBar>
                <TouchableOpacity style={{padding: 5}} onPress={()=>{props.navigation.navigate("AlarmScreen")}}>
                    <Icon name="notifications-outline" size={25} color={'white'}></Icon>
                    {context.isNewAlarm && <Badge style={{position: 'absolute', elevation: 1}} size={10}/>}
                </TouchableOpacity>
                <TouchableOpacity style={{padding: 5, marginLeft: 15}} onPress={()=>{MoveMypage();}}>
                    <Icon name="person-circle-outline" size={25} color={'white'}></Icon>
                </TouchableOpacity>
            </TopBar>
            <Animated.View style={{ backgroundColor: Color.main , paddingLeft: 15, borderBottomRightRadius: 20 , borderBottomLeftRadius: 20, height: headerTranslateY}}>
                {/* <Title style={styles.title}>{'안녕하세요,\n무엇을 도와드릴까요?'}</Title> */}
                <Text style={{fontFamily: 'DoHyeon-Regular', fontSize: 35, color: 'white'}}>{'안녕하세요,\n무엇을 도와드릴까요?'}</Text>
            </Animated.View>

            <ScrollView 
            onScroll={e=>{scrollY.setValue(e.nativeEvent.contentOffset.y);}}
            scrollEventThrottle={16}>
                <Row style={{backgroundColor: 'white', marginBottom: 10, alignItems: 'center', paddingVertical: 20}}>
                    <MenuButton onPress={()=>{CheckAsync();}}>
                        <RowCenter>
                            <Text style={{...styles.text, paddingRight:0 }}>신차패키지</Text>
                            <IconButton icon='help-circle' style={{margin:0}} color='lightgray' size={25}
                                        // onPress={ () => { alert('신차패키지 설명') } }
                                    />
                        </RowCenter>
                        <Text style={styles.subText}>{'새차를\n멋지게 만들어요'}</Text>
                        <Avatar.Icon icon='car-key' style={styles.icon} color='black'/>
                    </MenuButton>
                    <MenuButton 
                    disabled={true}
                    //onPress={()=>{}}
                    >
                        <Text style={styles.text}>케어</Text>
                        <Text style={styles.subText}>{'내 차를\n관리해요'}</Text>
                        <Avatar.Icon icon='car-cog' style={styles.icon} color='black'/>
                        <View style={{position: 'absolute', backgroundColor: 'rgba(0,0,0,0.3)', width: '100%', height: '100%', borderRadius: 10, justifyContent: 'flex-end', padding: 10}}>
                            <Text style={{color: 'red', fontSize: 12}}>{'빠른 시일안에\n찾아뵙겠습니다'}</Text>
                        </View>
                    </MenuButton>
                </Row>
                
                <View style={{backgroundColor: 'white', paddingTop: 20, paddingBottom: changeView ? 20 : 5, marginBottom: 10}}>
                    <Row style={{alignItems: 'center'}}> 
                        <Title style={{fontFamily: 'DoHyeon-Regular', fontSize: 25, paddingLeft: 10}}>
                            당신의 차량
                        </Title>
                        <IconButton icon='autorenew' size={20}  color={'gray'} onPress={()=>{getData();}}/>
                        <IconButton icon='format-list-bulleted' style={{ position: 'absolute' , right: 0 }} onPress={()=>{setChangeView(!changeView)}}/>
                    </Row>
                    <View>
                    {!isLoading ? 
                        <>
                            { changeView ? ( //요청받아서 없으면 빈 리스트 넘겨줌.
                                <ScrollView 
                                horizontal={true}
                                showsHorizontalScrollIndicator ={false}
                                >
                                    {myOrderList.map((item, index) =>{
                                        return(
                                            // <View key={item.orderId}>
                                            // <Card style={styles.card} onPress={()=>{StateMove(item.orderId, item.state, item.carName, item.time)}}>
                                            //     <View style={styles.cover}>
                                            //         {/* <FastImage  source={item.carImage === null ? require('../LOGO_2.png'):{uri: item.carImage}} style={{width: '100%', height: '100%'}}/> */}
                                            //         <FastImage  source={{uri: item.carImage}} style={{width: '100%', height: '100%'}}/>
                                            //     </View>
                                            //     <Card.Title title={item.carName} titleStyle={{ fontWeight: 'bold' }}
                                            //         subtitle={item.state == 3 ? '출고지 지정' : item.state == 4 ? '신차검수' : item.state == 5 ? '신차검수 완료' : item.state == 6 ? '시공 중' : item.state == 7 ? '시공 완료' : item.state == 1 ? '입찰 중' :item.state == 2 ? '입찰 시간 만료' : ''} />
                                            //     <Card.Content style={{flexDirection: 'row'}}>
                                            //         {item.state <= 2 && <Text style={{fontSize: 17, fontWeight: 'bold'}}>{`${convertTime(orderTimeList[index]).hour}:${convertTime(orderTimeList[index]).minute}`}</Text>}
                                            //     </Card.Content>
                                            //     {item.state <= 2 && <TouchableOpacity style={{position: 'absolute', alignSelf: 'flex-end', paddingRight: 2, paddingTop: 2}} onPress={()=>{askCancelOptions(item.orderId)}}>
                                            //         <Icon name="close-outline" size={25} color={'black'}></Icon>
                                            //     </TouchableOpacity>}
                                            // </Card> 
                                            // {item.state <=2 && <Badge style={{position: 'absolute', elevation: 1}}>{item.bidNum}</Badge>}
                                            // </View>
                                            <View key={item.orderId}>
                                                <Card style={{width: 150, height: 130, margin: 10, elevation: 2}} onPress={()=>{StateMove(item.orderId, item.state, item.carName, item.time)}}>
                                                    {/* <View style={styles.cover}>
                                                        <FastImage  source={item.carImage === null ? require('../LOGO_2.png'):{uri: item.carImage}} style={{width: '100%', height: '100%'}}/>
                                                    </View> */}
                                                    <Card.Title title={item.carName} titleStyle={{ fontWeight: 'bold' }}
                                                        subtitle={item.state == 3 ? '출고지 지정' : item.state == 4 ? '신차검수' : item.state == 5 ? '신차검수 완료' : item.state == 6 ? '시공 중' : item.state == 7 ? '시공 완료' : item.state == 1 ? '입찰 중' :item.state == 2 ? '입찰 시간 만료' : ''} />
                                                    <Card.Content style={{flexDirection: 'row', justifyContent: 'flex-end', flex: 1, alignItems: 'flex-end'}}>
                                                        {item.state <= 2 && <Text style={{fontSize: 17, fontWeight: 'bold', marginBottom: 10}}>{`${convertTime(orderTimeList[index]).hour}:${convertTime(orderTimeList[index]).minute}`}</Text>}
                                                    </Card.Content>
                                                    {item.state <= 2 && <TouchableOpacity style={{position: 'absolute', alignSelf: 'flex-end', paddingRight: 2, paddingTop: 2}} onPress={()=>{askCancelOptions(item.orderId)}}>
                                                        <Icon name="close-outline" size={25} color={'black'}></Icon>
                                                    </TouchableOpacity>}
                                                </Card> 
                                                {item.state <=2 && <Badge style={{position: 'absolute', elevation: 5}}>{item.bidNum}</Badge>}
                                            </View> 
                                        )
                                    })}
                                </ScrollView>                
                            ) : 
                            (
                                <Swiper 
                                autoplay={false} 
                                style={{height: 145}}
                                loop={false}
                                renderPagination={(index,total)=>
                                <View style={{alignItems: 'flex-end', paddingRight: 10, height: 20}}>
                                    <Text style={{color: 'gray'}}>{index+1}/{total}</Text>
                                </View>}
                                >
                                    {myOrderList.map((item, index)=>{
                                        return(
                                            // <Card key={item.orderId} style={{ flex: 1 }} onPress={()=>{StateMove(item.orderId, item.state, item.carName, item.time)}}>
                                            //     <RowCenter style={{ flex: 1}}>
                                            //         <View style={{ flex: 3 }}>
                                            //             <View style={{flex: 1, backgroundColor: 'lightgray'}}>
                                            //                 <FastImage  source={{uri: item.carImage}} style={{width: '100%', height: '100%'}}/>
                                            //             </View>
                                            //             {item.state <=2 && <Badge style={{position: 'absolute'}} size={30}>{item.bidNum}</Badge>}  
                                            //         </View>
                                            //         <View style={{ flex: 2 }}>
                                            //             <Card.Title title={item.carName} titleStyle={{ fontWeight: 'bold' , fontSize: 27 , padding: 10 }} subtitleStyle={{ fontSize: 17 , padding: 10 }}
                                            //                 subtitle={item.state == 3 ? '출고지 지정' : item.state == 4 ? '신차검수' : item.state == 5 ? '신차검수 완료' : item.state == 6 ? '시공 중' : item.state == 7 ? '시공 완료' : item.state == 1 ? '입찰 중' :item.state == 2 ? '입찰 만료' : ''} />
                                            //             <Card.Content>
                                            //             { item.state <=2 && <Text style={{ fontSize: 20 , padding: 10 }}>{`${convertTime(orderTimeList[index]).hour}:${convertTime(orderTimeList[index]).minute}`}</Text>}
                                            //             </Card.Content>
                                            //         </View>
                                            //     </RowCenter>
                                            //     {item.state <= 2 && <TouchableOpacity style={{position: 'absolute', alignSelf: 'flex-end', paddingRight: 2, paddingTop: 2}} onPress={()=>{askCancelOptions(item.orderId)}}>
                                            //         <Icon name="close-outline" size={30} color={'black'}></Icon>
                                            //     </TouchableOpacity>}
                                                
                                            // </Card> 
                                            <View key={item.orderId}>
                                                <Card style={{height: 130, marginTop: 10, marginLeft: 10, marginRight: 10, marginBottom: 0, elevation: 2 }} onPress={()=>{StateMove(item.orderId, item.state, item.carName, item.time)}}>
                                                    <Card.Title title={item.carName} titleStyle={{ fontWeight: 'bold' }}
                                                        subtitle={item.state == 3 ? '출고지 지정' : item.state == 4 ? '신차검수' : item.state == 5 ? '신차검수 완료' : item.state == 6 ? '시공 중' : item.state == 7 ? '시공 완료' : item.state == 1 ? '입찰 중' :item.state == 2 ? '입찰 시간 만료' : ''} />
                                                    <Card.Content style={{flexDirection: 'row', justifyContent: 'flex-end', flex: 1, alignItems: 'flex-end'}}>
                                                        {item.state <= 2 && <Text style={{fontSize: 17, fontWeight: 'bold', marginBottom: 10}}>{`${convertTime(orderTimeList[index]).hour}:${convertTime(orderTimeList[index]).minute}`}</Text>}
                                                    </Card.Content>
                                                    {item.state <= 2 && <TouchableOpacity style={{position: 'absolute', alignSelf: 'flex-end', paddingRight: 2, paddingTop: 2}} onPress={()=>{askCancelOptions(item.orderId)}}>
                                                        <Icon name="close-outline" size={25} color={'black'}></Icon>
                                                    </TouchableOpacity>}
                                                </Card>
                                                {item.state <=2 && <Badge style={{position: 'absolute', elevation: 5}}>{item.bidNum}</Badge>}
                                            </View>
                                        )
                                    })}
                                </Swiper>
                            )}     
                        </> :
                        <View style={{height: 150, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                            <ActivityIndicator size = 'small' color= {Color.main}/>
                        </View>}
                    </View>
                </View>
                <View style={{alignItems: 'center', width: '100%', paddingVertical: 30}}>
                    <Row style={{alignItems: 'center'}}>
                        <View style={{paddingHorizontal: 10}}>
                            <Text>이용약관</Text>
                        </View>
                        <PolicySeperator style={{borderColor: 'black'}}/>
                        <View style={{paddingHorizontal: 10}}>
                            <Text>개인정보처리방침</Text>
                        </View>
                        <PolicySeperator style={{borderColor: 'black'}}/>
                        <View style={{paddingHorizontal: 10}}>
                            <Text>청소년보호정책</Text>
                        </View>
                    </Row>
                    <Text style={{marginTop: 10}}>어메이킹스튜디오</Text>
                    <View style={{marginTop: 10, alignItems: 'center'}}>
                        <Row style={{alignItems: 'center'}}>
                            <PolicyText>주소</PolicyText>
                            <PolicySeperator/>
                            <PolicyText>{'경기도 화성시 동탄첨단산업1로 27, 기숙사 S921호'}</PolicyText>
                        </Row>
                        <PolicyText>{'(영천동, 금강펜테리움 IX타워)'}</PolicyText>
                    </View>
                    <Row style={{marginTop: 10, alignItems: 'center'}}>
                        <PolicyText>대표</PolicyText>
                        <PolicySeperator/>
                        <PolicyText>이용희</PolicyText>
                    </Row>
                    <Row style={{marginTop: 10, alignItems: 'center'}}>
                        <PolicyText>사업자등록번호</PolicyText>
                        <PolicySeperator/>
                        <PolicyText>437-07-02325</PolicyText>
                    </Row>
                    <Row style={{marginTop: 10, alignItems: 'center'}}>
                        <PolicyText>제공자</PolicyText>
                        <PolicySeperator/>
                        <PolicyText>어메이킹스튜디오</PolicyText>
                    </Row>
                </View>
            </ScrollView>

            <PaperProvider>
                <Portal>
                    <Dialog visible={existingDialog} onDismiss={hideDialog}>
                        <Dialog.Content>
                            <Paragraph>{'이전에 중단된 요청서가 있습니다.\n이어서 하시겠습니까?'}</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button mode="contained" color={Color.main} style={{width: 70}} onPress={() => {CancelExisting()}}>새로하기</Button>
                            <Button mode="contained" color={Color.main} style={{marginLeft: 10, width: 70}} onPress={() => {OKExisting()}}>이어하기</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </PaperProvider> 

        </TotalView>
    );
}

export default MainScreen;