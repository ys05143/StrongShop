import React from 'react';
import styled from 'styled-components/native';
import { Appbar , Title , Text , Card, Divider , Avatar , IconButton, Button, Dialog, Portal, Paragraph, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, Alert, ActivityIndicator } from 'react-native';
import Swiper from 'react-native-swiper';
import { useIsFocused } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import Icon from "react-native-vector-icons/Ionicons";
//constants
import Color from '../constants/Color';
//function
import storage from '../function/storage';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';

const Row = styled.View`
    flex-direction: row;
    justify-content: center;

    /* background-color: ${Color.main}; */
    /* border-bottom-right-radius: 20px;
    border-bottom-left-radius: 20px; */
    height: 200px;
`;
const TextRow = styled.View`
    flex-direction: row;
    align-items: center;
`;
const View = styled.View``;

const MenuButton = styled.TouchableOpacity`
    border: 1px lightgray;
    margin: 20px;
    flex: 1;
    height: 170px;
    border-radius: 10px;
    background-color: 'rgb(240,240,240)';
`;

const styles = {
    title : {
        color: 'white',
        padding: 15 ,
        fontFamily: 'DoHyeon-Regular',
        fontSize: 35 ,
    } ,
    text : {
        fontSize: 25 ,
        padding: 10 ,
        fontFamily: 'DoHyeon-Regular',
    } ,
    subText : {
        padding: 10 ,
    },
    scrollview : {
        width: '100%',
        height: 250 ,
        borderBottomWidth: 6 ,
        borderBottomColor : 'rgb(240,240,240)'
    } ,
    card : {
        margin: 10,
        width: 150,
        height: '80%'
    } ,
    divider :  {
        marginTop: 20 ,
        borderWidth: 3 ,
        borderColor: 'rgb(240,240,240)'
    } ,
    cover : {
        width: 150 ,
        height: '50%'
    } ,
    icon : {
        backgroundColor: 'transparent' ,
        alignSelf: 'flex-end'
    }
}


// 당신의 차량 DATA
const DATA = [
    {
        orderId: 1,
        carImage: 'https://picsum.photos/0' ,
        carName: '아반떼' ,
        state: 3 , // 출고지 지정
        time: Date() ,
        companyName: '카샵',
    } ,
    {
        orderId: 2,
        carImage: 'https://picsum.photos/0' ,
        carName: '소나타' ,
        state: 4 , // 신차검수
        time: Date() ,
        companyName: '올댓오토모빌',
    } ,
    {
        orderId: 3,
        carImage: 'https://picsum.photos/100' ,
        carName: '티볼리' ,
        state: 5 , // 시공중
        time: Date() ,
        companyName: '카컴온',
    } ,
    {
        orderId: 4,
        carImage: 'https://picsum.photos/200' ,
        carName: '코나' ,
        state: 6 , // 시공완료
        time: Date() ,
        companyName: '레츠드릴',
    } ,
    {
        orderId: 5,
        carImage: 'https://picsum.photos/200' ,
        carName: 'K3' ,
        state: 1 , // 입찰중
        time: Date() ,
        companyName: '상수카샵',
    } ,
    {
        orderId: 6,
        carImage: 'https://picsum.photos/200' ,
        carName: 'K5' ,
        state: 2 , // 업체선정
        time: Date() ,
        companyName: '대구카닥터',
    }
]

function MainScreen( props ) {
    const [changeView,setChangeView] = React.useState(true);
    const [existingDialog, setExistingDialog] = React.useState(false);
    const [currentOrder, setCurrentOrder] = React.useState(null);
    const [myOrderList, setMyOrderList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    const stamp = (new Date().getTime()+(23*3600+54*60)-new Date().getTime()) ;

    const isFocused = useIsFocused();
    React.useEffect(()=>{
        if(isFocused) {
            getData();
        }
    },[isFocused]);

    const hideDialog = () => setExistingDialog(false);

    React.useEffect(()=>{
        const unsubscribe = messaging().onMessage( async remoteMessage => {
          //console.log('foreground messgage arrived!',JSON.stringify(remoteMessage));
          console.log(remoteMessage.data.index);
          const index = remoteMessage.data.index;
          Alert.alert(
            index,
            '알림이 도착했습니다. 이동하시겠습니까?',
            [
              {text: '네', onPress: () => {
                  if(index === 200 || index === 210 || index === 211 || index === 212 || index === 213) props.navigation.navigate("MainScreen");
                  else props.navigation.navigate("MainScreen");
              }},
              {text: '아니요', onPress: () => {}}
            ],
            { cancelable: true }
        );
        });

        messaging().onNotificationOpenedApp(remoteMessage => {
            props.navigation.navigate("MainScreen");
        });

        return unsubscribe;
    },[]);

    React.useEffect(()=>{
        const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
            props.navigation.navigate("MainScreen");
        });
        return unsubscribe;
    },[])
    async function CheckAsync(){
        try{
            const response = await storage.fetch('BidOrder');
            if(response !== null){
                console.log('async has orderData: ', response);
                setCurrentOrder(response);
                setExistingDialog(true);
            }
            else{
                console.log('async has null')
                props.navigation.navigate("PackageScreen_2");
                setExistingDialog(false);
            }
        }
        catch (error){
            console.log(error);
        }
    }

    async function CancelExisting(){
        try{
            console.log("cancel BidOrder")
            await AsyncStorage.removeItem('BidOrder', ()=>{
                props.navigation.navigate("PackageScreen_2");
                setExistingDialog(false);
            });
        }
        catch(error){
            console.log(error);
        }
    }
    
    async function OKExisting(){
        if(currentOrder.processPage === 1){
            props.navigation.navigate("PackageScreen_2");
            setExistingDialog(false);
        }
        else if(currentOrder.processPage === 2){
            props.navigation.navigate("PackageScreen_3");
            setExistingDialog(false);
        }
        else if(currentOrder.processPage === 3){
            props.navigation.navigate("PackageScreen_4");
            setExistingDialog(false);
        }
    }

    function StateMove(orderId, state, carName){
        if(state === 1 || state === 2) props.navigation.navigate("PackageScreen_5",{carName: carName, orderId: orderId});
        else if(state === 3 || state === 4 || state === 5 || state === 6 || state === 7) props.navigation.navigate("ProgressScreen", {orderId: orderId, state: state });
    }

    async function getData(){
        try{
            setIsLoading(true);
            const auth = await checkJwt();
            if(auth !== null){
                const myOrderResponse = await axios({
                    method: 'GET',
                    url : `${server.url}/api/orders/user`,
                    headers : {Auth: auth},
                })
                .then(res => {
                    let rawData = res.data.data;
                    if(rawData !== null){
                        rawData.map(item => {
                            item['details'] = JSON.parse(item.details) ;
                        })
                        //console.log(rawData);
                        let newData = [];
                        rawData.map(item => {newData.push({orderId: item.id, carName: item.details.carName, state: translateState(item.state), time: item.created_time})});
                        setMyOrderList(newData);
                        console.log(newData);
                    }
                    else{
                        setMyOrderList([]);
                        console.log(newData);
                    }
                    setIsLoading(false);
                })
                .catch(e=>{
                    console.log('server communication error')
                })
            }
            else{
                console.log("no login");
            }
        }
        catch{e=>{
            //console.log(e);
            Alert.alert(
                '오류',
                'getData 오류',
                [
                    {text: 'OK', onPress: () => {}},
                ],
                { cancelable: false }
            );}
        }
        
    }
    
    function translateState(state){
        const item = {
            'BIDDING' : 1,
            'BIDDING_COMPLETE' : 2,
            'DESIGNATING_SHIPMENT_LOCATION' : 3,
            'CAR_EXAMINATION' : 4,
            'CAR_EXAMINATION_FIN' : 5,
            'CONSTRUCTING' : 6,
            'CONSTRUCTION_COMPLETED' : 7,
        }
        return item[state];
    }

    return(
        <>
            <Appbar.Header style={{ backgroundColor: Color.main }}>
                <Appbar.Content title=''/>
                <Appbar.Action icon="bell-outline" onPress={() => {getData();}} />
                <Appbar.Action icon="account-circle" onPress={() => {props.navigation.navigate('MyPageScreen')}} />
            </Appbar.Header> 

            <View style={{ backgroundColor: Color.main , borderBottomRightRadius: 20 , borderBottomLeftRadius: 20}}>
                <Title style={styles.title}>{'안녕하세요,\n무엇을 도와드릴까요?'}</Title>
            </View>

            <Row>
                <MenuButton onPress={()=>{CheckAsync();}}>
                    <TextRow>
                        <Text style={{...styles.text, paddingRight:0 }}>신차패키지</Text>
                        <IconButton icon='help-circle' style={{margin:0}} color='lightgray' size={25}
                                    onPress={ () => { alert('신차패키지 설명') } }
                                />
                    </TextRow>
                    <Text style={styles.subText}>{'새차를\n멋지게 만들어요'}</Text>
                    <Avatar.Icon icon='car-key' style={styles.icon} color='black'/>
                </MenuButton>
                <MenuButton>
                    <Text style={styles.text}>케어</Text>
                    <Text style={styles.subText}>{'내 차를\n관리해요'}</Text>
                    <Avatar.Icon icon='car-cog' style={styles.icon} color='black'/>
                </MenuButton>
            </Row>

            <Divider style={styles.divider}/>
            
            <TextRow>
                <Title style={styles.text}>
                    당신의 차량
                </Title>
                <IconButton icon='autorenew' size={20}  color={'gray'} onPress={()=>{getData();}}/>
                <IconButton icon='format-list-bulleted' style={{ position: 'absolute' , right: 0 }} onPress={()=>{setChangeView(!changeView)}}/>
            </TextRow>
            <View style={{ height: 250 , borderBottomWidth: 3 , borderBottomColor: 'lightgray'}}>
                {!isLoading ? 
                <>
                    { changeView ? ( //요청받아서 없으면 빈 리스트 넘겨줌.
                        <ScrollView horizontal={true} style={styles.scrollview}>
                            {
                            myOrderList.map(item=>{
                                return(
                                    <Card key={item.orderId} style={styles.card} onPress={()=>{StateMove(item.orderId, item.state, item.carName)}}>
                                    <Card.Cover source={{ uri: item.carImage }} style={styles.cover}/>
                                    <Card.Title title={item.carName} titleStyle={{ fontWeight: 'bold' }}
                                        subtitle={item.state == 3 ? '출고지 지정' : item.state == 4 ? '신차검수' : item.state == 5 ? '신차검수 완료' : item.state == 6 ? '시공 중' : item.state == 7 ? '시공 완료' : item.state == 1 ? '입찰 중' :item.state == 2 ? '업체 선정' : ''} />
                                    <Card.Content>
                                    <Text>{parseInt(stamp/3600)}:{(stamp-parseInt(stamp/3600)*3600)/60}</Text>
                                    </Card.Content>
                                    </Card> 
                                )
                            })
                            }
                        </ScrollView>                
                    ) : 
                    (
                        <Swiper 
                            autoplay={true} 
                            style={{ marginVertical: 10 }}
                            renderPagination={(index,total)=><Text style={{ alignSelf: 'flex-end' , bottom : 20 , right: 5 , color: 'gray' , fontSize: 15 }}>{index+1}/{total}</Text>}
                            >
                            {
                                myOrderList.map(item=>{
                                    return(
                                        <Card key={item.orderId} style={{ flex: 1 }} onPress={()=>{StateMove(item.orderId, item.state, item.carName)}}>
                                            <TextRow style={{ flex: 1}}>
                                                <View style={{ flex: 3 }}>
                                                    <Card.Cover source={{ uri: item.carImage }} style={{ flex: 1 }}/>    
                                                </View>
                                                <View style={{ flex: 2 }}>
                                                    <Card.Title title={item.carName} titleStyle={{ fontWeight: 'bold' , fontSize: 27 , padding: 10 }} subtitleStyle={{ fontSize: 17 , padding: 10 }}
                                                        subtitle={item.state == 3 ? '출고지 지정' : item.state == 4 ? '신차검수' : item.state == 5 ? '신차검수 완료' : item.state == 6 ? '시공 중' : item.state == 7 ? '시공 완료' : item.state == 1 ? '입찰 중' :item.state == 2 ? '업체 선정' : ''} />
                                                    <Card.Content>
                                                    <Text style={{ fontSize: 20 , padding: 10 }}>{parseInt(stamp/3600)}:{(stamp-parseInt(stamp/3600)*3600)/60}</Text>
                                                    </Card.Content>
                                                </View>
                                            </TextRow>
                                        </Card> 
                                    )
                                })
                            }
                        </Swiper>
                    )}     
                </> :
                 <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size = 'small' color= {Color.main} style={{marginTop: 10}}/>
                </View>}
            </View>

            <PaperProvider>
                <Portal>
                    <Dialog visible={existingDialog} onDismiss={hideDialog}>
                        <Dialog.Content>
                            <Paragraph>{'이전의 자료가 있습니다.\n이어서 하시겠습니까?'}</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button mode="contained" color={Color.main} style={{width: 70}} onPress={() => {OKExisting()}}>네</Button>
                            <Button mode="contained" color={Color.main} style={{marginLeft: 10, width: 70}} onPress={() => {CancelExisting()}}>아니요</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </PaperProvider>
            
        </>
    );
}

export default MainScreen;