import React from 'react';
import styled from 'styled-components';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import TotalView from '../components/TotalView';
import Row from '../components/Row';
import AppWindow from '../constants/AppWindow';

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
    return(
        <TotalView>
            <IntroView>
                <Intro>
                    <IntroText>업체에게 전달할</IntroText>
                    <IntroText style={{marginTop: 10}}>별도의 요구사항을</IntroText>
                    <IntroText style={{marginTop: 10}}>입력해주세요.</IntroText>
                </Intro>
            </IntroView>
            <ContentView>
                <InputView>
                    <Input multiline={true}
                            style={{textAlignVertical:'top'}}//only for android
                            value={text}
                            onChangeText={value=>setText(value)}
                            placeholder={"예) 반드시 0월 0일에 시공을 시작했으면 좋겠습니다."}
                            placeholderTextColor="gray"/>
                </InputView>
                <BtnView>
                    <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                        <Button mode={"contained"} onPress={() => {}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={"#B2EBF4"}>이전</Button>
                        <Button mode={"contained"} onPress={() => {}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={"#B2EBF4"}>다음</Button>
                    </Row>
                </BtnView>
            </ContentView>
        </TotalView>
    );
}

export default PackageScreen_4;