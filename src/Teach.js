import * as tmImage from "@teachablemachine/image";
import { storage } from "./Firebase";
import { ref, getDownloadURL } from "firebase/storage";
import "./Teach.css";
import { useState } from "react";
function Teach() {
  var aAudio = new Audio("././piano/A.mp3");
  var bAudio = new Audio("././piano/G.mp3");
  var cAudio = new Audio("././piano/C.mp3");

  const [isAddMusicBtnClicked, setAddMusicBtnClicked] = useState(false);
  const URL = "https://teachablemachine.withgoogle.com/models/wm_CD6ny1/";

  let model, labelContainer, maxPredictions;

  // Load the image model and setup the video
  async function init() {
    setAddMusicBtnClicked(true);
    const fileName = document.getElementById("fileName").value;

    getDownloadURL(ref(storage, fileName)).then((url) => {
      const vid = document.querySelector("video");
      vid.setAttribute("src", url);
    });

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // append elements to the DOM
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
      // and class labels
      var predictedClass = document.createElement("div")
      predictedClass.style.cssText = 'margin-top:10%;font-size:24px;font-weight:bold'  
      labelContainer.appendChild(predictedClass);
    }
    await predict();
  }

  // run the video through the image model
  async function predict() {
    // predict can take in an image, video or canvas html element
    let videoEle = document.querySelector("video");
    let prediction;

    prediction = await model.predict(videoEle);

    let classPrediction;

    for (let i = 0; i < maxPredictions; i++) {
      if (prediction[i].className !== "empty") {
        classPrediction =
          "Note " +
          prediction[i].className +
          " prediction: " +
          (prediction[i].probability * 100).toFixed(0) +
          " %";
      } else {
        classPrediction =
          prediction[i].className +
          " class prediction: " +
          (prediction[i].probability * 100).toFixed(0) +
          " %";
      }
      labelContainer.childNodes[i].innerHTML = classPrediction;
      if (prediction[i].probability.toFixed(2) > 0.9) {
        if (prediction[i].className === "A") {
          aAudio.play();
        }
        if (prediction[i].className === "B") {
          bAudio.play();
        }
        if (prediction[i].className === "C") {
          cAudio.play();
        }
        if (prediction[i].className === "empty") {
          aAudio.pause();
          bAudio.pause();
          cAudio.pause();
        }
      }
    }
    await predict();
  }

  return (
    <div className="min-vh-100 min-vw-100" id="homepage">
      {!isAddMusicBtnClicked && (
        <div>
          <h1 id="titleServer">DeafBeats</h1>
          <h3 id="subTitle">
            An application for Deaf People to generate and enjoy music
          </h3>
          <div className="d-flex" id="enterFileNameField">
            <input id="fileName" placeholder="Choose file name"></input>
            <button type="button" id="startBtn" onClick={init}>
              Add Music!
            </button>
          </div>
        </div>
      )}
      <div id="videoPredictionContainer" className="d-flex">
        <video crossOrigin="anonymous" muted autoPlay />
        <div id="label-container"></div>
      </div>
      {!isAddMusicBtnClicked && (
        <footer id="teamIntro">
          Made with ❤ and care by Sparsh and Luciana (Group #9)
        </footer>
      )}
    </div>
  );
}

export default Teach;
