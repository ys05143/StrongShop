import React from 'react';
import { View, Alert, ActivityIndicator, Linking } from 'react-native';
import NaverMapView, {Circle, Marker, Path, Polyline, Polygon} from "react-native-nmap";
import styled from 'styled-components/native';
import { useIsFocused } from '@react-navigation/native';
import Icon from "react-native-vector-icons/Ionicons";
//constants
import AppWindow from '../constants/AppWindow';
import { MainText, MenuTitleText, MenuContentText, JuaText, NotoSansText } from "../components/TextStyle";
import Color from '../constants/Color';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';

const HOMEINDICATOR = AppWindow.HomeIndicator;
const DATA = {
    introduceText : null,
    coord : {latitude: 0, longitude: 0},
    region : null,
    blogUrl: null,
    siteUrl: null,
    snsUrl: null,
    phoneNum: null,
}

const Box = styled.View`
    width: 95%;
    flex: 1;
    border: 2px solid ${Color.menuBorder};
    background-color: ${Color.menuBackgrund};
    border-radius: 5px;
`;
const MenuTitle = styled.View`
    width: 100%;
    height: 35px;
    background-color: white;
    align-items: center;
    justify-content: center;
    border-bottom-color: ${Color.menuTitleBorder};
    border-bottom-width: 2px;
    flex-direction: row;
`;
const MenuContent = styled.ScrollView`
    width: 100%;
`;
const MapView = styled.View`
    width: 95%;
    height: 300px;
`;
const AddressView = styled.View`
    width: 100%;
    margin-top: 10px;
    padding: 15px;
    align-items: center;
`;

const RegionView = styled.View`
    width: 100%;
    align-items: center;
    margin-top: 10px;
    border: 2px;
    border-color: ${Color.main};
    border-radius: 5px;
    padding: 5px 0px;;
`;
const LinkView = styled.TouchableOpacity`
    height: 50px;
    width: 100%;
    border-radius: 5px;
    flex-direction: row;
    align-items: center;
    background-color: white;
    padding: 0px 15px;
    margin-top: 10px;
    border: 2px;
    border-color: ${Color.main};
`;

function IntroducePage(props){

    const [isLoading, setIsLoading] = React.useState(false);
    const [infoData, setInfoData] = React.useState(DATA);
    
    const isFocused = useIsFocused();
    React.useEffect(()=>{
        getData();
    },[]);

    async function getData(){
        try{
            setIsLoading(true);
            const auth = await checkJwt();
            if(auth !== null){
                const response = await axios({
                    method: 'GET',
                    url : `${server.url}/api/companyinfo/${props.companyId}`,
                    headers : {Auth: auth},
                })
                console.log("load introduce");
                const rawData = response.data.data;
                const newData = {
                    introduceText : rawData.introduction,
                    coord : {latitude: parseFloat(rawData.latitude), longitude: parseFloat(rawData.longitude)},
                    region : rawData.address+' '+rawData.detailAddress,
                    blogUrl: rawData.blogUrl,
                    siteUrl: rawData.siteUrl,
                    snsUrl: rawData.snsUrl,
                    phoneNum: rawData.contact,
                }
                setInfoData(newData);
                setIsLoading(false);
            }
            else{
                console.log("no login");
            }
        }
        catch{e=>{
            //console.log(e);
            Alert.alert(
                '업체 소개 조회 오류',
                '다시 시도해주세요.',
                [
                    {text: '확인', onPress: () => {}},
                ],
                { cancelable: false }
            );}
        }  
    }

    function MoveToUrl(url){
        if(url === null) return;
        if(url.startsWith('http')){
            Linking.openURL(url);
        }
        else{
            Linking.openURL('https://'+url);
        }

    }
    function MoveToInstagram(id){
        if(id === null) return;
        Linking.openURL('instagram://user?username='+id)
        .catch((e) => {
            console.log(e);
            Linking.openURL('https://www.instagram.com/'+id);
        })
    }
    function MoveToCall(phone){
        if(phone === null) return;
        Linking.openURL('tel:'+phone);
    }

    return(
        <View style={{flex: 1, alignItems: 'center', backgroundColor: 'white', paddingBottom: HOMEINDICATOR, paddingTop: 20}}>
            <Box>
                <MenuTitle>
                    <MenuTitleText>업체소개</MenuTitleText>
                </MenuTitle>
                <MenuContent contentContainerStyle={{alignItems: 'center'}} showsVerticalScrollIndicator={false}>
                    <View style={{width: '80%', alignItems: 'center', paddingTop: 20, paddingBottom: 10}}>
                        <NotoSansText style={{fontSize: 15}}>{infoData.introduceText}</NotoSansText>
                    </View>
                    <View style={{width: '95%', alignItems: 'center'}}>
                        {infoData.phoneNum !== null && 
                            <LinkView  onPress={()=>{MoveToCall(infoData.phoneNum)}}>
                                <Icon name={'call-outline'} size={20} style={{marginRight: 10}} color={Color.main}/>
                                <NotoSansText style={{fontSize: 15, color: '#747474'}}>{infoData.phoneNum}</NotoSansText>
                            </LinkView>}
                        {infoData.siteUrl !== null && 
                            <LinkView onPress={()=>{MoveToUrl(infoData.siteUrl)}}>
                                <Icon name={'globe-outline'} size={20} style={{marginRight: 10}} color={Color.main}/>
                                <NotoSansText style={{fontSize: 15, color: '#747474'}}>{infoData.siteUrl}</NotoSansText>
                            </LinkView>}
                        {infoData.blogUrl !== null && 
                            <LinkView onPress={()=>{MoveToUrl(infoData.blogUrl)}}>
                                <Icon name={'link-outline'} size={20} style={{marginRight: 10}} color={Color.main}/>
                                <NotoSansText style={{fontSize: 15, color: '#747474'}}>{infoData.blogUrl}</NotoSansText>
                            </LinkView>}
                        {infoData.snsUrl !== null && 
                            <LinkView onPress={()=>{MoveToInstagram(infoData.snsUrl)}}>
                                <Icon name={'logo-instagram'} size={20} style={{marginRight: 10}} color={Color.main}/>
                                <NotoSansText style={{fontSize: 15, color: '#747474'}}>{'@'+infoData.snsUrl}</NotoSansText>
                            </LinkView>}
                    </View>
                    {isFocused && 
                    <AddressView>
                        <JuaText style={{fontSize: 18}}>위치</JuaText>
                        <View style={{width: '100%', alignItems: 'center'}}>
                            <RegionView>
                                <NotoSansText style={{fontSize: 13, color: '#747474'}}>{infoData.region}</NotoSansText>
                            </RegionView>
                            <MapView>
                                <NaverMapView style={{width: '100%', height: '100%'}}
                                                    scrollGesturesEnabled={true}
                                                    showsMyLocationButton={true}
                                                    center={{...infoData.coord, zoom: 16}}>
                                    <Marker coordinate={infoData.coord} onClick={() => console.warn('onClick! marker')}/>
                                </NaverMapView>
                            </MapView>
                        </View>
                    </AddressView>}
                </MenuContent>
            </Box>
        </View>
    )
}

export default IntroducePage;