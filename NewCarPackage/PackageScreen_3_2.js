import React from 'react';
import { Text, ActivityIndicator, View, ScrollView, TextInput, Alert, SectionList, TouchableOpacity, Image, FlatList } from 'react-native';
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
const IntroView = styled.View`
    flex: 2;
    justify-content: center;
    align-items: center;
    padding: 5px;
`;
const Intro = styled.View`
    width: 90%;
    height: 100%;
    justify-content: center;
`;
const ContentView = styled.View`
    flex: 5;
    align-items : center;
    justify-content: space-between;
`;
const IntroText = styled.Text`
    font-size: 35px;
    font-family: 'NotoSansKR-Bold';
    color: black;
`;
const BtnView = styled.View`
    width: 100%;
    height: 80px;
`;
const Btn = styled.TouchableOpacity`
    border-radius: 50px;
    background-color: #B2EBF4;
    width: 120px;
    height: 60px;
    align-items : center;
    justify-content: center;
`;
const AllSelectView = styled.View`
    background-color: #e5e5e5;
    width: 90%;
    height: 70%;
    border-radius: 15px;
    justify-content: center;
    align-items: center;
    padding: 20px 20px;
`;
const SelectInSwiper = styled.ScrollView`
    width: ${WIDTH*0.9-40}px;
    background-color: white;
    height: 100%;
    padding: 0px 10px;
`;

const OptionName = styled.TouchableOpacity`
    margin-left: 5px;
    margin-right: 5px;
    border-radius: 50px;
    justify-content: center;
    align-items: center;
    padding: 10px;
    height: 50px;
`;

const SelectView = styled.View`
    width: 100%;
    height: 35px;
    flex-direction: row;
    padding-left: 10px;
    align-items: center;
`;
const SelectName = styled.Text`
    margin-left: 5px;
    margin-right: 5px;
    font-size: 18px;
`;


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

const TintingOptions = [
    { label: '루마썬팅', value: 'LUMA', flag: 'tinting' },
    { label: '솔라가드', value: 'SOLAR', flag: 'tinting' },
    { label: '레인보우', value: 'RAINBOW', flag: 'tinting' },
    { label: '라이노', value: 'RAYNO', flag: 'tinting' },
    { label: '상관없음', value: 'ANY', flag: 'tinting' },
]
const BlackBoxOptions = [
    { label: '파인테크', value: 'FINETECH', flag: 'blackbox' },
    { label: '아이나비', value: 'INAVI', flag: 'blackbox' },
    { label: '만도', value: 'MANDO', flag: 'blackbox' },
    { label: '상관없음', value: 'ANY', flag: 'blackbox' },
]
const PpfOptions = [
    { label: '본넷', value: 'BONNET', flag: 'ppf' },
    { label: '사이드미러', value: 'SIDEMIRROR', flag: 'ppf' },
    { label: '앞 범퍼', value: 'FRONTBUMPER', flag: 'ppf' },
    { label: '앞 범퍼사이드', value: 'FRONTBUMPERSIDE', flag: 'ppf' },
    { label: '뒷 범퍼', value: 'BACKBUMPER', flag: 'ppf' },
    { label: '뒷 범퍼사이드', value: 'BACKBUMPERSIDE', flag: 'ppf' },
    { label: '헤드라이트', value: 'HEADLIGHT', flag: 'ppf' },
    { label: '테일램프', value: 'TAILLAMP', flag: 'ppf' },
    { label: 'B/C 필터', value: 'BCFILTER', flag: 'ppf' },
    { label: '도어', value: 'DOOR', flag: 'ppf' },
    { label: '후드', value: 'HOOD', flag: 'ppf' },
    { label: '상관없음', value: 'ANY', flag: 'ppf' },
]
const BatteryOptions = [
    { label: 'V6', value: 'V6', flag: 'battery' },
    { label: 'V12', value: 'V12', flag: 'battery' },
    { label: '상관없음', value: 'ANY', flag: 'battery' },
]
const SoundproofOptions = [
    { label: '하부 방음', value: 'UNDER', flag: 'soundproof' },
    { label: '실내 바닥 방음', value: 'DOORSOUND', flag: 'soundproof' },
    { label: '휀다 방음', value: 'INSIDEFLOOR', flag: 'soundproof' },
    { label: '도어 방음', value: 'FENDER', flag: 'soundproof' },
    { label: '본넷 방음', value: 'BONNETSOUND', flag: 'soundproof' },
    { label: '트렁크 방음', value: 'TRUNK', flag: 'soundproof' },
    { label: '상관없음', value: 'ANY', flag: 'soundproof' },
]

const merchadiseList= [
    {
        id: 0,
        data: ['틴팅'],
    },{
        id: 1,
        data: ['PPF'],
    },{
        id: 2,
        data: ['블랙박스'],
    },{
        id: 3,
        data: ['보조배터리'],
    },{
        id: 4,
        data: ['애프터블로우'],
    },{
        id: 5,
        data: ['방음'],
    },{
        id: 6,
        data: ['랩핑'],
    },{
        id: 7,
        data: ['유리막코팅'],
    },{
        id: 8,
        data: ['하부코팅'],
    }];

function PackageScreen_3_2(props) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const scrollX = React.useRef();
    const swiper = React.useRef();

    const [TintingChoose, setTintingChoose] = React.useState(false);
    function getTintingChoose(bool){
        setTintingChoose(bool);
        if(bool === false){
            setSelectedTinting([]);
        }
    }
    const [selectedTinting, setSelectedTinting] = React.useState([]);

    const [selectedBlackbox, setSelectedBlackbox] = React.useState([]);

    const [PPFChoose, setPPFChoose] = React.useState(false);
    function getPPFChoose(bool){
        setPPFChoose(bool);
        if(bool === false){
            setSelectedPpf([]);
        }
    }
    const [selectedPpf, setSelectedPpf] = React.useState([]);

    const [selectedBattery, setSelectedBattery] = React.useState([]);
    const [selectedSoundproof, setSelectedSoundproof] = React.useState([]);

    function OptionsArray(target){
        const flag = target.flag;
        let index = null;
        let anyIndex = null;
        let temp =[];
        switch (flag){
            case 'tinting':
                setTintingChoose(true);
                index = selectedTinting.findIndex((item)=>{
                    return item.value === target.value
                });
                anyIndex = selectedTinting.findIndex((item)=>{
                    return item.value === 'ANY'
                });
                temp = [...selectedTinting]
                if(index === -1){ //uncheck -> check
                    if(target.value === 'ANY'){ //상관없음 클릭
                        setSelectedTinting([target]);
                    }
                    else{
                        if(anyIndex !== -1){
                            temp=[];
                        }
                        temp.push(target);
                        setSelectedTinting(temp);
                    }
                }
                else{ // check => uncheck
                    temp.splice(index,1)
                    setSelectedTinting(temp);
                }
                break;
            case 'ppf':
                setPPFChoose(true);
                index = selectedPpf.findIndex((item)=>{
                    return item.value === target.value
                });
                anyIndex = selectedPpf.findIndex((item)=>{
                    return item.value === 'ANY'
                });
                temp = [...selectedPpf]
                if(index === -1){ //uncheck -> check
                    if(target.value === 'ANY'){ //상관없음 클릭
                        setSelectedPpf([target]);
                    }
                    else{
                        if(anyIndex !== -1){
                            temp=[];
                        }
                        temp.push(target);
                        setSelectedPpf(temp);
                    }
                }
                else{ // check => uncheck
                    temp.splice(index,1)
                    setSelectedPpf(temp);
                }
                break;
        }
    }

    function checkIndex(target){
        const flag = target.flag;
        let index = -1;
        switch(flag){
            case 'tinting':
                index = selectedTinting.findIndex((item)=>{
                    return item.value === target.value
                });
                break;
            case 'ppf':
                index = selectedPpf.findIndex((item)=>{
                    return item.value === target.value
                });
                break;
        }
        return index
    }

    const renderItem = (obj) => {
        const item = obj.item;
        return (
            <SelectView>
                <Row style={{flex: 1, alignItems: 'center'}}>
                    <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={()=>{OptionsArray(item)}} >
                        <Icon name={checkIndex(item) === -1?"radio-button-off-outline": "radio-button-on-outline"} size={30} color= 'gray'></Icon>
                        <SelectName>{item.label}</SelectName>
                    </TouchableOpacity>
                </Row>
            </SelectView>
        )
    }

    function makeFinal(){
        let newData = _.cloneDeep(InitialOptions);
        selectedTinting.map((item)=>{
            newData.detailTinting[item.value] = true;
        })
        selectedPpf.map((item)=>{
            newData.detailPpf[item.value] = true;
        })
        //console.log(newData);
    }
    
    return(
        <KeyboardAwareScrollView style={{backgroundColor: 'white'}}>
        <TotalView color={'white'} notchColor={'white'} homeIndicatorColor={'white'}>
            <IntroView>
                <Intro>
                    <IntroText>{'원하시는 시공을\n선택해주세요.'}</IntroText>
                </Intro>
            </IntroView>
            <ContentView>
                <SectionList
                    style={{width: '100%'}}
                    ref={scrollX}
                    horizontal={true}
                    sections={merchadiseList}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({item, section} ) => {
                        return(
                        <OptionName style={{backgroundColor: section.id === currentIndex ? Color.main : 'white'}} onPress={()=>{swiper.current.scrollToIndex({"index": section.id, "prevIndex": section.id-1}, true); scrollX.current.scrollToLocation({animated: true, itemIndex: 0, sectionIndex: section.id, viewPosition: 0.5})}}>
                            <Text style={{color: section.id === currentIndex? 'white' : 'black'}}>{item}</Text>
                        </OptionName>
                        )
                    }}
                />
                <AllSelectView>
                    <SwiperFlatList 
                    index={0}
                    ref={swiper}
                    onChangeIndex={(index)=>{setCurrentIndex(index.index); scrollX.current.scrollToLocation({animated: true, itemIndex: 0, sectionIndex: index.index, viewPosition: 0.5})}}>
                        <SelectInSwiper>
                            <SelectTitleOption getChoose={getTintingChoose} 
                                                choose={TintingChoose} 
                                                name={'틴팅'}/>
                            <FlatList
                                data={TintingOptions}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.value}/>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <SelectTitleOption getChoose={getPPFChoose} 
                                                choose={PPFChoose} 
                                                name={'PPF'}/>
                            <FlatList
                                data={PpfOptions}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.value}/>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <Text>hello</Text>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <Text>hello</Text>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <Text>hello</Text>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <Text>hello</Text>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <Text>hello</Text>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <Text>hello</Text>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <Text>hello</Text>
                        </SelectInSwiper>
                    </SwiperFlatList>
                </AllSelectView>
                <BtnView>
                    <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                        <Button mode={"contained"} onPress={() => {makeFinal();}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main}>이전</Button>
                        <Button mode={"contained"} onPress={() => {}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main}>선택완료</Button>
                    </Row>
                </BtnView>
            </ContentView>
        </TotalView>
        </KeyboardAwareScrollView>
        
    );
}

export default PackageScreen_3_2;