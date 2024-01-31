import { getCookie } from 'Cookies';
export const getJsonHeader = () => {
  return {
    headers: {
      Authorization: `Bearer ${getCookie('accessToken')}`,
      'Content-Type': 'application/json',
    },
  };
};

export const getFormHeader = () => {
  return {
    headers: {
      Authorization: `Bearer ${getCookie('accessToken')}`,
      'Content-Type': 'multipart/form-data',
    },
  };
};

export const jsonHeader = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const formHeader = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};
