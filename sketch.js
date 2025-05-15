let goats = [];
let goat;
let video;
let bodyPose;
let poses = [];
let connections;
let isDetecting;
let goatsCaught = 0;

function preload() {
  // Load the bodyPose model
  bodyPose = ml5.bodyPose("MoveNet", {flipped = true});
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create the video and hide it
  video = createCapture(VIDEO, {flipped = true});
  video.size(width, height);
  video.hide();
  
  // Create button to start/stop detecting
  let button = createButton("start/stop");
  button.position(0, 0);
  button.size(70, 20);
  button.mousePressed(clickButton);
}

function draw() {
  if(isDetecting){
    // Draw the webcam video
    image(video, 0, 0, width, height);
    // Display the number of goats caught
    push();
    textSize(20);
    fill("palegreen");
    textAlign(RIGHT, TOP);
    text("Goats caught: " + goatsCaught, width-5, 5);
    pop();
  } else {
    // Start screen
    background(0);
    push();
    fill("palegreen");
    textAlign(CENTER, CENTER);
    textWrap(WORD);
    textFont("Courier New");
    textSize(30);
    text("\n\n\nBỊT MẮT BẮT DÊ (BLINDFOLDED GOAT HUNT):\nGoats are moving around but you can't see them. Stay 3-4 steps from the screen, then move your hand(s) to touch and catch goats. Open your arms to catch bigger goats. \n\nClick the top left button to start/stop catching goats.", 100, 200, width-200);
    pop();
    
    textSize(30);
    text("🐐", random(width), random(height));
  }
  
  // Hand distance
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    let rx = pose.right_wrist.x;
    let ry = pose.right_wrist.y;
    
    let lx = pose.left_wrist.x;
    let ly = pose.left_wrist.y;
    
    if(isDetecting){    
      for (let goat of goats) {
        goat.update();

        if (goat.isMoving) {
          // Calculate goat size based on hand distance if both wrists are in sight
          if (pose.right_wrist.confidence > 0.1 && pose.left_wrist.confidence > 0.1) {
          // line(rx, ry, lx, ly);
          let distance = dist(rx, ry, lx, ly);
          if (goat.isTouched(pose.right_wrist) || goat.isTouched(pose.left_wrist)) {
            goat.reveal(map(distance, 0, 600, 30, 80));
            // Update caught goat number
            goatsCaught ++;
            } 
          }
          // Set goat size when only one wrist is in sight
          else if (pose.right_wrist.confidence > 0.1) {
          // circle(rx, ry, 20);
          if (goat.isTouched(pose.right_wrist)) {
          goat.reveal(30);
          goatsCaught ++;
          } 
          } 
          else if (pose.left_wrist.confidence > 0.1) {
          // circle(lx, ly, 20);
          if (goat.isTouched(pose.left_wrist)) {
          goat.reveal(30);
          goatsCaught ++;
          } 
          }
        }        
      goat.display();
      }
    } else {
     // Reset caught goat number 
     goatsCaught = 0;
    }
  }
}

// Callback function for when bodyPose outputs data
function gotPoses(results) {
  // Save the output to the poses variable
  poses = results;
}

function clickButton() {
  if (isDetecting) {
    bodyPose.detectStop();
    isDetecting = false;
    // Reset the goats when detection stops
    goats = [];
  } else {
    bodyPose.detectStart(video, gotPoses);
    isDetecting = true;
    // Set 30 goats
    for (let i = 0; i <= 30; i++) {
      goats.push(new Goat(random(width), random(height), 30));
  }
  }
}
