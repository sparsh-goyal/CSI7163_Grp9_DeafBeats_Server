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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      setStream(stream);
      setVideoUrl(null);

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

  const startRecording = () => {
    if (!stream) return;

    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    });

    mediaRecorder.addEventListener("stop", () => {
      const blob = new Blob(chunks, { type: "video/mp4" });
      
      const videoUrl = URL.createObjectURL(blob);
      
      setRecording(false);

      const videoName = "test.mp4";
      const storageRef = ref(storage, videoName)

      uploadBytes(storageRef, blob).then((snapshot) => {
        console.log('Uploaded a blob or file!');
      });

    });

    mediaRecorder.start();
    setRecording(true);
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
      {videoUrl && (
        <video src={videoUrl} controls={true} autoPlay={true} />
      )}
    </div>
  );
}

export default WebcamStreamCapture;
