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
  /** Only North Vancouver promotes drop-off as a primary service. Everywhere else is mobile-only. */
  readonly dropOffEmphasis: boolean
  /** Optional sub-region grouping for the service-area hub page. */
  readonly subRegion?: 'North Shore' | 'Vancouver' | 'Burnaby & New West' | 'Tri-Cities' | 'South of Fraser' | 'Fraser Valley'
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
    dropOffEmphasis: true,
    subRegion: 'North Shore',
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
    dropOffEmphasis: false,
    subRegion: 'Vancouver',
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
        answer: 'Book online through our website or call 604-210-8180. Choose a date and time that works for you, and we will drive to your Burnaby address with our full mobile sharpening setup. The whole process takes about 20 minutes for a typical home collection.',
      },
      {
        question: 'What is the mobile sharpening minimum for Burnaby?',
        answer: 'Mobile visits to Burnaby require a minimum of 5 knives ($60). This keeps our per-knife pricing low while covering travel from our North Vancouver base. Most customers bring 6–12 knives per visit.',
      },
      {
        question: 'What types of knives do you sharpen for Burnaby kitchens?',
        answer: 'Burnaby has one of the most diverse food scenes in Metro Vancouver, and we sharpen the full range that comes with it: Western chef knives, Chinese cleavers, Japanese gyuto and santoku, Vietnamese vegetable knives, ceramic blades, kitchen scissors, and serrated breads. Each blade is matched to its correct angle and technique.',
      },
      {
        question: 'Do you sharpen for Burnaby restaurants and commercial kitchens?',
        answer: 'Yes. We provide scheduled weekly and bi-weekly mobile sharpening for commercial kitchens across Burnaby. Consistent professional sharpening keeps your line running smoothly and reduces blade replacement costs by extending knife life.',
      },
    ],
    metaTitle: 'Knife Sharpening Burnaby | Mobile Service | Cove Blades',
    metaDescription: 'Professional mobile knife sharpening in Burnaby. We come to your home or restaurant in 20–25 minutes. $12/knife with 30-day edge guarantee. Book online today.',
    dropOffEmphasis: false,
    subRegion: 'Burnaby & New West',
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
        question: 'How long does a mobile sharpening visit in West Vancouver take?',
        answer: 'Most West Vancouver home collections of 5–10 knives are sharpened on-site in 20–30 minutes. We work from a self-contained station — no countertop mess, no setup required from you. Larger collections or restoration work may take longer; we will give you a realistic estimate when we arrive.',
      },
    ],
    metaTitle: 'Knife Sharpening West Vancouver | 15-Min Away | Cove Blades',
    metaDescription: 'Professional mobile knife sharpening in West Vancouver. Japanese knife specialists just 15 minutes from our North Vancouver shop. $12/knife with 30-day guarantee.',
    dropOffEmphasis: false,
    subRegion: 'North Shore',
  },
  {
    slug: 'coquitlam',
    name: 'Coquitlam',
    description: `Cove Blades brings professional mobile knife sharpening to Coquitlam — from Coquitlam Centre and Burke Mountain to Westwood Plateau and the historic Maillardville district. We drive over from North Vancouver via the Second Narrows Bridge, typically reaching Coquitlam addresses in 25–30 minutes with our full portable sharpening setup.

Coquitlam is the largest of the Tri-Cities, home to roughly 150,000 residents and one of Metro Vancouver's most varied food scenes. From the dim sum and pho along North Road to the family-run kitchens of Austin Heights and the upscale dining clustering near Lafarge Lake, sharp knives are the difference between a kitchen that works and one that fights you. Burke Mountain and Westwood Plateau are full of well-equipped kitchens — Wüsthof and Shun blades that deserve professional sharpening rather than a pull-through sharpener that grinds away years of life.

Our mobile service is straightforward: book online, we arrive at your Coquitlam address at the agreed time, and we work through your knives on-site. Most residential collections of 5–10 knives are sharpened in 20–25 minutes. Every blade — Western chef, Japanese gyuto, ceramic, serrated bread, kitchen scissors — is matched to its correct angle and tested before we hand it back. The 30-day edge guarantee means if it does not hold under normal use, we re-sharpen at no charge.`,
    neighbourhoods: [
      'Coquitlam Centre', 'Burke Mountain', 'Westwood Plateau',
      'Austin Heights', 'Maillardville', 'Town Centre',
      'Ranch Park', 'Eagle Ridge', 'Cape Horn', 'River Springs',
    ],
    driveTime: '25–30 minutes from our North Vancouver base',
    faqs: [
      {
        question: 'How quickly can you reach Coquitlam for mobile knife sharpening?',
        answer: 'We are typically 25–30 minutes from most Coquitlam addresses, coming over the Second Narrows Bridge. Mobile appointments are usually available within 1–2 business days. Burke Mountain and Westwood Plateau add a few minutes due to elevation, but we include that in our scheduling.',
      },
      {
        question: 'What is the minimum for mobile sharpening in Coquitlam?',
        answer: 'Mobile visits to Coquitlam require a minimum of 5 knives ($60). Many Coquitlam customers coordinate with neighbours or family on the same street to combine orders — that gets everyone the per-knife rate without each household hitting the minimum.',
      },
      {
        question: 'Do you handle Japanese knives that are common in Burke Mountain and Westwood Plateau kitchens?',
        answer: 'Yes — Japanese knives are a specialty. We sharpen single-bevel and double-bevel Japanese blades using waterstones, matching the original factory geometry rather than forcing a Western grind. Brands like Shun, Global, Miyabi, Tojiro, and custom makers all welcome. Japanese knives are $18 each.',
      },
      {
        question: 'Do you sharpen for Coquitlam restaurants and commercial kitchens?',
        answer: 'Yes. We provide scheduled weekly and bi-weekly mobile sharpening for restaurants across Coquitlam — from Coquitlam Centre operations to neighbourhood eateries in Austin Heights. Consistent professional sharpening reduces blade replacement costs and keeps your line moving without downtime.',
      },
    ],
    metaTitle: 'Knife Sharpening Coquitlam | Mobile Service | Cove Blades',
    metaDescription: 'Professional mobile knife sharpening in Coquitlam, BC. We come to your home or restaurant in 25–30 minutes from North Vancouver. $12/knife with 30-day guarantee.',
    dropOffEmphasis: false,
    subRegion: 'Tri-Cities',
  },
  {
    slug: 'port-moody',
    name: 'Port Moody',
    description: `Cove Blades provides professional mobile knife sharpening across Port Moody, from Newport Village and Suter Brook to the Brewer's Row craft-beer corridor and the homes climbing Heritage Mountain. We are about 22–28 minutes away in our North Vancouver shop, bringing the full sharpening setup directly to your door.

Port Moody is small by Lower Mainland standards — roughly 33,000 residents — but the food and drink scene punches well above its weight. Brewer's Row alone (Yellow Dog, Twin Sails, Parkside, Moody Ales, Mariner) anchors a culinary district that draws visitors from across Metro Vancouver. Newport Village and Suter Brook fill in with neighbourhood restaurants, grocery, and the kind of resident who actually cares which knife is sharp. Add the foodie reputation built around Pajo's smoked salmon at Rocky Point and the slow-burning growth of Inlet Centre, and you have a city where dull knives do not stay dull for long.

Mobile sharpening fits Port Moody especially well: the inlet's geography means most homes are clustered along a manageable corridor between Inlet Centre, Newport, and Heritage. We can arrive, work through 5–15 blades on-site in 20–30 minutes, and be on our way without anyone having to ship knives off or drive to the North Shore. We sharpen the full range — German, Japanese, ceramic, serrated, scissors, and the occasional axe or machete from the garage — and back every blade with our 30-day edge guarantee.`,
    neighbourhoods: [
      'Newport Village', 'Suter Brook', 'Inlet Centre',
      'Heritage Mountain', 'Heritage Woods', 'Glenayre',
      'College Park', 'Pleasantside', 'Anmore', 'Belcarra',
      "Rocky Point", "Brewer's Row",
    ],
    driveTime: '22–28 minutes from our North Vancouver base',
    faqs: [
      {
        question: 'How quickly can you get to Port Moody for mobile knife sharpening?',
        answer: 'Most Port Moody addresses are 22–28 minutes from our North Vancouver shop, depending on traffic on the Second Narrows. Heritage Mountain and Anmore add a few minutes for elevation. We typically schedule mobile visits within 1–2 business days, with same-day spots when calendars allow.',
      },
      {
        question: "Do you sharpen for restaurants and breweries on Brewer's Row?",
        answer: "Yes. We work with several Brewer's Row taprooms and the surrounding food businesses on a scheduled weekly or bi-weekly mobile rotation. We come during prep hours, sharpen on-site at a designated station, and rotate blades so the line keeps moving while we work.",
      },
      {
        question: 'What is the minimum order for mobile sharpening in Port Moody?',
        answer: 'Mobile visits to Port Moody require a minimum of 5 knives ($60). Many Port Moody customers combine orders with friends or strata neighbours — you can hit the minimum quickly with even one or two extra households on the same visit.',
      },
      {
        question: 'Do you handle the high-end Japanese knives common in Suter Brook and Newport kitchens?',
        answer: 'Yes. Japanese knives are a specialty — single-bevel yanagiba, deba, usuba, double-bevel gyuto and santoku, plus custom makers. We use Japanese waterstones and match the original factory angle rather than forcing a Western grind. Japanese knives are $18 each.',
      },
    ],
    metaTitle: 'Knife Sharpening Port Moody | Mobile Service | Cove Blades',
    metaDescription: "Professional mobile knife sharpening in Port Moody. Serving Newport Village, Suter Brook, Brewer's Row, Heritage Mountain. $12/knife with 30-day guarantee. Book online.",
    dropOffEmphasis: false,
    subRegion: 'Tri-Cities',
  },
  {
    slug: 'port-coquitlam',
    name: 'Port Coquitlam',
    description: `Cove Blades brings professional mobile knife sharpening to Port Coquitlam, covering Downtown PoCo along Shaughnessy Street, the established neighbourhoods of Mary Hill and Lincoln Park, and the newer developments climbing Citadel Heights. We come over from North Vancouver, typically arriving in 30–35 minutes with our full portable sharpening station.

Port Coquitlam is its own city, distinct from Coquitlam — about 62,000 residents, with a more residential and family-oriented character than its larger neighbour. Downtown PoCo has been quietly revitalizing for years; Shaughnessy Street's mix of long-running diners and newer kitchens shows what happens when a community keeps cooking through generations. PoCo is also Terry Fox's hometown, and that no-shortcuts ethic shows up in the kind of customer who calls us — people who would rather take care of one good knife than churn through three bad ones.

Mobile sharpening is the right fit for Port Coquitlam because dropping off doesn't make sense from this side of the Fraser. We arrive at your home, work through your kitchen knives on-site (typically 5–12 blades in 20–25 minutes), and you're back to cooking without disrupting your day. Beyond kitchen knives, Port Coquitlam customers regularly bring out garden pruners, secateurs, hunting knives, fishing fillet blades, and the occasional hatchet or axe from the garage. We sharpen all of it and back every edge with our 30-day guarantee.`,
    neighbourhoods: [
      'Downtown Port Coquitlam', 'Mary Hill', 'Citadel Heights',
      'Birchland Manor', 'Lincoln Park', 'Glenwood',
      'Riverwood', 'Central Port Coquitlam', 'Oxford Heights',
    ],
    driveTime: '30–35 minutes from our North Vancouver base',
    faqs: [
      {
        question: 'How long does it take you to drive to Port Coquitlam?',
        answer: 'Port Coquitlam is 30–35 minutes from our North Vancouver shop via the Second Narrows Bridge. Citadel Heights and Mary Hill are at the longer end of that range. We schedule mobile visits 1–2 business days out, with morning slots typically the most flexible.',
      },
      {
        question: 'What is the minimum order for mobile sharpening in Port Coquitlam?',
        answer: 'Mobile visits to Port Coquitlam require a minimum of 5 knives ($60). It is a popular city for combined orders — Mary Hill and Lincoln Park families often coordinate with neighbours so a single visit covers two or three households at the per-knife rate.',
      },
      {
        question: 'Do you sharpen garden pruners, secateurs, and outdoor blades in Port Coquitlam?',
        answer: 'Yes. Beyond kitchen knives, we routinely sharpen pruners, secateurs, hedge shears, hunting knives, fillet knives, axes, and machetes for Port Coquitlam customers. Pricing depends on the tool — kitchen knives are $12, scissors $12, larger garden tools and outdoor blades typically $15–$25 each.',
      },
      {
        question: 'Do you offer scheduled service for Port Coquitlam restaurants?',
        answer: 'Yes. We provide weekly and bi-weekly scheduled mobile sharpening for restaurants in Downtown Port Coquitlam and along Lougheed. We work around your prep schedule and sharpen the entire knife inventory on-site.',
      },
    ],
    metaTitle: 'Knife Sharpening Port Coquitlam | Mobile Service | Cove Blades',
    metaDescription: 'Professional mobile knife sharpening in Port Coquitlam, BC. Serving Downtown PoCo, Mary Hill, Lincoln Park, Citadel Heights. $12/knife with 30-day guarantee.',
    dropOffEmphasis: false,
    subRegion: 'Tri-Cities',
  },
  {
    slug: 'richmond',
    name: 'Richmond',
    description: `Cove Blades brings professional mobile knife sharpening to Richmond, from City Centre and Aberdeen Square through Steveston Village out to South Arm and Hamilton. We come over from North Vancouver via the Knight Street or Oak Street bridge, typically reaching most Richmond addresses in 25–30 minutes with our full mobile sharpening setup.

Richmond is, by most measures, the Asian food capital of North America — the dim sum, hot pot, hand-pulled noodles, Hong Kong-style cafes, izakaya, and Vietnamese kitchens here are world class. With a population around 209,000 and one of the highest densities of restaurants per capita in Metro Vancouver, the city's commercial kitchens and home cooks both depend on knives that can handle volume and precision. Chinese cleavers, Japanese gyutos, Vietnamese vegetable knives, and the specialty blades for Cantonese and Sichuan cooking all need different bevels and different techniques. We sharpen them all.

Steveston is a different story but the same conclusion. The historic fishing village still has a working harbour, salmon coming off boats, and home kitchens that prep fresh catch the same day. Fillet knives, sashimi blades, and old hand-me-down knives that have been sharpened a hundred times over — all welcome on the bench. Mobile service fits Richmond particularly well: the city is flat, addresses are easy to find, and we can plan a route that hits multiple streets in a single visit. $12 per kitchen knife, $18 for Japanese single-bevel, 30-day edge guarantee on every blade we touch.`,
    neighbourhoods: [
      'City Centre', 'Steveston', 'Hamilton', 'Bridgeport',
      'East Richmond', 'South Arm', 'Broadmoor', 'Sea Island',
      'Aberdeen', 'Brighouse', 'Seafair', 'No.5 Road',
    ],
    driveTime: '25–30 minutes from our North Vancouver base',
    faqs: [
      {
        question: 'Do you sharpen Chinese cleavers and Japanese knives in Richmond?',
        answer: 'Yes — Richmond is one of the cities where we sharpen the widest variety of blades. Chinese cleavers (both vegetable and bone) get matched to their proper bevel; Japanese single-bevel yanagiba and deba get the waterstone treatment; double-bevel gyuto and santoku get the appropriate factory angle. Standard kitchen knives are $12, Japanese single-bevel and ceramic are $18, large cleavers around $15.',
      },
      {
        question: 'How long does it take you to drive from North Vancouver to Richmond?',
        answer: 'Most Richmond addresses are 25–30 minutes from our shop, depending on bridge traffic. We typically take Knight Street or Oak Street into the city, then route through depending on whether you are in City Centre, Steveston, Hamilton, or East Richmond. We schedule mobile visits 1–2 business days out.',
      },
      {
        question: 'What is the minimum order for mobile sharpening in Richmond?',
        answer: 'Mobile visits to Richmond require a minimum of 5 knives ($60). Many home cooks easily hit this with their everyday set; restaurant clients on a scheduled rotation usually book 30–80 knives per visit. Strata buildings and apartment complexes often coordinate building-wide service days that drop the per-customer minimum.',
      },
      {
        question: 'Do you offer scheduled service for Richmond restaurants and dim sum kitchens?',
        answer: 'Yes. We provide weekly and bi-weekly scheduled mobile sharpening for restaurants across Richmond, including high-volume dim sum kitchens, izakaya, hot pot, and Vietnamese pho operations. We work around your prep schedule — typically arriving between morning prep and lunch service — and sharpen the entire knife inventory on-site.',
      },
    ],
    metaTitle: 'Knife Sharpening Richmond, BC | Mobile Service | Cove Blades',
    metaDescription: 'Professional mobile knife sharpening in Richmond, BC. Serving City Centre, Steveston, Hamilton. Chinese cleavers, Japanese knives, restaurant kitchens. $12/knife.',
    dropOffEmphasis: false,
    subRegion: 'Vancouver',
  },
  {
    slug: 'surrey',
    name: 'Surrey',
    description: `Cove Blades brings professional mobile knife sharpening across Surrey — the largest city in British Columbia — covering all six town centres from Whalley/City Centre and Guildford through Newton, Fleetwood, Cloverdale, and South Surrey/White Rock. Drive time from our North Vancouver shop ranges from 35 to 50 minutes depending on which corner of Surrey we are heading to and which bridge we cross.

Surrey is over 568,000 residents and growing fast — by some projections, it will surpass Vancouver in population within a decade. The food scene reflects that scale and that diversity. Newton and the 152nd Street corridor anchor the Punjabi food capital of Canada — tandoori, biryani, sweets, and the kind of spice-prep volume that demands sharp blades. Cloverdale's heritage runs through the rodeo grounds and the older village core. Whalley is revitalizing alongside the Skytrain expansion, with new restaurants every quarter. South Surrey trends affluent and Japanese-knife heavy; Guildford is family-dense and home to dozens of independent restaurants.

Mobile sharpening makes more sense in Surrey than almost anywhere else in the Lower Mainland — drop-off across the Pattullo or Port Mann is a non-starter for most residents. We arrive at your address, work through 5–15 blades on-site in 20–30 minutes, and you are back to cooking. Restaurant accounts in Newton, City Centre, and Cloverdale are typically on weekly or bi-weekly schedules. Standard kitchen knives are $12, Japanese single-bevel and ceramic $18, with our 30-day edge guarantee on every blade.`,
    neighbourhoods: [
      'City Centre / Whalley', 'Guildford', 'Newton', 'Fleetwood',
      'Cloverdale', 'South Surrey', 'Sullivan Heights',
      'Panorama Ridge', 'Clayton', 'Fraser Heights',
      'Bridgeview', 'Bear Creek',
    ],
    driveTime: '35–50 minutes from our North Vancouver base',
    faqs: [
      {
        question: 'Which parts of Surrey do you serve for mobile knife sharpening?',
        answer: 'All six town centres: Whalley/City Centre, Guildford, Newton, Fleetwood, Cloverdale, and South Surrey. Drive times vary — Whalley and Guildford are closest at around 35–40 minutes; Newton, Fleetwood, and Cloverdale are 40–50 minutes; South Surrey runs 45–55 minutes depending on traffic.',
      },
      {
        question: 'Do you sharpen the kinds of knives used in Newton and Surrey Punjabi kitchens?',
        answer: 'Yes — heavy-duty chef knives, cleavers, vegetable knives, and the specialty blades used for tandoori prep are all routine work for us. We match each blade to its correct bevel and grind. Standard kitchen knives are $12 each, larger cleavers $15, ceramic and Japanese single-bevel $18.',
      },
      {
        question: 'What is the minimum for mobile sharpening in Surrey?',
        answer: 'Mobile visits to Surrey require a minimum of 5 knives ($60) given the longer drive. South Surrey and Cloverdale clients sometimes batch with neighbours to hit the minimum efficiently — we are happy to do multi-stop visits on the same street or strata.',
      },
      {
        question: 'Do you provide scheduled service for Surrey restaurants?',
        answer: 'Yes. We run weekly and bi-weekly mobile rotations for restaurants across all six Surrey town centres, including high-volume Punjabi kitchens in Newton, the diverse food scene in Whalley/City Centre, and the South Surrey strip. We work around your prep schedule and sharpen on-site without taking blades off the line.',
      },
    ],
    metaTitle: 'Knife Sharpening Surrey, BC | Mobile Service | Cove Blades',
    metaDescription: 'Professional mobile knife sharpening across Surrey — City Centre, Guildford, Newton, Fleetwood, Cloverdale, South Surrey. $12/knife with 30-day guarantee.',
    dropOffEmphasis: false,
    subRegion: 'South of Fraser',
  },
  {
    slug: 'delta',
    name: 'Delta',
    description: `Cove Blades provides mobile knife sharpening across all three communities of Delta — North Delta, Ladner, and Tsawwassen. We come over from North Vancouver, typically reaching North Delta in 35–45 minutes, Ladner in 40–50 minutes, and Tsawwassen in around 50 minutes. Mobile makes sense here: from Delta, dropping off across two bridges and a tunnel is not realistic for most customers.

Delta is one of those Lower Mainland cities that does not feel like one. North Delta is suburban-dense, with a strong residential character along Scott Road and the corridor up to Sunshine Hills. Ladner is a riverfront village with deep fishing roots, working farms, and a tight-knit community where many homes have been in the same family for generations. Tsawwassen is the beach town — wide oceanfront views, the BC Ferries terminal, the relatively new Tsawwassen Mills shopping district, and a residential mix that skews toward retirees and families. Each community cooks differently. North Delta runs Punjabi, Filipino, and Vietnamese kitchens; Ladner does seafood and farm-to-table; Tsawwassen tilts toward Japanese, Italian, and West Coast.

Our mobile setup is self-contained — we bring power, lighting, and a portable sharpening station. Most home collections of 5–12 blades take 20–30 minutes on-site. We sharpen every type of kitchen knife, plus garden tools, fishing fillet knives (a common request from Ladner and Tsawwassen waterfront homes), and the occasional axe or machete. $12 per kitchen knife, $18 for Japanese single-bevel and ceramic, with our 30-day edge guarantee on every blade.`,
    neighbourhoods: [
      'North Delta', 'Sunshine Hills', 'Annacis Island',
      'Ladner', 'Ladner Village', 'East Ladner',
      'Tsawwassen', 'Tsawwassen Heights', 'English Bluff',
      'Beach Grove', 'Scott Road',
    ],
    driveTime: '35–50 minutes from our North Vancouver base',
    faqs: [
      {
        question: 'Do you serve all three communities of Delta?',
        answer: 'Yes — North Delta, Ladner, and Tsawwassen. Drive times vary: North Delta is 35–45 minutes, Ladner is 40–50 minutes, and Tsawwassen is around 50 minutes from our North Vancouver shop. Tsawwassen Heights and beach-side addresses are at the far end of that range.',
      },
      {
        question: 'What is the minimum for mobile sharpening in Delta?',
        answer: 'Mobile visits to Delta require a minimum of 5 knives ($60) given the drive. Many Ladner and Tsawwassen households coordinate with friends or neighbours to combine into one visit — that is the most economical way to use the service.',
      },
      {
        question: 'Do you sharpen fillet knives and fishing blades for Ladner and Tsawwassen waterfront homes?',
        answer: 'Yes — fillet knives, fishing knives, and bait knives are routine work for us, especially for Ladner and Tsawwassen customers. Fillet knives are $12 each; we restore tip damage and re-set the flex/edge geometry on flexible blades.',
      },
      {
        question: 'Do you serve Delta restaurants on a scheduled basis?',
        answer: 'Yes. We provide weekly and bi-weekly mobile sharpening for restaurants and commercial kitchens across Delta, including the Tsawwassen and Ladner waterfronts. We arrive during prep hours, sharpen on-site, and rotate blades so service is uninterrupted.',
      },
    ],
    metaTitle: 'Knife Sharpening Delta, BC | Mobile Service | Cove Blades',
    metaDescription: 'Professional mobile knife sharpening in North Delta, Ladner, and Tsawwassen. $12/knife with 30-day guarantee. We come to you. Book online today.',
    dropOffEmphasis: false,
    subRegion: 'South of Fraser',
  },
  {
    slug: 'new-westminster',
    name: 'New Westminster',
    description: `Cove Blades brings mobile knife sharpening to New Westminster — the Royal City, BC's oldest city — covering Downtown along Columbia Street, the Quay along the Fraser River, the Brewery District, Sapperton, and across the bridge into Queensborough. From our North Vancouver shop, we typically reach New West in 25–35 minutes via the Second Narrows Bridge.

New Westminster has been quietly remaking itself for years. The Quay's Public Market remains the social heart of the riverfront; Sapperton is in the middle of an obvious renaissance, with new restaurants every season and a strong cluster around Royal Columbian Hospital and the Brewery District. Columbia Street downtown is a mix of long-running diners and new openings, and Queensborough — across the Fraser, often forgotten — has its own residential and small-business scene growing fast. The city is dense, walkable in spots, and full of the kind of resident who actually knows what their knives should feel like.

Mobile sharpening fits well here because parking and short drives suit the neighbourhood-scale of New West. We arrive at your address with a self-contained portable station, work through your kitchen blades on-site (usually 5–15 knives in 20–30 minutes), and you are back to your evening. We sharpen the full range — Western chef, Japanese, ceramic, serrated, scissors, and the occasional axe or pruner — and back every blade with our 30-day edge guarantee.`,
    neighbourhoods: [
      'Downtown New West', 'Quay', 'Sapperton',
      'Brewery District', 'Queensborough', 'Uptown',
      'Glenbrooke North', 'West End', 'Connaught Heights',
      'Massey-Victory Heights', 'Queens Park',
    ],
    driveTime: '25–35 minutes from our North Vancouver base',
    faqs: [
      {
        question: 'How quickly can you get to New Westminster for mobile sharpening?',
        answer: 'Most New Westminster addresses are 25–35 minutes from our shop via the Second Narrows Bridge and Brunette Avenue. Queensborough takes a few extra minutes due to the river crossing. We typically schedule mobile visits 1–2 business days out.',
      },
      {
        question: 'Do you serve Sapperton and the Brewery District for restaurant sharpening?',
        answer: 'Yes — Sapperton and the Brewery District are on a regular rotation for several of our scheduled restaurant accounts. We also serve Columbia Street downtown and the Quay. Weekly and bi-weekly schedules are typical depending on volume.',
      },
      {
        question: 'What is the minimum order for mobile sharpening in New Westminster?',
        answer: 'Mobile visits to New West require a minimum of 5 knives ($60). Strata buildings on the Quay and Uptown often coordinate building-wide visits — let us know if your building wants a service day and we can sometimes drop the per-household minimum for the group.',
      },
      {
        question: 'Do you sharpen Japanese knives common in New West kitchens?',
        answer: 'Yes. We sharpen single-bevel and double-bevel Japanese blades using waterstones, matching the original factory geometry. Brands like Shun, Global, Miyabi, Tojiro, and custom makers are all welcome at $18 per Japanese knife.',
      },
    ],
    metaTitle: 'Knife Sharpening New Westminster | Mobile Service | Cove Blades',
    metaDescription: 'Professional mobile knife sharpening in New Westminster — Downtown, Quay, Sapperton, Brewery District, Queensborough. $12/knife with 30-day guarantee.',
    dropOffEmphasis: false,
    subRegion: 'Burnaby & New West',
  },
  {
    slug: 'maple-ridge',
    name: 'Maple Ridge',
    description: `Cove Blades brings mobile knife sharpening to Maple Ridge, covering the central downtown along Lougheed Highway, the older neighbourhoods of West Maple Ridge and Hammond, the larger residential lots out toward Albion and Whonnock, and the equestrian and rural pockets that give the city its character. From our North Vancouver shop, we typically reach Maple Ridge in 40–50 minutes via the Second Narrows and the Pitt River Bridge.

Maple Ridge has a different feel from the cities closer in to Vancouver. With around 95,000 residents and a footprint that runs from suburban downtown through semi-rural acreage out to the foot of Golden Ears, the city is full of homes with bigger lots, garden tools, hunting knives, and the kind of household that processes its own deer and salmon. Equestrian properties around 224th and 232nd Street come with the working tools that horses need; family gardens come with secateurs and pruners. Kitchen-knife customers exist too — Maple Ridge has a quietly excellent restaurant scene clustered around downtown and Maple Meadows — but the mix of work we see here is more varied than in Vancouver or Burnaby.

Our mobile setup handles all of it. We arrive with our portable station, work through your blades on-site (kitchen knives in 20–25 minutes for a typical home set; garden tools and outdoor blades a little longer per piece), and you keep your day. Standard kitchen knives are $12, Japanese single-bevel and ceramic $18, larger garden tools and outdoor blades $15–$25 depending on size. 30-day edge guarantee on every blade.`,
    neighbourhoods: [
      'Downtown Maple Ridge', 'West Maple Ridge', 'Hammond',
      'Albion', 'Whonnock', 'Ruskin', 'Cottonwood',
      'Silver Valley', 'Maple Meadows', 'Thornhill',
    ],
    driveTime: '40–50 minutes from our North Vancouver base',
    faqs: [
      {
        question: 'How long does it take you to drive to Maple Ridge?',
        answer: 'Most Maple Ridge addresses are 40–50 minutes from our shop via the Second Narrows Bridge and the Pitt River Bridge. Whonnock, Ruskin, and the eastern edge of the city add a few minutes. We schedule mobile visits 1–2 business days out, with morning slots typically the most flexible for the longer drive.',
      },
      {
        question: 'Do you sharpen garden tools, pruners, and outdoor blades in Maple Ridge?',
        answer: 'Yes — Maple Ridge is one of the cities where we get the most outdoor and garden-tool work. We sharpen pruners, secateurs, hedge shears, hunting knives, fillet knives, axes, machetes, and the occasional draw knife or hatchet. Pricing is $15–$25 per tool depending on size and condition; small kitchen-style scissors are $12.',
      },
      {
        question: 'What is the minimum for mobile sharpening in Maple Ridge?',
        answer: 'Mobile visits to Maple Ridge require a minimum of 5 knives or tools ($60) given the longer drive. Acreage and rural-property customers often hit the minimum easily once garden tools are added in alongside the kitchen knives.',
      },
      {
        question: 'Do you handle equestrian-related blade work in Maple Ridge?',
        answer: 'Yes, on a case-by-case basis — clipper blades for horse work, hoof knives, and similar equipment can be re-edged or replaced with a fresh bevel. Reach out with the specific tool and we will tell you whether it is something we can handle.',
      },
    ],
    metaTitle: 'Knife Sharpening Maple Ridge, BC | Mobile Service | Cove Blades',
    metaDescription: 'Professional mobile knife sharpening in Maple Ridge — kitchen knives, garden tools, outdoor blades, fillet knives. $12/knife with 30-day guarantee. Book online.',
    dropOffEmphasis: false,
    subRegion: 'Fraser Valley',
  },
  {
    slug: 'pitt-meadows',
    name: 'Pitt Meadows',
    description: `Cove Blades brings mobile knife sharpening to Pitt Meadows — the agricultural pocket between Maple Ridge and Coquitlam, sitting between the Pitt and Fraser rivers. Most Pitt Meadows addresses are 40–45 minutes from our North Vancouver shop via the Second Narrows Bridge and the Pitt River Bridge, and we plan our routes so we can serve Pitt Meadows and Maple Ridge in the same trip when scheduling allows.

Pitt Meadows is small — about 22,000 residents — but it has a distinct character. The Pitt Polder area is one of the most productive blueberry and cranberry growing regions in BC, and the agricultural fields of central Pitt Meadows produce vegetables for kitchens across the Lower Mainland. Most of the residential side sits south of the Pitt River, with Mitchell Island and the airport on the western edge. The community is family-dense, lots are larger than in Vancouver proper, and the ratio of garden tools to kitchen knives we see from Pitt Meadows customers is usually higher than the average.

Mobile sharpening fits Pitt Meadows naturally because there is no reasonable drop-off from this side of the Lower Mainland. We arrive at your address with our portable station, work through your kitchen blades, garden tools, and outdoor knives on-site, and you keep your day. Pricing is $12 per kitchen knife, $18 for Japanese single-bevel and ceramic, $15–$25 for larger garden tools and outdoor blades. Every blade is backed by our 30-day edge guarantee.`,
    neighbourhoods: [
      'Central Pitt Meadows', 'Pitt Polder', 'South Bonson',
      'Bonson', 'North Pitt Meadows', 'Mitchell Island',
      'Lougheed Highway corridor',
    ],
    driveTime: '40–45 minutes from our North Vancouver base',
    faqs: [
      {
        question: 'How far is Pitt Meadows from your North Vancouver shop?',
        answer: 'About 40–45 minutes via the Second Narrows Bridge and the Pitt River Bridge. We frequently route Pitt Meadows and Maple Ridge in the same trip — if your timing is flexible, we can sometimes get you on the same day as a Maple Ridge visit, which makes scheduling easier on both sides.',
      },
      {
        question: 'Do you sharpen garden tools and outdoor blades in Pitt Meadows?',
        answer: 'Yes. Pitt Meadows is one of the cities where we see the most garden-tool work — pruners, secateurs, hedge shears, fillet knives, hunting knives, axes, and machetes. Pricing depends on the tool: kitchen knives are $12, kitchen-sized scissors $12, larger garden and outdoor blades $15–$25.',
      },
      {
        question: 'What is the minimum for mobile sharpening in Pitt Meadows?',
        answer: 'Mobile visits to Pitt Meadows require a minimum of 5 knives or tools ($60). Combining kitchen knives with garden and outdoor tools is the easiest way to hit the minimum if you do not have a deep kitchen-knife collection.',
      },
      {
        question: 'Do you serve Pitt Meadows farms and agricultural operations?',
        answer: 'Yes — we sharpen knives, machetes, harvest tools, and pruning equipment for Pitt Meadows blueberry and cranberry growers and other agricultural operations. Reach out to discuss volume and we can build a schedule that fits the harvest cycle.',
      },
    ],
    metaTitle: 'Knife Sharpening Pitt Meadows, BC | Mobile Service | Cove Blades',
    metaDescription: 'Professional mobile knife sharpening in Pitt Meadows. Kitchen knives, garden tools, agricultural blades. $12/knife with 30-day guarantee. Book online today.',
    dropOffEmphasis: false,
    subRegion: 'Fraser Valley',
  },
  {
    slug: 'langley',
    name: 'Langley',
    description: `Cove Blades brings mobile knife sharpening to Langley — both the City of Langley downtown and the wider Township, from Walnut Grove and Willoughby through Brookswood, Aldergrove, Murrayville, and historic Fort Langley. Most Langley addresses are 50–65 minutes from our North Vancouver shop, depending on which corner of the Township we are heading to and which route we take.

Langley is roughly 155,000 residents combined and one of the fastest-growing parts of Metro Vancouver. The Township covers a remarkable range: rural acreages and horse properties out toward Aldergrove and Otter, the cluster of family wineries and farm-to-table restaurants that make Langley one of BC's emerging culinary destinations, the rapid new-build sprawl of Willoughby, and the historic core of Fort Langley with its riverfront restaurants and weekend farmers' market. The City of Langley downtown is denser, with diverse food along Fraser Highway and 200 Street. Each pocket cooks differently, and the knives we see vary accordingly — high-end Japanese in Murrayville, working-kitchen Westerns in Aldergrove, restaurant-grade everything in Fort Langley.

Mobile sharpening is essentially the only way knife sharpening gets done in Langley — drop-off across the Pattullo or Port Mann is not realistic for Township customers. We arrive at your address with a self-contained station, work through 5–15 blades in 20–30 minutes (longer for restaurant rotations), and you keep your day. Standard kitchen knives are $12, Japanese single-bevel and ceramic $18, garden and outdoor tools $15–$25 depending on size. 30-day edge guarantee on every blade.`,
    neighbourhoods: [
      'City of Langley', 'Walnut Grove', 'Willoughby',
      'Brookswood', 'Murrayville', 'Aldergrove',
      'Fort Langley', 'Otter District', 'Salmon River Uplands',
      'Campbell Valley', 'Fernridge',
    ],
    driveTime: '50–65 minutes from our North Vancouver base',
    faqs: [
      {
        question: 'Which parts of Langley do you serve?',
        answer: 'Both the City of Langley and the Township — Walnut Grove, Willoughby, Brookswood, Murrayville, Aldergrove, Fort Langley, and the rural pockets. Drive times vary: Walnut Grove and Willoughby are at the closer end (50–55 minutes); Aldergrove, Otter, and southern Brookswood are 60–65 minutes.',
      },
      {
        question: 'What is the minimum for mobile sharpening in Langley?',
        answer: 'Mobile visits to Langley require a minimum of 5 knives or tools ($60) given the longer drive. Many Langley customers — especially Walnut Grove and Murrayville households — coordinate with friends or strata neighbours so a single visit covers two or three homes at the per-knife rate.',
      },
      {
        question: 'Do you provide scheduled service for Langley restaurants and wineries?',
        answer: 'Yes. We provide weekly and bi-weekly scheduled mobile sharpening for Langley restaurants, wineries with on-site dining, and the food businesses around Fort Langley and the City of Langley downtown. We work around your prep schedule and sharpen on-site.',
      },
      {
        question: 'Do you handle horse-property and equestrian-related blade work in Langley?',
        answer: 'Yes — clipper blades, hoof knives, and similar work are case-by-case but we have experience with them. Send us a note describing the specific tool and we will confirm whether it is something we can sharpen on a mobile visit.',
      },
    ],
    metaTitle: 'Knife Sharpening Langley, BC | Mobile Service | Cove Blades',
    metaDescription: 'Professional mobile knife sharpening across Langley — Walnut Grove, Willoughby, Murrayville, Aldergrove, Fort Langley. $12/knife with 30-day guarantee.',
    dropOffEmphasis: false,
    subRegion: 'South of Fraser',
  },
  {
    slug: 'white-rock',
    name: 'White Rock',
    description: `Cove Blades brings mobile knife sharpening to White Rock and the immediately surrounding South Surrey neighbourhoods that share the city's beachfront character — Crescent Beach, Ocean Park, and the streets climbing up from the promenade. Most White Rock addresses are 50–60 minutes from our North Vancouver shop, depending on bridge traffic.

White Rock is small — only about 22,000 residents within its tight municipal boundary — but the lifestyle here is distinct. The promenade along Marine Drive and the pier are the social heart of the city, and the residential streets above hold a mix of long-time residents, retirees who moved here for the ocean view, and families that prize the slower pace. The food scene is anchored by the seafood and fish-and-chips spots along the water, the diverse restaurants on Johnston Road heading uphill, and the kind of high-end home kitchen you would expect in a city where many residents have invested deliberately in where they live and how they cook.

Mobile sharpening fits White Rock especially well: the city is compact, parking near the promenade is rarely an issue at off-peak hours, and most residents would rather have us come to them than drive across two bridges to drop off. We arrive with a self-contained station, work through your kitchen blades on-site (typically 5–15 knives in 20–30 minutes), and you are done. Standard kitchen knives are $12, Japanese single-bevel and ceramic $18, fillet knives $12. 30-day edge guarantee on every blade.`,
    neighbourhoods: [
      'White Rock Promenade', 'East Beach', 'West Beach',
      'Marine Drive', 'Johnston Road', 'Hillside',
      'Centennial Park', 'Bayview', 'Five Corners',
    ],
    driveTime: '50–60 minutes from our North Vancouver base',
    faqs: [
      {
        question: 'How long does it take you to drive to White Rock?',
        answer: 'Most White Rock addresses are 50–60 minutes from our North Vancouver shop — we cross the Second Narrows or Lions Gate, then take Highway 99 down to the city. Traffic on Highway 99 is the main variable; off-peak Saturday mornings are usually faster than weekday afternoons.',
      },
      {
        question: 'What is the minimum for mobile sharpening in White Rock?',
        answer: 'Mobile visits to White Rock require a minimum of 5 knives ($60) given the drive. Strata and townhouse complexes near the promenade often coordinate building-wide service days — that drops the effective per-household minimum and makes the visit more efficient for everyone.',
      },
      {
        question: 'Do you sharpen fillet knives and fishing blades in White Rock?',
        answer: 'Yes — fillet knives, fishing knives, and bait knives are routine work, especially for White Rock and Crescent Beach customers. Fillet knives are $12 each; we re-set the flex and edge geometry, restore tip damage, and back the work with our 30-day guarantee.',
      },
      {
        question: 'Do you serve White Rock restaurants on a scheduled basis?',
        answer: 'Yes. We provide weekly and bi-weekly mobile sharpening for restaurants along Marine Drive and Johnston Road. We arrive during prep hours, sharpen on-site at a designated station, and rotate blades so the line keeps moving while we work.',
      },
    ],
    metaTitle: 'Knife Sharpening White Rock, BC | Mobile Service | Cove Blades',
    metaDescription: 'Professional mobile knife sharpening in White Rock — Marine Drive, Johnston Road, the promenade. Fillet knives, kitchen blades. $12/knife with 30-day guarantee.',
    dropOffEmphasis: false,
    subRegion: 'South of Fraser',
  },
  {
    slug: 'abbotsford',
    name: 'Abbotsford',
    description: `Cove Blades brings mobile knife sharpening to Abbotsford — the largest city in the Fraser Valley — covering Clearbrook, the Old Clayburn Village area, the Sumas Mountain neighbourhoods, the agricultural pockets out toward the US border, and the growing residential and commercial corridors along South Fraser Way and Highway 1. Drive time from our North Vancouver shop is typically 70–80 minutes, depending on traffic on Highway 1.

Abbotsford is around 155,000 residents and unlike any other city in our service area. It is the agricultural capital of BC — the province's number-one dairy producer, with more milk coming out of Abbotsford alone than any other municipality, and the largest blueberry-growing region in Canada. The Mennonite community has shaped the city's food culture for generations, alongside more recent South Asian, Filipino, and Vietnamese influences. The result is a food scene that runs from family-run roadside farm stands to high-end farm-to-table restaurants, with plenty of working kitchens in between. Add Tradex, the airshow, the Abbotsford Centre arena, and a steadily growing tech and small-business sector, and the city feels less like an outpost and more like its own gravitational centre.

Mobile sharpening makes the most sense in Abbotsford as a planned visit rather than a one-off — we typically schedule Abbotsford trips on a route that hits multiple stops in the same day, or as part of a Fraser Valley rotation that includes Chilliwack. Restaurant accounts on weekly or bi-weekly schedules work especially well. For residential customers, batching a visit with a friend, neighbour, or strata building keeps the per-trip economics reasonable. Standard kitchen knives are $12, Japanese single-bevel and ceramic $18, garden and outdoor blades $15–$25. 30-day edge guarantee on every blade.`,
    neighbourhoods: [
      'Clearbrook', 'Old Clayburn Village', 'Sumas Mountain',
      'Sumas Prairie', 'McMillan', 'Abbotsford Heights',
      'Aberdeen', 'Bradner', 'Ridgeview', 'Bateman',
      'East Abbotsford', 'West Abbotsford', 'Mount Lehman',
    ],
    driveTime: '70–80 minutes from our North Vancouver base',
    faqs: [
      {
        question: 'How far is Abbotsford from your North Vancouver shop?',
        answer: 'Most Abbotsford addresses are 70–80 minutes from our shop via Highway 1. Sumas Mountain and the eastern pockets near the Chilliwack border are at the longer end. Because of the drive, we typically schedule Abbotsford visits as planned days that hit multiple stops or as part of a Fraser Valley rotation with Chilliwack.',
      },
      {
        question: 'What is the minimum for mobile sharpening in Abbotsford?',
        answer: 'Mobile visits to Abbotsford have a minimum of 8 knives or tools ($96) given the drive. Most Abbotsford customers easily hit this by combining kitchen knives with garden tools, or by batching with a neighbour or strata building. We are happy to coordinate multi-household visits in the same neighbourhood.',
      },
      {
        question: 'Do you serve Abbotsford restaurants and farms on a scheduled basis?',
        answer: 'Yes — scheduled service is the most economical option for Abbotsford restaurants and agricultural operations. We run weekly and bi-weekly rotations that cover restaurants along South Fraser Way, the dairy and blueberry farms across the city, and Clearbrook commercial kitchens. Reach out and we will design a schedule around your prep cycle or harvest calendar.',
      },
      {
        question: 'Do you handle the variety of blades used in Abbotsford agricultural operations?',
        answer: 'Yes — beyond kitchen knives, we sharpen pruners, secateurs, hedge shears, harvest knives, machetes, axes, and similar tools regularly used on Abbotsford farms. Pricing depends on the specific tool ($15–$25 typical for larger items); reach out with the equipment list and we will quote ahead of the visit.',
      },
    ],
    metaTitle: 'Knife Sharpening Abbotsford, BC | Mobile Service | Cove Blades',
    metaDescription: 'Professional mobile knife sharpening across Abbotsford — kitchen knives, garden tools, harvest blades, restaurant rotations. Fraser Valley service. Book online.',
    dropOffEmphasis: false,
    subRegion: 'Fraser Valley',
  },
  {
    slug: 'chilliwack',
    name: 'Chilliwack',
    description: `Cove Blades brings mobile knife sharpening to Chilliwack — covering the central downtown, the growing Sardis neighbourhoods, the Vedder corridor toward Cultus Lake, the older heart around Yarrow and Promontory, and the agricultural belt that gives Chilliwack its character. We are about 90–105 minutes from our North Vancouver shop via Highway 1, which puts Chilliwack at the eastern edge of our service radius — but reachable, and a city we are committed to serving.

Chilliwack is around 93,000 residents and feels different from anywhere else in our service area. The mountains are right there — Vedder Mountain, the Cheam range, Mount Slesse — and the Vedder River cuts through neighbourhoods that still feel rural at their edges. Cultus Lake anchors a significant recreational and cottage economy, especially in summer. The agricultural side runs deep: dairy farms, hop growers, corn, blueberries, and the kind of multi-generational family operations that define the eastern Fraser Valley. Sardis is the newer growth area; downtown Chilliwack along Yale Road is in the middle of a slow but real revitalization with new restaurants and renovated storefronts.

Mobile sharpening to Chilliwack works best as a scheduled visit rather than ad-hoc — we typically come out as part of a Fraser Valley route that includes Abbotsford, or as a planned day that hits several Chilliwack stops in a single trip. Restaurant accounts on weekly or bi-weekly rotations are a natural fit; residential customers benefit most from batching with neighbours or strata buildings. Standard kitchen knives are $12, Japanese single-bevel and ceramic $18, larger garden and outdoor blades $15–$25, with our 30-day edge guarantee on every piece.`,
    neighbourhoods: [
      'Downtown Chilliwack', 'Sardis', 'Vedder Crossing',
      'Promontory', 'Yarrow', 'Greendale', 'Rosedale',
      'East Chilliwack', 'Chilliwack Mountain', 'Garrison Crossing',
      'Cultus Lake area',
    ],
    driveTime: '90–105 minutes from our North Vancouver base',
    faqs: [
      {
        question: 'Is Chilliwack within your service area?',
        answer: 'Yes. Chilliwack sits at the eastern edge of our service radius — about 90–105 minutes from our North Vancouver shop via Highway 1. Because of the drive, we typically schedule Chilliwack visits as planned days that hit multiple stops, or as part of a Fraser Valley rotation that also covers Abbotsford.',
      },
      {
        question: 'What is the minimum for mobile sharpening in Chilliwack?',
        answer: 'Mobile visits to Chilliwack have a minimum of 10 knives or tools ($120) given the longer drive. Restaurant accounts and farm operations easily exceed this on a routine visit. Residential customers often batch with neighbours, family on the same street, or strata buildings to hit the minimum efficiently.',
      },
      {
        question: 'Do you serve Chilliwack restaurants, farms, and agricultural operations?',
        answer: 'Yes — scheduled service is how Chilliwack works best. We run weekly and bi-weekly rotations for restaurants along Yale Road and in Sardis, dairy and hop operations across the city, and the larger agricultural businesses in Greendale, Yarrow, and East Chilliwack. Reach out to design a schedule around your prep or harvest cycle.',
      },
      {
        question: 'Can I batch a Chilliwack mobile visit with neighbours to share the trip?',
        answer: 'Absolutely — and we encourage it. Coordinated visits to multiple homes on the same street or strata are how most Chilliwack residential bookings work. Each household pays the per-knife rate without each one independently hitting the per-trip minimum. Just let us know who is participating and we will plan the route.',
      },
    ],
    metaTitle: 'Knife Sharpening Chilliwack, BC | Mobile Service | Cove Blades',
    metaDescription: 'Professional mobile knife sharpening in Chilliwack — Sardis, Downtown, Vedder, Promontory. Fraser Valley scheduled rotations. $12/knife with 30-day guarantee.',
    dropOffEmphasis: false,
    subRegion: 'Fraser Valley',
  },
]

export function getCityBySlug(slug: string): CityData | undefined {
  return cities.find(c => c.slug === slug)
}
