import React from 'react' ;
import styled from 'styled-components';
import { Title , Button , Text, TextInput } from 'react-native-paper';
import axios from 'axios';
import { ActivityIndicator, Alert, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { login } from '@react-native-seoul/kakao-login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
//component
import TotalView from '../components/TotalView';
//constants
import Color from '../constants/Color';

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

function LoginScreen({getMain}) {
    const snapPoints = React.useMemo(() => ['80%'], []);
    const [businessNumber,setBusinessNumber] = React.useState('');
    const [openDate,setOpenDate] = React.useState('');
    const [bossName,setBossName] = React.useState('');
    const [bottomPage,setBottomPage] = React.useState(1);
    const [dtoData,setDtoData] = React.useState(null);

    const bottomSheetModalRef = React.useRef(null);
    const handlePresentModalPress = React.useCallback(() => {
        bottomSheetModalRef.current?.present();
      }, []);
    const handleDismissModalPress = React.useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);  


    // 카카오 AccessToken => 서버 
    function requestAccessToken(accessToken) {
        axios({
            method : 'GET' ,
            url : `${server.url}/api/login/company/kakao` ,
            headers : {
                Authorization : accessToken
            } ,
        })
        .then( async (res) =>  {
            // 캐시삭제
            AsyncStorage.clear();
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
                await store('auth',{ auth : auth });
                // cache 성공 시 -> 메인화면
                await fetch('auth')
                .then( res => {
                    if ( res != null ) getMain(true);
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

    function requestSignIn() {
        // 서버에게 dtoData 전달
        axios({
            method: 'POST',
            url : `${server.url}/api/login/company/kakao` ,
            data : {
                ...dtoData ,
                businessNumber: businessNumber
            }
        })
        .then(async(res) =>{
            console.log('가입성공:',res);
            // 가입성공
            if ( res.data.statusCode == 200 ) {
                const auth = res.headers.auth;
                // jwt token cache
                try {
                    await store('auth',{auth : auth});
                    getMain(true);
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
        const token = await login().catch(e=>{console.log(e) });
        console.log(token);
        // 카카오 인증취소 / 인증실패 
        if ( token == null ) return;
        const accessToken = 'Bearer ' + token.accessToken ;        
        try {
            // token 서버에게 전달 
            requestAccessToken(accessToken);
        }
        catch {
            Alert.alert('다시 요청해주세요.');
        }

    }

    // 휴대폰인증
    function phoneAuth(response) {
       if ( response.success ) {
           // 최종 회원가입요청
           requestSignIn();
       }
       else {
           // 인증 취소 / 대표자명과 맞지않을때
           handleDismissModalPress();
       }
    }

    // 사업자등록번호 인증
    const verify = () => {

        // 입력양식 체크
        // if ( !/[0-9]{10}/.test(businessNumber) && !/[0-9]{8}/.test(openDate) ) {
        //     Alert.alert('입력양식을 확인해주세요.');
        //     return;
        // }
    
        // Test ( 사업자 인증 성공 후 )
        setBottomPage(2);
        // 서버에게 dtoData 전달
        // axios({
        //     method: 'POST',
        //     url : `${server.url}/api/login/company/kakao` ,
        //     data : {
        //         ...dtoData ,
        //         businessNumber: businessNumber
        //     }
        // })
        // .then(async(res) =>{
        //     // 가입성공
        //     if ( res.data.statusCode == 200 ) {
        //         console.log(res);
        //         const auth = res.headers.auth;
        //         console.log(auth);
        //         // jwt token cache
        //         try {
        //             await store('auth',{ auth : auth } );
        //             getMain(true);
        //         }
        //         // cache 성공 시 -> 메인화면
        //         catch {
        //             // cache 저장 에러
        //             console.log('cache 에러');
        //         }
        //     }   

        // })
        // .catch(e => {
        //     //
            
        // })

        

        // 사업자등록 인증
        // axios({
        //     method: 'post' ,
        //     url :  'https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=Te7HPGFjEojhi4%2B4sRjikWXlBCD1Bg%2FAVQzCa9A4gUihNPh%2FRxaFkxk2IJ670MBNRDarlpFsPX67kda7XMXaLA%3D%3D' ,
        //     data : {
        //         businesses : [
        //             {
        //                 b_no : businessNumber ,
        //                 start_dt : openDate ,
        //                 p_nm : bossName ,
        //                 p_nm2 : '' ,
        //                 b_nm : '' ,
        //                 corp_no : '' ,
        //                 b_sector : '' ,
        //                 b_type : '' ,
        //             }
        //         ]
        //     }
        // })
        // .then( res =>   { 

        //     if(res.data.data[0].valid === '01')  {
        //         setBottomPage(2);
        //     }
        //     else Alert.alert('유효하지 않은 사업자등록증입니다.','다시 한번 확인해주세요.');
        // }) 
        // .catch(e => Alert.alert('필수사항을 입력해주세요.') ) ;

    } ;

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
                    <Button style={styles.loginButton} color='white' icon='alpha-n-box' onPress={handlePresentModalPress}>
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
                    {/* {
                        bottomPage == 1 && (
                        <>
                        // <Button style={styles.guideButton} color='black' icon='information-outline'>이용가이드</Button>
                        <Title style={styles.title}>나만의 샵을 등록해요. (1/2)</Title>
                        
                        <Text style={styles.description}>사업자등록번호</Text>
                        <TextInput theme={{  color: { primary : Color.main }  }}
                            value={businessNumber}
                            onChangeText={value=>{setBusinessNumber(value)}}
                            keyboardType='number-pad'
                            placeholder='10자리를 입력하세요 (-없이) '
                        />
                        
                        <Text style={styles.description}>개업일자</Text>
                        <TextInput theme={{ color: { primary : Color.main }  }}
                            value={openDate}
                            onChangeText={value=>{setOpenDate(value)}}
                            keyboardType='number-pad'
                            placeholder='YYYYMMDD (예) 2021년 9월 27일 -> 20210927'
                        />
                        <Text style={styles.description}>대표자성명</Text>
                        <TextInput theme={{ color: { primary : Color.main , background: 'white' }  }}
                            value={bossName}
                            onChangeText={value=>{setBossName(value)}}
                            placeholder='홍길동'
                        />
                        <Button style={{ marginTop: 10 , height: 50 , justifyContent: 'center' }} 
                            onPress={() => {verify()}}
                            mode={businessNumber.length&&openDate.length&&bossName.length ? 'contained' : 'outlined'}  
                            color={Color.main}>
                            다음
                        </Button>
                        </>
                        )
                    }
                    {
                        bottomPage == 2 && (
                            <>
                            <Title style={styles.title}> {bossName}님으로 인증할게요.(2/2)</Title>
                            <View style={{ width: '100%' , height: 700 }}>
                            <IMP.Certification
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
                        />  
                        </View>
                        </>
                        )
                    } */}
                    
                    </KeyboardAwareScrollView>
                </BottomSheetModal> 
            </View>
        </TotalView>
        </BottomSheetModalProvider>
    );
}

export default LoginScreen;