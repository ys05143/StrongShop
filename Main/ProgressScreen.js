import React from 'react';
import styled from 'styled-components/native';
import { Title  , ProgressBar, Avatar , Appbar , List , Badge , Button , IconButton , Portal , Provider, FAB, Divider}  from 'react-native-paper';
import { FlatList , ScrollView, Alert, Text, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import Color from '../constants/Color';
import FastImage from 'react-native-fast-image';
import _, { add } from 'lodash';
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import ImageViewer from 'react-native-image-zoom-viewer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
//import { request , PERMISSIONS } from 'react-native-permissions';
import Swiper  from 'react-native-swiper';
import database from '@react-native-firebase/database';
import storage from '../function/storage';
import TopBar from '../components/TopBar';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';
import checkErrorCode from '../function/checkErrorCode';
import TotalView from '../components/TotalView';

const View = styled.View``;
const Row = styled.View`
    flex-direction: row ;
    align-items: center;
`;
const CButton = styled.TouchableOpacity`
    width: 100%;
    height: 300px;
    margin-bottom: 10px;
`;
const SwiperView = styled.View`
    width: 100%;
    flex: 1;
`;
const InfoView = styled.View`
    width: 100%;
    height: 250px;
    background-color: lightgray;
    border-radius: 10px;
    padding: 5px 10px;
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
    } ,
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

    }
}


const TEXT = {
    first : '탁송주소지를 아래 주소로 변경해주세요.' ,
    second : '업체에서 신차검수 중입니다.' ,
    third : '업체에서 시공진행 중입니다.' ,
    fourth : '모든 시공이 완료되었습니다.'
}

// 화면 구성 할 때 데이타
const progress = [
    {
        state: 4
    },
    {
        title : '차량 탁송지 지정하기' ,
        text: '❗️❗️고객님께서 \'직접\'\n 구매사를 통해 변경해주셔야 합니다.❗️❗️'
    } ,
    {
        title : '신차검수 현황' ,
    } ,
    {
        title : '시공진행 현황' ,
    } ,
    {
        title : '시공완료/출고' ,
        text: '🎉오래 기다리셨습니다!!!🎉\n고객님의 시공이 모두 완료되었습니다.\n아래의 주소로 차량을 찾으러오세요.🚗'
    } ,
]

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
                    if(item.user !== 2 && item.received !== true) count = count+1;
                });
                setAddChatNum(count);
            }
        });
    }

    function rdbOff(id){
        database().ref(`chat${id}`).off
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
    },[isFocused, state])

    const RenderItemInspection = ({item}) =>  {
        return(
            <CButton onPress={ () =>  { setVisibleInspection(true) }}>
                <FastImage source={{ uri : item }} style={{ width: '100%' , height: '100%' }} resizeMode='contain'/>
            </CButton>
        )
    }
    const RenderItemConstruction = ({item}) =>  {
        return(
            <CButton onPress={ () =>  {setVisibleConstruction(true) }}>
                <FastImage source={{ uri : item }} style={{ width: '100%' , height: '100%' }} resizeMode='contain'/>
            </CButton>
        )
    }

    async function FinalConfirm(){
        Alert.alert(
            '확인',
            '출고를 확정하시겠습니까?',
            [
              {text: '예', onPress: async () => {
                setIsLoading(true);
                setIsSending(true);
                setTimeout(async() => {
                    const auth = await checkJwt();
                    if(auth !== null){
                    const response = await axios({
                        method: 'PUT',
                        url : `${server.url}/api/contract/7/${contractId}` ,
                        headers : {Auth: auth},
                    }).catch(e=>checkErrorCode(e))
                    //console.log(response);
                    const receiptDetails = response.data.data.details;
                    rdbOff(contractId);
                    props.navigation.replace("RegisterReviewScreen",{completedContractId: response.data.data.id, companyName: shopData[0].companyName, receipt: receiptDetails});
                }
                }, 5000);
                // const auth = await checkJwt();
                // if(auth !== null){
                //     const response = await axios({
                //         method: 'PUT',
                //         url : `${server.url}/api/contract/7/${contractId}` ,
                //         headers : {Auth: auth},
                //     }).catch(e=>checkErrorCode(e))
                //     //console.log(response);
                //     const receiptDetails = response.data.data.details;
                //     rdbOff(contractId);
                //     props.navigation.replace("RegisterReviewScreen",{completedContractId: response.data.data.id, companyName: shopData[0].companyName, receipt: receiptDetails});
                // }
              }},
              {text: '아니요', onPress: () => {}}
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
                    checkErrorCode(e);
                });
                let rawData = response.data.data;
                console.log('state:',state,rawData);

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
                            e=>{checkErrorCode(e);}
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
                            e=>{checkErrorCode(e);}
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
                '오류',
                'ProgressScreen get 오류',
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
                '승인하시겠습니까?',
                '되돌리실 수 없습니다.',
                [
                    {text: '예', onPress: async () => {
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
                                checkErrorCode(e);
                            })
                            console.log(response);
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
                    {text: '아니요', onPress: () => {}},
                ],
                { cancelable: false }
            );
            setIsSending(false);
        }
        catch{e => {  
            Alert.alert(
                '오류',
                'ProgressScreen Next 오류',
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
            <ImageViewer imageUrls={inspectionImages}/>
            <IconButton icon='close' style={{ alignSelf: 'flex-end', position: 'absolute', top: 30}} color={'white'} onPress={ () => { setVisibleInspection(false) }} />
        </Modal>

        <Modal visible={visibleConstruction} transparent={true}>
            <ImageViewer imageUrls={constructionImages}/>
            <IconButton icon='close' style={{ alignSelf: 'flex-end', position: 'absolute', top: 30}} color={'white'} onPress={ () => { setVisibleConstruction(false) }} />
        </Modal>

        <TotalView notchColor={Color.main}>
            <View>
                {/* <Appbar.Header style={{ backgroundColor: Color.main }}>
                <Appbar.BackAction onPress={() => { props.navigation.goBack(); rdbOff(contractId); }} />
                <Appbar.Content title={shopData[0].companyName} titleStyle={{ fontFamily : 'DoHyeon-Regular' , fontSize: 30}} />
                
                </Appbar.Header>   */}
                <TopBar style={{backgroundColor: Color.main}}>
                    <TouchableOpacity style={{height: 60, justifyContent: 'center', paddingHorizontal: 5}} onPress={() => { props.navigation.goBack(); rdbOff(contractId); }}>
                        <Icon name="chevron-back-outline" size={30} color={'white'}></Icon>
                    </TouchableOpacity>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{ fontFamily : 'DoHyeon-Regular' , fontSize: 30, color: 'white'}}>{shopData[0].companyName}</Text>
                    </View>
                    <View style={{width: 40}}/>
                </TopBar>
                <ProgressBar style={styles.progress} progress={(state-3)/4} color='red'  
                    theme = {{ animation : { scale : 5 }  }}
                />
                <Title style={styles.title}>시공 진행상황</Title>
                <Title style={{ marginLeft: 20 , color : 'gray' ,marginBottom: 10}}>
                    {
                        state == 3 ? TEXT.first : state == 4 ? TEXT.second : state == 5 ? TEXT.third : TEXT.fourth 
                    }
                </Title>
            </View>
            
            <SwiperView>
                <Swiper horizontal={true} index={state-3}
                    showsButtons={true}
                    showsHorizontalScrollIndicator={true}
                    showsPagination={false}
                    prevButton={<IconButton icon='chevron-left' color={'black'} size={25}/>}
                    nextButton={<IconButton icon='chevron-right' color={'black'} size={25}/>}
                    overScrollMode='auto'
                    loop={false}
                    // renderPagination = { (index,total) => <Title style={{ alignSelf: 'center'}}>{ index+1}/{total}</Title>}

                >  
                    {state >= 3 && <SwiperView>
                        <Title style={{ padding: 10 , color : state === 3 ? 'red' : 'black'}}>
                            {'1단계: '}{progress[1].title}
                        </Title>
                        <View style={{width: '75%', flex: 1,  alignSelf: 'center'}}>
                            <Title style={{fontSize: 15,}}>{progress[1].text}</Title>
                            <Title style={{fontWeight: 'bold', paddingHorizontal: 15, marginTop: 15}}>{'=> '+shopData[1].shipmentLocation}</Title>
                            {state === 3 && <Button mode={'contained'} disabled={isSending} color={Color.main} style={{marginTop: 10}} onPress={()=>{setIsSending(true); NextState();}}>{isSending ? '전달중...': '완료'}</Button>}
                        </View>
                    </SwiperView>}
                    
                    {state >= 4 && <SwiperView>
                        <Row>
                            <Title style={{ padding: 10 , color : (state === 4 || state ===5) ? 'red' : 'black'}}>
                                {'2단계: '}{progress[2].title}
                            </Title>
                            {state === 5 && <Button mode={"contained"} disabled={isSending} onPress={() => {setIsSending(true); NextState();}} contentStyle={{width: 100, height: 40}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10, width: 100, height: 40, }} labelStyle={{fontSize: 15}} color={Color.main}>{isSending ? '전달중...': '승인'}</Button>}
                        </Row>
                        <View style={{width: '75%', height: '100%', alignSelf: 'center'}}>
                            <FlatList
                                data={shopData[2].inspectionImages}
                                scrollEnabled={true}
                                renderItem={RenderItemInspection}
                                keyExtractor={item => item}
                                refreshControl={refresh}
                            />
                        </View>
                    </SwiperView>}

                    {state >= 6 && <SwiperView>
                        <Title style={{ padding: 10 , color : state === 6 ? 'red' : 'black'}}>
                            {'3단계: '}{progress[3].title}
                        </Title>
                        <View style={{width: '75%', height: '100%', alignSelf: 'center'}}>
                            <FlatList
                                data={shopData[3].constructionImages}
                                scrollEnabled={true}
                                renderItem={RenderItemConstruction}
                                keyExtractor={item => item}
                                refreshControl={refresh}
                            />
                        </View>
                    </SwiperView>}

                    {state >= 7 && <SwiperView>
                        <Title style={{ padding: 10 , color : state === 7 ? 'red' : 'black'}}>
                            {'4단계: '}{progress[4].title}
                        </Title>
                        <View style={{width: '75%', flex: 1,  alignSelf: 'center'}}>
                            <ScrollView>
                            <Title style={{padding: 10, fontSize: 15}}>{progress[4].text}</Title>
                            <Title style={{fontWeight: 'bold', paddingHorizontal: 15, marginTop: 15}}>{'=> '+shopData[4].shipmentLocation}</Title>
                            <Text style={{color: 'red', marginVertical: 5, alignSelf: 'center'}}>/*모든시공이 완료되었는지 반드시 확인해주세요.*/</Text>
                            <InfoView>
                                <ScrollView>
                                    <Row>
                                        <Icon name={'ellipse'} style={{marginRight: 5}}/>
                                        <Title>시공내역</Title>
                                    </Row>
                                    {
                                        shopData[4].receipt.tinting != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='틴팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={shopData[4].receipt.tinting} right={ props => <Text style={styles.itemText}>{shopData[4].receipt.tintingPrice}{'만원'}</Text>} />
                                            </>
                                        )
                                    }
                                    {
                                        shopData[4].receipt.ppf != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='PPF' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={shopData[4].receipt.ppf} right={props => <Text style={styles.itemText}>{shopData[4].receipt.ppfPrice}{' 만원'}</Text>} />
                                            </>
                                        )
                                    }
                                    {
                                        shopData[4].receipt.blackbox != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='블랙박스' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={shopData[4].receipt.blackbox} right={props => <Text style={styles.itemText}>{shopData[4].receipt.blackboxPrice}{' 만원'}</Text>} />
                                            </>
                                        )
                                    }
                                    {
                                        shopData[4].receipt.battery != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='보조배터리' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={shopData[4].receipt.battery} right={props => <Text style={styles.itemText}>{shopData[4].receipt.batteryPrice}{' 만원'}</Text>} />
                                            </>
                                        )
                                    }
                                    {
                                        shopData[4].receipt.afterblow != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='애프터블로우' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={shopData[4].receipt.afterblow} right={props => <Text style={styles.itemText}>{shopData[4].receipt.afterblowPrice}{' 만원'}</Text>} />
                                            </>
                                        )
                                    }
                                    {
                                        shopData[4].receipt.soundproof != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='방음' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={shopData[4].receipt.soundproof} right={props => <Text style={styles.itemText}>{shopData[4].receipt.soundproofPrice}{' 만원'}</Text>} />
                                            </>
                                        )
                                    }
                                    {
                                        shopData[4].receipt.wrapping != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='랩핑' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={shopData[4].receipt.wrapping} right={props => <Text style={styles.itemText}>{shopData[4].receipt.wrappingPrice}{' 만원'}</Text>} />
                                            </>
                                        )
                                    }
                                    {
                                        shopData[4].receipt.glasscoating != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='유리막코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={shopData[4].receipt.glasscoating} right={props => <Text style={styles.itemText}>{shopData[4].receipt.glasscoatingPrice}{' 만원'}</Text>} />
                                            </>
                                        )
                                    }
                                    {
                                        shopData[4].receipt.undercoating != null && (
                                            <>
                                                <List.Item style={styles.labelStyle}  titleStyle={styles.listStyle1} title ='언더코팅' left={props => <List.Icon {...props} icon='clipboard-check-outline' style={{ margin: 0}} size={10} />} />
                                                <List.Item titleStyle={styles.listStyle} title ={shopData[4].receipt.undercoating} right={props => <Text style={styles.itemText}>{shopData[4].receipt.undercoatingPrice}{' 만원'}</Text>} />
                                            </>
                                        )
                                    }
                                    <List.Item titleStyle={styles.totalprice} title ='최종가격: ' right={props => <Text style={styles.itemText}>{shopData[4].receipt.totalPrice}{' 만원'}</Text>}/>
                                    
                                    
                                </ScrollView>
                            </InfoView>
                            <Button style={{marginTop: 20}} mode={'contained'} disabled={isSending} color={Color.main} onPress={()=>{setIsSending(true); FinalConfirm()}}>{isSending ? '확정중...':'출고 확정'}</Button>
                            </ScrollView>
                        </View>
                    </SwiperView>}
                    
                </Swiper>
            </SwiperView>
            <View style={{position: 'absolute', bottom: 50, alignSelf: 'flex-end', right: 30,}}>
                <FAB style={{ backgroundColor: Color.main, alignItems: 'center', justifyContent: 'center'}} icon="chat" onPress={() => { rdbOff(contractId); props.navigation.navigate('ChatScreen',{ companyName : shopData[0].companyName, contractId: contractId}) }} color='white'/>
                {addChatNum !== 0 && <Badge style={{position: 'absolute'}}>{addChatNum}</Badge>}
            </View>
            {isLoading && <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', position: 'absolute', backgroundColor: 'rgba(0,0,0,0.3)'}}>
                <ActivityIndicator size = 'large' color= {Color.main}/>
            </View>}

        </TotalView>
        </Provider>
    );
}

export default ProgressScreen;