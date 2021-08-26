import React from "react";
import { Animated, View, StyleSheet, PanResponder, Text, } from "react-native";

const ShopScreen_Test = () => {
  //const pan = React.useRef(new Animated.ValueXY()).current;
  const [pan, setPan] = React.useState(new Animated.ValueXY({x:0, y:0}));

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setValue({
          x: pan.x._value,
          y: pan.y._value
        });
      },
      onPanResponderMove: Animated.event(
        [
          null,
          { dx: pan.x, dy: pan.y }
        ],
      ),
      onPanResponderRelease: (evt, gestureState) => {
        pan.flattenOffset();
        Animated.spring(
          pan.y,
          {
            toValue: -200,
            duration: 1000,
            useNativeDriver: true,
          },
        ).start();
      }
    })
  ).current;


  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Drag this box!</Text>
      <Animated.View
        style={{
          transform: [{ translateY: pan.y }]
        }}
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

export default ShopScreen_Test;