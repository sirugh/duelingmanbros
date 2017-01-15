var GameMenu = function() {};

let music;

GameMenu.prototype = {
  init: function () {
    this.titleText = game.make.text(game.world.centerX, 100, "Welcome to Dueling Man-Bros", {
      font: 'bold 60pt Times New Roman',
      fill: '#FDFFB5',
      align: 'center'
    });

    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);

    this.waitingText = game.make.text(game.world.centerX, 300, "Connect using the code to play!", {
      font: 'bold 45pt Times New Roman',
      fill: '#FDFFB5',
      align: 'center'
    });
    this.waitingText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.waitingText.anchor.set(0.5);
  },

  preload: function () {
    game.load.audio('jailhouse', 'assets/music/jailhouse_now_full.mp3');
  },

  create: function () {
    this.addGameMusic()

    this.sky        = game.add.image(0, 0, 'sky')
    this.mountains  = game.add.image(0, 0, 'mountains')

    game.stage.disableVisibilityChange = true;

    game.add.existing(this.titleText);
    game.add.existing(this.waitingText);

    this.createDeviceListeners()
  },

  /**
   * Sets up airconsole listeners.
   */
  createDeviceListeners: function () {
    airconsole.onConnect = function () {
      var connected_controllers = airconsole.getControllerDeviceIds();
      if (connected_controllers.length >= 2) {
        console.log('2 players connected. Starting game.')
        airconsole.setActivePlayers(2);
        emit('GAME_STARTING')
        music.stop()
        game.state.start('Game')
      }
      else {
        emit('WAITING_FOR_PLAYERS')
      }
    }

    airconsole.onDisconnect =  function (device_id) {
      const player = airconsole.convertDeviceIdToPlayerNumber(device_id);
      console.log(`Player ${player} disconnected. Going back to menu.`)

      if (game.state.current !== 'Menu') {
        game.state.start('Menu')
      }
    }
  },
  addGameMusic: function () {
    if (music) {
      music.stop()
    }

    music = game.add.audio('jailhouse');
    music.loop = true;
    music.play();
  },
};