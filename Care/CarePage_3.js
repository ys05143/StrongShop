import React from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Platform, Modal } from 'react-native'
import styled from "styled-components/native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from "react-native-vector-icons/Ionicons";
import _ from 'lodash';
import { Badge } from "react-native-paper";
import FastImage from 'react-native-fast-image';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import FinalCareOrder from "./FinalCareOrder";
//component
import ModalView from '../components/ModalView';
import Background from "../components/Background";
import { MainText, MenuTitleText, MenuContentText, JuaText, NotoSansText } from "../components/TextStyle";
import Row from '../components/Row';
import TopBox from "../components/TopBox";
import CustButton from "../components/CustButton";
import BtnView from "../components/BtnView";
import TotalIndicator from "../components/TotalIndicator";
//constant
import Color from "../constants/Color";
import AppWindow from "../constants/AppWindow";
//function 
import storage from "../function/storage";

const WIDTH = AppWindow.width;

const Input = styled.TextInput`
    width: 90%;
    height: 80px;
    border-radius: 10px;
    border: 1px solid black;
    color: #000000;
    padding: 10px;
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
    flex-direction: row;
    margin-bottom: 10px;
`;
const ContentView = styled.View`
    width: 95%;
    background-color: ${Color.menuBackgrund};
    border: 2px solid ${Color.menuBorder};
    border-radius: 5px;
    margin-top: 20px;
`;

function CarePage_3(props){
    const [carData,setCarData] = React.useState({
        processPage: null,
        carName: null,
        options: null,
        require: null,
        region: null,
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const [ReceiptModal, setReceiptModal] = React.useState(false);
    function getReceiptModal(close){
        setReceiptModal(close);
    }
    const [contents, setContents] = React.useState([{
        text: '',
        displayImg: null,
        formdata: null,
    }])

    React.useEffect( ()=>{
        setIsLoading(true);
        storage.fetch('CareOrder')
        .then(response=>{
            if(response !== null){
                console.log('??????????????? 3 useEffect: ', response);
                let newCarData = {
                    processPage: response.processPage,
                    carName: response.carName,
                    options: response.options,
                    region: response.region,
                }
                setCarData(newCarData);
                if(response.require !== null){
                    setContents(response.require);
                }
            }
            else{
                Alert.alert( //async??? ????????? ??? ?????? ??? ???????????? ??? ?????? ?????????.
                    '??????',
                    '????????? ??????????????????.',
                    [
                      {text: '??????', onPress: () => {cancelRequire();}},
                    ],
                    { cancelable: false }
                  );
            }
            setIsLoading(false);
        })
        .catch(e=>{
            console.log(e);
        });
    },[]);

    function cancelRequire(){
        //????????? ?????? ????????? false ????????????
        props.navigation.popToTop();
    }

    function ImgPick(index){
        setIsLoading(true);
        MultipleImagePicker.openPicker({
            mediaType: 'image', 
            selectedAssets: null,
            doneTitle: "??????",
            singleSelectedMode: true,
            usedCameraButton: false,
        })
        .then(images => {
            // let formdata = new FormData();
            let name = images.fileName;
            let type = "multipart/form-data";
            let imgUri = Platform.OS === 'ios' ? images.path : images.path.startsWith('content') ? images.path : 'file://'+ images.path;
            // formdata.append("imagefiles", { name: name , type: type, uri: imgUri });
            changeImg(imgUri, { name: name , type: type, uri: imgUri }, index)
            setIsLoading(false);
        })
        .catch(error => {
            setIsLoading(false);
        });
    }

    function changeImg(uri, formdata, index){
        let newData = _.cloneDeep(contents);
        newData[index].displayImg = uri;
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

    function removeElement(index){
        let newData = _.cloneDeep(contents);
        newData.splice(index, 1);
        setContents(newData);
    }

    function askCancelCare(){
        Alert.alert(
            '????????? ??????????????????????',
            '???????????? ????????? ????????? ???????????? ????????????.',
            [
                {text: '??????', onPress: () => {}},
                {text: '??????', onPress: () => {
                    cancelRequire();
                }},
            ],
            { cancelable: true }
        );
    }

    function finalCheck(){
        // console.log(contents);
        if((contents[0].text === '' || contents[0].text === null) && contents[0].displayImg === null){
            Alert.alert(
                '????????? ???????????? ???????????????.',
                '????????? ?????????????????????????',
                [
                    {text: '??????', onPress: () => {}},
                    {text: '??????', onPress: () => {
                        // MoveToNext();
                        setReceiptModal(true);
                    }}
                ],
                { cancelable: false }
            );
        }
        else{
            setReceiptModal(true);
        }
        
    }

    const Top = ()=>{
        return(
            <TopBox topbar={<TopBar/>}>
                <MainText>????????? ?????????</MainText>
                <Row>
                    <MainText style={{color: 'white'}}> ?????????</MainText>
                    <MainText> ????????? ?????????.</MainText>
                </Row>
            </TopBox>
        )
    }

    const TopBar = () => {
        return(
            <View style={{width: '100%', height: '100%', paddingRight: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                <TouchableOpacity style={{padding: 5, marginLeft: 15}} onPress={()=>{askCancelCare();}}>
                    <Icon name="close" size={23} color={Color.mainText}></Icon>
                </TouchableOpacity>
            </View>
        )
    }

    return(
        <>
        <Background topbox={<Top/>} androidKeyboardAware={Platform.OS === 'android'}>
            <View style={{width: '100%', alignItems: 'center', flex: 1}}>
            <KeyboardAwareScrollView  style={{width: WIDTH, paddingTop: 10}} contentContainerStyle={{alignItems: 'center'}} extraHeight={300} showsVerticalScrollIndicator={false}>
                    {_.map(contents, (item, index)=>{
                        return(
                            <ContentView key={index}>
                                <Row style={{alignItems: 'center', justifyContent: 'space-between'}}>
                                    <Text style={{marginLeft: 10, fontSize: 20, fontWeight: 'bold', marginTop: 5}}>{index+1+'.'}</Text>
                                    {index !== 0 && <Icon name="close" size={23} color={Color.mainText} style={{marginRight: 5}} onPress={()=>{removeElement(index);}}></Icon>}
                                </Row>
                                <View style={{alignItems: 'center'}}>
                                    <AddImgView>
                                        {item.displayImg !== null ? 
                                        <>
                                        <ImgView>
                                            <FastImage style={{height:'100%',width:'100%', backgroundColor: '#e5e5e5'}} source={{uri:item.displayImg}}/>
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
                                        placeholder={"??????????????? ????????? ??????????????????."}
                                        placeholderTextColor="gray"
                                        maxLength={400}
                                        />
                                </View>
                            </ContentView>
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
            </View>
            <BtnView>
                <CustButton onPress={()=>{props.navigation.navigate("CarePage_2");}}>??????</CustButton>
                <CustButton onPress={()=>{finalCheck();}}>??????</CustButton>
            </BtnView>
        </Background>
        
        {isLoading && <TotalIndicator/>}

        <Modal
            animationType="slide"
            transparent={true}
            visible={ReceiptModal}
            onRequestClose={() => {setReceiptModal(!ReceiptModal);}}
        >
            <ModalView>
                <View style={{width: '90%'}}>
                    <FinalCareOrder getModal={getReceiptModal} navigation={props.navigation} contents={contents} carData={carData}/>
                </View>
            </ModalView>
        </Modal>

        </>
    );
}

export default CarePage_3;