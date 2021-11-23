import React from 'react';
import { Text, TouchableOpacity, View, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import styled from 'styled-components/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Accordion from 'react-native-collapsible/Accordion';
//constants
import Color from '../constants/Color';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';

const ShopView = styled.View`
    width: 95%;
    border-bottom-width: 1px;
    border-color: gray;
    align-items: flex-end;
    flex-direction: row;
    padding-bottom: 10px;
    padding-top: 10px;
`;
const NameView = styled.View`
    width: 70%;
`;
const DetailView = styled.View`
    width: 95%;
    padding: 5px;
    margin-bottom: 5px;
    background-color: lightgray;
`;

function BidShop(props, {navigation}) {
    //for acodian
    const [activeSections, setActiveSections] = React.useState([]);

    async function sendData(orderId, bidId){
        try{
            console.log(orderId, bidId);
            const auth = await checkJwt();
            if(auth !== null){
                const response = await axios({
                    method: 'POST',
                    url : `${server.url}/api/contract` ,
                    data : {
                        order_id: orderId,
                        bidding_id: bidId,
                    },
                    headers : {Auth: auth},
                })
                //console.log(response);
                props.navigation.replace("ProgressScreen", {orderId: orderId, state: 3});
            }
        }
        catch{
            Alert.alert(
                '오류',
                'BidShop 오류',
                [
                    {text: 'OK', onPress: () => {}},
                ],
                { cancelable: false }
            );
        }
    }

    function _renderHeader (section, index, isActive) {
        return (
            <View style={{width: '100%', alignItems: 'center'}}>
                <ShopView>
                    <NameView> 
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{fontSize: 20}}>{section.companyName}</Text>
                            <Button mode={'outlined'} style={{marginLeft: 5}} color={Color.main} onPress={()=>{props.navigation.navigate("ShopScreen_1", {companyId: section.companyId, companyName: section.companyName});}}>홈페이지 방문</Button>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 3, alignItems: 'center'}}>
                            <Text style={{fontSize: 15, marginLeft: 3, color: 'gray'}}>{section.simpleRegion}</Text>
                            <MaterialIcons name={isActive?"expand-less": "expand-more"} size={20} color= 'black' style={{marginLeft: 5}}></MaterialIcons>
                        </View>
                    </NameView>
                    <View style={{width:'30%', alignItems: 'flex-end'}}>
                        <Text style={{fontSize: 15}}>{section.price.toLocaleString("ko-KR", { style: 'currency', currency: 'KRW' })}</Text>
                    </View>
                </ShopView>
            </View>
        );
    };

    const _renderContent = section => {
        return(
            <View style={{width: '100%', alignItems: 'center'}}>
                <DetailView>
                    <Text>{section.quote}</Text>
                    <Button mode={'contained'} color={Color.main} style={{alignSelf: 'flex-end'}} onPress={()=>{sendData(props.orderId, section.bidId)}}>선택하기</Button>
                </DetailView>
            </View>
        );
    };

    const _updateSections = activeSections => {
        setActiveSections(activeSections);
    };

    return(
        <Accordion
        sections={props.item}
        activeSections={activeSections}
        renderHeader={_renderHeader}
        renderContent={_renderContent}
        onChange={_updateSections}
        underlayColor='transparent'
        touchableComponent={TouchableOpacity}
        />
    );
}

export default BidShop;
