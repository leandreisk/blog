// Global variable only used here in the orchestrator sketch
var O_widthexquis,
  O_heightexquis,
  O_canvas,
  O_policeexquise,
  O_sections,
  O_nbsectionshorizontal,
  O_nbsectionsvertical,
  O_configurationexquise,
  O_nbartworks,
  O_allcode;

// Global variables that can be used in all sketches
var O_sectionwidth; // Width of a section
var O_sectionheight; // Height of a section
var O_sectionduration; // Duration (in frames) for one section animation
var O_currentsection; // Object that has data for the section that is currently drawing
var O_counter = 0; // Global frame counter

function getRandomSubset(array, n) {
  // Copie du tableau pour éviter de modifier l'original
  const shuffled = [...array];

  // Mélange avec l'algorithme de Fisher–Yates
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Retourne les n premiers éléments
  return shuffled.slice(0, n);
}

async function setup() {
  // Load the font and the configuration file
  O_policeexquise = await loadFont("./FreeMono.otf");
  json_loaded = await loadJSON("./exquisite.json");
  O_configurationexquise = getRandomSubset(json_loaded, 9);

  // Get the number of artworks
  O_nbartworks = Object.keys(O_configurationexquise).length;

  // Create the canvas
  O_widthexquis = Math.floor(windowWidth * 0.8);
  O_heightexquis = Math.floor(O_widthexquis / 1.82);
  O_canvas = createCanvas(O_widthexquis, O_heightexquis);

  // Center the canvas
  let x = (windowWidth - O_widthexquis) / 2;
  let y = (windowHeight - O_heightexquis) / 2;
  O_canvas.position(x, y);
  colorMode(HSB, 360, 100, 100, 250);

  // Set the duration of a section
  O_sectionduration = 60 * 21;

  // Compute the number of sections their size
  O_nbsectionsvertical = 3;
  O_nbsectionshorizontal = Math.ceil(O_nbartworks / O_nbsectionsvertical);
  O_sectionwidth = Math.floor(O_widthexquis / O_nbsectionshorizontal);
  O_sectionheight = Math.floor(O_heightexquis / O_nbsectionsvertical);

  // Initialize all sections and shuffle them
  initsections();
  O_sections = shuffle(O_sections);

  // Initialize drawing parameters
  textSize(84);
  textFont(O_policeexquise);
  stroke(0, 0, 100);

  // Shuffle the artworks
  O_configurationexquise = shuffle(O_configurationexquise);

  // Initialize the artworks
  let promises = [];
  O_allcode = []
  let piececode
  for (let i = 0; i < O_nbartworks; i++) {
    // Initialize all sketches
    O_currentsection = O_sections[i];
    let artCode = O_configurationexquise[i].art_code;
    let promise = window[artCode]["init"]();
    promises.push(promise);
    piececode = await loadStrings(artCode + ".js");
    console.log(piececode)
    O_allcode.push(piececode)
  }
  await Promise.all(promises);
  onelineCode(O_allcode)
}

function initsections() {
  // Initialize some variables
  O_sections = [];
  let x1, y4, id;
  id = 0;

  // Create all sections
  for (let i = 0; i < O_nbsectionshorizontal; i++) {
    for (let j = 0; j < O_nbsectionsvertical; j++) {
      // Check if we are at the beginning of a row
      if (i == 0) {
        y4 = random(O_sectionheight * 0.1, O_sectionheight * 0.9);
      } else {
        y4 = O_sections[(i - 1) * O_nbsectionsvertical + j].y2;
      }

      // Check if we are at the beginning of a column
      if (j == 0) {
        x1 = random(O_sectionwidth * 0.1, O_sectionwidth * 0.9);
      } else {
        x1 = O_sections[i * O_nbsectionsvertical + (j - 1)].x3;
      }

      // Create the section
      let section = {
        x: i * O_sectionwidth,
        y: j * O_sectionheight,
        x1: x1,
        y1: 0,
        x2: O_sectionwidth,
        y2: random(O_sectionheight * 0.1, O_sectionheight * 0.9),
        x3: random(O_sectionwidth * 0.1, O_sectionwidth * 0.9),
        y3: O_sectionheight,
        x4: 0,
        y4: y4,
        id: id,
      };

      // Add the section to the list and increment the id
      O_sections.push(section);
      id++;
    }
  }
}

let index = 0;
let stablepiece = 0;
let stablecode = 0;
function draw() {
  // Check if we are done with all the artworks
  if (O_counter == O_nbartworks * O_sectionduration) {
    //background(0, 0, 0)
    //noLoop();
    if (stablepiece < O_sectionduration) {
      stablepiece++
    }
    else {
      background(0, 0, 0)
      if (stablecode < O_sectionduration * 2) {
        showcode()
        stablecode++
      }
      else {

        O_counter = 0;
        index = 0;
        stablepiece = 0
        stablecode = 0
      }
    }
    return;
  }

  // Check if we need to initialize a new section
  if (O_counter % O_sectionduration == 0) {
    O_currentsection = O_sections[index];
    let artCode = O_configurationexquise[index].art_code;
    window[artCode]["init"]();
    index++;
  }

  // Draw the current section
  if (O_counter % O_sectionduration > 0) {
    let artCode = O_configurationexquise[index - 1].art_code;
    window[artCode]["draw"]();
  }
  O_counter++;
}


function showcode() {
  var fSize = 33
  for (var i in O_sections) {
    var s = O_sections[i]
    push()
    translate(s.x, s.y)
    noStroke(); fill(0, 0, 0)
    rect(0, 0, O_sectionwidth, O_sectionheight)
    fill(0, 0, 100)
    rect(s.x1 - 21, s.y1, 42, 42)
    rect(s.x2 - 42, s.y2 - 21, 42, 42)
    rect(s.x3 - 21, s.y3 - 42, 42, 42)
    rect(s.x4, s.y4 - 21, 42, 42)
    var x, y, c, tw, lineofcode
    x = 0
    y = fSize
    textSize(fSize)
    lineofcode = O_allcode[i]
    stroke(110, 100, 100); fill(110, 100, 100)
    for (b in lineofcode) {
      c = lineofcode.charAt(b)
      tw = textWidth(c)
      if (x + tw > O_sectionwidth) {
        x = 0
        y += fSize + 1
      }
      text(c, x, y)
      x += tw
    }
    pop()
  }
}

// receives an array of arrays of strings, where each array the src code of one piece
// transforms each array of source code into one single string of src code 
// stores each string into O_allcode
function onelineCode(codearrays) {
  var temparray = []
  for (i in codearrays) {
    var codestring = ""
    for (j in codearrays[i]) {
      codestring += codearrays[i][j]
    }
    temparray.push(codestring)
  }
  O_allcode = []
  O_allcode = temparray
}
