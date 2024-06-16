import Instructor from "@instructor-ai/instructor";
import OpenAI from "openai";
import { z } from "zod";

const steps = [1, 2, 3, 4, 5, 6, 7];

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
  // textResponse: z.string(),
  simulation: simulationSchema.nullable(),
});

export async function POST(request: Request) {
  const { messages, variables } = await request.json();

  console.log("messages", messages);

  const response = await openaiClient.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are an expert socratic Math tutor who helps students by not giving the answer directly and instead giving them hints and asking questions so that they learn. You always get as input not just the students query but also the question as an image.\n\n" +
          "Use markdown and katex synta for your response\n\n" +
          "When responding decide if you just need to respond with text or with a series of actions that the learner can play on the interactive to help them think differently.\n\n" +
          "Question: Find a value for x and y that makes 2y + 5 = x + 5 true.\n\n" +
          "The question is presented as an interactive where students can drag a stepper left and right to control the 2 variables x and y from 1-7.\n" +
          "As they change the value of x and y they also see the length of the expression change as the width of x and y blocks change.\n\n" +
          "Predict what the stuent is struggling with and then think of a simulation that will help them.\n\n" +
          "If the student is trying to use one of the variables that needs a valid value outside the limit of 1-7 then nudge them to try a lower value that will give a valid answer.\n\n" +
          "Do not give multiple solution suggestions evenif they exist.",
        // "Here is an example of the simulation and how it works:\n"+
        // "initialStepIndices: { x: 1, y: 0 } this means that the value of x will be derived from the array [1,2,3,4,5,6,7] at index 1 so x = 2. same for y so y = 1.\n"+
        // "actions: [ { variable: 'x', stepType: 'increment'} ]"
      },
      ...messages,
    ],
  });

  const textResponse = response.choices[0].message.content;

  const instructorResponse = await instructorClient.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content:
          "You will be given an AI math tutor's response to a student for an interactive activity for questions on linear equations with 2 variables where they visualise the 'size' of either side of the equation by putting in values for the variables as shown in the image\n" +
          "Come up with the initial indices for the variables and a series of actions to perform that match the AI tutor's response. Since you're responding with indices they will correspond to a value in the array [1,2,3,4,5,6,7]. So index 0 is 1, 1 is 2 and so on.\n\n" +
          "Example:\n" +
          "Question: Find a value for x and y that makes 2y + 5 = x + 5 true.\n" +
          "AI text response: Now, you need to choose values for y such that 2 times y equals x. For instance, if y is 2, what would x be? Let's adjust the y value to 2 and see what we need to set x to.\n" +
          "User's variable indices: xStepIndex = 5, yStepIndex = 0.\n" +
          "This means x = 6 and y = 1 since the array for the values is [1,2,3,4,5,6,7]\n" +
          "Since we want y = 2 we would increment y once\n" +
          "If y = 2 then x should be 4 but it is 6 so we decrement x twice.",
      },
      {
        role: "user",
        content:
          `AI tutor's response: ${textResponse}\n\n` +
          `User's current variable indices: xStepIndex = ${
            variables.xStepIndex
          }, x = ${steps[variables.xStepIndex]}, yStepIndex = ${
            variables.yStepIndex
          }, y = ${steps[variables.yStepIndex]}`,
      },
    ],
    response_model: {
      schema: responseSchema,
      name: "ResponseSchema",
    },
    max_retries: 3,
  });

  return Response.json({
    simulation: instructorResponse.simulation,
    textResponse,
  });
}
