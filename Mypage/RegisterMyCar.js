import React from "react";
import { Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import styled from "styled-components/native";
import TotalView from "../components/TotalView";
import AppWindow from "../constants/AppWindow";
import Icon from "react-native-vector-icons/Ionicons";
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import Color from '../constants/Color';
import FastImage from 'react-native-fast-image';
import { Button, Badge } from "react-native-paper";
import TopBar from '../components/TopBar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;

const styles = {
    title: {
        marginLeft: 10, 
        marginBottom: 10, 
        fontSize: 20, 
        fontWeight: 'bold',
        marginTop: 10,
    }
}

const AddImgView = styled.View`
    width : ${WIDTH}px;
    height: ${WIDTH}px;
    align-items: center;
    justify-content: center;
`;

const BlankImgView = styled.TouchableOpacity`
    width: ${WIDTH*0.95}px;
    height: ${WIDTH*0.95}px;
    border-style: dashed;
    border-width: 1px;
    border-radius: 1px;
    justify-content: center;
    align-items: center;
    background-color: #e5e5e5;
`;

const ImgView = styled.View`
    width: ${WIDTH*0.95}px;
    height: ${WIDTH*0.95}px;
    background-color: lightgray;
`;

const Input = styled.TextInput`
    width: 95%;
    height: 50px;
    padding: 0px 10px;
    margin-top: 10px;
    font-size: 15px;
    justify-content: center;
    border: 1px solid gray;
`;

function RegisterMyCar(props){
    const [isLoading, setIsLoading] = React.useState(false);
    const [selectedImg, setSelectedImg] = React.useState(null);
    const [imgFormData, setImgFormData] = React.useState(null);

    function ImgPick(){
        setIsLoading(true);
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
            setIsLoading(false);
        })
        .catch(error => {
            //console.log(error);
            setIsLoading(false);
        });
    }

    return (
        <TotalView color={'white'} notchColor={'white'} homeIndicatorColor={'white'}>
            <TopBar>
                <TouchableOpacity style={{height: 60, width: 60, justifyContent: 'center', paddingHorizontal: 5}} onPress={()=>{props.navigation.goBack()}}>
                    <Icon name="chevron-back-outline" size={30} color={'black'}></Icon>
                </TouchableOpacity>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>차량등록</Text>
                </View>
                <TouchableOpacity style={{width: 60, height: 60, justifyContent: 'center', paddingHorizontal: 5, alignItems: 'center'}} onPress={()=>{}}>
                    <Text>{'저장'}</Text>
                </TouchableOpacity>
            </TopBar>
            <KeyboardAwareScrollView extraScrollHeight={10}>
                <Text style={styles.title}>1. 차량 이미지</Text>
                <View style={{alignItems: 'center'}}>
                    <AddImgView>
                        {selectedImg !== null ?
                        <>
                        <ImgView>
                            <FastImage style={{height:'100%',width:'100%', backgroundColor: '#e5e5e5'}} source={{uri:selectedImg.path}}/>
                        </ImgView>
                        <Badge style={{backgroundColor: 'white', borderWidth: 1, borderColor: 'gray', position: 'absolute', top: 0}} size={27} onPress={()=>{ImgPick()}}>
                            <Icon name="pencil-sharp" color={'gray'}></Icon>
                        </Badge> 
                        </>: 
                        <BlankImgView onPress={()=>{ImgPick()}} >
                            <Icon name={'camera'} size={50} color={'gray'}/> 
                        </BlankImgView>
                        }
                    </AddImgView>
                </View>
                <Text style={styles.title}>2. 차종</Text>
                <View style={{alignItems: 'center'}}>
                    <Input/>
                </View>
            </KeyboardAwareScrollView>
            {isLoading && <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', position: 'absolute', backgroundColor: 'rgba(0,0,0,0.3)'}}>
                <ActivityIndicator size = 'large' color= {Color.main}/>
            </View>}
        </TotalView>
    )
}

export default RegisterMyCar;