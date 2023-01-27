import React, { useRef } from "react";
import Webcam from "react-webcam";
import "./App.css";
import { drawWebcamImgAndSections } from "./ClientUtils";

function ClientSide() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  var url;

  const mediaRecorderRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);

  const runHandpose = async () => {
    // loop and detect finger
    setInterval(() => {
      if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current != null &&
        webcamRef.current.video.readyState === 4
      ) {
        // get video properties
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
      }
    }, 1);
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

export default ClientSide;
