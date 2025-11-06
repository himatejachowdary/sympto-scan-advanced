
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Place {
  title: string;
  uri: string;
}

export interface CapturedImage {
  mimeType: string;
  data: string; // base64 encoded
}

export interface UserProfile {
  displayName: string;
  age: number | null;
}

export interface ScanHistoryItem {
  id: string;
  userId: string;
  symptoms: string;
  analysis: string;
  timestamp: Date;
  images?: CapturedImage[];
  ageAtScan: number | null;
}