export type PackingItem = { id: string; text: string; checked: boolean };

export function parsePackingList(value: unknown): PackingItem[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is PackingItem =>
      !!item &&
      typeof item === "object" &&
      typeof item.id === "string" &&
      typeof item.text === "string" &&
      typeof item.checked === "boolean",
  );
}
