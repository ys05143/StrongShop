import React from 'react';
import { Alert } from 'react-native';

function CheckErrorCode(e) {
    if(e.response.status === 406){
        Alert.alert(
            '실패',
            '현재 진행중인 시공이 존재합니다.',
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
}

export default CheckErrorCode;