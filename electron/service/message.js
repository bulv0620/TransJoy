"use strict";

const { Service } = require("ee-core");
const { db } = require("../utils/db");

class MessageService extends Service {
  constructor(ctx) {
    super(ctx);
  }

  subscribe(event) {
    this.channel = "controller.message.subscribe";

    this.event = event;

    return;
  }

  getMessage(msg) {
    this.event?.reply(this.channel, msg);
  }

  saveMessage(msg) {
    const { deviceId, type } = msg;

    if (type === "file") {
      msg.content = JSON.parse(msg.content);
    }

    const deviceSavedMsg = db.get("devices." + deviceId).value();

    if (!deviceSavedMsg) {
      db.set("devices." + deviceId, [msg]).write();
    } else {
      db.get("devices." + deviceId)
        .push(msg)
        .write();
    }
  }

  query(id) {
    return db.get("devices." + id).value();
  }

  removeMessage(deviceId, messageId) {
    return db.get(`devices[${deviceId}]`).remove({ id: messageId }).write();
  }
}

MessageService.toString = () => "[class MessageService]";
module.exports = MessageService;
