-- Seed: Train To Be Sharp — Practicum (video lesson stubs)
-- Adds a 'Practicum' module of video lessons that follow the theory modules.
-- Video URLs are filled in as each video is produced (GitHub epic #1).
-- Idempotent: safe to re-run.

-- Practicum module (order 9, after the theory modules)
INSERT INTO public.modules (id, course_id, title, slug, description, "order")
VALUES (
  'b1b2c3d4-0010-4000-8000-000000000001',
  'a1b2c3d4-0001-4000-8000-000000000001',
  'Practicum: Watch Erik Sharpen',
  'practicum',
  'Video demonstrations — watch each theory concept performed on real blades, then do it yourself.',
  9
)
ON CONFLICT (course_id, slug) DO NOTHING;

-- Practicum video lessons (stubs; video_url NULL until produced)
INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, video_url, "order") VALUES
('d1000001-0001-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'P0 — Welcome to the Practicum & The Finished Edge', 'practicum-welcome', 'video', '## P0 — Welcome to the Practicum & The Finished Edge

🎥 **Video coming soon.**

See where you''re headed: a finished mirror edge passing real cutting tests, and a tour of the Buck Tool 1×30 rig and grit ladder.

_Follows theory: M0 — Introduction. Production tracked in GitHub issue #13._', NULL, 1),
('d1000001-0002-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'P1 — Reading an Edge — Light Test & Diagnosing Dullness', 'practicum-reading-an-edge', 'video', '## P1 — Reading an Edge — Light Test & Diagnosing Dullness

🎥 **Video coming soon.**

Watch how to diagnose an edge under a bright light before touching the grinder — spotting rolled, chipped, and worn spots.

_Follows theory: M1 — Foundations of Sharpness. Production tracked in GitHub issue #14._', NULL, 2),
('d1000001-0003-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'P2 — Grinder Setup, Tracking, Tension & Heat Management', 'practicum-grinder-setup', 'video', '## P2 — Grinder Setup, Tracking, Tension & Heat Management

🎥 **Video coming soon.**

A hands-on walkthrough: change a belt, set tracking and tension, lay out the station, and keep edges cool.

_Follows theory: M2 — Safety & Setup. Production tracked in GitHub issue #15._', NULL, 3),
('d1000001-0004-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'P3 — Assessing the Blade — Grind Type, Angle & Sharpie Test', 'practicum-assessing-the-blade', 'video', '## P3 — Assessing the Blade — Grind Type, Angle & Sharpie Test

🎥 **Video coming soon.**

Read a blade before sharpening: identify the grind, find the existing angle with the Sharpie test, and gauge thickness behind the edge.

_Follows theory: M3 — Know Your Blade. Production tracked in GitHub issue #16._', NULL, 4),
('d1000001-0005-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'P4 — Stance & Pass Mechanics — The Edge-Leading Stroke', 'practicum-pass-mechanics', 'video', '## P4 — Stance & Pass Mechanics — The Edge-Leading Stroke

🎥 **Video coming soon.**

The physical skill: a stable stance and a consistent edge-leading pass, using sound and feel to stay even side-to-side.

_Follows theory: M4 — Belt Control & Body Mechanics. Production tracked in GitHub issue #17._', NULL, 5),
('d1000001-0006-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'P5 — Forming & Chasing the Burr (120 → 600)', 'practicum-burr-control', 'video', '## P5 — Forming & Chasing the Burr (120 → 600)

🎥 **Video coming soon.**

The core skill — raise a full burr at 120 grit, confirm it by feel, then shrink and center it at 600 grit.

_Follows theory: M5 — Burr Control. Production tracked in GitHub issue #18._', NULL, 6),
('d1000001-0007-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'P6 — Polishing & Stropping to a Mirror + Sharpness Tests', 'practicum-polishing-stropping', 'video', '## P6 — Polishing & Stropping to a Mirror + Sharpness Tests

🎥 **Video coming soon.**

Edge-trailing strop belt and wheel take a refined edge to a mirror apex — then validate with paper, tomato, and arm-hair tests.

_Follows theory: M6 — Polishing & Stropping. Production tracked in GitHub issue #19._', NULL, 7),
('d1000001-0008-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'P7 — Specialty Grinds — Scandi, Convex & Hollow', 'practicum-specialty-grinds', 'video', '## P7 — Specialty Grinds — Scandi, Convex & Hollow

🎥 **Video coming soon.**

Apply the same burr-to-mirror process to non-flat bevels, adjusting platen contact for Scandi, convex, and hollow grinds.

_Follows theory: M7 — Specialty Grinds. Production tracked in GitHub issue #20._', NULL, 8),
('d1000001-0009-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'P8 — Capstone — One Knife, Dull to Mirror, Start to Finish', 'practicum-capstone', 'video', '## P8 — Capstone — One Knife, Dull to Mirror, Start to Finish

🎥 **Video coming soon.**

The payoff: one chef''s knife taken from dull to mirror in a single, mostly-uncut sequence showing the whole workflow.

_Follows theory: capstone (synthesizes M1–M6). Production tracked in GitHub issue #21._', NULL, 9),
('d1000001-0010-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'P9 — Maintenance — Touch-Ups, Belt Care & the Edge Log', 'practicum-maintenance', 'video', '## P9 — Maintenance — Touch-Ups, Belt Care & the Edge Log

🎥 **Video coming soon.**

Keep edges and gear performing: a fast touch-up routine, belt care, and how to actually keep an edge log.

_Follows theory: M8 — Maintenance & Logging. Production tracked in GitHub issue #22._', NULL, 10)
ON CONFLICT (module_id, slug) DO NOTHING;
