import React from 'react';
import styled from 'styled-components/native';
import { Title  , ProgressBar, Avatar , Appbar , List , Badge , Button , IconButton , Portal , Provider, FAB, Divider}  from 'react-native-paper';
import { FlatList , ScrollView, Alert, Text, ActivityIndicator, Modal, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from "react-native-vector-icons/Ionicons";
import StepIndicator from 'react-native-step-indicator';
import MaterialComunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//import { request , PERMISSIONS } from 'react-native-permissions';
import Swiper  from 'react-native-swiper';
import database from '@react-native-firebase/database';
import storage from '../function/storage';
import TopBar from '../components/TopBar';
import Color from '../constants/Color';
import JustShowOrder from '../NewCarPackage/JustShowOrder';
import ModalView from '../components/ModalView';
import FinalReceipt from '../NewCarPackage/FinalReceipt';
import Row from '../components/Row';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';
import checkErrorCode from '../function/checkErrorCode';
import TotalView from '../components/TotalView';
import AppWindow from '../constants/AppWindow';

const WIDTH = AppWindow.width;

const ImageView = styled.TouchableOpacity`
    width: ${(WIDTH-6)/3}px;
    height: ${(WIDTH-6)/3}px;
    background-color: #e5e5e5;
    margin: 1px;
`;
const SwiperView = styled.View`
    width: 100%;
    flex: 1;
`;
const InfoView = styled.View`
    width: 95%;
    border-radius: 10px;
    padding: 5px 10px;
    border: 3px solid gray;
`;

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
    title : {
        fontFamily : 'DoHyeon-Regular' ,
        fontSize: 30 ,
        padding: 20
    },
    progress : {
      height: 5
    },
    icon : {
        backgroundColor: 'transparent'

    } ,
    text : {
        fontSize: 17 ,
        fontWeight: 'bold'
    },
    subTitle : {

    },
}


const TEXT = {
    first : '탁송주소지를 아래 주소로 변경해주세요.' ,
    second : '업체에서 신차검수 중입니다.' ,
    third : '신차검수가 완료되었습니다.' ,
    fourth : '업체에서 시공 중 입니다.',
    fifth : '모든 시공이 완료되었습니다.',
}

// 화면 구성 할 때 데이타
const progress = [
    {
        state: 4
    },
    {
        title : '차량 탁송지 지정하기' ,
        text: '고객님께서 \'직접\'\n구매사를 통해\n아래 주소로 변경해주셔야 합니다.'
    } ,
    {
        title : '신차검수 현황' ,
    } ,
    {
        title : '시공 현황' ,
    } ,
    {
        title : '시공완료/출고' ,
        text: '🎉오래 기다리셨습니다!!!🎉\n고객님의 시공이 모두 완료되었습니다.\n아래의 주소로 차량을 찾으러오세요.'
    } ,
]

const labels = ["탁송지\n지정","신차검수","검수완료","시공중","시공완료","출고대기"];
const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 32,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: Color.main,
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: Color.main,
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: Color.main,
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: Color.main,
    stepIndicatorUnFinishedColor: '#aaaaaa',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 15,
    stepIndicatorLabelCurrentColor: Color.main,
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#ffffff',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: Color.main,
  }
  

//서버로 부터 받은 데이터
const DATA=[
    {
        companyName: '',
        companyId: 0,
        contractId: 0,
    },{
        shipmentLocation: ''
    },{
        inspectionImages: []
    },{
        constructionImages: []
    },{
        shipmentLocation: '',
        receipt: ''
    }
]


function ProgressScreen( props ) {
    const[orderId, setOrderId] = React.useState(props.route.params.orderId);
    const[contractId, setContractId] = React.useState();
    const[state,setState] = React.useState(props.route.params.state);
    const[display, setDisplay]=React.useState(props.route.params.state-3);
    const[refresh,setRefresh] = React.useState(false);
    const[visibleInspection,setVisibleInspection] = React.useState(false);
    const[visibleConstruction, setVisibleConstruction] = React.useState(false);
    const[inspectionImages, setInspectionImages] = React.useState([]);
    const[constructionImages, setConstructionImages] = React.useState([]);
    const[inspectionIndex, setInspectionIndex] = React.useState(0);
    const[constructionIndex, setConstructionIndex] = React.useState(0);
    const[shopData, setShopData] = React.useState(DATA);
    const[isLoading, setIsLoading] = React.useState(true);
    const[addChatNum, setAddChatNum] = React.useState(0);
    const[isSending, setIsSending] = React.useState(false);
    const[ReceiptModal, setReceiptModal] = React.useState(false);

    function getReceiptModal(close){
        setReceiptModal(close);
    }


    // async function rdbOn(id){ //캐시를 이용해서 읽지 않은 채팅 감지
    //     console.log(`chat${id}`);
    //     database().goOnline();
    //     database().ref(`chat${id}`).on('value', snapshot => {
    //         //console.log(snapshot.numChildren());
    //         storage.fetch(`chat${id}`)
    //         .then(res=>{
    //             console.log(addChat);
    //             if(snapshot.numChildren() > res) setAddChat(true);
    //         });
    //     });
    // }

    async function checkAddChat(id){
        database().ref(`chat${id}`).on('value', snapshot => {
            if( snapshot.toJSON() === null){
                setAddChatNum(0);
            }
            else{
                const record = Object.values(snapshot.toJSON());
                let count = 0;
                record.map((item)=>{
                    //console.log(item.user);
                    if(item.user._id !== 2 && item.received !== true) count = count+1;
                });
                setAddChatNum(count);
            }
        });
    }

    function rdbOff(){
        database().ref(`chat${contractId}`).off();
    }

    const isFocused = useIsFocused();
    React.useEffect(()=>{
        setIsLoading(true);
        if(isFocused){
            getData()
            .then(res => {
               setIsLoading(false);
            })
        }
        else{
            rdbOff();
        }
    },[isFocused, state])

    const RenderItemInspection = ({item, index}) =>  {
        return(
            <ImageView onPress={ () =>  { setVisibleInspection(true);  setInspectionIndex(index); }}>
                <FastImage source={{ uri : item }} style={{ width: '100%' , height: '100%' }} resizeMode='cover'/>
            </ImageView>
        )
    }
    const RenderItemConstruction = ({item, index}) =>  {
        return(
            <ImageView onPress={ () =>  {setVisibleConstruction(true); setConstructionIndex(index); }}>
                <FastImage source={{ uri : item }} style={{ width: '100%' , height: '100%' }} resizeMode='cover'/>
            </ImageView>
        )
    }

    async function FinalConfirm(){
        Alert.alert(
            '최종 확인',
            '출고를 확정하시겠습니까?',
            [
              {text: '취소', onPress: () => {}},
              {text: '확인', onPress: async () => {
                setIsLoading(true);
                setIsSending(true);
                database().ref(`chat${contractId}`).remove();
                const auth = await checkJwt();
                if(auth !== null){
                    const response = await axios({
                        method: 'PUT',
                        url : `${server.url}/api/contract/7/${contractId}` ,
                        headers : {Auth: auth},
                    })
                    .catch(e=>{
                        checkErrorCode(e, props.navigation);}
                    )
                    //console.log(response);
                    const receiptDetails = response.data.data.details;
                    rdbOff();
                    props.navigation.replace("RegisterReviewScreen",{completedContractId: response.data.data.id, companyName: shopData[0].companyName, receipt: receiptDetails, flag: false});
                }
              }},
            ],
            { cancelable: true }
        );
        setIsLoading(false);
        setIsSending(false);
    }

    async function getData(){
        try{
            setIsLoading(true);
            const auth = await checkJwt();
            if(auth !== null){
                const response = await axios({
                    method: 'GET',
                    url : `${server.url}/api/contract/3/${orderId}`,
                    headers : {Auth: auth},
                })
                .catch(e=>{
                    checkErrorCode(e, props.navigation);
                });
                let rawData = response.data.data;
                //console.log('state:',state,rawData);

                if(rawData !== null){
                    await checkAddChat(rawData.contract_id);
                    let newData = shopData;
                    if(state >= 3){
                        newData[0] = {companyName: rawData.company_name, contractId: rawData.contract_id, companyId: rawData.company_id};
                        newData[1] = {shipmentLocation: rawData.shipment_location, receipt: JSON.parse(rawData.receipt)};
                        setContractId(rawData.contract_id);
                    }
                    if(state >= 4){
                        const img_res = await axios({
                            method: 'GET',
                            url : `${server.url}/api/contract/4/${rawData.contract_id}`,
                            headers : {Auth: auth},
                        })
                        .catch(
                            e=>{checkErrorCode(e, props.navigation);}
                        );
                        let rawImg = img_res.data.data.imageUrlResponseDtos;
                        //console.log(rawImg);
                        imageList=[];
                        images=[];
                        rawImg.map(item => {
                            imageList.push(item.imageUrl);
                            images.push({url: item.imageUrl,});
                        })
                        newData[2] = {inspectionImages: imageList};
                        setInspectionImages(images);
                    }
                    if(state >= 6){
                        const img_res = await axios({
                            method: 'GET',
                            url : `${server.url}/api/contract/6/${rawData.contract_id}`,
                            headers : {Auth: auth},
                        })
                        .catch(
                            e=>{checkErrorCode(e, props.navigation);}
                        );
                        let rawImg = img_res.data.data.responseDtos;
                        imageList=[];
                        images=[];
                        rawImg.map(item => {
                            imageList.push(item.imageUrl);
                            images.push({url: item.imageUrl});
                        })
                        newData[3] = {constructionImages: imageList};
                        setConstructionImages(images);
                    }
                    if(state >= 7){
                        newData[4] = {shipmentLocation: rawData.shipment_location, receipt: JSON.parse(rawData.receipt)};
                    }
                    setShopData(newData);
                    //console.log("newData", newData);
                }
                else{
                    console.log('my data is empty');
                }
            }
            else{
                Alert.alert(
                    '실패',
                    '로그인이 필요합니다.',
                    [
                        {text: '확인', onPress: () => {rdbOff();props.navigation.navigate("LoginScreen");}},
                    ],
                    { cancelable: false }
                );
            }
            setIsLoading(false);
        }
        catch{
            Alert.alert(
                '정보 조회 오류',
                '다시 시도해주세요.',
                [
                    {text: '확인', onPress: () => {}},
                ],
                { cancelable: false }
            );
        }
    
    }

    async function NextState(){
        try{
            Alert.alert(
                state === 3 ? '탁송지를 변경하셨습니까?' : state === 5 ? '시공을 승인하시겠습니까?' : '승인하시겠습니까?',
                state === 3 ? '변경하지 않으면 시공을 받으실 수 없습니다.' : state === 5 ? '되돌릴 수 없습니다.' : '되돌릴 수 없습니다.',
                [
                    {text: '취소', onPress: () => {}},
                    {text: '확인', onPress: async () => {
                        const auth = await checkJwt();
                        if(auth !== null){
                            const response = await axios({
                                method: 'PUT',
                                url : `${server.url}/api/contract/${state}/${orderId}` ,
                                data : {
                                    orderId: orderId
                                },
                                headers : {Auth: auth},
                            }).catch(e=>{
                                checkErrorCode(e, props.navigation);
                            })
                            //console.log(response);
                            setState(state+1);
                        }
                        else{
                            Alert.alert(
                                '실패',
                                '로그인이 필요합니다.',
                                [
                                    {text: '확인', onPress: () => {rdbOff();props.navigation.navigate("LoginScreen")}},
                                ],
                                { cancelable: false }
                            );
                        }
                    }},
                ],
                { cancelable: false }
            );
            setIsSending(false);
        }
        catch{e => {  
            Alert.alert(
                '정보 전송 실패',
                '다시 시도해주세요.',
                [
                    {text: '확인', onPress: () => {}},
                ],
                { cancelable: false }
            );
            console.log(e);
        }}
    }

    return(
        <Provider>
        {/* 사진 상세보기 */}
        <Modal visible={visibleInspection} transparent={true}>
            <ImageViewer 
                imageUrls={inspectionImages} 
                onCancel={()=>{setVisibleInspection(false)}} 
                enableSwipeDown={true} 
                index={inspectionIndex}
                swipeDownThreshold={90}/>
            <IconButton icon='close' style={{ alignSelf: 'flex-end', position: 'absolute', top: AppWindow.IOS_notch}} color={'white'} onPress={ () => { setVisibleInspection(false) }} />
        </Modal>

        <Modal visible={visibleConstruction} transparent={true}>
            <ImageViewer 
                imageUrls={constructionImages} 
                onCancel={()=>{setVisibleConstruction(false)}} 
                enableSwipeDown={true} 
                index={constructionIndex}
                swipeDownThreshold={90}/>
            <IconButton icon='close' style={{ alignSelf: 'flex-end', position: 'absolute', top: 30}} color={'white'} onPress={ () => { setVisibleConstruction(false) }} />
        </Modal>

        <TotalView notchColor={Color.main} homeIndicatorColor={'white'}>
            <View style={{backgroundColor: 'white'}}>
                {/* <Appbar.Header style={{ backgroundColor: Color.main }}>
                <Appbar.BackAction onPress={() => { props.navigation.goBack(); rdbOff(); }} />
                <Appbar.Content title={shopData[0].companyName} titleStyle={{ fontFamily : 'DoHyeon-Regular' , fontSize: 30}} />
                
                </Appbar.Header>   */}
                <TopBar style={{backgroundColor: 'white', borderBottomWidth: 0}}>
                    <TouchableOpacity style={{height: 60, width: 60, justifyContent: 'center', paddingHorizontal: 5}}  onPress={() => { props.navigation.goBack(); rdbOff(); }}>
                        <Icon name="chevron-back-outline" size={30} color={'black'}></Icon>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} onPress={()=>{props.navigation.navigate("ShopScreen_1", {companyId: shopData[0].companyId});}}>
                        <Text style={{ fontFamily : 'DoHyeon-Regular' , fontSize: 25, color: 'black'}}>{shopData[0].companyName}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width: 60, height: 60, justifyContent: 'center', paddingHorizontal: 5, alignItems: 'flex-end'}} onPress={() => { rdbOff(); props.navigation.navigate('ChatScreen',{ companyName : shopData[0].companyName, contractId: contractId}) }}>
                        <MaterialComunityIcons name={"chat"} size={30} color={'black'} style={{elevation: 0}}/>
                        {addChatNum !== 0 && <Badge style={{position: 'absolute', elevation: 1, top: 13, right: 2}} size={15}>{addChatNum}</Badge>}
                    </TouchableOpacity>
                </TopBar>
                
                <Row style={{alignItems: 'center'}}>
                    <Title style={styles.title}>시공 진행 상황</Title>
                    {/* <Title style={{ marginLeft: 20 , color : 'gray' ,marginBottom: 10}}>
                        {
                            state == 3 ? TEXT.first : state == 4 ? TEXT.second : state == 5 ? TEXT.third : state == 6 ? TEXT.fourth : TEXT.fifth 
                        }
                    </Title> */}
                    <Button mode={"outlined"} color={'gray'} icon={'clipboard-check-outline'} onPress={()=>{setReceiptModal(true)}}>시공 목록</Button>
                </Row>
                <View style={{width: '100%', marginBottom: 10}}>
                    <StepIndicator
                        customStyles={customStyles}
                        currentPosition={state-3}
                        labels={labels}
                        stepCount={6}
                    />
                </View>
            </View>
            
            <SwiperView style={{backgroundColor: 'white', marginTop: 10}}>
                <Swiper horizontal={true} index={state-3}
                    //showsButtons={true}
                    // showsHorizontalScrollIndicator={true}
                    showsPagination={false}
                    // prevButton={<Icon name='chevron-back-outline' color={'black'} size={25}/>}
                    // nextButton={<Icon name='chevron-forward-outline' color={'black'} size={25}/>}
                    overScrollMode='auto'
                    loop={false}
                    //onIndexChanged={index=>setDisplay(index)}
                    // renderPagination = { (index,total) => <Title style={{ alignSelf: 'center'}}>{ index+1}/{total}</Title>}
                >  
                    {state >= 3 && <SwiperView>
                        <Title style={{ paddingHorizontal: 10 , paddingVertical: 15, color : state === 3 ? 'red' : 'black', fontWeight: 'bold'}}>
                            {progress[1].title}
                        </Title>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <View style={{width: '75%', flex: 1, justifyContent: 'space-between'}}>
                                <Title style={{fontSize: 18}}>{progress[1].text}</Title>
                                <Title style={{fontWeight: 'bold', paddingHorizontal: 15, marginTop: 15, ...styles.title}}>{'업체 주소:\n'+shopData[1].shipmentLocation}</Title>
                            </View>
                            {state === 3 && <Button mode={'contained'} disabled={isSending} onPress={()=>{setIsSending(true); NextState();}} contentStyle={{width: '100%', height: '100%'}} style={{width: '100%', height: 50, justifyContent: 'center'}} labelStyle={{fontSize: 15}} color={Color.main}>{isSending ? '전달중...': '완료'}</Button>}
                        </View>
                    </SwiperView>}
                    
                    {state >= 4 && <SwiperView>
                        <Row style={{alignItems: 'center'}}>
                            <Title style={{ paddingHorizontal: 10 , paddingVertical: 15, color : (state === 4 || state ===5) ? 'red' : 'black', fontWeight: 'bold'}}>
                                {progress[2].title}
                            </Title>
                        </Row>
                        <FlatList
                            style={{width: '100%', flex: 1}}
                            data={shopData[2].inspectionImages}
                            scrollEnabled={true}
                            renderItem={RenderItemInspection}
                            keyExtractor={item => item}
                            numColumns={3}
                            onRefresh={()=>{getData()}}
                            refreshing={refresh}
                        />
                        {state === 5 && <Button mode={"contained"} disabled={isSending} onPress={() => {setIsSending(true); NextState();}} contentStyle={{width: '100%', height: '100%'}} style={{width: '100%', height: 50, justifyContent: 'center'}} labelStyle={{fontSize: 15}} color={Color.main}>{isSending ? '전달중...': '승인'}</Button>}
                    </SwiperView>}

                    {state >= 6 && <SwiperView>
                        <Title style={{ paddingHorizontal: 10 , paddingVertical: 15, color : state === 6 ? 'red' : 'black', fontWeight: 'bold'}}>
                            {progress[3].title}
                        </Title>
                        <FlatList
                            style={{width: '100%', flex: 1}}
                            data={shopData[3].constructionImages}
                            scrollEnabled={true}
                            renderItem={RenderItemConstruction}
                            keyExtractor={item => item}
                            numColumns={3}
                            onRefresh={()=>{getData()}}
                            refreshing={refresh}
                        />
                    </SwiperView>}

                    {state >= 7 && <SwiperView>
                        <Title style={{ paddingHorizontal: 10 , paddingVertical: 15, color : state === 7 ? 'red' : 'black', fontWeight: 'bold'}}>
                            {progress[4].title}
                        </Title>
                        <View style={{width: '100%', flex: 1}}>
                            <ScrollView>
                            <Title style={{padding: 10, fontSize: 15}}>{progress[4].text}</Title>
                            <Title style={{fontWeight: 'bold', paddingHorizontal: 15, marginTop: 15}}>{'=> '+shopData[4].shipmentLocation}</Title>
                            <View style={{paddingHorizontal: 10, marginTop: 10, marginBottom: 15}}>
                                <Title style={{color: 'black', fontSize: 15}}>{'모든시공이 완료되었는지 확인 후\n아래 \'출고 확정\' 버튼을 눌러주세요'}</Title>
                            </View>
                            <FinalReceipt receipt={shopData[4].receipt} isModal={false}/>
                            <Button contentStyle={{width: '100%', height: '100%'}} style={{width: '100%', height: 50, justifyContent: 'center', marginTop: 20}} labelStyle={{fontSize: 15}} color={Color.main}mode={'contained'} disabled={isSending} onPress={()=>{setIsSending(true); FinalConfirm()}}>{isSending ? '확정중...':'출고 확정'}</Button>
                            </ScrollView>
                        </View>
                    </SwiperView>}
                    
                </Swiper>
            </SwiperView>
            {/* <View style={{position: 'absolute', bottom: 20, alignSelf: 'flex-end', right: 25,}}>
                <FAB style={{ backgroundColor: Color.main, alignItems: 'center', justifyContent: 'center', elevation: 0, width: 70, height: 70, borderRadius: 50}} icon="chat" onPress={() => { rdbOff(); props.navigation.navigate('ChatScreen',{ companyName : shopData[0].companyName, contractId: contractId}) }} color='white'/>
                {addChatNum !== 0 && <Badge style={{position: 'absolute', elevation: 1}}>{addChatNum}</Badge>}
            </View> */}
            {isLoading && <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', position: 'absolute', backgroundColor: 'rgba(0,0,0,0.3)'}}>
                <ActivityIndicator size = 'large' color= {Color.main}/>
            </View>}

        </TotalView>

        <Modal
            animationType="slide"
            transparent={true}
            visible={ReceiptModal}
            onRequestClose={() => {setReceiptModal(!ReceiptModal);}}
        >
            <ModalView>
                <View style={{width: '90%'}}>
                    <JustShowOrder getModal={getReceiptModal} orderId={orderId}/>
                </View>
            </ModalView>
        </Modal>
        </Provider>
    );
}

export default ProgressScreen;