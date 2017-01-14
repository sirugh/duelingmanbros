/**
 * Example of how to make a game with Phaser and AirConsole
 * This example is originally from Phaser and was modified to work with AirConsole.
 * http://phaser.io/examples/v2/games/tanks
 *
 * In this example two players can control the same tank with their smartphones instead of
 * one player by keyboard and mouse.
 * One is the driver and the other one is the shooter.
 */

const game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', {
  preload: preload,
  create: create,
  update: update,
  render: render
});

function preload () {
    // game.load.image('logo', 'assets/logo.png');
    // game.load.image('note', 'assets/game/note.png');
    // game.load.image('mountain', 'assets/game/mountain.png')
    // game.load.image('earth', 'assets/game/scorched_earth.png');
    // game.load.atlas('tank', 'assets/game/tanks.png', 'assets/game/tanks.json');
    // game.load.atlas('enemy', 'assets/game/enemy-tanks.png', 'assets/game/tanks.json');
    // game.load.spritesheet('kaboom', 'assets/game/explosion.png', 64, 64, 23);
}

// ------------------------
// AirConsole relevant vars

// A map that holds the device_ids of the driver and the shooter
var device_control_map = [];

// A button-state map which indicates which buttons the driver has currently pressed
var driver_device = {
    left: 0,
    right: 0,
    up: false
};

// A button-state map which indicates which buttons the shooter has currently pressed
var shooter_device = {
    left: 0,
    right: 0,
    fire: false
};
// ------------------------

function create () {
  // =======================================================
  // Create AirConsole instance
  // =======================================================
  const  airconsole = new AirConsole();

  const logo = game.add.text(0, 0, 'DUELING MAN-BROS', {
    font: 'bold 32px Arial',
    fill: '#fff',
    boundsAlignH: 'center',
    boundsAlignV: 'middle'
  });

  // Send a message to each device to tell them the role (tank or shooter)
  var setRoles = function() {
    for (const [index, device_id] of device_control_map.entries()) {
      // We only allow two players in this game
      if (index >= 2) break;

      airconsole.message(device_id, {
          action: "SET_ROLE",
          role: `PLAYER${device_id}`
      });
    }
  };

    airconsole.onReady = function() {};

    // As soon as a device connects we add it to our device-map
    airconsole.onConnect = function(device_id) {
        // Only first two devices can play
        if (device_control_map.length < 2) {
            device_control_map.push(device_id);
            // Send a message back to the device, telling it which role it has (tank or shooter)
            setRoles();
        }
        logo.kill();
    };

    // Called when a device disconnects (can take up to 5 seconds after device left)
    airconsole.onDisconnect = function(device_id) {
        // Remove the device from the map
        var index = device_control_map.indexOf(device_id);
        if (index !== -1) {
            device_control_map.splice(index, 1);
            // Update roles
            setRoles();
        }
    };

    // onMessage is called everytime a device sends a message with the .message() method
    airconsole.onMessage = function(device_id, data) {
        // First in the array is always player 1
        var player1  = device_control_map[0];
        // Second in the array is always player 2
        var player2 = device_control_map[1];

        // If we get a message from player 1
        if (player1 && device_id === player1) {
          // Do stuff for player 1
          // For example:
          // Compare data.action (pressed buttons) to the required notes
        }

        // If we get a message from player 2
        if (player2 && device_id === player2) {
          // Do stuff for player 2.
          // For example:
          // Compare data.action (pressed buttons) to the required notes
        }
    };

    game.camera.focusOnXY(0, 0);
}

function update () {

}

function render () {
    game.debug.text(`Game is running.`);
}
