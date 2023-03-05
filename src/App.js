import "./App.css";
import { useState } from "react";
import { storage } from "./Firebase";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  const [imageUpload, setImageUpload] = useState(null)

  const uploadImage = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, imageUpload.name)
    uploadBytes(imageRef, imageUpload).then(() => {
      alert("Image Uploaded")
    })
  };

  return (
    <div className="App">
      <input
        type="file"
        onChange={(event) => {
          setImageUpload(event.target.files[0]);
        }}
      />

      <button onClick={uploadImage}> Upload Image </button>
    </div>
  );
}

export default App;