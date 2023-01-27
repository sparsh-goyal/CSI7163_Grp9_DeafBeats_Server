const sectionColor = [
  "blue",
  "aqua",
  "turquoise",
  "white",
  "indianred",
  "firebrick",
  "coral",
  "black",
];

const audioUrls = [
  "././notes/a2.mp3",
  "././notes/a3.mp3",
  "././notes/c2.mp3",
  "././notes/c3.mp3",
  "././notes/ds2.mp3",
  "././notes/ds3.mp3",
  "././notes/fs2.mp3",
  "././notes/fs3.mp3",
];

export const drawWebcamImgAndSections = (
  webcamRef,
  ctx,
  videoWidth,
  videoHeight
) => {
  // draw image from webcam on canvas
  navigator.mediaDevices
    .getUserMedia({
      video: true,
    })
    .then(
      ctx.drawImage(webcamRef.current.video, 0, 0, videoWidth, videoHeight)
    );

  // start drawing sections
  var i = 0;

  //divide 640 in 8 sections of 80px each
  for (var x = 0; x < videoWidth; x += 80) {
    //draw section seperating lines
    ctx.moveTo(x, 0);
    ctx.lineTo(x, videoHeight);
    ctx.stroke();

    // //fill section with different colors
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = sectionColor[i];
    ctx.fillRect(x, 0, 80, videoHeight);
    i++;
  }
};

export const drawHand = (ctx, predictions, audioElement) => {
  if (predictions.length > 0) {
    // loop through each prediction
    predictions.forEach((prediction) => {
      // grab landmark
      const landmarks = prediction.landmarks;

      // coordinates of index finger
      const x = landmarks[8][0];
      const y = landmarks[8][1];

      // start drawing
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 3 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();

      //set url for audio
      setUrlForPlayingMusic(x, audioElement);
    });
  }
};

export const setUrlForPlayingMusic = (x, audioElement) => {
  //check location lies in which 1 of the 8 sections to play music
  var newUrl = "";
  if (x >= 0 && x < 80) {
    newUrl = audioUrls[0];
  } else if (x >= 80 && x < 160) {
    newUrl = audioUrls[1];
  } else if (x >= 160 && x < 240) {
    newUrl = audioUrls[2];
  } else if (x >= 240 && x < 320) {
    newUrl = audioUrls[3];
  } else if (x >= 320 && x < 400) {
    newUrl = audioUrls[4];
  } else if (x >= 400 && x <= 480) {
    newUrl = audioUrls[5];
  } else if (x >= 400 && x <= 480) {
    newUrl = audioUrls[6];
  } else {
    newUrl = audioUrls[7];
  }
  audioElement.src = newUrl;
  audioElement.volume = 0.5;
  // audioElement.play(); //TO-DO add condition to avoid playing same sound if finger staying in one section (not moving)
};