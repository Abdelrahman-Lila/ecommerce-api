import "dotenv/config";
import mongoose from "mongoose";
import Product from "../src/models/product.model.js";
import Brand from "../src/models/brand.model.js";

const applyChanges = process.argv.includes("--apply");
const publicAppUrl = process.env.PUBLIC_APP_URL;

if (!publicAppUrl) {
  throw new Error("PUBLIC_APP_URL must be set, for example https://marketlane.me");
}

const appOrigin = new URL(publicAppUrl);

if (appOrigin.protocol !== "https:") {
  throw new Error("PUBLIC_APP_URL must use HTTPS");
}

const origin = appOrigin.origin;

const rewriteUploadUrl = (value) => {
  if (typeof value !== "string") return value;

  const uploadsPathIndex = value.indexOf("/uploads/");
  if (uploadsPathIndex === -1) return value;

  return `${origin}${value.slice(uploadsPathIndex)}`;
};

const run = async () => {
  await mongoose.connect(process.env.databaseUrl);

  const products = await Product.collection
    .find({}, { projection: { imageCover: 1, images: 1 } })
    .toArray();
  const brands = await Brand.collection
    .find({}, { projection: { image: 1 } })
    .toArray();

  const productUpdates = products.flatMap((product) => {
    const imageCover = rewriteUploadUrl(product.imageCover);
    const images = Array.isArray(product.images)
      ? product.images.map(rewriteUploadUrl)
      : product.images;

    if (
      imageCover === product.imageCover &&
      JSON.stringify(images) === JSON.stringify(product.images)
    ) {
      return [];
    }

    return [
      {
        updateOne: {
          filter: { _id: product._id },
          update: { $set: { imageCover, images } },
        },
      },
    ];
  });

  const brandUpdates = brands.flatMap((brand) => {
    const image = rewriteUploadUrl(brand.image);

    if (image === brand.image) return [];

    return [
      {
        updateOne: {
          filter: { _id: brand._id },
          update: { $set: { image } },
        },
      },
    ];
  });

  console.log(`Products to update: ${productUpdates.length}`);
  console.log(`Brands to update: ${brandUpdates.length}`);

  if (!applyChanges) {
    console.log("Dry run complete. No database records were changed.");
    console.log("Re-run with --apply after reviewing these counts.");
    return;
  }

  if (productUpdates.length > 0) {
    await Product.collection.bulkWrite(productUpdates);
  }

  if (brandUpdates.length > 0) {
    await Brand.collection.bulkWrite(brandUpdates);
  }

  console.log("Upload URL migration complete.");
};

try {
  await run();
} catch (error) {
  console.error("Upload URL migration failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
