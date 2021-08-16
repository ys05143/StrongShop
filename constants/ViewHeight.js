import { StatusBar, Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { isIphoneX, getBottomSpace } from "react-native-iphone-x-helper";
import AppWindow from '../constants/AppWindow';
import StatusBarHeight from './StatusBarHeight';
import HomeIndicator from './HomeIndicator';

const REALHEIGHT = AppWindow.realHeight;

function ViewHeight(){ //window크기에서 빼야되는 크기를 기기별로 구함.
    if(Platform.OS === 'ios'){
        if (isIphoneX()) {
            return REALHEIGHT-HomeIndicator();
        }
        else return REALHEIGHT-StatusBarHeight();
    }
    else{
        return REALHEIGHT-StatusBarHeight();
    }
}
export default ViewHeight;