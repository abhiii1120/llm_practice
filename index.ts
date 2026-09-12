import { ChatMistralAI } from "@langchain/mistralai";
import dotenv from "dotenv";
import rl from "readline/promises";
import { HumanMessage, AIMessage, createAgent } from "langchain";

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

const agent = createAgent({
  model,
});

const chatHistory: (HumanMessage | AIMessage)[] = [];
let responseText: string = "";

while (true) {
  const prompt = await readline.question("Enter your prompt: ");

  chatHistory.push(new HumanMessage(prompt));

  const stream = await agent.stream(
    {
      messages: chatHistory,
    },
    {
      streamMode: "messages",
    },
  );

  for await (const [token, metadata] of stream) {
    process.stdout.write(token.text);
    responseText += token.text;
  }
  responseText = ''
  process.stdout.write("\n");
}
