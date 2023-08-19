'use strict';

const { Controller } = require('ee-core');
const Electron = require('ee-core/electron');

/**
 * framework
 * @class
 */
class FrameworkController extends Controller {

  constructor(ctx) {
    super(ctx);
  }

  /**
   * hideWindow
   */
  async hideWindow () {
    Electron.mainWindow.minimize()
    return;
  }

  /**
   * closeWindow
   */
  async closeWindow () {
    Electron.mainWindow.hide()
    return;
  }
}

FrameworkController.toString = () => '[class FrameworkController]';
module.exports = FrameworkController;  