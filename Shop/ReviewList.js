import React from 'react';
import styled from 'styled-components';
import { Text,Image, FlatList,View } from 'react-native';
import AppWindow from '../constants/AppWindow';

const WIDTH = AppWindow.width;

const Total = styled.View`
    width: 100%;
    height: 100%;
    align-items: center;
    padding-top: 10px;
`;
const ReviewView = styled.View`
    width: ${WIDTH*0.9}px;
    border-radius: 15px;
    background-color: #e5e5e5;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    margin-bottom: 10px;
`;
const NameView = styled.View`
    width: 100%;
    height: 60px;
    flex-direction: row;
    align-items: center;
`;
const ProfileImg = styled.View`
    width: 40px;
    height: 40px;
    border-radius:50px;
    background-color: white;
    overflow: hidden;
`;
const Name = styled.Text`
    margin-left: 10px;
`;

const ContentView = styled.View`
    width: 100%;
    border-radius: 10px;
    padding: 10px;
    background-color: white;
`;
const Content = styled.Text`
    margin-top: 5px;
`;
const ContentImg = styled.View`
    width: ${WIDTH*0.9-40}px;
    height: ${WIDTH*0.9-40}px;
    border-radius: 15px;
    overflow: hidden;
`;

const DATA=[{
    id:1,
    name: '공진우',
    images : 'https://www.netcarshow.com/Hyundai-Kona_Electric-2021-1280-03.jpg',
    text: '너무 친절하게 잘 해주셨습니다.',
    profileImg: require('../resource/character1.png'),
},{
    id:2,
    name: '김영우',
    images: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
    text: '그냥 그래요',
    profileImg: null,
},{
    id:3,
    name: '이승진',
    images: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
    text: '다음차도 여기서 하고싶어요!',
    profileImg: require('../resource/character3.png'),
},{
    id:4,
    name: '허지훈',
    images: 'https://www.hyundai.com/contents/vr360/CN01/exterior/WAW/001.png',
    text: '불친절한 직원이 있습니다.',
    profileImg: require('../resource/character4.png'),
}];

function ReviewList(props){

    function renderItem({item}){
        return(
            <View style={{width: WIDTH, alignItems: 'center'}}>
            <ReviewView key={item.id}>
                <NameView>
                    <ProfileImg>
                        <Image  source={item.profileImg===null ? require('../resource/default_profile.png') : item.profileImg} style={{height:'100%',width:'100%',}} resizeMode='contain'/>
                    </ProfileImg>
                    <Name>{item.name}</Name>
                </NameView>
                <ContentView>
                    <ContentImg>
                        <Image source={{uri: item.images}} style={{width:'100%', height: '100%'}} resizeMode='cover'></Image>
                    </ContentImg>
                    <Content>{item.text}</Content>
                </ContentView>
            </ReviewView>
            </View>
        );
    }

    return(
        <Total>
            <FlatList data={DATA}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}/>
        </Total>
    )
}

export default ReviewList;