import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';
import { listCourses, createCourse, updateCourse } from '../services/courseService';
import CourseFormModal from '../components/CourseFormModal';

export default function Courses() {
  const navigate = useNavigate();
  const { role, logout } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await listCourses();
      setCourses(data);
      setError('');
    } catch (e) {
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onAdd = () => { setEditing(null); setIsModalOpen(true); };
  const onEdit = (course) => { setEditing(course); setIsModalOpen(true); };

  const handleSubmit = async (payload) => {
    try {
      if (editing) {
        const updated = await updateCourse(editing.id, payload);
        setCourses((prev) => prev.map((c) => (c.id === editing.id ? updated : c)));
        toast.success('Course updated');
      } else {
        const created = await createCourse(payload);
        setCourses((prev) => [created, ...prev]);
        toast.success('Course created');
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Save failed');
      throw e;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Courses</h1>
          <p className="text-sm text-white">Role: <span className="font-medium">{role || 'Unknown'}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onAdd} className="px-3 py-2 rounded-md bg-white text-black border border-blue-300 hover:bg-white/90">Add Course</button>
          <button onClick={logout} className="px-3 py-2 rounded bg-white text-black border border-blue-300 hover:bg-white/90">Logout</button>
        </div>
      </header>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2">Course Name</th>
                <th className="text-left px-4 py-2">Course Code</th>
                <th className="text-left px-4 py-2">Template</th>
                <th className="text-left px-4 py-2">Certificate URL</th>
                <th className="text-left px-4 py-2">Linked hashtag Message</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-t">
                  <td className="px-4 py-2">{course.name}</td>
                  <td className="px-4 py-2">{course.code}</td>
                  <td className="px-4 py-2">
                    {course.templateDataUrl ? (
                      <img src={course.templateDataUrl} alt="template" className="w-10 h-10 object-cover rounded border" />
                    ) : (
                      <span className="text-xs text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="px-4 py-2 max-w-xs">
                    {course.certificateUrl ? (
                      <a href={course.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                        {course.certificateUrl}
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">No URL</span>
                    )}
                  </td>
                  <td className="px-4 py-2 max-w-md">
                    <span className="block truncate" title={course.linkedHashtagMessage || ''}>{course.linkedHashtagMessage || '-'}</span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <button onClick={() => onEdit(course)} className="px-2 py-1 text-sm rounded bg-white text-black border border-blue-300 hover:bg-white/90">Edit</button>
                      <button onClick={() => navigate(`/courses/${course.id}/employees`)} className="px-2 py-1 text-sm rounded-md bg-white text-black border border-blue-300 hover:bg-white/90">View Course</button>
                    </div>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-gray-500">No courses found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <CourseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initial={editing}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
