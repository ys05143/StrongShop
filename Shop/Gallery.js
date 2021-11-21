import React from 'react';
import styled from 'styled-components/native';
import { Text, View, Image, Animated,ScrollView, PanResponder, ActivityIndicator, Easing, FlatList, Alert } from 'react-native';
import AppWindow from '../constants/AppWindow';
import { result } from 'lodash';
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
    width: ${WIDTH/3}px;
    height: ${WIDTH/3}px;
    background-color: #ffffff;
    padding: 1px;
`;
const Total = styled.View`
    width: 100%;
    align-items: center;
`;

const DATA = [{
    company_id: 1, 
    content: "ㅎㄹㅇ", 
    createdTime: "2021-11-19T23:00:32", 
    id: 3, 
    imageUrls: [{
        galleryId: 3, 
        id: 4, 
        imageUrl: "https://strongfilebucket.s3.ap-northeast-2.amazonaws.com/b574b391-f8af-4f95-876d-1cf71f0bd85b.jpg"
    }]
}, {
    company_id: 1, 
    content: "ㅎㄹㅇ", 
    createdTime: "2021-11-19T23:00:32", 
    id: 4, 
    imageUrls: [{
        galleryId: 3, 
        id: 4, 
        imageUrl: "https://strongfilebucket.s3.ap-northeast-2.amazonaws.com/b574b391-f8af-4f95-876d-1cf71f0bd85b.jpg"
    }]
}]

function Gallery(props){
    const [shopName, setShopName] = React.useState(props.shopName); //요청시 사용
    const scrollY = React.useRef(new Animated.Value(0)).current; 
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [galleryContents, setGalleryContents] = React.useState(props.gallery);

    const [first, setFirst] = React.useState(props.totalFirst);
    const [last, setLast] = React.useState(false);
    const pan = React.useRef(props.Pan).current;

    React.useEffect(()=>{
        setFirst(props.totalFirst);
        setLast(false);
    },[props.totalFirst]);

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
        if(first){
            pan.setValue({
                x: 0,
                y: 0
            })
            pan.setOffset({
                x: 0,
                y: first === true? 0 : -HEADER_SCROLL_DISTANCE
            });
        }
        if(last){
            pan.setValue({
                x: 0,
                y: 0
            })
            console.log(first);
            pan.setOffset({
                x: 0,
                y: last === true?  -HEADER_SCROLL_DISTANCE : 0
            });         
        }},
        onPanResponderMove: Animated.event([
        null,
        {
            dx: pan.x,
            dy: pan.y,
        },
        ],{
            useNativeDriver: false,
            listener: (e)=>{props.getPan(pan);}
        }),
        onPanResponderRelease: () => {
        if(first){
            Animated.spring(
            pan, // Auto-multiplexed
            { toValue: { x: 0, y: first === true ? -HEADER_SCROLL_DISTANCE : 0 },
                useNativeDriver: true } // Back to zero
            ).start();
            props.getTotalFirst(false);
            //setFirst(false);
        }
        if(last){
            Animated.spring(
            pan, // Auto-multiplexed
            { toValue: { x: 0, y: last === true ? HEADER_SCROLL_DISTANCE : 0 },
                useNativeDriver: true } // Back to zero
            ).start();
            setLast(false);
            props.getTotalFirst(true);
            //setFirst(true);
        }
        },
    });

    async function showDetail(name, id){
        try{
            /*const result = await axios({
                                        method: 'GET' ,
                                        url : '' , //name, id 사용
                                    });
            props.navigation.navigate("DetailGallery", {contents:result.response});*/
            props.navigation.navigate("DetailGallery", {contents:findGalleyContents(galleryContents, id).contents});
            return 0;
        }
        catch (error){
            console.log(error);
            return -1;
        }
    }

    async function getData(){
        try{
            const auth = await checkJwt();
            if(auth !== null){
                const response = await axios({
                    method: 'GET',
                    url : `${server.url}/api/`,
                    headers : {Auth: auth},
                })
            }
            else{
                console.log("no login");
            }
        }
        catch{e=>{
            //console.log(e);
            Alert.alert(
                '오류',
                'IndroduceShop 오류',
                [
                    {text: 'OK', onPress: () => {}},
                ],
                { cancelable: false }
            );}
        }  
    }

    const renderItem = ({ item }) => {
        
        return(
            <ImageView onPress={()=>{showDetail(shopName, item.galleryId);}}>
                <Image style={{height:'100%',width:'100%',}} source={{uri:item.thumbnail}} resizeMode='stretch'/>
            </ImageView>
        );
    };

    function findGalleyContents(array, id){
        const result = array.filter(item => item.galleryId === id);
        return result[0];
    }


    return(
        <Total>
            <FlatList
                data={props.gallery}
                renderItem={renderItem}
                keyExtractor={(item) => item.galleryId}
                numColumns={3}
                scrollEnabled={true}
                onRefresh={()=>{console.log("refresh")}}
                refreshing={isRefreshing}
                />
        </Total>
    );
}

export default Gallery;