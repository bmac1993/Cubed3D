﻿// Obstacle handler will contain the list of obstacles in the obstacles array
// RESPONSIBILITIES: 
// generating new obstacles
// updating the obstacles location
// deleting the obstacle if it goes off screen
// handling hit detection of player and obstacle
// increasing game difficulty over time
// adding on hit Audio
// adding on hit HTML tag display effects

"use strict";

function obstacleHandler(scene, player, hitEffect, coinEffect, coinEffectImg) {
    var self = this;
    self.obstacles = [];
    self.coins = [];
    self.spawnChance = 1; // out of 100
    self.hitEffectTimer = 0;
    self.coinEffectTimer = 0;
    self.obstacleSpeed = 0.7; // Speed of obstacles
    //self.coinImgTimer = 0;

    self.generate = function () { // adds obstacles - called in main update()
        if(Game.gameState != "END" && Game.gameState != "PAUSED")
        {
            var rndm = Math.random();
            if (rndm < self.spawnChance / 100) {
                self.obstacles.push(new Obstacle(scene));
            }
            if (rndm < (self.spawnChance/200))
            {
                self.coins.push(new Coin(scene));
            }
        }
    };

    self.handleDifficulty = function () {   // increments spawn rate based on seconds passed in game

        if (self.spawnChance < 20 && Game.gameState == "PLAYING") {
            if (Game.time % 10 === 0) {
                self.spawnChance = (Game.time / 6) + 2;
            }
        }
        if(Game.time == 10){
            self.obstacleSpeed = 0.8;
        }
        if(Game.time == 20){
            self.obstacleSpeed = 0.9;
        }
        if(Game.time == 30){
            self.obstacleSpeed = 1;
        }
        if(Game.time == 50){
            self.obstacleSpeed = 1.1;
        }
        if(Game.time == 70){
            self.obstacleSpeed = 1.2;
        }
        if(Game.time == 90){
            self.obstacleSpeed = 1.3;
        }
        if(Game.time == 120){
            self.obstacleSpeed = 1.4;
        }

    };

    self.updateObstacles = function() {  // updates obstacles locations - called in main update()
        if (Game.gameState != "END" && Game.gameState != "PAUSED") {
            for (var i = self.obstacles.length - 1; i >= 0; i--) { // have to loop backwards because deleting from array shifts array
                var obstacle = self.obstacles[i];

                if (obstacle.cube.position.z > 0 - player.zLength) {  // INFO: player is located at 0 on the Z axis
                    if (obstacle.xPos == player.xPos && obstacle.yPos == player.yPos && Game.gameState != "MENU" && Game.gameState != "PAUSED" && self.hitEffectTimer <= 0) { // player ran into a cube
                        
						//play audio
						collisionAudio.volume = 0.5;
                        collisionAudio.play();
						
						//take away lives and show hit effect
                        Game.lives--;
                        hitEffect.style.display = "block";
                        self.hitEffectTimer = 100;
						
						//if there are no more lives, Game OVER
                        if (Game.lives == 0) {
                            Game.setGameState("END");
                            hitEffect.style.display = "none";
                            self.spawnChance = 1;
                            self.cleanObstacles();
                        }
                        scene.remove(obstacle.cube);
                        self.obstacles.splice(i, 1);
                    }
                    else
                    {
                        scene.remove(obstacle.cube);
                        self.obstacles.splice(i, 1);
                    }
                }
                if (obstacle.cube.position.z > 0) {   //obstacle is off screen
                    scene.remove(obstacle.cube);
                    self.obstacles.splice(i, 1);
                }
                else {  // move obstacle
                    obstacle.updateLocation(self.obstacleSpeed);
                }
            }


            for (var i = self.coins.length - 1; i >= 0; i--) { // have to loop backwards because deleting from array shifts array
                var currentCoin = self.coins[i];

                if (currentCoin.coin.position.z > 0 - player.zLength) {  // INFO: player is located at 0 on the Z axis
                    if (currentCoin.xPos == player.xPos && currentCoin.yPos == player.yPos && Game.gameState != "MENU" && Game.gameState != "PAUSED" && self.hitEffectTimer <= 0) { // player ran into a cube
                        //play audio
						collectAudio.volume = 0.3;
                        collectAudio.play();
						
						//add to total coin amount and display coin effects
                        Game.coins++;
                        coinEffect.style.display = "block";
                        //coinEffectImg.style.display = "block";
						
                        self.coinEffectTimer = 70;
                        //self.coinImgTimer = 50;
                        scene.remove(currentCoin.coin);
                        self.coins.splice(i, 1);
                    }
                    else
                    {
                        scene.remove(currentCoin.coin);
                        self.coins.splice(i, 1);
                    }
                }
                if (currentCoin.coin.position.z > 0) {   //obstacle is off screen
                    scene.remove(currentCoin.coin);
                    self.coins.splice(i, 1);
                }
                else {  // move obstacle
                    currentCoin.updateLocation(self.obstacleSpeed);
                }
            }
        }
		
		//add a fade away effect to the on hit effects 
        if(self.hitEffectTimer > 0)
        {
            self.hitEffectTimer--;
            hitEffect.style.opacity = self.hitEffectTimer/100;
        }
        else
        {
            hitEffect.style.display = "none";
        }

        if (self.coinEffectTimer > 0) {
            self.coinEffectTimer--;
            coinEffect.style.opacity = self.coinEffectTimer / 70;
        }
        else {
            coinEffect.style.display = "none";
        }

       /* if (self.coinImgTimer > 0) {
            self.coinImgTimer--;
            coinEffectImg.style.opacity = self.coinEffectTimer / 50;
        }
        else {
            coinEffectImg.style.display = "none";
        }*/
    };

    // cleans obstacles and coins array on game over
    self.cleanObstacles = function() {
        for (var i = self.obstacles.length - 1; i >= 0; i--) {
            var obstacle = self.obstacles[i];
            scene.remove(obstacle.cube);
            self.obstacles.splice(i, 1);
        }
        for (var i = self.coins.length - 1; i >= 0; i--) {
            var currentCoin = self.coins[i];
            scene.remove(currentCoin.coin);
            self.coins.splice(i, 1);
        }
    }
}