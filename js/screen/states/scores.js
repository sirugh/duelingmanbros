var GameScores = function() {};

GameScores.prototype = {
  init: function (winningPlayer, players) {
    console.log(winningPlayer);

    this.congratulationsText = game.make.text(game.world.centerX, 100, `Congratulations ${winningPlayer}`, {
      font: 'bold 60pt Comic Sans',
      fill: '#C54C00',
      align: 'center'
    });

    this.congratulationsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.congratulationsText.anchor.set(0.5);

    let player1Score = players[0].score
    let player2Score = players[1].score
    this.scoreText = game.make.text(game.world.centerX, 300, `Scores\nPlayer 1: ${player1Score}\t\tPlayer 2: ${player2Score}`, {
      font: 'bold 45pt Comic Sans',
      fill: '#C54C00',
      align: 'center'
    });
    this.scoreText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.scoreText.anchor.set(0.5);

    this.newGameText = game.make.text(game.world.centerX, 500, "New game will begin in 10 seconds.", {
      font: 'bold 45pt Comic Sans',
      fill: '#C54C00',
      align: 'center'
    });

    this.newGameText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.newGameText.anchor.set(0.5);

    // Restart game after 5 seconds
    setTimeout(function () {
      game.state.start('Game')
    }, 10000)
  },

  create: function () {
    this.addGameMusic()
    // Layer clouds between sky and mountains.
    this.sky        = game.add.image(0, 0, 'sky')
    this.generateClouds()
    this.mountains  = game.add.image(0, 0, 'mountains')
    game.stage.disableVisibilityChange = true;

    game.add.existing(this.congratulationsText);
    game.add.existing(this.scoreText);
    game.add.existing(this.newGameText);
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
