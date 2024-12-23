import './App.css';
import React, { useEffect , useState } from 'react';
import $ from 'jquery';
import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.css'; // Optional: for draggable styles
import axios from "axios";
import io from 'socket.io-client';

// Import JS9 library files
import Fits from 'fitsjs';



// function JS9Display() {

//   useEffect(() => {
//     // Initialize JS9 (re-initialize in case of multiple renders)
//     if (window.JS9) {
//       window.JS9.init();
//     }

//     // Ensure JS9 initializes after component mounts
//     $('#js9-container').draggable({
//       handle: '.JS9Menubar',
//       opacity: 0.35,
//     });

    
//   // Test Socket.IO connection
//   const socket = io('http://localhost:5000'); //////////
//   socket.on('connect', () => console.log('Connected to Socket.IO server'));
//   socket.on('disconnect', () => console.log('Disconnected from Socket.IO server'));
// }, []);

//   return (
//     <div id="js9-container" style={{ width: '600px', border: '1px solid #ccc', padding: '10px' }}>
//       <div className="JS9Menubar"></div>
//       <div className="JS9Toolbar"></div>
//       <div className="JS9" style={{ width: '100%', height: '400px' }}></div>
//       <div className="JS9Statusbar" style={{ marginTop: '2px' }}></div>
//     </div>
//   );
// }

function JS9Display() {
  useEffect(() => {
    if (window.JS9) {
      window.JS9.init();
    }

    $('#js9-container').draggable({
      handle: '.JS9Menubar',
      opacity: 0.35,
    });
  }, []);

  return (
    <div id="js9-container" style={{ width: '600px', border: '1px solid #ccc', padding: '10px' }}>
      <div className="JS9Menubar"></div>
      <div className="JS9Toolbar"></div>
      <div className="JS9" style={{ width: '100%', height: '400px' }}></div>
      <div className="JS9Statusbar" style={{ marginTop: '2px' }}></div>
    </div>
  );
}


export default function App() {
const [ file, setFile ] = useState(null);
const [ progress, setProgress ] = useState({started: false, pc: 0});
const [ msg, setMsg ] = useState(null);




function handleSelect() {
  if (!file) {
    console.log("No file selected");
    return;
  }

  const fd = new FormData();
  fd.append('file', file);

  setMsg("Uploading...");
  setProgress(prevState => ({ ...prevState, started: true }));

  axios.post('http://localhost:5000/upload', fd, {
    onUploadProgress: (progressEvent) => {
      setProgress(prevState => {
        return { ...prevState, pc: Math.round((progressEvent.loaded * 100) / progressEvent.total) };
      });
    },
    headers: {
      "Custom-Header": "value",
    }
  })
    .then(res => {
      setMsg("Upload successful");
      console.log(res.data);

      // Use fitsjs to parse the uploaded FITS file
      fetch(res.data.fileUrl)
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => {
    console.log('ArrayBuffer fetched:', arrayBuffer);

    try {
      const fits = new Fits(arrayBuffer); // Ensure Fits is imported and used correctly

      const hdu = fits.getHDU(); // Get the primary HDU
      console.log('Primary HDU:', hdu);

      if (hdu.type === 'image') {
        const imageData = hdu.data; // Pixel data
        console.log('Image Data:', imageData);

        // Display the image in JS9 viewer
        if (window.JS9) {
          window.JS9.Load(res.data.fileUrl, { scale: 'zscale' });
        }
      }
    } catch (err) {
      console.error('Error parsing FITS file:', err);
    }
  })
  .catch(err => console.error('Error fetching or parsing FITS file:', err));

    })
    .catch(err => {
      setMsg("Upload failed");
      console.error(err);
    });
}




// function handleSelect() {
//   if (!file) {
//     console.log("No file selected");
//     return;
//   }

//   const fd = new FormData();
//   fd.append('file' , file);

//   setMsg("Uploading...");
//   setProgress(prevState => ({...prevState, started: true}));

//   axios.post('http://localhost:5000/upload', fd,  {
//     onUploadProgress: (progressEvent) => { setProgress(prevState => {
//       return {...prevState, pc: Math.round((progressEvent.loaded * 100) / progressEvent.total) }
//     }) },
//     headers: {
//       "Custom-Header": "value",
//     }
//   })
//   .then(res => {
//     setMsg("Upload successfuly");
//     console.log(res.data)

//     // Load the uploaded file into JS9 viewer
//     if (window.JS9) {
//       window.JS9.Load(res.data.fileUrl, { scale: 'zscale' });
//       console.log(window.JS9.FITS); // Should log the FITS object

//       //window.JS9.Load(res.data.filepath, { scale: 'zscale' });
//     }
//   })
//   .catch(err => {
//     setMsg("Upload failed");
//     console.error(err)
//   });
// }

  return (
    <div>
      <h1>JS9 React Component</h1>
      <div>
        <input 
        onChange={ (e) => setFile(e.target.files[0] )} 
        type="file" 
        accept=".fits"
        />
        <button onClick={ handleSelect }>Upload file</button>

        <br></br>
        <button>Zoom</button>
      </div>
      
      { progress.started && <progress max="100" value={progress.pc}></progress>}
      { msg && <span>{msg}</span> }
      <JS9Display />
    </div>
  );
}



