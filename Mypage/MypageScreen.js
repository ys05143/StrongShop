import React from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import styled from 'styled-components/native';
import Icon from "react-native-vector-icons/Ionicons";
import { Avatar, Badge, Switch } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
//component
import TotalView from '../components/TotalView';
import TopBar from '../components/TopBar';
//constant
import Color from '../constants/Color';
//server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';
import { useIsFocused } from '@react-navigation/native';
import checkErrorCode from '../function/checkErrorCode';
import TotalIndicator from '../components/TotalIndicator';
import { JuaText, NotoSansText } from '../components/TextStyle';

const ProfileView = styled.View`
    width: 100%;
    background-color: white;
    align-items: center;
    padding-bottom: 20px;
`;
const ProfileImg = styled.View`
    width: 70px;
    height: 70px;
    border-radius: 50px;
    border: 1px solid lightgray;
    margin-top: 20px;
`;
const ProfileName = styled.TextInput`
    width: 250px;
    justify-content: center;
    border: 1px solid lightgray;
    margin-top: 20px;
    padding-left: 5px;
    height: 40px;
    font-size: 15px;
    color: black;
    font-family: NotoSansKR-Medium;
`;
const InfoView = styled.View`
    width: 100%;
    margin-top: 10px;
    background-color: white;
`;
const RecordView = styled.View`
    width: 100%;
    height: 55px;
    background-color: white;
    margin-top: 10px;
`;
const InfoOptions = styled.View`
    width: 100%;
    height: 40px;
    padding-left: 10px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
`;
const PhoneNum = styled.View`
    width: 250px;
    height: 100%;
    background-color: #F4F4F4;
    flex-direction: row;
`;
const Record = styled.TouchableOpacity`
    width: 100%;
    height: 100%;    
    padding: 0px 10px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const DATA = {
    profileImg: '',
    userName: null,
    phoneNum: null,
    loginVer: '',
    fcm: false,
}

function MyPageScreen(props){
    const [myData, setMyData] = React.useState(DATA);
    const [nameInput, setNameInput] = React.useState(null);
    const [phoneNumInput, setphoneNumInput] = React.useState(null);
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [afterUpdate , setAfterUpdate] = React.useState(false);
    
    const regex = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/; // 전화번호 형식 체크
    const check_010 = /^010-(\d)/;//010으로 번호 시작하는지 체크
    
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    React.useEffect(()=>{
        if(phoneNumInput !== null){
            //세자리 콤마 정규식 -> this.number.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            let value = phoneNumInput.replace(/[^0-9\-]/g, '');
            if (/^(\d{3})(\d)/.test(value)) {
                setphoneNumInput(value.replace(/^(\d{3})(\d)/, '$1-$2'));
            }
            if(check_010.test(value))
            {
                if (/^(\d{3}-\d{4})(\d)/.test(value)) {
                    setphoneNumInput(value.replace(/^(\d{3}-\d{4})(\d)/, '$1-$2'));
                }
            }
            else{
                if (/^(\d{3}-\d{3})(\d)/.test(value)) {
                    setphoneNumInput(value.replace(/^(\d{3}-\d{3})(\d)/, '$1-$2'));
                }
            }
        }
    }, [phoneNumInput]);

    const isFocused = useIsFocused();
    React.useEffect(()=>{
        if(isFocused) getData();
    },[isFocused]);

    async function getData(){
        try{
            setIsLoading(true);
            const auth = await checkJwt();
            if(auth !== null){
                const response = await axios({
                    method: 'GET',
                    url : `${server.url}/api/user`,
                    headers : {Auth: auth},
                })
                const rawData = response.data.data;
                //console.log(rawData);
                setMyData({
                    profileImg: rawData.thumbnail,
                    userName: rawData.nickname,
                    phoneNum: rawData.phonenumber,
                    loginVer: rawData.loginmethod,
                    fcm: true,
                })
                setNameInput(rawData.nickname);
                setphoneNumInput(rawData.phonenumber);
                setIsLoading(false);
            }
            else{
                console.log("no login");
            }
        }
        catch{e=>{
            console.log(e);
            Alert.alert(
                '정보 조회 오류',
                '다시 시도해주세요.',
                [
                    {text: '확인', onPress: () => {}},
                ],
                { cancelable: false }
            );
            }
        }  
    }

    async function sendData(){
        if(afterUpdate){
            alert('저장');
        }
        else{
            props.navigation.navigate("MainScreen");
        }
    }

    async function logOut(){
        const auth = await checkJwt();
        setIsLoading(true);
        if(auth !== null){
            axios({
                method : 'PUT' ,
                url : `${server.url}/api/logout/user` ,
                headers : {Auth: auth},
            })
            .then(res => {
                //console.log(res);
                AsyncStorage.removeItem('auth', ()=>{
                    Alert.alert(
                        '로그아웃',
                        '로그아웃 하였습니다.',
                        [
                            {text: '확인', onPress: async() => {
                                    const allKey = await AsyncStorage.getAllKeys();
                                    console.log(allKey);
                                    props.navigation.popToTop();
                                    setIsLoading(false);
                                }
                            },
                        ],
                        { cancelable: false }
                    );
                });
            })
            .catch(e=>{
                checkErrorCode(e, props.navigation);
                setIsLoading(false);
            })
        }
        else {
            Alert.alert(
                '오류',
                '로그인상태가 아닙니다.',
                [
                    {text: '확인', onPress: () => {} },
                ],
                { cancelable: false }
            );
        }
    }

    async function deleteUser(){
        setIsLoading(true);
        Alert.alert(
            '회원 탈퇴',
            '정말로 탈퇴하시겠습니까?',
            [
                {text: '취소', onPress: async () => {setIsLoading(false);}},
                {text: '확인', onPress: async () => { 
                    const auth = await checkJwt();
                    if(auth !== null){
                        axios({
                            method : 'DELETE' ,
                            url : `${server.url}/api/user` ,
                            headers : {Auth: auth},
                        })
                        .then(res => {
                            //console.log(res);
                            AsyncStorage.removeItem('auth', ()=>{
                                Alert.alert(
                                    '회원 탈퇴',
                                    '회원탈퇴를 완료하였습니다.',
                                    [
                                        {text: '확인', onPress: async () => {
                                                const allKey = await AsyncStorage.getAllKeys();
                                                console.log(allKey);
                                                props.navigation.popToTop();
                                                setIsLoading(false);
                                            }
                                        },
                                    ],
                                    { cancelable: false }
                                );
                            });
                        })
                        .catch(e=>{
                            checkErrorCode(e, props.navigation);
                            setIsLoading(false);
                        })
                    }
                    else {
                        Alert.alert(
                            '오류',
                            '로그인상태가 아닙니다.',
                            [
                                {text: '확인', onPress: () => {setIsLoading(false)} },
                            ],
                            { cancelable: false }
                        );
                    }
                }},
            ],
            { cancelable: false }
        );
        
    }
    
    return(
        <TotalView notchColor={'white'}>
            <TopBar>
                <TouchableOpacity style={{height: 60, width: 60, justifyContent: 'center', paddingHorizontal: 5}} onPress={()=>{props.navigation.goBack()}}>
                    <Icon name="chevron-back-outline" size={30} color={'black'}></Icon>
                </TouchableOpacity>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <JuaText style={{fontSize: 25}}>내 정보</JuaText>
                </View>
                <TouchableOpacity style={{width: 60, height: 60, justifyContent: 'center', paddingHorizontal: 5, alignItems: 'center'}} onPress={()=>{afterUpdate ? sendData() : logOut();}}>
                    <NotoSansText style={{fontSize: 13}}>{afterUpdate ? '저장': '로그아웃'}</NotoSansText>
                </TouchableOpacity>
            </TopBar>
            <ProfileView>
                <ProfileImg>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 50}}>
                        {DATA.profileImg === null ? <Avatar.Icon size={68} icon="account" style={{backgroundColor: 'white'}}/> :
                                                    <FastImage source={{uri: myData.profileImg.includes('https') ? myData.profileImg : myData.profileImg.replace('http', 'https')}} style={{height:'100%',width:'100%',}} resizeMode='contain'/>}
                    </View>
                    {afterUpdate && <Badge style={{backgroundColor: 'white', borderWidth: 1, borderColor: 'lightgray', position: 'absolute'}}>
                        <Icon name="pencil-sharp" color={'gray'}></Icon>
                    </Badge>}
                </ProfileImg>
                <ProfileName placeholder='닉네임(최대 17자)'
                        placeholderTextColor="gray"
                        value={nameInput}
                        editable={afterUpdate}
                        onChangeText={value=>setNameInput(value)}
                        returnKeyType="done"
                        maxLength={17}/>
            </ProfileView>
            <InfoView>
                <InfoOptions>
                    <NotoSansText>휴대전화</NotoSansText>
                    <PhoneNum>
                        <TextInput style={{width: 190, paddingLeft: 5}}
                                    keyboardType={'number-pad'}
                                    placeholder={myData.phoneNum}
                                    value={phoneNumInput}
                                    editable={afterUpdate}
                                    onChangeText={value=>setphoneNumInput(value)}
                                    returnKeyType="done"
                                    maxLength={13}
                                    onSubmitEditing={() => {regex.test(phoneNumInput)}}/>
                        {afterUpdate && <TouchableOpacity style={{width: 60, height: '100%', backgroundColor: Color.main, justifyContent: 'center', alignItems: 'center'}} onPress={()=>{props.navigation.navigate("Certification", {phoneNum: myData.phoneNum, userName: ''})}}>
                            <NotoSansText style={{color: 'black'}}>인증</NotoSansText>
                        </TouchableOpacity>}
                    </PhoneNum>
                </InfoOptions>
                <InfoOptions style={{paddingRight: 10}}>
                    <NotoSansText>로그인 연동</NotoSansText>
                    <Image source={myData.loginVer === 'KAKAO' ? require( '../resource/kakaolink_btn_small_ov.png'): require('../resource/Naver_square_btn.png')} style={{width: 30, height: 30}}/>
                </InfoOptions>
                <InfoOptions style={{paddingRight: 10, marginBottom: 15}}>
                    <NotoSansText>푸시 알림 동의</NotoSansText>
                    <Switch value={myData.fcm} color={Color.main}/>
                </InfoOptions>
            </InfoView>
            <RecordView>
                <Record onPress={()=>{props.navigation.navigate('RecordScreen')}}>
                    <NotoSansText>과거 시공 기록</NotoSansText>
                    <Icon name="chevron-forward-outline" size={20} color={'black'}></Icon>
                </Record>
            </RecordView>
            <View style={{marginTop: 10, alignItems: 'flex-end', paddingHorizontal: 15}}>
                <TouchableOpacity style={{height: 20, justifyContent: 'center'}} onPress={()=>{deleteUser();}}>
                    <NotoSansText style={{color: 'gray'}}>회원탈퇴</NotoSansText>
                </TouchableOpacity>
            </View>
            {isLoading && <TotalIndicator/>}
        </TotalView>
    );
}

export default MyPageScreen;