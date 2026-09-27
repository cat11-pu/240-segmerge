import fs from "node:fs";
import { pickTwo } from "./segment.js";
import { runMerge } from "./merge.js";
import { render } from "./app.js";

// 验收断言：上面每条值收进 emit，最后与期望值逐项比对，不符就非零退出。
const __lines = [];
function emit(label, value) { __lines.push([String(label).replace(/ =$/, ""), value]); }


const spec = JSON.parse(fs.readFileSync(process.argv[2] || "sample/segments.json", "utf8"));
const view = render(spec);

emit("收尾段长表 =", JSON.stringify(view.segments));
emit("合并记录 =", JSON.stringify(view.merges));
emit("合并次数 =", view.merge_count);
emit("收尾段数 =", view.segment_count);
emit("条数合计 =", view.records);
emit("超支 =", view.exhausted);
emit("上限复核 =", view.within_limit);
emit("到达批数 =", view.count);
emit("条数守恒 =", view.conserved);


// ---- 异常路径探针：真调用实现，看它报出什么码（不是从样例里抄）----
try {
  runMerge({ max_segments: 0, merges: 1, arrivals: [] });
  emit("参数写错的错误码", "没有报错");
} catch (error) {
  emit("参数写错的错误码", error && error.code ? error.code : String(error.message));
}
try {
  runMerge({ max_segments: 2, merges: 1, arrivals: [0] });
  emit("批写错的错误码", "没有报错");
} catch (error) {
  emit("批写错的错误码", error && error.code ? error.code : String(error.message));
}


// ---- 期望值（参考模型算出，与题面给的验收数值一致）----
const EXPECTED = {
  "收尾段长表": [
    3,
    2,
    3,
    2
  ],
  "合并记录": [
    [
      1,
      1
    ],
    [
      1,
      2
    ]
  ],
  "合并次数": 2,
  "收尾段数": 4,
  "条数合计": 10,
  "超支": true,
  "上限复核": true,
  "到达批数": 6,
  "条数守恒": true,
  "参数写错的错误码": "E_BAD_PARAM",
  "批写错的错误码": "E_BAD_BATCH"
};
// 有的值在收进来之前已经 stringify 过，比较前先试着解析回来，避免类型错配把正确实现判成不过。
function __same(got, want) {
  if (typeof got === "string") {
    try { const parsed = JSON.parse(got); if (JSON.stringify(parsed) === JSON.stringify(want)) return true; } catch (error) { /* 不是 JSON 就按原文比 */ }
  }
  return JSON.stringify(got) === JSON.stringify(want);
}
let __bad = 0;
for (const [label, want] of Object.entries(EXPECTED)) {
  const found = __lines.find((pair) => pair[0] === label);
  if (!found) { __bad += 1; console.log("缺失验收项 " + label); continue; }
  const got = found[1];
  if (__same(got, want)) { console.log("一致 " + label + " = " + JSON.stringify(got)); }
  else { __bad += 1; console.log("不一致 " + label + " 期望 " + JSON.stringify(want) + " 实际 " + JSON.stringify(got)); }
}
console.log("验收项 " + (Object.keys(EXPECTED).length - __bad) + "/" + Object.keys(EXPECTED).length + " 通过");
process.exit(__bad === 0 ? 0 : 1);
