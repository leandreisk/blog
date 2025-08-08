let stars = [];
let numStars = 1000;
let pivot;
let border = [];
let angleStep = 0.01;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  // Définition de la bordure avec 4 points en ordre (pour un quadrilatère cohérent)
  border = [
    createVector(width * 0.25, 0),
    createVector(width, height * 0.25),
    createVector(width * 0.75, height),
    createVector(0, height * 0.75)
  ];

  // Création des étoiles à des positions aléatoires
  for (let i = 0; i < numStars; i++) {
    stars.push(new Star(random(width), random(height), random(1, 4)));
  }

  // Choisir une étoile pivot parmi celles qui sont à l'intérieur de la bordure
  let insideStars = stars.filter(s => pointInPolygon(s.pos, border));
  if (insideStars.length > 0) {
    pivot = random(insideStars).pos.copy();
  } else {
    pivot = createVector(width / 2, height / 2);
  }
}

function draw() {
  background(0, 2);

  // Mettre à jour et dessiner les étoiles
  for (let s of stars) {
    s.update();
    s.show();
  }

}

// ---------- Objet Star ----------
class Star {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
    this.trail = []; // stocke les positions précédentes
    this.maxTrailLength = 300;
  }

  update() {
    // Calculer la position relative par rapport au pivot
    let relative = p5.Vector.sub(this.pos, pivot);
    // Appliquer une rotation d'un petit angle
    let rotated = createVector(
      relative.x * cos(angleStep) - relative.y * sin(angleStep),
      relative.x * sin(angleStep) + relative.y * cos(angleStep)
    );
    let nextPos = p5.Vector.add(rotated, pivot);
    
    // Si la prochaine position est dans la bordure, on l'accepte
    if (pointInPolygon(nextPos, border)) {
      this.trail.push(this.pos.copy());
      if (this.trail.length > this.maxTrailLength) {
        this.trail.shift(); // supprime le plus ancien point
      }
      this.pos = nextPos.copy();
    }
    
  }

  show() {
    // // Dessiner la trace si elle existe
    // stroke(255, 150);
    // noFill();
    // beginShape();
    // for (let p of this.trail) {
    //   vertex(p.x, p.y);
    // }
    // endShape();

    // Dessiner l'étoile
    fill(255);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r);
  }
}

// ---------- Fonction utilitaire : pointInPolygon ----------
// Algorithme de ray-casting pour déterminer si un point est à l'intérieur d'un polygone
function pointInPolygon(pt, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    let xi = poly[i].x, yi = poly[i].y;
    let xj = poly[j].x, yj = poly[j].y;
    let intersect = ((yi > pt.y) != (yj > pt.y)) &&
      (pt.x < (xj - xi) * (pt.y - yi) / (yj - yi + 0.00001) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}
