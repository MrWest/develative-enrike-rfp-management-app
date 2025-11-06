import { RoomingList } from "@/../../shared/types";
import _ from "lodash";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

interface FetchRoomingListsParams {
  search?: string;
  status?: string[];
}

interface RoomingListItem {
  rfpName: string;
  agreement_type: string;
  status: string;
  roomingListId: string;
  eventId: string;
  eventName: string;
  hotelId: string;
  hotelName: string;
}

export async function fetchRoomingLists({
  search = "",
  status = [],
}: FetchRoomingListsParams): Promise<RoomingListItem[]> {
  const response = await fetch("/data/rfp-data.json");

  if (!response.ok) {
    throw new Error(`Failed to load rooming lists: ${response.statusText}`);
  }

  console.log("xxxK ", status);
  const data: RoomingListItem[] = await response.json();

  const filteredResponse = data.filter((item) => {
    const matchesSearch =
      _.isEmpty(search) ||
      item.rfpName.toLowerCase().includes(search.toLowerCase()) ||
      item.agreement_type.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      status.length === 0 ||
      status
        .map((s) => s.toLocaleLowerCase())
        .includes(item.status.toLocaleLowerCase());

    return matchesSearch && matchesStatus;
  });

  return filteredResponse;
}

export async function fetchStatuses(): Promise<string[]> {
  const response = await fetch("/data/rfp-data.json");

  if (!response.ok) {
    throw new Error(`Failed to load rooming lists: ${response.statusText}`);
  }

  const data = await response.json();
  const statuses = new Set<string>(data.map((item) => item.status));
  return Array.from(statuses).sort();
}
