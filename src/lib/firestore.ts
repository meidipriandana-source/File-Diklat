import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';
import firebaseConfig from '../../firebase-applet-config.json';
import { ActivitySheet, TrainingInfo, ChecklistItem } from '../types';
import { INITIAL_ACTIVITIES, DEFAULT_TRAINING_INFO, INITIAL_CHECKLIST_ITEMS } from '../data/initialChecklist';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const STATE_DOC_ID = 'main_app_state';

export interface CloudAppState {
  activities: ActivitySheet[];
  activeActivityId: string;
  training: TrainingInfo;
  checklistItems: ChecklistItem[];
  updatedAt: string;
}

export async function saveAppStateToCloud(state: {
  activities: ActivitySheet[];
  activeActivityId: string;
  training: TrainingInfo;
  checklistItems: ChecklistItem[];
}) {
  try {
    const docRef = doc(db, 'app_states', STATE_DOC_ID);
    // Sanitize activities to avoid exceeding Firestore 1MB limit with huge dataUrls
    const lightweightActivities = (state.activities || []).map((a) => ({
      ...a,
      uploadedFiles: (a.uploadedFiles || []).map((f) => ({
        ...f,
        dataUrl: f.dataUrl && f.dataUrl.length < 150000 ? f.dataUrl : undefined,
      })),
    }));

    await setDoc(docRef, {
      activities: lightweightActivities,
      activeActivityId: state.activeActivityId,
      training: state.training,
      checklistItems: state.checklistItems,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('Gagal menyimpan ke Cloud Firestore:', error);
    return false;
  }
}

export async function loadAppStateFromCloud(): Promise<CloudAppState | null> {
  try {
    const docRef = doc(db, 'app_states', STATE_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as CloudAppState;
    }
    return null;
  } catch (error) {
    console.warn('Gagal memuat dari Cloud Firestore:', error);
    return null;
  }
}

export function subscribeToAppState(
  onUpdate: (state: CloudAppState) => void
) {
  try {
    const docRef = doc(db, 'app_states', STATE_DOC_ID);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data() as CloudAppState);
      }
    }, (error) => {
      console.warn('Firestore subscription error:', error);
    });
  } catch (err) {
    console.warn('Failed to subscribe to Firestore:', err);
    return () => {};
  }
}
