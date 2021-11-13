import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import Icon from "react-native-vector-icons/Ionicons";
import { Button, Title } from 'react-native-paper';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import _ from 'lodash';
import TotalView from '../components/TotalView';
import Row from '../components/Row';
import AppWindow from '../constants/AppWindow';
import Color from '../constants/Color';

const InfoView = styled.View`
    width: 100%;
    height: 150px;
    background-color: lightgray;
    border-radius: 10px;
    padding: 5px 10px;
`;
const AddImgView = styled.TouchableOpacity`
    width: 100px;
    height: 100px;
    border-style: dashed;
    border-width: 1px;
    border-radius: 1px;
    justify-content: center;
    align-items: center;
    border-color: gray;
    margin-left: 10px;
`;
const AddImg = styled.View`
    width: 100px;
    height: 100px;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
`;
const BtnView = styled.View`
    width: 100%;
    height: 80px;
`;
const TextView = styled.View`
    flex: 1;
    padding: 0px 10px;
`;
const Input = styled.TextInput`
    flex: 1;
    margin-top: 10px;
    border: 1px;
    color: #000000;
    padding: 10px;
`;

const sendDATA = {
    orderId: 1,
    userName: '허지훈',
    shopName: '올댓카니발',
    images: [ '', '' ],
    text: '좋습니다...'
}

function RegisterReviewScreen(props) {
    const [shopName, setShopName] = React.useState(props.route.params.shopName);
    const [userName, setUserName] = React.useState(props.route.params.userName);
    const [orderId, setOrderId] = React.useState(props.route.params.orderId);
    const [img, setImg] = React.useState([]);
    const [text, setText] = React.useState(null);

    function ImgPick(){
        // ImagePicker.openPicker({
        //     multiple: true
        //   }).then(images => {
        //     console.log(images);
        //     let newData = [...images, ...img];
        //     setImg(newData);
        //   })
        //   .catch((error)=>{
        //     console.log(error); 
        //   });
        MultipleImagePicker.openPicker({
            mediaType: 'image', 
            selectedAssets: img,
            doneTitle: "완료",
            selectedColor: "#162741",
        })
        .then(images => {
            setImg(images);
            console.log(images);
            //path => uri:"file://"+item.path or uri: item.path
        })
        .catch(error => {
            console.log(error);
        });
    }

    function finalSend(){
        let newData = {...sendDATA};
        newData.orderId = orderId;
        newData.userName = userName;
        newData.shopName = shopName;
        newData.images = img;
        newData.text = text;
    }

    return(
        <TotalView color={'white'} notchColor={'white'} homeIndicatorColor={'white'}>
            <View style={{width: '100%', height: AppWindow.TopBar, justifyContent: 'center', alignItems: 'center', borderBottomColor: 'lightgray', borderBottomWidth: 1}}>
                <Text style={{fontFamily: 'DoHyeon-Regular', fontSize: 25}}>{shopName}</Text>
            </View>
            <TouchableOpacity style={{height: AppWindow.TopBar, justifyContent: 'center', position: 'absolute'}}  onPress={()=>{ props.navigation.goBack() }}>
                <Icon name="chevron-back-outline" size={35} color={'black'}></Icon>
            </TouchableOpacity>
            <View style={{alignItems: 'center', paddingHorizontal: 10, marginTop: 5}}>
                <InfoView>
                    <ScrollView>
                        <Row style={{alignItems: 'center'}}>
                            <Icon name={'ellipse'} style={{marginRight: 5}}/>
                            <Title>시공내역</Title>
                        </Row>
                        <Text style={{fontSize: 15}}>{props.route.params.finalReceipt}</Text>
                    </ScrollView>
                </InfoView>
            </View>
            <View style={{height: 120, paddingVertical: 10}}>
                <ScrollView horizontal={true}>
                    <AddImgView onPress={()=>{ImgPick();}}>
                        <Icon name={'camera'} size={30} color={'gray'}/> 
                    </AddImgView>
                    {img !== null && 
                        _.map(img, (item, index)=>{
                        return( 
                            <AddImg key={index}>
                                <Image style={{height:'100%',width:'100%'}} source={{uri:item.path}}/>
                            </AddImg>);
                        })}
                </ScrollView>
            </View>
            <TextView>
                <Text style={{fontSize: 20}}>후기를 작성해주세요.</Text>
                <Input multiline={true}
                            style={{textAlignVertical:'top', borderRadius: 5}}//only for android
                            value={text}
                            onChangeText={value=>setText(value)}
                            placeholder={"솔직한 후기를 작성해주헤요"}
                            placeholderTextColor="gray"/>
            </TextView>
            <BtnView>
                <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                    <Button mode={"contained"} onPress={() => {}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>취소</Button>
                    <Button mode={"contained"} onPress={() => {}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>등록</Button>
                </Row>
            </BtnView>
        </TotalView>
    )
}
export default RegisterReviewScreen;