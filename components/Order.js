import React from "react";
import styled from "styled-components/native";
import { View, Text, ScrollView } from 'react-native';
import { translate } from '../constants/LIST';
import Icon  from "react-native-vector-icons/Ionicons";
import _ from 'lodash';
import { Chip } from 'react-native-paper';

const SearchView = styled.ScrollView`
    width: 100%;
    margin-bottom: 5px;
`;


function Order(props){
    const kind = props.kind;
    const receipt = props.item;
    return(
        <SearchView>
            <View style={{width: '100%', marginBottom: 10, justifyContent: 'space-between', alignItems: 'flex-end', flexDirection: 'row'}}> 
                <Text style={{fontSize: 30, fontWeight: 'bold'}}>{receipt === null ? '': receipt.carName}</Text>
            </View>

            {kind === 'NewCarPackage' ? 
            <View style={{width: '100%', marginBottom: 10}}>
                {receipt.options.tinting === true &&
                <View>
                    <View style={{marginBottom: 5, flexDirection: 'row',  alignItems: 'center'}}>
                        <Icon name="chevron-forward-outline" size={20}></Icon>
                        <Text style={{fontSize: 20}}>틴팅</Text>
                    </View>
                    <ScrollView horizontal={true}>
                        {_.map(receipt.options['detailTinting'], (key,item)=>{ if(key) return(translate('tinting',item,key) !== "" ?<Chip key={item} style={{margin: 3}}>{translate('tinting',item,key)}</Chip>: null)})}
                    </ScrollView>
                </View>}
                {receipt.options.ppf === true &&
                <View>
                    <View style={{marginBottom: 5, flexDirection: 'row',  alignItems: 'center'}}>
                        <Icon name="chevron-forward-outline" size={20}></Icon>
                        <Text style={{fontSize: 20}}>PPF</Text>
                    </View>
                    <ScrollView horizontal={true}>
                        {_.map(receipt.options['detailPpf'], (key,item)=>{ if(key) return(translate('ppf',item,key) !== "" ?<Chip key={item} style={{margin: 3}}>{translate('ppf',item,key)}</Chip>: null)})}
                    </ScrollView>
                </View>}
                {receipt.options.blackbox === true &&
                <View>
                    <View style={{marginBottom: 5, flexDirection: 'row',  alignItems: 'center'}}>
                        <Icon name="chevron-forward-outline" size={20}></Icon>
                        <Text style={{fontSize: 20}}>블랙박스</Text>
                    </View>
                    <ScrollView horizontal={true}>
                        {_.map(receipt.options['detailBlackbox'], (key,item)=>{ if(key) return(translate('blackbox',item,key) !== "" ?<Chip key={item} style={{margin: 3}}>{translate('blackbox',item,key)}</Chip>: null)})}
                    </ScrollView>
                </View>}
                {receipt.options.battery === true &&
                <View>
                    <View style={{marginBottom: 5, flexDirection: 'row',  alignItems: 'center'}}>
                        <Icon name="chevron-forward-outline" size={20}></Icon>
                        <Text style={{fontSize: 20}}>보조배터리</Text>
                    </View>
                    <ScrollView horizontal={true}>
                        {_.map(receipt.options['detailBattery'], (key,item)=>{ if(key) return(translate('battery',item,key) !== "" ?<Chip key={item} style={{margin: 3}}>{translate('battery',item,key)}</Chip>: null)})}
                    </ScrollView>
                </View>}
                {receipt.options.afterblow === true &&
                <View>
                    <View style={{marginBottom: 5, flexDirection: 'row',  alignItems: 'center'}}>
                        <Icon name="chevron-forward-outline" size={20}></Icon>
                        <Text style={{fontSize: 20}}>애프터블로우</Text>
                    </View>
                    <ScrollView horizontal={true}>
                        {_.map(receipt.options['detailAfterblow'], (key,item)=>{ if(key) return(translate('afterblow',item,key) !== "" ?<Chip key={item} style={{margin: 3}}>{translate('afterblow',item,key)}</Chip>: null)})}
                    </ScrollView>
                </View>}
                {receipt.options.soundproof === true &&
                <View>
                    <View style={{marginBottom: 5, flexDirection: 'row',  alignItems: 'center'}}>
                        <Icon name="chevron-forward-outline" size={20}></Icon>
                        <Text style={{fontSize: 20}}>방음</Text>
                    </View>
                    <ScrollView horizontal={true}>
                        {_.map(receipt.options['detailSoundproof'], (key,item)=>{ if(key) return(translate('soundproof',item,key) !== "" ?<Chip key={item} style={{margin: 3}}>{translate('soundproof',item,key)}</Chip>: null)})}
                    </ScrollView>
                </View>}
                {receipt.options.wrapping === true &&
                <View>
                    <View style={{marginBottom: 5, flexDirection: 'row',  alignItems: 'center'}}>
                        <Icon name="chevron-forward-outline" size={20}></Icon>
                        <Text style={{fontSize: 20}}>랩핑</Text>
                    </View>
                    <ScrollView horizontal={true}>
                        {_.map(receipt.options['detailWrapping'], (key,item)=>{ if(key) return(translate('wrapping',item,key) !== "" ?<Chip key={item} style={{margin: 3}}>{translate('wrapping',item,key)}</Chip>: null)})}
                    </ScrollView>
                </View>}
                {receipt.options.bottomcoating === true &&
                <View>
                    <View style={{marginBottom: 5, flexDirection: 'row',  alignItems: 'center'}}>
                        <Icon name="chevron-forward-outline" size={20}></Icon>
                        <Text style={{fontSize: 20}}>하부코팅</Text>
                    </View>
                    <ScrollView horizontal={true}>
                        {_.map(receipt.options['detailBottomcoating'], (key,item)=>{ if(key) return(translate('bottomcoating',item,key) !== "" ?<Chip key={item} style={{margin: 3}}>{translate('bottomcoating',item,key)}</Chip>: null)})}
                    </ScrollView>
                </View>}
                {receipt.options.glasscoating === true &&
                <View>
                    <View style={{marginBottom: 5, flexDirection: 'row',  alignItems: 'center'}}>
                        <Icon name="chevron-forward-outline" size={20}></Icon>
                        <Text style={{fontSize: 20}}>유리막코팅</Text>
                    </View>
                    <ScrollView horizontal={true}>
                        <Chip style={{margin: 3}}>{'선택'}</Chip>
                    </ScrollView>
                </View>}
            </View> : 
            kind === 'Care' ?
            <View style={{width: '100%', marginBottom: 10}}>
                {receipt.options.carWash === true &&
                <View>
                    <View style={{marginBottom: 5, flexDirection: 'row',  alignItems: 'center'}}>
                        <Icon name="chevron-forward-outline" size={20}></Icon>
                        <Text style={{fontSize: 20}}>세차</Text>
                    </View>
                    <ScrollView horizontal={true}>
                        {_.map(receipt.options['detailCarWash'], (key,item)=>{ if(key) return(translate('carwash',item,key) !== "" ?<Chip key={item} style={{margin: 3}}>{translate('carwash',item,key)}</Chip>: null)})}
                    </ScrollView>
                </View>}
                {receipt.options.inside === true &&
                <View>
                    <View style={{marginBottom: 5, flexDirection: 'row',  alignItems: 'center'}}>
                        <Icon name="chevron-forward-outline" size={20}></Icon>
                        <Text style={{fontSize: 20}}>내부</Text>
                    </View>
                    <ScrollView horizontal={true}>
                        {_.map(receipt.options['detailInside'], (key,item)=>{ if(key) return(translate('inside',item,key) !== "" ?<Chip key={item} style={{margin: 3}}>{translate('inside',item,key)}</Chip>: null)})}
                    </ScrollView>
                </View>}
                {receipt.options.outside === true &&
                <View>
                    <View style={{marginBottom: 5, flexDirection: 'row',  alignItems: 'center'}}>
                        <Icon name="chevron-forward-outline" size={20}></Icon>
                        <Text style={{fontSize: 20}}>외부</Text>
                    </View>
                    <ScrollView horizontal={true}>
                        {_.map(receipt.options['detailOutside'], (key,item)=>{ if(key) return(translate('outside',item,key) !== "" ?<Chip key={item} style={{margin: 3}}>{translate('outside',item,key)}</Chip>: null)})}
                    </ScrollView>
                </View>}
                {receipt.options.scratch === true &&
                <View>
                    <View style={{marginBottom: 5, flexDirection: 'row',  alignItems: 'center'}}>
                        <Icon name="chevron-forward-outline" size={20}></Icon>
                        <Text style={{fontSize: 20}}>스크레치</Text>
                    </View>
                    <ScrollView horizontal={true}>
                        {_.map(receipt.options['detailScratch'], (key,item)=>{ if(key) return(translate('scratch',item,key) !== "" ?<Chip key={item} style={{margin: 3}}>{translate('scratch',item,key)}</Chip>: null)})}
                    </ScrollView>
                </View>}
                {receipt.options.etc === true &&
                <View>
                    <View style={{marginBottom: 5, flexDirection: 'row',  alignItems: 'center'}}>
                        <Icon name="chevron-forward-outline" size={20}></Icon>
                        <Text style={{fontSize: 20}}>기타</Text>
                    </View>
                    <View style={{padding: 10}}>
                        <View style={{width: '100%', backgroundColor: '#e5e5e5', padding: 5, borderRadius: 5}}>
                            <Text>{receipt.options.detailEtc}</Text>
                        </View>
                    </View>
                </View>}
            </View>: <></>}

            {receipt.region !== null &&
            <View style={{width: '100%', marginBottom: 10, alignItems: 'center', flexDirection: 'row'}}>
                <Icon name="chevron-forward-outline" size={20}></Icon>
                <Text style={{fontSize: 20, marginRight: 10}}>시공 지역</Text>
                <Chip style={{margin: 3}}>{receipt === null ? '': receipt.region}</Chip>
            </View>}
            
            {receipt.require !== null && <View style={{width: '100%', marginBottom: 10}}>
                <Text style={{fontSize: 20 }}>기타 요구사항</Text>
                <View style={{padding: 10}}>
                    <View style={{width: '100%', backgroundColor: '#e5e5e5', padding: 5, borderRadius: 5}}>
                        <Text>{receipt === null ? '': receipt.require}</Text>
                    </View>
                </View>
            </View>}

        </SearchView>
    );
}

export default Order;