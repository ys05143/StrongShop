import React from 'react';
import { Button, SafeAreaView } from 'react-native';


function Temp(props){
    return(
        <SafeAreaView>
            <Button title={"MainScreen"} onPress={()=>{props.navigation.navigate("MainScreen")}}/>
            <Button title={"PackageScreen_1"} onPress={()=>{props.navigation.navigate("PackageScreen_1")}}/>
            <Button title={"PackageScreen_2"} onPress={()=>{props.navigation.navigate("PackageScreen_2")}}/>
            <Button title={"PackageScreen_3"} onPress={()=>{props.navigation.navigate("PackageScreen_3")}}/>
        </SafeAreaView>
    )
}

export default Temp;