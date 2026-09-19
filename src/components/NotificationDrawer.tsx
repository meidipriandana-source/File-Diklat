import React from 'react';
import {
  X,
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
  Clock,
  CheckCheck,
  Radio,
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id?: string, markAll?: boolean) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="relative p-2 bg-teal-50 text-teal-700 rounded-lg border border-teal-200">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-tight">
                Notifikasi Real-time
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                <span>Status Pembaruan Terkini</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-header / Actions */}
        <div className="px-4 py-2 bg-white border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-600">
            {unreadCount > 0 ? `${unreadCount} belum dibaca` : 'Semua notifikasi dibaca'}
          </span>
          {unreadCount > 0 && (
            <button
              onClick={() => onMarkAsRead(undefined, true)}
              className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-semibold cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Tandai Semua Dibaca</span>
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Bell className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-xs">Belum ada notifikasi saat ini.</p>
            </div>
          ) : (
            notifications.map((item) => {
              const timeFormatted = new Date(item.timestamp).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  onClick={() => !item.read && onMarkAsRead(item.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    item.read
                      ? 'bg-slate-50/70 border-slate-200 opacity-80'
                      : 'bg-white border-teal-300 shadow-2xs hover:border-teal-400 ring-1 ring-teal-100'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0">
                      {item.type === 'success' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                      {item.type === 'warning' && (
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                      )}
                      {item.type === 'info' && <Info className="w-4 h-4 text-teal-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4
                          className={`text-xs font-semibold truncate ${
                            item.read ? 'text-slate-700' : 'text-slate-900'
                          }`}
                        >
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {timeFormatted}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {item.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-500">
            Sistem Notifikasi RSUD Dr. H. Jusuf SK Terhubung
          </p>
        </div>
      </div>
    </div>
  );
};
