var Splash = function () {};

Splash.prototype = {

  loadScripts: function () {
    game.load.script('menu', 'js/screen/states/menu.js')
    game.load.script('game', 'js/screen/states/game.js')

    game.load.json('dueling_banjos_meta', 'assets/music/dueling_banjos.json');
    game.load.json('jailhouse_now_meta', 'assets/music/jailhouse_now.json');
  },

  loadBgm: function () {
  },
  // varios freebies found from google image search
  loadImages: function () {
    game.load.image('mountains', 'assets/images/layer-2-mountain-grey.png');
    game.load.image('sky', 'assets/images/layer-1-sky.png');
  },

  loadFonts: function () {
  },

  init: function () {
    this.loadingBar = game.make.sprite(game.world.centerX-(387/2), 400, "loading");
    // this.logo       = game.make.sprite(game.world.centerX, 200, 'brand');
    this.status     = game.make.text(game.world.centerX, 380, 'Loading...', {fill: 'white'});
    utils.centerGameObjects([this.status]);
  },

  preload: function () {
    // game.add.sprite(0, 0, 'stars');
    // game.add.existing(this.logo).scale.setTo(0.5);
    game.add.existing(this.loadingBar);
    game.add.existing(this.status);
    this.load.setPreloadSprite(this.loadingBar);

    this.loadScripts();
    this.loadImages();
    this.loadFonts();
    this.loadBgm();
  },

  addGameStates: function () {
    game.state.add('Menu', GameMenu);
    game.state.add('Game', Game);
    // game.state.add("GameOver",GameOver);
  },

  create: function() {
    this.status.setText('Ready!');
    this.addGameStates();

    setTimeout(function () {
      game.state.start('Menu');
    }, 1000);
  }
};