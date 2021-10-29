import React from 'react';
import styled from 'styled-components/native';
import { Appbar , Title , Text , Card, Divider , Avatar , IconButton, Button, Dialog, Portal, Paragraph, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native';
import Swiper from 'react-native-swiper';
//constants
import Color from '../constants/Color';
//function
import storage from '../function/storage';

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
const data = [
    {
        id: 1,
        carImage: 'https://picsum.photos/0' ,
        carName: '아반떼' ,
        status: 1 , // 입찰 중
        time: Date() ,
    } ,
    {
        id: 2,
        carImage: 'https://picsum.photos/0' ,
        carName: '소나타' ,
        status: 2 , // 업체 선정
        time: Date() ,
    } ,
    {
        id: 3,
        carImage: 'https://picsum.photos/100' ,
        carName: '티볼리' ,
        status: 3 , // 출고지 지정
        time: Date() ,
    } ,
    {
        id: 4,
        carImage: 'https://picsum.photos/200' ,
        carName: '코나' ,
        status: 4 , // 신차검수
        time: Date() ,
    }
]

export default function( props ) {
    const [changeView,setChangeView] = React.useState(true);
    const [existingDialog, setExistingDialog] = React.useState(false);
    const [currentOrder, setCurrentOrder] = React.useState(null);

    const stamp = (new Date().getTime()+(23*3600+54*60)-new Date().getTime()) ;

    const hideDialog = () => setExistingDialog(false);

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
        // .then(res=>{
        //     if(res !== null){
        //         console.log('In page 1 has storage: ', res);
        //         setCurrentOrder(res);
        //         setExistingDialog(true);
        //     }
        //     else{
        //         props.navigation.navigate("PackageScreen_2");
        //         setExistingDialog(false);
        //     }
        // })
        // .catch(e=>{
        //     console.log(e);
        // });
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

    return(
        <>
            <Appbar.Header style={{ backgroundColor: Color.main }}>
                <Appbar.Content title=''/>
                <Appbar.Action icon="bell-outline" onPress={() => {}} />
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
                <IconButton icon='format-list-bulleted' style={{ position: 'absolute' , right: 0 }} onPress={()=>{setChangeView(!changeView)}}/>
            </TextRow>
            <View style={{ height: 250 , borderBottomWidth: 3 , borderBottomColor: 'lightgray' }}>
                    {
                        changeView ? (
                            <ScrollView horizontal={true} style={styles.scrollview}>
                                {
                                data.map(item=>{
                                    return(
                                        <Card key={item.id} style={styles.card} onPress={()=>{}}>
                                        <Card.Cover source={{ uri: item.carImage }} style={styles.cover}/>
                                        <Card.Title title={item.carName} titleStyle={{ fontWeight: 'bold' }}
                                            subtitle={item.status == 1 ? '입찰중' : item.status ==2 ? '업체선정' : item.status ==3 ? '출고지 지정' : item.status ==4 ? '신차검수' : ''} />
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
                                    data.map(item=>{
                                        return(
                                            <Card key={item.id} style={{ flex: 1 }} onPress={()=>{ alert('click')}}>
                                                <TextRow style={{ flex: 1}}>
                                                    <View style={{ flex: 3 }}>
                                                        <Card.Cover source={{ uri: item.carImage }} style={{ flex: 1 }}/>    
                                                    </View>
                                                    <View style={{ flex: 2 }}>
                                                        <Card.Title title={item.carName} titleStyle={{ fontWeight: 'bold' , fontSize: 27 , padding: 10 }} subtitleStyle={{ fontSize: 17 , padding: 10 }}
                                                            subtitle={item.status == 1 ? '입찰중' : item.status ==2 ? '업체선정' : item.status ==3 ? '출고지 지정' : item.status ==4 ? '신차검수' : ''} />
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
                        )
                            
                        }
                    
                    
            </View>

            <PaperProvider>
                <Portal>
                    <Dialog visible={existingDialog} onDismiss={hideDialog}>
                        <Dialog.Content>
                            <Paragraph>{'이전의 자료가 있습니다.\n이어서 하시겠습니까?'}</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button mode="outlined" onPress={() => {CancelExisting()}}>Cancel</Button>
                            <Button mode="outlined" onPress={() => {OKExisting()}}>Ok</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </PaperProvider>
            
        </>
    );
}