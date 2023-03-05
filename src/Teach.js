import * as tmImage from '@teachablemachine/image';
import "./App.css";
import { storage } from "./Firebase";
import { ref, getDownloadURL } from "firebase/storage";

function Teach() {
  var aAudio = new Audio("././drum/tom-1.mp3");
  var bAudio = new Audio("././drum/snare.mp3");
  var cAudio = new Audio("././drum/crash.mp3");

  // const URL = 'https://teachablemachine.withgoogle.com/models/DF6FzlHLn/';
  //const URL = 'https://teachablemachine.withgoogle.com/models/1XUcGrLn4/'
  const URL = 'https://teachablemachine.withgoogle.com/models/BHM3EdcZl/'
  
  let model, webcam, labelContainer, maxPredictions;

  let isIos = false; 
  // fix when running demo in ios, video will be frozen;
  if (window.navigator.userAgent.indexOf('iPhone') > -1 || window.navigator.userAgent.indexOf('iPad') > -1) {
    isIos = true;
  }
  // Load the image model and setup the webcam
  async function init() {
      const fileName = document.getElementById("fileName").value;

      getDownloadURL(ref(storage, fileName))
    .then((url) => {
      const vid = document.querySelector("video");
      vid.setAttribute("src", url);
  })

      const modelURL = URL + 'model.json';
      const metadataURL = URL + 'metadata.json';

      // load the model and metadata
      // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
      // or files from your local hard drive
      model = await tmImage.load(modelURL, metadataURL);
      maxPredictions = model.getTotalClasses();

      // Convenience function to setup a webcam
      const flip = true; // whether to flip the webcam
      const width = 200;
      const height = 200;
      webcam = new tmImage.Webcam(width, height, flip);
      await webcam.setup(); // request access to the webcam

      if (isIos) {
          document.getElementById('webcam-container').appendChild(webcam.webcam); // webcam object needs to be added in any case to make this work on iOS
          // grab video-object in any way you want and set the attributes
          const webCamVideo = document.getElementsByTagName('video')[0];
          webCamVideo.setAttribute("playsinline", true); // written with "setAttribute" bc. iOS buggs otherwise
          webCamVideo.muted = "true";
          webCamVideo.style.width = width + 'px';
          webCamVideo.style.height = height + 'px';
      } else {
      }
      // append elements to the DOM
      labelContainer = document.getElementById('label-container');
      for (let i = 0; i < maxPredictions; i++) { // and class labels
          labelContainer.appendChild(document.createElement('div'));
      }
      webcam.play();
      window.requestAnimationFrame(loop);
  }

  async function loop() {
      webcam.update(); // update the webcam frame
      await predict();
      window.requestAnimationFrame(loop);
  }

  // run the webcam image through the image model
  async function predict() {
      // predict can take in an image, video or canvas html element
      let videoEle = document.querySelector("video")
      let prediction;
      if (isIos) {
          prediction = await model.predict(webcam.webcam);
      } else {
          prediction = await model.predict(videoEle);
      }
      for (let i = 0; i < maxPredictions; i++) {
          const classPrediction =
              prediction[i].className + ': ' + prediction[i].probability.toFixed(2);
          labelContainer.childNodes[i].innerHTML = classPrediction;
          if(prediction[i].probability.toFixed(2) > .9)
          {
            if (prediction[i].className === "Class 1"){
              // console.warn("2")
              bAudio.play();
              //bAudio.pause();
            }
            if (prediction[i].className === "Class 3"){
              // console.warn("2")
              aAudio.play();
              //aAudio.pause();
            }
            if (prediction[i].className === "Class 2"){
              cAudio.play();
            }
          }
        }
  }

  return (
    <div>
    <div>Teachable Machine Image Model</div>
    <input id="fileName" placeholder="Choose file name"></input>
<button type="button" onClick={init}>Start</button>
<div id="label-container"></div>
      <video
        crossOrigin='anonymous'
        //src="././output.mp4"
        muted
        autoPlay
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 640,
          height: 480,
        }}
      />
    </div>
  );
}

export default Teach;
