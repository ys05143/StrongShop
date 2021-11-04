import React from 'react';
import styled from 'styled-components/native';
import { Title  , ProgressBar, Avatar , Appbar , List , Badge , Button , IconButton , Modal , Portal , Provider}  from 'react-native-paper';
import { FlatList , ScrollView, Alert, Text } from 'react-native';
import Color from '../constants/Color';
import { Image } from 'react-native';
import _, { set } from 'lodash';
import Icon from "react-native-vector-icons/Ionicons";
//import { request , PERMISSIONS } from 'react-native-permissions';
import Swiper  from 'react-native-swiper';
import AppWindow from '../constants/AppWindow';

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;
const NOTCH = AppWindow.IOS_notch;
const Total = styled.View`
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    margin-top: ${NOTCH}px;
`;
const Container = styled.SafeAreaView``;
const View = styled.View``;
const Row = styled.View`
    flex-direction: row ;
    align-items: center;
`;
const CButton = styled.TouchableOpacity`
    width: 100%;
    height: 300px;
    margin-bottom: 10px;
`;
const SwiperView = styled.View`
    width: 100%;
    flex: 1;
`;
const InfoView = styled.View`
    width: 100%;
    height: 250px;
    background-color: lightgray;
    border-radius: 10px;
    padding: 5px 10px;
`;

const styles = {
    title : {
        fontFamily : 'DoHyeon-Regular' ,
        fontSize: 30 ,
        padding: 20
    } ,
    progress : {
      height: 5
    },
    icon : {
        backgroundColor: 'transparent'

    } ,
    text : {
        fontSize: 17 ,
        fontWeight: 'bold'
    },
    subTitle : {

    }
}


const TEXT = {
    first : '탁송주소지를 아래 주소로 변경해주세요.' ,
    second : '업체에서 신차검수 중입니다.' ,
    third : '업체에서 시공진행 중입니다.' ,
    fourth : '모든 시공이 완료되었습니다.'
}

// 화면 구성 할 때 데이타
const progress = [
    {
        state: 4
    },
    {
        title : '차량 탁송지 지정하기' ,
        text: '❗️❗️고객님께서 \'직접\'\n 구매사를 통해 변경해주셔야 합니다.❗️❗️'
    } ,
    {
        title : '신차검수 현황' ,
    } ,
    {
        title : '시공진행 현황' ,
    } ,
    {
        title : '시공완료/출고' ,
        text: '🎉오래 기다리셨습니다!!!🎉\n고객님의 시공이 모두 완료되었습니다.\n아래의 주소로 차량을 찾으러오세요.🚗'
    } ,
]

//서버로 부터 받은 데이터
const DATA=[
    {
        state: 4
    },{
        address: '서울 광진구 능동로 120'
    },{
        images: ['https://picsum.photos/0','https://picsum.photos/100', 'https://picsum.photos/200' ]
    },{
        images: ['https://picsum.photos/0','https://picsum.photos/100', 'https://picsum.photos/200' ]
    },{
        address: '서울 광진구 능동로 120',
        finalReceipt: '틴팅: 루마썬팅\n블랙박스: 파인테크\nPPF: \n보조배터리: \n애프터블로우: \n방수: \n랩핑: \n유리막코팅: \n언더코팅\n'
    }
]


function ProgressScreen( props ) {
    const[state,setState] = React.useState(props.route.params.state);
    const[pictures,setPictures] = React.useState(null);
    const[refresh,setRefresh] = React.useState(false);
    const[visible,setVisible] = React.useState(false);
    const[selectedImage, setSelectedImage] = React.useState(null);
    const[shopName, setShopName] = React.useState(props.route.params.companyName);

    // openNew = async () => {
    //     //request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    //     await MultipleImagePicker.openPicker({
    //         mediaType: 'image',
    //         // selectedAssets: pictures,
    //         doneTitle: "완료",
    //         selectedColor: "#162741",
    //     })
    //     .then(res => {
    //        url = [] ;
    //        res.map(file =>  {
    //         //    newPath = file.path.replace('file://','').replace('file:///','file://');
    //            url.push(file.path);
    //        });
    //        if ( pictures != null ) {
    //        files = pictures ;
    //        url.map(file=>{
    //            files.push(file);
    //        })
    //        setPictures(files);
    //        setRefresh(true);
    //        setRefresh(false);
    //        }
    //        else {
    //            setPictures(url);
    //        }

    //     }) 
    //     .catch(e => { });
       
    // }

    const RenderItem = ({item}) =>  {
        return(
            <CButton onPress={ () =>  { setSelectedImage(item); setVisible(true) }}>
                <Image source={{ uri : item }} style={{ width: '100%' , height: '100%' }} resizeMode='contain'/>
            </CButton>
        )
    }

    function FinalConfirm(){
        Alert.alert(
            '확인',
            '출고를 확정하시겠습니까?',
            [
              {text: '네', onPress: () => {
                props.navigation.navigate("RegisterReviewScreen",{shopName: shopName, finalReceipt: DATA[4].finalReceipt});
              }},
              {text: '아니요', onPress: () => {}}
            ],
            { cancelable: true }
        );
    }

    return(
        <Provider>
        {/* 사진 상세보기 */}
        <Portal>
        <Modal visible={visible} onDismiss={() => { setVisible(false) }} contentContainerStyle={{ width: '100%', height: 600 , backgroundColor: 'lightgray' }}>
            <IconButton icon='close' style={{ alignSelf: 'flex-end'}} onPress={ () => { setVisible(false) }} />
            <SwiperView>
                <Image source={{ uri : selectedImage }} style={{ width: '100%' , height: '100%' }} resizeMode='contain'/>
            </SwiperView>
        </Modal>
        </Portal>

        <View style={{flex:1}}>
            <View>
                <Appbar.Header style={{ backgroundColor: Color.main }}>
                <Appbar.BackAction onPress={() => { props.navigation.goBack() }} />
                <Appbar.Content title={shopName} titleStyle={{ fontFamily : 'DoHyeon-Regular' , fontSize: 30}} />
                <View>
                    <Appbar.Action icon="chat" onPress={() => { props.navigation.navigate('ChatDetail',{ name : props.route.params.name }) }} color='white'/>
                    <Badge size={12} style={{position: 'absolute'}}/>
                </View>
                </Appbar.Header>  
                <ProgressBar style={styles.progress} progress={state/4} color='red'  
                    theme = {{ animation : { scale : 5 }  }}
                />
                <Title style={styles.title}>시공 진행상황</Title>
                <Title style={{ marginLeft: 20 , color : 'gray' ,marginBottom: 10}}>
                    {
                        state == 1 ? TEXT.first : state == 2 ? TEXT.second : state == 3 ? TEXT.third : TEXT.fourth 
                    }
                </Title>
            </View>
            <SwiperView>
                <Swiper horizontal={true} index={state-1}
                    showsButtons={true}
                    showsHorizontalScrollIndicator={true}
                    showsPagination={false}
                    prevButton={<IconButton icon='chevron-left' color={'black'} size={25}/>}
                    nextButton={<IconButton icon='chevron-right' color={'black'} size={25}/>}
                    overScrollMode='auto'
                    loop={false}
                    // renderPagination = { (index,total) => <Title style={{ alignSelf: 'center'}}>{ index+1}/{total}</Title>}

                >  
                    {state >= 1 && <SwiperView>
                        <Title style={{ padding: 10 , color : state === 1 ? 'red' : 'black'}}>
                        {'1단계: '}{progress[1].title}
                        </Title>
                        <View style={{width: '75%', flex: 1,  alignSelf: 'center'}}>
                            <Title style={{fontSize: 15,}}>{progress[1].text}</Title>
                            <Title style={{fontWeight: 'bold', paddingHorizontal: 15, marginTop: 15}}>{'=> '+DATA[1].address}</Title>
                        </View>
                    </SwiperView>}
                    
                    {state >= 2 && <SwiperView>
                        <Title style={{ padding: 10 , color : state === 2 ? 'red' : 'black'}}>
                        {'2단계: '}{progress[2].title}
                        </Title>
                        <View style={{width: '75%', height: '100%', alignSelf: 'center'}}>
                            <FlatList
                                data={DATA[2].images}
                                scrollEnabled={true}
                                renderItem={RenderItem}
                                keyExtractor={item => item}
                                refreshControl={refresh}
                            />
                        </View>
                    </SwiperView>}

                    {state >= 3 && <SwiperView>
                        <Title style={{ padding: 10 , color : state === 3 ? 'red' : 'black'}}>
                        {'3단계: '}{progress[3].title}
                        </Title>
                        <View style={{width: '75%', height: '100%', alignSelf: 'center'}}>
                            <FlatList
                                data={DATA[3].images}
                                scrollEnabled={true}
                                renderItem={RenderItem}
                                keyExtractor={item => item}
                                refreshControl={refresh}
                            />
                        </View>
                    </SwiperView>}

                    {state >= 4 && <SwiperView>
                        <Title style={{ padding: 10 , color : state === 4 ? 'red' : 'black'}}>
                        {'4단계: '}{progress[4].title}
                        </Title>
                        <View style={{width: '75%', flex: 1,  alignSelf: 'center'}}>
                            <Title style={{padding: 10, fontSize: 15}}>{progress[4].text}</Title>
                            <Title style={{fontWeight: 'bold', paddingHorizontal: 15, marginTop: 15}}>{'=> '+DATA[4].address}</Title>
                            <Text style={{color: 'red', marginVertical: 5, alignSelf: 'center'}}>/*모든시공이 완료되었는지 반드시 확인해주세요.*/</Text>
                            <InfoView>
                                <ScrollView>
                                    <Row>
                                        <Icon name={'ellipse'} style={{marginRight: 5}}/>
                                        <Title>시공내역</Title>
                                    </Row>
                                    <Text style={{fontSize: 15, marginRight: 5}}>{DATA[4].finalReceipt}</Text>
                                </ScrollView>
                            </InfoView>
                            <Button style={{marginTop: 20}} mode={'contained'} color={Color.main} onPress={()=>{FinalConfirm()}}>출고 확정</Button>
                        </View>
                    </SwiperView>}
                    
                </Swiper>
            </SwiperView>
        </View>
        </Provider>
    );
}

export default ProgressScreen;