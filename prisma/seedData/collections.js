"use strict";
// prisma/seedData/collections.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticCollections = exports.dynamicCollections = void 0;
// Saved filter collections (dynamic)
exports.dynamicCollections = [
    {
        name: "Pearl Rings under R$3.000",
        slug: "pearl-rings-under-3000",
        description: "Quick list: pearl rings priced under R$3.000",
        public: true,
        publicSlug: "pearl-rings",
        filters: {
            category: "ring",
            tags: ["pearl"],
            priceCentsMax: 300000,
            status: ["IN_STOCK"],
        },
    },
    {
        name: "Engagement Favorites",
        slug: "engagement-favorites",
        description: "Popular engagement picks",
        public: true,
        publicSlug: "engagement-favorites",
        filters: {
            tags: ["engagement", "halo", "diamond"],
            status: ["IN_STOCK", "RESERVED"],
        },
    },
    {
        name: "Minimal Everyday",
        slug: "minimal-everyday",
        description: "Clean, minimal pieces for daily wear",
        public: false,
        filters: {
            tags: ["minimal"],
            status: ["IN_STOCK"],
        },
    },
];
// Curated item lists (static)
exports.staticCollections = [
    {
        name: "Editor Picks",
        slug: "editor-picks",
        description: "Curated selection of highlights",
        public: true,
        publicSlug: "editor-picks",
        itemSkus: ["R-001-AU-6", "N-003-AU", "B-005-AU", "E-015-PT"],
    },
    {
        name: "New Arrivals",
        slug: "new-arrivals",
        description: "Recently acquired pieces",
        public: true,
        publicSlug: "new-arrivals",
        itemSkus: ["R-006-AU-5", "P-014-AUWG", "N-012-PT"],
    },
];
//# sourceMappingURL=collections.js.map