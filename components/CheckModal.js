import React from "react";
import styled from "styled-components/native";
import { View } from "react-native";
import { Button } from "react-native-paper";
//component
import ModalView from "./ModalView";
import Row from "./Row";
import { JuaText, NotoSansText } from "./TextStyle";
import CustButton from './CustButton';
//constant
import Color from "../constants/Color";

const Box = styled.View`
    width: 95%;
    height: 300px;
    background-color: ${Color.menuBackgrund};
    border-radius: 5px;
`;
const TitleView = styled.View`
    width: 100%;
    height: 50px;
    border-bottom-color: ${Color.menuTitleBorder};
    border-bottom-width: 1px;
    align-items: center;
    justify-content: center;
`;
const ContentView = styled.View`
    width: 100%;
    height: 250px;
    align-items: center;
`;
const TextContentView = styled.View`
    width: 100%;
    height: 180px;
    align-items: center;
    justify-content: center;
`;
const BtnView = styled.View`
    width: 100%;
    height: 70px;
    align-items: center;
    justify-content: space-around;
    flex-direction: row;
`;

function CheckModal(props){
    return(
       <ModalView>
           <Box>
               <TitleView>
                   {/* <JuaText style={{fontSize: 32}}>확인</JuaText> */}
                   {props.TitleView}
               </TitleView>
               <ContentView>
                   <TextContentView>
                        {/* <NotoSansText style={{fontSize: 20}}>{'이전에 중단된 요청서가 있습니다.'}</NotoSansText>
                        <NotoSansText style={{fontSize: 20}}>{'이어서 하시겠습니까?'}</NotoSansText> */}
                        {props.TextContentView}
                   </TextContentView>
                   
                   <BtnView>
                       {/* <CustButton>취소</CustButton>
                       <CustButton>확인</CustButton> */}
                       {props.BtnView}
                   </BtnView>
               </ContentView>
           </Box>
       </ModalView>
    )
}

export default CheckModal;