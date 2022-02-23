import React from "react";
import styled from 'styled-components/native';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import moment from 'moment';
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
//component
import TotalView from "../components/TotalView";
import TopBar from "../components/TopBar";
//function
import storage from "../function/storage";
//constants
import Color from "../constants/Color";
import { userContext } from "../function/Context";

const AlarmView = styled.TouchableOpacity`
    width: 100%;
    height: 90px;
    border-bottom-width: 1px;
    border-color: lightgray;
    padding: 20px;
    justify-content: center;
`;
const DATA = [{
    messageId: 2,
    alarmType: 200,
    title: '입찰에 업체가 참여했습니다.',
    content: '확인 해주세요.',
    date: '20211126',
    isRead: false,
}]

function AlarmScreen(props){
    const [alarmList, setAlarmList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const context = React.useContext(userContext);

    React.useEffect(()=>{
        GetAlarm();
    },[])

    async function GetAlarm(){
        let response = await storage.fetch("Alarm");
        //console.log(response);
        let newLength;
        if(response === null ){
            setAlarmList([]);
            newLength = 0;
        }
        else {
            response.sort((a,b)=>{
                return moment(b.date) - moment(a.date);
            })
            setAlarmList(response);
            newLength = response.length;
        }
        await storage.store("NumAlarm", newLength);
        context.setIsNewAlarm(false);

    }

    async function ClearAlarmList(){
        await AsyncStorage.removeItem('Alarm', ()=>{
            AsyncStorage.removeItem('NumAlarm', ()=>{
                setAlarmList([]);
                Alert.alert(
                    '완료',
                    '알람을 모두 삭제했습니다',
                    [
                        {text: '확인', onPress: () => {}},
                    ],
                    { cancelable: false }
                );
            });
        });
    }

    async function changeState(id){
        let newAlarmList = alarmList;
        const changeIndex = alarmList.findIndex(item=>item.messageId === id);
        console.log(newAlarmList[changeIndex]);
        if(changeIndex !== -1){
            newAlarmList[changeIndex].isRead = true;
            await storage.store("Alarm", newAlarmList)
            .then(res=>{
                setAlarmList(newAlarmList);
                //props.navigation.popToTop("MainScreen");
                GetAlarm();
            })
        }
    }

    function RenderItem({item}){
        return(
            <AlarmView style={{backgroundColor: item.isRead ?  'rgba(0, 0, 0, 0.03)':  'rgba(256, 256, 256, 1)'}} onPress={async ()=>{
                if(item.isRead === false){ changeState(item.messageId);}
                }}>
                <Text style={{fontWeight: 'bold', fontSize: 17, marginBottom: 3, color: item.isRead ? 'gray' : 'black'}}>{item.title}</Text>
                <Text style={{fontSize: 15, marginBottom: 3, color: item.isRead ? 'gray' : 'black'}}>{item.content}</Text>
                <Text style={{color: 'gray'}}>{moment(item.date).format('YYYY-MM-DD HH:mm')}</Text>
            </AlarmView>
        )
    }
    return(
        <TotalView notchColor={'white'}>
            <TopBar>
                <TouchableOpacity style={{height: 60, width: 60, justifyContent: 'center', paddingHorizontal: 5}} onPress={()=>{props.navigation.goBack()}}>
                    <Icon name="chevron-back-outline" size={30} color={'black'}></Icon>
                </TouchableOpacity>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>알림</Text>
                </View>
                <TouchableOpacity style={{width: 60, height: 60, justifyContent: 'center', paddingHorizontal: 5, alignItems: 'flex-end'}} onPress={()=>{ClearAlarmList();}}>
                    <Icon name="trash-outline" size={25} color={'black'}></Icon>
                </TouchableOpacity>
            </TopBar>
            {!isLoading ? 
            <FlatList
                data={alarmList}
                scrollEnabled={true}
                renderItem={RenderItem}
                keyExtractor={item => item.messageId}
                refreshing={isRefreshing}
                onRefresh={()=>{GetAlarm();}}
            /> :
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicator size = 'small' color= {Color.main} style={{marginTop: 10}}/>
            </View>}
        </TotalView>
    )
}

export default AlarmScreen;