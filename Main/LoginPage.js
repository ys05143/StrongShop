import React from 'react' ;
import styled from 'styled-components/native';
import { Title , Button , Text, } from 'react-native-paper';
import { ActivityIndicator, Alert, ScrollView, TextInput, Platform, TouchableOpacity, View, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { login } from '@react-native-seoul/kakao-login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import IMP from 'iamport-react-native';
import { NaverLogin, getProfile } from "@react-native-seoul/naver-login";
import Icon  from "react-native-vector-icons/Ionicons";
import messaging from '@react-native-firebase/messaging';
//functoin
import storage from '../function/storage';
//component
import Background from "../components/Background";
import { MainText, MenuTitleText, MenuContentText, JuaText, NotoSansText } from "../components/TextStyle";
import TopBox from "../components/TopBox";
import Row from "../components/Row";
//constants
import Color from '../constants/Color';
//server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';
import checkErrorCode from '../function/checkErrorCode';
import TotalIndicator from '../components/TotalIndicator';

const RowCenter = styled.View`
    flex-direction: row;
    align-items: center;
`;
const InputForVerify = styled.TextInput`
    width: 100%;
    height: 70px;
    padding: 10px;
    background-color: #e5e5e5;
    margin-top: 10px;
    border-color: ${(props) => (props.focused ? Color.main : '#e5e5e5')};
    border-bottom-width: 2px;
    font-size: 17px;
    justify-content: center;
`;
const styles = {
    title : {
        padding: 10 ,
        fontSize: 30 ,
        fontFamily: 'Jua-Regular' ,
    } ,
    mainTitle : {
        color: 'black',
        padding: 10 ,
        fontSize: 30 ,
        fontFamily: 'Jua-Regular' ,
    } ,
    description : {
        fontSize: 17 , 
        margin: 10
    } ,
    loginButton : {
        width: 300 ,
        height: 50,
        borderWidth: 1 ,
        margin: 20 ,
        padding: 5,
        borderColor: 'black'
    } ,
    guideButton: { 
        alignSelf: 'flex-start', 
        padding: 10 ,
        borderWidth: 1 , 
        borderColor: 'black' , 
        margin: 5
    }

}
const iosKeys = {
    kConsumerKey: "ClD3jS3tjfj969pqrxW6",
    kConsumerSecret: "BVCzkiHTVf",
    kServiceAppName: "strongshop-customer",
    kServiceAppUrlScheme: "strongshop-customer" // only for iOS
  };
  
  const androidKeys = {
    kConsumerKey: "ClD3jS3tjfj969pqrxW6",
    kConsumerSecret: "BVCzkiHTVf",
    kServiceAppName: "strongshop-customer"
  };
  
  const initials = Platform.OS === "ios" ? iosKeys : androidKeys;
  

function LoginPage(props) {
    const snapPoints = React.useMemo(() => ['95%'], []);
    const [userName,setUserName] = React.useState("");
    const [dtoData,setDtoData] = React.useState(null);
    const [loginVer, setLoginVer] = React.useState('');
    const [isSending, setIsSending] = React.useState(false);
    const [stage, setStage] = React.useState(0);
    const [isGeneral, setIsGeneral] = React.useState(true);
    const [businessNumber, setBusinessNumber] = React.useState('');
    const [openDate, setOpenDate] = React.useState('');
    const [bossName, setBossName] = React.useState('');
    const [focusInput, setFocusInput] = React.useState(0);

    const bottomSheetModalRef = React.useRef(null);
    const handlePresentModalPress = React.useCallback(() => {
        bottomSheetModalRef.current?.present();
      }, []);
    const handleDismissModalPress = React.useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);  


    // AccessToken을 서버로 전달
    async function requestAccessToken(accessToken, name) {
        setIsSending(true);
        let fcmToken = '';
        await messaging().getToken()
        .then( res =>{
            fcmToken = res;
        });
        axios({
            method : 'GET' ,
            url : `${server.url}/api/login/user/${name}` ,
            headers : {
                Authorization : accessToken,
                FCM : fcmToken,
            } ,
        })
        .then( async (res) =>  {
            // 회원가입 필요
            if ( res.data.statusCode == 201 ) {
                // 추가정보를 사용자로부터 받음.
                setDtoData(res.data.data);
                setUserName(res.data.data.nickname);
                handlePresentModalPress();                
            }
            // 이미 가입된 회원 => jwt token을 발급받음.
            else if ( res.data.statusCode == 200 ) {
                const auth = res.headers.auth;
                if(auth === null || auth === undefined){
                    Alert.alert('앱을 재시작하세요.');
                }
                else{
                    // jwt token cache
                    await storage.store('auth',{ auth : auth });
                    // cache 성공 시 -> 메인화면
                    await storage.fetch('auth')
                    .then( res => {
                        if ( res != null ) ;
                        //로그인 화면 지우기
                        props.navigation.goBack(); 
                    })
                    .catch ( e => { 
                        Alert.alert('앱을 재시작하세요.');
                    });
                }
            }
            setIsSending(false);
        })
        .catch( e =>  {
            // 서버 통신에러
            if(e.response.status === 406){
                Alert.alert(
                    '로그인 실패',
                    '해당 계정이 업체로 로그인 되어있습니다.',
                    [
                        {text: '확인', onPress: () => {}},
                    ],
                    { cancelable: false }
                );
            }
            else if(e.response.status === 403){
                Alert.alert(
                    '현재 다른 기기에서 로그인 중입니다.',
                    '다시 로그인 후 이용 가능합니다.',
                    [
                        {text: '확인', onPress: () => {}},
                    ],
                    { cancelable: false }
                );
            }
            else{
                Alert.alert(
                    '오류',
                    '앱을 다시 실행해주십시오.',
                    [
                        {text: '확인', onPress: () => {}},
                    ],
                    { cancelable: false }
                );
            }
            setIsSending(false);
        })
    }

    //bottom sheet 에서 만들어지 정보를 서버에 전달
    async function requestSignIn(loginVer) { // 회원가입
        setIsSending(true);
        let fcmToken = '';
        await messaging().getToken()
        .then( res =>{
            fcmToken = res;
        });
        // 서버에게 dtoData 전달
        axios({
            method: 'POST',
            url : `${server.url}/api/login/user/${loginVer}` ,
            data : {
                ...dtoData ,
                phoneNumber: '01012341234' , //본인인증결과로 삽입
                name: isGeneral ? userName : bossName,
                fcmToken: fcmToken,
                businessNumber: isGeneral ? null : businessNumber, //딜러인경우 사업자등록번호 전달
                role: isGeneral ? 'user' : 'dealer' 
            }
        })
        .then(async(res) =>{
            // 가입성공
            if ( res.data.statusCode == 200 ) {
                const auth = res.headers.auth;
                // jwt token cache
                try {
                    if(auth === null || auth === undefined){
                        Alert.alert('앱을 재시작하세요.');
                    }
                    else{
                        await storage.store('auth',{auth : auth});
                        // 로그인 화면 제거
                        props.navigation.goBack();
                    }
                }
                // cache 성공 시 -> 메인화면
                catch {
                    // cache 저장 에러
                    Alert.alert('앱을 재시작하세요.');
                }
            }   
            setIsSending(false);

        })
        .catch(e => {
            console.log(e);
            if(e.response.status === 406){
                Alert.alert(
                    '실패',
                    '현재 해당 계정으로 업체에 로그인이 되어있습니다.',
                    [
                        {text: '확인', onPress: () => {}},
                    ],
                    { cancelable: false }
                );
            }
            else if(e.response.status === 403){
                Alert.alert(
                    '현재 다른 기기에서 로그인 중입니다.',
                    '기존 기기에서 로그아웃 후 이용 가능합니다.',
                    [
                        {text: '확인', onPress: () => {}},
                    ],
                    { cancelable: false }
                );
            }
            else{
                Alert.alert(
                    '오류',
                    '앱을 다시 실행해주십시오.',
                    [
                        {text: '확인', onPress: () => {}},
                    ],
                    { cancelable: false }
                );
            }
            setIsSending(false);
        })
    }


    const kakaoLogin = async() =>  {
        setStage(0);
        setIsSending(true);
        setLoginVer('kakao');
        const token = await login().catch(e=>{console.log(e)});
        // 카카오 인증취소 / 인증실패 
        if ( token == null ) {
            Alert.alert('카카오톡 로그인을 진행할 수 없습니다.');
            setIsSending(false);
            return;
        }
        const accessToken = 'Bearer ' + token.accessToken ;        
        try {
            // token 서버에게 전달 
            requestAccessToken(accessToken, 'kakao');
        }
        catch {
            Alert.alert('로그인을 다시 요청해주세요.');
        }

    }

    const naverLogin = props => {
        setStage(0);
        setIsSending(true);
        return new Promise((resolve, reject) => {
          NaverLogin.login(props, (err, token) => {
            setLoginVer('naver');
            if ( token == null ) {
                Alert.alert('네이버 로그인을 진행할 수 없습니다.');
                setIsSending(false);
                return;
            }
            const accessToken = 'Bearer ' + token.accessToken ; 
            requestAccessToken(accessToken,'naver');
            if (err) {
              reject(err);
              setIsSending(false);
              return;
            }
            resolve(token);
          });
        });
    };

    async function testLogin(){
        setStage(0);
        setIsSending(true);
        let fcmToken = '';
        await messaging().getToken()
        .then( res =>{
            fcmToken = res;
            axios({
                method : 'POST' ,
                url : `${server.url}/api/login/test/user` ,
                headers : {
                    FCM : fcmToken,
                },
            })
            .then(res=>{
                if ( res.data.statusCode == 201 ) {
                    const auth = res.headers.auth;
                    try {
                        if(auth === null || auth === undefined){
                            alert('토큰을 받아오지못했습니다.');
                        }
                        else{
                            storage.store('auth',{auth : auth})
                            .then(res=>{
                                props.navigation.goBack();
                            });
                        }
                    }
                    catch {
                        alert('토큰을 받아오는과정에서 오류가 생겼습니다.');
                    }
                }
                else{
                    alert('네트워크 오류')
                }
            })
            .catch(e=>alert('로그인 오류'));
            setIsSending(false);
        });
    }

    // 휴대폰인증
    function phoneAuth(response) {
        console.log(response);
        if ( response.success ) {
            // 최종 회원가입요청
            requestSignIn(loginVer);
        }
        else {
            // 인증 취소
            handleDismissModalPress();
        }
    }

    // 사업자등록번호 인증
    function verify() {
        // 사업자등록 인증
        axios({
            method: 'post' ,
            url :  'https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=Te7HPGFjEojhi4%2B4sRjikWXlBCD1Bg%2FAVQzCa9A4gUihNPh%2FRxaFkxk2IJ670MBNRDarlpFsPX67kda7XMXaLA%3D%3D' ,
            data : {
                businesses : [
                    {
                        b_no : businessNumber ,
                        start_dt : openDate ,
                        p_nm : bossName ,
                        p_nm2 : '' ,
                        b_nm : '' ,
                        corp_no : '' ,
                        b_sector : '' ,
                        b_type : '' ,
                    }
                ]
            }
        })
        .then( res =>   { 

            if(res.data.data[0].valid === '01')  {
                setStage(2);
            }
            else Alert.alert('유효하지 않은 사업자등록증입니다.','다시 한번 확인해주세요.');
        }) 
        .catch(e => Alert.alert('필수사항을 입력해주세요.') ) ;
    }

    const Top = ()=>{
        return(
            <TopBox topbar={<TopBar/>}>
                <Row style={{alignItems: 'center'}}>
                    <Image source={require('../resource/img_character_face.png')} style={{width: 45, height: 45, marginRight: 5}} resizeMode={'contain'}/>
                    <JuaText style={{fontSize: 40, color: 'white'}}>카#</JuaText>
                </Row>
                <Row style={{marginTop: 20}}>
                    <JuaText style={{fontSize: 25, color: Color.mainText}}>나만의 샵을 관리해요.</JuaText>
                </Row>
            </TopBox>
        )
    }
    
    const TopBar = () => {
        return(
            <View style={{width: '100%', height: '100%', paddingRight: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                <TouchableOpacity style={{padding: 5, marginLeft: 15}} onPress={()=>{props.navigation.goBack();}}>
                    <Icon name="close" size={23} color={Color.mainText}></Icon>
                </TouchableOpacity>
            </View>
        )
    }

    return(
        <BottomSheetModalProvider>
        <Background topbox={<Top/>} backgroundColor={Color.menuBackgrund}>
            <View style={{ flex: 1 , justifyContent: 'center' , alignItems: 'center'}}>
                <Image source={require('../resource/img_character_icon.png')} style={{marginBottom: 20, width: 100, height: 100}}/>
                <TouchableOpacity style={{borderRadius: 5, overflow: 'hidden', marginTop: 20}} onPress={kakaoLogin}>
                    <Image source={require('../resource/kakao_login_medium_wide.png')} style={{width: 300, height: 50}} resizeMode={'contain'}/>
                </TouchableOpacity>
                <TouchableOpacity style={{borderRadius: 5, overflow: 'hidden', marginTop: 20}} onPress={()=>{naverLogin(initials)}}>
                    <Image source={require('../resource/btnG_완성형.png')} style={{width: 300, height: 50}} resizeMode={'cover'}/>
                </TouchableOpacity>
                <Button style={styles.loginButton} color='black' icon='alpha-t-box' onPress={()=>{testLogin()}}>
                    테스트 로그인
                </Button>

                {/* BottomSheet 모달  */}
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    snapPoints={snapPoints}
                    enablePanDownToClose={true}
                >
                <KeyboardAwareScrollView extraScrollHeight={30}>
                    {stage === 0 ?<>
                    <Title style={styles.title}> 회원 유형을 선택해주세요.</Title>
                    <RowCenter style={{ width: '100%', height: 100, justifyContent: 'space-around'}}>
                        <TouchableOpacity onPress={()=>{setIsGeneral(true);}} style={{borderWidth: 1, borderColor: 'gray', width: '50%', height: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <Icon name={isGeneral===true?"radio-button-on-outline": "radio-button-off-outline"} size={20} color= 'black'></Icon>
                            <Text>일반고객</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{setIsGeneral(false)}} style={{borderWidth: 1, borderColor: 'gray', width: '50%', height: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <Icon name={isGeneral===false?"radio-button-on-outline": "radio-button-off-outline"} size={20} color= 'black'></Icon>
                            <Text>딜러</Text>
                        </TouchableOpacity>
                    </RowCenter>
                    <Row style={{alignItems: 'center', justifyContent: 'space-around', marginTop: 30}}>
                        <Button mode={"contained"} onPress={() => {handleDismissModalPress()}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} color={Color.main}>취소</Button>
                        <Button mode={"contained"} onPress={() => {isGeneral ? setStage(2) : setStage(1)}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} color={Color.main}>다음</Button>
                    </Row>
                    </> :
                    stage === 1 ? <>
                        <Title style={styles.title}> 사업자인증이 필요합니다.</Title>
                        <View style={{ width: '100%' , height: 700}}>
                            <Text style={{marginLeft: 5, fontSize: 18, marginTop: 10}}> 사업자등록번호</Text>
                            <InputForVerify value={businessNumber}
                                            onChangeText={(value)=>{setBusinessNumber(value)}}
                                            placeholder={"10자리를 입력하세요 (- 없이)"}
                                            placeholderTextColor="gray"
                                            onFocus={()=>{setFocusInput(1)}}
                                            onBlur={()=>setFocusInput(0)}
                                            focused={focusInput === 1}/>
                            <Text style={{marginLeft: 5, fontSize: 18, marginTop: 10}}> 개업일자</Text>
                            <InputForVerify value={openDate}
                                            onChangeText={(value)=>{setOpenDate(value)}}
                                            placeholder={"YYYYMMDD (예) 2021년 9월 27일 -> 20210927"}
                                            placeholderTextColor="gray"
                                            onFocus={()=>{setFocusInput(2)}}
                                            onBlur={()=>setFocusInput(0)}
                                            focused={focusInput === 2}/>
                            <Text style={{marginLeft: 5, fontSize: 18, marginTop: 10}}> 대표자성명</Text>
                            <InputForVerify 
                                            onChangeText={(value)=>{setBossName(value)}}
                                            placeholder={"홍길동"}
                                            placeholderTextColor="gray"
                                            onFocus={()=>{setFocusInput(3)}}
                                            onBlur={()=>setFocusInput(0)}
                                            focused={focusInput === 3}/>
                            <Row style={{alignItems: 'center', justifyContent: 'space-around', marginTop: 30}}>
                                <Button mode={"contained"} onPress={() => {setStage(0)}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} color={Color.main}>이전</Button>
                                <Button mode={"contained"} onPress={() => {requestSignIn(loginVer)}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} color={Color.main}>테스트</Button>
                                {/* <Button mode={"contained"} onPress={() => {verify()}} contentStyle={{width: 110, height: 50}} style={{justifyContent:'center', alignItems: 'center', borderRadius: 10}} color={Color.main}>다음</Button> */}
                            </Row>
                        </View>
                    </> : 
                    stage === 2 ? <>
                    <Title style={styles.title}> {userName} 님으로 인증할게요.</Title>
                    <View style={{ width: '100%' , height: 700 }}>
                        <Button onPress={()=>requestSignIn(loginVer)} disabled={isSending}>테스트</Button>
                        {/* <IMP.Certification
                        userCode={'imp10391932'}  // 가맹점 식별코드
                        // tierCode={'AAA'}      // 티어 코드: agency 기능 사용자에 한함
                        data = {{
                            merchant_uid: `mid_${new Date().getTime()}`,
                            company: '',
                            carrier: '',
                            name: userName,
                            phone: '',
                            min_age: '',
                        }}
                        loading={<View style={{flex: 1}}><ActivityIndicator /></View>} // 로딩 컴포넌트
                        callback={phoneAuth}   // 본인인증 종료 후 콜백
                        />   */}
                    </View>
                </> : <></>}
                </KeyboardAwareScrollView>
                </BottomSheetModal> 
            </View>
        </Background>
        {isSending && <TotalIndicator size={'large'}/>}
        </BottomSheetModalProvider>
    );
}

export default LoginPage;