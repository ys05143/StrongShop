import React from 'react';
import { Text, ActivityIndicator, View, ScrollView, TextInput, Alert, SectionList, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Button } from 'react-native-paper';
import Icon  from "react-native-vector-icons/Ionicons";
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import _ from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
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

function PackageScreen_3(props) {
    
    //const [result, setResult] = React.useState({...InitialOptions});
    const [isLoading, setIsLoading] = React.useState(false);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const scrollX = React.useRef();
    const swiper = React.useRef();

    const [TintingChoose, setTintingChoose] = React.useState(false);
    function getTintingChoose(bool){
        setTintingChoose(bool);
        if(bool === false){
            setLUMA(false);
            setSOLAR(false);
            setRAINBOW(false);
            setRAYNO(false);
            setTintingANY(false);
            setTintingETC('');
        }
    }
    const [TintingANY, setTintingANY] = React.useState(false);
    function getTintingANY(bool){
        setTintingANY(bool);
        if(bool === true){
            setTintingChoose(true);
            setLUMA(false);
            setSOLAR(false);
            setRAINBOW(false);
            setRAYNO(false);
            setTintingETC('');
        }
    }
    const [TintingETC, setTintingETC] = React.useState('');
    function getTintingETC(str){ 
        setTintingETC(str);
        if(str !== ''){
            setTintingChoose(true);
            setTintingANY(false);
        }
    }
    const [LUMA, setLUMA] = React.useState(false);
    function getLUMA(bool){
        setLUMA(bool);
        if(bool === true){
            setTintingChoose(true);
            setTintingANY(false);
        }
    }
    const [SOLAR, setSOLAR] = React.useState(false);
    function getSOLAR(bool){
        setSOLAR(bool);
        if(bool === true){
            setTintingChoose(true);
            setTintingANY(false);
        }
    }
    const [RAINBOW, setRAINBOW] = React.useState(false);
    function getRAINBOW(bool){
        setRAINBOW(bool);
        if(bool === true){
            setTintingChoose(true);
            setTintingANY(false);
        }
    }
    const [RAYNO, setRAYNO] = React.useState(false);
    function getRAYNO(bool){
        setRAYNO(bool);
        if(bool === true){
            setTintingChoose(true);
            setTintingANY(false);
        }
    }
 ////////////////////////////////////////////////////////////////
    const [PPFChoose, setPPFChoose] = React.useState(false);
    function getPPFChoose(bool){
        setPPFChoose(bool);
        if(bool === false){
            setPPFETC('');
            setBONNET(false);
            setSIDEMIRROR(false);
            setFRONTBUMPER(false);
            setFRONTBUMPERSIDE(false);
            setBACKBUMPER(false);
            setBACKBUMPERSIDE(false);
            setHEADLIGHT(false);
            setTAILLAMP(false);
            setBCFILTER(false);
            setDOOR(false);
            setHOOD(false);
        }
    }
    const [PPFETC, setPPFETC] = React.useState('');
    function getPPFETC(bool){
        setPPFETC(bool);
        if(bool === true){
            setPPFChoose(true);
        }
    }
    const [BONNET, setBONNET] = React.useState(false);
    function getBONNET(bool){
        setBONNET(bool);
        if(bool === true){
            setPPFChoose(true);
        }
    }
    const [SIDEMIRROR, setSIDEMIRROR] = React.useState(false);
    function getSIDEMIRROR(bool){
        setSIDEMIRROR(bool);
        if(bool === true){
            setPPFChoose(true);
        }
    }
    const [FRONTBUMPER, setFRONTBUMPER] = React.useState(false);
    function getFRONTBUMPER(bool){
        setFRONTBUMPER(bool);
        if(bool === true){
            setPPFChoose(true);
        }
    }
    const [FRONTBUMPERSIDE, setFRONTBUMPERSIDE] = React.useState(false);
    function getFRONTBUMPERSIDE(bool){
        setFRONTBUMPERSIDE(bool);
        if(bool === true){
            setPPFChoose(true);
        }
    }
    const [BACKBUMPER, setBACKBUMPER] = React.useState(false);
    function getBACKBUMPER(bool){
        setBACKBUMPER(bool);
        if(bool === true){
            setPPFChoose(true);
        }
    }
    const [BACKBUMPERSIDE, setBACKBUMPERSIDE] = React.useState(false);
    function getBACKBUMPERSIDE(bool){
        setBACKBUMPERSIDE(bool);
        if(bool === true){
            setPPFChoose(true);
        }
    }
    const [HEADLIGHT, setHEADLIGHT] = React.useState(false);
    function getHEADLIGHT(bool){
        setHEADLIGHT(bool);
        if(bool === true){
            setPPFChoose(true);
        }
    }
    const [TAILLAMP, setTAILLAMP] = React.useState(false);
    function getTAILLAMP(bool){
        setTAILLAMP(bool);
        if(bool === true){
            setPPFChoose(true);
        }
    }
    const [BCFILTER, setBCFILTER] = React.useState(false);
    function getBCFILTER(bool){
        setBCFILTER(bool);
        if(bool === true){
            setPPFChoose(true);
        }
    }
    const [DOOR, setDOOR] = React.useState(false);
    function getDOOR(bool){
        setDOOR(bool);
        if(bool === true){
            setPPFChoose(true);
        }
    }
    const [HOOD, setHOOD] = React.useState(false);
    function getHOOD(bool){
        setHOOD(bool);
        if(bool === true){
            setPPFChoose(true);
        }
    }
/////////////////////////////////////////////////////////////////
    const [BlackboxChoose, setBlackboxChoose] = React.useState(false);
    function getBlackboxChoose(bool){
        setBlackboxChoose(bool);
        if(bool === false){
            setFINETECH(false);
            setINAVI(false);
            setBlackboxANY(false);
            setBlackboxETC('');
        }
    }
    const [BlackboxANY, setBlackboxANY] = React.useState(false);
    function getBlackboxANY(bool){
        setBlackboxANY(bool);
        if(bool === true){
            setBlackboxChoose(true);
            setFINETECH(false);
            setINAVI(false);
            setMANDO(false);
            setBlackboxETC('');
        }
    }
    const [BlackboxETC, setBlackboxETC] = React.useState('');
    function getBlackboxETC(str){
        setBlackboxETC(str);
        if(str !== ''){
            setBlackboxChoose(true);
            setBlackboxANY(false);
        }
    }
    const [FINETECH, setFINETECH] = React.useState(false);
    function getFINETECH(bool){
        setFINETECH(bool);
        if(bool === true){
            setBlackboxChoose(true);
            setBlackboxANY(false);
        }
    }
    const [INAVI, setINAVI] = React.useState(false);
    function getINAVI(bool){
        setINAVI(bool);
        if(bool === true){
            setBlackboxChoose(true);
            setBlackboxANY(false);
        }
    }
    const [MANDO, setMANDO] = React.useState(false);
    function getMANDO(bool){
        setMANDO(bool);
        if(bool === true){
            setBlackboxChoose(true);
            setBlackboxANY(false);
        }
    }
/////////////////////////////////////////////////////////////////
    const [BatteryChoose, setBatteryChoose] = React.useState(false);
    function getBatteryChoose(bool){
        setBatteryChoose(bool);
        if(bool === false){
            setBatteryANY(false);
            setBatteryETC('');
        }
    }
    const [BatteryANY, setBatteryANY] = React.useState(false);
    function getBatteryANY(bool){
        setBatteryANY(bool);
        if(bool === true){
            setBatteryChoose(true);
            setV6(false);
            setV12(false);
            setBatteryETC('');
        }
    }
    const [BatteryETC, setBatteryETC] = React.useState('');
    function getBatteryETC(str){
        setBatteryETC(str);
        if(str !== ''){
            setBatteryChoose(true);
            setBatteryANY(false);
        }
    }
    const [V6, setV6] = React.useState(false);
    function getV6(bool){
        setV6(bool);
        if(bool === true){
            setBatteryChoose(true);
            setBatteryANY(false);
        }
    }
    const [V12, setV12] = React.useState(false);
    function getV12(bool){
        setV12(bool);
        if(bool === true){
            setBatteryChoose(true);
            setBatteryANY(false);
        }
    }
/////////////////////////////////////////////////////////////////
    const [AfterblowChoose, setAfterblowChoose] = React.useState(false);
    function getAfterblowChoose(bool){
        setAfterblowChoose(bool);
        if(bool === false){
            setAfterblowANY(false);
            setAfterblowETC('');
        }
    }
    const [AfterblowANY, setAfterblowANY] = React.useState(false);
    function getAfterblowANY(bool){
        setAfterblowANY(bool);
        if(bool === true){
            setAfterblowChoose(true);
            setAfterblowETC('');
        }
    }
    const [AfterblowETC, setAfterblowETC] = React.useState('');
    function getAfterblowETC(str){
        setAfterblowETC(str);
        if(str !== ''){
            setAfterblowChoose(true);
            setAfterblowANY(false);
        }
    }
/////////////////////////////////////////////////////////////////
    const [SoundproofChoose, setSoundproofChoose] = React.useState(false);
    function getSoundproofChoose(bool){
        setSoundproofChoose(bool);
        if(bool === false){
            setUNDER(false);
            setINSIDEFLOOR(false);
            setFENDER(false);
            setDOORSOUND(false);
            setBONNETSOUND(false);
            setTRUNK(false);
            setSoundproofETC('');
        }
    }
    const [UNDER, setUNDER] = React.useState(false);
    function getUNDER(bool){
        setUNDER(bool);
        if(bool === true){
            setSoundproofChoose(true);
        }
    }
    const [INSIDEFLOOR, setINSIDEFLOOR] = React.useState(false);
    function getINSIDEFLOOR(bool){
        setINSIDEFLOOR(bool);
        if(bool === true){
            setSoundproofChoose(true);
        }
    }
    const [FENDER, setFENDER] = React.useState(false);
    function getFENDER(bool){
        setFENDER(bool);
        if(bool === true){
            setSoundproofChoose(true);
        }
    }
    const [DOORSOUND, setDOORSOUND] = React.useState(false);
    function getDOORSOUND(bool){
        setDOORSOUND(bool);
        if(bool === true){
            setSoundproofChoose(true);
        }
    }
    const [BONNETSOUND, setBONNETSOUND] = React.useState(false);
    function getBONNETSOUND(bool){
        setBONNETSOUND(bool);
        if(bool === true){
            setSoundproofChoose(true);
        }
    }
    const [TRUNK, setTRUNK] = React.useState(false);
    function getTRUNK(bool){
        setTRUNK(bool);
        if(bool === true){
            setSoundproofChoose(true);
        }
    }
    const [SoundproofETC, setSoundproofETC] = React.useState('');
    function getSoundproofETC(bool){
        setSoundproofETC(bool);
        if(bool === true){
            setSoundproofChoose(true);
        }
    }
/////////////////////////////////////////////////////////////////
    const [WrappingChoose, setWrappingChoose] = React.useState(false);
    function getWrappingChoose(bool){
        setWrappingChoose(bool);
        if(bool === false){
            setWrappingETC('');
        }
    }
    const [WrappingETC, setWrappingETC] = React.useState('');
    function getWrappingETC(str){
        setWrappingETC(str);
        if(str !== ''){
            setWrappingChoose(true);
        }
    }
/////////////////////////////////////////////////////////////////
    const [GlassCoatingChoose, setGlassCoatingChoose] = React.useState(false);
/////////////////////////////////////////////////////////////////
    const [UnderCoatingChoose, setUnderCoatingChoose] = React.useState(false);
 /////////////////////////////////////////////////////////////////   
    async function makeTotal(){
        let finalresult = {...InitialOptions};
        
        finalresult.tinting= TintingChoose;
        finalresult.detailTinting.ANY = TintingANY;
        finalresult.detailTinting.ETC = TintingETC;
        finalresult.detailTinting.LUMA = LUMA;
        finalresult.detailTinting.SOLAR = SOLAR;
        finalresult.detailTinting.RAINBOW = RAINBOW;
        finalresult.detailTinting.RAYNO = RAYNO;

        finalresult.ppf = PPFChoose;
        finalresult.detailPpf.BONNET = BONNET;
        finalresult.detailPpf.SIDEMIRROR = SIDEMIRROR;
        finalresult.detailPpf.FRONTBUMPER = FRONTBUMPER ;
        finalresult.detailPpf.FRONTBUMPERSIDE = FRONTBUMPERSIDE ;
        finalresult.detailPpf.BACKBUMPER = BACKBUMPER ;
        finalresult.detailPpf.BACKBUMPERSIDE = BACKBUMPERSIDE ;
        finalresult.detailPpf.HEADLIGHT = HEADLIGHT ;
        finalresult.detailPpf.TAILLAMP = TAILLAMP ;
        finalresult.detailPpf.BCFILTER = BCFILTER ;
        finalresult.detailPpf.DOOR = DOOR ;
        finalresult.detailPpf.HOOD = HOOD ;
        finalresult.detailPpf.ETC= PPFETC;

        finalresult.blackbox = BlackboxChoose;
        finalresult.detailBlackbox.ANY = BlackboxANY;
        finalresult.detailBlackbox.ETC = BlackboxETC;
        finalresult.detailBlackbox.FINETECH = FINETECH;
        finalresult.detailBlackbox.INAVI = INAVI;
        finalresult.detailBlackbox.MANDO = MANDO;

        finalresult.battery = BatteryChoose;
        finalresult.detailBattery.V6 = V6;
        finalresult.detailBattery.V12 = V12;
        finalresult.detailBattery.ANY = BatteryANY;
        finalresult.detailBattery.ETC =BatteryETC;

        finalresult.afterblow = AfterblowChoose;
        finalresult.detailAfterblow.ANY = AfterblowANY;
        finalresult.detailAfterblow.ETC = AfterblowETC;

        finalresult.soundproof = SoundproofChoose;
        finalresult.detailSoundproof.UNDER = UNDER;
        finalresult.detailSoundproof.INSIDEFLOOR = INSIDEFLOOR;
        finalresult.detailSoundproof.FENDER = FENDER;
        finalresult.detailSoundproof.DOORSOUND = DOORSOUND;
        finalresult.detailSoundproof.BONNETSOUND = BONNETSOUND;
        finalresult.detailSoundproof.TRUNK = TRUNK;
        finalresult.detailSoundproof.ETC = SoundproofETC;

        finalresult.wrapping = WrappingChoose;
        finalresult.detailWrapping.DESIGN = WrappingETC;

        finalresult.glasscoating = GlassCoatingChoose;

        finalresult.undercoating = UnderCoatingChoose;

        return finalresult;
    }


    React.useEffect(()=>{
        setIsLoading(true);
        storage.fetch('BidOrder')
        .then(res => {
            console.log(res);
            if(res.options !== null){
                console.log("In page 3 useEffect: ", res.options);
                setTintingChoose(res.options.tinting);
                setTintingANY(res.options.detailTinting.ANY);
                setTintingETC(res.options.detailTinting.ETC);
                setLUMA(res.options.detailTinting.LUMA);
                setSOLAR(res.options.detailTinting.SOLAR);
                setRAINBOW(res.options.detailTinting.RAINBOW);
                setRAYNO(res.options.detailTinting.RAYNO);
                
                setPPFChoose(res.options.ppf);
                setBONNET(res.options.detailPpf.BONNET);
                setSIDEMIRROR(res.options.detailPpf.SIDEMIRROR);
                setFRONTBUMPER(res.options.detailPpf.FRONTBUMPER);
                setFRONTBUMPERSIDE(res.options.detailPpf.FRONTBUMPERSIDE);
                setBACKBUMPER(res.options.detailPpf.BACKBUMPER);
                setBACKBUMPERSIDE(res.options.detailPpf.BACKBUMPERSIDE);
                setHEADLIGHT(res.options.detailPpf.HEADLIGHT);
                setTAILLAMP(res.options.detailPpf.TAILLAMP);
                setBCFILTER(res.options.detailPpf.BCFILTER);
                setDOOR(res.options.detailPpf.DOOR);
                setHOOD(res.options.detailPpf.HOOD);
                setPPFETC(res.options.detailPpf.ETC);

                setBlackboxChoose(res.options.blackbox);
                setBlackboxANY(res.options.detailBlackbox.ANY);
                setBlackboxETC(res.options.detailBlackbox.ETC);
                setFINETECH(res.options.detailBlackbox.FINETECH);
                setINAVI(res.options.detailBlackbox.INAVI);
                setMANDO(res.options.detailBlackbox.MANDO);

                setBatteryChoose(res.options.battery);
                setV6(res.options.detailBattery.V6);
                setV12(res.options.detailBattery.V12);
                setBatteryANY(res.options.detailBattery.ANY);
                setBatteryETC(res.options.detailBattery.ETC);

                setAfterblowChoose(res.options.afterblow);
                setAfterblowANY(res.options.detailAfterblow.ANY);
                setAfterblowETC(res.options.detailAfterblow.ETC);

                setSoundproofChoose(res.options.soundproof);
                setUNDER(res.options.detailSoundproof.UNDER);
                setINSIDEFLOOR(res.options.detailSoundproof.INSIDEFLOOR);
                setFENDER(res.options.detailSoundproof.FENDER);
                setDOORSOUND(res.options.detailSoundproof.DOORSOUND);
                setBONNETSOUND(res.options.detailSoundproof.BONNETSOUND);
                setTRUNK(res.options.detailSoundproof.TRUNK);
                setSoundproofETC(res.options.detailSoundproof.ETC);

                setWrappingChoose(res.options.wrapping);
                setWrappingETC(res.options.detailWrapping.DESIGN);
                setGlassCoatingChoose(res.options.glasscoating);
                setUnderCoatingChoose(res.options.undercoating);
                setIsLoading(false); 
            }
            else{
                console.log('no result');
                setIsLoading(false);
            }
        })
        .catch(error => {
            console.log(error);
            Alert.alert(
                '오류',
                '오류가 발생했습니다.',
                [
                  {text: '확인', onPress: () => {cancelOptions();}},
                ],
                { cancelable: false }
              );
        })
    },[]);

    async function storeCarName() {
        try{
            let finalOptions = await makeTotal()
            if(_.isEqual(finalOptions, compareOptions)){
                Alert.alert(
                    '경고',
                    '시공을 입력해주세요.',
                    [
                      {text: '확인', onPress: () => {}},
                    ],
                    { cancelable: false }
                  );
            }
            else{
                let newOrder = null;
                const response = await storage.fetch('BidOrder');
                if(response !== null){ //정상적인 루트로 왔다면 fetch가 반드시 성공.
                    newOrder = {...response};
                    if(newOrder.processPage <= 2) newOrder.processPage = 2;
                    newOrder.options = finalOptions;
                    await storage.store('BidOrder', newOrder);
                    props.navigation.navigate("PackageScreen_4");
                }
                else{ //async에 저장된 것이 없을 때 === 차량등록을 안하고 왔을 때 === 오류인 상황
                    Alert.alert(
                        '오류',
                        '오류가 발생했습니다.',
                        [
                          {text: '확인', onPress: () => {cancelOptions();}},
                        ],
                        { cancelable: false }
                      );
                }
            }
            //just check
            const check = await storage.fetch('BidOrder');
            //console.log('In page 3 check: ', check);
        }
        catch(error){
            console.log(error);
            cancelOptions();
        }
    }

    function cancelOptions(){
        //나머지 모든 체크도 false 시켜야함
        props.navigation.navigate("MainScreen");
    }
    function askCancelOptions(){
        Alert.alert(
            '입력을 중단하겠습니까?',
            '현재 페이지에서 입력된 내용은 저장되지 않습니다.',
            [
                {text: '취소', onPress: () => {}},
                {text: '확인', onPress: () => {
                    props.navigation.navigate("MainScreen");
                }},
              
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
                    {!isLoading ? 
                    <SwiperFlatList 
                    index={0}
                    ref={swiper}
                    onChangeIndex={(index)=>{setCurrentIndex(index.index); scrollX.current.scrollToLocation({animated: true, itemIndex: 0, sectionIndex: index.index, viewPosition: 0.5})}}>
                        <SelectInSwiper>    
                            <SelectTitleOption getChoose={getTintingChoose} 
                                                choose={TintingChoose} 
                                                name={'틴팅'}/>
                            <SelectDetailOption getChoose={getLUMA} 
                                                choose={LUMA}
                                                name={'루마'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getSOLAR} 
                                                choose={SOLAR}
                                                name={'솔라'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getRAINBOW} 
                                                choose={RAINBOW}
                                                name={'레인보우'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getRAYNO} 
                                                choose={RAYNO}
                                                name={'레이노'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getTintingANY} 
                                                choose={TintingANY}
                                                name={'상관없음'}
                                                touchable={true}/>
                            <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center'}}>
                                <Text style={{fontSize: 18, color: 'black'}}>기타</Text>
                                <TextInput style={{width: '65%', borderWidth: 1, marginLeft: 5, padding: 5, height: '90%', borderRadius: 5}}
                                        value={TintingETC}
                                        maxLength={100}
                                        editable={true}
                                        onChangeText={(value)=>{getTintingETC(value);}}/>
                            </Row>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <SelectTitleOption getChoose={getPPFChoose} 
                                                choose={PPFChoose} 
                                                name={'PPF'}/>
                            <SelectDetailOption getChoose={getBONNET} 
                                                choose={BONNET}
                                                name={'본넷'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getSIDEMIRROR} 
                                                choose={SIDEMIRROR}
                                                name={'사이드미러'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getFRONTBUMPER} 
                                                choose={FRONTBUMPER}
                                                name={'앞 범퍼'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getFRONTBUMPERSIDE} 
                                                choose={FRONTBUMPERSIDE}
                                                name={'앞 범퍼사이드'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getBACKBUMPER} 
                                                choose={BACKBUMPER}
                                                name={'뒷 범퍼'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getBACKBUMPERSIDE} 
                                                choose={BACKBUMPERSIDE}
                                                name={'뒷 범퍼사이드'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getHEADLIGHT} 
                                                choose={HEADLIGHT}
                                                name={'헤드라이트'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getTAILLAMP} 
                                                choose={TAILLAMP}
                                                name={'테일램프'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getBCFILTER} 
                                                choose={BCFILTER}
                                                name={'B/C 필터'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getDOOR} 
                                                choose={DOOR}
                                                name={'도어'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getHOOD} 
                                                choose={HOOD}
                                                name={'후드'}
                                                touchable={true}/>
                            <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center'}}>
                                <Text style={{fontSize: 18, color: 'black'}}>기타</Text>
                                <TextInput style={{width: '65%', borderWidth: 1, marginLeft: 5, padding: 5, height: '90%', borderRadius: 5}}
                                        value={PPFETC}
                                        maxLength={100}
                                        editable={true}
                                        onChangeText={(value)=>{getPPFETC(value);}}/>
                            </Row>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <SelectTitleOption getChoose={getBlackboxChoose} 
                                                choose={BlackboxChoose} 
                                                name={'블랙박스'}/>
                            <SelectDetailOption getChoose={getFINETECH} 
                                                choose={FINETECH}
                                                name={'파인테크'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getINAVI} 
                                                choose={INAVI}
                                                name={'아이나비'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getMANDO} 
                                                choose={MANDO}
                                                name={'만도'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getBlackboxANY} 
                                                choose={BlackboxANY}
                                                name={'상관없음'}
                                                touchable={true}/>
                            <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center'}}>
                                <Text style={{fontSize: 18, color: 'black'}}>기타</Text>
                                <TextInput style={{width: '65%', borderWidth: 1, marginLeft: 5, padding: 5, height: '90%', borderRadius: 5}}
                                        value={BlackboxETC}
                                        maxLength={100}
                                        editable={true}
                                        onChangeText={(value)=>{getBlackboxETC(value);}}/>
                            </Row>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <SelectTitleOption getChoose={getBatteryChoose} 
                                                choose={BatteryChoose} 
                                                name={'보조배터리'}/>
                            <SelectDetailOption getChoose={getV6} 
                                                choose={V6}
                                                name={'V6'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getV12} 
                                                choose={V12}
                                                name={'V12'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getBatteryANY} 
                                                choose={BatteryANY}
                                                name={'상관없음'}
                                                touchable={true}/>
                            <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center'}}>
                                <Text style={{fontSize: 18, color: 'black'}}>기타</Text>
                                <TextInput style={{width: '65%', borderWidth: 1, marginLeft: 5, padding: 5, height: '90%', borderRadius: 5}}
                                        value={BatteryETC}
                                        maxLength={100}
                                        editable={true}
                                        onChangeText={(value)=>{getBatteryETC(value);}}/>
                            </Row>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <SelectTitleOption getChoose={getAfterblowChoose} 
                                                choose={AfterblowChoose} 
                                                name={'애프터블로우'}/>
                            {/* <SelectDetailOption getChoose={getAfterblowANY} 
                                                choose={AfterblowANY}
                                                name={'상관없음'}
                                                touchable={true}/> */}
                            <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center'}}>
                                <Text style={{fontSize: 18, color: 'black'}}>기타</Text>
                                <TextInput style={{width: '65%', borderWidth: 1, marginLeft: 5, padding: 5, height: '90%', borderRadius: 5}}
                                        value={AfterblowETC}
                                        maxLength={100}
                                        editable={true}
                                        onChangeText={(value)=>{getAfterblowETC(value);}}/>
                            </Row>                  
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <SelectTitleOption getChoose={getSoundproofChoose} 
                                                choose={SoundproofChoose} 
                                                name={'방음'}/>
                            <SelectDetailOption getChoose={getUNDER} 
                                                choose={UNDER}
                                                name={'하부 방음'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getINSIDEFLOOR} 
                                                choose={INSIDEFLOOR}
                                                name={'실내 바닥 방음'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getFENDER} 
                                                choose={FENDER}
                                                name={'휀다 방음'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getDOORSOUND} 
                                                choose={DOORSOUND}
                                                name={'도어 방음'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getBONNETSOUND} 
                                                choose={BONNETSOUND}
                                                name={'본넷 방음'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getTRUNK} 
                                                choose={TRUNK}
                                                name={'트렁크 방음'}
                                                touchable={true}/>
                            <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center'}}>
                                <Text style={{fontSize: 18, color: 'black'}}>기타</Text>
                                <TextInput style={{width: '65%', borderWidth: 1, marginLeft: 5, padding: 5, height: '90%', borderRadius: 5}}
                                        value={SoundproofETC}
                                        maxLength={100}
                                        editable={true}
                                        onChangeText={(value)=>{getSoundproofETC(value);}}/>
                            </Row>                   
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <SelectTitleOption getChoose={getWrappingChoose} 
                                                choose={WrappingChoose} 
                                                name={'랩핑'}/>
                            <Row style={{ paddingLeft: 10}}>
                                <Text style={{fontSize: 18, color: 'black'}}>디자인</Text>
                                <View style={{width: '100%', height: '80%'}}>
                                    <TextInput style={{width: '65%', borderWidth: 1, marginLeft: 5, paddingVertical: 15, paddingHorizontal: 5, borderRadius: 5, textAlignVertical:'top'}}
                                            value={WrappingETC}
                                            maxLength={100}
                                            editable={true}
                                            multiline={true}
                                            onChangeText={(value)=>{getWrappingETC(value);}}/>
                                </View>
                            </Row>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <SelectTitleOption getChoose={setGlassCoatingChoose} 
                                                choose={GlassCoatingChoose} 
                                                name={'유리막코팅'}/>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <SelectTitleOption getChoose={setUnderCoatingChoose} 
                                                choose={UnderCoatingChoose} 
                                                name={'하부코팅'}/>
                        </SelectInSwiper>
                    </SwiperFlatList>  : <ActivityIndicator size = 'large' color= {Color.main} style={{marginTop: 10}}/>}
                </AllSelectView>
                <BtnView>
                    <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                        <Button mode={"contained"} onPress={() => {props.navigation.navigate("PackageScreen_2");}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main}>이전</Button>
                        <Button mode={"contained"} onPress={() => {storeCarName();}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main}>선택완료</Button>
                    </Row>
                </BtnView>
            </ContentView>
            <View style={{position: 'absolute', width: '100%', alignItems: 'flex-end', paddingTop: 5, paddingRight: 5}}>
                <TouchableOpacity onPress={()=>{askCancelOptions();}}>
                    <Icon name="close-outline" size={35} color={'black'}></Icon>
                </TouchableOpacity>    
            </View>
        </TotalView>
        </KeyboardAwareScrollView>
    );
}

export default PackageScreen_3;