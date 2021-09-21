import React from 'react';
import styled from 'styled-components/native';
import { Text, Image, StyleSheet, Modal, View, ActivityIndicator, Alert } from 'react-native';
import Icon  from "react-native-vector-icons/Ionicons";
import { Button, Dialog, Portal, Paragraph, Provider as PaperProvider } from 'react-native-paper';
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
const SearchBar = styled.TouchableOpacity`
    flex-direction: row;
    background-color: #D5D5D5;
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

function PackageScreen_2 (props) {
    const [search, setSearch] = React.useState(null); //modal로 부터 받은 차량 검색어
    const [searchModal, setSearchModal] = React.useState(false);
    const [result, setResult] = React.useState(null); //서버에 요청하여 받은 이름/이미지 객체
    const [existingDialog, setExistingDialog] = React.useState(false);
    const [start, setStart] = React.useState(false);
    
    const hideDialog = () => setExistingDialog(false);

    React.useEffect( ()=>{
        fetch('BidOrder')
        .then(res=>{
            if(res !== null && res.carName !== null) {   
                console.log('In page 2 useEffect: ', res);         
                getValue(res.carName);
            }
        })
        .catch(e=>{
            console.log(e);
        });
    },[]);

    async function CancelExisting(){
        await AsyncStorage.removeItem('BidOrder', ()=>{
            setSearch(null);
            setResult(null);
            setExistingDialog(false);
        });
    }
    async function OKExisting(){
        
        await fetch('BidOrder')
        .then(res=>{
            if(res.processPage === 1){
                setExistingDialog(false);
            }
            else if(res.processPage === 2){
                props.navigation.navigate("PackageScreen_3");
                setExistingDialog(false);
            }
            else if(res.processPage === 3){
                props.navigation.navigate("PackageScreen_4");
                setExistingDialog(false);
            }
        })
        .catch(e=>{
            console.log(e);
            setExistingDialog(false);
        });
    }

    function PrintResult(){
        if(result === null){
            if(search !== null){
                return(
                    <ActivityIndicator size = 'large' color= {Color.main}/>
                );
            }
            else{
                return(<></>);
            }
        }
        else{
            return(
                <Result>
                    <Text style={{fontSize: 50, fontWeight: 'bold'}}>{result.name}</Text>
                    <Image source={{uri: result.image}} style={{width: '100%', height: 200}}/>
                </Result>
            );
        }
    }

    function getSearchModal(close){
        setSearchModal(close);
    }
    function getValue(name){
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
            setResult(DATA);
        }
        else{
            setResult(null);
        }
    }

    async function storeCarName() {
        let currentOrder = null;
        await fetch('BidOrder')
        .then(res => {
            if(res !== null){
                currentOrder = {...res};
            }
        })
        .catch(e => {
            console.log(e);
        });
        if(currentOrder !== null) { //asycn에 저장된 데이터 때문에 왔을 때
            if(currentOrder.carName === result.name){
                props.navigation.navigate("PackageScreen_3");
            }
            else{
                let newOrder = {...BidOrderList};
                newOrder.processPage = 1;
                newOrder.carName = result.name;
                await store('BidOrder', newOrder);
                props.navigation.navigate("PackageScreen_3");
            }
        }
        else{ //async에 저장 없을 때
            if(result !== null){
                let newOrder = {...BidOrderList};
                newOrder.processPage = 1;
                newOrder.carName = result.name;
                await store('BidOrder', newOrder);
                props.navigation.navigate("PackageScreen_3");
            }
            else{
                Alert.alert(
                    '경고',
                    '차량을 입력해주세요.',
                    [
                      {text: 'OK', onPress: () => {}},
                    ],
                    { cancelable: false }
                  );
            }
        }
        //for check
        await fetch('BidOrder')
            .then(res => {
                console.log('In page 2 check: ', res);
            })
            .catch(e => {
                console.log(e);
            });
    }

    return(
        <PaperProvider>
            <TotalView color={'white'} notchColor={'white'}>
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
                        <PrintResult/>
                    </ResulView>
                    <BtnView>
                        <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                            <Button mode={"contained"} onPress={() => {props.navigation.navigate("PackageScreen_1")}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>취소</Button>
                            <Button mode={"contained"} onPress={() => {storeCarName();}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>다음</Button>
                        </Row>
                    </BtnView>
                </ContentView>
                <View style={{position: 'absolute', width: '100%', alignItems: 'flex-end', paddingTop: 5, paddingRight: 5}}>
                    <Icon name="close-outline" size={35} color={'black'} onPress={()=>{props.navigation.navigate("PackageScreen_1")}}></Icon>
                </View>
            </TotalView>
            <Modal
                    animationType="slide"
                    transparent={true}
                    visible={searchModal}
                    onRequestClose={() => {setSearchModal(!searchModal);}}
                >
                    <ModalView>
                        <View style={{width: '90%'}}>
                            <SearchModal getModal={getSearchModal}
                                        getValue={getValue}
                                        search={search}/>
                        </View>
                    </ModalView>
            </Modal>
            <Portal>
                <Dialog visible={existingDialog} onDismiss={hideDialog}>
                    <Dialog.Content>
                        <Paragraph>{'이전의 자료가 있습니다.\n이어서 하시겠습니까?'}</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button mode="outlined" onPress={() => {CancelExisting()}}>Cancel</Button>
                        <Button mode="outlined" onPress={() => {OKExisting()}}>Ok</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            
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