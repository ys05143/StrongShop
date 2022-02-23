import React from 'react';
import styled from 'styled-components/native';
import { Text, Image, StyleSheet, Modal, View, ActivityIndicator, Alert, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import Icon  from "react-native-vector-icons/Ionicons";
import { Button, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
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
import { userContext } from '../function/Context';

const WIDTH = AppWindow.width;
///////////////////////////////
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
const ContentView = styled.View`
    flex: 5;
    align-items : center;
    justify-content: space-between;
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
    const [isLoading, setIsLoading] = React.useState(true); //로딩중...
    const [carName, setCarName] = React.useState(null);
    const context = React.useContext(userContext);

    const isFoucused = useIsFocused();
    React.useEffect(() => {
        if(isFoucused){
            setIsLoading(true);
            if(context.newCarPackageSearch === null){
                storage.fetch('BidOrder')
                .then(response => {
                    if(response != null){
                        if(response.carName !== null){
                            console.log('In page 2 useEffect: ', response);  
                            context.setNewCarPackageSearch(response.carName);
                            setCarName(response.carName);
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
                        setIsLoading(false);
                    }
                    else{
                        setIsLoading(false);
                    }
                })
                .catch(error=>{
                    console.log(error);
                })
            }
            else{
                setCarName(context.newCarPackageSearch);
                setIsLoading(false);
            }
        }
        else{
            context.setNewCarPackageSearch(null);
        }
    }, [isFoucused]);

    function getSearchModal(close){
        setSearchModal(close);
    }

    async function storeCarName(){
        try{
            if(carName !== null){
                let newOrder = null;
                const response = await storage.fetch('BidOrder');
                if(response !== null){
                    newOrder = {...response};
                    if(newOrder.processPage <= 1) newOrder.processPage = 1;
                }
                else{
                    newOrder = {...BidOrderList};
                    newOrder.processPage = 1;
                }
                newOrder.carName = carName;
                await storage.store('BidOrder', newOrder);
                context.setNewCarPackageSearch(null);
                props.navigation.navigate("PackageScreen_3");
            }
            else {
                Alert.alert(
                    '차량을 입력해주세요.',
                    '',
                    [
                        {text: '확인', onPress: () => {}},
                    ],
                    { cancelable: false }
                    );
            }
        }
        catch(error){
            console.log(error);
            cancelCarName();
        }
    }

    function cancelCarName(){
        //지금 까지의 입력 싹 다 취소
        setSearch(null);
        context.setNewCarPackageSearch(null);
        setCarName(null);
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
            '입력을 중단하겠습니까?',
            '현재 페이지에 입력된 내용은 저장되지 않습니다.',
            [
                {text: '취소', onPress: () => {}},
                {text: '확인', onPress: () => {
                    //지금 까지의 입력 싹 다 취소
                    setSearch(null);
                    context.setNewCarPackageSearch(null);
                    setCarName(null);
                    AsyncStorage.removeItem('BidOrder')
                        .then(() => {
                            console.log('remove bidOrder Async');
                            props.navigation.navigate("MainScreen");
                        })
                        .catch(error => {
                            console.log(error);
                        })
                }},
            ],
            { cancelable: true }
        );
    }

    return(
        // <PaperProvider>
        //     <TotalView color={'white'} notchColor={'white'} homeIndicatorColor={'white'}>
                
        //         <View style={{flex:1, alignItems: 'center'}}>
        //             <SearchBar onPress={()=>{props.navigation.navigate("SearchScreen", {topic: 'NewCarPackage'})}} style={{marginTop: 20}}>
        //             <Text style={{marginLeft: 10, fontSize: 20}}>{carName !== null ? carName : ''}</Text>
        //                 <Icon name="search-outline" size={30} style={{marginRight: 10}} ></Icon>
        //             </SearchBar>
        //         </View>
        //         <View style={{alignItems: 'center'}}>
        //             <IntroView>
        //                 <IntroText>{'시공을 원하는\n차종을 입력해주세요.'}</IntroText>
        //             </IntroView>
        //         </View>
        //         {/* <ContentView>
        //             <SearchBar onPress={()=>{props.navigation.navigate("SearchScreen", {topic: 'NewCarPackage'})}}>
        //                 <Text style={{marginLeft: 10, fontSize: 20}}>{carName !== null ? carName : ''}</Text>
        //                 <Icon name="search-outline" size={30} style={{marginRight: 10}} ></Icon>
        //             </SearchBar>
        //             <ResulView>
        //                 {!isLoading ? <Result/> : <ActivityIndicator size = 'large' color= {Color.main} style={{marginTop: 10}}/>}
        //             </ResulView>
        //             <BtnView>
        //                 <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
        //                     <Button mode={"contained"} onPress={() => {askCancelCarName();}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main}>취소</Button>
        //                     <Button mode={"contained"} onPress={() => {storeCarName();}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main}>입력완료</Button>
        //                 </Row>
        //             </BtnView>
        //         </ContentView> */}
        //         <BtnView>
        //             <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
        //                 <Button mode={"contained"} onPress={() => {askCancelCarName();}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main}>취소</Button>
        //                 <Button mode={"contained"} onPress={() => {storeCarName();}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main}>입력완료</Button>
        //             </Row>
        //         </BtnView>
        //         <View style={{position: 'absolute', width: '100%', alignItems: 'flex-end', paddingTop: 5, paddingRight: 5}}>
        //             <TouchableOpacity onPress={()=>{askCancelCarName();}}>
        //                 <Icon name="close-outline" size={35} color={'black'}></Icon>
        //             </TouchableOpacity>    
        //         </View>
        //     </TotalView>
        // </PaperProvider>
        <TotalView color={'white'} notchColor={'white'} homeIndicatorColor={'white'}>
            <View style={{width: '100%', alignItems: 'flex-end', paddingTop: 5, paddingRight: 5}}>
                <TouchableOpacity onPress={()=>{askCancelCarName();}}>
                    <Icon name="close-outline" size={35} color={'black'}></Icon>
                </TouchableOpacity>    
            </View>
            <View style={{alignItems: 'center'}}>
                <IntroView>
                <IntroText>{'시공을 원하는\n차종을 입력해주세요.'}</IntroText>
                </IntroView>
            </View>
            {/* <Text style={{marginLeft: 10, marginBottom: 10, fontSize: 25, fontWeight: 'bold'}}>{'케어을 원하시는\n차종을 입력해주세요.'}</Text>   */}
            <View style={{flex:1, alignItems: 'center'}}>
                <SearchBar onPress={()=>{props.navigation.navigate("SearchScreen", {topic: 'NewCarPackage'})}} style={{marginTop: 20}}>
                    <Text style={{marginLeft: 10, fontSize: 20}}>{carName !== null ? carName : ''}</Text>
                    <Icon name="search-outline" size={30} style={{marginRight: 10}} ></Icon>
                </SearchBar>
            </View>
            <BtnView>
                <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                    <Button mode={"contained"} onPress={() => {askCancelCarName();}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main}>이전</Button>
                    <Button mode={"contained"} onPress={() => {storeCarName()}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main}>입력완료</Button>
                </Row>
            </BtnView>
            {isLoading && <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', position: 'absolute', backgroundColor: 'rgba(0,0,0,0.3)'}}>
                <ActivityIndicator size = 'large' color= {Color.main}/>
            </View>}
        </TotalView>
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