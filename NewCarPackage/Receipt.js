import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Button, Chip } from 'react-native-paper';
import styled from 'styled-components/native';
import _ from 'lodash';
//constant
import Color from '../constants/Color';
import storage from '../function/storage';
import Icon  from "react-native-vector-icons/Ionicons";

const Total = styled.View`
    width: 100%;
    height: 500px;
    background-color: white;
    border-radius: 10px;
    padding: 10px;
    align-items: center;
    justify-content: space-between;
`;
const SearchView = styled.ScrollView`
    width: 100%;
    margin-bottom: 5px;
`;
const DetailOptions = styled.View`
    height: 40px;
    padding: 0px 5px;
    margin-right: 5px;;
    border-radius: 20px;
    background-color: lightgray;
    justify-content: center;
`;

function Receipt(props){
    const [receipt, setReceipt] = React.useState(null);
    function sendModal(){
        props.getModal(false);
    }
    React.useEffect( ()=>{
        storage.fetch('BidOrder')
        .then(res =>{
            setReceipt(res);
            if(res !== null){

            }
        })
        .catch(e => {
            console.log(error);
        })
    },[]);
    
    function translate(item){
        const res = {
            LUMA: '루마',
            SOLAR: '솔라가드',
            RAINBOW: '레인보우',
            RAYNO: '레이노',
            ANY: '상관없음',
            ETC: receipt.options.detailTinting.ETC,
        }
        return res[item];
    }
    return (
        <Total>
            <SearchView>
                {/* <Text>{"차종:\n"+receipt.carName}</Text>
                <Text>{"지역:\n"+receipt.region}</Text>
                <Text>{"별도 요구사항:\n"+receipt.require}</Text> */}
                <View style={{width: '100%', marginBottom: 10, justifyContent: 'space-between', alignItems: 'flex-end', flexDirection: 'row'}}> 
                    <Text style={{fontSize: 30, fontWeight: 'bold'}}>{receipt === null ? '': receipt.carName}</Text>
                </View>
                <View style={{width: '100%', marginBottom: 10}}>
                    
                    <View>
                        <View style={{marginBottom: 5, flexDirection: 'row',  alignItems: 'center'}}>
                            <Icon name="chevron-forward-outline" size={20}></Icon>
                            <Text style={{fontSize: 20}}>틴팅</Text>
                        </View>
                        <ScrollView horizontal={true}
                                    style={{}}>
                            { receipt !== null &&
                            _.map(receipt.options['detailTinting'], (key,item)=>{ if(key) return(translate(item) !== "" ?<Chip style={{margin: 3}}>{translate(item)}</Chip>: null)})}
                        </ScrollView>
                    </View>
                </View>
                <View style={{width: '100%', marginBottom: 10, justifyContent: 'space-between', alignItems: 'flex-end', flexDirection: 'row'}}>
                    <Text style={{fontSize: 20,}}>지역</Text>
                    <Text style={{fontSize: 15, marginRight: 250}}>서울</Text>
                </View>
                {receipt !== null && receipt.require !== null && <View style={{width: '100%', marginBottom: 10}}>
                    <Text style={{fontSize: 20 }}>기타 요구사항</Text>
                    <View style={{padding: 10}}>
                        <View style={{width: '100%', backgroundColor: 'lightgray', padding: 5, borderRadius: 5}}>
                            <Text>{receipt === null ? '': receipt.require}</Text>
                        </View>
                    </View>
                </View>}
            </SearchView>
            <Button mode="contained"  contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main} onPress={()=>{sendModal();}}>
                <Text>완료</Text>
            </Button>
        </Total>
    );
}

export default Receipt