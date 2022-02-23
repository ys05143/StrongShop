import React from 'react';
import styled from 'styled-components/native';
import { Alert, TouchableOpacity, Text, View, Modal, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import StepIndicator from 'react-native-step-indicator';
import Swiper  from 'react-native-swiper';
import database from '@react-native-firebase/database';
import Icon from "react-native-vector-icons/Ionicons";
import MaterialComunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Title, Badge, Button, IconButton }  from 'react-native-paper';
import ImageViewer from 'react-native-image-zoom-viewer';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
//component
import TotalView from '../components/TotalView';
import TopBar from '../components/TopBar';
import ModalView from '../components/ModalView';
import FinalReceipt from '../NewCarPackage/FinalReceipt';
import Row from '../components/Row';
//constant
import Color from '../constants/Color';
import AppWindow from '../constants/AppWindow';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';
import checkErrorCode from '../function/checkErrorCode';

const WIDTH = AppWindow.width;

const DATA=[
    {
        companyName: '',
        companyId: 0,
        contractId: 0,
    },{
        shipmentLocation: '',
        receipt: '',
    },{
        constructionImages: []
    },{
        shipmentLocation: '',
        receipt: '',
    }
]

const labels = ["차량전달","시공 중","시공완료/\n출고대기"];
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

const SwiperView = styled.View`
  width: 100%;
  flex: 1;
`;
const ImageView = styled.TouchableOpacity`
  width: ${(WIDTH-6)/3}px;
  height: ${(WIDTH-6)/3}px;
  background-color: #e5e5e5;
  margin: 1px;
`;

function CareProgressScreen(props){
    const[orderId, setOrderId] = React.useState(props.route.params.orderId);
    const[state,setState] = React.useState(props.route.params.state);
    const[contractId, setContractId] = React.useState(null);
    const[isLoading, setIsLoading] = React.useState(true);
    const[addChatNum, setAddChatNum] = React.useState(0);
    const[shopData, setShopData] = React.useState(DATA);
    const[ReceiptModal, setReceiptModal] = React.useState(false);
    function getReceiptModal(close){
        setReceiptModal(close);
    }
    const swiper = React.useRef();
    const[isSending, setIsSending] = React.useState(false);
    const[refresh,setRefresh] = React.useState(false);
    const[visibleConstruction, setVisibleConstruction] = React.useState(false);
    const[constructionImages, setConstructionImages] = React.useState([]);
    const[constructionIndex, setConstructionIndex] = React.useState(0);

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
    },[isFocused, state]);

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

    async function getData(){
        try{
            setIsLoading(true);
            const auth = await checkJwt();
            if(auth !== null){
                const response = await axios({
                    method: 'GET',
                    url : `${server.url}/api/contract/care/2/${orderId}`,
                    headers : {Auth: auth},
                })
                let rawData = response.data.data;
                await checkAddChat(rawData.contract_id);

                let newData = shopData;
                newData[0] = {
                    companyName: rawData.company_name,
                    companyId: rawData.company_id,
                    contractId: rawData.contract_id,
                }
                newData[1] = {
                    shipmentLocation: rawData.shipment_location,
                    receipt: JSON.parse(rawData.receipt),
                }
                setContractId(rawData.contract_id);
                setShopData(newData);
                if(state >= 4){
                    const img_res = await axios({
                        method: 'GET',
                        url : `${server.url}/api/contract/care/4/${rawData.contract_id}`,
                        headers : {Auth: auth},
                    })
                    let rawImg = img_res.data.data.responseDtos;
                    imageList=[];
                    images=[];
                    rawImg.map(item => {
                        imageList.push(item.imageUrl);
                        images.push({url: item.imageUrl});
                    })
                    newData[2] = {constructionImages: imageList};
                    setConstructionImages(images);
                }
                if(state >= 5){
                    newData[3] = {
                        shipmentLocation: rawData.shipment_location, 
                        receipt: JSON.parse(rawData.receipt)
                    };
                }
            }
            else{
                Alert.alert(
                    '실패',
                    '로그인이 필요합니다.',
                    [
                        {text: '확인', onPress: () => {rdbOff(); props.navigation.navigate("LoginScreen");}},
                    ],
                    { cancelable: false }
                );
            }
            setIsLoading(false);
        }
        catch{
            Alert.alert(
                '정보 조회 실패',
                '다시 시도해주세요.',
                [
                    {text: '확인', onPress: () => {props.navigation.navigate("MainScreen");}},
                ],
                { cancelable: false }
            );
        }
    
    }
    function changeSwiper(position){
        if( position > state-3 ){
            return ;
        }
        else{
            swiper.current.scrollTo(position);
        }
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
                        url : `${server.url}/api/contract/care/5/${contractId}` ,
                        headers : {Auth: auth},
                    })
                    //console.log(response);
                    const receiptDetails = response.data.data.details;
                    rdbOff();
                    props.navigation.replace("RegisterReviewScreen",{completedContractId: response.data.data.id, companyName: shopData[0].companyName, receipt: receiptDetails, flag: true});
                }
              }},
            ],
            { cancelable: true }
        );
        setIsLoading(false);
        setIsSending(false);
    }

    return(
        <>
        <Modal visible={visibleConstruction} transparent={true}>
            <ImageViewer 
                imageUrls={constructionImages} 
                onCancel={()=>{setVisibleConstruction(false)}} 
                enableSwipeDown={true} 
                index={constructionIndex}
                swipeDownThreshold={90}/>
            <IconButton icon='close' style={{ alignSelf: 'flex-end', position: 'absolute', top: 30}} color={'white'} onPress={ () => { setVisibleConstruction(false) }} />
        </Modal>

        <TotalView notchColor={'white'} homeIndicatorColor={'white'}>
            <TopBar style={{backgroundColor: 'white', borderBottomWidth: 0}}>
                <TouchableOpacity style={{height: 60, width: 60, justifyContent: 'center', paddingHorizontal: 5}}  onPress={() => {rdbOff(); props.navigation.goBack(); }}>
                    <Icon name="chevron-back-outline" size={30} color={'black'}></Icon>
                </TouchableOpacity>
                <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} onPress={()=>{props.navigation.navigate("ShopScreen_1", {companyId: shopData[0].companyId});}}>
                    <Text style={{ fontFamily : 'DoHyeon-Regular' , fontSize: 25, color: 'black'}}>{shopData[0].companyName}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{width: 60, height: 60, justifyContent: 'center', paddingHorizontal: 5, alignItems: 'flex-end'}} onPress={() => {rdbOff(); props.navigation.navigate('ChatScreen',{ companyName : shopData[0].companyName, contractId: shopData[0].contractId}) }}>
                    <MaterialComunityIcons name={"chat"} size={30} color={'black'} style={{elevation: 0}}/>
                    {addChatNum !== 0 && <Badge style={{position: 'absolute', elevation: 1, top: 13, right: 2}} size={15}>{addChatNum}</Badge>}
                </TouchableOpacity>
            </TopBar>
            <View style={{backgroundColor: 'white'}}>
                <Row style={{alignItems: 'center'}}>
                    <Title style={{fontFamily : 'DoHyeon-Regular', fontSize: 30, padding: 20}}>시공 진행 상황</Title>
                    <Button mode={"outlined"} color={'gray'} icon={'clipboard-check-outline'} onPress={()=>{setReceiptModal(true)}}>최종 견적</Button>
                </Row>
                <View style={{width: '100%', marginBottom: 10}}>
                    <StepIndicator
                        customStyles={customStyles}
                        currentPosition={state-3}
                        labels={labels}
                        stepCount={3}
                        onPress={(position)=>{changeSwiper(position)}}
                    />
                </View>
            </View>
            <SwiperView style={{backgroundColor: 'white', marginTop: 10}}>
                <Swiper 
                    ref={swiper}
                    horizontal={true} 
                    index={state-3}
                    showsPagination={false}
                    overScrollMode='auto'
                    loop={false}
                >  
                    {state >= 3 && <SwiperView>
                        <Title style={{ paddingHorizontal: 10 , paddingVertical: 15, color : state === 3 ? 'red' : 'black', fontWeight: 'bold'}}>
                            {'업체에 차량 전달하기'}
                        </Title>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <View style={{width: '75%', flex: 1, justifyContent: 'space-between'}}>
                                <Title style={{fontSize: 18}}>{'고객님께서 \'직접\'\n아래 주소로\n차량을 가지고 가셔야 합니다.'}</Title>
                                <View>
                                    <Title style={{fontWeight: 'bold', paddingHorizontal: 15, marginTop: 15, fontSize: 20, fontFamily: 'DoHyeon-Regular'}}>{'업체 주소:'}</Title>
                                    <Title style={{fontWeight: 'bold', paddingHorizontal: 15, marginBottom: 15, fontSize: 30, fontFamily: 'DoHyeon-Regular'}}>{shopData[1].shipmentLocation}</Title>
                                </View>
                            </View>
                        </View>
                    </SwiperView>}

                    {state >= 4 && <SwiperView>
                        <Title style={{ paddingHorizontal: 10 , paddingVertical: 15, color : state === 4 ? 'red' : 'black', fontWeight: 'bold'}}>
                            {'시공 현황'}
                        </Title>
                        <View style={{flex:1}}>
                            <FlatList
                                data={shopData[2].constructionImages}
                                scrollEnabled={true}
                                renderItem={RenderItemConstruction}
                                keyExtractor={item => item}
                                numColumns={3}
                                onRefresh={()=>{getData()}}
                                refreshing={refresh}
                            />
                        </View>
                    </SwiperView>}

                    {state >= 5 && <SwiperView>
                        <Title style={{ paddingHorizontal: 10 , paddingVertical: 15, color : state === 5 ? 'red' : 'black', fontWeight: 'bold'}}>
                            {'시공완료/출고'}
                        </Title>
                        <View style={{width: '100%', flex: 1}}>
                            <ScrollView>
                                <Title style={{padding: 10, fontSize: 15}}>{'🎉오래 기다리셨습니다!!!🎉\n고객님의 시공이 모두 완료되었습니다.\n아래의 주소로 차량을 찾으러오세요.'}</Title>
                                <Title style={{fontWeight: 'bold', paddingHorizontal: 15, marginTop: 15}}>{'=> '+shopData[3].shipmentLocation}</Title>
                                <View style={{paddingHorizontal: 10, marginTop: 10, marginBottom: 15}}>
                                    <Title style={{color: 'black', fontSize: 15}}>{'모든시공이 완료되었는지 확인 후\n아래 \'출고 확정\' 버튼을 눌러주세요'}</Title>
                                </View>
                                <FinalReceipt receipt={shopData[3].receipt} isModal={false} kind={'Care'}/>
                                <Button contentStyle={{width: '100%', height: '100%'}} style={{width: '100%', height: 50, justifyContent: 'center', marginTop: 15}} labelStyle={{fontSize: 15}} color={Color.main}mode={'contained'} disabled={isSending} onPress={()=>{FinalConfirm()}}>{isSending ? '확정중...':'출고 확정'}</Button>
                            </ScrollView>
                        </View>
                    </SwiperView>}

                </Swiper>
            </SwiperView>
            
            {(isLoading || isSending) && <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', position: 'absolute', backgroundColor: 'rgba(0,0,0,0.3)'}}>
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
                <View style={{width: '90%', height: '90%',backgroundColor: 'white', padding: 20, justifyContent: 'center'}}>
                    <ScrollView>
                        <FinalReceipt getModal={getReceiptModal} receipt={shopData[1].receipt} isModal={true} kind={'Care'}/>
                    </ScrollView>
                </View>
            </ModalView>
        </Modal>
        </>
    )
}

export default CareProgressScreen;