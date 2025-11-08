import {ENDPOINTS} from './endpoints';

const DEBUG = true;
// const BASE_URL = 'http://10.60.19.16:8000/';
const BASE_URL = 'http://127.0.0.1:8000/';
// const BASE_URL = 'https://duc.hieutrung.vn/';
// const BASE_URL = 'http://192.168.100.53:8000/';
// const BASE_URL = 'http://10.0.2.2:8000/';
// const BASE_URL = 'http://38.54.30.126:8000/';      //web Đức
// const BASE_URL = 'https://quan.hieutrung.vn/';         //web Quân
// const BASE_URL = 'https://dine-hub.rn-admin.site/';
const BASE_URL_IMG = BASE_URL+'storage/images/';

const AUTHORIZATION_TOKEN = 'pvqmfonrbfsrwpcvckfvxiinlvveojqi';

const CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + AUTHORIZATION_TOKEN,
    'api-key': AUTHORIZATION_TOKEN,
  },
};

export {BASE_URL, BASE_URL_IMG , AUTHORIZATION_TOKEN, ENDPOINTS, CONFIG, DEBUG};
