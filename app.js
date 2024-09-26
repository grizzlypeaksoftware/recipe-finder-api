const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// OpenAI configuration
const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
};

const client = new OpenAI(configuration);

app.post('/api/suggest-recipes', async (req, res) => {
    const { ingredients } = req.body;
    let recipe_count = 5;
  
    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini', // or any other model you prefer
        response_format: { "type": "json_object" },
        messages: [
          {
            role: 'user',
            content: `Please suggest ${recipe_count} recipes based on the following ingredients: ${ingredients.join(', ')}. Each recipe should include the following structure:
            {
                "title": "Recipe Title",
                "tags": ["tag1", "tag2", ...],
                "ingredients": ["ingredient1", "ingredient2", ...],
                "instructions": ["Step 1", "Step 2", ...]
            }
            Please return the data as a JSON array of recipes.`
          }
        ],
      });
  
      const recipes = response.choices[0].message.content; // Extract the recipe suggestions

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
