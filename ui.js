// ui.js：操作面板与视图（原生 DOM，无弹窗）
import { render } from "./app.js";

export function mount(spec, parts) {
  parts.log.textContent = "段数上限 " + (spec.max_segments || 0) + "，合并预算 " + (spec.merges || 0)
    + "，到达 " + (spec.arrivals || []).length + " 批。";

  function draw() {
    let view = null;
    try {
      view = render(spec);
    } catch (error) {
      parts.out.textContent = String(error && error.code ? error.code : error);
      parts.log.textContent = "跑不动：" + String(error && error.message ? error.message : error);
      return;
    }
    parts.out.textContent = JSON.stringify(view, null, 1);
    parts.stage.textContent = "";
    (view.segments || []).forEach(function (size, spot) {
      const row = document.createElement("div");
      row.className = "row";
      const head = document.createElement("span");
      head.textContent = "段 " + (spot + 1);
      row.appendChild(head);
      const bar = document.createElement("span");
      bar.className = "bar";
      const fill = document.createElement("i");
      fill.style.width = Math.min(100, size * 20) + "%";
      bar.appendChild(fill);
      row.appendChild(bar);
      const mark = document.createElement("span");
      const over = (view.segments || []).length > (spec.max_segments || 0);
      mark.className = "chip" + (over ? " warn" : " ok");
      mark.textContent = size + " 条";
      row.appendChild(mark);
      parts.stage.appendChild(row);
    });
    parts.legend.textContent = "合并 " + view.merge_count + " 次，收尾 " + view.segment_count + " 段，条数合计 "
      + view.records;
    parts.log.textContent = view.exhausted ? "预算用尽，段数还超上限" : "在预算内收住";
  }

  const sizeInput = document.createElement("input");
  sizeInput.type = "number";
  sizeInput.value = "2";
  parts.controls.appendChild(sizeInput);

  const runButton = document.createElement("button");
  runButton.className = "primary";
  runButton.textContent = "合并一遍";
  runButton.addEventListener("click", draw);
  parts.controls.appendChild(runButton);

  const addButton = document.createElement("button");
  addButton.textContent = "追加一批";
  addButton.addEventListener("click", function () {
    const size = Number(sizeInput.value);
    spec.arrivals = (spec.arrivals || []).concat([Number.isFinite(size) ? Math.max(1, Math.round(size)) : 1]);
    draw();
  });
  parts.controls.appendChild(addButton);

  const dropButton = document.createElement("button");
  dropButton.textContent = "删最后一批";
  dropButton.addEventListener("click", function () {
    spec.arrivals = (spec.arrivals || []).slice(0, Math.max(0, (spec.arrivals || []).length - 1));
    draw();
  });
  parts.controls.appendChild(dropButton);

  const limitButton = document.createElement("button");
  limitButton.textContent = "上限加一";
  limitButton.addEventListener("click", function () {
    spec.max_segments = (spec.max_segments || 1) + 1;
    draw();
  });
  parts.controls.appendChild(limitButton);

  draw();
}
