import "server-only";
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

const DEFAULT_MODEL_ID = "amazon.nova-lite-v1:0";
const modelId = process.env.BEDROCK_MODEL_ID ?? DEFAULT_MODEL_ID;

function getBedrockClient() {
  const region = process.env.AWS_REGION;

  if (!region) {
    return null;
  }

  return new BedrockRuntimeClient({ region });
}

export function getConfiguredModelId() {
  return process.env.AWS_REGION ? modelId : null;
}

function extractJsonObject(text: string) {
  const trimmed = text.trim();

  if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
    const withoutFence = trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    return withoutFence.trim();
  }

  return trimmed;
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

export async function generateBedrockJson<T>(input: {
  systemPrompt: string;
  userPrompt: string;
}) {
  const text = await generateBedrockText(input);

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(extractJsonObject(text)) as T;
  } catch (error) {
    console.error("Bedrock JSON parse failed", error);
    return null;
  }
}