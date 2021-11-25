import React from 'react';
import { Button, SafeAreaView } from 'react-native';


function Temp(props){
    return(
        <SafeAreaView>
            <Button title={"MainScreen"} onPress={()=>{props.navigation.navigate("MainScreen")}}/>
            <Button title={"LoginScreen"} onPress={()=>{props.navigation.navigate("LoginScreen")}}/>
            <Button title={"ChatScreen"} onPress={()=>{props.navigation.navigate("ChatScreen")}}/>
            <Button title={"AnimatedTest"} onPress={()=>{props.navigation.navigate("AnimatedTest")}}/>
        </SafeAreaView>
    )
}

export default Temp;