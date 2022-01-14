import React from "react";
import IMP from "iamport-react-native";

function Certification(props) {
  /* [필수입력] 본인인증 종료 후, 라우터를 변경하고 결과를 전달합니다. */
  const [Data, setData] = React.useState({
    merchant_uid: `mid_${new Date().getTime()}`,
    company: '',
    carrier: '',
    name: '',
    phone: props.phoneNum,
    min_age: '',
  });
  function callback(res) {
    props.navigation.replace('MypageScreen', {response: res, phoneNum: Data.phone});
  }

  /* [필수입력] 본인인증에 필요한 데이터를 입력합니다. */

  return (
    <IMP.Certification
      userCode={'iamport'}  // 가맹점 식별코드
      tierCode={'AAA'}      // 티어 코드: agency 기능 사용자에 한함// 로딩 컴포넌트
      data={Data}           // 본인인증 데이터
      callback={callback}   // 본인인증 종료 후 콜백
    />
  );
}

export default Certification;