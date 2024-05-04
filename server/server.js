const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const moment = require('moment');
const app = express();
const sendEmail = require('./mail');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'Library'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    return;
  }
  console.log('Connected to MySQL database');
});
 


// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = decoded; 
    next();
  });
};

app.use(cookieParser());

app.post('/api/studentLogin', (req, res) => {
  const { registerNumber, password } = req.body;

  const query = 'SELECT * FROM studentdetails WHERE RegisterNumber = ? AND Password = ?';
  connection.query(query, [registerNumber, password], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }

    if (results.length > 0) {
      
      const insertQuery = 'INSERT INTO sessionData (registerNumber) VALUES (?)';
      connection.query(insertQuery, [registerNumber], (insertErr, insertResults) => {
        if (insertErr) {
          console.error('Error inserting register number into sessionData:', insertErr);
          res.status(500).json({ success: false, message: 'Internal server error' });
          return;
        }
        // Register number inserted successfully into sessionData table
        console.log('Register number inserted into sessionData:', registerNumber);
      });

      res.status(200).json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid register number or password' });
    }
  });
});


app.post('/api/addBook', (req, res) => {
    const { bookName,  
        bookAuthor,
        formattedDate,
        bookDescription, 
        selectedDepartment,
        shelfNumber,
        count } = req.body;

    const query = 'INSERT INTO Books (BookName, BookAuthor, PublishedDate, BookDescription, Department, ShelfNumber, Count) VALUES (?, ?, ?, ?, ?, ?, ?)';

    connection.query(query, [bookName,
        bookAuthor,
        formattedDate,
        bookDescription,
        selectedDepartment,
        shelfNumber,
        count], (error, results) => {
        if (error) {
            console.error('Error inserting book details:', error);
            res.status(500).json({ success: false, message: 'Failed to insert book details' });
        } else {
            res.json({ success: true, message: 'Book details inserted successfully' });
        }
    });
});

app.post('/api/adminLogin', (req, res) => {
  const { registerNumber, password } = req.body;

  const query = 'SELECT * FROM User_details WHERE RegisterNumber = ? AND Password = ?';
  connection.query(query, [registerNumber, password], (error, results) => {
    if (error) {
      console.error('Error querying MySQL: ', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length === 1) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid register number or password' });
    }
  }); 
});




app.get('/api/bookslist', (req, res) => {
  const query = 'SELECT * FROM Books';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error querying MySQL:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.json(results);
  });
});
app.get('/logout', (req, res) => {
  const query = 'TRUNCATE TABLE sessionData';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error querying MySQL:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.json(results);
    res.status(200).json({success:"Logout"});
  }); 
});

app.post('/api/deleteBooks', (req, res) => {
  const { name } = req.body;

  const query = 'DELETE FROM Books WHERE BookName = ?';

  connection.query(query, [name], (error, results) => {
    if (error) {
      console.error('Error deleting book:', error);
      res.status(500).json({ success: false, message: 'Failed to delete book' });
    } else {
      if (results.affectedRows === 1) {
        res.json({ success: true, message: 'Book deleted successfully' });
      } else {
        res.status(404).json({ success: false, message: 'Book not found' });
      }
    }
  });
});

app.post('/api/search', (req, res) => {
  const { searchText, selectedFilter } = req.body;

  let tableName, searchField;
  if (selectedFilter === 'Students') {
    tableName = 'User_details';
    searchField = 'Name';
  } else if (selectedFilter === 'Books') {
    tableName = 'Books';
    searchField = 'BookName';
  } else {
    res.status(400).json({ error: 'Invalid selected filter' });
    return;
  }

  const query = `SELECT * FROM ${tableName} WHERE ${searchField} LIKE '%${searchText}%'`;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error querying MySQL:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.json(results);
  });
});

app.post('/api/borrowbooks', (req, res) => {
  // Extract data from the request body
  const { fromDate, toDate, bookName } = req.body;

  // Query to check if the book exists in the Books table
  const checkBookQuery = 'SELECT * FROM Books WHERE BookName = ?';

  // Execute the SELECT query to check if the book exists
  connection.query(checkBookQuery, [bookName], (checkBookError, checkBookResults) => {
    if (checkBookError) {
      console.error('Error checking book:', checkBookError);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (checkBookResults.length === 0) {
      // Book not found in the Books table
      res.status(404).json({ error: 'Book not found' });
      return;
    }

    // Book exists, proceed to insert data into BorrowList table

    // Query to retrieve register number from sessionData table where id is 1
    const selectQuery = 'SELECT registerNumber FROM sessionData WHERE id = ?';
  
    // Execute the SELECT query to retrieve the register number
    connection.query(selectQuery, [1], (selectError, selectResults) => {
      if (selectError) {
        console.error('Error retrieving register number from sessionData:', selectError);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      if (selectResults.length === 0) {
        // No register number found in sessionData with id 1
        res.status(404).json({ error: 'Register number not found in sessionData' });
        return;
      }

      // Extract register number from the result
      const registerNumber = selectResults[0].registerNumber;

      // Query to insert data into BorrowList table
      const insertQuery = 'INSERT INTO BorrowList (RegisterNumber, FromDate, ToDate, BookName) VALUES (?, ?, ?, ?)';

      // Execute the INSERT query with data from request body and retrieved register number
      connection.query(insertQuery, [registerNumber, fromDate, toDate, bookName], (insertError, insertResults) => {
        if (insertError) {
          console.error('Error inserting data into BorrowList:', insertError);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        // Data successfully inserted, send success response
        res.status(200).json({ success: true, message: 'Data inserted successfully' });
      });
    });
  });
});

app.get('/api/getborrowList', (req, res) => {
  // Query to retrieve register number from sessionData table
  const getSessionDataQuery = 'SELECT registerNumber FROM sessionData WHERE id = ?';

  // Execute query to retrieve register number
  connection.query(getSessionDataQuery, [1], (getSessionDataError, sessionDataResults) => {
    if (getSessionDataError) {
      console.error('Error fetching register number from sessionData:', getSessionDataError);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Extract register number from sessionDataResults
    const registerNumber = sessionDataResults[0].registerNumber;

    // Query to retrieve borrow list data based on register number
    const getBorrowListQuery = 'SELECT * FROM BorrowList WHERE RegisterNumber = ?';

    // Execute query to retrieve borrow list data
    connection.query(getBorrowListQuery, [registerNumber], (getBorrowListError, borrowListResults) => {
      if (getBorrowListError) {
        console.error('Error fetching borrow list:', getBorrowListError);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }  

      // Send borrow list data as response
      res.status(200).json(borrowListResults);
    });
  });
});
app.get('/api/logout', (req, res) => {
  connection.query('TRUNCATE TABLE sessionData', (error, results) => {
    if (error) {
      console.error('Error truncating sessionData table:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  });
});




app.get('/api/duesList', (req, res) => {
  // Query to select all data from BorrowList table
  const query = 'SELECT * FROM BorrowList';

  // Execute the query
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching dues list:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(200).json(results); // Send the results as JSON response
    }
  });
});
app.get('/api/getDues', (req, res) => {
  // Get the current date
  const currentDate = moment().format('YYYY-MM-DD');

  // Query to retrieve register number from sessionData table
  const getSessionDataQuery = 'SELECT registerNumber FROM sessionData WHERE id = ?';

  // Execute query to retrieve register number
  connection.query(getSessionDataQuery, [1], (getSessionDataError, sessionDataResults) => {
    if (getSessionDataError) {
      console.error('Error fetching register number from sessionData:', getSessionDataError);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Extract register number from sessionDataResults
    const registerNumber = sessionDataResults[0].registerNumber;

    // Query to retrieve dues data based on register number and current date
    const getDuesQuery = 'SELECT * FROM BorrowList WHERE RegisterNumber = ? AND ToDate < ?';

    // Execute query to retrieve dues data
    connection.query(getDuesQuery, [registerNumber, currentDate], (getDuesError, duesResults) => {
      if (getDuesError) {
        console.error('Error fetching dues data:', getDuesError);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      // Send dues data as response
      res.status(200).json(duesResults);
    });
  });
});
app.get('/api/checkUser', (req, res) => {
  

  // Query to retrieve RegisterNumber from sessionData
  const getSessionDataQuery = 'SELECT RegisterNumber FROM sessionData WHERE id = ?';

  connection.query(getSessionDataQuery, [1], (error, sessionDataResults) => {
    if (error) {
      console.error('Error fetching register number from sessionData:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const registerNumber = sessionDataResults[0].RegisterNumber;

    // Query to check if the user profile exists for the given registerNumber
    const checkUserQuery = 'SELECT * FROM UserProfile WHERE RegisterNumber = ?';

    connection.query(checkUserQuery, [registerNumber], (checkUserError, results) => {
      if (checkUserError) {
        console.error('Error checking user profile:', checkUserError);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      // If user profile exists, send success response
      if (results.length > 0) {
        res.status(200).json({ setupComplete: true });
      } else {
        res.status(200).json({ setupComplete: false });
      }
    }); 
  });
}); 

app.post('/api/addProfile', (req, res) => {
  const { name, department, year, section ,email} = req.body;
  
  // Retrieve RegisterNumber from sessionData table
  const getSessionDataQuery = 'SELECT RegisterNumber FROM sessionData WHERE id = ?';
  connection.query(getSessionDataQuery, [1], (getSessionDataError, sessionDataResults) => {
    if (getSessionDataError) {
      console.error('Error fetching register number from sessionData:', getSessionDataError);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const registerNumber = sessionDataResults[0].RegisterNumber;

    // Insert data into UserProfile table
    const insertProfileQuery = 'INSERT INTO UserProfile (RegisterNumber, Name, Dept, Year, Section ,Email) VALUES (?, ?, ?, ?, ?,?)';
    connection.query(insertProfileQuery, [registerNumber, name, department, year, section ,email], (insertError, insertResults) => {
      if (insertError) {
        console.error('Error inserting profile data:', insertError);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      
      res.status(200).json({ message: 'Profile added successfully' });
    });
  });
});
app.post('/api/returnBook', (req, res) => {
  // Extract book name from request body
  const { bookName } = req.body;

  // Query to retrieve register number from sessionData table where id is 1
  const selectQuery = 'SELECT registerNumber FROM sessionData WHERE id = ?';
  
  // Execute the SELECT query to retrieve the register number
  connection.query(selectQuery, [1], (selectError, selectResults) => {
    if (selectError) {
      console.error('Error retrieving register number from sessionData:', selectError);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (selectResults.length === 0) {
      // No register number found in sessionData with id 1
      res.status(404).json({ error: 'Register number not found in sessionData' });
      return;
    }

    // Extract register number from the result
    const registerNumber = selectResults[0].registerNumber;

    // Query to delete book from BorrowList table based on registerNumber and bookName
    const deleteQuery = 'DELETE FROM BorrowList WHERE RegisterNumber = ? AND BookName = ?';

    // Execute the DELETE query with registerNumber and bookName
    connection.query(deleteQuery, [registerNumber, bookName], (deleteError, deleteResults) => {
      if (deleteError) {
        console.error('Error deleting book from BorrowList:', deleteError);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      // Book successfully returned, send success response
      res.status(200).json({ success: true, message: 'Book returned successfully' });
    });
  });
});
app.post('/api/extendBooks', (req, res) => {
    // Extract book name from request body
    const { bookName } = req.body;

    // Query to update extend field in BorrowList table
    const updateQuery = 'UPDATE BorrowList SET extend = 1 WHERE RegisterNumber = (SELECT registerNumber FROM sessionData WHERE id = 1) AND BookName = ?';

    // Execute the update query
    connection.query(updateQuery, [bookName], (error, results) => {
        if (error) {
            console.error('Error extending book borrowing:', error);
            res.status(500).json({ success: false, message: 'Failed to extend book borrowing' });
        } else {
            res.json({ success: true, message: 'Book borrowing extended successfully' });
        }
    });
  });

  app.get('/api/requests', (req, res) => {
  // Query to fetch data from BorrowList where extend field is 1
  const selectQuery = 'SELECT * FROM BorrowList WHERE extend = 1';

  // Execute the query
  connection.query(selectQuery, (error, results) => {
    if (error) {
      console.error('Error fetching requests:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Send the fetched data as response
    res.status(200).json(results);
  });
});
app.post('/api/approve', (req, res) => {
  const { registerNumber, bookName } = req.body;
  
  // Increment the ToDate by 10 days
  const query = `
    UPDATE BorrowList 
    SET ToDate = DATE_ADD(ToDate, INTERVAL 10 DAY), extend = 0 
    WHERE RegisterNumber = ? AND BookName = ?
  `;
  connection.query(query, [registerNumber, bookName], async (error, results) => {
    if (error) {
      console.error('Error approving request:', error);
      res.status(500).json({ success: false, message: 'Failed to approve request. Please try again.' });
    } else {
      // Check if any rows were affected
      if (results.affectedRows > 0) {
        // Fetch email from UserProfile using registerNumber
        const emailQuery = `
          SELECT Email FROM UserProfile WHERE RegisterNumber = ?
        `;
        connection.query(emailQuery, [registerNumber], async (error, userResults) => {
          if (error) {
            console.error('Error fetching email:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch email. Please try again.' });
          } else {
            // Send email if email is found
            if (userResults.length > 0 && userResults[0].Email) {
              const toEmail = userResults[0].Email;
              const subject = 'Your request has been approved!';
              const text = 'Your request has been approved!';
              
              // Send email
              try {
                await sendEmail(toEmail, subject, text);
                console.log('Email sent successfully');
                res.status(200).json({ success: true, message: 'Request approved successfully' });
              } catch (error) {
                console.error('Error sending email:', error);
                res.status(500).json({ success: false, message: 'Failed to send email. Please try again.' });
              }
            } else {
              res.status(404).json({ success: false, message: 'No email found for the provided register number.' });
            }
          }
        });
      } else {
        res.status(404).json({ success: false, message: 'No matching records found' });
      }
    }
  });
});

app.post('/api/notify', (req, res) => {
  try {
    const { registerNumber, bookName } = req.body;
 
    // Query the database to get the email address associated with the register number
    const query = 'SELECT Email FROM UserProfile WHERE RegisterNumber = ?';
    connection.query(query, [registerNumber], (error, results) => {
      if (error) {
        console.error('Error fetching email:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch email. Please try again.' });
      } else {
        if (results.length > 0 && results[0].Email) {
          const toEmail = results[0].Email;
          const subject = 'Notification: Return Overdue Book'; // Customize the subject as needed
          const text = `Hello ${registerNumber},\n\nThis is to notify you that you are required to return the book "${bookName}" as it is past due.\n\nThank you.`; // Customize the email body as needed

          // Send email notification
          sendEmail(toEmail, subject, text)
            .then(() => {
              console.log('Email sent successfully');
              res.status(200).json({ success: true, message: 'Email sent successfully' });
            })
            .catch((error) => {
              console.error('Error sending email:', error);
              res.status(500).json({ success: false, message: 'Failed to send email. Please try again.' });
            });
        } else {
          res.status(404).json({ success: false, message: 'No email found for the provided register number.' });
        }
      }
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email. Please try again.' });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 
