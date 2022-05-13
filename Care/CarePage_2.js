import React from "react";
import styled from "styled-components/native";
import { Text, ActivityIndicator, View, TextInput, Alert, SectionList, TouchableOpacity, Modal, ScrollView, Platform} from 'react-native';
import Icon  from "react-native-vector-icons/Ionicons";
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import _ from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
//component
import Background from "../components/Background";
import { MainText, MenuTitleText, MenuContentText, JuaText, NotoSansText } from "../components/TextStyle";
import Row from '../components/Row';
import TopBox from "../components/TopBox";
import ModalView from "../components/ModalView";
//constant
import Color from "../constants/Color";
import AppWindow from '../constants/AppWindow';
import { CareList, KorRegion } from '../constants/LIST';
//pages
import NcpOptionDetails from "../NewCarPackage/NcpOptionDetails";
import NcpOptionTitle from "../NewCarPackage/NcpOptionTitle";
//function
import storage from '../function/storage';
import BtnView from "../components/BtnView";
import CustButton from "../components/CustButton";

const WIDTH = AppWindow.width;
const New_total = AppWindow.New_total;

const compareOptions = {
    carWash: false,
    detailCarWash: {
        handCarWash: false,
        steamCarWash: false,
        detailingCarWash: false
    },
    inside: false,
    detailInside:{
        insideCleaning: false,
        insideSoundProof: false
    },
    outside: false,
    detailOutside:{
        painting: false,
        dent: false,
        Wrapping: false
    },
    scratch: false,
    detailScratch:{
        polishing: false,
        glassCoating: false,
    },
    etc: false,
    detailEtc: '',
}


const AllSelectView = styled.View`
    background-color: ${Color.menuBackgrund};
    width: 95%;
    border: 2px solid ${Color.menuBorder};
    border-radius: 5px;
    justify-content: center;
    align-items: center;
`;
const SelectInSwiper = styled.View`
    width: ${(WIDTH*0.95)-4}px;
    padding-bottom: 5px;
    /* border: 1px solid red; */
`;

const OptionName = styled.TouchableOpacity`
    margin-left: 5px;
    margin-right: 5px;
    border-radius: 20px;
    justify-content: center;
    align-items: center;
    padding: 0px 10px;
    height: 40px;
    background-color: white;
    border: 2px;
`;

const RegionTitle = styled.View`
    width: 95%;
    align-items: center;
    padding-bottom: 5px;
    flex-direction: row;
    justify-content: center;
`;
const RegionView = styled.View`
    width: 95%;
    margin-top: 10px;
    margin-bottom: 10px;
`;
const PickerView = styled.TouchableOpacity`
    background-color: ${Color.menuBackgrund};
    border-radius: 5px;
    border: 2px;
    border-color: ${Color.menuBorder};
    margin-top: 5px;
    height: 50px;
    justify-content: center;
    align-items: center;
`;
const PickItem = styled.TouchableOpacity`
    border-bottom-width: 1px;
    border-color: ${Color.menuTitleBorder};
    width: 95%;
    height: 55px;
    justify-content: center;
    align-items: center;
    border-color: gray;
`;
const ModalBox = styled.View`
    width: 95%;
    height: 430px;
    background-color: ${Color.menuBackgrund};
    border-radius: 5px;
`;
const Input = styled.TextInput`
    background-color: white;
    border-radius: 5px;
    border: 2px;
    border-color: ${Color.menuBorder};
    padding: 10px;
    width: 95%;
    height: ${New_total*0.20}px;
    font-family: NotoSansKR-Medium;
`;

function CarePage_2(props){

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
    const [DetailingCarWash, setDetailingCarWash] = React.useState(false);
    function getDetailingCarWash(bool){
        setDetailingCarWash(bool);
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
    //////////////////////////////////////////////////////////////////
    const [displayRegion, setDisplayRegion] = React.useState('서울');
    const [regionModal, setRegionModal] = React.useState(false);

    React.useEffect(()=>{
        setIsLoading(true);
        storage.fetch('CareOrder')
        .then(res => {
            console.log(res);
            if(res.options !== null){
                console.log('케어페이지 2 useEffect: ', res.options);  
                
                setCarWashChoose(res.options.carWash);
                setHandCarWash(res.options.detailCarWash.handCarWash);
                setSteamCarWash(res.options.detailCarWash.steamCarWash);
                setDetailingCarWash(res.options.detailCarWash.detailingCarWash);
                
                setInsideChoose(res.options.inside);
                setInsideCleaning(res.options.detailInside.insideCleaning);
                setInsideSoundProof(res.options.detailInside.insideSoundProof);

                setOutsideChoose(res.options.outside);
                setPainting(res.options.detailOutside.painting);
                setDent(res.options.detailOutside.dent);
                setWrapping(res.options.detailOutside.Wrapping);

                setScratchChoose(res.options.scratch);
                setPolishing(res.options.detailScratch.polishing);
                setGlassCoating(res.options.detailScratch.glassCoating);

                setEtcChoose(res.options.etc);
                setEtc(res.options.detailEtc);

                setIsLoading(false); 
            }
            else{
                console.log('no options result');
                setIsLoading(false);
            }
        })
        .catch(e => {
            console.log(e);
            Alert.alert(
                '캐시 불러오기 오류',
                '오류가 발생했습니다.',
                [
                  {text: '확인', onPress: () => {cancelOptions();}},
                ],
                { cancelable: false }
              );
        })
    },[]);

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

    async function makeTotal(){
        let finalOptions = {
            carWash: CarWashChoose,
            detailCarWash: {
                handCarWash: HandCarWash,
                steamCarWash: SteamCarWash,
                detailingCarWash: DetailingCarWash
            },
            inside: InsideChoose,
            detailInside:{
                insideCleaning: InsideCleaning,
                insideSoundProof: InsideSoundProof
            },
            outside: OutsideChoose,
            detailOutside:{
                painting: Painting,
                dent: Dent,
                Wrapping: Wrapping
            },
            scratch: ScratchChoose,
            detailScratch:{
                polishing: Polishing,
                glassCoating: GlassCoating,
            },
            etc: EtcChoose,
            detailEtc: Etc,
        };
        
        return finalOptions;
    }

    async function storeCarOptions() {
        try{
            let finalOptions = await makeTotal()
            if(_.isEqual(finalOptions, compareOptions)){
                Alert.alert(
                    '항목을 선택해주세요.',
                    '',
                    [
                      {text: '확인', onPress: () => {}},
                    ],
                    { cancelable: false }
                  );
            }
            else{
                if(finalOptions.detailEtc === null){
                    Alert.alert(
                        '항목을 선택해주세요.',
                        '',
                        [
                          {text: '확인', onPress: () => {}},
                        ],
                        { cancelable: false }
                      );
                }
                else{
                    let newOrder = null;
                    const response = await storage.fetch('CareOrder');
                    if(response !== null){ //정상적인 루트로 왔다면 fetch가 반드시 성공.
                        newOrder = {...response};
                        if(newOrder.processPage <= 2) newOrder.processPage = 2;
                        newOrder.options = finalOptions;
                        newOrder.region = displayRegion;
                        await storage.store('CareOrder', newOrder);
                        props.navigation.navigate("CarePage_3");
                    }
                    else{ //async에 저장된 것이 없을 때 === 차량등록을 안하고 왔을 때 === 오류인 상황
                        Alert.alert(
                            '캐시 저장 오류',
                            '오류가 발생했습니다.',
                            [
                            {text: '확인', onPress: () => {cancelOptions();}},
                            ],
                            { cancelable: false }
                        );
                    }
                }
            }
        }
        catch{
            Alert.alert(
                '저장 오류',
                '오류가 발생했습니다.',
                [
                {text: '확인', onPress: () => {cancelOptions();}},
                ],
                { cancelable: false }
            );
        }
    }

    function cancelOptions(){
        //나머지 모든 체크도 false 시켜야함
        props.navigation.popToTop();
    }

    function askCancelOptions(){
        Alert.alert(
            '입력을 중단하겠습니까?',
            '현재 페이지에 입력된 내용은 저장되지 않습니다.',
            [
                {text: '취소', onPress: () => {}},
                {text: '확인', onPress: () => {
                    props.navigation.navigate("MainPage");
                }},
              
            ],
            { cancelable: true }
        );
    
    }    

    const Top = ()=>{
        return(
            <TopBox topbar={<TopBar/>}>
                <MainText>케어를 원하는</MainText>
                <Row>
                    <MainText style={{color: 'white'}}> 항목을</MainText>
                    <MainText> 선택해 주세요.</MainText>
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
    }

    return(
        <>
        <Background topbox={<Top/>} androidKeyboardAware={Platform.OS === 'android'}>
            <View style={{width: '100%', paddingVertical: 20}}>
                <SectionList
                    ref={scrollX}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    sections={CareList}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({item, section} ) => {
                        return(
                        <OptionName style={{borderColor: section.id === currentIndex ? 'red' : 'white'}} onPress={()=>{swiper.current.scrollToIndex({"index": section.id, "prevIndex": section.id-1}, true); scrollX.current.scrollToLocation({animated: true, itemIndex: 0, sectionIndex: section.id, viewPosition: 0.5})}}>
                            <NotoSansText style={{color: section.id === currentIndex? 'black' : '#13489D', fontSize: section.id === currentIndex? 18 : 16}}>{'#'+item}</NotoSansText>
                        </OptionName>
                        )
                    }}
                />
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
                <KeyboardAwareScrollView style={{width: WIDTH}} contentContainerStyle={{alignItems: 'center'}} extraHeight={300} showsVerticalScrollIndicator={false}>
                    <AllSelectView>
                        <SwiperFlatList 
                        index={0}
                        ref={swiper}
                        onChangeIndex={(index)=>{setCurrentIndex(index.index); scrollX.current.scrollToLocation({animated: true, itemIndex: 0, sectionIndex: index.index, viewPosition: 0.5})}}>
                            
                            <SelectInSwiper>    
                                <NcpOptionTitle getChoose={getCarWashChoose} 
                                                    choose={CarWashChoose} 
                                                    name={'세차'}/>
                                <NcpOptionDetails getChoose={getHandCarWash} 
                                                    choose={HandCarWash}
                                                    name={'손 세차'}
                                                    touchable={true}/>
                                <NcpOptionDetails getChoose={getSteamCarWash} 
                                                    choose={SteamCarWash}
                                                    name={'스팀 세차'}
                                                    touchable={true}/>
                                <NcpOptionDetails getChoose={getDetailingCarWash} 
                                                    choose={DetailingCarWash}
                                                    name={'디테일링 세차'}
                                                    touchable={true}/>
                            </SelectInSwiper>

                            <SelectInSwiper>
                                <NcpOptionTitle getChoose={getInsideChoose} 
                                                    choose={InsideChoose} 
                                                name={'내부'}/>
                                <NcpOptionDetails getChoose={getInsideCleaning} 
                                                    choose={InsideCleaning}
                                                    name={'내부 클리닝'}
                                                    touchable={true}/>
                                <NcpOptionDetails getChoose={getInsideSoundProof} 
                                                    choose={InsideSoundProof}
                                                    name={'내부 방음'}
                                                    touchable={true}/>
                            </SelectInSwiper>

                            <SelectInSwiper>
                                <NcpOptionTitle getChoose={getOutsideChoose} 
                                                choose={OutsideChoose} 
                                                name={'외부'}/>
                                <NcpOptionDetails getChoose={getPainting} 
                                                    choose={Painting}
                                                    name={'도색'}
                                                    touchable={true}/>
                                <NcpOptionDetails getChoose={getDent} 
                                                    choose={Dent}
                                                    name={'렌트'}
                                                    touchable={true}/>
                                <NcpOptionDetails getChoose={getWrapping} 
                                                    choose={Wrapping}
                                                    name={'랩핑'}
                                                    touchable={true}/>
                            </SelectInSwiper>

                            <SelectInSwiper>
                                <NcpOptionTitle getChoose={getScratchChoose} 
                                                choose={ScratchChoose} 
                                                name={'스크레치'}/>                 
                                <NcpOptionDetails getChoose={getPolishing} 
                                                    choose={Polishing}
                                                    name={'광택'}
                                                    touchable={true}/>
                                <NcpOptionDetails getChoose={getGlassCoating} 
                                                    choose={GlassCoating}
                                                    name={'유리막코팅'}
                                                    touchable={true}/>
                            </SelectInSwiper>
                            
                            <SelectInSwiper>
                                <NcpOptionTitle getChoose={setEtcChoose} 
                                                    choose={EtcChoose} 
                                                    name={'직접입력'}/>                  
                                <Row style={{ paddingLeft: 10, height: 35, alignItems: 'center', marginTop: 10}}>
                                    <Icon name={(EtcChoose === false) ?"radio-button-off-outline": "radio-button-on-outline"} size={18} color= 'gray'></Icon>
                                    <Text style={{fontSize: 18, color: 'black', fontWeight: 'bold'}}>기타</Text>
                                </Row>
                                <View style={{alignItems: 'center'}}>
                                    <Input value={Etc}
                                            maxLength={400}
                                            editable={true}
                                            multiline={true}
                                            onChangeText={(value)=>{getEtc(value);}}/>
                                </View>
                            </SelectInSwiper>
                        </SwiperFlatList>
                    </AllSelectView>
                </KeyboardAwareScrollView>
                <View style={{width: '100%', alignItems: 'center'}}>
                    <RegionView>
                        <View style={{alignItems: 'center'}}>
                            <RegionTitle>
                                <Icon name={'ellipse'} style={{marginRight: 5}} size={10}/>
                                <JuaText style={{fontSize: 23}}>{'지역을 선택해주세요.'}</JuaText>
                            </RegionTitle>
                        </View>
                        <PickerView onPress={()=>{setRegionModal(true)}}>
                            <NotoSansText style={{fontSize: 20}}>{displayRegion}</NotoSansText>
                        </PickerView>
                    </RegionView>
                </View>
            </View>
            <BtnView>
                <CustButton onPress={()=>{props.navigation.navigate("CarePage_1");}}>이전</CustButton>
                <CustButton onPress={()=>{storeCarOptions();}}>선택</CustButton>
            </BtnView>
            
        </Background>

        <Modal
        animationType="slide"
        transparent={true}
        visible={regionModal}
        onRequestClose={() => {setRegionModal(!regionModal);}}
        >
            <ModalView>
                <ModalBox>
                    <ScrollView contentContainerStyle={{alignItems: 'center'}}
                                persistentScrollbar={true}
                                showsVerticalScrollIndicator={true}>
                        {_.map(KorRegion, (item)=>{
                            return(
                                <PickItem key={item} onPress={()=>{setDisplayRegion(item); setRegionModal(false);}}>
                                    <NotoSansText style={{fontSize: 20}}>{item}</NotoSansText>
                                </PickItem>
                            )
                        })}
                    </ScrollView>
                    <View style={{height: 70, justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{width: 100}}>
                            <CustButton onPress={()=>{setRegionModal(false);}}>
                                <Text>완료</Text>
                            </CustButton>
                        </View>
                    </View>
                </ModalBox>
            </ModalView>
        </Modal>
        </>
    )

}

export default CarePage_2;