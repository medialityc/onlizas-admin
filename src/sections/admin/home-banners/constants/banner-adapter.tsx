import { HomeBannerFormData } from "../schema/banner-schema";

export const bannerAdapter = (
  banner: HomeBannerFormData
): HomeBannerFormData => {
  return {
    ...banner,
    link: banner?.link || "",
    regionIds: banner?.regionIds || [],
  };
};
