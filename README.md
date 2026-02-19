# ExpenseFlow - Smart Personal Expense Tracker

A full-stack expense tracking application built with **Next.js 14 (App Router)**, **Tailwind CSS**, and **Supabase**.

## Features

- **Google & Facebook OAuth** authentication
- **Dashboard** with Total Spent, Monthly Budget, Daily Average summary cards
- **Interactive Charts**: Monthly spending trends (Area chart), Category breakdown (Pie chart), Daily spending (Bar chart)
- **CRUD Operations**: Add, Edit, Delete expenses with Server Actions
- **Category System**: 10 built-in categories with icons and color coding
- **Budget Tracking**: Set monthly budget with progress visualization
- **Search & Filter**: Filter expenses by category, sort by date/amount/name
- **Analytics Page**: Deep-dive spending insights and top expenses
- **Settings Page**: Profile info, budget management, data privacy info
- **Dark Mode UI**: Professional glass-morphism design
- **Fully Responsive**: Mobile-first, works on all screen sizes
- **Row Level Security**: Each user can only see their own data

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Recharts
- **Backend**: Next.js Server Actions, Supabase
- **Auth**: @supabase/ssr (Google & Facebook OAuth)
- **Database**: PostgreSQL (via Supabase)

---

## Setup Instructions

### Step 1: Supabase Project Setup

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Click **"New Project"** and give it a name (e.g., `expense-tracker`)
3. Set a database password and choose a region close to you
4. Wait for the project to finish provisioning

### Step 2: Run Database SQL

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy the entire contents of `supabase-setup.sql` from this project and paste it
4. Click **"Run"** — this creates the `expenses` and `user_settings` tables with RLS policies

### Step 3: Get Your Supabase Keys

1. In Supabase dashboard, go to **Settings → API**
2. Copy these two values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (under Project API keys)

### Step 4: Configure OAuth Providers

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to **APIs & Services → Credentials**
4. Click **"Create Credentials" → "OAuth 2.0 Client IDs"**
5. Set Application type to **"Web application"**
6. Add Authorized redirect URI:
   ```
   https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
   ```
   (Find your project ref in Supabase → Settings → General)
7. Copy the **Client ID** and **Client Secret**
8. In Supabase dashboard → **Authentication → Providers → Google**
9. Enable it and paste the Client ID and Secret

#### Facebook OAuth:
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app (Consumer type)
3. Add **Facebook Login** product
4. In Settings → Basic, copy **App ID** and **App Secret**
5. In Facebook Login → Settings, add Valid OAuth Redirect URI:
   ```
   https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
   ```
6. In Supabase dashboard → **Authentication → Providers → Facebook**
7. Enable it and paste the App ID and App Secret

### Step 5: Configure Auth Redirect URL

1. In Supabase → **Authentication → URL Configuration**
2. Set **Site URL** to your app URL:
   - Local: `http://localhost:3000`
   - Replit: `https://your-repl-name.your-username.repl.co`
3. Add **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   https://your-repl-name.your-username.repl.co/auth/callback
   ```

---

## Deploy on Replit

### Step 1: Import to Replit

1. Go to [https://replit.com](https://replit.com) and log in
2. Click **"Create Repl"** → **"Import from GitHub"**
   - Or click **"+" → "Import"** and upload a ZIP of this project folder
3. Alternatively, create a **blank Node.js Repl** and upload all files manually

### Step 2: Configure Environment Variables (Secrets)

1. In your Repl, click the **"Secrets"** tool (lock icon in left sidebar)
2. Add these two secrets:

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` (your anon key) |

### Step 3: Configure Replit Run Command

In the **Shell** tab, run:
```bash
npm install
npm run build
npm start
```

Or configure the `.replit` file:
```toml
run = "npm run build && npm start"

[nix]
channel = "stable-24_05"

[env]
NEXT_PUBLIC_SUPABASE_URL = ""
NEXT_PUBLIC_SUPABASE_ANON_KEY = ""

[[ports]]
localPort = 3000
externalPort = 80
```

### Step 4: Update Supabase Redirect URLs

After Replit gives you a URL (e.g., `https://expense-tracker.yourusername.repl.co`):

1. Go to Supabase → **Authentication → URL Configuration**
2. Update **Site URL** to your Replit URL
3. Add redirect URL: `https://expense-tracker.yourusername.repl.co/auth/callback`
4. Update Google OAuth and Facebook OAuth redirect URIs with:
   ```
   https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
   ```

---

## Local Development

```bash
# 1. Clone the project
cd expense-tracker

# 2. Install dependencies
npm install

# 3. Create .env.local file
cp .env.local.example .env.local

# 4. Edit .env.local with your Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# 5. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
expense-tracker/
├── src/
│   ├── app/
│   │   ├── auth/callback/route.js     # OAuth callback handler
│   │   ├── dashboard/
│   │   │   ├── analytics/             # Analytics page
│   │   │   ├── settings/              # Settings page
│   │   │   ├── components/            # Dashboard UI components
│   │   │   │   ├── Sidebar.js         # Navigation sidebar
│   │   │   │   ├── SummaryCards.js     # KPI summary cards
│   │   │   │   ├── Charts.js          # Recharts visualizations
│   │   │   │   ├── ExpenseList.js     # Expense list with CRUD
│   │   │   │   └── AddExpenseModal.js # Add/edit expense form
│   │   │   ├── DashboardClient.js     # Client-side dashboard wrapper
│   │   │   └── page.js               # Server component (data fetching)
│   │   ├── login/page.js             # OAuth login page
│   │   ├── globals.css               # Global styles
│   │   ├── layout.js                 # Root layout
│   │   └── page.js                   # Home redirect
│   ├── lib/
│   │   ├── supabase.js               # Browser Supabase client
│   │   ├── supabase-server.js         # Server Supabase client
│   │   └── actions.js                # Server Actions (CRUD + queries)
│   └── middleware.js                 # Auth middleware
├── supabase-setup.sql                # Database schema + RLS policies
├── tailwind.config.js                # Tailwind configuration
└── .env.local.example                # Environment variables template
```

## Database Schema

### `expenses` table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| item_name | TEXT | Expense name |
| amount | DECIMAL | Expense amount |
| category | TEXT | Category (food, transport, etc.) |
| date | DATE | Expense date |
| notes | TEXT | Optional notes |
| created_at | TIMESTAMPTZ | Record creation time |

### `user_settings` table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key (unique) |
| monthly_budget | DECIMAL | Monthly budget limit |
| currency | TEXT | Currency code |

