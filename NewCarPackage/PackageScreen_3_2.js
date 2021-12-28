import React from 'react';
import { Text, ActivityIndicator, View, ScrollView, TextInput, Alert, SectionList, TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
import { Button } from 'react-native-paper';
import Icon  from "react-native-vector-icons/Ionicons";
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import _ from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import SelectMultiple from 'react-native-select-multiple'
//pages
import SelectDetailOption from './SelectDetailOption';
import SelectTitleOption from './SelectTitleOption';
import SelectOptions from './SelectOptions';
//components
import TotalView from '../components/TotalView';
import Row from '../components/Row';
//constants
import AppWindow from '../constants/AppWindow';
import Color from '../constants/Color';
//function
import storage from '../function/storage';

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;

const InitialOptions = {
    tinting: false,
    detailTinting: {
        LUMA: false,
        SOLAR: false,
        RAINBOW: false,
        RAYNO: false,
        ANY: false,
        ETC: '',
    },
    ppf: false,
    detailPpf: {
        BONNET: false,
        SIDEMIRROR: false,
        FRONTBUMPER: false,
        FRONTBUMPERSIDE:false,
        BACKBUMPER: false,
        BACKBUMPERSIDE: false,
        HEADLIGHT: false,
        TAILLAMP: false,
        BCFILTER: false,
        DOOR: false,
        HOOD: false,
        ETC: '',
    },
    blackbox: false,
    detailBlackbox: {
        FINETECH: false,
        INAVI: false,
        MANDO: false,
        ANY: false,
        ETC: '',
    },
    battery: false,
    detailBattery: {
        V6: false,
        V12: false,
        ANY: false,
        ETC: '',
    },
    afterblow: false,
    detailAfterblow: {
        ANY: false,
        ETC: '',
    },
    //추가옵션
    soundproof: false,
    detailSoundproof: {
        UNDER: false,
        DOORSOUND: false,
        INSIDEFLOOR: false,
        FENDER: false,
        BONNETSOUND: false,
        TRUNK: false,
        ETC: '',
    },
    wrapping: false,
    detailWrapping: {
        DESIGN: '',
    },
    glasscoating: false,
    undercoating: false,
}

const compareOptions = {
    tinting: false,
    detailTinting: {
        LUMA: false,
        SOLAR: false,
        RAINBOW: false,
        RAYNO: false,
        ANY: false,
        ETC: '',
    },
    ppf: false,
    detailPpf: {
        BONNET: false,
        SIDEMIRROR: false,
        FRONTBUMPER: false,
        FRONTBUMPERSIDE:false,
        BACKBUMPER: false,
        BACKBUMPERSIDE: false,
        HEADLIGHT: false,
        TAILLAMP: false,
        BCFILTER: false,
        DOOR: false,
        HOOD: false,
        ETC: '',
    },
    blackbox: false,
    detailBlackbox: {
        FINETECH: false,
        INAVI: false,
        MANDO: false,
        ANY: false,
        ETC: '',
    },
    battery: false,
    detailBattery: {
        V6: false,
        V12: false,
        ANY: false,
        ETC: '',
    },
    afterblow: false,
    detailAfterblow: {
        ANY: false,
        ETC: '',
    },
    //추가옵션
    soundproof: false,
    detailSoundproof: {
        UNDER: false,
        DOORSOUND: false,
        INSIDEFLOOR: false,
        FENDER: false,
        BONNETSOUND: false,
        TRUNK: false,
        ETC: '',
    },
    wrapping: false,
    detailWrapping: {
        DESIGN: '',
    },
    glasscoating: false,
    undercoating: false,
}

function PackageScreen_3_2(props) {

    const TintingOptions = [
        { label: '루마썬팅', value: 'LUMA' },
        { label: '솔라가드', value: 'SOLAR' },
        { label: '레인보우', value: 'RAINBOW' },
        { label: '라이노', value: 'RAYNO' },
        { label: '상관없음', value: 'ANY' },
    ]
    const BlackBoxOptions = [
        { label: '파인테크', value: 'FINETECH' },
        { label: '아이나비', value: 'INAVI' },
        { label: '만도', value: 'MANDO' },
        { label: '상관없음', value: 'ANY' },
    ]
    const PpfOptions = [
        { label: '본넷', value: 'BONNET' },
        { label: '사이드미러', value: 'SIDEMIRROR' },
        { label: '앞 범퍼', value: 'FRONTBUMPER' },
        { label: '앞 범퍼사이드', value: 'FRONTBUMPERSIDE' },
        { label: '뒷 범퍼', value: 'BACKBUMPER' },
        { label: '뒷 범퍼사이드', value: 'BACKBUMPERSIDE' },
        { label: '헤드라이트', value: 'HEADLIGHT' },
        { label: '테일램프', value: 'TAILLAMP' },
        { label: 'B/C 필터', value: 'BCFILTER' },
        { label: '도어', value: 'DOOR' },
        { label: '후드', value: 'HOOD' },
        { label: '상관없음', value: 'ANY' },
    ]
    const BatteryOptions = [
        { label: 'V6', value: 'V6' },
        { label: 'V12', value: 'V12' },
        { label: '상관없음', value: 'ANY' },
    ]
    const SoundproofOptions = [
        { label: '하부 방음', value: 'UNDER' },
        { label: '실내 바닥 방음', value: 'DOORSOUND' },
        { label: '휀다 방음', value: 'INSIDEFLOOR' },
        { label: '도어 방음', value: 'FENDER' },
        { label: '본넷 방음', value: 'BONNETSOUND' },
        { label: '트렁크 방음', value: 'TRUNK' },
        { label: '상관없음', value: 'ANY' },
    ]

    const renderLabel = (label, style) => {
    return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{marginLeft: 10}}>
                <Text style={style}>{label}</Text>
            </View>
        </View>
    )
    }
    const [selectedTinting, setselectedTinting] = React.useState([]);

    const onSelectionsChange = (selected) => {
        // selectedTinting is array of { label, value }
        setselectedTinting(selected)
    }

    function makeFinal(){
        let newData = InitialOptions;
        selectedTinting.map((item)=>{
            newData.detailTinting[item.value] = true;
        })
        console.log(newData.detailTinting);
    }
    return(
        <TotalView>
            <SelectMultiple
            items={TintingOptions}
            renderLabel={renderLabel}
            selectedItems={selectedTinting}
            onSelectionsChange={(selectedItem)=>{setselectedTinting(selectedItem);}} />
            <Button mode={"contained"} onPress={() => {makeFinal()}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main}>이전</Button>
        </TotalView>
        
    );
}

export default PackageScreen_3_2;