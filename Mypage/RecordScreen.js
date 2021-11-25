import React from 'react'
import styled from 'styled-components/native';
import { Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { Card, Provider as PaperProvider } from 'react-native-paper';
import _ from 'lodash';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import { useIsFocused } from '@react-navigation/native';
//component
import TotalView from '../components/TotalView';
//constant
import Color from '../constants/Color';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';

const stamp = (new Date().getTime()+(23*3600+54*60)-new Date().getTime()) ;
const TopBar = styled.View`
    height: 60px;
    width: 100%;
    padding-right: 10px;
    border-bottom-width: 1px;
    border-color: lightgray;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: white;
`;
const TextRow = styled.View`
    flex-direction: row;
    align-items: center;
`;

// 당신의 차량 DATA
const DATA = [
    {
        contractId: 1,
        companyImage: null ,
        carName: '카니발' ,
        date: '20170120',
        companyName: '올댓카니발',
        price: 3000000,
        receipt: "블랙박스 파인테크 300만원",
    } ,
    {
        contractId: 2,
        companyImage: null ,
        carName: '소나타' ,
        date: '20180318',
        companyName: '올댓오토모빌',
        price: 5000000,
        receipt: "블랙박스 파인테크 300만원",
    } ,
    {
        contractId: 3,
        companyImage: 'https://picsum.photos/100' ,
        carName: '티볼리' ,
        date: '20200604',
        companyName: '카샵',
        price: 2000000,
        receipt: "블랙박스 파인테크 300만원",
    } ,
    {
        contractId: 4,
        companyImage: 'https://picsum.photos/200' ,
        carName: '카니발' ,
        date: '20211126',
        companyName: '올댓카니발',
        price: 1500000,
        receipt: "블랙박스 파인테크 300만원",
    }
]

function RecordScreen(props) {
    const [recordData, setRecordData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    function gotoRegisterReview(completedContractId, companyName, receipt){
        props.navigation.navigate("RegisterReviewScreen", {completedContractId: completedContractId, companyName: companyName, receipt: receipt});
    }

    const isFocused = useIsFocused();
    React.useEffect(()=>{
        if(isFocused) {
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
                    url : `${server.url}/api/completedcontract`,
                    headers : {Auth: auth},
                }).catch(e=>console.log(e));
                const rawData = response.data.data;
                console.log(rawData);
                let record = [];
                rawData.map(item => {
                    console.log("hh");
                    record.push({
                        completedContractId: item.id,
                        companyImage: item.company_thumbnail_image,
                        date: item.createdtime,
                        companyName: item.company_name,
                        price: JSON.parse(item.details).totalPrice*10000, 
                        receipt: item.details,
                        carName: JSON.parse(item.details).carName,
                        reviewStatus: item.reviewStatus === "NOT_WRITTEN" ? false : true,
                    })
                })
                console.log(record);
                setRecordData(record);
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
            setIsLoading(false);
        }
        catch{e => {
            Alert.alert(
                '오류',
                '과거 시공내역 조회 오류',
                [
                    {text: 'OK', onPress: () => {}},
                ],
                { cancelable: false }
            );}
        }
    }
    function renderItem({item}){
        return(
            <Card style={{flex: 1}}>
                <TextRow style={{flex: 1}}>
                    <View style={{flex: 2}}>
                        <View style={{flex: 1}}>
                            <FastImage  source={item.companyImage === null ? require('../LOGO_2.png'):{uri: item.companyImage}} style={{width: '100%', height: '100%'}}/>
                        </View>  
                    </View>
                    <View style={{flex: 3}}>
                        <Card.Title title={item.companyName} 
                                    titleStyle={{fontWeight: 'bold', fontSize: 20 , padding: 10}} 
                                    subtitleStyle={{ fontSize: 17 , padding: 10 }}
                                    subtitle={item.carName} 
                                    right={(props) => !item.reviewStatus &&<TouchableOpacity style={{width: 80, height: 40, borderWidth:1, borderWidthColor: 'black', borderRadius: 15, justifyContent:'center', alignItems:'center', marginRight: 10}}
                                                                        onPress={()=>{gotoRegisterReview(item.completedContractId, item.companyName, item.receipt);}}>
                                                            <Text>리뷰쓰기</Text>           
                                                        </TouchableOpacity>}/>
                        <Card.Content>
                            <Text style={{fontSize: 20 , padding: 10}}>{moment(item.date).format('YYYY-MM-DD')}</Text>
                        </Card.Content>
                        <Card.Content style={{alignItems: 'flex-end'}}>
                            <Text style={{fontSize: 15 , padding: 10}}>{item.price.toLocaleString("ko-KR", { style: 'currency', currency: 'KRW' })}</Text>
                        </Card.Content>
                    </View>
                </TextRow>
            </Card> 
        )
    }

    return(
        <TotalView color={'white'} notchColor={'white'} homeIndicatorColor={'white'}>
            <TopBar>
                <TouchableOpacity>
                    <Icon name="chevron-back-outline" size={30} color={'black'} onPress={()=>{props.navigation.goBack()}}></Icon>
                </TouchableOpacity>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>과거 시공 기록</Text>
                <View style={{width: 15}}/>
            </TopBar>
            {!isLoading ? <FlatList  data={recordData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.completedContractId}/>:
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <ActivityIndicator size = 'small' color= {Color.main} style={{marginTop: 10}}/>
                    </View>}
        </TotalView>
    );
}

export default RecordScreen;