-- Seed: Train To Be Sharp — Practicum (video lessons)
-- A 'Practicum' module that follows the theory modules. The Level 1 practicum is
-- a single chaptered video (YouTube _Aam40x1HDw). Each lesson IS one chapter and
-- deep-links into that video at its timestamp via video_url ?t=<seconds>; the
-- lesson page renders a clickable chapter list (components/courses/video-with-chapters.tsx).
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

-- Practicum video lessons — one per chapter of the Level 1 practicum video.
INSERT INTO public.lessons (id, module_id, title, slug, content_type, content, video_url, "order") VALUES
('d1000001-0001-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'Introduction', 'practicum-introduction', 'video', 'What the Level 1 practicum covers and the finished edge you''re working toward.

Use the chapter list under the video to jump to any section.', 'https://youtu.be/_Aam40x1HDw', 1),
('d1000001-0002-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'Safety & Protective Gear', 'practicum-safety', 'video', 'Eye and lung protection, clothing, and working safely around the felt grinders.

Use the chapter list under the video to jump to any section.', 'https://youtu.be/_Aam40x1HDw?t=34', 2),
('d1000001-0003-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'Sorting & Inspecting Customer Knives', 'practicum-sorting-inspecting', 'video', 'Receiving a batch of customer knives and surveying chips, broken tips, and wear before you start.

Use the chapter list under the video to jump to any section.', 'https://youtu.be/_Aam40x1HDw?t=136', 3),
('d1000001-0004-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'Sharpening Stations & the 4 Phases', 'practicum-stations-phases', 'video', 'A tour of the stations and the four-phase workflow: profile, burr removal, higher polish, and cleaning.

Use the chapter list under the video to jump to any section.', 'https://youtu.be/_Aam40x1HDw?t=237', 4),
('d1000001-0005-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'The 1×30 Buck Tool & Angle Guide', 'practicum-buck-tool-angle-guide', 'video', 'The low-speed 1×30 Buck Tool, removing the side grinding wheel, and modifying the angle guide.

Use the chapter list under the video to jump to any section.', 'https://youtu.be/_Aam40x1HDw?t=407', 5),
('d1000001-0006-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'Setting Your Angle (Digital Gauge)', 'practicum-setting-angle', 'video', 'Zeroing a digital angle gauge and setting a consistent angle on each station.

Use the chapter list under the video to jump to any section.', 'https://youtu.be/_Aam40x1HDw?t=640', 6),
('d1000001-0007-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'Fixing a Broken Tip', 'practicum-fixing-broken-tip', 'video', 'Reprofiling a snapped, bent tip while keeping the blade cool.

Use the chapter list under the video to jump to any section.', 'https://youtu.be/_Aam40x1HDw?t=762', 7),
('d1000001-0008-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'Removing Chips', 'practicum-removing-chips', 'video', 'Clearing chips from the edge with light passes — including thin Japanese knives.

Use the chapter list under the video to jump to any section.', 'https://youtu.be/_Aam40x1HDw?t=1015', 8),
('d1000001-0009-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'Sharpening: Coarse Grit & Reading the Burr', 'practicum-coarse-grit-burr', 'video', 'The edge-leading pass and how to raise, see, and read a burr.

Use the chapter list under the video to jump to any section.', 'https://youtu.be/_Aam40x1HDw?t=1090', 9),
('d1000001-0010-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'Polishing (600–800 Grit)', 'practicum-polishing', 'video', 'Refining the edge on the finer Tri-Zac belt with controlled passes.

Use the chapter list under the video to jump to any section.', 'https://youtu.be/_Aam40x1HDw?t=1385', 10),
('d1000001-0011-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'Stropping', 'practicum-stropping', 'video', 'Stropping on a leather belt with diamond emulsion to finish the apex.

Use the chapter list under the video to jump to any section.', 'https://youtu.be/_Aam40x1HDw?t=1508', 11),
('d1000001-0012-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'Cleaning & Invoicing the Customer', 'practicum-cleaning-invoicing', 'video', 'Cleaning each knife safely, then the customer photo, total, and payment.

Use the chapter list under the video to jump to any section.', 'https://youtu.be/_Aam40x1HDw?t=1605', 12),
('d1000001-0013-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'Serrated Knives', 'practicum-serrated-knives', 'video', 'Sharpening serrated edges on one side and deburring on the other.

Use the chapter list under the video to jump to any section.', 'https://youtu.be/_Aam40x1HDw?t=1730', 13),
('d1000001-0014-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'Scissors', 'practicum-scissors', 'video', 'Opening up scissors and sharpening the cutting blades — and what to watch for.

Use the chapter list under the video to jump to any section.', 'https://youtu.be/_Aam40x1HDw?t=1878', 14),
('d1000001-0015-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'Ceramic Knives', 'practicum-ceramic-knives', 'video', 'Using a diamond belt on ceramic blades, and setting customer expectations.

Use the chapter list under the video to jump to any section.', 'https://youtu.be/_Aam40x1HDw?t=1980', 15),
('d1000001-0016-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'Salon Shears — What Not to Sharpen', 'practicum-salon-shears', 'video', 'Why salon shears need different equipment — and when to refer them out.

Use the chapter list under the video to jump to any section.', 'https://youtu.be/_Aam40x1HDw?t=2237', 16),
('d1000001-0017-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'Handling Smaller Knives', 'practicum-smaller-knives', 'video', 'Thumb control and pass technique for smaller blades.

Use the chapter list under the video to jump to any section.', 'https://youtu.be/_Aam40x1HDw?t=2393', 17),
('d1000001-0018-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'Certification & Video Review', 'practicum-certification', 'video', 'How to submit your own technique video for Erik to review for certification.

Use the chapter list under the video to jump to any section.', 'https://youtu.be/_Aam40x1HDw?t=2481', 18),
('d1000001-0019-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'Mirror Polishing (Advanced — Out of Scope)', 'practicum-mirror-polishing', 'video', 'Why mirror-polish buffing is a separate, advanced skill covered elsewhere.

Use the chapter list under the video to jump to any section.', 'https://youtu.be/_Aam40x1HDw?t=2537', 19),
('d1000001-0020-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'Wrap-Up & Final Tips', 'practicum-wrap-up', 'video', 'Keeping blades cool, belt care, sourcing supplies, dust extraction, and a clean workspace.

Use the chapter list under the video to jump to any section.', 'https://youtu.be/_Aam40x1HDw?t=2638', 20),
-- Remote certification: dedicated final step — points at the certification clip
-- and hosts the video-upload element (rendered by the lesson page for this slug).
('d1000001-0021-4000-8000-000000000001', 'b1b2c3d4-0010-4000-8000-000000000001', 'Remote Certification — Submit Your Video', 'practicum-remote-certification', 'video', 'To earn your Train to Be Sharp certificate, Erik personally reviews your technique — a remote check-off so your certificate reflects real ability.

**Watch the certification clip above** (it starts at the “Certification & Video Review” section of the practicum), then:

1. Record yourself taking a knife from dull to finished — a few focused minutes is plenty.
2. Upload it to YouTube (unlisted) or Vimeo.
3. Paste the link below and submit it for review.

Erik will either approve it — which unlocks your certificate — or send feedback so you can resubmit. You''ll be notified by email either way.', 'https://youtu.be/_Aam40x1HDw?t=2481', 21)
ON CONFLICT (module_id, slug) DO NOTHING;
