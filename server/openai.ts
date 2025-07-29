import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

interface CaptionOptions {
  imageBase64?: string;
  imageUrl?: string;
  prompt?: string;
  mood: string;
  length: string;
}

interface BioOptions {
  occupation: string;
  interests: string;
  personality: string;
  includeEmojis: boolean;
}

interface HashtagOptions {
  content: string;
  niche?: string;
  targetAudience?: string;
}

export async function generateCaptions(options: CaptionOptions): Promise<string[]> {
  try {
    const messages: any[] = [
      {
        role: "system",
        content: `You are a Gen Z social media expert. Generate 3 engaging captions based on the mood: ${options.mood} and length: ${options.length}. 
        
        Mood guidelines:
        - casual: fun, relatable, friendly tone with emojis
        - professional: polished but approachable
        - motivational: inspiring, uplifting, encouraging
        - trending: uses current slang, viral format, trendy phrases
        
        Length guidelines:
        - short: 1-2 sentences, under 100 characters
        - medium: 2-3 sentences, 100-200 characters  
        - long: 3-5 sentences, 200-300 characters
        
        Always include relevant emojis and make it engaging for social media.
        Respond with JSON in this format: { "captions": ["caption1", "caption2", "caption3"] }`
      }
    ];

    if (options.imageBase64) {
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: options.prompt ? `Based on this image and prompt: "${options.prompt}", generate captions.` : "Based on this image, generate captions."
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${options.imageBase64}`
            }
          }
        ]
      });
    } else {
      messages.push({
        role: "user",
        content: options.prompt || "Generate general social media captions"
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"captions": []}');
    return result.captions || [];
  } catch (error) {
    throw new Error("Failed to generate captions: " + error.message);
  }
}

export async function generateBio(options: BioOptions): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a social media bio expert. Create 3 different bio variations for someone who is a ${options.occupation} with interests in ${options.interests} and a ${options.personality} personality. ${options.includeEmojis ? 'Include relevant emojis.' : 'Do not include emojis.'}
          
          Personality guidelines:
          - fun: playful, energetic, casual tone
          - professional: polished, business-focused
          - minimalist: clean, simple, concise
          - inspiring: motivational, uplifting
          - creative: artistic, expressive, unique
          
          Keep each bio under 150 characters. Make them engaging and authentic.
          Respond with JSON in this format: { "bios": ["bio1", "bio2", "bio3"] }`
        },
        {
          role: "user",
          content: `Generate bios for: ${options.occupation}, interests: ${options.interests}, personality: ${options.personality}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 800,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"bios": []}');
    return result.bios || [];
  } catch (error) {
    throw new Error("Failed to generate bio: " + error.message);
  }
}

export async function generateHashtags(options: HashtagOptions): Promise<{
  highReach: string[];
  mediumReach: string[];
  niche: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a hashtag expert. Generate relevant hashtags for the given content. Categorize them by reach:
          - highReach: popular hashtags with 1M+ posts (5-8 hashtags)
          - mediumReach: moderate hashtags with 100K-1M posts (8-12 hashtags)  
          - niche: specific hashtags with 10K-100K posts (5-10 hashtags)
          
          Focus on current trending hashtags that would help with discovery and engagement.
          Respond with JSON in this format: { "highReach": ["tag1", "tag2"], "mediumReach": ["tag1", "tag2"], "niche": ["tag1", "tag2"] }`
        },
        {
          role: "user",
          content: `Generate hashtags for: ${options.content}${options.niche ? `, niche: ${options.niche}` : ''}${options.targetAudience ? `, target audience: ${options.targetAudience}` : ''}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 800,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"highReach": [], "mediumReach": [], "niche": []}');
    return {
      highReach: result.highReach || [],
      mediumReach: result.mediumReach || [],
      niche: result.niche || []
    };
  } catch (error) {
    throw new Error("Failed to generate hashtags: " + error.message);
  }
}

export async function analyzeImage(base64Image: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image and describe what you see. Focus on the main subject, mood, setting, colors, and any notable elements that would be useful for generating social media content."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content || "Unable to analyze image";
  } catch (error) {
    throw new Error("Failed to analyze image: " + error.message);
  }
}
