import express from "express";
import { operationRepository } from "./repositories/operationRepository.js";

const app = express();
const port = 3000;

app.use(express.json());

const OperationsType = ["addition", "soustraction", "multiplication", "division"];

const calculate = (a, b, type) => {
    switch (type) {
        case "addition": return a + b;
        case "soustraction": return a - b;
        case "multiplication": return a * b;
        case "division":
            if (b === 0) throw new Error("Division par 0 impossible");
            return a / b; default: return "opération invalide";
    }
};

app.post("/operations/:id", (req, res) => {
    const id = Number(req.params.id);
    const { type, a, b } = req.body;

    if (!OperationsType.includes(type)) {
        return res.status(400).json({ message: "Type invalide" });
    }

    if (operationRepository.findById(id)) {
        return res.status(409).json({ message: "Existe déjà" });
    }

    const newOperation = {
        id,
        type,
        a,
        b,
        result: calculate(a, b, type),
        createdAt: new Date().toIsoString()
    };

    operationRepository.save(newOperation);

    res.status(201).json(newOperation);
});

app.get("/operations", (req, res) => {
    const result = operationRepository.findByCriteria(req.query);
    res.json(result);
});

app.get("/operations/:id", (req, res) => {
    const operation = operationRepository.findById(Number(req.params.id));

    if (!operation) {
        return res.status(404).json({ message: "Not found" });
    }

    res.json(operation);
});

app.put("/operations/:id", (req, res) => {
    const id = Number(req.params.id);
    const { type, a, b } = req.body;

    if (!OperationsType.includes(type)) {
        return res.status(400).json({ message: "Type invalide" });
    }

    const existing = operationRepository.findById(id);
    if (!existing) {
        return res.status(404).json({ message: "Not found" });
    }

    const updated = {
        id,
        type,
        a,
        b,
        result: calculate(a, b, type),
        createdAt: existing.createdAt
    };

    operationRepository.update(id, updated);

    res.json(updated);
});

app.delete("/operations/:id", (req, res) => {
    const success = operationRepository.delete(Number(req.params.id));

    if (!success) {
        return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Deleted" });
});

app.listen(port, () => {
    console.log("Server started");
});