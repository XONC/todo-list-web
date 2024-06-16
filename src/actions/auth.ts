"use server"
import {userInfo} from "@/global/mock";
import Cookies from "js-cookie";

export async function authUserInfo() {
  Cookies.set('userInfo', JSON.stringify(userInfo))
  return true
}
