interface AnalysisRequest {
  repo_url: string;
  branch_name: string;
}

interface AnalysisResponse {
  classification: string;
  assessment: string;
  legal_obligations: string[];
}

interface RawAnalysisResponse {
  classification: string;
  assessment: string;
  legal_obligations: string | string[]; // This can be either a JSON string or an array
}

export async function analyzeRepository(request: AnalysisRequest): Promise<AnalysisResponse> {
  try {
    // Replace this URL with your actual n8n webhook URL
    const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL || 'https://your-n8n-webhook-url';
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        repo_url: request.repo_url,
        branch_name: request.branch_name,
      }),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    // Get the raw text first for debugging
    const rawText = await response.text();
    console.log('Raw API response:', rawText);
    
    // Try to parse the response
    let responseData;
    try {
      responseData = JSON.parse(rawText);
    } catch (error: unknown) {
      console.error('Failed to parse JSON response:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown parsing error';
      throw new Error(`Invalid JSON in API response: ${errorMessage}`);
    }
    
    console.log('Parsed response data:', responseData);
    
    // Handle both array and non-array responses
    let rawResult;
    
    if (Array.isArray(responseData) && responseData.length > 0) {
      // It's an array, use the first item
      rawResult = responseData[0];
    } else if (responseData && typeof responseData === 'object') {
      // It's a single object, use it directly
      rawResult = responseData;
    } else {
      throw new Error(`Unexpected API response format: ${typeof responseData}`);
    }
    
    if (!rawResult || !rawResult.classification || !rawResult.assessment) {
      throw new Error('API response missing required fields');
    }
    
    console.log('Raw legal_obligations:', rawResult.legal_obligations);
    
    // Parse the legal_obligations field
    let legal_obligations: string[];
    
    if (Array.isArray(rawResult.legal_obligations)) {
      // It's already an array, use it directly
      legal_obligations = rawResult.legal_obligations;
    } else if (typeof rawResult.legal_obligations === 'string') {
      try {
        // Try to parse the string as JSON
        const parsed = JSON.parse(rawResult.legal_obligations);
        
        if (Array.isArray(parsed)) {
          legal_obligations = parsed;
        } else if (typeof parsed === 'string') {
          // If it parsed to a single string, wrap it in an array
          legal_obligations = [parsed];
        } else {
          console.warn('Unexpected parsed legal_obligations type:', typeof parsed);
          legal_obligations = [String(rawResult.legal_obligations)];
        }
      } catch (parseError) {
        console.warn('Could not parse legal_obligations as JSON:', parseError);
        // Use the raw string as a single item in the array
        legal_obligations = [String(rawResult.legal_obligations)];
      }
    } else {
      // Handle unexpected types by converting to string
      console.warn('Unexpected legal_obligations type:', typeof rawResult.legal_obligations);
      legal_obligations = [String(rawResult.legal_obligations)];
    }
    
    // Return the formatted result
    return {
      classification: rawResult.classification,
      assessment: rawResult.assessment,
      legal_obligations
    };
  } catch (error) {
    console.error('Error analyzing repository:', error);
    throw error;
  }
} 