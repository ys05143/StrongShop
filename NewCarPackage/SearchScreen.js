import React from "react";
import { FlatList, Platform, View, Text, TouchableOpacity } from "react-native";
import TotalView from "../components/TotalView";
import SearchBar from "react-native-dynamic-search-bar";
import Icon from "react-native-vector-icons/Ionicons";
import storage from "../function/storage";
import { userContext } from '../function/Context';
import { CarNames } from "../constants/LIST";

const BidOrderList = {
    processPage: null,
    carName: null,
    options: null,
    require: null,
    region: null,
};

function SearchScreen(props){
    const context = React.useContext(userContext);
    const [topic, setTopic] = React.useState(props.route.params.topic);
    const [search, setSearch] = React.useState('');
    const [searchSpinner, setSearchSpinner] = React.useState(false);
    const [filter, setFilter] = React.useState({
        query: "",
        isLoading: true,
        refreshing: false,
        dataBackup: CarNames,
        dataSource: CarNames,
        spinnerVisibility: false,
    });

    function finishSearch(result){
        if(topic === 'Care') {
            context.setCareSearch(result);
        }
        else if(topic === 'NewCarPackage'){
            context.setNewCarPackageSearch(result);
        }
        else{ 

        }
        props.navigation.goBack();
    }

    const searchItem = (item) =>{
        return(
            <TouchableOpacity style={{width: '100%', height: 60 ,paddingHorizontal:10, alignItems: 'center', flexDirection: 'row'}} onPress={()=>{setSearch(item.item.kor_name); finishSearch(item.item.kor_name)}}>
                <View style={{width: 50, height: 50, backgroundColor: 'lightgray', borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginRight: 20}}>
                    <Icon name={'search-outline'} size={23} color={'gray'}/>
                </View>
                <Text style={{fontWeight: 'bold'}}>{item.item.kor_name}</Text>
            </TouchableOpacity>
        )
    }

    const filterList = (text) => {
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
    };

    const SearchProcess = (text) => {
        setSearch(text);
        setSearchSpinner(true);
        filterList(text);
    }

    return(
       <TotalView color={'white'} notchColor={'white'} homeIndicatorColor={"white"}>
           <SearchBar 
                value={search}
                fontSize={15}
                spinnerVisibility={searchSpinner}
                placeholder="차량명을 입력해주세요."
                placeholderTextColor={"gray"}
                onChangeText={(text)=>SearchProcess(text)}
                onBlur={()=>setSearchSpinner(false)}
                onPress={()=>{}}
                clearIconComponent={<Icon name="close-circle" size={20} color={'gray'}/>}
                style={{...styles.shadowStyle, ...styles.searchBarStyle}}
                onClearPress={()=>{SearchProcess(''); setSearchSpinner(false);}}
                onSearchPress={()=>{finishSearch(search)}}
            />
            <View style={{flex: 1, marginTop: 10}}>
                <FlatList
                    data={filter.dataSource}
                    keyExtractor={item => item.id}
                    renderItem={searchItem}/>
            </View>
       </TotalView>
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
        height: 45,
        backgroundColor: '#e5e5e5',
        ...Platform.select({
            android: {
                marginTop: 10,
            }
        })
    }
}

export default SearchScreen;