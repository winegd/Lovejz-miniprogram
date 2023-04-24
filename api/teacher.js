import { request } from "./request";

const baseurl = 'pc/admin/tch/'




module.exports = {
  haveTch: (data) => request(baseurl + 'haveTch', 'POST', data)

}
