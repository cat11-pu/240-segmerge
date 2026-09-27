// app.js：渲染结果
import { pickTwo } from "./segment.js";
import { runMerge } from "./merge.js";

export function render(spec) {
  const arrivals = spec.arrivals || [];
  const limit = spec.max_segments || 0;
  const view = runMerge(spec);
  const segments = view.segments || [];
  const records = segments.reduce(function (sum, size) { return sum + size; }, 0);
  const arrived = arrivals.reduce(function (sum, size) { return sum + size; }, 0);
  return { segments: segments, merges: view.merges || [], merge_count: view.merge_count || 0,
           segment_count: segments.length, records: records, exhausted: !!view.exhausted,
           within_limit: segments.length <= limit || !!view.exhausted, count: arrivals.length,
           conserved: records === arrived, tail: pickTwo([4, 2]).length };
}
