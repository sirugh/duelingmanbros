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
  },
  {
    name: 'zelda_theme',
    played: false
  },
  {
    name: 'james_bond',
    played: false
  },
  {
    name: 'good_bad_ugly',
    played: false
  }
];

const Game = function (game) {};

Game.prototype = {
  currentSong: '',
  preload: function () {
    game.load.image('german','assets/images/TestMan.png');
    //game.load.spritesheet('notes','assets/images/NoteSpriteSheet129x283.png',129,283);
  },
  create: function () {
    // Display gameplay background
    this.sky        = game.add.image(0, 0, 'sky');
    this.mountains  = game.add.image(0, 0, 'mountains');
    
    // Create two german guys, one for each player
    this.german1    = game.add.image(224, game.world.height+572,'german');
    this.german2    = game.add.image(game.world.width-224, game.world.height+572, 'german');
    this.german1.scale.x *= -1;
    emit('GAME_STARTING');
    // TODO: Display Instruction text (for some time?)
    displayInstructions()
      .then(() => {
        emit('START');
        resetGame();

        // Emit the first song.
        let song = getNextSong();
        sendNewSong(song)
      });

    airconsole.onMessage = function(device_id, data) {
      const player = airconsole.convertDeviceIdToPlayerNumber(device_id);

      // Store any input.
      if (typeof player !== 'undefined' && data.notes) {
        console.log(`player ${player} submitted ${data.notes}`);
        players[player].notes = data.notes;
        //TODO: Show submitted animation (dude sings at opponent with musical notes)

        // Calculate score for this player's submission.
        for (let noteIndex = 0; noteIndex < currentSong.len; noteIndex++) {
          let actual = currentSong.pattern[noteIndex]
          let guess = data.notes[noteIndex]
          let distance = Math.abs(actual - guess)
          if (distance >= 4) {
            players[player].score += 1
          }
          else if (distance >= 3) {
            players[player].score += 2
          }
          else if (distance >= 2) {
            players[player].score += 5
          }
          else if (distance >= 1) {
            players[player].score += 8
          }
          else {
            players[player].score += 10
          }
        }
      }

      if (players[0].notes.length && players[1].notes.length) {
        console.log('Both players submitted!');

        // Perform animations: http://phaser.io/examples/v2/animation/animation-events
        players.forEach(player => {
          console.log(player.score)
        });

        let song = getNextSong();
        if (song) {
          sendNewSong(song)
        }
        else {
          console.log('No more songs. Game over!');
          //TODO game over.
          // game.state.start('GameOver')
        }
      }
    };

    function displayInstructions (callback) {
      const INSTRUCTION_TIMEOUT = 1000; //TODO: set to 10000 when playing fo real
      return new Promise((resolve, reject) => {
        const instructionText = "- Instructions -\n" +
                        "1. Listen to the sound clip.\n" +
                        "2. Use the staff to enter what you think you hear.\n" +
                        "3. The player who guessed closest gets points!\n" +
                        "4. Highest score at the end wins the game.";
        const style = { font: "65px Arial", fill: "#ff0044", align: "center" };
        const text = game.add.text(game.world.centerX, game.world.centerY, instructionText, style);
        text.anchor.set(0.5);
        text.alpha = 1;

        // After 5 seconds, fade out the instructions
        setTimeout(function () {
          game.add.tween(text).to( { alpha: 0 }, 1000, "Linear", true);
          resolve()
        }, INSTRUCTION_TIMEOUT)
      })
    }

    function resetGame() {
      if (music) {
        music.stop();
      }

      players.forEach(player => {
        player.score = 0
      });

      SONGS.forEach(song => {
        song.played = false
      });
    }

    /**
     * Gets the next song and returns the name, otherwise undefined.
     */
    function getNextSong () {
      // Get a random song that hasn't been played yet.
      const unplayedSongIndex = _.findIndex(SONGS, song => {
        return !song.played;
      });

      if(unplayedSongIndex < 0) {
        console.log('Unable to get an unplayed song.');
        return
      }
      else {
        SONGS[unplayedSongIndex].played = true;
        return SONGS[unplayedSongIndex].name;
      }
    }

    function sendNewSong(songName) {
      players.forEach(player => {
        player.notes = []
      });

      //Play the song on screen as clue:
      this.currentSong = game.cache.getJSON(`${songName}_meta`);
      console.log(`Playing ${this.currentSong.name}`)
      music = game.add.audio(songName);
      music.play();
      music.onStop.add(function () {
         // Then transmit song data to controllers so they can play.

        for (var i = 1; i <= 2; i++) {
          airconsole.message(
            airconsole.convertPlayerNumberToDeviceId(i),
            {
              action: 'RESET_SONG',
              song: this.currentSong.name,
              numNotes: this.currentSong.pattern.length,
              startingNote: this.currentSong.start
            })
        }
      })
    }
  },

  update: function () {
    // Update stuff goes here.
    if (this.german1.y > game.world.height-this.german1.height) {
    	this.german1.y -= 3;
    }
    if (this.german2.y > game.world.height-this.german2.height) {
    	this.german2.y -= 3;
    }
  },

  render: function () {
    game.debug.text(`
      Scores -- Player 1: ${players[0].score}\nPlayer 2: ${players[1].score}\n
    `, 0, 100);
  }
};
