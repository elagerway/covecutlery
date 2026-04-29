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
    description: `Cove Blades provides professional mobile knife sharpening to Coquitlam, Port Moody, and Port Coquitlam — the entire Tri-Cities area. From our North Vancouver base, we reach most Coquitlam addresses in 30–35 minutes via the Second Narrows Bridge, bringing our full sharpening setup directly to your kitchen.

The Tri-Cities is one of Metro Vancouver's fastest-growing regions, with Coquitlam alone home to over 150,000 residents. As the community has grown, so has its food scene — from the diverse restaurant offerings at Coquitlam Centre to the family-owned eateries along Austin Avenue and the growing culinary strip in Port Moody's Brewers Row. Sharp knives are essential whether you are cooking for a family of four or running a commercial kitchen serving hundreds of covers per night.

Most home cooks do not realize how dull their knives actually are until they use a professionally sharpened blade. The difference is dramatic: clean cuts through onions without tears, paper-thin slices of sashimi-grade fish, and effortless mincing of herbs. A sharp knife is also a safe knife — the majority of kitchen cuts happen when a dull blade slips off the food surface. We sharpen every type of blade including German (Wusthof, Henckels), Japanese (Shun, Global, Miyabi), ceramic, serrated, and specialty blades. Our 30-day edge guarantee backs every sharpening.`,
    neighbourhoods: [
      'Coquitlam Centre', 'Burke Mountain', 'Westwood Plateau',
      'Austin Heights', 'Maillardville', 'Ranch Park',
      'Port Moody', 'Port Coquitlam', 'Anmore',
    ],
    driveTime: '30–35 minutes from our North Vancouver base',
    faqs: [
      {
        question: 'Do you serve the entire Tri-Cities for knife sharpening?',
        answer: 'Yes. Our mobile service covers Coquitlam, Port Moody, Port Coquitlam, and Anmore. We drive to your location with our full sharpening setup and work on-site. Most home collections take about 20 minutes.',
      },
      {
        question: 'What is the minimum for mobile sharpening in Coquitlam?',
        answer: 'Mobile visits to the Tri-Cities require a minimum of 5 knives ($60). Many customers coordinate with neighbours to combine orders and get the most value from a single visit.',
      },
      {
        question: 'How is professional sharpening different from using a pull-through sharpener?',
        answer: 'Pull-through sharpeners remove excessive metal and create an inconsistent edge angle. Professional sharpening uses precision equipment to match your knife original factory angle, removing only the minimum metal needed. This extends knife life by years and produces a significantly sharper, longer-lasting edge.',
      },
      {
        question: 'Can I mail in my knives from Coquitlam?',
        answer: 'You can use our 24/7 drop-off box in North Vancouver (about 30 minutes away), or book a mobile visit for the convenience of at-home service. We do not currently offer a mail-in service for local customers as mobile and drop-off are faster options.',
      },
    ],
    metaTitle: 'Knife Sharpening Coquitlam & Tri-Cities | Cove Blades',
    metaDescription: 'Professional mobile knife sharpening in Coquitlam, Port Moody & Port Coquitlam. $12/knife with 30-day guarantee. We come to you. Book online today.',
    dropOffEmphasis: false,
    subRegion: 'Tri-Cities',
  },
]

export function getCityBySlug(slug: string): CityData | undefined {
  return cities.find(c => c.slug === slug)
}
