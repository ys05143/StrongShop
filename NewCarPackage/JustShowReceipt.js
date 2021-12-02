import React from 'react';
import { Text, View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Button, Chip } from 'react-native-paper';
import styled from 'styled-components/native';
import _ from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
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

function JustShowReceipt(props){
    const [receipt, setReceipt] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    const isFocused = useIsFocused();
    React.useEffect( ()=>{
        //console.log(isFocused);
        if(isFocused){
            setIsLoading(true);
            storage.fetch(props.orderId.toString())
            .then(res =>{
                setReceipt(res);
                setIsLoading(false);
            })
            .catch(e => {
                Alert.alert(
                    '오류',
                    '다시 시도해주세요.',
                    [
                        {text: '예', onPress: () => {}},
                        {text: '아니요', onPress: () => {}},
                    ],
                    { cancelable: false }
                );
            })
        }
    },[]);
    
    
    function translate(option,item){
        const res_Tinting = {
            LUMA: '루마',
            SOLAR: '솔라가드',
            RAINBOW: '레인보우',
            RAYNO: '레이노',
            ANY: '상관없음',
            ETC: receipt.options.detailTinting.ETC,
        }
        const res_Ppf ={
            BONNET: '본넷',
            SIDEMIRROR: '사이드미러',
            FRONTBUMPER: '앞 범퍼',
            FRONTBUMPERSIDE:'앞 범퍼사이드',
            BACKBUMPER: '뒷 범퍼',
            BACKBUMPERSIDE: '뒷 범퍼사이드',
            HEADLIGHT: '헤드라이트',
            TAILLAMP: '테일램프',
            BCFILTER: 'B/C 필터',
            DOOR: '도어',
            HOOD: '후드',
            ETC: receipt.options.detailPpf.ETC,
        }
        const res_Blackbox = {
            FINETECH: '파인테크',
            INAVI: '아이나비',
            MANDO: '만도',
            ANY: '상관없음',
            ETC: receipt.options.detailBlackbox.ETC,
        }
        const res_Battery = {
            V6: 'V6',
            V12: 'V12',
            ANY: false,
            ETC: receipt.options.detailBattery.ETC,
        }
        const res_Afterblow = {
            ANY: '상관없음',
            ETC: receipt.options.detailAfterblow.ETC,
        }
        const res_Soundproof = {
            UNDER: '하부방음',
            DOORSOUND: '도어방음',
            INSIDEFLOOR: '실내바닥방음',
            FENDER: '휀다방음',
            BONNETSOUND: '본넷방음',
            TRUNK: '트렁크방음',
            ETC: receipt.options.detailSoundproof.ETC,
        }
        const res_Wrapping = {
            DESIGN: receipt.options.detailWrapping.DESIGN,
        }
        const res_Region = {
            seoul: '서울',
            daejeon: '대전',
            daegu: '대구',
            incheon: '인천',
            busan: '부산',
            gwangju: '광주',
            jeju: '제주',
        }
        if(option === 'tinting') return res_Tinting[item];
        else if(option === 'ppf') return res_Ppf[item];
        else if(option === 'blackbox') return res_Blackbox[item];
        else if(option === 'battery') return res_Battery[item];
        else if(option === 'afterblow') return res_Afterblow[item];
        else if(option === 'soundproof') return res_Soundproof[item];
        else if(option === 'wrapping') return res_Wrapping[item];
        else if(option === 'region') return res_Region[item];
    }

    return (
        <>
        <Total>
            { receipt !== null && !isLoading && <SearchView>
                <View style={{width: '100%', marginBottom: 10, justifyContent: 'space-between', alignItems: 'flex-end', flexDirection: 'row'}}> 
                    <Text style={{fontSize: 30, fontWeight: 'bold'}}>{receipt === null ? '': receipt.carName}</Text>
                </View>
                <View style={{width: '100%', marginBottom: 10}}>
                    {receipt.options.tinting === true &&
                    <View>
                        <View style={{marginBottom: 5, flexDirection: 'row',  alignItems: 'center'}}>
                            <Icon name="chevron-forward-outline" size={20}></Icon>
                            <Text style={{fontSize: 20}}>틴팅</Text>
                        </View>
                        <ScrollView horizontal={true}>
                            {_.map(receipt.options['detailTinting'], (key,item)=>{ if(key) return(translate('tinting',item) !== "" ?<Chip key={item} style={{margin: 3}}>{translate('tinting',item)}</Chip>: null)})}
                        </ScrollView>
                    </View>}
                    {receipt.options.ppf === true &&
                    <View>
                        <View style={{marginBottom: 5, flexDirection: 'row',  alignItems: 'center'}}>
                            <Icon name="chevron-forward-outline" size={20}></Icon>
                            <Text style={{fontSize: 20}}>PPF</Text>
                        </View>
                        <ScrollView horizontal={true}>
                            {_.map(receipt.options['detailPpf'], (key,item)=>{ if(key) return(translate('ppf',item) !== "" ?<Chip key={item} style={{margin: 3}}>{translate('ppf',item)}</Chip>: null)})}
                        </ScrollView>
                    </View>}
                    {receipt.options.blackbox === true &&
                    <View>
                        <View style={{marginBottom: 5, flexDirection: 'row',  alignItems: 'center'}}>
                            <Icon name="chevron-forward-outline" size={20}></Icon>
                            <Text style={{fontSize: 20}}>블랙박스</Text>
                        </View>
                        <ScrollView horizontal={true}>
                            {_.map(receipt.options['detailBlackbox'], (key,item)=>{ if(key) return(translate('blackbox',item) !== "" ?<Chip key={item} style={{margin: 3}}>{translate('blackbox',item)}</Chip>: null)})}
                        </ScrollView>
                    </View>}
                    {receipt.options.battery === true &&
                    <View>
                        <View style={{marginBottom: 5, flexDirection: 'row',  alignItems: 'center'}}>
                            <Icon name="chevron-forward-outline" size={20}></Icon>
                            <Text style={{fontSize: 20}}>보조배터리</Text>
                        </View>
                        <ScrollView horizontal={true}>
                            {_.map(receipt.options['detailBattery'], (key,item)=>{ if(key) return(translate('battery',item) !== "" ?<Chip key={item} style={{margin: 3}}>{translate('battery',item)}</Chip>: null)})}
                        </ScrollView>
                    </View>}
                    {receipt.options.afterblow === true &&
                    <View>
                        <View style={{marginBottom: 5, flexDirection: 'row',  alignItems: 'center'}}>
                            <Icon name="chevron-forward-outline" size={20}></Icon>
                            <Text style={{fontSize: 20}}>애프터블로우</Text>
                        </View>
                        <ScrollView horizontal={true}>
                            {_.map(receipt.options['detailAfterblow'], (key,item)=>{ if(key) return(translate('afterblow',item) !== "" ?<Chip key={item} style={{margin: 3}}>{translate('afterblow',item)}</Chip>: null)})}
                        </ScrollView>
                    </View>}
                    {receipt.options.soundproof === true &&
                    <View>
                        <View style={{marginBottom: 5, flexDirection: 'row',  alignItems: 'center'}}>
                            <Icon name="chevron-forward-outline" size={20}></Icon>
                            <Text style={{fontSize: 20}}>방음</Text>
                        </View>
                        <ScrollView horizontal={true}>
                            {_.map(receipt.options['detailSoundproof'], (key,item)=>{ if(key) return(translate('soundproof',item) !== "" ?<Chip key={item} style={{margin: 3}}>{translate('soundproof',item)}</Chip>: null)})}
                        </ScrollView>
                    </View>}
                    {receipt.options.wrapping === true &&
                    <View>
                        <View style={{marginBottom: 5, flexDirection: 'row',  alignItems: 'center'}}>
                            <Icon name="chevron-forward-outline" size={20}></Icon>
                            <Text style={{fontSize: 20}}>랩핑</Text>
                        </View>
                        <ScrollView horizontal={true}>
                            {_.map(receipt.options['detailWrapping'], (key,item)=>{ if(key) return(translate('wrapping',item) !== "" ?<Chip key={item} style={{margin: 3}}>{translate('wrapping',item)}</Chip>: null)})}
                        </ScrollView>
                    </View>}
                    {receipt.options.glasscoating === true &&
                    <View>
                        <View style={{marginBottom: 5, flexDirection: 'row',  alignItems: 'center'}}>
                            <Icon name="chevron-forward-outline" size={20}></Icon>
                            <Text style={{fontSize: 20}}>유리막코팅</Text>
                        </View>
                    </View>}
                    {receipt.options.undercoating === true &&
                    <View>
                        <View style={{marginBottom: 5, flexDirection: 'row',  alignItems: 'center'}}>
                            <Icon name="chevron-forward-outline" size={20}></Icon>
                            <Text style={{fontSize: 20}}>언더코팅</Text>
                        </View>
                    </View>}
                </View>
                {receipt.region !== null &&
                <View style={{width: '100%', marginBottom: 10, alignItems: 'center', flexDirection: 'row'}}>
                    <Icon name="chevron-forward-outline" size={20}></Icon>
                    <Text style={{fontSize: 20, marginRight: 10}}>시공 지역</Text>
                    <Chip style={{margin: 3}}>{receipt === null ? '': translate('region', receipt.region)}</Chip>
                </View>}
                
                {receipt.require !== null && <View style={{width: '100%', marginBottom: 10}}>
                    <Text style={{fontSize: 20 }}>기타 요구사항</Text>
                    <View style={{padding: 10}}>
                        <View style={{width: '100%', backgroundColor: '#e5e5e5', padding: 5, borderRadius: 5}}>
                            <Text>{receipt === null ? '': receipt.require}</Text>
                        </View>
                    </View>
                </View>}
            </SearchView>}
            <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-around'}}>
                <Button mode="contained" contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main} onPress={()=>{props.getModal(false);}}>
                    <Text>이전</Text>
                </Button>
            </View>
        </Total>
        {isLoading && 
            <View style={{alignItems: 'center', justifyContent: 'center', position: 'absolute', width: '100%', height: 500, backgroundColor: 'transparent'}}>
                <ActivityIndicator size = 'large' color= {Color.main}/>
            </View>}
        </>
    );
}

export default JustShowReceipt;