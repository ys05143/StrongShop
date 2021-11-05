import React from "react";
import { Image, TouchableOpacity, View, Text } from "react-native";
import styled from "styled-components/native";
import { login, logout, getKakaoProfile, unlink } from '@react-native-seoul/kakao-login';
//component
import TotalView from '../components/TotalView';
//constant
import Color from '../constants/Color';

function LoginScreen(props){
    const [result, setResult] = React.useState(null);
    
    const signInWithKakao = async () => {
        const token = await login();
        setResult(JSON.stringify(token));
    };
    
    const signOutWithKakao = async () => {
        const message = await logout();
        setResult(message);
    };
    
    const getProfile = async () => {
        const profile = await getKakaoProfile();
        setResult(JSON.stringify(profile));
    };
    
    const unlinkKakao = async () => {
        const message = await unlink();
        setResult(message);
    };
    return(
        <TotalView color={Color.main} notchColor={Color.main} homeIndicatorColor={Color.main}>
            <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 35, fontWeight: 'bold', color: 'white', marginBottom: 10}}>최강샵</Text>
                <View style={{borderWidth: 2, borderColor: 'white', width: '80%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10}}>
                    <Text style={{color: 'white'}}>로그인</Text>
                </View>
                <View style={{borderWidth: 2, borderColor: 'white', width: '80%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: 'white'}}>로그인</Text>
                </View>
                {/* <TouchableOpacity style={{width: '100%', height: 50}}>
                    <Image source={require('../resource/kakao_login_large_wide.png')} style={{width: '100%', height: '100%'}} resizeMode={'contain'}/>
                </TouchableOpacity>
                <View>
                    <Text style={{color: 'white'}}>{result !== null? result: 'there is no token'}</Text>
                </View> */}
            </View>
        </TotalView>
    )
}

export default LoginScreen;