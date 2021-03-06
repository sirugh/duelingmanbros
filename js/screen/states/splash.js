var Splash = function () {};

Splash.prototype = {

  loadScripts: function () {
    game.load.script('menu', 'js/screen/states/menu.js');
    game.load.script('game', 'js/screen/states/game.js');
    game.load.script('scores', 'js/screen/states/scores.js');
  },

  loadMusic: function () {
    const titles = [
      'dueling_banjos', 'jailhouse_now', 'good_bad_ugly', 'james_bond', 'zelda_theme'
    ];

    titles.forEach(title => {
      game.load.audio(title, `assets/music/${title}.mp3`)
      game.load.json(`${title}_meta`, `assets/music/${title}.json`);
      game.load.image(`${title}_answer`, `assets/music/${title}_answer.png`)
    })

    game.load.audio('background_music', 'assets/music/jailhouse_now_full.mp3');
    game.load.audio('i_like_what_you_got', 'assets/music/i_like_what_you_got.mp3');
    game.load.audio('show_me_what_you_got', 'assets/music/show_me_what_you_got.mp3');
  },
  // varios freebies found from google image search
  loadImages: function () {
    game.load.image('mountains', 'assets/images/layer-2-mountain-grey.png');
    game.load.image('sky', 'assets/images/Background-sky-cloudless.png');
    game.load.image('cloud', 'assets/images/Cloud.png');
    game.load.image('german','assets/images/GermanGuy.png');
    game.load.spritesheet('notes','assets/images/NoteSpriteSheet129x283.png', 129, 283, 5);
    game.load.image('giant_head','assets/images/giant_head.png');
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
    game.state.add("Scores", GameScores);
  },

  create: function() {
    this.status.setText('Ready!');
    this.addGameStates();

    setTimeout(function () {
      game.state.start('Menu');
    }, 1000);
  }
};