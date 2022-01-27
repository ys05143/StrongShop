import React from "react";
import { Text, TouchableOpacity, View, Platform, KeyboardAvoidingView } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import database from '@react-native-firebase/database';
//component
import TotalView from '../components/TotalView';
import TopBar from "../components/TopBar";
import Row from '../components/Row';
//constants
import Color from "../constants/Color";
import { Avatar , Button, Title , Appbar , IconButton , ActivityIndicator } from 'react-native-paper';
import {  GiftedChat , Time  } from 'react-native-gifted-chat';
import { Send , Bubble } from 'react-native-gifted-chat';
import moment from 'moment';
import _ from 'lodash';
import { useIsFocused } from '@react-navigation/native';
import storage from "../function/storage";
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';
import checkErrorCode from "../function/checkErrorCode";

function ChatScreen(props){
    const [messages, setMessages] = React.useState([]);
    const [disableSend, setDisableSend] = React.useState(false);
    const [contractId, setContractId] = React.useState(props.route.params.contractId);
    const db = database().ref(`chat${contractId}`);

    const RenderAvatar = () => { return ( <Avatar.Image source={require('../resource/default_profile.png')} size={30} icon='cash' color='white' />) }
    const RenderSend = (props) =>  { 
        return ( 
        <Send {...props} disabled={disableSend}>
            <Avatar.Icon icon='send' style={{ backgroundColor: 'transparent' , alignSelf: 'center' }} color={Color.main} size={40}/>
        </Send> )
    }
   
    async function getData ( ){

        // 마지막 채팅의 _id 를 기억했다가 거기부터 로드하는 방식?
        // 로드가 다 되면 db off 하는 방법
        return new Promise(async (resolve,reject) => {

            let end = 0 ;
            await db
            .orderByChild('createdAt')
            .once('value', snapshot => {
                if(snapshot.toJSON() !== null){
                    let tmp =  snapshot.toJSON() ;
                    let Data = Object.values(snapshot.toJSON()) ;
        
                    Object.keys( tmp )
                    .map( (item,index) => {
                        // 상대방의 메시지를 읽지 않았을때
                        // if ( Data[index].user._id == 2 && Data[index].received == false )
                        if ( Data[index].user._id == 1  )
                            database().ref(`chat${ contractId }/${item}`).update({ received : true })
                            .then( () => {  
        
                            })
                            .catch( e => { }) 
                    }) ;

                }

                end = snapshot.numChildren() ;
                if ( !snapshot.exists()  ) {
                    reject();
                }
                else {
                    records = Object.values(snapshot?.val());
                    records = _.sortBy(records, function(dateObj) {
                        return dateObj.createdAt
                    });
                    records.map((record)=>{
                        msg = [{
                            _id : record._id ,
                            text : record.text ,
                            user : record.user ,
                            createdAt : record.createdAt,
                            sent: true
                        }] ;
                        setMessages( previousMessages => GiftedChat.append(previousMessages,msg) ) ;
                    });
                    
                }

            });    
            
            resolve(end);




        });
    } ;

    // 화면 처음 실행 시
    React.useEffect( () => {

        // Realtime DB에 연결
        database().goOnline();
        // 이전 연결을 끊음.
        db.off()
        // 이전 메시지들을 로드
        getData()
        .then(res => {
            let end = res ;
            let start = 0 ;

            // 메시지 핸들러
            db.on('child_added', snapshot =>  {
                record =  snapshot.toJSON();
                start = start + 1 ; 
                // NEW
                if ( start > end && record.user._id != 2 ) {
                    database().ref(`chat${ contractId }/${snapshot.key}`).update({ received : true })
                    msg = [{
                        _id : record._id ,
                        text : record.text ,
                        user : record.user ,
                        createdAt : record.createdAt,
                        sent: true
                    }] ;
                    setMessages( previousMessages => GiftedChat.append(previousMessages,msg) ) ;
                }
            })

            setMessages( previousMessages => GiftedChat.prepend(previousMessages,{
                _id : 400 ,
                text : '업체에게 메시지를 보내보세요.' , 
                sent : true ,
                system : true ,
            }))
           

        })
        .catch(e=>{ 
            // 메시지 핸들러
            db.on('child_added', snapshot =>  {
                record = snapshot.toJSON();
                // NEW
                if (record.user._id != 2 ) {
                    database().ref(`chat${ contractId }/${snapshot.key}`).update({ received : true });
                    msg = [{
                        _id : record._id ,
                        text : record.text ,
                        user : record.user ,
                        createdAt : record.createdAt,
                        sent: true
                    }] ;
                    setMessages( previousMessages => GiftedChat.append(previousMessages,msg) ) ;
                }
            })

            setMessages( previousMessages => GiftedChat.append(previousMessages,{
                _id : 400 ,
                text : '업체에게 메시지를 보내보세요.' , 
                sent : true ,
                system : true ,
            }))
         })

    }, []) ;

       const onSend = React.useCallback( (msg = []) => {
            // 인터넷 끊겼을 때 (테스트)
            // database().goOffline();
    
            //서버로 제대로 전달이 되었다면 보내는 방향으로
            setDisableSend(true);
            const newReference = db.push();
            // msg[0].createdAt = moment( msg[0].createdAt ).format('YYYY-MM-DD kk:mm:ss') ;
            msg[0].createdAt = moment().format('YYYY-MM-DD kk:mm:ss');
            // 화면에 표시
            setMessages(previousMessages => GiftedChat.append(previousMessages, msg))
    
            storage.fetch('auth')
            .then( res => {
                const auth = res.auth;
                axios({
                    url: `${server.url}/api/chat/${contractId}?content=${msg[0].text}` ,
                    method: 'put' ,
                    headers: { Auth: auth } ,
                })
                .then( res => {
                    newReference.set({
                        text : msg[0].text ,
                        user : msg[0].user ,
                        _id : msg[0]._id ,
                        createdAt : moment( msg[0].createdAt ).format('YYYY-MM-DD kk:mm:ss') ,
                    })
                    .then( res  => { 
                        //메시지 전송 성공 시
                            setMessages(previousMessages => (
                            previousMessages.filter( message => message._id !== msg[0]._id ) ) ) ;

                            msg[0] = { ...msg[0] , sent : true } ;
                            setMessages(previousMessages =>  GiftedChat.append(previousMessages,msg));
                            setDisableSend(false);
                    })
                    .catch( e => { 
                        // Server Request 성공 -> Realtime DB 실패
                        newReference.remove();
                        msg[0] = { ...msg[0] , sent : false }
                        setMessages(previousMessages => GiftedChat.append(previousMessages, msg)) 
                        })
                        setDisableSend(false);
                })
                .catch( e => {
                    // Server Request 실패
                    newReference.remove();
    
                    setMessages(previousMessages => (
                        previousMessages.filter( message => message._id !== msg[0]._id )  ) ) ;
                    msg[0] = { ...msg[0] , sent : false } ;
                    setMessages(previousMessages => (
                        GiftedChat.append(previousMessages,msg)
                    ));
                    setDisableSend(false);
    
                })
    
            })
            .catch(e =>{
                console.log("no login");
            })

        }, [])

    function finalChatNum(){ // 채팅화면을 나가기 직전에 전체 채팅갯수 저장
        // db.once('value', snapshot => {
        //     console.log(snapshot.numChildren());
        //     storage.store(`chat${contractId}`, snapshot.numChildren());
        // });
        db.off();
    }

    const isFocused = useIsFocused();
    React.useEffect(()=>{
        if(!isFocused){
            finalChatNum();
        }
    },[isFocused])


    return(
        <TotalView color={'white'} notchColor={Color.main} homeIndicatorColor={'white'}>
            <TopBar style={{backgroundColor: Color.main}}>
                <Row style={{alignItems: 'center'}}>
                    <TouchableOpacity onPress={()=>{finalChatNum(); props.navigation.goBack()}}>
                        <Icon name="chevron-back-outline" size={30} color={'white'}></Icon>
                    </TouchableOpacity>
                    <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white', marginLeft: 15}}>{props.route.params.companyName}</Text>                 
                </Row>
                <TouchableOpacity style={{height: 60, justifyContent: 'center', paddingRight: 10, paddingLeft: 10}} onPress={()=>{props.navigation.popToTop()}}>
                    <Icon name="home-outline" size={25} color={'white'}></Icon>
                </TouchableOpacity>
            </TopBar>
            <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            renderSystemMessage={this.onRenderSystemMessage}
            renderAvatar={RenderAvatar}
            renderSend={RenderSend}
            renderBubble={props=><Bubble {...props} wrapperStyle={{ right: { backgroundColor: Color.main , borderBottomEndRadius: 20 , padding: 5 } , left : { backgroundColor: 'white'} }} 
            // 메시지 상태 표시
            renderTicks = {(messages) => 
                ( messages.sent == null  ? <ActivityIndicator size={13} style={{ padding : 7}}/> : messages.sent ? <></> : <IconButton icon='close' color='red' size={15} /> )}
            textInputStyle = {{ alignSelf: 'center' }}
            alwaysShowSend={true}
            textStyle={{ right:{ padding: 3 }}} /> }
            placeholder='메시지를 입력하세요.'
            user={{
                _id: 2,
                name: '고객',
            }}
        />
        {
            Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />
        }
        </TotalView>
    );
}

export default ChatScreen;