import React from 'react';
import { View, Text, ScrollView, Image, Alert, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import Icon from "react-native-vector-icons/Ionicons";
import { Button, Title, List, Divider, Badge } from 'react-native-paper';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import Accordion from 'react-native-collapsible/Accordion';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
//component
import TopBar from '../components/TopBar';
import TotalView from '../components/TotalView';
import Row from '../components/Row';
import AppWindow from '../constants/AppWindow';
import Receipt from '../components/Receipt';
//constants
import Color from '../constants/Color';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';
import checkErrorCode from '../function/checkErrorCode';

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;

const styles = {
    listAccordionStyle : {
        backgroundColor: 'white' ,
        borderTopWidth: 1 ,
        borderTopColor: 'lightgray'        
    } ,
    listStyle1 : {
        fontSize: 15 , 
        fontWeight: 'bold',
    } ,
    listStyle : {
        fontWeight: 'bold',
        fontSize: 13 , 
    } ,
    itemText: {
        fontSize: 13 ,
        fontWeight: 'bold' ,
        alignSelf: 'center'
    } ,
    labelStyle : {
        
    },
    total : {
        borderBottomWidth: 1 , 
        borderColor: 'lightgray',
    },
    totalprice : {
        fontWeight: 'bold',
        fontSize: 15 , 
    } ,
}

const InfoView = styled.View`
    width: 100%;
    flex-direction: row;
    padding-left: 10px;
    height: 50px;
    align-items: center;
    border-bottom-width: 1px;
    border-color: lightgray;
`;
const DetailView = styled.View`
    width: 100%;
    padding: 10px 0px;
    background-color: 'rgb(246,246,246)';
    height: 200px;
`;

// 여러이미지 허용할 경우
// const AddImgView = styled.TouchableOpacity`
//     width: 100px;
//     height: 100px;
//     border-style: dashed;
//     border-width: 1px;
//     border-radius: 1px;
//     justify-content: center;
//     align-items: center;
//     border-color: gray;
//     margin-left: 10px;
// `;
// const AddImg = styled.View`
//     width: 100px;
//     height: 100px;
//     justify-content: center;
//     align-items: center;
//     margin-left: 10px;
// `;

//리뷰이미지 하나일 경우
const AddImgView = styled.TouchableOpacity`
    width: ${WIDTH*0.7}px;
    height: ${WIDTH*0.7}px;
    border-style: dashed;
    border-width: 1px;
    border-radius: 1px;
    justify-content: center;
    align-items: center;
    border-color: gray;
    margin-left: 10px;
`;
const AddImg = styled.View`
    width: ${WIDTH*0.7}px;
    height: ${WIDTH*0.7}px;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
`;

const BtnView = styled.View`
    width: 100%;
    height: 80px;
`;
const TextView = styled.View`
    width: 100%;
    height: ${HEIGHT-60-50-(WIDTH*0.8)-80}px;
    padding: 0px 10px;
`;
const Input = styled.TextInput`
    flex: 1;
    margin-top: 10px;
    border: 1px;
    color: #000000;
    padding: 10px;
`;

function RegisterReviewScreen(props) {
    const [companyName, setCompanyName] = React.useState(props.route.params.companyName);
    const [completedContractId, setCompletedContractId] = React.useState(props.route.params.completedContractId);
    const [receipt, setReceipt] = React.useState(JSON.parse(props.route.params.receipt));
    const [imgFormData, setImgFormData] = React.useState(null);
    const [text, setText] = React.useState('');
    const [isSending, setIsSending] = React.useState(false);
    const [activeSections, setActiveSections] = React.useState([]);
    const [selectedImg, setSelectedImg] = React.useState(null);
    const [flag, setFlag] = React.useState(props.route.params.flag);

    function ImgPick(){
        MultipleImagePicker.openPicker({
            mediaType: 'image', 
            selectedAssets: selectedImg,
            doneTitle: "완료",
            singleSelectedMode: true,
            usedCameraButton: false,
        })
        .then(images => {
            setSelectedImg(images);
            //console.log(images);
            //path => uri:"file://"+item.path or uri: item.path
            let formdata = new FormData();
            // images.map((image)=>{
            //     let name = image.fileName;
            //     let type = "multipart/form-data";
            //     let imgUri = Platform.OS === 'ios' ? image.path : "file://"+ image.path;
            //     formdata.append("files", { name: name , type: type, uri: imgUri });
            // });
            let name = images.fileName;
            let type = "multipart/form-data";
            let imgUri = Platform.OS === 'ios' ? images.path : images.path.startsWith('content') ? images.path : 'file://'+response.path;
            formdata.append("files", { name: name , type: type, uri: imgUri });
            setImgFormData(formdata);
            //console.log(formdata);
        })
        .catch(error => {
            //console.log(error);
        });
    }

    async function SendData(){
        try{
            setIsSending(true);
            if(imgFormData === null){
                Alert.alert(
                    '실패',
                    '이미지를 추가해주세요.',
                    [
                        {text: '확인', onPress: () => {}},
                    ],
                    { cancelable: false }
                );
                setIsSending(false);
            }
            else{
                let newFormData = imgFormData;
                newFormData.append("content", text);
                newFormData.append("rating", "5");
                console.log(newFormData);
                //console.log(`${server.url}/api/review/${completedContractId}`);
                const auth = await checkJwt();
                if(auth !== null){   
                    const response = await axios.post(`${server.url}/api/review/${completedContractId}`, newFormData, {
                        headers: {'content-type': 'multipart/form-data' , Auth: auth },
                        timeout: 5000,
                    })
                    .then(res=>{
                        Alert.alert(
                            '성공',
                            '리뷰 등록에 성공했습니다.',
                            [
                                {text: '확인', onPress: () => {props.navigation.replace("MainScreen");}},
                            ],
                            { cancelable: false }
                        );
                    })
                    .catch(e=>{
                        checkErrorCode(e, props.navigation);
                    })
                }
                else{
                    Alert.alert(
                        '실패',
                        '로그인이 필요합니다.',
                        [
                            {text: '확인', onPress: () => {props.navigation.navigate("LoginScreen")}},
                        ],
                        { cancelable: false }
                    );
                }
                setIsSending(false);
            }
        }
        catch{
            Alert.alert(
                '리뷰 등록을 실패했습니다.',
                '다시 시도해주세요.',
                [
                    {text: '확인', onPress: () => {}},
                ],
                { cancelable: false }
            );
            setIsSending(false);
        }
    }

    function ReceiptView(props){
        //for acodian
        const [activeSections, setActiveSections] = React.useState([]);
    
        function _renderHeader (section, index, isActive) {
            return (
                <InfoView>
                    <Text style={{fontSize: 18}}>{'시공내역'}</Text>
                    <MaterialIcons name={isActive?"expand-less": "expand-more"} size={20} color= 'black'></MaterialIcons>
                </InfoView>
            );
        };
    
        const _renderContent = section => {
            const item = section;
            return(
                <DetailView>
                    <ScrollView contentContainerStyle={{paddingHorizontal: 15}}>
                        <Receipt item={item} kind={item.kind}/>
                    </ScrollView>
                </DetailView>
            )
        };
    
        const _updateSections = activeSections => {
            setActiveSections(activeSections);
        };
    
        return(
            <Accordion
            sections={props.item}
            activeSections={activeSections}
            renderHeader={_renderHeader}
            renderContent={_renderContent}
            onChange={_updateSections}
            underlayColor='transparent'
            />
        );
    }

    return(
        
        <TotalView color={'white'} notchColor={'white'} homeIndicatorColor={'white'}>
            <KeyboardAwareScrollView>
            {/* <View style={{width: '100%', height: AppWindow.TopBar, justifyContent: 'center', alignItems: 'center', borderBottomColor: 'lightgray', borderBottomWidth: 1}}>
                <Text style={{fontFamily: 'DoHyeon-Regular', fontSize: 25}}>{companyName}</Text>
            </View> */}
            <TopBar>
                {flag ? 
                <View style={{height: 60, width: 60, justifyContent: 'center', paddingHorizontal: 5}}/> : 
                <TouchableOpacity style={{height: 60, width: 60, justifyContent: 'center', paddingHorizontal: 5}} onPress={()=>{props.navigation.goBack()}}>
                    <Icon name="chevron-back-outline" size={30} color={'black'}></Icon>
                </TouchableOpacity>}
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>{companyName}</Text>
                </View>
                <View style={{width: 60}}/>
            </TopBar>
            <View>
                <ReceiptView item={[receipt]} key={receipt}></ReceiptView>
            </View>
            <View style={{height: WIDTH*0.8, justifyContent: 'center', alignItems: 'center'}}>
                {selectedImg === null ? <AddImgView onPress={()=>{ImgPick();}}>
                    <Icon name={'camera'} size={30} color={'gray'}/> 
                </AddImgView> :
                <View style={{width: WIDTH*0.8, height: WIDTH*0.75, justifyContent: 'center', alignItems: 'center'}}>
                    <AddImg>
                        <FastImage style={{height:'100%',width:'100%'}} source={{uri:selectedImg.path}}/>
                    </AddImg>
                    <Badge style={{backgroundColor: 'white', borderWidth: 1, borderColor: 'gray', position: 'absolute', top: 0}} size={27} onPress={()=>{ImgPick();}}>
                        <Icon name="pencil-sharp" color={'gray'}></Icon>
                    </Badge>
                </View>}
            </View>
            <TextView>
                <Text style={{fontSize: 20}}>후기를 작성해주세요.</Text>
                <Input multiline={true}
                            style={{textAlignVertical:'top', borderRadius: 5}}//only for android
                            value={text}
                            onChangeText={value=>setText(value)}
                            placeholder={"솔직한 후기를 작성해주세요"}
                            placeholderTextColor="gray"/>
            </TextView>
            <BtnView>
                <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                    {flag && <Button mode={"contained"} onPress={() => {props.navigation.popToTop();}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>건너뛰기</Button>}
                    <Button mode={"contained"} disabled={isSending} onPress={() => {setIsSending(true); SendData();}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>{isSending?'등록중...':'등록'}</Button>
                </Row>
            </BtnView>
            {isSending && 
                <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', position: 'absolute'}}>
                    <ActivityIndicator color= {Color.main} size={'large'}/>
                </View>}
                </KeyboardAwareScrollView>
        </TotalView>
        
    )
}
export default RegisterReviewScreen;