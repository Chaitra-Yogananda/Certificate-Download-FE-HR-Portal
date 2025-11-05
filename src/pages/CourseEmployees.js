import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCourse } from '../services/courseService';
import { listEmployees, addEmployee, bulkUploadEmployeesFile, downloadTemplate } from '../services/employeeService';
import EmployeeFormModal from '../components/EmployeeFormModal';
import { saveAs } from 'file-saver';
 

export default function CourseEmployees() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const uploadRef = useRef();


  const fetchAll = async () => {
    try {
      setLoading(true);
      const [c, e] = await Promise.all([getCourse(id), listEmployees(id)]);
      setCourse(c);
      setEmployees(e);
      setError('');
    } catch (err) {
      setError('Failed to load course or employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onAddEmployee = async (payload) => {
    try {
      const created = await addEmployee(id, payload);
      setEmployees((prev) => [created, ...prev]);
      toast.success('Employee added');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Add failed');
      throw e;
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const data = await downloadTemplate();
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'employees_template.xlsx');
      toast.success('Template downloaded');
    } catch (e) {
      toast.error('Download failed');
    }
  };

  const parseAndUpload = async (file) => {
    try {
      const res = await bulkUploadEmployeesFile(id, file);
      const msg = `Uploaded ${res.inserted}/${res.total} employees${res.failed ? `, failed ${res.failed}` : ''}`;
      toast.success(msg);
      const fresh = await listEmployees(id);
      setEmployees(fresh);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Upload failed');
    }
  };

  const handleUploadClick = () => uploadRef.current?.click();
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    parseAndUpload(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/courses')} className="px-2 py-1 text-sm border rounded">Back</button>
          <h1 className="text-2xl font-semibold text-white">{course?.name || 'Course'}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleDownloadTemplate} className="px-3 py-2 rounded bg-white text-black border border-blue-300 hover:bg-white/90">Download Template</button>
          <button onClick={handleUploadClick} className="px-3 py-2 rounded bg-white text-black border border-blue-300 hover:bg-white/90">Upload Employee List</button>
          <input ref={uploadRef} type="file" accept=".xlsx" className="hidden" onChange={handleFileChange} />
        </div>
      </header>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <div className="bg-white rounded shadow overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2">Employee Name</th>
                    <th className="text-left px-4 py-2">Employee Email</th>
                    <th className="text-left px-4 py-2">Batch</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id} className="border-t">
                      <td className="px-4 py-2">{emp.name}</td>
                      <td className="px-4 py-2">{emp.email}</td>
                      <td className="px-4 py-2">{emp.batch || '-'}</td>
                    </tr>
                  ))}
                  {employees.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-4 py-6 text-center text-gray-500">No employees found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-start">
            <button onClick={() => setIsAddOpen(true)} className="px-3 py-2 rounded bg-white text-black border border-blue-300 hover:bg-white/90">Add Employee</button>
          </div>
        </>
      )}

      <EmployeeFormModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={onAddEmployee}
      />
    </div>
  );
}
