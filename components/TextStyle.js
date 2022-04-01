import styled from "styled-components/native";
import Color from "../constants/Color";

const MainText = styled.Text`
    font-family: Jua-Regular;
    font-size: 40px;
    color: ${Color.mainText};
`;
const MenuTitleText = styled.Text`
    font-family: Jua-Regular;
    font-size: 18px;
    color: black;
`;
const MenuContentText = styled.Text`
    font-family: NotoSansKR-Medium;
    font-size: 13px;
    color: black;
`;
const JuaText = styled.Text`
    font-family: Jua-Regular;
`;
const NotoSansText = styled.Text`
    font-family: NotoSansKR-Medium;
`;
export {MainText, MenuTitleText, MenuContentText, JuaText, NotoSansText};