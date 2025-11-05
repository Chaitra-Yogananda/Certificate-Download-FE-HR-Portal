import api from './api';

function mapCourseFromApi(c) {
  const templateDataUrl = c?.templateBase64 ? `data:image/jpeg;base64,${c.templateBase64}` : '';
  let certificateUrl = c?.certificateUrl || '';
  try {
    if (certificateUrl) {
      const u = new URL(certificateUrl);
      const firstSeg = u.pathname.split('/').filter(Boolean)[0];
      certificateUrl = firstSeg ? `${u.origin}/${firstSeg}` : `${u.origin}`;
    }
  } catch {}
  return {
    id: String(c.id),
    name: c.courseName,
    code: c.courseCode,
    templateDataUrl,
    certificateUrl,
    linkedHashtagMessage: c?.linkedHashtagMessage || ''
  };
}

function dataUrlToFile(dataUrl, filename = 'template.jpg') {
  if (!dataUrl) return null;
  const arr = dataUrl.split(',');
  if (arr.length < 2) return null;
  const mimeMatch = arr[0].match(/data:(.*);base64/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  try {
    return new File([u8arr], filename, { type: mime });
  } catch {
    return new Blob([u8arr], { type: mime });
  }
}

export async function listCourses() {
  const res = await api.get('/api/courses');
  return Array.isArray(res.data) ? res.data.map(mapCourseFromApi) : [];
}

export async function getCourse(id) {
  const res = await api.get(`/api/courses/${id}`);
  return mapCourseFromApi(res.data);
}

export async function createCourse(payload) {
  const fd = new FormData();
  fd.append('CourseName', payload.name);
  fd.append('CourseCode', payload.code);
  if (payload.linkedHashtagMessage != null) fd.append('LinkedHashtagMessage', payload.linkedHashtagMessage);
  const fileOrBlob = dataUrlToFile(payload.templateDataUrl, `${payload.code || 'template'}.jpg`);
  if (fileOrBlob) fd.append('Template', fileOrBlob);
  const res = await api.post('/api/courses', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  return mapCourseFromApi(res.data);
}

export async function updateCourse(id, payload) {
  const fd = new FormData();
  fd.append('CourseName', payload.name);
  fd.append('CourseCode', payload.code);
  if (payload.linkedHashtagMessage != null) fd.append('LinkedHashtagMessage', payload.linkedHashtagMessage);
  const fileOrBlob = payload.templateDataUrl ? dataUrlToFile(payload.templateDataUrl, `${payload.code || 'template'}.jpg`) : null;
  if (fileOrBlob) fd.append('Template', fileOrBlob);
  const res = await api.put(`/api/courses/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  return mapCourseFromApi(res.data);
}
