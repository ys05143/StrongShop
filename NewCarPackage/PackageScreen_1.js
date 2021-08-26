import React from 'react';
import styled from 'styled-components';
import { Text, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import Icon  from "react-native-vector-icons/Ionicons";
import { ifIphoneX } from "react-native-iphone-x-helper";
import { Button, Dialog, Portal, Paragraph, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
//components
import Row from '../components/Row';
import AppWindow from '../constants/AppWindow';
import Description from '../components/Description';
import ViewHeight from '../constants/ViewHeight';
import StatusBarHeight from '../constants/StatusBarHeight';
import TotalView from '../components/TotalView';
//constants
import Color from '../constants/Color';
//function
import fetch from '../function/fetch';
import store from '../function/store';

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;

const DescriptionView = styled.View`
    flex: 4;
    border: 1px solid #ff0000;
`;
const ContentView = styled.View`
    flex: 6;
    border: 1px solid #00ff00;
`;
const TopBar=styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`;
const ProcessView = styled.View`
    flex: 4.5;
    padding : 5px;
    border: 1px solid #0000ff;
`;
const BidView = styled.View`
    flex: 3;
    justify-content: center;
    align-items: center;
    border: 1px solid #0000ff;
`;
const RegisterView = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    border: 1px solid #0000ff;
`;
const ProcessImg = styled.View`
    border-radius: 50px;
    border: 1px solid #000000;
    width: ${WIDTH*0.15}px;
    height: ${WIDTH*0.15}px;
`;
const ProcessText = styled.Text`
    font-size:${WIDTH*0.15*0.23}px;
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
const CurrentBid = styled.TouchableOpacity`
    background-color: #e5e5e5;
    width: 95%;
    flex: 1;
    border-radius: 15px;
    margin: 5px;
`;
const Register = styled.TouchableOpacity`
    flex: 1;
    width: 85%;
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

function PackageScreen_1 (props) {
    const [existingDialog, setExistingDialog] = React.useState(false);
    const [currentOrder, setCurrentOrder] = React.useState(null);

    const hideDialog = () => setExistingDialog(false);

    async function CheckAsync(){
        await fetch('BidOrder')
        .then(res=>{
            if(res !== null){
                setCurrentOrder(res);
                setExistingDialog(true);
            }
            else{
                props.navigation.navigate("PackageScreen_2");
            }
        })
        .catch(e=>{
            console.log(e);
        });
    }

    async function CancelExisting(){
        await AsyncStorage.removeItem('BidOrder', ()=>{
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
                </Swiper>
                <TopBar style={{position: 'absolute', marginTop: ifIphoneX()===true ? StatusBarHeight() : 5}}>
                    <Icon name="chevron-back-outline" size={35} color={'white'} onPress={()=>{ props.navigation.goBack() }}></Icon>
                </TopBar>
            </DescriptionView>
            <ContentView>
                <ProcessView>
                    <Text style={{marginTop: 5, fontSize: 15, marginLeft: 5}}>👉신차 패키지를 받는 과정👈</Text>
                    <Row style={{flexWrap:'wrap', marginLeft: 10, marginTop: 5}}>
                        <Row>
                            <SingleProcess>
                                <ProcessImg/>
                                <ProcessTextView>
                                    <ProcessText>차량 등록</ProcessText>
                                </ProcessTextView>
                            </SingleProcess>
                            <Arrow>
                                <Icon name="chevron-forward-outline" size={25} color={'black'}></Icon>
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
                                <Icon name="chevron-forward-outline" size={25} color={'black'}></Icon>
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
                                <Icon name="chevron-forward-outline" size={25} color={'black'}></Icon>
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
                                <Icon name="chevron-forward-outline" size={25} color={'black'}></Icon>
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
                                <Icon name="chevron-forward-outline" size={25} color={'black'}></Icon>
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
                <BidView>
                    <CurrentBid>
                        <Row style={{flex: 1.5}}>
                            <Text style={{marginVertical: 5, marginHorizontal: 10, fontSize: 15}}>입찰중인 차량:</Text>
                            <Text style={{marginVertical: 5, fontWeight: 'bold', fontSize: 15 }} >CARNIVAL</Text>
                        </Row>
                        <Row style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 30, color: 'red'}}>1,500,000 </Text>
                            <Icon name="triangle" size={20} color={'red'}></Icon>
                        </Row>
                        <Row style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 25}}>23:59:58</Text>
                        </Row>
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