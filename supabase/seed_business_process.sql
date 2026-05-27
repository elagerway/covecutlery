-- Seed: Business Process & Automation
-- Cove Blades Training Course

-- Course
INSERT INTO public.courses (id, title, slug, description, thumbnail_url, is_free, price, "order", active, level)
VALUES (
  'a1b2c3d4-0003-4000-8000-000000000001',
  'Business Process & Automation',
  'business-process',
  'A behind-the-scenes look at how Cove Blades operates — mobile logistics, drop-off workflows, AI call handling, SMS automation, booking, invoicing, pricing strategy, and customer acquisition.',
  NULL,
  false,
  200.00,
  3,
  true,
  'entry'
);

-- ============================================================
-- MODULE 1: Service Models
-- ============================================================
INSERT INTO public.modules (id, course_id, title, slug, description, "order")
VALUES (
  'b3b2c3d4-0001-4000-8000-000000000001',
  'a1b2c3d4-0003-4000-8000-000000000001',
  'Service Models',
  'service-models',
  'The two core delivery channels for a knife sharpening business — mobile and drop-off — and how to choose your starting point.',
  1
);

INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, "order") VALUES
('c3000001-0001-4000-8000-000000000001', 'b3b2c3d4-0001-4000-8000-000000000001', 'Mobile Sharpening', 'mobile-sharpening', 'text',
'## Mobile Sharpening

Mobile sharpening is the flagship service model for most knife sharpening businesses. You drive to the customer, sharpen on-site, and hand the knives back the same visit. It''s immediate, personal, and it commands a premium because you''re bringing the service to their door.

### The Sprinter Van Setup

I run a Mercedes Sprinter van outfitted as a mobile sharpening workshop. The key components are:

- **Belt grinder** (Buck Tool 1x30) mounted to a custom bench
- **Strop wheel** for final polishing
- **LED task lighting** for edge inspection
- **Storage bins** for intake and finished knives
- **Water supply** for cooling

The van itself doesn''t need to be a Sprinter — any cargo van or even a large SUV with the seats removed can work when you''re starting out.

### Power System

This is the part that surprises people. You don''t need a generator. Here''s the setup:

| Component | Approx. Cost |
|-----------|-------------|
| 2000W pure sine wave inverter | $300–$500 |
| 2x deep cycle AGM batteries (100Ah each) | $400–$600 |
| Battery isolator (charges from alternator) | $100–$150 |
| Wiring, fuses, terminals | $100–$150 |
| **Total** | **~$1,000–$1,400** |

The batteries charge while you drive between appointments. A 30-minute drive gives you enough juice for 2–3 hours of grinding. I''ve never run out of power mid-appointment.

### Route Planning

I divide my service area into geographic zones and assign days:

- **Monday/Wednesday** — North Shore and West Vancouver
- **Tuesday/Thursday** — East Vancouver and Burnaby
- **Friday** — flex day for drop-offs and restaurant pickups

This keeps drive time under control. The biggest mistake is zig-zagging across the city — you''ll burn more on gas than you make on the appointment.

### Appointment Scheduling

Every mobile appointment is booked online with a deposit. No deposit, no appointment. This eliminates no-shows and ensures the customer is home when you arrive.

> **Key insight:** Mobile sharpening isn''t just a service — it''s a show. Customers watch, ask questions, and become repeat clients. The personal touch is worth the extra logistics.', 1),

('c3000001-0001-4000-8000-000000000002', 'b3b2c3d4-0001-4000-8000-000000000001', 'Drop-Off Service', 'drop-off-service', 'text',
'## Drop-Off Service

Drop-off is the workhorse of the business. It runs 24/7, requires no appointment, and lets you batch your sharpening work for maximum efficiency.

### The 24/7 Drop Box

I installed a locked metal drop box at my home workshop. Customers drive up, fill out a tag, drop their knives in the slot, and leave. No appointment, no waiting, no interaction required.

The box itself cost about $150 — a locking steel mailbox bolted to a post. Nothing fancy. The magic is the system around it.

### Labelling System

Every knife set gets a tag with:

1. Customer name
2. Phone number
3. Number of knives
4. Date dropped off
5. Any special requests (e.g., "the serrated one is sentimental — be gentle")

I supply tags and pens at the drop box. When I collect the intake, each set goes into a labelled bin on my bench.

### Turnaround Commitments

I promise **24-hour turnaround** for standard drop-offs (under 8 knives). Restaurant sets or large batches get 48 hours. I''ve found that under-promising and over-delivering builds more trust than any marketing ever could.

### Intake Without Being Home

This is the superpower of drop-off. Customers can come at 6 AM before work, 10 PM after the kids are asleep — it doesn''t matter. The box is always open.

For return, I have two options:
- **Porch delivery** — I drop the wrapped knives at their door (for local customers)
- **Pickup from the shop** — they swing by and grab them from a labelled pickup shelf

### Why Drop-Off Scales Better

With mobile, you''re trading time for money on every appointment. With drop-off, you''re batching — and batching is where efficiency lives.

A typical evening session:
- 6 drop-off sets = ~30 knives
- Sharpening time: ~2 hours
- Revenue: ~$240–$300

Compare that to 3 mobile appointments across the city:
- Travel time: ~2 hours
- Sharpening time: ~2 hours
- Revenue: ~$180–$240

> **Key insight:** Drop-off is the channel that lets you sharpen in your pajamas at 8 PM while listening to a podcast. It''s the foundation of a sustainable business.', 2),

('c3000001-0001-4000-8000-000000000003', 'b3b2c3d4-0001-4000-8000-000000000001', 'Running Both Channels', 'running-both-channels', 'text',
'## Running Both Channels

Most people think they need to pick one — mobile or drop-off. In practice, running both is easier and more profitable than running either one alone.

### How They Feed Each Other

Here''s what actually happens:

1. A customer books a **mobile appointment**
2. You show up, sharpen their knives, chat for 20 minutes
3. They tell their neighbor
4. The neighbor doesn''t want to book an appointment — they just want to drop off
5. Now you have a **drop-off customer** who came from a mobile visit

It works the other direction too. A drop-off customer loves the result, wants to watch next time, and books a mobile visit.

### Scheduling Balance

I allocate my week like this:

| Day | Activity |
|-----|----------|
| Monday | Mobile appointments (North zone) |
| Tuesday | Mobile appointments (East zone) |
| Wednesday | Drop-off batch sharpening + shop work |
| Thursday | Mobile appointments (flex zone) |
| Friday | Drop-off batch + restaurant pickups |
| Saturday | Overflow / farmers market (seasonal) |

The key is dedicating full days to each mode. Don''t try to squeeze a drop-off batch between two mobile appointments — you''ll rush the batch and be late for the appointment.

### Revenue Mix

In a typical month, my revenue splits roughly:

- **Drop-off residential:** 45%
- **Mobile residential:** 25%
- **Restaurant accounts:** 25%
- **Specialty (scissors, tools):** 5%

Drop-off generates the most volume. Mobile generates the best per-hour rate. Restaurants generate the most predictable recurring revenue.

### Why Both Is Easier Than One

When you only do mobile, a cancellation wipes out a slot and you can''t fill it. When you only do drop-off, you''re invisible — people need to find you first.

Running both means:
- Mobile builds your reputation and visibility
- Drop-off captures the low-effort customers
- Cancelled mobile slots become extra batch time
- Slow drop-off weeks get filled with outreach and marketing

> **Key insight:** The two channels create a flywheel. Mobile feeds awareness, drop-off captures convenience, and both feed your bottom line.', 3),

('c3000001-0001-4000-8000-000000000004', 'b3b2c3d4-0001-4000-8000-000000000001', 'Choosing Your Starting Model', 'choosing-your-starting-model', 'text',
'## Choosing Your Starting Model

Don''t overthink this. Start with what you have, where you are, and grow with profit — not debt.

### Start in Your Garage

Almost every successful sharpening business I know started at a bench in a garage, basement, or spare room. Your first customers will be friends, family, and neighbors. You don''t need a van or a storefront for that.

**Minimum startup for a home shop:**

| Item | Cost |
|------|------|
| Buck Tool 1x30 belt grinder | $300 |
| Belt assortment (120, 600, strop) | $60 |
| Strop wheel + compound | $80 |
| Sharpies, tags, bins | $30 |
| Safety glasses, gloves | $20 |
| **Total** | **~$490** |

That''s it. Under $500 and you''re in business.

### Grow With Profit, Not Debt

I see people buying $5,000 grinders and wrapping a van before they''ve sharpened their first paying customer. Don''t do that.

The progression should be:

1. **Month 1–3:** Home shop, friends and family, refine your technique
2. **Month 3–6:** Add a drop box, start posting on Google, build reviews
3. **Month 6–12:** If demand supports it, explore a van setup
4. **Year 2+:** Consider a second drop point, restaurant accounts, expansion

Every upgrade should be funded by the business. If you can''t afford the van from profits, you don''t have enough demand to justify it yet.

### When to Add Mobile

Add mobile when:
- You''re consistently getting requests from outside your drop-off radius
- You have enough bookings to fill at least 2 full days per week
- You can afford the van setup (~$1,200 for power, plus the vehicle) without a loan

### When to Add Drop-Off Points

Consider a second drop-off point when:
- You''re getting 10+ drop-offs per week at your primary location
- Customers are driving 30+ minutes to reach you
- A local business (butcher shop, kitchen store) offers to host a box

> **Key insight:** Every business looks obvious in hindsight. But at the start, the only right answer is: start small, start now, and let demand pull you forward.', 4);

-- Module 1 Quiz
INSERT INTO public.module_quizzes (id, module_id, questions, xp_reward) VALUES (
  'd3b2c3d4-0001-4000-8000-000000000001',
  'b3b2c3d4-0001-4000-8000-000000000001',
  '[
    {"id": "m1q1", "question": "What is the approximate total cost for a mobile van power system (inverter, batteries, isolator, wiring)?", "options": ["$300–$500", "$1,000–$1,400", "$2,500–$3,000", "$5,000+"], "correct": 1},
    {"id": "m1q2", "question": "Why should mobile appointments require an online deposit?", "options": ["It increases your average ticket price", "It eliminates no-shows and ensures the customer is home", "It''s required by law in most provinces", "It lets you charge more per knife"], "correct": 1},
    {"id": "m1q3", "question": "A customer drops off 6 knives at your 24/7 drop box on Monday evening. What turnaround should you promise?", "options": ["Same day", "24 hours", "48 hours", "One week"], "correct": 1},
    {"id": "m1q4", "question": "You have $500 to start a sharpening business. What should you invest in first?", "options": ["A cargo van for mobile service", "A home shop setup with a belt grinder and supplies", "Facebook ads and business cards", "A commercial kitchen rental"], "correct": 1},
    {"id": "m1q5", "question": "Why is running both mobile and drop-off easier than running only one?", "options": ["You need fewer customers total", "Cancelled mobile slots become batch time and both channels feed each other", "Insurance is cheaper when you offer both", "Customers require both options by law"], "correct": 1}
  ]'::jsonb,
  25
);

-- ============================================================
-- MODULE 2: AI & Automation
-- ============================================================
INSERT INTO public.modules (id, course_id, title, slug, description, "order")
VALUES (
  'b3b2c3d4-0002-4000-8000-000000000001',
  'a1b2c3d4-0003-4000-8000-000000000001',
  'AI & Automation',
  'ai-and-automation',
  'How AI voice agents, SMS automation, and a two-number system let a one-person business answer every call and text without hiring staff.',
  2
);

INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, "order") VALUES
('c3000001-0002-4000-8000-000000000001', 'b3b2c3d4-0002-4000-8000-000000000001', 'AI Voice Agent', 'ai-voice-agent', 'text',
'## AI Voice Agent

Every missed call is a missed customer. When I was sharpening on the belt grinder, I couldn''t hear my phone. When I was driving between appointments, I couldn''t pick up safely. I was losing 3–5 calls a day, and each one was potentially $40–$80 in revenue.

### What the AI Voice Agent Does

The AI voice agent answers every inbound call, 24 hours a day, 7 days a week. Here''s what a typical call sounds like:

1. Customer calls your business number
2. The AI greets them by your business name
3. It answers common questions (pricing, turnaround, service area)
4. It quotes prices from your actual price list
5. It directs them to your website to book online

The agent doesn''t book appointments directly — it sends them to your booking page. This is intentional. Online booking with a deposit is how you avoid no-shows and keep your schedule clean.

### What It Saves You

Let''s do the math:

| Scenario | Without AI | With AI |
|----------|-----------|---------|
| Calls per day | 5–10 | 5–10 |
| Calls answered | 2–3 (when free) | All of them |
| Lost leads per week | 15–25 | 0 |
| Revenue lost per month | $2,000–$4,000 | $0 |

A virtual receptionist service costs $200–$400/month and still can''t quote your prices or answer knife-specific questions. An AI agent costs a fraction of that and never takes a day off.

### What It Can''t Do

Be honest about the limits:
- It won''t handle angry customers well — flag those for personal callback
- It can''t negotiate pricing — it quotes your listed prices
- It doesn''t process payments — that happens at booking or invoicing

> **Key insight:** The AI agent isn''t replacing you. It''s catching the calls you physically can''t answer. Every call answered is a customer who didn''t call your competitor instead.', 1),

('c3000001-0002-4000-8000-000000000002', 'b3b2c3d4-0002-4000-8000-000000000001', 'SMS Automation', 'sms-automation', 'text',
'## SMS Automation

People text businesses now. They expect a fast reply, and if they don''t get one, they move on. SMS automation ensures every inbound text gets a response within seconds, even when you''re elbow-deep in 120-grit.

### Automatic Replies for Inbound Inquiries

When someone texts your business number for the first time, they get an automatic reply:

> "Hey! Thanks for reaching out to Cove Blades. We sharpen knives, scissors, and tools. You can book online at coveblades.com or just drop them at our 24/7 drop box. Reply here with any questions!"

This does three things:
1. Confirms their message was received
2. Gives them the booking link immediately
3. Opens the door for a conversation

### Booking Confirmations

When a customer books online, they get an automatic SMS:

> "Your sharpening appointment is confirmed for Thursday at 2 PM. I''ll text you when I''m 10 minutes away. — Erik, Cove Blades"

This feels personal even though it''s automated. The customer has your number, knows what to expect, and can reply if they need to reschedule.

### Follow-Ups

After a completed job, the system sends a follow-up:

> "Hey [Name], your knives are done! They''re wrapped and on the pickup shelf. Total: $48 — pay online at the link below or e-Transfer to pay@coveblades.com. Thanks!"

### Dedicated Business Number

This all runs on a dedicated business phone number — not your personal cell. Customers text the business number, the automation handles the first response, and you jump in manually when needed.

**Why this matters:**
- You look professional and responsive at all hours
- Nothing falls through the cracks
- You can batch-reply to conversations during dedicated admin time instead of being interrupted all day

> **Key insight:** SMS automation isn''t about being impersonal. It''s about being impossibly fast on the first response, so the customer knows you''re real and responsive — then you take over when it matters.', 2),

('c3000001-0002-4000-8000-000000000003', 'b3b2c3d4-0002-4000-8000-000000000001', 'The Two-Number System', 'the-two-number-system', 'text',
'## The Two-Number System

This is one of the most important operational decisions you''ll make, and it costs almost nothing. You need two phone numbers: one for the business, one for you.

### Why Two Numbers

When you use your personal phone for business:
- Customer calls interrupt family dinner
- Texts come in at 11 PM and you feel obligated to reply
- You can''t hand off the business number to an employee later
- You can''t set up automation on your personal number without it hijacking your personal texts

### How to Set It Up

**Business number:**
- Provisioned through a VoIP/telephony provider (e.g., Magpipe, Twilio)
- Connected to your AI voice agent for inbound calls
- Connected to your SMS automation for inbound texts
- This is the number on your website, Google Business Profile, and business cards

**Personal number:**
- Your existing cell phone
- Used only for personal communication
- Never published anywhere business-related

### Managing Both

In practice, here''s how it works daily:

1. Business calls go to the AI agent — you never hear them ring
2. Business texts trigger auto-replies — you check the inbox 2–3 times a day
3. If a customer needs a real conversation, you reply from the business number via the admin dashboard (not your personal phone)
4. Your personal phone stays quiet

### Cost

A business phone number through a VoIP provider typically costs:
- **Phone number:** $2–$5/month
- **Inbound/outbound SMS:** $0.01–$0.03 per message
- **Voice minutes (AI agent):** $0.05–$0.15 per minute

For a small sharpening business handling 5–10 calls and 20–30 texts per day, that''s roughly **$30–$60/month** for the entire phone system including the AI agent.

> **Key insight:** The two-number system isn''t a luxury — it''s a boundary. Your business runs 24/7 through automation. You don''t have to.', 3),

('c3000001-0002-4000-8000-000000000004', 'b3b2c3d4-0002-4000-8000-000000000001', 'What It Costs', 'what-it-costs', 'text',
'## What It Costs

Let''s break down the real monthly cost of running the AI and automation stack for a startup knife sharpening business. No hypotheticals — these are the actual numbers.

### Monthly Cost Breakdown

| Service | Provider Example | Monthly Cost |
|---------|-----------------|-------------|
| Business phone number | Magpipe / Twilio | $2–$5 |
| AI voice agent | Magpipe | $15–$30 |
| SMS (inbound + outbound, ~500 msgs) | Magpipe / Twilio | $10–$20 |
| Website hosting | Vercel (hobby tier) | $0 |
| Domain name | Any registrar | ~$1.50/mo ($18/yr) |
| Booking system | Cal.com (free tier) | $0 |
| Email (transactional) | Postmark | $0–$10 |
| **Total** | | **$28–$67/month** |

### What You Get for $30–$70/Month

- Every call answered, 24/7
- Every text replied to instantly
- Online booking with deposits
- Professional business number
- Website with SEO and booking integration

Compare that to:
- **Virtual receptionist service:** $200–$400/month (and they still can''t answer knife questions)
- **Part-time helper answering phones:** $500–$1,000/month
- **Missing calls and losing customers:** Incalculable

### When to Spend More

As your business grows, you might upgrade:

1. **Cal.com paid tier** ($12/mo) — for team scheduling or multiple event types
2. **Vercel Pro** ($20/mo) — for more bandwidth and analytics
3. **Higher SMS volume** — scales linearly, ~$0.01–$0.03 per message
4. **Additional phone number** — for a second service area

### The Rule of Thumb

Your entire tech stack should cost less than one sharpening appointment per month. If you''re charging $8–$12 per knife and sharpening 5–6 knives per visit, a single $50–$70 appointment covers your entire monthly automation cost.

> **Key insight:** The barrier to running a professional, automated business is no longer money — it''s knowledge. The tools are cheap. Knowing how to wire them together is the hard part. That''s what this course teaches.', 4);

-- Module 2 Quiz
INSERT INTO public.module_quizzes (id, module_id, questions, xp_reward) VALUES (
  'd3b2c3d4-0002-4000-8000-000000000001',
  'b3b2c3d4-0002-4000-8000-000000000001',
  '[
    {"id": "m2q1", "question": "A customer calls your business at 9 PM on a Sunday. You''re at dinner with family. What happens?", "options": ["The call goes to voicemail", "You answer on your personal phone", "The AI voice agent answers, greets them, quotes prices, and directs them to book online", "The call is forwarded to your partner"], "correct": 2},
    {"id": "m2q2", "question": "What is the primary purpose of automatic SMS replies for first-time inquiries?", "options": ["To upsell premium services", "To confirm receipt, provide the booking link, and open the conversation", "To collect payment information", "To schedule a callback from the owner"], "correct": 1},
    {"id": "m2q3", "question": "Why should your business phone number be separate from your personal number?", "options": ["It''s a legal requirement for all businesses", "It enables automation, sets boundaries, and makes the business transferable", "Personal phone plans can''t receive business calls", "It''s cheaper to have two numbers"], "correct": 1},
    {"id": "m2q4", "question": "What is the approximate total monthly cost for a full AI + SMS + phone automation stack for a startup sharpening business?", "options": ["$200–$400", "$500–$1,000", "$28–$67", "$0 — all the tools are free"], "correct": 2},
    {"id": "m2q5", "question": "Why does the AI voice agent direct callers to book online instead of booking for them directly?", "options": ["The AI isn''t smart enough to book appointments", "Online booking collects deposits and prevents no-shows", "Phone bookings are illegal in Canada", "It''s faster for the AI to hang up"], "correct": 1}
  ]'::jsonb,
  25
);

-- ============================================================
-- MODULE 3: Booking, Invoicing & Payments
-- ============================================================
INSERT INTO public.modules (id, course_id, title, slug, description, "order")
VALUES (
  'b3b2c3d4-0003-4000-8000-000000000001',
  'a1b2c3d4-0003-4000-8000-000000000001',
  'Booking, Invoicing & Payments',
  'booking-invoicing-payments',
  'How to collect deposits at booking, invoice after service, and never let knives leave without payment.',
  3
);

INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, "order") VALUES
('c3000001-0003-4000-8000-000000000001', 'b3b2c3d4-0003-4000-8000-000000000001', 'Online Booking with Deposits', 'online-booking-with-deposits', 'text',
'## Online Booking with Deposits

If you take one thing from this entire course, let it be this: **never confirm an appointment without a deposit.** No-shows will eat your schedule alive.

### How It Works

I use Cal.com connected to Stripe. Here''s the flow:

1. Customer visits your booking page (linked from your website, Google profile, and SMS auto-reply)
2. They pick a date and time
3. They''re redirected to a Stripe checkout page to pay a deposit
4. They have **30 minutes** to complete payment — after that, the slot releases
5. Once paid, the booking is confirmed and both parties get a confirmation

### Why 30-Minute Checkout Expiry

Without an expiry, people "book" slots and never pay. Those phantom bookings block real customers from getting in. The 30-minute window creates urgency without being unreasonable.

### Deposit Amount

I charge a flat **$20 deposit** for residential mobile appointments. This covers:
- Your drive time if they cancel last-minute
- A commitment signal — people who pay $20 show up
- A portion of the final bill (it''s deducted from the total)

For drop-off service, no deposit is needed — they''re bringing the knives to you, so there''s no wasted travel.

### What Happens on Cancellation

My policy:
- **24+ hours notice:** Full refund
- **Under 24 hours:** Deposit is non-refundable but can be applied to a rebooking within 30 days
- **No-show:** Deposit forfeited

### Setting Up Cal.com + Stripe

The setup takes about 30 minutes:

1. Create a Cal.com account (free tier works)
2. Connect your Stripe account in Cal.com settings
3. Create an event type (e.g., "Mobile Knife Sharpening — 30 min")
4. Set the payment amount ($20) and checkout expiry (30 min)
5. Configure your availability (match your zone schedule from Module 1)

> **Key insight:** The deposit isn''t about making money on cancellations. It''s about making sure every slot on your calendar has a real human behind it.', 1),

('c3000001-0003-4000-8000-000000000002', 'b3b2c3d4-0003-4000-8000-000000000001', 'Invoicing & Payment Collection', 'invoicing-and-payment-collection', 'text',
'## Invoicing & Payment Collection

Sharpening is done. The knives are beautiful. Now you need to get paid — and you need a system that makes it easy for the customer and impossible for you to forget.

### Payment Methods

I offer three ways to pay:

1. **Stripe checkout link** (sent via email/SMS invoice)
2. **Interac e-Transfer** to pay@yourdomain.com (auto-deposit enabled)
3. **Cash** (for in-person mobile visits only)

Credit card via Stripe is the most common for residential. Restaurants almost always prefer e-Transfer.

### Email Invoices with Pay-by-Card

After completing a job, I send an email invoice through Stripe with:
- Customer name
- List of items sharpened (e.g., "6x chef knives, 1x bread knife, 1x scissors")
- Price per item
- Total
- **Pay Now** button that goes to Stripe checkout

The customer clicks the link, enters their card, and it''s done. No app to download, no account to create.

### Interac e-Transfer

For customers who prefer e-Transfer:
- Set up a dedicated email: **pay@yourdomain.com**
- Enable **auto-deposit** so funds go straight to your account
- Include the e-Transfer address on every invoice as an alternative

This is huge for restaurant accounts. The kitchen manager can send payment from their phone in 30 seconds.

### The Golden Rule

> **Never let knives leave without payment or a confirmed payment method.**

For mobile visits, collect payment before handing back the knives. For drop-off, send the invoice before notifying them that pickup is ready. Make payment the step *before* return, not after.

### Tracking What''s Owed

Keep a simple ledger — even a spreadsheet works:

| Date | Customer | Items | Total | Status | Method |
|------|----------|-------|-------|--------|--------|
| May 15 | Jane D. | 5 knives | $50 | Paid | Stripe |
| May 15 | Chef Tony | 12 knives + scissors | $132 | Pending | e-Transfer |
| May 16 | Mike R. | 3 knives | $30 | Paid | Cash |

Follow up on unpaid invoices within 48 hours. A friendly text works: "Hey Tony, just checking — did the e-Transfer go through for last week''s sharpening?"

> **Key insight:** Make paying you the easiest part of the experience. The fewer steps between "knives are done" and "money in your account," the faster you get paid.', 2),

('c3000001-0003-4000-8000-000000000003', 'b3b2c3d4-0003-4000-8000-000000000001', 'Pricing Strategy', 'pricing-strategy', 'text',
'## Pricing Strategy

Pricing is where most new sharpeners get it wrong. They undercharge because they''re afraid of losing customers, then burn out because the math doesn''t work. Here''s how to price profitably from day one.

### Per-Knife vs. Per-Inch

There are two common models:

| Model | How It Works | Pros | Cons |
|-------|-------------|------|------|
| **Per knife** | Flat rate per knife (e.g., $8–$12) | Simple, easy to quote | Unfair for tiny paring knives vs. 12" slicers |
| **Per inch** | Price per inch of blade (e.g., $1/inch) | Fair across all sizes | Harder to quote quickly, customers confused |

I use **per-knife with size tiers:**

| Category | Price |
|----------|-------|
| Paring / utility (under 6") | $8 |
| Chef / santoku (6"–10") | $10 |
| Bread / slicer (10"+) | $12 |
| Scissors (per pair) | $8 |
| Serrated knife | $10 |

This gives me the simplicity of per-knife pricing with the fairness of size-based adjustments.

### Residential vs. Restaurant Accounts

**Residential:** Full price, per-knife. These are one-off or quarterly customers.

**Restaurant accounts:** Volume discount, regular schedule.

| Account Size | Discount | Schedule |
|-------------|----------|----------|
| Under 20 knives/visit | 10% off | Bi-weekly or monthly |
| 20–50 knives/visit | 15% off | Weekly or bi-weekly |
| 50+ knives/visit | 20% off | Weekly |

The discount is worth it because restaurant accounts are **predictable recurring revenue.** A restaurant sharpening 30 knives bi-weekly at 15% off is still $200+/month, guaranteed.

### Mobile vs. Drop-Off Pricing

I charge the same per-knife price for both — but mobile has a **$20 minimum** (which is also the deposit). This covers your drive time and gas. If someone wants you to drive 30 minutes for a single paring knife, the $20 minimum makes it worthwhile.

Drop-off has no minimum. Even a single knife at $8 is fine because there''s no travel cost.

### Upsells

These are where margins get really good:

| Service | Price | Notes |
|---------|-------|-------|
| Thinning (behind the edge) | $10–$30 | For thick, wedgy knives |
| Chip/tip repair | $10–$20 | Depends on severity |
| Mirror polish | $5–$10 | Quick add-on, customers love it |
| Patina removal | $10 | Carbon steel knives |

Always mention thinning. Most home cooks have never heard of it, and once they feel the difference, they''ll request it every time.

> **Key insight:** Price for the value you deliver, not the time it takes. A knife sharpened in 3 minutes is worth $10 because the customer gets 3–6 months of effortless cutting. Don''t discount your speed — it''s your expertise.', 3);

-- Module 3 Quiz
INSERT INTO public.module_quizzes (id, module_id, questions, xp_reward) VALUES (
  'd3b2c3d4-0003-4000-8000-000000000001',
  'b3b2c3d4-0003-4000-8000-000000000001',
  '[
    {"id": "m3q1", "question": "A customer books a mobile appointment on your website. What should happen before the booking is confirmed?", "options": ["You should call them to confirm", "They should pay a deposit via Stripe checkout within 30 minutes", "They should email you their address", "Nothing — the booking is instant"], "correct": 1},
    {"id": "m3q2", "question": "A restaurant owner wants to pay for a 30-knife sharpening job. Which payment method is most practical for commercial accounts?", "options": ["Cash only", "Stripe credit card link", "Interac e-Transfer to your pay@ email with auto-deposit", "Personal cheque"], "correct": 2},
    {"id": "m3q3", "question": "You sharpen 5 chef knives (8 inches each) for a residential drop-off customer. Using the tiered per-knife model, what''s the total?", "options": ["$40 (5 x $8)", "$50 (5 x $10)", "$60 (5 x $12)", "$1 per inch = $40"], "correct": 1},
    {"id": "m3q4", "question": "A customer wants a single paring knife sharpened via mobile visit. How do you handle pricing?", "options": ["Charge $8 for the paring knife", "Apply the $20 mobile minimum", "Refuse the appointment — it''s not worth the drive", "Charge double for small orders"], "correct": 1},
    {"id": "m3q5", "question": "When should you send the invoice for a drop-off order?", "options": ["After the customer picks up the knives", "Before notifying them that the knives are ready for pickup", "At the time of drop-off", "At the end of the month in a batch"], "correct": 1}
  ]'::jsonb,
  25
);

-- ============================================================
-- MODULE 4: Customer Acquisition
-- ============================================================
INSERT INTO public.modules (id, course_id, title, slug, description, "order")
VALUES (
  'b3b2c3d4-0004-4000-8000-000000000001',
  'a1b2c3d4-0003-4000-8000-000000000001',
  'Customer Acquisition',
  'customer-acquisition',
  'How to get your first 100 customers using free and low-cost channels — Google, SEO, restaurant outreach, and word of mouth.',
  4
);

INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, "order") VALUES
('c3000001-0004-4000-8000-000000000001', 'b3b2c3d4-0004-4000-8000-000000000001', 'Google Business Profile', 'google-business-profile', 'text',
'## Google Business Profile

If you do one single thing for marketing, make it this. Your Google Business Profile (GBP) is the most important free marketing tool you have. When someone searches "knife sharpening near me," your GBP is what shows up in the map results.

### Setting Up Your Profile

1. Go to business.google.com and claim or create your listing
2. Set your business category to **"Knife Sharpening Service"**
3. Define your **service area** (the cities/neighborhoods you cover)
4. Add your business phone number (the AI-answered one)
5. Add your website URL
6. Set your hours (24/7 for the AI agent, or your actual availability for in-person)

### The Five Things That Matter Most

**1. Reviews** — This is the single biggest ranking factor. After every job, send a text: "Thanks for choosing Cove Blades! If you have a second, a Google review would mean a lot: [your review link]." Aim for 5 reviews in your first month, 20 by month three.

**2. Photos** — Post photos of your work regularly. Before/after shots of knives, your mobile setup, the drop box, your grinder in action. Google rewards active profiles with more visibility.

**3. Posts** — Google lets you make posts (like mini social media updates). Post weekly: a tip, a completed job, a seasonal special. Each post stays visible for 7 days.

**4. Q&A** — Seed your own Q&A section with common questions:
- "How much does knife sharpening cost?" → Your pricing
- "Do you sharpen scissors?" → Yes, $8/pair
- "How long does it take?" → 24-hour turnaround for drop-off

**5. Service area** — Be specific. Don''t claim you serve the entire province. List the neighborhoods and cities you actually cover.

### Responding to Reviews

Reply to every review — positive and negative. A simple "Thanks, [Name]! Glad the knives are cutting well" shows you''re active and engaged. For negative reviews, respond professionally and offer to make it right.

> **Key insight:** Your Google Business Profile is your storefront. Most customers will find you here before they ever visit your website. Treat it like the front door of your business.', 1),

('c3000001-0004-4000-8000-000000000002', 'b3b2c3d4-0004-4000-8000-000000000001', 'Local SEO & Your Website', 'local-seo-and-your-website', 'text',
'## Local SEO & Your Website

A real website beats a Facebook page every time. You own it, you control it, and Google indexes it. Facebook pages don''t rank in search results the way your own domain does.

### Why You Need a Website

- You control the content and branding
- Google indexes your pages and ranks them in search results
- You can embed your booking system directly
- It looks professional — customers trust businesses with real websites
- You can add service area pages that target specific neighborhoods

### Service Area Pages

This is the local SEO secret weapon. Create a dedicated page for each major area you serve:

- `/knife-sharpening-north-vancouver`
- `/knife-sharpening-burnaby`
- `/knife-sharpening-kitsilano`

Each page should include:
- The area name in the title and H1
- A paragraph about your service in that area
- Your pricing
- A booking button
- Testimonials from customers in that area (if you have them)

These pages rank for hyper-local searches like "knife sharpening Burnaby" — searches that your Google Business Profile alone might not catch.

### Blog Content

Write about what you know:

- "How Often Should You Sharpen Your Kitchen Knives?"
- "The Difference Between Honing and Sharpening"
- "Why Your Knives Are Dull (And What to Do About It)"

Each blog post is a door into your website from Google. Someone searching "how often sharpen kitchen knives" lands on your blog, sees your booking page, and becomes a customer.

### Meta Descriptions

Every page needs a meta description — the snippet that shows in Google results. Keep it under 160 characters and include your location:

> "Professional knife sharpening in Vancouver. Mobile service & 24/7 drop-off. Online booking with same-day turnaround. Cove Blades."

### Cost

- **Domain:** $12–$18/year
- **Hosting (Vercel free tier):** $0
- **Total:** Under $2/month

> **Key insight:** A Facebook page is renting space on someone else''s platform. A website is owning your own land. Build on land you own.', 2),

('c3000001-0004-4000-8000-000000000003', 'b3b2c3d4-0004-4000-8000-000000000001', 'Restaurant Outreach', 'restaurant-outreach', 'text',
'## Restaurant Outreach

Restaurant accounts are the holy grail of a sharpening business: recurring revenue, high volume, and predictable scheduling. But you have to earn them — and the approach matters.

### The Cold Outreach Approach

Don''t call. Don''t email. **Walk in.**

Here''s the script that works:

1. Visit during off-hours (2–4 PM, between lunch and dinner service)
2. Ask to speak to the chef or kitchen manager
3. Introduce yourself: "I run a local knife sharpening service. I''d love to sharpen a couple of your knives for free so you can see the quality."
4. Offer to sharpen **2–3 knives on the spot** as a trial (bring your portable setup or take them and return within 24 hours)

The trial sharpening is your resume. Words mean nothing to a chef — a razor-sharp gyuto means everything.

### Trial Sharpening

Bring your best work to the trial:
- Sharpen 2–3 of their most-used knives
- Polish to a high finish — this is about first impressions
- Return them wrapped in blade guards
- Include a business card and a printed price sheet

### Converting to an Ongoing Account

After the trial, follow up within a week:

> "Hey Chef, how are those knives holding up? If you''d like to set up a regular sharpening schedule, I can do bi-weekly pickups — I''ll swing by, grab the knives, and have them back within 24 hours."

Most restaurants need sharpening every 1–2 weeks. A typical restaurant account:

| Detail | Example |
|--------|---------|
| Knives per visit | 15–30 |
| Price per knife (15% discount) | $8.50 |
| Revenue per visit | $127–$255 |
| Frequency | Bi-weekly |
| Monthly revenue | $255–$510 |

### Commercial Pricing

Restaurants expect a volume discount. Offer it proactively — it builds trust and shows you understand their business:

- 10% off for under 20 knives/visit
- 15% off for 20–50 knives/visit
- 20% off for 50+ knives/visit

### Pickup Schedules

Establish a regular pickup day. "Every other Tuesday at 3 PM" becomes part of the kitchen''s routine. Consistency matters more than flexibility.

> **Key insight:** One restaurant account is worth 10 residential customers in recurring revenue. But you earn it with quality, not discounts. Lead with a sharp knife, not a sales pitch.', 3),

('c3000001-0004-4000-8000-000000000004', 'b3b2c3d4-0004-4000-8000-000000000001', 'Word of Mouth & Referrals', 'word-of-mouth-and-referrals', 'text',
'## Word of Mouth & Referrals

The best marketing is a sharp knife. When someone uses a freshly sharpened knife, they notice — and they talk about it. Your job is to make that word-of-mouth easy to spread.

### The Sharp Knife Effect

Here''s what happens naturally:
1. You sharpen Jane''s knives
2. Jane cooks dinner and notices how effortlessly the knife cuts
3. Jane''s partner says "Wow, these are sharp"
4. Jane tells them about you
5. Partner tells a coworker
6. Coworker texts your business number

This chain happens without you doing anything — *if* the sharpening is excellent. Mediocre work doesn''t generate referrals.

### Business Cards

Yes, physical business cards still work. Leave 2–3 with every customer:
- One for them
- One or two to hand to friends

Keep the card simple:
- Business name
- Phone number
- Website URL
- "Knife Sharpening — Mobile & Drop-Off"

Cost: ~$30 for 500 cards at an online printer.

### "Tell a Friend" Discount

A structured referral program works well for residential customers:

> "Refer a friend and you both get $5 off your next sharpening."

Track referrals in your customer database. When a new customer mentions a name, credit both accounts. The $10 total cost ($5 each) is far cheaper than any advertising.

### Farmers Markets & Community Events

Farmers markets are underrated for sharpening businesses. Here''s why:

- **Captive audience** of food-oriented people
- You can sharpen live and draw a crowd
- Collect phone numbers for follow-up
- Build brand awareness in your local community

A basic farmers market setup:
- Folding table
- Belt grinder (battery-powered or generator)
- Sign with pricing
- Business cards
- A few knives at various stages to show and tell

Market booth fees are typically $25–$75 per day. If you sharpen 10 knives at $10 each, you''ve covered the fee and made contacts.

### Community Events

Other opportunities:
- **Kitchen store demos** — offer free sharpening days at a local kitchen store
- **Neighbourhood Facebook groups** — post an offer, these groups love local services
- **Strata/HOA newsletters** — reach entire buildings at once
- **School fundraisers** — donate a "free sharpening" package to an auction

> **Key insight:** Referral marketing has zero cost and infinite trust. A recommendation from a friend is worth more than any ad. Make every knife you sharpen a walking advertisement for your business.', 4);

-- Module 4 Quiz
INSERT INTO public.module_quizzes (id, module_id, questions, xp_reward) VALUES (
  'd3b2c3d4-0004-4000-8000-000000000001',
  'b3b2c3d4-0004-4000-8000-000000000001',
  '[
    {"id": "m4q1", "question": "What is the single most important free marketing tool for a local knife sharpening business?", "options": ["Instagram ads", "Google Business Profile", "A YouTube channel", "A printed flyer campaign"], "correct": 1},
    {"id": "m4q2", "question": "You want to land a new restaurant account. What''s the most effective first step?", "options": ["Send them a cold email with your price list", "Call during dinner rush and ask for the chef", "Walk in during off-hours and offer to sharpen 2–3 knives for free as a trial", "Post on their Google reviews asking for their business"], "correct": 2},
    {"id": "m4q3", "question": "Why are service area pages (e.g., /knife-sharpening-burnaby) important for your website?", "options": ["They look impressive to investors", "They rank for hyper-local searches that your Google Business Profile alone might miss", "Google requires them for verification", "They replace the need for a Google Business Profile"], "correct": 1},
    {"id": "m4q4", "question": "What makes a referral program effective for a residential sharpening business?", "options": ["Offering 50% discounts to both parties", "Giving the referrer $5 off and the new customer $5 off their first order", "Requiring 10 referrals before any discount kicks in", "Only rewarding the referrer, not the new customer"], "correct": 1},
    {"id": "m4q5", "question": "A farmer''s market booth costs $50/day. How many knives at $10 each do you need to sharpen just to cover the booth fee?", "options": ["3", "5", "10", "15"], "correct": 1}
  ]'::jsonb,
  25
);

-- ============================================================
-- MODULE 5: Day-to-Day Operations
-- ============================================================
INSERT INTO public.modules (id, course_id, title, slug, description, "order")
VALUES (
  'b3b2c3d4-0005-4000-8000-000000000001',
  'a1b2c3d4-0003-4000-8000-000000000001',
  'Day-to-Day Operations',
  'day-to-day-operations',
  'The daily workflow, customer tracking, and hard-won lessons from running the business day in and day out.',
  5
);

INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, "order") VALUES
('c3000001-0005-4000-8000-000000000001', 'b3b2c3d4-0005-4000-8000-000000000001', 'The Daily Workflow', 'the-daily-workflow', 'text',
'## The Daily Workflow

Running a one-person sharpening business means wearing every hat — technician, driver, accountant, customer service. The key to not burning out is having a predictable daily routine.

### Morning: Check and Intake (30 min)

Start every day the same way:

1. **Check your calendar** — confirm today''s mobile appointments
2. **Check the drop box** — collect overnight and early-morning drop-offs
3. **Process intake** — tag each set, log in your tracking system, sort by priority
4. **Check SMS inbox** — respond to any overnight messages that need a human reply
5. **Review invoices** — follow up on anything unpaid from yesterday

This takes 20–30 minutes and sets up your entire day.

### Afternoon: Sharpen and Drive (4–6 hours)

This is where the money is made. Depending on the day:

**Mobile day:**
- Load the van with supplies
- Drive to appointments (2–4 per day)
- Sharpen on-site, collect payment, leave business cards
- Drive home

**Batch day:**
- Sharpen all drop-off sets at your bench
- Work through the queue in order received
- Wrap and label finished sets for pickup/delivery

A typical batch session:

| Task | Time |
|------|------|
| 6 residential sets (~30 knives) | 2 hours |
| 1 restaurant set (~20 knives) | 45 min |
| Scissors and specialty items | 30 min |
| **Total** | **~3.5 hours** |

### Evening: Admin and Notify (30–45 min)

1. **Send invoices** for completed jobs
2. **Notify customers** that their knives are ready for pickup
3. **Update your tracking system** — mark jobs complete, note any issues
4. **Schedule next-day appointments** — send confirmations
5. **Post to Google Business Profile** — a photo, a tip, or a completed job

### The Rhythm

The goal is to batch similar tasks together:
- Admin in the morning and evening
- Sharpening and driving in the middle
- Never mix admin and sharpening time — context switching kills productivity

> **Key insight:** The daily workflow isn''t glamorous, but it''s the engine. Do the boring things consistently and the business runs itself. Skip them and everything falls apart.', 1),

('c3000001-0005-4000-8000-000000000002', 'b3b2c3d4-0005-4000-8000-000000000001', 'Tracking Customers & Jobs', 'tracking-customers-and-jobs', 'text',
'## Tracking Customers & Jobs

You need to know who your customers are, what you''ve sharpened for them, when they last came in, and when they''re likely to need you again. You can start simple, but you need *something* from day one.

### Start with a Spreadsheet

A Google Sheet with these columns gets you through your first 100 customers:

| Column | Example |
|--------|---------|
| Name | Jane Doe |
| Phone | 604-555-1234 |
| Email | jane@email.com |
| Address | 123 Main St, North Van |
| Service type | Drop-off |
| Date | 2024-05-15 |
| Items | 5 chef knives, 1 scissors |
| Total | $58 |
| Payment status | Paid — Stripe |
| Notes | Prefers text. Has a Shun she loves. |

### What to Track

Beyond the basics, these fields pay dividends:

- **Service history** — what you sharpened and when. This lets you follow up: "Hey Jane, it''s been 3 months since your last sharpening — ready for a touch-up?"
- **Knife details** — if they have a special knife (Japanese, carbon steel, sentimental), note it. Remembering details builds loyalty.
- **Communication preference** — text vs. email vs. phone
- **Follow-up date** — set a reminder for 2–3 months out

### Follow-Up Scheduling

Most residential customers need sharpening every 2–4 months. Set a follow-up schedule:

1. After completing a job, set a reminder for 3 months out
2. When the reminder fires, send a text: "Hey [Name], it''s been a few months — are your knives ready for a tune-up? Book at coveblades.com or drop them at the box anytime."
3. Track who rebooks and who doesn''t — adjust your follow-up timing

### When to Upgrade to a Real System

You''ll outgrow a spreadsheet when:
- You have 200+ customers
- You''re spending more than 15 minutes a day on admin
- You need automated follow-ups
- You want to track revenue trends and customer lifetime value

At that point, consider a database-backed system (like a Supabase-powered admin panel) or a lightweight CRM. But don''t over-engineer it at the start — a spreadsheet you actually use beats a CRM you never open.

> **Key insight:** The customer record isn''t just for tracking jobs. It''s a relationship tool. The sharpener who remembers your Shun and texts you at the right time earns a customer for life.', 2),

('c3000001-0005-4000-8000-000000000003', 'b3b2c3d4-0005-4000-8000-000000000001', 'Common Mistakes & Lessons Learned', 'common-mistakes-and-lessons-learned', 'text',
'## Common Mistakes & Lessons Learned

I''ve made every mistake on this list. Here they are so you don''t have to.

### 1. Underpricing

**The mistake:** Charging $5/knife because you''re new and feel guilty charging more.

**The reality:** At $5/knife, you need to sharpen 100 knives a week just to make $500. At $10/knife, you need 50. The customers who balk at $10 are not the customers you want — they''ll also be the ones who complain the most and refer the least.

**The fix:** Price based on value, not your confidence level. A sharp knife saves the customer 30 minutes of frustration every day for 3 months. That''s worth $10.

### 2. Over-Committing on Turnaround

**The mistake:** Promising same-day turnaround on everything because you want to impress.

**The reality:** One busy day and you''re breaking promises. Broken promises kill trust faster than slow turnaround ever could.

**The fix:** Promise 24 hours, deliver in 12. Promise 48 hours for large orders. Under-promise, over-deliver.

### 3. Not Collecting Payment Upfront

**The mistake:** Sharpening a restaurant''s 40 knives on a handshake, then chasing the invoice for 3 weeks.

**The reality:** Some people are slow to pay. Some never pay. You''re a sharpener, not a debt collector.

**The fix:** For residential: collect at time of service (mobile) or before notifying for pickup (drop-off). For restaurants: establish payment terms upfront (net 7, auto-charge on file, or e-Transfer within 48 hours of return).

### 4. Trying to Serve Too Large an Area Too Early

**The mistake:** Advertising across the entire metro area because more coverage = more customers, right?

**The reality:** You drive 45 minutes to a $50 appointment, and 45 minutes back. That''s 90 minutes of unpaid time for $50 of revenue. Your effective hourly rate just dropped below minimum wage.

**The fix:** Start with a tight service area — maybe 20 minutes max from your home. Expand only when you''ve saturated demand in your core zone.

### 5. Ignoring the Admin Side

**The mistake:** Spending all your time sharpening and none on marketing, follow-ups, or bookkeeping.

**The reality:** The best sharpener in the city will fail if nobody knows they exist or they can''t manage their finances.

**The fix:** Dedicate 30 minutes every morning and evening to admin. It''s not optional — it''s half the job.

### The Master Lesson

Every one of these mistakes comes from the same root: optimizing for short-term revenue instead of long-term sustainability.

- Underpricing feels safe but caps your growth
- Over-committing feels customer-friendly but breaks trust
- Skipping payment collection feels polite but creates resentment
- Serving too wide an area feels ambitious but wastes time
- Ignoring admin feels productive but hollows out the business

> **Key insight:** A sustainable sharpening business is built on systems, not hustle. Get the systems right — pricing, boundaries, payment, geography, admin — and the hustle becomes optional.', 3);

-- Module 5 Quiz
INSERT INTO public.module_quizzes (id, module_id, questions, xp_reward) VALUES (
  'd3b2c3d4-0005-4000-8000-000000000001',
  'b3b2c3d4-0005-4000-8000-000000000001',
  '[
    {"id": "m5q1", "question": "What should you do first thing every morning?", "options": ["Start sharpening immediately to maximize output", "Check your calendar, collect drop-offs, process intake, and review messages", "Post on social media", "Drive to your first mobile appointment"], "correct": 1},
    {"id": "m5q2", "question": "At what point should you upgrade from a spreadsheet to a database-backed customer tracking system?", "options": ["Immediately — spreadsheets are unprofessional", "When you have 200+ customers and spend more than 15 minutes daily on admin", "Only when you hire your first employee", "Never — spreadsheets are always sufficient"], "correct": 1},
    {"id": "m5q3", "question": "You''re new and nervous about pricing. A neighbor asks what you charge. What should you do?", "options": ["Offer to sharpen their knives for free since they''re a neighbor", "Charge $5/knife to stay competitive", "Charge your standard rate ($8–$12/knife) based on the value you deliver", "Tell them you''re still figuring out pricing and get back to them"], "correct": 2},
    {"id": "m5q4", "question": "A restaurant wants you to sharpen 40 knives with no deposit and payment ''whenever they get around to it.'' How do you handle this?", "options": ["Agree — restaurants are high-value accounts worth the risk", "Establish payment terms upfront: net 7 days, e-Transfer or card on file", "Refuse the account entirely", "Sharpen the knives and hope for the best"], "correct": 1},
    {"id": "m5q5", "question": "You''re getting requests from customers 45 minutes away. What''s the right move?", "options": ["Accept every appointment to maximize revenue", "Decline all requests outside your current zone", "Keep your core area tight and expand only after saturating local demand, or suggest your drop-off option", "Raise your prices by 50% for far-away customers"], "correct": 2}
  ]'::jsonb,
  25
);
