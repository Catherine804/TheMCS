const express = require("express");
const app = express();
const PORT = 3000;
app.get("/", (req, res) => {
 res.send("Hello from your MERN backend!");
});
app.listen(PORT, () => {
 console.log(
 `Server is running! Open http://localhost:${PORT} in your brows
er`
 );
});