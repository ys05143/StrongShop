import React from 'react';
import TotalView from '../components/TotalView';
import { View, TouchableOpacity } from 'react-native';
import IMP from 'iamport-react-native';
import Icon  from "react-native-vector-icons/Ionicons";

function Pay(props){
    const [payData, setPayData] = React.useState(props.route.params.payData);
    const [orderId, setOrderId] = React.useState(props.route.params.orderId);
    const [bidId, setBidId] = React.useState(props.route.params.bidId);

    function callback(response) {
        props.navigation.replace("PayFinish", {response: response, orderId: orderId, bidId: bidId});
    }

    return(
        <TotalView>
            <View style= {{flex: 1}}>
                <IMP.Payment 
                    userCode={'imp01457748'}
                    // tierCode={'AAA'}
                    data = {payData}
                    callback= {callback}
                />
                <View style={{position: 'absolute', width: '100%', alignItems: 'flex-end', paddingTop: 5, paddingRight: 5}}>
                <TouchableOpacity onPress={()=>{props.navigation.replace("PaymentScreen")}}>
                    <Icon name="close-outline" size={35} color={'black'}></Icon>
                </TouchableOpacity>    
            </View>
            </View>

        </TotalView>
    )
}

export default Pay;