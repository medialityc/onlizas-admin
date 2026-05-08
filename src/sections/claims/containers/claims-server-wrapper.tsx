import { SearchParams, IQueryable } from "@/types/fetch/request";
import { buildQueryParams } from "@/lib/request";
import { getAllClaims } from "@/services/claims";
import ClaimsAdminContainer from "./claims-admin-container";

interface Props {
  query: SearchParams;
}

export default async function ClaimsServerWrapper({ query }: Props) {
  const apiQuery: IQueryable = buildQueryParams(
    query as Record<string, unknown>,
  );

  const claimsResponse = await getAllClaims(apiQuery);

  return (
    <ClaimsAdminContainer
      claimsPromise={claimsResponse}
      query={query}
    />
  );
}
