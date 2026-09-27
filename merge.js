// merge.js：边写边合并
import { pickTwo } from "./segment.js";

function isPositiveInteger(value) {
  return typeof value === "number" && Number.isInteger(value) && value >= 1;
}

function isNonNegativeInteger(value) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  throw error;
}

export function runMerge(spec) {
  const maxSegments = spec && spec.max_segments;
  const budget = spec && spec.merges;
  const arrivals = (spec && spec.arrivals) || [];
  if (!isPositiveInteger(maxSegments) || !isNonNegativeInteger(budget)) {
    fail("E_BAD_PARAM", "max_segments 必须是正整数，merges 必须是非负整数");
  }
  for (let i = 0; i < arrivals.length; i += 1) {
    if (!isPositiveInteger(arrivals[i])) {
      fail("E_BAD_BATCH", "每批条数必须是正整数");
    }
  }

  const segments = [];
  const merges = [];
  let left = budget;
  let exhausted = false;
  for (let i = 0; i < arrivals.length; i += 1) {
    segments.push(arrivals[i]);
    if (segments.length > maxSegments) {
      if (left > 0) {
        left -= 1;
        const picked = pickTwo(segments);
        const head = Math.min(picked[0], picked[1]);
        const tail = Math.max(picked[0], picked[1]);
        const short = Math.min(segments[head], segments[tail]);
        const long = Math.max(segments[head], segments[tail]);
        merges.push([short, long]);
        segments[head] = segments[head] + segments[tail];
        segments.splice(tail, 1);
      } else {
        exhausted = true;
      }
    }
  }
  return { segments: segments, merges: merges, merge_count: merges.length, exhausted: exhausted };
}
