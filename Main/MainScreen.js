import React from 'react';
import styled from 'styled-components/native';
import { Appbar , Title , Text , Card, Divider , Avatar , IconButton, Button, Dialog, Portal, Paragraph, Provider as PaperProvider, Badge } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import { useIsFocused } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import Icon from "react-native-vector-icons/Ionicons";
import FastImage from 'react-native-fast-image';
import moment from 'moment';
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

const Row = styled.View`
    flex-direction: row;
    justify-content: center;

    /* background-color: ${Color.main}; */
    /* border-bottom-right-radius: 20px;
    border-bottom-left-radius: 20px; */
    height: 200px;
`;
const TextRow = styled.View`
    flex-direction: row;
    align-items: center;
`;
const View = styled.View``;
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
    margin: 20px;
    flex: 1;
    height: 170px;
    border-radius: 10px;
    background-color: 'rgb(240,240,240)';
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
    scrollview : {
        width: '100%',
        height: 250 ,
        borderBottomWidth: 6 ,
        borderBottomColor : 'rgb(240,240,240)'
    } ,
    card : {
        margin: 10,
        width: 150,
        height: '80%',
    } ,
    divider :  {
        marginTop: 20 ,
        borderWidth: 3 ,
        borderColor: 'rgb(240,240,240)'
    } ,
    cover : {
        width: 150 ,
        height: '50%'
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

    const isFocused = useIsFocused();
    React.useEffect(()=>{
        if(isFocused) {
            getData();
        }
    },[isFocused]);

    const hideDialog = () => setExistingDialog(false);

    React.useEffect(()=>{
        const unsubscribe = messaging().onMessage( async remoteMessage => {
          //console.log('foreground messgage arrived!',JSON.stringify(remoteMessage));
          const index = remoteMessage.data.index;
          const alarmList = await storage.fetch("Alarm");
        //console.log('main Async',alarmList);
        let newAlarm = alarmList !== null ? [...alarmList] : [];
        const length = newAlarm.length;

        let title = '오류';
        let content = '알림을 표시할 수 없습니다.';

        if(index === '200'){
            title = '입찰이 도착했습니다';
            content = '도착!'
        }
        else if(index === '201'){
            title = '입찰시간이 종료되었습니다.';
            content = '종료!'
        }
        else if(index === '210'){
            title = '업체에서 검수 사진을 등록했습니다.';
            content = '등록!'
        }
        else if(index === '211'){
            title = '검수가 완료되었습니다.';
            content = '완료!'
        }
        else if(index === '212'){
            title = '시공사진이 등록되었습니다.';
            content = '등록!'
        }
        else if(index === '213'){
            title = '시공이 완료되었습니다';
            content = '완료!'
        }
        else if(index === '214'){
            title = '리뷰를 작성해주세요.';
            content = '제발!'
        }
        newAlarm.push({
            id: length,
            alarmType: index === null ? 0 : index,
            date: '20211126',
            isRead: false,
            title: title,
            content: content,
        });
        await storage.store("Alarm", newAlarm);
        if(index === '200' || index === '201' || index === '210' || index === '211' || index === '212' || index === '213' || index === '214'){
            Alert.alert(
            index,
            '알림이 도착했습니다. 이동하시겠습니까?',
            [
              {text: '예', onPress: async() => {
                props.navigation.navigate("AlarmScreen");
              }},
              {text: '아니요', onPress: () => {}}
            ],
                { cancelable: true }
            );
        }
        });

        return unsubscribe;
    },[]);

    React.useEffect(()=>{
        const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
            props.navigation.navigate("MainScreen");
        });
        return unsubscribe;
    },[])

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
        else if(state === 3 || state === 4 || state === 5 || state === 6 || state === 7) props.navigation.navigate("ProgressScreen", {orderId: orderId, state: state });
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
                    setIsLoading(false);
                })
                .catch(e=>{
                    checkErrorCode(e);
                })
            }
            else{
                console.log("no login");
                setIsLoading(false);
            }
        }
        catch{e=>{
            Alert.alert(
                '오류',
                'MainScreen 오류',
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
                '오류',
                'MainScreen 오류',
                [
                    {text: '확인', onPress: () => {}},
                ],
                { cancelable: false }
            );}
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
                '로그인 필요',
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
            newTime.push(item-60);
        })
        setOrderTimeList(newTime);
    }, 60000);

    function convertTime(time){
        const target = parseInt(time);
        let hour = parseInt(target/3600);
        let minute = parseInt((target - hour*3600)/60);
        let second = parseInt((target-hour*3600-minute*60));
        
        return {
            hour: hour.toString().padStart(2,0),
            minute: minute.toString().padStart(2,0),
            second: second.toString().padStart(2,0),
        };
    }

    function askCancelOptions(orderId){
        Alert.alert(
            '확인',
            '신청하신 입찰이 취소하시겠습니까?',
            [
              {text: '예', onPress: () => {
                CancelOrder(orderId);
              }},
              {text: '아니요', onPress: () => {}}
            ],
            { cancelable: true }
        );
    
    }

    return(
        <TotalView notchColor={Color.main}>
            <ScrollView>
            <TopBar>
                <TouchableOpacity style={{padding: 5}} onPress={()=>{props.navigation.navigate("AlarmScreen")}}>
                    <Icon name="notifications-outline" size={25} color={'white'}></Icon>
                </TouchableOpacity>
                <TouchableOpacity style={{padding: 5, marginLeft: 15}} onPress={()=>{MoveMypage();}}>
                    <Icon name="person-circle-outline" size={25} color={'white'}></Icon>
                </TouchableOpacity>
            </TopBar>

            <View style={{ backgroundColor: Color.main , borderBottomRightRadius: 20 , borderBottomLeftRadius: 20}}>
                <Title style={styles.title}>{'안녕하세요,\n무엇을 도와드릴까요?'}</Title>
            </View>

            <Row>
                <MenuButton onPress={()=>{CheckAsync();}}>
                    <TextRow>
                        <Text style={{...styles.text, paddingRight:0 }}>신차패키지</Text>
                        <IconButton icon='help-circle' style={{margin:0}} color='lightgray' size={25}
                                    onPress={ () => { alert('신차패키지 설명') } }
                                />
                    </TextRow>
                    <Text style={styles.subText}>{'새차를\n멋지게 만들어요'}</Text>
                    <Avatar.Icon icon='car-key' style={styles.icon} color='black'/>
                </MenuButton>
                <MenuButton>
                    <Text style={styles.text}>케어</Text>
                    <Text style={styles.subText}>{'내 차를\n관리해요'}</Text>
                    <Avatar.Icon icon='car-cog' style={styles.icon} color='black'/>
                </MenuButton>
            </Row>

            <Divider style={styles.divider}/>
            
            <TextRow>
                <Title style={styles.text}>
                    당신의 차량
                </Title>
                <IconButton icon='autorenew' size={20}  color={'gray'} onPress={()=>{getData();}}/>
                <IconButton icon='format-list-bulleted' style={{ position: 'absolute' , right: 0 }} onPress={()=>{setChangeView(!changeView)}}/>
            </TextRow>
            <View style={{height: 250, borderBottomWidth: 3 , borderBottomColor: 'lightgray'}}>
                {!isLoading ? 
                <>
                    { changeView ? ( //요청받아서 없으면 빈 리스트 넘겨줌.
                        <ScrollView horizontal={true} style={styles.scrollview}>
                            {
                            myOrderList.map((item, index) =>{
                                return(
                                    <View key={item.orderId}>
                                    <Card style={styles.card} onPress={()=>{StateMove(item.orderId, item.state, item.carName, item.time)}}>
                                        <View style={styles.cover}>
                                            <FastImage  source={item.carImage === null ? require('../LOGO_2.png'):{uri: item.carImage}} style={{width: '100%', height: '100%'}}/>
                                        </View>
                                        <Card.Title title={item.carName} titleStyle={{ fontWeight: 'bold' }}
                                            subtitle={item.state == 3 ? '출고지 지정' : item.state == 4 ? '신차검수' : item.state == 5 ? '신차검수 완료' : item.state == 6 ? '시공 중' : item.state == 7 ? '시공 완료' : item.state == 1 ? '입찰 중' :item.state == 2 ? '입찰 시간 만료' : ''} />
                                        <Card.Content style={{flexDirection: 'row'}}>
                                            {item.state <= 2 && <Text>{`${convertTime(orderTimeList[index]).hour}:${convertTime(orderTimeList[index]).minute}`}</Text>}
                                        </Card.Content>
                                        {item.state <= 2 && <TouchableOpacity style={{position: 'absolute', alignSelf: 'flex-end', paddingRight: 2, paddingTop: 2}} onPress={()=>{askCancelOptions(item.orderId)}}>
                                            <Icon name="close-outline" size={25} color={'black'}></Icon>
                                        </TouchableOpacity>}
                                    </Card> 
                                    {item.state <=2 && <Badge style={{position: 'absolute'}}>{item.bidNum}</Badge>}
                                    </View>
                                )
                            })
                            }
                        </ScrollView>                
                    ) : 
                    (
                        <Swiper 
                            autoplay={false} 
                            style={{ marginVertical: 10 }}
                            loop={false}
                            renderPagination={(index,total)=><Text style={{ alignSelf: 'flex-end' , bottom : 20 , right: 5 , color: 'gray' , fontSize: 15 }}>{index+1}/{total}</Text>}
                            >
                            {
                                myOrderList.map((item, index)=>{
                                    return(
                                        <Card key={item.orderId} style={{ flex: 1 }} onPress={()=>{StateMove(item.orderId, item.state, item.carName, item.time)}}>
                                            <TextRow style={{ flex: 1}}>
                                                <View style={{ flex: 3 }}>
                                                    <View style={{flex: 1}}>
                                                        <FastImage  source={item.carImage === null ? require('../LOGO_2.png'):{uri: item.carImage}} style={{width: '100%', height: '100%'}}/>
                                                    </View>
                                                    {item.state <=2 && <Badge style={{position: 'absolute'}} size={30}>{item.bidNum}</Badge>}  
                                                </View>
                                                <View style={{ flex: 2 }}>
                                                    <Card.Title title={item.carName} titleStyle={{ fontWeight: 'bold' , fontSize: 27 , padding: 10 }} subtitleStyle={{ fontSize: 17 , padding: 10 }}
                                                        subtitle={item.state == 3 ? '출고지 지정' : item.state == 4 ? '신차검수' : item.state == 5 ? '신차검수 완료' : item.state == 6 ? '시공 중' : item.state == 7 ? '시공 완료' : item.state == 1 ? '입찰 중' :item.state == 2 ? '입찰 만료' : ''} />
                                                    <Card.Content>
                                                    { item.state <=2 && <Text style={{ fontSize: 20 , padding: 10 }}>{`${convertTime(orderTimeList[index]).hour}:${convertTime(orderTimeList[index]).minute}`}</Text>}
                                                    </Card.Content>
                                                </View>
                                            </TextRow>
                                            {item.state <= 2 && <TouchableOpacity style={{position: 'absolute', alignSelf: 'flex-end', paddingRight: 2, paddingTop: 2}} onPress={()=>{askCancelOptions(item.orderId)}}>
                                                <Icon name="close-outline" size={30} color={'black'}></Icon>
                                            </TouchableOpacity>}
                                            
                                        </Card> 
                                    )
                                })
                            }
                        </Swiper>
                    )}     
                </> :
                 <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size = 'small' color= {Color.main}/>
                </View>}
            </View>
            </ScrollView>

            <PaperProvider>
                <Portal>
                    <Dialog visible={existingDialog} onDismiss={hideDialog}>
                        <Dialog.Content>
                            <Paragraph>{'이전의 자료가 있습니다.\n이어서 하시겠습니까?'}</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button mode="contained" color={Color.main} style={{width: 70}} onPress={() => {OKExisting()}}>예</Button>
                            <Button mode="contained" color={Color.main} style={{marginLeft: 10, width: 70}} onPress={() => {CancelExisting()}}>아니요</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </PaperProvider>
            
        </TotalView>
    );
}

export default MainScreen;