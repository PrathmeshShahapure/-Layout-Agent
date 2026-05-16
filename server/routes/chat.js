import express from "express";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import {
    findNodeByTarget,
    applyUpdates,
  } from "../utils/layoutHelpers.js";

dotenv.config();

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
You are a layout transformation AI.

Your job is to return JSON updates for layout nodes.

CANVAS RULES:
- The artboard defines the canvas (width × height).
- Every node has absolute (x, y, width, height) AND normalized
  (nx, ny, nw, nh) coordinates relative to the artboard.
- When you change the artboard size, recompute absolute values
  using normalized values to preserve layout proportions.

SEMANTIC ROLES (infer from name + content):
- "Background" → full-canvas image
- "Product" → main product image (usually large, center)
- "headline" → largest text, often the main message
- "offer badge" / "discount" → smaller circular elements with %
- "CTA" / "offer" → "Limited time offer"-style text

The layout contains:
- text nodes
- image nodes
- shape nodes
- positions
- sizes

Rules:
- Return ONLY valid JSON
- Use normalized values:
  nx ny nw nh
- Values must stay between 0 and 1

Examples:

User:
"Move headline to top"

Response:
{
  "target": "headline",
  "updates": {
    "ny": 0.05
  }
}

User:
"Make headline smaller"

Response:
{
  "target": "headline",
  "updates": {
   "fontSize": 48
  }
}

User:
"Move product slightly right"

Response:
{
  "target": "product",
  "updates": {
    "nx": 0.3
  }
}

Return ONLY JSON.
`;

router.post("/", async (req, res) => {

  try {

    const { message ,layout, history} = req.body;

    const completion =
      await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:SYSTEM_PROMPT,
          },
          ...history,
          {
            role: "user",
            content: `
            USER INSTRUCTION:
            ${message}
            
            CURRENT LAYOUT:
            ${JSON.stringify(layout)}
                    `,
                  },
                ],
        model: "llama-3.3-70b-versatile",
      });

      const rawReply =
      completion.choices[0].message.content;
     console.log("rawReply",rawReply);
      const cleanedReply = rawReply
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    
    const action = JSON.parse(cleanedReply);
    
    const updatedLayout =
      structuredClone(layout);
    
      const node =
      updatedLayout.nodes[action.target];
    
    console.log("action",action);
    console.log("node",node);

    if (node && action.updates) {
    
      applyUpdates(node, action.updates);
    
      const rootId =
        updatedLayout.rootNodes[0];
    
      const artboard =
        updatedLayout.nodes[rootId];
    
      // recompute absolute values
    
      if (node.nx !== undefined) {
        node.x = node.nx * artboard.width;
      }
    
      if (node.ny !== undefined) {
        node.y = node.ny * artboard.height;
      }
    
      if (node.nw !== undefined) {
        node.width =
          node.nw * artboard.width;
      }
    
      if (node.nh !== undefined) {
        node.height =
          node.nh * artboard.height;
      }
      if (action.updates.fontSize) {
        node.style.visual.fontSize =
          action.updates.fontSize;
      }
    }
    
    res.json({
      action,
      updatedLayout,
    });

  } catch (error) {

    console.log(error);

    res.json({
      reply: error.message,
    });
  }
});

export default router;