# Upwork Claude Integration

An MCP (Model Context Protocol) server that enables Claude to autonomously manage your Upwork freelance account.

## Features

- 🔐 OAuth2 authentication with Upwork
- 🔍 Intelligent job search matching your profile
- ✅ Autonomous job acceptance based on configurable rules
- 💬 Client communication and messaging
- 📦 Deliverable submission and tracking
- 📊 Job history and logging

## Setup

### 1. Prerequisites

- Node.js 18+ and npm
- Upwork Developer Account (free)

### 2. Get Upwork OAuth Credentials

1. Go to https://www.upwork.com/o/profiles/settings/applications
2. Create a new OAuth app
3. Get your Client ID and Client Secret
4. Set the redirect URL to `http://localhost:3000/callback`

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your Upwork credentials:
```
UPWORK_CLIENT_ID=your_client_id
UPWORK_CLIENT_SECRET=your_client_secret
UPWORK_CALLBACK_URL=http://localhost:3000/callback
ENCRYPTION_KEY=generate_a_random_32_char_string
```

### 5. Build

```bash
npm run build
```

### 6. Add to Claude Code

Edit `~/.claude/models.json` (or create it):

```json
{
  "mcpServers": {
    "upwork": {
      "command": "node",
      "args": ["/path/to/upwork-integration/dist/index.js"]
    }
  }
}
```

Replace `/path/to/upwork-integration` with the actual path to this repository.

## Usage

### Quick Start (CLI)

Test the integration locally:

```bash
# Authenticate with Upwork
npm run cli auth

# Check your profile
npm run cli profile

# Search for jobs
npm run cli search

# View active contracts
npm run cli contracts

# See configuration
npm run cli config

# View job history
npm run cli log
```

### In Claude Code

1. **Authenticate**
   ```
   @upwork authenticate
   ```
   A browser window opens automatically. Log in to Upwork and authorize the application.

2. **Search Jobs** (with defaults from config)
   ```
   @upwork search_jobs
   ```
   
   Or override with custom criteria:
   ```
   @upwork search_jobs --skills "copywriting,content writing" --min_budget 100 --max_budget 5000
   ```

3. **Configure Search Criteria**
   ```
   @upwork set_search_criteria --skills "copywriting" --min_budget 150 --max_budget 3000
   ```

4. **Enable Auto Job Acceptance**
   ```
   @upwork set_acceptance_rules --accept_jobs true --min_client_rating 4.5 --min_payment 200
   ```

5. **Accept a Specific Job**
   ```
   @upwork accept_job --job_id "JOB123" --cover_letter "I'm experienced in this area and can deliver excellent results."
   ```

6. **View Active Jobs**
   ```
   @upwork get_active_jobs
   ```

7. **Send Message to Client**
   ```
   @upwork send_message --contract_id "CONTRACT123" --message "I've started working on your project and will have the first draft ready by Friday."
   ```

8. **Submit Deliverable**
   ```
   @upwork submit_deliverable --contract_id "CONTRACT123" --description "Completed content piece as requested" --files "https://example.com/deliverable.docx"
   ```

9. **View Job History**
   ```
   @upwork get_job_log
   ```

## Configuration

### Using config.json

Copy the example and customize it:

```bash
cp config.example.json config.json
```

Edit `config.json` with your preferences:

```json
{
  "jobSearchCriteria": {
    "skills": ["copywriting", "blog writing"],
    "category": "Writing",
    "minBudget": 100,
    "maxBudget": 5000,
    "limit": 20
  },
  "autoAcceptRules": {
    "acceptJobs": true,
    "minClientRating": 4.5,
    "minPayment": 150
  },
  "taskInstructions": {
    "copywriting": "Write engaging, high-quality content that matches brand voice",
    "blogWriting": "Create SEO-friendly blog posts with proper formatting"
  }
}
```

### At Runtime

Set search criteria:
```
@upwork set_search_criteria --skills "copywriting,content-writing" --min_budget 150 --max_budget 3000
```

Configure acceptance rules:
```
@upwork set_acceptance_rules --accept_jobs true --min_client_rating 4.5 --min_payment 200
```

View current settings:
```
npm run cli config
```

## Architecture

```
src/
├── auth/
│   ├── oauth.ts           # OAuth2 authentication
│   └── token-manager.ts   # Secure token storage
├── upwork/
│   ├── client.ts          # Upwork API wrapper
│   ├── jobs.ts            # Job search & acceptance
│   ├── contracts.ts       # Contract management
│   └── messages.ts        # Client messaging
├── mcp/
│   └── tools.ts           # MCP tool definitions
└── index.ts               # MCP server entry
```

## Security

- OAuth tokens are encrypted before storage
- Tokens are refreshed automatically when expired
- Sensitive data is never logged
- Environment variables for credentials

## Limitations

- Upwork API rate limits apply
- Some operations may require human review for safety
- Job acceptance follows Upwork Terms of Service

## Development

```bash
npm run dev      # Run with auto-reload
npm run build    # Build TypeScript
npm start        # Run production build
```

## License

MIT
