import React from 'react';
import { Button, SafeAreaView } from 'react-native';


function Temp(props){
    return(
        <SafeAreaView>
            <Button title={"MainScreen"} onPress={()=>{props.navigation.navigate("MainScreen")}}/>
            <Button title={"PackageScreen_1"} onPress={()=>{props.navigation.navigate("PackageScreen_1")}}/>
            <Button title={"PackageScreen_2"} onPress={()=>{props.navigation.navigate("PackageScreen_2")}}/>
            <Button title={"PackageScreen_3"} onPress={()=>{props.navigation.navigate("PackageScreen_3")}}/>
            <Button title={"PackageScreen_4"} onPress={()=>{props.navigation.navigate("PackageScreen_4")}}/>
            <Button title={"PackageScreen_5"} onPress={()=>{props.navigation.navigate("PackageScreen_5")}}/>
            <Button title={"ShopScreen_1"} onPress={()=>{props.navigation.navigate("ShopScreen_1")}}/>
            <Button title={"MapTest"} onPress={()=>{props.navigation.navigate("MapTest")}}/>
            <Button title={"ShopScreen_Test"} onPress={()=>{props.navigation.navigate("ShopScreen_Test")}}/>
            <Button title={"AnimatedTest"} onPress={()=>{props.navigation.navigate("AnimatedTest")}}/>
            <Button title={"MyPageScreen"} onPress={()=>{props.navigation.navigate("MyPageScreen")}}/>
            <Button title={"PackageScreen_3_2"} onPress={()=>{props.navigation.navigate("PackageScreen_3_2")}}/>
            <Button title={"PackageScreen_3_3"} onPress={()=>{props.navigation.navigate("PackageScreen_3_3")}}/>
        </SafeAreaView>
    )
}

export default Temp;