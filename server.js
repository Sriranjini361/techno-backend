const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = 'mongodb+srv://sriranjini147:Srithanya@cluster0.4kx5ojo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // MongoDB URI
const client = new MongoClient(uri);

client.connect()
  .then(() => {
    console.log('Connected to MongoDB');
    const db = client.db('techno'); // Your database name

    // Handle form submission
    const upload = multer({ dest: 'uploads/' });

    app.post('/api/submitForm', upload.single('resume'), async (req, res) => {
      const { name, email, number, coverLetter } = req.body;
      const resumePath = req.file.path;

      try {
        const applicationCollection = db.collection('application');
        await applicationCollection.insertOne({ name, email, phonenumber: number, resume: resumePath, coverletter: coverLetter });
        console.log('Data inserted successfully');
        res.status(200).json({ message: 'Form submitted successfully' });
      } catch (error) {
        console.error('Error inserting data into database:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Add Job route
    app.post('/api/addJob', async (req, res) => {
      const { jobTitle, companyName, minDescription, description } = req.body;

      try {
        const joblistCollection = db.collection('joblist');
        await joblistCollection.insertOne({ jobTitle, companyName, miniDescription: minDescription, description });
        console.log('Job added successfully');
        res.status(200).json({ message: 'Job added successfully' });
      } catch (error) {
        console.error('Error inserting data into database:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Get Job Listings route
    app.get('/api/joblistings', async (req, res) => {
      try {
        const joblistCollection = db.collection('joblist');
        const jobListings = await joblistCollection.find({}).toArray();
        res.json(jobListings);
        console.log('Job listings:', jobListings);
      } catch (error) {
        console.error('Error fetching job listings:', error);
        res.status(500).json({ error: 'Error fetching job listings' });
      }
    });

    // Start the server
    const PORT = process.env.PORT || 5000;

    console.log(`Trying to start the server on port ${PORT}`);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });
