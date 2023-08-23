"use strict";

const { Controller } = require("ee-core");
const Services = require("ee-core/services");
const { app } = require('electron')
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
    Services.get("bonjour").unpublishAll();
    app.relaunch();
    app.exit(0)
    return userInfo;
  }
}

UserController.toString = () => "[class UserController]";
module.exports = UserController;
