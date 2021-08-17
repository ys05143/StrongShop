import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components';
import Row from '../components/Row';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SelectView = styled.TouchableOpacity`
    width: 100%;
    height: 60px;
    border-bottom-width: 1px;
    flex-direction: row;
    padding: 5px;
    align-items: center;
`;
const SelectName = styled.Text`
    margin-left: 5px;
    margin-right: 10px;
    font-size: 20px;
`;
const SelectResult = styled.View`
    height: 30px;
    justify-content: center;
`;

function Select (props){
    const [isChoose, setIsChoose] = React.useState(false);
    const [isExpand, setIsExpand] = React.useState(false);

    function sendExpand(){
        props.getExpand(isExpand);
        
    }
    function sendChoose(){
        props.getChoose(isChoose);
    }

    return(
        <SelectView onPress={()=>{ setIsExpand(!isExpand);
                                sendExpand(isExpand);}}>
            <Row style={{flex: 1, alignItems: 'center'}}>
                <MaterialIcons onPress={()=>{ setIsChoose(!isChoose);
                                            sendChoose(isChoose);}} name={isChoose===false?"check-box-outline-blank": "check-box"} size={35} color= 'gray'></MaterialIcons>
                <SelectName>{props.children}</SelectName>
                <SelectResult>
                    <Text style={{color: 'gray'}}>세부사항</Text>
                </SelectResult>
            </Row>
            <MaterialIcons name={isExpand===false?"expand-more": "expand-less"} size={35} color= 'black'></MaterialIcons>
        </SelectView>
    )
}

export default Select;