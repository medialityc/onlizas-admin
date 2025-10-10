import { PaginatedResponse } from "./common";

export type IHomeBanner = {
  id: number;
  link: string;
  imageDesktopUrl: string;
  imageMobileUrl: string;
  active: boolean;

  //details
  regionNames?: string[];
  regionIds: number[] | string[];
  desktopImageThumbnail?: string;
  mobileImageThumbnail?: string;
  createdDate?: Date;
};

export type CreateBanner = IHomeBanner;
export type UpdateBanner = IHomeBanner;

export type IGetAllHomeBanner = PaginatedResponse<IHomeBanner>;
