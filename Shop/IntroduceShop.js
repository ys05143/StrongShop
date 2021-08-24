import React from 'react';
import { Text } from 'react-native';
import NaverMapView, {Circle, Marker, Path, Polyline, Polygon} from "react-native-nmap";
import axios from 'axios';
import styled from 'styled-components';
import { useIsFocused } from '@react-navigation/native';

const MapView = styled.View`
    width: 100%;
    height: 200px;
    background-color: white;
    margin-top: 10px;
    margin-bottom: 10px;
`;
const IntroView = styled.View`
    width: 100%;
    margin-top: 10px;
    padding-left: 5px;
    padding-right: 5px;
    background-color: white;
`;
const Total = styled.ScrollView``;

function IntroduceShop(props){
    const P0 = {latitude: 37.547167222, longitude: 127.068899861};
    const [coord, setCoord] = React.useState(P0);

    const isFocused = useIsFocused();
 
    React.useEffect(() => {
        if (isFocused) {
            axios({
                method: 'GET' ,
                url : 'http://api.vworld.kr/req/address?service=address&request=getCoord&key=98C4A0B1-90CD-30F6-B7D0-9F5A0DC9F18B&type=ROAD&address=서울시 광진구 동일로30길 32-7' ,
            })
            .then(res => {
                const point = res.data.response.result.point ;
                setCoord({latitude: Number(point.y) , longitude : Number(point.x) });
                console.log(point);
            })
            .catch(e => console.log(e) ) ;
        }
    }, [isFocused]);


    return(
        <Total>
            <IntroView>
                <Text>{'안녕하세요 올댓오토모빌 입니다~!!\n항상 찾아주시는 고객님 감사드리고, 최선을 다하겠습니다.\n화이팅!!!'}</Text>
            </IntroView>
            {isFocused && <MapView>
                <NaverMapView style={{width: '100%', height: '100%'}}
                                    showsMyLocationButton={true}
                                    center={{...coord, zoom: 16}}>
                    <Marker coordinate={coord} onClick={() => console.warn('onClick! marker')}/>
                </NaverMapView>
            </MapView>}
        </Total>
    )

    
}

export default IntroduceShop;