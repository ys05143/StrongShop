import React from "react";
import styled from "styled-components/native";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, FlatList } from 'react-native'
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import SearchBar from "react-native-dynamic-search-bar";
//component
import Background from "../components/Background";
import { MainText, MenuTitleText, MenuContentText, JuaText, NotoSansText } from "../components/TextStyle";
import TopBox from "../components/TopBox";
import Row from "../components/Row";
//constant
import Color from "../constants/Color";
import { CarNames } from "../constants/LIST";
//function
import storage from "../function/storage";


function CarePage_1(props){
    const [isLoading, setIsLoading] = React.useState(false);
    const [carName, setCarName] = React.useState(null);
    const [searchSpinner, setSearchSpinner] = React.useState(false);
    const [filter, setFilter] = React.useState({
        query: "",
        isLoading: true,
        refreshing: false,
        dataBackup: CarNames,
        dataSource: null,
        spinnerVisibility: false,
    });

    const isFoucused = useIsFocused();
    React.useEffect(() => {
        if(isFoucused){
            setIsLoading(true);
            storage.fetch('CareOrder')
            .then(response => {
                if(response != null){
                    if(response.carName !== null){
                        console.log('케어페이지 1 useEffect: ', response);  
                        setCarName(response.carName);
                    }
                    else{
                        console.log('CareOrder캐시 없음.');
                        AsyncStorage.removeItem('CareOrder')
                        .then(() => {
                            console.log('CareOrder 캐시 제거');
                        })
                        .catch(error => {
                            console.log(error);
                        });
                    }
                    setIsLoading(false);
                }
                else{
                    setIsLoading(false);
                }
            })
            .catch(e =>{
                console.log("캐시 에러");
            })
        }
    }, [isFoucused]);

    function askCancelCare(){
        Alert.alert(
            '입력을 중단하겠습니까?',
            '지금까지 입력된 내용은 저장되지 않습니다.',
            [
                {text: '취소', onPress: () => {}},
                {text: '확인', onPress: () => {
                    props.navigation.popToTop();
                }},
            ],
            { cancelable: true }
        );
    }

    async function storeCarName(carName){
        try{
            if(carName !== null && carName !== ""){
                let newOrder = {
                    processPage: null,
                    carName: null,
                    options: null,
                    require: null,
                    region: null,
                };
                const response = await storage.fetch('CareOrder');
                if(response !== null){
                    newOrder = {...response};
                    if(newOrder.processPage <= 1) newOrder.processPage = 1;
                }
                else{
                    newOrder.processPage = 1;
                }
                newOrder.carName = carName;
                await storage.store('CareOrder', newOrder);
                props.navigation.navigate("CarePage_2");
            }
            else {
                Alert.alert(
                    '차량을 입력해주세요.',
                    '',
                    [
                        {text: '확인', onPress: () => {}},
                    ],
                    { cancelable: false }
                    );
            }
        }
        catch(error){
            console.log(error);
            cancelCarName();
        }
    }

    function cancelCarName(){
        //지금 까지의 입력 싹 다 취소
        setCarName(null);
        AsyncStorage.removeItem('CareOrder')
                    .then(() => {
                        console.log('CareOrder 캐시 삭제');
                        props.navigation.navigate("MainPage");
                    })
                    .catch(error => {
                        console.log(error);
                    })
        props.navigation.navigate("MainPage");
    }

    const searchItem = (item) =>{
        return(
            <TouchableOpacity style={{width: '100%', height: 45, paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row'}} onPress={()=>{setCarName(item.item.kor_name); storeCarName(item.item.kor_name)}}>
                <View style={{width: 30, height: 30, backgroundColor: 'lightgray', borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginRight: 20}}>
                    <Icon name={'search-outline'} size={18} color={'gray'}/>
                </View>
                <NotoSansText style={{fontSize: 15}}>{item.item.kor_name}</NotoSansText>
            </TouchableOpacity>
        )
    }
    const filterList = (text) => {
        if(text === null || text === ''){
            setFilter({
                ...filter,
                query: text,
                dataSource: null,
            });
        }
        else{
            let newData = filter.dataBackup;
            newData = filter.dataBackup.filter((item) => {
                const itemData = item.kor_name.toLowerCase();
                const textData = text.toLowerCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilter({
                ...filter,
                query: text,
                dataSource: newData,
            });
        }
    };

    const SearchProcess = (text) => {
        setCarName(text);
        setSearchSpinner(true);
        filterList(text);
    }
    const Top = ()=>{
        return(
            <TopBox topbar={<TopBar/>}>
                <MainText>케어를 원하는</MainText>
                <Row>
                    <MainText style={{color: 'white'}}> 차종을</MainText>
                    <MainText> 입력해 주세요.</MainText>
                </Row>
            </TopBox>
        )
    }

    const TopBar = () => {
        return(
            <View style={{width: '100%', height: '100%', paddingRight: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                <TouchableOpacity style={{padding: 5, marginLeft: 15}} onPress={()=>{askCancelCare();}}>
                    <Icon name="close" size={23} color={Color.mainText}></Icon>
                </TouchableOpacity>
            </View>
        )
    };

    return(
        <Background topbox={<Top/>}>
            <Row style={{paddingHorizontal: 5, paddingBottom: 10, alignItems: 'center', marginTop: 20}}>
                <SearchBar 
                    value={carName}
                    fontSize={15}
                    spinnerVisibility={searchSpinner}
                    placeholder="차량명을 입력해주세요."
                    placeholderTextColor={'#5852B5'}
                    onChangeText={(text)=>SearchProcess(text)}
                    onBlur={()=>setSearchSpinner(false)}
                    clearIconComponent={<Icon name="close-circle" size={20} color={'gray'}/>}
                    style={{...styles.shadowStyle, ...styles.searchBarStyle}}
                    onClearPress={()=>{SearchProcess(''); setSearchSpinner(false);}}
                    onSearchPress={()=>{storeCarName(carName)}}
                />
                <TouchableOpacity style={{marginLeft: 5, ...styles.searchCheckStyle, justifyContent: 'center', alignItems: 'center', width: 48}} onPress={()=>{storeCarName(carName)}}>
                    <Text style={{color: 'black', fontWeight: 'bold'}}>확인</Text>
                </TouchableOpacity>
            </Row>
            <View style={{flex: 1, marginTop: 10}}>
                <FlatList
                    data={filter.dataSource}
                    keyExtractor={item => item.id}
                    renderItem={searchItem}/>
            </View>
        </Background>
    )
}

const styles = {
    shadowStyle: {
        ...Platform.select({
          ios: {
            shadowRadius: 0,
            shadowOpacity: 0.0,
            shadowColor: "#ffffff",
            shadowOffset: {
              width: 0,
              height: 0,
            },
          },
          android: {
            elevation: 1,
          },
        }),
    },
    searchBarStyle: {
        flex : 1,
        height: 45,
        backgroundColor: Color.sub,
        ...Platform.select({
            android: {
                marginTop: 10,
            }
        })
    },
    searchCheckStyle:{
        height: 40,
        ...Platform.select({
            android: {
                marginTop: 10,
            }
        }),
        borderRadius: 5,
        borderWidth: 2,
        borderColor: Color.menuTitleBorder
    },
}

export default CarePage_1;