﻿// Obstacle handler will contain the list of obstacles in the obstacles array
// RESPONSIBILITIES: 
// generating new obstacles
// updating the obstacles location
// deleting the obstacle if it goes off screen
function obstacleHandler(scene, player) {
    var self = this;
    self.obstacles = [];
    self.spawnChance = 1; // out of 100

    self.generate = function () { // adds obstacles - called in main update()
        var rndm = Math.random();
        if (rndm < self.spawnChance / 100) {
            self.obstacles.push(new Obstacle(scene));
        }
    }

    self.updateObstacles = function(){  // updates obstacles locations - called in main update()
        for (var i = self.obstacles.length - 1; i >= 0 ; i--) { // have to loop backwards because deleting from array shifts array
            var obstacle = self.obstacles[i];

            if (obstacle.cube.position.z > 0 - player.zLength) {  // INFO: player is located at 0 on the Z axis
                if (obstacle.xPos == player.xPos && obstacle.yPos == player.yPos) { // player ran into a cube
                    scene.remove(obstacle.cube);
                    self.obstacles.splice(i, 1);
                    Game.lives--;
                    if (Game.lives == 0) {
                        Game.setGameState("END");
                    }
                }
            }
            if (obstacle.cube.position.z > 0) {   //obstacle is off screen
                scene.remove(obstacle.cube);
                self.obstacles.splice(i, 1);
            }
            else {  // move obstacle
                obstacle.updateLocation();
            }
        }
    }
}