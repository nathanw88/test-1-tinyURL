const orm = require("../config/orm.js");

const photo = {

  create: function (obj, cb) {
      orm.create("photos", Object.keys(obj), Object.values(obj), function(res){
        cb(res.insertId)
      })
  } 
}

module.exports = photo;
