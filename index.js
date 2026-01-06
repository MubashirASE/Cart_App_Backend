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

app.use(cors(corsOptions));

app.use("/user", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.use("/category", categoryRoutes);

app.get("/", (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
