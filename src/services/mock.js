import MockAdapter from 'axios-mock-adapter';
import api from './api';
import * as XLSX from 'xlsx';

// Simple unique ID generator
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// In-memory data
let courses = [
  { id: 'c1', name: 'React Basics', code: 'RB101', templateDataUrl: '', certificateUrl: 'https://example.com/courses/react-basics' },
  { id: 'c2', name: 'Advanced JS', code: 'JS201', templateDataUrl: '', certificateUrl: 'https://example.com/courses/advanced-js' },
];

let employeesByCourse = {
  c1: [
    { id: 'e1', name: 'John Doe', email: 'john@example.com', batch: 'A' },
    { id: 'e2', name: 'Jane Smith', email: 'jane@example.com', batch: 'B' },
  ],
  c2: [
    { id: 'e3', name: 'Alice Johnson', email: 'alice@example.com', batch: '' },
  ],
};

const mock = new MockAdapter(api, { delayResponse: 400 });

// Auth
mock.onPost('/api/auth/login').reply((config) => {
  try {
    const { email, password } = JSON.parse(config.data);
    if (!email || !password) {
      return [400, { message: 'Email and password are required' }];
    }
    const role = /super/i.test(email) ? 'Super Admin' : 'Admin';
    const token = 'mock-jwt-token';
    return [200, { token, role, email }];
  } catch (e) {
    return [500, { message: 'Invalid payload' }];
  }
});

// Courses
mock.onGet('/api/courses').reply(200, courses);

mock.onPost('/api/courses').reply((config) => {
  try {
    const body = JSON.parse(config.data);
    const { name, code, templateDataUrl, certificateUrl } = body;
    if (!name || !code) return [400, { message: 'Name and code are required' }];
    const newCourse = { id: uid(), name, code, templateDataUrl: templateDataUrl || '', certificateUrl: certificateUrl || '' };
    courses = [newCourse, ...courses];
    employeesByCourse[newCourse.id] = [];
    return [201, newCourse];
  } catch (e) {
    return [500, { message: 'Invalid payload' }];
  }
});

mock.onPut(/\/api\/courses\/[^/]+$/).reply((config) => {
  try {
    const courseId = config.url.split('/').pop();
    const body = JSON.parse(config.data);
    const idx = courses.findIndex((c) => c.id === courseId);
    if (idx === -1) return [404, { message: 'Course not found' }];
    const updated = { ...courses[idx], ...body };
    courses[idx] = updated;
    return [200, updated];
  } catch (e) {
    return [500, { message: 'Invalid payload' }];
  }
});

mock.onGet(/\/api\/courses\/[^/]+$/).reply((config) => {
  const courseId = config.url.split('/').pop();
  const course = courses.find((c) => c.id === courseId);
  if (!course) return [404, { message: 'Course not found' }];
  return [200, course];
});

// Employees
mock.onGet(/\/api\/courses\/[^/]+\/employees$/).reply((config) => {
  const courseId = config.url.split('/')[3];
  const list = employeesByCourse[courseId] || [];
  return [200, list];
});

mock.onPost(/\/api\/courses\/[^/]+\/employees$/).reply((config) => {
  try {
    const courseId = config.url.split('/')[3];
    const { name, email, batch } = JSON.parse(config.data);
    if (!name || !email) return [400, { message: 'Name and email are required' }];
    const newEmp = { id: uid(), name, email, batch: batch || '' };
    employeesByCourse[courseId] = [newEmp, ...(employeesByCourse[courseId] || [])];
    return [201, newEmp];
  } catch (e) {
    return [500, { message: 'Invalid payload' }];
  }
});

mock.onPost(/\/api\/courses\/[^/]+\/employees\/bulk$/).reply((config) => {
  try {
    const courseId = config.url.split('/')[3];
    const { employees } = JSON.parse(config.data);
    if (!Array.isArray(employees)) return [400, { message: 'Invalid employees array' }];
    const toAdd = employees
      .filter((e) => e.name && e.email)
      .map((e) => ({ id: uid(), name: e.name, email: e.email, batch: e.batch || '' }));
    employeesByCourse[courseId] = [...toAdd, ...(employeesByCourse[courseId] || [])];
    return [201, { count: toAdd.length }];
  } catch (e) {
    return [500, { message: 'Invalid payload' }];
  }
});

// Download Excel template
mock.onGet('/api/employees/download-template').reply(() => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([
    ['Employee Name', 'Employee Email', 'Batch (optional)'],
    ['John Doe', 'john@example.com', 'A'],
  ]);
  XLSX.utils.book_append_sheet(wb, ws, 'Template');
  const data = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  return [200, data, { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }];
});
