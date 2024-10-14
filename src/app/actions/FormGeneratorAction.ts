"use server";

import { revalidatePath } from "next/cache";
import { any, z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";



export const FormGeneratorAction = async (
  prevState: any,
  formData: FormData
) => {
  if (!formData) {
    return {
      message: "Form data is undefined",
    };
  }

  const schema = z.object({
    description: z.string().min(1, "Description is required"),
  });

  const Parsed = schema.safeParse({
    description: formData.get("description") as string,
  });

  if (!Parsed.success) {
    console.error("Invalid form data");
    return {
      message: "Invalid form data",
    };
  }
  if (!process.env.GEMINI_API_KEY) { 
    console.error("Gemini API Key is not set");
    return {
      message: "Gemini API Key is not set",
    };
  }


  const promptExplanation =
    "Based on the description, generate a survey with questions array where every element has 2 fields: text and the fieldType and fieldType can be of these options RadioGroup, Select, Input, Textarea, Switch; and return it in json format. For RadioGroup, and Select types also return fieldOptions array with text and value fields. For example, for RadioGroup, and Select types, the field options array can be [{text: 'Yes', value: 'yes'}, {text: 'No', value: 'no'}] and for Input, Textarea, and Switch types, the field options array can be empty. For example, for Input, Textarea, and Switch types, the field options array can be []";

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" ,
      generationConfig: {
        responseMimeType: "application/json",
      },
      
    });
    const prompt = `${Parsed.data?.description} \n\n${promptExplanation} \n\n OUTPUT FORMAT: JSON Body only in the  respone nothing else`;
    const result = await model.generateContent(prompt);

   

    return {
      message: "Form generated successfully",
      data: result.response.text(),
    };
  } catch (error) {
    if (error.response) {
      console.error("Error response from API:", error.response.data);
      return {
        message: `Error generating form: ${
          error.response.data.message || error.response.data
        }`,
      };
    } else if (error.request) {
      console.error("No response received from API:", error.request);
      return {
        message: "Error generating form: No response received from API",
      };
    } else {
      console.error("Error setting up API request:", error.message);
      return {
        message: `Error generating form: ${error.message}`,
      };
    }
  }
};
