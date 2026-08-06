import mongoose, { Schema, Document } from "mongoose";

export interface IBlogSEO {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  canonicalUrl: string;
}

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  status: "draft" | "published";
  publishedAt: Date | null;
  seo: IBlogSEO;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSEOSchema = new Schema<IBlogSEO>({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  keywords: { type: String, default: "" },
  ogImage: { type: String, default: "" },
  canonicalUrl: { type: String, default: "" },
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    featuredImage: { type: String, default: "" },
    category: { type: String, default: "General" },
    tags: [{ type: String }],
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishedAt: { type: Date, default: null },
    seo: { type: BlogSEOSchema, default: () => ({}) },
  },
  { timestamps: true }
);

BlogSchema.index({ status: 1, publishedAt: -1 });
BlogSchema.index({ category: 1 });

BlogSchema.pre("save", async function () {
  if (!this.slug || this.isModified("title")) {
    const baseSlug = slugify(this.title);
    let slug = baseSlug;
    let counter = 1;
    while (await mongoose.models.Blog.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }
});

const Blog = mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
