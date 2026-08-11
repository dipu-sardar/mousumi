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
    img: "/assets/olive_kurti_full.png",
    gallery: [
      "/assets/olive_kurti_full.png",
      "/assets/olive_kurti_neck.png",
      "/assets/olive_kurti_back.png",
      "/assets/olive_kurti_detail.png",
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

// Index 0 and 1 (Pending/Confirmed) are admin-only — a tailor's session
// can't set an order to either (see staff_update_order_stage() in
// supabase/migrations/0006_order_confirmation.sql), since confirming a
// fresh order is the owner's call, not the stitching floor's. Every index
// past that (2+) is business-as-usual and open to whichever staff member
// the order is assigned to.
export const STAGES = [
  { label: "Pending", note: "We've received your order and are reviewing it before confirming." },
  { label: "Confirmed", note: "Your order is confirmed — pickup will be scheduled next." },
  { label: "Fabric picked up", note: "Rider collected the fabric from your address." },
  { label: "Cutting", note: "Pattern drafted on your saved measurements." },
  { label: "Stitching", note: "On the machine floor — finishing and pressing next." },
  { label: "Ready", note: "Quality checked, packed and waiting for the rider." },
  { label: "Delivered", note: "Handed over at your door. Free alterations for 3 months." },
];

// The demo ORDERS array that used to live here is gone — orders are real
// now (Supabase `orders`/`order_items`, see src/lib/ordersApi.js and
// supabase/migrations/0004_orders_go_live.sql). Track/Account read live
// data instead of this file for order history.

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
