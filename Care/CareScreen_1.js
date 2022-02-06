import React from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import styled from "styled-components/native";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
//component
import TotalView from "../components/TotalView";
import Carousel from "../components/Carousel";
import MyCarPage from "./MyCarPage";
import Row from '../components/Row';
//constant
import AppWindow from "../constants/AppWindow";
import Color from "../constants/Color";

const WIDTH = AppWindow.width;

const BtnView = styled.View`
    width: 100%;
    height: 80px;
`;

const DATA = [
    {
        id: 0,
        carName: 'SONATA',
        uri: 'https://www.hyundai.com/content/dam/hyundai/kr/ko/images/vehicles/sonata/19fc/launching/sonata-sensuous/pip-sonata-19fc-sonata-sensuous-front-design-19wheel.jpg'
    },{
        id: 1,
        carName: 'AVANTE',
        uri: 'https://t1.daumcdn.net/cfile/tistory/9925DA465E81C08F0B'
    },{
        id: 2,
        carName: 'SONATA',
        uri: 'https://www.hyundai.com/content/dam/hyundai/kr/ko/images/vehicles/sonata/19fc/launching/sonata-sensuous/pip-sonata-19fc-sonata-sensuous-front-design-19wheel.jpg'
    },{
        id: 3,
        carName: 'AVANTE',
        uri: 'https://t1.daumcdn.net/cfile/tistory/9925DA465E81C08F0B'
    },{
        id: 4,
        carName: 'SONATA',
        uri: 'https://www.hyundai.com/content/dam/hyundai/kr/ko/images/vehicles/sonata/19fc/launching/sonata-sensuous/pip-sonata-19fc-sonata-sensuous-front-design-19wheel.jpg'
    },{
        id: 5,
        carName: '',
        uri: ''
    },
];


function CareScreen_1(props){
    const [car, setCar] = React.useState(0);

    function MoveToNext(){
        if(car !== DATA.length-1){
            let newData = {
                carName: DATA[car].carName,
                carId: DATA[car].id,
            }
            props.navigation.navigate('CareScreen_2', { carData: newData });
        } 
    }

    function askCancelCare(){
        Alert.alert(
            '입력을 중단하겠습니까?',
            '지금까지 입력된 내용은 저장되지 않습니다.',
            [
                {text: '취소', onPress: () => {}},
                {text: '확인', onPress: () => {
                    props.navigation.popToTop()
                }},
            ],
            { cancelable: true }
        );
    }

    return(
        <TotalView color={'white'} notchColor={'white'} homeIndicatorColor={'white'}>
            <View style={{width: '100%', alignItems: 'flex-end', paddingTop: 5, paddingRight: 5}}>
                <TouchableOpacity onPress={()=>{askCancelCare()}}>
                    <Icon name="close-outline" size={35} color={'black'}></Icon>
                </TouchableOpacity>    
            </View>
            
            <View style={{flex: 1, justifyContent: 'center'}}>
                <Text style={{marginLeft: 10, marginBottom: 10, fontSize: 25, fontWeight: 'bold'}}>차량을 선택해주세요.</Text>      
                <Carousel
                gap={16}
                offset={36}
                pages={DATA}
                pageWidth={WIDTH - (16 + 36) * 2} // pageWidth = {WIDTH - (gap + offset) * 2}
                pageHeight={500}
                Content={MyCarPage}
                getState={setCar}
                />
                {/* <View style={{...styles.shadow, width: 100, height: 100, backgroundColor: 'red'}}>
                    <Text>hello</Text>
                </View> */}
            </View> 
            <BtnView>
                <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                    <Button mode={"contained"} onPress={() => {props.navigation.goBack();}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main}>취소</Button>
                    <Button mode={"contained"} onPress={() => {MoveToNext()}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main}>선택완료</Button>
                </Row>
            </BtnView>
        </TotalView>
    )
}

export default CareScreen_1;
