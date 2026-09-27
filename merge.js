// merge.js：边写边合并——每来一批新增一段，超上限就合并最短的两段，预算花光仍超上限则标超支
import { pickTwo } from "./segment.js";

function badRequest(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

export function runMerge(spec) {
  const input = spec || {};
  const limit = input.max_segments;
  const budget = input.merges;
  if (!Number.isInteger(limit) || limit < 1) {
    throw badRequest("E_BAD_PARAM", "max_segments 必须是正整数");
  }
  if (!Number.isInteger(budget) || budget < 0) {
    throw badRequest("E_BAD_PARAM", "merges 必须是非负整数");
  }
  const arrivals = input.arrivals == null ? [] : input.arrivals;

  const segments = [];
  const merges = [];
  let remaining = budget;
  let exhausted = false;

  for (const size of arrivals) {
    if (!Number.isInteger(size) || size < 1) {
      throw badRequest("E_BAD_BATCH", "批条数必须是正整数");
    }
    segments.push(size);
    if (segments.length <= limit) continue;
    if (remaining <= 0) { exhausted = true; continue; }

    const picked = pickTwo(segments);
    const a = picked[0];
    const b = picked[1];
    const front = Math.min(a, b);
    const back = Math.max(a, b);
    const leftSize = segments[a];
    const rightSize = segments[b];
    segments[front] = leftSize + rightSize;
    segments.splice(back, 1);
    merges.push(leftSize <= rightSize ? [leftSize, rightSize] : [rightSize, leftSize]);
    remaining -= 1;
  }

  const records = segments.reduce(function (sum, size) { return sum + size; }, 0);
  return {
    segments: segments,
    merges: merges,
    merge_count: merges.length,
    segment_count: segments.length,
    records: records,
    exhausted: exhausted
  };
}
