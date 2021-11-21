import React from "react";
import { Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Avatar } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import {  GiftedChat , SystemMessage , MessageContainer, Message } from 'react-native-gifted-chat';
import { Send , Bubble } from 'react-native-gifted-chat';
import database from '@react-native-firebase/database';
import _ from 'lodash';
//component
import TotalView from '../components/TotalView';
import TopBar from "../components/TopBar";
//constants
import Color from "../constants/Color";

const db = database().ref('chat/');

function ChatScreen(props){
    const [messages, setMessages] = React.useState([]);

    React.useEffect(() => {
        setMessages([
        {
            _id: 1,
            text: 'Hello Heo',
            createdAt: new Date(),
            user: {
                _id: 2,
                name: '숍',
                avatar: 'https://placeimg.com/140/142/any',
            },
        },
        ])
    }, []);
    React.useEffect(()=>{
        //user 이름 load
    },[]);

    const onSend = React.useCallback((messages = []) => {
        console.log(messages);
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, []);

    const RenderSend = (props) =>  { 
        return ( 
        <Send {...props} >
            <Avatar.Icon icon='send' style={{ backgroundColor: 'transparent' , alignSelf: 'center' }} color={Color.main} size={40}/>
        </Send> )

    }
    


    return(
        <TotalView color={'white'} notchColor={Color.main} homeIndicatorColor={'white'}>
            <TopBar style={{backgroundColor: Color.main}}>
                <TouchableOpacity>
                    <Icon name="chevron-back-outline" size={30} color={'white'} onPress={()=>{props.navigation.goBack()}}></Icon>
                </TouchableOpacity>
                <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>{'props.route.params.companyName'}</Text>
                <TouchableOpacity>
                    <Icon name="home-outline" size={25} color={'white'} onPress={()=>{props.navigation.navigate("MainScreen")}}></Icon>
                </TouchableOpacity>
            </TopBar>
            <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            renderSend={RenderSend}
            alwaysShowSend={true}
            user={{
                _id: 1,
                name: 'Heo',
            }}
            />
        </TotalView>
    );
}

export default ChatScreen;