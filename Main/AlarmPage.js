import React from "react";
import styled from 'styled-components/native';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import moment from 'moment';
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
//component
import TopBar from "../components/TopBar";
//function
import storage from "../function/storage";
//constants
import Color from "../constants/Color";
import AppWindow from "../constants/AppWindow";
import { userContext } from "../function/Context";
import { JuaText, MenuContentText } from "../components/TextStyle";

const WIDTH = AppWindow.width;

const AlarmView = styled.TouchableOpacity`
    width: ${WIDTH}px;
    border: 2px;
    border-color: ${Color.menuBorder};
    border-radius: 5px;
    padding: 5px 0px;
    align-items: center;
`;
const MenuBox = styled.TouchableOpacity`
    width: ${WIDTH*0.95}px;
    border: 2px solid ${Color.menuBorder};
    background-color: ${Color.menuBackgrund};
    border-radius: 5px;
    margin-top: 10px;
`;
const MenuTitle = styled.View`
    width: 100%;
    height: 35px;
    background-color: white;
    align-items: center;
    border-bottom-color: ${Color.menuTitleBorder};
    border-bottom-width: 2px;
    flex-direction: row;
    padding-left: 10px;
`;
const MenuContent = styled.View`
    width: 100%;
    justify-content: center;
    padding: 10px;
`;

function AlarmPage(props){
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
           
            <MenuBox onPress={async ()=>{ if(item.isRead === false){ changeState(item.messageId);} }}>
                <MenuTitle style={{backgroundColor: item.isRead ?  'rgba(0, 0, 0, 0.03)':  'white'}}>
                    <JuaText style={{color: item.isRead ? 'gray' : 'black', fontSize: 18}}>{item.title}</JuaText>
                </MenuTitle>
                <MenuContent style={{backgroundColor: item.isRead ?  'rgba(0, 0, 0, 0.03)':  Color.menuBackgrund}}>
                    <MenuContentText style={{color: item.isRead ? 'gray' : 'black'}}>{item.content}</MenuContentText>
                    <MenuContentText style={{color: 'gray'}}>{moment(item.date).format('YYYY-MM-DD HH:mm')}</MenuContentText>
                </MenuContent>
            </MenuBox>
          
        )
    }
    return(
        <View style={{backgroundColor: 'white'}}>
            <SafeAreaView style={{width: '100%', height: '100%'}}>
                <TopBar>
                    <TouchableOpacity style={{height: 60, width: 60, justifyContent: 'center', paddingHorizontal: 5}} onPress={()=>{props.navigation.goBack()}}>
                        <Icon name="chevron-back-outline" size={30} color={'black'}></Icon>
                    </TouchableOpacity>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <JuaText style={{fontSize: 25}}>알림</JuaText>
                    </View>
                    <TouchableOpacity style={{width: 60, height: 60, justifyContent: 'center', paddingHorizontal: 5, alignItems: 'flex-end'}} onPress={()=>{ClearAlarmList();}}>
                        <Icon name="trash-outline" size={25} color={'black'}></Icon>
                    </TouchableOpacity>
                </TopBar>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                {!isLoading ? 
                    <FlatList
                        data={alarmList}
                        scrollEnabled={true}
                        renderItem={RenderItem}
                        keyExtractor={item => item.messageId}
                        refreshing={isRefreshing}
                        onRefresh={()=>{GetAlarm();}}
                        showsVerticalScrollIndicator={false}
                    />
                :
                    <ActivityIndicator size = 'small' color= {Color.main}/>
                }
                </View>
            </SafeAreaView>
        </View>
    )
}

export default AlarmPage;