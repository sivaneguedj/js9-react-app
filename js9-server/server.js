// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// const upload = multer({ dest: 'uploads/' }); // Destination des fichiers téléchargés

// // Endpoint pour télécharger un fichier FITS
// app.post('/upload', upload.single('file'), (req, res) => {
//     const file = req.file;

//     if (!file) {
//         return res.status(400).json({ error: 'No file uploaded' });
//     }

//     // Exemple : Lire le contenu du fichier FITS (ou effectuer une autre opération)
//     const filePath = path.join(__dirname, file.path);

//     fs.readFile(filePath, (err, data) => {
//         if (err) {
//             return res.status(500).json({ error: 'Failed to read file' });
//         }

//         // Supposons que vous voulez envoyer le fichier directement au front-end
//         res.json({
//             message: 'File uploaded successfully',
//             filename: file.originalname,
//             filepath: filePath,
//             size: file.size,
//         });
//     });
// });

// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// Version2

// const express = require('express');
// const http = require('http'); // Required for creating a combined HTTP and WebSocket server
// const socketIO = require('socket.io');
// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// const server = http.createServer(app); // Create a single server for Express and Socket.IO
// const io = socketIO(server); // Attach Socket.IO to the server

// // Multer configuration for file uploads
// const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files

// // Socket.IO setup
// io.on('connection', (socket) => {
//   console.log('A client connected');

//   socket.on('disconnect', () => {
//     console.log('A client disconnected');
//   });
// });

// // Endpoint for uploading a FITS file
// app.post('/upload', upload.single('file'), (req, res) => {
//   const file = req.file;

//   if (!file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }

//   // Example: Read the uploaded FITS file (or perform another operation)
//   const filePath = path.join(__dirname, file.path);

//   fs.readFile(filePath, (err, data) => {
//     if (err) {
//       return res.status(500).json({ error: 'Failed to read file' });
//     }

//     // Return file details to the frontend
//     res.json({
//       message: 'File uploaded successfully',
//       filename: file.originalname,
//       filepath: filePath,
//       size: file.size,
//     });
//   });
// });

// // Start the combined server
// const PORT = 5000; // Port for Express routes
// const SOCKET_PORT = 2718; // Port for Socket.IO (shared with Express)

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Socket.IO server also running on port ${PORT}`);
// });




// Version 3

// const express = require('express');
// const multer = require('multer');
// const path = require('path');

// const app = express();
// const upload = multer({ dest: 'uploads/' }); // Upload destination

// // Serve static files from the "uploads" folder
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Endpoint to upload a file
// app.post('/upload', upload.single('file'), (req, res) => {
//     if (!file) {
//         return res.status(400).json({ error: 'No file uploaded' });
//     }

//     // Generate a public URL for the uploaded file
//     const fileUrl = `http://localhost:5000/uploads/${file.filename}`;
//     res.json({
//         message: 'File uploaded successfully',
//         fileUrl, // Return this URL to the frontend
//         filename: file.originalname,
//         size: file.size,
//     });
// });

// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// version 4

const express = require('express');
const http = require('http');
const multer = require('multer');
const path = require('path');
const socketIO = require('socket.io');
const cors = require('cors');                    //////////////////
const fs = require('fs'); // File system module for reading files
const { Fits } = require('fitsjs'); // Import fitsjs



const app = express();
const server = http.createServer(app);
const io = socketIO(server, { ////
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

app.use(cors({ 
    origin: "http://localhost:3000" ,////////////////
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true // If using cookies or session
}));

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});


// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Multer setup for file uploads
//const upload = multer({ dest: 'uploads/' });
const upload = multer({ storage });

// File upload endpoint
app.post('/upload', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: 'File upload error' });
    } else if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    console.log(`${req.file.filename}`);
    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    res.json({ fileUrl });
  });
});
// app.post('/upload', upload.single('file'), (req, res) => {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }
  
//     const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
//     res.json({ fileUrl });
//   });



// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A client connected');
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});



  const PORT = 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Socket.IO server running on port ${PORT}`);
  });
