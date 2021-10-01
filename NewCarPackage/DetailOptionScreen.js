import React from 'react';
import { Text, ScrollView, View } from 'react-native';
import { Checkbox, Button } from 'react-native-paper';
import styled from 'styled-components/native'
import TotalView from '../components/TotalView';
import _ from 'lodash';
import Icon  from "react-native-vector-icons/Ionicons";
//components
import SelectDetailOption from './SelectDetailOption';
import Row from '../components/Row';
//constants
import Color from '../constants/Color';

const Box = styled.View`
    width: 95%;
    background-color: lightgray;
    padding: 10px;
    margin-top: 10px;
    border-radius: 25px;
`;
const Title = styled.Text`
    font-size: 25px;
    font-weight: bold;
`;
const BtnView = styled.View`
    width: 100%;
    height: 80px;
`;


const InitialResult = {
    Tinting: {
        LUMA: false,
        SOLAR: false,
        RAINBOW: false,
        RAYNO: false,
    },
    Blackbox: {
        FINETECH: false,
        INAVI: false,
    }
};

function DetailOption(props){
    const chosenOption=[];
    const [result, setResult] = React.useState(props.route.params.optionList);
    const [LUMA, setLUMA] = React.useState(false);
    const [SOLAR, setSOLAR] = React.useState(false);
    const [RAINBOW, setRAINBOW] = React.useState(false);
    const [RAYNO, setRAYNO] = React.useState(false);

    const [FINETECH, setFINETECH] = React.useState(false);
    const [INAVI, setINAVI] = React.useState(false);

    function makeResult(){
        const newData = {...InitialResult};
        newData.Tinting.LUMA = LUMA;
        newData.Tinting.SOLAR = SOLAR;
        newData.Tinting.RAINBOW = RAINBOW;
        newData.Tinting.RAYNO = RAYNO;
        newData.Blackbox.FINETECH = FINETECH;
        newData.Blackbox.INAVI = INAVI;
        console.log(newData);
        const newTotalResult = {...result};
        newTotalResult.detailTinting = newData.Tinting;
        newTotalResult.detailBalackbox = newData.Blackbox;
        console.log(newTotalResult);
        setResult(newTotalResult);
    }
    // React.useEffect(()=>{
    //     if(result.tinting) chosenOption.push('틴팅');
    //     if(result.blackbox) chosenOption.push('블랙박스');
    //     if(result.ppf) chosenOption.push('PPF');
    //     if(result.battery) chosenOption.push('보조배터리');
    //     if(result.afterblow) chosenOption.push('애프터블로우');
    //     if(result.soundproof) chosenOption.push('방수');
    //     if(result.wrapping) chosenOption.push('랩핑');
    //     if(result.glasscoating) chosenOption.push('유리막코팅');
    //     if(result.undercoating) chosenOption.push('하부코팅');
    //     console.log(chosenOption);
    // },[])

    return(
        <TotalView>
            <ScrollView contentContainerStyle={{marginTop: 35,alignItems: 'center'}}>
                {result.tinting && <Box>
                    <Title>틴팅</Title>
                    <SelectDetailOption getChoose={setLUMA} 
                                        choose={LUMA}
                                        name={'루마'}/>
                    <SelectDetailOption getChoose={setSOLAR} 
                                        choose={SOLAR}
                                        name={'솔라'}/>
                    <SelectDetailOption getChoose={setRAINBOW} 
                                        choose={RAINBOW}
                                        name={'레인보우'}/>
                    <SelectDetailOption getChoose={setRAYNO} 
                                        choose={RAYNO}
                                        name={'레이노'}/>
                </Box>}
                {result.blackbox && <Box>
                    <Title>블랙박스</Title>
                    <SelectDetailOption getChoose={setFINETECH} 
                                        choose={FINETECH}
                                        name={'파인테크'}/>
                    <SelectDetailOption getChoose={setINAVI} 
                                        choose={INAVI}
                                        name={'아이나비'}/>
                </Box>}
                <BtnView>
                    <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                        <Button mode={"contained"} onPress={() => {props.navigation.goBack();}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>이전</Button>
                        <Button mode={"contained"} onPress={() => {props.navigation.navigate("DetailOptionScreen", {optionList: result});}} contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main}>다음</Button>
                    </Row>
                </BtnView>
            </ScrollView>
            <View style={{position: 'absolute', width: '100%', alignItems: 'flex-end', paddingTop: 5, paddingRight: 5}}>
                <Icon name="close-outline" size={35} color={'black'} onPress={()=>{props.navigation.navigate("PackageScreen_1")}}></Icon>
            </View>
        </TotalView>
    );
}

export default DetailOption;