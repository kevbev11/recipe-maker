import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    // Parse the uploaded image
    const formData = await req.formData();
    const file = formData.get("image");
    
    if (!file) {
      throw new Error("No image uploaded.");
    }

    // Convert the image to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // Call GPT-4 Vision to analyze the image
    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "Please identify this food and provide a detailed recipe for making it. Include:\n1. Name of the dish\n2. List of ingredients with measurements\n3. Step-by-step cooking instructions\n4. Estimated cooking time\n5. Difficulty level" 
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    });

    // Extract the response
    const analysis = visionResponse.choices[0].message.content;

    // Return the analysis
    return NextResponse.json({ 
      description: analysis
    });

  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    );
  }
}

// Configure API route to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};