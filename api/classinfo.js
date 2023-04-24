import { request } from "./request";

const baseurl = 'pc/admin/class/'

module.exports = {
  getClasslist: () => request(baseurl + 'list', 'GET')

}
