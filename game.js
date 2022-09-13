const textElement = document.getElementById("text");
const optionButtonsElement = document.getElementById("option-buttons");
const wealthElement = document.getElementById("wealth");

// Initialise wealth
let wealth = 0;

/* NOTE FOR DEPLOYMENT 
This fetch function is able to query a local JSON file in VS code with the Live Server extension
For production environment, any JSON files should be hosted on another server to prevent a CORS error
Change the value of apiUrl to appropiate URL to fetch JSON from a server
More info: https://www.freecodecamp.org/news/how-to-read-json-file-in-javascript/
*/
const apiUrl = "https://darling-travesseiro-f45696.netlify.app/maze-config.json" // Can be used for live/deployed version
//const apiUrl = "./db/maze-config.json"; // For local testing and development
let defaultMaze;
// Gets default maze structure from maze-config.json, puts it into 'defaultMaze' object.
async function getDefaultMaze() {
  const response = await fetch(apiUrl);
  const data = await response.json();
  defaultMaze = data;
  // Validate data
  const isEmpty = Object.keys(data).length === 0;
  if (isEmpty) {
    alert(
      "Error: JSON fetch failed. Attempting again. If the problem persists please contact the development team."
    );
  } else {
    await initialiseMaze();
  }
}

function getRandomIndex(array) {
  const r = Math.floor(Math.random() * array.length);
  return r;
}

// arrays to randomise
const roomIDs = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const threats = ["skeleton", "goblin", "troll"];
const treasures = ["bronze", "silver", "gold"];

function setCurrentItems() {
  let i = getRandomIndex(threats);
  currentThreat = threats[i];
  let j = getRandomIndex(treasures);
  currentTreasure = treasures[j];
}

// Randomises items and exit location in default maze to create maze instance for current game
let currentMaze;
function initialiseMaze() {
  // set items
  for (let i = 0; i < 9; i++) {
    setCurrentItems();
    defaultMaze.rooms[i].items.threat = currentThreat;
    defaultMaze.rooms[i].items.treasure = currentTreasure;
  }
  // set exit location
  let i = getRandomIndex(roomIDs);
  let passages = defaultMaze.rooms[i].passages;
  let j = getRandomIndex(passages);
  defaultMaze.rooms[i].passages[j].isExit = true;

  currentMaze = defaultMaze;

  // Validation - check that an exit is present
  let exits = [];
  currentMaze.rooms.forEach((room) => {
    room.passages.forEach((passage) => {
      if (passage.isExit == true) {
        exits.push(1);
      }
    });
  });
  if (exits.length != 1) {
    alert(
      "There was an error initialising the maze. Restarting the game.  If the problem persists please contact the development team."
    );
    getDefaultMaze();
  } else {
    startNewGame();
  }
}

// Option button variations
const attackButtons = ["punch", "swing sword", "shoot arrow"];
const directionButtons = ["north", "east", "south", "west"];
const leaveTreasureButtons = ["leave treasure", "take it with you"];
const finishButtons = ["restart this maze", "play new maze"];

// Starts a new game with a fresh maze config
let startRoomID;
let currentRoomID;
let text;

function startNewGame() {
  // set random starting room
  let i = getRandomIndex(roomIDs);
  startRoomID = roomIDs[i];
  currentRoomID = startRoomID;

  console.log("Room id: " + currentRoomID);

  // set starting text
  let threat = currentMaze.rooms[startRoomID].items.threat;
  let treasure = currentMaze.rooms[startRoomID].items.treasure;
  text = `You find yourself in a cold, dark room. Facing you is a ${threat} holding a piece of ${treasure}. What move will you use to try and take it?`;

  // render text, buttons and wealth
  textElement.innerText = text;
  renderButtons(attackButtons);
}

function renderButtons(options) {
  while (optionButtonsElement.firstChild) {
    optionButtonsElement.removeChild(optionButtonsElement.firstChild);
  }
  options.forEach((option) => {
    const button = document.createElement("button");
    button.innerText = option;
    button.classList.add("btn");
    button.addEventListener("click", () => selectOption(option));
    optionButtonsElement.appendChild(button);
  });
}

// Button event listener
function selectOption(option) {
  if (attackButtons.includes(option)) {
    handleAttack(option);
  } else if (directionButtons.includes(option)) {
    handleDirection(option);
  } else if (leaveTreasureButtons.includes(option)) {
    handleLeaveTreasure(option);
  } else if (finishButtons.includes(option)) {
    handleFinish(option);
  } else {
    console.log("Error - invalid option was selected");
  }
}

// Event handlers
function handleAttack(event) {
  let threat = currentMaze.rooms[currentRoomID].items.threat;
  let treasure = currentMaze.rooms[currentRoomID].items.treasure;
  if (
    // win conditions
    (event === "punch" && threat === "goblin") ||
    (event === "swing sword" && threat === "skeleton") ||
    (event === "shoot arrow" && threat === "troll")
  ) {
    text = `It worked! The ${threat} ran scared and you got the ${treasure}. You can take it with you or leave it here to mark the room.`;
    currentMaze.rooms[currentRoomID].items.threat = null;
    updateRoom(text, leaveTreasureButtons, 0);
    // Update state of this room
    currentMaze.rooms[currentRoomID].items.threat === null;
    currentMaze.rooms[currentRoomID].items.treasure === null;
  } else {
    text = `It didn't work and now you've angered the ${threat}! You need to leave this room before it attacks. Which way?`;
    updateRoom(text, directionButtons, 0);
  }
}

let nextRoomID;
function handleDirection(event) {
  // TODO - refactor to reduce repetition
  let northExit = currentMaze.rooms[currentRoomID].passages[0].isExit;
  let eastExit = currentMaze.rooms[currentRoomID].passages[1].isExit;
  let southExit = currentMaze.rooms[currentRoomID].passages[2].isExit;
  let westExit = currentMaze.rooms[currentRoomID].passages[3].isExit;

  if (event === "north" && northExit === false) {
    if (
      currentRoomID === currentMaze.rooms[currentRoomID].passages[0].joinsTo
    ) {
      text = "You may not go that way. Choose again.";
      updateRoom(text, directionButtons, 0);
    } else {
      nextRoomID = currentMaze.rooms[currentRoomID].passages[0].joinsTo;
      moveRoom(nextRoomID);
    }
  } else if (event === "east" && eastExit === false) {
    if (
      currentRoomID === currentMaze.rooms[currentRoomID].passages[1].joinsTo
    ) {
      text = "You may not go that way. Choose again.";
      updateRoom(text, directionButtons, 0);
    } else {
      nextRoomID = currentMaze.rooms[currentRoomID].passages[1].joinsTo;
      moveRoom(nextRoomID);
    }
  } else if (event === "south" && southExit === false) {
    if (
      currentRoomID === currentMaze.rooms[currentRoomID].passages[2].joinsTo
    ) {
      text = "You may not go that way. Choose again.";
      updateRoom(text, directionButtons, 0);
    } else {
      nextRoomID = currentMaze.rooms[currentRoomID].passages[2].joinsTo;
      moveRoom(nextRoomID);
    }
  } else if (event === "west" && westExit === false) {
    if (
      currentRoomID === currentMaze.rooms[currentRoomID].passages[3].joinsTo
    ) {
      text = "You may not go that way. Choose again.";
      updateRoom(text, directionButtons, 0);
    } else {
      nextRoomID = currentMaze.rooms[currentRoomID].passages[3].joinsTo;
      moveRoom(nextRoomID);
    }
  } else {
    // exit has been selected
    let outcome;
    if (wealth < 100) {
      outcome = "You didn't do a very good job. That's barely any wealth.";
    } else if (wealth < 500) {
      outcome = "That's a decent amount of wealth. Can you do better?";
    } else {
      outcome =
        "Congratulations! You're rich, but at what cost? How will those poor monsters feed thier monster families now?";
    }
    text = `You have exited the maze. ${outcome}`;
    updateRoom(text, finishButtons, 0);
  }
}

function handleLeaveTreasure(event) {
  let text;
  let treasure = currentMaze.rooms[currentRoomID].items.treasure;
  if (event === leaveTreasureButtons[1]) {
    // take the treasure
    text = "The treasure has been added to your wealth. Which way now?";
    let wealthChange;
    if (treasure === "gold") {
      wealthChange = 200;
    } else if ((treasure = "silver")) {
      wealthChange = 100;
    } else {
      wealthChange = 50;
    }
    updateRoom(text, directionButtons, wealthChange);
  } else {
    // leave the treasure
    currentMaze.rooms[currentRoomID].placedTreasure = treasure;
    text = "You dropped the treasure. Which way now?";
    updateRoom(text, directionButtons, 0);
  }
}

function handleFinish(event) {
  if (event === finishButtons[0]) {
    // restart this maze
    startNewGame();
  } else {
    // re-initialise maze
    getDefaultMaze();
  }
}

function moveRoom() {
  currentRoomID = nextRoomID;

  console.log("Room id: " + currentRoomID);

  let threat = currentMaze.rooms[currentRoomID].items.threat;
  let treasure = currentMaze.rooms[currentRoomID].items.treasure;
  let placedTreasureState = currentMaze.rooms[currentRoomID].placedTreasure;
  let text;
  let buttons;
  if (threat === null && placedTreasureState != null) {
    // If room has been visited, threat defeated, and marked
    text = `This is the room where you left your ${placedTreasureState}. Which way now?`;
    buttons = directionButtons;
  } else if (threat === null && placedTreasureState == null) {
    // If room has been visited, threat defeated, and NOT marked
    text =
      "This room is empty. You must have been here already. Which way now?";
    buttons = directionButtons;
  } else {
    // If room is new or threat was not defeated
    text = `This room contains a ${threat} holding a piece of ${treasure}. What's your move?`;
    buttons = attackButtons;
  }

  updateRoom(text, buttons, 0);
}

function updateRoom(text, buttons, wealthChange) {
  wealth += wealthChange;
  wealthElement.innerText = wealth;
  textElement.innerText = text;
  renderButtons(buttons);
}

getDefaultMaze();
