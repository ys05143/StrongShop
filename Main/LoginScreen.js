import React from 'react' ;
import styled from 'styled-components/native';
import { Title , Button , Text, } from 'react-native-paper';
import axios from 'axios';
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
import server from '../server';

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
    const [fcmToken, setFcmToken] = React.useState();
    const [loginVer, setLoginVer] = React.useState('');

    const bottomSheetModalRef = React.useRef(null);
    const handlePresentModalPress = React.useCallback(() => {
        bottomSheetModalRef.current?.present();
      }, []);
    const handleDismissModalPress = React.useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);  

    React.useEffect(()=>{
        messaging().getToken().then( res =>{
          setFcmToken(res);
        });
    },[]);

    // 카카오 AccessToken => 서버 
    function requestAccessToken(accessToken, name) {
        axios({
            method : 'GET' ,
            url : `${server.url}/api/login/user/${name}` ,
            headers : {
                Authorization : accessToken,
                FCM : fcmToken,
            } ,
        })
        .then( async (res) =>  {
            // 캐시삭제
            //AsyncStorage.clear();
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
                    //
                })

            }

        })
        .catch( e =>  {
            // 서버 통신에러
        })
    }

    function requestSignIn(name) {
        console.log(`${server.url}/api/login/user/${name}`);
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
                    console.log('cache 에러');
                }
            }   

        })
        .catch(e => {
            //
        })
    }


    const handleKakaoLogin = async() =>  {
        // 카카오 인증요청
        setLoginVer('kakao');
        const token = await login().catch(e=>{console.log(e) });
        console.log(token);
        // 카카오 인증취소 / 인증실패 
        if ( token == null ) return;
        const accessToken = 'Bearer ' + token.accessToken ;        
        try {
            // token 서버에게 전달 
            requestAccessToken(accessToken, 'kakao');
        }
        catch {
            Alert.alert('다시 요청해주세요.');
        }

    }

    const naverLogin = props => {
        return new Promise((resolve, reject) => {
          NaverLogin.login(props, (err, token) => {
            setLoginVer('naver');
            const accessToken = 'Bearer ' + token.accessToken ; 
            requestAccessToken(accessToken,'naver');
            if (err) {
              reject(err);
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
        await AsyncStorage.removeItem('auth', ()=>{
            Alert.alert(
                '로그아웃',
                '로그아웃 하였습니다.',
                [
                    {text: 'OK', onPress: async() => {
                            const allKey = await AsyncStorage.getAllKeys();
                            console.log(allKey);
                            //props.navigation.navigate("MainScreen");
                        }
                    },
                ],
                { cancelable: false }
            );
        });
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
                            <Button onPress={()=>requestSignIn(loginVer)}>테스트</Button>
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
            <Icon name={'power-outline'} size={25} style={{position: 'absolute', marginTop: 10, marginRight: 10, alignSelf: 'flex-end'}} color={'white'} onPress={()=>{logOut();}}/>
        </TotalView>
        </BottomSheetModalProvider>
    );
}

export default LoginScreen;