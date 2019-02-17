import qs from 'qs';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import EventEmitter from 'wolfy87-eventemitter';
import { fromEvent } from 'rxjs';

let baseUrl = '';
let staticBaseUrl = '';
if (__DEV__) {
  baseUrl = '/api';
  staticBaseUrl = 'http://localhost:8080';
}

export { baseUrl, staticBaseUrl };

export interface Ret {
  state: 'ok' | 'fail';

  [key: string]: any;
}

export async function GET<Result = Ret>(
  uri: string,
  params?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<Result>> {
  uri = params ? uri + '?' + qs.stringify(params) : uri;
  return await axios.get(`${baseUrl}${uri}`, config);
}

export async function POST<Result = Ret>(
  uri: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<Result>> {
  return await axios.post(`${baseUrl}${uri}`, data, config);
}

export async function POST_FORM<Result = Ret>(
  uri: string,
  form: any,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse<Result>> {
  const resp = await POST<Result>(uri, qs.stringify(form), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    ...config
  });
  return resp;
}

export async function fetchBase64Image(uri: string): Promise<string> {
  let resp = await GET<Blob>(uri, null, { responseType: 'blob' });
  let reader = new FileReader();
  return await new Promise((resolve) => {
    reader.onloadend = (e) => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(resp.data);
  });
}

export async function select<T = object>(
  uri: '/select' | '/select/teacher' | '/select/manager',
  sql: string,
  ...args: any[]
): Promise<T[]> {
  let resp = await POST<T[]>(uri, { sql, args }, { responseType: 'json' });
  return resp.data;
}

export function upload(
  files: (File | Blob)[],
  otherParams: object = {},
  action: string = '/file/upload'
) {
  const form = new FormData();
  for (let file of files) {
    form.append('file', file);
  }
  for (let key in otherParams) {
    form.append(key, otherParams[key]);
  }
  const uploadProgress = new EventEmitter();
  const progress = fromEvent<number>(uploadProgress, 'uploadProgress');
  const response = axios.post(`${baseUrl}${action}`, form, {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (evt) => {
      let completed = Math.round(evt.loaded * 100 / evt.total);
      uploadProgress.emit('uploadProgress', completed);
    }
  });
  return {
    response,
    progress
  };
}

if (__DEV__) {
  (window as any).GET = GET;
  (window as any).POST = POST;
  (window as any).POST_FORM = POST_FORM;
  (window as any).fetchBase64Image = fetchBase64Image;
  (window as any).select = select;
  (window as any).upload = upload;
}
