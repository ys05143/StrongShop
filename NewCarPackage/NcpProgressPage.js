import React from 'react';
import styled from 'styled-components/native';
import { Title  , ProgressBar, Avatar , Appbar , List , Badge , Button , IconButton , Portal , Provider, FAB, Divider}  from 'react-native-paper';
import { FlatList , ScrollView, Alert, Text, ActivityIndicator, Modal, TouchableOpacity, View } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import { useIsFocused } from '@react-navigation/native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from "react-native-vector-icons/Ionicons";
import StepIndicator from 'react-native-step-indicator';
import MaterialComunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import database from '@react-native-firebase/database';
import TopBar from '../components/TopBar';
import Color from '../constants/Color';
import JustShowOrder from './JustShowOrder';
import ModalView from '../components/ModalView';
import FinalReceipt from './FinalReceipt';
import { MainText, MenuTitleText, MenuContentText, JuaText, NotoSansText } from "../components/TextStyle";
import Accordion from 'react-native-collapsible/Accordion';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';
import checkErrorCode from '../function/checkErrorCode';
import AppWindow from '../constants/AppWindow';
import CustButton from '../components/CustButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import TotalIndicator from '../components/TotalIndicator';

const WIDTH = AppWindow.width;
const Row = styled.View`
    flex-direction: row ;
    align-items: center;
`;
const ImageView = styled.TouchableOpacity`
    width: ${(WIDTH-6)/3}px;
    height: ${(WIDTH-6)/3}px;
    background-color: #e5e5e5;
    margin: 1px;
`;
const SwiperView = styled.View`
    width: ${WIDTH}px;
    flex: 1;
    background-color: white;
`;

const MenuBox = styled.View`
    width: 95%;
    border: 2px solid ${Color.menuBorder};
    background-color: ${Color.menuBackgrund};
    border-radius: 5px;
    margin-bottom: 10px;
`;
const MenuTitle = styled.View`
    width: 100%;
    height: 35px;
    background-color: white;
    align-items: center;
    justify-content: center;
    border-bottom-color: ${Color.menuTitleBorder};
    border-bottom-width: 2px;
    flex-direction: row;
`;
const MenuContent = styled.View`
    width: 100%;
    padding: 10px 0px;
`;

// 화면 구성 할 때 데이타
const progress = [
    {
        state: 4
    },
    {
        title : '차량 탁송지 지정하기' ,
        text: '고객님께서 \'직접\'\n구매사를 통해\n아래 주소로 변경해주셔야 합니다.',
        stateText: '업체에서 대기 중 입니다.'
    } ,
    {
        title : '신차검수 현황' ,
        stateText: '업체에서 신차를 검수 중 입니다.'
    } ,
    {
        title : '시공 현황' ,
        stateText: '업체에서 시공 중 입니다.'
    } ,
    {
        title : '시공완료/출고' ,
        text: '🎉오래 기다리셨습니다!!!🎉\n고객님의 시공이 모두 완료되었습니다.\n아래의 주소로 차량을 찾으러오세요.',
        stateText: '업체에서 모든 시공을 완료하였습니다.'
    } ,
]

const labels = ["탁송지\n지정","신차검수","검수완료","시공 중","시공완료","출고대기"];
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
        shipmentLocation: '',
        receipt: {...InitialOptions},
    },{
        inspectionImages: []
    },{
        constructionImages: []
    },{
        shipmentLocation: '',
        receipt: ''
    }
]
const InitialOptions = {
    tinting: false,
    detailTinting: {
        LUMA: false,
        SOLAR: false,
        RAINBOW: false,
        RAYNO: false,
        ANY: false,
        ETC: '',
    },
    ppf: false,
    detailPpf: {
        BONNET: false,
        SIDEMIRROR: false,
        FRONTBUMPER: false,
        FRONTBUMPERSIDE:false,
        BACKBUMPER: false,
        BACKBUMPERSIDE: false,
        HEADLIGHT: false,
        TAILLAMP: false,
        BCFILTER: false,
        DOOR: false,
        HOOD: false,
        ETC: '',
    },
    blackbox: false,
    detailBlackbox: {
        FINETECH: false,
        INAVI: false,
        MANDO: false,
        ANY: false,
        ETC: '',
    },
    battery: false,
    detailBattery: {
        V6: false,
        V12: false,
        ANY: false,
        ETC: '',
    },
    afterblow: false,
    detailAfterblow: {
        ANY: false,
        ETC: '',
    },
    //추가옵션
    soundproof: false,
    detailSoundproof: {
        DOORSOUND: false,
        INSIDEFLOOR: false,
        FENDER: false,
        BONNETSOUND: false,
        TRUNK: false,
        ETC: '',
    },
    wrapping: false,
    detailWrapping: {
        DESIGN: '',
    },
    bottomcoating: false,
    detailBottomcoating:{
        UNDER: false,
        POLYMER: false,
    },
    glasscoating: false,
}


function NcpProgressPage( props ) {
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
    const swiper = React.useRef();

    function getReceiptModal(close){
        setReceiptModal(close);
    }

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
                        url : `${server.url}/api/contract/ncp/7/${contractId}` ,
                        headers : {Auth: auth},
                    })
                    .catch(e=>{
                        checkErrorCode(e, props.navigation);}
                    )
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

    async function getData(){
        try{
            setIsLoading(true);
            const auth = await checkJwt();
            if(auth !== null){
                const response = await axios({
                    method: 'GET',
                    url : `${server.url}/api/contract/ncp/3/${orderId}`,
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
                            url : `${server.url}/api/contract/ncp/4/${rawData.contract_id}`,
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
                            url : `${server.url}/api/contract/ncp/6/${rawData.contract_id}`,
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
                '정보 조회 실패',
                '다시 시도해주세요.',
                [
                    {text: '확인', onPress: () => {props.navigation.navigate("MainScreen");}},
                ],
                { cancelable: false }
            );
        }
    
    }

    async function NextState(){
        try{
            Alert.alert(
                state === 3 ? '탁송지를 변경하셨습니까?' : state === 5 ? '차량을 인수하시겠습니까?' : '승인하시겠습니까?',
                state === 3 ? '변경하지 않으면 시공을 받으실 수 없습니다.' : state === 5 ? '인수를 결정하시면 바로 시공을 시작합니다.' : '되돌릴 수 없습니다.',
                [
                    {text: '취소', onPress: () => {}},
                    {text: '확인', onPress: async () => {
                        setIsLoading(true);
                        setIsSending(true);
                        const auth = await checkJwt();
                        if(auth !== null){
                            const response = await axios({
                                method: 'PUT',
                                url : `${server.url}/api/contract/ncp/${state}/${orderId}` ,
                                data : {
                                    orderId: orderId
                                },
                                headers : {Auth: auth},
                            }).catch(e=>{
                                checkErrorCode(e, props.navigation);
                            })
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
                        setIsLoading(false);
                        setIsSending(false);
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

    function changeSwiper(position){
        if( position > state-3 ){
            return ;
        }
        else{
            if(position === 0) swiper.current.scrollTo(0);
            else if(position === 1 || position === 2) swiper.current.scrollTo(1);
            else if(position === 3) swiper.current.scrollTo(2);
            else if(position === 4 || position === 5) swiper.current.scrollTo(3);
            else swiper.current.scrollTo(state-3);
        }

    }

     //for acodian
     const [activeSections, setActiveSections] = React.useState([]);

     function _renderHeader (section, index, isActive) {
         return (
             <MenuTitle>
                <MenuTitleText>시공 내역</MenuTitleText>
                <View style={{position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'flex-end'}}>
                    <IconButton icon= {isActive ? 'chevron-up' : 'chevron-down'} size={18}  color={Color.mainText}/>
                </View>
            </MenuTitle>
            
         );
     };
 
     const _renderContent = section => {
         return(
            <MenuContent style={{height: 200}}>
                <ScrollView>
                    <FinalReceipt getModal={getReceiptModal} receipt={shopData[1].receipt} isModal={false} kind={'NewCarPackage'}/>
                </ScrollView>
            </MenuContent>
         )
     };
 
     const _updateSections = activeSections => {
         setActiveSections(activeSections);
     };

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

        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            
            <TopBar style={{backgroundColor: 'white', borderBottomWidth: 0}}>
                <TouchableOpacity style={{height: 60, width: 60, justifyContent: 'center', paddingHorizontal: 5}}  onPress={() => { props.navigation.goBack(); rdbOff(); }}>
                    <Icon name="chevron-back-outline" size={30} color={'black'}></Icon>
                </TouchableOpacity>
                <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} onPress={()=>{props.navigation.navigate("CompanyPage", {companyId: shopData[0].companyId});}}>
                    <JuaText style={{ fontSize: 25 }}>{shopData[0].companyName}</JuaText>
                </TouchableOpacity>
                <TouchableOpacity style={{width: 60, height: 60, justifyContent: 'center', paddingHorizontal: 5, alignItems: 'flex-end'}} onPress={() => { rdbOff(); props.navigation.navigate('ChatPage',{ companyName : shopData[0].companyName, contractId: contractId}) }}>
                    <MaterialComunityIcons name={"chat"} size={30} color={'black'} style={{elevation: 0}}/>
                    {addChatNum !== 0 && <Badge style={{position: 'absolute', elevation: 1, top: 13, right: 2}} size={15}>{addChatNum}</Badge>}
                </TouchableOpacity>
            </TopBar>
            
            <View style={{backgroundColor: 'white', alignItems: 'center'}}>
                <MenuBox>
                    <MenuTitle>
                        <MenuTitleText>시공 진행 상황</MenuTitleText>
                    </MenuTitle>
                    <MenuContent>
                        <Row style={{marginLeft: 10, marginTop: 5, marginBottom: 10}}>
                            <Icon name={'ellipse'} style={{marginRight: 5}} size={10}/>
                            <JuaText style={{fontSize: 18}}>시공 진행 상황:</JuaText>
                            {/* <JuaText style={{color: 'gray', fontSize: 16, marginLeft: 5}}>{progress[state-2].stateText}</JuaText> */}
                        </Row>
                        <View style={{width: '100%'}}>
                            <StepIndicator
                                customStyles={customStyles}
                                currentPosition={state-3}
                                labels={labels}
                                stepCount={6}
                                onPress={(position)=>{changeSwiper(position)}}
                            />
                        </View> 
                    </MenuContent>
                </MenuBox>
                <MenuBox>
                    <Accordion
                    sections={['시공내용']}
                    activeSections={activeSections}
                    renderHeader={_renderHeader}
                    renderContent={_renderContent}
                    onChange={_updateSections}
                    underlayColor='transparent'
                    />
                </MenuBox>
            </View>

            <Divider style={{height: 10}}/>
            

            <SwiperFlatList 
                ref={swiper}
                horizontal={true} 
                index={state === 3 ? 0 : state === 4 ? 1 : state === 5 ? 1 : state === 6 ? 2 : state === 7 ? 3 : 0}
                showsPagination={false}
                loop={false}
                style={{flex: 1}}
            >  
                {state >= 3 && <SwiperView>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <JuaText style={{ paddingHorizontal: 10 , paddingVertical: 15, color : state === 3 ? 'red' : 'black', fontSize: 23}}>
                            {progress[1].title}
                        </JuaText>
                        <View style={{alignItems: 'center'}}>
                            <View style={{width: '75%'}}>
                                <NotoSansText style={{fontSize: 18}}>{progress[1].text}</NotoSansText>
                                <View>
                                    <JuaText style={{paddingHorizontal: 15, marginTop: 15, fontSize: 20}}>{'업체 주소:'}</JuaText>
                                    <JuaText style={{paddingHorizontal: 15, marginBottom: 15, fontSize: 30}}>{shopData[1].shipmentLocation}</JuaText>
                                </View>
                            </View>
                            {state === 3 && <Button mode={"contained"} color={Color.main} disabled={isLoading} onPress={()=>{setIsSending(true); NextState();}} style={{ width: '95%', height: 50, justifyContent: 'center', borderRadius: 15, borderWidth: 2, borderColor: Color.main, backgroundColor: 'white'}} contentStyle={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 15}} labelStyle={{fontFamily: 'NotoSansKR-Medium', fontSize: 18}}>탁송지 지정 완료</Button>}
                        </View>
                    </ScrollView>
                </SwiperView>}
                {state >= 4 && <SwiperView>
                    <Row>
                        <JuaText style={{ paddingHorizontal: 10 , paddingVertical: 15, color : (state === 4 || state ===5) ? 'red' : 'black', fontSize: 23}}>
                            {progress[2].title}
                        </JuaText>
                    </Row>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <FlatList
                            style={{width: '100%', flex: 1}}
                            data={shopData[2].inspectionImages}
                            scrollEnabled={true}
                            renderItem={RenderItemInspection}
                            keyExtractor={item => item}
                            numColumns={3}
                            onRefresh={()=>{getData()}}
                            refreshing={refresh}
                            showsVerticalScrollIndicator={false}
                        />
                        {state === 5 && <Button mode={"contained"} color={Color.main} disabled={isLoading} onPress={()=>{setIsSending(true); NextState();}} style={{ width: '95%', height: 50, justifyContent: 'center', borderRadius: 15, borderWidth: 2, borderColor: Color.main, backgroundColor: 'white'}} contentStyle={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 15}} labelStyle={{fontFamily: 'NotoSansKR-Medium', fontSize: 18}}>{isSending ? '전달중...': '승인'}</Button>}
                    </View>
                    
                </SwiperView>}

                {state >= 6 && <SwiperView>
                    <Row>
                        <JuaText style={{ paddingHorizontal: 10 , paddingVertical: 15, color : state === 6 ? 'red' : 'black', fontSize: 23}}>
                            {progress[3].title}
                        </JuaText>
                    </Row>
                    <View style={{flex: 1}}>
                        <FlatList
                            style={{width: '100%', flex: 1}}
                            data={shopData[3].constructionImages}
                            scrollEnabled={true}
                            renderItem={RenderItemConstruction}
                            keyExtractor={item => item}
                            numColumns={3}
                            onRefresh={()=>{getData()}}
                            refreshing={refresh}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </SwiperView>}

                {state >= 7 && <SwiperView>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <JuaText style={{ paddingHorizontal: 10 , paddingVertical: 15, color : state === 7 ? 'red' : 'black', fontSize: 23}}>
                            {progress[4].title}
                        </JuaText>
                        <View style={{flex: 1}}>
                            <NotoSansText style={{padding: 10, fontSize: 15}}>{progress[4].text}</NotoSansText>
                            <JuaText style={{fontSize: 20, paddingHorizontal: 15, marginTop: 15}}>{'=> '+shopData[4].shipmentLocation}</JuaText>
                            <View style={{paddingHorizontal: 10, marginTop: 10, marginBottom: 15}}>
                                <NotoSansText style={{color: 'black', fontSize: 15}}>{'모든시공이 완료되었는지 확인 후\n아래 \'출고 확정\' 버튼을 눌러주세요'}</NotoSansText>
                            </View>
                            <FinalReceipt receipt={shopData[4].receipt} isModal={false} kind={'NewCarPackage'}/>
                        </View>
                        <View style={{width: '100%', alignItems: 'center', marginTop: 10}}>
                            <Button mode={"contained"} color={Color.main} disabled={isSending} onPress={()=>{setIsSending(true); FinalConfirm();}} style={{ width: '95%', height: 50, justifyContent: 'center', borderRadius: 15, borderWidth: 2, borderColor: Color.main, backgroundColor: 'white'}} contentStyle={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 15}} labelStyle={{fontFamily: 'NotoSansKR-Medium', fontSize: 18}}>{isSending ? '확정중...':'출고 확정'}</Button>
                        </View>
                    </ScrollView>
                </SwiperView>}
            </SwiperFlatList>

            {(isLoading || isSending) && <TotalIndicator/>}

        </SafeAreaView>

        <Modal
            animationType="slide"
            transparent={true}
            visible={ReceiptModal}
            onRequestClose={() => {setReceiptModal(!ReceiptModal);}}
        >
            <ModalView>
                <View style={{width: '90%', height: '90%',backgroundColor: 'white', padding: 20, justifyContent: 'center'}}>
                    <ScrollView>
                        <FinalReceipt getModal={getReceiptModal} receipt={shopData[1].receipt} isModal={true} kind={'NewCarPackage'}/>
                    </ScrollView>
                </View>
            </ModalView>
        </Modal>
        </Provider>
    );
}

export default NcpProgressPage;