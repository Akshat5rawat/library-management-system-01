const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const authRoutes = require('./routes/auth');
const membershipRoutes = require('./routes/membership');
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const issueRoutes = require('./routes/issue');

app.use('/api/auth', authRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/issues', issueRoutes);

app.get('/', (req, res) => {
  res.send('library management system');
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error(err));
