# Legal Frontier Hackathon Project

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the root of the project with your n8n webhook URL:
   ```
   NEXT_PUBLIC_WEBHOOK_URL=https://your-n8n-webhook-url
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## About the Integration

This project integrates with an n8n webhook that analyzes GitHub repositories for AI Act compliance. The webhook requires:

- `repo_url`: The URL of the GitHub repository
- `branch_name`: The name of the branch to analyze

The webhook returns an array with the following structure:

```json
[
  {
    "classification": "Limited risk",
    "assessment": "The repository contains AI systems with limited risk...",
    "legal_obligations": "[\"Obligation 1\", \"Obligation 2\", \"Obligation 3\"]"
  }
]
```

Note: The `legal_obligations` field is a JSON string that will be parsed by the application.

## Technical Implementation

The application uses:
- Next.js for the frontend
- Zustand for state management
- Tailwind CSS and shadcn/ui for styling
- API integration with n8n webhook

The main functionality is implemented in:
- `app/check/page.tsx`: Form to collect repository information
- `app/results/page.tsx`: Display of compliance results
- `hooks/useAnalysisStore.ts`: Global state management
- `lib/api.ts`: API integration with the webhook 