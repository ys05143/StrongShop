import React from 'react';
import { Text, ActivityIndicator, View, ScrollView, TextInput, Alert } from 'react-native';
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
import storage from '../function/storage';

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
const InitialOptions = {
    tinting: false,
    detailTinting: {
        LUMA: false,
        SOLAR: false,
        RAINBOW: false,
        RAYNO: false,
        ANY: false,
        ETC: "",
    },
    ppf: false,
    detailPpf: {
        ETC: "",
    },
    blackbox: false,
    detailBalackbox: {
        FINETECH: false,
        INAVI: false,
        ANY: false,
        ETC: "",
    },
    battery: false,
    detailBattery: {
        ANY: false,
        ETC: "",
    },
    afterblow: false,
    detailAfterblow: {
        ANY: false,
        ETC: "",
    },
    //추가옵션
    soundproof: false,
    detailSoundproof: {
        ANY: false,
        ETC: "",
    },
    wrapping: false,
    detailWrapping: {
        ETC: "",
    },
    glasscoating: false,
    undercoating: false,
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
    
    const [result, setResult] = React.useState(InitialOptions);
    const [isLoading, setIsLoading] = React.useState(false);
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
    function getTintingANY(bool){
        setTintingANY(bool);
        const newData = {...result};
        newData.detailTinting.ANY = bool;
        setResult(newData);
    }
    const [TintingETC, setTintingETC] = React.useState("");
    function getTintingETC(str){ 
        setTintingETC(str);
        const newData = {...result};
        newData.detailTinting.ETC = str;
        setResult(newData);
    }
    const [LUMA, setLUMA] = React.useState(false);
    function getLUMA(bool){
        setLUMA(bool);
        const newData = {...result};
        newData.detailTinting.LUMA = bool;
        setResult(newData);
    }
    const [SOLAR, setSOLAR] = React.useState(false);
    function getSOLAR(bool){
        setSOLAR(bool);
        const newData = {...result};
        newData.detailTinting.SOLAR = bool;
        setResult(newData);
    }
    const [RAINBOW, setRAINBOW] = React.useState(false);
    function getRAINBOW(bool){
        setRAINBOW(bool);
        const newData = {...result};
        newData.detailTinting.RAINBOW = bool;
        setResult(newData);
    }
    const [RAYNO, setRAYNO] = React.useState(false);
    function getRAYNO(bool){
        setRAYNO(bool);
        const newData = {...result};
        newData.detailTinting.RAYNO = bool;
        setResult(newData);
    }
 
    const [PPFChoose, setPPFChoose] = React.useState(false);
    function getPPFChoose(bool){
        setPPFChoose(bool);
        const newData = {...result};
        newData.ppf=bool;
        setResult(newData);
    }
    const [PPFETC, setPPFETC] = React.useState("");
    function getPPFETC(str){ 
        setPPFETC(str);
        const newData = {...result};
        newData.detailPpf.ETC = str;
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
    function getBlackboxANY(bool){
        setBlackboxANY(bool);
        const newData = {...result};
        newData.detailBalackbox.ANY = bool;
        setResult(newData);
    }
    const [BlackboxETC, setBlackboxETC] = React.useState("");
    function getBlackboxETC(str){
        setBlackboxETC(str);
        const newData = {...result};
        newData.detailBalackbox.ETC = str;
        setResult(newData);
    }
    const [FINETECH, setFINETECH] = React.useState(false);
    function getFINETECH(bool){
        setFINETECH(bool);
        const newData = {...result};
        newData.detailBalackbox.FINETECH = bool;
        setResult(newData);
    }
    const [INAVI, setINAVI] = React.useState(false);
    function getINAVI(bool){
        setINAVI(bool);
        const newData = {...result};
        newData.detailBalackbox.INAVI = bool;
        setResult(newData);
    }

    const [BatteryChoose, setBatteryChoose] = React.useState(false);
    function getBatteryChoose(bool){
        setBatteryChoose(bool);
        const newData = {...result};
        newData.battery=bool;
        setResult(newData);
    }
    const [BatteryANY, setBatteryANY] = React.useState(false);
    function getBatteryANY(bool){
        setBatteryANY(bool);
        const newData = {...result};
        newData.detailBattery.ANY = bool;
        setResult(newData);
    }
    const [BatteryETC, setBatteryETC] = React.useState("");
    function getBatteryETC(str){
        setBatteryETC(str);
        const newData = {...result};
        newData.detailBattery.ETC = str;
        setResult(newData);
    }

    const [Afterblow, setAfterblow] = React.useState(false);
    function getAfterblow(bool){
        setAfterblow(bool);
        const newData = {...result};
        newData.afterblow=bool;
        setResult(newData);
    }
    const [AfterblowANY, setAfterblowANY] = React.useState(false);
    function getAfterblowANY(bool){
        setAfterblowANY(bool);
        const newData = {...result};
        newData.detailAfterblow.ANY = bool;
        setResult(newData);
    }
    const [AfterblowETC, setAfterblowETC] = React.useState("");
    function getAfterblowETC(str){
        setAfterblowETC(str);
        const newData = {...result};
        newData.detailAfterblow.ETC = str;
        setResult(newData);
    }

    const [SoundproofChoose, setSoundproofChoose] = React.useState(false);
    function getSoundproofChoose(bool){
        setSoundproofChoose(bool);
        const newData = {...result};
        newData.soundproof=bool;
        setResult(newData);
    }
    const [SoundproofANY, setSoundproofANY] = React.useState(false);
    function getSoundproofANY(bool){
        setSoundproofANY(bool);
        const newData = {...result};
        newData.detailSoundproof.ANY = bool;
        setResult(newData);
    }
    const [SoundproofETC, setSoundproofETC] = React.useState("");
    function getSoundproofETC(str){
        setSoundproofETC(str);
        const newData = {...result};
        newData.detailSoundproof.ETC = str;
        setResult(newData);
    }

    const [WrappingChoose, setWrappingChoose] = React.useState(false);
    function getWrappingChoose(bool){
        setWrappingChoose(bool);
        const newData = {...result};
        newData.wrapping=bool;
        setResult(newData);
    }
    const [WrappingETC, setWrappingETC] = React.useState("");
    function getWrappingETC(str){
        setWrappingETC(str);
        const newData = {...result};
        newData.detailWrapping.ETC = str;
        setResult(newData);
    }

    const [GlassCoatingChoose, setGlassCoatingChoose] = React.useState(false);
    function getGlassCoatingChoose(bool){
        setGlassCoatingChoose(bool);
        const newData = {...result};
        newData.glasscoating=bool;
        setResult(newData);
    }

    const [UnderCoatingChoose, setUnderCoatingChoose] = React.useState(false);
    function getUnderCoatingChoose(bool){
        setUnderCoatingChoose(bool);
        const newData = {...result};
        newData.undercoating=bool;
        setResult(newData);
    }
    
    React.useEffect(()=>{
        setIsLoading(true);
        storage.fetch('BidOrder')
        .then(result => {
            if(result.options !== null){
                console.log(result.options);
                setResult(result.options);
                setTintingChoose(result.options.tinting);
                setTintingANY(result.options.detailTinting.ANY);
                setTintingETC(result.options.detailTinting.ETC);
                setLUMA(result.options.detailTinting.LUMA);
                setSOLAR(result.options.detailTinting.SOLAR);
                setRAINBOW(result.options.detailTinting.RAINBOW);
                setRAYNO(result.options.detailTinting.RAYNO);
                setPPFChoose(result.options.ppf);
                setPPFETC(result.options.detailPpf.ETC);
                setBlackboxChoose(result.options.blackbox);
                setBlackboxANY(result.options.detailBalackbox.ANY);
                setBlackboxETC(result.options.detailBalackbox.ETC);
                setFINETECH(result.options.detailBalackbox.FINETECH);
                setINAVI(result.options.detailBalackbox.INAVI);
                setBatteryChoose(result.options.battery);
                setBatteryANY(result.options.detailBattery.ANY);
                setBatteryETC(result.options.detailBattery.ETC);
                setAfterblow(result.options.afterblow);
                setAfterblowANY(result.options.detailAfterblow.ANY);
                setAfterblowETC(result.options.detailAfterblow.ETC);
                setSoundproofChoose(result.options.soundproof);
                setSoundproofANY(result.options.detailSoundproof.ANY);
                setSoundproofETC(result.options.detailSoundproof.ETC);
                setWrappingChoose(result.options.wrapping);
                setWrappingETC(result.options.detailWrapping.ETC);
                setGlassCoatingChoose(result.options.glasscoating);
                setUnderCoatingChoose(result.options.undercoating);
            }
            setIsLoading(false);
        })
        .catch(error => {
            console.log(error);
            Alert.alert(
                '오류',
                '오류가 발생했습니다.',
                [
                  {text: 'OK', onPress: () => {cancelOptions();}},
                ],
                { cancelable: false }
              );
        })
    },[]);

    React.useEffect(()=>{
        scrollX.current.scrollTo({x: 10*currentIndex*currentIndex});
    },[currentIndex]);

    async function storeCarName() {
        try{
            if(_.isEqual(result, InitialOptions)){
                Alert.alert(
                    '경고',
                    '시공을 입력해주세요.',
                    [
                      {text: 'OK', onPress: () => {}},
                    ],
                    { cancelable: false }
                  );
            }
            else{
                let newOrder = null;
                const response = await storage.fetch('BidOrder');
                if(response !== null){ //정상적인 루트로 왔다면 fetch가 반드시 성공.
                    newOrder = {...response};
                    newOrder.options = result;
                    if(newOrder.processPage <= 2) newOrder.processPage = 2;
                    await storage.store('BidOrder', newOrder);
                    props.navigation.navigate("PackageScreen_4");
                }
                else{ //async에 저장된 것이 없을 때 === 차량등록을 안하고 왔을 때 === 오류인 상황
                    Alert.alert(
                        '오류',
                        '오류가 발생했습니다.',
                        [
                          {text: 'OK', onPress: () => {cancelOptions();}},
                        ],
                        { cancelable: false }
                      );
                }
            }
            //just check
            const check = await storage.fetch('BidOrder');
            console.log('In page 3 check: ', check);
        }
        catch(error){
            console.log(error);
            cancelOptions();
        }
    }

    function cancelOptions(){
        setResult(InitialOptions);
        //나머지 모든 체크도 false 시켜야함
        props.navigation.navigate("MainScreen");
    }
    function askCancelOptions(){
        Alert.alert(
            '경고',
            '현재 페이지의 입력을 취소하시겠습니까?\n이 페이지에 입력된 내용은 저장되지 않습니다.',
            [
              {text: 'OK', onPress: () => {
                setResult(InitialOptions);
                props.navigation.navigate("MainScreen");
              }},
              {text: '취소', onPress: () => {}}
            ],
            { cancelable: true }
        );
    
    }
    
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
                    {!isLoading ? 
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
                            <SelectDetailOption getChoose={getLUMA} 
                                                choose={LUMA}
                                                name={'루마'}
                                                touchable={TintingChoose}/>
                            <SelectDetailOption getChoose={getSOLAR} 
                                                choose={SOLAR}
                                                name={'솔라'}
                                                touchable={TintingChoose}/>
                            <SelectDetailOption getChoose={getRAINBOW} 
                                                choose={RAINBOW}
                                                name={'레인보우'}
                                                touchable={TintingChoose}/>
                            <SelectDetailOption getChoose={getRAYNO} 
                                                choose={RAYNO}
                                                name={'레이노'}
                                                touchable={TintingChoose}/>
                            <SelectDetailOption getChoose={getTintingANY} 
                                                choose={TintingANY}
                                                name={'상관없음'}
                                                touchable={TintingChoose}/>
                            <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center'}}>
                                <Text style={{fontSize: 18, color: 'black'}}>기타</Text>
                                <TextInput style={{width: '65%', borderWidth: 1, marginLeft: 5, padding: 5, height: '90%', borderRadius: 5}}
                                        value={TintingETC}
                                        onChangeText={(value)=>{getTintingETC(value);}}/>
                            </Row>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <Select4Screen3_3 getChoose={getPPFChoose} 
                                                choose={PPFChoose} 
                                                name={'PPF'}/>
                            <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center'}}>
                                <Text style={{fontSize: 18, color: 'black'}}>기타</Text>
                                <TextInput style={{width: '65%', borderWidth: 1, marginLeft: 5, padding: 5, height: '90%', borderRadius: 5}}
                                        value={PPFETC}
                                        onChangeText={(value)=>{getPPFETC(value);}}/>
                            </Row>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <Select4Screen3_3 getChoose={getBlackboxChoose} 
                                                choose={BlackboxChoose} 
                                                name={'블랙박스'}/>
                            <SelectDetailOption getChoose={getFINETECH} 
                                                choose={FINETECH}
                                                name={'파인테크'}
                                                touchable={BlackboxChoose}/>
                            <SelectDetailOption getChoose={getINAVI} 
                                                choose={INAVI}
                                                name={'아이나비'}
                                                touchable={BlackboxChoose}/>
                            <SelectDetailOption getChoose={getBlackboxANY} 
                                                choose={BlackboxANY}
                                                name={'상관없음'}
                                                touchable={BlackboxChoose}/>
                            <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center'}}>
                                <Text style={{fontSize: 18, color: 'black'}}>기타</Text>
                                <TextInput style={{width: '65%', borderWidth: 1, marginLeft: 5, padding: 5, height: '90%', borderRadius: 5}}
                                        value={BlackboxETC}
                                        onChangeText={(value)=>{getBlackboxETC(value);}}/>
                            </Row>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <Select4Screen3_3 getChoose={getBatteryChoose} 
                                                choose={BatteryChoose} 
                                                name={'보조배터리'}/>
                            <SelectDetailOption getChoose={getBatteryANY} 
                                                choose={BatteryANY}
                                                name={'상관없음'}
                                                touchable={BatteryChoose}/>
                            <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center'}}>
                                <Text style={{fontSize: 18, color: 'black'}}>기타</Text>
                                <TextInput style={{width: '65%', borderWidth: 1, marginLeft: 5, padding: 5, height: '90%', borderRadius: 5}}
                                        value={BatteryETC}
                                        onChangeText={(value)=>{getBatteryETC(value);}}/>
                            </Row>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <Select4Screen3_3 getChoose={getAfterblow} 
                                                choose={Afterblow} 
                                                name={'애프터블로우'}/>
                            <SelectDetailOption getChoose={getAfterblowANY} 
                                                choose={AfterblowANY}
                                                name={'상관없음'}
                                                touchable={Afterblow}/>
                            <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center'}}>
                                <Text style={{fontSize: 18, color: 'black'}}>기타</Text>
                                <TextInput style={{width: '65%', borderWidth: 1, marginLeft: 5, padding: 5, height: '90%', borderRadius: 5}}
                                        value={AfterblowETC}
                                        onChangeText={(value)=>{getAfterblowETC(value);}}/>
                            </Row>                  
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <Select4Screen3_3 getChoose={getSoundproofChoose} 
                                                choose={SoundproofChoose} 
                                                name={'방음'}/>
                            <SelectDetailOption getChoose={getSoundproofANY} 
                                                choose={SoundproofANY}
                                                name={'상관없음'}
                                                touchable={SoundproofChoose}/>
                            <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center'}}>
                                <Text style={{fontSize: 18, color: 'black'}}>기타</Text>
                                <TextInput style={{width: '65%', borderWidth: 1, marginLeft: 5, padding: 5, height: '90%', borderRadius: 5}}
                                        value={SoundproofETC}
                                        onChangeText={(value)=>{getSoundproofETC(value);}}/>
                            </Row>                   
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <Select4Screen3_3 getChoose={getWrappingChoose} 
                                                choose={WrappingChoose} 
                                                name={'랩핑'}/>
                            <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center'}}>
                                <Text style={{fontSize: 18, color: 'black'}}>기타</Text>
                                <TextInput style={{width: '65%', borderWidth: 1, marginLeft: 5, padding: 5, height: '90%', borderRadius: 5}}
                                        value={WrappingETC}
                                        onChangeText={(value)=>{getWrappingETC(value);}}/>
                            </Row>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <Select4Screen3_3 getChoose={getGlassCoatingChoose} 
                                                choose={GlassCoatingChoose} 
                                                name={'유리막코팅'}/>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <Select4Screen3_3 getChoose={getUnderCoatingChoose} 
                                                choose={UnderCoatingChoose} 
                                                name={'언더코팅'}/>
                        </SelectInSwiper>
                    </Swiper>  : <ActivityIndicator size = 'large' color= {Color.main} style={{marginTop: 10}}/>}
                </AllSelectView>
                <BtnView>
                    <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                        <Button mode={"contained"} onPress={() => {props.navigation.goBack();}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>이전</Button>
                        <Button mode={"contained"} onPress={() => {storeCarName();}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>다음</Button>
                    </Row>
                </BtnView>
            </ContentView>
            <View style={{position: 'absolute', width: '100%', alignItems: 'flex-end', paddingTop: 5, paddingRight: 5}}>
                <Icon name="close-outline" size={35} color={'black'} onPress={()=>{askCancelOptions();}}></Icon>
            </View>
        </TotalView>
        </KeyboardAwareScrollView>
    );
}

export default PackageScreen_3;