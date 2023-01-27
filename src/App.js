import React, { useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import "./App.css";
import { drawHand, drawWebcamImgAndSections } from "./utils";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  var audioElement;
  var url;

  const mediaRecorderRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Model loaded");
    // loop and detect finger
    setInterval(() => {
      detect(net);
    }, 5);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current != null &&
      webcamRef.current.video.readyState === 4
    ) {
      // get video properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;
      // set video width and height
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      // set canvas width and height
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // create context for canvas:
      const ctx = canvasRef.current.getContext("2d");

      // draw webcam image and sections on canvas
      drawWebcamImgAndSections(webcamRef, ctx, videoWidth, videoHeight);

      // finger detection
      const hand = await net.estimateHands(video);

      // draw finger pointer
      audioElement = new Audio(); //for capturing in output
      drawHand(ctx, hand, audioElement);

      //play audio
      audioElement.play();
    }
  };

  runHandpose();

  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);

    // Get canvas stream
    const canvasElt = document.querySelector("canvas");
    const stream = canvasElt.captureStream();

    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      window.URL.revokeObjectURL(url);
      const blob = new Blob(recordedChunks, {
        type: "video/mp4",
      });
      url = URL.createObjectURL(blob);

      // const vid = document.createElement("video");
      // document.body.appendChild(vid);
      // vid.src = url;
      // vid.autoplay = true;
      // vid.loop = true;

      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "output.mp4";
      a.click();
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  return (
    <>
      <Webcam
        ref={webcamRef}
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

      {capturing ? (
        <button onClick={handleStopCaptureClick}>Stop Capture</button>
      ) : (
        <button onClick={handleStartCaptureClick}>Start Capture</button>
      )}

      {recordedChunks.length > 0 && (
        <button onClick={handleDownload}>Download</button>
      )}

      <canvas
        ref={canvasRef}
        id="myCanvas"
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
    </>
  );
}

export default App;