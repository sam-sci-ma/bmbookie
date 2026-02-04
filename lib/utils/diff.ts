// lib/utils/diff.ts
export function getDiff(oldData: any, newData: any) {
  const diffs: Record<string, { old: any; new: any }> = {};

  if (!oldData || !newData) return diffs;

  const allKeys = Array.from(new Set([...Object.keys(oldData), ...Object.keys(newData)]));

  for (const key of allKeys) {
    if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
      diffs[key] = {
        old: oldData[key],
        new: newData[key]
      };
    }
  }

  return diffs;
}