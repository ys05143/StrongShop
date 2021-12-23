import React from "react";
import styled from "styled-components/native";
import { Title, Button }  from 'react-native-paper';
import { View, Text } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import Row from '../components/Row';
import Color from "../constants/Color";

const InfoView = styled.View`
    width: 95%;
    border-radius: 10px;
    padding: 5px 10px;
    border: 3px solid gray;
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
    height: 60px;
    align-items: center;
`;
const RowCenter = styled.View`
    flex-direction: row;
    align-items: center;
`;

const styles = {
    receiptTitle:{
        fontSize: 18,
        fontWeight: 'bold',
    },
    receiptSubTitle:{
        fontSize: 15,
        marginLeft: 5,
    },
    receiptPrice:{
        fontSize: 18,
        fontWeight: 'bold'
    }
}

function FinalReceipt(props){
    const [isModal, setIsModal] = React.useState(props.isModal);
    const shopData = props.receipt;
    return(
        <View style={{alignItems: 'center'}}>
            <InfoView>
                <RowCenter>
                    <Icon name={'ellipse'} style={{marginRight: 5}}/>
                    <Title>시공내역</Title>
                </RowCenter>
                <Row style={{height: 30, justifyContent: 'space-between', alignItems: 'flex-end'}}>
                    <Row>
                        <Text style={{fontSize: 15}}>{"시 공"}</Text>
                        <Text style={{fontSize: 15, marginLeft: 20}}>{'상 품 명'}</Text>
                    </Row>
                    <Text style={{fontSize: 15}}>{'금  액'}</Text>
                </Row>
                <ReceiptMatrixLine/>
                {
                    shopData.tinting != null && (
                        <ReceiptItemView>
                            <RowCenter>
                                <Text style={styles.receiptTitle}>{"[틴팅]"}</Text>
                                <Text style={styles.receiptSubTitle}>{shopData.tinting}</Text>
                            </RowCenter>
                            <Text style={styles.receiptPrice}>{shopData.tintingPrice+' 만원'}</Text>
                        </ReceiptItemView>
                    )
                }
                {
                    shopData.ppf != null && (
                        <ReceiptItemView>
                            <RowCenter>
                                <Text style={styles.receiptTitle}>{"[PPF]"}</Text>
                                <Text style={styles.receiptSubTitle}>{shopData.ppf}</Text>
                            </RowCenter>
                            <Text style={styles.receiptPrice}>{shopData.ppfPrice+' 만원'}</Text>
                        </ReceiptItemView>
                    )
                }
                {
                    shopData.blackbox != null && (
                        <ReceiptItemView>
                            <RowCenter>
                                <Text style={styles.receiptTitle}>{"[블랙박스]"}</Text>
                                <Text style={styles.receiptSubTitle}>{shopData.blackbox}</Text>
                            </RowCenter>
                            <Text style={styles.receiptPrice}>{shopData.blackboxPrice+' 만원'}</Text>
                        </ReceiptItemView>
                    )
                }
                {
                    shopData.battery != null && (
                        <ReceiptItemView>
                            <RowCenter>
                                <Text style={styles.receiptTitle}>{"[보조배터리]"}</Text>
                                <Text style={styles.receiptSubTitle}>{shopData.battery}</Text>
                            </RowCenter>
                            <Text style={styles.receiptPrice}>{shopData.batteryPrice+' 만원'}</Text>
                        </ReceiptItemView>
                    )
                }
                {
                    shopData.afterblow != null && (
                        <ReceiptItemView>
                            <RowCenter>
                                <Text style={styles.receiptTitle}>{"[애프터블로우]"}</Text>
                                <Text style={styles.receiptSubTitle}>{shopData.afterblow}</Text>
                            </RowCenter>
                            <Text style={styles.receiptPrice}>{shopData.afterblowPrice+' 만원'}</Text>
                        </ReceiptItemView>
                    )
                }
                {
                    shopData.soundproof != null && (
                        <ReceiptItemView>
                            <RowCenter>
                                <Text style={styles.receiptTitle}>{"[방음]"}</Text>
                                <Text style={styles.receiptSubTitle}>{shopData.soundproof}</Text>
                            </RowCenter>
                            <Text style={styles.receiptPrice}>{shopData.soundproofPrice+' 만원'}</Text>
                        </ReceiptItemView>
                    )
                }
                {
                    shopData.wrapping != null && (
                        <ReceiptItemView>
                            <RowCenter>
                                <Text style={styles.receiptTitle}>{"[랩핑]"}</Text>
                                <Text style={styles.receiptSubTitle}>{shopData.wrapping}</Text>
                            </RowCenter>
                            <Text style={styles.receiptPrice}>{shopData.wrappingPrice+' 만원'}</Text>
                        </ReceiptItemView>
                    )
                }
                {
                    shopData.glasscoating != null && (
                        <ReceiptItemView>
                            <RowCenter>
                                <Text style={styles.receiptTitle}>{"[유리막코팅]"}</Text>
                                <Text style={styles.receiptSubTitle}>{shopData.glasscoating}</Text>
                            </RowCenter>
                            <Text style={styles.receiptPrice}>{shopData.glasscoatingPrice+' 만원'}</Text>
                        </ReceiptItemView>
                    )
                }
                {
                    shopData.undercoating != null && (
                        <ReceiptItemView>
                            <Row>
                                <Text style={styles.receiptTitle}>{"[언더코팅]"}</Text>
                                <Text style={styles.receiptSubTitle}>{shopData.undercoating}</Text>
                            </Row>
                            <Text style={styles.receiptPrice}>{shopData.undercoatingPrice+' 만원'}</Text>
                        </ReceiptItemView>
                    )
                }
                <ReceiptMatrixLine/>
                <Row style={{height: 60, justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={styles.receiptTitle}>{"최 종 가 격: "}</Text>
                    <Text style={styles.receiptPrice}>{shopData.totalPrice+' 만원'}</Text>
                </Row>
            </InfoView>
            {isModal && 
            <View style={{width: '100%', flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
                <Button mode="contained" contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main} onPress={()=>{props.getModal(false);}}>
                    <Text>이전</Text>
                </Button>
            </View>}
        </View>
    );
}

export default FinalReceipt;