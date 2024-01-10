// stateNo 저장
const array = new Uint32Array(1);
window.crypto.getRandomValues(array);
const stateNo = encodeURI(array[0].toString());
sessionStorage.setItem("stateNo", stateNo);

// state 저장
export function setSnsState(action) {
  const snsState = {
    snsType: "",
    action: action,
  };
  sessionStorage.setItem("snsState", JSON.stringify(snsState));
}

// 네이버 로그인
export function handleNaverLogin() {
  const clientId = process.env.REACT_APP_NAVER_CLIENT_ID; //애플리케이션 클라이언트 아이디값";
  const redirectURI = encodeURI(window.location.origin + "/snsLogin");
  let url = "https://nid.naver.com/oauth2.0/authorize";
  const snsState = {
    ...JSON.parse(sessionStorage.getItem("snsState")),
    snsType: "NAVER",
  };
  sessionStorage.setItem("snsState", JSON.stringify(snsState));
  url += "?response_type=code";
  url += "&client_id=" + clientId;
  url += "&redirect_uri=" + redirectURI;
  url += "&state=" + sessionStorage.getItem("stateNo");
  window.open(url, "네이버로그인", "width=700px,height=800px,scrollbars=yes");
}

// 카카오 로그인
export function handleKakaoLogin() {
  const snsState = {
    ...JSON.parse(sessionStorage.getItem("snsState")),
    snsType: "KAKAO",
  };
  sessionStorage.setItem("snsState", JSON.stringify(snsState));
  window.open(
    "/kakaoInit",
    "카카오로그인",
    "width=700px,height=800px,scrollbars=yes"
  );
}
