import React from 'react';
import styled from 'styled-components/native';
import { View, ActivityIndicator, FlatList, Alert } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useIsFocused } from '@react-navigation/native';
//components
import { MainText, MenuTitleText, MenuContentText, JuaText, NotoSansText } from "../components/TextStyle";
//constant
import Color from '../constants/Color';
import AppWindow from '../constants/AppWindow';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';

const HOMEINDICATOR = AppWindow.HomeIndicator;

const WIDTH = AppWindow.width;

const ImageView = styled.TouchableOpacity`
    width: ${((WIDTH*0.95)/3)}px;
    height: ${((WIDTH*0.95)/3)}px;
    background-color: #ffffff;
`;
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
const MenuContent = styled.View`
    flex: 1;
`;

const DATA = [{
    content: "", 
    createdTime: "", 
    galleryId: 0, 
    imageUrls: [{
        galleryId: 0, 
        id: 0, 
        imageUrl: ""
    }]
}];

function GalleryPage(props){
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [galleryData, setGalleryData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

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
                    url : `${server.url}/api/gallery/${props.companyId}`,
                    headers : {Auth: auth},
                })
                const rawData = response.data.data;
                console.log("load gallery");
                let newData = [];
                rawData.map(item => {
                    newData.push({ 
                        content: item.content, 
                        createdTime: item.createdTime, 
                        galleryId: item.id, 
                        imageUrls: item.imageUrls,
                    });
                })
                setGalleryData(newData);
                setIsLoading(false);
            }
            else{
                console.log("no login");
            }
        }
        catch{e=>{
            //console.log(e);
            Alert.alert(
                '갤러리 조회 오류',
                '다시 시도해주세요.',
                [
                    {text: '확인', onPress: () => {}},
                ],
                { cancelable: false }
            );}
        }  
    }

    async function showDetail(id){
        try{
            const selectedGallery = findGalleyContents(galleryData, id);
            props.navigation.navigate("DetailGallery", {contents: selectedGallery.imageUrls, text: selectedGallery.content});
            return 0;
        }
        catch (error){
            console.log(error);
            return -1;
        }
    }

    const renderItem = ({ item }) => { 
        return(
            <ImageView onPress={()=>{showDetail(item.galleryId);}}>
                <FastImage style={{height:'100%',width:'100%',}} source={{uri:item.imageUrls[0].imageUrl}} resizeMode='contain'/>
            </ImageView>
        );
    };

    function findGalleyContents(array, id){
        const result = array.filter(item => item.galleryId === id);
        return result[0];
    }


    return(
        <View style={{flex: 1, alignItems: 'center', backgroundColor: 'white', paddingBottom: HOMEINDICATOR, paddingTop: 20}}>
            <Box>
                <MenuTitle>
                    <MenuTitleText>작업갤러리</MenuTitleText>
                </MenuTitle>
                <MenuContent>
                    <FlatList
                        data={galleryData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.galleryId}
                        numColumns={3}
                        scrollEnabled={true}
                        onRefresh={()=>{getData();}}
                        refreshing={isRefreshing}
                        showsVerticalScrollIndicator={false}
                        />
                </MenuContent>
            </Box>
        </View>
    );
}

export default GalleryPage;