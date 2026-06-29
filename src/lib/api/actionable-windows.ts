export type ActionableWindowsResponse = {
  diagnosticRunId: string | null;
  storeId: string | null;
  storeName: string | null;
  segmentKey: string | null;
  summary: ActionableWindowsSummary;
  windows: ActionableWindow[];
};

export type ActionableWindowsSummary = {
  openWindows: number;
  actionableCustomers: number;
  associatedValue: number;
  readyCampaigns: number;
};

export type ActionableWindow = {
  id: string;
  type: ActionableWindowType;
  title: string;
  description: string;
  priority: ActionableWindowPriority;
  channel: ActionableWindowChannel | null;
  countLabel: string;
  valueLabel: string | null;
  metricKey: string;
  suggestedAction: string;
  whyItAppeared: string[];
  messageSuggestion: MessageSuggestion | null;
  records: ActionableRecord[];
};

export type ActionableWindowType =
  | "campaign"
  | "qualification"
  | "operational_task"
  | "experiment"
  | string;

export type ActionableWindowPriority =
  | "critical"
  | "high"
  | "medium"
  | "low"
  | string;

export type ActionableWindowChannel =
  | "whatsapp"
  | "manual"
  | "internal"
  | string;

export type MessageSuggestion = {
  channel: string;
  text: string;
};

export type ActionableRecord = {
  id: string;
  label: string;
  reason: string;
  daysSinceTrigger: number | null;
  confidence: number | null;
  explanation: string;
  contact: string | null;
  baseEvent: string | null;
  baseValue: string | null;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_OHRLY_API_BASE_URL;

export async function getActionableWindows(
  diagnosticRunId?: string,
): Promise<ActionableWindowsResponse> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_OHRLY_API_BASE_URL não configurado.");
  }

  const path = diagnosticRunId
    ? `/api/bff/actionable-windows/${diagnosticRunId}`
    : "/api/bff/actionable-windows";

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");

    throw new Error(
      `Erro ao buscar janelas acionáveis: ${response.status} ${body}`,
    );
  }

  return response.json();
}