import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, model, width, height, referenceImages } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Check usage limits (in production, this would check against user's actual usage)
    try {
      const usageResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/usage`);
      const usage = await usageResponse.json();

      if (usage.generationsUsed >= usage.generationsLimit) {
        return NextResponse.json(
          {
            error: 'Generation limit reached',
            message: `You've reached your limit of ${usage.generationsLimit} generations this month. Please upgrade your plan to continue.`,
            upgradeUrl: '/pricing'
          },
          { status: 403 }
        );
      }
    } catch (error) {
      console.error('Error checking usage limits:', error);
      // Continue with generation if usage check fails (fail open)
    }

    // Enhance the prompt with technical specifications
    const enhancedPrompt = `${prompt}. High quality YouTube thumbnail, professional, eye-catching, vibrant colors, detailed composition`;

    console.log('Generating image with:', {
      model,
      prompt: enhancedPrompt,
      size: `${width}x${height}`,
      referenceImagesCount: referenceImages?.length || 0,
    });

    // Map aspect ratio to OpenRouter format
    let aspectRatio = '16:9'; // default
    const ratio = width / height;
    if (Math.abs(ratio - 16/9) < 0.01) {
      aspectRatio = '16:9';
    } else if (Math.abs(ratio - 9/16) < 0.01) {
      aspectRatio = '9:16';
    } else if (Math.abs(ratio - 1) < 0.01) {
      aspectRatio = '1:1';
    }

    // Construct message content based on whether there are reference images
    let messageContent;
    if (referenceImages && referenceImages.length > 0) {
      // Multimodal content: images and text
      messageContent = [
        // Add all reference images first
        ...referenceImages.map((img: string) => ({
          type: 'image_url',
          image_url: {
            url: img
          }
        })),
        // Then add the text prompt
        {
          type: 'text',
          text: enhancedPrompt
        }
      ];
    } else {
      // Text-only content
      messageContent = enhancedPrompt;
    }

    // Use OpenRouter's chat completions endpoint with image generation
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'ThumbGen AI',
      },
      body: JSON.stringify({
        model: model || 'google/gemini-3-pro-image-preview',
        messages: [
          {
            role: 'user',
            content: messageContent
          }
        ],
        // Required for image generation
        modalities: ['image', 'text'],
        // Optional: Configure aspect ratio for Gemini models
        image_config: {
          aspect_ratio: aspectRatio
        },
        max_tokens: 1000,
      }),
    });

    // Get response text first to debug
    const responseText = await response.text();
    console.log('OpenRouter response status:', response.status);
    console.log('OpenRouter response:', responseText.substring(0, 500));

    if (!response.ok) {
      console.error('OpenRouter API error:', responseText);
      let errorMessage = 'Failed to generate image';
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error?.message || errorMessage;
      } catch (e) {
        errorMessage = responseText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // Parse the JSON response
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response:', responseText);
      throw new Error('Invalid response from AI service');
    }

    // Extract image from OpenRouter response
    const message = data.choices?.[0]?.message;

    console.log('Message object:', JSON.stringify(message, null, 2));

    // According to OpenRouter docs, images are in message.images array
    const imageUrl = message?.images?.[0]?.image_url?.url ||
                     message?.images?.[0]?.url;

    if (!imageUrl) {
      console.error('No image found in response. Full message:', JSON.stringify(message, null, 2));
      throw new Error('The model did not return an image. Please try again.');
    }

    console.log('Successfully extracted image URL (first 100 chars):', imageUrl.substring(0, 100));

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      model: model,
      prompt: enhancedPrompt,
    });

  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to generate image',
        details: error.toString()
      },
      { status: 500 }
    );
  }
}
