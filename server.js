const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const jobsRouter = require('./routes/jobs');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api/jobs', jobsRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});