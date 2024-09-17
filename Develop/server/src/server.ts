import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import routes from './routes/index.js'; // Adjust the import to include the `.js` extension

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the dist folder (frontend)
app.use(express.static(path.resolve('dist'))); // Use path.resolve to ensure proper path handling

// Use API and HTML routes
app.use(routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

export default app;
