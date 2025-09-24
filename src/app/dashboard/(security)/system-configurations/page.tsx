import { getSystemConfigurations } from "@/services/system-configuration";
import { SearchParams } from "@/types/fetch/request";
import ConfigurationsListContainer from "@/sections/system-configurations/list/configurations-list-container";

export const dynamic = "force-dynamic";

export default async function SystemConfigurationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const configurationsPromise = await getSystemConfigurations(
    await searchParams
  );

  return (
    <ConfigurationsListContainer
      configurationsPromise={configurationsPromise}
      query={await searchParams}
    />
  );
}
