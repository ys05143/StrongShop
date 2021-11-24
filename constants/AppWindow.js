import { Dimensions, Platform } from "react-native";
import { isIphoneX, getBottomSpace } from "react-native-iphone-x-helper";
import UnSafeArea from "./UnSafeArea";
import { getStatusBarHeight } from 'react-native-status-bar-height';

const data =  Dimensions.get('window');

//SafeAreaView의 width, height
export default { //height => iphone X 이상에서는 노치의 높이와 home indicator 높이까지 뺸 것 
    width : data.width,
    height : data.height - UnSafeArea(), //statusbar 및 homeindicator 둘 다 빠진 safeareaview 높이
    realHeight: data.height, //기기의 윈도우 높이, 즉 statusbar 포함 (ios는 screen과 동일 but 안드로이드는 screen = window+하단 소프트키)
    TopBar: 60,
    IOS_notch: getStatusBarHeight(true),
    HomeIndicator: Platform.OS === 'ios' ? 37 : 0,
};