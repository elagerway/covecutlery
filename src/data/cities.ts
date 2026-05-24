import type { FAQ } from '@/lib/schema'

export interface CityData {
  readonly slug: string
  readonly name: string
  readonly description: string
  readonly neighbourhoods: readonly [string, ...string[]]
  readonly driveTime: string
  readonly faqs: readonly FAQ[]
  readonly metaTitle: string
  readonly metaDescription: string
}

export const cities: readonly CityData[] = [
  {
    slug: 'north-vancouver',
    name: 'North Vancouver',
    description: `Cove Blades is based right here in North Vancouver, making us the fastest knife sharpening option on the North Shore. Our workshop is located at 4086 Brockton Crescent, where we offer both mobile service and a 24/7 secure drop-off box. Whether you are a home cook in Lynn Valley or a chef at a Lonsdale Quay restaurant, we can have your knives razor-sharp and back in your hands within 24 hours for drop-off orders.

North Vancouver is home to some of the Lower Mainland's finest dining establishments and most passionate home cooks. With over 120 restaurants on Lonsdale alone, the demand for professional knife sharpening has never been higher. Since 2020, we have sharpened over 15,000 knives for North Shore residents and businesses. Our mobile service covers every corner of the City and District of North Vancouver, from Deep Cove to Capilano and everywhere in between.

Professional sharpening extends the life of your knives by years compared to at-home honing or pull-through sharpeners. A properly sharpened blade reduces fatigue, improves precision, and is actually safer than a dull knife that slips under pressure. We use a combination of Japanese waterstones and precision belt systems to match the original factory angle of each blade — whether it is a $30 Victorinox or a $400 Miyabi. Every sharpening comes with our 30-day edge guarantee: if the edge does not hold under normal use, we re-sharpen it free.`,
    neighbourhoods: [
      'Lonsdale', 'Lower Lonsdale', 'Lynn Valley', 'Deep Cove',
      'Capilano', 'Edgemont', 'Norgate', 'Pemberton Heights',
      'Blueridge', 'Seymour Heights', 'Indian Arm',
    ],
    driveTime: 'Same-day — we are based here',
    faqs: [
      {
        question: 'Where is the Cove Blades drop-off box in North Vancouver?',
        answer: 'Our 24/7 secure drop-off box is located at 4086 Brockton Crescent in North Vancouver. Simply place your knives in the box at any time, and we will sharpen and return them within 24–48 hours. No appointment needed.',
      },
      {
        question: 'How quickly can I get my knives sharpened in North Vancouver?',
        answer: 'Since we are based in North Vancouver, we offer same-day turnaround for drop-off orders received before noon. Mobile service appointments are typically available within 1–2 business days.',
      },
      {
        question: 'Do you sharpen knives for North Vancouver restaurants?',
        answer: 'Yes. We provide scheduled weekly and bi-weekly mobile sharpening for dozens of North Shore restaurants. We visit your kitchen on a regular schedule so your team always has sharp knives without any downtime.',
      },
      {
        question: 'How much does knife sharpening cost in North Vancouver?',
        answer: 'Standard kitchen knives are $12 each. Japanese single-bevel knives, ceramic knives, and cleavers are $18. Every sharpening includes our 30-day edge guarantee at no extra charge.',
      },
    ],
    metaTitle: 'Knife Sharpening North Vancouver | Same-Day Service | Cove Blades',
    metaDescription: 'Professional knife sharpening in North Vancouver. Same-day drop-off turnaround, mobile service, and 24/7 secure drop box. $12/knife with 30-day guarantee. Based on the North Shore since 2020.',
  },
  {
    slug: 'vancouver',
    name: 'Vancouver',
    description: `Cove Blades brings professional mobile knife sharpening directly to homes and restaurants across Vancouver. Based just over the Lions Gate Bridge in North Vancouver, we reach most Vancouver neighbourhoods in under 30 minutes. From Kitsilano kitchens to Gastown restaurant lines, we sharpen every type of blade on-site so you never have to pack up your knives or wait days for mail-in service.

Vancouver is Canada's culinary capital, home to over 4,000 restaurants and a food culture that prizes quality ingredients and precise technique. A sharp knife is the foundation of every great kitchen, yet most home cooks and even some professional kitchens let their blades go dull far longer than they should. Industry data shows the average kitchen knife loses its working edge within 2–3 months of regular use. Our mobile service eliminates the friction: we come to you, sharpen your knives on-site in 15–30 minutes, and you are back to cooking immediately.

We use a combination of professional-grade belt systems and Japanese waterstones to restore each blade to its optimal angle. Single-bevel Japanese knives get special attention — we match the original geometry rather than forcing a Western double-bevel grind. Over 60% of our Vancouver customers are repeat clients on a regular sharpening schedule, which tells us the results speak for themselves. Every sharpening is backed by our 30-day edge guarantee.`,
    neighbourhoods: [
      'Kitsilano', 'West Point Grey', 'Dunbar', 'Kerrisdale',
      'South Granville', 'Fairview', 'Mount Pleasant', 'Commercial Drive',
      'Gastown', 'Yaletown', 'Coal Harbour', 'West End',
      'Hastings-Sunrise', 'East Vancouver', 'Marpole', 'Oakridge',
    ],
    driveTime: 'Under 30 minutes from our North Vancouver base',
    faqs: [
      {
        question: 'Do you offer mobile knife sharpening in Vancouver?',
        answer: 'Yes. We drive to your home or restaurant anywhere in Vancouver. Mobile visits typically take 15–30 minutes depending on the number of knives. We sharpen everything on-site — no need to drop off or ship your knives anywhere.',
      },
      {
        question: 'What is the minimum order for mobile sharpening in Vancouver?',
        answer: 'Mobile visits to Vancouver require a minimum of 5 knives ($60). This covers our travel from North Vancouver while keeping the per-knife price low at $12 for standard blades.',
      },
      {
        question: 'How often should I have my kitchen knives professionally sharpened?',
        answer: 'For home cooks, we recommend professional sharpening every 3–4 months. Restaurant kitchens typically need weekly or bi-weekly service depending on volume. Regular honing with a steel between sharpenings helps maintain the edge longer.',
      },
      {
        question: 'Can you sharpen Japanese knives in Vancouver?',
        answer: 'Absolutely. We specialize in Japanese single-bevel knives including yanagiba, deba, and usuba. We match the original factory angle using Japanese waterstones rather than forcing a Western double-bevel grind. Japanese knives are $18 each.',
      },
    ],
    metaTitle: 'Knife Sharpening Vancouver | Mobile Service | Cove Blades',
    metaDescription: 'Professional mobile knife sharpening in Vancouver. We come to your home or restaurant. $12/knife, 30-day guarantee. Japanese knife specialists. Book online today.',
  },
  {
    slug: 'burnaby',
    name: 'Burnaby',
    description: `Cove Blades provides professional mobile knife sharpening across Burnaby, from Metrotown to Burnaby Heights and everywhere in between. Located in neighbouring North Vancouver, we reach most Burnaby addresses in 20–25 minutes, making us one of the fastest knife sharpening options available to Burnaby residents and businesses.

Burnaby is home to over 250,000 residents and a thriving food scene that spans everything from family-run dim sum houses on Hastings to upscale dining near Brentwood. With that density comes serious demand for sharp kitchen tools. Whether you are meal-prepping for the week in your Edmonds townhouse or running a high-volume commercial kitchen near Boundary Road, dull knives cost you time, safety, and food quality. A professionally sharpened knife cuts prep time by up to 30% and reduces the risk of slipping injuries that happen when you apply excess force to compensate for a dull edge.

Our mobile service is simple: book online, and we arrive at your door with our full sharpening setup. We work through your knives on-site — most home collections of 5–10 knives take about 20 minutes. We handle every type of blade: German, Japanese, ceramic, serrated, cleavers, scissors, and even garden shears. Each knife is inspected for damage, sharpened to its correct angle, and tested before we hand it back. Our 30-day edge guarantee means if you are not satisfied, we re-sharpen at no cost.`,
    neighbourhoods: [
      'Metrotown', 'Brentwood', 'Lougheed', 'Burnaby Heights',
      'Edmonds', 'Deer Lake', 'Kingsway', 'Boundary Road',
      'Capitol Hill', 'Willingdon Heights', 'South Burnaby',
    ],
    driveTime: '20–25 minutes from our North Vancouver base',
    faqs: [
      {
        question: 'How do I book knife sharpening in Burnaby?',
        answer: 'Book online through our website at coveblades.com. Choose a date and time that works for you, and we will drive to your Burnaby address with our full mobile sharpening setup. The whole process takes about 20 minutes for a typical home collection.',
      },
      {
        question: 'What is the mobile sharpening minimum for Burnaby?',
        answer: 'Mobile visits to Burnaby require a minimum of 5 knives ($60). This keeps our per-knife pricing low while covering travel from our North Vancouver base. Most customers bring 6–12 knives per visit.',
      },
      {
        question: 'Can I drop off knives instead of booking mobile service?',
        answer: 'Yes. Our 24/7 drop-off box is at 4086 Brockton Crescent in North Vancouver, about a 20-minute drive from central Burnaby. There is no minimum for drop-off orders, and turnaround is 24–48 hours.',
      },
      {
        question: 'Do you sharpen for Burnaby restaurants and commercial kitchens?',
        answer: 'Yes. We provide scheduled weekly and bi-weekly mobile sharpening for commercial kitchens across Burnaby. Consistent professional sharpening keeps your line running smoothly and reduces blade replacement costs by extending knife life.',
      },
    ],
    metaTitle: 'Knife Sharpening Burnaby | Mobile Service | Cove Blades',
    metaDescription: 'Professional mobile knife sharpening in Burnaby. We come to your home or restaurant in 20–25 minutes. $12/knife with 30-day edge guarantee. Book online today.',
  },
  {
    slug: 'west-vancouver',
    name: 'West Vancouver',
    description: `Cove Blades serves West Vancouver with professional mobile knife sharpening, reaching Ambleside, Dundarave, and British Properties in as little as 15 minutes from our North Vancouver base. As your nearest professional sharpening service, we offer the fastest turnaround on the North Shore — with same-day availability for drop-off orders and mobile appointments typically within 1–2 business days.

West Vancouver is known for its discerning residents who invest in quality kitchen equipment. High-end Japanese knives from makers like Shun, Global, and Miyabi are common in West Vancouver kitchens, and these blades deserve expert care. Pull-through sharpeners and electric grinders remove too much metal and can ruin the precise edge geometry that makes Japanese knives special. Our technicians use Japanese waterstones and precision belt systems to restore each blade to its factory angle, preserving the integrity and longevity of your investment.

The difference between a dull knife and a professionally sharpened one is immediately noticeable. Tomatoes slice without crushing, herbs chiffonade cleanly instead of bruising, and proteins portion with precision. Professional chefs know this — it is why we serve dozens of restaurant kitchens across the Lower Mainland on a regular schedule. For home cooks, we recommend sharpening every 3–4 months depending on usage. Our 30-day edge guarantee covers every sharpening: if the edge does not hold, we re-do it free.`,
    neighbourhoods: [
      'Ambleside', 'Dundarave', 'British Properties',
      'Caulfeild', 'Horseshoe Bay', 'Panorama Village',
      'Cypress Park', 'Altamont', 'Westmount',
    ],
    driveTime: '10–15 minutes from our North Vancouver base',
    faqs: [
      {
        question: 'How quickly can you reach West Vancouver for knife sharpening?',
        answer: 'We are based in North Vancouver, just 10–15 minutes from most West Vancouver neighbourhoods. Mobile appointments are typically available within 1–2 business days, and we can often accommodate same-day requests.',
      },
      {
        question: 'Do you sharpen high-end Japanese knives?',
        answer: 'Yes, Japanese knives are our specialty. We sharpen single-bevel and double-bevel Japanese blades using waterstones, matching the original factory angle. Brands like Shun, Global, Miyabi, Tojiro, and custom makers are all welcome. Japanese knives are $18 each.',
      },
      {
        question: 'Is mobile knife sharpening safe for my countertops?',
        answer: 'Absolutely. We bring our own portable sharpening station and work from a self-contained setup. There is no mess, no water damage, and no risk to your surfaces. We clean up completely before leaving.',
      },
      {
        question: 'Can I use the drop-off box from West Vancouver?',
        answer: 'Yes. Our 24/7 secure drop-off box at 4086 Brockton Crescent in North Vancouver is a quick 10–15 minute drive from West Vancouver. No minimum order for drop-off, with 24–48 hour turnaround.',
      },
    ],
    metaTitle: 'Knife Sharpening West Vancouver | 15-Min Away | Cove Blades',
    metaDescription: 'Professional knife sharpening in West Vancouver. Japanese knife specialists just 15 minutes away. Mobile service, 24/7 drop-off, $12/knife with 30-day guarantee.',
  },
  {
    slug: 'coquitlam',
    name: 'Coquitlam',
    description: `Cove Blades provides professional mobile knife sharpening across Coquitlam — from Burke Mountain and Westwood Plateau down through Coquitlam Centre and the Lougheed corridor to Maillardville and Austin Heights. From our North Vancouver base we reach most Coquitlam addresses in 30 to 35 minutes via the Second Narrows Bridge and Highway 1, arriving with the full mobile sharpening setup ready to work on-site.

Coquitlam is one of Metro Vancouver's fastest-growing cities, with a population of around 150,000 and a residential mix that runs from the newer townhouse developments on Burke Mountain to the established neighbourhoods around Maillardville and the long-time family streets in Austin Heights. The food scene has grown with the population: Coquitlam Centre and the surrounding restaurants, the diverse mix along North Road, and the family-run spots tucked into the Mary Hill Bypass and Lougheed corridors. Sharp knives are foundational to all of it — for home cooks prepping weekday dinners, weekend entertainers, and the commercial kitchens running through high covers at the malls and along Lougheed.

We sharpen every type of blade on-site: German chef's knives from Wusthof and Henckels, Japanese gyutos and santokus, single-bevel yanagibas and debas, ceramic, serrated bread knives, cleavers, scissors, and garden shears. Each blade is inspected for chips or damage before sharpening, ground to the original factory angle, then tested before we hand it back. Most home collections of 5 to 10 knives take about 20 minutes start to finish. Every sharpening is backed by our 30-day edge guarantee. For Coquitlam customers who would prefer drop-off, our 24/7 box at 4086 Brockton Crescent in North Vancouver has no minimum and a 24–48 hour turnaround.`,
    neighbourhoods: [
      'Coquitlam Centre', 'Burke Mountain', 'Westwood Plateau',
      'Austin Heights', 'Maillardville', 'Ranch Park',
      'Eagle Ridge', 'River Springs', 'Como Lake',
      'Cape Horn', 'Harbour Chines', 'Hockaday',
    ],
    driveTime: '30–35 minutes from our North Vancouver base',
    faqs: [
      {
        question: 'Do you also serve Port Moody and Port Coquitlam?',
        answer: 'Yes — both have their own dedicated service-area pages with city-specific drive times and FAQs. Port Moody is actually slightly closer to our North Vancouver base than central Coquitlam at 25–30 minutes; Port Coquitlam is 30–35. This page is for Coquitlam-specific bookings.',
      },
      {
        question: 'What is the mobile sharpening minimum for Coquitlam?',
        answer: 'A 5-knife minimum ($60) applies to mobile visits. Many Coquitlam customers coordinate with a neighbour or two to combine orders, which makes the per-knife economics better and is often easier than booking solo for a small set.',
      },
      {
        question: 'How is professional sharpening different from using a pull-through sharpener?',
        answer: 'Pull-through sharpeners remove excessive metal and create an inconsistent edge angle. Professional sharpening uses precision equipment to match your knife\'s original factory angle, removing only the minimum metal needed. This extends knife life by years and produces a significantly sharper, longer-lasting edge.',
      },
      {
        question: 'Can I drop off my knives instead of booking mobile service?',
        answer: 'Yes. Our 24/7 drop-off box at 4086 Brockton Crescent in North Vancouver is about a 30-minute drive from central Coquitlam. No minimum for drop-off, with 24–48 hour turnaround.',
      },
    ],
    metaTitle: 'Knife Sharpening Coquitlam | Mobile Service | Cove Blades',
    metaDescription: 'Professional mobile knife sharpening in Coquitlam — Burke Mountain to Maillardville. $12/knife with 30-day guarantee. 30-35 min from our North Vancouver base.',
  },
  {
    slug: 'port-moody',
    name: 'Port Moody',
    description: `Cove Blades brings professional mobile knife sharpening directly to Port Moody — the smallest, prettiest, and arguably most walkable of the Tri-Cities. From our North Vancouver base we cross the Second Narrows and reach most Port Moody addresses in 25 to 30 minutes, which actually makes us faster to PoMo than to neighbouring Coquitlam. We bring the full sharpening setup to your door, work through your knives on-site, and you are back to cooking in the time it takes to drink a craft beer from Brewers Row.

Port Moody has quietly become one of the most exciting food scenes in Metro Vancouver. The Brewers Row corridor on Murray Street and the restaurants around Newport Village have built a culture that celebrates quality ingredients and thoughtful technique — which means sharp knives matter more than ever. Whether you are prepping for a backyard summer dinner overlooking Burrard Inlet, running a kitchen at Suter Brook, or hosting friends in a Heritage Mountain home, a properly sharpened blade is what separates the cook who looks effortless from the one fighting the food.

We sharpen every type of blade — German, Japanese, ceramic, serrated, cleavers, and even hunting knives for the Belcarra and Anmore crowd who hike out of Buntzen and Sasamat. Our technicians use Japanese waterstones for single-bevel blades and precision belt systems for double-bevel knives, matching the original factory angle on each one. Every sharpening is backed by our 30-day edge guarantee: if the edge does not hold under normal use, we re-sharpen at no charge.`,
    neighbourhoods: [
      'Brewers Row', 'Suter Brook', 'Newport Village',
      'Heritage Mountain', 'College Park', 'Glenayre',
      'Pleasantside', 'North Shore Port Moody', 'Ioco',
      'Anmore',
    ],
    driveTime: '25–30 minutes from our North Vancouver base',
    faqs: [
      {
        question: 'How quickly can you reach Port Moody from North Vancouver?',
        answer: 'About 25 to 30 minutes via the Second Narrows Bridge — actually slightly faster than getting to central Coquitlam. Mobile appointments are typically available within 1–2 business days, with same-day visits possible for urgent requests.',
      },
      {
        question: 'Do you sharpen knives for the Brewers Row restaurants?',
        answer: 'Yes. Several Brewers Row kitchens and Newport Village restaurants use us on a scheduled weekly or bi-weekly cadence. Consistent professional sharpening keeps the prep line moving and extends knife life by years versus pull-through grinders.',
      },
      {
        question: 'Does your mobile service cover Anmore and Belcarra?',
        answer: 'Yes — both are within easy reach of our Port Moody route. Anmore residents often book alongside a Port Moody neighbour to share a single visit. Belcarra is small enough (population around 700) that combining orders helps everyone.',
      },
      {
        question: 'What is the minimum order for mobile sharpening in Port Moody?',
        answer: '5 knives ($60) minimum for a mobile visit. Most Port Moody households bring 6–10 knives. If you have fewer than 5, our 24/7 drop-off box at 4086 Brockton Crescent in North Vancouver has no minimum and a 24–48 hour turnaround.',
      },
    ],
    metaTitle: 'Knife Sharpening Port Moody | Mobile Service | Cove Blades',
    metaDescription: 'Professional mobile knife sharpening in Port Moody — 25 minutes from our North Vancouver base. $12/knife with 30-day guarantee. Brewers Row, Newport Village, all neighbourhoods.',
  },
  {
    slug: 'port-coquitlam',
    name: 'Port Coquitlam',
    description: `Cove Blades provides professional mobile knife sharpening across Port Coquitlam — known locally as PoCo, a community of around 62,000 with its own distinct character separate from neighbouring Coquitlam. From our North Vancouver base we reach PoCo addresses in roughly 30 to 35 minutes via the Second Narrows and the Mary Hill bypass, bringing our complete sharpening setup directly to your kitchen.

Port Coquitlam has grown from a railway town into a community that takes its food and family time seriously. The downtown Shaughnessy Street corridor and the residential neighbourhoods stretching from Birchland Manor to Citadel Heights are home to thousands of households who cook from scratch — and most of them are working with knives that have lost their working edge months ago. Industry data shows the average kitchen knife dulls to the point of inefficiency within 8 to 12 weeks of regular use, and the difference between a properly sharpened blade and a worn one is immediately obvious: clean slices through a ripe tomato, paper-thin sashimi cuts on weekend salmon, and effortless onion dicing without tears.

Our mobile service is built for households exactly like the ones in PoCo. Book online, pick a time that suits, and we drive to your address with the full professional sharpening rig in the back of the van. Most home collections of 5 to 10 knives take 20 minutes start to finish, and we work through everything on the spot — no drop-off, no shipping, no waiting days for your knives to come back. We handle German blades, Japanese single-bevel and double-bevel, ceramic, serrated, cleavers, scissors, and outdoor knives. Every sharpening comes with our 30-day edge guarantee.`,
    neighbourhoods: [
      'Downtown Port Coquitlam', 'Birchland Manor', 'Lincoln Park',
      'Mary Hill', 'Oxford Heights', 'Riverwood',
      'Citadel Heights', 'Glenwood', 'Central Port Coquitlam',
    ],
    driveTime: '30–35 minutes from our North Vancouver base',
    faqs: [
      {
        question: 'How long does it take to reach Port Coquitlam from North Vancouver?',
        answer: 'Around 30 to 35 minutes via the Second Narrows and Mary Hill bypass. Traffic on the bridge during rush hour can stretch this; we factor that into scheduling and arrive within the booked window.',
      },
      {
        question: 'What is the difference between booking for Coquitlam vs Port Coquitlam?',
        answer: 'We treat them as separate service areas with their own dedicated pages — they are distinct communities even though they share a name. Booking for Port Coquitlam ensures we are routing efficiently and arriving at the right address.',
      },
      {
        question: 'Can you sharpen scissors and garden shears too?',
        answer: 'Yes. We sharpen kitchen scissors, hair scissors, and garden shears (bypass pruners, hedge shears) using the appropriate equipment for each. Scissors are $10 each, garden shears $15 each.',
      },
      {
        question: 'What is the mobile minimum for Port Coquitlam?',
        answer: '5 knives ($60). Many PoCo customers coordinate with a neighbour or two to combine orders. Our 24/7 drop-off box in North Vancouver is an alternative for smaller orders, with no minimum.',
      },
    ],
    metaTitle: 'Knife Sharpening Port Coquitlam (PoCo) | Cove Blades',
    metaDescription: 'Professional mobile knife sharpening in Port Coquitlam — 30-35 minutes from our base. $12/knife with 30-day guarantee. All PoCo neighbourhoods from Mary Hill to Citadel Heights.',
  },
  {
    slug: 'new-westminster',
    name: 'New Westminster',
    description: `Cove Blades brings professional mobile knife sharpening to New Westminster — the Royal City, BC's oldest city and one of the densest, most walkable communities in the Lower Mainland. From our North Vancouver base, we reach New West in roughly 25 to 30 minutes via the Pattullo or Queensborough connections, arriving at your door with the full sharpening setup ready to work.

New Westminster has more restaurants per capita than almost any other municipality in the region, and the city's residential mix — heritage homes on Glenbrooke North, the Quay's condo towers, the Sapperton townhouses around the new SkyTrain expansion — adds up to thousands of home cooks who use their kitchens daily. River City has always been a food town: the Quay Public Market draws crowds for fresh fish and produce, and the recent Sapperton restaurant boom has added serious culinary weight to the east side of the city. Sharp knives are foundational to all of it. Whether you are working through a weekend prep session in a Queensborough kitchen or running a station at one of the Columbia Street restaurants, a dull blade is the first thing that slows everything down.

We sharpen every type of knife on-site: German chef's knives from Wusthof and Henckels, Japanese gyutos and santokus, single-bevel yanagibas and debas, ceramic blades, serrated bread knives, cleavers, paring knives, and scissors. Each blade is inspected for chips or damage before we start, sharpened to its correct factory angle, then tested before we hand it back. We use Japanese waterstones for the precision work and professional belt systems for efficient bulk sharpening — the same approach we use for restaurant accounts across the region. Every job is backed by our 30-day edge guarantee.`,
    neighbourhoods: [
      'Quayside', 'Downtown New West', 'Sapperton',
      'Uptown', 'Brow of the Hill', 'Queensborough',
      'West End', 'Glenbrooke North', 'Connaught Heights',
      'Massey Heights', 'Queen\'s Park',
    ],
    driveTime: '25–30 minutes from our North Vancouver base',
    faqs: [
      {
        question: 'Do you serve Queensborough as well as mainland New Westminster?',
        answer: 'Yes — Queensborough is included in our New Westminster service area. Drive time from North Vancouver is about 25 minutes via Highway 91. Same booking process as mainland New West.',
      },
      {
        question: 'How long does mobile sharpening take for a typical home order?',
        answer: 'About 20 minutes for a typical home collection of 5–10 knives. We set up on a clean surface in your kitchen or garage, work through the blades one by one, and pack up. You can keep cooking, working, or watching the process — whichever you prefer.',
      },
      {
        question: 'Do you sharpen Japanese single-bevel knives?',
        answer: 'Yes, this is a specialty for us. Single-bevel yanagibas, debas, and usubas are sharpened on Japanese waterstones to match the original factory geometry. Japanese knives are $18 each.',
      },
      {
        question: 'What is the mobile minimum for New Westminster?',
        answer: '5 knives ($60). New West\'s density makes neighbour coordination easy — many of our New West bookings are 8–15 knives across two or three units in the same building.',
      },
    ],
    metaTitle: 'Knife Sharpening New Westminster | Mobile Service | Cove Blades',
    metaDescription: 'Professional mobile knife sharpening in New Westminster — 25-30 min from our N. Van base. Quayside, Sapperton, Queensborough. $12/knife with 30-day guarantee.',
  },
  {
    slug: 'richmond',
    name: 'Richmond',
    description: `Cove Blades brings professional mobile knife sharpening to Richmond, with a particular specialty in the Japanese, Chinese, and Vietnamese knives that fill Richmond kitchens. From our North Vancouver base we reach most Richmond addresses in 25 to 30 minutes via the Knight Street or Oak Street bridges, arriving at your door with the full mobile sharpening setup — Japanese waterstones, precision belt systems, and the right grit progressions for everything from a $30 cleaver to a $600 honyaki yanagiba.

Richmond is home to one of North America's most concentrated Asian food cultures, and that culture lives in the knives. Single-bevel Japanese blades, Chinese vegetable cleavers, Vietnamese chef's knives, and Korean santoku-style blades all need specific sharpening techniques that most general sharpeners get wrong. A double-bevel grind on a single-bevel yanagiba ruins the knife. Forcing a Western 20-degree angle onto a 15-degree Japanese chef's knife removes years of usable life. We do not do that. Every blade is sharpened to its original factory geometry — which for many Richmond customers means the same precise single-bevel work that the original Japanese craftsman intended.

Beyond the specialty work, we sharpen all the everyday stuff too: German knives, ceramic blades, serrated bread knives, scissors, and garden shears. Steveston's fishing heritage means a lot of Richmond customers also bring fish-prep knives — fillet knives, breaking knives, sashimi knives — and we handle all of them. We work through your knives on-site, typically 20 minutes for a home collection of 6 to 10 blades, and every sharpening is backed by our 30-day edge guarantee. If the edge does not hold under normal use, we re-sharpen at no cost.`,
    neighbourhoods: [
      'Steveston', 'Brighouse', 'Thompson',
      'Hamilton', 'Burkeville', 'Seafair',
      'Broadmoor', 'Westwind', 'Lansdowne',
      'Garden City', 'Terra Nova', 'McLennan', 'Riverdale',
    ],
    driveTime: '25–30 minutes from our North Vancouver base via the Knight Street Bridge',
    faqs: [
      {
        question: 'Do you sharpen Japanese single-bevel knives in Richmond?',
        answer: 'Yes — this is one of our specialties and probably the reason most Richmond customers find us. Yanagibas, debas, usubas, and other single-bevel blades are sharpened on Japanese waterstones with grit progressions appropriate to the steel. We match the original factory geometry rather than forcing a Western double-bevel grind. Japanese knives are $18 each.',
      },
      {
        question: 'Can you sharpen Chinese cleavers?',
        answer: 'Yes, and we sharpen a lot of them for Richmond customers. Chinese vegetable cleavers (cai dao), heavier bone cleavers, and the in-between thin-blade slicers all get the appropriate treatment. The vegetable cleaver in particular needs a finer edge than most sharpeners apply — we get it right. Standard cleavers are $18.',
      },
      {
        question: 'What about sashimi knives and fish-prep blades?',
        answer: 'Yes — including yanagiba sashimi knives, fillet knives, breaking knives, and deba blades. Steveston\'s fishing community makes up a real portion of our Richmond customers, and we know what these blades need. We use waterstones for the finishing edge on sashimi knives.',
      },
      {
        question: 'How long does it take to drive from North Vancouver to Richmond?',
        answer: 'About 25 to 30 minutes via the Knight Street Bridge or Oak Street Bridge. Traffic at bridge approaches during rush hour can extend this; we factor that into scheduling and arrive within the booked window.',
      },
    ],
    metaTitle: 'Knife Sharpening Richmond | Japanese Knife Specialists | Cove Blades',
    metaDescription: 'Professional knife sharpening in Richmond — Japanese single-bevel, Chinese cleavers, sashimi knives. Mobile service from our N. Van base, $12/knife with 30-day guarantee.',
  },
  {
    slug: 'delta',
    name: 'Delta',
    description: `Cove Blades brings professional mobile knife sharpening to all three Delta communities — North Delta, Ladner, and Tsawwassen. From our North Vancouver base we reach Delta in 35 to 45 minutes depending on which side of the municipality you are in, crossing either the Alex Fraser Bridge for North Delta or the George Massey Tunnel for Ladner and Tsawwassen. We arrive with the full professional sharpening setup and work through your knives on-site — no drop-off, no shipping, no waiting days for return.

Delta is unusual among Metro Vancouver municipalities because its three communities feel like three different towns. North Delta has the suburban density of a typical Lower Mainland neighbourhood, with the Scott Road and Nordel commercial corridors and dense residential streets. Ladner is small-town riverside — heritage homes on tree-lined streets, the Ladner Village core, fishing boats in the harbour. Tsawwassen is coastal and open, with the ocean on one side and Boundary Bay on the other. The cooking culture varies just as much: North Delta has serious South Asian and Punjabi home cooking, Ladner leans toward fresh-from-the-water seafood prep, and Tsawwassen attracts retirees and second-home owners who care about food quality.

We sharpen every type of blade for every type of cook: German chef's knives, Japanese single-bevel and double-bevel, ceramic, serrated, cleavers (Chinese vegetable and South Asian Punjabi cleavers both), fillet knives, scissors, and garden shears. Each knife is inspected for damage, sharpened to the original factory angle, then tested before handing back. We use Japanese waterstones for the precision work and belt systems for efficient bulk sharpening, the same approach we use for the restaurant kitchens we serve on a scheduled basis. Every sharpening is backed by our 30-day edge guarantee.`,
    neighbourhoods: [
      'North Delta', 'Ladner', 'Tsawwassen',
      'Ladner Village', 'Sunshine Hills', 'Annieville',
      'Kennedy Heights', 'Tsawwassen Beach', 'English Bluff',
      'Boundary Bay', 'Beach Grove', 'Scottsdale',
    ],
    driveTime: '35–45 minutes from our North Vancouver base',
    faqs: [
      {
        question: 'Do you serve all three Delta communities — North Delta, Ladner, and Tsawwassen?',
        answer: 'Yes — all three. North Delta is the closest at around 35 minutes via the Alex Fraser Bridge. Ladner is about 40 minutes through the George Massey Tunnel. Tsawwassen is the longest at 45 minutes. Same booking process for all three; the system uses your address to route us correctly.',
      },
      {
        question: 'Do you serve Tsawwassen First Nation lands?',
        answer: 'Yes — TFN addresses are within our regular Tsawwassen service area. No different from booking any other Delta address.',
      },
      {
        question: 'Can you sharpen fillet knives and fish-prep blades?',
        answer: 'Yes — including fillet knives, breaking knives, and boning knives. We sharpen a fair number of these for Ladner customers given the area\'s fishing heritage and the fresh seafood that comes home from Steveston and beyond.',
      },
      {
        question: 'What is the mobile minimum for Delta?',
        answer: '5 knives ($60). Delta is a long drive for us — coordinating with a neighbour to combine orders is genuinely helpful and many Delta customers do exactly that. The 24/7 drop-off box in North Vancouver is also an option for smaller orders with no minimum.',
      },
    ],
    metaTitle: 'Knife Sharpening Delta | North Delta, Ladner, Tsawwassen | Cove Blades',
    metaDescription: 'Professional mobile knife sharpening across Delta — North Delta, Ladner, and Tsawwassen. $12/knife with 30-day guarantee. We come to you, 35-45 min from N. Van.',
  },
  {
    slug: 'surrey',
    name: 'Surrey',
    description: `Cove Blades brings professional mobile knife sharpening to Surrey — BC's fastest-growing city and the largest municipality in our service area. Surrey covers 316 square kilometres and includes six distinct town centres, which means drive time from our North Vancouver base ranges from about 35 minutes for Whalley and City Centre to 45 or 50 minutes for South Surrey. We are upfront about that range so you know what to expect, and we arrive within the booked window with the full sharpening setup ready to work on-site.

Surrey's food culture is one of the most diverse in Canada. The South Asian and Punjabi communities concentrated around 128 Street and Newton have built a serious home-cooking tradition that involves regular use of heavy choppers, vegetable cleavers, and large chef's knives — blades that need proper sharpening to do their work without bruising or crushing. Korean families in Newton, Filipino home cooks throughout Whalley and Guildford, and the broader mix of new-Canadian food cultures across the city all add up to a sharpening market that has been underserved for years. We sharpen everything: South Asian-style choppers and cleavers, Korean santoku-style blades, Chinese vegetable cleavers, Japanese and German chef's knives, ceramic, serrated, scissors, and garden shears.

Each blade is inspected for damage, sharpened to its original factory angle using Japanese waterstones or precision belt systems as appropriate, and tested before we hand it back. Most home collections of 5 to 10 knives take 20 to 25 minutes start to finish, on-site at your address. We back every sharpening with our 30-day edge guarantee — if the edge does not hold under normal use, we re-sharpen at no cost. For Surrey customers who would prefer not to wait for a mobile appointment, the 24/7 drop-off box at 4086 Brockton Crescent in North Vancouver is about a 40-minute drive with no minimum order.`,
    neighbourhoods: [
      'Whalley', 'City Centre', 'Guildford',
      'Newton', 'Fleetwood', 'Cloverdale',
      'Panorama Ridge', 'South Surrey', 'Sullivan',
      'Fraser Heights', 'Bridgeview', 'Bear Creek',
      'Morgan Creek', 'Grandview Heights', 'Crescent Beach',
    ],
    driveTime: '35–45 minutes from our North Vancouver base, depending on Surrey neighbourhood',
    faqs: [
      {
        question: 'Do you really serve all of Surrey, including South Surrey?',
        answer: 'Yes, but we are honest about the drive. Whalley and City Centre are about 35 minutes. Guildford and Fleetwood are around 40. South Surrey, Morgan Creek, and Grandview Heights can be 45 to 50 minutes during normal traffic. The booking window reflects the actual time we need.',
      },
      {
        question: 'Do you sharpen South Asian and Punjabi cleavers and choppers?',
        answer: 'Yes, regularly. Heavy vegetable choppers, larger thali-prep cleavers, and the bigger Punjabi-style chef\'s knives all get sharpened to the appropriate angle. These blades need a working edge that holds up to heavy chopping — we know what that looks like.',
      },
      {
        question: 'What is the mobile minimum for a Surrey visit?',
        answer: '5 knives ($60). Surrey is a long drive — coordinating with a neighbour or two to combine an order helps everyone and makes the trip worth it. Many of our Surrey bookings come in at 10–15 knives across a couple of households.',
      },
      {
        question: 'Do you offer drop-off in Surrey?',
        answer: 'Not directly — our 24/7 drop-off box is at 4086 Brockton Crescent in North Vancouver, about 40 minutes from most Surrey addresses. For Surrey customers, mobile service is usually the better option unless you are already coming to the North Shore.',
      },
    ],
    metaTitle: 'Knife Sharpening Surrey | Mobile Service All Neighbourhoods | Cove Blades',
    metaDescription: 'Professional mobile knife sharpening across Surrey — Whalley to South Surrey. $12/knife, 30-day guarantee. South Asian cleaver specialists. Honest 35-45 min drive.',
  },
  {
    slug: 'white-rock',
    name: 'White Rock',
    description: `Cove Blades brings professional mobile knife sharpening to White Rock and the surrounding Greater White Rock area along Boundary Bay. From our North Vancouver base it is a 45 to 55 minute drive depending on traffic — the longest run on our regular service map — and we are honest about that upfront. For customers who value precise, professional sharpening done at their kitchen counter rather than packed up and shipped somewhere, the drive is worth it. We arrive within the booked window with the full sharpening setup ready to work on-site.

White Rock's character is different from most of Metro Vancouver. The community has a retiree-heavy demographic, a beachfront orientation, and a culinary culture that leans toward fresh fish and considered home cooking. Many of our White Rock customers are long-time home cooks who built their kitchens decades ago and have invested in serious knives over the years — Wusthof Classics from the eighties, Henckels Twins that have moved with them through three houses, Japanese gyutos picked up on trips abroad. These blades have years of life left in them with the right sharpening, and most of them have never had it. The difference between a 30-year-old Wusthof that has been pulled through a $20 sharpener and the same knife sharpened on Japanese waterstones to its correct angle is dramatic.

We sharpen every type of blade for every level of cook: German classic chef's knives, Japanese single-bevel and double-bevel, ceramic, serrated bread knives, fillet knives (a lot of these in White Rock — fresh sole and salmon are local staples), cleavers, scissors, and garden shears. Each blade is inspected for chips or damage before sharpening, then ground to its original factory angle and tested before we hand it back. Every sharpening is backed by our 30-day edge guarantee. For smaller orders or anyone visiting the North Shore anyway, the 24/7 drop-off box at 4086 Brockton Crescent has no minimum and a 24–48 hour turnaround.`,
    neighbourhoods: [
      'White Rock Beach', 'Marine Drive', 'East Beach',
      'Hillside', 'Centennial', 'Five Corners',
      'Town Centre', 'Bayridge', 'Sunnyside Heights', 'Ocean Park',
    ],
    driveTime: '45–55 minutes from our North Vancouver base',
    faqs: [
      {
        question: 'Is White Rock really within your mobile service area, given the distance?',
        answer: 'Yes. It is our longest regular drive at 45 to 55 minutes, and we are honest about that. We schedule White Rock visits with enough buffer to arrive within the booked window. If you would rather not commit to a mobile visit, the drop-off box in North Vancouver is always an option.',
      },
      {
        question: 'Can you sharpen my older Wusthof or Henckels knives?',
        answer: 'Absolutely — older German classics from Wusthof, Henckels, Sabatier, and similar makers are some of our favourite work. These knives are built to last generations with proper sharpening. We grind to the original factory angle on Japanese waterstones, which removes minimal metal and extends the knife\'s life.',
      },
      {
        question: 'Do you sharpen fillet knives and fish-prep blades?',
        answer: 'Yes — fillet knives, boning knives, and breaking knives are all standard work for us. Fresh fish is a White Rock staple and these blades need a specific edge that we know how to deliver.',
      },
      {
        question: 'What is the mobile minimum for White Rock?',
        answer: '5 knives ($60). For longer-drive areas like White Rock, coordinating with a neighbour or two to combine orders makes the visit much more efficient. Many White Rock customers do this through neighbourhood networks — 12 to 20 knives across two or three households is a common booking.',
      },
    ],
    metaTitle: 'Knife Sharpening White Rock | Mobile Service | Cove Blades',
    metaDescription: 'Professional mobile knife sharpening in White Rock and Greater White Rock. $12/knife with 30-day guarantee. Honest 45-55 min drive from N. Van. German classic specialists.',
  },
  {
    slug: 'langley',
    name: 'Langley',
    description: `Cove Blades brings professional mobile knife sharpening to Langley — both Langley City and the Township of Langley, including Walnut Grove, Willoughby, Brookswood, Fort Langley, and Aldergrove. From our North Vancouver base it is a 50 to 60 minute drive via Highway 1 or Highway 7, the longest regular trip in our service area. We are upfront about that so you know what to expect, and we arrive at your address with the full mobile sharpening setup ready to work on-site.

Langley has the unusual character of being both an established suburban municipality and a working agricultural region. Walnut Grove and Willoughby are dense residential growth areas full of family kitchens and townhouse complexes; Fort Langley is a heritage-tourism community with strong restaurants and serious home cooks; the Township's wine country and farm corridor — vineyards along Glover Road, blueberry farms, U-pick orchards — supports a cooking culture rooted in fresh local produce. The Langley food scene also includes the growing Aldergrove community and the established restaurants and butcher shops around Langley City Centre. Across all of it, sharp knives are the foundation: breaking down a whole farm chicken, slicing peaches off the orchard tree, prepping a tasting menu at one of the vineyard restaurants — every one of these benefits from a properly maintained edge.

We sharpen every type of blade: German chef's knives from Wusthof and Henckels, Japanese gyutos and santokus, single-bevel yanagibas and debas, ceramic, serrated bread knives, cleavers, scissors, garden shears, and outdoor knives (hunting knives are a real category in the Aldergrove and rural areas — we handle these properly with hollow grinds maintained). Each blade is inspected for damage before sharpening, ground to the original factory angle using Japanese waterstones or precision belt systems as appropriate, then tested. Every sharpening is backed by our 30-day edge guarantee.`,
    neighbourhoods: [
      'Langley City Centre', 'Walnut Grove', 'Willoughby',
      'Brookswood', 'Fort Langley', 'Aldergrove',
      'Murrayville', 'Milner', 'Glen Valley',
      'Salmon River', 'Otter', 'Campbell Valley',
    ],
    driveTime: '50–60 minutes from our North Vancouver base',
    faqs: [
      {
        question: 'Do you cover both Langley City and Langley Township?',
        answer: 'Yes — both. The civic distinction between the two is mostly a government one; for our purposes, all of Langley is one service area. Same booking process for any Langley address.',
      },
      {
        question: 'Can you sharpen hunting knives and outdoor blades?',
        answer: 'Yes. Hunting knives, skinning knives, and outdoor blades are common work for us in the Langley area. Hollow grinds and convex edges are maintained appropriately — we do not force a flat grind onto a knife that was built differently.',
      },
      {
        question: 'Given the drive time, can I coordinate with neighbours to combine an order?',
        answer: 'Absolutely — and we strongly recommend it for Langley. A 50-minute drive each way makes more sense when we are sharpening 15 or 20 knives across a few households. Many Langley bookings come in this way through neighbourhood networks or family groups.',
      },
      {
        question: 'Is there a higher minimum for Langley because of the drive?',
        answer: 'No — the standard 5-knife ($60) minimum applies. We absorb the drive cost as part of our regular service. That said, larger orders (combined with neighbours or extended family) make the per-knife economics better for everyone.',
      },
    ],
    metaTitle: 'Knife Sharpening Langley | Township & City | Cove Blades',
    metaDescription: 'Professional mobile knife sharpening across Langley — City and Township. Walnut Grove to Aldergrove. $12/knife, 30-day guarantee. Honest 50-60 min drive from N. Van.',
  },
  {
    slug: 'maple-ridge',
    name: 'Maple Ridge',
    description: `Cove Blades brings professional mobile knife sharpening to Maple Ridge, the gateway community to Golden Ears Provincial Park and one of the fastest-growing suburban centres in Metro Vancouver. From our North Vancouver base it is a 40 to 50 minute drive via the Lougheed Highway or the Golden Ears Bridge — the bridge route has dramatically improved access from the south Fraser and the North Shore alike. We arrive at your address with the full mobile sharpening setup ready to work on-site, no drop-off needed.

Maple Ridge has a character that mixes suburban density with genuine rural and outdoor culture. Albion, Cottonwood, and Silver Valley are family-oriented residential neighbourhoods full of homes where weekend meal prep is a routine. Hammond and West Maple Ridge have older heritage homes and the Haney waterfront area. And the eastern reaches — Whonnock, Webster's Corners, the rural acreages along 240 Street — feel more like the foothills than the suburbs. That outdoor culture matters for sharpening: Maple Ridge customers bring hunting knives, fishing knives, and serious outdoor blades alongside the standard kitchen lineup. We handle all of it properly. Hollow grinds stay hollow, convex edges stay convex, and the kitchen knives get the same Japanese-waterstone precision we use for any other customer.

We sharpen every blade type: German chef's knives, Japanese single-bevel and double-bevel, ceramic, serrated, cleavers, fillet knives, hunting and skinning knives, scissors, and garden shears. Each blade is inspected for chips or damage, sharpened to the original factory angle, then tested before we hand it back. Most home collections of 5 to 10 knives take 20 minutes start to finish. Every sharpening is backed by our 30-day edge guarantee. We often combine Maple Ridge visits with neighbouring Pitt Meadows on the same trip — if you would like to coordinate, mention it in the booking notes.`,
    neighbourhoods: [
      'Hammond', 'Haney', 'Albion',
      'Cottonwood', 'Silver Valley', 'West Maple Ridge',
      'Whonnock', 'Webster\'s Corners', 'Yennadon',
      'Thornhill', 'Ruskin', 'East Maple Ridge',
    ],
    driveTime: '40–50 minutes from our North Vancouver base',
    faqs: [
      {
        question: 'Can you reach Maple Ridge via the Golden Ears Bridge?',
        answer: 'Yes — and we often do. The Golden Ears Bridge route has dramatically improved access. Total drive from North Vancouver is around 40 to 50 minutes depending on time of day.',
      },
      {
        question: 'Do you sharpen hunting and outdoor knives?',
        answer: 'Yes. Hunting knives, skinning knives, fillet knives, and other outdoor blades are common work for us in Maple Ridge given the proximity to Golden Ears, fishing on Alouette, and the broader outdoor culture. We maintain hollow grinds and convex edges appropriately rather than forcing flat grinds.',
      },
      {
        question: 'Can you combine a Maple Ridge visit with Pitt Meadows?',
        answer: 'Often, yes — they are adjacent and we sometimes route both in a single afternoon. Mention it in your booking notes if you are coordinating with a Pitt Meadows neighbour and we will try to schedule efficiently.',
      },
      {
        question: 'What is the mobile minimum for Maple Ridge?',
        answer: '5 knives ($60). Family households tend to bring 8–12 knives once they include the kids\' camping knives, the hunting blades, the garden shears, and the standard kitchen set. Combining with a neighbour or two makes it even more efficient.',
      },
    ],
    metaTitle: 'Knife Sharpening Maple Ridge | Mobile Service | Cove Blades',
    metaDescription: 'Professional mobile knife sharpening in Maple Ridge — Hammond to Whonnock. $12/knife with 30-day guarantee. Hunting and outdoor knives too. 40-50 min from N. Van.',
  },
  {
    slug: 'pitt-meadows',
    name: 'Pitt Meadows',
    description: `Cove Blades brings professional mobile knife sharpening to Pitt Meadows, the smaller of the two communities that share the Maple Ridge–Pitt Meadows region. From our North Vancouver base it is a 40 to 45 minute drive via the Lougheed Highway or the Golden Ears Bridge route. We bring the full mobile sharpening setup to your kitchen and work through your knives on-site — most home collections take 20 minutes start to finish.

Pitt Meadows has a quietly distinct character: smaller population than Maple Ridge (around 20,000 residents), more rural and agricultural, with the blueberry farms and cranberry bogs that define the Pitt Polder forming a big part of the local landscape. The community runs from the dense Bonson and Osprey Village core out to the agricultural acreages around Harris Road and Old Dewdney Trunk. Many Pitt Meadows households are serious home cooks — the kind who make jam from their own berries, smoke their own fish, and want their knives to actually work. A properly sharpened blade is the difference between a frustrating prep session and an efficient one. We see this every visit: customers genuinely surprised at how much faster and easier their cooking becomes once their knives are doing their job properly.

We sharpen every type of blade: German chef's knives, Japanese single-bevel and double-bevel, ceramic, serrated bread knives, cleavers, fillet knives, hunting and outdoor knives, scissors, and garden shears (a lot of garden shears in Pitt Meadows — agricultural community, lots of pruning). Each blade is inspected for damage, sharpened to its original factory angle, then tested before we hand it back. Every sharpening comes with our 30-day edge guarantee. We often combine Pitt Meadows and Maple Ridge visits on the same route — if you are coordinating with a Maple Ridge neighbour, mention it in your booking notes and we will schedule both efficiently.`,
    neighbourhoods: [
      'Central Pitt Meadows', 'Bonson', 'Osprey Village',
      'Mid-Meadows', 'North Pitt Meadows', 'South Pitt Meadows',
      'Meadowtown', 'Pitt Polder', 'Harris Road', 'West Pitt Meadows',
    ],
    driveTime: '40–45 minutes from our North Vancouver base',
    faqs: [
      {
        question: 'Can you combine a Pitt Meadows visit with Maple Ridge?',
        answer: 'Often, yes — we sometimes route both communities in a single afternoon. Mention it in your booking notes if you are coordinating with a Maple Ridge neighbour and we will try to schedule efficiently.',
      },
      {
        question: 'Do you sharpen garden shears and pruning equipment?',
        answer: 'Yes. Bypass pruners, hedge shears, and similar garden tools are sharpened using the appropriate equipment. Standard garden shears are $15 each. Larger loppers and specialty tools — ask in your booking notes.',
      },
      {
        question: 'What is the mobile minimum for Pitt Meadows?',
        answer: '5 knives ($60). Most Pitt Meadows households bring 6–10 knives plus a few garden tools — easy to hit the minimum on a typical visit.',
      },
      {
        question: 'Can I drop knives off in North Vancouver instead?',
        answer: 'Yes — our 24/7 drop-off box at 4086 Brockton Crescent has no minimum order and a 24–48 hour turnaround. It is about a 45-minute drive from Pitt Meadows. For customers heading to the North Shore anyway, this is often the simplest option.',
      },
    ],
    metaTitle: 'Knife Sharpening Pitt Meadows | Mobile Service | Cove Blades',
    metaDescription: 'Professional mobile knife sharpening in Pitt Meadows. $12/knife with 30-day guarantee. Garden shears, hunting knives, kitchen blades. 40-45 min drive from N. Van.',
  },
]

export function getCityBySlug(slug: string): CityData | undefined {
  return cities.find(c => c.slug === slug)
}
