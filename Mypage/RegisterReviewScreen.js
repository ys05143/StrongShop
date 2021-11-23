import React from 'react';
import { View, Text, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import Icon from "react-native-vector-icons/Ionicons";
import { Button, Title } from 'react-native-paper';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import _ from 'lodash';
import TotalView from '../components/TotalView';
import Row from '../components/Row';
import AppWindow from '../constants/AppWindow';
import Color from '../constants/Color';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';

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
    companyName: '올댓카니발',
    images: [ '', '' ],
    text: '좋습니다...'
}

function RegisterReviewScreen(props) {
    const [companyName, setCompanyName] = React.useState(props.route.params.companyName);
    const [completedContractId, setCompletedContractId] = React.useState(props.route.params.completedContractId);
    const [receipt, setReceipt] = React.useState(props.route.params.receipt);
    const [img, setImg] = React.useState([]);
    const [imgFormData, setImgFormData] = React.useState();
    const [text, setText] = React.useState(null);
    const [isSending, setIsSending] = React.useState(false);

    function ImgPick(){
        MultipleImagePicker.openPicker({
            mediaType: 'image', 
            selectedAssets: img,
            doneTitle: "완료",
        })
        .then(images => {
            setImg(images);
            console.log(images);
            //path => uri:"file://"+item.path or uri: item.path
            let formdata = new FormData();
            images.map((image)=>{
                let name = image.fileName;
                let type = "multipart/form-data";
                let imgUri = image.path;
                formdata.append("files", { name: name , type: type, uri: imgUri });
            });
            setImgFormData(formdata);
            console.log(formdata);
        })
        .catch(error => {
            console.log(error);
        });
    }

    async function SendData(){
        try{
            setIsSending(true);
            let newFormData = imgFormData;
            newFormData.append("content", text);
            newFormData.append("rating", "5");
            console.log(newFormData);
            console.log(`${server.url}/api/review/${completedContractId}`);
            const auth = await checkJwt();
            if(auth !== null){   
                const response = await axios.post(`${server.url}/api/review/${completedContractId}`, newFormData, {
                    headers: {'content-type': 'multipart/form-data' , Auth: auth }
                }).then(res=>{
                    Alert.alert(
                        '성공',
                        '리뷰 등록에 성공했습니다.',
                        [
                            {text: 'OK', onPress: () => {props.navigation.replace("MainScreen");}},
                        ],
                        { cancelable: false }
                    );
                });
            }
            else{
                Alert.alert(
                    '실패',
                    '로그인이 필요합니다.',
                    [
                        {text: 'OK', onPress: () => {props.navigation.navigate("LoginScreen")}},
                    ],
                    { cancelable: false }
                );
            }
            setIsSending(false);
        }
        catch{
            Alert.alert(
                '오류',
                '리뷰 등록을 실패했습니다.',
                [
                    {text: 'OK', onPress: () => {}},
                ],
                { cancelable: false }
            );
            //setIsSending(false);
        }
    }

    return(
        <TotalView color={'white'} notchColor={'white'} homeIndicatorColor={'white'}>
            <View style={{width: '100%', height: AppWindow.TopBar, justifyContent: 'center', alignItems: 'center', borderBottomColor: 'lightgray', borderBottomWidth: 1}}>
                <Text style={{fontFamily: 'DoHyeon-Regular', fontSize: 25}}>{companyName}</Text>
            </View>
            <View style={{alignItems: 'center', paddingHorizontal: 10, marginTop: 5}}>
                <InfoView>
                    <ScrollView>
                        <Row style={{alignItems: 'center'}}>
                            <Icon name={'ellipse'} style={{marginRight: 5}}/>
                            <Title>시공내역</Title>
                        </Row>
                        <Text style={{fontSize: 15}}>{receipt}</Text>
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
                    <Button mode={"contained"} onPress={() => {props.navigation.navigate("MainScreen")}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>건너뛰기</Button>
                    <Button mode={"contained"} onPress={() => {SendData();}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>등록</Button>
                </Row>
            </BtnView>
            {isSending && 
                <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', position: 'absolute'}}>
                    <ActivityIndicator color= {Color.main}/>
                </View>}
        </TotalView>
    )
}
export default RegisterReviewScreen;