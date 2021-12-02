import React from 'react';
import { Text, TouchableOpacity, View, Alert } from 'react-native';
import { Button, List, Divider } from 'react-native-paper';
import styled from 'styled-components/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Accordion from 'react-native-collapsible/Accordion';
//constants
import Color from '../constants/Color';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';
import checkErrorCode from '../function/checkErrorCode';

const styles = {
    listAccordionStyle : {
        backgroundColor: 'white' ,
        borderTopWidth: 1 ,
        borderTopColor: 'lightgray'        
    } ,
    listStyle1 : {
        fontSize: 17 , 
        fontWeight: 'bold'
    } ,
    listStyle : {
        fontWeight: 'bold',
        fontSize: 15 , 
    } ,
    itemText: {
        fontSize: 15 ,
        fontWeight: 'bold' ,
        alignSelf: 'center'
    } ,
    labelStyle : {
        borderWidth: 1 , 
        borderColor: 'lightgray' 
    }
}

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
    padding: 5px 5px 10px 5px;
    margin-bottom: 5px;
    background-color: 'rgb(246,246,246)';
`;

function BidShop(props, {navigation}) {
    //for acodian
    const [activeSections, setActiveSections] = React.useState([]);
    const [isSending, setIsSending] = React.useState(false)
;
    async function sendData(orderId, bidId){
        try{
            props.getSending(true);
            setIsSending(true);
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
                .catch(e=>{
                    checkErrorCode(e, props.navigation);
                })
                //console.log(response);
                props.navigation.replace("ProgressScreen", {orderId: orderId, state: 3});
                props.getSending(false);
            }
        }
        catch{
            Alert.alert(
                '오류',
                '다시 시도해주세요.',
                [
                    {text: '확인', onPress: () => {}},
                ],
                { cancelable: false }
            );
        }
    }

    function finalCheck(orderId, bidId){
        Alert.alert(
            '확인',
            '이 업체로 선택하시겠습니까?',
            [
                {text: '예', onPress: async () => {
                    sendData(orderId, bidId);
                }},
                {text: '아니요', onPress: () => {
                     props.getSending(false);
                    }},
            ],
            { cancelable: false }
        );
    }

    function _renderHeader (section, index, isActive) {
        return (
            <View style={{width: '100%', alignItems: 'center'}}>
                <ShopView>
                    <NameView> 
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{fontSize: 20}}>{section.companyName}</Text>
                            <Button mode={'outlined'} style={{marginLeft: 5}} color={Color.main} onPress={()=>{props.navigation.navigate("ShopScreen_1", {companyId: section.companyId});}}>홈페이지 방문</Button>
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
        const item = JSON.parse(section.quote);
        return(
            <View style={{width: '100%', alignItems: 'center'}}>
                <DetailView>
                    {
                        item.tinting != null && (
                            <>
                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='틴팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                <List.Item titleStyle={styles.listStyle} title ={item.tinting} right={ props => <Text style={styles.itemText}>{item.tintingPrice}{'만원'}</Text>} />
                            </>
                        )
                    }
                    {
                        item.ppf != null && (
                            <>
                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='PPF' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                <List.Item titleStyle={styles.listStyle} title ={item.ppf} right={props => <Text style={styles.itemText}>{item.ppfPrice}{' 만원'}</Text>} />
                            </>
                        )
                    }
                    {
                        item.blackbox != null && (
                            <>
                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='블랙박스' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                <List.Item titleStyle={styles.listStyle} title ={item.blackbox} right={props => <Text style={styles.itemText}>{item.blackboxPrice}{' 만원'}</Text>} />
                            </>
                        )
                    }
                    {
                        item.battery != null && (
                            <>
                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='보조배터리' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                <List.Item titleStyle={styles.listStyle} title ={item.battery} right={props => <Text style={styles.itemText}>{item.batteryPrice}{' 만원'}</Text>} />
                            </>
                        )
                    }
                    {
                        item.afterblow != null && (
                            <>
                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='애프터블로우' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                <List.Item titleStyle={styles.listStyle} title ={item.afterblow} right={props => <Text style={styles.itemText}>{item.afterblowPrice}{' 만원'}</Text>} />
                            </>
                        )
                    }
                    {
                        item.soundproof != null && (
                            <>
                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='방음' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                <List.Item titleStyle={styles.listStyle} title ={item.soundproof} right={props => <Text style={styles.itemText}>{item.soundproofPrice}{' 만원'}</Text>} />
                            </>
                        )
                    }
                    {
                        item.wrapping != null && (
                            <>
                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='랩핑' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                <List.Item titleStyle={styles.listStyle} title ={item.wrapping} right={props => <Text style={styles.itemText}>{item.wrappingPrice}{' 만원'}</Text>} />
                            </>
                        )
                    }
                    {
                        item.glasscoating != null && (
                            <>
                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='유리막코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                <List.Item titleStyle={styles.listStyle} title ={item.glasscoating} right={props => <Text style={styles.itemText}>{item.glasscoatingPrice}{' 만원'}</Text>} />
                            </>
                        )
                    }
                    {
                        item.undercoating != null && (
                            <>
                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='언더코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                <List.Item titleStyle={styles.listStyle} title ={item.undercoating} right={props => <Text style={styles.itemText}>{item.undercoatingPrice}{' 만원'}</Text>} />
                            </>
                        )
                    }
                    <List.Item titleStyle={styles.listStyle} title ='최종가격: ' right={props => <Text style={styles.itemText}>{item.totalPrice}{' 만원'}</Text>}/>
                    <Divider style={{ margin: 10 , backgroundColor: 'black'}} />
                    <Button mode={'contained'} disabled={isSending} color={Color.main} style={{alignSelf: 'flex-end'}} onPress={()=>{finalCheck(props.orderId, section.bidId)}}>{isSending? '입찰등록중...':'선택하기' }</Button>
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
