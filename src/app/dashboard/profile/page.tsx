import ProfileContainer from "@/sections/profile/containers/profile-container";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Profile | ZAS Express",
  description: "Provider profile and account settings",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

function CategoriesListSkeleton() {
  return (
    <div className="panel">
      <div className="mb-5">
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="flex gap-4 mb-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-64"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
        </div>
      </div>
      <div className="space-y-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

export default async function ProfilePage() {
  return (
    <Suspense fallback={<CategoriesListSkeleton />}>
      <ProfileContainer />
    </Suspense>
  );
}
