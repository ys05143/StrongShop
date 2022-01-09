import React from 'react';
import styled from 'styled-components/native';
import { Text, View, ScrollView, Alert, ActivityIndicator, TouchableOpacity, Modal, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import _ from 'lodash';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import Moment from 'react-moment';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon  from "react-native-vector-icons/Ionicons";
//pages
import BidShops from './BidShops';
//components
import TotalView from '../components/TotalView';
import Row from '../components/Row';
import JustShowOrder from './JustShowOrder';
import ModalView from '../components/ModalView';
//constants
import Color from '../constants/Color';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';

///////////////////////////////
const ContentView = styled.View`
    flex: 5;
    justify-content: space-between;
`;
const BtnView = styled.View`
    width: 100%;
    height: 80px;
`;
///////////////////////////////////
const TitleView = styled.View`
    width: 100%;
    align-items: center;
    background-color: white;
    margin-top: 35px;
    margin-bottom: 15px;
`;
const TimeView = styled.View`
    border: 1px solid gray;
    border-radius: 10px;
    width: 150px;
    height: 60px;
    align-items: center;
    justify-content: center;
`;
const Filter = styled.Text`
    margin-left: 10px;
    font-size: 15px;
    margin-top: 5px;
    margin-bottom: 10px;
`;
//ShopList는 추후 FlatList로 변경 해야함
const ShopList = styled.View`
    flex: 1;
    width: 100%;
`;
//현재 입찰에 참여중인 업체들
const DATA = [{
    companyId:1,
    companyName: '올댓 오토모빌',
    simpleRegion: '서울 광진',
    price: 20000000,
    quote: '구체 견적들 ex) 썬팅: T70 15, 블랙박스: 파인뷰LX5000 ...',
},{
    companyId:2,
    companyName: '카샵1',
    simpleRegion: '서울 금천',
    price: 15000000,
    quote: '구체 견적들 ex) 썬팅 T70 15, 블랙박스 파인뷰LX5000 ...',
},];

const ShopView2 = styled.View`
    width: 95%;
    align-items: flex-end;
    flex-direction: row;
    padding-bottom: 10px;
    padding-top: 10px;
`;
const NameView2 = styled.TouchableOpacity`
    height: 35px;

    margin-left: 10px;

`;
const PriceView = styled.View`
    height: 35px;
    flex: 1;
    flex-direction: row;
    padding-right: 10px;
    align-items: flex-end;
    justify-content: flex-end;
`;

function PackageScreen_5(props){
    const [orderId, setOrderId] = React.useState(props.route.params.orderId);
    const [bidList, setBidList] = React.useState([]);
    const [isSending, setIsSending] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [ReceiptModal, setReceiptModal] = React.useState(false);

    function getReceiptModal(close){
        setReceiptModal(close);
    }

    const isFocused = useIsFocused();
    React.useEffect(()=>{
        if(isFocused){
            getData();
        }
    },[isFocused]);

    async function getData(){
        try{
            setIsLoading(true);
            const auth = await checkJwt();
            if(auth !== null){
                const response = await axios({
                    method: 'GET',
                    url : `${server.url}/api/bidding/${orderId}`,
                    headers : {Auth: auth},
                })
                const rawData = response.data.data;
                //console.log(rawData);
                if(rawData.length !== 0){
                    //details만 parsing
                    rawData.map(item => {
                        item['detail'] = JSON.parse(item.detail);
                    });
                    //내가 사용할 DATA만들기
                    let newData = [];
                    rawData.map(item => {
                        newData.push({
                            companyId: item.company_id,
                            simpleRegion: item.address === null? 'null':item.address,
                            companyName: item.company_name === null? 'null':item.company_name,
                            price: parseInt(item.detail.totalPrice)*10000,
                            quote: JSON.stringify(item.detail),
                            bidId: item.id,
                        })
                    });  
                    setBidList(newData);
                }
                else{
                    //console.log('bidlist is empty');
                    setBidList([]);
                }
                setIsLoading(false);
            }
            else{
                Alert.alert(
                    '실패',
                    '로그인이 필요합니다.',
                    [
                        {text: 'OK', onPress: () => {props.navigation.navigate("LoginScreen")}},
                    ],
                    { cancelable: false }
                );
            }
        }
        catch{e=>{
            Alert.alert(
                '오류',
                'PackageScreen_5 오류',
                [
                    {text: 'OK', onPress: () => {props.navigation.navigate("MainScreen")}},
                ],
                { cancelable: false }
            );
        }}
    }
/////for 시간계산////////////////////////
    const [time, setTime] = React.useState(moment.duration(moment(props.route.params.createdTime).add(48, 'hours').diff(moment(Date.now()))).asSeconds());

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
        if(time>0) setTime(time-1);
        else if(time === 0) return;
        else{}
    }, 1000);

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
 ///////////////////////////////////////////////////////     

    return(
        <>
        <TotalView color={'white'} notchColor={'white'} homeIndicatorColor={'white'}>
            <TitleView>
                <View>
                    <Text style={{fontSize: 30, fontFamily: 'DoHyeon-Regular'}}>{props.route.params.carName}</Text>
                </View>
                <View>
                    <Text style={{fontSize: 30, fontWeight: 'bold'}}>{`${convertTime(time).hour}:${convertTime(time).minute}:${convertTime(time).second}`}</Text>
                </View>
            </TitleView>
            <ContentView>
                {/* <Filter>-최신순</Filter> */}
                {/* <TouchableOpacity style={{marginLeft: 10, fontSize: 15, marginTop: 5, marginBottom: 10}} onPress={()=>{setReceiptModal(true)}}>
                    <Text>주문확인</Text>
                </TouchableOpacity> */}
                <Button mode={"outlined"} color={'gray'} icon={'clipboard-check-outline'} onPress={()=>{setReceiptModal(true)}}>주문 상세</Button>
                {!isLoading ? <ShopList>
                    {bidList.length !== 0 ? <ScrollView>
                        {_.map(bidList, (item)=>{
                            return(
                                <View key={item.bidId} style={{width: '100%', alignItems: 'center'}}>
                                    <ShopView2>
                                        <TouchableOpacity style={{width: 70, height: 70, backgroundColor: '#e5e5e5', borderRadius: 15}} onPress={()=>{props.navigation.navigate("ShopScreen_1", {companyId: item.companyId});}}/> 
                                        <View style={{flex: 1}}>
                                            <NameView2 onPress={()=>{props.navigation.navigate("ShopScreen_1", {companyId: item.companyId});}}> 
                                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>{item.companyName}</Text>
                                                    <MaterialIcons name={"chevron-right"} size={20} color= 'black' style={{marginLeft: 5}}></MaterialIcons>
                                                </View>
                                                
                                                <View>
                                                    <Text style={{fontSize: 13, marginLeft: 3, color: 'gray'}}>{item.simpleRegion}</Text>
                                                </View>
                                            </NameView2>
                                            <PriceView>
                                                <Text style={{fontSize: 23, fontWeight: 'bold'}}>{Platform.OS ==='ios' ? item.price.toLocaleString("ko-KR", { style: 'currency', currency: 'KRW' }) : parseInt(item.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'원'}</Text>
                                            </PriceView>
                                        </View>
                                    </ShopView2>
                                    <View style={{width: '100%'}}>
                                        <BidShops item={[item]} navigation={props.navigation} orderId={orderId} getSending={setIsSending}></BidShops>
                                    </View>
                                </View>
                            )
                        })}
                    </ScrollView>:
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 20, color: 'gray'}}>아직 입찰에 참여한 업체가 없습니다.</Text>                        
                    </View>}
                </ShopList> : 
                <ShopList>
                    <View style={{width: '100%', height: '100%', alignItems: 'center', position: 'absolute', justifyContent: 'center', backgroundColor: 'transparent'}}>
                        <ActivityIndicator size = 'small' color= {Color.main}/>
                    </View>
                </ShopList>}
                {/* <BtnView>
                    <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                        <Button mode={"contained"} onPress={() => {props.navigation.goBack();}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main} disabled={isSending}>홈으로</Button>
                    </Row>
                </BtnView> */}
            </ContentView>
            {isSending && <View style={{width: '100%', height: '100%', alignItems: 'center', position: 'absolute', justifyContent: 'center', backgroundColor: 'transparent'}}>
                <ActivityIndicator size = 'large' color= {Color.main}/>
            </View>}
            <View style={{position: 'absolute', width: '100%', paddingTop: 5, paddingLeft: 5}}>
                <TouchableOpacity onPress={()=>{props.navigation.navigate("MainScreen")}}>
                    <Icon name="chevron-back-outline" size={30} color={'black'}></Icon>
                </TouchableOpacity>    
            </View>
        </TotalView>

        <Modal
            animationType="slide"
            transparent={true}
            visible={ReceiptModal}
            onRequestClose={() => {setReceiptModal(!ReceiptModal);}}
        >
            <ModalView>
                <View style={{width: '90%'}}>
                    <JustShowOrder getModal={getReceiptModal} navigation={props.navigation} orderId={orderId}/>
                </View>
            </ModalView>
        </Modal>
        </>
    );
}

export default PackageScreen_5;