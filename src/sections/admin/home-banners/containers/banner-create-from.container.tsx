"use client";

import HomeBannerForm from "../components/banner-form";

const HomeBannerCreateFormContainer = () => {
  return (
    <div className="panel">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-dark dark:text-white-light">
          Crear Banner
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Define el banner
        </p>
      </div>
      <HomeBannerForm />
    </div>
  );
};

export default HomeBannerCreateFormContainer;
