import { request } from "./request";

const baseurl = 'stu/user/'




module.exports = {
  getUserInfo: (openid) => request(baseurl + 'userinfo/' + openid, 'GET')

}
