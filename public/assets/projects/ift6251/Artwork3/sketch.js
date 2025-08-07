let speech;
let lang;

let arms = true;
let type;

let myFont;
let col

let csvData_pos = [];
let csvData_neg = [];
let csvData;

let size;

const langs= [ 'en-US',
  'de-DE',
  'id-ID',
  'es-ES',
  'fr-FR',
  'it-IT',
  'nl-NL',
  'pt-BR'];

function preload() {
  myFont = loadFont("game_over.ttf");
  loadStrings("./data/pos.csv", (data) => processCSV(data, "pos"));
  loadStrings("./data/neg.csv", (data) => processCSV(data, "neg"));
}

function processCSV(data, type) {
  let csvText = data.join("\n");
  
  Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      if (type === "pos") {
        csvData_pos = results.data;
        console.log("Données positives chargées", csvData_pos);
      } else if (type === "neg") {
        csvData_neg = results.data;
        console.log("Données négatives chargées", csvData_neg);
      }
    }
  });
}

function getWordByLanguage(language, type) {
  if (type) {
    csvData = csvData_pos;
  } else {
    csvData = csvData_neg;
  }

  if (csvData.length === 0) return "Data not loaded"; 

  let randomIndex = floor(random(csvData.length));
  return csvData[randomIndex][language];
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  speech = new p5.Speech();
  size = int(windowHeight / 50);
}

function draw() {
  noLoop()

  arms = !arms;
  type = Math.random() < 0.8;

  lang = langs[int(random(langs.length))];
  speech.setLang(lang);
  speech.setPitch(random(0.01, 1.5));
  speech.setRate(random(0.01, 1.5));

  let word = getWordByLanguage(lang, type);
  speech.speak(word)

  if (type) {
    col = color(34, 139, 34)
  } else {
    col = color(210, 43, 43)
  }

  background(0);
  if (arms) {
    drawStickMan(20,25, size,smile = true, down = arms)
    fill(col);
    textSize(128);
    textFont(myFont);
    textAlign(LEFT, BOTTOM)
    text(word, size*28, size*22);
    drawStickMan(80,25, size, smile = type, down = !arms)
  } else {
    drawStickMan(80,25, size, smile = true, down = !arms)
    fill(col);
    textSize(128);
    textAlign(RIGHT, BOTTOM)
    textFont(myFont);
    text(word, size*72, size*22);
    drawStickMan(20,25, size,smile = type, down = arms)
  }
  
  speech.onEnd = () => {
    console.log("Lecture finie");
    draw()
  };
}




function drawStickMan(x, y, size, smile=true, down=false) {
  noStroke()
  fill(255);

  // Body
  for (let i = 0; i < 10; i++) {
    rect(size*x,size*(y+i),size);
  }

  // Legs 
  for (let i = 1; i < 6; i++) {
    rect(size*(x-i),size*(y+9+i),size);
  }
  for (let i = 1; i < 6; i++) {
    rect(size*(x+i),size*(y+9+i),size);
  }

  // Arms 
  if (down) {
    for (let i = 0; i < 5; i++) {
      rect(size*(x-(1+i)),size*(y+4+i),size);
    }
    for (let i = 0; i < 5; i++) {
      rect(size*(x+(1+i)),size*(y+4+i),size);
    }
  } else {
  for (let i = 0; i < 5; i++) {
    rect(size*(x-(1+i)),size*(y+4-i),size);
  }
  for (let i = 0; i < 5; i++) {
    rect(size*(x+(1+i)),size*(y+4-i),size);
  } }

  // Head
  rect(size*x,size*(y-1),size);
  rect(size*(x-1),size*(y-1),size);
  rect(size*(x-2),size*(y-1),size);
  rect(size*(x-3),size*(y-2),size);
  rect(size*(x-4),size*(y-3),size);
  rect(size*(x-4),size*(y-4),size);
  rect(size*(x-4),size*(y-5),size);
  rect(size*(x-4),size*(y-6),size);
  rect(size*(x-3),size*(y-7),size);
  rect(size*(x-2),size*(y-8),size);
  rect(size*(x-1),size*(y-8),size);
  rect(size*x,size*(y-8),size);
  rect(size*(x+1),size*(y-8),size);
  rect(size*(x+2),size*(y-8),size);
  rect(size*(x+3),size*(y-7),size);
  rect(size*(x+4),size*(y-6),size);
  rect(size*(x+4),size*(y-5),size);
  rect(size*(x+4),size*(y-4),size);
  rect(size*(x+4),size*(y-3),size);
  rect(size*(x+3),size*(y-2),size);
  rect(size*(x+1),size*(y-1),size);
  rect(size*(x+2),size*(y-1),size);

  // Eyes
  rect(size*(x+1),size*(y-6),size);
  rect(size*(x-1),size*(y-6),size);

  // Mouth
  rect(size*x,size*(y-3),size);
  // Lips
  rect(size*(x-1),size*(y-3),size);
  rect(size*(x+1),size*(y-3),size);
  // Smile
  if (smile) {
  rect(size*(x-2),size*(y-4),size);
  rect(size*(x+2),size*(y-4),size);
  }

  
}
