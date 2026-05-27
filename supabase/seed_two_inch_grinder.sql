-- Seed: Two-Inch Grinder Module
-- Cove Blades Training Course — Intermediate

-- Course
INSERT INTO public.courses (id, title, slug, description, thumbnail_url, is_free, price, "order", active, level)
VALUES (
  'a1b2c3d4-0002-4000-8000-000000000001',
  'Two-Inch Grinder Module',
  'two-inch-grinder',
  'Step up to the wider belt platform — handle larger blades, move through higher volumes, and add thinning and polishing to your service. Covers machine setup, belt progression, heat management, Airplaten radius platen thinning, and commercial workflow.',
  NULL,
  false,
  400.00,
  2,
  true,
  'intermediate'
);

-- ============================================================
-- MODULE 1: Machine Setup & Belt Platform
-- ============================================================
INSERT INTO public.modules (id, course_id, title, slug, description, "order")
VALUES (
  'b2b2c3d4-0001-4000-8000-000000000001',
  'a1b2c3d4-0002-4000-8000-000000000001',
  'Machine Setup & Belt Platform',
  'machine-setup-belt-platform',
  'Understand the 2x72 platform, platen types, belt tracking, and variable speed control.',
  1
);

INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, "order") VALUES
('c2000001-0001-4000-8000-000000000001', 'b2b2c3d4-0001-4000-8000-000000000001', 'The 2x72 Platform', 'the-2x72-platform', 'text',
'## The 2x72 Platform

The 2x72 belt grinder is the industry standard for knife sharpening, and for good reason. The numbers tell you everything: a **2-inch wide belt** running on a **72-inch loop**. Once you understand why those dimensions matter, you''ll see why every serious sharpening shop runs one.

### Why 2x72 Dominates

The 1x30 you learned on in Level 1 is a great training tool, but it has limits. Here''s what changes when you step up:

| Feature | 1x30 | 2x72 |
|---------|------|------|
| Belt width | 1 inch | 2 inches |
| Belt length | 30 inches | 72 inches |
| Abrasive surface area | 30 sq in | 144 sq in |
| Motor (typical) | 1/6 – 1/3 HP | 1.5 – 2 HP |
| Speed control | Usually fixed | VFD variable |
| Belt life | Short | 4–5x longer |

The wider belt gives you more contact area, which means more consistent grinds and longer belt life. A 72-inch loop has nearly **five times** the abrasive surface of a 30-inch belt, so each section of grit stays cooler and lasts longer.

### Motor Sizing

A reliable rule of thumb: **~1 HP per inch of belt width**. A 2-inch grinder wants at least 1.5 HP, and 2 HP is the sweet spot. Under-powering a 2x72 leads to belt stalling under load, inconsistent speed, and frustration.

### The Commercial Advantage

At volume — say 30+ knives per day — the 1x30 becomes a bottleneck. The 2x72 lets you:
- Sharpen larger blades (cleavers, 10-inch chef knives) without running off the belt edge
- Move through belt progressions faster with more surface area doing work
- Run all day without the motor overheating

> **Key insight:** The 2x72 isn''t just "bigger." It''s a different class of machine that unlocks thinning, polishing, and volume work that simply isn''t practical on a narrow belt.', 1),

('c2000001-0001-4000-8000-000000000002', 'b2b2c3d4-0001-4000-8000-000000000001', 'Platen Types', 'platen-types', 'text',
'## Platen Types

The platen is the surface behind the belt where your blade makes contact. Different platens produce different edge geometries, and choosing the right one is half the battle.

### Flat Platen

The workhorse. A flat platen is a rigid, flat surface (usually steel or aluminum) mounted behind the belt. When you press a blade against a flat platen, you get a **flat bevel** — the most common geometry for kitchen knife sharpening.

Use a flat platen when:
- Sharpening kitchen knives (your bread and butter)
- You want a predictable, repeatable bevel angle
- Reprofiling an edge from scratch

### Contact Wheel

A contact wheel is a rubber or serrated wheel that the belt wraps around. It produces a **hollow grind** — a concave bevel. The smaller the wheel diameter, the more pronounced the hollow.

Use a contact wheel when:
- Sharpening straight razors (small-diameter wheel)
- Working on tools that benefit from a thin, keen edge
- You need aggressive material removal (large serrated wheel)

> **Note:** Contact wheels are less common in commercial knife sharpening. Most of your work will be on the flat platen.

### Radius Platen (Convex)

A radius platen has a curved surface that produces a **convex bevel**. This is the geometry behind the "Convex Edge" you may have heard about. The Airplaten is the gold standard here — we''ll cover it in depth in Module 5.

Use a radius platen when:
- Thinning behind the edge
- Creating convex edges on outdoor and heavy-use knives
- You want maximum edge strength with minimal thickness

### Quick Reference

| Platen Type | Bevel Geometry | Primary Use |
|-------------|---------------|-------------|
| Flat | Flat / V-grind | Kitchen knives, general sharpening |
| Contact wheel | Hollow / concave | Razors, aggressive removal |
| Radius / convex | Convex | Thinning, heavy-use knives |

### Practical Tip

Start every new knife on the **flat platen**. It''s the most forgiving and predictable surface. Only move to a contact wheel or radius platen when you have a specific reason to change the geometry.', 2),

('c2000001-0001-4000-8000-000000000003', 'b2b2c3d4-0001-4000-8000-000000000001', 'Belt Tracking & Tension', 'belt-tracking-and-tension', 'text',
'## Belt Tracking & Tension

On a 2x72, belt tracking and tension are more critical than on the 1x30. A wider belt that wanders even slightly will produce uneven bevels and can throw the belt entirely.

### How Tracking Works

Most 2x72 grinders use a **spring-loaded tracking mechanism** on the idler wheel (the top, unpowered wheel). A knob or lever adjusts the tilt of the idler, nudging the belt left or right.

Steps to track a belt:
1. Install the belt with the grinder **off**
2. Spin the drive wheel by hand to check initial tracking
3. Turn the grinder on at **low speed**
4. Adjust the tracking knob in small increments — the belt should run centered
5. Once centered, increase to working speed and verify

### Tension

Proper tension is a balancing act:

- **Too loose:** The belt slips under load, wanders, and can jump off the wheels. You''ll hear a rhythmic slapping sound.
- **Too tight:** Excess friction generates heat, wears belts faster, kills motor bearings, and removes the "feel" you need for finesse work.
- **Just right:** The belt is snug, tracks true, and has a slight give when you press your thumb against it between the wheels.

Most grinders use a spring or pneumatic tensioning system. Set it once and it maintains pressure as belts stretch slightly during use.

### Belt Installation

Always check the **directional arrow** on the back of the belt. Belts are designed to run in one direction — running them backward dramatically shortens their life and can cause the abrasive layer to peel.

### Tracking Tips

- Re-check tracking every time you change belts — each belt tracks slightly differently
- Ceramic belts are stiffer and may need more tension than aluminum oxide
- If a belt won''t track no matter what, it may be defective (bad splice) — replace it
- A belt that squeals is usually too loose, not too tight

> **Warning:** Never adjust tracking while holding a blade against the belt. Make your adjustment, step back, observe, then resume work.', 3),

('c2000001-0001-4000-8000-000000000004', 'b2b2c3d4-0001-4000-8000-000000000001', 'Variable Speed Control', 'variable-speed-control', 'text',
'## Variable Speed Control

In Level 1, you worked with a fixed-speed 1x30. On the 2x72, a **Variable Frequency Drive (VFD)** gives you full control over belt speed — and that control changes everything.

### Why VFD is Essential

Different stages of sharpening need different belt speeds. Running a strop belt at full speed is like trying to parallel park at highway speed — you''ll overshoot every time.

### Surface Feet Per Minute (SFPM)

Belt speed is measured in SFPM — the number of feet of belt that pass a point in one minute. This is the number that actually matters, not RPM (which varies with wheel diameter).

### Speed Ranges by Stage

| Stage | SFPM Range | Purpose |
|-------|-----------|---------|
| Coarse grinding (60–120 grit) | 4,000–5,300 | Aggressive material removal |
| Mid-grit shaping (220 grit) | 3,500–4,500 | Bevel refinement |
| Fine finishing (Trizact) | 2,500–3,500 | Scratch pattern refinement |
| Stropping (leather belt) | Under 100 | Final polish, burr removal |

### The Stropping Speed Rule

This is critical: leather strop belts **must** run at very low speed — under 100 SFPM. At higher speeds:
- The leather heats up and glazes over
- Compound flings off
- You round the apex instead of polishing it
- The belt can grab the blade dangerously

A VFD lets you dial down to a crawl for stropping, then spin back up for the next knife''s coarse work.

### Practical Speed Selection

When in doubt, start slower and increase if you need more cut. It''s always easier to add speed than to undo heat damage.

A good habit: **reduce speed as grits get finer**. Coarse belts can handle high speed because they cut aggressively and don''t dwell. Fine belts dwell longer per pass, generating more heat at the apex — lower speed compensates.

> **Key insight:** A 2x72 without a VFD is like a car without brakes. You can make it work, but you''re fighting the machine instead of using it.', 4);

-- Module 1 Quiz
INSERT INTO public.module_quizzes (id, module_id, questions, xp_reward) VALUES (
  'd2b2c3d4-0001-4000-8000-000000000001',
  'b2b2c3d4-0001-4000-8000-000000000001',
  '[
    {"id": "m1q1", "question": "What is the approximate abrasive surface area of a 2x72 belt?", "options": ["30 square inches", "72 square inches", "144 square inches", "216 square inches"], "correct": 2},
    {"id": "m1q2", "question": "Which platen type produces a flat bevel and is best for everyday kitchen knife sharpening?", "options": ["Contact wheel", "Radius platen", "Flat platen", "Slack belt (no platen)"], "correct": 2},
    {"id": "m1q3", "question": "A belt that squeals during operation is most likely:", "options": ["Too tight", "Too loose", "Installed backward", "Worn out"], "correct": 1},
    {"id": "m1q4", "question": "What speed should a leather strop belt run at?", "options": ["3,500–5,000 SFPM", "1,000–2,000 SFPM", "500–1,000 SFPM", "Under 100 SFPM"], "correct": 3},
    {"id": "m1q5", "question": "What is the recommended motor sizing rule for a 2x72 grinder?", "options": ["1/2 HP per inch of belt width", "~1 HP per inch of belt width", "2 HP per inch of belt width", "Motor size doesn''t matter with a VFD"], "correct": 1}
  ]'::jsonb,
  25
);

-- ============================================================
-- MODULE 2: Abrasives & Belt Progression
-- ============================================================
INSERT INTO public.modules (id, course_id, title, slug, description, "order")
VALUES (
  'b2b2c3d4-0002-4000-8000-000000000001',
  'a1b2c3d4-0002-4000-8000-000000000001',
  'Abrasives & Belt Progression',
  'abrasives-belt-progression',
  'Learn abrasive materials, the service sharpening progression, and when to skip steps.',
  2
);

INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, "order") VALUES
('c2000001-0002-4000-8000-000000000001', 'b2b2c3d4-0002-4000-8000-000000000001', 'Abrasive Materials', 'abrasive-materials', 'text',
'## Abrasive Materials

Not all belts are created equal. The abrasive material on the belt determines how it cuts, how long it lasts, and which steels it handles best. Understanding your options lets you pick the right belt for the job instead of guessing.

### Ceramic Alumina

Ceramic is the **hardest-cutting conventional abrasive** you''ll use. Ceramic belts are self-sharpening — as the abrasive grains wear, they fracture to expose fresh cutting edges rather than rounding over.

- **Best for:** Hard steels (VG-10, SG2, S30V), coarse work (36–120 grit), reprofiling
- **Character:** Aggressive, long-lasting, runs cool for its cut rate
- **Cost:** Premium — but the lifespan justifies it
- **Common brand:** 3M Cubitron II

### Zirconia Alumina

Zirconia sits in the middle ground — tougher than aluminum oxide, less aggressive than ceramic. It''s a solid workhorse for mid-range grits.

- **Best for:** General-purpose grinding, moderate steels, production work
- **Character:** Good cut rate, self-sharpening to a degree, durable
- **Cost:** Mid-range
- **Common use:** 36–120 grit production belts

### Aluminum Oxide (A/O)

The classic abrasive. Aluminum oxide is the most common and most affordable belt material. It doesn''t self-sharpen — grains round over with use — but for fine grits, that''s actually a feature, not a bug.

- **Best for:** Fine grit work (220+), softer steels, finishing
- **Character:** Predictable, smooth cut, affordable
- **Cost:** Budget-friendly
- **Common use:** 220–400 grit bevel refinement

### Silicon Carbide

Silicon carbide is sharper than aluminum oxide but more brittle. It excels on stainless steels and non-ferrous metals.

- **Best for:** Stainless steel, non-ferrous metals, wet grinding
- **Character:** Very sharp initial cut, breaks down faster
- **Cost:** Moderate

### Quick Comparison

| Material | Cut Rate | Lifespan | Best Application |
|----------|----------|----------|-----------------|
| Ceramic | Highest | Longest | Hard steels, coarse grits |
| Zirconia | High | Long | Production grinding |
| Aluminum oxide | Moderate | Moderate | Fine grits, finishing |
| Silicon carbide | High (initially) | Shorter | Stainless, non-ferrous |

> **Practical rule:** Use ceramic for the heavy lifting, aluminum oxide for the refinement, and Trizact for the finish. That covers 95% of sharpening work.', 1),

('c2000001-0002-4000-8000-000000000002', 'b2b2c3d4-0002-4000-8000-000000000001', 'The Service Sharpening Progression', 'service-sharpening-progression', 'text',
'## The Service Sharpening Progression

In a commercial sharpening operation, you need a belt progression that''s fast, repeatable, and produces a working edge every time. This is the **80/20 approach** — 80% of the result from 20% of the effort.

### The Four-Step Progression

1. **120 grit ceramic** — Establish the bevel
2. **220 grit aluminum oxide** — Refine the scratch pattern
3. **Trizact A30** — Polish to a near-mirror finish
4. **Leather strop belt** — Remove the burr and polish the apex

That''s it. Four belts, four steps, and you have a knife that will outperform 99% of what customers are used to.

### Why This Works

Each step has a specific job:

**Step 1 — 120 Ceramic:** This is where you do the real work. You''re either establishing a new bevel angle or refreshing an existing one. The ceramic cuts fast and cool, so you spend less time here than you''d think — usually 4–8 passes per side for a maintenance sharpen.

**Step 2 — 220 A/O:** You''re not removing much material here. The job is to refine the scratch pattern left by the 120. The 220 replaces the deep 120 scratches with finer, shallower ones. Usually 3–5 passes per side.

**Step 3 — Trizact A30:** This is where the magic happens. Trizact''s structured abrasive leaves an incredibly uniform finish. The A30 (roughly equivalent to 800 grit) takes the 220 scratch pattern and turns it into a polished, refined bevel. 2–4 passes per side.

**Step 4 — Leather Strop:** Running at dead-slow speed (under 100 SFPM), the strop removes any remaining burr and polishes the apex. Edge-trailing only. 3–5 light passes per side.

### Total Time

For a standard kitchen knife in reasonable condition: **60–90 seconds**. That''s the target. If you''re consistently taking longer, you''re either pressing too hard, using dull belts, or not letting the abrasives do their work.

### The 80/20 Principle

Could you add more steps? Sure. You could go 120 → 220 → 400 → 600 → Trizact A30 → A16 → A6 → strop. But each additional step adds time with diminishing returns. For commercial work, the four-step progression delivers an excellent edge in minimum time.

> **Key insight:** A four-step edge done well beats an eight-step edge done in a hurry. Master these four before adding complexity.', 2),

('c2000001-0002-4000-8000-000000000003', 'b2b2c3d4-0002-4000-8000-000000000001', 'Trizact Structured Abrasives', 'trizact-structured-abrasives', 'text',
'## Trizact Structured Abrasives

Trizact belts are a game-changer for sharpening. If you haven''t used them before, prepare to be impressed.

### What Makes Trizact Different

Conventional belts have abrasive grains bonded randomly to a backing. As they wear, the surface becomes uneven — some spots cut aggressively while others are nearly smooth.

Trizact uses **precision-shaped micro-pyramids** of abrasive material arranged in a uniform pattern. As each pyramid wears down, it exposes a fresh layer of abrasive underneath. The result: **consistent cut rate from start to finish**.

### The Trizact Range

| Designation | Approx. Grit Equivalent | Use |
|-------------|------------------------|-----|
| A160 | ~120 grit | Coarse shaping (rarely used for sharpening) |
| A100 | ~180 grit | Moderate material removal |
| A65 | ~280 grit | Bevel refinement |
| A45 | ~400 grit | Fine refinement |
| A30 | ~800 grit | Polish — your primary finishing belt |
| A16 | ~1,200 grit | High polish |
| A6 | ~2,500 grit | Near-mirror finish |

### Why Trizact Runs Cooler

The pyramid structure means less surface area is in contact with the blade at any given moment. Less contact area = less friction = less heat. This is a significant advantage on thin edges where heat damage is always a risk.

### Trizact in Your Progression

For commercial sharpening, **A30 is the sweet spot**. It delivers a polished, refined edge that customers notice immediately. Going finer (A16, A6) is optional — it''s for premium work or personal satisfaction.

### Wear Pattern

Trizact belts wear **predictably**. A fresh A30 cuts more aggressively than a broken-in one. After 10–15 knives, the belt settles into its working sweet spot. Don''t judge a Trizact belt by its first few uses — it gets better.

### Cost vs. Value

Trizact belts cost more per belt than conventional abrasives. But they last significantly longer and produce more consistent results. Per-knife cost is often **lower** than cheap belts that wear out in a fraction of the time.

> **Tip:** Keep a dedicated A30 belt for sharpening and a separate one for thinning work. Thinning wears belts faster due to the larger contact area.', 3),

('c2000001-0002-4000-8000-000000000004', 'b2b2c3d4-0002-4000-8000-000000000001', 'When to Skip vs Full Progression', 'when-to-skip-vs-full-progression', 'text',
'## When to Skip vs Full Progression

Not every knife needs the full four-step treatment. Knowing when to skip steps is what separates a fast commercial sharpener from someone who over-processes every blade.

### The 60-Second Refresh

A knife that''s been maintained regularly — used for a few weeks in a kitchen, no chips, no damage — often just needs:

1. **A few passes on 220 A/O** to re-establish the apex
2. **A30 Trizact** to polish
3. **Strop** to finish

Skip the 120 entirely. The existing bevel geometry is fine; you''re just refreshing the apex. Total time: **under 60 seconds**.

### The Full Reprofile

A knife that''s been neglected, damaged, or needs an angle change requires the full treatment:

1. **120 ceramic** — Remove enough material to establish a new bevel
2. **220 A/O** — Refine
3. **A30 Trizact** — Polish
4. **Strop** — Finish

This takes longer — 2–3 minutes for moderate damage, 5+ minutes for major reprofiling. Charge accordingly.

### Decision Framework

Ask yourself these questions when you pick up a knife:

1. **Is there visible damage?** (chips, rolls, flat spots) → Start at 120
2. **Does the Sharpie test show the existing bevel is even?** → You can skip 120
3. **Is the edge just slightly dull with no damage?** → Start at 220 or even A30
4. **Is it a re-sharpen from your last visit?** → Probably 220 → strop

### Reading the Edge

Before you touch a belt, always **inspect the edge under a bright light**:

- **Light reflects evenly along the edge:** Rolled or mushroomed — may only need 220+
- **Bright spots or glints at specific points:** Chips or flat spots — needs 120
- **No visible reflection:** Already reasonably sharp — quick strop may suffice
- **Visible nicks or missing sections:** Significant damage — full reprofile from 120

### The Business Angle

Time is money in commercial sharpening. If you spend 3 minutes on every knife regardless of condition, you''re leaving profit on the table. A quick assessment saves you 60+ seconds per knife — at 40 knives per day, that''s 40 minutes of your life back.

> **Warning:** Don''t skip steps to save time at the expense of quality. If the scratch pattern from 120 is still visible after the A30, you skipped the 220 too fast. Each step must fully replace the previous step''s scratch pattern before moving on.', 4);

-- Module 2 Quiz
INSERT INTO public.module_quizzes (id, module_id, questions, xp_reward) VALUES (
  'd2b2c3d4-0002-4000-8000-000000000001',
  'b2b2c3d4-0002-4000-8000-000000000001',
  '[
    {"id": "m2q1", "question": "Which abrasive material is self-sharpening and best for hard steels?", "options": ["Aluminum oxide", "Silicon carbide", "Ceramic alumina", "Garnet"], "correct": 2},
    {"id": "m2q2", "question": "What is the standard four-step commercial sharpening progression?", "options": ["60 ceramic, 120 ceramic, 220 A/O, strop", "120 ceramic, 220 A/O, Trizact A30, leather strop", "120 A/O, 400 A/O, 800 A/O, strop", "Trizact A100, A65, A30, A6"], "correct": 1},
    {"id": "m2q3", "question": "Why do Trizact belts run cooler than conventional abrasives?", "options": ["They are made of softer material", "The pyramid structure reduces contact area and friction", "They are always used at low speed", "They contain a built-in coolant"], "correct": 1},
    {"id": "m2q4", "question": "A regularly maintained knife with no chips comes in slightly dull. Where do you start?", "options": ["120 ceramic — always start at the beginning", "220 A/O — the existing bevel is fine", "Leather strop only", "Trizact A6 for a mirror finish"], "correct": 1},
    {"id": "m2q5", "question": "How do you know if you skipped a grit step too quickly?", "options": ["The knife feels warm", "The previous step''s scratch pattern is still visible", "The belt squeals", "The edge reflects light"], "correct": 1}
  ]'::jsonb,
  25
);

-- ============================================================
-- MODULE 3: Technique on a Wider Belt
-- ============================================================
INSERT INTO public.modules (id, course_id, title, slug, description, "order")
VALUES (
  'b2b2c3d4-0003-4000-8000-000000000001',
  'a1b2c3d4-0002-4000-8000-000000000001',
  'Technique on a Wider Belt',
  'technique-on-a-wider-belt',
  'Adapt your sharpening technique to the 2-inch platform — pressure, speed, direction, and angle verification.',
  3
);

INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, "order") VALUES
('c2000001-0003-4000-8000-000000000001', 'b2b2c3d4-0003-4000-8000-000000000001', 'Pressure & Contact Area', 'pressure-and-contact-area', 'text',
'## Pressure & Contact Area

Moving from a 1-inch belt to a 2-inch belt changes the physics of your grind. Understanding this is essential to getting consistent results.

### The PSI Difference

Pressure is force divided by area. When you double the belt width, the same amount of force spreads over twice the area. That means:

- **Same hand pressure on a 2-inch belt = half the PSI** compared to a 1-inch belt
- The belt feels more forgiving — small wobbles in angle are less punishing
- But you also need **more deliberate pressure** to get the same material removal rate

This is both a blessing and a curse. The wider belt is more forgiving of technique errors, which is great for learning. But it can also mask bad habits because the feedback is softer.

### Finding the Right Pressure

The right pressure produces:
- A consistent, audible hiss (not a grind or screech)
- Visible material removal on the Sharpie test
- No heat buildup in the blade

Too much pressure:
- Generates excessive heat
- Digs the belt into the blade unevenly
- Wears belts faster
- Removes more material than intended

Too little pressure:
- Wastes time — the belt isn''t cutting
- Can cause the blade to skip or chatter
- Leads to inconsistent results

### The Two-Finger Test

Here''s a simple calibration exercise: press your blade against the belt using only **two fingers** behind the spine. That''s roughly the right pressure for bevel work on a 2-inch belt. If you''re white-knuckling the handle, you''re pressing way too hard.

### Adjusting for Blade Size

- **Paring knives and small blades:** Very light pressure — the blade is thin and heats fast
- **8-inch chef knives:** Moderate two-finger pressure
- **10-inch chef knives and cleavers:** You can lean in a bit more — more steel mass absorbs heat

> **Key insight:** Let the abrasive do the cutting. Your job is to hold the angle and maintain even contact. The belt removes material; you guide the process.', 1),

('c2000001-0003-4000-8000-000000000002', 'b2b2c3d4-0003-4000-8000-000000000001', 'Speed Selection by Stage', 'speed-selection-by-stage', 'text',
'## Speed Selection by Stage

Now that you have a VFD, you need a strategy for when to use which speed. The general rule is simple: **start fast, finish slow**.

### The Logic

Coarse belts cut aggressively. They''re designed to remove material quickly, and they do their best work at higher speeds where each grain takes a healthy bite. Because the cuts are deep, the belt doesn''t dwell on any one spot — heat generation is manageable.

Fine belts are the opposite. They remove material slowly, which means they''re in contact with the same spot longer. More dwell time = more heat. Reducing speed compensates by giving each grain less contact time.

### Recommended Speed Settings

| Belt / Stage | Speed Setting | SFPM Range | Rationale |
|-------------|--------------|------------|-----------|
| 120 ceramic | High | 4,500–5,300 | Aggressive removal, minimal dwell |
| 220 A/O | Medium-high | 3,500–4,500 | Moderate removal, controlled refinement |
| Trizact A30 | Medium | 2,500–3,500 | Fine work, heat-sensitive stage |
| Leather strop | Minimum | Under 100 | Must crawl — heat and compound control |

### Dialing In Your VFD

Most VFDs use a dial or digital control from 0–60 Hz (or 0–100%). Here''s a practical mapping:

- **60–80%** for coarse work
- **40–60%** for mid-grit
- **30–50%** for Trizact finishing
- **5–10%** for stropping (yes, that low)

### Speed and Steel Hardness

Harder steels benefit from slightly lower speeds at coarse grits. A 64 HRC Japanese knife on a ceramic belt at full speed can chip rather than grind. Reduce speed by 10–15% for steels above 62 HRC.

Softer steels (German knives, 54–56 HRC) can handle full speed — they''re more ductile and less prone to micro-fracturing.

### The Transition Habit

Build this into your muscle memory: **every time you change belts, adjust the speed**. Swap to a finer belt → dial down. Swap to coarser → dial up. Don''t run Trizact at coarse-belt speed — you''ll burn edges and waste expensive belts.

> **Tip:** Write your speed settings on tape and stick it to the grinder until they become second nature. After a few hundred knives, you won''t need the reference.', 2),

('c2000001-0003-4000-8000-000000000003', 'b2b2c3d4-0003-4000-8000-000000000001', 'Edge Leading vs Edge Trailing', 'edge-leading-vs-edge-trailing', 'text',
'## Edge Leading vs Edge Trailing

The direction you move the blade relative to the belt rotation matters enormously. Getting this wrong can damage your edge, your belt, or your fingers.

### Edge Leading (Into the Belt)

The cutting edge faces into the direction of belt travel. The belt hits the edge first and sweeps toward the spine.

**Advantages:**
- Removes fatigued metal directly at the apex
- Less likely to create a wire edge (burr folds away from the belt)
- More aggressive material removal at the edge where you need it
- Better visibility of the bevel as you work

**Risks:**
- Higher risk of the belt catching the edge and pulling the blade
- Requires confident hand control
- More dangerous if technique slips

### Edge Trailing (Away from the Belt)

The spine faces into the belt travel. The belt contacts the spine first and sweeps toward the edge.

**Advantages:**
- Much safer — the belt pushes the blade away rather than catching it
- Gentler on the apex — less risk of over-grinding
- Preferred for fine work and polishing
- Required for stropping (edge-leading on a strop rounds the apex)

**Risks:**
- Can create a wire edge (burr folds toward the belt and gets reinforced)
- Slightly less efficient material removal at the apex

### When to Use Each

| Stage | Direction | Why |
|-------|----------|-----|
| 120 ceramic | Edge trailing (recommended) | Safer, sufficient removal |
| 220 A/O | Edge trailing | Refinement, controlled approach |
| Trizact A30 | Edge trailing | Fine work, apex protection |
| Leather strop | Edge trailing (always) | Mandatory — leading will cut the leather |

### A Note on the Edge-Leading Debate

Some experienced sharpeners use edge-leading for coarse grits and swear by it. They''re not wrong — it can be faster and more efficient. But it demands excellent hand control and confident technique. For most commercial work, **edge-trailing is the safer default** that produces excellent results.

If you choose to use edge-leading for coarse grits:
- Keep light pressure — the belt is already cutting aggressively
- Use short passes — 2 seconds maximum
- Maintain a firm, locked wrist
- Never lead into the belt with the tip of the knife

> **Non-negotiable rule:** Stropping is always edge-trailing. Leading into a strop belt will cut the leather and round your edge. No exceptions.', 3),

('c2000001-0003-4000-8000-000000000004', 'b2b2c3d4-0003-4000-8000-000000000001', 'The Marker Trick', 'the-marker-trick', 'text',
'## The Marker Trick

You learned the Sharpie trick in Level 1. On a 2-inch belt, it becomes even more important — and there''s more you can learn from it.

### The Basic Technique

1. Color the entire bevel with a black Sharpie — both sides
2. Make one light pass on the belt
3. Examine where the marker was removed

The marker reveals **exactly** where the belt is making contact. No guessing, no assumptions.

### Reading the Results

**Marker removed evenly across the entire bevel:**
Perfect. Your angle matches the existing bevel, and you''re making full contact. Keep going.

**Marker removed only at the shoulder (top of bevel, near the flat):**
Your angle is too low. You''re grinding into the flat of the blade instead of the edge. Raise your angle.

**Marker removed only at the edge:**
Your angle is too high. You''re only touching the very tip of the bevel. Lower your angle. This is less dangerous than grinding the shoulder, but you''re creating a micro-bevel rather than reshaping the full bevel.

**Marker removed unevenly along the length:**
Your technique is inconsistent. The heel, belly, and tip are each at slightly different angles. Practice maintaining a constant angle through the full stroke.

### The Angle Consistency Test

Here''s a more advanced use: mark the bevel, then make **five passes** on the same side. If the marker removal is consistent across all five passes, your angle is locked in. If it shifts from pass to pass, you''re rocking the blade.

### The 2-Inch Advantage

On a wider belt, the marker trick is more revealing. A 2-inch belt contacts more of the bevel surface at once, so inconsistencies are more visible. You''ll see clearly whether you''re making full contact or just hitting one zone.

### Multi-Stage Verification

Use the marker trick at **every grit change**:
- After 120: verify the new scratch pattern covers the full bevel
- After 220: confirm you''ve replaced all 120 scratches
- After A30: the polished zone should match the previous stages

If any stage shows gaps, go back and fill them before moving forward.

### Common Pitfalls

- **Using the wrong marker:** Only permanent Sharpie works. Dry-erase markers come off too easily.
- **Not waiting for the marker to dry:** Give it 5 seconds before grinding, or it smears.
- **Skipping the marker on "easy" knives:** Every knife deserves verification. The one time you skip it is the time you''ll grind at the wrong angle.

> **The marker doesn''t lie.** If you think your angle is perfect but the marker says otherwise, trust the marker. Your hands can deceive you; physics can''t.', 4);

-- Module 3 Quiz
INSERT INTO public.module_quizzes (id, module_id, questions, xp_reward) VALUES (
  'd2b2c3d4-0003-4000-8000-000000000001',
  'b2b2c3d4-0003-4000-8000-000000000001',
  '[
    {"id": "m3q1", "question": "On a 2-inch belt, applying the same force as on a 1-inch belt results in:", "options": ["Double the PSI", "Half the PSI", "The same PSI", "Four times the PSI"], "correct": 1},
    {"id": "m3q2", "question": "As you move from coarse to fine grits, you should:", "options": ["Increase belt speed", "Maintain the same speed", "Decrease belt speed", "Turn off the VFD"], "correct": 2},
    {"id": "m3q3", "question": "Why must stropping always be done edge-trailing?", "options": ["Edge-leading is too slow", "Edge-leading will cut the leather and round the apex", "It doesn''t matter — either direction works", "Edge-leading wastes compound"], "correct": 1},
    {"id": "m3q4", "question": "The Sharpie test shows marker removed only at the shoulder. What should you do?", "options": ["Press harder", "Lower your angle", "Raise your angle", "Switch to a finer belt"], "correct": 2},
    {"id": "m3q5", "question": "What is the two-finger test used for?", "options": ["Testing belt tension", "Checking blade sharpness", "Calibrating the right amount of pressure against the belt", "Measuring bevel angle"], "correct": 2}
  ]'::jsonb,
  25
);

-- ============================================================
-- MODULE 4: Heat Management
-- ============================================================
INSERT INTO public.modules (id, course_id, title, slug, description, "order")
VALUES (
  'b2b2c3d4-0004-4000-8000-000000000001',
  'a1b2c3d4-0002-4000-8000-000000000001',
  'Heat Management',
  'heat-management',
  'Understand how heat damages steel and master the techniques to prevent it.',
  4
);

INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, "order") VALUES
('c2000001-0004-4000-8000-000000000001', 'b2b2c3d4-0004-4000-8000-000000000001', 'How Heat Damages Steel', 'how-heat-damages-steel', 'text',
'## How Heat Damages Steel

Heat is the single biggest risk when sharpening on a belt grinder. Understanding exactly what happens inside the steel when it overheats will make you take prevention seriously.

### The Tempering Process

When a knife is manufactured, the blade is **hardened** (heated and quenched to lock the steel into a hard crystalline structure) and then **tempered** (reheated to a specific lower temperature to add toughness). The tempering temperature determines the final hardness.

When you generate friction heat at the edge during sharpening, you''re essentially **re-tempering** the steel — but at an uncontrolled temperature. This softens the edge and destroys its ability to hold a sharp apex.

### The Color Scale

Steel changes color as it heats, giving you visible warnings:

| Color | Temperature | What''s Happening |
|-------|------------|------------------|
| Straw / light yellow | ~400°F (200°C) | Early warning — damage starting |
| Brown / dark straw | ~500°F (260°C) | Significant hardness loss |
| Purple | ~550°F (290°C) | Severe damage |
| Blue | ~600°F (315°C) | Steel is ruined at the edge |
| Gray / light blue | ~700°F+ (370°C+) | Complete loss of temper |

### The Invisible Danger

Here''s the problem: you can damage steel **before you see any color change**. The surface may look fine, but the very tip of the apex — where the steel is thinnest — has already been softened. This is why knives sometimes seem sharp after sharpening but dull within a single use. The apex is soft and folds over immediately.

### Hardness Loss is Permanent

Unlike a rolled edge that can be straightened, heat damage **cannot be undone** by further sharpening. The softened steel must be completely removed — ground past — to reach undamaged material. On a thin knife, this can mean significant material loss.

> **The bottom line:** Every time you overheat an edge, you''re shortening the life of that knife. Your customer trusts you not to damage their tools. Heat management isn''t optional — it''s professional responsibility.', 1),

('c2000001-0004-4000-8000-000000000002', 'b2b2c3d4-0004-4000-8000-000000000001', 'The Thin-Edge Problem', 'the-thin-edge-problem', 'text',
'## The Thin-Edge Problem

The apex of a knife is the thinnest part of the entire blade — sometimes only a few microns thick. This extreme thinness makes it extraordinarily vulnerable to heat.

### Why the Apex Heats First

Think about it in terms of thermal mass. The spine of a chef''s knife might be 2–3mm thick. The apex is less than 0.01mm. When friction generates heat:

- The **spine** has massive thermal mass — it absorbs heat slowly and dissipates it into the surrounding steel
- The **apex** has almost zero thermal mass — it reaches critical temperature in **milliseconds**

This means the part you''re trying to sharpen is the part most easily destroyed by the process of sharpening. That''s the fundamental challenge of belt grinding.

### The Progression of Risk

As you sharpen, the edge gets thinner. Each grit step refines the apex to a finer point. This means:

1. **120 grit** — The edge is at its thickest (you''re establishing the bevel). Heat risk is moderate.
2. **220 grit** — The apex is thinner. Risk increases.
3. **Trizact A30** — The apex is very thin. Risk is high.
4. **Strop** — The apex is at its finest. Risk is highest.

This is counterintuitive. You''d think the coarse belt is the dangerous one because it''s more aggressive. But the fine belts are actually riskier because the edge is thinner and more vulnerable.

### Thinner Knives = Higher Risk

Not all knives are equal:

| Knife Type | Spine Thickness | Heat Risk |
|-----------|----------------|-----------|
| Japanese gyuto | 1.5–2mm | Very high |
| German chef | 2–3mm | Moderate |
| Cleaver | 3–6mm | Lower |
| Fillet knife | 1–1.5mm | Extremely high |

A laser-thin Japanese knife can overheat before you even feel warmth in the blade. A thick cleaver gives you much more thermal buffer.

### The Takeaway

**Treat every pass on a fine belt as a heat event.** Light pressure, short contact, and frequent cooling are non-negotiable — especially as you progress through finer grits.

> **Rule of thumb:** The sharper the knife is getting, the gentler you need to be. The last 10% of sharpness requires 90% of the care.', 2),

('c2000001-0004-4000-8000-000000000003', 'b2b2c3d4-0004-4000-8000-000000000001', 'Prevention Techniques', 'prevention-techniques', 'text',
'## Prevention Techniques

Now that you understand the threat, here''s how to manage it. Heat prevention isn''t one technique — it''s a system of habits that work together.

### 1. Light Pressure

This is the single most effective heat prevention technique. Less pressure = less friction = less heat. Period.

Remember the two-finger test from Module 3: if you''re pressing harder than two fingers behind the spine, you''re pressing too hard. The belt removes material through abrasive action, not through force.

### 2. Quick Passes

Keep each contact with the belt to **2–3 seconds maximum**. Longer passes generate more heat in the same spot. Quick, deliberate strokes are always better than slow, lingering ones.

A good rhythm:
- Contact belt → 2-second stroke → lift off → inspect → repeat

### 3. Alternate Sides

Never grind one side of the blade for multiple consecutive passes. **Alternate every pass** — right side, left side, right side, left side. This gives each side time to cool while you work the other.

Alternating also helps maintain even material removal. Five passes on one side before switching creates an asymmetric bevel.

### 4. Water Dunk

Keep a cup of room-temperature water within arm''s reach. Dunk the blade after every 2–3 passes. Don''t wait until you feel heat — by then, you''ve already crossed the danger zone at the apex.

The water should be room temperature, not ice cold. Thermal shock from ice water can cause micro-cracking in some hard steels.

### 5. Reduce Speed at Finer Grits

This reinforces what you learned in Module 3. As grits get finer:
- The apex gets thinner
- Dwell time increases
- Heat risk goes up

Reduce belt speed proportionally. Your VFD is a heat management tool as much as it is a speed control.

### 6. Fresh Belts

We''ll cover this more in the next lesson, but worn belts generate significantly more heat. Keep your belts fresh.

### The Combined System

No single technique is enough. It''s the **combination** of all six that keeps you safe:

Light pressure + quick passes + alternating sides + water dunk + reduced speed + fresh belts = cool edges, happy customers.

> **Build the habit:** After 500 knives, these techniques should be automatic. Until then, consciously check yourself on every single knife.', 3),

('c2000001-0004-4000-8000-000000000004', 'b2b2c3d4-0004-4000-8000-000000000001', 'Fresh Belts Cut Cool', 'fresh-belts-cut-cool', 'text',
'## Fresh Belts Cut Cool

This is one of the most important lessons in commercial sharpening, and it''s the one most beginners get wrong: **running belts too long is a false economy**.

### Why Dull Belts Generate Heat

A fresh abrasive grain is sharp — it bites into the steel and lifts a clean chip of material. This is efficient cutting. The energy goes into removing steel.

A worn abrasive grain is rounded — instead of cutting, it **rubs**. The energy that would have gone into removing material now converts to **friction heat**. You''re polishing with a belt that should be cutting, and the blade pays the price.

### The Symptoms of a Worn Belt

Watch for these signs:

- **Increased heat:** The blade gets warmer faster, even with light pressure
- **Glazing:** The belt surface looks shiny or smooth in spots
- **Reduced cut rate:** You''re making more passes to achieve the same result
- **Changed sound:** The cutting hiss becomes a higher-pitched whine
- **Color on the blade:** Straw or brown tint appearing during normal technique

### Belt Life Expectations

Belt life varies enormously based on use, but here are rough guidelines for 2x72 belts in commercial sharpening:

| Belt Type | Approximate Life | Notes |
|-----------|-----------------|-------|
| 120 ceramic | 80–150 knives | Self-sharpening extends life |
| 220 A/O | 40–80 knives | Watch for glazing |
| Trizact A30 | 60–100 knives | Very consistent wear pattern |
| Leather strop | 200+ knives | Recharge with compound regularly |

These are rough numbers. Track your actual usage and replace based on performance, not a fixed schedule.

### The Cost Calculation

A 120 ceramic belt costs roughly $5–8. If it sharpens 100 knives before it should be replaced, that''s **$0.05–0.08 per knife** in belt cost. Running it for 150 knives to "save money" means the last 50 knives got subpar edges and risked heat damage.

If you''re charging $5–10 per knife for sharpening, the belt cost is a rounding error. The quality of your work — and your reputation — is worth far more than a few extra knives per belt.

### The Strop Exception

Leather strop belts don''t wear out the same way. The leather itself lasts a long time. What wears out is the **compound**. Recharge your strop with fresh compound every 20–30 knives. A strop without compound is just rubbing leather against steel — useless.

### When in Doubt, Change It

If you''re questioning whether a belt is done, it probably is. The difference between a fresh belt and a tired one is immediately obvious in the cut quality.

> **Professional standard:** Belt cost is part of doing business. Cheap belts and worn-out belts both produce mediocre results. Invest in quality abrasives and replace them before they compromise your work.', 4);

-- Module 4 Quiz
INSERT INTO public.module_quizzes (id, module_id, questions, xp_reward) VALUES (
  'd2b2c3d4-0004-4000-8000-000000000001',
  'b2b2c3d4-0004-4000-8000-000000000001',
  '[
    {"id": "m4q1", "question": "At what color change has steel already suffered severe heat damage?", "options": ["Straw yellow", "Light brown", "Blue", "No color change means no damage"], "correct": 2},
    {"id": "m4q2", "question": "Which stage of the sharpening progression carries the HIGHEST heat risk to the apex?", "options": ["120 ceramic (coarse)", "220 A/O (mid-grit)", "Trizact A30 (fine)", "Leather strop (final)"], "correct": 3},
    {"id": "m4q3", "question": "Why does a worn belt generate more heat than a fresh one?", "options": ["The worn belt spins faster", "Rounded grains rub instead of cutting, converting energy to friction", "Worn belts are thinner and flex more", "The backing material breaks down and insulates heat"], "correct": 1},
    {"id": "m4q4", "question": "How long should each pass on the belt last?", "options": ["5–10 seconds for thorough contact", "2–3 seconds maximum", "As long as needed until sparks appear", "30 seconds per side"], "correct": 1},
    {"id": "m4q5", "question": "Can heat damage to an edge be repaired by further sharpening at the same spot?", "options": ["Yes — just use a finer grit", "Yes — strop it back to hardness", "No — the softened steel must be ground past entirely", "No — but it doesn''t affect performance"], "correct": 2}
  ]'::jsonb,
  25
);

-- ============================================================
-- MODULE 5: Knife Thinning with the Airplaten
-- ============================================================
INSERT INTO public.modules (id, course_id, title, slug, description, "order")
VALUES (
  'b2b2c3d4-0005-4000-8000-000000000001',
  'a1b2c3d4-0002-4000-8000-000000000001',
  'Knife Thinning with the Airplaten',
  'knife-thinning-airplaten',
  'Learn why thinning matters, how the Airplaten radius platen works, and how to offer thinning as a premium service.',
  5
);

INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, "order") VALUES
('c2000001-0005-4000-8000-000000000001', 'b2b2c3d4-0005-4000-8000-000000000001', 'Why Thinning Matters', 'why-thinning-matters', 'text',
'## Why Thinning Matters

Every time you sharpen a knife, you move the edge into thicker steel. Over months and years of sharpening, the blade gets thicker behind the edge — and a thick blade wedges through food instead of slicing.

### The Geometry Problem

Picture a knife''s cross-section as a triangle. The apex (tip of the triangle) is the cutting edge. Each time you sharpen, you grind the apex back slightly, moving it higher into the triangle where the steel is thicker.

After many sharpenings:
- The edge is sharp (the apex is keen)
- But the steel immediately behind the edge is thick
- The knife **wedges** — it splits food apart instead of slicing through cleanly
- Customers say: "It''s sharp but it doesn''t cut well"

This is the classic symptom of a knife that needs thinning, not just sharpening.

### Sharp vs. Thin

These are two different things:

- **Sharpness** = How keen the apex is (the very tip of the edge)
- **Thinness** = How thick the steel is behind the edge (the geometry of the blade)

A knife can be sharp but thick (wedges through food) or thin but dull (slides through food but doesn''t initiate a cut). The goal is **both**: a thin blade with a sharp apex.

### When a Knife Needs Thinning

Look for these signs:
- The knife is sharp (passes the paper test) but doesn''t perform well on food
- You can feel a pronounced shoulder where the bevel meets the flat of the blade
- The bevel has become visibly wider from repeated sharpenings
- Carrots crack instead of being sliced cleanly
- The customer reports the knife "pushes food away"

### The Frequency

Most kitchen knives in regular use need thinning every **6–12 months**, depending on how often they''re sharpened and how much material is removed each time. A knife used daily in a commercial kitchen might need thinning every 3–4 months.

> **The conversation:** When a customer says "my knife is sharp but doesn''t cut," that''s your cue. This knife doesn''t need sharpening — it needs thinning. And thinning is a premium service.', 1),

('c2000001-0005-4000-8000-000000000002', 'b2b2c3d4-0005-4000-8000-000000000001', 'The Radius Platen', 'the-radius-platen', 'text',
'## The Radius Platen

The Airplaten is a precision-engineered radius platen designed specifically for thinning and convex edge work on belt grinders. It''s not just a curved surface — it''s a purpose-built tool that solves several problems at once.

### What Is the Airplaten?

The Airplaten is a **carbon-fiber radius platen** that mounts on your 2x72 grinder in place of the flat platen. Its key features:

- **Convex surface geometry:** The curved face produces a smooth, convex grind behind the edge — eliminating the sharp shoulder that flat-platen sharpening creates
- **Carbon-fiber construction:** Lightweight, rigid, and thermally non-conductive — it doesn''t absorb or transfer heat the way a steel platen does
- **Thermal tunnel:** Air flows between the belt and the platen surface, reducing heat buildup by approximately **40%** compared to a flat steel platen
- **Precision-machined radius:** Consistent curvature across the entire surface ensures even material removal

### Why Convex Geometry Matters

When you thin a knife on a flat platen, you create a new flat surface that meets the original blade flat at a shoulder. This shoulder is the problem — it''s a hard transition that catches on food.

A radius platen creates a **smooth, continuous curve** from the spine to the edge. No shoulder, no catching. Food releases cleanly from the blade because there''s no abrupt angle change.

### The Heat Advantage

The thermal tunnel in the Airplaten is a significant practical benefit. During thinning, you''re removing material from a larger area of the blade than during sharpening. More contact area = more friction = more heat.

The air gap between the belt and the platen surface:
- Allows heat to dissipate into the air stream
- Prevents heat from conducting through the platen into the belt backing
- Reduces the need for constant water dunking (though you should still dunk)

### Flat Platen vs. Radius Platen for Thinning

| Aspect | Flat Platen | Airplaten |
|--------|------------|-----------|
| Edge geometry | Creates shoulder | Smooth convex transition |
| Heat | Higher — full contact | ~40% less — thermal tunnel |
| Food release | Wedging at shoulder | Clean release |
| Learning curve | Familiar | Requires technique adjustment |
| Best for | Bevel sharpening | Thinning behind the edge |

> **Investment:** The Airplaten isn''t cheap, but it opens up thinning as a premium service that most sharpeners can''t offer. It pays for itself quickly if you market thinning to your customers.', 2),

('c2000001-0005-4000-8000-000000000003', 'b2b2c3d4-0005-4000-8000-000000000001', 'Thinning Technique', 'thinning-technique', 'text',
'## Thinning Technique

Thinning is not sharpening. The angles, pressure, speed, and mindset are all different. If you approach thinning the way you approach bevel work, you''ll ruin blades.

### The Angle

For thinning, you''re working at a **much lower angle** than for sharpening — typically **2–5 degrees from the blade face**. You''re not touching the cutting edge; you''re removing material from the flat of the blade behind the edge.

Think of it this way:
- Sharpening angle: 15–20 degrees (working the bevel)
- Thinning angle: 2–5 degrees (working the blade face behind the bevel)

### Step-by-Step Technique

1. **Set speed to low-medium** (2,500–3,500 SFPM). Thinning is not a race.

2. **Mark the area** with a Sharpie. Color the entire flat of the blade from the edge up about 1–2 inches. This shows you exactly where you''re removing material.

3. **Position the blade nearly flat** against the radius platen, edge trailing. The blade should be almost parallel to the belt surface — just 2–5 degrees of angle.

4. **Use light pressure.** Even lighter than for sharpening. You''re removing material over a large area, so heat builds up quickly.

5. **Make smooth, sweeping passes** — heel to tip, maintaining the same low angle throughout. Each pass should take about 2–3 seconds.

6. **Alternate sides after every 2–3 passes.** Even material removal on both sides keeps the knife centered.

7. **Check frequently.** After every 5–6 passes total, stop and examine. Run your fingernail across the blade face — you should feel the transition getting smoother.

### Edge Trailing is Mandatory

Always thin with the edge trailing. At such a low angle, edge-leading would put the cutting edge directly into the belt — catastrophic for both the edge and the belt.

### When to Stop

Thinning is done when:
- The shoulder between the bevel and the blade face is gone or significantly reduced
- Running your finger from spine to edge feels like a smooth, continuous taper
- The knife slices through food without wedging
- The Sharpie shows even material removal across the thinned area

### Common Mistakes

- **Too much angle:** You''re grinding a new bevel instead of thinning. Stay low.
- **Too much pressure:** Large contact area + pressure = heat. Be patient.
- **Uneven sides:** Thin one side more than the other and the knife cuts crooked. Alternate religiously.
- **Going to the edge:** Thinning should stop short of the cutting edge. If you grind into the edge, you need to re-sharpen.

> **Practice first:** Thin a cheap knife before working on a customer''s blade. The angle and pressure feel very different from sharpening, and it takes 5–10 knives to develop the muscle memory.', 3),

('c2000001-0005-4000-8000-000000000004', 'b2b2c3d4-0005-4000-8000-000000000001', 'Thinning as a Service', 'thinning-as-a-service', 'text',
'## Thinning as a Service

Thinning isn''t just a technique — it''s a **revenue opportunity**. Most sharpening services don''t offer it, which means you can differentiate yourself and charge premium prices.

### The Time Comparison

| Method | Time per Knife | Skill Required |
|--------|---------------|----------------|
| Thinning on stones | 20–30 minutes | High |
| Thinning on belt (Airplaten) | 3–5 minutes | Moderate |

On stones, thinning is an ordeal — large surface area, low material removal rate, and hand fatigue. On a 2x72 with the Airplaten, it''s a **3–5 minute process** that produces better, more consistent results. This is the competitive advantage of belt thinning.

### Pricing

Thinning is a premium add-on to standard sharpening:

- **Standard sharpening:** Your regular price ($5–10 per knife)
- **Thinning add-on:** $10–30+ per knife, depending on the blade and the amount of work

A typical customer with 5 knives that need sharpening might have 1–2 that also need thinning. That''s an extra $20–60 on the order for 6–10 minutes of work.

### The Sales Conversation

The customer tells you: *"My knife is sharp but it doesn''t cut well."*

Your response: *"That usually means the blade has gotten thicker behind the edge from repeated sharpenings. It''s sharp, but the geometry is working against it. I can thin it back — takes a few minutes and it''ll slice like it did when it was new."*

That''s it. You''re not upselling — you''re diagnosing a real problem and offering a real solution. Customers respect that.

### Demonstrating Value

The best sales tool is a **before and after test**. Thin one knife from the customer''s set and have them cut a tomato or an onion with the thinned knife versus an unthinned one. The difference is dramatic and immediately obvious.

### Which Knives to Recommend

Not every knife needs or benefits from thinning:

**Good candidates:**
- Chef''s knives that have been sharpened many times
- Japanese knives (already thin, very sensitive to geometry changes)
- Any knife where the customer reports wedging

**Skip thinning on:**
- Serrated knives (different geometry entirely)
- Cleavers meant for heavy work (thickness is a feature)
- Very new knives that haven''t been sharpened much

### Documenting the Work

Keep notes on which customers'' knives you''ve thinned and when. This helps you:
- Track when they''ll need it again
- Demonstrate the ongoing value of your service
- Build long-term customer relationships

> **Bottom line:** Thinning at $10–30 per knife for 3–5 minutes of work is one of the highest-margin services you can offer. And customers who experience the difference become loyal, repeat clients.', 4);

-- Module 5 Quiz
INSERT INTO public.module_quizzes (id, module_id, questions, xp_reward) VALUES (
  'd2b2c3d4-0005-4000-8000-000000000001',
  'b2b2c3d4-0005-4000-8000-000000000001',
  '[
    {"id": "m5q1", "question": "A knife passes the paper test but wedges through carrots. What does it need?", "options": ["A sharper edge", "A different steel", "Thinning behind the edge", "A new handle"], "correct": 2},
    {"id": "m5q2", "question": "What angle from the blade face is used for thinning on the Airplaten?", "options": ["15–20 degrees (same as sharpening)", "10–15 degrees", "2–5 degrees", "0 degrees (completely flat)"], "correct": 2},
    {"id": "m5q3", "question": "What is the Airplaten''s thermal tunnel?", "options": ["A cooling liquid that circulates inside the platen", "An air gap between belt and platen that dissipates heat ~40%", "A fan that blows on the blade during thinning", "A heat-resistant coating on the platen surface"], "correct": 1},
    {"id": "m5q4", "question": "How long does thinning typically take per knife on a 2x72 with the Airplaten?", "options": ["30 seconds", "3–5 minutes", "20–30 minutes", "Over an hour"], "correct": 1},
    {"id": "m5q5", "question": "A customer''s knife is sharp but ''pushes food away.'' How do you position the upsell?", "options": ["Tell them the knife is defective and needs replacing", "Explain the geometry problem and offer thinning as a solution", "Sharpen it again at a lower angle", "Recommend they buy a thinner knife"], "correct": 1}
  ]'::jsonb,
  25
);

-- ============================================================
-- MODULE 6: Polishing & Commercial Workflow
-- ============================================================
INSERT INTO public.modules (id, course_id, title, slug, description, "order")
VALUES (
  'b2b2c3d4-0006-4000-8000-000000000001',
  'a1b2c3d4-0002-4000-8000-000000000001',
  'Polishing & Commercial Workflow',
  'polishing-commercial-workflow',
  'Master Trizact finishing, leather strop technique, the commercial sharpening cycle, and blade-specific approaches.',
  6
);

INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, "order") VALUES
('c2000001-0006-4000-8000-000000000001', 'b2b2c3d4-0006-4000-8000-000000000001', 'Trizact Finishing', 'trizact-finishing', 'text',
'## Trizact Finishing

You learned about Trizact in Module 2. Now let''s go deeper into the finishing progression that transforms a functional edge into a polished, professional one.

### The Finishing Progression

For premium finishing beyond the standard A30:

| Belt | Grit Equivalent | Finish Quality | Use Case |
|------|----------------|---------------|----------|
| A30 | ~800 grit | Satin finish | Standard commercial — your daily driver |
| A16 | ~1,200 grit | Fine satin | Premium customer knives |
| A6 | ~2,500 grit | Near-mirror | Show knives, Japanese blades, personal satisfaction |

### When to Go Beyond A30

For 90% of commercial sharpening, **A30 is the finish line**. It produces a refined, polished bevel that customers notice and appreciate. Going finer is optional and should be deliberate.

Go to A16 or A6 when:
- The customer specifically requests a polished or mirror finish
- You''re working on a premium Japanese knife that deserves the treatment
- You''re charging a premium price for premium service
- You''re building a portfolio piece or competition entry

### Speed Settings for Finishing

As the grits get finer, the speed gets lower:

- **A30:** 2,500–3,500 SFPM (medium on the VFD)
- **A16:** 2,000–3,000 SFPM (medium-low)
- **A6:** 1,500–2,500 SFPM (low-medium)

The finer the belt, the more critical speed control becomes. A6 at high speed will glaze instantly and generate heat that rounds the apex.

### Technique Adjustments

Finishing is the gentlest stage of sharpening:

- **Feather-light pressure** — barely touching the belt
- **Edge trailing only** — protecting the refined apex
- **2–3 passes per side** — this is refinement, not removal
- **Inspect after each pair of passes** — look for even, uniform scratch pattern

### The Scratch Pattern Check

After each Trizact stage, examine the bevel under bright light:
- The scratch pattern should be **uniform** — same direction, same depth everywhere
- Any remaining scratches from the previous grit mean you need more passes
- The finish should look noticeably finer than the previous stage

### Diminishing Returns

Be honest with yourself about where the value is:

| Progression | Time Added | Customer Perception |
|------------|-----------|-------------------|
| Stop at A30 | Baseline | "Wow, that''s sharp" |
| Add A16 | +30 seconds | "That looks really nice" |
| Add A6 | +60 seconds | "Is that a mirror?" |

For most commercial work, the jump from A30 to A16 isn''t noticed by the average customer. Save the extended progression for situations where it adds real value.

> **Honest advice:** Master the A30 finish first. Get it absolutely consistent and uniform before adding A16 and A6 to your workflow. A perfect A30 finish beats a sloppy A6 finish every time.', 1),

('c2000001-0006-4000-8000-000000000002', 'b2b2c3d4-0006-4000-8000-000000000001', 'Leather Strop Belts', 'leather-strop-belts', 'text',
'## Leather Strop Belts

The leather strop is the final step in every sharpening progression. Done right, it transforms a sharp edge into a polished, refined apex that glides through material. Done wrong, it rounds the edge and undoes your work.

### The Rules of Stropping

These are non-negotiable:

1. **Dead slow speed** — Under 100 SFPM. This is a crawl. If you can clearly see the belt moving, it''s probably still too fast for beginners.
2. **Edge trailing only** — Always. The edge must face away from belt travel. Edge-leading will cut the leather, destroy the belt, and round your apex.
3. **Feather-light pressure** — The weight of the blade is almost enough. You''re polishing, not grinding.
4. **Grain side of the leather** — The smooth side faces out. Flesh side (rough/suede) is too aggressive for final polish.

### Compound

Strop compound is a fine abrasive paste applied to the leather surface. It does the actual polishing work — the leather is just the carrier.

**Green chromium oxide** is the most popular compound for knife work:
- Approximately 0.5 micron particle size
- Excellent for final apex polish
- Widely available and affordable
- Apply a thin, even layer — more is not better

Other options:
- **Diamond paste** (various microns) — more aggressive, faster cutting
- **CBN (cubic boron nitride)** — excellent for hard steels
- **Iron oxide (red rouge)** — finer than chromium oxide, for ultimate polish

### Compound Dedication

Once a strop belt is loaded with a specific compound, **keep it dedicated to that compound**. Don''t mix compounds on the same belt — the coarser particles contaminate the finer compound and you lose the benefit.

Label your strop belts clearly: "Green CrOx" or "1-micron diamond" or whatever you''re running.

### Recharging

Compound wears off with use. Signs you need to recharge:
- The strop isn''t polishing as effectively
- The leather surface looks dry or bare
- You''re making more passes than usual to achieve the same result

Recharge every **20–30 knives** — apply a fresh thin layer of compound across the belt surface. Work it in with your finger or a piece of leather.

### Strop Belt Care

- Store strop belts flat, not folded
- Keep them away from metal dust and grinding debris
- Don''t use the same strop belt for different compounds
- A well-maintained leather strop belt can last **200+ knives** between replacements

> **The test:** After stropping, the edge should shave arm hair effortlessly and slice phone-book paper cleanly. If it doesn''t, you either need more strop passes, fresh compound, or the previous grits didn''t do their job.', 2),

('c2000001-0006-4000-8000-000000000003', 'b2b2c3d4-0006-4000-8000-000000000001', 'The Commercial Sharpening Cycle', 'commercial-sharpening-cycle', 'text',
'## The Commercial Sharpening Cycle

This is the complete workflow for processing a knife from intake to delivery. Master this cycle and you can sharpen 30–40 knives per hour consistently.

### The Six-Step Cycle

**Step 1: Inspect (10–15 seconds)**

Before the knife touches a belt:
- Check for chips, rolls, flat spots under bright light
- Assess the current bevel angle (Sharpie test if needed)
- Note any damage, rust, or handle issues
- Decide your starting grit: 120 (reprofile) or 220 (refresh)

**Step 2: Reprofile if Needed (30–60 seconds)**

Only if the inspection reveals damage or an inconsistent bevel:
- 120 ceramic, edge trailing
- Establish a clean, even bevel from heel to tip
- Verify with Sharpie test
- Water dunk after every 3–4 passes

**Step 3: 220 Bevel Refinement (15–20 seconds)**

- 220 A/O, edge trailing
- Replace the 120 scratch pattern with finer, uniform scratches
- 3–5 passes per side
- Reduce speed slightly from coarse stage

**Step 4: Trizact Finish (15–20 seconds)**

- A30 Trizact, edge trailing
- Polish the bevel to a satin finish
- 2–4 passes per side, feather-light pressure
- Reduce speed to medium

**Step 5: Strop (10–15 seconds)**

- Leather strop belt, dead slow (<100 SFPM)
- Edge trailing, near-zero pressure
- 3–5 passes per side
- This removes the final burr and polishes the apex

**Step 6: Test (5–10 seconds)**

Every knife gets tested before it goes back to the customer:
- **Light test:** No reflections along the edge
- **Paper test:** Clean slice through printer paper
- **Thumbnail test:** Edge catches on the thumbnail without sliding

### Total Time Targets

| Knife Condition | Target Time |
|----------------|-------------|
| Maintenance refresh (no damage) | 60–90 seconds |
| Moderate resharpening | 90–120 seconds |
| Full reprofile (chips/damage) | 2–3 minutes |
| Reprofile + thinning | 5–7 minutes |

### Batch Processing

For efficiency, process knives in **batches by grit**:

1. Run all knives through 120 (those that need it)
2. Switch belt → run all knives through 220
3. Switch belt → run all through A30
4. Switch belt → strop all knives
5. Test all knives

Belt changes take time. Batching minimizes changes and keeps you in rhythm.

### Quality Checkpoints

Build these into your muscle memory:
- After 120: Sharpie test confirms full bevel contact
- After 220: No visible 120 scratches remain
- After A30: Uniform satin finish
- After strop: Light test, paper test, pass

> **The standard:** Every knife leaves your hands performing at its best. No shortcuts, no "good enough." Consistency builds reputation, and reputation builds your business.', 3),

('c2000001-0006-4000-8000-000000000004', 'b2b2c3d4-0006-4000-8000-000000000001', 'Blade Types & Approach', 'blade-types-and-approach', 'text',
'## Blade Types & Approach

Not every blade is a chef''s knife. As your business grows, you''ll encounter everything from cleavers to garden shears. Knowing how to handle each type efficiently is what separates a knife sharpener from a blade service professional.

### Large Kitchen Knives (8–12 inch Chef, Santoku, Slicers)

These are your bread and butter — the most common blades you''ll see.

- **Approach:** Standard progression (120 → 220 → A30 → strop)
- **Angle:** 15–20 degrees per side
- **Special consideration:** Long blades require smooth, sweeping passes to maintain a consistent bevel from heel to tip. The belly curve needs extra attention — practice rocking the blade to follow the curve.
- **Belt choice:** 2-inch belt is ideal — the blade sits fully within the belt width

### Cleavers

Cleavers are thick, heavy blades designed for chopping through bone and tough materials. They don''t need — and shouldn''t get — a refined edge.

- **Approach:** 120 ceramic → 220 A/O → strop (skip Trizact)
- **Angle:** 22–30 degrees per side
- **Special consideration:** Cleavers benefit from **slack belt work** (grinding off the platen, using the unsupported belt). Slack belt follows the blade''s contour naturally and handles the flat, wide surface without overheating.
- **Don''t:** Polish a cleaver to a mirror finish. It''s not what the tool is for.

### Axes and Hatchets

Axes need a convex edge that''s tough enough to handle wood, not a thin kitchen-knife bevel.

- **Approach:** 120 ceramic on slack belt → 220 on slack belt → strop
- **Angle:** 25–35 degrees per side, convex
- **Special consideration:** Work on the slack belt (unsupported section between wheels). The belt conforms to the existing convex geometry. Use the Airplaten if you have one — its radius matches axe edge geometry well.
- **Safety:** Axes are heavy and awkward to hold against a belt. Use both hands and keep a firm grip.

### Garden Tools (Pruners, Shears, Hedge Trimmers)

Garden tools are single-bevel (sharpened on one side only) and often neglected.

- **Approach:** 120 ceramic → 220 A/O → light strop
- **Angle:** Match the existing factory bevel (usually 20–30 degrees)
- **Special consideration:** Only sharpen the beveled side. The flat back should stay flat — a few light passes on the flat side to remove any burr, nothing more. Disassemble shears if possible for better access.

### When to Use 1-Inch vs 2-Inch

Your 1x30 from Level 1 isn''t obsolete — it still has a role:

| Use 1-Inch Belt | Use 2-Inch Belt |
|-----------------|-----------------|
| Small paring knives | Chef knives 6 inch+ |
| Precision tip work | Cleavers and large blades |
| Tight radius curves | Flat bevel work |
| Detail touchups | Volume production |
| Serrated knife teeth | Thinning operations |

### The Professional Mindset

As your skills grow, customers will bring you everything. The professional response isn''t "I only do kitchen knives" — it''s "Let me take a look and see what it needs."

That said, know your limits. Swords, machetes, and industrial blades have their own techniques and safety requirements. Build up to those gradually.

> **Business tip:** Diversifying the types of blades you service expands your customer base. The person who brings in pruning shears today brings in kitchen knives tomorrow — and tells their friends about the sharpener who "does everything."', 4);

-- Module 6 Quiz
INSERT INTO public.module_quizzes (id, module_id, questions, xp_reward) VALUES (
  'd2b2c3d4-0006-4000-8000-000000000001',
  'b2b2c3d4-0006-4000-8000-000000000001',
  '[
    {"id": "m6q1", "question": "What compound is most commonly used on leather strop belts for knife work?", "options": ["Diamond paste", "Red iron oxide", "Green chromium oxide", "CBN (cubic boron nitride)"], "correct": 2},
    {"id": "m6q2", "question": "What is the target time for a maintenance sharpening on a knife in reasonable condition?", "options": ["30 seconds", "60–90 seconds", "5 minutes", "10 minutes"], "correct": 1},
    {"id": "m6q3", "question": "Why should cleavers be sharpened on the slack belt rather than the flat platen?", "options": ["Slack belt is faster", "The unsupported belt conforms to the blade contour and handles the wide surface", "Flat platens can''t handle thick blades", "Cleavers don''t need any platen work"], "correct": 1},
    {"id": "m6q4", "question": "When processing multiple knives, what is the most efficient approach?", "options": ["Complete each knife fully before starting the next", "Batch by grit — run all knives through each stage, then switch belts", "Only sharpen the dullest knives first", "Skip testing and just strop everything"], "correct": 1},
    {"id": "m6q5", "question": "A customer brings in garden shears. Which side do you sharpen?", "options": ["Both sides equally", "Only the beveled side; keep the flat back flat", "Only the flat back side", "Neither — garden tools can''t be sharpened on a belt"], "correct": 1}
  ]'::jsonb,
  25
);
