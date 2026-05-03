import express from "express";
import data from "./data.json" with {type: "json"};
const app = express()
const port = 3000
app.use(express.json())
const OperationsType = ["addition", "soustraction", "multiplication", "division"]

app.post("/operations/:id", (req, res) => {
    const id = Number(req.params.id)
    const { type, a, b } = req.body
    const exist = data.some(operation => operation.id === id)

    if (exist) {
        return res.status(409).json({ message: "operations existe deja" });
    }
    if (!OperationsType.includes(type)) {
        return res.status(409).json({ message: "Type d'operations invalide" });
    }
    const newOperation = {
        id,
        type,
        a,
        b
    }
    data.push(newOperation)
    return res.status(201).json(newOperation)
})

app.listen(port, () => {
    console.log("start");
})