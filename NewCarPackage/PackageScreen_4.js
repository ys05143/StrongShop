import React from 'react';
import styled from 'styled-components/native';
import { Text, View, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import Icon  from "react-native-vector-icons/Ionicons";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
//components
import TotalView from '../components/TotalView';
import Row from '../components/Row';
//constants
import AppWindow from '../constants/AppWindow';
import Color from '../constants/Color'
//function
import store from '../function/store';
import fetch from '../function/fetch';

const WIDTH = AppWindow.width;
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
    border-radius: 10px;
    margin-top: 5px;
`;

function PackageScreen_4(props){
    const [text, setText] = React.useState(null);
    const [start, setStart] = React.useState(false);
    const [selectedLanguage, setSelectedLanguage] = React.useState(null);

    //useEffect 내에서 async 추천 하지 않음 promise then catch 형태로 추후 수정해야함.
    React.useEffect( ()=>{
        fetch('BidOrder')
        .then(res=>{
            if(res !== null && (res.require !== null || res.region !== null)){
                console.log('In page 4 useEffect: ', res);
                setText(res.require);
                setSelectedLanguage(res.region);
                setStart(true);
            }
            else{
                setStart(true);
            }
        })
        .catch(e=>{
            console.log(e);
        });
    },[]);


    async function storeRequire(){
        let currentOrder;
        await fetch('BidOrder')
        .then(res => {
            currentOrder = {...res};
            currentOrder.processPage = 3;
            currentOrder.require = text !==null ? text : null;
            currentOrder.region = selectedLanguage !==null ? selectedLanguage : null;
        })
        .catch(e => {
            console.log(e);
        });
        await store('BidOrder', currentOrder);
        //for check
        await fetch('BidOrder')
        .then(res => {
            console.log('In page 4 check: ', res);
        })
        .catch(e => {
            console.log(e);
        });
        //완료를 누르면 저장하던 BidOrder를 서버에 전달한 후 remove 해야한다.  
    }

    return(
        <KeyboardAwareScrollView>
        <TotalView color={'white'} notchColor={'white'}>
            <IntroView>
                <Intro>
                    <IntroText>{'업체에게 전달할\n별도의 요구사항을\n입력해주세요.'}</IntroText>
                </Intro>
            </IntroView>
            <ContentView>
                {start === true ? 
                <InputView>
                    <Input multiline={true}
                            style={{textAlignVertical:'top'}}//only for android
                            value={text}
                            onChangeText={value=>setText(value)}
                            placeholder={"예) 반드시 0월 0일에 시공을 시작했으면 좋겠습니다."}
                            placeholderTextColor="gray"/>
                    <RegionView>
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>원하시는 지역을 골라주세요.</Text>
                        <PickerView>
                            <Picker
                            selectedValue={selectedLanguage}
                            onValueChange={(itemValue, itemIndex) =>
                                setSelectedLanguage(itemValue)
                            }>
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
                        <Button mode={"contained"} onPress={() => {props.navigation.navigate("PackageScreen_3");}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>이전</Button>
                        <Button mode={"contained"} onPress={() => {storeRequire();}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>완료</Button>
                    </Row>
                </BtnView>
            </ContentView>
            <View style={{position: 'absolute', width: '100%', alignItems: 'flex-end', paddingTop: 5, paddingRight: 5}}>
                <Icon name="close-outline" size={35} color={'black'} onPress={()=>{props.navigation.navigate("PackageScreen_1")}}></Icon>
            </View>
        </TotalView>
        </KeyboardAwareScrollView>
    );
}

export default PackageScreen_4;