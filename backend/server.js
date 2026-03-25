const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Cho phép các yêu cầu từ frontend
app.use(express.json()); // Cho phép server đọc dữ liệu JSON từ request

// Dữ liệu mẫu (sẽ được thay thế bằng cơ sở dữ liệu sau này)
let students = [
    {
        id: 'SV001',
        name: 'Nguyễn Văn An',
        email: 'an.nguyen@email.com',
        department: 'Công nghệ thông tin',
        class: 'CNTT01',
        status: 'active',
        phone: '0123456789',
        address: 'Hà Nội',
        birthDate: '2000-01-15'
    },
    {
        id: 'SV002',
        name: 'Trần Thị Bình',
        email: 'binh.tran@email.com',
        department: 'Kinh tế',
        class: 'KT01',
        status: 'active',
        phone: '0987654321',
        address: 'TP.HCM',
        birthDate: '2001-03-22'
    },
    {
        id: 'SV003',
        name: 'Lê Văn Cường',
        email: 'cuong.le@email.com',
        department: 'Công nghệ thông tin',
        class: 'CNTT02',
        status: 'inactive',
        phone: '0369852147',
        address: 'Đà Nẵng',
        birthDate: '1999-12-08'
    }
];

// Dữ liệu còn lại
let courses = [
    { id: 'MH001', name: 'Lập trình Web', credits: 3, department: 'Công nghệ thông tin' },
    { id: 'MH002', name: 'Cơ sở dữ liệu', credits: 4, department: 'Công nghệ thông tin' },
    { id: 'MH003', name: 'Kinh tế vi mô', credits: 3, department: 'Kinh tế' }
];

let grades = [
    { studentId: 'SV001', courseId: 'MH001', attendance: 9, midterm: 8, final: 7.5 },
    { studentId: 'SV003', courseId: 'MH001', attendance: 10, midterm: 8.5, final: 8 },
];

let classes = [
    { id: 'CNTT01', name: 'Công nghệ thông tin 01', department: 'Công nghệ thông tin' },
    { id: 'CNTT02', name: 'Công nghệ thông tin 02', department: 'Công nghệ thông tin' },
    { id: 'KT01', name: 'Kinh tế 01', department: 'Kinh tế' }
];

let userProfile = {
    name: 'Admin',
    email: 'admin@qlsv.edu.vn',
    dob: '1990-01-01',
    avatar: 'https://via.placeholder.com/150'
};

let departments = ['Công nghệ thông tin', 'Kinh tế', 'Ngoại ngữ', 'Quản trị kinh doanh'];

// API Endpoints
app.get('/api/students', (req, res) => {
    res.json(students);
});

app.get('/api/courses', (req, res) => {
    res.json(courses);
});

app.get('/api/classes', (req, res) => {
    res.json(classes);
});

app.get('/api/grades', (req, res) => {
    res.json(grades);
});

app.get('/api/user-profile', (req, res) => {
    res.json(userProfile);
});

app.get('/api/departments', (req, res) => {
    res.json(departments);
});

// Đăng ký học phần (in-memory)
let registrations = [
  // { studentId: 'SV001', courseId: 'MH001' }
];

// Thêm sinh viên
app.post('/api/students', (req, res) => {
  const s = req.body;
  if (!s || !s.id || !s.name || !s.email) {
    return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
  }
  if (students.find(x => x.id === s.id)) {
    return res.status(409).json({ message: 'Mã sinh viên đã tồn tại' });
  }
  students.push(s);
  res.status(201).json(s);
});

// Cập nhật hồ sơ người dùng
app.put('/api/user-profile', (req, res) => {
  const { name, email, dob, avatar } = req.body || {};
  userProfile = { ...userProfile, ...(name && { name }), ...(email && { email }), ...(dob && { dob }), ...(avatar && { avatar }) };
  res.json(userProfile);
});

// Đăng ký học phần
app.post('/api/registrations', (req, res) => {
  const { studentId, courseId } = req.body || {};
  if (!studentId || !courseId) return res.status(400).json({ message: 'Thiếu studentId hoặc courseId' });
  if (!students.find(s => s.id === studentId)) return res.status(404).json({ message: 'Sinh viên không tồn tại' });
  if (!courses.find(c => c.id === courseId)) return res.status(404).json({ message: 'Môn học không tồn tại' });
  if (registrations.find(r => r.studentId === studentId && r.courseId === courseId)) {
    return res.status(409).json({ message: 'Đã đăng ký môn này' });
  }
  registrations.push({ studentId, courseId });
  res.status(201).json({ studentId, courseId });
});

// Xem đăng ký theo sinh viên
app.get('/api/registrations', (req, res) => {
  const { studentId } = req.query;
  const list = registrations.filter(r => !studentId || r.studentId === studentId);
  res.json(list);
});

// Tín chỉ đã đăng ký của sinh viên
app.get('/api/students/:id/credits', (req, res) => {
  const { id } = req.params;
  const regs = registrations.filter(r => r.studentId === id);
  const total = regs.reduce((sum, r) => {
    const c = courses.find(x => x.id === r.courseId);
    return sum + (c ? c.credits : 0);
  }, 0);
  res.json({ studentId: id, credits: total });
});

// Điểm của sinh viên
app.get('/api/students/:id/grades', (req, res) => {
  const { id } = req.params;
  const list = grades.filter(g => g.studentId === id);
  res.json(list);
});

app.listen(port, () => {
  console.log(`Server đang lắng nghe tại http://localhost:${port}`);
});

