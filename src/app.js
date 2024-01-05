require('dotenv').config()

const express = require("express");
const v1WorkoutRouter = require("./routes/workoutRoutes");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use('/v1/records',v1WorkoutRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});