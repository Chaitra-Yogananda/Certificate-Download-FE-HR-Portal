import React from 'react';

export default function Modal({ isOpen, title, onClose, children, footer }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="p-4">
          {children}
        </div>
        {footer && (
          <div className="border-t px-4 py-3 bg-gray-50 rounded-b-lg flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
