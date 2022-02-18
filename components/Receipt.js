import React from "react";
import styled from "styled-components/native";
import { View, Text } from 'react-native';
import Row from "./Row";

const styles = {
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
    width: 100%;
`;

const DetailView = styled.View`
    width: 95%;
    padding: 5px 5px 10px 5px;
    margin-bottom: 5px;
    background-color: 'rgb(246,246,246)';
`;

function Receipt(props){
    const item = props.item;
    return(
        <View style={{width: '100%', alignItems: 'center'}}>
            <Row style={{width: '100%', height: 30, justifyContent: 'space-between', alignItems: 'flex-end'}}>
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
                item.bottomcoating != null && (
                    <ReceiptItemView>
                        <Row>
                            <Text style={styles.receiptTitle}>{"[하부코팅]"}</Text>
                            <Text style={styles.receiptSubTitle}>{item.bottomcoating}</Text>
                        </Row>
                        <Text style={styles.receiptPrice}>{item.bottomcoatingPrice+' 만원'}</Text>
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
            <ReceiptMatrixLine/>
            <Row style={{width: '100%', height: 60, justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={styles.receiptTitle}>{"최 종 가 격: "}</Text>
                <Text style={styles.receiptPrice}>{item.totalPrice+' 만원'}</Text>
            </Row>
        </View>
    )
}

export default Receipt;