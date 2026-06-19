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

### In Claude Code

1. **Authenticate**
   ```
   @upwork authenticate
   ```
   Follow the browser login prompt.

2. **Search Jobs**
   ```
   @upwork search_jobs --skills copywriting,content-writing --min_budget 100 --max_budget 5000
   ```

3. **Accept a Job**
   ```
   @upwork accept_job --job_id JOB123 --cover_letter "I'm interested in this project because..."
   ```

4. **View Active Jobs**
   ```
   @upwork get_active_jobs
   ```

5. **Send Message to Client**
   ```
   @upwork send_message --contract_id CONTRACT123 --message "I'm starting work on this..."
   ```

6. **Submit Deliverable**
   ```
   @upwork submit_deliverable --contract_id CONTRACT123 --description "Here's the completed content"
   ```

## Configuration

### Job Search Criteria

```
@upwork set_search_criteria --skills copywriting,content-writing --min_budget 150 --max_budget 3000
```

### Acceptance Rules

```
@upwork set_acceptance_rules --accept_jobs true --min_client_rating 4.5 --min_payment 200
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
