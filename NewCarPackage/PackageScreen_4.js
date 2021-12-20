import React from 'react';
import styled from 'styled-components/native';
import { Text, View, ActivityIndicator, Alert, Modal, ScrollView, TouchableOpacity } from 'react-native';
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
import Receipt from './Receipt';
//constants
import AppWindow from '../constants/AppWindow';
import Color from '../constants/Color'
//function
import storage from '../function/storage';

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;
const sendingColor = 'rgba(0, 0, 0, 0.5)';
///////////////////////////////
const IntroView = styled.View`
    flex: 2;
    justify-content: center;
    align-items: center;
    padding: 5px;
`;
const Intro = styled.View`
    width: 90%;
    height: 100%;
    justify-content: center;
`;
const ContentView = styled.View`
    flex: 5;
    align-items : center;
    justify-content: space-between;
`;
const IntroText = styled.Text`
    font-size: 35px;
    font-family: 'NotoSansKR-Bold';
`;
const BtnView = styled.View`
    width: 100%;
    height: 80px;
`;
const Btn = styled.TouchableOpacity`
    border-radius: 50px;
    background-color: #B2EBF4;
    width: 120px;
    height: 60px;
    align-items : center;
    justify-content: center;
`;
///////////////////////////////////
const InputView = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
    justify-content: center;
`;
const Input = styled.TextInput`
    width: 95%;
    flex: 2;
    background-color: #e5e5e5;
    border-radius: 10px;
    color: #000000;
    padding: 10px;
`;
const RegionView = styled.View`
    width: 95%;
    flex: 1;
    margin-top: 20px;
`;
const PickerView = styled.TouchableOpacity`
    border: 1px;
    border-radius: 1px;
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

const REGION =[
    {
        value: '서울',
        key: 'seoul',
    },{
        value: '인천',
        key: 'incheon',
    },{
        value: '대전',
        key: 'daejeon',
    },{
        value: '대구',
        key: 'daegu',
    },{
        value: '부산',
        key: 'busan',
    },{
        value: '광주',
        key: 'gwangju',
    },{
        value: '제주',
        key: 'jeju',
    },];
function PackageScreen_4(props){
    const [text, setText] = React.useState('');
    //서버와 통신 전에 항상 start 조작하기
    const [ReceiptModal, setReceiptModal] = React.useState(false);
    const [selectedRegion, setSelectedRegion] = React.useState('seoul');
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
                    setSelectedRegion(response.region);
                    const result = REGION.filter(item => item.key === response.region);
                    setDisplayRegion(result[0].value);
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
                newOrder.region = selectedRegion;
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
        setSelectedRegion(null);
        props.navigation.navigate("MainScreen");
    }

    function askCancelRequire(){
        Alert.alert(
            '경고',
            '현재 페이지의 변경을 취소하시겠습니까?\n현재 페이지에서 변경된 내용은 저장되지 않습니다.',
            [
              {text: '예', onPress: () => {
                setText(null);
                setSelectedRegion(null);
                props.navigation.navigate("MainScreen");
              }},
              {text: '아니요', onPress: () => {}}
            ],
            { cancelable: true }
        );
    }

    function getReceiptModal(close){
        setReceiptModal(close);
    }

    return(
        <>
        <KeyboardAwareScrollView style={{backgroundColor: 'white'}}>
        <TotalView color={'white'} notchColor={'white'} homeIndicatorColor={'white'}>
            <IntroView>
                <Intro>
                    <IntroText>{'업체에게 전달할\n별도의 요구사항을\n입력해주세요.'}</IntroText>
                </Intro>
            </IntroView>
            <ContentView>
                {!isLoading ? 
                <InputView>
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
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>원하시는 지역을 골라주세요.</Text>
                        <PickerView onPress={()=>{setRegionModal(true)}}>
                            <Text>{displayRegion}</Text>
                        </PickerView>
                    </RegionView>
                </InputView> 
                : <ActivityIndicator size = 'large' color= {Color.main}/>}
                <BtnView>
                    <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                        <Button mode={"contained"} onPress={() => {props.navigation.navigate("PackageScreen_3");}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main}>이전</Button>
                        <Button mode={"contained"} onPress={() => {storeRequire();}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main}>완료</Button>
                    </Row>
                </BtnView>
            </ContentView>
            <View style={{position: 'absolute', width: '100%', alignItems: 'flex-end', paddingTop: 5, paddingRight: 5}}>
                <TouchableOpacity onPress={()=>{askCancelRequire();}}>
                    <Icon name="close-outline" size={35} color={'black'}></Icon>
                </TouchableOpacity>    
            </View>
        </TotalView>
        
        </KeyboardAwareScrollView>

        <Modal
            animationType="slide"
            transparent={true}
            visible={ReceiptModal}
            onRequestClose={() => {setReceiptModal(!ReceiptModal);}}
        >
            <ModalView>
                <View style={{width: '90%'}}>
                    <Receipt getModal={getReceiptModal} navigation={props.navigation}/>
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
                <View style={{width: '90%', height: 350, backgroundColor: 'white'}}>
                    <ScrollView contentContainerStyle={{alignItems: 'center'}}
                                persistentScrollbar={true}
                                showsVerticalScrollIndicator={true}>
                        {_.map(REGION, (item)=>{
                            return(
                                <PickItem key={item.key} onPress={()=>{setSelectedRegion(item.key); setDisplayRegion(item.value); setRegionModal(false);}}>
                                    <Text>{item.value}</Text>
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