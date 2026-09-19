export interface ActivitySheet {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  training: TrainingInfo;
  checklistItems: ChecklistItem[];
  uploadedFiles: UploadedFile[];
}

export interface TrainingInfo {
  namaPelatihan: string;
  tanggalPelatihan: string;
  tempatPelatihan: string;
  jamPelatihan: string;
  ruanganPelatihan: string;
}

export type TabType = 'peserta' | 'perjalanan' | 'konsumsi' | 'kontribusi';

export interface ChecklistItem {
  id: number;
  text: string;
  category: TabType;
  status: 'ada' | 'tidak_ada' | null;
  notes?: string;
  updatedAt?: string;
  attachedFileId?: string;
  attachedFileName?: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: TabType;
  checklistItemId?: number | null;
  checklistItemText?: string;
  dataUrl?: string;
  uploadedAt: string;
  uploadedBy?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}

export interface DriveSyncItem {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  createdTime?: string;
  size?: string;
}

export interface SyncHistoryItem {
  id: string;
  timestamp: string;
  target: 'Drive & Sheets' | 'Google Drive' | 'Google Sheets';
  tabTitle: string;
  fileName?: string;
  userEmail?: string;
  status: 'success' | 'partial' | 'failed';
  details?: string;
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
