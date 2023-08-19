"use strict";

const { Controller } = require("ee-core");
const Services = require("ee-core/services");

/**
 * framework
 * @class
 */
class DeviceController extends Controller {
  constructor(ctx) {
    super(ctx);

  }

  getDevices(_, event) {
    const userInfo = Services.get("user").getUserInfo();

    return Services.get("bonjour").getDevices(userInfo, event);
  }

  publish() {
    const userInfo = Services.get("user").getUserInfo();
    Services.get("bonjour").publish(userInfo);
    return;
  }
}

DeviceController.toString = () => "[class DeviceController]";
module.exports = DeviceController;
