import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components/native';
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
    const [isChoose, setIsChoose] = React.useState(props.choose);

    function sendChoose(bool){
        props.getChoose(bool);
    }

    return(
        <SelectView onPress={()=>{ sendChoose(!isChoose);
                                setIsChoose(!isChoose);}}>
            <Row style={{flex: 1, alignItems: 'center'}}>
                <MaterialIcons onPress={()=>{ sendChoose(!isChoose);
                                            setIsChoose(!isChoose)}} name={isChoose===false?"check-box-outline-blank": "check-box"} size={35} color= 'gray'></MaterialIcons>
                <SelectName>{props.children}</SelectName>
            </Row>
        </SelectView>
    )
}

export default Select;