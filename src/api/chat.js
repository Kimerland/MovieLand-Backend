import express from "express";
import dotenv from "dotenv";
import { HfInference } from "@huggingface/inference";

dotenv.config();

const chatRoutes = express.Router();
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const MODEL_ID = "facebook/blenderbot-400M-distill";

chatRoutes.get("/", (req, res) => {
  res.json({ message: "Chat endpoint is working" });
});

chatRoutes.post("/", async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("Processing message:", message);

    const response = await hf.textGeneration({
      model: MODEL_ID,
      inputs: message,
      parameters: {
        max_length: 100,
        temperature: 0.7,
      },
    });

    res.json({ message: response.generated_text });
  } catch (error) {
    console.error("Hugging Face API error:", error);
    res
      .status(500)
      .json({ error: "Error processing request", details: error.message });
  }
});

export default chatRoutes;
