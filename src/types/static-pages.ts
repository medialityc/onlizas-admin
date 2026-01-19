import { PaginatedResponse } from "./common";

export enum ContentStatus {
  Draft = 0,
  Active = 1,
  Inactive = 2,
}

export interface StaticPageDto {
  id: string;
  title: string;
  content: string;
  slug: string;
  status: ContentStatus;
  section?: number;
  createdAt: string;
  updatedAt: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface StaticPageSummaryDto {
  id: string;
  title: string;
  slug: string;
  status: ContentStatus;
  section?: number;
  updatedAt: string;
}

export type GetAllStaticPagesResponse = PaginatedResponse<StaticPageSummaryDto>;

export interface CreateStaticPageRequest {
  title: string;
  content: string;
  slug: string;
  section: number;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface CreateStaticPageResponse extends StaticPageDto {}

export interface UpdateStaticPageRequest {
  title: string;
  content: string;
  section: number;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface UpdateStaticPageResponse extends StaticPageDto {}
