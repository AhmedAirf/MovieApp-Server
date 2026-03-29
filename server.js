const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const ensureDbConnection = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
};

// Routes
app.get("/", (req, res) => {
  res.send("🎬 Movie Recommendation API is running...");
});

app.use("/api/auth", ensureDbConnection, require("./routes/authRoutes"));
app.use("/api/users", ensureDbConnection, require("./routes/userRoutes"));
app.use("/api/media", require("./routes/mediaRoutes"));

// undefined routes
app.use(notFound);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
}

module.exports = app;
