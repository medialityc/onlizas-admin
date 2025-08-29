"use client";

import React from "react";
import { Store } from "@/types/stores";
import StoreTabs from "./components/store-edit-tabs";

interface Props {
  store: Store;
}

export default function StoreEditAdminContainer({ store }: Props) {
  return (
    <div className="p-6">
      <StoreTabs store={store} />
    </div>
  );
}
