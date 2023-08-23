"use strict";

const { Service } = require("ee-core");
const Bonjour = require("bonjour");

class BonjourService extends Service {
  constructor(ctx) {
    super(ctx);
    this.bonjour = Bonjour();
    this.browser = this.bonjour.find({ type: "http" });
  }

  publish(userInfo) {
    this.bonjour.unpublishAll();

    this.bonjour.publish({
      name: userInfo.id,
      type: "http",
      port: userInfo.port,
      txt: userInfo,
    });
  }

  subscribe(userInfo, event) {
    const channel = "controller.device.subscribe";

    const replyFn = () => {
      const devices = this.browser.services
        .filter((el) => el.txt.id !== userInfo.id)
        .map((el) => ({
          ip: el.referer.address,
          ...el.txt,
        }));
      event.reply(channel, devices);
    };

    this.browser.on("up", replyFn);

    this.browser.on("down", replyFn);

    return [];
  }

  unpublishAll() {
    this.bonjour.unpublishAll();
  }
}

BonjourService.toString = () => "[class BonjourService]";
module.exports = BonjourService;
