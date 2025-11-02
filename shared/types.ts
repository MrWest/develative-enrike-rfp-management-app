export interface Booking {
  bookingId: number;
  hotelId: number;
  eventId: number;
  guestName: string;
  guestPhoneNumber: string;
  checkInDate: string;
  checkOutDate: string;
}

export interface RoomingList {
  roomingListId: number;
  eventId: number;
  eventName: string;
  hotelId: number;
  rfpName: string;
  cutOffDate: string;
  status: string;
  agreement_type: string;
  bookings: Booking[];
}

export type RFPStatus = 'completed' | 'received' | 'archived' | 'Confirmed';
export type AgreementType = 'leisure' | 'staff';
