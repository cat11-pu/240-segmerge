// segment.js：挑最短的两段（按下标升序扫描，严格更小才替换，并列自然保留下标最小者）
export function pickTwo(segments) {
  let first = -1;
  let second = -1;
  for (let i = 0; i < segments.length; i++) {
    if (first === -1) { first = i; continue; }
    if (segments[i] < segments[first]) {
      second = first;
      first = i;
    } else if (second === -1 || segments[i] < segments[second]) {
      second = i;
    }
  }
  if (first === -1) return [0, 0];
  if (second === -1) return [first, first];
  return [first, second];
}
