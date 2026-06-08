/**
 * Mock Vicon replay — streams trajectory JSON as if it were live motion-capture data.
 *
 * WHY THIS EXISTS
 * ---------------
 * Real Vicon hardware will send pose updates to the server over time. The visualiser
 * client should only subscribe and display — not parse trajectories locally.
 *
 * This module reads a JSON file (passed as a string), converts each timestamp into
 * simulation "tick" messages, and yields them one frame at a time so smart-service
 * can stream them to the browser via tRPC (runVicon subscription).
 *
 * SAME CONTRACT AS run()
 * --------------------
 * Returns { values(), dispose() } so smart-service/index.ts can treat Argos sim
 * and Vicon mock identically inside .subscription handlers.
 */

import type { ExecProgress, Output, Step } from "./index";
import {
  resolveOrientation,
  type TickAgent,
  type TrajectoryRecord,
  toArgosCoords,
  toRz,
} from "./trajectory";

/** Options sent from the visualiser client → smart-service → here. */
export type ViconOptions = {
  /** Entire JSON trajectory file read as plain text. */
  trajectory: string;
  /** Same flipXY toggle as the simulation path. */
  flipXY: boolean;
  /**
   * Milliseconds to wait between frames when streaming.
   * Mimics real-time Vicon updates. Set to 0 for instant replay.
   */
  frameDelayMs?: number;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Build one dense agents[] array for a single frame (carries forward unchanged agents).
 */
function buildFrameAgents(
  frame: TrajectoryRecord[],
  idToIndex: Record<number, number>,
  flip: boolean,
  prevByAgent: Map<number, { x: number; y: number; orientation: number }>,
  lastAgents: (TickAgent | undefined)[]
): TickAgent[] {
  const agents: TickAgent[] = [...lastAgents] as TickAgent[];

  for (const r of frame) {
    const agentIndex = idToIndex[r["Agent id"]];
    const mapX = flip ? r.x : r.y;
    const mapY = flip ? r.y : r.x;
    const prev = prevByAgent.get(r["Agent id"]);
    const orientation = resolveOrientation(
      r.x,
      r.y,
      r.orientation,
      prev,
      flip
    );
    const { x, y } = toArgosCoords(r.x, r.y, flip);
    const rz = toRz(orientation, flip);

    prevByAgent.set(r["Agent id"], { x: mapX, y: mapY, orientation });

    agents[agentIndex] = {
      id: agentIndex,
      x,
      y,
      z: 0,
      rx: 0,
      ry: 0,
      rz,
    };
  }

  return agents;
}

/**
 * Start a mock Vicon replay session.
 *
 * The returned async generator yields Output[] batches — usually one tick plus
 * exec_progress messages per frame — which smart-service forwards to the client.
 */
export async function runVicon({
  trajectory,
  flipXY,
  frameDelayMs = 100,
}: ViconOptions) {
  const records: TrajectoryRecord[] = JSON.parse(trajectory);

  // Normalise agent IDs to dense 0..N-1 indices (visualiser renders agents by index).
  const uniqueAgentIds = [...new Set(records.map((r) => r["Agent id"]))].sort(
    (a, b) => a - b
  );
  const idToIndex = Object.fromEntries(
    uniqueAgentIds.map((agentId, i) => [agentId, i])
  );

  // Group all records that share the same time_stamp into one animation frame.
  const byTime = new Map<number, TrajectoryRecord[]>();
  for (const r of records) {
    const bucket = byTime.get(r.time_stamp) ?? [];
    bucket.push(r);
    byTime.set(r.time_stamp, bucket);
  }
  const timestamps = [...byTime.keys()].sort((a, b) => a - b);
  const total = timestamps.length;

  const prevByAgent = new Map<
    number,
    { x: number; y: number; orientation: number }
  >();
  let lastAgents: (TickAgent | undefined)[] = [];

  return {
    async *values(): AsyncGenerator<Output[]> {
      for (let frameIndex = 0; frameIndex < timestamps.length; frameIndex++) {
        const frame = byTime.get(timestamps[frameIndex]!)!;
        const agents = buildFrameAgents(
          frame,
          idToIndex,
          flipXY,
          prevByAgent,
          lastAgents
        );
        lastAgents = agents;

        const step: Step = {
          type: "tick",
          clock: frameIndex,
          agents,
        };

        // One batch per frame: tick + progress for each agent that moved this frame.
        const batch: Output[] = [step];
        for (const r of frame) {
          const agentIndex = idToIndex[r["Agent id"]];
          const progress: ExecProgress = {
            type: "exec_progress",
            agent: agentIndex,
            finished: frameIndex,
            total,
          };
          batch.push(progress);
        }

        yield batch;

        // Pause between frames so the client sees motion over time (mock real Vicon).
        if (frameDelayMs > 0) {
          await sleep(frameDelayMs);
        }
      }

      yield [{ type: "message", content: "Vicon mock replay finished." }];
    },

    /** Nothing to clean up for JSON replay (unlike run() which kills Argos). */
    async dispose() {},
  };
}
