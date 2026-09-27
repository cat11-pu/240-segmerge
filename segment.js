// segment.js：挑最短的两段（并列取下标最小者，先最短、再次短）
export function pickTwo(segments) {
  let first = -1;
  for (let i = 0; i < segments.length; i += 1) {
    if (first === -1 || segments[i] < segments[first]) first = i;
  }
  let second = -1;
  for (let i = 0; i < segments.length; i += 1) {
    if (i === first) continue;
    if (second === -1 || segments[i] < segments[second]) second = i;
  }
  return [first, second];
}
