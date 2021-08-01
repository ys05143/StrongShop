import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import Icon  from "react-native-vector-icons/Ionicons";

function App (props) {
 
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <Text>vector icon test</Text>
      <Icon name="chevron-back-outline" size={50}></Icon>
    </View>
  );
};

export default App;
