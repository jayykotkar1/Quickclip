import express from "express"
import cors from "cors"
import dashRouter from "./routes/dashRoute.js"


// app config
const app = express()
const port = 4000

// middleware
app.use(express.json())
app.use(cors())

app.use("/api/quickdash",dashRouter);

app.get("/", (req, res) => {
    res.send("API Working");
})

app.listen(port, () => {
    console.log(`Serever started on http://localhost:${port}`);
})