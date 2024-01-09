import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();

const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("/api/notes", async (req, res) => {
    const notes = await prisma.note.findMany();
    res.json(notes);
  });

  app.post("/api/notes", async (req, res) => {
    console.log("Received POST request:", req.body);
  
    const { title, content, email } = req.body;
  
    if (!title || !content || !email) {
      return res.status(400).send("title, content, and email fields are required");
    }
  
    try {
      const note = await prisma.note.create({
        data: { title, content, email },
      });
      res.json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(500).send("Oops, something went wrong");
    }
  });

  app.put("/api/notes/:id", async (req, res) => {
    const { title, content, email } = req.body;
    const id = parseInt(req.params.id);
  
    if (!title || !content || !email) {
      return res.status(400).send("title and content fields required");
    }
  
    if (!id || isNaN(id)) {
      return res.status(400).send("ID must be a valid number");
    }
  
    try {
      const updatedNote = await prisma.note.update({
        where: { id },
        data: { title, content, email },
      });
      res.json(updatedNote);
    } catch (error) {
      res.status(500).send("Oops, something went wrong");
    }
  });

  app.delete("/api/notes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
  
    if (!id || isNaN(id)) {
      return res.status(400).send("ID field required");
    }
  
    try {
      await prisma.note.delete({
        where: { id },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).send("Oops, something went wrong");
    }
  });

  

app.listen(5000, () => {
  console.log("server running on localhost:5000");
});

