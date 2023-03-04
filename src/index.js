import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import WebcamStreamCapture from "./Client";
import Teach from "./Teach";
//import App from "./test_teach2";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Teach/> 
    {/*<WebcamStreamCapture/> */}
    
  </React.StrictMode>
);

reportWebVitals();
