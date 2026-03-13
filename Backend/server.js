require("dotenv").config();
require("./src/config/cache");   // Redis or caching setup

const app = require("./src/app");
const connectToDb = require("./src/config/database");

const PORT = process.env.PORT || 5000;

// Connect Database
connectToDb();

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});