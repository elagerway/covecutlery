# Invoice System Plan

## Overview
Invoice creation and management system for Cove Cutlery's mobile sharpening service clients. Allows creating, sending (email + SMS), and collecting payment via Stripe or Interac e-Transfer.

## Decisions

| Detail | Decision |
|---|---|
| Numbering | `YYYYMMDD-NNN` (date + daily increment) |
| Line items | Tied to mobile pricing: $12/knife + specialty items |
| Tax | None for now |
| Recurring | No |
| Linking | Standalone (clients from mobile bookings) |
| Payment | Stripe card + Interac e-Transfer to `pay@covecutlery.ca` |
| Delivery | Email (Postmark) + SMS (Magpipe) |
| Statuses | Draft → Sent → Paid / Overdue |

## Line Item Pricing (Mobile)

| Item | Price |
|---|---|
| Knife | $12 |
| Lawnmower blade | $15 |
| Machete | $15 |
| Shears / scissors | $12 |
| Serrated knife | $12 |
| Ceramic knife | $15 |
| Axe / hatchet | $15 |

## Database: `invoices` Table

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| invoice_number | text | Unique, format `YYYYMMDD-NNN` |
| client_name | text | |
| client_email | text | |
| client_phone | text | |
| client_address | text | Nullable |
| line_items | jsonb | `[{ description, quantity, unit_price, total }]` |
| subtotal | numeric | Calculated from line items |
| notes | text | Nullable, free-form notes |
| status | text | `draft`, `sent`, `viewed`, `paid`, `overdue` |
| payment_method | text | Nullable — `stripe`, `etransfer` |
| due_date | date | |
| sent_at | timestamptz | Nullable |
| paid_at | timestamptz | Nullable |
| stripe_session_id | text | Nullable |
| stripe_payment_intent_id | text | Nullable |
| created_at | timestamptz | Default now() |

## Admin Pages

### `/admin/invoices` — Invoice List
- Table showing all invoices sorted by date (newest first)
- Columns: invoice #, client name, amount, status, due date, created
- Filter by status (all, draft, sent, paid, overdue)
- "New Invoice" button

### `/admin/invoices/new` — Create Invoice
- Client info: name, email, phone, address (optional)
- Line items: dropdown for item type (pre-filled price), quantity, add/remove rows
- Auto-calculated subtotal
- Due date picker (default: 14 days)
- Notes field
- "Save as Draft" and "Save & Send" buttons

### `/admin/invoices/[id]` — Invoice Detail
- View full invoice
- Edit (if draft)
- Send / resend via email and/or SMS
- Mark as paid (for e-Transfer payments)
- Status badge

## Public Pages

### `/invoice/[id]` — Client Invoice View
- Clean, branded invoice display (Cove Cutlery logo, dark theme)
- Invoice details: number, date, due date, line items, total
- Two payment options:
  - **Pay with Card** — Stripe checkout button
  - **Pay via e-Transfer** — shows instructions: send to `pay@covecutlery.ca`, include invoice number in message
- Status updates to `viewed` on first visit

## API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/admin/invoices` | GET | List invoices (with status filter) |
| `/api/admin/invoices` | POST | Create invoice |
| `/api/admin/invoices/[id]` | GET | Get invoice detail |
| `/api/admin/invoices/[id]` | PUT | Update invoice |
| `/api/admin/invoices/[id]/send` | POST | Send via email + SMS |
| `/api/admin/invoices/[id]/mark-paid` | POST | Mark as paid (e-Transfer) |
| `/api/invoices/[id]` | GET | Public invoice data |
| `/api/invoices/[id]/pay` | POST | Create Stripe checkout for invoice |
| `/api/stripe/webhook` | POST | Handle invoice payment completion (extend existing) |

## Email Template (Postmark)
- Branded HTML email with Cove Cutlery header
- Invoice summary: number, date, line items, total
- "View & Pay Invoice" button linking to `/invoice/[id]`
- Payment instructions for e-Transfer as fallback

## SMS (Magpipe)
- Short message: "Hi {name}, your Cove Cutlery invoice #{number} for ${total} is ready. View & pay: {link}"

## Build Sequence

1. Create `invoices` table in Supabase
2. API routes (CRUD + send + mark-paid)
3. Admin invoice list page
4. Admin create invoice page
5. Admin invoice detail page
6. Public invoice view page
7. Stripe payment flow for invoices
8. Email template + send via Postmark
9. SMS send via Magpipe
10. Add "Invoices" link to admin nav
