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
};
