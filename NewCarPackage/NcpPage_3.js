import React from "react";
import styled from "styled-components/native";
import { Text, View, ActivityIndicator, Alert, Modal, ScrollView, TouchableOpacity, Platform, TextInput } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Icon  from "react-native-vector-icons/Ionicons";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';
//components
import Background from "../components/Background";
import { MainText, MenuTitleText, MenuContentText, JuaText, NotoSansText } from "../components/TextStyle";
import Row from '../components/Row';
import TopBox from "../components/TopBox";
import BtnView from "../components/BtnView";
import CustButton from "../components/CustButton";
import ModalView from '../components/ModalView';
import FinalOrder from './FinalOrder';
//constants
import AppWindow from '../constants/AppWindow';
import Color from '../constants/Color';
import { KorRegion } from '../constants/LIST';
//function
import storage from '../function/storage';

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;
const New_total = AppWindow.New_total;

const RegionTitle = styled.View`
    width: 95%;
    align-items: center;
    padding-bottom: 5px;
    flex-direction: row;
    justify-content: center;
`;
///////////////////////////////////
const Input = styled.TextInput`
    background-color: ${Color.menuBackgrund};
    border-radius: 5px;
    border: 2px;
    border-color: ${Color.menuBorder};
    padding: 10px;
    width: ${WIDTH*0.95}px;
    height: ${New_total*0.45}px;
`;
const RegionView = styled.View`
    width: 95%;
    margin-top: 10px;
`;
const PickerView = styled.TouchableOpacity`
    background-color: ${Color.menuBackgrund};
    border-radius: 5px;
    border: 2px;
    border-color: ${Color.menuBorder};
    margin-top: 5px;
    height: 50px;
    justify-content: center;
    align-items: center;
`;
const PickItem = styled.TouchableOpacity`
    border-bottom-width: 1px;
    border-color: ${Color.menuTitleBorder};
    width: 95%;
    height: 55px;
    justify-content: center;
    align-items: center;
    border-color: gray;
`;
const ModalBox = styled.View`
    width: 95%;
    height: 430px;
    background-color: ${Color.menuBackgrund};
    border-radius: 5px;
`;

function NcpPage_3(props){

    const [text, setText] = React.useState('');
    //서버와 통신 전에 항상 start 조작하기
    const [ReceiptModal, setReceiptModal] = React.useState(false);
    const [displayRegion, setDisplayRegion] = React.useState('서울');
    const [regionModal, setRegionModal] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    //useEffect 내에서 async 추천 하지 않음 promise then catch 형태로 추후 수정해야함.
    React.useEffect( ()=>{
        setIsLoading(true);
        storage.fetch('BidOrder')
        .then(response=>{
            if(response !== null){
                console.log('In page 4 useEffect: ', response);
                if(response.require !== null){
                    setText(response.require);
                }
                if(response.region !== null){
                    setDisplayRegion(response.region);
                }
            }
            else{
                Alert.alert( //async에 저장된 것 없이 이 단계까지 온 것은 오류다.
                    '오류',
                    '오류가 발생했습니다.',
                    [
                      {text: '확인', onPress: () => {cancelRequire();}},
                    ],
                    { cancelable: false }
                  );
            }
            setIsLoading(false);
        })
        .catch(e=>{
            console.log(e);
        });
    },[]);


    async function storeRequire(){
        try{
            let newOrder;
            const response = await storage.fetch('BidOrder');
            if(response !== null){
                newOrder = {...response};
                newOrder.processPage = 3;
                newOrder.require = text !==null ? text : null;
                newOrder.region = displayRegion;
                await storage.store('BidOrder', newOrder)
                .then(res => {
                    setReceiptModal(true);
                })
                .catch(e=>{
                    Alert.alert(
                        '오류',
                        '오류가 발생했습니다.',
                        [
                          {text: '확인', onPress: () => {cancelRequire();}},
                        ],
                        { cancelable: false }
                      );
                })
            }
            else{ 
                Alert.alert(
                    '오류',
                    '주문 정보를 저장하지 못했습니다.',
                    [
                      {text: '확인', onPress: () => {cancelRequire();}},
                    ],
                    { cancelable: false }
                  );
            }
        }
        catch(error){
            Alert.alert(
                '오류',
                '오류가 발생했습니다.',
                [
                    {text: '확인', onPress: () => {cancelRequire();}},
                ],
                { cancelable: false }
            );
        }
    }

    function cancelRequire(){
        //지금 까지의 입력 싹 다 취소
        setText(null);
        setDisplayRegion(null);
        props.navigation.navigate("MainPage");
    }

    function askCancelRequire(){
        Alert.alert(
            '입력을 중단하겠습니까?',
            '현재 페이지에 입력된 내용은 저장되지 않습니다.',
            [
              {text: '취소', onPress: () => {}},
              {text: '확인', onPress: () => {
                setText(null);
                setDisplayRegion(null);
                props.navigation.navigate("MainPage");
              }},
            ],
            { cancelable: true }
        );
    }

    function getReceiptModal(close){
        setReceiptModal(close);
    }

    const Top = ()=>{
        return(
            <TopBox topbar={<TopBar/>}>
                <Row>
                    <MainText>추가적인 </MainText>
                    <MainText style={{color: 'white'}}>요구사항을 </MainText>
                </Row>
                <MainText>입력해 주세요</MainText>
            </TopBox>
        )
    }

    const TopBar = () => {
        return(
            <View style={{width: '100%', height: '100%', paddingRight: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                <TouchableOpacity style={{padding: 5, marginLeft: 15}} onPress={()=>{askCancelRequire();}}>
                    <Icon name="close" size={23} color={Color.mainText}></Icon>
                </TouchableOpacity>
            </View>
        )
    }

    return(
        <>
        <Background topbox={<Top/>}>
            <View style={{width: '100%', alignItems: 'center', flex: 1}}>
                <KeyboardAwareScrollView style={{width: WIDTH, paddingTop: 10}} contentContainerStyle={{alignItems: 'center', flex: 1}} extraHeight={250}>
                    <View style={{width: '95%', alignItems: 'flex-end'}}>
                        {text !==null && <NotoSansText style={{marginBottom: 5, color: '#2871CC'}}>{text.length+'/400'}</NotoSansText>}
                    </View>
                    <Input multiline={true}
                            style={{textAlignVertical:'top', fontFamily: 'NotoSansKR-Medium'}}//only for android
                            value={text}
                            onChangeText={value=>{setText(value);}}
                            placeholder={"예) 반드시 0월 0일에 시공을 시작했으면 좋겠습니다."}
                            placeholderTextColor="gray"
                            maxLength={400}/>
                
                    <RegionView>
                        <View style={{alignItems: 'center'}}>
                            <RegionTitle>
                                <Icon name={'ellipse'} style={{marginRight: 5}} size={10}/>
                                <JuaText style={{fontSize: 23}}>{'지역을 선택해주세요.'}</JuaText>
                            </RegionTitle>
                        </View>
                        <PickerView onPress={()=>{setRegionModal(true)}}>
                            <NotoSansText style={{fontSize: 20}}>{displayRegion}</NotoSansText>
                        </PickerView>
                    </RegionView>
                </KeyboardAwareScrollView>
            </View>
            <BtnView>
                <CustButton onPress={()=>{props.navigation.navigate("NcpPage_2");}}>이전</CustButton>
                <CustButton onPress={()=>{storeRequire();}}>완료</CustButton>
            </BtnView>
        </Background>

        <Modal
        animationType="slide"
        transparent={true}
        visible={regionModal}
        onRequestClose={() => {setRegionModal(!regionModal);}}
        >
        <ModalView>
            <ModalBox>
                <ScrollView contentContainerStyle={{alignItems: 'center'}}
                            persistentScrollbar={true}
                            showsVerticalScrollIndicator={true}>
                    {_.map(KorRegion, (item)=>{
                        return(
                            <PickItem key={item} onPress={()=>{setDisplayRegion(item); setRegionModal(false);}}>
                                <NotoSansText style={{fontSize: 20}}>{item}</NotoSansText>
                            </PickItem>
                        )
                    })}
                </ScrollView>
                <View style={{height: 70, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{width: 100}}>
                        <CustButton onPress={()=>{setRegionModal(false);}}>
                            <Text>완료</Text>
                        </CustButton>
                    </View>
                </View>
            </ModalBox>
        </ModalView>
        </Modal>

        <Modal
            animationType="slide"
            transparent={true}
            visible={ReceiptModal}
            onRequestClose={() => {setReceiptModal(!ReceiptModal);}}
        >
            <ModalView>
                <View style={{width: '90%'}}>
                    <FinalOrder getModal={getReceiptModal} navigation={props.navigation}/>
                </View>
            </ModalView>
        </Modal>
        </>
    )
}

export default NcpPage_3;