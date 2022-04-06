import React from "react";
import styled from "styled-components/native";
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Modal, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Swiper from "react-native-swiper";
import { useIsFocused } from '@react-navigation/native';
import moment from "moment";
import { Badge, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
//component
import Background from "../components/Background";
import { MainText, MenuTitleText, MenuContentText, JuaText, NotoSansText } from "../components/TextStyle";
import TopBox from "../components/TopBox";
import Row from "../components/Row";
import CustButton from "../components/CustButton";
import TotalIndicator from '../components/TotalIndicator';
//constant
import Color from "../constants/Color";
//function
import storage from '../function/storage';
import { userContext } from '../function/Context';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';
import checkErrorCode from '../function/checkErrorCode';
//navigation
import { createNavigationContainerRef } from '@react-navigation/native';
import CheckModal from "../components/CheckModal";

export const navigationRef = createNavigationContainerRef();
export function navigate(name, params) {
    if (navigationRef.isReady()) {
      navigationRef.navigate(name, params);
    }
    else{

    }
}

const Bar = styled.View`
    width: 100%;
    height: 100%;
    padding-right: 10px;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
`;

const PolicySeperator = styled.View`
    width: 1px;
    height: 13px;
    border-right-width: 2px;
    border-color: gray;
    margin-right: 5px;
    margin-left: 5px;
`;
const PolicyText = styled.Text`
    color: #7D7DC5;
    font-family: NotoSansKR-Medium;
    font-size: 10px;
`;

const MenuBox = styled.View`
    width: 90%;
    border: 2px solid ${Color.menuBorder};
    background-color: ${Color.menuBackgrund};
    border-radius: 5px;
    margin-top: 20px;
`;
const MenuTitle = styled.View`
    width: 100%;
    height: 35px;
    background-color: white;
    align-items: center;
    justify-content: center;
    border-bottom-color: ${Color.menuTitleBorder};
    border-bottom-width: 2px;
    flex-direction: row;
`;
const MenuContent = styled.View`
    width: 100%;
    align-items: center;
    justify-content: center;
`;

const GoButton = styled.TouchableOpacity`
    height: 25px;
    align-items: center;
    justify-content: center;
    border: 1px solid #FF0024;
    border-radius: 20px;
    flex-direction: row;
    padding: 0px 10px;
`;
const ListBox = styled.TouchableOpacity`
    width: 95%;
    border: 2px solid ${Color.menuBorder};
    border-radius: 5px;
    margin-top: 20px;
`;
const ListContent = styled.View`
    width: 100%;
    background-color: white;
    align-items: center;
    justify-content: space-around;
    padding: 10px 0px;
    flex-direction: row;
`;


function MainPage(props){
    const [CareAsyncCheck, setCareAsyncCheck] = React.useState(false);
    const [NcpAsyncCheck, setNcpAsyncCheck] = React.useState(false);
    const [currentOrder, setCurrentOrder] = React.useState(null);
    const [myOrderList, setMyOrderList] = React.useState([]);
    const [orderTimeList, setOrderTimeList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isLogin, setIsLogin] = React.useState(false);
    
    const context = React.useContext(userContext);

    const isFocused = useIsFocused();
    React.useEffect(()=>{
        if(isFocused) {
            getData();
        }
    },[isFocused]);

    async function NcpCheckAsync(){
        try{
            const response = await storage.fetch('BidOrder');
            if(response !== null){
                console.log('async has orderData: ', response);
                setCurrentOrder(response);
                setNcpAsyncCheck(true);
            }
            else{
                console.log('async has null')
                props.navigation.navigate("NcpPage_1");
                setNcpAsyncCheck(false);
            }
        }
        catch (error){
            console.log(error);
        }
    }

    async function NcpCancelAsync(){
        try{
            console.log("cancel BidOrder")
            await AsyncStorage.removeItem('BidOrder', ()=>{
                props.navigation.navigate("NcpPage_1");
                setNcpAsyncCheck(false);
            });
        }
        catch(error){
            console.log(error);
        }
    }
    
    async function NcpOkAsync(){
        if(currentOrder.processPage === 1){
            props.navigation.navigate("NcpPage_1");
            setNcpAsyncCheck(false);
        }
        else if(currentOrder.processPage === 2){
            props.navigation.navigate("NcpPage_2");
            setNcpAsyncCheck(false);
        }
        else if(currentOrder.processPage === 3){
            props.navigation.navigate("NcpPage_3");
            setNcpAsyncCheck(false);
        }
    }

    async function CareCheckAsync(){
        try{
            const response = await storage.fetch('CareOrder');
            if(response !== null){
                console.log('async has orderData: ', response);
                setCurrentOrder(response);
                setCareAsyncCheck(true);
            }
            else{
                console.log('async has null')
                props.navigation.navigate("CarePage_1");
                setCareAsyncCheck(false);
            }
        }
        catch (error){
            console.log(error);
        }
    }

    async function CareCancelAsync(){
        try{
            console.log("cancel CareOrder")
            await AsyncStorage.removeItem('CareOrder', ()=>{
                props.navigation.navigate("CarePage_1");
                setCareAsyncCheck(false);
            });
        }
        catch(error){
            console.log(error);
        }
    }
    
    async function CareOkAsync(){
        if(currentOrder.processPage === 1){
            props.navigation.navigate("CarePage_1");
            setCareAsyncCheck(false);
        }
        else if(currentOrder.processPage === 2){
            props.navigation.navigate("CarePage_2");
            setCareAsyncCheck(false);
        }
        else if(currentOrder.processPage === 3){
            props.navigation.navigate("CarePage_3");
            setCareAsyncCheck(false);
        }
    }

    function StateMove(orderId, state, carName, time, kind){
        if(kind === 'NewCarPackage'){
            if(state === 1 || state === 2) props.navigation.navigate("SelectBiddingPage",{carName: carName, orderId: orderId, createdTime: time, kind: kind});
            else if(state === 3 || state === 4 || state === 5 || state === 6 || state === 7) props.navigation.navigate("NcpProgressPage", {orderId: orderId, state: state });
        }
        else{
            if(state === 1 || state === 2) props.navigation.navigate("SelectBiddingPage",{carName: carName, orderId: orderId, createdTime: time, kind: kind});
            else if(state === 3 || state === 4 || state === 5) props.navigation.navigate('CareProgressPage', { orderId: orderId, state: state })
        }
    }

    async function getData(){
        try{
            setIsLoading(true);
            const auth = await checkJwt();
            if(auth !== null){
                setIsLogin(true);
                const myOrderResponse = await axios({
                    method: 'GET',
                    url : `${server.url}/api/orders/user`,
                    headers : {Auth: auth},
                })
                .then(res => {
                    const curTime = Date.now();
                    let rawData = res.data.data;
                    if(rawData !== null){
                        rawData.map(item => {
                            if(item.details !== null) item['details'] = JSON.parse(item.details) ;
                            else item['details'] = null;
                        })
                        let newData = [];
                        let timeData = [];
                        rawData.map(item => { 
                            newData.push({
                                orderId: item.id, 
                                carName:  item.details.carName, 
                                state: item.kind === 'NewCarPackage' ? translateNcpState(item.state) : translateCareState(item.state), 
                                time: item.created_time, 
                                carImage: null,
                                bidNum: item.bidcount,
                                kind: item.kind
                            });
                            timeData.push(moment.duration(moment(item.created_time).add(24, 'hours').diff(moment(curTime))).asSeconds());
                        });
                        setMyOrderList(newData.reverse());
                        setOrderTimeList(timeData.reverse());
                    }
                    else{
                        setMyOrderList([]);
                    }
                    checkNewAlarm();
                    setIsLoading(false);
                })
                .catch(e=>{
                    checkErrorCode(e, props.navigation);
                });
            }
            else{
                setIsLogin(false);
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
            setIsLoading(false);
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
    
    function translateNcpState(state){
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
    function translateCareState(state){
        const item = {
            'BIDDING' : 1,
            'BIDDING_COMPLETE' : 2,

            'PRE_CONSTRUCTING' : 3,
            'CONSTRUCTING' : 4,
            'CONSTRUCTION_COMPLETED' : 5,
        }
        return item[state];
    }
    function translateState(kind, state){
        if(kind === 'NewCarPackage'){
            if(state === 1) return '입찰 중';
            else if(state === 2) return '입찰 시간 만료';
            else if(state === 3) return '출고지 지정';
            else if(state === 4) return '신차검수';
            else if(state === 5) return '신차검수 완료';
            else if(state === 6) return '시공 중';
            else if(state === 7) return '시공 완료 / 출고대기';
            else return '';
        }
        else if(kind === 'Care'){
            if(state === 1) return '입찰 중';
            else if(state === 2) return '입찰 시간 만료';
            else if(state === 3) return '차량 전달';
            else if(state === 4) return '시공 중';
            else if(state === 5) return '케어완료 / 출고 대기';
        }
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
                    {text: '확인', onPress: () => {props.navigation.navigate("LoginPage")}},
                ],
                { cancelable: false }
            );
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

    const Top = ()=>{
        return(
            <TopBox topbar={<TopBar/>}>
                <Row style={{alignItems: 'center'}}>
                    <Image source={require('../resource/img_character_face.png')} style={{width: 45, height: 45, marginRight: 5}} resizeMode={'contain'}/>
                    <MainText>안녕하세요.</MainText>
                </Row>
                <Row>
                    <MainText style={{color: 'white'}}> 무엇을</MainText>
                    <MainText> 도와드릴까요?</MainText>
                </Row>
            </TopBox>
        )
    }
    
    const TopBar = () => {
        return(
            <Bar>
                <TouchableOpacity style={{padding: 5}} onPress={()=>{props.navigation.navigate("AlarmPage")}}>
                    <Icon name="notifications" size={23} color={Color.mainText}></Icon>
                    <Badge style={{position: 'absolute', elevation: 1}} visible={context.isNewAlarm} size={8}/>
                </TouchableOpacity>
                <TouchableOpacity style={{padding: 5, marginLeft: 15}} onPress={()=>{MoveMypage();}}>
                    <Icon name="person-circle" size={23} color={Color.mainText}></Icon>
                </TouchableOpacity>
            </Bar>
        )
    };

    return(
        <>
        <Background topbox={<Top/>}>
            <ScrollView contentContainerStyle={{alignItems: 'center'}} showsVerticalScrollIndicator={false}>
                <MenuBox>
                    <MenuTitle>
                        <MenuTitleText>신차패키지</MenuTitleText>
                        <View style={{position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'flex-end'}}>
                            <IconButton icon='help' size={18}  color={Color.mainText} onPress={()=>{}}/>
                        </View>
                    </MenuTitle>
                    <MenuContent style={{height: 65}}>
                        <MenuContentText style={{marginVertical: 20}}>새차를 멋지게 만들어요</MenuContentText>
                        <View style={{position: 'absolute', width: '100%', height: '100%', justifyContent: 'flex-end', alignItems: 'flex-end', padding: 5}}>
                            <GoButton onPress={()=>{NcpCheckAsync();}}>
                                <MenuTitleText style={{color: '#FF0024'}}>GO</MenuTitleText>
                                <Icon name={'arrow-forward'} size={15} color={'#FF0024'}/>
                            </GoButton>
                        </View>
                    </MenuContent>
                </MenuBox>
                <MenuBox>
                    <MenuTitle>
                        <MenuTitleText>내차케어</MenuTitleText>
                        <View style={{position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'flex-end'}}>
                            <IconButton icon='help' size={18}  color={Color.mainText} onPress={()=>{}}/>
                        </View>
                    </MenuTitle>
                    <MenuContent style={{height: 65}}>
                        <MenuContentText style={{marginVertical: 20}}>내 차를 관리해요</MenuContentText>
                        <View style={{position: 'absolute', width: '100%', height: '100%', justifyContent: 'flex-end', alignItems: 'flex-end', padding: 5}}>
                            <GoButton onPress={()=>{CareCheckAsync();}}>
                                <MenuTitleText style={{color: '#FF0024'}}>GO</MenuTitleText>
                                <Icon name={'arrow-forward'} size={15} color={'#FF0024'}/>
                            </GoButton>
                        </View>
                    </MenuContent>
                </MenuBox>
                <MenuBox>
                    <MenuTitle>
                        <MenuTitleText>나의 차량</MenuTitleText>
                        <View style={{position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'flex-end'}}>
                            <IconButton icon='autorenew' size={18}  color={Color.mainText} onPress={()=>{getData();}}/>
                        </View>
                    </MenuTitle>
                    <MenuContent style={{height: 250}} scrollEnabled={true}>
                        {!isLoading ? <>
                        {myOrderList.length === 0 ? 
                        <>
                        <MenuContentText>{ isLogin ? '진행중인 입찰 및 시공이 없습니다' : '로그인을 하셔야 합니다' }</MenuContentText>
                        <View style={{position: 'absolute', width: '100%', height: '100%', justifyContent: 'flex-end', alignItems: 'flex-end', padding: 5}}>
                            <GoButton onPress={()=>{props.navigation.navigate("LoginPage")}}>
                                <MenuTitleText style={{color: '#FF0024'}}>로그인</MenuTitleText>
                                <Icon name={'arrow-forward'} size={15} color={'#FF0024'}/>
                            </GoButton>
                        </View>
                        </>
                        :
                        <Swiper
                        autoplay={false}
                        loop={false}>
                            {myOrderList.map((item, index)=>{
                                if(index%2 === 0){
                                    let item2 = myOrderList[index+1] === null || myOrderList[index+1] === undefined ? null : myOrderList[index+1];
                                    return(
                                        <View key={item.orderId} style={{width: '100%', alignItems: 'center'}}>
                                            <ListBox onPress={()=>{StateMove(item.orderId, item.state, item.carName, item.time, item.kind)}}>
                                                <MenuTitle>
                                                    <Text style={{fontFamily: 'Jua-Regular'}}>{item.carName}</Text>
                                                    {item.state <= 2 &&<View style={{position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'flex-end'}}>
                                                        <IconButton icon='close' size={18}  color={Color.mainText} onPress={()=>{askCancelOptions(item.orderId)}}/>
                                                    </View>}
                                                </MenuTitle>
                                                <ListContent>
                                                    {item.state <= 2 ? 
                                                        <NotoSansText style={{color: '#FF0024'}}>{'입찰중 / '+ `${convertTime(orderTimeList[index]).hour}:${convertTime(orderTimeList[index]).minute}`}</NotoSansText>
                                                    :
                                                        <NotoSansText style={{color: '#FF0024'}}>{translateState(item.kind, item.state)}</NotoSansText>}
                                                    {item.state <= 2 && <NotoSansText style={{color: '#FF0024'}}>{'입찰업체 / ' + item.bidNum}</NotoSansText>}
                                                </ListContent>
                                            </ListBox>

                                            {item2 !== null  && 
                                            <ListBox onPress={()=>{StateMove(item2.orderId, item2.state, item2.carName, item2.time, item2.kind)}}>
                                                <MenuTitle>
                                                    <Text style={{fontFamily: 'Jua-Regular'}}>{item2.carName}</Text>
                                                    {item2.state <= 2 &&<View style={{position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'flex-end'}}>
                                                        <IconButton icon='close' size={18}  color={Color.mainText} onPress={()=>{askCancelOptions(item2.orderId)}}/>
                                                    </View>}
                                                </MenuTitle>
                                                <ListContent>
                                                    {item2.state <= 2 ? 
                                                        <NotoSansText style={{color: '#FF0024'}}>{'입찰중 / '+ `${convertTime(orderTimeList[index+1]).hour}:${convertTime(orderTimeList[index+1]).minute}`}</NotoSansText>
                                                    :
                                                        <NotoSansText style={{color: '#FF0024'}}>{translateState(item2.kind, item2.state)}</NotoSansText>}
                                                    {item2.state <= 2 && <NotoSansText style={{color: '#FF0024'}}>{'입찰업체 / ' + item2.bidNum}</NotoSansText>}
                                                </ListContent>
                                            </ListBox>}
                                        </View>
                                    )
                                }
                                })}
                        </Swiper>}
                        </>
                        :
                        <TotalIndicator/>}
                    </MenuContent>
                </MenuBox>
                <View style={{alignItems: 'center', width: '100%', paddingVertical: 30}}>
                    <Row style={{alignItems: 'center'}}>
                        <View style={{paddingHorizontal: 10}}>
                            <NotoSansText style={{color: '#74B7E1'}}>이용약관</NotoSansText>
                        </View>
                        <PolicySeperator style={{borderColor: '#74B7E1'}}/>
                        <View style={{paddingHorizontal: 10}}>
                            <NotoSansText style={{color: '#74B7E1'}}>개인정보처리방침</NotoSansText>
                        </View>
                        <PolicySeperator style={{borderColor: '#74B7E1'}}/>
                        <View style={{paddingHorizontal: 10}}>
                            <NotoSansText style={{color: '#74B7E1'}}>청소년보호정책</NotoSansText>
                        </View>
                    </Row>
                    <NotoSansText style={{color: '#74B7E1', margin: 10}}>어메이킹스튜디오</NotoSansText>
                    <View style={{marginTop: 10, alignItems: 'center'}}>
                        <Row style={{alignItems: 'center'}}>
                            {/* <PolicyText>주소</PolicyText>
                            <PolicySeperator/> */}
                            <PolicyText>{'경기도 화성시 동탄첨단산업1로 27, stay S921호'}</PolicyText>
                        </Row>
                        <PolicyText>{'(영천동, 금강펜테리움 IX타워)'}</PolicyText>
                    </View>
                    <Row style={{marginTop: 5, alignItems: 'center'}}>
                        {/* <PolicyText>대표</PolicyText>
                        <PolicySeperator/> */}
                        <PolicyText>김용희</PolicyText>
                    </Row>
                    <Row style={{marginTop: 5, alignItems: 'center'}}>
                        {/* <PolicyText>사업자등록번호</PolicyText>
                        <PolicySeperator/> */}
                        <PolicyText>437-07-02325</PolicyText>
                    </Row>
                    <Row style={{marginTop: 5, alignItems: 'center'}}>
                        {/* <PolicyText>제공자</PolicyText>
                        <PolicySeperator/> */}
                        <PolicyText>어메이킹스튜디오</PolicyText>
                    </Row>
                </View>
            </ScrollView>
        </Background>

        <Modal
        animationType="slide"
        transparent={true}
        visible={NcpAsyncCheck}
        onRequestClose={() => {setNcpAsyncCheck(!NcpAsyncCheck);}}
        >
            <CheckModal
            TitleView={<JuaText style={{fontSize: 32}}>확인</JuaText>}
            TextContentView={ <>
                <NotoSansText style={{fontSize: 20}}>{'이전에 중단된 요청서가 있습니다.'}</NotoSansText>
                <NotoSansText style={{fontSize: 20}}>{'이어서 하시겠습니까?'}</NotoSansText>
                </>}
            BtnView={<>
                <CustButton onPress={()=>{NcpCancelAsync()}}>취소</CustButton>
                <CustButton onPress={()=>{NcpOkAsync()}}>확인</CustButton>
            </>}
            />
        </Modal>

        <Modal
        animationType="slide"
        transparent={true}
        visible={CareAsyncCheck}
        onRequestClose={() => {setCareAsyncCheck(!CareAsyncCheck);}}
        >
            <CheckModal
            TitleView={<JuaText style={{fontSize: 32}}>확인</JuaText>}
            TextContentView={ <>
                <NotoSansText style={{fontSize: 20}}>{'이전에 중단된 요청서가 있습니다.'}</NotoSansText>
                <NotoSansText style={{fontSize: 20}}>{'이어서 하시겠습니까?'}</NotoSansText>
                </>}
            BtnView={<>
                <CustButton onPress={()=>{CareCancelAsync()}}>취소</CustButton>
                <CustButton onPress={()=>{CareOkAsync()}}>확인</CustButton>
            </>}
            />
        </Modal>


        </>
    )
}

export default MainPage;