// Require the express application framework
const express = require('express');

// Initiate an app instance from the express library
const app = express();

// Setup the port for the server to listen on
const port = 3400; // Port used for testing the application locally

// Create an object to hold data coming from the client side
let projectData = {};

// Use middleware to parse incoming JSON and URL-encoded data
app.use(express.json()); // Parse JSON-formatted requests
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded requests

// Serve static files from the 'website' directory
app.use(express.static("website"));

// Require and use the CORS module to allow cross-origin requests
const cors = require('cors');
app.use(cors());

// Endpoint to add data
app.post('/add', async (req, res) => {
    const info = await req.body;
    projectData = info;
    res.send(projectData);
});

// Endpoint to get all data
app.get('/all', async (req, res) => {
    if (projectData) {
        res.send(projectData);
    }
});

// Start the server and listen on the specified port
app.listen(port, _=> console.log(`listening on port ${port}`));