var GameMenu = function() {};

let music;
var cloudVel1;
var cloudVel2;
var cloudVel3;

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
    game.load.audio('background_music', 'assets/music/jailhouse_now_full.mp3');
  },

  create: function () {
    this.addGameMusic()
    this.sky        = game.add.image(0, 0, 'sky')
    this.mountains  = game.add.image(0, 0, 'mountains')
	
	//Cloud creation here
	this.cloud1 	= game.add.sprite(game.world.randomX ,game.world.randomY,'cloud');
	cloudVel1 		= game.rnd.realInRange(-.2, .2)*30;
    this.cloud2 	= game.add.sprite(game.world.randomX ,game.world.randomY,'cloud');
    cloudVel2 		= game.rnd.realInRange(-.2, .2)*30;
    this.cloud3 	= game.add.sprite(game.world.randomX ,game.world.randomY,'cloud');
    cloudVel3 		= game.rnd.realInRange(-.2, .2)*30;
    
    var rand;
    rand = game.rnd.realInRange(.5, 2);
        //  Set the scale of the sprite to the random value
        this.cloud1.scale.setTo(rand, rand);
    rand = game.rnd.realInRange(.5, 2);
        //  Set the scale of the sprite to the random value
        this.cloud2.scale.setTo(rand, rand);
    rand = game.rnd.realInRange(.5, 2);
        //  Set the scale of the sprite to the random value
        this.cloud3.scale.setTo(rand, rand);
    //end cloud generation    
        
    game.stage.disableVisibilityChange = true;

    game.add.existing(this.titleText);
    game.add.existing(this.waitingText);
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
    this.cloud1.x += cloudVel1;					   //continues updating X position from previous velocity
  	    if (this.cloud1.x > game.world.width)	   //if cloud leaves to right...
    {
        this.cloud1.x = -this.cloud1.width;		   //set cloud to start of left of game screen
        cloudVel1 = game.rnd.realInRange(-2, 2);   //set new random cloud velocity
        this.cloud1.y = game.world.randomY;		   //set new random cloud height
    } else if (this.cloud1.x < -this.cloud1.width) //if cloud leaves to left...
    {
        this.cloud1.x = game.world.width;		   //set cloud to start at right of game screen
        cloudVel1 = game.rnd.realInRange(-2, 2);   //set new random cloud velocity
        this.cloud1.y = game.world.randomY;		   //set new random cloud height
    }
  
  	this.cloud2.x += cloudVel2;
  	    if (this.cloud2.x > game.world.width)
    {
        this.cloud2.x = -this.cloud2.width;
        cloudVel2 = game.rnd.realInRange(-2, 2);
        this.cloud2.y = game.world.randomY;
    } else if (this.cloud2.x < -this.cloud2.width)
    {
        this.cloud2.x = game.world.width;
        cloudVel2 = game.rnd.realInRange(-2, 2);
        this.cloud2.y = game.world.randomY;
    }
    
      	this.cloud3.x += cloudVel3;
  	    if (this.cloud3.x > game.world.width)
    {
        this.cloud3.x = -this.cloud3.width;
        cloudVel3 = game.rnd.realInRange(-2, 2);
        this.cloud3.y = game.world.randomY;
    } else if (this.cloud3.x < -this.cloud3.width)
    {
        this.cloud3.x = game.world.width;
        cloudVel3 = game.rnd.realInRange(-2, 2);
        this.cloud3.y = game.world.randomY;
    }
  },
};