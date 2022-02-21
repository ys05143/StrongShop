import React from 'react';
import TotalView from '../components/TotalView';
import { View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Title } from 'react-native-paper';
import IMP from 'iamport-react-native';
import Icon  from "react-native-vector-icons/Ionicons";
import Color from '../constants/Color';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';
import checkErrorCode from '../function/checkErrorCode';

function Pay(props){
    const [payData, setPayData] = React.useState(props.route.params.payData);
    const [orderId, setOrderId] = React.useState(props.route.params.orderId);
    const [bidId, setBidId] = React.useState(props.route.params.bidId);
    const [kind, setKind] = React.useState(props.route.params.kind);
    const [isSending, setIsSending] = React.useState(false);

    function callback(response) {
        console.log(response);
        if(response.imp_success === 'true'){
            if(kind === 'NewCarPackage') {
                sendDataNcp();
            }
            else if(kind === 'Care'){
                sendDataCare();
            }
            else{
                props.navigation.replace("PayFail");
            }
        }
        else{
            props.navigation.replace("PayFail");
        }
    }

    async function sendDataNcp(){
        try{
            setIsSending(true);
            const auth = await checkJwt();
            if(auth !== null){
                const response = await axios({
                    method: 'POST',
                    url : `${server.url}/api/contract/ncp` ,
                    data : {
                        order_id: orderId,
                        bidding_id: bidId,
                    },
                    headers : {Auth: auth},
                })
                //console.log(response);
                props.navigation.replace("ProgressScreen_2", {orderId: orderId, state: 3, bidId: bidId});
                setIsSending(false);
            }
        }
        catch{
            Alert.alert(
                '네트워크 오류',
                '다시 시도해주세요.',
                [
                    {text: '확인', onPress: () => {props.navigation.replace("MainScreen")}},
                ],
                { cancelable: false }
            );
        }
    }

    async function sendDataCare(){
        try{
            setIsSending(true);
            const auth = await checkJwt();
            if(auth !== null){
                const response = await axios({
                    method: 'POST',
                    url : `${server.url}/api/contract/care` ,
                    data : {
                        order_id: orderId,
                        bidding_id: bidId,
                    },
                    headers : {Auth: auth},
                })
                //console.log(response);
                props.navigation.replace("CareProgressScreen", {orderId: orderId, state: 3, bidId: bidId});
                setIsSending(false);
            }
        }
        catch{
            Alert.alert(
                '네트워크 오류',
                '다시 시도해주세요.',
                [
                    {text: '확인', onPress: () => {props.navigation.replace("MainScreen")}},
                ],
                { cancelable: false }
            );
        }
    }
    
    const LoadingScreen = () =>{
        return(
            <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', position: 'absolute', backgroundColor: 'rgba(0,0,0,0.3)'}}>
                <ActivityIndicator size = 'large' color= {Color.main}/>
                <Title>로딩중...</Title>
            </View>
        )
    }

    return(
        <TotalView>
            <View style= {{flex: 1}}>
                <IMP.Payment 
                    userCode={'imp01457748'}
                    // tierCode={'AAA'}
                    data = {payData}
                    callback= {callback}
                    loading={<LoadingScreen/>}
                />
            </View>
            {isSending && <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', position: 'absolute', backgroundColor: 'rgba(0,0,0,0.3)'}}>
                <ActivityIndicator size = 'large' color= {Color.main}/>
            </View>}
        </TotalView>
    )
}

export default Pay;