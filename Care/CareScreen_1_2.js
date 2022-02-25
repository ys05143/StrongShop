import React from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native'
import styled from "styled-components/native";
import Icon from "react-native-vector-icons/Ionicons";
import _ from 'lodash';
import { Button } from "react-native-paper";
//component
import TotalView from "../components/TotalView";
import Row from "../components/Row";
//constant
import Color from "../constants/Color";
import AppWindow from "../constants/AppWindow";
//context
import { userContext } from '../function/Context';

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;

const BtnView = styled.View`
    width: 100%;
    height: 80px;
`;

const SearchBar = styled.TouchableOpacity`
    flex-direction: row;
    background-color: #e5e5e5;
    width: 90%;
    height: 50px;
    border-radius: 10px;
    align-items : center;
    justify-content: space-between;
`;
const IntroView = styled.View`
    width: 90%;
    height: 100px;
    align-items: center;
    flex-direction: row;
`;
const IntroText = styled.Text`
    font-size: 25px;
    font-weight: bold;
`;

function CareScreen_1_2(props){
    const context = React.useContext(userContext);
    const [isLoading, setIsLoading] = React.useState(false);

    function askCancelCare(){
        Alert.alert(
            '입력을 중단하겠습니까?',
            '지금까지 입력된 내용은 저장되지 않습니다.',
            [
                {text: '취소', onPress: () => {}},
                {text: '확인', onPress: () => {
                    context.setCareSearch(null);
                    props.navigation.popToTop()
                }},
            ],
            { cancelable: true }
        );
    }

    function MoveToNext(){
        if(context.careSearch !== null && context.careSearch !== ''){
            let newData = {
                carName: context.careSearch,
            }
            props.navigation.navigate('CareScreen_2', { carData: newData });
        }
        else{
            Alert.alert(
                '차량을 입력하셔야 됩니다.',
                '',
                [
                    {text: '확인', onPress: () => {console.log('')}},
                ],
                { cancelable: false }
            );
        }
    }


    return(
        <TotalView color={'white'} notchColor={'white'} homeIndicatorColor={'white'}>
            <View style={{width: '100%', alignItems: 'flex-end', paddingTop: 5, paddingRight: 5}}>
                <TouchableOpacity onPress={()=>{askCancelCare();}}>
                    <Icon name="close-outline" size={35} color={'black'}></Icon>
                </TouchableOpacity>    
            </View>
            <View style={{alignItems: 'center'}}>
                <IntroView>
                    <IntroText>{'케어를 원하는\n차종을 입력해주세요.'}</IntroText>
                </IntroView>
            </View>
            {/* <Text style={{marginLeft: 10, marginBottom: 10, fontSize: 25, fontWeight: 'bold'}}>{'케어을 원하시는\n차종을 입력해주세요.'}</Text>   */}
            <View style={{flex:1, alignItems: 'center'}}>
                <SearchBar onPress={()=>{props.navigation.navigate("SearchScreen", {topic: 'Care'})}} style={{marginTop: 20}}>
                    <Text style={{marginLeft: 10, fontSize: 20}}>{context.careSearch !== null ? context.careSearch : ''}</Text>
                    <Icon name="search-outline" size={30} style={{marginRight: 10}} ></Icon>
                </SearchBar>
            </View>
            <BtnView>
                <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                    <Button mode={"contained"} onPress={() => {askCancelCare();}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main}>이전</Button>
                    <Button mode={"contained"} onPress={() => {MoveToNext()}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main}>입력완료</Button>
                </Row>
            </BtnView>
            {isLoading && <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', position: 'absolute', backgroundColor: 'rgba(0,0,0,0.3)'}}>
                <ActivityIndicator size = 'large' color= {Color.main}/>
            </View>}
        </TotalView>
    );
}

export default CareScreen_1_2;