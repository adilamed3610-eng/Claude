# Upwork Claude Integration - Setup Guide

## Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Upwork account (with freelancer or contractor status)
- Upwork Developer account (free)

## Step 1: Get Upwork OAuth Credentials

1. **Create a Developer Account**
   - Go to https://www.upwork.com/o/profiles/settings/applications
   - You'll need to link your existing Upwork account or create one

2. **Create an OAuth Application**
   - Click "Create New App"
   - Fill in the app name: "Claude Upwork Integration"
   - Set the redirect URL to: `http://localhost:3000/callback`
   - Accept the terms and create the app

3. **Get Your Credentials**
   - Copy your **Client ID**
   - Copy your **Client Secret**
   - Keep these safe and never share them

## Step 2: Install and Configure

1. **Clone or Download the Project**
   ```bash
   git clone <repository-url>
   cd upwork-claude-integration
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create .env File**
   ```bash
   cp .env.example .env
   ```

4. **Edit .env with Your Credentials**
   ```
   UPWORK_CLIENT_ID=your_client_id_here
   UPWORK_CLIENT_SECRET=your_client_secret_here
   UPWORK_CALLBACK_URL=http://localhost:3000/callback
   ENCRYPTION_KEY=generate_a_random_32_character_string
   PORT=3000
   NODE_ENV=development
   ```

   **Generate an Encryption Key:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
   ```

5. **Build the Project**
   ```bash
   npm run build
   ```

## Step 3: Test Locally

```bash
# Test authentication
npm run cli auth

# This will:
# 1. Start a local server on port 3000
# 2. Open your browser to Upwork login
# 3. Ask for authorization
# 4. Save your token securely
```

## Step 4: Set Up with Claude Code

### Option A: Command Line Installation

1. **Add to Claude Code models.json:**
   ```bash
   nano ~/.claude/models.json
   ```

2. **Add the MCP server configuration:**
   ```json
   {
     "mcpServers": {
       "upwork": {
         "command": "node",
         "args": ["/full/path/to/upwork-integration/dist/index.js"]
       }
     }
   }
   ```

3. **Replace `/full/path/to/upwork-integration`** with the actual absolute path

### Option B: Using Claude Code UI

1. Open Claude Code (web, desktop, or mobile)
2. Go to Settings → MCP Servers
3. Click "Add MCP Server"
4. Name: `upwork`
5. Command: `node`
6. Arguments: `/path/to/dist/index.js`

## Step 5: Configure Job Preferences

Create a `config.json` file based on the example:

```bash
cp config.example.json config.json
```

Edit `config.json` to match your preferences:

```json
{
  "jobSearchCriteria": {
    "skills": ["copywriting", "content writing"],
    "minBudget": 100,
    "maxBudget": 5000,
    "limit": 20
  },
  "autoAcceptRules": {
    "acceptJobs": false,
    "minClientRating": 4.5,
    "minPayment": 150
  }
}
```

**Important:** Start with `acceptJobs: false` to manually review jobs first.

## Troubleshooting

### "UPWORK_CLIENT_ID not set"
- Check that `.env` file exists
- Verify you copied the credentials correctly
- Make sure there are no extra spaces

### "Port 3000 already in use"
- Change the port in `.env`
- Or kill the process: `lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9`

### "Authentication failed"
- Make sure you have freelancer/contractor status on Upwork
- Check that your OAuth app redirect URL matches: `http://localhost:3000/callback`
- Try clearing `.tokens.json` and re-authenticating

### "Jobs not found"
- Verify your search criteria in config.json
- Check that Upwork has jobs matching your criteria
- Upwork's API may have rate limiting - wait a few minutes

## Security Notes

- ✅ Tokens are encrypted before storage
- ✅ API credentials are stored in `.env` only (excluded from git)
- ✅ Sensitive data is never logged
- ⚠️ Never commit `.env` file
- ⚠️ Never share your Client Secret
- ⚠️ Rotate your encryption key if exposed

## Next Steps

1. **Test Searching:** `npm run cli search`
2. **Check Profile:** `npm run cli profile`
3. **View Configuration:** `npm run cli config`
4. **In Claude Code:** Use `@upwork search_jobs` to start

## Getting Help

- Check the [README.md](../README.md) for usage examples
- Review `config.example.json` for configuration options
- Check logs in `.log` file for debugging
- View job history in `.job_log.json`
