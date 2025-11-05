import api from './api';

function mapEmployeeFromApi(e) {
  return {
    id: String(e.id),
    name: e.employeeName,
    email: e.employeeEmail,
    batch: e.batch || ''
  };
}

export async function listEmployees(courseId) {
  const res = await api.get(`/api/courses/${courseId}/employees`);
  return Array.isArray(res.data) ? res.data.map(mapEmployeeFromApi) : [];
}

export async function addEmployee(courseId, payload) {
  const body = { employeeName: payload.name, employeeEmail: payload.email, batch: payload.batch };
  const res = await api.post(`/api/courses/${courseId}/employees`, body);
  return mapEmployeeFromApi(res.data);
}

export async function bulkUploadEmployeesFile(courseId, file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await api.post(`/api/courses/${courseId}/employees/upload`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data; // expected { total, inserted, failed }
}

export async function downloadTemplate() {
  const res = await api.get('/api/employees/download-template', { responseType: 'arraybuffer' });
  return res.data;
}
