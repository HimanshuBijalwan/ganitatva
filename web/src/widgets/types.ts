/**
 * FractionBar config types.
 *
 * These mirror the AUTHORED YAML shape in `content/concepts/arithmetic/*.yaml` — snake_case keys,
 * `label_id` string references, `fraction: {numerator, denominator}` objects — rather than a
 * prettier TypeScript-native shape. The content author's surface is the YAML
 * (00-kit-overview.md §3); if mounting a concept ever needed a hand-written adapter, that would be
 * a bug in these types, not a one-off exception.
 *
 * Optionality rule: a key is optional here if and only if the widget has a defensible default for
 * it. Anything the widget genuinely cannot render without (`mode`, `target`, `measuring_stick`,
 * `presets`) is required, and `validateFractionBarConfig` throws on it at construction.
 */

// ---------------------------------------------------------------------------
// Shared envelope (00-kit-overview.md §2.1)
// ---------------------------------------------------------------------------

export type InteractionLevel = 'readOnly' | 'guided' | 'free';
export type Verbosity = 'brief' | 'full';

export interface FractionSpec {
  numerator: number;
  denominator: number;
}

export interface StepperRange {
  min: number;
  max: number;
  step?: number;
  label?: string;
  label_id?: string;
}

export interface WidgetEnvelope {
  /** Unique within the concept; lets prompts/practice address this instance. */
  id?: string;
  interaction_level?: InteractionLevel;
  /** Ignored by FractionBar (no randomness); accepted so the envelope stays uniform. */
  seed?: number;
  a11y?: { verbosity?: Verbosity };
  /**
   * Resolved strings for the `*_id` references in the authored config. The content pipeline owns
   * the string table; when an id is missing the widget falls back to a built-in English default
   * (see `strings.ts`) rather than rendering a raw id at a learner.
   */
  strings?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// `measure` mode — THE GATE (fraction-bar.md §2.4, §3.4)
// ---------------------------------------------------------------------------

export interface MeasureUnitConfig {
  label_id?: string;
  show_whole_outline?: boolean;
  background_ruler?: {
    show?: boolean;
    /** `"from_target"` ticks the ruler in the target's own denominator. */
    denominator?: 'from_target' | number;
    label_id?: string;
  };
}

export interface MeasureTargetConfig {
  label_id?: string;
  fraction: FractionSpec;
  numerator_control?: StepperRange;
  denominator_control?: StepperRange;
  allow_greater_than_one?: boolean;
  max_value?: number;
  colour_token?: string;
}

export interface MeasuringStickConfig {
  label_id?: string;
  fraction: FractionSpec;
  numerator_control?: StepperRange;
  denominator_control?: StepperRange;
  allow_greater_than_one?: boolean;
  colour_token?: string;
  interaction?: 'drag-and-lay-end-to-end';
  snap_to_previous_copy?: boolean;
  copies_persist_on_screen?: boolean;
  /** Hard rule: a copy that would run past the target's far edge does not seat at all. */
  refuse_overhang?: boolean;
  on_refuse_message_id?: string;
}

export interface MeasureCounterConfig {
  counts?: 'measuring_stick_copies';
  unit_word_id?: string;
  /** The count is never rendered as a bare number. Structural, not a toggle. */
  show_unit_word_always?: boolean;
  format?: 'mixed' | 'improper';
  live_while_dragging?: boolean;
}

export type MeasureFrame = 'in_sticks' | 'in_wholes';
export type ActiveFrame = MeasureFrame | 'both';

export interface RemainderFrameToggle {
  label_id?: string;
  options?: MeasureFrame[];
  initial?: MeasureFrame;
  show_both_simultaneously_button?: string | boolean;
  explainer_id?: string;
  purpose?: string;
}

export interface RemainderConfig {
  enabled?: boolean;
  appears_when?: string;
  /** The crux. The leftover is measured against the divisor, never against the whole. */
  compare_against: 'measuring_stick';
  action?: string;
  readout_id?: string;
  also_allow_compare_against_whole?: boolean;
  frame_toggle?: RemainderFrameToggle;
}

export interface WholeProbeConfig {
  enabled?: boolean;
  label_id?: string;
  action?: string;
  readout_id?: string;
  purpose?: string;
}

export interface SamePiecesConfig {
  enabled?: boolean;
  label_id?: string;
  action?: string;
  suggest_common_denominator_button?: boolean;
  animate_ms?: number;
  readout_id?: string;
  purpose?: string;
}

export type Prediction = 'bigger' | 'smaller' | 'same';

export interface SizePredictorConfig {
  enabled?: boolean;
  ask_before_laying?: boolean;
  ask_before_laying_id?: string;
  record_prediction?: boolean;
  reveal_boundary_hint_after_n_attempts?: number;
  boundary_is?: string;
}

export interface MeasureEdgeCases {
  stick_equals_one_whole?: { allowed?: boolean; note_id?: string };
  stick_zero?: {
    allowed?: boolean;
    behaviour?: string;
    readout_id?: string;
    purpose?: string;
  };
}

export interface MeasurePreset {
  id: string;
  target: FractionSpec;
  stick: FractionSpec;
  /** Authored for content review and golden fixtures. NEVER rendered to a learner. */
  expect?: FractionSpec | string;
  note?: string;
}

export interface MeasureConfig extends WidgetEnvelope {
  mode: 'measure';
  unit?: MeasureUnitConfig;
  target: MeasureTargetConfig;
  measuring_stick: MeasuringStickConfig;
  counter?: MeasureCounterConfig;
  remainder?: RemainderConfig;
  whole_probe?: WholeProbeConfig;
  same_pieces_mode?: SamePiecesConfig;
  size_predictor?: SizePredictorConfig;
  edge_cases?: MeasureEdgeCases;
  /** Order is content, not sample data. Preserved exactly as authored. */
  presets: MeasurePreset[];
}

// ---------------------------------------------------------------------------
// `partition` mode (fraction-bar.md §2.1, §3.1)
// ---------------------------------------------------------------------------

export interface PartitionBarConfig {
  id: string;
  label?: string;
  label_id?: string;
  /** Fraction of the available track this bar occupies. A different whole is the point. */
  whole_length: number;
  partitions: number;
  shaded: number;
  shade_by?: 'tap';
  partitions_control?: StepperRange;
}

export interface PartitionConfig extends WidgetEnvelope {
  mode: 'partition';
  show_symbolic?: boolean;
  bars: PartitionBarConfig[];
  /** Guided-discovery exception (kit §4.2): opt-in, reversible, unsnapped on purpose. */
  unequal_cuts?: { enabled?: boolean; label?: string; label_id?: string; snap_back_button?: string };
  whole_outline?: { always_visible?: boolean; pulse_when_piece_count_changes?: boolean };
  readout?: { style?: 'words' | 'symbolic'; template_id?: string; also_show_piece_size_bar?: boolean };
  edge_cases?: { allow_zero_partitions?: boolean; allow_one_partition?: boolean };
}

// ---------------------------------------------------------------------------
// `equivalence` mode (fraction-bar.md §2.2) — STUBBED, see README
// ---------------------------------------------------------------------------

export interface EquivalenceBarConfig {
  id: string;
  label?: string;
  label_id?: string;
  whole_length: number;
  partitions: number;
  shaded: number;
  locked?: boolean;
  locked_shaded_edge?: boolean;
  shade_edge_style?: string;
}

export interface EquivalenceConfig extends WidgetEnvelope {
  mode: 'equivalence';
  bars: EquivalenceBarConfig[];
  split_control?: StepperRange & { animate_ms?: number };
  unsplit_control?: { label?: string; enabled_only_when_divisible?: boolean };
  sabotage_mode?: { enabled?: boolean; label?: string; effect?: string; show_edge_drift_marker?: boolean };
  readout?: {
    show_name_history?: boolean;
    show_point_on_mini_number_line?: boolean;
    highlight_when_name_is_simplest?: boolean;
  };
  challenge_targets?: Array<{ denominator: number; reachable: boolean }>;
}

// ---------------------------------------------------------------------------
// `combine` mode (fraction-bar.md §2.3) — STUBBED, see README
// ---------------------------------------------------------------------------

export interface CombineBarConfig {
  id: string;
  label?: string;
  label_id?: string;
  whole_length: number;
  partitions?: number;
  shaded?: number;
  numerator_control?: StepperRange;
  denominator_control?: StepperRange;
  extends_past_whole?: boolean;
  read_only?: boolean;
}

export interface CombineConfig extends WidgetEnvelope {
  mode: 'combine';
  bars: CombineBarConfig[];
  pour?: {
    action?: string;
    tiling?: 'strict';
    on_mismatch?: { behaviour?: string };
    /** Authored as `false` and validated as such: a mismatched pour is never forceable, because
     *  the refusal IS the lesson. Typed `boolean` only so a wrong authored value is catchable. */
    allow_force?: boolean;
  };
  recut?: {
    control?: string;
    min?: number;
    max?: number;
    suggest_lcm_button?: string;
    animate_ms?: number;
    recuts_shaded_regions?: boolean;
    highlight_when_both_tile?: boolean;
  };
  claim_check?: {
    enabled?: boolean;
    input?: string;
    show_on_mini_number_line?: boolean;
    also_plot?: string[];
  };
  readout?: {
    show_piece_name_separately?: boolean;
    show_unit_analogy_toggle?: boolean;
    show_symbolic?: boolean;
  };
}

export type FractionBarConfig =
  | MeasureConfig
  | PartitionConfig
  | EquivalenceConfig
  | CombineConfig;

// ---------------------------------------------------------------------------
// Events — RAW interaction facts only.
// ---------------------------------------------------------------------------

/**
 * A widget never decides "the learner is wrong" (00-kit-overview.md §2.4). Every member below is
 * a statement about geometry or about a gesture that happened. The `practice.misconceptions`
 * layer matches against this stream to produce a diagnosis; nothing here is a diagnosis.
 *
 * `refused: 'overhang'` is a geometric fact about a copy's far edge, not a judgement.
 */
export type FractionBarEvent =
  | { type: 'preset_selected'; presetId: string; index: number }
  | { type: 'fraction_changed'; which: 'target' | 'stick'; numerator: number; denominator: number }
  | { type: 'stick_lay_attempted'; copiesBefore: number; seated: boolean; refused?: 'overhang' }
  | { type: 'stick_removed'; copiesAfter: number }
  | { type: 'remainder_picked_up' }
  | { type: 'remainder_moved'; against: 'stick' | 'whole' | 'none'; coverageN: number; coverageD: number }
  | { type: 'remainder_laid'; against: 'stick' | 'whole'; coverageN: number; coverageD: number }
  | { type: 'remainder_returned' }
  | { type: 'frame_toggled'; frame: ActiveFrame }
  | { type: 'whole_probe_engaged' }
  | { type: 'same_pieces_toggled'; on: boolean; commonDenominator: number }
  | { type: 'prediction_recorded'; value: Prediction; attempt: number }
  | { type: 'exact_cover_reached'; copies: number }
  | { type: 'no_answer_state_entered'; copies: number }
  | { type: 'segment_toggled'; barId: string; index: number; shadedAfter: number }
  | { type: 'partitions_changed'; barId: string; partitions: number }
  | { type: 'cut_dragged'; barId: string; index: number; positionPermille: number }
  | { type: 'cuts_reset'; barId: string }
  | { type: 'validation_error'; message: string };

export type EventListener = (e: FractionBarEvent) => void;

// ---------------------------------------------------------------------------
// Persisted state / snapshots
// ---------------------------------------------------------------------------

export interface MeasureSnapshot {
  mode: 'measure';
  presetId: string | null;
  target: FractionSpec;
  stick: FractionSpec;
  copies: number;
  /** Where the leftover piece is resting, in grid units from the bay's left edge. */
  remainder: { against: 'stick' | 'whole'; offsetUnits: number; gridDenominator: number } | null;
  frame: ActiveFrame;
  samePieces: boolean;
  prediction: Prediction | null;
  predictionAttempts: number;
}

export interface PartitionSnapshot {
  mode: 'partition';
  bars: Array<{ id: string; partitions: number; shaded: boolean[]; cuts: number[] | null }>;
}

export interface StubSnapshot {
  mode: 'equivalence' | 'combine';
  note: 'not-yet-interactive';
}

export type FractionBarSnapshot = MeasureSnapshot | PartitionSnapshot | StubSnapshot;

// ---------------------------------------------------------------------------
// Mode controller contract (internal)
// ---------------------------------------------------------------------------

export interface ThemeColours {
  live: string;
  livePress: string;
  liveWash: string;
  paper: string;
  sheet: string;
  sunk: string;
  rule: string;
  ruleMajor: string;
  axis: string;
  ink900: string;
  ink700: string;
  ink500: string;
  qtyBlue: string;
  qtyGraphite: string;
}

export interface WidgetHost {
  readonly ctx: CanvasRenderingContext2D;
  /** Canvas size in CSS pixels. */
  readonly width: number;
  readonly height: number;
  readonly bu: number;
  readonly colours: ThemeColours;
  readonly reducedMotion: boolean;
  readonly wide: boolean;
  readonly controls: HTMLElement;
  readonly handles: HTMLElement;
  readonly log: HTMLElement;
  readonly readout: HTMLElement;
  readonly interactionLevel: InteractionLevel;
  str(id: string | undefined, fallback: string): string;
  emit(e: FractionBarEvent): void;
  announce(): void;
  requestDraw(): void;
  requestLayout(): void;
  animate(durationMs: number, onFrame: (t: number) => void, onDone?: () => void): void;
}

export interface ModeController {
  /** Height in CSS pixels the canvas needs at the host's current width. */
  measureHeight(): number;
  buildControls(): void;
  /** Re-sync chrome after the box changed. Never rebuilds controls — focus must survive a resize. */
  relayout(): void;
  draw(): void;
  describeState(v: Verbosity): string;
  snapshot(): FractionBarSnapshot;
  restore(s: FractionBarSnapshot): void;
  destroy(): void;
}
