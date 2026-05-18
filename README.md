# AI Layout Agent

An AI-powered chat-based layout editing tool that transforms design layouts using natural language instructions.

Users can interact with the layout using prompts like:

* "Move headline to top"
* "Make headline smaller"
* "Change headline color to red"
* "Convert to Instagram story"

The application uses AI to generate structured layout updates and dynamically rerenders the design preview in real-time.

---

# Features

## AI-Powered Layout Editing

Edit layouts using natural language prompts.

Examples:

* Move elements
* Resize text
* Change colors
* Resize canvas
* Modify layouts responsively

---

## Live Preview Rendering

The preview updates instantly whenever AI modifies the layout JSON.

---

## Responsive Design Workspace

* Responsive sidebar
* Mobile hamburger menu
* Scrollable artboard preview
* Modern dark UI inspired by AI design tools

---

## Structured AI Output System

The AI does not directly rewrite the entire layout.

Instead, it returns structured JSON updates like:

```json
{
  "message": "Moved the headline closer to the top.",
  "target": "text_1778486306230_8",
  "updates": {
    "ny": 0.05
  }
}
```

This makes the system:

* safer
* scalable
* easier to debug
* more reliable

---

## Aspect Ratio Conversion

Supports converting layouts into:

* Instagram Story
* YouTube Thumbnail
* Portrait formats
* Custom canvas sizes

---

## Error Handling

Handles:

* invalid AI JSON
* API failures
* rate limits
* missing layouts
* frontend rendering crashes

---

# Tech Stack

## Frontend

* React
* Tailwind CSS
* Axios

## Backend

* Node.js
* Express.js

## AI

* Groq API
* Llama 3.3 70B Versatile

---

# Project Architecture

## Flow

```txt
User Prompt
   ↓
Frontend sends layout + instruction
   ↓
AI generates structured JSON updates
   ↓
Backend safely updates layout JSON
   ↓
Frontend updates React state
   ↓
Preview rerenders automatically
```

---

# Key Engineering Decisions

## AI for Reasoning, Code for Execution

Instead of letting AI rewrite the entire layout JSON, the AI only generates structured update instructions.

The backend safely applies updates.

This approach improves:

* stability
* debugging
* scalability
* reliability

---

## Normalized Coordinate System

The project uses:

* nx
* ny
* nw
* nh

These normalized values allow responsive layout transformations across different aspect ratios.

---

# Folder Structure

```txt
client/
 ├── src/
 │    ├── components/
 │    ├── data/
 │    ├── App.jsx
 │
server/
 ├── routes/
 ├── utils/
 ├── server.js
```

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone <https://github.com/PrathmeshShahapure/-Layout-Agent.git>
```

---

## 2. Install Frontend Dependencies

```bash
cd client
npm install
```

---

## 3. Install Backend Dependencies

```bash
cd server
npm install
```

---

## 4. Add Environment Variables

Create a `.env` file inside `server/`

```env
GROQ_API_KEY=your_api_key_here
PORT=3001
```

---

## 5. Start Frontend

```bash
npm run dev
```

---

## 6. Start Backend

```bash
npm run dev
```

---

# Future Improvements

* Undo/Redo support
* Drag-and-drop editing
* Export layouts
* Better AI memory
* Multi-node transformations
* Rich animation support
* Better visual editing tools

---

# Demo

Watch the project demo here:

https://drive.google.com/file/d/1y6uw3JiXr3eU8_MtnLrVFY0Q_39AltTw/view?usp=sharing

---

# Author

Prathmesh Shahapure
