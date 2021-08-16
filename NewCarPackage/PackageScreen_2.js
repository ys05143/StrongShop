import React from 'react';
import styled from 'styled-components';
import { Text, Image, StyleSheet, Modal, View } from 'react-native';
import Icon  from "react-native-vector-icons/Ionicons";
import TotalView from '../components/TotalView';
import Row from '../components/Row';
import SearchModal from './SearchModal';

const IntroView = styled.View`
    flex: 3;
    border: 1px solid #ff0000;
    justify-content: center;
    align-items: center;
    padding: 5px;
`;
const ContentView = styled.View`
    flex: 7;
    border: 1px solid #00ff00;
    align-items : center;
    justify-content: space-between;
`;
const Intro = styled.View``;
const SearchBar = styled.TouchableOpacity`
    background-color: #D5D5D5;
    width: 90%;
    height: 50px;
    border-radius: 10px;
    align-items : flex-end;
    justify-content: center;
`;
const ResulView = styled.View`
    width: 100%;
    flex: 1;
    align-items : center;
    justify-content: center;
    padding: 10px;
`;
const Result = styled.View`
    flex: 1;
    align-items : center;
    justify-content: space-around;
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
const ModalView=styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0,0.5);
`;

function PackageScreen_2 (props) {
    const [result, setResult] = React.useState(true);
    const [searchModal, setSearchModal] = React.useState(false);

    function getSearchModal(close){
        setSearchModal(close);
    }

    return(
        <>
            <TotalView>
                <IntroView>
                    <Intro>
                        <Text style={{fontSize: 35}}>시공을 원하시는</Text>
                        <Text style={{fontSize: 35, marginTop: 10}}>차량을 입력해주세요.</Text>
                    </Intro>
                </IntroView>
                <ContentView>
                    <SearchBar onPress={()=>{setSearchModal(true)}}>
                        <Icon name="search-outline" size={30} style={{marginRight: 10}} ></Icon>
                    </SearchBar>
                    <ResulView>
                        {result && <Result>
                            <Text style={{fontSize: 50, fontWeight: 'bold'}}>AVANTE</Text>
                            <Image source={require('../resource/Avante.png')} resizeMode='cover'/>
                        </Result>}
                    </ResulView>
                    <BtnView>
                        <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                            <Btn>
                                <Text>취소</Text>
                            </Btn>
                            <Btn>
                                <Text>다음</Text>
                            </Btn>
                        </Row>
                    </BtnView>
                </ContentView>
            </TotalView>
            <Modal
                    animationType="slide"
                    transparent={true}
                    visible={searchModal}
                    onRequestClose={() => {
                    setSearchModal(!searchModal);
                    }}
                >
                    <ModalView>
                        <View style={{width: '90%'}}>
                            <SearchModal getModal={getSearchModal}/>
                        </View>
                    </ModalView>
            </Modal>
                </>
    );
}

export default PackageScreen_2;

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        
        elevation: 3,
    }
})