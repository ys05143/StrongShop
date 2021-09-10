import React from 'react';
import {Text, View, StatusBar} from 'react-native';
import styled from 'styled-components/native';
import Icon  from "react-native-vector-icons/Ionicons";

const Total = styled.View`
    width: 100%;
    height: 300px;
    background-color: white;
    border-radius: 10px;
    padding: 10px;
    align-items: center;
    justify-content: space-between;
`;
const SearchBar = styled.TextInput`
    background-color: #D5D5D5;
    border-radius: 10px;
    color: black;
    width : 100%;
    height: 50px;
    padding: 5px;
`;

const Btn = styled.TouchableOpacity`
    border-radius: 50px;
    background-color: #B2EBF4;
    width: 100px;
    height: 50px;
    align-items : center;
    justify-content: center;
`;
const SearchView = styled.View`
    width: 90%;
    flex-direction: row;
    align-items : center;
    justify-content: flex-end;
`;
const IconView = styled.TouchableOpacity`
    position: absolute;
`;

function SearchModal(props){
    const [text, setText] = React.useState(props.search);
    function sendModal(){
        props.getModal(false);
    }
    function sendText(){
        props.getValue(text);
    }
    return (
        <Total>
            <SearchView>
                <SearchBar placeholder='차종을 검색하세요.'
                            placeholderTextColor="gray"
                            value={text}
                            onChangeText={value=>setText(value)}
                            returnKeyType="done">      
                </SearchBar>
                <IconView>
                    <Icon name="search-outline" size={30} style={{marginRight: 5}} ></Icon>
                </IconView>
            </SearchView>
            <Btn onPress={()=>{sendText();
                                sendModal();}}>
                <Text>완료</Text>
            </Btn>
        </Total>
        
    );
}

export default SearchModal;