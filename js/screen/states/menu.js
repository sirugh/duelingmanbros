var GameMenu = function() {};

let music;

GameMenu.prototype = {
  init: function () {
    this.titleText = game.make.text(game.world.centerX, 100, "Welcome to Dueling Man-Bros", {
      font: 'bold 60pt Comic Sans', //because I am a dick.
      fill: '#C54C00',
      align: 'center'
    });

    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);

    this.waitingText = game.make.text(game.world.centerX, 300, "Connect using the code to play!", {
      font: 'bold 45pt Comic Sans',
      fill: '#C54C00',
      align: 'center'
    });
    this.waitingText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.waitingText.anchor.set(0.5);
  },

  preload: function () {
  },

  create: function () {
    this.addGameMusic()
    // Layer clouds between sky and mountains.
    this.sky        = game.add.image(0, 0, 'sky')
    this.generateClouds()
    this.mountains  = game.add.image(0, 0, 'mountains')
    game.stage.disableVisibilityChange = true;
    game.add.existing(this.titleText);
    game.add.existing(this.waitingText);

    this.createDeviceListeners();
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
  addGameMusic: function () {
    if (music) {
      music.stop()
    }

    music = game.add.audio('background_music');
    music.loop = true;
    music.play();
  },
  update: function () {
    this.updateClouds()
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

  /**
   * Sets up airconsole listeners.
   */
  createDeviceListeners: function () {
    const self = this

    airconsole.onConnect = function () {
      var connected_controllers = airconsole.getControllerDeviceIds();
      if (connected_controllers.length >= 2) {
        console.log('SCREEN: 2 players connected.')
        airconsole.setActivePlayers(2);

        console.log('SCREEN: Displaying instructions.')

        self.displayInstructions()
          .then(function () {
            console.log('SCREEN: Starting game.')
            if (music) {
              //TODO: figure out how to fade out music instead of hard stop.
              music.stop()
            }
            emit('GAME_STARTING');
            game.state.start('Game')
          })

      }
      else {
        emit('WAITING_FOR_PLAYERS')
      }
    }

    airconsole.onDisconnect =  function (device_id) {
      const player = airconsole.convertDeviceIdToPlayerNumber(device_id);
      console.log(`Player ${player} disconnected. Going back to menu.`)

      emit('WAITING_FOR_PLAYERS')

      if (game.state.current !== 'Menu') {
        game.state.start('Menu')
      }
    }
  },
  displayInstructions: function () {
    game.add.tween(this.titleText).to( { alpha: 0 }, 1000, "Linear", true);
    game.add.tween(this.waitingText).to( { alpha: 0 }, 1000, "Linear", true);
    const INSTRUCTION_TIMEOUT = 15000;
    return new Promise((resolve, reject) => {
      const instructionText = "- Instructions -\n" +
                      "1. Listen to the sound clip.\n" +
                      "2. Use the staff to enter what you think you hear.\n" +
                      "3. The closer you are, the more points you get!\n" +
                      "4. Highest score at the end wins the game.";
      const style = { font: "65px Arial", fill: "#C54C00", align: "center" };
      const text = game.add.text(game.world.centerX, game.world.centerY - 300, instructionText, style);
      text.anchor.set(0.5);
      text.alpha = 1;

      // After 5 seconds, fade out the instructions
      setTimeout(function () {
        const tween = game.add.tween(text).to( { alpha: 0 }, 1000, "Linear", true);
        tween.onComplete.add(resolve)
      }, INSTRUCTION_TIMEOUT)
    })
  }
};

