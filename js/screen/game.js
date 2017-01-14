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

const STATE = {
  WAITING: 0, // Waiting for more players to join
  PLAYING: 1, // Players selecting notes
  RESULTS: 2, // Showing results of players input, updating
};


let currentState = STATE.WAITING;

const players = [
  {
    score: 0,
    notes: []
  },
  {
    score: 0,
    notes: []
  }
];

const SONGS = [
  {
    name: 'dueling_banjos',
    played: false
  },
  {
    name: 'jailhouse_now',
    played: false
  }
];

function preload () {
  game.load.json('dueling_banjos_meta', '../../assets/music/dueling_banjos.json');
  game.load.json('jailhouse_now_meta', '../../assets/music/jailhouse_now.json');
  // game.load.image('logo', 'assets/logo.png');
  // game.load.image('note', 'assets/game/note.png');
  // game.load.image('mountain', 'assets/game/mountain.png')
  // game.load.image('earth', 'assets/game/scorched_earth.png');
  // game.load.atlas('tank', 'assets/game/tanks.png', 'assets/game/tanks.json');
  // game.load.atlas('enemy', 'assets/game/enemy-tanks.png', 'assets/game/tanks.json');
  // game.load.spritesheet('kaboom', 'assets/game/explosion.png', 64, 64, 23);
}

function create () {
  const airconsole = new AirConsole();

  // As soon as a device connects we add it to our device-map
  airconsole.onConnect = function(device_id) {
    checkTwoPlayers();
  };

  // Called when a device disconnects (can take up to 5 seconds after device left)
  airconsole.onDisconnect = function(device_id) {
    const player = airconsole.convertDeviceIdToPlayerNumber(device_id);
    if (player) {
      // Player that was in game left the game.
      // Reset game
      endGame()
    }
    checkTwoPlayers();
  };

    /**
     * Checks if two players are connected!
     */
    function checkTwoPlayers() {

      // Only update if the game didn't have active players.
      if (currentState == STATE.WAITING) {
        if (connected_controllers.length >= 2) {
          // Enough controller devices connected to start the game.
          startGame()
        } else {
          // Show waiting for 1 or 2 more players
          // Still in waiting state
        }
      } else {
        // We already have people playing the game
        // State is either PLAYING or RESULTS and should remain that
      }
    }
  }

  // onMessage is called everytime a device sends a message with the .message() method
  airconsole.onMessage = function(device_id, data) {
    const player = airconsole.convertDeviceIdToPlayerNumber(device_id);

    // Store any input.
    if (typeof player !== 'undefined' && data.notes) {
      players[player].notes = data.notes;
    }

    if (players[0].notes.length && players[1].notes.length) {
      console.log('Both players submitted!');
      // Do score calculations.
      // TODO: Compare against state.song.notes

      // Perform animations: http://phaser.io/examples/v2/animation/animation-events
      players.forEach(player => {

      });
      sendNewSong()
    }
  };

  game.camera.focusOnXY(0, 0);

  function startGame() {
    stopClip();

    // Setting the first 2 controllers to active players.
    airconsole.setActivePlayers(2);
    currentState = STATE.STARTED;

    players.forEach(player => {
      player.score = 0
    });

    SONGS.forEach(song => {
      song.played = false
    });

    // Emit the first song.
    sendNewSong()
  }

  function sendNewSong() {
    players.forEach(player => {
      player.notes = []
    });

    // Get a random song that hasn't been played yet.

    const unplayedSongIndex = _.findIndex(SONGS, song => {
      return !song.played;
    });

    if(unplayedSongIndex < 0) {
      console.log('ALL SONGS PLAYED. END GAME.');
      //TODO end game.
    }
    else {
      SONGS[unplayedSongIndex].played = true;
      const song = SONGS[unplayedSongIndex];

      const song_meta = game.cache.getJSON(`${song.name}_meta`);

      for (var i = 1; i <= 2; i++) {
        airconsole.message(
          airconsole.convertPlayerNumberToDeviceId(i),
          {
            action: 'RESET_SONG',
            song: song_meta.name,
            numNotes: song_meta.pattern.length,
            startingNote: song_meta.start
          })
      }
      // TODO: Set current state.song
    }
  }

  function endGame() {
    stopClip();
    airconsole.setActivePlayers(0);
    currentState = STATE.WAITING;

    // Update page to show waiting display, or wait for update to be re-ran
    // Update controllers with new state

  }

}

function update () {
  if (currentState === STATE.WAITING) {

  }

  if (currentState === STATE.PLAYING) {

  }

  if (currentState === STATE.RESULTS) {

  }
}

function render () {
  game.debug.text(`Game is running.`);
}

function playClip(clip) {
  // play sound
}

function stopClip() {
  // stop sound
}
