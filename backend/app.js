const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    if (email === "shubham@gmail.com" && password === "1234") {
        return res.json({ success: true, message: "Login success" });
    }

    return res.json({ success: false, message: "Invalid credentials" });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});