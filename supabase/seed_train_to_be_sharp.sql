-- Seed: Train To Be Sharp — Level 1
-- Cove Blades Training Course

-- Course
INSERT INTO public.courses (id, title, slug, description, thumbnail_url, is_free, "order", active, level)
VALUES (
  'a1b2c3d4-0001-4000-8000-000000000001',
  'Train To Be Sharp — Level 1',
  'train-to-be-sharp',
  'A hands-on course designed to give you practical, repeatable sharpening skills using a belt grinder. Learn to sharpen faster and more consistently, understand how steel behaves, form and remove burrs, and polish edges to a mirror finish.',
  NULL,
  true,
  1,
  true,
  'entry'
);

-- ============================================================
-- MODULE 1: Foundations of Sharpness
-- ============================================================
INSERT INTO public.modules (id, course_id, title, slug, description, "order")
VALUES (
  'b1b2c3d4-0001-4000-8000-000000000001',
  'a1b2c3d4-0001-4000-8000-000000000001',
  'Foundations of Sharpness',
  'foundations-of-sharpness',
  'Understand what "sharp" actually means, and how knife edges fail.',
  1
);

INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, "order") VALUES
('c1000001-0001-4000-8000-000000000001', 'b1b2c3d4-0001-4000-8000-000000000001', 'What is Sharpness?', 'what-is-sharpness', 'text',
'## What is Sharpness?

A truly sharp edge comes to a perfect **apex** — the two bevels meet at a zero-radius point. You can''t see it, because it''s thinner than light can reflect.

**The key insight:** Dull edges reflect light. Sharp ones disappear under a beam.

This is why the light test is so powerful. Hold your knife under a bright light and look at the edge. If you see any glints or reflections, those are spots where the edge has rounded over or chipped — it''s not truly sharp there.

A perfect apex is:
- Too thin to reflect light
- The result of two bevels meeting precisely
- What we''re always working toward with every sharpening session

### Your Primary Tool

Throughout this course, you''ll use the **Buck Tool 1×30 Low-Speed Belt Grinder** running at ~1,750 RPM. This is your sharpening platform.

### Grit Progression

1. **120 grit** Cubitron II (edge-leading) — shaping
2. **600 grit** Trizact A45 (edge-leading) — refining
3. **3000 grit** leather strop belt (edge-trailing) — polishing
4. **3000 grit** strop wheel (edge-trailing) — final polish

### Workspace Essentials

Keep these handy: Sharpie, water cup, gloves, safety glasses, notebook, and bright light.', 1),

('c1000001-0001-4000-8000-000000000002', 'b1b2c3d4-0001-4000-8000-000000000001', 'How Edges Go Dull', 'how-edges-go-dull', 'text',
'## How Edges Go Dull

Edges don''t just chip. Understanding *how* they fail helps you fix them faster and prevent premature dulling.

### Common Failure Modes

- **Rolling** — The edge folds over to one side. This is the most common cause of dullness in kitchen knives. The edge is still there, it''s just bent over.
- **Mushrooming** — The apex spreads and flattens, like the head of a nail that''s been struck too many times.
- **Micro-fracturing** — Tiny chips along the edge, common in harder steels. The edge looks jagged under magnification.
- **Abrasion** — Gradual wearing away of the apex from use. Softer steels are more prone to this.

### Why This Matters for Sharpening

Each failure mode calls for a different approach:
- A **rolled edge** can often be restored with just a strop
- A **mushroomed edge** needs 600 grit to reshape
- **Micro-fractures** need 120 grit to establish a clean new apex
- **Abrasion** is normal wear — regular touch-ups prevent it from getting bad

> Most kitchen knife dullness is caused by edge rolling or mushrooming, not chipping. This means most touch-ups are quicker than you think.', 2),

('c1000001-0001-4000-8000-000000000003', 'b1b2c3d4-0001-4000-8000-000000000001', 'Angles and Geometry', 'angles-and-geometry', 'text',
'## Angles and Geometry

The angle of your edge determines the balance between sharpness and durability.

### The Trade-Off

- **Lower angle** (e.g., 15°) = sharper edge, but less durable
- **Higher angle** (e.g., 25°) = more durable edge, but less sharp

### Common Angles by Knife Type

| Knife Type | Angle (per side) | Notes |
|------------|-----------------|-------|
| Japanese chef | 12–15° | Very sharp, needs care |
| Western chef | 17–20° | Good balance |
| Butcher/cleaver | 22–25° | Built for heavy work |
| Pocket knife | 20–25° | Durability priority |
| Razor | 10–12° | Maximum sharpness |

### Inclusive Angle vs. Per-Side Angle

When we say "15 degrees," we mean per side. The **inclusive angle** (both sides combined) would be 30°. Most sharpening references use per-side angles.

### Finding Your Current Angle

Use the Sharpie trick: color the bevel, make a pass on the belt, and see where the ink removes. If only the shoulder is ground, your angle is too low. If only the edge is ground, your angle is too high.', 3),

('c1000001-0001-4000-8000-000000000004', 'b1b2c3d4-0001-4000-8000-000000000001', 'Understanding Steel', 'understanding-steel', 'text',
'## Understanding Steel

Different steels behave differently on the belt. Knowing what you''re working with helps you choose the right approach.

### Soft vs. Hard Steel

- **Soft steel** (under 56 HRC) — Sharpens fast but dulls quickly. Common in budget knives. Forgiving to sharpen.
- **Hard steel** (58–62+ HRC) — Holds an edge longer but is harder to refine. Common in Japanese knives. Requires more patience.

### Common Kitchen Knife Steels

| Steel | Hardness | Character |
|-------|----------|-----------|
| AUS-8 | 56–58 HRC | Easy to sharpen, good all-rounder |
| VG-10 | 60–62 HRC | Takes a keen edge, holds it well |
| SG2/R2 | 62–64 HRC | Excellent edge retention, needs fine belts |
| German X50 | 54–56 HRC | Very forgiving, needs frequent touch-ups |

### What This Means for Belt Selection

- Soft steels respond well to 120 grit — don''t over-grind
- Hard steels need more passes at each grit but reward you with a longer-lasting edge
- Always finish with strop regardless of steel type

---

### Hands-On Exercise

Use a Sharpie to mark both sides of your knife''s bevel. Make a light pass on the belt and observe where the ink is removed. This tells you exactly where you''re making contact.

> **Reflection:** What surprised you about the Sharpie test? Was your existing edge more or less sharp than you thought?', 4);

-- Module 1 Quiz
INSERT INTO public.module_quizzes (id, module_id, questions, xp_reward) VALUES (
  'd1000001-0001-4000-8000-000000000001',
  'b1b2c3d4-0001-4000-8000-000000000001',
  '[
    {"id": "m1q1", "question": "What does it mean if the edge reflects light?", "options": ["It''s extremely sharp", "It''s dull — not a true apex", "It''s been over-polished", "The steel is too hard"], "correct": 1},
    {"id": "m1q2", "question": "What''s the difference between a 15° and 25° angle?", "options": ["15° is more durable", "25° is sharper", "15° is sharper but less durable", "There''s no practical difference"], "correct": 2},
    {"id": "m1q3", "question": "What causes most kitchen knife dullness?", "options": ["Chipping from hard foods", "Edge rolling or mushrooming", "Rust and corrosion", "Using the wrong cutting board"], "correct": 1},
    {"id": "m1q4", "question": "What''s the benefit of harder steel?", "options": ["Easier to sharpen", "Holds an edge longer", "More flexible", "Cheaper to produce"], "correct": 1},
    {"id": "m1q5", "question": "Why is a Sharpie useful during sharpening?", "options": ["To mark the handle", "To lubricate the belt", "It shows which part of the bevel you''re grinding", "To test sharpness"], "correct": 2}
  ]'::jsonb,
  25
);

-- ============================================================
-- MODULE 2: Safety & Setup
-- ============================================================
INSERT INTO public.modules (id, course_id, title, slug, description, "order")
VALUES (
  'b1b2c3d4-0002-4000-8000-000000000001',
  'a1b2c3d4-0001-4000-8000-000000000001',
  'Safety & Setup',
  'safety-and-setup',
  'Prepare your grinder and workspace for consistent, controlled sharpening.',
  2
);

INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, "order") VALUES
('c1000002-0001-4000-8000-000000000001', 'b1b2c3d4-0002-4000-8000-000000000001', 'Know Your Buck Tool', 'know-your-buck-tool', 'text',
'## Know Your Buck Tool

The **Buck Tool 1×30 Low-Speed Grinder** is your sharpening platform. It spins at approximately **1,750 RPM** — slow enough to control heat, fast enough to remove material efficiently.

### Why Low Speed Matters

High-speed grinders (3,000+ RPM) generate excessive heat that can:
- **Ruin the temper** of your blade (the steel loses its hardness)
- Make it impossible to control the grind
- Create a dangerous situation with thin blades

At 1,750 RPM, you have time to feel what the belt is doing and adjust your angle in real time.

### Parts of the Grinder

- **Platen** — The flat surface behind the belt. This is where you sharpen.
- **Drive wheel** — Powers the belt
- **Idler wheel** — Adjusts belt tension and tracking
- **Tracking knob** — Fine-tunes belt position

### Edge-Leading Method

We use **edge-leading sharpening** for cutting grits (120 and 600). This means the blade moves into the belt with the edge first. This method:
- Removes fatigued metal directly at the apex
- Avoids wire edges
- Creates a cleaner, stronger edge

**Edge-trailing** is only used for polishing (strop belt and strop wheel).', 1),

('c1000002-0001-4000-8000-000000000002', 'b1b2c3d4-0002-4000-8000-000000000001', 'Setting Up Your Station', 'setting-up-your-station', 'text',
'## Setting Up Your Station

A proper setup prevents mistakes and keeps you safe.

### Your Workspace Checklist

- **Water cup** — For cooling the blade between passes
- **Sharpie** — For bevel contact testing
- **Notebook** — Track your passes, grits, and results
- **Safety glasses** — Non-negotiable
- **Bright light** — Positioned to illuminate the edge
- **Clean surface** — Clear of clutter

### Station Layout

Set up your station so everything is within arm''s reach:
1. Grinder in the center of your workspace
2. Water cup on your dominant side
3. Sharpie and notebook within reach
4. Good overhead lighting angled toward the belt

### Before You Start Each Session

1. Check the belt for tears or worn spots
2. Verify tracking is centered
3. Test tension — belt should be snug but not over-tight
4. Have your safety glasses on
5. Mark your bevel with the Sharpie', 2),

('c1000002-0001-4000-8000-000000000003', 'b1b2c3d4-0002-4000-8000-000000000001', 'Tracking and Tension', 'tracking-and-tension', 'text',
'## Tracking and Tension

Proper belt tracking ensures even material removal across the full width of the belt.

### Tracking

- Use the **tracking knob** on the idler wheel
- Turn the grinder on and watch the belt
- Adjust until the belt runs **centered** on both wheels
- Small adjustments make a big difference — go slowly

### Tension

- The belt should be **snug but not over-tight**
- Too loose: the belt slips and wanders
- Too tight: excess heat, premature belt wear, and loss of feel
- You should be able to press the belt slightly with your thumb

### Signs of Bad Tracking

- Belt wandering to one side
- Uneven wear patterns on the belt
- One edge of the belt lifting off the platen
- Grinding only happening on one side of the belt

> **Tip:** Check tracking every time you change belts. Different belts may track differently.', 3),

('c1000002-0001-4000-8000-000000000004', 'b1b2c3d4-0002-4000-8000-000000000001', 'Heat Management', 'heat-management', 'text',
'## Heat Management

Heat is the enemy of a good edge. Overheating can permanently damage your blade.

### The Touch Test

If the blade is **hot to the touch**, you''ve overheated it. Stop immediately and cool it in water.

### What Happens When Steel Overheats

- The **temper** is ruined — the steel softens permanently
- **Blueing** appears — a blue/purple discoloration near the edge
- The edge won''t hold — no matter how sharp you get it, it''ll dull instantly

### Prevention Strategies

1. **Light pressure** — let the belt do the work
2. **Short passes** — 1–2 seconds maximum per pass
3. **Dunk frequently** — cool the blade in water between passes
4. **Watch for color changes** — any discoloration means you''ve gone too far
5. **Slow down** — speed is the enemy of heat control

### Recovery

If you''ve overheated a section:
- The damaged area must be ground past (removed entirely)
- This means starting over with 120 grit in that spot
- Prevention is always better than recovery

---

### Hands-On Exercise

Practice tracking adjustment and make test passes on scrap metal. Get comfortable with the machine before working on a real knife.

> **Reflection:** What did you learn from belt sound and heat behavior?', 4);

-- Module 2 Quiz
INSERT INTO public.module_quizzes (id, module_id, questions, xp_reward) VALUES (
  'd1000002-0001-4000-8000-000000000001',
  'b1b2c3d4-0002-4000-8000-000000000001',
  '[
    {"id": "m2q1", "question": "Why use a low-speed grinder?", "options": ["It''s cheaper", "Reduces heat and preserves temper", "It''s quieter", "Removes more material"], "correct": 1},
    {"id": "m2q2", "question": "What direction should the belt spin for cutting grits?", "options": ["Edge-trailing (away from edge)", "Edge-leading (toward the edge)", "It doesn''t matter", "Alternating directions"], "correct": 1},
    {"id": "m2q3", "question": "What does blueing on steel indicate?", "options": ["A sharp edge", "High-quality steel", "Overheating of the steel", "Normal belt contact"], "correct": 2},
    {"id": "m2q4", "question": "What tool do you use to test bevel contact?", "options": ["A caliper", "A Sharpie shows bevel contact", "A flashlight", "A magnifying glass"], "correct": 1},
    {"id": "m2q5", "question": "What are two signs of overheating?", "options": ["Sparks and smoke", "Blade too hot to touch and discoloration", "Belt slipping and noise", "Water boiling and steam"], "correct": 1}
  ]'::jsonb,
  25
);

-- ============================================================
-- MODULE 3: Know Your Blade
-- ============================================================
INSERT INTO public.modules (id, course_id, title, slug, description, "order")
VALUES (
  'b1b2c3d4-0003-4000-8000-000000000001',
  'a1b2c3d4-0001-4000-8000-000000000001',
  'Know Your Blade',
  'know-your-blade',
  'Understand how blade geometry affects sharpening and cutting feel.',
  3
);

INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, "order") VALUES
('c1000003-0001-4000-8000-000000000001', 'b1b2c3d4-0003-4000-8000-000000000001', 'Blade Anatomy', 'blade-anatomy', 'text',
'## Blade Anatomy

Before you can sharpen effectively, you need to know the parts of your knife.

### Key Parts

- **Spine** — The thick top edge of the blade. Never sharp.
- **Bevel** — The angled surface that leads to the cutting edge. This is what you sharpen.
- **Choil** — The unsharpened notch where the blade meets the handle. Provides clearance for sharpening and marks where the cutting edge ends.
- **Plunge line** — Where the bevel begins, transitioning from the flat of the blade.
- **Belly** — The curved section of the edge, used for rocking cuts.
- **Heel** — The rear part of the cutting edge, closest to the handle. Used for heavy cuts.
- **Tip** — The front point of the blade. Used for detail work and initiating slices.

### Why Anatomy Matters for Sharpening

Different parts of the blade require different attention:
- The **tip** is the most delicate — use light pressure
- The **belly** needs consistent arc motion on the belt
- The **heel** is thicker and can handle more pressure
- The **choil** tells you where to stop your pass', 1),

('c1000003-0001-4000-8000-000000000002', 'b1b2c3d4-0003-4000-8000-000000000001', 'Grind Types', 'grind-types', 'text',
'## Grind Types

The grind of your knife determines how it cuts and how you should sharpen it.

### Common Grinds

**Flat Grind**
- The blade tapers continuously from spine to edge
- Common on chef''s knives
- Good balance of cutting ability and strength
- Sharpen on the flat platen

**Hollow Grind**
- Concave surface, creating a very thin edge
- Used on razors and some hunting knives
- Extremely sharp but fragile
- Requires a contact wheel or radiused platen

**Scandi Grind**
- One wide bevel from shoulder to edge, no microbevel
- Common on bushcraft and woodworking knives
- The entire bevel is the sharpening surface
- Ride the full bevel flat on the platen

**Convex Grind**
- Outward-curved surface from spine to edge
- The most durable grind — supports the edge under heavy use
- Used on axes and heavy-duty knives
- Sharpen on a slack (unsupported) belt

### Which Grind Do You Have?

Look at your knife from the spine down. The profile tells you the grind type. If in doubt, lay the blade flat on the platen and observe the gap pattern.', 2),

('c1000003-0001-4000-8000-000000000003', 'b1b2c3d4-0003-4000-8000-000000000001', 'Thickness Behind the Edge', 'thickness-behind-the-edge', 'text',
'## Thickness Behind the Edge

Sharpness isn''t just about the edge — it''s also about what''s behind it.

### Why Thickness Matters

- **Thin behind the edge** = the knife glides through food
- **Thick behind the edge** = the knife wedges and splits, even if the very edge is sharp

A knife can be razor-sharp at the apex but still perform poorly if the shoulder (the area just above the edge) is too thick.

### Thinning = Performance Boost

Thinning removes material from the shoulder area, reducing the overall thickness behind the cutting edge. This is one of the most impactful things you can do to improve a knife''s cutting performance.

### When to Thin

- When slicing feels like splitting or wedging
- When food sticks to the blade
- When the knife has been sharpened many times (each sharpening makes the blade thicker behind the edge)

### How to Check

- Use calipers to measure thickness at 1mm and 5mm above the edge
- Visually: a thick knife will have a visible "shoulder" above the bevel

---

### Hands-On Exercise

Label the parts of your knife. Inspect the grind type. Draw the bevel shape from the spine down.

> **Reflection:** What surprised you about your knife''s geometry?', 3);

-- Module 3 Quiz
INSERT INTO public.module_quizzes (id, module_id, questions, xp_reward) VALUES (
  'd1000003-0001-4000-8000-000000000001',
  'b1b2c3d4-0003-4000-8000-000000000001',
  '[
    {"id": "m3q1", "question": "What''s the purpose of the choil?", "options": ["To protect your fingers", "Provides clearance for sharpening and marks where the cutting edge ends", "To hang the knife", "Decoration"], "correct": 1},
    {"id": "m3q2", "question": "How is a Scandi grind different from a flat grind?", "options": ["Scandi is concave", "Scandi has one wide bevel from shoulder to edge, while flat tapers continuously", "They''re the same thing", "Flat grind is for bushcraft knives"], "correct": 1},
    {"id": "m3q3", "question": "What does ''thinning behind the edge'' mean?", "options": ["Making the blade shorter", "Removing material just above the edge to reduce wedging", "Sharpening at a lower angle", "Polishing the flat of the blade"], "correct": 1},
    {"id": "m3q4", "question": "Which grind is most durable?", "options": ["Hollow grind", "Flat grind", "Scandi grind", "Convex grind"], "correct": 3},
    {"id": "m3q5", "question": "What part of the knife initiates the slice?", "options": ["The heel", "The spine", "The tip", "The choil"], "correct": 2}
  ]'::jsonb,
  25
);

-- ============================================================
-- MODULE 4: Belt Control & Body Mechanics
-- ============================================================
INSERT INTO public.modules (id, course_id, title, slug, description, "order")
VALUES (
  'b1b2c3d4-0004-4000-8000-000000000001',
  'a1b2c3d4-0001-4000-8000-000000000001',
  'Belt Control & Body Mechanics',
  'belt-control-body-mechanics',
  'Learn how to guide the blade across the belt consistently, using edge-leading strokes.',
  4
);

INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, "order") VALUES
('c1000004-0001-4000-8000-000000000001', 'b1b2c3d4-0004-4000-8000-000000000001', 'Your Stance', 'your-stance', 'text',
'## Your Stance

Good sharpening starts with your body, not your hands.

### The Basics

- Stand **square** to the grinder, feet shoulder-width apart
- Your **blade hand** pushes the knife across the belt
- Your **support hand** stabilizes the spine or the back of the blade
- Stay **relaxed** — tension causes inconsistency
- Keep **wrists straight** — bent wrists change your angle

### Weight Distribution

- Even weight on both feet
- Slight lean forward toward the grinder
- Don''t reach — if you''re stretching, move closer

### Grip

- Hold the blade near the choil for maximum control
- Pinch grip for chef''s knives
- Support hand on the spine near the tip
- Light grip — death grip = inconsistent pressure', 1),

('c1000004-0001-4000-8000-000000000002', 'b1b2c3d4-0004-4000-8000-000000000001', 'Pass Mechanics', 'pass-mechanics', 'text',
'## Pass Mechanics

Each pass should be smooth, controlled, and intentional.

### The Motion

1. Start with the **heel** on the belt, tip off
2. Sweep in a **fluid arc** toward the tip
3. Each pass should take **1–2 seconds** maximum
4. **Consistent pressure** = even bevel

### Key Principles

- **Light pressure** — let the belt do the cutting
- **Full edge contact** — don''t skip the belly curve
- **Consistent speed** — don''t rush or slow down mid-pass
- **Same angle** — lock your wrists and move from the shoulder

### Common Mistakes

- Pressing too hard (grinds unevenly, generates heat)
- Lifting the tip at the end of the pass (leaves the tip dull)
- Changing angle mid-pass (creates multiple bevels)
- Going too fast (loss of control)
- Going too slow (excessive heat in one spot)', 2),

('c1000004-0001-4000-8000-000000000003', 'b1b2c3d4-0004-4000-8000-000000000001', 'Audible Feedback', 'audible-feedback', 'text',
'## Audible Feedback

The sound of your sharpening tells you everything.

### What to Listen For

- **Hiss** = even, full contact between the bevel and the abrasive. This is the sound you want.
- **Growl** = too much pressure. You''re pushing too hard into the belt.
- **Silence** = you''re off the belt. No contact means no sharpening.
- **Screech** = metal-on-metal. Your belt might be worn through.

### Using Sound to Improve

Once you learn to hear the difference, you can sharpen by sound as much as by feel:
- Maintain the "hiss" throughout each pass
- If it turns to a growl, lighten up
- If it goes silent, check your angle and contact

> Sound is one of your best feedback tools. Close your eyes and just listen during a few practice passes — you''ll be surprised how much information is in the sound.', 3),

('c1000004-0001-4000-8000-000000000004', 'b1b2c3d4-0004-4000-8000-000000000001', 'Burr Symmetry', 'burr-symmetry', 'text',
'## Burr Symmetry

Even grinding on both sides is essential for a centered edge.

### The Rule

- Alternate sides **every 2–3 passes**
- Use your **fingernail** to feel for burr formation
- Never overdo one side — asymmetry weakens the edge

### Checking Symmetry

Run your fingernail perpendicular to the edge, from spine toward the cutting edge:
- A burr will "catch" your nail on the opposite side from where you were grinding
- The burr should be consistent along the full length of the edge
- If the burr is only on part of the edge, you need more passes on that section

### Why Symmetry Matters

An asymmetric grind:
- Pulls the knife to one side during cutting
- Creates a weaker edge on the over-ground side
- Results in a less durable edge overall

---

### Hands-On Exercise

Perform 10 passes each side, using Sharpie to verify contact pattern after each set.

> **Reflection:** Did the motion feel smooth or shaky? What can you adjust?', 4);

-- Module 4 Quiz
INSERT INTO public.module_quizzes (id, module_id, questions, xp_reward) VALUES (
  'd1000004-0001-4000-8000-000000000001',
  'b1b2c3d4-0004-4000-8000-000000000001',
  '[
    {"id": "m4q1", "question": "What does a ''hiss'' sound indicate?", "options": ["Too much pressure", "Full, even contact between bevel and abrasive", "Belt is worn out", "Blade is overheating"], "correct": 1},
    {"id": "m4q2", "question": "What angle should your wrists be?", "options": ["Bent downward", "Bent upward", "Neutral and aligned with forearms", "It doesn''t matter"], "correct": 2},
    {"id": "m4q3", "question": "What happens if you sharpen one side too long?", "options": ["Edge gets sharper", "Over-grinding causes asymmetry and pulls edge off-center", "Belt wears unevenly", "Nothing significant"], "correct": 1},
    {"id": "m4q4", "question": "What tool helps verify bevel contact?", "options": ["Water", "A Sharpie on the bevel shows where abrasive is hitting", "Magnifying glass", "Belt eraser"], "correct": 1},
    {"id": "m4q5", "question": "How long should a belt pass last?", "options": ["5–10 seconds", "As fast as possible", "Smooth and controlled, 1–2 seconds", "Until you feel heat"], "correct": 2}
  ]'::jsonb,
  25
);

-- ============================================================
-- MODULE 5: Burr Control
-- ============================================================
INSERT INTO public.modules (id, course_id, title, slug, description, "order")
VALUES (
  'b1b2c3d4-0005-4000-8000-000000000001',
  'a1b2c3d4-0001-4000-8000-000000000001',
  'Burr Control',
  'burr-control',
  'Learn how to form a burr at 120 grit, then chase and shrink it at 600 grit.',
  5
);

INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, "order") VALUES
('c1000005-0001-4000-8000-000000000001', 'b1b2c3d4-0005-4000-8000-000000000001', 'What is a Burr?', 'what-is-a-burr', 'text',
'## What is a Burr?

A burr is a **folded-over lip of steel** that proves your bevels have met at the apex.

### Why the Burr Matters

The burr is your confirmation signal. When you feel a burr along the entire length of the edge, you know:
- Your grinding angle is correct
- You''ve reached the apex
- Both bevels have met

### What a Burr Feels Like

- Run your fingernail from the spine toward the edge
- On the side opposite to where you were grinding, you''ll feel a tiny "catch"
- It feels like a thin wire or foil hanging off the edge
- The burr should be consistent from heel to tip

### Burr vs. Wire Edge

- A **burr** is formed deliberately and is small — this is what we want
- A **wire edge** is a large, floppy burr that folds back and forth — this means you''ve over-ground

> The goal is to form the **smallest burr possible** that still confirms apex contact.', 1),

('c1000005-0001-4000-8000-000000000002', 'b1b2c3d4-0005-4000-8000-000000000001', 'Form the Burr (120 Grit)', 'form-the-burr', 'text',
'## Form the Burr (120 Grit)

The 120 grit Cubitron II belt is your shaping grit. This is where you establish the geometry.

### Process

1. Mount the **120 grit Cubitron II** belt
2. Mark bevel with Sharpie
3. Use **edge-leading** passes
4. **Light pressure** — let the belt cut
5. Alternate sides every 2–3 passes
6. After each set, feel for burr with your fingernail or cloth

### How Many Passes?

It depends on how dull the knife is:
- Light touch-up: 3–5 passes per side
- Moderate resharpening: 7–10 passes per side
- Major repair: 15+ passes per side

### When to Stop

Stop grinding at 120 when:
- You feel a consistent burr along the entire edge
- Sharpie is completely removed from the bevel
- The bevel width is even from heel to tip

> **Key:** More is not better at 120. Once you have a burr, stop. Every extra pass removes steel you can''t put back.', 2),

('c1000005-0001-4000-8000-000000000003', 'b1b2c3d4-0005-4000-8000-000000000001', 'Shrink the Burr (600 Grit)', 'shrink-the-burr', 'text',
'## Shrink the Burr (600 Grit)

The 600 grit Trizact belt refines the scratch pattern and reduces the burr.

### Process

1. Switch to the **600 grit Trizact A45** belt
2. Use **half the pressure** you used at 120
3. Continue edge-leading passes
4. Alternate sides every 2–3 passes
5. Feel for the burr shrinking with each set

### What Happens at 600

- The coarse 120-grit scratch pattern is replaced with a finer one
- The burr gets smaller and more flexible
- The edge starts to feel sharp, not just ground

### When to Stop

Stop at 600 when:
- The burr is barely perceptible
- The scratch pattern is uniform and fine
- The edge feels smooth when you run your nail across it (perpendicular to the edge)

> If the burr disappears completely at 600, you may have over-refined. A tiny burr should remain for the strop to clean up.', 3),

('c1000005-0001-4000-8000-000000000004', 'b1b2c3d4-0005-4000-8000-000000000001', 'Detecting & Centering', 'detecting-and-centering', 'text',
'## Detecting & Centering the Burr

A centered burr means you''re ready for the final polish.

### How to Detect

- **Fingernail test** — Slide your nail from spine to edge. The burr catches on the opposite side.
- **Cloth test** — Drag a piece of fabric across the edge. The burr will catch fibers.
- **Light test** — Under bright light, a burr will show as a thin line of reflection.

### Centering the Burr

The goal is to get the burr to **flip evenly** from side to side:

1. Make 2 passes on one side
2. Check — burr should flip to the other side
3. Make 2 passes on the opposite side
4. Check — burr flips back
5. Reduce to 1 pass per side
6. When the burr is centered and minimal, you''re ready for stropping

### Signs You''re Ready for Strop

- Burr is tiny and centered
- Scratch pattern from 600 is uniform
- Edge is starting to feel sharp
- No Sharpie remains on the bevel

---

### Hands-On Exercise

Record the number of passes needed to form a burr at 120, and track how it behaves at 600.

> **Reflection:** What part of burr control was hardest?', 4);

-- Module 5 Quiz
INSERT INTO public.module_quizzes (id, module_id, questions, xp_reward) VALUES (
  'd1000005-0001-4000-8000-000000000001',
  'b1b2c3d4-0005-4000-8000-000000000001',
  '[
    {"id": "m5q1", "question": "What causes a burr?", "options": ["Belt friction", "Grinding pushes steel past the edge and folds it over", "Overheating the blade", "Using too fine a grit"], "correct": 1},
    {"id": "m5q2", "question": "Why do we switch from 120 to 600?", "options": ["120 is too aggressive", "To refine the scratch pattern and strengthen the edge", "600 is cheaper", "To change belt direction"], "correct": 1},
    {"id": "m5q3", "question": "What does a large burr indicate?", "options": ["Perfect sharpening", "You removed more steel than necessary", "The steel is too soft", "You need a coarser grit"], "correct": 1},
    {"id": "m5q4", "question": "What''s the most reliable burr detector?", "options": ["Magnifying glass", "Your fingertip lightly brushed from spine to edge", "A flashlight", "Sound from the belt"], "correct": 1},
    {"id": "m5q5", "question": "How do you know when to stop at 120 grit?", "options": ["Count to 50 passes", "When burr runs full length and bevels are even", "When the belt slows down", "When sparks appear"], "correct": 1}
  ]'::jsonb,
  25
);

-- ============================================================
-- MODULE 6: Polishing & Stropping
-- ============================================================
INSERT INTO public.modules (id, course_id, title, slug, description, "order")
VALUES (
  'b1b2c3d4-0006-4000-8000-000000000001',
  'a1b2c3d4-0001-4000-8000-000000000001',
  'Polishing & Stropping',
  'polishing-and-stropping',
  'Use strop belt and strop wheel to polish and refine the apex to a mirror finish.',
  6
);

INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, "order") VALUES
('c1000006-0001-4000-8000-000000000001', 'b1b2c3d4-0006-4000-8000-000000000001', 'Strop Belt', 'strop-belt', 'text',
'## Strop Belt

The leather strop belt with compound is where your edge transforms from sharp to razor-sharp.

### Setup

- Use a **3000 grit leather belt** loaded with green or white compound
- **Edge-trailing only** — the blade moves away from the edge
- This is the opposite of your cutting grits!

### Technique

- **5–10 feather-light passes** per side
- Almost no pressure — the weight of the blade is enough
- Smooth, even strokes
- Alternate sides every pass or two

### What Happens During Stropping

- The remaining micro-burr is removed
- The scratch pattern from 600 grit is polished
- The apex is aligned and straightened
- Steel is burnished to a smooth finish

### Common Mistakes

- Too much pressure (rounds the apex)
- Edge-leading on the strop (cuts the leather, creates a wire edge)
- Too many passes (over-polishing)

> The strop belt is about finesse, not force. Think of it as polishing, not grinding.', 1),

('c1000006-0001-4000-8000-000000000002', 'b1b2c3d4-0006-4000-8000-000000000001', 'Strop Wheel', 'strop-wheel', 'text',
'## Strop Wheel

The strop wheel is your final polish — the last thing that touches the edge.

### Technique

- **Edge-trailing** — always trail the edge
- **2–5 seconds per side**
- Feather-light pressure
- Don''t overheat the tip — the strop wheel generates more heat than the belt

### Purpose

The strop wheel:
- Removes any remaining sub-micron burr
- Creates a mirror polish on the apex
- Aligns the very tip of the edge
- Produces "scary sharp" results

### Tips

- Less is more — 2–3 passes per side is usually sufficient
- Keep the blade moving — don''t hold it in one spot
- The tip heats up fast — be extra careful there
- Re-apply compound periodically

> After the strop wheel, your knife should be able to shave arm hair cleanly.', 2),

('c1000006-0001-4000-8000-000000000003', 'b1b2c3d4-0006-4000-8000-000000000001', 'Sharpness Tests', 'sharpness-tests', 'text',
'## Sharpness Tests

How do you know when you''re done? Test it.

### The Four Tests

**1. Paper Test**
- Hold a sheet of paper and slice downward
- A sharp knife cuts cleanly without tearing
- A dull knife catches, rips, or folds the paper

**2. Tomato Test**
- Place a tomato on the board
- The knife should bite into the skin under its own weight
- No downward pressure needed for initial contact

**3. Arm Hair Shave Test**
- Carefully try shaving a small patch of arm hair
- A truly sharp edge will shave cleanly
- This is the "scary sharp" benchmark

**4. Fingernail Bite Test**
- Gently rest the edge on your fingernail at a 45° angle
- A sharp edge will "bite" and stick
- A dull edge will slide off

### Grading Your Results

| Test | Grade |
|------|-------|
| Fails paper test | Needs more work at 120/600 |
| Passes paper, fails tomato | Needs more stropping |
| Passes paper + tomato | Good working edge |
| Shaves arm hair | Excellent — scary sharp |

---

### Hands-On Exercise

Polish your edge through the full strop sequence and test it all three ways.

> **Reflection:** What difference did stropping make compared to 600 grit alone?', 3);

-- Module 6 Quiz
INSERT INTO public.module_quizzes (id, module_id, questions, xp_reward) VALUES (
  'd1000006-0001-4000-8000-000000000001',
  'b1b2c3d4-0006-4000-8000-000000000001',
  '[
    {"id": "m6q1", "question": "Can you over-strop?", "options": ["No, stropping is always safe", "Yes — you can over-polish and round the apex", "Only with green compound", "Only on soft steels"], "correct": 1},
    {"id": "m6q2", "question": "What other methods can remove minor burrs?", "options": ["Only belt grinders", "Newspaper or cork can gently clean up minor burrs", "Sandpaper only", "Nothing besides the strop"], "correct": 1},
    {"id": "m6q3", "question": "Should you skip burr removal before stropping?", "options": ["Yes, the strop handles it", "No — always test for burrs before final polish", "Only for hard steels", "It depends on the grit"], "correct": 1},
    {"id": "m6q4", "question": "What direction do you strop?", "options": ["Edge-leading", "Edge-trailing", "Alternating", "Sideways"], "correct": 1},
    {"id": "m6q5", "question": "How should the apex look when properly finished?", "options": ["Bright and reflective", "Light should not reflect if edge is apexed cleanly", "Blue-tinted", "Slightly rough"], "correct": 1}
  ]'::jsonb,
  25
);

-- ============================================================
-- MODULE 7: Specialty Grinds
-- ============================================================
INSERT INTO public.modules (id, course_id, title, slug, description, "order")
VALUES (
  'b1b2c3d4-0007-4000-8000-000000000001',
  'a1b2c3d4-0001-4000-8000-000000000001',
  'Specialty Grinds',
  'specialty-grinds',
  'Apply your sharpening technique to non-flat bevels: Scandi, hollow, convex.',
  7
);

INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, "order") VALUES
('c1000007-0001-4000-8000-000000000001', 'b1b2c3d4-0007-4000-8000-000000000001', 'Scandi Grind', 'scandi-grind', 'text',
'## Scandi Grind

The Scandi grind is the simplest to sharpen — and one of the easiest to ruin.

### What Makes Scandi Different

- **One wide bevel** from shoulder to edge
- **No microbevel** — the full bevel IS the cutting edge
- Common on bushcraft knives, carving knives, and Scandinavian-style blades

### Sharpening Technique

1. Lay the **entire bevel flat** on the platen
2. The bevel acts as its own guide — ride it flat
3. Use edge-leading passes with light pressure
4. Don''t lift or change the angle — the bevel tells you where to be
5. Follow the same 120 → 600 → strop progression

### Common Mistakes

- Adding a microbevel (changes the grind entirely)
- Over-grinding one spot (creates a concavity)
- Too much pressure (digs into the belt)

> The Scandi grind is self-jigging — the bevel itself tells you the correct angle. Just lay it flat and let it ride.', 1),

('c1000007-0001-4000-8000-000000000002', 'b1b2c3d4-0007-4000-8000-000000000001', 'Convex Grind', 'convex-grind', 'text',
'## Convex Grind

The convex grind produces the strongest, most durable edge — but requires a different technique.

### Setup

- Use a **slack belt** (belt not backed by the platen)
- The unsupported belt naturally creates a convex profile

### Technique

1. Use a **rocking motion** from spine to edge
2. Smooth, continuous blend
3. Light pressure — let the belt flex
4. Follow the natural curve of the blade
5. Alternate sides frequently

### Why Convex?

- Maximum steel behind the edge = maximum durability
- Great for axes, choppers, and heavy-use knives
- Self-sharpening tendency — the convex profile wears evenly

### Checking Your Work

- The transition from flat to edge should be smooth with no visible line
- Run your thumb across the bevel — it should feel like a continuous curve', 2),

('c1000007-0001-4000-8000-000000000003', 'b1b2c3d4-0007-4000-8000-000000000001', 'Hollow Grind', 'hollow-grind', 'text',
'## Hollow Grind

The hollow grind creates the thinnest, sharpest edge possible — but requires specific equipment.

### Equipment Needed

- A **contact wheel** (6–8" diameter) or radiused platen
- The wheel''s curvature creates the concave bevel

### Technique

1. Apply **even pressure** across the bevel
2. Use the 120 → 600 → polish progression
3. Keep passes smooth and consistent
4. The contact wheel does the geometry work — you just guide the blade

### Why Hollow?

- Extremely thin behind the edge
- Used on razors, filleting knives, and precision cutting tools
- Maximum sharpness, minimum durability

### Risks

- Very fragile — can chip on hard materials
- Easy to overheat the thin edge
- Requires more maintenance than other grinds

---

### Hands-On Exercise

If you have the equipment, try one of each grind type on practice pieces.

> **Reflection:** Which grind felt easiest to execute?', 3);

-- Module 7 Quiz
INSERT INTO public.module_quizzes (id, module_id, questions, xp_reward) VALUES (
  'd1000007-0001-4000-8000-000000000001',
  'b1b2c3d4-0007-4000-8000-000000000001',
  '[
    {"id": "m7q1", "question": "What''s the risk of rolling a Scandi edge?", "options": ["Belt damage", "The edge can roll easily — use light pressure and steady angle", "Nothing special", "The handle loosens"], "correct": 1},
    {"id": "m7q2", "question": "What kind of belt setup for convex grind?", "options": ["Tight on platen", "Use a slack belt for proper curvature", "Only strop belts", "Any setup works"], "correct": 1},
    {"id": "m7q3", "question": "What''s the benefit of a hollow grind?", "options": ["Most durable edge", "Provides a razor-sharp, thin edge ideal for slicing", "Easiest to sharpen", "Best for chopping"], "correct": 1},
    {"id": "m7q4", "question": "Which grind gives the strongest edge?", "options": ["Hollow", "Flat", "Scandi", "Convex"], "correct": 3},
    {"id": "m7q5", "question": "How do you keep a convex grind smooth?", "options": ["Use a flat platen", "Regular stropping on a slack belt", "Only use 120 grit", "Don''t sharpen it"], "correct": 1}
  ]'::jsonb,
  25
);

-- ============================================================
-- MODULE 8: Thinning & Hollow Grinding on the 2x42
-- ============================================================
INSERT INTO public.modules (id, course_id, title, slug, description, "order")
VALUES (
  'b1b2c3d4-0008-4000-8000-000000000001',
  'a1b2c3d4-0001-4000-8000-000000000001',
  'Thinning & Hollow Grinding on the 2x42',
  'thinning-and-hollow-grinding',
  'Understand how to thin blades and apply a controlled hollow grind using a radiused platen on a 2x42 belt grinder.',
  8
);

INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, "order") VALUES
('c1000008-0001-4000-8000-000000000001', 'b1b2c3d4-0008-4000-8000-000000000001', 'Why Use a 2x42', 'why-use-2x42', 'text',
'## Why Use a 2x42 for Thinning and Hollow Grinds

The 2x42 belt grinder offers advantages over the 1x30 for specific tasks.

### Advantages

- **Larger belt and motor** manage heat better than a 1x30
- **Radiused platen** allows controlled, shallow concave bevels
- **More stable platform** for consistent geometry
- **Wider belt** means more contact area and faster material removal

### When to Use the 2x42

- Blade thinning (removing shoulder material)
- Hollow grinding with controlled geometry
- Working on larger blades that need more belt coverage
- Heavy material removal tasks

### When to Stick with the 1x30

- Standard edge sharpening (120 → 600 → strop)
- Touch-up work
- Smaller blades and detail work
- Learning fundamentals', 1),

('c1000008-0001-4000-8000-000000000002', 'b1b2c3d4-0008-4000-8000-000000000001', 'Blade Thinning', 'blade-thinning-technique', 'text',
'## Blade Thinning

Thinning removes material from behind the edge to improve cutting performance.

### Purpose

Reduce material behind the edge for better slicing. A knife that has been sharpened many times will develop a thick shoulder that causes wedging.

### Method

1. Use **120-grit Cubitron belt** on the flat platen
2. Angle just above the bevel — approximately **10–15°**
3. **Dunk often** to cool the blade
4. Monitor symmetry, thickness, and edge formation

### Key Considerations

- Work **evenly on both sides** to maintain balance
- Check thickness frequently with calipers if available
- Target: 0.010–0.020" thickness behind the edge
- Don''t thin all the way to the edge — leave the final edge work for your normal sharpening progression

### When You''ve Gone Far Enough

- The knife glides through food without wedging
- Cross-section shows a smooth taper from spine to edge
- Both sides are symmetrical

> Thinning is one of the most impactful improvements you can make to a knife''s performance.', 2),

('c1000008-0001-4000-8000-000000000003', 'b1b2c3d4-0008-4000-8000-000000000001', 'Hollow Grinding with a Radiused Platen', 'hollow-grinding-radiused-platen', 'text',
'## Hollow Grinding with a Radiused Platen

A radiused platen creates controlled, consistent hollow grinds without a contact wheel.

### Setup

- Use a **radiused steel or ceramic platen** (approx. 6–10" radius)
- Adjust tracking and tension for even contact
- Start with 120 grit for shaping

### Technique

1. Grind **spine-to-edge** in smooth, even passes
2. **Alternate sides** every 2–3 passes
3. Let the belt **flex into the curve** naturally
4. Use consistent, light pressure
5. The platen radius determines the depth of the hollow

### Controlling the Grind

- Wider radius = shallower hollow (more durable)
- Tighter radius = deeper hollow (sharper but more fragile)
- The platen does the geometry — you control the consistency', 3),

('c1000008-0001-4000-8000-000000000004', 'b1b2c3d4-0008-4000-8000-000000000001', 'Finishing the Grind', 'finishing-the-grind', 'text',
'## Finishing the Grind

After shaping at 120, refine the surface for a clean, professional finish.

### Progression

1. **Refine with 600-grit** Trizact or similar
2. **Strop with 3000-grit** leather belt or wheel
3. Optional: blend transition lines for a polished finish

### Blending Transition Lines

If there are visible transition lines between the ground area and the original surface:
- Use a worn 600-grit belt with very light pressure
- Feather the edges of the grind zone
- Work gradually — you can always remove more but can''t add back', 4),

('c1000008-0001-4000-8000-000000000005', 'b1b2c3d4-0008-4000-8000-000000000001', 'Quality Control', 'quality-control', 'text',
'## Quality Control

Before calling a blade "done," verify your work meets these standards.

### Inspection Checklist

- **Thickness behind edge**: 0.010–0.020" (use calipers)
- **Bevel symmetry**: both sides should mirror each other
- **Scratch pattern**: uniform and consistent from heel to tip
- **Final passes**: should be low-pressure and clean

### Visual Inspection

- Hold the blade under a bright light
- Check for uneven spots, high/low areas, and scratch inconsistencies
- The bevel should be a consistent width from heel to tip

### Performance Test

- The paper test and tomato test should pass
- The blade should feel balanced and cut straight (not veer to one side)

> Quality control isn''t optional — it''s how you build confidence in your work and catch mistakes before they become problems.', 5);

-- Module 8 Quiz
INSERT INTO public.module_quizzes (id, module_id, questions, xp_reward) VALUES (
  'd1000008-0001-4000-8000-000000000001',
  'b1b2c3d4-0008-4000-8000-000000000001',
  '[
    {"id": "m8q1", "question": "What tool creates the hollow grind in this method?", "options": ["Contact wheel", "Slack belt", "Radiused platen", "File jig"], "correct": 2},
    {"id": "m8q2", "question": "What is the purpose of thinning a blade?", "options": ["Reduce blade height", "Improve edge performance", "Remove patina", "Soften steel"], "correct": 1},
    {"id": "m8q3", "question": "What can happen with too much pressure during hollow grinding?", "options": ["Convex grind forms", "Belt wears out", "Overheating or edge collapse", "Handle detaches"], "correct": 2}
  ]'::jsonb,
  25
);

-- ============================================================
-- MODULE 9: Maintenance & Logging
-- ============================================================
INSERT INTO public.modules (id, course_id, title, slug, description, "order")
VALUES (
  'b1b2c3d4-0009-4000-8000-000000000001',
  'a1b2c3d4-0001-4000-8000-000000000001',
  'Maintenance & Logging',
  'maintenance-and-logging',
  'Keep your tools sharp and your sharpening habits consistent.',
  9
);

INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, "order") VALUES
('c1000009-0001-4000-8000-000000000001', 'b1b2c3d4-0009-4000-8000-000000000001', 'Touch-Up Routine', 'touch-up-routine', 'text',
'## Touch-Up Routine

A regular maintenance schedule keeps your knives performing at their best with minimal effort.

### The Quick Touch-Up

For knives that are still sharp but starting to feel slightly less keen:

1. **600 grit** — 3–5 passes per side, edge-leading
2. **Strop belt** — 5 passes per side, edge-trailing
3. **Strop wheel** — 2–3 seconds per side

That''s it. A 2-minute process that keeps you ahead of dullness.

### Frequency

- **Home kitchen knives**: Every 2–3 weeks, or as needed
- **Professional kitchen**: Weekly or more frequently
- **Pocket/outdoor knives**: After each heavy use session

### When a Touch-Up Isn''t Enough

If the touch-up doesn''t restore sharpness, you need to go back to 120 grit and rebuild the edge. Signs:
- Visible damage or chips
- Edge reflects light despite stropping
- Touch-up doesn''t improve cutting

> **The best time to sharpen is before the knife gets dull.** Regular touch-ups mean you rarely need to do a full resharpening.', 1),

('c1000009-0001-4000-8000-000000000002', 'b1b2c3d4-0009-4000-8000-000000000001', 'Belt Maintenance', 'belt-maintenance', 'text',
'## Belt Maintenance

Your belts are precision tools. Take care of them and they''ll take care of your edges.

### Cleaning

- Use a **belt eraser** (abrasive cleaning stick) to remove metal particles
- Clean belts cut cooler and more consistently
- Clean after every few knives, or when you notice reduced cutting

### Marking Worn Belts

- Don''t throw away worn belts — mark them for **strop-only use**
- A worn 120-grit belt makes an excellent medium-strop
- A worn 600-grit belt creates a very fine polish

### Storage

- Store belts flat or hanging — don''t fold them
- Keep them dry
- Organize by grit and condition (new, moderate, strop-only)

### Replacement Signs

- Belt no longer cuts even when clean
- Visible tears, thin spots, or delamination
- Inconsistent cutting (some spots work, others don''t)', 2),

('c1000009-0001-4000-8000-000000000003', 'b1b2c3d4-0009-4000-8000-000000000001', 'Edge Log', 'edge-log', 'text',
'## Edge Log

Keeping a log transforms sharpening from guesswork into a repeatable skill.

### Why Log?

- Track what works for each knife and steel type
- Identify patterns in your technique
- Build a reference library for future sharpening
- Measure improvement over time

### What to Record

| Field | Example |
|-------|---------|
| Date | May 6, 2026 |
| Knife | 8" Petty |
| Steel | AUS-8 |
| Grits Used | 120 → 600 → strop |
| Passes per side | 7 each |
| Tests passed | Paper, tomato, arm hair |
| Notes | Polished apex, edge holds well |

### Sample Log Entry

> **May 6, 2026** — Petty knife, AUS-8 steel.
> Started at 120 Cubitron, 7 passes each side. Burr formed at pass 5.
> 600 Trizact, 5 passes each side. Burr reduced nicely.
> Strop belt 5 passes, strop wheel 3 sec each side.
> Result: Shaves arm hair, clean paper cut. No wedging on tomato.
> Lesson: Could have stopped at 5 passes on 120 — burr was there, I over-ground slightly.

### Building Your System

- Use a notebook, spreadsheet, or notes app
- Review your log before sharpening — check what worked last time
- Over time, you''ll know exactly how many passes each knife needs

> Your log is your most valuable sharpening tool after the grinder itself.', 3);

-- Module 9 Quiz
INSERT INTO public.module_quizzes (id, module_id, questions, xp_reward) VALUES (
  'd1000009-0001-4000-8000-000000000001',
  'b1b2c3d4-0009-4000-8000-000000000001',
  '[
    {"id": "m9q1", "question": "What are reliable sharpness test methods?", "options": ["Only visual inspection", "Paper, fingernail, or hair shaving tests", "Weighing the blade", "Checking the belt condition"], "correct": 1},
    {"id": "m9q2", "question": "Should the edge reflect light when properly sharp?", "options": ["Yes, reflection means sharp", "No — a sharp edge won''t reflect light", "Only Japanese knives", "Only after stropping"], "correct": 1},
    {"id": "m9q3", "question": "How should slicing feel on a sharp knife?", "options": ["Heavy resistance", "Smooth with little resistance", "Loud cutting sound", "The blade should vibrate"], "correct": 1},
    {"id": "m9q4", "question": "Should you record your sharpening sessions?", "options": ["Only if you''re a beginner", "Yes — log grit, technique, and results to track progress", "No, it''s unnecessary", "Only for expensive knives"], "correct": 1},
    {"id": "m9q5", "question": "Why keep a sharpening log?", "options": ["To impress others", "Helps identify what worked and what didn''t", "Required by warranty", "To track belt purchases"], "correct": 1}
  ]'::jsonb,
  25
);
