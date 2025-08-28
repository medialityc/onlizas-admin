import { StoreEditFormData } from "../../modals/store-edit-form.schema";

type BuildBannersFormDataParams = {
    data: Partial<StoreEditFormData>;
    // Optional filter to select which banners to include (e.g., only new or only existing)
    filter?: (b: NonNullable<StoreEditFormData["banners"]>[number], index: number) => boolean;
};

// Builds FormData for the banners array endpoints: appends
// - "banners": JSON string with an array of banner objects
// - "images": one File per banner that changed image, in the same order as banners
export function buildBannersFormDataFromRHF({ data, filter }: BuildBannersFormDataParams) {
    const rows = Array.isArray(data.banners) ? data.banners : [];
    // Choose subset depending on filter (keeps original order!)
    const entries = rows.map((b, idx) => ({ b, idx })).filter(({ b, idx }) => (filter ? filter(b, idx) : true));
    // Use rows as-is; backend expects a JSON array of banner objects
    const banners = entries.map(({ b }) => b as any);

    // Images aligned with the selected subset order
    const images: (string | File)[] = entries.map(({ b }) => b?.image ?? "");

    const fd = new FormData();
    fd.append("banners", JSON.stringify(banners));
    images.forEach((img) => {
        if (img instanceof File) {
            fd.append("images", img);
        }
    });
    try {
    const lines: string[] = [];
    for (const [key, value] of Array.from(fd.entries())) {
      if (value instanceof File) {
        lines.push(`${key}: [File name=${value.name} size=${value.size} type=${value.type}]`);
      } else {
        lines.push(`${key}: ${String(value)}`);
      }
    }
    console.log("FormData (flattened):\n" + lines.join("\n"));
  } catch {}


    return fd;
}