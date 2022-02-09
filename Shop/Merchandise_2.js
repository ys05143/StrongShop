import React from 'react';
import _ from 'lodash';
import styled from 'styled-components/native';
import { ScrollView, Text,View, Animated, PanResponder, ActivityIndicator, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
//constants
import Color from '../constants/Color';
//pages
import ProductDetail from './ProductDetail';
import AppWindow from '../constants/AppWindow';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;

const TAB_HEIGHT = 50;
const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const Total = styled.View`
    width: 100%;
    align-items: center;
`;

const Option = styled.SectionList`
    height: 70px;
    margin-bottom: 10px;
    background-color: white;
`;
const OptionView = styled.View`
    width: 100px;
    height: 50px;
    justify-content: center;
    align-items: center;
`;
const OptionName = styled.TouchableOpacity`
    padding: 5px;
    border-radius: 50px;
    border: 1px solid gray;
    justify-content: center;
    align-items: center;
    width: 90px;
    height: 40px;
`;

// const merchadiseList= [
//     {
//         name: '틴팅',
//         title: 'tinting',
//     },{
//         name: 'PPF',
//         title: 'ppf',
//     },{
//         name: '블랙박스',
//         title: 'blackBox',
//     },{
//         name: '보조배터리',
//         title: 'battery',
//     },{
//         name: '애프터블로우',
//         title: 'afterblow',
//     },{
//         name: '방음',
//         title: 'deafening',
//     },{
//         name: '랩핑',
//         title: 'warpping',
//     },{
//         name: '유리막코팅',
//         title: 'glassCoating',
//     },{
//         name: '하부코팅',
//         title: 'underCoating',
//     },{
//         name: '기타',
//         title: 'etc',
//     },];

const merchadiseList= [
    {
        id: 0,
        data: ['틴팅'],
        name: '틴팅',
        title: 'tinting',
    },{
        id: 1,
        data: ['PPF'],
        name: 'PPF',
        title: 'ppf',
    },{
        id: 2,
        data: ['블랙박스'],
        name: '블랙박스',
        title: 'blackBox',
    },{
        id: 3,
        data: ['보조배터리'],
        name: '보조배터리',
        title: 'battery',
    },{
        id: 4,
        data: ['애프터블로우'],
        name: '애프터블로우',
        title: 'afterblow',
    },{
        id: 5,
        data: ['방음'],
        name: '방음',
        title: 'deafening',
    },{
        id: 6,
        data: ['랩핑'],
        name: '랩핑',
        title: 'warpping',
    },{
        id: 7,
        data: ['하부코팅'],
        name: '하부코팅',
        title: 'bottomCoating',
    },{
        id: 8,
        data: ['유리막코팅'],
        name: '유리막코팅',
        title: 'glassCoating',
    },{
        id: 9,
        data: ['기타'],
        name: '기타',
        title: 'etc',
    }
];

const DATA = {
    afterblow: [], 
    battery: [], 
    blackbox: [],
    deafening: [], 
    etc: [], 
    glasscoating: [], 
    ppf: [], 
    tinting: [{additionalInfo: "", companyId: 5, id: 5, item: 'TINTING', name: ""}],
    undercoating: [], 
    wrapping: [],
}

function Merchandise_2(props){
    //props로 받은 shopName으로 서버에 그 shop의 정보 요청해서 각 파트별로 useState에 저장
    //이후 asyncstorage 캐시도 필요할듯.
    //tinting은 처음에 무조건 받아오고 나머지는 클릭하면 받아오도록
    const [show, setShow] = React.useState('tinting');
    const [productData, setProductData] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(false);
    const scrollX = React.useRef();
    
    const isFocused = useIsFocused();
    React.useEffect(()=>{
        if(isFocused) getData();
    },[isFocused]);

    async function getData(){
        try{
            setIsLoading(true);
            const auth = await checkJwt();
            if(auth !== null){
                const response = await axios({
                    method: 'GET',
                    url : `${server.url}/api/product/${props.companyId}`,
                    headers : {Auth: auth},
                }).catch(e=>{console.log(e)});

                const rawData = response.data.data;
                console.log("product",rawData);
                const newData = { 
                    afterblow: rawData.afterblow, 
                    battery: rawData.battery, 
                    blackbox: rawData.blackbox,  
                    deafening: rawData.deafening, 
                    etc: rawData.etc,  
                    glasscoating: rawData.glasscoating,  
                    ppf: rawData.ppf, 
                    tinting: rawData.tinting, 
                    bottomcoating: rawData.bottomcoating, 
                    wrapping: rawData.wrapping, 
                }
                setProductData(newData);
                setIsLoading(false);
            }
            else{
                console.log("no login");
            }
        }
        catch{e=>{
            //console.log(e);
            Alert.alert(
                '상품 조회 오류',
                '다시 시도해주세요.',
                [
                    {text: '확인', onPress: () => {}},
                ],
                { cancelable: false }
            );}
        }  
    }

    //const scrollY = React.useRef(new Animated.Value(0)).current; 
    // const [first, setFirst] = React.useState(props.totalFirst);
    // const [last, setLast] = React.useState(false);
    //const pan = React.useRef(props.Pan).current;

    // React.useEffect(()=>{
    //     setFirst(props.totalFirst);
    //     setLast(false);
    // },[props.totalFirst]);

    // const panResponder = PanResponder.create({
    //     onStartShouldSetPanResponder: () => true,
    //     onPanResponderGrant: () => {
    //     if(first){
    //         pan.setValue({
    //             x: 0,
    //             y: 0
    //         })
    //         pan.setOffset({
    //             x: 0,
    //             y: first === true? 0 : -HEADER_SCROLL_DISTANCE
    //         });
    //     }
    //     if(last){
    //         pan.setValue({
    //             x: 0,
    //             y: 0
    //         })
    //         console.log(first);
    //         pan.setOffset({
    //             x: 0,
    //             y: last === true?  -HEADER_SCROLL_DISTANCE : 0
    //         });         
    //     }},
    //     onPanResponderMove: Animated.event([
    //     null,
    //     {
    //         dx: pan.x,
    //         dy: pan.y,
    //     },
    //     ],{
    //         useNativeDriver: false,
    //         listener: (e)=>{props.getPan(pan);}
    //     }),
    //     onPanResponderRelease: () => {
    //     if(first){
    //         Animated.spring(
    //         pan, // Auto-multiplexed
    //         { toValue: { x: 0, y: first === true ? -HEADER_SCROLL_DISTANCE : 0 },
    //             useNativeDriver: true } // Back to zero
    //         ).start();
    //         props.getTotalFirst(false);
    //         //setFirst(false);
    //     }
    //     if(last){
    //         Animated.spring(
    //         pan, // Auto-multiplexed
    //         { toValue: { x: 0, y: last === true ? HEADER_SCROLL_DISTANCE : 0 },
    //             useNativeDriver: true } // Back to zero
    //         ).start();
    //         setLast(false);
    //         props.getTotalFirst(true);
    //         //setFirst(true);
    //     }
    //     },
    // });

    function showOption(title) {
        setIsLoading(true);
        setShow(title);
        //체크 후 필요시 요청
        //setTimeout(()=>{setIsLoading(false)}, 2000);
        setIsLoading(false);
    }

    return(
        <Total>
            <Option 
            horizontal={true}
            showsHorizontalScrollIndicator ={false}
            style={{width: '100%'}}
            ref={scrollX}
            horizontal={true}
            sections={merchadiseList}
            keyExtractor={(item, index) => item + index}
            renderItem={({item, section} ) => {
                return(
                    <OptionView key={item.title} style={{alignSelf: 'center'}}>
                        <OptionName style={{backgroundColor: show === section.title ? Color.main : 'white', borderColor: show === section.title ? Color.main : 'white'}} onPress={async ()=>{getData(); showOption(section.title); scrollX.current.scrollToLocation({animated: true, itemIndex: 0, sectionIndex: section.id, viewPosition: 0.5})}}>
                            <Text style={{color: show === section.title ? 'white' : Color.main, fontWeight: 'bold'}}>{item}</Text>
                        </OptionName>
                    </OptionView>
                );
            }}>
                {/* {_.map(merchadiseList, (item) => {
                    return(
                        <OptionView key={item.title} style={{alignSelf: 'center'}}>
                            <OptionName style={{backgroundColor: show === item.title ? Color.main : 'white', borderColor: show === item.title ? Color.main : 'white'}} onPress={()=>{showOption(item.title)}}>
                                <Text style={{color: show === item.title ? 'white' : Color.main, fontWeight: 'bold'}}>{item.name}</Text>
                            </OptionName>
                        </OptionView>
                    );}
                )} */}
            </Option>
            <View style={{width: '100%'}}>
                {!isLoading ? 
                <ScrollView 
                scrollEnabled={true}
                showsVerticalScrollIndicator ={false}>
                    {(show === 'tinting' && !isLoading) && <ProductDetail list={productData.tinting} title={'틴팅'}/>}
                    {(show === 'blackBox' && !isLoading) && <ProductDetail list ={productData.blackbox} title={'블랙박스'}/>}
                    {(show === 'deafening' && !isLoading) && <ProductDetail list={productData.deafening} title={'방음'}/>}
                    {(show === 'glassCoating' && !isLoading) && <ProductDetail list ={productData.glasscoating} title={'유리막코팅'}/>}
                    {(show === 'bottomCoating' && !isLoading) && <ProductDetail list ={productData.bottomcoating} title={'하부코팅'}/>}
                    {(show === 'ppf' && !isLoading) && <ProductDetail list ={productData.ppf} title={'PPF'}/>}
                    {(show === 'afterblow' && !isLoading) && <ProductDetail list ={productData.afterblow} title={'애프터블로우'}/>}
                    {(show === 'battery' && !isLoading) && <ProductDetail list ={productData.battery} title={'보조배터리'}/>}
                    {(show === 'wrapping' && !isLoading) && <ProductDetail list ={productData.wrapping} title={'랩핑'}/>}
                    {(show === 'etc' && !isLoading) && <ProductDetail list ={productData.etc} title={'기타'}/>}
                </ScrollView> :
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent'}}>
                    <ActivityIndicator size = 'small' color= {Color.main} style={{marginTop: 20}}/>
                </View>}
            </View>          
        </Total>
    )
}

export default Merchandise_2;