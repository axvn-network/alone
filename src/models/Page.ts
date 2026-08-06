import mongoose, { Schema, Document } from "mongoose";

export interface IPageSection {
  id: string;
  type: string;
  title: string;
  content: string;
  image?: string;
  order: number;
}

export interface IPageSEO {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  canonicalUrl: string;
}

export interface IPage extends Document {
  slug: string;
  title: string;
  hero: Record<string, unknown>;
  sections: IPageSection[];
  seo: IPageSEO;
  updatedAt: Date;
  createdAt: Date;
}

const PageSectionSchema = new Schema<IPageSection>({
  id: { type: String, required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: String,
  order: { type: Number, default: 0 },
});

const PageSEOSchema = new Schema<IPageSEO>({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  keywords: { type: String, default: "" },
  ogImage: { type: String, default: "" },
  canonicalUrl: { type: String, default: "" },
});

const PageSchema = new Schema<IPage>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    hero: { type: Schema.Types.Mixed, default: {} },
    sections: [PageSectionSchema],
    seo: { type: PageSEOSchema, default: () => ({}) },
  },
  { timestamps: true }
);

const Page = mongoose.models.Page || mongoose.model<IPage>("Page", PageSchema);

export default Page;
