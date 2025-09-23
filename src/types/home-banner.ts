import { PaginatedResponse } from "./common";

export type IHomeBanner = {
  id: number;
  imageDesktopUrl: string;
  imageMobileUrl: string;
  link: string;
  regionId: number;
  regionName?: string;
};

export type CreateBanner = IHomeBanner;
export type UpdateBanner = IHomeBanner;

export type IGetAllHomeBanner = PaginatedResponse<IHomeBanner>;
