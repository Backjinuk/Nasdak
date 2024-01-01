export default function KakaoInit(){
    const link = window.location.href.split('?')[0]
    const uri = link.substring(0,link.lastIndexOf('/'))
    const redirectUri = encodeURI(uri+'/kakao')
    const option = {
        redirectUri : redirectUri,
        state : window.opener.sessionStorage.getItem('state')
    }
    window.Kakao.Auth.authorize(option)
    return (<></>)
}