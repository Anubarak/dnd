import {AxiosError} from 'axios';
import {ModelErrors} from '@/Types';
import {useAlert} from '@/compositions/AlertComposition';


export const showError = (err: AxiosError|unknown) => {
  const message = getMessageFromError(err);

  if(message){
    const {showError: s} = useAlert();
    s(message);
  }
}

export const showMessage = (message: string) => {
    const {showSuccess: s} = useAlert();
    s(message);
}



const getMessageFromError = (error: AxiosError<ModelErrors | string> | string | unknown): string | null => {
  if (typeof error === 'string') {
    return error;
  }

  let data = error?.response?.data ?? null;
  if (data !== null) {
    if (typeof data === 'string') {
      return data;
    }

    const errors = data.error ?? data.errors ?? data.message ?? null;
    if (errors !== null) {
      return getFirstString(errors);
    }

    if (typeof data === 'object') {
      return getFirstString(data);
    }
  }

  if (typeof error === 'object' && Object.keys(error).length === 0) {
    // it's probably an exception...
    return error.toString();
  }

  if (typeof error.message !== 'undefined') {
    return error.message;
  }

  return '';
};


const getFirstString = (object: string | string[] | ModelErrors): string | null => {
  if (typeof object === 'string') {
    return object;
  }

  if (Array.isArray(object)) {
    return object[0] ?? null;
  }

  if (typeof object === 'object') {
    const keys = Object.keys(object);
    if (keys.length) {
      const e = object[keys[0]] ?? null;
      return Array.isArray(e) ? e[0] : e;
    }
  }

  return null;
}
