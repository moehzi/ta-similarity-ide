const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}`);
});
