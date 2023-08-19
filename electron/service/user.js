"use strict";

const { Service } = require("ee-core");
const { db } = require("../utils/db");

class UserService extends Service {
  constructor(ctx) {
    super(ctx);
  }

  getUserInfo() {
    return db.get("user").value();
  }

  updateUserInfo(user) {
    return db.set("user", user).write();
  }
}

UserService.toString = () => "[class UserService]";
module.exports = UserService;
