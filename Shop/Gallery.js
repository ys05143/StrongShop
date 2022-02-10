import React from 'react';
import styled from 'styled-components/native';
import { Text, View, Image, Animated,ScrollView, PanResponder, ActivityIndicator, Easing, FlatList, Alert } from 'react-native';
import AppWindow from '../constants/AppWindow';
import FastImage from 'react-native-fast-image';
import { useIsFocused } from '@react-navigation/native';
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

//flatlist 이기때문에 추가로 데이터들이 더 필요하다. 일정 갯수만큼 스크롤이 하단에 다다르면 서버에 요청해야함.
const AfterDATA = [{
    galleryId: 1,
    thumbnail : 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
},{
    galleryId: 2,
    thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
},{
    galleryId: 3,
    thumbnail : 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
},{
    galleryId: 4,
    thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
},{
    galleryId: 5,
    thumbnail : 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
},{
    galleryId: 6,
    thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
},{
    galleryId: 7,
    thumbnail : 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
},{
    galleryId: 8,
    thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
},{
    galleryId: 9,
    thumbnail : 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
},{
    galleryId: 10,
    thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
},{
    galleryId: 11,
    thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
},{
    galleryId: 12,
    thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
},{
    galleryId: 13,
    thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
},{
    galleryId: 14,
    thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
},{
    galleryId: 15,
    thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
},{
    galleryId: 16,
    thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
},{
    galleryId: 17,
    thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
},{
    galleryId: 18,
    thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
},{
    galleryId: 19,
    thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
},{
    galleryId: 20,
    thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
},{
    galleryId: 21,
    thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
},{
    galleryId: 22,
    thumbnail : 'https://www.hyundai.com/contents/vr360/DN08/exterior/NB9/001.png',
}];

const ImageView = styled.TouchableOpacity`
    width: ${(WIDTH/3)-6}px;
    height: ${(WIDTH/3)-6}px;
    background-color: #ffffff;
    padding: 1px;
    margin-left: 1px;
    margin-right: 1px;
`;
const Total = styled.View`
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

function Gallery(props){
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

    // const [first, setFirst] = React.useState(props.totalFirst);
    // const [last, setLast] = React.useState(false);
    //const scrollY = React.useRef(new Animated.Value(0)).current; 
    //const pan = React.useRef(props.Pan).current;

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
        <Total>
            {!isLoading ? <View style={{flex: 1}}>
                <FlatList
                    data={galleryData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.galleryId}
                    numColumns={3}
                    scrollEnabled={true}
                    onRefresh={()=>{console.log("refresh")}}
                    refreshing={isRefreshing}
                    />
            </View>:
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent'}}>
                <ActivityIndicator size = 'small' color= {Color.main}/>
            </View>}
        </Total>
    );
}

export default Gallery;