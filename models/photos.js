const { selectWhere } = require("../config/orm.js");
const orm = require("../config/orm.js");

const photo = {

  create: function (obj, cb) {
    orm.create("photos", Object.keys(obj), Object.values(obj), function (res) {
      cb(res.insertId)
    })
  },

  selectWhere: function (id, cb) {
    orm.selectWhere("photos", "id", id, (data)=>{
      cb(data)
    })
  }
}

module.exports = photo;
