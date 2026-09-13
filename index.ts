import { ChatMistralAI } from "@langchain/mistralai";
import dotenv from "dotenv";
import rl from "readline/promises";
import { HumanMessage, AIMessage, createAgent, providerStrategy, toolStrategy, tool } from "langchain";
import z from "zod";

dotenv.config();

const readline = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
});

if (!process.env.MISTRAL_API_KEY) {
  throw new Error("MISTRAL_API_KEY is not defined");
}

const model = new ChatMistralAI({
  model: "ministral-14b-2512",
  apiKey: process.env.MISTRAL_API_KEY,
});

const schema = z.object({
  name: z.string().describe("the name of the user"),
  age: z.number().describe("the age of the user"),
  city: z.string().describe("the city  where the user lives"),
});



const chatHistory: (HumanMessage | AIMessage)[] = [];
let responseText: string = "";

async function getWeather({city}:{city:string}): Promise<string> {
  return JSON.stringify({city,temperature:"25C",condition:"Sunny"});
}

const weatherTool = tool(
  getWeather,
  {
    name:"getWeather",
    description:"Get the current weather for a given city.",
    schema:z.object({
      city:z.string().describe("The name of the city to get the weather for."),
    }),
  }
)

// const agent = createAgent({
//   model,
//   responseFormat:toolStrategy(schema),
// });

const agent = createAgent({
  model,
  tools:[weatherTool],
});

while (true) {
  const prompt = await readline.question("Enter your prompt: ");

  chatHistory.push(new HumanMessage(prompt));

  const response = await agent.invoke({
    messages:chatHistory,
  })

  console.log("Response",response)
  process.stdout.write("\n");
}
