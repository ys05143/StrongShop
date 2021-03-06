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
    //????????? ?????? ?????? ?????? start ????????????
    const [ReceiptModal, setReceiptModal] = React.useState(false);
    const [displayRegion, setDisplayRegion] = React.useState('??????');
    const [regionModal, setRegionModal] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    //useEffect ????????? async ?????? ?????? ?????? promise then catch ????????? ?????? ???????????????.
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
                Alert.alert( //async??? ????????? ??? ?????? ??? ???????????? ??? ?????? ?????????.
                    '??????',
                    '????????? ??????????????????.',
                    [
                      {text: '??????', onPress: () => {cancelRequire();}},
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
                        '??????',
                        '????????? ??????????????????.',
                        [
                          {text: '??????', onPress: () => {cancelRequire();}},
                        ],
                        { cancelable: false }
                      );
                })
            }
            else{ 
                Alert.alert(
                    '??????',
                    '?????? ????????? ???????????? ???????????????.',
                    [
                      {text: '??????', onPress: () => {cancelRequire();}},
                    ],
                    { cancelable: false }
                  );
            }
        }
        catch(error){
            Alert.alert(
                '??????',
                '????????? ??????????????????.',
                [
                    {text: '??????', onPress: () => {cancelRequire();}},
                ],
                { cancelable: false }
            );
        }
    }

    function cancelRequire(){
        //?????? ????????? ?????? ??? ??? ??????
        setText(null);
        setDisplayRegion(null);
        props.navigation.navigate("MainPage");
    }

    function askCancelRequire(){
        Alert.alert(
            '????????? ??????????????????????',
            '?????? ???????????? ????????? ????????? ???????????? ????????????.',
            [
              {text: '??????', onPress: () => {}},
              {text: '??????', onPress: () => {
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
                    <MainText>???????????? </MainText>
                    <MainText style={{color: 'white'}}>??????????????? </MainText>
                </Row>
                <MainText>????????? ?????????</MainText>
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
        <Background topbox={<Top/>} androidKeyboardAware={Platform.OS === 'android'}>
            <View style={{width: '100%', alignItems: 'center', flex: 1}}>
                <KeyboardAwareScrollView style={{width: WIDTH, paddingTop: 10}} contentContainerStyle={{alignItems: 'center', flex: 1}} extraHeight={250}>
                    <View style={{width: '95%', alignItems: 'flex-end'}}>
                        {text !==null && <NotoSansText style={{marginBottom: 5, color: '#2871CC'}}>{text.length+'/400'}</NotoSansText>}
                    </View>
                    <Input multiline={true}
                            style={{textAlignVertical:'top', fontFamily: 'NotoSansKR-Medium'}}//only for android
                            value={text}
                            onChangeText={value=>{setText(value);}}
                            placeholder={"???) ????????? 0??? 0?????? ????????? ??????????????? ???????????????."}
                            placeholderTextColor="gray"
                            maxLength={400}/>
                
                    <RegionView>
                        <View style={{alignItems: 'center'}}>
                            <RegionTitle>
                                <Icon name={'ellipse'} style={{marginRight: 5}} size={10}/>
                                <JuaText style={{fontSize: 23}}>{'????????? ??????????????????.'}</JuaText>
                            </RegionTitle>
                        </View>
                        <PickerView onPress={()=>{setRegionModal(true)}}>
                            <NotoSansText style={{fontSize: 20}}>{displayRegion}</NotoSansText>
                        </PickerView>
                    </RegionView>
                </KeyboardAwareScrollView>
            </View>
            <BtnView>
                <CustButton onPress={()=>{props.navigation.navigate("NcpPage_2");}}>??????</CustButton>
                <CustButton onPress={()=>{storeRequire();}}>??????</CustButton>
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
                            <Text>??????</Text>
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