// stateNo 저장
const array = new Uint32Array(1);
window.crypto.getRandomValues(array);
const stateNo = encodeURI(array[0].toString());
sessionStorage.setItem('stateNo', stateNo);

// state 저장
export function setSnsState(action) {
  const snsState = {
    snsType: '',
    action: action,
  };
  sessionStorage.setItem('snsState', JSON.stringify(snsState));
}

// 카카오 로그인
export function handleSNSLogin(snsType) {
  const snsState = {
    ...JSON.parse(sessionStorage.getItem('snsState')),
    snsType: snsType.toUpperCase(),
  };
  sessionStorage.setItem('snsState', JSON.stringify(snsState));
  const url = 'http://localhost:9090/oauth2/authorization/' + snsType.toLowerCase();
  window.open(url, '소셜로그인', 'width=700px,height=800px,scrollbars=yes');
}
