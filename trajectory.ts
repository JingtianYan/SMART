/**
 * Trajectory math shared by the Vicon mock replay (runVicon) and the visualiser.
 *
 * JSON trajectory files store grid coordinates and cardinal orientations (0–3).
 * The visualiser expects Argos-style world coords and radians (rz) on the Y axis.
 * These helpers convert between those conventions.
 */

/** One agent pose inside a simulation tick (matches Step.agents[] items). */
export type TickAgent = {
  id: number;
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
};

/** One row from a Vicon / trajectory JSON export file. */
export type TrajectoryRecord = {
  "Agent id": number;
  x: number;
  y: number;
  orientation: number;
  time_stamp: number;
};

/** Cardinal index → Y rotation in radians (matches footbot_diffusion.cpp). */
const CARDINAL_TO_RZ: Record<number, number> = {
  0: 0,
  1: (270 * Math.PI) / 180,
  2: Math.PI,
  3: (90 * Math.PI) / 180,
};

function isCardinalIndex(orientation: number) {
  return Number.isInteger(orientation) && orientation >= 0 && orientation <= 3;
}

/** Remap cardinal orientation when flip_coord is false (parser.cpp). */
export function remapOrientation(orientation: number, flip: boolean) {
  if (!isCardinalIndex(orientation)) return orientation;
  return flip ? orientation : (3 - orientation + 4) % 4;
}

/** Convert SMART cardinal index or existing radians to Three.js Y rotation. */
export function toRz(orientation: number, flip: boolean) {
  const o = remapOrientation(orientation, flip);
  return isCardinalIndex(o) ? CARDINAL_TO_RZ[o]! : o;
}

/**
 * Infer which way an agent is facing from grid movement (parser.cpp getOrientation).
 * Returns 0–3 for N/E/S/W, or -1 if the agent did not move.
 */
export function getOrientationFromMovement(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  if (x1 === x2 && y1 === y2) return -1;
  if (x2 === x1) return y2 > y1 ? 1 : 3;
  if (y2 === y1) return x2 > x1 ? 2 : 0;
  return -1;
}

/**
 * MAPF grid coords → Argos world coords (footbot_diffusion.cpp ChangeCoordinateFromMapToArgos).
 * The visualiser's state.ts then maps Argos coords to Three.js positions.
 */
export function toArgosCoords(rawX: number, rawY: number, flip: boolean) {
  const mapFirst = flip ? rawX : rawY;
  const mapSecond = flip ? rawY : rawX;
  const toArgos = (v: number) => (v === 0 ? 0 : -v);
  return {
    x: toArgos(mapSecond),
    y: toArgos(mapFirst),
  };
}

/**
 * Pick the best orientation for one JSON record:
 * - prefer heading inferred from movement since last frame
 * - else use orientation field from JSON
 * - else keep previous orientation
 */
export function resolveOrientation(
  rawX: number,
  rawY: number,
  recordOrientation: number | undefined,
  prev: { x: number; y: number; orientation: number } | undefined,
  flip: boolean
): number {
  const mapX = flip ? rawX : rawY;
  const mapY = flip ? rawY : rawX;

  if (prev) {
    const inferred = getOrientationFromMovement(prev.x, prev.y, mapX, mapY);
    if (inferred !== -1) return inferred;
  }

  if (recordOrientation !== undefined && !Number.isNaN(recordOrientation)) {
    return recordOrientation;
  }

  return prev?.orientation ?? 0;
}
