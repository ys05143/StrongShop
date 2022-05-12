import { Dimensions, Platform } from "react-native";
import { isIphoneX, getBottomSpace } from "react-native-iphone-x-helper";
import UnSafeArea from "./UnSafeArea";
import { getStatusBarHeight } from 'react-native-status-bar-height';
import HomeIndicator from './HomeIndicator';

const data =  Dimensions.get('window'); 

//SafeAreaView의 width, height
export default { //height => iphone X 이상에서는 노치의 높이와 home indicator 높이까지 뺸 것 
    width : data.width,
    height : data.height - UnSafeArea(), //window 에서 StatusBar 나 HomeIndicator를 뺀 부분 만큼의 높이
    realHeight: Platform.OS === 'ios' ?  data.height : data.height - UnSafeArea(), // 어플에서 사용할 수 있는 전체 높이 realHeight >= height
    IOS_notch: getStatusBarHeight(true),
    HomeIndicator: HomeIndicator(), // ios iphone X 이후에 생긴 HomeIndicator
    TopBar: 60,
    LargeCircleWidth : 1000,
    SmallCircleWidth : 970,
    TopValue : -770,
    New_total: data.height - (1000-770)//(LargeCircleWidth+TopValue)
};