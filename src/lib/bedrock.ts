import "server-only";
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

const modelId = process.env.BEDROCK_MODEL_ID ?? "amazon.nova-lite-v1:0";

function getBedrockClient() {
  const region = process.env.AWS_REGION;

  if (!region) {
    return null;
  }

  return new BedrockRuntimeClient({ region });
}

export async function generateBedrockText(input: {
  systemPrompt: string;
  userPrompt: string;
}) {
  const client = getBedrockClient();

  if (!client) {
    return null;
  }

  try {
    const response = await client.send(
      new ConverseCommand({
        modelId,
        system: [{ text: input.systemPrompt }],
        messages: [
          {
            role: "user",
            content: [{ text: input.userPrompt }],
          },
        ],
      }),
    );

    const text = response.output?.message?.content
      ?.map((part) => ("text" in part && part.text ? part.text : ""))
      .join("\n")
      .trim();

    return text || null;
  } catch (error) {
    console.error("Bedrock invocation failed", error);
    return null;
  }
}