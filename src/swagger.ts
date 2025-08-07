import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Catia Reis Inventory API",
      version: "1.0.0",
      description:
        "API documentation for managing inventory items, collections, tags and metrics.",
    },
    components: {
      schemas: {
        Item: {
          type: "object",
          properties: {
            id: { type: "integer" },
            sku: { type: "string" },
            title: { type: "string" },
            itemType: { type: "string" },
            itemSubType: { type: "string" },
            metal: { type: "string" },
            status: { type: "string" },
            availability: { type: "string" },
            qty: { type: "integer" },
            priceCents: { type: "integer" },
            currency: { type: "string" },
            images: {
              type: "array",
              items: { $ref: "#/components/schemas/Image" },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ItemInput: {
          type: "object",
          allOf: [{ $ref: "#/components/schemas/Item" }],
          required: ["sku", "title", "priceCents", "currency"],
        },
        Image: {
          type: "object",
          properties: {
            id: { type: "integer" },
            url: { type: "string" },
            alt: { type: "string" },
            isPrimary: { type: "boolean" },
            sortOrder: { type: "integer" },
          },
        },
        Tag: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
          },
        },
        TagInput: {
          type: "object",
          properties: { name: { type: "string" } },
          required: ["name"],
        },
        Collection: {
          type: "object",
          properties: {
            id: { type: "integer" },
            slug: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/Item" },
            },
          },
        },
        CollectionInput: {
          type: "object",
          properties: {
            slug: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
          },
          required: ["slug", "name"],
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
