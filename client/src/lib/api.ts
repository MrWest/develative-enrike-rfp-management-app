import { RoomingList } from "@/../../shared/types";
import _ from "lodash";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function fetchRoomingLists({
  search = "",
  status,
}): Promise<RoomingList[]> {
  // Current implementation: Load from local JSON
  const response = await fetch("/data/rfp-data.json");

  if (!response.ok) {
    throw new Error(`Failed to load rooming lists: ${response.statusText}`);
  }

  const data = await response.json();

  console.log('xxx: ', search);
  const filteredResponse = data.filter((item) => {
    // Search filter (RFP name and agreement type)
    const matchesSearch =
      _.isEmpty(search) ||
      item.rfpName.toLowerCase().includes(search.toLowerCase()) ||
      item.agreement_type.toLowerCase().includes(search.toLowerCase());

    // Status filter
    const matchesStatus = status.length === 0 || status.includes(item.status);

    return matchesSearch && matchesStatus;
  });

  return filteredResponse;
}

export async function fetchStatuses(): Promise<string[]> {
  // Current implementation: Load from local JSON
  const response = await fetch("/data/rfp-data.json");

  if (!response.ok) {
    throw new Error(`Failed to load rooming lists: ${response.statusText}`);
  }

  const data = await response.json();
  const statuses = new Set<string>(data.map((item) => item.status));
  return Array.from(statuses).sort();
}
