// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY; // 圓的初始位置
let circleSize = 100; // 圓的大小
let isDraggingIndex = false; // 是否用食指拖動圓
let isDraggingThumb = false; // 是否用大拇指拖動圓
let trails = []; // 用於儲存圓的軌跡

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // 圓的初始位置設置在視窗中間
  circleX = width / 2;
  circleY = height / 2;

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // 繪製所有軌跡
  for (let trail of trails) {
    stroke(trail.color);
    strokeWeight(10);
    line(trail.x1, trail.y1, trail.x2, trail.y2);
  }

  // 繪製圓
  fill(0, 0, 255, 150); // 藍色半透明
  noStroke();
  ellipse(circleX, circleY, circleSize);

  // 確保至少檢測到一隻手
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 繪製每個 keypoint 的圓點
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // 根據左右手設定顏色
          if (hand.handedness == "Left") {
            fill(255, 0, 255); // 左手顏色
          } else {
            fill(255, 255, 0); // 右手顏色
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }

        // 使用 line 指令串接 keypoints
        stroke(0, 255, 0); // 設定線條顏色
        strokeWeight(2); // 設定線條粗細

        // 串接 keypoints 0-4
        for (let i = 0; i < 4; i++) {
          line(
            hand.keypoints[i].x,
            hand.keypoints[i].y,
            hand.keypoints[i + 1].x,
            hand.keypoints[i + 1].y
          );
        }

        // 串接 keypoints 5-8
        for (let i = 5; i < 8; i++) {
          line(
            hand.keypoints[i].x,
            hand.keypoints[i].y,
            hand.keypoints[i + 1].x,
            hand.keypoints[i + 1].y
          );
        }

        // 串接 keypoints 9-12
        for (let i = 9; i < 12; i++) {
          line(
            hand.keypoints[i].x,
            hand.keypoints[i].y,
            hand.keypoints[i + 1].x,
            hand.keypoints[i + 1].y
          );
        }

        // 串接 keypoints 13-16
        for (let i = 13; i < 16; i++) {
          line(
            hand.keypoints[i].x,
            hand.keypoints[i].y,
            hand.keypoints[i + 1].x,
            hand.keypoints[i + 1].y
          );
        }

        // 串接 keypoints 17-20
        for (let i = 17; i < 20; i++) {
          line(
            hand.keypoints[i].x,
            hand.keypoints[i].y,
            hand.keypoints[i + 1].x,
            hand.keypoints[i + 1].y
          );
        }

        // 檢測食指（keypoints[8]）是否碰觸圓
        let indexFinger = hand.keypoints[8];
        let dIndex = dist(indexFinger.x, indexFinger.y, circleX, circleY);

        if (dIndex < circleSize / 2) {
          isDraggingIndex = true;
          isDraggingThumb = false; // 確保只有一個手指在拖動
        }

        // 檢測大拇指（keypoints[4]）是否碰觸圓
        let thumb = hand.keypoints[4];
        let dThumb = dist(thumb.x, thumb.y, circleX, circleY);

        if (dThumb < circleSize / 2) {
          isDraggingThumb = true;
          isDraggingIndex = false; // 確保只有一個手指在拖動
        }

        // 如果用食指拖動圓，畫出紅色軌跡
        if (isDraggingIndex) {
          trails.push({
            x1: circleX,
            y1: circleY,
            x2: indexFinger.x,
            y2: indexFinger.y,
            color: [255, 0, 0], // 紅色
          });
          circleX = indexFinger.x;
          circleY = indexFinger.y;
        }

        // 如果用大拇指拖動圓，畫出綠色軌跡
        if (isDraggingThumb) {
          trails.push({
            x1: circleX,
            y1: circleY,
            x2: thumb.x,
            y2: thumb.y,
            color: [0, 255, 0], // 綠色
          });
          circleX = thumb.x;
          circleY = thumb.y;
        }
      }
    }
  } else {
    // 如果手指離開圓，停止拖動
    isDraggingIndex = false;
    isDraggingThumb = false;
  }
}
