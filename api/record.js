
import { request } from "./request"

module.exports = {
  saveRecords: (records) => request('record/saveall', 'PUT', records)

}

