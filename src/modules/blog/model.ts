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
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  readTime: string;
  tags: string[];
  status: "draft" | "published";
  publishedAt: Date | null;
  seo: IBlogSEO;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSEOSchema = new Schema<IBlogSEO>(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    keywords: { type: String, default: "" },
    ogImage: { type: String, default: "" },
    canonicalUrl: { type: String, default: "" },
  },
  { _id: false },
);

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    featuredImage: { type: String, default: "" },
    category: { type: String, default: "General" },
    readTime: { type: String, default: "5 min read" },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishedAt: { type: Date, default: null },
    seo: { type: BlogSEOSchema, default: () => ({}) },
  },
  { timestamps: true },
);

BlogSchema.index({ status: 1, createdAt: -1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ tags: 1 });

const Blog = mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
