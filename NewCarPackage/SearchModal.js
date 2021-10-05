import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Button, Searchbar } from 'react-native-paper';
import styled from 'styled-components/native';
import _ from 'lodash';
//constant
import Color from '../constants/Color';

const Total = styled.View`
    width: 100%;
    height: 300px;
    background-color: white;
    border-radius: 10px;
    padding: 10px;
    align-items: center;
    justify-content: space-between;
`;
const SearchView = styled.View`
    width: 100%;
    height: 220px;
`;
const Candidate = styled.TouchableOpacity`
    width: 100%;
    height: 45px;
    justify-content: center;
    padding: 5px 0px;
    border-bottom-width: 1px;
    border-color: lightgray;
`;
const DATA = ['AVANTE', 'AVANTE N', 'AVANTE HYBRID']

function SearchModal(props){
    const [text, setText] = React.useState(props.search);

    function sendModal(){
        props.getModal(false);
    }
    function sendText(){
        props.getData(text === '' ? null : text);
    }
    return (
        <Total>
            <SearchView>
                <Searchbar
                    style={{height: 45, borderWidth: 1, borderColor: 'gray', justifyContent: 'center'}}
                    inputStyle={{fontSize: 15, justifyContent: 'center'}}
                    placeholder='차종을 검색하세요.'
                    value={text}
                    onChangeText={value=>setText(value)}
                    onIconPress={()=>{alert(text)}}/>
                <ScrollView style={{paddingHorizontal: 10}}>
                   {_.map(DATA, (item)=>{
                    return (
                        <Candidate key={item} onPress={()=>{setText(item)}}>
                            <Text style={{fontSize: 18}}>{item}</Text>
                        </Candidate>)})}
                </ScrollView>
            </SearchView>
            <Button mode="contained"  contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main} onPress={()=>{sendText();
                                                                                                                                                                        sendModal();}}>
                <Text>완료</Text>
            </Button>
        </Total>
    );
}

export default SearchModal;