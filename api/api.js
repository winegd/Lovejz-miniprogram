
import { request } from "./request"

module.exports = {
  getlistByKnowledegId: (id, offset, pagesize) => request('pc/tch/question/getQuestion/' + id + '/' + offset + '/' + pagesize, 'GET')

}
