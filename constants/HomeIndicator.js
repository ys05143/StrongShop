import { StatusBar, Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { isIphoneX, getBottomSpace } from "react-native-iphone-x-helper";

function HomeIndicator(){ //window크기에서 빼야되는 크기를 기기별로 구함.
    if(Platform.OS === 'ios'){
        if (isIphoneX()) {
            return getBottomSpace();
        }
        else return 0;
    }
    else{
        return 0;
    }
}
export default HomeIndicator;