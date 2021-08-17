import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components';
import TotalView from '../components/TotalView';
import AppWindow from '../constants/AppWindow';
import Row from '../components/Row';
import Select from './Select';

const WIDTH = AppWindow.width;

///////////////////////////////
const IntroView = styled.View`
    flex: 2;
    border: 1px solid #ff0000;
    justify-content: center;
    align-items: center;
    padding: 5px;
`;
const Intro = styled.View`
    width: 80%;
`;
const ContentView = styled.View`
    flex: 5;
    border: 1px solid #00ff00;
    align-items : center;
    justify-content: space-between;
`;
const IntroText = styled.Text`
    font-size: ${WIDTH*0.09}px;
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
const SelectView = styled.View`
    align-items : center;
    width: 100%;
`;

function PackageScreen_3(props) {
    const [TintingChoose, setTintingChoose] = React.useState(false);
    const [TintingExpand, setTintingExpand] = React.useState(false);
    function getTintingChoose(bool){
        setTintingChoose(bool);
    }
    function getTintingExpand(bool){
        setTintingExpand(bool);
    }

    const [BlackBoxChoose, setBlackBoxChoose] = React.useState(false);
    const [BlackBoxExpand, setBlackBoxExpand] = React.useState(false);
    function getBlackBoxChoose(bool){
        setBlackBoxChoose(bool);
    }
    function getBlackBoxExpand(bool){
        setBlackBoxExpand(bool);
    }

    const [GlassCoatingChoose, setGlassCoatingChoose] = React.useState(false);
    const [GlassCoatingExpand, setGlassCoatingExpand] = React.useState(false);
    function getGlassCoatingChoose(bool){
        setGlassCoatingChoose(bool);
    }
    function getGlassCoatingExpand(bool){
        setGlassCoatingExpand(bool);
    }

    const [UnderCoatingChoose, setUnderCoatingChoose] = React.useState(false);
    const [UnderCoatingExpand, setUnderCoatingExpand] = React.useState(false);
    function getUnderCoatingChoose(bool){
        setUnderCoatingChoose(bool);
    }
    function getUnderCoatingExpand(bool){
        setUnderCoatingExpand(bool);
    }

    const [PDFChoose, setPDFChoose] = React.useState(false);
    const [PDFExpand, setPDFExpand] = React.useState(false);
    function getPDFChoose(bool){
        setPDFChoose(bool);
    }
    function getPDFExpand(bool){
        setPDFExpand(bool);
    }

    const [UnderDeafeningChoose, setUnderDeafeningChoose] = React.useState(false);
    const [UnderDeafeningExpand, setUnderDeafeningExpand] = React.useState(false);
    function getUnderDeafeningChoose(bool){
        setUnderDeafeningChoose(bool);
    }
    function getUnderDeafeningExpand(bool){
        setUnderDeafeningExpand(bool);
    }

    return(
        <TotalView>
            <IntroView>
                <Intro>
                    <IntroText>원하시는 시공을</IntroText>
                    <IntroText style={{marginTop: 10}}>선택해주세요.</IntroText>
                </Intro>
            </IntroView>
            <ContentView>
                <SelectView>
                    <Select getChoose={getTintingChoose} 
                            getExpand={getTintingExpand} 
                            choose={TintingChoose} 
                            expand={TintingExpand}>{'틴팅'}</Select>
                    <Select getChoose={getBlackBoxChoose} 
                            getExpand={getBlackBoxExpand} 
                            choose={BlackBoxChoose} 
                            expand={BlackBoxExpand}>{'블랙박스'}</Select>
                    <Select getChoose={getGlassCoatingChoose} 
                            getExpand={getGlassCoatingExpand} 
                            choose={GlassCoatingChoose} 
                            expand={GlassCoatingExpand}>{'유리막코팅'}</Select>
                    <Select getChoose={getUnderCoatingChoose} 
                            getExpand={getUnderCoatingExpand} 
                            choose={UnderCoatingChoose} 
                            expand={UnderCoatingExpand}>{'언더코팅'}</Select>
                    <Select getChoose={getPDFChoose} 
                            getExpand={getPDFExpand} 
                            choose={PDFChoose} 
                            expand={PDFExpand}>{'PDF'}</Select>
                    <Select getChoose={getUnderDeafeningChoose} 
                            getExpand={getUnderDeafeningExpand} 
                            choose={UnderDeafeningChoose} 
                            expand={UnderDeafeningExpand}>{'하체방음'}</Select>
                </SelectView>
                <BtnView>
                    <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                        <Btn>
                            <Text>이전</Text>
                        </Btn>
                        <Btn>
                            <Text>다음</Text>
                        </Btn>
                    </Row>
                </BtnView>
            </ContentView>
        </TotalView>
    );
}

export default PackageScreen_3;