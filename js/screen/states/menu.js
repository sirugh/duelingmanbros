var GameMenu = function() {};

let music;

GameMenu.prototype = {
  init: function () {
    this.titleText = game.make.text(game.world.centerX, 100, "Welcome to Dueling Man-Bros", {
      font: 'bold 60pt Comic Sans', //because I am a dick.
      fill: '#FFD0A3',
      align: 'center'
    });

    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);

    this.waitingText = game.make.text(game.world.centerX, 300, "Connect using the code to play!", {
      font: 'bold 45pt Comic Sans',
      fill: '#FFD0A3',
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
  }
};
