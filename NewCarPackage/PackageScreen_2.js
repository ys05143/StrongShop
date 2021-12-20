import React from 'react';
import styled from 'styled-components/native';
import { Text, Image, StyleSheet, Modal, View, ActivityIndicator, Alert, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import Icon  from "react-native-vector-icons/Ionicons";
import { Button, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
//pages
import SearchModal from './SearchModal';
//components
import TotalView from '../components/TotalView';
import Row from '../components/Row';
import ModalView from '../components/ModalView';
//constants
import AppWindow from '../constants/AppWindow';
import Color from '../constants/Color';
//function
import storage from '../function/storage';

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
const SearchBar = styled.TouchableOpacity`
    flex-direction: row;
    background-color: #e5e5e5;
    width: 90%;
    height: 50px;
    border-radius: 10px;
    align-items : center;
    justify-content: space-between;
`;
const ResulView = styled.View`
    width: 90%;
    flex: 1;
    align-items : center;
    justify-content: center;
    padding: 5px;
`;
const Result = styled.View`
    width: 100%;
    flex: 1;
    align-items : center;
    justify-content: space-around;
`;

//서버요청을 받는 정보
const DATA={
    name: 'AVANTE',
    image: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
};
//기본 입찰정보 틀
const BidOrderList = {
    processPage: null,
    carName: null,
    options: null,
    require: null,
    region: null,
};

function PackageScreen_2 (props, {navigation}) {
    const [search, setSearch] = React.useState(null); //modal로 부터 받은 차량 검색어
    const [searchModal, setSearchModal] = React.useState(false);
    const [result, setResult] = React.useState(null); //서버에 요청하여 받은 이름/이미지 객체
    const [isLoading, setIsLoading] = React.useState(true); //로딩중...

    React.useEffect(() => {
        setIsLoading(true);
        storage.fetch('BidOrder')
        .then(response => {
            if(response != null){
                if(response.carName !== null){
                    console.log('In page 2 useEffect: ', response);         
                    getData(response.carName);
                }
                else{
                    console.log('Async error: there is not carName');
                    AsyncStorage.removeItem('BidOrder')
                    .then(() => {
                        console.log('remove bidOrder Async');
                    })
                    .catch(error => {
                        console.log(error);
                    })
                }
            }
            else{
                setSearch(null);
                setResult(null);
                setIsLoading(false);
            }
        })
        .catch(error=>{
            console.log(error);
        })
    }, [navigation]);

    function getSearchModal(close){
        setSearchModal(close);
    }
    function getData(name){
        setIsLoading(true);
        setSearch(name);
        if(name !== null){
            //modal로 받은 검색어로 서버에 {이름/이미지} 요청
            /*if(txt !== ''){
                axios({
                    method: 'GET',
                    url: '~~~name',
                })
                .then(res => {
                    setResult(res.data);
                })
                .catch(e => {
                    console.log(e);
                });
            }*/
            setResult({
                name: name,
                image: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
            });
        }
        else{
            setResult(null);
        }
        setIsLoading(false);
    }

    async function storeCarName() {
        try{
            if(result === null){
                Alert.alert(
                    '경고',
                    '차량을 입력해주세요.',
                    [
                      {text: '확인', onPress: () => {}},
                    ],
                    { cancelable: false }
                  );
            }
            else{
                let newOrder = null;
                const response = await storage.fetch('BidOrder');
                if(response !== null){
                    newOrder = {...response};
                    newOrder.carName = result.name;
                    if(newOrder.processPage <= 1) newOrder.processPage = 1;
                    await storage.store('BidOrder', newOrder);
                    props.navigation.navigate("PackageScreen_3");
                }
                else{
                    newOrder = {...BidOrderList}; 
                    newOrder.carName = result.name;
                    newOrder.processPage = 1;
                    await storage.store('BidOrder', newOrder);
                    props.navigation.navigate("PackageScreen_3");
                }
            }
            //just check
            const check = await storage.fetch('BidOrder');
            //console.log('In page 2 check: ', check);
        }
        catch(error){
            console.log(error);
            cancelCarName();
        }
    }

    function cancelCarName(){
        //지금 까지의 입력 싹 다 취소
        setSearch(null);
        setResult(null);
        AsyncStorage.removeItem('BidOrder')
                    .then(() => {
                        console.log('remove bidOrder Async');
                        props.navigation.navigate("MainScreen");
                    })
                    .catch(error => {
                        console.log(error);
                    })
        props.navigation.navigate("MainScreen");
    }

    function askCancelCarName(){
        Alert.alert(
            '경고',
            '입력을 취소하시겠습니까?',
            [
              {text: '예', onPress: () => {
                //지금 까지의 입력 싹 다 취소
                setSearch(null);
                setResult(null);
                AsyncStorage.removeItem('BidOrder')
                    .then(() => {
                        console.log('remove bidOrder Async');
                        props.navigation.navigate("MainScreen");
                    })
                    .catch(error => {
                        console.log(error);
                    })
              }},
              {text: '아니요', onPress: () => {}}
            ],
            { cancelable: true }
        );
    }

    return(
        <PaperProvider>
            <TotalView color={'white'} notchColor={'white'} homeIndicatorColor={'white'}>
                <IntroView>
                    <Intro>
                        <IntroText>{'시공을 원하시는\n차종을 입력해주세요.'}</IntroText>
                    </Intro>
                </IntroView>
                <ContentView>
                    <SearchBar onPress={()=>{setSearchModal(true)}}>
                        <Text style={{marginLeft: 10, fontSize: 20}}>{result !== null ? search : ''}</Text>
                        <Icon name="search-outline" size={30} style={{marginRight: 10}} ></Icon>
                    </SearchBar>
                    <ResulView>
                        {!isLoading ? <Result/> : <ActivityIndicator size = 'large' color= {Color.main} style={{marginTop: 10}}/>}
                    </ResulView>
                    <BtnView>
                        <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                            <Button mode={"contained"} onPress={() => {askCancelCarName();}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main}>취소</Button>
                            <Button mode={"contained"} onPress={() => {storeCarName();}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main}>입력완료</Button>
                        </Row>
                    </BtnView>
                </ContentView>
                <View style={{position: 'absolute', width: '100%', alignItems: 'flex-end', paddingTop: 5, paddingRight: 5}}>
                    <TouchableOpacity onPress={()=>{askCancelCarName();}}>
                        <Icon name="close-outline" size={35} color={'black'}></Icon>
                    </TouchableOpacity>    
                </View>
            </TotalView>
            <Modal
                onDismiss={false}
                animationType="slide"
                transparent={true}
                visible={searchModal}
                onRequestClose={() => {setSearchModal(!searchModal);}}
            >
                <TouchableWithoutFeedback  onPress={()=>setSearchModal(false)}>
                    <ModalView>
                        <View style={{width: '90%'}}>
                            <SearchModal getModal={getSearchModal}
                                        getData={getData}
                                        search={search}/>
                        </View>
                    </ModalView>
                </TouchableWithoutFeedback>
            </Modal>
        </PaperProvider>
    );
}

export default PackageScreen_2;

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