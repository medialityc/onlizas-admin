"use client";

import { HomeBannerFormData } from "../schema/banner-schema";
import HomeBannerForm from "../components/banner-form";
import { bannerAdapter } from "../constants/banner-adapter";

type Props = {
  banner: HomeBannerFormData;
};
const HomeBannerEditFormContainer = ({ banner }: Props) => {
  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-dark dark:text-white-light">
          Editar Banner
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Define el banner y sus características
        </p>
      </div>

      <HomeBannerForm initValue={bannerAdapter(banner)} />
    </div>
  );
};

export default HomeBannerEditFormContainer;
