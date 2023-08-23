/**
 * 主进程与渲染进程通信频道定义
 * Definition of communication channels between main process and rendering process
 */
const ipcApiRoute = {
  // framework
  hideWindow: "controller.framework.hideWindow",
  closeWindow: "controller.framework.closeWindow",

  // user
  getUserInfo: "controller.user.getUserInfo",
  updateUserInfo: "controller.user.updateUserInfo",

  // device
  subscribeDeviceServe: "controller.device.subscribe",
  publish: "controller.device.publish",

  // message
  subscribeMessageServe: "controller.message.subscribe",
  queryMessage: "controller.message.query",
  sendMessage: "controller.message.send"
};

export { ipcApiRoute };
