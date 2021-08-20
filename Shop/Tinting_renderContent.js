import React from 'react';
import {FlatList, View} from 'react-native';
import { DefaultTheme, DataTable, List, Provider as PaperProvider } from 'react-native-paper';

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#777777',
        accent: '#f1c40f',
    },
};

const DATA=[{
    name: 'T70 05',
    penetration: 6,
    block: 70,
    price: 100000
},{
    name: 'T70 15',
    penetration: 15,
    block: 68,
    price: 200000
},{
    name: 'T70 35',
    penetration: 35,
    block: 68,
    price: 300000
}];

/*<View>
    <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        />
    </View>
*/

function Tinting_renderContent(props) {
    //props로 업체 이름 전달
    const [shopName, setShopName] = React.useState(props.children);



    const renderItem = ( item ) => {
        return(
            <DataTable.Row key={item.name}>
                <DataTable.Cell>{item.name}</DataTable.Cell>
                <DataTable.Cell numeric>{item.penetration}</DataTable.Cell>
                <DataTable.Cell numeric>{item.block}</DataTable.Cell>
                <DataTable.Cell numeric>{item.price}</DataTable.Cell>
            </DataTable.Row>
        );
    }

    return(
        <View>
            <PaperProvider theme={theme}>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>{shopName}</DataTable.Title>
                    <DataTable.Title numeric>가시광선 투과율</DataTable.Title>
                    <DataTable.Title numeric>태양에너지 차단률</DataTable.Title>
                    <DataTable.Title numeric>가격</DataTable.Title>
                </DataTable.Header>
                {DATA.map(renderItem)}
            </DataTable>
            </PaperProvider>
        </View>

    );
}

export default Tinting_renderContent;