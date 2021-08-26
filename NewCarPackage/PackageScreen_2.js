import React from 'react';
import styled from 'styled-components';
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
//constants
import AppWindow from '../constants/AppWindow';
import Color from '../constants/Color';
import { join } from 'lodash';
//function
import store from '../function/store';
import fetch from '../function/fetch';

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
    width: 100%;
    flex: 1;
    align-items : center;
    justify-content: center;
    padding: 10px;
`;
const Result = styled.View`
    flex: 1;
    align-items : center;
    justify-content: space-around;
`;
const ModalView=styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0,0.5);
`;

const DATA={
    name: 'AVANTE',
    image: require('../resource/Avante.png'),
};
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

    React.useEffect( async ()=>{
        console.log('setting Page1');
        await fetch('BidOrder')
        .then(res=>{
            if(res !== null && res.carName !== null) {               
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
        if(search !== '' && search !== null){ //검색을 했을 때
            if(result === null){
                return(
                    <ActivityIndicator size = 'large' color= {Color.main}/>
                );
            }
            else{
                return(
                    <Result>
                        <Text style={{fontSize: 50, fontWeight: 'bold'}}>{result.name}</Text>
                        <Image source={result.image} resizeMode='cover'/>
                    </Result>
                );
            }
        }
        else {
            return(<></>);
        }
    }

    function getSearchModal(close){
        setSearchModal(close);
    }
    function getValue(name){
        setSearch(name);
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
        if(currentOrder === null){ //async에 아무것도 없을 때
            if(result !== null){
                let newOrder = BidOrderList;
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
        else{
            currentOrder.carName = result.name;
            await store('BidOrder', currentOrder);
            props.navigation.navigate("PackageScreen_3");
        }
        //for check
        await fetch('BidOrder')
            .then(res => {
                console.log(res);
            })
            .catch(e => {
                console.log(e);
            });
    }

    return(
        <PaperProvider>
            <TotalView TotalView color={'white'} notchColor={'white'}>
                <IntroView>
                    <Intro>
                        <IntroText>시공을 원하시는</IntroText>
                        <IntroText style={{marginTop: 10}}>차량을 입력해주세요.</IntroText>
                    </Intro>
                </IntroView>
                <ContentView>
                    <SearchBar onPress={()=>{setSearchModal(true)}}>
                        <Text style={{marginLeft: 10, fontSize: 20}}>{result !== null ? result.name : ''}</Text>
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
            </TotalView>
            <Modal
                    animationType="slide"
                    transparent={true}
                    visible={searchModal}
                    onRequestClose={() => {
                    setSearchModal(!searchModal);
                    }}
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