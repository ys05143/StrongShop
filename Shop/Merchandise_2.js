import React from 'react';
import _ from 'lodash';
import styled from 'styled-components/native';
import { ScrollView, Text,View, Animated, PanResponder, ActivityIndicator, Alert } from 'react-native';
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

const merchadiseList= [
{
    name: '틴팅',
    title: 'Tinting',
},{
    name: '블랙박스',
    title: 'BlackBox',
},{
    name: '유리막코팅',
    title: 'GlassCoating',
},{
    name: '하부코팅',
    title: 'UnderCoating',
},{
    name: 'PPF',
    title: 'PPF',
},{
    name: '하부방음',
    title: 'UnderDeafening',
},
];

const Total = styled.View`
    width: 100%;
    align-items: center;
`;

const Option = styled.ScrollView`
    height: 70px;
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: white;
`;
const OptionView = styled.View`
    width: 90px;
    height: 60px;
    justify-content: center;
    align-items: center;
`;
const OptionName = styled.TouchableOpacity`
    padding: 5px;
    border-radius: 10px;
    border: 2px solid gray;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 40px;
`;


const TEMP_BLACKBOX=[{
    name: '파인뷰LX5000',
    price: 230000,
    text: '더 빠른 DUAL CORE CPU AI 충격안내 시스템 및 졸음운전 예방 시스템 탑재'
},{
    name: '파인뷰 GX3000',
    price: 350000,
    text: '전후방 QHD 초고화질 블랙박스 HD화질보다 4배 더 선명한 녹화'
},{
    name: '파인뷰 LX3 ',
    price: 380000,
    text: '룸미러와 블랙박스의 만남\n전후방 FHD, SONY STARVIS\n후방사각지대 시야확보'
}];

const DATA = {
    afterblow: [], 
    battery: [], 
    blackbox: [{additionalInfo: "아아아아", companyId: 7, id: 7, item: 'BLACKBOX', name: "오옹오ㅗ오"}], 
    deafening: [], 
    etc: [], 
    glasscoating: [], 
    ppf: [{additionalInfo: "어어엉", companyId: 6, id: 6, item: 'PPF', name: "아아아"}], 
    tinting: [{additionalInfo: "ㅇㅇㅇㅇ", companyId: 5, id: 5, item: 'TINTING', name: "ㅇㅇ"}], 
    undercoating: [], 
    wrapping: [],
}

function Merchandise_2(props){
    //props로 받은 shopName으로 서버에 그 shop의 정보 요청해서 각 파트별로 useState에 저장
    //이후 asyncstorage 캐시도 필요할듯.
    //tinting은 처음에 무조건 받아오고 나머지는 클릭하면 받아오도록
    const [shopName, setShopName] = React.useState(props.shopName);
    const [show, setShow] = React.useState(props.merchandise.tinting !== null ? 'Tinting' : null);
    const [isLoading, setIsLoading] = React.useState(props.merchandise.tinting !== null ? false : true);

    const [tintingList, setTintingList] = React.useState(props.merchandise.tinting);
    const [blackboxList, setBlackboxList] = React.useState(TEMP_BLACKBOX);
    const [glassCoatingList, setGlassCoatingList] = React.useState(null);
    const [underCoatingList, setUnderCoatingList] = React.useState(null);
    const [ppfList, setPpfList] = React.useState(null);
    const [underDeafeningList, setUnderDeafeningList] = React.useState(null);

    const scrollY = React.useRef(new Animated.Value(0)).current; 
    const [first, setFirst] = React.useState(props.totalFirst);
    const [last, setLast] = React.useState(false);
    const pan = React.useRef(props.Pan).current;

    React.useEffect(()=>{
        setFirst(props.totalFirst);
        setLast(false);
    },[props.totalFirst]);

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
        if(first){
            pan.setValue({
                x: 0,
                y: 0
            })
            pan.setOffset({
                x: 0,
                y: first === true? 0 : -HEADER_SCROLL_DISTANCE
            });
        }
        if(last){
            pan.setValue({
                x: 0,
                y: 0
            })
            console.log(first);
            pan.setOffset({
                x: 0,
                y: last === true?  -HEADER_SCROLL_DISTANCE : 0
            });         
        }},
        onPanResponderMove: Animated.event([
        null,
        {
            dx: pan.x,
            dy: pan.y,
        },
        ],{
            useNativeDriver: false,
            listener: (e)=>{props.getPan(pan);}
        }),
        onPanResponderRelease: () => {
        if(first){
            Animated.spring(
            pan, // Auto-multiplexed
            { toValue: { x: 0, y: first === true ? -HEADER_SCROLL_DISTANCE : 0 },
                useNativeDriver: true } // Back to zero
            ).start();
            props.getTotalFirst(false);
            //setFirst(false);
        }
        if(last){
            Animated.spring(
            pan, // Auto-multiplexed
            { toValue: { x: 0, y: last === true ? HEADER_SCROLL_DISTANCE : 0 },
                useNativeDriver: true } // Back to zero
            ).start();
            setLast(false);
            props.getTotalFirst(true);
            //setFirst(true);
        }
        },
    });

    function showOption(title) {
        setIsLoading(true);
        setShow(title);
        //체크 후 필요시 요청
        //setTimeout(()=>{setIsLoading(false)}, 2000);
        setIsLoading(false);
    }

    async function getData(){
        try{
            const auth = await checkJwt();
            if(auth !== null){
                const response = await axios({
                    method: 'GET',
                    url : `${server.url}/api/`,
                    headers : {Auth: auth},
                })
            }
            else{
                console.log("no login");
            }
        }
        catch{e=>{
            //console.log(e);
            Alert.alert(
                '오류',
                'IndroduceShop 오류',
                [
                    {text: 'OK', onPress: () => {}},
                ],
                { cancelable: false }
            );}
        }  
    }

    return(
        <Total>
            <Option horizontal={true}>
                {_.map(merchadiseList, (item) => {
                    return(
                        <OptionView key={item.title} style={{alignSelf: 'center'}}>
                            <OptionName style={{borderColor: show === item.title ? Color.main : 'gray'}} onPress={()=>{showOption(item.title)}}>
                                <Text style={{color: show === item.title ? Color.main : 'gray'}}>{item.name}</Text>
                            </OptionName>
                        </OptionView>
                    );}
                )}
            </Option>
            <View style={{width: '100%'}}>
                <ScrollView scrollEnabled={true}>
                    {isLoading && <ActivityIndicator size = 'large' color= {Color.main}/>}
                    {(show === 'Tinting' && !isLoading) && <ProductDetail list={tintingList} title={'틴팅'}/>}
                    {(show === 'BlackBox' && !isLoading) && <ProductDetail list ={blackboxList} title={'블랙박스'}/>}
                    {(show === 'GlassCoating' && !isLoading) && <ProductDetail list ={glassCoatingList} title={'유리막코팅'}/>}
                    {(show === 'UnderCoating' && !isLoading) && <ProductDetail list ={underCoatingList} title={'하부코팅'}/>}
                    {(show === 'PPF' && !isLoading) && <ProductDetail list ={ppfList} title={'PPF'}/>}
                    {(show === 'UnderDeafening' && !isLoading) && <ProductDetail list ={underDeafeningList} title={'하부방음'}/>}
                </ScrollView> 
            </View>          
        </Total>
    )
}

export default Merchandise_2;