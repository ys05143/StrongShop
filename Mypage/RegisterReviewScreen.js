import React from 'react';
import { View, Text, ScrollView, Image, Alert, ActivityIndicator, Platform } from 'react-native';
import styled from 'styled-components/native';
import Icon from "react-native-vector-icons/Ionicons";
import { Button, Title, List, Divider } from 'react-native-paper';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import _ from 'lodash';
import TotalView from '../components/TotalView';
import Row from '../components/Row';
import AppWindow from '../constants/AppWindow';
import Color from '../constants/Color';
import Accordion from 'react-native-collapsible/Accordion';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
    padding: 10px 15px;
    background-color: 'rgb(246,246,246)';
    height: 200px;
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
    const [receipt, setReceipt] = React.useState(JSON.parse(props.route.params.receipt));
    const [img, setImg] = React.useState([]);
    const [imgFormData, setImgFormData] = React.useState(null);
    const [text, setText] = React.useState('');
    const [isSending, setIsSending] = React.useState(false);
    const [activeSections, setActiveSections] = React.useState([]);

    function ImgPick(){
        MultipleImagePicker.openPicker({
            mediaType: 'image', 
            selectedAssets: img,
            doneTitle: "완료",
            singleSelectedMode: true,
            usedCameraButton: false,
        })
        .then(images => {
            setImg(images);
            console.log(images);
            //path => uri:"file://"+item.path or uri: item.path
            let formdata = new FormData();
            images.map((image)=>{
                let name = image.fileName;
                let type = "multipart/form-data";
                let imgUri = Platform.OS === 'ios' ? image.path : "file://"+ image.path;
                formdata.append("files", { name: name , type: type, uri: imgUri });
            });
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
                        headers: {'content-type': 'multipart/form-data' , Auth: auth }
                    }).then(res=>{
                        Alert.alert(
                            '성공',
                            '리뷰 등록에 성공했습니다.',
                            [
                                {text: '확인', onPress: () => {props.navigation.replace("MainScreen");}},
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
                '오류',
                '리뷰 등록을 실패했습니다.',
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
                    <ScrollView>
                    {
                        item.tinting != null && (
                            <View style={styles.total}>
                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='틴팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                <List.Item titleStyle={styles.listStyle} title ={item.tinting} right={ props => <Text style={styles.itemText}>{item.tintingPrice}{'만원'}</Text>} />
                            </View>
                        )
                    }
                    {
                        item.ppf != null && (
                            <View style={styles.total}>
                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='PPF' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                <List.Item titleStyle={styles.listStyle} title ={item.ppf} right={props => <Text style={styles.itemText}>{item.ppfPrice}{' 만원'}</Text>} />
                            </View>
                        )
                    }
                    {
                        item.blackbox != null && (
                            <View style={styles.total}>
                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='블랙박스' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                <List.Item titleStyle={styles.listStyle} title ={item.blackbox} right={props => <Text style={styles.itemText}>{item.blackboxPrice}{' 만원'}</Text>} />
                            </View>
                        )
                    }
                    {
                        item.battery != null && (
                            <View style={styles.total}>
                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='보조배터리' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                <List.Item titleStyle={styles.listStyle} title ={item.battery} right={props => <Text style={styles.itemText}>{item.batteryPrice}{' 만원'}</Text>} />
                            </View>
                        )
                    }
                    {
                        item.afterblow != null && (
                            <View style={styles.total}>
                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='애프터블로우' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                <List.Item titleStyle={styles.listStyle} title ={item.afterblow} right={props => <Text style={styles.itemText}>{item.afterblowPrice}{' 만원'}</Text>} />
                            </View>
                        )
                    }
                    {
                        item.soundproof != null && (
                            <View style={styles.total}>
                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='방음' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                <List.Item titleStyle={styles.listStyle} title ={item.soundproof} right={props => <Text style={styles.itemText}>{item.soundproofPrice}{' 만원'}</Text>} />
                            </View>
                        )
                    }
                    {
                        item.wrapping != null && (
                            <View style={styles.total}>
                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='랩핑' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                <List.Item titleStyle={styles.listStyle} title ={item.wrapping} right={props => <Text style={styles.itemText}>{item.wrappingPrice}{' 만원'}</Text>} />
                            </View>
                        )
                    }
                    {
                        item.glasscoating != null && (
                            <View style={styles.total}>
                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='유리막코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                <List.Item titleStyle={styles.listStyle} title ={item.glasscoating} right={props => <Text style={styles.itemText}>{item.glasscoatingPrice}{' 만원'}</Text>} />
                            </View>
                        )
                    }
                    {
                        item.undercoating != null && (
                            <View style={styles.total}>
                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='언더코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                <List.Item titleStyle={styles.listStyle} title ={item.undercoating} right={props => <Text style={styles.itemText}>{item.undercoatingPrice}{' 만원'}</Text>} />
                            </View>
                        )
                    }
                    <List.Item titleStyle={styles.totalprice} title ='최종가격: ' right={props => <Text style={styles.itemText}>{item.totalPrice}{' 만원'}</Text>}/>
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
        <KeyboardAwareScrollView>
        <TotalView color={'white'} notchColor={'white'} homeIndicatorColor={'white'}>
            <View style={{width: '100%', height: AppWindow.TopBar, justifyContent: 'center', alignItems: 'center', borderBottomColor: 'lightgray', borderBottomWidth: 1}}>
                <Text style={{fontFamily: 'DoHyeon-Regular', fontSize: 25}}>{companyName}</Text>
            </View>
            <View>
                <ReceiptView item={[receipt]} key={receipt}></ReceiptView>
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
                    <Button mode={"contained"} onPress={() => {props.navigation.popToTop();}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>건너뛰기</Button>
                    <Button mode={"contained"} disabled={isSending} onPress={() => {setIsSending(true); SendData();}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>등록</Button>
                </Row>
            </BtnView>
            {isSending && 
                <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', position: 'absolute'}}>
                    <ActivityIndicator color= {Color.main} size={'large'}/>
                </View>}
        </TotalView>
        </KeyboardAwareScrollView>
    )
}
export default RegisterReviewScreen;