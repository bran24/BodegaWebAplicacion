/* eslint-disable @typescript-eslint/no-explicit-any */

import CryptoJS from 'crypto-js';
import { API_TKEY } from './../config'


export const handleEncrypt = (data: string): string => {
    const encrypted = CryptoJS.AES.encrypt(data, API_TKEY).toString();
    return encrypted

}

export const handleDecrypt = (data: string): string => {
    const bytes = CryptoJS.AES.decrypt(data, API_TKEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted
};


