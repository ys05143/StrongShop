import React from 'react';
import styled from 'styled-components/native';
import { Avatar, Card, Divider } from 'react-native-paper';
import { Text,Image, FlatList,View, Animated, PanResponder, Alert, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import AppWindow from '../constants/AppWindow';
import { useIsFocused } from '@react-navigation/native';
//component
import Row from '../components/Row';
//constant
import Color from '../constants/Color';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;

const TAB_HEIGHT = 50;
const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const Total = styled.View`
    width: 100%;
    padding-top: 10px;
    align-items: center;
    flex: 1;
`;
const ReviewView = styled.View`
    width: ${WIDTH*0.9}px;
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

// const AfterDATA=[{
//     reviewId:1,
//     name: '공진우',
//     images : 'https://www.netcarshow.com/Hyundai-Kona_Electric-2021-1280-03.jpg',
//     text: '너무 친절하게 잘 해주셨습니다.',
//     profileImg: require('../resource/character1.png'),
// },{
//     reviewId:2,
//     name: '김영우',
//     images: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
//     text: '그냥 그래요',
//     profileImg: null,
// },{
//     reviewId:3,
//     name: '이승진',
//     images: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
//     text: '다음차도 여기서 하고싶어요!',
//     profileImg: require('../resource/character3.png'),
// },{
//     reviewId:4,
//     name: '허지훈',
//     images: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
//     text: '불친절한 직원이 있습니다.',
//     profileImg: require('../resource/character4.png'),
// }];

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

function ReviewList(props){
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [reviewData, setReviewData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    
    const isFocused = useIsFocused();
    React.useEffect(()=>{
        if(isFocused) getData();
    },[isFocused]);

    async function getData(){
        try{
            setIsLoading(true);
            const auth = await checkJwt();
            if(auth !== null){
                const response = await axios({
                    method: 'GET',
                    url : `${server.url}/api/review/${props.companyId}`,
                    headers : {Auth: auth},
                }).catch(e=>{console.log(e)})
                const rawData = response.data.data;
                //console.log('review',rawData);
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
    
    //const [first, setFirst] = React.useState(props.totalFirst);
    //const [last, setLast] = React.useState(false);
    //const scrollY = React.useRef(new Animated.Value(0)).current; 
    // const pan = React.useRef(props.Pan).current;

    // React.useEffect(()=>{
    //     setFirst(props.totalFirst);
    //     setLast(false);
    // },[props.totalFirst]);

    // const panResponder = PanResponder.create({
    //     onStartShouldSetPanResponder: () => true,
    //     onPanResponderGrant: () => {
    //     if(first){
    //         pan.setValue({
    //             x: 0,
    //             y: 0
    //         })
    //         pan.setOffset({
    //             x: 0,
    //             y: first === true? 0 : -HEADER_SCROLL_DISTANCE
    //         });
    //     }
    //     if(last){
    //         pan.setValue({
    //             x: 0,
    //             y: 0
    //         })
    //         console.log(first);
    //         pan.setOffset({
    //             x: 0,
    //             y: last === true?  -HEADER_SCROLL_DISTANCE : 0
    //         });         
    //     }},
    //     onPanResponderMove: Animated.event([
    //     null,
    //     {
    //         dx: pan.x,
    //         dy: pan.y,
    //     },
    //     ],{
    //         useNativeDriver: false,
    //         listener: (e)=>{props.getPan(pan);}
    //     }),
    //     onPanResponderRelease: () => {
    //     if(first){
    //         Animated.spring(
    //         pan, // Auto-multiplexed
    //         { toValue: { x: 0, y: first === true ? -HEADER_SCROLL_DISTANCE : 0 },
    //             useNativeDriver: true } // Back to zero
    //         ).start();
    //         props.getTotalFirst(false);
    //         //setFirst(false);
    //     }
    //     if(last){
    //         Animated.spring(
    //         pan, // Auto-multiplexed
    //         { toValue: { x: 0, y: last === true ? HEADER_SCROLL_DISTANCE : 0 },
    //             useNativeDriver: true } // Back to zero
    //         ).start();
    //         setLast(false);
    //         props.getTotalFirst(true);
    //         //setFirst(true);
    //     }
    //     },
    // });

    function renderItem({item}){ //구버전 review
        return(
            <View style={{width: WIDTH, alignItems: 'center', marginBottom: 10}}>
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
                        <Text>{item.content}</Text>
                    </Content>
                    <Divider style={{backgroundColor: 'black', height: 2, marginTop: 5, width: '100%'}}/>
                    <Content>
                        <Row style={{alignItems: 'center', marginBottom: 5}}>
                            <Avatar.Icon size={24} icon="face" color={'white'} backgroundColor={Color.main}/>
                            <View style={{justifyContent: 'center', paddingLeft: 5}}>
                                <Text style={{fontWeight: 'bold', marginBottom: 5}}>{'사장님의 답변:'}</Text>
                            </View>
                        </Row>
                        <Text>{item.reply === null ? '': item.reply}</Text>
                    </Content>
                </ContentView>
            </ReviewView>
            </View>
        );
    }

    return(
        <Total>
            {!isLoading ? <View>
                <FlatList data={reviewData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.reviewId}
                    nestedScrollEnabled={true}
                    scrollEnabled={true}
                    onRefresh={()=>{console.log("refresh")}}
                    refreshing={isRefreshing}
                    />
            </View>:
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent'}}>
                <ActivityIndicator size = 'small' color= {Color.main}/>
            </View>}
        </Total>
    )
}

export default ReviewList;