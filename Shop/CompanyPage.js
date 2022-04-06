import React from 'react';
import styled from 'styled-components/native';
import { View, Alert, TouchableOpacity, Image } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
//pages
import IntroducePage from './IndroducePage';
import GalleryPage from './GalleryPage';
import ReviewPage from './ReviewPage';
import ProductPage from './ProductPage';
//components
import Background from "../components/Background";
import { MainText, MenuTitleText, MenuContentText, JuaText, NotoSansText } from "../components/TextStyle";
import TopBox from "../components/TopBox";
//constants
import AppWindow from '../constants/AppWindow';
import Color from '../constants/Color';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';

const TAB_HEIGHT = 50;
const Tab = createMaterialTopTabNavigator();

function CompanyPage(props){
    const [totalFirst, setTotalFirst] = React.useState(false);
    const [shopData, setShopData] = React.useState({companyName: '',companyImg: ''});
    const [companyId, setCompanyId] = React.useState(props.route.params.companyId);
    const [isLoading, setIsLoading] = React.useState(true);
        
    React.useEffect(()=>{
        getData()
    },[]);

    async function getData(){
        try{
            setIsLoading(true);
            const auth = await checkJwt();
            if(auth !== null){
                const response = await axios({
                    method: 'GET',
                    url : `${server.url}/api/companyinfo/${companyId}`,
                    headers : {Auth: auth},
                })
                const rawData = response.data.data;
                // console.log(rawData);
                const newData = {
                companyName : rawData.company_name,
                companyImg : rawData.backgroundImageUrl,
                }
                setShopData(newData);
                setIsLoading(false);
            }
            else{
                console.log("no login");
            }
        }
        catch{e=>{
            //console.log(e);
            Alert.alert(
                '정보 조회 오류',
                '다시 시도해주세요.',
                [
                    {text: '확인', onPress: () => {props.navigation.goBack();}},
                ],
                { cancelable: false }
            );}
        }  
    }

    const Top = ()=>{
        return(
            <TopBox topbar={<TopBar/>}>
                <Image source={require('../resource/img_character_icon.png')} style={{width: 60, height: 60, marginBottom: 10}} resizeMode={'contain'}/>
                <MainText>{shopData.companyName}</MainText>
            </TopBox>
        )
    }

    const TopBar = () => {
        return(
            <View style={{width: '100%', height: '100%', paddingRight: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                <TouchableOpacity style={{padding: 5, marginLeft: 15}} onPress={()=>{}}>
                    <Icon name="close" size={23} color={Color.mainText}></Icon>
                </TouchableOpacity>
            </View>
        )
    };
    return (
        <Background topbox={<Top/>}>
            <View style={{flex: 1}}>
                <Tab.Navigator backBehavior={'none'} screenOptions={{ swipeEnabled: true, 
                                                                    tabBarIndicatorStyle: {backgroundColor: 'white'},
                                                                    tabBarActiveTintColor: 'black',
                                                                    tabBarInactiveTintColor: Color.main,
                                                                    tabBarContentContainerStyle: {height: 50}, 
                                                                    tabBarLabelStyle: {fontWeight: 'bold', fontFamily: 'NotoSansKR-Medium'},
                                                                    }}>
                    <Tab.Screen name="#소개" children={({navigation})=><IntroducePage name={'소개'} navigation={navigation} companyId={companyId}/>}/>
                    <Tab.Screen name="#작업갤러리" children={({navigation})=><GalleryPage name={'작업 갤러리'} navigation={navigation} companyId={companyId}/>}/>
                    <Tab.Screen name="#취급상품" children={({navigation})=><ProductPage name={'취급상품'} navigation={navigation} companyId={companyId}/>}/>
                    <Tab.Screen name="#리뷰" children={({navigation})=><ReviewPage name={'리뷰'} navigation={navigation} companyId={companyId}/>}/>
                    
                </Tab.Navigator> 
            </View>
        </Background>
    )
}

export default CompanyPage;