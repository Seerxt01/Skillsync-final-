const mongoose = require("mongoose");
require("dotenv").config();

console.log("URI being used:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.log("❌ Error:", err.message));