import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import connectDB from "./database/db.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import userRoutes from "./routes/user.route.js";
import orderRoutes from "./routes/order.route.js";
import categoryRoutes from "./routes/category.route.js";
import limiter from "./middleware/rateLimiter.js";
import timeout from "connect-timeout";

connectDB();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use("/uploads", express.static("uploads")); 

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};

app.use(timeout("45s"));
app.use(cors(corsOptions));
app.use(limiter);

app.use("/user", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.use("/category", categoryRoutes);

app.get("/", (req, res) => res.send("API is running..."));

app.use((req, res, next) => {
  if (!req.timedout) next();
});

app.use((err, req, res, next) => {
  if (req.timedout) {
    return res.status(503).json({
      status: 503,
      message: "Request timeout. Please try again later.",
    });
  }
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
