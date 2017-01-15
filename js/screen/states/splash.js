var Splash = function () {};

Splash.prototype = {

  loadScripts: function () {
    game.load.script('menu', 'js/screen/states/menu.js')
    game.load.script('game', 'js/screen/states/game.js')
  },

  loadMusic: function () {
    const titles = [
      'dueling_banjos', 'jailhouse_now', 'good_bad_ugly', 'james_bond', 'zelda_theme'
    ];

    titles.forEach(title => {
      game.load.audio(title, `assets/music/${title}.mp3`)
      game.load.json(`${title}_meta`, `assets/music/${title}.json`);
    })

    game.load.audio('background_music', 'assets/music/jailhouse_now_full.mp3');
  },
  // varios freebies found from google image search
  loadImages: function () {
    game.load.image('mountains', 'assets/images/layer-2-mountain-grey.png');
    game.load.image('sky', 'assets/images/Background-sky-cloudless.png');
    game.load.image('cloud', 'assets/images/Cloud.png');
  },

  loadFonts: function () {
  },

  init: function () {
    this.loadingBar = game.make.sprite(game.world.centerX-(387/2), 400, "loading");
    this.status     = game.make.text(game.world.centerX, 380, 'Loading...', {fill: 'white'});
    utils.centerGameObjects([this.status]);
  },

  preload: function () {
    game.add.existing(this.loadingBar);
    game.add.existing(this.status);
    this.load.setPreloadSprite(this.loadingBar);

    this.loadScripts();
    this.loadImages();
    this.loadFonts();
    this.loadMusic();
  },

  addGameStates: function () {
    game.state.add('Menu', GameMenu);
    game.state.add('Game', Game);
    // game.state.add("GameOver",GameOver);
  },

  create: function() {
    this.status.setText('Ready!');
    this.addGameStates();

    this.createDeviceListeners();

    setTimeout(function () {
      game.state.start('Menu');
    }, 1000);
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
        if (music) {
          music.stop()
        }
        game.state.start('Game')
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
};