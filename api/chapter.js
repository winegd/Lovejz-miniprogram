import { request } from "./request";

const baseurl = 'pc/tch/chapter/'

module.exports = {
  getlist: () => request(baseurl + 'list', 'GET')

}

