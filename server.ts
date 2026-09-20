import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { WebSocketServer, WebSocket } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = 3000;

// Allow body payload for base64 file uploads up to 30mb
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Database path for cloud user data, shared state & uploads
const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'cloud_database.json');

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initial default training and checklist data
const DEFAULT_TRAINING = {
  namaPelatihan: 'Pelatihan Kegawatdaruratan Psikiatri Bagi Personel RSUD dr. H. Jusuf SK Tahun 2026',
  tanggalPelatihan: '07 s.d. 09 September 2026',
  tempatPelatihan: 'RSUD dr. H. Jusuf SK',
  jamPelatihan: '08.00 WITA - Selesai',
  ruanganPelatihan: 'HUT R II Lt. 4 RSUD dr. H. Jusuf SK',
};

const DEFAULT_CHECKLIST = [
  // TAB 1: Peserta
  { id: 1, text: 'Telaah Staf RSUD dr. H. Jusuf SK', category: 'peserta', status: null },
  { id: 2, text: 'Kerangka Acuan Kegiatan', category: 'peserta', status: null },
  { id: 3, text: 'Surat Permohonan Narasumber', category: 'peserta', status: null },
  { id: 4, text: 'Biodata/Curriculum Vitae (CV) Narasumber', category: 'peserta', status: null },
  { id: 5, text: 'Rundown Acara Kegiatan', category: 'peserta', status: null },
  { id: 6, text: 'NPWP/KTP Narasumber', category: 'peserta', status: null },
  { id: 7, text: 'Rekapan Nama Peserta', category: 'peserta', status: null },
  { id: 8, text: 'Absen Narasumber dan Peserta', category: 'peserta', status: null },
  { id: 9, text: 'Materi Tiap Narasumber', category: 'peserta', status: null },
  { id: 10, text: 'Dokumentasi Kegiatan Pelatihan', category: 'peserta', status: null },
  { id: 11, text: 'Undangan Pelatihan', category: 'peserta', status: null },
  { id: 12, text: 'Surat Bukti Narasumber', category: 'peserta', status: null },
  { id: 13, text: 'Dasar Penggajian/Pembayaran Narasumber (Perpres 72)', category: 'peserta', status: null },
  { id: 14, text: 'DPA Yang di Gunakan', category: 'peserta', status: null },
  { id: 15, text: 'Rekap Pajak (Dari Keuangan)', category: 'peserta', status: null },
  { id: 16, text: 'SPJ Pembiayaan', category: 'peserta', status: null },
  { id: 17, text: 'Rincian Honorarium', category: 'peserta', status: null },
  { id: 18, text: 'No. Rekening Bank', category: 'peserta', status: null },

  // TAB 2: Perjalanan
  { id: 101, text: 'Surat Tugas / SPPD Narasumber Luar Daerah', category: 'perjalanan', status: null },
  { id: 102, text: 'Tiket Transportasi (Pesawat/Darat) PP Asli', category: 'perjalanan', status: null },
  { id: 103, text: 'Boarding Pass Asli Keberangkatan & Kepulangan', category: 'perjalanan', status: null },
  { id: 104, text: 'Kwitansi / Billing Resmi Penginapan / Hotel', category: 'perjalanan', status: null },
  { id: 105, text: 'Daftar Pengeluaran Riil (DPR) Transportasi Lokal', category: 'perjalanan', status: null },
  { id: 106, text: 'Laporan Singkat Hasil Perjalanan Dinas Narasumber', category: 'perjalanan', status: null },
  { id: 107, text: 'Surat Pernyataan Mutlak Keabsahan Dokumen Perjalanan', category: 'perjalanan', status: null },

  // TAB 3: Konsumsi
  { id: 201, text: 'Surat Pesanan / Order Konsumsi Pelatihan', category: 'konsumsi', status: null },
  { id: 202, text: 'Rekapitulasi Daftar Hadir Peserta & Panitia Penerima Konsumsi', category: 'konsumsi', status: null },
  { id: 203, text: 'Kwitansi Pembayaran Penyedia Jasa Katering (Bermaterai)', category: 'konsumsi', status: null },
  { id: 204, text: 'Faktur Pajak / Bukti Setor PPh Pasal 23 & Pajak Daerah', category: 'konsumsi', status: null },
  { id: 205, text: 'Berita Acara Serah Terima (BAST) Pekerjaan Konsumsi', category: 'konsumsi', status: null },
  { id: 206, text: 'Foto Dokumentasi Penyajian Makan & Minum Sesi Pelatihan', category: 'konsumsi', status: null },

  // TAB 4: Kontribusi
  { id: 301, text: 'Rencana Anggaran Biaya (RAB) Kontribusi Peserta', category: 'kontribusi', status: null },
  { id: 302, text: 'Surat Penetapan Tarif Kontribusi Pelatihan BLUD', category: 'kontribusi', status: null },
  { id: 303, text: 'Rekapan Bukti Setor/Transfer Peserta ke Rekening BLUD', category: 'kontribusi', status: null },
  { id: 304, text: 'Bukti Penerimaan Pembayaran Kasir / Bendahara Penerimaan', category: 'kontribusi', status: null },
  { id: 305, text: 'Laporan Realisasi Penerimaan Kontribusi Pelatihan', category: 'kontribusi', status: null },
  { id: 306, text: 'Berita Acara Rekonsiliasi Penerimaan Kas BLUD', category: 'kontribusi', status: null },
];

function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = {
        users: {},
        checklists: {},
        sharedTraining: DEFAULT_TRAINING,
        sharedChecklist: DEFAULT_CHECKLIST,
        sharedFiles: [],
        notifications: [
          {
            id: 'init-1',
            title: 'Sistem Terhubung Real-Time',
            message: 'Aplikasi Formulir Checklist RSUD Dr. H. Jusuf SK aktif secara live untuk semua pengguna.',
            timestamp: new Date().toISOString(),
            type: 'info',
            read: false,
          },
        ],
        auditLogs: [],
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
      return initial;
    }

    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    
    // Ensure sharedTraining & sharedChecklist are present
    if (!parsed.sharedTraining) parsed.sharedTraining = DEFAULT_TRAINING;
    if (!parsed.sharedChecklist || !Array.isArray(parsed.sharedChecklist)) parsed.sharedChecklist = DEFAULT_CHECKLIST;
    if (!parsed.sharedFiles || !Array.isArray(parsed.sharedFiles)) parsed.sharedFiles = [];
    if (!parsed.notifications) parsed.notifications = [];
    if (!parsed.auditLogs) parsed.auditLogs = [];

    return parsed;
  } catch (err) {
    console.error('Failed to read database:', err);
    return {
      users: {},
      checklists: {},
      sharedTraining: DEFAULT_TRAINING,
      sharedChecklist: DEFAULT_CHECKLIST,
      sharedFiles: [],
      notifications: [],
      auditLogs: [],
    };
  }
}

function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to write database:', err);
  }
}

// Set up WebSocket server attached to HTTP server
const wss = new WebSocketServer({ server, path: '/ws' });
const sseClients = new Set<express.Response>();

// Broadcast to all active WebSocket clients and SSE streams
function broadcast(event: { type: string; payload?: any; [key: string]: any }) {
  const message = JSON.stringify(event);

  // Broadcast WebSocket
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(message);
      } catch (err) {
        console.error('WS send error:', err);
      }
    }
  });

  // Broadcast SSE clients
  sseClients.forEach((res) => {
    try {
      res.write(`data: ${message}\n\n`);
    } catch {
      sseClients.delete(res);
    }
  });
}

function broadcastPresence() {
  const activeCount = Math.max(1, wss.clients.size);
  broadcast({
    type: 'PRESENCE_COUNT',
    payload: { count: activeCount },
  });
}

wss.on('connection', (ws) => {
  const db = readDB();
  
  // Send initial full state immediately to newly connected client
  ws.send(
    JSON.stringify({
      type: 'INIT_STATE',
      payload: {
        training: db.sharedTraining,
        checklist: db.sharedChecklist,
        files: db.sharedFiles,
        activeUsers: Math.max(1, wss.clients.size),
      },
    })
  );

  broadcastPresence();

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      const currentDB = readDB();

      if (msg.type === 'UPDATE_TRAINING' && msg.payload) {
        currentDB.sharedTraining = { ...currentDB.sharedTraining, ...msg.payload };
        writeDB(currentDB);
        broadcast({
          type: 'TRAINING_UPDATED',
          payload: currentDB.sharedTraining,
          sender: msg.sender,
        });
      } else if (msg.type === 'TOGGLE_ITEM' && msg.payload) {
        const { id, status } = msg.payload;
        currentDB.sharedChecklist = currentDB.sharedChecklist.map((item: any) =>
          item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item
        );
        writeDB(currentDB);
        broadcast({
          type: 'ITEM_TOGGLED',
          payload: { id, status },
          checklist: currentDB.sharedChecklist,
          sender: msg.sender,
        });
      } else if (msg.type === 'COMPLETE_ALL' && msg.payload) {
        const { category, status } = msg.payload;
        currentDB.sharedChecklist = currentDB.sharedChecklist.map((item: any) =>
          category ? (item.category === category ? { ...item, status } : item) : { ...item, status }
        );
        writeDB(currentDB);
        broadcast({
          type: 'CHECKLIST_UPDATED',
          payload: currentDB.sharedChecklist,
          sender: msg.sender,
        });
      }
    } catch (err) {
      console.error('Error handling WS message:', err);
    }
  });

  ws.on('close', () => {
    broadcastPresence();
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Real-time Server-Sent Events (SSE) fallback stream
app.get('/api/realtime/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const db = readDB();
  res.write(
    `data: ${JSON.stringify({
      type: 'INIT_STATE',
      payload: {
        training: db.sharedTraining,
        checklist: db.sharedChecklist,
        files: db.sharedFiles,
        activeUsers: Math.max(1, wss.clients.size + sseClients.size + 1),
      },
    })}\n\n`
  );

  sseClients.add(res);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

// Get current shared state
app.get('/api/shared-state', (req, res) => {
  const db = readDB();
  return res.json({
    success: true,
    training: db.sharedTraining,
    checklist: db.sharedChecklist,
    files: db.sharedFiles || [],
    activeUsers: Math.max(1, wss.clients.size),
  });
});

// Update shared state (HTTP REST endpoint for reliable mutations)
app.post('/api/shared-state', (req, res) => {
  try {
    const { training, checklist, sender } = req.body;
    const db = readDB();

    if (training) {
      db.sharedTraining = { ...db.sharedTraining, ...training };
    }
    if (checklist && Array.isArray(checklist)) {
      db.sharedChecklist = checklist;
    }

    writeDB(db);

    broadcast({
      type: 'STATE_UPDATED',
      payload: {
        training: db.sharedTraining,
        checklist: db.sharedChecklist,
      },
      sender,
    });

    return res.json({
      success: true,
      training: db.sharedTraining,
      checklist: db.sharedChecklist,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Toggle checklist item status via REST
app.post('/api/checklist/toggle', (req, res) => {
  try {
    const { id, status, sender } = req.body;
    const db = readDB();

    db.sharedChecklist = db.sharedChecklist.map((item: any) =>
      item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item
    );

    writeDB(db);

    broadcast({
      type: 'ITEM_TOGGLED',
      payload: { id, status },
      checklist: db.sharedChecklist,
      sender,
    });

    return res.json({ success: true, checklist: db.sharedChecklist });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// File upload endpoint (supports Drag & Drop and manual file selection)
app.post('/api/upload', (req, res) => {
  try {
    const { name, size, type, dataUrl, category, checklistItemId, checklistItemText, uploadedBy } =
      req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nama file harus disertakan' });
    }

    const db = readDB();
    const fileId = 'file-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);

    const newFile = {
      id: fileId,
      name,
      size: size || 0,
      type: type || 'application/octet-stream',
      category: category || 'peserta',
      checklistItemId: checklistItemId || null,
      checklistItemText: checklistItemText || '',
      dataUrl: dataUrl || '',
      uploadedAt: new Date().toISOString(),
      uploadedBy: uploadedBy || 'Petugas Diklat RSUD',
    };

    if (!Array.isArray(db.sharedFiles)) {
      db.sharedFiles = [];
    }
    db.sharedFiles.unshift(newFile);

    // If linked to a checklist item, mark that item as 'ada' automatically
    if (checklistItemId) {
      db.sharedChecklist = db.sharedChecklist.map((item: any) =>
        item.id === Number(checklistItemId)
          ? {
              ...item,
              status: 'ada',
              attachedFileId: fileId,
              attachedFileName: name,
              updatedAt: new Date().toISOString(),
            }
          : item
      );
    }

    // Add notification
    db.notifications.unshift({
      id: 'notif-up-' + Date.now(),
      title: 'Berkas Baru Diunggah',
      message: `Berkas "${name}" berhasil diunggah${
        checklistItemText ? ` untuk persyaratan "${checklistItemText}"` : ''
      }.`,
      timestamp: new Date().toISOString(),
      type: 'success',
      read: false,
    });

    writeDB(db);

    broadcast({
      type: 'FILE_UPLOADED',
      payload: {
        file: newFile,
        checklist: db.sharedChecklist,
        files: db.sharedFiles,
      },
      sender: uploadedBy,
    });

    return res.json({
      success: true,
      file: newFile,
      checklist: db.sharedChecklist,
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Delete uploaded file endpoint
app.delete('/api/files/:fileId', (req, res) => {
  try {
    const { fileId } = req.params;
    const { itemId, fileName } = req.query as { itemId?: string; fileName?: string };
    const db = readDB();

    db.sharedFiles = (db.sharedFiles || []).filter(
      (f: any) => f.id !== fileId && f.name !== fileId && (!fileName || f.name !== fileName)
    );

    // Unlink from checklist items
    db.sharedChecklist = (db.sharedChecklist || []).map((item: any) => {
      const matchFileId = item.attachedFileId === fileId;
      const matchFileName = item.attachedFileName === fileId || (fileName && item.attachedFileName === fileName);
      const matchItem = itemId && Number(item.id) === Number(itemId);

      if (matchFileId || matchFileName || matchItem) {
        return {
          ...item,
          attachedFileId: undefined,
          attachedFileName: undefined,
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    });

    writeDB(db);

    broadcast({
      type: 'FILE_DELETED',
      payload: {
        fileId,
        files: db.sharedFiles,
        checklist: db.sharedChecklist,
      },
    });

    return res.json({ success: true, files: db.sharedFiles, checklist: db.sharedChecklist });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// User session / cloud record endpoint
app.post('/api/user/sync', (req, res) => {
  try {
    const { user, checklistData, lastAction } = req.body;
    if (!user || !user.uid) {
      return res.status(400).json({ error: 'User UID is required' });
    }

    const db = readDB();
    const userId = user.uid;

    db.users[userId] = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLogin: new Date().toISOString(),
      driveFolderId: '1TDkIhMLsPkkKO2Zlkwb5VQs80D5gUeaW',
      spreadsheetId: '1Rt3n63eyuKiE0LTsiBLRzOf4H4V0Lf9d6CQt_4MNYkg',
    };

    if (checklistData) {
      db.checklists[userId] = {
        updatedAt: new Date().toISOString(),
        updatedBy: user.email || user.displayName || 'Unknown',
        data: checklistData,
      };

      db.auditLogs.unshift({
        id: 'log-' + Date.now(),
        userId,
        userEmail: user.email,
        action: lastAction || 'Update checklist',
        timestamp: new Date().toISOString(),
      });

      if (db.auditLogs.length > 100) {
        db.auditLogs = db.auditLogs.slice(0, 100);
      }
    }

    writeDB(db);

    return res.json({
      success: true,
      message: 'Cloud data synchronized successfully',
      serverTime: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Get user checklist from cloud
app.get('/api/user/checklist/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const db = readDB();
    const checklist = db.checklists[userId] || null;
    return res.json({ success: true, checklist });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Notifications endpoint
app.get('/api/notifications', (req, res) => {
  try {
    const db = readDB();
    return res.json({
      success: true,
      notifications: db.notifications || [],
      recentLogs: (db.auditLogs || []).slice(0, 5),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Mark notification as read
app.post('/api/notifications/read', (req, res) => {
  try {
    const { id, markAll } = req.body;
    const db = readDB();
    if (markAll) {
      db.notifications = db.notifications.map((n: any) => ({ ...n, read: true }));
    } else if (id) {
      db.notifications = db.notifications.map((n: any) =>
        n.id === id ? { ...n, read: true } : n
      );
    }
    writeDB(db);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`RSUD Dr. H. Jusuf SK Real-Time Server running at http://0.0.0.0:${PORT}`);
  });
}

start();

