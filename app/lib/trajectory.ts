import { TrajectoryVector } from "../types/agent";

export interface TrajectoryPoint {
  x: number;
  y: number;
  angle: number;
}

export function computeTrajectoryVector(
  startX: number,
  startY: number,
  targetX: number,
  targetY: number,
  arcStrength: number = 0.35
): TrajectoryVector {
  const dx = targetX - startX;
  const dy = targetY - startY;
  const distance = Math.hypot(dx, dy);

  // Perpendicular offset upward for dynamic sci-fi arc
  const midX = (startX + targetX) / 2;
  const midY = (startY + targetY) / 2;

  // Arc height proportional to distance, with a minimum peak
  const arcPeak = Math.max(80, distance * arcStrength);

  // Upward perpendicular vector
  const normalX = -dy / (distance || 1);
  const normalY = dx / (distance || 1);

  // Bias arc upward towards the top of the screen (negative Y)
  const sign = normalY > 0 ? -1 : 1;
  const controlX = midX + normalX * arcPeak * 0.4;
  const controlY = midY - Math.abs(arcPeak);

  return {
    startX,
    startY,
    targetX,
    targetY,
    controlX,
    controlY,
  };
}

// Quadratic Bezier evaluation: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
export function evaluateBezier(
  t: number,
  vector: TrajectoryVector
): TrajectoryPoint {
  const clampedT = Math.max(0, Math.min(1, t));
  const invT = 1 - clampedT;

  const x =
    invT * invT * vector.startX +
    2 * invT * clampedT * vector.controlX +
    clampedT * clampedT * vector.targetX;

  const y =
    invT * invT * vector.startY +
    2 * invT * clampedT * vector.controlY +
    clampedT * clampedT * vector.targetY;

  // First derivative for tangent angle
  const dx =
    2 * invT * (vector.controlX - vector.startX) +
    2 * clampedT * (vector.targetX - vector.controlX);
  const dy =
    2 * invT * (vector.controlY - vector.startY) +
    2 * clampedT * (vector.targetY - vector.controlY);

  const angle = Math.atan2(dy, dx);

  return { x, y, angle };
}
