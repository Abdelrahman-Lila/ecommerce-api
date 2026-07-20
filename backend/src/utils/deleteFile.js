import fs from "fs";
import path from "path";

const deleteLocalFile = (fileUrl) => {
  if (!fileUrl) return;

  const relativePath = fileUrl.split("/uploads/")[1] || fileUrl;
  const absolutePath = path.join(process.cwd(), "uploads", relativePath);

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};

export default deleteLocalFile;
