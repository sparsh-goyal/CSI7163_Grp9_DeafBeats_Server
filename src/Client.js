import React, { useState, useRef } from "react";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "./Firebase";

function WebcamStreamCapture() {
  const [stream, setStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const videoRef = useRef(null);

  const startWebcam = async () => {
    try {
      // access webcam
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      setStream(stream);
      setVideoUrl(null);

      // display the stream from webcam
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing media devices.", error);
      setErrorMsg("Error accessing media devices.");
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
      setVideoUrl(null);
    }
  };

  var optionsVp9 = {
    mimeType: "video/webm",
    codecs: "vp9",
    videoBitsPerSecond: 2500000,
  };

  const record = (stream) => {
    // record video from the browser
    var mediaRecorderVp9 = new MediaRecorder(stream, optionsVp9);

    // saves data in chunks
    const chunks = [];

    mediaRecorderVp9.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    });

    mediaRecorderVp9.addEventListener("stop", () => {
      // save chunks as Blob object
      var startTimeVp9 = new Date();
      const blob = new Blob(chunks, { type: "video/webm" });
      setVideoUrl(URL.createObjectURL(blob));
      var elapsedTimeVp9 = new Date() - startTimeVp9;
      console.warn(
        "Time to encode file using VP9: " + elapsedTimeVp9 + " ms"
      );

      setRecording(false);

      // configure VP9 file
      const videoName = prompt(
        "Enter the file name for uploading the VP9 file:"
      );
      const storageRef = ref(storage, videoName);
      // send to the firebase server
      uploadBytes(storageRef, blob).then(() => {
        alert("VP9 File " + videoName + ".webm was uploaded!");
      });
    });

    mediaRecorderVp9.start();
    setRecording(true);
  };

  const startRecording = () => {
    if (!stream) return;
    record(stream);
  };

  const stopRecording = () => {
    if (!stream) return;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
  };

  return (
    <div>
      {errorMsg && <div>{errorMsg}</div>}
      <video ref={videoRef} autoPlay={true} />
      <div>
        {stream ? (
          <div>
            {recording ? (
              <button onClick={stopRecording}>Stop Recording</button>
            ) : (
              <div>
                <button onClick={startRecording}>Start Recording</button>
              </div>
            )}
            <button onClick={stopWebcam}>Stop Webcam</button>
          </div>
        ) : (
          <button onClick={startWebcam}>Start Webcam</button>
        )}
      </div>
    </div>
  );
}

export default WebcamStreamCapture;
