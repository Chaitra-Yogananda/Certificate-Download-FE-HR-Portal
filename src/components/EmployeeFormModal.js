import React, { useEffect, useState } from 'react';
import Modal from './Modal';

export default function EmployeeFormModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [batch, setBatch] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setEmail('');
      setBatch('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onSubmit({ name: name.trim(), email: email.trim(), batch: batch.trim() });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Employee"
      footer={
        <>
          <button onClick={onClose} className="px-3 py-2 rounded border">Cancel</button>
          <button disabled={saving} onClick={handleSubmit} className="px-3 py-2 rounded bg-white text-blue-700 border border-blue-300 hover:bg-white/90 disabled:opacity-60">
            {saving ? 'Saving...' : 'Submit'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Employee Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border-2 border-blue-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Employee Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border-2 border-blue-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Batch (optional)</label>
          <input value={batch} onChange={(e) => setBatch(e.target.value)} className="w-full rounded-md border-2 border-blue-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600" />
        </div>
      </form>
    </Modal>
  );
}
