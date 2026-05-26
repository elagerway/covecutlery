# Postmark Inbound + SiteGround Email Setup

One-time setup so `info@`, `erik@`, and `training@coveblades.com` flow into `/admin/email`. ~15 minutes of UI clicking, then it runs forever.

## Step 1 — Get your Postmark inbound hash (Postmark UI)

1. Postmark → your **Server** for Cove Blades → **Inbound** tab
2. If no inbound stream exists, click **Add inbound stream**
3. Copy the **Inbound email address** — looks like `abcdef1234567890@inbound.postmarkapp.com`
4. Under **Inbound webhook**, set the URL to:
   ```
   https://coveblades.com/api/webhooks/postmark/inbound
   ```
5. Save. Postmark will POST to that URL whenever email lands at the hash address above.
6. Optional but recommended: enable **"Include raw email content"** is off (we don't need it), keep **"Strip signatures and reply quotes"** on (gives us `StrippedTextReply`).

## Step 2 — Create training@coveblades.com (SiteGround UI)

1. SiteGround → Site Tools for `coveblades.com` → **Email** → **Accounts**
2. **Create Account**:
   - Account: `training`
   - Password: anything (you'll never log in to it directly; mail just lands and forwards)
3. Save.

## Step 3 — Forward all three addresses to Postmark (SiteGround UI)

For each of `info@`, `erik@`, and `training@`:

1. SiteGround → Email → **Forwarders** → **Create Forwarder**
2. Email: `info` (or `erik`, or `training`)
3. Forward to: paste the Postmark inbound hash from Step 1 (e.g. `abcdef1234567890@inbound.postmarkapp.com`)
4. **Keep a copy in the inbox**: check this option if SiteGround offers it (some versions do, some don't). If it doesn't, set up the forwarder anyway — the email is also archived in Postmark's inbound activity log for 45 days.
5. Save.

Repeat for the other two addresses.

## Step 4 — Test it

1. From your phone or any external email account, send a test message to `training@coveblades.com`
2. Within ~10–30 seconds, you should see:
   - The email show up in `/admin/email` under the training@ filter
   - An **auto-reply** arrive at the sending address with subject "Re: <your subject>"
3. Click the conversation in /admin/email → you'll see both the inbound and the auto-reply in the thread, with the auto-reply tagged "Auto-reply" in gold.
4. Reply via the composer — that reply will land in the original sender's inbox, sent through Postmark from `training@coveblades.com`.
5. Repeat with `info@` and `erik@` to confirm those forwarders work (no auto-reply will fire — only training@ triggers one).

## Editing the auto-reply

The training@ auto-reply template lives in `src/lib/email.ts` (`buildTrainingAutoReply`). Edit the text/HTML strings, push, deploy. Takes effect on the next inbound message.

## Future hardening (not blocking)

- **Webhook auth**: Postmark supports basic auth on the inbound webhook URL. The current setup is open — anyone who discovers the URL can POST fake emails into your DB. Low risk for a small business but worth adding if you ever start storing sensitive things. Add `Authorization: Basic <base64>` to the webhook config in Postmark and check it in `route.ts`.
- **Mailbox-copy retention**: if SiteGround forwarders don't keep a local copy and you want one, add a Postmark **Outbound webhook** that BCCs `archive@coveblades.com` (or similar) on every send, and configure SiteGround to keep that account's mailbox local.
- **Auto-replies for info@ / erik@**: easy to add — register more templates in `src/lib/email.ts` and a check in `/api/webhooks/postmark/inbound/route.ts`.
