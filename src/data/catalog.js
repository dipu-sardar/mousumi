// Static catalogue & demo data for the MOUSUMI storefront.
//
// This mirrors the source prototype exactly: there is no backend yet, so
// designs, stock orders and pricing all live here. Swapping this file (or
// the functions that read it) for real API calls is the natural next step
// once a backend exists — see README.md.

export const DESIGNS = [
  {
    id: "d0",
    name: "OLIVE SEQUIN\nSTRAIGHT KURTI",
    short: "Olive Sequin Straight Kurti",
    price: 1650,
    days: 6,
    tone: "#DDE7C4",
    category: "PARTY",
    fabricNote: "Sequin-dotted viscose · side slits",
    img: "/assets/olive_kurti_full.jpg",
    gallery: [
      "/assets/olive_kurti_full.jpg",
      "/assets/olive_kurti_neck.jpg",
      "/assets/olive_kurti_back.jpg",
      "/assets/olive_kurti_detail.jpg",
    ],
    desc: "Floor-length straight kurti in olive viscose scattered with tiny sequins. Square neckline, full sleeves, high side slits and covered back-button placket.",
  },
  {
    id: "d1",
    name: "EMBROIDERED\nSALWAR KAMEEZ",
    short: "Embroidered Salwar Kameez",
    price: 1450,
    days: 5,
    tone: "#E4F0D2",
    category: "SALWAR-KAMEEZ",
    fabricNote: "Cotton or georgette · lining included",
    img: "/assets/hero_front.png",
    gallery: ["/assets/hero_front.png", "/assets/hero_back.png", "/assets/hero_pose.png"],
    desc: "Three-piece kameez with a hand-embroidered yoke, side slits and a matching dupatta finish. Cut to your saved measurements.",
  },
  {
    id: "d2",
    name: "OFFICE KURTI\nWITH PANTS",
    short: "Office Kurti with Pants",
    price: 1200,
    days: 4,
    tone: "#EBE4F6",
    category: "OFFICE",
    fabricNote: "Linen blend · crease resistant",
    img: "/assets/hero_pose.png",
    gallery: ["/assets/hero_pose.png", "/assets/hero_front.png", "/assets/hero_sitting.png"],
    desc: "A straight-cut kurti with a mandarin collar and tapered trousers — built for long working days and easy washing.",
  },
  {
    id: "d3",
    name: "PARTY MAXI\nGOWN",
    short: "Party Maxi Gown",
    price: 2600,
    days: 7,
    tone: "#F5E3E6",
    category: "PARTY",
    fabricNote: "Silk or velvet · full lining",
    img: "/assets/summer_banner.png",
    gallery: ["/assets/summer_banner.png", "/assets/hero_sitting.png"],
    desc: "Floor-length gown with a fitted bodice, concealed zip and a flared skirt panel. Finished with hand-stitched hems.",
  },
  {
    id: "d4",
    name: "DESIGNER\nBLOUSE",
    short: "Designer Blouse",
    price: 650,
    days: 3,
    tone: "#FBEFD2",
    category: "BLOUSE",
    fabricNote: "Your saree fabric welcome",
    img: "/assets/hero_back.png",
    gallery: ["/assets/hero_back.png", "/assets/hero_front.png"],
    desc: "Fitted blouse with princess seams, piped neckline and adjustable back closure — stitched from your own saree fabric if you prefer.",
  },
  {
    id: "d5",
    name: "EVERYDAY COTTON\nKAMEEZ",
    short: "Everyday Cotton Kameez",
    price: 900,
    days: 4,
    tone: "#DCEBDD",
    category: "SALWAR-KAMEEZ",
    fabricNote: "Breathable cotton · daily wear",
    img: "/assets/hero_sitting.png",
    gallery: ["/assets/hero_sitting.png", "/assets/hero_pose.png"],
    desc: "A relaxed daily kameez with deep pockets, side vents and a soft round neck. The most reordered design in the shop.",
  },
  {
    id: "d6",
    name: "FLARED PARTY\nMIDI",
    short: "Flared Party Midi",
    price: 1800,
    days: 6,
    tone: "#F1E8DA",
    category: "PARTY",
    fabricNote: "Chiffon over cotton lining",
    img: "/assets/summer_banner.png",
    gallery: ["/assets/summer_banner.png", "/assets/hero_front.png"],
    desc: "Mid-length flared dress with gathered sleeves and a fabric belt — a lighter option for daytime functions.",
  },
  {
    id: "d7",
    name: "STRAIGHT OFFICE\nSHIRT DRESS",
    short: "Office Shirt Dress",
    price: 1350,
    days: 5,
    tone: "#E0F0EC",
    category: "OFFICE",
    fabricNote: "Poplin · button-through",
    img: "/assets/hero_front.png",
    gallery: ["/assets/hero_front.png", "/assets/hero_pose.png"],
    desc: "Button-through shirt dress with a collar stand, roll-up sleeves and a waist tie that can be removed.",
  },
  {
    id: "d8",
    name: "SILK PARTY\nBLOUSE",
    short: "Silk Party Blouse",
    price: 1100,
    days: 4,
    tone: "#F3E6F0",
    category: "BLOUSE",
    fabricNote: "Silk · hook-and-eye back",
    img: "/assets/hero_back.png",
    gallery: ["/assets/hero_back.png", "/assets/summer_banner.png"],
    desc: "Evening blouse in silk with a scooped back, covered hooks and boning at the side seams for a clean line.",
  },
];

export const CATS = ["ALL", "SALWAR-KAMEEZ", "BLOUSE", "PARTY", "OFFICE"];

export const BUDGETS = [
  { label: "ALL", min: 0, max: 99999 },
  { label: "৳300–800", min: 0, max: 800 },
  { label: "৳800–1500", min: 800, max: 1500 },
  { label: "৳1500–2500", min: 1500, max: 2500 },
  { label: "৳2500+", min: 2500, max: 99999 },
];

export const FIELDS = [
  { k: "length", label: "Kameez length" },
  { k: "shoulder", label: "Shoulder" },
  { k: "bust", label: "Bust" },
  { k: "waist", label: "Waist" },
  { k: "hip", label: "Hip" },
  { k: "sleeve", label: "Sleeve length" },
  { k: "armhole", label: "Armhole" },
  { k: "neckDepth", label: "Neck depth" },
];

export const STAGES = [
  { label: "Fabric picked up", note: "Rider collected the fabric from your address." },
  { label: "Cutting", note: "Pattern drafted on your saved measurements." },
  { label: "Stitching", note: "On the machine floor — finishing and pressing next." },
  { label: "Ready", note: "Quality checked, packed and waiting for the rider." },
  { label: "Delivered", note: "Handed over at your door. Free alterations for 3 months." },
];

export const ORDERS = [
  {
    owner: "01712-000000",
    id: "MSM-2026-0148",
    designId: "d1",
    stage: 2,
    slot: "Morning",
    day: "Today",
    addr: "House 24, Sadar Road, Barishal",
    addrLabel: "Home",
    date: "7 Aug 2026",
    delivery: "12 Aug 2026",
    status: "Stitching",
    live: true,
    customer: "Rumana Akter",
    phone: "01712-000000",
    mode: "Home delivery",
    fabricSource: "Own fabric (customer supplied)",
    profile: "Rumana — Kameez set",
    m: { length: "40.0", shoulder: "14.5", bust: "36.0", waist: "30.0", hip: "38.0", sleeve: "22.0", armhole: "16.0", neckDepth: "7.0" },
    total: 1450,
    advance: 500,
    payMethod: "bKash",
    payStatus: "Partial",
    tailor: "Md. Jashim (Karigor #3)",
    priority: true,
  },
  {
    owner: "01712-000000",
    id: "MSM-2026-0121",
    designId: "d4",
    stage: 4,
    slot: "Afternoon",
    day: "22 Jul",
    addr: "House 24, Sadar Road, Barishal",
    addrLabel: "Home",
    date: "22 Jul 2026",
    delivery: "26 Jul 2026",
    status: "Delivered",
    live: false,
    customer: "Rumana Akter",
    phone: "01712-000000",
    mode: "Home delivery",
    fabricSource: "Own saree fabric (customer supplied)",
    profile: "Ammu — blouse",
    m: { length: "15.0", shoulder: "13.5", bust: "38.0", waist: "33.0", hip: "40.0", sleeve: "9.0", armhole: "17.0", neckDepth: "8.0" },
    total: 650,
    advance: 650,
    payMethod: "Cash on delivery",
    payStatus: "Paid",
    tailor: "Rehana Begum (Karigor #1)",
    priority: false,
  },
  {
    owner: "01712-000000",
    id: "MSM-2026-0094",
    designId: "d2",
    stage: 4,
    slot: "Evening",
    day: "9 Jul",
    addr: "Bank Road, Nathullabad, Barishal",
    addrLabel: "Office",
    date: "9 Jul 2026",
    delivery: "14 Jul 2026",
    status: "Delivered",
    live: false,
    customer: "Rumana Akter",
    phone: "01812-111111",
    mode: "Home delivery",
    fabricSource: "MOUSUMI fabric — linen blend",
    profile: "Office kurti fit",
    m: { length: "38.0", shoulder: "14.0", bust: "35.0", waist: "29.0", hip: "37.0", sleeve: "19.0", armhole: "15.5", neckDepth: "6.5" },
    total: 1200,
    advance: 1200,
    payMethod: "Nagad",
    payStatus: "Paid",
    tailor: "Md. Jashim (Karigor #3)",
    priority: false,
  },
];

export const OFFERS = [
  { tag: "EID SPECIAL", value: "৳200 OFF", desc: "On any order above ৳1000 placed before 20 August.", code: "EID26", tone: "#E4F0D2" },
  { tag: "FIRST ORDER", value: "15% OFF", desc: "For new customers — applies to stitching charge only.", code: "FIRST15", tone: "#FBEFD2" },
  { tag: "BLOUSE WEEK", value: "2 FOR ৳1100", desc: "Stitch two designer blouses in one pickup.", code: "BLOUSE2", tone: "#F5E3E6" },
];

export const HOW_STEPS = [
  { n: "01", t: "Choose a design", d: "Filter the catalogue by category and budget, from ৳300 to ৳3000+." },
  { n: "02", t: "Give measurements", d: "Follow the video guide or reuse a saved profile in one tap." },
  { n: "03", t: "Book a pickup slot", d: "Morning, afternoon or evening — the rider comes to your door." },
  { n: "04", t: "Track the stitching", d: "Cutting, stitching, ready — every stage updates live." },
  { n: "05", t: "Delivery & free service", d: "Any fit issue is fixed free for the first three months." },
];

export const SHOP_STATS = [
  { n: "412", t: "orders delivered this season" },
  { n: "4-7", t: "days average turnaround" },
  { n: "3 mo", t: "free alteration on every dress" },
];

export const REVIEWS = [
  { stars: "★★★★★", text: "The rider came exactly in the evening slot and the kameez fit perfectly on the first try. I did not step out of the house once.", name: "Sadia R.", item: "Embroidered Salwar Kameez", when: "2 weeks ago" },
  { stars: "★★★★★", text: "Saved measurements are the best part. Second order took me under a minute to place.", name: "Nusrat J.", item: "Office Kurti with Pants", when: "1 month ago" },
  { stars: "★★★★☆", text: "Gown stitching was beautiful. Delivery came one day late, but they informed me on the app beforehand.", name: "Tanjina H.", item: "Party Maxi Gown", when: "1 month ago" },
  { stars: "★★★★★", text: "Got the sleeve shortened free after two weeks. No arguments, no charge.", name: "Farhana K.", item: "Everyday Cotton Kameez", when: "2 months ago" },
];

export const RATING_BARS = [
  { star: "5", pct: "78%", w: 78 },
  { star: "4", pct: "16%", w: 16 },
  { star: "3", pct: "4%", w: 4 },
  { star: "2", pct: "1%", w: 1 },
  { star: "1", pct: "1%", w: 1 },
];

export const NOTIFICATIONS = [
  { t: "Your kameez is on the stitching floor.", when: "40 minutes ago" },
  { t: "Rider Shakil picked up your fabric.", when: "Yesterday, 5:10 PM" },
  { t: "EID26 is live — ৳200 off until 20 August.", when: "2 days ago" },
];

/** Taka currency formatter, e.g. tk(1450) -> "৳1,450" */
export const tk = (n) => "৳" + n.toLocaleString("en-US");
