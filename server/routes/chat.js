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

Your job is to analyze the user's instruction and return JSON describing:
1. what changes were made
2. which node was targeted
3. which properties were updated

The layout contains:
- text nodes
- image nodes
- shape nodes
- an artboard node

Every node has:
- absolute values:
  x y width height
- normalized values:
  nx ny nw nh
- visual styles inside:
  style.visual

IMPORTANT RULES:
- Return ONLY valid JSON
- Do NOT return markdown
- Do NOT explain outside JSON
- Do NOT use \`\`\`
- Return ONLY ONE JSON object
- Never return multiple JSON objects
- Never return arrays
- Handle only ONE layout transformation per request

TARGETING RULES:
- Always use EXACT node ids from the layout
- Never use generic names like:
  "headline"
  "product"
  "offer"

NORMALIZED VALUE RULES:
- nx ny nw nh must stay between 0 and 1
- Use normalized values for:
  position and size updates

TEXT RULES:
- Use fontSize for text resizing
- Use textColor for text color updates

COLOR RULES:
- Colors must use hex values
- Example:
  "#ff0000"

ARTBOARD RULES:
- The artboard is also a node
- To resize canvas, update:
  width and height

SUPPORTED UPDATE TYPES:
- nx
- ny
- nw
- nh
- fontSize
- textColor
- backgroundColor
- width
- height

RESPONSE FORMAT:

{
  "message": "Short explanation of changes",
  "target": "exact_node_id",
  "updates": {
    "property": "value"
  }
}

EXAMPLES:

User:
"Move headline to top"

Response:
{
  "message": "Moved the headline closer to the top of the canvas.",
  "target": "text_1778486306230_8",
  "updates": {
    "ny": 0.05
  }
}

User:
"Make headline smaller"

Response:
{
  "message": "Reduced the headline font size from 72px to 48px.",
  "target": "text_1778486306230_8",
  "updates": {
    "fontSize": 48
  }
}

User:
"Change headline color to red"

Response:
{
  "message": "Changed the headline text color to red.",
  "target": "text_1778486306230_8",
  "updates": {
    "textColor": "#ff0000"
  }
}

User:
"Convert to Instagram story"

Response:
{
  "message": "Resized the canvas to Instagram story format (1080×1920).",
  "target": "artboard_1778485662755_3",
  "updates": {
    "width": 1080,
    "height": 1920
  }
}

Return ONLY valid JSON.
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
    
      let action;

      try {
      
        action = JSON.parse(cleanedReply);
      
      } catch (error) {

        console.log(error);
      
        // HANDLE RATE LIMITS
      
        if (
          error.message.includes(
            "Rate limit"
          )
        ) {
      
          return res.status(429).json({
            error: true,
            message:
              "AI rate limit reached. Please try again in 15 minutes or try tomorrow.",
          });
        }
      
        // HANDLE GENERAL ERRORS
      
        return res.status(500).json({
          error: true,
          message:
            error.message ||
            "Something went wrong.",
        });
      }
    
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

      if (action.updates.textColor) {
        node.style.visual.color.hex =
        action.updates.textColor;
      }
      
      if (action.updates.backgroundColor) {
        node.style.visual.fill =
        action.updates.backgroundColor;
      }
    }
    
    res.json({
      action,
      updatedLayout,
    });

  } catch (error) {

    console.log(error);
  
    return res.status(500).json({
      error: true,
      message:
        error.message ||
        "Something went wrong.",
    });
  }
});

export default router;