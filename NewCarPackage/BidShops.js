import React from 'react';
import { Text, TouchableOpacity, View, Alert } from 'react-native';
import { Button, List, Divider, Title } from 'react-native-paper';
import styled from 'styled-components/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Accordion from 'react-native-collapsible/Accordion';
import Icon from "react-native-vector-icons/Ionicons";
import Row from '../components/Row';
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
    },
    receiptTitle:{
        fontSize: 15,
        fontWeight: 'bold',
    },
    receiptSubTitle:{
        fontSize: 13,
        marginLeft: 5,
    },
    receiptPrice:{
        fontSize: 15,
        fontWeight: 'bold'
    }
}
const RowCenter = styled.View`
    flex-direction: row;
    align-items: center;
`;
const ReceiptMatrixLine = styled.View`
    height: 1px;
    width: 100%;
    border-bottom-width: 1px;
    border-color: gray;
`;
const ReceiptItemView = styled.View`
    flex-direction: row;
    justify-content: space-between;
    height: 40px;
    align-items: center;
`;

const ShopView = styled.View`
    width: 95%;
    border-bottom-width: 1px;
    border-color: gray;
    align-items: flex-end;
    flex-direction: row;
    padding-bottom: 10px;
    padding-top: 10px;
`;
const ShopView2 = styled.View`
    width: 95%;
    align-items: flex-end;
    flex-direction: row;
    padding-bottom: 10px;
    padding-top: 10px;
`;
const NameView = styled.View`
    width: 70%;
`;
const NameView2 = styled.TouchableOpacity`
    height: 35px;
    flex-direction: row;
    margin-left: 10px;
    align-items: center;
`;
const PriceView = styled.View`
    height: 35px;
    flex-direction: row;
    margin-left: 10px;
    align-items: center;
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
                {/* <ShopView>
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
                </ShopView> */}
                {/* <ShopView2>
                    <TouchableOpacity style={{width: 70, height: 70, backgroundColor: 'lightgray', borderRadius: 15}} onPress={()=>{props.navigation.navigate("ShopScreen_1", {companyId: section.companyId});}}/> 
                    <View>
                        <NameView2 > 
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{fontSize: 20}}>{section.companyName}</Text>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 3, alignItems: 'center'}}>
                                <Text style={{fontSize: 15, marginLeft: 3, color: 'gray'}}>{section.simpleRegion}</Text>
                            </View>
                        </NameView2>
                        <PriceView>
                            <View style={{flex: 1, alignItems: 'center', flexDirection: 'row'}}>
                                <Text style={{fontSize: 15}}>{'최종 가격: '+section.price.toLocaleString("ko-KR", { style: 'currency', currency: 'KRW' })}</Text>
                            </View>
                        </PriceView>
                    </View>
                    
                </ShopView2> */}
                <Button mode={"outlined"} color={'gray'} icon={'clipboard-check-outline'} style={{width: '95%', height: 50, justifyContent: 'center'}} contentStyle={{width: '95%', height: 50,}}>상세 견적</Button>
            </View>
        );
    };

    const _renderContent = section => {
        const item = JSON.parse(section.quote);
        return(
            <View style={{width: '100%', alignItems: 'center'}}>
                {/* <DetailView>
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
                </DetailView> */}
                <DetailView>
                    <Row style={{height: 30, justifyContent: 'space-between', alignItems: 'flex-end'}}>
                        <Row>
                            <Text style={{fontSize: 13}}>{"시 공"}</Text>
                            <Text style={{fontSize: 13, marginLeft: 20}}>{'상 품 명'}</Text>
                        </Row>
                        <Text style={{fontSize: 13}}>{'금  액'}</Text>
                    </Row>
                    <ReceiptMatrixLine/>
                    {
                        item.tinting != null && (
                            <ReceiptItemView>
                                <RowCenter>
                                    <Text style={styles.receiptTitle}>{"[틴팅]"}</Text>
                                    <Text style={styles.receiptSubTitle}>{item.tinting}</Text>
                                </RowCenter>
                                <Text style={styles.receiptPrice}>{item.tintingPrice+' 만원'}</Text>
                            </ReceiptItemView>
                        )
                    }
                    {
                        item.ppf != null && (
                            <ReceiptItemView>
                                <RowCenter>
                                    <Text style={styles.receiptTitle}>{"[PPF]"}</Text>
                                    <Text style={styles.receiptSubTitle}>{item.ppf}</Text>
                                </RowCenter>
                                <Text style={styles.receiptPrice}>{item.ppfPrice+' 만원'}</Text>
                            </ReceiptItemView>
                        )
                    }
                    {
                        item.blackbox != null && (
                            <ReceiptItemView>
                                <RowCenter>
                                    <Text style={styles.receiptTitle}>{"[블랙박스]"}</Text>
                                    <Text style={styles.receiptSubTitle}>{item.blackbox}</Text>
                                </RowCenter>
                                <Text style={styles.receiptPrice}>{item.blackboxPrice+' 만원'}</Text>
                            </ReceiptItemView>
                        )
                    }
                    {
                        item.battery != null && (
                            <ReceiptItemView>
                                <RowCenter>
                                    <Text style={styles.receiptTitle}>{"[보조배터리]"}</Text>
                                    <Text style={styles.receiptSubTitle}>{item.battery}</Text>
                                </RowCenter>
                                <Text style={styles.receiptPrice}>{item.batteryPrice+' 만원'}</Text>
                            </ReceiptItemView>
                        )
                    }
                    {
                        item.afterblow != null && (
                            <ReceiptItemView>
                                <RowCenter>
                                    <Text style={styles.receiptTitle}>{"[애프터블로우]"}</Text>
                                    <Text style={styles.receiptSubTitle}>{item.afterblow}</Text>
                                </RowCenter>
                                <Text style={styles.receiptPrice}>{item.afterblowPrice+' 만원'}</Text>
                            </ReceiptItemView>
                        )
                    }
                    {
                        item.soundproof != null && (
                            <ReceiptItemView>
                                <RowCenter>
                                    <Text style={styles.receiptTitle}>{"[방음]"}</Text>
                                    <Text style={styles.receiptSubTitle}>{item.soundproof}</Text>
                                </RowCenter>
                                <Text style={styles.receiptPrice}>{item.soundproofPrice+' 만원'}</Text>
                            </ReceiptItemView>
                        )
                    }
                    {
                        item.wrapping != null && (
                            <ReceiptItemView>
                                <RowCenter>
                                    <Text style={styles.receiptTitle}>{"[랩핑]"}</Text>
                                    <Text style={styles.receiptSubTitle}>{item.wrapping}</Text>
                                </RowCenter>
                                <Text style={styles.receiptPrice}>{item.wrappingPrice+' 만원'}</Text>
                            </ReceiptItemView>
                        )
                    }
                    {
                        item.glasscoating != null && (
                            <ReceiptItemView>
                                <RowCenter>
                                    <Text style={styles.receiptTitle}>{"[유리막코팅]"}</Text>
                                    <Text style={styles.receiptSubTitle}>{item.glasscoating}</Text>
                                </RowCenter>
                                <Text style={styles.receiptPrice}>{item.glasscoatingPrice+' 만원'}</Text>
                            </ReceiptItemView>
                        )
                    }
                    {
                        item.undercoating != null && (
                            <ReceiptItemView>
                                <Row>
                                    <Text style={styles.receiptTitle}>{"[언더코팅]"}</Text>
                                    <Text style={styles.receiptSubTitle}>{item.undercoating}</Text>
                                </Row>
                                <Text style={styles.receiptPrice}>{item.undercoatingPrice+' 만원'}</Text>
                            </ReceiptItemView>
                        )
                    }
                    <ReceiptMatrixLine/>
                    <Row style={{height: 60, justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={styles.receiptTitle}>{"최 종 가 격: "}</Text>
                        <Text style={styles.receiptPrice}>{item.totalPrice+' 만원'}</Text>
                    </Row>
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
