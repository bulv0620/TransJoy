"use strict";

const { Controller } = require("ee-core");
const Services = require("ee-core/services");
const EE = require("ee-core/ee");
const HttpClient = require("ee-core/httpclient");
const { v4 } = require("uuid");
const dayjs = require("dayjs");
const path = require("path");
const fs = require("fs");

/**
 * framework
 * @class
 */
class MessageController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.hc = new HttpClient();
  }

  subscribe(_, event) {
    return Services.get("message").subscribe(event);
  }

  query(args) {
    return Services.get("message").query(args.id);
  }

  receive() {
    const { CoreApp } = EE;

    const body = JSON.parse(CoreApp.request.body);

    Services.get("message").saveMessage(body);

    Services.get("message").getMessage(body);

    return {
      success: true,
    };
  }

  async send({ target, type, content }) {
    try {
      const userInfo = Services.get("user").getUserInfo();

      const url = `http://${target.ip}:${target.port}/controller/message/receive`;
      const data = {
        id: v4(),
        deviceId: userInfo.id,
        type,
        content,
        timestamp: dayjs().format("YYYY-MM-DD HH:mm"),
      };
      const options = {
        method: "POST",
        data: JSON.stringify(data),
        dataType: "json",
        timeout: 5000,
      };

      await this.hc.request(url, options);

      Services.get("message").saveMessage({
        ...data,
        self: true,
        deviceId: target.id,
      });
      return true;
    } catch (error) {
      // console.log(error);
      return false;
    }
  }

  async download() {
    const { CoreApp } = EE;

    let params = CoreApp.request.query;

    params =
      params instanceof Object ? params : JSON.parse(JSON.stringify(params));

    const ctx = CoreApp.request.ctx;

    const createReadStream = fs.createReadStream(path.resolve(params.path));
    ctx.set("Content-disposition", "attachment; filename=" + params.name);
    ctx.set("Content-type", params.type);
    ctx.set("Content-Length", params.size);
    return createReadStream;
  }

  remove({deviceId, messageId}) {
    Services.get("message").removeMessage(deviceId, messageId)
    return 
  }
}

MessageController.toString = () => "[class MessageController]";
module.exports = MessageController;
