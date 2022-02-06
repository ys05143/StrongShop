import React from "react";
import styled from 'styled-components/native';
import { FlatList, Text, Platform, View } from 'react-native';

const styles = {
    shadow: { 
        ...Platform.select(
            { 
                ios: { 
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 4,
                    },
                    shadowOpacity: 0.30,
                    shadowRadius: 4.65,
                }, 
                android: { 
                    elevation: 8, 
                }, 
            }
        ), 
    },
}

const PageItem = styled.View`
  background-color: white;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;
`;

const Container = styled.View`
  justify-content: center;
  align-items: center;
`;

const Indicator = styled.View`
  margin: 0px 4px;
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: ${(props) => (props.focused ? '#262626' : '#dfdfdf')};
`;

const IndicatorWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
`;

function Carousel({gap, offset, pages, pageWidth, pageHeight, Content, getState}){
    const [page, setPage] = React.useState(0);
    
    function renderItem({item}){
        return (
            <View key={item.id} style={{...styles.shadow, width: pageWidth, height: pageHeight, marginHorizontal: gap / 2, backgroundColor: 'white', borderRadius: 10}}>
                <PageItem>
                    <Content item={item}/>
                </PageItem>
            </View>
            );
    }

    const onScroll = (e) => {
        const newPage = Math.round(
            e.nativeEvent.contentOffset.x / (pageWidth + gap),
        );
        setPage(newPage);
        getState(newPage);
    };

    return (
        <Container>
            <FlatList
                automaticallyAdjustContentInsets={false}
                contentContainerStyle={{
                    paddingHorizontal: offset + gap / 2,
                    paddingVertical: 15
                }}
                data={pages}
                decelerationRate="fast"
                horizontal={true}
                keyExtractor={(item) => item.id}
                onScroll={onScroll}
                pagingEnabled={true}
                renderItem={renderItem}
                snapToInterval={pageWidth + gap}
                snapToAlignment="start"
                showsHorizontalScrollIndicator={false}/>
            <IndicatorWrapper>
                {Array.from({length: pages.length}, (_, i) => i).map((i) => (
                <Indicator key={`indicator_${i}`} focused={i === page} />
                ))}
            </IndicatorWrapper>
        </Container>
    )
}
export default Carousel;

