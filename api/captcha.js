import { request } from "./request";

const baseurl = 'pc/'

module.exports = {
  getCaptcha: () => request(baseurl + 'get_captcha', 'GET')

}
