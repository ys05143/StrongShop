import React from 'react';
import { Text, ActivityIndicator, View, ScrollView, TextInput } from 'react-native';
import styled from 'styled-components/native';
import { Button } from 'react-native-paper';
import Icon  from "react-native-vector-icons/Ionicons";
import Swiper from 'react-native-swiper';
import _ from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
//pages
import SelectDetailOption from './SelectDetailOption';
import Select4Screen3_3 from './Select4Screen3_3';
import Temp from '../Temp';
//components
import TotalView from '../components/TotalView';
import Row from '../components/Row';
//constants
import AppWindow from '../constants/AppWindow';
import Color from '../constants/Color';
//function
import store from '../function/store';
import fetch from '../function/fetch';

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;
///////////////////////////////
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
///////////////////////////////////
const AllSelectView = styled.View`
    background-color: #e5e5e5;
    width: 90%;
    height: 70%;
    border-radius: 15px;
    justify-content: center;
    align-items: center;
    padding: 20px 20px;
`;
const SelectInSwiper = styled.View`
    flex: 1;
    background-color: white;
    padding: 5px;
`;

const OptionName = styled.TouchableOpacity`
    margin-left: 5px;
    margin-right: 5px;
    border-radius: 25px;
    justify-content: center;
    align-items: center;
    padding: 10px;
`;

const InputView = styled.TextInput`
    border: 1px;
    margin-left: 5px; 
    width: '65%';
    font-size: 12px;
`;
const InitialResult = {
    tinting: false,
    detailTinting: {
        LUMA: false,
        SOLAR: false,
        RAINBOW: false,
        RAYNO: false,
    },
    ppf: false,
    detailPpf: null,
    blackbox: false,
    detailBalackbox: {
        FINETECH: false,
        INAVI: false,
    },
    battery: false,
    detailBattery: null,
    afterblow: false,
    detailAfterblow: null,
    //추가옵션
    soundproof: false,
    detailSoundproof: null,
    wrapping: false,
    detailwrapping: null,
    glasscoating: false,
    undercoating: false,
    etc: null,
}
const merchadiseList= [
    {
        id: 0,
        name: '틴팅',
    },{
        id: 1,
        name: 'PPF',
    },{
        id: 2,
        name: '블랙박스',
    },{
        id: 3,
        name: '보조배터리',
    },{
        id: 4,
        name: '애프터블로우',
    },{
        id: 5,
        name: '방음',
    },{
        id: 6,
        name: '랩핑',
    },{
        id: 7,
        name: '유리막코팅',
    },{
        id: 8,
        name: '언더코팅',
    }];

function PackageScreen_3(props) {
    
    const [result, setResult] = React.useState(InitialResult);
    const [start, setStart] = React.useState(false);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const scrollX = React.useRef();
    const swiper = React.useRef();

    const [TintingChoose, setTintingChoose] = React.useState(false);
    function getTintingChoose(bool){
        setTintingChoose(bool);
        const newData = {...result};
        newData.tinting=bool;
        setResult(newData);
    }
    const [TintingANY, setTintingANY] = React.useState(false);
    const [TintingETC, setTintingETC] = React.useState(null);
    const [LUMA, setLUMA] = React.useState(false);
    const [SOLAR, setSOLAR] = React.useState(false);
    const [RAINBOW, setRAINBOW] = React.useState(false);
    const [RAYNO, setRAYNO] = React.useState(false);

    const [PPFChoose, setPPFChoose] = React.useState(false);
    function getPPFChoose(bool){
        setPPFChoose(bool);
        const newData = {...result};
        newData.ppf=bool;
        setResult(newData);
    }

    const [BlackboxChoose, setBlackboxChoose] = React.useState(false);
    function getBlackboxChoose(bool){
        setBlackboxChoose(bool);
        const newData = {...result};
        newData.blackbox=bool;
        setResult(newData);
    }
    const [BlackboxANY, setBlackboxANY] = React.useState(false);
    const [BlackboxETC, setBlackboxETC] = React.useState(null);
    const [FINETECH, setFINETECH] = React.useState(false);
    const [INAVI, setINAVI] = React.useState(false);


    const [BatteryChoose, setBatteryChoose] = React.useState(false);
    function getBatteryChoose(bool){
        setBatteryChoose(bool);
        const newData = {...result};
        newData.battery=bool;
        setResult(newData);
    }
    const [BatteryANY, setBatteryANY] = React.useState(false);
    const [BatteryETC, setBatteryETC] = React.useState(null);

    const [Afterblow, setAfterblow] = React.useState(false);
    function getAfterblow(bool){
        setAfterblow(bool);
        const newData = {...result};
        newData.afterblow=bool;
        setResult(newData);
    }
    const [AfterblowANY, setAfterblowANY] = React.useState(false);
    const [AfterblowETC, setAfterblowETC] = React.useState(null);

    const [SoundproofChoose, setSoundproofChoose] = React.useState(false);
    function getSoundproofChoose(bool){
        setSoundproofChoose(bool);
        const newData = {...result};
        newData.soundproof=bool;
        setResult(newData);
    }
    const [SoundproofANY, setSoundproofANY] = React.useState(false);
    const [SoundproofETC, setSoundproofETC] = React.useState(null);

    const [WrappingChoose, setWrappingChoose] = React.useState(false);
    function getWrappingChoose(bool){
        setWrappingChoose(bool);
        const newData = {...result};
        newData.wrapping=bool;
        setResult(newData);
    }
    const [WrappingANY, setWrappingANY] = React.useState(false);
    const [WrappingETC, setWrappingETC] = React.useState(null);

    const [GlassCoatingChoose, setGlassCoatingChoose] = React.useState(false);
    function getGlassCoatingChoose(bool){
        setGlassCoatingChoose(bool);
        const newData = {...result};
        newData.glasscoating=bool;
        setResult(newData);
    }
    const [GlassCoatingANY, setGlassCoatingANY] = React.useState(false);
    const [GlassCoatingETC, setGlassCoatingETC] = React.useState(null);

    const [UnderCoatingChoose, setUnderCoatingChoose] = React.useState(false);
    function getUnderCoatingChoose(bool){
        setUnderCoatingChoose(bool);
        const newData = {...result};
        newData.undercoating=bool;
        setResult(newData);
    }
    const [UnderCoatingANY, setUnderCoatingANY] = React.useState(false);
    const [UnderCoatingETC, setUnderCoatingETC] = React.useState(null);
    
    React.useEffect(()=>{
        setStart(true);
    },[]);

    React.useEffect(()=>{
        scrollX.current.scrollTo({x: 10*currentIndex*currentIndex});
    },[currentIndex]);

    function SwiperButton(props){
        return(
            <View style={{backgroundColor: 'lightgray', width: 50, height: 25, justifyContent: 'center', alignItems: 'center', borderRadius: 25}}>
                <Icon name={props.name} color={Color.main}></Icon>
            </View>
        )
    }

    return(
        <KeyboardAwareScrollView>
        <TotalView color={'white'} notchColor={'white'}>
            <IntroView>
                <Intro>
                    <IntroText>{'원하시는 시공을\n선택해주세요.'}</IntroText>
                </Intro>
            </IntroView>
            <ContentView>
                <ScrollView style={{flexDirection: 'row', height: 70, backgroundColor: 'white'}} 
                                        horizontal={true} 
                                        contentContainerStyle={{alignItems: 'center'}} 
                                        ref={scrollX}>
                    {_.map(merchadiseList, (item) => {
                        return(
                            <OptionName  key={item.id} style={{backgroundColor: item.id === currentIndex ? Color.main : 'white'}}  onPress={()=>{swiper.current.scrollBy(item.id-currentIndex, true);}}>
                                <Text style={{color: item.id === currentIndex? 'white' : 'black'}}>{item.name}</Text>
                            </OptionName>
                        );}
                    )}
                </ScrollView>
                <AllSelectView>
                    {start === true ? 
                    <Swiper showsButtons={true} 
                    buttonWrapperStyle={{alignItems: 'flex-end', paddingVertical: 10}} 
                    paginationStyle={{bottom: 10}}
                    activeDotColor={Color.main}
                    prevButton={<SwiperButton name="arrow-back-outline"/>}
                    nextButton={<SwiperButton name="arrow-forward-outline"/>}
                    loop={false}
                    scrollEnabled={false}
                    ref={swiper}
                    onIndexChanged={(index)=>{setCurrentIndex(index)}}>
                        <SelectInSwiper>    
                            <Select4Screen3_3 getChoose={getTintingChoose} 
                                                choose={TintingChoose} 
                                                name={'틴팅'}/>
                            <SelectDetailOption getChoose={setLUMA} 
                                                choose={LUMA}
                                                name={'루마'}
                                                touchable={TintingChoose}/>
                            <SelectDetailOption getChoose={setSOLAR} 
                                                choose={SOLAR}
                                                name={'솔라'}
                                                touchable={TintingChoose}/>
                            <SelectDetailOption getChoose={setRAINBOW} 
                                                choose={RAINBOW}
                                                name={'레인보우'}
                                                touchable={TintingChoose}/>
                            <SelectDetailOption getChoose={setRAYNO} 
                                                choose={RAYNO}
                                                name={'레이노'}
                                                touchable={TintingChoose}/>
                            <SelectDetailOption getChoose={setTintingANY} 
                                                choose={TintingANY}
                                                name={'상관없음'}
                                                touchable={TintingChoose}/>
                            <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center'}}>
                                <Text style={{fontSize: 18, color: 'black'}}>기타</Text>
                                <TextInput style={{width: '65%', borderWidth: 1, marginLeft: 5, padding: 5, height: '90%', borderRadius: 5}}
                                        value={TintingETC}
                                        onChangeText={(value)=>{setTintingETC(value);}}/>
                            </Row>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <Select4Screen3_3 getChoose={getPPFChoose} 
                                                choose={PPFChoose} 
                                                name={'PPF'}/>
                            <SelectDetailOption getChoose={setTintingANY} 
                                                choose={TintingANY}
                                                name={'상관없음'}
                                                touchable={PPFChoose}/>
                            <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center'}}>
                                <Text style={{fontSize: 18, color: 'black'}}>기타</Text>
                                <TextInput style={{width: '65%', borderWidth: 1, marginLeft: 5, padding: 5, height: '90%', borderRadius: 5}}
                                        value={TintingETC}
                                        onChangeText={(value)=>{setTintingETC(value);}}/>
                            </Row>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <Select4Screen3_3 getChoose={getBlackboxChoose} 
                                                choose={BlackboxChoose} 
                                                name={'블랙박스'}/>
                            <SelectDetailOption getChoose={setFINETECH} 
                                                choose={FINETECH}
                                                name={'파인테크'}
                                                touchable={BlackboxChoose}/>
                            <SelectDetailOption getChoose={setINAVI} 
                                                choose={INAVI}
                                                name={'아이나비'}
                                                touchable={BlackboxChoose}/>
                            <SelectDetailOption getChoose={setBlackboxANY} 
                                                choose={BlackboxANY}
                                                name={'상관없음'}
                                                touchable={BlackboxChoose}/>
                            <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center'}}>
                                <Text style={{fontSize: 18, color: 'black'}}>기타</Text>
                                <TextInput style={{width: '65%', borderWidth: 1, marginLeft: 5, padding: 5, height: '90%', borderRadius: 5}}
                                        value={BlackboxETC}
                                        onChangeText={(value)=>{setBlackboxETC(value);}}/>
                            </Row>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <Select4Screen3_3 getChoose={getBatteryChoose} 
                                                choose={BatteryChoose} 
                                                name={'보조배터리'}/>
                            <SelectDetailOption getChoose={setBatteryANY} 
                                                choose={BatteryANY}
                                                name={'상관없음'}
                                                touchable={BatteryChoose}/>
                            <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center'}}>
                                <Text style={{fontSize: 18, color: 'black'}}>기타</Text>
                                <TextInput style={{width: '65%', borderWidth: 1, marginLeft: 5, padding: 5, height: '90%', borderRadius: 5}}
                                        value={BatteryETC}
                                        onChangeText={(value)=>{setBatteryETC(value);}}/>
                            </Row>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <Select4Screen3_3 getChoose={getAfterblow} 
                                                choose={Afterblow} 
                                                name={'애프터블로우'}/>
                            <SelectDetailOption getChoose={setAfterblowANY} 
                                                choose={AfterblowANY}
                                                name={'상관없음'}
                                                touchable={Afterblow}/>
                            <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center'}}>
                                <Text style={{fontSize: 18, color: 'black'}}>기타</Text>
                                <TextInput style={{width: '65%', borderWidth: 1, marginLeft: 5, padding: 5, height: '90%', borderRadius: 5}}
                                        value={AfterblowETC}
                                        onChangeText={(value)=>{setAfterblowETC(value);}}/>
                            </Row>                  
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <Select4Screen3_3 getChoose={getSoundproofChoose} 
                                                choose={SoundproofChoose} 
                                                name={'방음'}/>
                            <SelectDetailOption getChoose={setSoundproofANY} 
                                                choose={SoundproofANY}
                                                name={'상관없음'}
                                                touchable={SoundproofChoose}/>
                            <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center'}}>
                                <Text style={{fontSize: 18, color: 'black'}}>기타</Text>
                                <TextInput style={{width: '65%', borderWidth: 1, marginLeft: 5, padding: 5, height: '90%', borderRadius: 5}}
                                        value={SoundproofETC}
                                        onChangeText={(value)=>{setSoundproofETC(value);}}/>
                            </Row>                   
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <Select4Screen3_3 getChoose={getWrappingChoose} 
                                                choose={WrappingChoose} 
                                                name={'랩핑'}/>
                            <SelectDetailOption getChoose={setWrappingANY} 
                                                choose={WrappingANY}
                                                name={'상관없음'}
                                                touchable={WrappingChoose}/>
                            <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center'}}>
                                <Text style={{fontSize: 18, color: 'black'}}>기타</Text>
                                <TextInput style={{width: '65%', borderWidth: 1, marginLeft: 5, padding: 5, height: '90%', borderRadius: 5}}
                                        value={WrappingETC}
                                        onChangeText={(value)=>{setWrappingETC(value);}}/>
                            </Row>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <Select4Screen3_3 getChoose={getGlassCoatingChoose} 
                                                choose={GlassCoatingChoose} 
                                                name={'유리막코팅'}/>
                            <SelectDetailOption getChoose={setGlassCoatingANY} 
                                                choose={GlassCoatingANY}
                                                name={'상관없음'}
                                                touchable={GlassCoatingChoose}/>
                            <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center'}}>
                                <Text style={{fontSize: 18, color: 'black'}}>기타</Text>
                                <TextInput style={{width: '65%', borderWidth: 1, marginLeft: 5, padding: 5, height: '90%', borderRadius: 5}}
                                        value={GlassCoatingETC}
                                        onChangeText={(value)=>{setGlassCoatingETC(value);}}/>
                            </Row>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <Select4Screen3_3 getChoose={getUnderCoatingChoose} 
                                                choose={UnderCoatingChoose} 
                                                name={'언더코팅'}/>
                            <SelectDetailOption getChoose={setUnderCoatingANY} 
                                                choose={UnderCoatingANY}
                                                name={'상관없음'}
                                                touchable={UnderCoatingChoose}/>
                            <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center'}}>
                                <Text style={{fontSize: 18, color: 'black'}}>기타</Text>
                                <TextInput style={{width: '65%', borderWidth: 1, marginLeft: 5, padding: 5, height: '90%', borderRadius: 5}}
                                        value={UnderCoatingETC}
                                        onChangeText={(value)=>{setUnderCoatingETC(value);}}/>
                            </Row>
                        </SelectInSwiper>
                    </Swiper>  : <ActivityIndicator size = 'large' color= {Color.main} style={{marginTop: 10}}/>}
                </AllSelectView>
                <BtnView>
                    <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                        <Button mode={"contained"} onPress={() => {props.navigation.goBack();}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>이전</Button>
                        <Button mode={"contained"} onPress={() => {alert('next')}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>다음</Button>
                    </Row>
                </BtnView>
            </ContentView>
            <View style={{position: 'absolute', width: '100%', alignItems: 'flex-end', paddingTop: 5, paddingRight: 5}}>
                <Icon name="close-outline" size={35} color={'black'} onPress={()=>{props.navigation.navigate("PackageScreen_1")}}></Icon>
            </View>
        </TotalView>
        </KeyboardAwareScrollView>
    );
}

export default PackageScreen_3;