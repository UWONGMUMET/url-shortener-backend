import express from "express";
import { config } from "./config/config";

const app = express();
app.use(express.json());

app.get("/health-check", (req, res) => {
    res.send("URL Shortener Backend is running");
});

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});