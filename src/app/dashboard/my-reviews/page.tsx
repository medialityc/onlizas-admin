import { getServerSession } from "zas-sso-client";
import { buildQueryParams } from "@/lib/request";
import { getMyReviews } from "@/services/reviews";
import MyReviewsContainer from "@/sections/reviews/containers/my-reviews-container";
import { redirect } from "next/navigation";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mis reseñas - ZAS Admin",
  description: "Reseñas de mis productos",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function MyReviewsPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const session = await getServerSession();
  const userId = session?.user?.id?.toString();

  if (!userId) {
    redirect("/dashboard");
  }

  const query: IQueryable = buildQueryParams(params);
  const res = await getMyReviews(query);

  return (
    <div className="space-y-6 p-4">
      <MyReviewsContainer initialData={res} query={params} />
    </div>
  );
}
