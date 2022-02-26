import { StatusBar, Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { isIphoneX, getBottomSpace } from "react-native-iphone-x-helper";
import HomeIndicator from './HomeIndicator';

function UnSafeArea(){ //window크기에서 빼야되는 크기를 기기별로 구함.
    if(Platform.OS === 'android'){
        return StatusBar.currentHeight;
    }
    else{
        const statusBar = getStatusBarHeight(true);
        if (isIphoneX()) {
            return statusBar + HomeIndicator(); //하단 슬라이드 바 있는 곳
        } 
        else {
          return statusBar; //x이전의 아이폰은 status바만 있음.
        }
    }
}
export default UnSafeArea;