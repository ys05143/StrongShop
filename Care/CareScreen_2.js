import React from 'react';
import { Text, ActivityIndicator, View, ScrollView, TextInput, Alert, SectionList, TouchableOpacity, Modal } from 'react-native';
import styled from 'styled-components/native';
import { Button } from 'react-native-paper';
import Icon  from "react-native-vector-icons/Ionicons";
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import _ from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
//pages
import SelectDetailOption from '../NewCarPackage/SelectDetailOption';
import SelectTitleOption from '../NewCarPackage/SelectTitleOption';
//components
import TotalView from '../components/TotalView';
import Row from '../components/Row';
import ModalView from '../components/ModalView';
//constants
import AppWindow from '../constants/AppWindow';
import Color from '../constants/Color';
import { KorRegion, CareList } from '../constants/LIST';

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;
///////////////////////////////
const ContentView = styled.View`
    flex: 1;
    justify-content: center;
    align-items : center;
`;

const BtnView = styled.View`
    width: 100%;
    height: 80px;
`;
///////////////////////////////////
const AllSelectView = styled.View`
    background-color: #e5e5e5;
    width: 90%;
    border-radius: 15px;
    justify-content: center;
    align-items: center;
    padding: 20px 20px;
    height: 100%;
`;
const SelectInSwiper = styled.View`
    width: ${WIDTH*0.9-40}px;
    background-color: white;
    height: 100%;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
`;

const OptionName = styled.TouchableOpacity`
    margin-left: 5px;
    margin-right: 5px;
    border-radius: 50px;
    justify-content: center;
    align-items: center;
    padding: 10px;
    height: 40px;
    width: ${(WIDTH-50)/5}px;
`;

const Input = styled.TextInput`
    width: 95%;
    height: 90%;
    border-radius: 10px;
    border: 1px solid black;
    color: #000000;
    padding: 10px;
`;

const RegionView = styled.View`
    width: 100%;
    margin-top: 20px;
`;
const PickerView = styled.TouchableOpacity`
    width: 95%;
    border: 1px;
    border-radius: 5px;
    margin-top: 5px;
    height: 50px;
    justify-content: center;
    align-items: center;
`;
const PickItem = styled.TouchableOpacity`
    border-bottom-width: 1px;
    width: 95%;
    height: 60px;
    justify-content: center;
    align-items: center;
    border-color: gray;
`;

function CareScreen_2(props) {
    
    const [carData,setCarData] = React.useState(props.route.params.carData);
    const [isLoading, setIsLoading] = React.useState(false);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const scrollX = React.useRef();
    const swiper = React.useRef();

    const [CarWashChoose, setCarWashChoose] = React.useState(false);
    function getCarWashChoose(bool){
        setCarWashChoose(bool);
    }
    const [HandCarWash, setHandCarWash] = React.useState(false);
    function getHandCarWash(bool){
        setHandCarWash(bool);
        if(bool === true){
            setCarWashChoose(true);
        }
    }
    const [SteamCarWash, setSteamCarWash] = React.useState(false);
    function getSteamCarWash(bool){
        setSteamCarWash(bool);
        if(bool === true){
            setCarWashChoose(true);
        }
    }
    const [DetailCarWash, setDetailCarWash] = React.useState(false);
    function getDetailCarWash(bool){
        setDetailCarWash(bool);
        if(bool === true){
            setCarWashChoose(true);
        }
    }
    ////////////////////////////////////////////////////////////////
    const [InsideChoose, setInsideChoose] = React.useState(false);
    function getInsideChoose(bool){
        setInsideChoose(bool);
    }
    const [InsideCleaning, setInsideCleaning] = React.useState(false);
    function getInsideCleaning(bool){
        setInsideCleaning(bool);
        if(bool === true){
            setInsideChoose(true);
        }
    }
    const [InsideSoundProof, setInsideSoundProof] = React.useState(false);
    function getInsideSoundProof(bool){
        setInsideSoundProof(bool);
        if(bool === true){
            setInsideChoose(true);
        }
    }
    ////////////////////////////////////////////////////////////////
    const [OutsideChoose, setOutsideChoose] = React.useState(false);
    function getOutsideChoose(bool){
        setOutsideChoose(bool);
    }
    const [Painting, setPainting] = React.useState(false);
    function getPainting(bool){
        setPainting(bool);
        if(bool === true){
            setOutsideChoose(true);
        }
    }
    const [Dent, setDent] = React.useState(false);
    function getDent(bool){
        setDent(bool);
        if(bool === true){
            setOutsideChoose(true);
        }
    }
    const [Wrapping, setWrapping] = React.useState(false);
    function getWrapping(bool){
        setWrapping(bool);
        if(bool === true){
            setOutsideChoose(true);
        }
    }
    ////////////////////////////////////////////////////////////////
    const [ScratchChoose, setScratchChoose] = React.useState(false);
    function getScratchChoose(bool){
        setScratchChoose(bool);
    }
    const [Polishing, setPolishing] = React.useState(false);
    function getPolishing(bool){
        setPolishing(bool);
        if(bool === true){
            setScratchChoose(true);
        }
    }
    const [GlassCoating, setGlassCoating] = React.useState(false);
    function getGlassCoating(bool){
        setGlassCoating(bool);
        if(bool === true){
            setScratchChoose(true);
        }
    }
    ////////////////////////////////////////////////////////////////
    const [Etc, setEtc] = React.useState('');
    function getEtc(value){
       if(value !== ''){
            setEtcChoose(true);
       }
       else{
           setEtcChoose(false);
       }
       setEtc(value);
    }
    const [EtcChoose, setEtcChoose] = React.useState(false);
    ////////////////////////////////////////////////////////////////
    const [selectedRegion, setSelectedRegion] = React.useState('seoul');
    const [displayRegion, setDisplayRegion] = React.useState('서울');
    const [regionModal, setRegionModal] = React.useState(false);
    
    function SwiperButton(props){
        return(
            <View style={{backgroundColor: 'lightgray', width: 50, height: 25, justifyContent: 'center', alignItems: 'center', borderRadius: 25}}>
                <Icon name={props.name} color={Color.main}></Icon>
            </View>
        )
    }

    function askCancelCare(){
        Alert.alert(
            '입력을 중단하겠습니까?',
            '지금까지 입력된 내용은 저장되지 않습니다.',
            [
                {text: '취소', onPress: () => {}},
                {text: '확인', onPress: () => {
                    props.navigation.popToTop()
                }},
            ],
            { cancelable: true }
        );
    }

    function MoveToNext(){
        let newData = _.cloneDeep(carData);
        newData.options = {
            carWash: {
                handCarWash: HandCarWash,
                steamCarWash: SteamCarWash,
                detailCarWash: DetailCarWash
            },
            inside:{
                insideCleaning: InsideCleaning,
                insideSoundProof: InsideSoundProof
            },
            outside:{
                painting: Painting,
                dent: Dent,
                Wrapping: Wrapping
            },
            scratch:{
                polishing: Polishing,
                glassCoating: GlassCoating,
            },
            etc: Etc,
        };
        newData.region = selectedRegion;
        if(CarWashChoose || InsideChoose || OutsideChoose || ScratchChoose || EtcChoose) props.navigation.navigate("CareScreen_3", {carData: newData});
        else{
            Alert.alert(
                '항목을 선택하셔야 됩니다.',
                [
                    {text: '확인', onPress: () => {}},
                ],
                { cancelable: false }
            );
        }
    }

    return(
        <>
        <KeyboardAwareScrollView>
        <TotalView color={'white'} notchColor={'white'} homeIndicatorColor={'white'}>
            <View style={{width: '100%', alignItems: 'flex-end', paddingTop: 5, paddingRight: 5}}>
                <TouchableOpacity onPress={()=>{askCancelCare();}}>
                    <Icon name="close-outline" size={35} color={'black'}></Icon>
                </TouchableOpacity>    
            </View>
            <Text style={{marginLeft: 10, marginBottom: 10, fontSize: 25, fontWeight: 'bold'}}>항목과 지역을 선택해주세요.</Text>  
            <ContentView>
                <View style={{width: '100%', height: 70}}>
                    <SectionList
                        contentContainerStyle={{alignItems: 'center', width: '100%'}}
                        ref={scrollX}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        sections={CareList}
                        keyExtractor={(item, index) => item + index}
                        renderItem={({item, section} ) => {
                            return(
                            <OptionName style={{backgroundColor: section.id === currentIndex ? Color.main : 'white'}} onPress={()=>{swiper.current.scrollToIndex({"index": section.id, "prevIndex": section.id-1}, true); scrollX.current.scrollToLocation({animated: true, itemIndex: 0, sectionIndex: section.id, viewPosition: 0.5})}}>
                                <Text style={{color: section.id === currentIndex? 'white' : 'black', fontWeight: 'bold'}}>{item}</Text>
                            </OptionName>
                            )
                        }}
                    />
                </View>
                <View style={{flex: 1}}>
                {!isLoading ? 
                <AllSelectView>
                    <SwiperFlatList 
                    index={0}
                    ref={swiper}
                    onChangeIndex={(index)=>{setCurrentIndex(index.index); scrollX.current.scrollToLocation({animated: true, itemIndex: 0, sectionIndex: index.index, viewPosition: 0.5})}}>
                        <SelectInSwiper>    
                            <SelectTitleOption getChoose={getCarWashChoose} 
                                                choose={CarWashChoose} 
                                                name={'세차'}/>
                            <SelectDetailOption getChoose={getHandCarWash} 
                                                choose={HandCarWash}
                                                name={'손 세차'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getSteamCarWash} 
                                                choose={SteamCarWash}
                                                name={'스팀 세차'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getDetailCarWash} 
                                                choose={DetailCarWash}
                                                name={'디테일링 세차'}
                                                touchable={true}/>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <SelectTitleOption getChoose={getInsideChoose} 
                                                choose={InsideChoose} 
                                                name={'내부'}/>
                            <SelectDetailOption getChoose={getInsideCleaning} 
                                                choose={InsideCleaning}
                                                name={'내부 클리닝'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getInsideSoundProof} 
                                                choose={InsideSoundProof}
                                                name={'내부 방음'}
                                                touchable={true}/>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <SelectTitleOption getChoose={getOutsideChoose} 
                                                choose={OutsideChoose} 
                                                name={'외부'}/>
                            <SelectDetailOption getChoose={getPainting} 
                                                choose={Painting}
                                                name={'도색'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getDent} 
                                                choose={Dent}
                                                name={'덴트'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getWrapping} 
                                                choose={Wrapping}
                                                name={'랩핑'}
                                                touchable={true}/>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <SelectTitleOption getChoose={getScratchChoose} 
                                                choose={ScratchChoose} 
                                                name={'스크레치'}/>
                            <SelectDetailOption getChoose={getPolishing} 
                                                choose={Polishing}
                                                name={'광택'}
                                                touchable={true}/>
                            <SelectDetailOption getChoose={getGlassCoating} 
                                                choose={GlassCoating}
                                                name={'유리막 코팅'}
                                                touchable={true}/>
                        </SelectInSwiper>
                        <SelectInSwiper>
                            <SelectTitleOption getChoose={setEtcChoose} 
                                                choose={EtcChoose} 
                                                name={'직접입력'}/>
                            <KeyboardAwareScrollView
                            contentContainerStyle={{flex:1}}>
                            <View style={{flex: 1, alignItems: 'center'}}>
                                <Input multiline={true}
                                        style={{textAlignVertical:'top', marginBottom: 10}}//only for android
                                        value={Etc}
                                        onChangeText={value=>{getEtc(value)}}
                                        placeholder={"별도의 원하시는 사항이 있으면 입력해주세요."}
                                        placeholderTextColor="gray"
                                        maxLength={400}
                                        />
                            </View>
                            </KeyboardAwareScrollView>
                        </SelectInSwiper>
                    </SwiperFlatList>
                </AllSelectView> : 
                <AllSelectView>
                    <SelectInSwiper style={{justifyContent: 'center'}}>
                        <ActivityIndicator size = 'small' color= {Color.main} style={{marginTop: 10}}/>
                    </SelectInSwiper>
                </AllSelectView>}
                </View>
            </ContentView>
            <RegionView>
                <Text style={{marginLeft: 10, marginBottom: 10, fontSize: 15, fontWeight: 'bold'}}>지역</Text>
                <View style={{width: '100%', alignItems: 'center'}}>
                    <PickerView onPress={()=>{setRegionModal(true)}}>
                        <Text>{displayRegion}</Text>
                    </PickerView>
                </View>
            </RegionView>
        <BtnView>
                <Row style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                    <Button mode={"contained"} onPress={() => {props.navigation.goBack();}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main}>이전</Button>
                    <Button mode={"contained"} onPress={() => {MoveToNext();}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} labelStyle={{fontSize: 20}} color={Color.main}>선택완료</Button>
                </Row>
            </BtnView>
        </TotalView>
        </KeyboardAwareScrollView>

        <Modal
            animationType="slide"
            transparent={true}
            visible={regionModal}
            onRequestClose={() => {setRegionModal(!regionModal);}}
        >
            <ModalView>
                <View style={{width: '90%', height: 400, backgroundColor: 'white'}}>
                    <ScrollView contentContainerStyle={{alignItems: 'center'}}
                                persistentScrollbar={true}
                                showsVerticalScrollIndicator={true}>
                        {_.map(KorRegion, (item)=>{
                            return(
                                <PickItem key={item} onPress={()=>{setDisplayRegion(item); setRegionModal(false);}}>
                                    <Text style={{fontWeight: 'bold'}}>{item}</Text>
                                </PickItem>
                            )
                        })}
                    </ScrollView>
                    <View style={{height: 70, justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{width: 100}}>
                            <Button mode="contained" contentStyle={{width: 100, height: 50}} style={{justifyContent:'center', alignItems: 'center'}} color={Color.main} onPress={()=>{setRegionModal(false);}}>
                                <Text>완료</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </ModalView>
        </Modal>
        </>
    );
}

export default CareScreen_2;