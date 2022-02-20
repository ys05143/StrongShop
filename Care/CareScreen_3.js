import React from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native'
import styled from "styled-components/native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from "react-native-vector-icons/Ionicons";
import _ from 'lodash';
import { Button, Badge } from "react-native-paper";
import FastImage from 'react-native-fast-image';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
//component
import TotalView from "../components/TotalView";
import Row from "../components/Row";
//constant
import Color from "../constants/Color";
import AppWindow from "../constants/AppWindow";
//server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';
import checkErrorCode from '../function/checkErrorCode';
import { userContext } from '../function/Context';

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;

const Input = styled.TextInput`
    width: 90%;
    height: 100px;
    border-radius: 10px;
    border: 1px solid black;
    color: #000000;
    padding: 10px;
`;

const BtnView = styled.View`
    width: 100%;
    height: 80px;
`;
const AddImgView = styled.View`
    width : ${WIDTH*0.85}px;
    height: ${WIDTH*0.85}px;
    align-items: center;
    justify-content: center;
`;

const BlankImgView = styled.TouchableOpacity`
    width: ${WIDTH*0.8}px;
    height: ${WIDTH*0.8}px;
    border-style: dashed;
    border-width: 1px;
    border-radius: 1px;
    justify-content: center;
    align-items: center;
`;

const ImgView = styled.View`
    width: ${WIDTH*0.8}px;
    height: ${WIDTH*0.8}px;
    background-color: lightgray;
`;
const IntroView = styled.View`
    width: 95%;
    align-items: center;
    padding-bottom: 5px;
    flex-direction: row;
`;
const IntroText = styled.Text`
    font-size: 20px;
    font-weight: bold;
`;

function CareScreen_3(props){
    const context = React.useContext(userContext);
    const [carData,setCarData] = React.useState(props.route.params.carData);
    const [isLoading, setIsLoading] = React.useState(false);
    const [contents, setContents] = React.useState([{
        text: '',
        displayImg: null,
        formdata: null,
    }])

    function ImgPick(index){
        setIsLoading(true);
        MultipleImagePicker.openPicker({
            mediaType: 'image', 
            selectedAssets: null,
            doneTitle: "완료",
            singleSelectedMode: true,
            usedCameraButton: false,
        })
        .then(images => {
            // let formdata = new FormData();
            let name = images.fileName;
            let type = "multipart/form-data";
            let imgUri = Platform.OS === 'ios' ? images.path : images.path.startsWith('content') ? images.path : 'file://'+response.path;
            // formdata.append("imagefiles", { name: name , type: type, uri: imgUri });
            changeImg(images, { name: name , type: type, uri: imgUri }, index)
            setIsLoading(false);
        })
        .catch(error => {
            setIsLoading(false);
        });
    }

    function changeImg(images, formdata, index){
        let newData = _.cloneDeep(contents);
        newData[index].displayImg = images;
        newData[index].formdata = formdata;
        setContents(newData);
    }

    function changeText(value,index){
        let newData = _.cloneDeep(contents);
        newData[index].text = value;
        setContents(newData);
    }

    function setTextArray(){
        let newData = _.cloneDeep(contents);
        newData.push({
            text: '',
            displayImg: null,
            formdata: null,
        });
        setContents(newData);
    }

    function askCancelCare(){
        Alert.alert(
            '입력을 중단하겠습니까?',
            '지금까지 입력된 내용은 저장되지 않습니다.',
            [
                {text: '취소', onPress: () => {}},
                {text: '확인', onPress: () => {
                    context.setCareSearch(null);
                    props.navigation.popToTop()
                }},
            ],
            { cancelable: true }
        );
    }

    function MoveToNext(){
        let textArray=[];
        formArray = [];
        let newData = new FormData();
        _.map(contents, (item)=>{
            newData.append("imagefiles", item.formdata);
            textArray.push(item.text);
        })
        newData.append('details', JSON.stringify(carData));
        newData.append('region', carData.region);
        // newData['details'] = JSON.stringify(carData);
        // newData['region'] = carData.region;
        finishOrder(newData);
        context.setCareSearch(null);
    }

    async function finishOrder(newData){ // 서버에 오더 전송
        try{
            setIsLoading(true);
            if(newData !== null){
                const auth = await checkJwt();
                if(auth !== null){
                    console.log(newData);
                    const response = await axios({
                        method: 'POST',
                        url : `${server.url}/api/orders/care` ,
                        data : newData,
                        headers : {'content-type': 'multipart/form-data' , Auth: auth},
                        timeout: 5000,
                    })
                    .then(res=>{
                        Alert.alert(
                            '완료',
                            '지금부터 입찰이 시작됩니다!',
                            [
                                {text: '확인', onPress: () => {
                                        props.navigation.popToTop();
                                    }
                                },
                            ],
                            { cancelable: false }
                        );
                    })
                    .catch(e=>{
                        alert(e);
                    })
                    setIsLoading(false);
                }
                else{
                    Alert.alert(
                        '실패',
                        '로그인이 필요합니다.',
                        [
                            {text: '확인', onPress: () => {props.navigation.navigate("LoginScreen"), setIsLoading(false);}},
                        ],
                        { cancelable: false }
                    );
                }
            }
            else{
                Alert.alert(
                    '실패',
                    '작성한 견적이 없습니다.',
                    [
                        {text: '확인', onPress: () => {setIsLoading(false)}},
                    ],
                    { cancelable: false }
                );
            }
            setIsLoading(false); 
        }
        catch{
            Alert.alert(
                '견적 등록을 실패했습니다.',
                '다시 시도해주세요.',
                [
                    {text: '확인', onPress: () => {setIsLoading(false)}},
                ],
                { cancelable: false }
            );
        } 
    }


    return(
        <TotalView color={'white'} notchColor={'white'} homeIndicatorColor={'white'}>
            <View style={{width: '100%', alignItems: 'flex-end', paddingTop: 5, paddingRight: 5}}>
                <TouchableOpacity onPress={()=>{askCancelCare();}}>
                    <Icon name="close-outline" size={35} color={'black'}></Icon>
                </TouchableOpacity>    
            </View>
            <KeyboardAwareScrollView extraScrollHeight={30}>
            <Text style={{marginLeft: 10, marginBottom: 10, fontSize: 25, fontWeight: 'bold'}}>{carData.carName}</Text>
            {/* <Text style={{marginLeft: 10, marginBottom: 10, fontSize: 20, fontWeight: 'bold'}}>시공할 부분의 사진을 찍어주세요.</Text> */}
            <View style={{alignItems: 'center'}}>
                <IntroView>
                    <IntroText>시공할 부분의 사진을 찍어주세요.</IntroText>
                </IntroView>
            </View>
                {_.map(contents, (item, index)=>{
                    return(
                        <View key={index}>
                            <Text style={{marginLeft: 10, fontSize: 20, fontWeight: 'bold'}}>{index+1+'.'}</Text>
                            <View style={{alignItems: 'center'}}>
                                <AddImgView>
                                    {item.displayImg !== null ? 
                                    <>
                                    <ImgView>
                                        <FastImage style={{height:'100%',width:'100%', backgroundColor: '#e5e5e5'}} source={{uri:item.displayImg.path}}/>
                                    </ImgView>
                                    <Badge style={{backgroundColor: 'white', borderWidth: 1, borderColor: 'gray', position: 'absolute', top: 0}} size={27} onPress={()=>{ImgPick(index)}}>
                                        <Icon name="pencil-sharp" color={'gray'}></Icon>
                                    </Badge> 
                                    </>: 
                                    <BlankImgView onPress={()=>{ImgPick(index)}} >
                                        <Icon name={'camera'} size={50} color={'gray'}/> 
                                    </BlankImgView>
                                    }
                                </AddImgView>
                                <Input multiline={true}
                                    style={{textAlignVertical:'top', marginBottom: 10}}//only for android
                                    value={item.text}
                                    onChangeText={value=>{changeText(value, index);}}
                                    placeholder={"특이사항이 있으면 입력해주세요."}
                                    placeholderTextColor="gray"
                                    maxLength={400}
                                    />
                            </View>
                        </View>
                        )}
                    )
                }
                <View>
                    <View style={{alignItems: 'center'}}>
                        <TouchableOpacity onPress={()=>{setTextArray()}}>
                            <Icon name={'add-circle-outline'} size={50} color={'black'}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareScrollView>
            <BtnView>
                <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                    <Button mode={"contained"} onPress={() => {props.navigation.goBack()}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main}>이전</Button>
                    <Button mode={"contained"} onPress={() => {MoveToNext()}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main}>입력완료</Button>
                </Row>
            </BtnView>
            {isLoading && <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', position: 'absolute', backgroundColor: 'rgba(0,0,0,0.3)'}}>
                <ActivityIndicator size = 'large' color= {Color.main}/>
            </View>}
        </TotalView>
    );
}

export default CareScreen_3;