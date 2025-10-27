import { HomeBannerFormData } from "../schema/banner-schema";

export const bannerAdapter = (
  banner: HomeBannerFormData
): HomeBannerFormData => {
  return {
    ...banner,
    regionIds: banner?.regionIds || [],
  };
};
