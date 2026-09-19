import { TrainingInfo, ChecklistItem, UploadedFile, TabType } from '../types';

type RealtimeListener = {
  onInit?: (data: { training: TrainingInfo; checklist: ChecklistItem[]; files: UploadedFile[]; activeUsers: number }) => void;
  onTrainingUpdated?: (training: TrainingInfo, sender?: string) => void;
  onItemToggled?: (data: { id: number; status: 'ada' | 'tidak_ada' | null }, checklist?: ChecklistItem[], sender?: string) => void;
  onChecklistUpdated?: (checklist: ChecklistItem[], sender?: string) => void;
  onFileUploaded?: (data: { file: UploadedFile; checklist: ChecklistItem[]; files: UploadedFile[] }, sender?: string) => void;
  onFileDeleted?: (data: { fileId: string; files: UploadedFile[]; checklist: ChecklistItem[] }) => void;
  onPresenceCount?: (count: number) => void;
  onConnectionChange?: (connected: boolean) => void;
};

class RealtimeService {
  private ws: WebSocket | null = null;
  private sse: EventSource | null = null;
  private listeners: Set<RealtimeListener> = new Set();
  private isConnected = false;
  private reconnectTimer: any = null;
  private clientId = 'client-' + Math.random().toString(36).substring(2, 9);

  constructor() {
    this.init();
  }

  public subscribe(listener: RealtimeListener) {
    this.listeners.add(listener);
    // Send immediate connection state
    if (listener.onConnectionChange) {
      listener.onConnectionChange(this.isConnected);
    }
    return () => {
      this.listeners.delete(listener);
    };
  }

  public init() {
    if (typeof window === 'undefined') return;

    // Fetch initial state via REST first for immediate rendering
    this.fetchInitialState();

    // Establish WebSocket connection
    this.connectWebSocket();
  }

  private async fetchInitialState() {
    try {
      const res = await fetch('/api/shared-state');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          this.listeners.forEach((l) => {
            l.onInit?.({
              training: data.training,
              checklist: data.checklist,
              files: data.files,
              activeUsers: data.activeUsers || 1,
            });
          });
        }
      }
    } catch (err) {
      console.warn('Could not fetch initial shared state:', err);
    }
  }

  private connectWebSocket() {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.notifyConnection(true);
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.handleIncomingMessage(msg);
        } catch (err) {
          console.error('Error parsing WS message:', err);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.notifyConnection(false);
        this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        this.connectSSE();
      };
    } catch {
      this.connectSSE();
    }
  }

  private connectSSE() {
    if (this.sse) return;
    try {
      this.sse = new EventSource('/api/realtime/stream');
      this.sse.onopen = () => {
        this.isConnected = true;
        this.notifyConnection(true);
      };
      this.sse.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          this.handleIncomingMessage(msg);
        } catch (err) {
          console.error('Error in SSE message:', err);
        }
      };
      this.sse.onerror = () => {
        this.sse?.close();
        this.sse = null;
      };
    } catch {
      // ignore
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connectWebSocket();
    }, 3000);
  }

  private notifyConnection(status: boolean) {
    this.listeners.forEach((l) => l.onConnectionChange?.(status));
  }

  private handleIncomingMessage(msg: any) {
    switch (msg.type) {
      case 'INIT_STATE':
        this.listeners.forEach((l) => l.onInit?.(msg.payload));
        break;
      case 'TRAINING_UPDATED':
        this.listeners.forEach((l) => l.onTrainingUpdated?.(msg.payload, msg.sender));
        break;
      case 'ITEM_TOGGLED':
        this.listeners.forEach((l) => l.onItemToggled?.(msg.payload, msg.checklist, msg.sender));
        break;
      case 'CHECKLIST_UPDATED':
        this.listeners.forEach((l) => l.onChecklistUpdated?.(msg.payload, msg.sender));
        break;
      case 'STATE_UPDATED':
        if (msg.payload?.training) {
          this.listeners.forEach((l) => l.onTrainingUpdated?.(msg.payload.training, msg.sender));
        }
        if (msg.payload?.checklist) {
          this.listeners.forEach((l) => l.onChecklistUpdated?.(msg.payload.checklist, msg.sender));
        }
        break;
      case 'FILE_UPLOADED':
        this.listeners.forEach((l) => l.onFileUploaded?.(msg.payload, msg.sender));
        break;
      case 'FILE_DELETED':
        this.listeners.forEach((l) => l.onFileDeleted?.(msg.payload));
        break;
      case 'PRESENCE_COUNT':
        this.listeners.forEach((l) => l.onPresenceCount?.(msg.payload.count));
        break;
    }
  }

  // Action methods
  public async updateTraining(training: Partial<TrainingInfo>, sender?: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: 'UPDATE_TRAINING',
          payload: training,
          sender: sender || this.clientId,
        })
      );
    } else {
      await fetch('/api/shared-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ training, sender: sender || this.clientId }),
      });
    }
  }

  public async toggleChecklistItem(id: number, status: 'ada' | 'tidak_ada' | null, sender?: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: 'TOGGLE_ITEM',
          payload: { id, status },
          sender: sender || this.clientId,
        })
      );
    } else {
      await fetch('/api/checklist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, sender: sender || this.clientId }),
      });
    }
  }

  public async completeAll(category: TabType, status: 'ada' | null, sender?: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: 'COMPLETE_ALL',
          payload: { category, status },
          sender: sender || this.clientId,
        })
      );
    } else {
      // update via shared-state
    }
  }

  public async uploadFile(payload: {
    name: string;
    size: number;
    type: string;
    dataUrl: string;
    category: TabType;
    checklistItemId?: number | null;
    checklistItemText?: string;
    uploadedBy?: string;
  }) {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  }

  public async deleteFile(fileId: string) {
    const res = await fetch(`/api/files/${fileId}`, {
      method: 'DELETE',
    });
    return await res.json();
  }
}

export const realtime = new RealtimeService();
