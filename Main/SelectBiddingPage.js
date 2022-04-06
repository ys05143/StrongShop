import React from 'react';
import styled from 'styled-components/native';
import { Text, View, ScrollView, Alert, ActivityIndicator, TouchableOpacity, Modal, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import _ from 'lodash';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon  from "react-native-vector-icons/Ionicons";
import FastImage from 'react-native-fast-image';
//pages
import BidShops from '../NewCarPackage/BidShops';
//components
import Row from '../components/Row';
import JustShowOrder from '../NewCarPackage/JustShowOrder';
import ModalView from '../components/ModalView';
//constants
import Color from '../constants/Color';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';
import Background from '../components/Background';
import TopBox from '../components/TopBox';
import { MainText, MenuTitleText, MenuContentText, JuaText, NotoSansText } from "../components/TextStyle";

const Filter = styled.Text`
    margin-left: 10px;
    font-size: 15px;
    margin-top: 5px;
    margin-bottom: 10px;
`;

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

function SelectBiddingPage(props){
    const [orderId, setOrderId] = React.useState(props.route.params.orderId);
    const [kind, setkind] = React.useState(props.route.params.kind);
    const [carName, setCarName] = React.useState(props.route.params.carName)
    const [bidList, setBidList] = React.useState([]);
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
                            simpleRegion: item.address === null? '':item.address,
                            companyName: item.company_name === null? '':item.company_name,
                            price: parseInt(item.detail.totalPrice)*10000,
                            quote: JSON.stringify(item.detail),
                            bidId: item.id,
                            companyImage: item.companyImage,
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
                    '로그인이 필요합니다.',
                    [
                        {text: '확인', onPress: () => {props.navigation.navigate("LoginScreen")}},
                    ],
                    { cancelable: false }
                );
            }
        }
        catch{e=>{
            Alert.alert(
                '정보 조회 오류',
                '다시 시도해주세요.',
                [
                    {text: '확인', onPress: () => {props.navigation.navigate("MainPage")}},
                ],
                { cancelable: false }
            );
        }}
    }
/////for 시간계산////////////////////////
    const [time, setTime] = React.useState(moment.duration(moment(props.route.params.createdTime).add(24, 'hours').diff(moment(Date.now()))).asSeconds());

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

    const Top = ()=>{
        return(
            <TopBox topbar={<TopBar/>}>
                <MainText>{carName}</MainText>
                <Row>
                    <MainText style={{color: 'white'}}>{`${convertTime(time).hour}:${convertTime(time).minute}:${convertTime(time).second}`}</MainText>
                </Row>
            </TopBox>
        )
    }

    const TopBar = () => {
        return(
            <View style={{width: '100%', height: '100%', paddingRight: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                <TouchableOpacity style={{padding: 5, marginLeft: 15}} onPress={()=>{props.navigation.goBack();}}>
                    <Icon name="close" size={23} color={Color.mainText}></Icon>
                </TouchableOpacity>
            </View>
        )
    };

    return(
        <>
        <Background topbox={<Top/>}>
            <View style={{flex: 1}}>
                <Button mode={"outlined"} color={'gray'} icon={'clipboard-check-outline'} onPress={()=>{setReceiptModal(true)}} style={{marginTop: 10}}>주문 상세</Button>
                {bidList.length !== 0 && <ScrollView>
                        {_.map(bidList, (item)=>{
                            return(
                                <View key={item.bidId} style={{width: '100%', alignItems: 'center'}}>
                                    <ShopView2>
                                        <TouchableOpacity style={{width: 70, height: 70, backgroundColor: '#e5e5e5', borderRadius: 15, overflow: 'hidden'}} onPress={()=>{props.navigation.navigate("ShopScreen_1", {companyId: item.companyId});}}>
                                            <FastImage  source={{uri: item.companyImage}} style={{width: '100%', height: '100%'}}/>
                                        </TouchableOpacity> 
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
                                        <BidShops item={[item]} navigation={props.navigation} orderId={orderId} getSending={setIsLoading} kind={kind}></BidShops>
                                    </View>
                                </View>
                            )
                        })}
                    </ScrollView>
                }
            </View>

        </Background>

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

export default SelectBiddingPage;