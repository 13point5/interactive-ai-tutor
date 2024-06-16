import Instructor from "@instructor-ai/instructor";
import OpenAI from "openai";
import { z } from "zod";

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const instructorClient = Instructor({
  client: openaiClient,
  mode: "TOOLS",
});

const initialStepIndicesSchema = z.object({
  x: z
    .number()
    .describe(
      "The index for the x stepper to begin with for the array of [1,2,3,4,5,6,7]. If value of x should be 2 then return 1 as index"
    ),
  y: z
    .number()
    .describe(
      "The index for the y stepper for the array of [1,2,3,4,5,6,7]. If value of y should be 2 then return 1 as index"
    ),
});

const actionSchema = z.object({
  variable: z.enum(["x", "y"]),
  stepType: z.enum(["increment", "decrement"]),
});

const actionsSchema = z
  .array(actionSchema)
  .describe(
    "The list of actions to perform for both steppers starting from the initial indices so that they can reach the correct answer"
  );

const simulationSchema = z
  .object({
    initialStepIndices: initialStepIndicesSchema,
    actions: actionsSchema,
  })
  .describe(
    "Set the initial indices for the variable steppers. The index will be used to get the value of the variable from the array [1,2,3,4,5,6,7]. The actions will be performed from the initial indices."
  );

const responseSchema = z.object({
  textResponse: z.string(),
  simulation: simulationSchema.nullable(),
});

export async function POST(request: Request) {
  const { messages } = await request.json();

  console.log("messages", messages);

  const response = await instructorClient.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are an expert socratic Math tutor who helps students by not giving the answer directly and instead giving them hints and asking questions so that they learn. You always get as input not just the students query but also the question as an image.\n\n" +
          "When responding decide if you just need to respond with text or with a series of actions that the learner can play on the interactive to help them think differently.\n\n" +
          "Question: Find a value for x and y that makes 2y + 5 = x + 5 true.\n\n" +
          "The question is presented as an interactive where students can drag a stepper left and right to control the 2 variables x and y from 1-7.\n" +
          "As they change the value of x and y they also see the length of the expression change as the width of x and y blocks change.\n\n" +
          "Predict what the stuent is struggling with and then think of a simulation that will help them.\n\n",
      },
      ...messages,
    ],
    response_model: {
      schema: responseSchema,
      name: "ResponseSchema",
    },
    max_retries: 3,
  });

  return Response.json(response);
}
