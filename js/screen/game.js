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

const players = [
  {
    score: 0
  },
  {
    score: 0
  }
];

function preload () {
    // game.load.image('logo', 'assets/logo.png');
    // game.load.image('note', 'assets/game/note.png');
    // game.load.image('mountain', 'assets/game/mountain.png')
    // game.load.image('earth', 'assets/game/scorched_earth.png');
    // game.load.atlas('tank', 'assets/game/tanks.png', 'assets/game/tanks.json');
    // game.load.atlas('enemy', 'assets/game/enemy-tanks.png', 'assets/game/tanks.json');
    // game.load.spritesheet('kaboom', 'assets/game/explosion.png', 64, 64, 23);
}

function create () {
  const  airconsole = new AirConsole();

  // As soon as a device connects we add it to our device-map
  airconsole.onConnect = function(device_id) {
    checkTwoPlayers();
  };

  // Called when a device disconnects (can take up to 5 seconds after device left)
  airconsole.onDisconnect = function(device_id) {
    const player = airconsole.convertDeviceIdToPlayerNumber(device_id);
    if (player) {
      // Player that was in game left the game.
      // Setting active players to length 0.
      airconsole.setActivePlayers(0);
    }
    checkTwoPlayers();
  };

  // onMessage is called everytime a device sends a message with the .message() method
  airconsole.onMessage = function(device_id, data) {
    const player = airconsole.convertDeviceIdToPlayerNumber(device_id);

    // Store any input.
    if (typeof player !== 'undefined' && data.notes) {
      players[player].notes = data.notes;
    }

    //
    if (players[0].notes && players[1].notes) {
      console.log('Both players submitted!');
      // Do score calculations.
      // Display score changes.
      // Perform animations: http://phaser.io/examples/v2/animation/animation-events
      players.forEach(player => {
        sendNewSong()
      })
    }
  };

  game.camera.focusOnXY(0, 0);

  function sendNewSong(player) {
    airconsole.message(
      airconsole.convertPlayerNumberToDeviceId(player),
      {
        action: 'RESET_SONG',
        song: 'Get Schwifty',
        numNotes: 12// the number of notes that this song contains
      })
  }

  /**
   * Checks if two players are connected!
   */
  function checkTwoPlayers() {
    var active_players = airconsole.getActivePlayerDeviceIds();
    var connected_controllers = airconsole.getControllerDeviceIds();
    // Only update if the game didn't have active players.
    if (active_players.length == 0) {
      if (connected_controllers.length >= 2) {
        // Enough controller devices connected to start the game.
        // Setting the first 2 controllers to active players.
        airconsole.setActivePlayers(2);
        document.getElementById("wait").innerHTML = "";
      } else if (connected_controllers.length == 1) {
        document.getElementById("wait").innerHTML = "Need 1 more player!";
      } else if (connected_controllers.length == 0) {
        document.getElementById("wait").innerHTML = "Need 2 more players!";
      }
    }
  }
}

function update () {
  // if(players[0].input && players[1].input) {
  //   console.log('Updating after both players submitted input!')
  // }
}

function render () {
  game.debug.text(`Game is running.`);
}
