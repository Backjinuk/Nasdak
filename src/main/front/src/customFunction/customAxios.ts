import { formHeader, getFormHeader, getJsonHeader, jsonHeader } from 'headers';
import existAxios, { isAxiosError } from 'axios';
import { getCookie, setCookie } from 'Cookies';

async function post(url: string, data?: any) {
  const res = await authenticationWrapper(() => existAxios.post(url, data, getJsonHeader()));
  return res;
}
async function get(url: string) {
  const res = await authenticationWrapper(() => existAxios.get(url, getJsonHeader()));
  return res;
}
async function formData(url: string, data: FormData) {
  const res = await authenticationWrapper(() => existAxios.post(url, data, getFormHeader()));
  return res;
}

async function authenticationWrapper(func: Function) {
  try {
    const res = await func();
    return res;
  } catch (error) {
    if (isAuthenticationError(error)) {
      throw error;
    }
  }
  try {
    console.log('AccessToken 재발급 요청');
    await requestRefreshToken();
  } catch (error) {
    alert('다시 로그인해주세요!');
    window.location.href = '/';
    throw new Error('need to login');
  }
  const res = await func();
  return res;
}

function isAuthenticationError(error: unknown) {
  return isAxiosError(error) && error.response?.status !== 401;
}

async function requestRefreshToken() {
  const res = await axios.public.post(
    '/api/token/refreshToken',
    JSON.stringify({ refreshToken: getCookie('refreshToken') })
  );
  setCookie('accessToken', res.data.accessToken, { maxAge: Number(res.data.accessTokenExpiresIn) / 1000 });
  setCookie('refreshToken', res.data.refreshToken, { maxAge: Number(res.data.refreshTokenExpiresIn) / 1000 });
  return res;
}

async function publicPost(url: string, data?: any) {
  const res = await existAxios.post(url, data, jsonHeader);
  return res;
}
async function publicGet(url: string) {
  const res = await existAxios.get(url, jsonHeader);
  return res;
}
async function publicFormData(url: string, data: FormData) {
  const res = await existAxios.post(url, data, formHeader);
  return res;
}

const axios = {
  post,
  get,
  formData,
  public: {
    post: publicPost,
    get: publicGet,
    formData: publicFormData,
  },
};

export default axios;
