import React from 'react';
import {Text, Image, StyleSheet, View } from 'react-native';
import styled from 'styled-components/native';
import Icon from "react-native-vector-icons/Ionicons";
//components
import TotalView from '../components/TotalView';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MyPageScreen from '../Mypage/MypageScreen';
import PackageScreen_1 from '../NewCarPackage/PackageScreen_1';

const IntroView = styled.View`
    flex: 3;
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
    flex: 4;
    justify-content: space-evenly;
    align-items: center;
`;
const IntroText = styled.Text`
    font-size: 35px;
    font-family: 'NotoSansKR-Bold';
`;
const LoginView = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;
const Select = styled.TouchableOpacity`
    width: 85%;
    height: 150px;
    border: 1px solid #000000;
    border-radius: 15px;
    padding: 10px;
`;
const Login = styled.TouchableOpacity`
    width: 85%;
    height: 50px;
    margin-top: 10px;
    margin-bottom: 10px;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
`;
const SelectTitle = styled.Text`
    font-size: 30px;
    font-family: 'DoHyeon-Regular';
`;

function Past_MainScreen (props) {
    return (
        <TotalView color={'white'} notchColor={'white'}>
            <View style={{width: '100%', position: 'absolute', marginTop: 10, paddingHorizontal: 10, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center', marginRight: 10}}>
                    <Icon name="notifications-outline" size={25}></Icon>
                </TouchableOpacity>
                <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center'}} onPress={()=>{props.navigation.navigate("MyPageScreen")}}>
                    <Text style={{fontSize: 20}}>My</Text>
                </TouchableOpacity>
            </View>
            <IntroView>
                <Intro>
                    <IntroText>{'안녕하세요.\n찾으시는 서비스를\n선택해주세요.'}</IntroText>
                </Intro>
            </IntroView>
            <ContentView>
                <Select>
                    <SelectTitle>케어</SelectTitle>
                    <Text style={{marginTop: 20}}>타시던 차를 관리해보세요.</Text>
                </Select>
                <Select onPress={()=>{props.navigation.navigate("PackageScreen_1")}}>
                    <SelectTitle>신차 패키지</SelectTitle>
                    <Text style={{marginTop: 20}}>새차를 좀 더 멋지게 만들어보세요.</Text>
                </Select>
            </ContentView>
            <LoginView>
                <Login>
                    <Image style={{height:'100%',width:'100%'}} source={require('../resource/kakao_login_large_wide.png')} resizeMode='stretch'/>
                </Login>
            </LoginView>
        </TotalView>
    );
};

export default Past_MainScreen;

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