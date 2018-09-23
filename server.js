const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/api/users');
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const app = express();

// DB config
const db = require('./env').mongoURI;
// Connect to mongoDB
mongoose
    .connect(db)
    .then(() => console.log('mongoDB connected'))
    .catch(err => console.log(err));

//My first route
app.get('/', (request, response) => response.send('Hello'));

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = 9000;
app.listen(port,() => console.log(`Server running on port ${port}`));