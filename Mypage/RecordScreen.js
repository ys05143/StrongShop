import React from 'react'
import styled from 'styled-components/native';
import { Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { Card, Provider as PaperProvider, Button } from 'react-native-paper';
import _ from 'lodash';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import { useIsFocused } from '@react-navigation/native';
//component
import TotalView from '../components/TotalView';
import TopBar from '../components/TopBar';
//constant
import Color from '../constants/Color';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';
import Row from '../components/Row';

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
        props.navigation.navigate("RegisterReviewScreen", {completedContractId: completedContractId, companyName: companyName, receipt: receipt, flag: false});
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
                //console.log(rawData);
                let record = [];
                rawData.map(item => {
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
                //console.log(record);
                setRecordData(record);
            }
            else{
                Alert.alert(
                    '실패',
                    '로그인이 필요합니다.',
                    [
                        {text: '확인', onPress: () => {props.navigation.navigate("LoginScreen")}},
                    ],
                    { cancelable: false }
                );
            }
            setIsLoading(false);
        }
        catch{e => {
            Alert.alert(
                '오류',
                '다시 시도해주세요.',
                [
                    {text: '확인', onPress: () => {}},
                ],
                { cancelable: false }
            );}
        }
    }
    function renderItem({item}){
        return(
            // <Card style={{height: 130, margin: 10 ,elevation: 2 }} onPress={()=>{StateMove(item.orderId, item.state, item.carName, item.time)}}>
            //     <Row>
            //         <View style={{height: 130, width: 130}}>
            //             <FastImage  source={item.companyImage === null ? require('../LOGO_2.png'):{uri: item.companyImage}} style={{width: '100%', height: '100%'}}/>
            //         </View>  
            //         <View style={{ height: 130, flex : 1}}>
            //             <Card.Title title={item.carName} titleStyle={{ fontWeight: 'bold' }} 
            //                         right={(props) => !item.reviewStatus &&<TouchableOpacity style={{width: 80, height: 40, borderWidth:1, borderWidthColor: 'black', borderRadius: 15, justifyContent:'center', alignItems:'center', marginRight: 10}}
            //                                                             onPress={()=>{gotoRegisterReview(item.completedContractId, item.companyName, item.receipt);}}>
            //                                                 <Text>리뷰쓰기</Text>           
            //                                             </TouchableOpacity>}/>
            //             <Card.Content>
            //                 <Text style={{fontSize: 20}}>{moment(item.date).format('YYYY-MM-DD')}</Text>
            //                 <Text style={{fontSize: 20}}>{item.companyName}</Text>
            //                 <Text style={{fontSize: 15}}>{item.price.toLocaleString("ko-KR", { style: 'currency', currency: 'KRW' })}</Text>
            //             </Card.Content>
            //         </View>
            //     </Row>
            // </Card> 
            <Card style={{margin: 10 ,elevation: 2}}>
                <Row>
                    <View style={{justifyContent: 'center', alignItems: 'center', height: 130, width: 120}}>
                        <View style={{width: 100, height: 100, backgroundColor: '#e5e5e5', borderRadius: 15, overflow: 'hidden'}}>
                            <FastImage  source={{uri: item.companyImage}} style={{width: '100%', height: '100%'}}/>
                        </View>
                    </View>
                    <View style={{ flex: 1, paddingVertical: 10, paddingRight: 5}}>
                        <Card.Title title={item.carName} titleStyle={{ fontWeight: 'bold' }} titleNumberOfLines={2}
                            subtitle={`${item.companyName}\n${moment(item.date).format('YYYY-MM-DD')}`}
                            subtitleNumberOfLines={2}/>
                        <Card.Content style={{flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                            <Text style={{fontSize: 17, fontWeight: 'bold'}}>{item.price.toLocaleString("ko-KR", { style: 'currency', currency: 'KRW' })}</Text>
                        </Card.Content>
                    </View>
                </Row>
                <Card.Actions>
                    <Button mode={'outlined'} style={{flex: 1}} color={'black'} onPress={()=>gotoRegisterReview(item.completedContractId, item.companyName, item.receipt)}>
                        리뷰쓰기
                    </Button>
                </Card.Actions>
            </Card>
        )
    }

    return(
        <TotalView color={'white'} notchColor={'white'} homeIndicatorColor={'white'}>
            <TopBar>
                <TouchableOpacity style={{height: 60, width: 60, justifyContent: 'center', paddingHorizontal: 5}} onPress={()=>{props.navigation.goBack()}}>
                    <Icon name="chevron-back-outline" size={30} color={'black'}></Icon>
                </TouchableOpacity>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>과거 시공 기록</Text>
                </View>
                <View style={{width: 60}}/>
            </TopBar>
            {!isLoading ? <FlatList  data={recordData}
                    style={{marginTop: 10}}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.completedContractId}/>:
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent'}}>
                        <ActivityIndicator size = 'small' color= {Color.main} style={{marginTop: 10}}/>
                    </View>}
        </TotalView>
    );
}

export default RecordScreen;