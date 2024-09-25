import express from 'express';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// OpenAI configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openaiClient = new OpenAIApi(configuration);

app.post('/api/suggest-recipes', async (req, res) => {
    const { ingredients } = req.body;
  
    try {
      const response = await openaiClient.createChatCompletion({
        model: 'gpt-3.5-turbo', // or any other model you prefer
        messages: [
          {
            role: 'user',
            content: `Please suggest 10 recipes based on the following ingredients: ${ingredients.join(', ')}. Each recipe should include the following structure:
            {
              "title": "Recipe Title",
              "ingredients": ["ingredient1", "ingredient2", ...],
              "instructions": ["Step 1", "Step 2", ...]
            }
            Please return the data as a JSON array of recipes.`
          }
        ],
      });
  
      const recipes = response.data.choices[0].message.content; // Extract the recipe suggestions
      res.json(JSON.parse(recipes)); // Parse the JSON string to return as an object
    } catch (error) {
      console.error(error);
      res.status(500).send('Error generating recipe suggestions');
    }
  });
  
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
