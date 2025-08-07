let fr = 1 / 2;
let osc;
let frame_stop;
let customFrameCount = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 250);
  background(255);
  frameRate(fr);
  noStroke();
  frame_stop = floor(random(100,200));

  osc = new p5.Oscillator('triangle');
  osc.freq(100);
  osc.start();
}

function draw() {
  resizeCanvas(windowWidth, windowHeight);
  background(60,10,92.2);

  if (customFrameCount < frame_stop) {
    let new_freq = floor(random(1, 9)) * 110;
    osc.freq(new_freq);
    osc.start();
  
    fill(200.5, 100, 14.3);
    rect(width*random(), height*random(), random(100, height/2), random(100, width/2));
    fill(355.5, 90.7, 75.7);
    rect(width*random(), height*random(), random(100, height/2), random(100, width/2));
    color += 1;
  
    fill(0, 0, 0);
    textSize(30);
    textAlign(CENTER, CENTER);
    text(customFrameCount, width / 2, height / 2 );
  
    if ((fr < 12) && (customFrameCount > 4 * fr)) {
      fr += random(0,fr);
    } 
    frameRate(fr);
  } else{
    osc.freq(220);
    background(0,0,0);
    fill(0, 0, 100);
    textSize(30);
    textAlign(CENTER, CENTER);
    text(frame_stop, width / 2, height / 2 );
  }

  customFrameCount++;

  if (customFrameCount > frame_stop + 4*12) {
    osc.stop();
    customFrameCount = 0;
    fr = 1 / 2;
    setup();
  }
}