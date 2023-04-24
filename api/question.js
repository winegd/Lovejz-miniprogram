import { request } from "./request";

module.exports = {
  getlist: (size) => request('pc/tch/question/getQuestion/5/' + size, 'GET')
}

module.exports = {
  getlistByKnowledegId: (id, offset, pagesize) => request('pc/tch/question/getQuestion/' + id + '/' + offset + '/' + pagesize, 'GET')

}
module.exports = {
  registerUser: (data) => request('stu/user/update', 'POST', data)

}



module.exports = {
  setFavorite: (questionId, state) => request('record/favorite/' + questionId + '/' + state, 'POST')

}

module.exports = {
  getQuestionRandom: () => request('pc/tch/question/getQuestionRandom', 'GET')

}






// module.exports = {
//   getlistByKnowledegId: (id, offset, pagesize) => request('pc/tch/question/getQuestionRandom/', 'GET')

// }