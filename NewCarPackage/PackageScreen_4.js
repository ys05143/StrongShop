import React from 'react';
import styled from 'styled-components';
import { Text, View, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
//components
import TotalView from '../components/TotalView';
import Row from '../components/Row';
//constants
import AppWindow from '../constants/AppWindow';
import Color from '../constants/Color'
//function
import store from '../function.js/store';
import fetch from '../function.js/fetch';

const WIDTH = AppWindow.width;
///////////////////////////////
const IntroView = styled.View`
    flex: 2;
    border: 1px solid #ff0000;
    justify-content: center;
    align-items: center;
    padding: 5px;
`;
const Intro = styled.View`
    width: 80%;
`;
const ContentView = styled.View`
    flex: 5;
    border: 1px solid #00ff00;
    align-items : center;
    justify-content: space-between;
`;
const IntroText = styled.Text`
    font-size: ${WIDTH*0.09}px;
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
    border: 1px solid #00ff00;
    align-items: center;
    justify-content: center;
`;
const Input = styled.TextInput`
    width: 95%;
    height: 90%;
    background-color: #e5e5e5;
    border-radius: 10px;
    color: #000000;
    padding: 10px;
`;

function PackageScreen_4(props){
    const [text, setText] = React.useState();
    const [start, setStart] = React.useState(false);

    React.useEffect( async ()=>{
        console.log('setting Page3');
        await fetch('BidOrder')
        .then(res=>{
            if(res !== null && res.require !== null){
                setText(res.require);
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
            currentOrder.require = text;
        })
        .catch(e => {
            console.log(e);
        });
        await store('BidOrder', currentOrder);
        //for check
        await fetch('BidOrder')
        .then(res => {
            console.log(res);
        })
        .catch(e => {
            console.log(e);
        });
        //완료를 누르면 저장하던 BidOrder를 서버에 전달한 후 remove 해야한다.  
    }

    return(
        <TotalView TotalView color={'white'} notchColor={'white'}>
            <IntroView>
                <Intro>
                    <IntroText>업체에게 전달할</IntroText>
                    <IntroText style={{marginTop: 10}}>별도의 요구사항을</IntroText>
                    <IntroText style={{marginTop: 10}}>입력해주세요.</IntroText>
                </Intro>
            </IntroView>
            <ContentView>
                {start === true ? <InputView>
                    <Input multiline={true}
                            style={{textAlignVertical:'top'}}//only for android
                            value={text}
                            onChangeText={value=>setText(value)}
                            placeholder={"예) 반드시 0월 0일에 시공을 시작했으면 좋겠습니다."}
                            placeholderTextColor="gray"/>
                </InputView> : <ActivityIndicator size = 'large' color= {Color.main}/>}
                <BtnView>
                    <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                        <Button mode={"contained"} onPress={() => {props.navigation.navigate("PackageScreen_3");}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>이전</Button>
                        <Button mode={"contained"} onPress={() => {storeRequire();}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>완료</Button>
                    </Row>
                </BtnView>
            </ContentView>
        </TotalView>
    );
}

export default PackageScreen_4;