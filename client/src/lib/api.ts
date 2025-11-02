import { RoomingList } from "@/../../shared/types";

/**
 * API Service Layer
 * 
 * This module provides a centralized location for all API calls.
 * Currently using local JSON file, but structured to easily switch to REST API.
 * 
 * For technical interview: Replace fetchRoomingLists implementation with actual API call
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Fetches all rooming lists
 * 
 * Current implementation: Loads from local JSON file
 * Future implementation: Replace with actual API call
 * 
 * Example REST API implementation:
 * ```typescript
 * export async function fetchRoomingLists(): Promise<RoomingList[]> {
 *   const response = await fetch(`${API_BASE_URL}/api/rooming-lists`, {
 *     method: 'GET',
 *     headers: {
 *       'Content-Type': 'application/json',
 *       // Add authentication headers if needed
 *       // 'Authorization': `Bearer ${token}`
 *     },
 *   });
 * 
 *   if (!response.ok) {
 *     throw new Error(`Failed to fetch rooming lists: ${response.statusText}`);
 *   }
 * 
 *   return response.json();
 * }
 * ```
 */
export async function fetchRoomingLists(): Promise<RoomingList[]> {
  // Current implementation: Load from local JSON
  const response = await fetch('/data/rfp-data.json');
  
  if (!response.ok) {
    throw new Error(`Failed to load rooming lists: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetches a single rooming list by ID
 * 
 * Future implementation for technical interview
 * 
 * @param id - The rooming list ID
 * @returns The rooming list data
 */
export async function fetchRoomingListById(id: number): Promise<RoomingList> {
  // TODO: Implement for technical interview
  // const response = await fetch(`${API_BASE_URL}/api/rooming-lists/${id}`);
  // if (!response.ok) throw new Error('Failed to fetch rooming list');
  // return response.json();
  
  const lists = await fetchRoomingLists();
  const list = lists.find(l => l.roomingListId === id);
  
  if (!list) {
    throw new Error(`Rooming list with ID ${id} not found`);
  }
  
  return list;
}

/**
 * Creates a new rooming list
 * 
 * Future implementation for technical interview
 * 
 * @param data - The rooming list data to create
 * @returns The created rooming list
 */
export async function createRoomingList(data: Omit<RoomingList, 'roomingListId'>): Promise<RoomingList> {
  // TODO: Implement for technical interview
  // const response = await fetch(`${API_BASE_URL}/api/rooming-lists`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // if (!response.ok) throw new Error('Failed to create rooming list');
  // return response.json();
  
  throw new Error('Not implemented - will be added during technical interview');
}

/**
 * Updates an existing rooming list
 * 
 * Future implementation for technical interview
 * 
 * @param id - The rooming list ID
 * @param data - The updated rooming list data
 * @returns The updated rooming list
 */
export async function updateRoomingList(id: number, data: Partial<RoomingList>): Promise<RoomingList> {
  // TODO: Implement for technical interview
  // const response = await fetch(`${API_BASE_URL}/api/rooming-lists/${id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // if (!response.ok) throw new Error('Failed to update rooming list');
  // return response.json();
  
  throw new Error('Not implemented - will be added during technical interview');
}

/**
 * Deletes a rooming list
 * 
 * Future implementation for technical interview
 * 
 * @param id - The rooming list ID
 */
export async function deleteRoomingList(id: number): Promise<void> {
  // TODO: Implement for technical interview
  // const response = await fetch(`${API_BASE_URL}/api/rooming-lists/${id}`, {
  //   method: 'DELETE',
  // });
  // if (!response.ok) throw new Error('Failed to delete rooming list');
  
  throw new Error('Not implemented - will be added during technical interview');
}
