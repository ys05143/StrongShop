import React from 'react';
import { Text } from 'react-native';
import NaverMapView, {Circle, Marker, Path, Polyline, Polygon} from "react-native-nmap";
import axios from 'axios';
import styled from 'styled-components';
import Swiper from 'react-native-swiper';

const Contents = styled.View`
    width: 100%;
    height: 500px;
    border: 1px solid #ff0000;
`;

function MapTest(props){
    const [time, setTime] = React.useState(Date.now());
    const P0 = {latitude: 37.564362, longitude: 126.977011};
    const [coord, setCoord] = React.useState(P0);
    const [testCoord, setTestCoord] = React.useState(P0);

    React.useEffect( () =>  {
        axios({
            method: 'GET' ,
            url : 'http://api.vworld.kr/req/address?service=address&request=getCoord&key=98C4A0B1-90CD-30F6-B7D0-9F5A0DC9F18B&type=ROAD&address=서울시 광진구 동일로30길 32-7' ,
        })
        .then(res => {
            console.log(res.data.response.result.point) ;
            const point = res.data.response.result.point ;
            setCoord({latitude: Number(point.y) , longitude : Number(point.x) });
            console.log(coord);
        })
        .catch(e => console.log(e) ) ;
    },[time]);

    React.useEffect( () =>  {
        axios({
            method: 'GET' ,
            url : 'https://api.vworld.kr/req/address?service=address&request=getCoord&key=98C4A0B1-90CD-30F6-B7D0-9F5A0DC9F18B&address=서울시 광진구 507-3&type=PARCEL' ,
        })
        .then(res => {
            console.log(res.data.response.result.point) ;
            const point = res.data.response.result.point ;
            setTestCoord({latitude: Number(point.y) , longitude : Number(point.x) });
            console.log(testCoord);
        })
        .catch(e => console.log(e) ) ;
    },[time]);
    
    return(
        <Swiper  activeDotColor={'#000000'}>
            <Contents>
                <NaverMapView style={{width: '100%', height: '100%'}}
                                    showsMyLocationButton={true}
                                    center={{...coord, zoom: 16}}>
                    <Marker coordinate={coord} onClick={() => console.warn('onClick! marker')}/>
                </NaverMapView>
            </Contents>
            <Contents>
                <NaverMapView style={{width: '100%', height: '100%'}}
                                    showsMyLocationButton={true}
                                    center={{...testCoord, zoom: 16}}>
                    <Marker coordinate={testCoord} onClick={() => console.warn('onClick! marker')}/>
                </NaverMapView>
            </Contents>
        </Swiper>
    )
}

export default MapTest;