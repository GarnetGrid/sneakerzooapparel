/**
 * SNEAKER ZOO // ARCHIVE DATABASE
 * PHASE 20: KINETIC UPGRADE
 */

const INVENTORY = [
    // --- FOOTWEAR ---
    {
        id: "fz_01",
        name: "JORDAN 1",
        variant: "LOST & FOUND",
        price: 450.00,
        category: "FOOTWEAR",
        brand: "JORDAN",
        year: 2022,
        image: "https://cdn.discordapp.com/attachments/1078869865064894616/1078870005406306354/j1_lost_found.png",
        description: "The 'Lost & Found' brings back the Chicago colorway with a reimagined vintage aesthetic. Cracked leather collars and pre-yellowed midsoles tell the story of a Grail found deep in the archives.",
        hologram: true
    },
    {
        id: "fz_02",
        name: "YEEZY 350",
        variant: "PIRATE BLACK",
        price: 380.00,
        category: "FOOTWEAR",
        brand: "ADIDAS",
        year: 2023,
        image: "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/011/119/994/original/5392.png",
        description: "The return of the original. Primeknit styling with the signature red stitching on the heel tab. A cornerstone of modern sneaker culture.",
        hologram: false
    },
    {
        id: "fz_03",
        name: "JORDAN 4",
        variant: "MILITARY BLACK",
        price: 320.00,
        category: "FOOTWEAR",
        brand: "JORDAN",
        year: 2022,
        image: "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/072/894/876/original/DH6927_111.png",
        description: "Neutral color blocking on a classic silhouette. The Military Black 4s offer versatility with an industrial edge.",
        hologram: false
    },
    {
        id: "fz_04",
        name: "OFF-WHITE DUNK",
        variant: "LOT 1",
        price: 1200.00,
        category: "FOOTWEAR",
        brand: "NIKE",
        year: 2021,
        image: "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/058/564/619/original/DM1602_127.png",
        description: "Virgil Abloh's deconstructed vision. Features the signature over-lace system and exposed foam tongue. Lot 1 of 50.",
        hologram: false
    },
    {
        id: "fz_05",
        name: "RICK OWENS",
        variant: "GEOBASKET",
        price: 950.00,
        category: "FOOTWEAR",
        brand: "RICK OWENS",
        year: 2024,
        image: "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/098/957/547/original/RU01D3894_LPO_911.png",
        description: "The monolithic silhouette. Extended tongue, thick shark-tooth sole, and premium full-grain leather construction.",
        hologram: false
    },

    // --- APPAREL ---
    {
        id: "ap_01",
        name: "VINTAGE TEE",
        variant: "AKIRA NEO-TOKYO",
        price: 650.00,
        category: "APPAREL",
        brand: "VINTAGE",
        year: 1994,
        image: "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/010/221/330/original/1990_Akira_Tee.png",
        description: "Single stitch, faded black. Iconic Neo-Tokyo graphic. A rare artifact from the golden age of anime merchandise.",
        hologram: false
    },
    {
        id: "ap_02",
        name: "WORK JACKET",
        variant: "DETROIT DUCK",
        price: 220.00,
        category: "APPAREL",
        brand: "CARHARTT",
        year: 2018,
        image: "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/080/464/235/original/J001_BRN.png",
        description: "Rugged durability. Heavyweight cotton duck canvas that only gets better with age and wear.",
        hologram: false
    },
    {
        id: "ap_03",
        name: "HOODIE",
        variant: "ESSENTIALS VOID",
        price: 110.00,
        category: "APPAREL",
        brand: "FEAR OF GOD",
        year: 2024,
        image: "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/093/118/886/original/192BT212073F.png",
        description: "Oversized fit, dropped shoulders. The definitive silhouette for modern streetwear comfort.",
        hologram: false
    },
    {
        id: "ap_04",
        name: "SUPREME TEE",
        variant: "BOX LOGO",
        price: 180.00,
        category: "APPAREL",
        brand: "SUPREME",
        year: 2023,
        image: "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/085/197/159/original/FW23T1_Black.png",
        description: "The classic. Red box logo on heavyweight cotton. The symbol of New York skate culture.",
        hologram: false
    },

    // --- OBJECTS ---
    {
        id: "ob_01",
        name: "KUBRICK",
        variant: "1000% BEARBRICK",
        price: 800.00,
        category: "OBJECTS",
        brand: "MEDICOM",
        year: 2022,
        image: "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/067/034/007/original/B_1000_DaftPunk.png",
        description: "Massive vinyl art toy. A statement piece for any collector's living space.",
        hologram: true
    },
    {
        id: "ob_02",
        name: "CHROME",
        variant: "HEARTS RING",
        price: 550.00,
        category: "OBJECTS",
        brand: "CHROME HEARTS",
        year: 2020,
        image: "https://image.goat.com/transform/v1/attachments/product_template_pictures/images/015/379/536/original/CH_Ring.png",
        description: ".925 Sterling Silver. Gothic motif with intricate engraving. Handmade in Los Angeles.",
        hologram: false
    }
];

// Exposure for App
if (typeof window !== 'undefined') {
    window.INVENTORY = INVENTORY;
}
