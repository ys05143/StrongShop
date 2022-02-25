import React from 'react';
import styled from 'styled-components/native';
import { Text, View, ActivityIndicator, Alert, Modal, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import Icon  from "react-native-vector-icons/Ionicons";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';
//components
import TotalView from '../components/TotalView';
import Row from '../components/Row';
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
const sendingColor = 'rgba(0, 0, 0, 0.3)';
///////////////////////////////
const IntroView = styled.View`
    width: 95%;
    align-items: center;
    padding-bottom: 5px;
    flex-direction: row;
`;
const IntroText = styled.Text`
    font-size: 20px;
    font-weight: bold;
`;
const ContentView = styled.View`
    flex: 1;
    justify-content: center;
    align-items : center;
`;
const BtnView = styled.View`
    width: 100%;
    height: 80px;
`;
///////////////////////////////////
const Input = styled.TextInput`
    width: 95%;
    flex: 1;
    background-color: #e5e5e5;
    border-radius: 10px;
    color: #000000;
    padding: 10px;
`;
const RegionView = styled.View`
    width: 95%;
    margin-top: 20px;
`;
const PickerView = styled.TouchableOpacity`
    border: 1px;
    border-radius: 5px;
    margin-top: 5px;
    height: 50px;
    justify-content: center;
    align-items: center;
`;
const PickItem = styled.TouchableOpacity`
    border-bottom-width: 1px;
    width: 95%;
    height: 60px;
    justify-content: center;
    align-items: center;
    border-color: gray;
`;

function PackageScreen_4(props){
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
            // const check = await storage.fetch('BidOrder');
            // if(check !== null){
            //     //console.log(check);
            //     setReceiptModal(true);
            // }
            // else{
            //     Alert.alert(
            //         '오류',
            //         '오류가 발생했습니다.',
            //         [
            //           {text: '확인', onPress: () => {cancelRequire();}},
            //         ],
            //         { cancelable: false }
            //       );
            // }
            //console.log('In page 4 check: ', check);
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
        props.navigation.navigate("MainScreen");
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
                props.navigation.navigate("MainScreen");
              }},
            ],
            { cancelable: true }
        );
    }

    function getReceiptModal(close){
        setReceiptModal(close);
    }

    return(
        <>
        {Platform.OS === 'ios' ? 
        <TotalView color={'white'} notchColor={'white'} homeIndicatorColor={'white'}>
            <View style={{width: '100%', alignItems: 'flex-end', paddingTop: 5, paddingRight: 5}}>
                <TouchableOpacity onPress={()=>{askCancelRequire();}}>
                    <Icon name="close-outline" size={35} color={'black'}></Icon>
                </TouchableOpacity>    
            </View>
            <KeyboardAwareScrollView style={{backgroundColor: 'white'}}>
            <View style={{alignItems: 'center'}}>
                <IntroView>
                    <Icon name={'ellipse'} style={{marginRight: 5}} size={10}/>
                    <IntroText>{'추가적인 요구사항을 입력해주세요.'}</IntroText>
                </IntroView>
            </View>
            <ContentView>
                {!isLoading ? 
                <>
                    <View style={{width: '95%', alignItems: 'flex-end'}}>
                    {text !==null && <Text style={{marginBottom: 5}}>{text.length+'/400'}</Text>}
                    </View>
                    <Input multiline={true}
                            style={{textAlignVertical:'top'}}//only for android
                            value={text}
                            onChangeText={value=>{setText(value);}}
                            placeholder={"예) 반드시 0월 0일에 시공을 시작했으면 좋겠습니다."}
                            placeholderTextColor="gray"
                            maxLength={400}/>
                    <RegionView>
                        <View style={{alignItems: 'center'}}>
                            <IntroView>
                                <Icon name={'ellipse'} style={{marginRight: 5}} size={10}/>
                                <IntroText>{'지역을 선택해주세요.'}</IntroText>
                            </IntroView>
                        </View>
                        <PickerView onPress={()=>{setRegionModal(true)}}>
                            <Text style={{fontWeight: 'bold'}}>{displayRegion}</Text>
                        </PickerView>
                    </RegionView>
                </> 
                : <ActivityIndicator size = 'large' color= {Color.main}/>}
            </ContentView>
            </KeyboardAwareScrollView>
            <BtnView>
                <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                    <Button mode={"contained"} onPress={() => {props.navigation.navigate("PackageScreen_3");}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main}>이전</Button>
                    <Button mode={"contained"} onPress={() => {storeRequire();}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main}>완료</Button>
                </Row>
            </BtnView>
        </TotalView>:
        <KeyboardAwareScrollView style={{backgroundColor: 'white'}}>
        <TotalView color={'white'} notchColor={'white'} homeIndicatorColor={'white'}>
            <View style={{width: '100%', alignItems: 'flex-end', paddingTop: 5, paddingRight: 5}}>
                <TouchableOpacity onPress={()=>{askCancelRequire();}}>
                    <Icon name="close-outline" size={35} color={'black'}></Icon>
                </TouchableOpacity>    
            </View>
            <View style={{alignItems: 'center'}}>
                <IntroView>
                    <Icon name={'ellipse'} style={{marginRight: 5}} size={10}/>
                    <IntroText>{'추가적인 요구사항을 입력해주세요.'}</IntroText>
                </IntroView>
            </View>
            <ContentView>
                {!isLoading ? 
                <>
                    <View style={{width: '95%', alignItems: 'flex-end'}}>
                       {text !==null && <Text style={{marginBottom: 5}}>{text.length+'/400'}</Text>}
                    </View>
                    <Input multiline={true}
                            style={{textAlignVertical:'top'}}//only for android
                            value={text}
                            onChangeText={value=>{setText(value);}}
                            placeholder={"예) 반드시 0월 0일에 시공을 시작했으면 좋겠습니다."}
                            placeholderTextColor="gray"
                            maxLength={400}/>
                    <RegionView>
                        <View style={{alignItems: 'center'}}>
                            <IntroView>
                                <Icon name={'ellipse'} style={{marginRight: 5}} size={10}/>
                                <IntroText>{'지역을 선택해주세요.'}</IntroText>
                            </IntroView>
                        </View>
                        <PickerView onPress={()=>{setRegionModal(true)}}>
                            <Text style={{fontWeight: 'bold'}}>{displayRegion}</Text>
                        </PickerView>
                    </RegionView>
                </> 
                : <ActivityIndicator size = 'large' color= {Color.main}/>}
            </ContentView>
            <BtnView>
                <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                    <Button mode={"contained"} onPress={() => {props.navigation.navigate("PackageScreen_3");}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main}>이전</Button>
                    <Button mode={"contained"} onPress={() => {storeRequire();}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main}>완료</Button>
                </Row>
            </BtnView>
        </TotalView>
        </KeyboardAwareScrollView>
        }

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

        <Modal
            animationType="slide"
            transparent={true}
            visible={regionModal}
            onRequestClose={() => {setRegionModal(!regionModal);}}
        >
            <ModalView>
                <View style={{width: '90%', height: 400, backgroundColor: 'white'}}>
                    <ScrollView contentContainerStyle={{alignItems: 'center'}}
                                persistentScrollbar={true}
                                showsVerticalScrollIndicator={true}>
                        {_.map(KorRegion, (item)=>{
                            return(
                                <PickItem key={item} onPress={()=>{setDisplayRegion(item); setRegionModal(false);}}>
                                    <Text style={{fontWeight: 'bold'}}>{item}</Text>
                                </PickItem>
                            )
                        })}
                    </ScrollView>
                    <View style={{height: 70, justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{width: 100}}>
                            <Button mode="contained" contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main} onPress={()=>{setRegionModal(false);}}>
                                <Text>완료</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </ModalView>
        </Modal>
    </>
    );
}

export default PackageScreen_4;