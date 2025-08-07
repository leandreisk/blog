let startXLine;
let startYLine;
let endXLine;
let endYLine;

let startXRect1;
let startYRect1;
let hRect1;
let wRect1;

let startXRect2;
let startYRect2;
let hRect2;
let wRect2;

let timeSwitch;

let numPoints = 500; // Nombre de points sur la corde
let ampWave = 200; // Amplitude des vibrations
let ampNoise = 10;

let particles = [];
let cols, rows;
let scale = 20; // Taille de la grille
let flowField = [];
let numParticles = 200; // Nombre de particules
let radius = 20; // Rayon initial du cercle de départ

let sample0PlayingBackground = false;
let sample0PlayingParticle = false;
let samples = [];
let currentSamples = [];
let previousTime = 0;

function preload() {
    // Charger plusieurs fichiers audio
    samples.push(loadSound("./samples/01.mp3"));
    samples.push(loadSound("./samples/1.mp3"));
    samples.push(loadSound("./samples/2.mp3"));
    samples.push(loadSound("./samples/3.mp3"));
    samples.push(loadSound("./samples/4.mp3"));
    samples.push(loadSound("./samples/5.mp3"));
    samples.push(loadSound("./samples/6.mp3"));
    samples.push(loadSound("./samples/7.mp3"));
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    startXLine = 0;
    startYLine = floor(random(height));
    endXLine = width;
    endYLine = floor(random(height));

    timeSwitch = random(10,13)

    startXRect1 = width * random();
    startYRect1 = height * random();
    hRect1 = floor(random(100, height / 2));
    wRect1 = floor(random(100, width / 2));

    startXRect2 = width * random();
    startYRect2 = height * random();
    hRect2 = floor(random(100, height / 2));
    wRect2 = floor(random(100, width / 2));


    customFrameCount = 0
    currentSamples = []
    playRandomSample();

    cols = floor(width / scale);
    rows = floor(height / scale);
    
    noiseDetail(4); // Ajuste la finesse du bruit de Perlin
    
    // Placer les particules en cercle autour du centre
    particles = []
    for (let i = 0; i < numParticles; i++) {
        let angle = map(i, 0, numParticles, 0, TWO_PI); // Répartition uniforme
        let x = width / 2 + cos(angle) * radius;
        let y = height / 2 + sin(angle) * radius;
        particles.push(new Particle(x, y, angle));
    }
    sample0PlayingParticle = false;
    background(0); // Fond blanc
}


function draw() {
  if (sample0PlayingBackground) {
    background(255);
    sample0PlayingBackground = false;
  } 

  if (abs(customFrameCount / 60-previousTime) > currentSamples[currentSamples.length-1].duration()) {
    previousTime = customFrameCount / 60;
    playRandomSample();
  }

  if(sample0PlayingParticle) {
    let yoff = 0;
  for (let y = 0; y < rows; y++) {
      let xoff = 0;
      for (let x = 0; x < cols; x++) {
          let index = x + y * cols;
          let angle = noise(xoff, yoff, frameCount * 0.005) * TWO_PI * 2;
          let v = p5.Vector.fromAngle(angle);
          flowField[index] = v;
          xoff += 0.1;
      }
      yoff += 0.1;
    }
    
    // Mettre à jour et afficher les particules
    for (let p of particles) {
        p.follow(flowField);
        p.applyRadialForce(); // Ajoute une poussée légère vers l'extérieur
        p.update();
        p.show();
    }
  } else {
    background(0);
    drawLine(numPoints, ampWave, ampNoise, startXLine, startYLine, endXLine, endYLine, 10*noise(customFrameCount*0.1), 10*noise(customFrameCount*0.1));
    drawBouncyRect(startXRect1, startYRect1, wRect1, hRect1, map(noise(customFrameCount*0.1),0,1, -5,5), 100*noise(customFrameCount*0.1));
    drawBouncyRect(startXRect2, startYRect2, wRect2, hRect2, 5*sin(0.1*noise(customFrameCount*0.1))+0.845, 100*noise(customFrameCount*0.1, 100));
  }
  
  customFrameCount += 1;
}

function playRandomSample() {
  if (customFrameCount / 60 < timeSwitch) {
      let randomIndex = floor(random(1,samples.length)); // Choisir un index aléatoire
      currentSamples.push(samples[randomIndex]); // Sélectionner un sample
      currentSamples[currentSamples.length-1].loop();
      console.log(currentSamples.length)
  } else {
      for (let i = 0; i < currentSamples.length; i++){
          currentSamples[i].stop();
      }
      sample0PlayingBackground = true;
      sample0PlayingParticle = true;
      currentSamples = [samples[0]]
      console.log('End')
      currentSamples[0].play();
      currentSamples[0].onended(setup);
  }
}

function drawLine(numPoints, ampWave, ampNoise, startX, startY, endX, endY, mode, c){
  stroke(255);
  strokeWeight(5);
  noFill();
  beginShape();
  for (let i = 0; i <= numPoints; i++) {
      let t = i / numPoints;
      let x = lerp(startX, endX, t); // Interpolation X
      let yBase = lerp(startY, endY, t); // Interpolation Y pour diagonale

      // Déformation avec une onde
      let yWave = ampWave*sin(mode*PI*t)*cos(c*frameCount*0.02);

      let y = yBase + yWave + random(ampNoise); // Position Y perturbée
      vertex(x, y);
  }
  endShape();
}

function drawBouncyRect(startX, startY, widthR, heightR,curveBounce, randomness) {
  curveTightness(curveBounce);
  fill('white');

  beginShape();
  curveVertex(startX + random(randomness), startY + random(randomness));
  curveVertex(startX + 1 + random(randomness) , startY + random(randomness));
  curveVertex(startX + widthR + random(randomness), startY + random(randomness));
  curveVertex(startX + widthR + random(randomness), startY + heightR + random(randomness));
  curveVertex(startX + random(randomness), startY + heightR + random(randomness));
  endShape(CLOSE);
}
