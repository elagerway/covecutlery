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
]

export function getCityBySlug(slug: string): CityData | undefined {
  return cities.find(c => c.slug === slug)
}
