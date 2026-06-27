-- Seed: Train To Be Sharp — Practicum (video lessons)
-- A 'Practicum' module that follows the theory modules. The Level 1 practicum is
-- a single chaptered video (YouTube _Aam40x1HDw); each lesson deep-links into
-- that same video at its section via video_url ?t=<seconds>, and the lesson page
-- renders a clickable chapter list (see components/courses/video-with-chapters.tsx).
-- Idempotent: safe to re-run (ON CONFLICT DO NOTHING — won't overwrite edits).

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

-- Practicum video lessons. All point at the one Level 1 practicum video, each
-- starting at its own section; the player shows the full clickable chapter list.
INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, video_url, "order") VALUES
('d1000001-0001-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'P0 — Welcome to the Practicum & The Finished Edge', 'practicum-welcome', 'video', 'The start of the full Level 1 practicum — what it covers and the finished edge you''re working toward.

This lesson opens the complete Level 1 practicum at this point. Use the chapter list under the video to jump to any part of the walkthrough.', 'https://youtu.be/_Aam40x1HDw', 1),
('d1000001-0002-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'P1 — Reading an Edge — Light Test & Diagnosing Dullness', 'practicum-reading-an-edge', 'video', 'Inspecting a batch of real customer knives — spotting chips, broken tips, and wear before any grinding.

This lesson opens the complete Level 1 practicum at this point. Use the chapter list under the video to jump to any part of the walkthrough.', 'https://youtu.be/_Aam40x1HDw?t=136', 2),
('d1000001-0003-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'P2 — Grinder Setup, Tracking, Tension & Heat Management', 'practicum-grinder-setup', 'video', 'The sharpening stations and the four-phase grit ladder — the machines, the setup, and keeping edges cool.

This lesson opens the complete Level 1 practicum at this point. Use the chapter list under the video to jump to any part of the walkthrough.', 'https://youtu.be/_Aam40x1HDw?t=237', 3),
('d1000001-0004-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'P3 — Assessing the Blade — Grind Type, Angle & Sharpie Test', 'practicum-assessing-the-blade', 'video', 'Setting and checking your edge angle with a digital angle gauge before sharpening.

This lesson opens the complete Level 1 practicum at this point. Use the chapter list under the video to jump to any part of the walkthrough.', 'https://youtu.be/_Aam40x1HDw?t=640', 4),
('d1000001-0005-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'P4 — Stance & Pass Mechanics — The Edge-Leading Stroke', 'practicum-pass-mechanics', 'video', 'The edge-leading pass mechanics — how the stroke is run across the belt, and how to read the burr.

This lesson opens the complete Level 1 practicum at this point. Use the chapter list under the video to jump to any part of the walkthrough.', 'https://youtu.be/_Aam40x1HDw?t=1090', 5),
('d1000001-0006-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'P5 — Forming & Chasing the Burr (120 → 600)', 'practicum-burr-control', 'video', 'Chasing the burr up through the finer grit toward a refined edge.

This lesson opens the complete Level 1 practicum at this point. Use the chapter list under the video to jump to any part of the walkthrough.', 'https://youtu.be/_Aam40x1HDw?t=1385', 6),
('d1000001-0007-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'P6 — Polishing & Stropping to a Mirror + Sharpness Tests', 'practicum-polishing-stropping', 'video', 'Stropping to a polished edge, plus the cleaning and finishing pass.

This lesson opens the complete Level 1 practicum at this point. Use the chapter list under the video to jump to any part of the walkthrough.', 'https://youtu.be/_Aam40x1HDw?t=1508', 7),
('d1000001-0008-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'P7 — Specialty Grinds — Scandi, Convex & Hollow', 'practicum-specialty-grinds', 'video', 'The specialty work — serrated knives, scissors, and ceramic blades.

This lesson opens the complete Level 1 practicum at this point. Use the chapter list under the video to jump to any part of the walkthrough.', 'https://youtu.be/_Aam40x1HDw?t=1730', 8),
('d1000001-0009-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'P8 — Capstone — One Knife, Dull to Mirror, Start to Finish', 'practicum-capstone', 'video', 'A full single-knife run — fixing a broken tip, removing chips, sharpening, polishing, and finishing one blade start to finish.

This lesson opens the complete Level 1 practicum at this point. Use the chapter list under the video to jump to any part of the walkthrough.', 'https://youtu.be/_Aam40x1HDw?t=762', 9),
('d1000001-0010-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'P9 — Maintenance — Touch-Ups, Belt Care & the Edge Log', 'practicum-maintenance', 'video', 'Maintenance and final tips — keeping blades cool, belt care, sourcing supplies, and a clean workspace.

This lesson opens the complete Level 1 practicum at this point. Use the chapter list under the video to jump to any part of the walkthrough.', 'https://youtu.be/_Aam40x1HDw?t=2638', 10)
ON CONFLICT (module_id, slug) DO NOTHING;
