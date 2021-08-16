import { StatusBar, Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { isIphoneX, getBottomSpace } from "react-native-iphone-x-helper";

function StatusBarHeight(){ //window크기에서 빼야되는 크기를 기기별로 구함.
    if(Platform.OS === 'android'){
        return StatusBar.currentHeight;
    }
    else{
        const statusBar = getStatusBarHeight(true);
        return statusBar;
    }
}
export default StatusBarHeight;