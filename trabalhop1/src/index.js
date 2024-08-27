const sequelize = require('./config/database');
const User = require('./models/user');
const express = require('express');
const app = express();
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');


sequelize.sync({ force: false })
  .then(() => {
    console.log('Database & tables created!');
  });


app.use(express.json());
app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
