import React, { useEffect, useState } from 'react';
import Modal from './Modal';

export default function CourseFormModal({ isOpen, onClose, initial, onSubmit }) {
  const [name, setName] = useState(initial?.name || '');
  const [code, setCode] = useState(initial?.code || '');
  const [linkedHashtagMessage, setLinkedHashtagMessage] = useState(initial?.linkedHashtagMessage || '');
  const [templateDataUrl, setTemplateDataUrl] = useState(initial?.templateDataUrl || '');
  const [fileError, setFileError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(initial?.name || '');
    setCode(initial?.code || '');
    setLinkedHashtagMessage(initial?.linkedHashtagMessage || '');
    setTemplateDataUrl(initial?.templateDataUrl || '');
    setFileError('');
  }, [initial, isOpen]);

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'image/jpeg') {
      setFileError('Only JPG images are allowed');
      return;
    }
    setFileError('');
    const reader = new FileReader();
    reader.onload = () => setTemplateDataUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (!initial && !templateDataUrl) {
        setFileError('Template image is required');
        return;
      }
      await onSubmit({ name: name.trim(), code: code.trim(), linkedHashtagMessage: linkedHashtagMessage.trim(), templateDataUrl });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initial ? 'Edit Course' : 'Add Course'}
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
          <label className="block text-sm font-medium mb-1">Course Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border-2 border-blue-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Course Code</label>
          <input value={code} onChange={(e) => setCode(e.target.value)} disabled={!!initial} className="w-full rounded-md border-2 border-blue-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 disabled:opacity-60" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Linked hashtag Message</label>
          <textarea value={linkedHashtagMessage} onChange={(e) => setLinkedHashtagMessage(e.target.value)} rows={3} className="w-full rounded-md border-2 border-blue-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600" placeholder="#Achievement #Certification Your message..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Template (JPG)</label>
          <input type="file" accept="image/jpeg" onChange={onFileChange} />
          {fileError && <p className="text-sm text-red-600 mt-1">{fileError}</p>}
          {templateDataUrl ? (
            <img src={templateDataUrl} alt="Template" className="mt-3 w-24 h-24 object-cover rounded border" />
          ) : (
            <p className="text-xs text-gray-500 mt-1">No image selected</p>
          )}
        </div>
      </form>
    </Modal>
  );
}
