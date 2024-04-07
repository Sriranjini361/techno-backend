const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const multer = require('multer');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '9994570668@sri',
  database: 'techno'
});

app.get('/api/joblistings', (req, res) => {
    const query = 'SELECT * FROM joblist';
  
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Error fetching job listings' });
      } else {
        res.json(results);
        console.log('Job listings:', results);
      }
    });
  });

  // Configure multer to handle file uploads
const upload = multer({ dest: 'uploads/' });

// Handle form submission
app.post('/api/submitForm', upload.single('resume'), (req, res) => {
    const { name, email, number, coverLetter } = req.body;
    const resumePath = req.file.path;

    // Insert form data into MySQL database
    connection.query('INSERT INTO application (name, email, phonenumber, resume, coverletter) VALUES (?, ?, ?, ?, ?)', 
        [name, email, number, resumePath, coverLetter], 
        (error, results, fields) => {
            if (error) {
                console.error('Error inserting data into database:', error);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                console.log('Data inserted successfully');
                res.status(200).json({ message: 'Form submitted successfully' });
            }
        });
});

app.post('/api/addJob', (req, res) => {
  const { jobTitle, companyName, minDescription, description } = req.body;

  connection.query('INSERT INTO joblist (jobTitle, companyName, miniDescription, description) VALUES (?, ?, ?, ?)',
      [jobTitle, companyName, minDescription, description],
      (error, results, fields) => {
          if (error) {
              console.error('Error inserting data into database:', error);
              res.status(500).json({ error: 'Internal server error' });
          } else {
              console.log('Job added successfully');
              res.status(200).json({ message: 'Job added successfully' });
          }
      });
});
  

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
