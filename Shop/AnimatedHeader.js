import React from 'react';
import { Animated, View } from 'react-native';

const HEADER_HEIGHT = 200;
const insets = {
    top: 20,
};

const AnimatedHeader = (props) => {

    const headerHeight = props.animatedValue.interpolate({
        inputRange: [0, HEADER_HEIGHT+insets.top ],
        outputRange: [HEADER_HEIGHT+insets.top, insets.top+44],
        extrapolate: 'clamp'
    });

    return(
        <Animated.View
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 10,
                height: headerHeight,
                backgroundColor: 'lightblue'
            }}
            />
    )
  };
  
  export default AnimatedHeader;