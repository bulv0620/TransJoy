const Storage = require('ee-core/storage');
const { v4 } = require('uuid') 


let jsondbOptions = {
  driver: "jsondb",
};
const jdb = Storage.connection("transjoy", jsondbOptions);

jdb.db
  .defaults({
    devices: {},
    user: {
      id: v4(),
      username: v4().split('-')[0].toUpperCase(),
      port: "44944",
    },
  })
  .write();

module.exports = jdb;
