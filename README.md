# Legal Frontier Hackathon Project

AI Act compliance checker for GitHub repositories.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the root of the project:
   ```
   NEXT_PUBLIC_WEBHOOK_URL=https://your-n8n-webhook-url
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Backend

The backend is implemented using n8n workflows and is saved in the `n8n_BACKEND_WITH_WEBHOOKS.json` file in this repository. You can import this file into your n8n instance to set up the required webhook.

The webhook expects:
- `repo_url`: GitHub repository URL
- `branch_name`: Branch name to analyze

The webhook returns:
```json
[
  {
    "classification": "Limited risk",
    "assessment": "Assessment text...",
    "legal_obligations": "[\"Obligation 1\", \"Obligation 2\"]"
  }
]
```

## Technologies

- Next.js
- Tailwind CSS + shadcn/ui
- Zustand for state management
- n8n for backend processing