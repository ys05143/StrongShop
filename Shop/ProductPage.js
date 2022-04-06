import React from 'react';
import _ from 'lodash';
import styled from 'styled-components/native';
import { ScrollView, View, ActivityIndicator, Alert, SectionList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
//component
import { MainText, MenuTitleText, MenuContentText, JuaText, NotoSansText } from "../components/TextStyle";
import ExpandProduct from './ExpandProduct';
//constants
import Color from '../constants/Color';
import { merchadiseListDetail } from '../constants/LIST';
//pages
import AppWindow from '../constants/AppWindow';
//for server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';

const HOMEINDICATOR = AppWindow.HomeIndicator;

const Box = styled.View`
    width: 95%;
    flex: 1;
    border: 2px solid ${Color.menuBorder};
    background-color: ${Color.menuBackgrund};
    border-radius: 5px;
`;
const MenuTitle = styled.View`
    width: 100%;
    height: 35px;
    background-color: white;
    align-items: center;
    justify-content: center;
    border-bottom-color: ${Color.menuTitleBorder};
    border-bottom-width: 2px;
    flex-direction: row;
`;
const MenuContent = styled.View`
    flex: 1;
`;
const OptionView = styled.View`
    height: 70px;
    justify-content: center;
    align-items: center;
`;
const OptionName = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
    height: 100%;
    margin-left: 10px;
    margin-right: 10px;
    padding: 0px 10px;
`;
const ProductView = styled.View`
    width: 95%;
    padding: 10px 10px;
    background-color: white;
    border: 2px;
    border-color: ${Color.main};
    border-radius: 5px;
`;



function ProductPage(props){
    const [show, setShow] = React.useState('tinting');
    const [productData, setProductData] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const scrollX = React.useRef();
    
    React.useEffect(()=>{
        getData();
    },[]);

    async function getData(){
        try{
            setIsLoading(true);
            const auth = await checkJwt();
            if(auth !== null){
                const response = await axios({
                    method: 'GET',
                    url : `${server.url}/api/product/${props.companyId}`,
                    headers : {Auth: auth},
                })
                const rawData = response.data.data;
                console.log("load product");
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

    function Product(props){
        return(
            <View style={{alignItems: 'center', marginBottom: 10}}>
                <ProductView>
                    {_.map(props.list , (item) => {
                        return(
                            <ExpandProduct item={[item]} key={item.id}></ExpandProduct>
                        );
                    })}
                </ProductView>
            </View>
        )
    }


    return(
        <View style={{flex: 1, alignItems: 'center', backgroundColor: 'white', paddingBottom: HOMEINDICATOR, paddingTop: 20}}>
            <Box>
                <MenuTitle>
                    <MenuTitleText>취급상품</MenuTitleText>
                </MenuTitle>
                <MenuContent>
                    <View style={{height: 70}}>
                        <SectionList 
                            contentContainerStyle={{height: 70, backgroundColor: Color.menuBackgrund}}
                            horizontal={true}
                            showsHorizontalScrollIndicator ={false}
                            ref={scrollX}
                            sections={merchadiseListDetail}
                            keyExtractor={(item, index) => item + index}
                            renderItem={({item, section} ) => {
                            return(
                                <OptionView key={item.title}>
                                    <OptionName onPress={async ()=>{setShow(section.title); scrollX.current.scrollToLocation({animated: true, itemIndex: 0, sectionIndex: section.id, viewPosition: 0.5})}}>
                                        <NotoSansText style={{color: 'black', fontWeight: 'bold', fontSize: show === section.title ? 20 : 15}}>{'#'+item}</NotoSansText>
                                    </OptionName>
                                </OptionView>
                            );
                        }}/>
                    </View>
                    <View style={{flex: 1}}>
                        <ScrollView 
                        scrollEnabled={true}
                        showsVerticalScrollIndicator ={false}>
                            {productData !== null && <>
                            {(show === 'tinting' && !isLoading) && <Product list={productData.tinting} title={'틴팅'}/>}
                            {(show === 'blackBox' && !isLoading) && <Product list ={productData.blackbox} title={'블랙박스'}/>}
                            {(show === 'deafening' && !isLoading) && <Product list={productData.deafening} title={'방음'}/>}
                            {(show === 'glassCoating' && !isLoading) && <Product list ={productData.glasscoating} title={'유리막코팅'}/>}
                            {(show === 'bottomCoating' && !isLoading) && <Product list ={productData.bottomcoating} title={'하부코팅'}/>}
                            {(show === 'ppf' && !isLoading) && <Product list ={productData.ppf} title={'PPF'}/>}
                            {(show === 'afterblow' && !isLoading) && <Product list ={productData.afterblow} title={'애프터블로우'}/>}
                            {(show === 'battery' && !isLoading) && <Product list ={productData.battery} title={'보조배터리'}/>}
                            {(show === 'wrapping' && !isLoading) && <Product list ={productData.wrapping} title={'랩핑'}/>}
                            {(show === 'etc' && !isLoading) && <Product list ={productData.etc} title={'기타'}/>}
                            </>}
                        </ScrollView>
                    </View>
                </MenuContent>
            </Box>
        </View>
    )
}

export default ProductPage;