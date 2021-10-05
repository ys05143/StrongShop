import React from 'react';
import { Text, ActivityIndicator, View } from 'react-native';
import styled from 'styled-components/native';
import { Button, Chip } from 'react-native-paper';
import Icon  from "react-native-vector-icons/Ionicons";
//pages
import Select from './Select';
import ExpandSelect from './ExpandSelect';
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
    align-items : center;
    width: 90%;
    background-color: #e5e5e5;
    border-radius: 25px;
`;
const InitialResult = {
    tinting: false,
    detailTinting: null,
    ppf: false,
    detailPpf: null,
    blackbox: false,
    detailBalackbox: null,
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

function Past_PackageScreen_3_2(props) {
    
    const [result, setResult] = React.useState(InitialResult);
    const [start, setStart] = React.useState(false);

    const [TintingChoose, setTintingChoose] = React.useState(false);
    function getTintingChoose(bool){
        setTintingChoose(bool);
        const newData = {...result};
        newData.tinting=bool;
        setResult(newData);
    }

    const [PPFChoose, setPPFChoose] = React.useState(false);
    function getPPFChoose(bool){
        setPPFChoose(bool);
        const newData = {...result};
        newData.ppf=bool;
        setResult(newData);
    }

    const [BlackBoxChoose, setBlackBoxChoose] = React.useState(false);
    function getBlackBoxChoose(bool){
        setBlackBoxChoose(bool);
        const newData = {...result};
        newData.blackbox=bool;
        setResult(newData);
    }

    const [BatteryChoose, setBatteryChoose] = React.useState(false);
    function getBatteryChoose(bool){
        setBatteryChoose(bool);
        const newData = {...result};
        newData.battery=bool;
        setResult(newData);
    }

    const [Afterblow, setAfterblow] = React.useState(false);
    function getAfterblow(bool){
        setAfterblow(bool);
        const newData = {...result};
        newData.afterblow=bool;
        setResult(newData);
    }

    React.useEffect( ()=>{
        // let order;
        // fetch('BidOrder')
        // .then(res => {
        //     order = {...res};
        //     if(res !== null && res.options !== null) {
        //         console.log('In page 3 useEffect: ', res);
        //         setResult(res.options);
        //         setTintingChoose(res.options.tinting);
        //         setPPFChoose(res.options.ppf);
        //         setBlackBoxChoose(res.options.blackbox);
        //         setBatteryChoose(res.options.battery);
        //         setAfterblow(res.options.afterblow);
        //         setStart(true);
        //     }
        //     else{
        //         setStart(true);
        //     }
        // })
        // .catch(e => {
        //     console.log(e);
        // });
        setStart(true);
    },[])

    // async function storeOptions(){
    //     let currentOrder;
    //     await fetch('BidOrder')
    //     .then(res => {
    //         currentOrder = {...res};
    //         if(currentOrder.processPage !== 3) currentOrder.processPage = 2;
    //         currentOrder.options = result;
    //     })
    //     .catch(e => {
    //         console.log(e);
    //     });
    //     await store('BidOrder', currentOrder);
    //     props.navigation.navigate("PackageScreen_4");
    //     //for check
    //     await fetch('BidOrder')
    //     .then(res => {
    //         console.log('In page 3 check: ', res);
    //     })
    //     .catch(e => {
    //         console.log(e);
    //     });
    // }

    return(
        <TotalView color={'white'} notchColor={'white'}>
            <IntroView>
                <Intro>
                    <IntroText>{'원하시는 시공을\n선택해주세요.'}</IntroText>
                </Intro>
            </IntroView>
            <ContentView>
                {start === true ? <AllSelectView>
                    <Select getChoose={getTintingChoose} 
                            choose={TintingChoose} 
                            name={'틴팅'}/>
                    <Select getChoose={getPPFChoose} 
                            choose={PPFChoose} 
                            name={'PPF'}/>
                    <Select getChoose={getBlackBoxChoose} 
                            choose={BlackBoxChoose} 
                            name={'블랙박스'}/>
                    <Select getChoose={getBatteryChoose}
                            choose={BatteryChoose} 
                            name={'보조배터리'}/>
                    <Select getChoose={getAfterblow}  
                            choose={Afterblow} 
                            name={'애프터블로우'}/>
                </AllSelectView> : <ActivityIndicator size = 'large' color= {Color.main} style={{marginTop: 10}}/>}
                <BtnView>
                    <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                        <Button mode={"contained"} onPress={() => {props.navigation.goBack();}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>이전</Button>
                        <Button mode={"contained"} onPress={() => {props.navigation.navigate("PackageScreen_3_2_2", {optionList: result});}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>다음</Button>
                    </Row>
                </BtnView>
            </ContentView>
            <View style={{position: 'absolute', width: '100%', alignItems: 'flex-end', paddingTop: 5, paddingRight: 5}}>
                <Icon name="close-outline" size={35} color={'black'} onPress={()=>{props.navigation.navigate("PackageScreen_1")}}></Icon>
            </View>
        </TotalView>
    );
}

export default Past_PackageScreen_3_2;