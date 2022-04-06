import styled from "styled-components/native"
import AppWindow from "../constants/AppWindow";

const HOMEINDICATOR = AppWindow.HomeIndicator;

const BtnView = styled.View`
    width: 100%;
    height: 70px;
    align-items: center;
    justify-content: space-around;
    flex-direction: row;
    margin-bottom: ${HOMEINDICATOR}px;
    margin-top: 10px;
`;
export default BtnView;