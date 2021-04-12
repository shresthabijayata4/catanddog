const G = 9.81; // gravitational acceleration
const TARGET = { x: 600, y: 0 }; // target
const MINVELOCITY = 50; // minimum velocity needed

const canvas = document.getElementById('canvas');

const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let anglesAndVelocities = [];

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

function radToDeg(radians) {
  return radians * 180 / Math.PI;
}

function getFlightTime(velocity, angle) {
  return 2 * velocity * Math.sin(angle) / G;
}

function getMaxDistance(velocity, angle) {
  return Math.pow(velocity, 2) / G * Math.sin(angle * 2);
}

function getMaxHeight(velocity, angle) {
  return Math.pow(velocity, 2) * Math.pow(Math.sin(angle), 2) / (2 * G);
}

function calculateAngle(velocity) {
  const calculationPart1 =
    G * Math.pow(TARGET.x, 2) + 2 * TARGET.y * Math.pow(velocity, 2);
  const calculationPart2 = Math.pow(velocity, 4) - G * calculationPart1;
  if (calculationPart2 >= 0) {
    const calculationPart3 = Math.sqrt(calculationPart2);
    // The two roots of the equation correspond to the two possible launch angles
    const calculationPart4Minus = Math.pow(velocity, 2) - calculationPart3;
    const calculationPart4Plus = Math.pow(velocity, 2) + calculationPart3;
    return {
      a: Math.atan(calculationPart4Minus / (G * TARGET.x)),
      b: Math.atan(calculationPart4Plus / (G * TARGET.x))
    }
  }
  // Negative number under the square
  return {
    a: -1,
    b: -1
  }
}

function getPlotAtTime(velocity, angle, time) {
  return {
    x: velocity * time * Math.cos(angle),
    y: velocity * time * Math.sin(angle) - 0.5 * G * Math.pow(time, 2)
  };
}

// function plotDot(x, y) {
//   ctx.beginPath();
//   ctx.arc(x, y, 1, 0, Math.PI * 2);
//   ctx.closePath();
//   ctx.fill();
// }

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAngles() {
  let velocity;
  let angle;
  anglesAndVelocities = [];

  while (anglesAndVelocities.length < 3) {
    velocity = getRandomInt(MINVELOCITY, 120);
    angle = calculateAngle(velocity);
    if (angle.a !== -1 && angle.b !== -1) {
      anglesAndVelocities.push({ angle, velocity });
      let maxHeight = getMaxHeight(velocity, angle.b)
      if (maxHeight > canvas.height) {
        setCanvasHeight(maxHeight);
      }
    }
  }
  console.log(anglesAndVelocities);
}

function setCanvasWidth(width) {
  canvas.width = width;
  canvas.style.width = `${width}px`;  
}

function setCanvasHeight(height) {
  canvas.height = height + 20;
  canvas.style.height = `${height + 20}px`;  
}

function drawProjectiles() {
//   resetConsole();
  for (let i = 0; i < 1 ; i++) {              //anglesAndVelocities.length
    let velocity = anglesAndVelocities[i].velocity;
    let angleA = anglesAndVelocities[i].angle.a;
    let angleB = anglesAndVelocities[i].angle.b;
    let timeA = getFlightTime(velocity, angleA);
    let timeB = getFlightTime(velocity, angleB);
    // calculatePoints(velocity, angleA, timeA);
    calculatePoints(velocity, angleB, timeB);
    
  }
}

// function resetConsole() {
//   consoleBox.value = '';
// }

function addToConsole(text) {
  consoleBox.value += text;
}

function calculatePoints(velocity, angle, time) {
//   ctx.fillStyle = '#' + Math.floor(Math.random() * 16777215).toString(16);
  let i = 0;
  let drawInterval = setInterval(function(){
    if(i < Math.ceil(time * 10)) {
        let point = getPlotAtTime(velocity, angle, i / 10);
        console.log(point);
        drawPoint(point.x, canvas.height - point.y);
        i++;
    }
    else {
        clearInterval(drawInterval);
    }
  }, 10)

//   for (var i = 0; i < Math.ceil(time * 10); i++) {
    
//   }
}

var drawstone ={
    x:200,
    y: 10,
    r: 8,
  }

function drawPoint(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
// ctx.beginPath();
// ctx.arc(drawstone.x, drawstone.y, drawstone.r, 0, 2 * Math.PI);
// // ctx.strokeStyle = "rgba(0,0,0,0.5)";
// ctx.fillStyle = "black";
// ctx.fill();

}

function init() {
  setCanvasWidth(TARGET.x);
  setCanvasHeight(400);
  ctx.moveTo(0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  generateAngles();
  drawProjectiles();
}

// document.getElementById('refresh').addEventListener('click', init, false);

window.onload = init;