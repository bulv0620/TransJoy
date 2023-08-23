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
    const { deviceId } = msg;

    const deviceSavedMsg = db.get('devices.' + deviceId).value()

    if(!deviceSavedMsg) {
      db.set('devices.' + deviceId, [msg]).write()
    }
    else {
      db.get('devices.'+ deviceId).push(msg).write()
    }
  }

  query(id) {
    return db.get('devices.' + id).value()
  }
}

MessageService.toString = () => "[class MessageService]";
module.exports = MessageService;
