import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: false,
});
export async function chatWithAI(messages) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: messages,
    max_tokens: 2000,
  });
  return response.choices[0]?.message?.content || "No AI response.";
}

export async function analyzeFile(file) {
  // Read file as base64 or text
  const buffer = await file.arrayBuffer();
  
  // Check file type
  if (file.type.startsWith('image/')) {
    return "Image analysis is not available. Your OpenAI API key does not have access to vision models.";
  }
  
  let text = "";
  
  // Handle PDF files
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    // Temporarily disable PDF support due to compatibility issues
    return "PDF support is temporarily unavailable in this version. Please convert your PDF to a text file (.txt) or use a different format.";
  } else {
    // For text files, analyze with a text model
    try {
      text = new TextDecoder().decode(buffer);
    } catch {
      text = "Unable to read file as text.";
    }
  }
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a helpful study assistant. Your job is to read the provided document and give a clear, concise summary of its main points, findings, and what the document is about. If the document is not readable, say so.",
      },
      {
        role: "user",
        content: `Please analyze and summarize the following document (${file.name}). What is it about? What are the main findings or topics?\n\n${text}`,
      },
    ],
    max_tokens: 500,
  });
  return response.choices[0]?.message?.content || "No AI response.";
}


