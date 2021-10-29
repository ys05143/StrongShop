import React from 'react'
import styled from 'styled-components/native';
import { Text, View, FlatList } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { Card, Provider as PaperProvider } from 'react-native-paper';
import _ from 'lodash';
import moment from 'moment';
//component
import TotalView from '../components/TotalView';
import { TouchableOpacity } from 'react-native-gesture-handler';

const stamp = (new Date().getTime()+(23*3600+54*60)-new Date().getTime()) ;
const TopBar = styled.View`
    height: 60px;
    width: 100%;
    padding-right: 10px;
    border-bottom-width: 1px;
    border-color: lightgray;
    flex-direction: row;
    justify-content: center;
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
        id: 1,
        carImage: 'https://picsum.photos/0' ,
        carName: '카니발' ,
        date: '20170120',
        shopName: '올댓카니발',
        price: 3000000,
        contents: "블랙박스 파인테크 300만원",
    } ,
    {
        id: 2,
        carImage: 'https://picsum.photos/0' ,
        carName: '소나타' ,
        date: '20180318',
        shopName: '올댓오토모빌',
        price: 5000000,
        contents: "블랙박스 파인테크 300만원",
    } ,
    {
        id: 3,
        carImage: 'https://picsum.photos/100' ,
        carName: '티볼리' ,
        date: '20200604',
        shopName: '카샵',
        price: 2000000,
        contents: "블랙박스 파인테크 300만원",
    } ,
    {
        id: 4,
        carImage: 'https://picsum.photos/200' ,
        carName: '카니발' ,
        date: '20211126',
        shopName: '올댓카니발',
        price: 1500000,
        contents: "블랙박스 파인테크 300만원",
    }
]

function RecordScreen(props) {

    function gotoRegisterReview(shopName, contents){
        props.navigation.navigate("RegisterReviewScreen", {shopName: shopName, contents: contents});
    }
    function renderItem({item}){
        return(
            <Card style={{flex: 1}}>
                <TextRow style={{flex: 1}}>
                    <View style={{flex: 2}}>
                        <Card.Cover source={{uri: item.carImage}} style={{flex: 1}}/>    
                    </View>
                    <View style={{flex: 3}}>
                        <Card.Title title={item.shopName} 
                                    titleStyle={{fontWeight: 'bold', fontSize: 20 , padding: 10}} 
                                    subtitleStyle={{ fontSize: 17 , padding: 10 }}
                                    subtitle={item.carName} 
                                    right={(props) => <TouchableOpacity style={{width: 80, height: 40, borderWidth:1, borderWidthColor: 'black', borderRadius: 15, justifyContent:'center', alignItems:'center', marginRight: 10}}
                                                                        onPress={()=>{gotoRegisterReview(item.shopName, item.contents);}}>
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
        <TotalView color={'white'} notchColor={'white'}>
            <TopBar>
                <View style={{width: '100%', position: 'absolute'}}>
                    <Icon name="chevron-back-outline" size={30} color={'black'} onPress={()=>{props.navigation.goBack()}}></Icon>
                </View>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>과거 시공 기록</Text>
            </TopBar>
            <FlatList  data={DATA}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}/>
        </TotalView>
    );
}

export default RecordScreen;