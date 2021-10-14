const express = require('express');
const bodyParser = require('body-parser');

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./controller/authController')(app);
require('./controller/projectController')(app);


app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`)
});