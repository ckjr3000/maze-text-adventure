# MAZE TEXT ADVENTURE

Version: 1.0.0
Author: Charlotte Roe  
Date: 05/08/22

Text adventure game where you move through a maze fighting 'threats' for 'treasure'.

The aim of the game is to reach the exit with as much 'wealth' as possible.

TO DEPLOY

- Upload these game files to a server
- To configure the connection to json, upload maze-config.json to a seperate server and replace the local file path with the url in game.js (location is commented).

MAZE CONFIGURATION

- The maze structure is defined in maze-config.json
- In this version of the project, rooms are set up in a grid formation
- A enterable passage is present wherever two rooms are adjoined by a wall in a grid
- The location of the exit passage and the types of items present in each room are randomly generated at the start of a new game
- Where a passage's 'joinsTo' value is the same as the id of its parent room, the player will not be allowed to move in that direction
- maze-config.json can be edited to create different default maze layouts
- WARNING - if you reconfigure the default maze layout make sure every room has at least one enterable passage, otherwise you risk a player being randomly placed in a room they can not leave upon game start

Documention of maze structure. A passage is present wherever there is an adjoing room.

---

|1| 2| 3|

---

|4| 5| 6|

---

|7| 8| 9|

---

{
"rooms": [
{
"id": 1
"roomNorth": null,
"roomEast": 2,
"roomSouth": 4,
"roomWest": null
},
{
"id": 2
"roomNorth": null,
"roomEast": 3,
"roomSouth": 5,
"roomWest": 1
},
{
"id": 3
"roomNorth": null,
"roomEast": null,
"roomSouth": 6,
"roomWest": 2
},
{
"id": 4
"roomNorth": 1,
"roomEast": 5,
"roomSouth": 7,
"roomWest": null
},
{
"id": 5
"roomNorth": 2,
"roomEast": 6,
"roomSouth": 8,
"roomWest": 4
},
{
"id": 6
"roomNorth": 3,
"roomEast": null,
"roomSouth": 9,
"roomWest": 5
},
{
"id": 7
"roomNorth": 4,
"roomEast": 8,
"roomSouth": null,
"roomWest": null
},
{
"id": 8
"roomNorth": 5,
"roomEast": 9,
"roomSouth": null,
"roomWest": 7
},
{
"id": 9
"roomNorth": 6,
"roomEast": null,
"roomSouth": "exit",
"roomWest": 8
},
]
}
