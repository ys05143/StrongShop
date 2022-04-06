import { Dimensions, Platform } from "react-native";
import { isIphoneX, getBottomSpace } from "react-native-iphone-x-helper";
import UnSafeArea from "./UnSafeArea";
import { getStatusBarHeight } from 'react-native-status-bar-height';
import HomeIndicator from './HomeIndicator';

const data =  Dimensions.get('window'); 

//SafeAreaView의 width, height
export default { //height => iphone X 이상에서는 노치의 높이와 home indicator 높이까지 뺸 것 
    width : data.width,
    height : data.height - UnSafeArea(), //statusbar 및 homeindicator 둘 다 빠진 safeareaview 높이
    realHeight: data.height, // 현재 앱에서 사용할 수 있는 높이 (ios는 스크린 크기와 동일 , 안드로이드는 상태바와 하단소프트키 제외한 크기)
    TopBar: 60,
    IOS_notch: getStatusBarHeight(true),
    HomeIndicator: HomeIndicator(), 
    LargeCircleWidth : 1000,
    SmallCircleWidth : 970,
    TopValue : -770,
    New_total: data.height - (1000-770)//(LargeCircleWidth+TopValue)
};