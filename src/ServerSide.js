import React, { useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import "./App.css";
import { drawHand, drawWebcamImgAndSections } from "./ServerUtils";

function ServerSide() {
  const canvasRef = useRef(null);
  var audioElement;
  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Model loaded");
    // loop and detect finger
    setInterval(() => {
      detect(net);
    }, 5);
  };

  const detect = async (net) => {
    const webcamRef = document.getElementById("webcamRef");
    const canvasRef = document.querySelector("canvas");
    const videoWidth = webcamRef.videoWidth;
    const videoHeight = webcamRef.videoHeight;
    // set canvas width and height
    canvasRef.width = videoWidth;
    canvasRef.height = videoHeight;

    // create context for canvas:
    const ctx = canvasRef.getContext("2d");

    // draw webcam image and sections on canvas
    drawWebcamImgAndSections(webcamRef, ctx, videoWidth, videoHeight);

    // finger detection
    const hand = await net.estimateHands(webcamRef);

    // draw finger pointer
    audioElement = new Audio(); //for capturing in output
    drawHand(ctx, hand, audioElement);

    //play audio
    audioElement.play();
  };

  runHandpose();

  return (
    <>
      <video
        src="././output.mp4"
        autoPlay
        style={{ display: "none" }}
        id="webcamRef"
      ></video>
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

export default ServerSide;
