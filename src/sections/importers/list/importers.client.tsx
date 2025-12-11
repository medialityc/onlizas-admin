"use client";

import { GetImporters } from "@/types/importers";
import ImportersList from "./importers-list";

interface Props {
  data?: GetImporters;
}

export default function ImportersClient({ data }: Props) {
  return <ImportersList data={data} />;
}
