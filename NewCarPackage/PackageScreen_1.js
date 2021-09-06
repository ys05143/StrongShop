import React from 'react';
import styled from 'styled-components';
import { Text, StyleSheet, View } from 'react-native';
import Swiper from 'react-native-swiper';
import Icon  from "react-native-vector-icons/Ionicons";
import { ifIphoneX } from "react-native-iphone-x-helper";
import { Button, Dialog, Portal, Paragraph, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';
//components
import Row from '../components/Row';
import Description from './Description';
import TotalView from '../components/TotalView';
//constants
import Color from '../constants/Color';
import ViewHeight from '../constants/ViewHeight';
import StatusBarHeight from '../constants/StatusBarHeight';
import AppWindow from '../constants/AppWindow';
//function
import fetch from '../function/fetch';
import store from '../function/store';

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;

const DescriptionView = styled.View`
    flex: 2;
`;
const ContentView = styled.View`
    flex: 3;
`;
const TopBar=styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`;
const ProcessView = styled.View`
    flex: 1;
    margin-top: 15px;;
`;
const BidView = styled.View`
    flex: 3;
    justify-content: center;
    align-items: center;
`;
const RegisterView = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;
const ProcessImg = styled.View`
    border-radius: 50px;
    border: 1px solid #ffffff;
    width: ${WIDTH*0.15}px;
    height: ${WIDTH*0.15}px;
`;
const ProcessText = styled.Text`
    font-size:${WIDTH*0.15*0.23}px;
    color: #ffffff;
`;
const ProcessTextView = styled.View`
    width: ${WIDTH*0.15}px;
    justify-content: center;
    align-items: center;
`;
const Arrow = styled.View`
    justify-content: center;
    align-items: center;
    margin-left: 5px;
    margin-right: 5px;
`;
const SingleProcess = styled.View`
    align-items: center;
    margin: 2px;
`;
const CurrentBid = styled.View`
    background-color: #e5e5e5;
    width: 90%;
    height: 80%;
    border-radius: 15px;
    padding: 5px;
`;
const Bid = styled.View`
    flex: 1;
    border-radius: 15px;
    background-color: #e5e5e5;
`;
const Register = styled.TouchableOpacity`
    width: 85%;
    height: 50%;
    background-color: #e5e5e5;
    border-radius: 5px;
    margin-bottom: 5px;
    justify-content: center;
    align-items: center;
`;
const Total = styled.View`
    width: ${WIDTH}px;
    height: ${ViewHeight()}px;
    background-color: white;
`;
const DescribeView = styled.View`
    flex: 1;
    width: 100%;
    height: 100%;
    padding: 15px;
    background-color: ${Color.main};
`;
//현재 입찰중인 차량 목록
const DATA = [{
    id: 1,
    carName: 'CARNIVAL',
    currentPrice: '1,500,000',
    remainTime: '23:59:58',
},{
    id: 2,
    carName: 'CARNIVAL',
    currentPrice: '1,500,000',
    remainTime: '23:59:58',
},{
    id: 3,
    carName: 'CARNIVAL',
    currentPrice: '1,500,000',
    remainTime: '23:59:58',
},{
    id: 4,
    carName: 'CARNIVAL',
    currentPrice: '1,500,000',
    remainTime: '23:59:58',
},{
    id: 5,
    carName: 'CARNIVAL',
    currentPrice: '1,500,000',
    remainTime: '23:59:58',
}]

function PackageScreen_1 (props) {
    const [existingDialog, setExistingDialog] = React.useState(false);
    const [currentOrder, setCurrentOrder] = React.useState(null);

    const hideDialog = () => setExistingDialog(false);

    async function CheckAsync(){
        await fetch('BidOrder')
        .then(res=>{
            if(res !== null){
                console.log('In page 1 has storage: ', res);
                setCurrentOrder(res);
                setExistingDialog(true);
            }
            else{
                props.navigation.navigate("PackageScreen_2");
                setExistingDialog(false);
            }
        })
        .catch(e=>{
            console.log(e);
        });
    }

    async function CancelExisting(){
        await AsyncStorage.removeItem('BidOrder', ()=>{
            props.navigation.navigate("PackageScreen_2");
            setExistingDialog(false);
        });
    }
    async function OKExisting(){
        if(currentOrder.processPage === 1){
            props.navigation.navigate("PackageScreen_2");
            setExistingDialog(false);
        }
        else if(currentOrder.processPage === 2){
            props.navigation.navigate("PackageScreen_3");
            setExistingDialog(false);
        }
        else if(currentOrder.processPage === 3){
            props.navigation.navigate("PackageScreen_4");
            setExistingDialog(false);
        }
    }
    return(
        <TotalView TotalView color={'white'} notchColor={'white'}>
            <PaperProvider>
            <DescriptionView>
                <Swiper autoplay={true} activeDotColor={'#000000'}>
                    <Description image={require('../resource/Temp.png')}>신차 패키지란?</Description>
                    <Description image={require('../resource/Temp.png')}>틴팅이란?</Description>
                    <Description image={require('../resource/Temp.png')}>유리막 코팅이란?</Description>
                    <DescribeView>
                        <ProcessView>
                            <Text style={{marginTop: 5, fontSize: 15, marginLeft: 5, color: 'white'}}>👉신차 패키지를 받는 과정👈</Text>
                            <Row style={{flexWrap:'wrap', marginLeft: 10, marginTop: 5}}>
                                <Row>
                                    <SingleProcess>
                                        <ProcessImg/>
                                        <ProcessTextView>
                                            <ProcessText>차량 등록</ProcessText>
                                        </ProcessTextView>
                                    </SingleProcess>
                                    <Arrow>
                                        <Icon name="chevron-forward-outline" size={25} color={'white'}></Icon>
                                    </Arrow>
                                </Row>
                                <Row>
                                    <SingleProcess>
                                        <ProcessImg/>
                                        <ProcessTextView>
                                            <ProcessText>시공 선택</ProcessText>
                                        </ProcessTextView>
                                    </SingleProcess>
                                    <Arrow>
                                        <Icon name="chevron-forward-outline" size={25} color={'white'}></Icon>
                                    </Arrow>
                                </Row>
                                <Row>
                                    <SingleProcess>
                                        <ProcessImg/>
                                        <ProcessTextView>
                                            <ProcessText>요구사항 작성</ProcessText>
                                        </ProcessTextView>
                                    </SingleProcess>
                                    <Arrow>
                                        <Icon name="chevron-forward-outline" size={25} color={'white'}></Icon>
                                    </Arrow>
                                </Row>
                                <Row>
                                    <SingleProcess>
                                        <ProcessImg/>
                                        <ProcessTextView>
                                            <ProcessText>입찰</ProcessText>
                                        </ProcessTextView>
                                    </SingleProcess>
                                    <Arrow>
                                        <Icon name="chevron-forward-outline" size={25} color={'white'}></Icon>
                                    </Arrow>
                                </Row>
                                <Row>
                                    <SingleProcess>
                                        <ProcessImg/>
                                        <ProcessTextView>
                                            <ProcessText>업체 선정 및 문의</ProcessText>
                                        </ProcessTextView>
                                    </SingleProcess>
                                    <Arrow>
                                        <Icon name="chevron-forward-outline" size={25} color={'white'}></Icon>
                                    </Arrow>
                                </Row>
                                <Row>
                                    <SingleProcess>
                                        <ProcessImg/>
                                        <ProcessTextView>
                                            <ProcessText>시공 시작</ProcessText>
                                        </ProcessTextView>
                                    </SingleProcess>
                                </Row>
                            </Row>
                        </ProcessView>
                    </DescribeView>
                </Swiper>
                <TopBar style={{position: 'absolute', marginTop: ifIphoneX()===true ? StatusBarHeight() : 5}}>
                    <Icon name="chevron-back-outline" size={35} color={'white'} onPress={()=>{ props.navigation.goBack() }}></Icon>
                </TopBar>
            </DescriptionView>
            <ContentView>
                <BidView>
                    <CurrentBid>
                        <Swiper activeDotColor={Color.main} paginationStyle={{
                        position: 'absolute',
                        top: '90%',
                        right: 0,
                        bottom: 0,
                        left: 0,
                        }}>
                            {_.map(DATA, (item)=>{
                                return(
                                    <Bid key={item.id}>
                                        <Row style={{flex: 3}}>
                                            <Text style={{marginVertical: 5, marginHorizontal: 10, fontSize: 17}}>입찰중인 차량:</Text>
                                            <Text style={{marginVertical: 5, fontWeight: 'bold', fontSize: 20 }} >{item.carName}</Text>
                                        </Row>
                                        <Row style={{flex: 4, justifyContent: 'center', alignItems: 'center'}}>
                                            <Text style={{fontSize: 30, color: 'blue'}}>{item.currentPrice}</Text>
                                            <Icon name="caret-down-outline" size={30} color={'blue'}></Icon>
                                        </Row>
                                        <Row style={{flex: 4,justifyContent: 'center', alignItems: 'center'}}>
                                            <Text style={{fontSize: 25}}>{item.remainTime}</Text>
                                        </Row>
                                    </Bid>
                                );
                            })}
                        </Swiper>
                    </CurrentBid>
                </BidView>
                <RegisterView>
                    <Register onPress={()=>{CheckAsync();}}>
                        <Text>차량 등록하기</Text>
                    </Register>
                </RegisterView>
            </ContentView>
            <Portal>
                <Dialog visible={existingDialog} onDismiss={hideDialog}>
                    <Dialog.Content>
                        <Paragraph>{'이전의 자료가 있습니다.\n이어서 하시겠습니까?'}</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button mode="outlined" onPress={() => {CancelExisting()}}>Cancel</Button>
                        <Button mode="outlined" onPress={() => {OKExisting()}}>Ok</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            </PaperProvider>
        </TotalView>
      
    );
}

export default PackageScreen_1;

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        
        elevation: 3,
    }
})