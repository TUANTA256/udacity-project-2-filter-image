import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util.js';



// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

// @TODO1 IMPLEMENT A RESTFUL ENDPOINT
// GET /filteredimage?image_url={{URL}}
// endpoint to filter an image from a public url.
// IT SHOULD
//    1
//    1. validate the image_url query
//    2. call filterImageFromURL(image_url) to filter the image
//    3. send the resulting file in the response
//    4. deletes any files on the server on finish of the response
// QUERY PARAMATERS
//    image_url: URL of a publicly accessible image
// RETURNS
//   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

/**************************************************************************** */

//! END @TODO1

// @TODO1: Implement the RESTful endpoint
app.get("/filteredimage", async (req, res) => {
  const { image_url } = req.query;
  console.log("Received image_url:", image_url);

  // Validate the image_url query parameter
  if (!image_url) {
    return res.status(400).send({ message: "Image URL is required" });
  }

  try {
    // Attempt to filter the image
    const filteredPath = await filterImageFromURL(image_url);

    // Check if the filtering was successful
    if (!filteredPath) {
      return res.status(422).send({ message: "Unable to process the image" });
    }

    // Send the resulting file in the response
    res.sendFile(filteredPath, (err) => {
      if (err) {
        res.status(500).send({ message: "Failed to send file" });
      } else {
        // Delete the file after sending the response
        deleteLocalFiles([filteredPath]);
      }
    });
  } catch (error) {
    console.error("Error filtering image:", error);
    res
      .status(422)
      .send({ message: "Unable to process the image", error: error.message });
  }
});
// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}")
});


// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});
