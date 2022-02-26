const KorRegion = ['서울', '부산', '대구', '대전', '인천', '광주', '제주', '수원', '의정부', '안양', '부천', '광명', '평택', '동두천', '안산',
                    '고양', '과천', '구리', '남양주', '오산', '시흥', '군포', '의왕', '하남', '용인', '파주', '안성', '이천', '김포', '화성', 
                    '광주(경기)', '양주', '포천', '여주'];

const CarNames = [{
    id: 0,
    kor_name: "아반떼",
    en_name: "AVANTE",
    company: 'HYUNDAI',
},{
    id: 1,
    kor_name: "아반떼 N",
    en_name: "AVANTE N",
    company: 'HYUNDAI',
},{
    id: 2,
    kor_name: "아반떼 하이브리드",
    en_name: "AVANTE HYBRID",
    company: 'HYUNDAI',
},{
    id: 3,
    kor_name: "K3",
    en_name: "K3",
    company: 'KIA',
},{
    id: 4,
    kor_name: "K5",
    en_name: "K5",
    company: 'KIA',
},{
    id: 5,
    kor_name: "K7",
    en_name: "K7",
    company: 'KIA',
}];

function translate(option, item, value){
    const res_Tinting = {
        LUMA: '루마',
        SOLAR: '솔라가드',
        RAINBOW: '레인보우',
        RAYNO: '레이노',
        ANY: '상관없음',
        ETC: value,
    }
    const res_Ppf ={
        BONNET: '본넷',
        SIDEMIRROR: '사이드미러',
        FRONTBUMPER: '앞 범퍼',
        FRONTBUMPERSIDE:'앞 범퍼사이드',
        BACKBUMPER: '뒷 범퍼',
        BACKBUMPERSIDE: '뒷 범퍼사이드',
        HEADLIGHT: '헤드라이트',
        TAILLAMP: '테일램프',
        BCFILTER: 'B/C 필터',
        DOOR: '도어',
        HOOD: '후드',
        ETC: value,
    }
    const res_Blackbox = {
        FINETECH: '파인테크',
        INAVI: '아이나비',
        MANDO: '만도',
        ANY: '상관없음',
        ETC: value,
    }
    const res_Battery = {
        V6: 'V6',
        V12: 'V12',
        ANY: '상관없음',
        ETC: value,
    }
    const res_Afterblow = {
        ANY: '상관없음',
        ETC: value,
    }
    const res_Soundproof = {
        DOORSOUND: '도어방음',
        INSIDEFLOOR: '실내바닥방음',
        FENDER: '휀다방음',
        BONNETSOUND: '본넷방음',
        TRUNK: '트렁크방음',
        ETC: value,
    }
    const res_Wrapping = {
        DESIGN: value,
    }
    const res_BottomCoating = {
        UNDER: '언더코팅',
        POLYMER: '폴리머코팅',
    }
    const res_GlassCoating = '유리막코팅'

    const res_CarWash = {
        handCarWash: '손 세차',
        steamCarWash: '스팀 세차',
        detailingCarWash: '디테일링 세차',
    }
    const res_Inside = {
        insideCleaning: '내부 클리닝',
        insideSoundProof: '내부 방음',
    }
    const res_Outside = {
        Wrapping: '랩핑',
        dent: '덴트',
        painting: '도색',
    }
    const res_Scratch = {
        glassCoating: '유리막 코팅',
        polishing: '광택',
    }

    if(option === 'tinting') return res_Tinting[item];
    else if(option === 'ppf') return res_Ppf[item];
    else if(option === 'blackbox') return res_Blackbox[item];
    else if(option === 'battery') return res_Battery[item];
    else if(option === 'afterblow') return res_Afterblow[item];
    else if(option === 'soundproof') return res_Soundproof[item];
    else if(option === 'wrapping') return res_Wrapping[item];
    else if(option === 'bottomcoating') return res_BottomCoating[item];
    else if(option === 'glasscoating') return res_GlassCoating;

    else if(option === 'carwash') return res_CarWash[item];
    else if(option === 'inside') return res_Inside[item];
    else if(option === 'outside') return res_Outside[item];
    else if(option === 'scratch') return res_Scratch[item];
}
const NewCarPackageList= [
    {
        id: 0,
        data: ['틴팅'],
    },{
        id: 1,
        data: ['PPF'],
    },{
        id: 2,
        data: ['블랙박스'],
    },{
        id: 3,
        data: ['보조배터리'],
    },{
        id: 4,
        data: ['애프터블로우'],
    },{
        id: 5,
        data: ['방음'],
    },{
        id: 6,
        data: ['랩핑'],
    },{
        id: 7,
        data: ['하부코팅'],
    },{
        id: 8,
        data: ['유리막코팅'],
    }];
const Pay = [
    {id: 0, label: '신용카드', pg: 'uplus', pay_method: 'card'},
    {id: 1, label: '무통장입금', pg: 'uplus', pay_method: 'vbank'},
    {id: 2, label: '카카오페이', pg: 'kakaopay', pay_method: 'card'},
    {id: 3, label: '토스페이', pg: 'tosspay', pay_method: 'card'},
];
const merchadiseListDetail= [
    {
        id: 0,
        data: ['틴팅'],
        name: '틴팅',
        title: 'tinting',
    },{
        id: 1,
        data: ['PPF'],
        name: 'PPF',
        title: 'ppf',
    },{
        id: 2,
        data: ['블랙박스'],
        name: '블랙박스',
        title: 'blackBox',
    },{
        id: 3,
        data: ['보조배터리'],
        name: '보조배터리',
        title: 'battery',
    },{
        id: 4,
        data: ['애프터블로우'],
        name: '애프터블로우',
        title: 'afterblow',
    },{
        id: 5,
        data: ['방음'],
        name: '방음',
        title: 'deafening',
    },{
        id: 6,
        data: ['랩핑'],
        name: '랩핑',
        title: 'warpping',
    },{
        id: 7,
        data: ['하부코팅'],
        name: '하부코팅',
        title: 'bottomCoating',
    },{
        id: 8,
        data: ['유리막코팅'],
        name: '유리막코팅',
        title: 'glassCoating',
    },{
        id: 9,
        data: ['기타'],
        name: '기타',
        title: 'etc',
    }
];
const CareList= [
    {
        id: 0,
        data: ['세차'],
    },{
        id: 1,
        data: ['내부'],
    },{
        id: 2,
        data: ['외부'],
    },{
        id: 3,
        data: ['스크레치'],
    },{
        id: 4,
        data: ['직접입력'],
    }];
export {KorRegion, CarNames, NewCarPackageList, Pay, merchadiseListDetail, CareList, translate};