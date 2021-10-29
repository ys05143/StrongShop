import React from 'react';
import styled from 'styled-components/native';
import { Text, View, ActivityIndicator, Alert, Modal } from 'react-native';
import { Button } from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import Icon  from "react-native-vector-icons/Ionicons";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    width: 90%;
    flex: 1;
    margin-top: 15px;
`;
const PickerView = styled.View`
    border: 1px;
    border-radius: 1px;
    margin-top: 5px;
`;

function PackageScreen_4(props){
    const [text, setText] = React.useState(null);
    //서버와 통신 전에 항상 start 조작하기
    const [searchModal, setSearchModal] = React.useState(false);
    const [selectedRegion, setSelectedRegion] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSending, setIsSending] = React.useState(false);

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
                }
            }
            else{
                Alert.alert( //async에 저장된 것 없이 이 단계까지 온 것은 오류다.
                    '오류',
                    '오류가 발생했습니다.',
                    [
                      {text: 'OK', onPress: () => {cancelRequire();}},
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
            setIsSending(true);
            let newOrder;
            const response = await storage.fetch('BidOrder');
            if(response !== null){
                newOrder = {...response};
                newOrder.processPage = 3;
                newOrder.require = text !==null ? text : null;
                newOrder.region = selectedRegion !==null ? selectedRegion : null;
                await storage.store('BidOrder', newOrder);
            }
            else{ 
                Alert.alert(
                    '오류',
                    '오류가 발생했습니다.',
                    [
                      {text: 'OK', onPress: () => {cancelRequire();}},
                    ],
                    { cancelable: false }
                  );
            }
            const check = await storage.fetch('BidOrder');
            if(check !== null){
                setSearchModal(true);
            }
            else{
                Alert.alert(
                    '오류',
                    '오류가 발생했습니다.',
                    [
                      {text: 'OK', onPress: () => {cancelRequire();}},
                    ],
                    { cancelable: false }
                  );
            }
            console.log('In page 4 check: ', check);
            console.log(JSON.stringify(check));
            // await AsyncStorage.removeItem('BidOrder', ()=>{
            //     Alert.alert(
            //         '완료',
            //         '견적 등록을 완료했습니다.',
            //         [
            //           {text: 'OK', onPress: () => {props.navigation.navigate("MainScreen"); setIsSending(false);}},
            //         ],
            //         { cancelable: false }
            //       );
            // });
        }
        catch(error){
            console.log(error);
            cancelRequire();
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
            '현재 페이지의 입력을 취소하시겠습니까?\n현재 페이지에 입력된 내용은 저장되지 않습니다.',
            [
              {text: 'OK', onPress: () => {
                setText(null);
                setSelectedRegion(null);
                props.navigation.navigate("MainScreen");
              }},
              {text: '취소', onPress: () => {}}
            ],
            { cancelable: true }
        );
    }

    function getSearchModal(close){
        setSearchModal(close);
        setIsSending(false);
    }

    return(
        <>
        <KeyboardAwareScrollView>
        <TotalView color={'white'} notchColor={'white'}>
            <IntroView>
                <Intro>
                    <IntroText>{'업체에게 전달할\n별도의 요구사항을\n입력해주세요.'}</IntroText>
                </Intro>
            </IntroView>
            <ContentView>
                {!isLoading ? 
                <InputView>
                    <Input multiline={true}
                            style={{textAlignVertical:'top'}}//only for android
                            value={text}
                            onChangeText={value=>{setText(value);}}
                            placeholder={"예) 반드시 0월 0일에 시공을 시작했으면 좋겠습니다."}
                            placeholderTextColor="gray"/>
                    <RegionView>
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>원하시는 지역을 골라주세요.</Text>
                        <PickerView>
                            <Picker
                            selectedValue={selectedRegion}
                            onValueChange={(itemValue, itemIndex) => {setSelectedRegion(itemValue);}}>
                                <Picker.Item label="없음" value={null}/>
                                <Picker.Item label="서울" value="seoul" />
                                <Picker.Item label="대전" value="daejeon" />
                                <Picker.Item label="대구" value="daegu" />
                                <Picker.Item label="부산" value="busan" />
                                <Picker.Item label="인천" value="incheon" />
                                <Picker.Item label="광주" value="gwangju" />
                                <Picker.Item label="제주" value="jeju" />
                            </Picker>
                        </PickerView>
                    </RegionView>
                </InputView> 
                : <ActivityIndicator size = 'large' color= {Color.main}/>}
                <BtnView>
                    <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                        <Button mode={"contained"} onPress={() => {props.navigation.goBack();}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>이전</Button>
                        <Button mode={"contained"} onPress={() => {storeRequire();}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>완료</Button>
                    </Row>
                </BtnView>
            </ContentView>
            <View style={{position: 'absolute', width: '100%', alignItems: 'flex-end', paddingTop: 5, paddingRight: 5}}>
                <Icon name="close-outline" size={35} color={'black'} onPress={()=>{storeRequire();}}></Icon>
            </View>
        </TotalView>
        {isSending && <View style={{width: WIDTH, height: HEIGHT, position: 'absolute', alignItems: 'center', justifyContent: 'center', backgroundColor: sendingColor}}>
            <ActivityIndicator size = 'large' color= {Color.main}/>
        </View>}
        </KeyboardAwareScrollView>

        <Modal
            animationType="slide"
            transparent={true}
            visible={searchModal}
            onRequestClose={() => {setSearchModal(!searchModal);}}
        >
            <ModalView>
                <View style={{width: '90%'}}>
                                <Receipt getModal={getSearchModal}/>
                            </View>
            </ModalView>
    </Modal>
    </>
    );
}

export default PackageScreen_4;