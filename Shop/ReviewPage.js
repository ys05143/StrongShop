import React from 'react';
import styled from 'styled-components/native';
import { Avatar, Divider } from 'react-native-paper';
import { Text, FlatList, View, Alert, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import AppWindow from '../constants/AppWindow';
import { useIsFocused } from '@react-navigation/native';
//component
import Row from '../components/Row';
import { MainText, MenuTitleText, MenuContentText, JuaText, NotoSansText } from "../components/TextStyle";
//constant
import Color from '../constants/Color';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';

const HOMEINDICATOR = AppWindow.HomeIndicator;

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

const ReviewView = styled.View`
    width: 95%;
    border-radius: 5px;
    background-color: white;
    padding-bottom: 10px;
`;
const NameView = styled.View`
    width: 100%;
    height: 50px;
    padding-left: 10px;
    flex-direction: row;
    align-items: center;
`;
const ProfileImg = styled.View`
    width: 30px;
    height: 30px;
    border-radius: 50px;
    background-color: white;
    overflow: hidden;
`;
const Name = styled.Text`
    margin-left: 10px;
    font-weight: bold;
    font-family: NotoSansKR-Medium;
`;

const ContentView = styled.View`
    width: 100%;
    justify-content: center;
    align-items: center;
    padding-left: 5px;
    padding-right: 5px;
`;
const Content = styled.View`
    width: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 5px;
    padding-right: 5px;
`;
const ContentImg = styled.View`
    width: 100%;
    height: 300px;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    background-color: #e5e5e5;
`;

const DATA = [{ 
    companyId: 0, 
    content: '', 
    createdTime: '', 
    reviewId: 0, 
    imageUrls: [{
        galleryId: 0, 
        id: 0, 
        imageUrl: '',
    }], 
    rating: 0, 
    reply: '', 
    userNickName: '', 
    userThumbnailImage: '',
}]

function ReviewPage(props){
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [reviewData, setReviewData] = React.useState([]);
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
                    url : `${server.url}/api/review/${props.companyId}`,
                    headers : {Auth: auth},
                })
                const rawData = response.data.data;
                console.log("load review");
                let newData = [];
                rawData.map(item => {
                    newData.push({ 
                        content: item.content, 
                        createdTime: item.createdTime, 
                        reviewId: item.id, 
                        imageUrls: item.imageUrls,
                        rating: item.rating, 
                        reply : item.reply, 
                        userNickName: item.userNickName, 
                        userThumbnailImage: item.userThumbnailImage,
                    });
                })
                setReviewData(newData);
                setIsLoading(false);
            }
            else{
                console.log("no login");
            }
        }
        catch{e=>{
            //console.log(e);
            Alert.alert(
                '리뷰 조회 오류',
                '다시 시도해주세요.',
                [
                    {text: '확인', onPress: () => {}},
                ],
                { cancelable: false }
            );}
        }  
    }
    

    function renderItem({item}){ //구버전 review
        return(
            <View style={{width: '100%', alignItems: 'center', marginBottom: 15, padding: 5}}>
                <ReviewView key={item.reviewId}>
                    <NameView>
                        <ProfileImg>
                            <FastImage  source={item.userThumbnailImage === null ? require('../resource/default_profile.png') : {uri: item.userThumbnailImage.includes('https') ? item.userThumbnailImage : item.userThumbnailImage.replace('http', 'https')}} style={{height:'100%',width:'100%',}} resizeMode='contain'/>
                        </ProfileImg>
                        <Name>{item.userNickName}</Name>
                    </NameView>
                    <ContentView>
                        <ContentImg>
                            <FastImage source={{uri: item.imageUrls[0].imageUrl}} style={{width:'100%', height: '100%'}} resizeMode='cover'></FastImage>
                        </ContentImg>
                        <Content>
                            <NotoSansText>{item.content}</NotoSansText>
                        </Content>
                        <Divider style={{backgroundColor: 'black', height: 2, marginTop: 5, width: '100%'}}/>
                        <Content>
                            <Row style={{alignItems: 'center', marginBottom: 5}}>
                                <Avatar.Icon size={24} icon="face" color={'white'} backgroundColor={Color.main}/>
                                <View style={{justifyContent: 'center', paddingLeft: 5}}>
                                    <NotoSansText style={{fontWeight: 'bold', marginBottom: 5}}>{'사장님의 답변:'}</NotoSansText>
                                </View>
                            </Row>
                            <NotoSansText>{item.reply === null ? '': item.reply}</NotoSansText>
                        </Content>
                    </ContentView>
                </ReviewView>
            </View>
        );
    }

    return(
        <View style={{flex: 1, alignItems: 'center', backgroundColor: 'white', paddingBottom: HOMEINDICATOR, paddingTop: 20}}>
            <Box>
                <MenuTitle>
                    <MenuTitleText>리뷰</MenuTitleText>
                </MenuTitle>
                <MenuContent>
                    <FlatList data={reviewData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.reviewId}
                        nestedScrollEnabled={true}
                        scrollEnabled={true}
                        onRefresh={()=>{getData();}}
                        refreshing={isRefreshing}
                        showsVerticalScrollIndicator={false}
                        />
                </MenuContent>
            </Box>
        </View>
    )
}

export default ReviewPage;