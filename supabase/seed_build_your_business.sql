-- Seed: Build Your Business with AI — Hands-On
-- Cove Blades Training Course

-- Course
INSERT INTO public.courses (id, title, slug, description, thumbnail_url, is_free, price, "order", active, level)
VALUES (
  'a1b2c3d4-0004-4000-8000-000000000001',
  'Build Your Business with AI — Hands-On',
  'build-your-business',
  'A hands-on workshop where we design, build, and deploy your business toolkit — website, AI phone agent, SMS automation, email pipeline, and business profiles. Using Claude Code, Next.js, Supabase, Vercel, and GitHub.',
  NULL,
  false,
  600.00,
  4,
  true,
  'entry'
);

-- ============================================================
-- MODULE 1: Planning Your Business Identity
-- ============================================================
INSERT INTO public.modules (id, course_id, title, slug, description, "order")
VALUES (
  'b4b2c3d4-0001-4000-8000-000000000001',
  'a1b2c3d4-0004-4000-8000-000000000001',
  'Planning Your Business Identity',
  'planning-your-business-identity',
  'Lock in the foundational decisions — name, services, pricing, and presence strategy — before you write a single line of code.',
  1
);

INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, "order") VALUES
('c4000001-0001-4000-8000-000000000001', 'b4b2c3d4-0001-4000-8000-000000000001', 'Business Name & Branding', 'business-name-and-branding', 'text',
'## Business Name & Branding

Before you touch a single tool or write any code, you need a name. Everything else — your domain, your logo, your Google listing, your AI phone agent''s greeting — flows from this decision.

### Choosing a Name

Your business name should be:

- **Short and memorable** — Two or three words max. Think "Cove Blades," not "Vancouver Island Premium Knife Sharpening Services."
- **Easy to spell over the phone** — Your AI agent will say it. Your customers will Google it. No clever misspellings.
- **Available as a .com or .ca domain** — Check immediately. If the domain is taken, keep brainstorming.

Use these tools to check availability:
- [Namecheap](https://www.namecheap.com) or [Google Domains](https://domains.google.com) for domain search
- Google the name in quotes plus your city — make sure nobody else is using it
- Check your provincial business registry

### Color Palette

Pick two or three colors and stick with them everywhere:

| Element | Purpose | Example |
|---------|---------|---------|
| Primary | Buttons, headers, links | Deep navy, forest green |
| Accent | Highlights, calls to action | Orange, gold, bright blue |
| Neutral | Backgrounds, body text | White, light gray, dark charcoal |

> **Pro tip:** Write your hex codes down now. You''ll use them in your website, your social profiles, your invoices, and your email templates. Consistency builds trust.

### Logo Basics

You don''t need a designer on day one. Start with:

1. A clean wordmark (your business name in a strong font)
2. A simple icon if you want one (a blade silhouette, a spark, etc.)
3. Export as PNG (for web) and SVG (for print)

Tools like Canva or even Claude Code can help generate logo concepts. You can always upgrade later — but you need *something* to launch with.', 1),

('c4000001-0001-4000-8000-000000000002', 'b4b2c3d4-0001-4000-8000-000000000001', 'Your Service Menu', 'your-service-menu', 'text',
'## Your Service Menu

Your service menu is what turns a curious visitor into a paying customer. It needs to be clear, scannable, and priced so you actually make money.

### What to Offer at Launch

Start focused. You can always add services later. A strong launch menu:

- **Kitchen knives** — Your bread and butter. Per-knife pricing is simplest.
- **Scissors** — Hair shears, kitchen scissors, fabric scissors. Higher margin than knives.
- **Serrated blades** — Bread knives, steak knives. Charge more — they take longer.
- **Tools** — Garden shears, chisels, axes. Quote individually or per-inch.

### Pricing Models

| Model | Best For | Example |
|-------|----------|---------|
| Per knife | Kitchen knives, simple | $10/knife, $8 each for 5+ |
| Per inch | Large blades, varied sizes | $1.50/inch of blade length |
| Flat rate | Scissors, standard tools | $15/pair of scissors |
| Package deal | Recurring customers | "Sharpen 10, get 1 free" |

### Mobile vs. Drop-Off vs. Both

- **Mobile** — You drive to them. Charge a trip fee ($20–40) plus per-knife. Great for restaurants, butchers, and salons.
- **Drop-off** — They come to you. Lower overhead. Works if you have a fixed location or partner locations (cafes, hardware stores).
- **Both** — Maximum flexibility, but you need a schedule and service area boundaries.

### Defining Your Service Area

Draw a circle on a map. Be specific on your website:

> "We serve the Greater Victoria area including Langford, Colwood, Sidney, and Sooke. Mobile service available within 30 km of downtown."

This sets expectations and prevents hour-long drives for a $10 knife.', 2),

('c4000001-0001-4000-8000-000000000003', 'b4b2c3d4-0001-4000-8000-000000000001', 'Your Online Presence Strategy', 'your-online-presence-strategy', 'text',
'## Your Online Presence Strategy

You need three things online to be taken seriously as a local service business. Not one, not two — three. Each does a different job.

### The Minimum Viable Stack

| Channel | Job | Why You Need It |
|---------|-----|-----------------|
| **Website** | Detailed info, booking, payments | You control it. It''s your home base. |
| **Google Business Profile** | Local search, maps, reviews | This is how 80% of local customers find you. |
| **Social media** (1–2 platforms) | Visual proof, community | Before/after photos sell sharpening better than any ad. |

### What Each Channel Does

**Your website** is where the details live: full service menu, pricing, booking calendar, contact info, service area map. It''s also where you collect payments and send customers after every other touchpoint.

**Google Business Profile** is how people find you when they search "knife sharpening near me." It surfaces your hours, phone number, location, and reviews directly in Google Search and Maps. This is non-negotiable.

**Social media** is your portfolio. Instagram and Facebook are the strongest for a sharpening business. Post:
- Before/after edge close-ups
- Sparks flying on the belt grinder
- Customer testimonials
- Behind-the-scenes of your mobile setup

### How They Connect

```
Customer searches "knife sharpening [city]"
  → Google Business Profile appears
    → Customer clicks website link
      → Books online or calls your AI agent
        → Gets confirmation via SMS + email
```

> **Pro tip:** Don''t try to build all three perfectly before launching. Get your website live first, claim your Google Business Profile second, and start posting on social third. Iterate from there.

Every piece of this stack will be built or configured during this course. By the end, you''ll have all three running.', 3);

-- Module 1 Quiz
INSERT INTO public.module_quizzes (id, module_id, questions, xp_reward) VALUES (
  'd4b2c3d4-0001-4000-8000-000000000001',
  'b4b2c3d4-0001-4000-8000-000000000001',
  '[
    {"id": "m1q1", "question": "Your business name is hard to spell. A customer tries to find you online after hearing your AI phone agent say the name. What''s the most likely outcome?", "options": ["They''ll find you through Google''s spell correction", "They''ll give up and call a competitor they can spell", "They''ll call back and ask the AI to spell it", "It doesn''t matter if you have good SEO"], "correct": 1},
    {"id": "m1q2", "question": "You want to offer mobile sharpening to restaurants. What''s the best pricing approach?", "options": ["Per knife only — keep it simple", "Trip fee plus per-knife pricing", "Hourly rate for time on site", "Flat monthly subscription"], "correct": 1},
    {"id": "m1q3", "question": "A customer searches ''knife sharpening near me'' on their phone. Which online presence is most likely to appear first?", "options": ["Your website homepage", "Your Instagram profile", "Your Google Business Profile", "Your Facebook page"], "correct": 2},
    {"id": "m1q4", "question": "You''re picking brand colors. Which approach will serve you best long-term?", "options": ["Use whatever looks good on the website and adjust later", "Pick 2–3 colors with hex codes and use them everywhere", "Match your competitors'' colors so customers feel familiar", "Use black and white only for a clean look"], "correct": 1},
    {"id": "m1q5", "question": "You can only get one online channel live before your first market day. Which do you prioritize?", "options": ["Instagram with before/after photos", "A full website with booking", "Google Business Profile listing", "A Facebook business page"], "correct": 1}
  ]'::jsonb,
  25
);

-- ============================================================
-- MODULE 2: Building Your Website
-- ============================================================
INSERT INTO public.modules (id, course_id, title, slug, description, "order")
VALUES (
  'b4b2c3d4-0002-4000-8000-000000000001',
  'a1b2c3d4-0004-4000-8000-000000000001',
  'Building Your Website',
  'building-your-website',
  'Build and deploy a professional sharpening business website using Next.js, Vercel, Supabase, and Claude Code.',
  2
);

INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, "order") VALUES
('c4000001-0002-4000-8000-000000000001', 'b4b2c3d4-0002-4000-8000-000000000001', 'The Stack: Next.js + Vercel + Supabase', 'the-stack', 'text',
'## The Stack: Next.js + Vercel + Supabase

You''re going to build a real website with real tools — the same ones used by startups and established companies. Here''s what each piece does and why we chose it.

### The Three Layers

| Tool | Role | What It Does for You |
|------|------|---------------------|
| **Next.js** | Framework | Builds your pages, handles routing, renders fast |
| **Vercel** | Hosting | Puts your site on the internet, auto-deploys when you push code |
| **Supabase** | Database + Auth | Stores your data (customers, bookings), handles login |

### Why This Stack?

1. **Free to start** — All three have generous free tiers. You won''t pay a cent until you outgrow them.
2. **Production-grade** — These aren''t toy tools. Cove Blades runs on this exact stack.
3. **Claude Code compatible** — Claude Code knows these tools deeply and can build with them effectively.

### Free Tier Limits

| Service | Free Tier | When You''ll Outgrow It |
|---------|-----------|----------------------|
| Vercel | 100 GB bandwidth/month | Thousands of visitors/month |
| Supabase | 500 MB database, 50K auth users | You won''t for a long time |
| GitHub | Unlimited public/private repos | Never for a small business |

### How They Connect

```
You write code (Next.js)
  → Push to GitHub
    → Vercel detects the push
      → Builds and deploys automatically
        → Your site is live in ~60 seconds
          → Supabase handles data behind the scenes
```

> **Pro tip:** You don''t need to understand every detail of these tools right now. Claude Code will handle the heavy lifting. Your job is to know what each tool does so you can describe what you want built.', 1),

('c4000001-0002-4000-8000-000000000002', 'b4b2c3d4-0002-4000-8000-000000000001', 'Using Claude Code to Build', 'using-claude-code-to-build', 'text',
'## Using Claude Code to Build

Claude Code is your AI coding partner. You describe what you want in plain English, and it writes the code, creates the files, and runs the commands. This is how we''ll build your entire website.

### What Claude Code Is

Claude Code is a command-line tool that connects the Claude AI model directly to your project. It can:

- Read and understand your entire codebase
- Write new files and edit existing ones
- Run terminal commands (`npm install`, `git commit`, etc.)
- Debug errors by reading logs and stack traces
- Deploy your site

### The Build Workflow

Every feature follows the same loop:

1. **Describe** — Tell Claude Code what you want in plain language
2. **Build** — Claude writes the code and creates/edits files
3. **Review** — You look at what it built, test it locally
4. **Refine** — Ask for changes if needed
5. **Deploy** — Push to GitHub, Vercel auto-deploys

### Getting Started

Open your terminal and install Claude Code:

```bash
npm install -g @anthropic-ai/claude-code
```

Navigate to your project directory and start a session:

```bash
cd my-sharpening-site
claude
```

### Effective Prompts

Good prompts are specific and contextual:

| Instead of... | Try... |
|---------------|--------|
| "Make a website" | "Create a homepage with our business name, a hero section, and a link to the services page" |
| "Add a page" | "Add a /pricing page with a table showing per-knife and per-inch pricing" |
| "Fix it" | "The booking button on mobile overlaps the footer. Fix the CSS." |

> **Pro tip:** The more context you give Claude Code, the better the output. Mention your brand colors, your service area, your pricing — it uses everything you tell it.

### What You''re Building Together

Over the next few lessons, you and Claude Code will build every page of your site. You''ll describe, it''ll build, and you''ll ship.', 2),

('c4000001-0002-4000-8000-000000000003', 'b4b2c3d4-0002-4000-8000-000000000001', 'Key Pages for a Sharpening Site', 'key-pages-for-a-sharpening-site', 'text',
'## Key Pages for a Sharpening Site

Every sharpening business website needs the same core pages. Here''s what goes on each one and why.

### The Essential Pages

1. **Home** — First impression. Hero image, tagline, one clear call to action ("Book Now" or "See Pricing").
2. **Services** — What you sharpen, how it works, what to expect.
3. **Pricing** — Transparent pricing builds trust. No "call for a quote" if you can avoid it.
4. **Booking** — Embedded calendar or booking form. Minimal friction.
5. **Contact** — Phone, email, service area, hours. Your AI agent''s number goes here.
6. **Service Areas** — Map or list of areas you cover. Helps with local SEO.

### Content Structure Per Page

**Home:**
- Hero section with strong image and tagline
- Three value propositions (fast, professional, convenient)
- Testimonial or two
- Clear CTA button above the fold

**Services:**
- List each service with a short description
- Include what''s included (e.g., "Sharpening includes cleaning and edge testing")
- Mention turnaround time

**Pricing:**

```markdown
| Service | Price |
|---------|-------|
| Kitchen knife | $10 |
| Scissors | $15 |
| Serrated blade | $12 |
| Chef''s knife (8"+) | $14 |
| Mobile trip fee | $25 |
```

**Booking:**
- Embedded Cal.com widget or custom form
- Date/time picker
- Service selection
- Deposit collection (optional)

**Contact:**
- Phone number (your AI agent''s number)
- Email address
- Business hours
- Service area description or map

> **Pro tip:** Build the Home page first with Claude Code. It''s the most motivating — you''ll see your business come to life on screen. Then build Pricing, Services, Booking, Contact, and Service Areas in that order.

### Calls to Action

Every page should have a clear next step. Don''t make visitors guess:
- Home → "View Pricing" or "Book Now"
- Services → "See Pricing"
- Pricing → "Book a Sharpening"
- Contact → Phone number + "Book Online"', 3),

('c4000001-0002-4000-8000-000000000004', 'b4b2c3d4-0002-4000-8000-000000000001', 'Deploying on Vercel', 'deploying-on-vercel', 'text',
'## Deploying on Vercel

Deployment is when your website goes from "running on your laptop" to "live on the internet." With Vercel, this happens automatically every time you push code.

### Step 1: Push to GitHub

First, make sure your code is in a GitHub repository:

```bash
git init
git add .
git commit -m "Initial site build"
git remote add origin https://github.com/yourusername/your-site.git
git push -u origin main
```

If Claude Code has been making commits along the way, you may just need the push.

### Step 2: Connect Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Select your repository from the list
4. Vercel auto-detects Next.js — click **Deploy**
5. Wait 60–90 seconds

Your site is now live at `your-project.vercel.app`.

### Step 3: Custom Domain

1. In the Vercel dashboard, go to your project → **Settings → Domains**
2. Add your domain (e.g., `yourbusiness.com`)
3. Vercel gives you DNS records to add at your registrar
4. SSL is automatic — no configuration needed

### Step 4: Environment Variables

Some features need secrets (API keys, database URLs). Add them in:

**Vercel Dashboard → Settings → Environment Variables**

Common variables for a sharpening site:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Connects to your database |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase key |
| `STRIPE_SECRET_KEY` | Payment processing |
| `POSTMARK_API_TOKEN` | Transactional email |

```bash
# You can also set them via Vercel CLI
vercel env add STRIPE_SECRET_KEY
```

### The Auto-Deploy Loop

From now on, every time you push to `main`:

```
git push origin main
  → Vercel detects the push (webhook)
    → Builds your Next.js site (~60s)
      → Deploys to global CDN
        → Live at your domain
```

> **Pro tip:** Set up a preview branch. Push to a `dev` branch first, and Vercel will deploy a preview URL you can check before merging to `main`. This prevents shipping broken changes to your live site.', 4);

-- Module 2 Quiz
INSERT INTO public.module_quizzes (id, module_id, questions, xp_reward) VALUES (
  'd4b2c3d4-0002-4000-8000-000000000001',
  'b4b2c3d4-0002-4000-8000-000000000001',
  '[
    {"id": "m2q1", "question": "You just pushed a code change to GitHub but your live site hasn''t updated. What''s the most likely cause?", "options": ["Vercel''s servers are down", "You pushed to a branch other than main", "Your domain DNS hasn''t propagated", "Next.js needs a manual rebuild"], "correct": 1},
    {"id": "m2q2", "question": "You want Claude Code to build a pricing page. Which prompt will get the best result?", "options": ["Make a pricing page", "Add a /pricing page with a table showing kitchen knives at $10, scissors at $15, and serrated blades at $12, using our navy and gold brand colors", "Build pricing", "Create a page for money stuff"], "correct": 1},
    {"id": "m2q3", "question": "Your Stripe payments aren''t working on the live site but work locally. Where do you check first?", "options": ["The Stripe dashboard for error logs", "Vercel environment variables — the secret key may be missing", "Your Next.js configuration file", "The GitHub repository settings"], "correct": 1},
    {"id": "m2q4", "question": "Which page should you build first when starting a new sharpening business site?", "options": ["Contact page with a map", "Booking page with calendar", "Home page with hero section and CTA", "Service areas page for SEO"], "correct": 2},
    {"id": "m2q5", "question": "You want to test a big design change without risking your live site. What''s the safest approach?", "options": ["Make the change directly on main and hope for the best", "Push to a dev branch and check the Vercel preview URL", "Take the site offline, make changes, then redeploy", "Build the change locally and just eyeball it"], "correct": 1}
  ]'::jsonb,
  25
);

-- ============================================================
-- MODULE 3: AI Phone Agent
-- ============================================================
INSERT INTO public.modules (id, course_id, title, slug, description, "order")
VALUES (
  'b4b2c3d4-0003-4000-8000-000000000001',
  'a1b2c3d4-0004-4000-8000-000000000001',
  'AI Phone Agent',
  'ai-phone-agent',
  'Set up an AI voice agent that answers your business phone 24/7 — handles inquiries, quotes pricing, and directs customers to book online.',
  3
);

INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, "order") VALUES
('c4000001-0003-4000-8000-000000000001', 'b4b2c3d4-0003-4000-8000-000000000001', 'Why an AI Answers Your Phone', 'why-ai-answers-your-phone', 'text',
'## Why an AI Answers Your Phone

You''re a sharpener. During business hours, you''re running a belt grinder, driving to a client, or elbow-deep in a pile of restaurant knives. You cannot answer your phone and do your job at the same time.

### The Problem

Every missed call is potentially a lost customer. When someone calls and gets voicemail, here''s what actually happens:

1. **70% hang up** without leaving a message
2. They call the next sharpener on Google
3. That sharpener answers (or their AI does)
4. You lost a customer you''ll never know about

### The Solution

An AI voice agent answers every call, 24 hours a day, 7 days a week. It:

- **Greets professionally** with your business name
- **Answers common questions** — pricing, services, hours, service area
- **Directs to booking** — "I can help you book right now at yourbusiness.com"
- **Takes messages** when the question is too complex
- **Never sounds tired, annoyed, or rushed**

### What It Costs vs. What It Saves

| Scenario | Cost |
|----------|------|
| AI agent (monthly) | $30–50/month |
| Missed call → lost customer | $50–200 per occurrence |
| Answering service (human) | $200–500/month |
| You answering during a job | Slowed work + safety risk |

### How Cove Blades Uses It

Cove Blades'' AI agent answers every call. It knows the service menu, pricing, hours, and service area. When someone calls asking "can you sharpen my lawn mower blade?" the agent knows the answer. When someone wants to book, it sends them to the website.

> **Pro tip:** Your AI agent is often the first interaction a customer has with your business. A professional, knowledgeable phone presence makes a $50/month investment feel like a $5,000/month receptionist.', 1),

('c4000001-0003-4000-8000-000000000002', 'b4b2c3d4-0003-4000-8000-000000000001', 'Setting Up Your Agent', 'setting-up-your-agent', 'text',
'## Setting Up Your Agent

We''ll use Magpipe to create and configure your AI voice agent. By the end of this lesson, your agent will be live and answering calls.

### Step 1: Create the Agent

In Magpipe (or your chosen platform), create a new voice agent with these settings:

- **Agent name:** Your business name (e.g., "Cove Blades")
- **Voice:** Choose one that matches your brand — professional, friendly, calm
- **Language:** English (or bilingual if you serve a bilingual area)

### Step 2: Write the System Prompt

The system prompt tells your agent who it is and what it knows. Include:

```
You are the phone assistant for [Business Name], a professional
knife and tool sharpening service in [City/Region].

SERVICES AND PRICING:
- Kitchen knives: $10 each ($8 each for 5+)
- Scissors: $15 per pair
- Serrated blades: $12 each
- Mobile service: $25 trip fee + per-item pricing

HOURS: Monday–Friday 9am–5pm, Saturday 10am–3pm
SERVICE AREA: [Your area]
WEBSITE: yourbusiness.com

INSTRUCTIONS:
- Always direct customers to the website to book
- Never book appointments directly — send them to the booking page
- If asked something you don''t know, offer to take a message
- Be friendly, professional, and concise
```

### Step 3: Provision a Phone Number

Get a local number in your area code. This becomes your business phone number — the one on your website, Google listing, and business cards.

### Step 4: Connect and Test

1. Assign the phone number to your agent
2. Call the number from your personal phone
3. Ask it your own questions:
   - "How much to sharpen a chef''s knife?"
   - "Are you open on weekends?"
   - "Can you sharpen scissors?"
   - "How do I book?"

> **Pro tip:** Save your system prompt somewhere version-controlled (like your Supabase database or a config file in your repo). You''ll iterate on it constantly as you learn what customers actually ask.', 2),

('c4000001-0003-4000-8000-000000000003', 'b4b2c3d4-0003-4000-8000-000000000001', 'Handling Common Scenarios', 'handling-common-scenarios', 'text',
'## Handling Common Scenarios

Your AI agent will hear the same questions over and over. The better it handles these, the more customers convert to bookings.

### The Top 10 Incoming Questions

Based on real call data from sharpening businesses, these are the most common:

1. "How much does it cost?"
2. "Can you sharpen [specific item]?"
3. "Do you do mobile/pickup?"
4. "What are your hours?"
5. "Where are you located?"
6. "How long does it take?"
7. "Do I need an appointment?"
8. "Do you sharpen serrated knives?"
9. "Can I drop off today?"
10. "How do I pay?"

### Building Responses Into Your Prompt

For each scenario, add specific guidance to your agent''s system prompt:

**Pricing inquiries:**
> "Our kitchen knives are $10 each, or $8 each if you bring five or more. I can give you the full price list — would you like me to text you a link to our pricing page?"

**"Can you sharpen X?"**
Define a clear yes/no list:

| We Sharpen | We Don''t Sharpen |
|-----------|-----------------|
| Kitchen knives | Ceramic knives |
| Scissors (all types) | Electric knife blades |
| Serrated blades | Disposable razors |
| Garden shears | Saw blades |
| Chisels, axes | Chainsaw chains |

**Turnaround time:**
> "Most knives are ready same day for drop-off, or within 24 hours. Mobile service is done on-site while you wait."

**Complex or unusual requests:**
> "That''s a great question — let me take your name and number and have [Owner Name] call you back with specifics."

### The Transfer Scenario

Some calls need a human. Program your agent to recognize these:
- Complaints or disputes
- Large commercial accounts (10+ knives regularly)
- Requests for services you don''t list
- Angry or confused callers

> **Pro tip:** Review your call logs weekly. Every question your agent stumbles on is a prompt improvement waiting to happen.', 3),

('c4000001-0003-4000-8000-000000000004', 'b4b2c3d4-0003-4000-8000-000000000001', 'Testing & Refining', 'testing-and-refining', 'text',
'## Testing & Refining

Your agent is live — but it''s not done. The first version of any AI agent is a rough draft. Real calls will expose gaps you didn''t anticipate.

### Your Testing Checklist

Call your own number and test each of these:

- [ ] Greeting — Does it say your business name clearly?
- [ ] Pricing question — Accurate and complete?
- [ ] "Can you sharpen X?" — Handles both yes and no items?
- [ ] Hours and location — Correct information?
- [ ] Booking redirect — Does it send callers to your website?
- [ ] Unknown question — Does it gracefully offer to take a message?
- [ ] Silence — What happens if the caller doesn''t speak?
- [ ] Interruption — Can the caller interrupt mid-sentence?

### Testing With Friends

Ask three or four people to call your number with these personas:

1. **The researcher** — Asks five questions before deciding
2. **The rusher** — "How much, can I drop off today?"
3. **The confused caller** — "I don''t know what kind of knives I have"
4. **The edge case** — "Can you sharpen my lawnmower blade and also do you do engraving?"

### Reading Call Logs

After each test call, check your platform''s call logs:

- **Transcript** — Read what the agent actually said
- **Duration** — Short calls may mean the agent confused the caller
- **Outcome** — Did it successfully direct to booking?

### The Refinement Loop

```
Make test calls
  → Read transcripts
    → Identify weak spots
      → Update system prompt
        → Test again
```

Common refinements:
- Adding pricing for items you forgot
- Clarifying your service area boundaries
- Improving the "I don''t know" fallback
- Adjusting the greeting to sound more natural

### Monitoring in Production

Once real customers are calling:

1. Review call logs at least weekly
2. Look for calls where the agent said "I''m not sure" or took a message — these are improvement opportunities
3. Track your booking conversion: what percentage of calls end with the customer visiting your booking page?

> **Pro tip:** Keep a running list of "things my agent needs to know." Every time you hear a new question in person or see one in the logs, add it to the list and update the prompt monthly.', 4);

-- Module 3 Quiz
INSERT INTO public.module_quizzes (id, module_id, questions, xp_reward) VALUES (
  'd4b2c3d4-0003-4000-8000-000000000001',
  'b4b2c3d4-0003-4000-8000-000000000001',
  '[
    {"id": "m3q1", "question": "Your AI agent gets asked ''can you sharpen my ceramic knife?'' and you don''t offer that service. What should the agent do?", "options": ["Say yes to avoid losing the customer", "Politely say no and suggest services you do offer", "Transfer to you immediately", "Hang up"], "correct": 1},
    {"id": "m3q2", "question": "You notice most callers hang up within 15 seconds. What''s the most likely cause?", "options": ["The phone number is wrong", "The greeting is too long or confusing", "Callers don''t like AI voices", "Your service area is too small"], "correct": 1},
    {"id": "m3q3", "question": "A restaurant wants to set up weekly sharpening for 30 knives. How should your AI agent handle this?", "options": ["Quote the standard per-knife price and book it", "Offer to take their info and have you call back for a custom arrangement", "Tell them you only do residential customers", "Direct them to the pricing page"], "correct": 1},
    {"id": "m3q4", "question": "Where should you store your AI agent''s system prompt for easy iteration?", "options": ["In your head — just remember what you wrote", "In a text file on your desktop", "Version-controlled: in your database or code repository", "In the platform''s notes field only"], "correct": 2},
    {"id": "m3q5", "question": "Your agent keeps saying your hours are 9–5 but you recently changed to 10–4. What went wrong?", "options": ["The AI is hallucinating", "You updated the website but forgot to update the agent''s system prompt", "The platform has a bug", "Google Business Profile is overriding the agent"], "correct": 1}
  ]'::jsonb,
  25
);

-- ============================================================
-- MODULE 4: SMS & Email Automation
-- ============================================================
INSERT INTO public.modules (id, course_id, title, slug, description, "order")
VALUES (
  'b4b2c3d4-0004-4000-8000-000000000001',
  'a1b2c3d4-0004-4000-8000-000000000001',
  'SMS & Email Automation',
  'sms-and-email-automation',
  'Set up your business phone number, SMS auto-replies, transactional email pipeline, and the foundations of email marketing.',
  4
);

INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, "order") VALUES
('c4000001-0004-4000-8000-000000000001', 'b4b2c3d4-0004-4000-8000-000000000001', 'Dedicated Business Phone Number', 'dedicated-business-phone-number', 'text',
'## Dedicated Business Phone Number

Your personal cell phone is not your business phone. Separating the two is one of the most important operational decisions you''ll make.

### Why Separate?

- **Professionalism** — A dedicated number appears on your website, Google listing, and business cards
- **AI agent connectivity** — Your voice agent lives on this number
- **SMS automation** — Booking confirmations and notifications go out from this number
- **Work-life balance** — You can silence the business line after hours without missing personal calls
- **Portability** — If you switch platforms or sell the business, the number travels with it

### Getting Your Number

When you set up your AI voice agent, you''ll provision a local phone number through the platform (e.g., Magpipe). Choose:

- **Your local area code** — Customers trust local numbers
- **Easy to remember** if possible, but don''t pay extra for vanity numbers at launch

### One Number, Multiple Functions

Your business number handles three things simultaneously:

```
Incoming call → AI voice agent answers
Incoming text → SMS auto-reply system responds
Outbound text → Booking confirmations, notifications
```

This is all the same number. Customers call or text the same number and get the right response either way.

### Setting It Up

1. Provision the number through your voice agent platform
2. Verify it can receive both calls and SMS
3. Update your website contact page with the new number
4. Add it to your Google Business Profile
5. Print it on your business cards

> **Pro tip:** Before you give out the new number publicly, send a few test texts and make a few test calls. Make sure both voice and SMS are working correctly. There''s nothing worse than putting a broken number on 500 business cards.', 1),

('c4000001-0004-4000-8000-000000000002', 'b4b2c3d4-0004-4000-8000-000000000001', 'SMS Auto-Replies & Notifications', 'sms-auto-replies-and-notifications', 'text',
'## SMS Auto-Replies & Notifications

Text messages have a 98% open rate. Email sits at about 20%. For time-sensitive business communication, SMS wins every time.

### Types of SMS Your Business Sends

| Message Type | Trigger | Example |
|-------------|---------|---------|
| **Auto-reply** | Customer texts you | "Thanks for reaching out! Book online at yourbusiness.com or reply with your question." |
| **Booking confirmation** | Customer books online | "Confirmed! Your sharpening appointment is Tuesday at 2pm. Bring your knives in a towel or blade guard." |
| **Ready notification** | You finish sharpening | "Your knives are ready for pickup! We''re open until 5pm today." |
| **Reminder** | 24 hours before appointment | "Reminder: your sharpening appointment is tomorrow at 2pm." |

### Building Auto-Replies

When a customer texts your business number, they should get an immediate response. Set up rules:

**First-time texter:**
> "Hi! Thanks for texting [Business Name]. You can book a sharpening at yourbusiness.com, or reply here with any questions. We typically respond within an hour during business hours."

**Known customer:**
> "Hey [Name]! How can we help?"

**After-hours text:**
> "Thanks for your message! We''re currently closed but will reply first thing tomorrow. In the meantime, you can book anytime at yourbusiness.com."

### Notification Templates

Build reusable templates for common notifications:

```
BOOKING_CONFIRMED:
"Confirmed! {service} on {date} at {time}.
Bring knives in a towel or blade guard.
Address: {address}
Questions? Reply to this text."

READY_FOR_PICKUP:
"Your {item_count} knives are ready!
Pickup at {address} before {closing_time} today.
Total: ${amount}"

REMINDER:
"Reminder: sharpening appointment tomorrow
at {time}. See you then!"
```

> **Pro tip:** Keep texts under 160 characters when possible. Longer messages get split into multiple SMS segments, which can cost more and sometimes arrive out of order.', 2),

('c4000001-0004-4000-8000-000000000003', 'b4b2c3d4-0004-4000-8000-000000000001', 'Email Pipeline: Transactional Messages', 'email-pipeline-transactional-messages', 'text',
'## Email Pipeline: Transactional Messages

Transactional emails are the automated messages your system sends when something happens — a booking is made, a payment is received, knives are ready. These aren''t marketing; they''re operational.

### Transactional vs. Marketing Email

| | Transactional | Marketing |
|--|--------------|-----------|
| **Trigger** | Customer action (books, pays) | Your schedule (weekly, monthly) |
| **Content** | Order details, confirmations | Promotions, tips, news |
| **Opt-in needed?** | No — they expect it | Yes — they must subscribe |
| **Provider** | Postmark, SendGrid, SES | Mailchimp, ConvertKit |
| **Deliverability** | Very high | Variable |

### The Transactional Emails You Need

1. **Booking confirmation** — Date, time, service details, address, what to bring
2. **Payment receipt** — Amount, items, payment method, date
3. **Ready-for-pickup notification** — What''s ready, where, when
4. **Invoice** — Detailed line items, total, payment instructions

### Setting Up Postmark

Postmark is purpose-built for transactional email and has excellent deliverability.

1. Create a Postmark account at [postmarkapp.com](https://postmarkapp.com)
2. Verify your sending domain (add DNS records)
3. Get your API token
4. Add `POSTMARK_API_TOKEN` to your Vercel environment variables

### Email Templates

Build templates in your code that accept dynamic data:

```
Subject: Booking Confirmed — {date}

Hi {customer_name},

Your sharpening appointment is confirmed:

📅 {date} at {time}
📍 {address}
🔪 {service_description}

Please bring your knives in a towel or blade guard.

Total: ${amount} (deposit of ${deposit} collected)

Questions? Reply to this email or text us at {phone}.

— {Business Name}
```

### Testing Your Pipeline

Before going live:

1. Book a test appointment on your own site
2. Verify the confirmation email arrives
3. Check spam folder — if it lands there, your DNS records need attention
4. Test the payment receipt email with a test Stripe charge

> **Pro tip:** Send all transactional emails from a subdomain like `mail.yourbusiness.com`. This protects your main domain''s reputation and makes DNS configuration cleaner.', 3),

('c4000001-0004-4000-8000-000000000004', 'b4b2c3d4-0004-4000-8000-000000000001', 'Email Marketing Foundations', 'email-marketing-foundations', 'text',
'## Email Marketing Foundations

Transactional emails keep the operation running. Marketing emails grow your business. They''re different beasts with different rules.

### Building Your Customer List

Every customer interaction is a chance to collect an email:

- **Booking form** — Email required (they need the confirmation)
- **Payment** — Stripe collects email automatically
- **Website signup** — "Get sharpening tips and seasonal offers" opt-in
- **In person** — "Can I add you to our email list for pickup reminders and offers?"

### What to Send

| Email Type | Frequency | Example |
|-----------|-----------|---------|
| **Seasonal reminder** | Quarterly | "Spring is here — time to sharpen those garden tools!" |
| **Promotion** | Monthly max | "Bring 5 knives, get the 6th free this week" |
| **Tips & education** | Monthly | "How to keep your knives sharp between visits" |
| **Business update** | As needed | "We now offer mobile sharpening in Langford!" |

### The Right Frequency and Tone

- **Once or twice a month** is the sweet spot for a local service business
- **Too often** (weekly+) = unsubscribes
- **Too rare** (quarterly) = they forget you exist
- **Tone:** Helpful, knowledgeable, brief. You''re the expert who''s looking out for their tools.

### Email Marketing Tools

| Tool | Cost | Best For |
|------|------|----------|
| Mailchimp | Free to 500 contacts | Simple, beginner-friendly |
| ConvertKit | Free to 1,000 subscribers | Creator-focused, good automation |
| Buttondown | Free to 100 subscribers | Minimalist, developer-friendly |

### A Simple Welcome Sequence

When someone joins your list, send an automated series:

1. **Immediately:** "Welcome! Here''s what we do and how to book."
2. **Day 3:** "5 tips to keep your knives sharp at home."
3. **Day 7:** "Book your first sharpening — here''s 10% off."

### Staying Legal

- Always include an unsubscribe link
- Only email people who opted in
- Include your business name and address
- Follow CASL (Canada) or CAN-SPAM (US) rules

> **Pro tip:** Your best marketing emails teach something. "Here''s why your knife dulls faster on a glass cutting board" gets more engagement than "20% OFF THIS WEEK." Educate first, sell second.', 4);

-- Module 4 Quiz
INSERT INTO public.module_quizzes (id, module_id, questions, xp_reward) VALUES (
  'd4b2c3d4-0004-4000-8000-000000000001',
  'b4b2c3d4-0004-4000-8000-000000000001',
  '[
    {"id": "m4q1", "question": "A customer texts your business number at 11pm asking about pricing. What should happen?", "options": ["Nothing — texts are only for outbound notifications", "An auto-reply acknowledges the message and links to your website", "Your personal phone rings so you can respond", "The AI voice agent calls them back"], "correct": 1},
    {"id": "m4q2", "question": "Your booking confirmation emails are landing in spam. What''s the first thing to check?", "options": ["Switch email providers immediately", "Your DNS records — SPF, DKIM, and DMARC may not be configured", "Ask the customer to mark it as not spam", "Send from a Gmail address instead"], "correct": 1},
    {"id": "m4q3", "question": "You want to send a ''spring garden tool sharpening'' promotion. Which type of email is this?", "options": ["Transactional — it''s triggered by the season", "Marketing — it''s a promotional campaign", "Operational — it''s about your services", "Notification — it''s time-sensitive"], "correct": 1},
    {"id": "m4q4", "question": "Why should you use a separate business phone number instead of your personal cell?", "options": ["It''s cheaper than a cell phone plan", "It connects to your AI agent, SMS automation, and maintains work-life balance", "Your personal number can''t receive texts", "Customers prefer toll-free numbers"], "correct": 1},
    {"id": "m4q5", "question": "How often should a local sharpening business send marketing emails?", "options": ["Daily — stay top of mind", "Weekly — consistency matters", "Once or twice a month — enough to stay relevant without annoying", "Once a year — only for big announcements"], "correct": 2}
  ]'::jsonb,
  25
);

-- ============================================================
-- MODULE 5: Booking & Payments
-- ============================================================
INSERT INTO public.modules (id, course_id, title, slug, description, "order")
VALUES (
  'b4b2c3d4-0005-4000-8000-000000000001',
  'a1b2c3d4-0004-4000-8000-000000000001',
  'Booking & Payments',
  'booking-and-payments',
  'Set up online booking, card payments, e-Transfer, and invoicing so customers can pay you without friction.',
  5
);

INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, "order") VALUES
('c4000001-0005-4000-8000-000000000001', 'b4b2c3d4-0005-4000-8000-000000000001', 'Online Booking Setup', 'online-booking-setup', 'text',
'## Online Booking Setup

If a customer has to call or email to book, you''ll lose half of them. Online booking lets people commit the moment they decide — at midnight, on their lunch break, whenever.

### Why Cal.com

Cal.com is an open-source scheduling tool that embeds directly into your Next.js website. It handles:

- **Appointment types** — Different services with different durations
- **Calendar sync** — Connects to Google Calendar so you never double-book
- **Deposit collection** — Collect payment at booking time via Stripe
- **Reminders** — Automatic email/SMS reminders

### Setting Up Event Types

Create one event type per service category:

| Event Type | Duration | Deposit | Notes |
|-----------|----------|---------|-------|
| Drop-off Sharpening | 15 min | $0 | Quick intake appointment |
| Mobile Sharpening | 60 min | $25 | On-site at customer location |
| Bulk/Restaurant | 90 min | $50 | 10+ knives, commercial |

### Embedding in Your Site

Cal.com provides an embed snippet you can add to your booking page:

```jsx
<Cal
  calLink="yourusername/drop-off-sharpening"
  style={{ width: "100%", height: "100%" }}
  config={{ layout: "month_view" }}
/>
```

Claude Code can integrate this into your Next.js site in minutes.

### Calendar Integration

1. Connect your Google Calendar in Cal.com settings
2. Set your availability (e.g., Mon–Fri 9am–5pm, Sat 10am–3pm)
3. Add buffer time between appointments (15–30 min)
4. Block off lunch, travel time, or personal commitments

### The Customer Experience

```
Customer visits yourbusiness.com/booking
  → Selects "Drop-off Sharpening"
    → Sees your available time slots
      → Picks a date and time
        → Enters their info
          → Pays deposit (if required)
            → Gets confirmation email + SMS
```

> **Pro tip:** Set the appointment type to require the customer''s address for mobile bookings. For drop-off, show your address on the confirmation page. Remove every possible source of confusion.', 1),

('c4000001-0005-4000-8000-000000000002', 'b4b2c3d4-0005-4000-8000-000000000001', 'Stripe Integration', 'stripe-integration', 'text',
'## Stripe Integration

Stripe handles your card payments — deposits at booking, remaining balances at pickup, and online purchases if you sell products.

### Setting Up Stripe

1. Create an account at [stripe.com](https://stripe.com)
2. Complete identity verification (required for payouts)
3. Get your API keys from the Stripe Dashboard:
   - **Publishable key** — Goes in your frontend code (safe to expose)
   - **Secret key** — Goes in your environment variables (never expose)

```bash
# Add to your Vercel environment variables
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Payment Flows

**Deposit at booking:**
```
Customer books → Cal.com collects $25 deposit via Stripe
  → You get notified → Customer arrives
    → You collect remaining balance
```

**Full payment at checkout:**
```
Customer drops off knives → You sharpen them
  → You send a payment link via SMS or email
    → Customer pays online → You notify them knives are ready
```

**In-person payment:**
```
Customer picks up → You use Stripe Terminal or manual card entry
  → Payment processed → Receipt sent via email
```

### Stripe Checkout Integration

For sending payment links, Stripe Checkout is the simplest approach:

```javascript
// Create a checkout session (server-side)
const session = await stripe.checkout.sessions.create({
  payment_method_types: [''card''],
  line_items: [{
    price_data: {
      currency: ''cad'',
      product_data: { name: ''Knife Sharpening - 5 knives'' },
      unit_amount: 5000, // $50.00 in cents
    },
    quantity: 1,
  }],
  mode: ''payment'',
  success_url: ''https://yourbusiness.com/thank-you'',
});
```

### Handling Refunds

Refunds happen through the Stripe Dashboard:
1. Find the payment
2. Click "Refund"
3. Choose full or partial
4. Customer sees the refund in 5–10 business days

> **Pro tip:** Start with Stripe''s test mode while building. Use test card number `4242 4242 4242 4242` with any future expiry and any CVC. Switch to live mode only when you''re ready for real payments.', 2),

('c4000001-0005-4000-8000-000000000003', 'b4b2c3d4-0005-4000-8000-000000000001', 'Interac e-Transfer & Cash', 'interac-e-transfer-and-cash', 'text',
'## Interac e-Transfer & Cash

Not every customer wants to pay by card. In Canada especially, Interac e-Transfer is hugely popular, and cash is still king for mobile and market work.

### Interac e-Transfer Setup

1. **Enable auto-deposit** in your bank''s online banking
2. **Set up a pay@yourdomain.com email** for receiving transfers (optional but professional)
3. **Add e-Transfer as a payment option** on your website and invoices

### Making e-Transfer Easy for Customers

On your website and invoices, display:

```
Pay via Interac e-Transfer:
Send to: pay@yourbusiness.com
Auto-deposit enabled — no security question needed.
```

> With auto-deposit enabled, payments arrive in your account instantly. No codes, no questions, no delays.

### pay@yourdomain.com Setup

If your email is on Google Workspace or a custom domain:

1. Create a forwarding alias: `pay@yourbusiness.com` → your main email
2. Register that email for Interac in your banking app
3. Enable auto-deposit for that email

This keeps payment notifications separate from your regular inbox and looks professional on invoices.

### Cash Handling

For mobile sharpening and market days, cash is simple but needs discipline:

- **Keep a float** — $50–100 in small bills for making change
- **Track every transaction** — Use a simple spreadsheet or notebook
- **Deposit regularly** — Don''t let cash pile up
- **Offer a receipt** — Even for cash, email a receipt for professionalism

### Payment Options on Your Website

Display all accepted payment methods clearly:

| Method | When to Use | Notes |
|--------|------------|-------|
| Credit/Debit (Stripe) | Online booking, payment links | 2.9% + $0.30 fee |
| Interac e-Transfer | Invoices, in-person | Usually free for sender |
| Cash | Mobile, markets, drop-off | No fees, track carefully |

> **Pro tip:** Offer all three methods but make online payment (Stripe) the default path. It''s fastest for you and the customer, creates automatic records, and triggers your email/SMS pipeline.', 3),

('c4000001-0005-4000-8000-000000000004', 'b4b2c3d4-0005-4000-8000-000000000001', 'Invoicing', 'invoicing', 'text',
'## Invoicing

For larger jobs, commercial clients, and professional record-keeping, you need proper invoices. A well-structured invoice gets you paid faster and makes tax time painless.

### What Goes on an Invoice

Every invoice needs:

- **Your business name and contact info**
- **Invoice number** (sequential: INV-001, INV-002, etc.)
- **Date issued**
- **Customer name and contact**
- **Line items with quantities and prices**
- **Subtotal, tax, and total**
- **Payment methods accepted**
- **Due date**

### Invoice Line Items Example

```
Invoice #INV-047
Date: March 15, 2026
Customer: West Coast Bistro

| Item | Qty | Unit Price | Total |
|------|-----|-----------|-------|
| Chef''s knife sharpening (8"+) | 8 | $14.00 | $112.00 |
| Paring knife sharpening | 4 | $10.00 | $40.00 |
| Scissors sharpening | 2 | $15.00 | $30.00 |
| Mobile trip fee | 1 | $25.00 | $25.00 |
|  |  | Subtotal | $207.00 |
|  |  | GST (5%) | $10.35 |
|  |  | Total | $217.35 |

Payment: Stripe link below or e-Transfer to pay@yourbusiness.com
Due: Upon receipt
```

### Sending Invoices

Build invoice generation into your system:

1. **Generate** the invoice from your order/job data
2. **Send via email** using your Postmark transactional pipeline
3. **Include a Stripe payment link** for one-click card payment
4. **Track status** — Sent, Viewed, Paid, Overdue

### Building It With Claude Code

Ask Claude Code to build an invoice system:

> "Create an invoice page at /admin/invoices that lets me select a customer, add line items, calculate tax, and send the invoice via email with a Stripe payment link."

### Tracking Paid vs. Unpaid

Keep a simple status system in your database:

| Status | Meaning |
|--------|---------|
| `draft` | Not yet sent |
| `sent` | Emailed to customer |
| `paid` | Payment received |
| `overdue` | Past due date, needs follow-up |

### Stripe Webhooks for Auto-Tracking

When a customer pays via your Stripe link, a webhook can automatically update the invoice status:

```
Customer clicks payment link
  → Pays via Stripe Checkout
    → Stripe fires webhook to your API
      → Invoice status updates to "paid"
        → Customer gets receipt email
```

> **Pro tip:** For recurring commercial clients (restaurants, salons), set up a regular schedule and send invoices on the same day each month. Predictability makes you easier to pay.', 4);

-- Module 5 Quiz
INSERT INTO public.module_quizzes (id, module_id, questions, xp_reward) VALUES (
  'd4b2c3d4-0005-4000-8000-000000000001',
  'b4b2c3d4-0005-4000-8000-000000000001',
  '[
    {"id": "m5q1", "question": "A customer books a mobile sharpening online. What''s the ideal payment flow?", "options": ["Collect full payment at booking", "Collect a deposit at booking, remaining balance on-site", "Don''t collect anything until the job is done", "Send an invoice a week after the job"], "correct": 1},
    {"id": "m5q2", "question": "You''re testing Stripe integration. Which card number should you use?", "options": ["Your personal credit card", "4242 4242 4242 4242 in test mode", "Any random 16-digit number", "You don''t need to test — just go live"], "correct": 1},
    {"id": "m5q3", "question": "A restaurant pays their sharpening invoice via e-Transfer. How do you update the invoice status?", "options": ["It updates automatically via Stripe webhook", "Manually mark it as paid — e-Transfer doesn''t trigger webhooks", "Delete the invoice since it''s paid", "Send a new invoice with $0 balance"], "correct": 1},
    {"id": "m5q4", "question": "Why should you embed Cal.com booking directly on your website instead of linking to an external page?", "options": ["It''s cheaper", "Fewer clicks means less friction — customers are more likely to complete the booking", "Cal.com requires embedding", "External links don''t work on mobile"], "correct": 1},
    {"id": "m5q5", "question": "Your Stripe secret key accidentally gets committed to GitHub. What should you do?", "options": ["Delete the commit from GitHub history", "Immediately rotate the key in the Stripe dashboard and update Vercel environment variables", "It''s fine — GitHub repos are private", "Change your Stripe password"], "correct": 1}
  ]'::jsonb,
  25
);

-- ============================================================
-- MODULE 6: Launch & Maintenance
-- ============================================================
INSERT INTO public.modules (id, course_id, title, slug, description, "order")
VALUES (
  'b4b2c3d4-0006-4000-8000-000000000001',
  'a1b2c3d4-0004-4000-8000-000000000001',
  'Launch & Maintenance',
  'launch-and-maintenance',
  'Claim your Google Business Profile, set up social media, and learn how to maintain the toolkit you''ve built.',
  6
);

INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, "order") VALUES
('c4000001-0006-4000-8000-000000000001', 'b4b2c3d4-0006-4000-8000-000000000001', 'Google Business Profile Setup', 'google-business-profile-setup', 'text',
'## Google Business Profile Setup

When someone in your city searches "knife sharpening near me," Google shows a map with local businesses. If you''re not on that map, you don''t exist to the majority of your potential customers.

### Claiming Your Listing

1. Go to [business.google.com](https://business.google.com)
2. Search for your business name — if it exists, claim it. If not, create it.
3. Google will verify you own the business (usually a postcard or phone call)
4. Verification takes 3–7 days

### Filling Out Your Profile

Complete every field — Google ranks complete profiles higher:

| Field | What to Enter |
|-------|--------------|
| **Business name** | Exact business name (no keyword stuffing) |
| **Category** | "Knife Sharpening Service" (primary) |
| **Address** | Your physical location or "Service area business" |
| **Service area** | List every city/neighborhood you serve |
| **Phone** | Your AI agent''s business number |
| **Website** | Your site URL |
| **Hours** | Accurate hours — update seasonally |
| **Description** | 750 characters about your services |

### Service Area Business vs. Storefront

If you don''t have a public location (you''re mobile-only), select **"Service area business"** and list the areas you cover. Google won''t show a pin on the map but will show you in search results for those areas.

### Photos Matter

Upload at least 10 photos:
- Your setup (belt grinder, workspace)
- Before/after shots of sharpened knives
- You at work (builds trust)
- Your vehicle if you do mobile
- Your logo

### Getting Your First Reviews

Reviews are the single biggest factor in local search ranking after profile completeness.

1. After every job, text the customer: "Thanks for choosing [Business Name]! If you have a moment, a Google review would mean a lot: [your review link]"
2. Make it easy — send the direct review link (find it in your GBP dashboard)
3. Respond to every review — positive or negative
4. Never offer incentives for reviews (Google penalizes this)

> **Pro tip:** Your Google Business Profile "Posts" feature lets you share updates, offers, and photos directly in search results. Post weekly — it signals to Google that your business is active and improves your ranking.', 1),

('c4000001-0006-4000-8000-000000000002', 'b4b2c3d4-0006-4000-8000-000000000001', 'Social Media Profiles', 'social-media-profiles', 'text',
'## Social Media Profiles

Social media for a sharpening business isn''t about going viral. It''s about proving you do great work, staying visible to past customers, and reaching new ones through visual content.

### Which Platforms?

| Platform | Strength | Priority |
|----------|----------|----------|
| **Instagram** | Visual content, local discovery | High — your #1 platform |
| **Facebook** | Community groups, older demographic, marketplace | Medium — good for local groups |
| **YouTube** | Long-form demos, education | Low at launch — build later |
| **TikTok** | Short-form viral content | Optional — if you enjoy it |

Start with **Instagram** and **Facebook**. Add others only when you have a consistent posting habit on the first two.

### What to Post

Sharpening is inherently visual and satisfying. Lean into it:

- **Before/after close-ups** — A dull edge vs. a polished one under light
- **Sparks on the belt grinder** — Short video clips, slow-motion
- **The paper test** — Video of a freshly sharpened knife slicing paper cleanly
- **Customer reactions** — "My knives have never been this sharp!"
- **Behind the scenes** — Your setup, your mobile rig, your workspace
- **Educational content** — "Why glass cutting boards destroy your knives"
- **Service area photos** — Landmarks and neighborhoods you serve

### Posting Frequency

- **Instagram:** 3–4 posts per week, daily Stories if you can
- **Facebook:** 2–3 posts per week
- Don''t sacrifice quality for frequency. One great before/after photo beats three mediocre posts.

### Profile Setup Checklist

For each platform:

- [ ] Business name (consistent with your website)
- [ ] Profile photo (your logo)
- [ ] Cover/banner (action shot or branded graphic)
- [ ] Bio with services, location, and website link
- [ ] Contact button linked to your business phone
- [ ] Link to your booking page

### Hashtag Strategy (Instagram)

Use a mix of:
- **Local:** #YourCityKnifeSharpening #YourCityFood
- **Industry:** #KnifeSharpening #SharpKnives #EdgeWork
- **Content:** #BeforeAndAfter #SatisfyingVideo #KnifeLife

> **Pro tip:** Batch your content. When you''re sharpening a stack of knives, take 30 seconds to photograph or video three or four of them. That''s a week of Instagram content from one sharpening session.', 2),

('c4000001-0006-4000-8000-000000000003', 'b4b2c3d4-0006-4000-8000-000000000001', 'Maintaining Your Toolkit', 'maintaining-your-toolkit', 'text',
'## Maintaining Your Toolkit

You''ve built a website, deployed an AI phone agent, set up SMS and email automation, configured booking and payments, and claimed your Google profile. Congratulations — you have a more sophisticated digital toolkit than most small businesses.

Now you need to keep it running.

### Weekly Maintenance Checklist

| Task | Time | Why |
|------|------|-----|
| Review AI agent call logs | 15 min | Find questions it can''t answer, update the prompt |
| Check SMS inbox | 10 min | Respond to anything the auto-reply didn''t handle |
| Review booking calendar | 5 min | Confirm upcoming appointments, adjust availability |
| Post on social media | 20 min | Stay visible, build portfolio |
| Check Stripe dashboard | 5 min | Verify payments, check for disputes |

### Monthly Maintenance

- **Update your website** — New photos, adjusted pricing, seasonal service changes
- **Review and update AI agent prompt** — Add new FAQ answers from real calls
- **Check Google Business Profile** — Update hours, respond to reviews, add posts
- **Review email list** — Clean bounced addresses, check subscriber growth
- **Back up your database** — Supabase has automatic backups, but verify they''re running

### What Breaks and How to Fix It

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Site is down | Vercel deployment failed | Check Vercel dashboard for build errors |
| AI agent gives wrong info | Outdated system prompt | Update the prompt in your config |
| Emails going to spam | DNS records changed or expired | Re-verify SPF/DKIM/DMARC |
| Booking calendar shows wrong times | Timezone mismatch or calendar sync issue | Check Cal.com settings and Google Calendar connection |
| Payments failing | Stripe API key expired or rotated | Update environment variable in Vercel |
| SMS not sending | Platform billing or number issue | Check your Magpipe/SMS provider dashboard |

### When to Call for Help

You built this toolkit with Claude Code, and you can maintain it with Claude Code too. For most issues:

1. Open a Claude Code session in your project
2. Describe the problem: "The booking page is showing a 500 error"
3. Let Claude Code read the logs, find the issue, and fix it
4. Push to deploy

For issues outside your code (DNS, Stripe account problems, Google verification), contact the specific platform''s support.

### Scaling Up

As your business grows, your toolkit grows with it:

- **More traffic?** — Vercel scales automatically
- **More data?** — Upgrade your Supabase plan
- **More services?** — Add pages and booking types
- **Hiring help?** — Add team member accounts to your tools
- **Second location?** — Duplicate and customize

> **Pro tip:** Set a recurring monthly calendar reminder: "Digital toolkit maintenance." Spend one hour updating, reviewing logs, and cleaning up. An hour a month keeps everything running smoothly and prevents small issues from becoming big ones.', 3);

-- Module 6 Quiz
INSERT INTO public.module_quizzes (id, module_id, questions, xp_reward) VALUES (
  'd4b2c3d4-0006-4000-8000-000000000001',
  'b4b2c3d4-0006-4000-8000-000000000001',
  '[
    {"id": "m6q1", "question": "You search for your business on Google Maps and it doesn''t appear. You set up your profile a week ago. What''s most likely happening?", "options": ["Google has banned your listing", "Your website SEO is too weak", "Verification is still pending — it takes 3–7 days", "You need to pay for Google Ads to appear"], "correct": 2},
    {"id": "m6q2", "question": "You have time to create one piece of social media content today. What gives you the most value?", "options": ["A text post about your pricing", "A before/after photo of a knife you just sharpened", "A repost of someone else''s sharpening video", "A photo of your business card"], "correct": 1},
    {"id": "m6q3", "question": "Your website starts showing a 500 error on the booking page. What''s your first troubleshooting step?", "options": ["Rebuild the entire website from scratch", "Check the Vercel dashboard for deployment logs and errors", "Wait 24 hours to see if it fixes itself", "Post about it on social media to warn customers"], "correct": 1},
    {"id": "m6q4", "question": "A customer leaves a negative Google review saying their knives weren''t sharp enough. What''s the best response?", "options": ["Delete the review", "Ignore it — one bad review doesn''t matter", "Respond professionally, apologize, and offer to re-sharpen for free", "Argue that your sharpening was fine"], "correct": 2},
    {"id": "m6q5", "question": "It''s been 3 months since you launched. Your AI agent still gives the same answers as day one. What should you do?", "options": ["That''s fine — if it''s not broken, don''t fix it", "Review call logs and update the prompt with answers to new questions callers have asked", "Replace the AI agent with a human receptionist", "Turn off the AI agent on weekends"], "correct": 1}
  ]'::jsonb,
  25
);
