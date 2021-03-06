import React from "react";
import styled from "styled-components/native";
import { Text, ActivityIndicator, View, ScrollView, TextInput, Alert, SectionList, TouchableOpacity, Modal, Platform } from 'react-native';
import Icon  from "react-native-vector-icons/Ionicons";
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import _ from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
//component
import Background from "../components/Background";
import { MainText, MenuTitleText, MenuContentText, JuaText, NotoSansText } from "../components/TextStyle";
import Row from '../components/Row';
import TopBox from "../components/TopBox";
//constant
import Color from "../constants/Color";
import AppWindow from '../constants/AppWindow';
import { NewCarPackageList } from '../constants/LIST';
//pages
import NcpOptionDetails from "./NcpOptionDetails";
import NcpOptionTitle from "./NcpOptionTitle";
//function
import storage from '../function/storage';
import BtnView from "../components/BtnView";
import CustButton from "../components/CustButton";

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
    bottomcoating: false,
    detailBottomcoating:{
        UNDER: false,
        POLYMER: false,
    },
    glasscoating: false,
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
    bottomcoating: false,
    detailBottomcoating:{
        UNDER: false,
        POLYMER: false,
    },
    glasscoating: false,
}

const WIDTH = AppWindow.width;

const AllSelectView = styled.View`
    background-color: ${Color.menuBackgrund};
    width: 95%;
    border: 2px solid ${Color.menuBorder};
    border-radius: 5px;
    justify-content: center;
    align-items: center;
`;
const SelectInSwiper = styled.View`
    width: ${(WIDTH*0.95)-4}px;
    padding-bottom: 5px;
    /* border: 1px solid red; */
`;

const OptionName = styled.TouchableOpacity`
    margin-left: 5px;
    margin-right: 5px;
    border-radius: 20px;
    justify-content: center;
    align-items: center;
    padding: 0px 10px;
    height: 40px;
    background-color: white;
    border: 2px;
`;
const SelectName = styled.Text`
    margin-left: 5px;
    margin-right: 5px;
    font-size: 18px;
    font-weight: bold;
`;
const EtcText = styled.TextInput`
    width: 100%;
    border: 2px solid ${Color.menuBorder};
    margin-left: 5px;
    padding: 5px;
    height: 100%;
    border-radius: 5px;
    background-color: white;
    font-weight: bold;
`;

function NcpPage_2(props){

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
            setINSIDEFLOOR(false);
            setFENDER(false);
            setDOORSOUND(false);
            setBONNETSOUND(false);
            setTRUNK(false);
            setSoundproofETC('');
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
    const [BottomCoatingChoose, setBottomCoatingChoose] = React.useState(false);
    function getBottomCoatingChoose(bool){
        setBottomCoatingChoose(bool);
        if(bool === false){
            setUNDER(false);
            setPOLYMER(false);
        }
    }
    const [UNDER, setUNDER] = React.useState(false);
    function getUNDER(bool){
        setUNDER(bool);
        if(bool === true){
            setBottomCoatingChoose(true);
        }
    }
    const [POLYMER, setPOLYMER] = React.useState(false);
    function getPOLYMER(bool){
        setPOLYMER(bool);
        if(bool === true){
            setBottomCoatingChoose(true);
        }
    }
/////////////////////////////////////////////////////////////////
    const [GlassCoatingChoose, setGlassCoatingChoose] = React.useState(false);
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
        finalresult.detailSoundproof.INSIDEFLOOR = INSIDEFLOOR;
        finalresult.detailSoundproof.FENDER = FENDER;
        finalresult.detailSoundproof.DOORSOUND = DOORSOUND;
        finalresult.detailSoundproof.BONNETSOUND = BONNETSOUND;
        finalresult.detailSoundproof.TRUNK = TRUNK;
        finalresult.detailSoundproof.ETC = SoundproofETC;

        finalresult.wrapping = WrappingChoose;
        finalresult.detailWrapping.DESIGN = WrappingETC;

        finalresult.bottomcoating = BottomCoatingChoose;
        finalresult.detailBottomcoating.UNDER = UNDER;
        finalresult.detailBottomcoating.POLYMER = POLYMER;

        finalresult.glasscoating = GlassCoatingChoose;

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
                setINSIDEFLOOR(res.options.detailSoundproof.INSIDEFLOOR);
                setFENDER(res.options.detailSoundproof.FENDER);
                setDOORSOUND(res.options.detailSoundproof.DOORSOUND);
                setBONNETSOUND(res.options.detailSoundproof.BONNETSOUND);
                setTRUNK(res.options.detailSoundproof.TRUNK);
                setSoundproofETC(res.options.detailSoundproof.ETC);

                setWrappingChoose(res.options.wrapping);
                setWrappingETC(res.options.detailWrapping.DESIGN);

                setBottomCoatingChoose(res.options.bottomcoating);
                setUNDER(res.options.detailBottomcoating.UNDER);
                setPOLYMER(res.options.detailBottomcoating.POLYMER);

                setGlassCoatingChoose(res.options.glasscoating);

                setIsLoading(false); 
            }
            else{
                console.log('no options result');
                setIsLoading(false);
            }
        })
        .catch(e => {
            console.log(e);
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

    async function storeCarOptions() {
        try{
            let finalOptions = await makeTotal()
            if(_.isEqual(finalOptions, compareOptions)){
                Alert.alert(
                    '시공을 선택해주세요.',
                    '',
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
                    props.navigation.navigate("NcpPage_3");
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
            // const check = await storage.fetch('BidOrder');
            //console.log('In page 3 check: ', check);
        }
        catch{
            cancelOptions();
        }
    }

    function cancelOptions(){
        //나머지 모든 체크도 false 시켜야함
        props.navigation.navigate("MainPage");
    }
    function askCancelOptions(){
        Alert.alert(
            '입력을 중단하겠습니까?',
            '현재 페이지에 입력된 내용은 저장되지 않습니다.',
            [
                {text: '취소', onPress: () => {}},
                {text: '확인', onPress: () => {
                    props.navigation.navigate("MainPage");
                }},
              
            ],
            { cancelable: true }
        );
    
    }

    const Top = ()=>{
        return(
            <TopBox topbar={<TopBar/>}>
                <MainText>시공을 원하는</MainText>
                <Row>
                    <MainText style={{color: 'white'}}> 항목을</MainText>
                    <MainText> 선택해 주세요.</MainText>
                </Row>
            </TopBox>
        )
    }

    const TopBar = () => {
        return(
            <View style={{width: '100%', height: '100%', paddingRight: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                <TouchableOpacity style={{padding: 5, marginLeft: 15}} onPress={()=>{askCancelOptions();}}>
                    <Icon name="close" size={23} color={Color.mainText}></Icon>
                </TouchableOpacity>
            </View>
        )
    }

    return(
        <Background topbox={<Top/>} androidKeyboardAware={Platform.OS === 'android'}>
            <View style={{width: '100%', alignItems: 'center', flex: 1}}>
                <View style={{width: '100%', paddingVertical: 20}}>
                    <SectionList
                        ref={scrollX}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        sections={NewCarPackageList}
                        keyExtractor={(item, index) => item + index}
                        renderItem={({item, section} ) => {
                            return(
                            <OptionName style={{borderColor: section.id === currentIndex ? 'red' : 'white'}} onPress={()=>{swiper.current.scrollToIndex({"index": section.id, "prevIndex": section.id-1}, true); scrollX.current.scrollToLocation({animated: true, itemIndex: 0, sectionIndex: section.id, viewPosition: 0.5})}}>
                                <NotoSansText style={{color: section.id === currentIndex? 'black' : '#13489D', fontSize: section.id === currentIndex? 18 : 16}}>{'#'+item}</NotoSansText>
                            </OptionName>
                            )
                        }}
                    />
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                    <KeyboardAwareScrollView style={{width: WIDTH}} contentContainerStyle={{alignItems: 'center'}} extraHeight={350} showsVerticalScrollIndicator={false}>
                        <AllSelectView>
                            <SwiperFlatList 
                            index={0}
                            ref={swiper}
                            onChangeIndex={(index)=>{setCurrentIndex(index.index); scrollX.current.scrollToLocation({animated: true, itemIndex: 0, sectionIndex: index.index, viewPosition: 0.5})}}>
                                <SelectInSwiper>    
                                    <NcpOptionTitle getChoose={getTintingChoose} 
                                                        choose={TintingChoose} 
                                                        name={'틴팅'}/>
                                    <NcpOptionDetails getChoose={getLUMA} 
                                                        choose={LUMA}
                                                        name={'루마'}
                                                        touchable={true}/>
                                    <NcpOptionDetails getChoose={getSOLAR} 
                                                        choose={SOLAR}
                                                        name={'솔라'}
                                                        touchable={true}/>
                                    <NcpOptionDetails getChoose={getRAINBOW} 
                                                        choose={RAINBOW}
                                                        name={'레인보우'}
                                                        touchable={true}/>
                                    <NcpOptionDetails getChoose={getRAYNO} 
                                                        choose={RAYNO}
                                                        name={'레이노'}
                                                        touchable={true}/>
                                    <NcpOptionDetails getChoose={getTintingANY} 
                                                        choose={TintingANY}
                                                        name={'상관없음'}
                                                        touchable={true}/>
                                    <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center', marginTop: 10}}>
                                        <Icon name={(TintingETC === null || TintingETC === '') ?"radio-button-off-outline": "radio-button-on-outline"} size={18} color= 'gray'></Icon>
                                        <SelectName>기타</SelectName>
                                    </Row>
                                    <View style={{ marginHorizontal: 25, height: 35, justifyContent: 'center'}}>
                                        <EtcText
                                                value={TintingETC}
                                                maxLength={100}
                                                editable={true}
                                                onChangeText={(value)=>{getTintingETC(value);}}/>
                                    </View>
                                </SelectInSwiper>

                                <SelectInSwiper>
                                    <NcpOptionTitle getChoose={getPPFChoose} 
                                                        choose={PPFChoose} 
                                                    name={'PPF'}/>
                                    <NcpOptionDetails getChoose={getBONNET} 
                                                        choose={BONNET}
                                                        name={'본넷'}
                                                        touchable={true}/>
                                    <NcpOptionDetails getChoose={getSIDEMIRROR} 
                                                        choose={SIDEMIRROR}
                                                        name={'사이드미러'}
                                                        touchable={true}/>
                                    <NcpOptionDetails getChoose={getFRONTBUMPER} 
                                                        choose={FRONTBUMPER}
                                                        name={'앞 범퍼'}
                                                        touchable={true}/>
                                    <NcpOptionDetails getChoose={getFRONTBUMPERSIDE} 
                                                        choose={FRONTBUMPERSIDE}
                                                        name={'앞 범퍼사이드'}
                                                        touchable={true}/>
                                    <NcpOptionDetails getChoose={getBACKBUMPER} 
                                                        choose={BACKBUMPER}
                                                        name={'뒷 범퍼'}
                                                        touchable={true}/>
                                    <NcpOptionDetails getChoose={getBACKBUMPERSIDE} 
                                                        choose={BACKBUMPERSIDE}
                                                        name={'뒷 범퍼사이드'}
                                                        touchable={true}/>
                                    <NcpOptionDetails getChoose={getHEADLIGHT} 
                                                        choose={HEADLIGHT}
                                                        name={'헤드라이트'}
                                                        touchable={true}/>
                                    <NcpOptionDetails getChoose={getTAILLAMP} 
                                                        choose={TAILLAMP}
                                                        name={'테일램프'}
                                                        touchable={true}/>
                                    <NcpOptionDetails getChoose={getBCFILTER} 
                                                        choose={BCFILTER}
                                                        name={'B/C 필터'}
                                                        touchable={true}/>
                                    <NcpOptionDetails getChoose={getDOOR} 
                                                        choose={DOOR}
                                                        name={'도어'}
                                                        touchable={true}/>
                                    <NcpOptionDetails getChoose={getHOOD} 
                                                        choose={HOOD}
                                                        name={'후드'}
                                                        touchable={true}/>
                                    <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center', marginTop: 10}}>
                                        <Icon name={(PPFETC === null || PPFETC === '') ?"radio-button-off-outline": "radio-button-on-outline"} size={18} color= 'gray'></Icon>
                                        <SelectName>기타</SelectName>
                                    </Row>
                                    <View style={{ marginHorizontal: 25, height: 35, justifyContent: 'center'}}>
                                        <EtcText
                                                value={PPFETC}
                                                maxLength={100}
                                                editable={true}
                                                onChangeText={(value)=>{getPPFETC(value);}}/>
                                    </View>
                                </SelectInSwiper>

                                <SelectInSwiper>
                                    <NcpOptionTitle getChoose={getBlackboxChoose} 
                                                    choose={BlackboxChoose} 
                                                    name={'블랙박스'}/>
                                    <NcpOptionDetails getChoose={getFINETECH} 
                                                        choose={FINETECH}
                                                        name={'파인테크'}
                                                        touchable={true}/>
                                    <NcpOptionDetails getChoose={getINAVI} 
                                                        choose={INAVI}
                                                        name={'아이나비'}
                                                        touchable={true}/>
                                    <NcpOptionDetails getChoose={getMANDO} 
                                                        choose={MANDO}
                                                        name={'만도'}
                                                        touchable={true}/>
                                    <NcpOptionDetails getChoose={getBlackboxANY} 
                                                        choose={BlackboxANY}
                                                        name={'상관없음'}
                                                        touchable={true}/>
                                    <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center', marginTop: 10}}>
                                        <Icon name={(BlackboxETC === null || BlackboxETC === '') ?"radio-button-off-outline": "radio-button-on-outline"} size={18} color= 'gray'></Icon>
                                        <SelectName>기타</SelectName>
                                    </Row>
                                    <View style={{ marginHorizontal: 25, height: 35, justifyContent: 'center'}}>
                                        <EtcText
                                                value={BlackboxETC}
                                                maxLength={100}
                                                editable={true}
                                                onChangeText={(value)=>{getBlackboxETC(value);}}/>
                                    </View>
                                </SelectInSwiper>

                                <SelectInSwiper>
                                    <NcpOptionTitle getChoose={getBatteryChoose} 
                                                    choose={BatteryChoose} 
                                                    name={'보조배터리'}/>                  
                                    <NcpOptionDetails getChoose={getV6} 
                                                        choose={V6}
                                                        name={'V6'}
                                                        touchable={true}/>
                                    <NcpOptionDetails getChoose={getV12} 
                                                        choose={V12}
                                                        name={'V12'}
                                                        touchable={true}/>
                                    <NcpOptionDetails getChoose={getBatteryANY} 
                                                        choose={BatteryANY}
                                                        name={'상관없음'}
                                                        touchable={true}/>
                                    <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center', marginTop: 10}}>
                                        <Icon name={(BatteryETC === null || BatteryETC === '') ?"radio-button-off-outline": "radio-button-on-outline"} size={18} color= 'gray'></Icon>
                                        <SelectName>기타</SelectName>
                                    </Row>
                                    <View style={{ marginHorizontal: 25, height: 35, justifyContent: 'center'}}>
                                        <EtcText
                                                value={BatteryETC}
                                                maxLength={100}
                                                editable={true}
                                                onChangeText={(value)=>{getBatteryETC(value);}}/>
                                    </View>                 
                                </SelectInSwiper>

                                <SelectInSwiper>
                                    <NcpOptionTitle getChoose={getAfterblowChoose} 
                                                        choose={AfterblowChoose} 
                                                        name={'애프터블로우'}/>
                                    <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center', marginTop: 10}}>
                                        <Icon name={(AfterblowETC === null || AfterblowETC === '') ?"radio-button-off-outline": "radio-button-on-outline"} size={18} color= 'gray'></Icon>
                                        <SelectName>기타</SelectName>
                                    </Row>
                                    <View style={{ marginHorizontal: 25, height: 35, justifyContent: 'center'}}>
                                        <EtcText
                                                value={AfterblowETC}
                                                maxLength={100}
                                                editable={true}
                                                onChangeText={(value)=>{getAfterblowETC(value);}}/>
                                    </View>               
                                </SelectInSwiper>

                                <SelectInSwiper>
                                    <NcpOptionTitle getChoose={getSoundproofChoose} 
                                                        choose={SoundproofChoose} 
                                                        name={'방음'}/>                   
                                    <NcpOptionDetails getChoose={getINSIDEFLOOR} 
                                                        choose={INSIDEFLOOR}
                                                        name={'실내 바닥 방음'}
                                                        touchable={true}/>
                                    <NcpOptionDetails getChoose={getFENDER} 
                                                        choose={FENDER}
                                                        name={'휀다 방음'}
                                                        touchable={true}/>
                                    <NcpOptionDetails getChoose={getDOORSOUND} 
                                                        choose={DOORSOUND}
                                                        name={'도어 방음'}
                                                        touchable={true}/>
                                    <NcpOptionDetails getChoose={getBONNETSOUND} 
                                                        choose={BONNETSOUND}
                                                        name={'본넷 방음'}
                                                        touchable={true}/>
                                    <NcpOptionDetails getChoose={getTRUNK} 
                                                        choose={TRUNK}
                                                        name={'트렁크 방음'}
                                                        touchable={true}/>
                                    <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center', marginTop: 10}}>
                                        <Icon name={(SoundproofETC === null || SoundproofETC === '') ?"radio-button-off-outline": "radio-button-on-outline"} size={18} color= 'gray'></Icon>
                                        <SelectName>기타</SelectName>
                                    </Row>
                                    <View style={{ marginHorizontal: 25, height: 35, justifyContent: 'center'}}>
                                        <EtcText
                                                value={SoundproofETC}
                                                maxLength={100}
                                                editable={true}
                                                onChangeText={(value)=>{getSoundproofETC(value);}}/>
                                    </View>                  
                                </SelectInSwiper>

                                <SelectInSwiper>
                                    <NcpOptionTitle getChoose={getWrappingChoose} 
                                                        choose={WrappingChoose} 
                                                        name={'랩핑'}/>                  
                                    <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center', marginTop: 10}}>
                                        <Icon name={(WrappingETC === null || WrappingETC === '') ?"radio-button-off-outline": "radio-button-on-outline"} size={18} color= 'gray'></Icon>
                                        <SelectName>기타</SelectName>
                                    </Row>
                                    <View style={{ marginHorizontal: 25, height: 35, justifyContent: 'center'}}>
                                        <EtcText
                                                value={WrappingETC}
                                                maxLength={100}
                                                editable={true}
                                                onChangeText={(value)=>{getWrappingETC(value);}}/>
                                    </View>
                                </SelectInSwiper>

                                <SelectInSwiper>
                                    <NcpOptionTitle getChoose={getBottomCoatingChoose} 
                                                        choose={BottomCoatingChoose} 
                                                        name={'하부코팅'}/>                  
                                    <NcpOptionDetails getChoose={getUNDER} 
                                                        choose={UNDER}
                                                        name={'언더코팅'}
                                                        touchable={true}/>
                                    <NcpOptionDetails getChoose={getPOLYMER} 
                                                        choose={POLYMER}
                                                        name={'폴리머코팅'}
                                                        touchable={true}/>
                                </SelectInSwiper>

                                <SelectInSwiper>
                                    <NcpOptionTitle getChoose={setGlassCoatingChoose} 
                                                        choose={GlassCoatingChoose} 
                                                        name={'유리막코팅'}/>         
                                </SelectInSwiper>

                            </SwiperFlatList>
                        </AllSelectView>
                    </KeyboardAwareScrollView>
                </View>
                
            </View>
            <BtnView>
                <CustButton onPress={()=>{props.navigation.navigate("NcpPage_1");}}>이전</CustButton>
                <CustButton onPress={()=>{storeCarOptions();}}>선택</CustButton>
            </BtnView>
        </Background>
    )

}

export default NcpPage_2;