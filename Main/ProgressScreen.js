import React from 'react';
import styled from 'styled-components/native';
import { Title  , ProgressBar, Avatar , Appbar , List , Badge , Button , IconButton , Modal , Portal , Provider}  from 'react-native-paper';
import { FlatList , ScrollView, Alert, Text, ActivityIndicator } from 'react-native';
import Color from '../constants/Color';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
//import { request , PERMISSIONS } from 'react-native-permissions';
import Swiper  from 'react-native-swiper';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';

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
    const[completedContractId, setCompletedContractId] = React.useState();
    const[state,setState] = React.useState(props.route.params.state);
    const[refresh,setRefresh] = React.useState(false);
    const[visible,setVisible] = React.useState(false);
    const[selectedImage, setSelectedImage] = React.useState(null);
    const[shopData, setShopData] = React.useState(DATA);
    const[isLoading, setIsLoading] = React.useState(false);

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

    const RenderItem = ({item}) =>  {
        return(
            <CButton onPress={ () =>  { setSelectedImage(item); setVisible(true) }}>
                <FastImage source={{ uri : item }} style={{ width: '100%' , height: '100%' }} resizeMode='contain'/>
            </CButton>
        )
    }

    async function FinalConfirm(){
        Alert.alert(
            '확인',
            '출고를 확정하시겠습니까?',
            [
              {text: '네', onPress: async () => {
                const auth = await checkJwt();
                if(auth !== null){
                    const response = await axios({
                        method: 'PUT',
                        url : `${server.url}/api/contract/7/${contractId}` ,
                        headers : {Auth: auth},
                    });
                    console.log(response);
                    const receiptDetails = response.data.data.details;
                    props.navigation.replace("RegisterReviewScreen",{completedContractId: response.data.data.id, companyName: shopData[0].companyName, receipt: receiptDetails});
                }
              }},
              {text: '아니요', onPress: () => {}}
            ],
            { cancelable: true }
        );
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
                .catch(
                    e=>{console.log(e);}
                );
                let rawData = response.data.data;
                console.log('state:',state,rawData);

                if(rawData !== null){
                    let newData = shopData;
                    if(state >= 3){
                        newData[0] = {companyName: rawData.company_name, contractId: rawData.contract_id, companyId: rawData.company_id};
                        newData[1] = {shipmentLocation: rawData.shipment_location, receipt: rawData.receipt};
                        setContractId(rawData.contract_id);
                    }
                    if(state >= 4){
                        const img_res = await axios({
                            method: 'GET',
                            url : `${server.url}/api/contract/4/${rawData.contract_id}`,
                            headers : {Auth: auth},
                        })
                        .catch(
                            e=>{console.log(e);}
                        );
                        let rawImg = img_res.data.data.imageUrlResponseDtos;
                        imageList=[];
                        rawImg.map(item => {
                            imageList.push(item.imageUrl);
                        })
                        newData[2] = {inspectionImages: imageList};
                    }
                    if(state >= 6){
                        const img_res = await axios({
                            method: 'GET',
                            url : `${server.url}/api/contract/6/${rawData.contract_id}`,
                            headers : {Auth: auth},
                        })
                        .catch(
                            e=>{console.log(e);}
                        );
                        console.log(img_res.data.data.responseDtos);
                        let rawImg = img_res.data.data.responseDtos;
                        imageList=[];
                        rawImg.map(item => {
                            imageList.push(item.imageUrl);
                        })
                        newData[3] = {constructionImages: imageList};
                    }
                    if(state >= 7){
                        newData[4] = {shipmentLocation: rawData.shipment_location, receipt: rawData.receipt};
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
                        {text: 'OK', onPress: () => {props.navigation.navigate("LoginScreen");}},
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
                    {text: 'OK', onPress: () => {}},
                ],
                { cancelable: false }
            );
        }
    
    }

    async function NextState(){
        try{
            const auth = await checkJwt();
            if(auth !== null){
                const response = await axios({
                    method: 'PUT',
                    url : `${server.url}/api/contract/${state}/${orderId}` ,
                    data : {
                        orderId: orderId
                    },
                    headers : {Auth: auth},
                });
                console.log(response);
                setState(state+1);
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
        }
        catch{e => {  
            Alert.alert(
                '오류',
                'ProgressScreen Next 오류',
                [
                    {text: 'OK', onPress: () => {}},
                ],
                { cancelable: false }
            );
            console.log(e);
        }}
    }

    return(
        <Provider>
        {/* 사진 상세보기 */}
        <Portal>
        <Modal visible={visible} onDismiss={() => { setVisible(false) }} contentContainerStyle={{ width: '100%', height: 500 , backgroundColor: 'transparent' }}>
            <IconButton icon='close' style={{ alignSelf: 'flex-end'}} color={'white'} onPress={ () => { setVisible(false) }} />
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <FastImage source={{ uri : selectedImage }} style={{ width: '95%' , height: '100%' }} resizeMode='contain'/>
            </View>
        </Modal>
        </Portal>

        <View style={{flex:1}}>
            <View>
                <Appbar.Header style={{ backgroundColor: Color.main }}>
                <Appbar.BackAction onPress={() => { props.navigation.goBack() }} />
                <Appbar.Content title={shopData[0].companyName} titleStyle={{ fontFamily : 'DoHyeon-Regular' , fontSize: 30}} />
                <View>
                    <Appbar.Action icon="chat" onPress={() => { props.navigation.navigate('ChatScreen',{ companyName : shopData[0].companyName, contractId: contractId}) }} color='white'/>
                    <Badge size={12} style={{position: 'absolute'}}/>
                </View>
                </Appbar.Header>  
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
            
            {!isLoading ? <SwiperView>
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
                            {state === 3 && <Button mode={'contained'} color={Color.main} style={{marginTop: 10}} onPress={()=>{NextState();}}>완료</Button>}
                        </View>
                    </SwiperView>}
                    
                    {state >= 4 && <SwiperView>
                        <Title style={{ padding: 10 , color : (state === 4 || state ===5) ? 'red' : 'black'}}>
                        {'2단계: '}{progress[2].title}
                        </Title>
                        {state === 5 && <Button mode={'contained'} color={Color.main} style={{marginTop: 10}} onPress={()=>{NextState();}}>승인</Button>}
                        <View style={{width: '75%', height: '100%', alignSelf: 'center'}}>
                            <FlatList
                                data={shopData[2].inspectionImages}
                                scrollEnabled={true}
                                renderItem={RenderItem}
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
                                renderItem={RenderItem}
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
                            <Title style={{padding: 10, fontSize: 15}}>{progress[4].text}</Title>
                            <Title style={{fontWeight: 'bold', paddingHorizontal: 15, marginTop: 15}}>{'=> '+shopData[4].shipmentLocation}</Title>
                            <Text style={{color: 'red', marginVertical: 5, alignSelf: 'center'}}>/*모든시공이 완료되었는지 반드시 확인해주세요.*/</Text>
                            <InfoView>
                                <ScrollView>
                                    <Row>
                                        <Icon name={'ellipse'} style={{marginRight: 5}}/>
                                        <Title>시공내역</Title>
                                    </Row>
                                    <Text style={{fontSize: 15, marginRight: 5}}>{shopData[4].receipt}</Text>
                                </ScrollView>
                            </InfoView>
                            <Button style={{marginTop: 20}} mode={'contained'} color={Color.main} onPress={()=>{FinalConfirm()}}>출고 확정</Button>
                        </View>
                    </SwiperView>}
                    
                </Swiper>
            </SwiperView> : 
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicator size = 'large' color= {Color.main} style={{marginTop: 10}}/>
            </View>}
        </View>
        </Provider>
    );
}

export default ProgressScreen;