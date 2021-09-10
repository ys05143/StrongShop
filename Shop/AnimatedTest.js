import React, {useRef} from 'react';
import { Text, View, SafeAreaView, Button, Animated, ScrollView, StyleSheet, PanResponder } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
//components
import TotalView from '../components/TotalView';
//constants
import AppWindow from '../constants/AppWindow';
import Color from '../constants/Color';

const WIDTH = AppWindow.width;
const HEIGHT = AppWindow.height;


const Tab = createMaterialTopTabNavigator();

function AnimatedTest(props){
    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          pan.setOffset({
            x: pan.x._value,
            y: pan.y._value
          });
        },
        onPanResponderMove: Animated.event(
          [
            null,
            { dx: pan.x, dy: pan.y }
          ]
        ),
        onPanResponderRelease: () => {
          pan.flattenOffset();
        }
      })
    ).current;
  
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>Drag this box!</Text>
        <Animated.View
          style=
          {
            {transform: [{ translateX: pan.x }, { translateY: pan.y }]}
          }
          {...panResponder.panHandlers}
        >
          <View style={styles.box} />
        </Animated.View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center"
    },
    titleText: {
      fontSize: 14,
      lineHeight: 24,
      fontWeight: "bold"
    },
    box: {
      height: 150,
      width: 150,
      backgroundColor: "blue",
      borderRadius: 5
    }
  });
    
  

export default AnimatedTest;