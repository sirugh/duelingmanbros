/** OLD, PRE-STATE MANAGEMENT CODE */
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

const Game = function (game) {}

Game.prototype = {
  preload: function () {

  },
  create: function () {
    // Display gameplay background
    this.sky        = game.add.image(0, 0, 'sky')
    this.mountains  = game.add.image(0, 0, 'mountains')

    // Display Instruction text (for some time?)
    // Countdown to begin! (then emit start event w/ song info)

    setTimeout(function () {
      emit('START')
      startGame()
    }, 5000)

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
        emit('END_GAME')
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
  },

  update: function () {
    if (currentState === STATE.WAITING) {

    }

    if (currentState === STATE.PLAYING) {

    }

    if (currentState === STATE.RESULTS) {

    }
  }
}

function playClip(clip) {
  // play sound
}

function stopClip() {
  // stop sound
}
