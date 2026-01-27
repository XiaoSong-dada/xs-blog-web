import { jwtDecode } from 'jwt-decode';
import type { IUserInfo } from '@/types/main';

export const PayloadDecode= (token:string):IUserInfo=>{
     return jwtDecode(token)
}

export const isJwtExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token)
    return Date.now() >= exp * 1000
  } catch {
    return true
  }
}