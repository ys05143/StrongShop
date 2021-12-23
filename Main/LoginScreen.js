import React from 'react' ;
import styled from 'styled-components/native';
import { Title , Button , Text, } from 'react-native-paper';
import { ActivityIndicator, Alert, ScrollView, TextInput, Platform } from 'react-native';
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
import TotalView from '../components/TotalView';
//constants
import Color from '../constants/Color';
//server
import axios from 'axios';
import server from '../server';
import checkJwt from '../function/checkJwt';
import checkErrorCode from '../function/checkErrorCode';

const View = styled.View`
    flex : 1 ;
`;
const styles = {
    title : {
        padding: 10 ,
        fontSize: 30 ,
        fontFamily: 'DoHyeon-Regular' ,
    } ,
    mainTitle : {
        color: 'white',
        padding: 10 ,
        fontSize: 30 ,
        fontFamily: 'DoHyeon-Regular' ,
    } ,
    description : {
        fontSize: 17 , 
        margin: 10
    } ,
    button : {
        flex: 1 , 
        borderWidth: 1 ,
        margin: 5 ,
        borderColor: 'white'
    } ,
    loginButton : {
        width: '70%' ,
        borderWidth: 1 ,
        margin: 20 ,
        padding: 5,
        borderColor: 'white'
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
  

function LoginScreen(props) {
    const snapPoints = React.useMemo(() => ['80%'], []);
    const [userName,setUserName] = React.useState("");
    const [dtoData,setDtoData] = React.useState(null);
    const [loginVer, setLoginVer] = React.useState('');
    const [isSending, setIsSending] = React.useState(false);

    const bottomSheetModalRef = React.useRef(null);
    const handlePresentModalPress = React.useCallback(() => {
        bottomSheetModalRef.current?.present();
      }, []);
    const handleDismissModalPress = React.useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);  


    // 카카오 AccessToken을 서버로 전달
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
                handlePresentModalPress();       
                setDtoData(res.data.data);         
            }
            // 이미 가입된 회원 => jwt token을 발급받음.
            else if ( res.data.statusCode == 200 ) {
                const auth = res.headers.auth;
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
                })
            }
            setIsSending(false);
        })
        .catch( e =>  {
            // 서버 통신에러
            console.log(e);
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
    async function requestSignIn(name) {
        setIsSending(true);
        //console.log(`${server.url}/api/login/user/${name}`);
        let fcmToken = '';
        await messaging().getToken()
        .then( res =>{
            fcmToken = res;
        });
        // 서버에게 dtoData 전달
        axios({
            method: 'POST',
            url : `${server.url}/api/login/user/${name}` ,
            data : {
                ...dtoData ,
                phoneNumber: '01012341234' ,
                name: '허지훈',
                fcmToken: fcmToken,
            }
        })
        .then(async(res) =>{
            //console.log(res);
            // 가입성공
            if ( res.data.statusCode == 200 ) {
                const auth = res.headers.auth;
                // jwt token cache
                try {
                    await storage.store('auth',{auth : auth});
                    // 로그인 화면 제거
                    props.navigation.goBack();
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
            //
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


    const handleKakaoLogin = async() =>  {
        // 카카오 인증요청
        setIsSending(true);
        setLoginVer('kakao');
        const token = await login().catch(e=>{console.log(e)});
        //console.log(token);
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

    // 휴대폰인증
    function phoneAuth(response) {
       if ( response.success ) {
           // 최종 회원가입요청
           requestSignIn(loginVer);
       }
       else {
           // 인증 취소 / 대표자명과 맞지않을때
           handleDismissModalPress();
       }
    }

    async function logOut(){
        const auth = await checkJwt();
        if(auth !== null){
            axios({
                method : 'PUT' ,
                url : `${server.url}/api/logout/user` ,
                headers : {Auth: auth},
            })
            .then(res => {
                console.log(res);
                AsyncStorage.removeItem('auth', ()=>{
                    Alert.alert(
                        '로그아웃',
                        '로그아웃 하였습니다.',
                        [
                            {text: '확인', onPress: async() => {
                                    const allKey = await AsyncStorage.getAllKeys();
                                    console.log(allKey);
                                    props.navigation.popToTop();
                                }
                            },
                        ],
                        { cancelable: false }
                    );
                });
            })
            .catch(e=>{
                checkErrorCode(e, props.navigation);
            })
        }
        else {
            Alert.alert(
                '오류',
                '로그인상태가 아닙니다.',
                [
                    {text: '확인', onPress: () => {} },
                ],
                { cancelable: false }
            );
        }
    }

    return(
        <BottomSheetModalProvider>
        <TotalView color={Color.main} notchColor={Color.main} homeIndicatorColor={Color.main}>
            <View style={{ flex: 1 , justifyContent: 'center' , alignItems: 'center' }}>
                {/* <ImageBackground source={{ uri: 'https://picsum.photos/1' }} resizeMode='cover' style={{ justifyContent:'center' , alignItems: 'center' , flex: 1   }}> */}
                    <Title style={styles.mainTitle}>최강샵</Title>
                    <Text style={{ color: 'white'}}>나만의 샵을 관리해요.</Text>
                    <Button style={styles.loginButton} color='white' icon='chat' onPress={handleKakaoLogin}>
                        카카오로 시작하기
                    </Button>
                    <Button style={styles.loginButton} color='white' icon='alpha-n-box' onPress={()=>naverLogin(initials)}>
                        네이버로 시작하기
                    </Button>
                {/* </ImageBackground> */}

                {/* BottomSheet 모달  */}
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    snapPoints={snapPoints}
                    // enablePanDownToClose={false}
                >
                <KeyboardAwareScrollView>
                    <>
                        <Title style={styles.title}> {userName}님으로 인증할게요.(2/2)</Title>
                        <View style={{ width: '100%' , height: 700 }}>
                            <Button onPress={()=>requestSignIn(loginVer)} disabled={isSending}>테스트</Button>
                        {/* <IMP.Certification
                        userCode={'iamport'}  // 가맹점 식별코드
                        // tierCode={'AAA'}      // 티어 코드: agency 기능 사용자에 한함
                        data = {{
                            merchant_uid: `mid_${new Date().getTime()}`,
                            company: '',
                            carrier: '',
                            name: '',
                            phone: '',
                            min_age: '',
                        }
                        }
                        loading={<ActivityIndicator />} // 로딩 컴포넌트
                        callback={phoneAuth}   // 본인인증 종료 후 콜백
                    />   */}
                    </View>
                </>
                    </KeyboardAwareScrollView>
                </BottomSheetModal> 
            </View>
            <Icon name={'chevron-back-outline'} size={25} style={{position: 'absolute', marginTop: 10, marginLeft: 10}} color={'white'} onPress={()=>{props.navigation.goBack();}}/>
            {/* <Icon name={'power-outline'} size={25} style={{position: 'absolute', paddingTop: 10, paddingRight: 10, alignSelf: 'flex-end'}} color={'white'} onPress={()=>{logOut();}}/> */}
            {isSending && <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', position: 'absolute', backgroundColor: 'transparent'}}>
                <ActivityIndicator size = 'large' color= {'white'}/>
            </View>}

        </TotalView>
        </BottomSheetModalProvider>
    );
}

export default LoginScreen;