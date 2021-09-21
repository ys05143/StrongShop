import React from 'react';
import { Text, View, Image, TextInput, ColorPropType } from 'react-native';
import styled from 'styled-components/native';
import Icon from "react-native-vector-icons/Ionicons";
import { Avatar, Badge, Switch } from 'react-native-paper';
//component
import TotalView from '../components/TotalView';
//constant
import Color from '../constants/Color';
import { TouchableOpacity } from 'react-native-gesture-handler';

const TopBar = styled.View`
    height: 60px;
    width: 100%;
    padding-right: 10px;
    border-bottom-width: 1px;
    border-color: lightgray;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: white;
`;
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
`;
const InfoView = styled.View`
    width: 100%;
    margin-top: 10px;
    flex: 1;
    background-color: white;
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
    background-color: #e5e5e5;
    flex-direction: row;
`;

const DATA = {
    profileImg: require('../resource/character4.png'),
    name: '허지훈',
    phoneNum: '01012345678',
}

function MyPageScreen(props){
    const [nameInput, setNameInput] = React.useState(DATA.name);
    const [phoneNumInput, setphoneNumInput] = React.useState(DATA.phoneNum);
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);

    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
    
    return(
        <TotalView>
            <TopBar>
                <Icon name="chevron-back-outline" size={30} color={'black'} onPress={()=>{props.navigation.goBack()}}></Icon>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>내 정보</Text>
                <Text style={{fontSize: 15}} onPress={()=>{alert('save')}}>저장</Text>
            </TopBar>
            <ProfileView>
                <ProfileImg>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 50}}>
                        {DATA.profileImg === null ? <Avatar.Icon size={68} icon="account" style={{backgroundColor: 'white'}}/> :
                                                    <Image source={DATA.profileImg} style={{height:'100%',width:'100%',}} resizeMode='contain'/>}
                    </View>
                    <Badge style={{backgroundColor: 'white', borderWidth: 1, borderColor: 'lightgray', position: 'absolute'}}>
                        <Icon name="pencil-sharp" color={'gray'}></Icon>
                    </Badge>
                </ProfileImg>
                <ProfileName placeholder='닉네임(최대 17자)'
                        placeholderTextColor="gray"
                        value={nameInput}
                        onChangeText={value=>setNameInput(value)}
                        returnKeyType="done"
                        maxLength={17}/>
            </ProfileView>
            <InfoView>
                <InfoOptions>
                    <Text>휴대전화</Text>
                    <PhoneNum>
                        <TextInput style={{width: 190}}
                                    keyboardType={'number-pad'}
                                    placeholder={'01012341234'}
                                    value={phoneNumInput}
                                    onChangeText={value=>setphoneNumInput(value)}
                                    returnKeyType="done"
                                    maxLength={11}/>
                        <TouchableOpacity style={{width: 60, height: '100%', backgroundColor: Color.main, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: 'white'}}>인증</Text>
                        </TouchableOpacity>
                    </PhoneNum>
                </InfoOptions>
                <InfoOptions style={{paddingRight: 10}}>
                    <Text>로그인 연동</Text>
                    <Image source={require('../resource/kakaolink_btn_small_ov.png')} style={{width: 30, height: 30}}/>
                </InfoOptions>
                <InfoOptions style={{paddingRight: 10}}>
                    <Text>푸시 알림 동의</Text>
                    <Switch value={isSwitchOn} onValueChange={onToggleSwitch} color={Color.main}/>
                </InfoOptions>
            </InfoView>
        </TotalView>
    );
}

export default MyPageScreen;