export type AgentState =
  | "IDLE"
  | "SCANNING"
  | "HOVER_TARGET"
  | "TARGET_LOCK"
  | "TOOL_SELECT"
  | "TOOL_EQUIP"
  | "AIM"
  | "THROW"
  | "TOOL_TRAVEL"
  | "TARGET_RECEIVE"
  | "SUCCESS"
  | "RETURN_IDLE";

export type DestinationId =
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "achievements"
  | "certifications"
  | "github"
  | "resume"
  | "contact"
  | "assistant";

export type ToolType =
  | "cube"
  | "chip"
  | "capsule"
  | "beacon"
  | "core"
  | "prism"
  | "badge"
  | "seal"
  | "timeline";

export interface ToolInfo {
  id: string;
  name: string;
  type: ToolType;
  color: string;
  secondaryColor: string;
  glyph: string;
  description: string;
  impactLog: string;
  energyLevel: string;
}

export interface NavDestination {
  id: DestinationId;
  label: string;
  code: string;
  coordinates: string;
  tool: ToolInfo;
  iconName: string;
  description: string;
  category: "core" | "technical" | "profile" | "comms";
}

export interface TrajectoryVector {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  controlX: number;
  controlY: number;
}

export interface AgentTelemetry {
  state: AgentState;
  activeDestination: DestinationId | null;
  hoveredDestination: DestinationId | null;
  currentTool: ToolInfo | null;
  statusMessage: string;
  batteryLevel: number;
  coreTemperature: number;
  confidenceRate: number;
  systemLogs: string[];
}
