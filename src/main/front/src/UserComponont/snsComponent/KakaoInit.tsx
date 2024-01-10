export default function KakaoInit(){
    const redirectUri = encodeURI(window.location.origin+'/snsLogin')
    const option = {
        redirectUri : redirectUri,
        state : window.opener.sessionStorage.getItem('stateNo')
    }
    window.Kakao.Auth.authorize(option)
    return (<></>)
}