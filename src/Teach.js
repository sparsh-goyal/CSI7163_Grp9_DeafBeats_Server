import * as tmImage from '@teachablemachine/image';
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

      prediction = await model.predict(videoEle);
      
      for (let i = 0; i < maxPredictions; i++) {
          const classPrediction =
              prediction[i].className + ': ' + prediction[i].probability.toFixed(2);
          labelContainer.childNodes[i].innerHTML = classPrediction;
          if(prediction[i].probability.toFixed(2) > .9)
          {
            if (prediction[i].className === "A"){
              aAudio.play();
            }
            if (prediction[i].className === "B"){
              bAudio.play();
            }
            if (prediction[i].className === "C"){
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
