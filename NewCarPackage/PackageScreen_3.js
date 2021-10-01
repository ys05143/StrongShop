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
    border-bottom-width: 1px;
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
    width: 100%;
`;
const InitialResult = {
    tinting: false,
    detailTinting: null,
    ppf: false,
    detailPpf: null,
    blackbox: false,
    glasscoating: false,
    undercoating: false,
    underdeafening: false,
}

function PackageScreen_3(props) {
    
    const [result, setResult] = React.useState(InitialResult);
    const [start, setStart] = React.useState(false);

    const [TintingChoose, setTintingChoose] = React.useState(false);
    const [TintingExpand, setTintingExpand] = React.useState(false);
    function getTintingChoose(bool){
        setTintingChoose(bool);
        const newData = {...result};
        newData.tinting=bool;
        setResult(newData);
    }
    function getTintingExpand(bool){
        setTintingExpand(bool);
    }

    const [PPFChoose, setPPFChoose] = React.useState(false);
    const [PPFExpand, setPPFExpand] = React.useState(false);
    function getPPFChoose(bool){
        setPPFChoose(bool);
        const newData = {...result};
        newData.ppf=bool;
        setResult(newData);
    }
    function getPPFExpand(bool){
        setPPFExpand(bool);
    }

    const [BlackBoxChoose, setBlackBoxChoose] = React.useState(false);
    function getBlackBoxChoose(bool){
        setBlackBoxChoose(bool);
        const newData = {...result};
        newData.blackbox=bool;
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

    const [UnderDeafeningChoose, setUnderDeafeningChoose] = React.useState(false);
    function getUnderDeafeningChoose(bool){
        setUnderDeafeningChoose(bool);
        const newData = {...result};
        newData.underdeafening=bool;
        setResult(newData);
    }

    React.useEffect( ()=>{
        let order;
        fetch('BidOrder')
        .then(res => {
            order = {...res};
            if(res !== null && res.options !== null) {
                console.log('In page 3 useEffect: ', res);
                setResult(res.options);
                setTintingChoose(res.options.tinting);
                setPPFChoose(res.options.ppf);
                setBlackBoxChoose(res.options.blackbox);
                setGlassCoatingChoose(res.options.glasscoating);
                setUnderCoatingChoose(res.options.undercoating);
                setUnderDeafeningChoose(res.options.underdeafening);
                setStart(true);
            }
            else{
                setStart(true);
            }
        })
        .catch(e => {
            console.log(e);
        });
    },[])

    async function storeOptions(){
        let currentOrder;
        await fetch('BidOrder')
        .then(res => {
            currentOrder = {...res};
            if(currentOrder.processPage !== 3) currentOrder.processPage = 2;
            currentOrder.options = result;
        })
        .catch(e => {
            console.log(e);
        });
        await store('BidOrder', currentOrder);
        props.navigation.navigate("PackageScreen_4");
        //for check
        await fetch('BidOrder')
        .then(res => {
            console.log('In page 3 check: ', res);
        })
        .catch(e => {
            console.log(e);
        });
    }

    
    function cancelOptions(){
        //지금 까지의 입력 싹 다 취소
        // props.navigation.goBack();
        props.navigation.navigate("PackageScreen_2");
    }

    return(
        <TotalView color={'white'} notchColor={'white'}>
            <IntroView>
                <Intro>
                    <IntroText>{'원하시는 시공을\n선택해주세요.'}</IntroText>
                </Intro>
            </IntroView>
            <ContentView>
                {start === true ? <AllSelectView>
                    <ExpandSelect getChoose={getTintingChoose} 
                            getExpand={getTintingExpand} 
                            choose={TintingChoose} 
                            expand={TintingExpand}
                            name={'틴팅'}/>
                    <ExpandSelect getChoose={getPPFChoose} 
                            getExpand={getPPFExpand} 
                            choose={PPFChoose} 
                            expand={PPFExpand}
                            name={'PPF'}/>
                    <Select getChoose={getBlackBoxChoose} 
                            choose={BlackBoxChoose} 
                            name={'블랙박스'}/>
                    <Select getChoose={getGlassCoatingChoose}
                            choose={GlassCoatingChoose} 
                            name={'유리막코팅'}/>
                    <Select getChoose={getUnderCoatingChoose}  
                            choose={UnderCoatingChoose} 
                            name={'언더코팅'}/>
                    <Select getChoose={getUnderDeafeningChoose} 
                            choose={UnderDeafeningChoose} 
                            name={'하체방음'}/>
                </AllSelectView> : <ActivityIndicator size = 'large' color= {Color.main} style={{marginTop: 10}}/>}
                <BtnView>
                    <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                        <Button mode={"contained"} onPress={() => {cancelOptions()}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>이전</Button>
                        <Button mode={"contained"} onPress={() => {storeOptions();}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>다음</Button>
                    </Row>
                </BtnView>
            </ContentView>
            <View style={{position: 'absolute', width: '100%', alignItems: 'flex-end', paddingTop: 5, paddingRight: 5}}>
                <Icon name="close-outline" size={35} color={'black'} onPress={()=>{props.navigation.navigate("PackageScreen_1")}}></Icon>
            </View>
        </TotalView>
    );
}

export default PackageScreen_3;