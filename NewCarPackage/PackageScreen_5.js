import React from 'react';
import styled from 'styled-components/native';
import { Text, View, ScrollView, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import _ from 'lodash';
import { useIsFocused } from '@react-navigation/native';
//pages
import BidShops from './BidShops';
//components
import TotalView from '../components/TotalView';
import Row from '../components/Row';
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
    padding: 5px;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
`;
const TimeView = styled.View`
    border: 2px solid #000000;
    border-radius: 15px;
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
    company_id:1,
    company_name: '올댓 오토모빌',
    simpleRegion: '서울 광진',
    price: 20000000,
    quote: '구체 견적들 ex) 썬팅: T70 15, 블랙박스: 파인뷰LX5000 ...',
},{
    company_id:2,
    company_name: '카샵1',
    simpleRegion: '서울 금천',
    price: 15000000,
    quote: '구체 견적들 ex) 썬팅 T70 15, 블랙박스 파인뷰LX5000 ...',
},{
    company_id:3,
    company_name: '카샵2',
    simpleRegion: '서울 서초',
    price: 15000000,
    quote: '구체 견적들 ex) 썬팅 T70 15, 블랙박스 파인뷰LX5000 ...',
},{
    company_id:4,
    company_name: '카샵3',
    simpleRegion: '서울 송파',
    price: 15000000,
    quote: '구체 견적들 ex) 썬팅 T70 15, 블랙박스 파인뷰LX5000 ...',
},{
    company_id:5,
    company_name: '카샵4',
    simpleRegion: '서울 강남',
    price: 15000000,
    quote: '구체 견적들 ex) 썬팅 T70 15, 블랙박스 파인뷰LX5000 ...',
},{
    company_id:6,
    company_name: '카샵5',
    simpleRegion: '서울 종로',
    price: 15000000,
    quote: '구체 견적들 ex) 썬팅 T70 15, 블랙박스 파인뷰LX5000 ...',
},{
    company_id:7,
    company_name: '카샵6',
    simpleRegion: '서울 은평',
    price: 15000000,
    quote: '구체 견적들 ex) 썬팅 T70 15, 블랙박스 파인뷰LX5000 ...',
},{
    company_id:8,
    company_name: '카샵7',
    simpleRegion: '서울 마포',
    price: 15000000,
    quote: '구체 견적들 ex) 썬팅 T70 15, 블랙박스 파인뷰LX5000 ...',
},{
    company_id:9,
    company_name: '카샵8',
    simpleRegion: '서울 금천',
    price: 15000000,
    quote: '구체 견적들 ex) 썬팅 T70 15, 블랙박스 파인뷰LX5000 ...',
},{
    company_id:10,
    company_name: '카샵9',
    simpleRegion: '서울 금천',
    price: 15000000,
    quote: '구체 견적들 ex) 썬팅 T70 15, 블랙박스 파인뷰LX5000 ...',
},{
    company_id:11,
    company_name: '카샵10',
    simpleRegion: '서울 금천',
    price: 15000000,
    quote: '구체 견적들 ex) 썬팅 T70 15, 블랙박스 파인뷰LX5000 ...',
},{
    company_id:12,
    company_name: '카샵11',
    simpleRegion: '서울 금천',
    price: 15000000,
    quote: '구체 견적들 ex) 썬팅 T70 15, 블랙박스 파인뷰LX5000 ...',
}];

function PackageScreen_5(props){
    const [orderId, setOrderId] = React.useState(props.route.params.orderId);
    const [bidList, setBidList] = React.useState([]);

    const isFocused = useIsFocused();
    React.useEffect(()=>{
        if(isFocused){
            getData();
        }
    },[isFocused]);

    async function getData(){
        try{
            const auth = await checkJwt();
            if(auth !== null){
                const response = await axios({
                    method: 'GET',
                    url : `${server.url}/api/bidding/${orderId}`,
                    headers : {Auth: auth},
                })
                const rawData = response.data.data;
                console.log(rawData);
                if(rawData.length !== 0){
                    //details만 parsing
                    rawData.map(item => {
                        item['detail'] = JSON.parse(item.detail) ;
                    });
                    //내가 사용할 DATA만들기
                    let newData = [];
                    rawData.map(item => {
                        newData.push({
                            company_id: item.company_id,
                            simpleRegion: item.address === null? 'null':item.address,
                            company_name: item.company_name === null? 'null':item.company_name,
                            price: parseInt(item.detail.totalPrice)*10000,
                            quote: 'item.detail',
                            bid_id: item.id,
                        })
                    });
                    //console.log(newData);   
                    setBidList(newData);
                }
                else{
                    console.log('bidlist is empty');
                    setBidList([]);
                }
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
                    {text: 'OK', onPress: () => {}},
                ],
                { cancelable: false }
            );
        }}
    }

    return(
        <TotalView color={'white'} notchColor={'white'} homeIndicatorColor={'white'}>
            <TitleView>
                <View style={{width: '50%'}}>
                    <Text style={{fontSize: 30, fontFamily: 'DoHyeon-Regular'}}>{props.route.params.carName}</Text>
                </View>
                <TimeView>
                    <Text style={{fontSize: 25}}>23:59:58</Text>
                </TimeView>
            </TitleView>
            <ContentView>
                <Filter>-최신순</Filter>
                <ShopList>
                    {bidList.length !== 0 ? <ScrollView>
                        {_.map(bidList, (item)=>{
                            return(
                                <BidShops key={item.bid_id} item={[item]} navigation={props.navigation} orderId={orderId}></BidShops>
                            )
                        })}
                    </ScrollView>:
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 20, color: 'gray'}}>아직 입찰에 참여한 업체가 없습니다.</Text>                        
                    </View>}
                </ShopList>
                <BtnView>
                    <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                        <Button mode={"contained"} onPress={() => {props.navigation.goBack();}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>홈으로</Button>
                    </Row>
                </BtnView>
            </ContentView>

        </TotalView>
    );
}

export default PackageScreen_5;