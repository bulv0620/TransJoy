"use strict";

const { Controller } = require("ee-core");
const Services = require("ee-core/services");

/**
 * framework
 * @class
 */
class UserController extends Controller {
  constructor(ctx) {
    super(ctx);
  }

  getUserInfo() {
    return Services.get("user").getUserInfo();
  }

  updateUserInfo(args) {
    const userInfo = Services.get("user").updateUserInfo(args);

    Services.get("bonjour").publish(userInfo);
    return userInfo;
  }
}

UserController.toString = () => "[class UserController]";
module.exports = UserController;
