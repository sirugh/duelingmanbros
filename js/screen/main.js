/**
 * Example of how to make a game with Phaser and AirConsole
 * This example is originally from Phaser and was modified to work with AirConsole.
 * http://phaser.io/examples/v2/games/tanks
 *
 * In this example two players can control the same tank with their smartphones instead of
 * one player by keyboard and mouse.
 * One is the driver and the other one is the shooter.
 */

const game = new Phaser.Game(1920, 1080, Phaser.AUTO, 'game');

const airconsole = new AirConsole();
function emit (event, data) {
  airconsole.broadcast(_.extend({
    action: event
  }, data))
}

Main = function () {}
Main.prototype = {
  preload: function () {
    game.load.image('loading', 'assets/images/loading.png')
    game.load.script('splash', 'js/screen/states/splash.js')
    game.load.script('utils',   'js/libs/utils.js');
  },

  create: function () {
    // The 'Splash' object is created by the splash state file.
    game.state.add('Splash', Splash);
    game.state.start('Splash');
  }
}

game.state.add('Main', Main)
game.state.start('Main')
