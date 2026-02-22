/* ═══════════════════════════════════════════════
   SNEAKER ZOO — INVENTORY DATA V2.0
   Enhanced with year, brand, and richer descriptions
   ═══════════════════════════════════════════════ */

const INVENTORY = [
    {
        id: "fz_01",
        name: "JORDAN 1",
        variant: "LOST & FOUND",
        price: 450.00,
        category: "FOOTWEAR",
        brand: "Nike",
        year: 2023,
        image: "https://images.goat.com/1352/attachments/product_template_pictures/images/100/178/978/original/920714_00.png.png",
        description: "The Air Jordan 1 'Lost & Found' pays homage to the dusty, forgotten pairs found in mom-and-pop shops decades later. Cracked leather, aged collar, vintage-feel — a love letter to sneaker archaeology. Deadstock with original box."
    },
    {
        id: "fz_02",
        name: "YEEZY 350",
        variant: "PIRATE BLACK",
        price: 380.00,
        category: "FOOTWEAR",
        brand: "Adidas",
        year: 2015,
        image: "https://images.goat.com/375/attachments/product_template_pictures/images/011/119/994/original/52582_00.png.png",
        description: "The Yeezy Boost 350 'Pirate Black' is the shoe that changed everything. An original Kanye × adidas drop that launched a billion-dollar empire. This OG colorway remains the most coveted of them all. Authenticated deadstock."
    },
    {
        id: "fz_03",
        name: "JORDAN 4",
        variant: "MILITARY BLACK",
        price: 320.00,
        category: "FOOTWEAR",
        brand: "Nike",
        year: 2022,
        image: "https://images.goat.com/1352/attachments/product_template_pictures/images/078/131/513/original/DH6927_111.png.png",
        description: "The Air Jordan 4 'Military Black' delivers clean lines and timeless versatility. White leather upper with neutral grey and black accents. A modern classic that works with everything. Deadstock, OG all."
    },
    {
        id: "fz_04",
        name: "OFF-WHITE DUNK",
        variant: "LOT 1 OF 50",
        price: 1200.00,
        category: "FOOTWEAR",
        brand: "Nike × Off-White",
        year: 2021,
        image: "https://images.goat.com/1352/attachments/product_template_pictures/images/069/924/858/original/DM1602_127.png.png",
        description: "Virgil Abloh's legendary 'Dear Summer' collection. Lot 1 is the holy grail — red lace-lock on a premium white leather base. The signature zip-tie, hand-numbered tag, and Off-White branding make this instant art. One of 50 unique colorways."
    },
    {
        id: "fz_05",
        name: "RICK OWENS",
        variant: "GEOBASKET",
        price: 950.00,
        category: "FOOTWEAR",
        brand: "Rick Owens",
        year: 2024,
        image: "https://images.goat.com/375/attachments/product_template_pictures/images/087/401/679/original/RU01B4894_LPO_99.png.png",
        description: "The Rick Owens Geobasket isn't a sneaker — it's an architectural statement. Towering sole, premium leather, and the kind of presence that turns every sidewalk into a runway. For those who understand that fashion is armor."
    },
    {
        id: "ap_01",
        name: "VINTAGE TEE",
        variant: "AKIRA 1988",
        price: 650.00,
        category: "APPAREL",
        brand: "Vintage",
        year: 1988,
        image: "https://images.goat.com/375/attachments/product_template_pictures/images/089/154/262/original/1227028_00.png.png",
        description: "Original 1988 Akira tee — the single-stitch grail. Authentic Japanese anime merchandise from the film's theatrical release. Faded perfectly. Worn by history. One of one in our archive."
    },
    {
        id: "ap_02",
        name: "WORK JACKET",
        variant: "DETROIT DUCK",
        price: 220.00,
        category: "APPAREL",
        brand: "Carhartt",
        year: 2023,
        image: "https://images.goat.com/375/attachments/product_template_pictures/images/091/238/041/original/1272750_00.png.png",
        description: "The Carhartt Detroit jacket is workwear royalty. Heavyweight duck canvas, blanket-lined, built for decades. This isn't fashion cosplay — it's the real thing. New with tags."
    },
    {
        id: "ap_03",
        name: "HOODIE",
        variant: "ESSENTIALS VOID",
        price: 110.00,
        category: "APPAREL",
        brand: "Fear of God Essentials",
        year: 2024,
        image: "https://images.goat.com/375/attachments/product_template_pictures/images/099/188/382/original/1277614_00.png.png",
        description: "Fear of God Essentials in jet black. Oversized boxy fit, premium heavyweight fleece, and the signature rubber logo. The blank canvas of streetwear — goes with literally everything."
    },
    {
        id: "ap_04",
        name: "SUPREME TEE",
        variant: "BOX LOGO",
        price: 180.00,
        category: "APPAREL",
        brand: "Supreme",
        year: 2023,
        image: "https://images.goat.com/375/attachments/product_template_pictures/images/090/093/127/original/1236564_00.png.png",
        description: "The Supreme Box Logo tee needs no introduction. It's the most recognized streetwear symbol on Earth. Clean white base, red box logo, 100% cotton. Authenticated with receipt."
    },
    {
        id: "ob_01",
        name: "KUBRICK",
        variant: "1000% BEARBRICK",
        price: 800.00,
        category: "OBJECTS",
        brand: "Medicom Toy",
        year: 2024,
        image: "https://images.goat.com/375/attachments/product_template_pictures/images/086/100/429/original/1196432_00.png.png",
        description: "The 1000% BE@RBRICK stands 70cm tall and commands any room it enters. Museum-grade collectible from Medicom Toy. Displayed, never played with. Comes with original packaging and authenticity card."
    },
    {
        id: "ob_02",
        name: "CHROME",
        variant: "HEARTS RING",
        price: 550.00,
        category: "OBJECTS",
        brand: "Chrome Hearts",
        year: 2024,
        image: "https://images.goat.com/375/attachments/product_template_pictures/images/083/567/937/original/1183338_00.png.png",
        description: "Chrome Hearts. Handcrafted in Hollywood. Solid 925 sterling silver with the signature cross motif. Each piece is individually made — no two are identical. Comes with CH pouch and receipt."
    },
    {
        id: "fz_06",
        name: "NEW BALANCE 550",
        variant: "ALD GREEN",
        price: 275.00,
        category: "FOOTWEAR",
        brand: "New Balance × Aimé Leon Dore",
        year: 2023,
        image: "https://images.goat.com/1352/attachments/product_template_pictures/images/087/362/034/original/BB550AD1.png.png",
        description: "Aimé Leon Dore's New Balance 550 in natural green changed the retro basketball shoe game forever. Teddy Santis brought this forgotten silhouette back from the dead. Premium leather, vintage vibes."
    }
];

window.INVENTORY = INVENTORY;
