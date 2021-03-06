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
let notes1, notes2, head, headVoice
Game.prototype = {
  currentSong: '',
  create: function () {
    const self = this;
    // Display gameplay background
    this.sky        = game.add.image(0, 0, 'sky');
    this.generateClouds()
    this.mountains  = game.add.image(0, 0, 'mountains');

    // Create two german guys, one for each player
    this.german1    = game.add.image(224, game.world.height+572,'german');
    this.german2    = game.add.image(game.world.width-224, game.world.height+572, 'german');
    this.german1.scale.x *= -1;


    this.p1ScoreText = game.make.text(140, 100, `Player 1\n${players[0].score}`, {
      font: 'bold 45pt Comic Sans',
      fill: '#C54C00',
      align: 'left'
    });
    this.p1ScoreText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.p1ScoreText.anchor.set(0.5);

    this.p2ScoreText = game.make.text(game.world.width-140, 100, `Player 2\n${players[1].score}`, {
      font: 'bold 45pt Comic Sans',
      fill: '#C54C00',
      align: 'right'
    });
    this.p2ScoreText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.p2ScoreText.anchor.set(0.5);

    resetGame();

    displayGiantHead()
      .then(function () {
        // Emit the first song.
        sendNewSong(getNextSong());
      })

    game.add.existing(this.p1ScoreText);
    game.add.existing(this.p2ScoreText);

    function replayCurrentSong() {
      const width = game.cache.getImage(`${this.currentSong.name}_answer`).width;
      const height = game.cache.getImage(`${this.currentSong.name}_answer`).height;

      const x = (game.world.width / 2) - (width / 2)
      const y = (game.world.height / 2) - (height / 2)
      const answer = game.add.image(x, y, `${this.currentSong.name}_answer`);
      return new Promise ((resolve, reject) => {
        music.play();
        music.onStop.addOnce(function () {
          console.log('Song playback finished.')
          const tween = game.add.tween(answer).to( { alpha: 0 }, 1000, "Linear", true);
          tween.onComplete.add(function () {
            answer.kill()
            resolve()
          })
        })
      })
    }

    function stopNoteAnimation(note) {
      notes1.animations.stop()
      notes2.animations.stop()
      notes1.kill()
      notes2.kill()
    }

    // On Receiving message from phone
    airconsole.onMessage = function(device_id, data) {
      const player = airconsole.convertDeviceIdToPlayerNumber(device_id);

      // Store any input.
      if (typeof player !== 'undefined' && data.notes) {
        console.log(`player ${player} submitted ${data.notes}`);
        players[player].notes = data.notes;

        // Play animations for the player who just submitted.
        if(player === 0) {
          notes1 = game.add.sprite(224, game.world.height - self.german1.height - 175, 'notes')
          const play1 = notes1.animations.add('playNotes')
          notes1.animations.play('playNotes', 10, true)
        }
        else if (player === 1) {
          notes2 =  game.add.sprite(game.world.width - 224, game.world.height - self.german1.height - 175, 'notes')
          notes2.scale.x *= -1;
          const play2 = notes2.animations.add('playNotes')
          notes2.animations.play('playNotes', 10, true)
        }
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
        replayCurrentSong()
          .then(function () {
            stopNoteAnimation();

            // Display Score Changes
            players.forEach(player => {
              console.log(player.score)
            });


            let song = getNextSong();
            if (song) {
              sendNewSong(song)
            }
            else {
              console.log('No more songs. Game over!');
              // Tell the controllers the game is over.
              emit('END_GAME')
              headVoice = game.add.audio('i_like_what_you_got');
              headVoice.play();
              const tween = game.add.tween(head).to( { y: -200 }, 4000, 'Linear', true);
              tween.onComplete.add(function () {
                // Display the end game scene.
                const winner = players[0].score > players[1].score ? 'Player 1' : 'Player 2'
                game.state.start('Scores', true, false, winner, players)
              })
            }
          })
      }
    };

    function displayGiantHead () {
      return new Promise((resolve, reject) => {
        //  We position the sprite in the middle of the game but off the top
        head = game.add.sprite(game.world.centerX, -200, 'giant_head');
        head.anchor.set(0.5);
        headVoice = game.add.audio('show_me_what_you_got');
        headVoice.play();
        //  It will end up at the middle of the game, as it's tweening TO the value given
        const tween = game.add.tween(head).to( { y: game.world.centerY - 100 }, 4000, Phaser.Easing.Bounce.Out, true);
        tween.onComplete.add(function () {
          resolve()
        })
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
      shuffleSongs();
    }

    function shuffleSongs() {
      let counter = SONGS.length;

      // While there are elements in the array
      while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = SONGS[counter];
        SONGS[counter] = SONGS[index];
        SONGS[index] = temp;
      }
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
      music.onStop.addOnce(function () {
         // Then transmit song data to controllers so they can play.
        emit('RESET_SONG', {
          song: this.currentSong.name,
          numNotes: this.currentSong.pattern.length,
          startingNote: this.currentSong.start
        })
      })
    }
  },
  updateScoreText: function () {
    this.p1ScoreText.setText(`Player 1\n${players[0].score}`);
    this.p2ScoreText.setText(`Player 2\n${players[1].score}`);
  },
  update: function () {
    // Update stuff goes here.
    if (this.german1.y > game.world.height-this.german1.height) {
    	this.german1.y -= 10;
    }
    if (this.german2.y > game.world.height-this.german2.height) {
    	this.german2.y -= 10;
    }
    this.updateClouds()
    this.updateScoreText()
  },

  generateClouds: function () {
    this.clouds = this.clouds || {}

    for (var i = 0; i < 3; i++) {
      let prop = `cloud${i}`
      let rand = game.rnd.realInRange(.5, 2);
      // Create and scale the cloud.
      this.clouds[prop] = game.add.sprite(game.world.randomX, this.getRandomCloudHeight(), 'cloud');
      this.clouds[prop].scale.setTo(rand, rand);
      // Set a random velocity
      this.clouds[prop].velocity = game.rnd.realInRange(-.2, .2) * 30;
    }
  },
  updateClouds: function () {
    _.each(this.clouds, cloud => {
      cloud.x += cloud.velocity
      if (cloud.x > game.world.width) {  //if cloud leaves to right...
        cloud.x = -cloud.width;      //set cloud to start of left of game screen
        cloud.velocity = game.rnd.realInRange(-2, 2);   //set new random cloud velocity
        cloud.y = this.getRandomCloudHeight()      //set new random cloud height
      }
      // if cloud leaves to left...
      else if (cloud.x < -cloud.width) {
        cloud.x = game.world.width;
        cloud.velocity = game.rnd.realInRange(-2, 2);   //set new random cloud velocity

        cloud.y = this.getRandomCloudHeight()
      }
    })
  },
  getRandomCloudHeight: function () {
    return Math.floor(game.rnd.realInRange(0, 1) * (game.world.height / 2))
  },
};
