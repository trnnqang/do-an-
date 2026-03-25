// Student Management System JavaScript

// Sample data
let students = []; // Dữ liệu sinh viên sẽ được tải từ backend

let courses = [];
let grades = [];
let classes = [];
let userProfile = {};
let departments = [];

// DOM Elements

// Data Persistence
function saveData() {
        localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('courses', JSON.stringify(courses));
    localStorage.setItem('classes', JSON.stringify(classes));
    localStorage.setItem('grades', JSON.stringify(grades));
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    localStorage.setItem('departments', JSON.stringify(departments));
}

function loadData() {
    const savedStudents = localStorage.getItem('students');
    const savedCourses = localStorage.getItem('courses');
    const savedClasses = localStorage.getItem('classes');
    const savedGrades = localStorage.getItem('grades');
    const savedProfile = localStorage.getItem('userProfile');
    const savedDepartments = localStorage.getItem('departments');

    if (savedStudents) students = JSON.parse(savedStudents);
    if (savedCourses) courses = JSON.parse(savedCourses);
    if (savedClasses) classes = JSON.parse(savedClasses);
    if (savedGrades) grades = JSON.parse(savedGrades);
    if (savedProfile) userProfile = JSON.parse(savedProfile);
    if (savedDepartments) departments = JSON.parse(savedDepartments);
}
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const pageTitle = document.getElementById('page-title');
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        // Remove active class from all links and sections
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        // Add active class to clicked link
        link.classList.add('active');

        // Show corresponding section
        const sectionId = link.getAttribute('data-section') + '-section';
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
            pageTitle.textContent = link.textContent.trim();
        }
    });
});

// Mobile menu toggle
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Initialize dashboard
function initDashboard() {
    updateStats();
    loadRecentActivities();
    initChart();
}

// Update statistics
function updateStats() {
    document.getElementById('total-students').textContent = students.length;
    document.getElementById('total-courses').textContent = courses.length;
    document.getElementById('total-classes').textContent = classes.length;

    const activeStudents = students.filter(s => s.status === 'active').length;
    const avgGrade = 8.5; // Mock data
    document.getElementById('avg-grade').textContent = avgGrade.toFixed(1);
}

// Load recent activities
function loadRecentActivities() {
    const activities = [
        'Sinh viên Nguyễn Văn An đã đăng ký môn Lập trình Web',
        'Thêm môn học mới: Cơ sở dữ liệu nâng cao',
        'Cập nhật điểm cho lớp CNTT01',
        'Sinh viên Trần Thị Bình đã hoàn thành khóa học',
        'Tạo báo cáo thống kê tháng 11'
    ];

    const list = document.getElementById('recent-activities-list');
    list.innerHTML = activities.map(activity => `<li>${activity}</li>`).join('');
}

// Initialize chart
function initChart() {
    const ctx = document.getElementById('departmentChart');
    if (ctx) {
        const departmentData = departments.map(dept => {
            return students.filter(s => s.department === dept).length;
        });

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: departments,
                datasets: [{
                    data: departmentData,
                    backgroundColor: [
                        '#667eea',
                        '#f093fb',
                        '#4facfe',
                        '#43e97b'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Student Management
function initStudentManagement() {
    loadStudents();
    setupStudentFilters();
    setupStudentModal();
}

// Load students into table
function loadStudents(filteredStudents = students) {
    const tbody = document.getElementById('students-tbody');
    if (!tbody) return;

    if (filteredStudents.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-state">Không tìm thấy sinh viên nào.</td></tr>`;
        return;
    }

    tbody.innerHTML = filteredStudents.map(student => `
        <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.department}</td>
            <td>${student.class}</td>
            <td>
                <span class="status-badge ${student.status === 'active' ? 'status-active' : 'status-inactive'}">
                    ${student.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewStudent('${student.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="editStudent('${student.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteStudent('${student.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Setup student filters
function setupStudentFilters() {
    const departmentFilter = document.getElementById('department-filter');
    const classFilter = document.getElementById('class-filter');
    const searchInput = document.getElementById('student-search');

    if (departmentFilter) {
        departmentFilter.innerHTML = '<option value="">Tất cả khoa</option>' +
            departments.map(dept => `<option value="${dept}">${dept}</option>`).join('');
    }

    if (classFilter) {
        classFilter.innerHTML = '<option value="">Tất cả lớp</option>' +
            classes.map(cls => `<option value="${cls.id}">${cls.name}</option>`).join('');
    }

    // Filter functionality
    function filterStudents() {
        let filtered = students;

        const deptValue = departmentFilter?.value;
        const classValue = classFilter?.value;
        const searchValue = searchInput?.value.toLowerCase();

        if (deptValue) {
            filtered = filtered.filter(s => s.department === deptValue);
        }

        if (classValue) {
            filtered = filtered.filter(s => s.class === classValue);
        }

        if (searchValue) {
            filtered = filtered.filter(s =>
                s.name.toLowerCase().includes(searchValue) ||
                s.id.toLowerCase().includes(searchValue) ||
                s.email.toLowerCase().includes(searchValue)
            );
        }

        loadStudents(filtered);
    }

    departmentFilter?.addEventListener('change', filterStudents);
    classFilter?.addEventListener('change', filterStudents);
    searchInput?.addEventListener('input', filterStudents);
}

// Setup student modal
function setupStudentModal() {
    const modal = document.getElementById('student-modal');
    const addBtn = document.getElementById('add-student-btn');
    const closeBtn = modal?.querySelector('.close');

// Student actions: export CSV and print
function setupStudentActions() {
    const exportBtn = document.getElementById('export-students-btn');
    const printBtn = document.getElementById('print-students-btn');
    const seedBtn = document.getElementById('seed-students-btn');
    exportBtn?.addEventListener('click', exportStudentsCSV);
    printBtn?.addEventListener('click', printStudentsList);
    seedBtn?.addEventListener('click', seedSampleStudents);
}

function getStudentsFromTable() {
    const rows = Array.from(document.querySelectorAll('#students-tbody tr'));
    return rows.map(tr => {
        const tds = tr.querySelectorAll('td');
        return {
            id: tds[0]?.textContent.trim() || '',
            name: tds[1]?.textContent.trim() || '',
            email: tds[2]?.textContent.trim() || '',
            department: tds[3]?.textContent.trim() || '',
            class: tds[4]?.textContent.trim() || '',
            status: tds[5]?.innerText.trim() || ''
        };
    });
}

function exportStudentsCSV() {
    const data = getStudentsFromTable();
    if (data.length === 0) {
        showNotification('Không có dữ liệu để xuất.', 'error');
        return;
    }
    const headers = ['MSSV','Họ và Tên','Email','Khoa','Lớp','Trạng Thái'];
    const rows = data.map(s => [s.id, s.name, s.email, s.department, s.class, s.status].map(v => '"' + String(v).replace(/"/g,'""') + '"').join(','));
    const csv = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `danh_sach_sinh_vien_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Xuất CSV thành công!', 'success');
}

function printStudentsList() {
    const table = document.querySelector('#students-table');
    if (!table) return;
    const win = window.open('', '_blank');
    const styles = `
        <style>
            body { font-family: Segoe UI, Tahoma, sans-serif; padding: 20px; }
            h2 { text-align:center; margin-bottom: 16px; }
            table { width:100%; border-collapse: collapse; }
            th, td { border:1px solid #ddd; padding:8px; text-align:left; font-size:12px; }
            th { background:#f8f9fa; }
        </style>`;
    win.document.write(`<!doctype html><html><head><meta charset='utf-8'>${styles}</head><body>`);
    win.document.write('<h2>Danh sách sinh viên</h2>');
    // Clone table without the last action column
    const clone = table.cloneNode(true);
    Array.from(clone.querySelectorAll('thead th:last-child, tbody td:last-child')).forEach(el => el.remove());
    win.document.write(clone.outerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.focus();
    win.print();
    win.close();

async function seedSampleStudents() {
    const samples = [
        { id: 'SV004', name: 'Phạm Nhật Minh', email: 'minh.pham@edu.vn', department: 'Công nghệ thông tin', class: 'CNTT01', status: 'active', phone: '0901234567', address: 'Hải Phòng', birthDate: '2001-06-12' },
        { id: 'SV005', name: 'Đỗ Thị Lan', email: 'lan.do@edu.vn', department: 'Kinh tế', class: 'KT01', status: 'active', phone: '0912345678', address: 'Hà Nội', birthDate: '2002-02-20' },
        { id: 'SV006', name: 'Lý Gia Bảo', email: 'bao.ly@edu.vn', department: 'Công nghệ thông tin', class: 'CNTT02', status: 'inactive', phone: '0923456789', address: 'Đà Nẵng', birthDate: '2000-09-30' },
        { id: 'SV007', name: 'Trương Thu Trang', email: 'trang.truong@edu.vn', department: 'Ngoại ngữ', class: 'NN01', status: 'active', phone: '0934567890', address: 'TP.HCM', birthDate: '2001-11-05' },
        { id: 'SV008', name: 'Vũ Hữu Tín', email: 'tin.vu@edu.vn', department: 'Quản trị kinh doanh', class: 'QTKD01', status: 'active', phone: '0945678901', address: 'Cần Thơ', birthDate: '2002-04-18' }
    ];

    // Ensure classes exist locally for filters/selects
    const ensureClass = (id, name, dept) => { if (!classes.find(c => c.id === id)) classes.push({ id, name, department: dept }); };
    ensureClass('NN01','Ngoại ngữ 01','Ngoại ngữ');
    ensureClass('QTKD01','Quản trị kinh doanh 01','Quản trị kinh doanh');

    let added = 0;
    for (const s of samples) {
        if (students.find(x => x.id === s.id)) continue;
        const ok = await addStudent(s);
        if (ok) added++;
    }
    if (added > 0) {
        loadStudents();
        updateStats();
        populateRegisterStudentSelect();
        saveData();
        showNotification(`Đã thêm ${added} sinh viên mẫu.`, 'success');
    } else {
        showNotification('Không có sinh viên nào được thêm (có thể đã tồn tại).', 'error');
    }
}

async function seedIfFewStudents(min = 5) {
    if (students.length >= min) return;
    const extras = [
        { id: 'SV009', name: 'Ngô Bảo Châu', email: 'chau.ngo@edu.vn', department: 'Công nghệ thông tin', class: 'CNTT01', status: 'active' },
        { id: 'SV010', name: 'Bùi Thị Hằng', email: 'hang.bui@edu.vn', department: 'Kinh tế', class: 'KT01', status: 'active' },
        { id: 'SV011', name: 'Trần Quốc Khánh', email: 'khanh.tran@edu.vn', department: 'Ngoại ngữ', class: 'NN01', status: 'active' }
    ];
    let added = 0;
    for (const s of extras) {
        if (students.length >= min) break;
        if (students.find(x => x.id === s.id)) continue;
        const ok = await addStudent(s);
        if (ok) added++;
    }
    if (added>0) {
        loadStudents();
        updateStats();
        populateRegisterStudentSelect();
        saveData();
    }
}


}


    addBtn?.addEventListener('click', () => {
        openStudentModal();
    });

    closeBtn?.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// Open student modal
function openStudentModal(studentId = null) {
    const modal = document.getElementById('student-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('student-form');

    if (!modal || !form) return;

    const isEdit = studentId !== null;
    modalTitle.textContent = isEdit ? 'Chỉnh sửa sinh viên' : 'Thêm sinh viên mới';

    // Create form HTML
    form.innerHTML = `
        <div class="form-group">
            <label for="student-id">Mã sinh viên:</label>
            <input type="text" id="student-id" name="id" required ${isEdit ? 'readonly' : ''}>
        </div>
        <div class="form-group">
            <label for="student-name">Họ và tên:</label>
            <input type="text" id="student-name" name="name" required>
        </div>
        <div class="form-group">
            <label for="student-email">Email:</label>
            <input type="email" id="student-email" name="email" required>
        </div>
        <div class="form-group">
            <label for="student-phone">Số điện thoại:</label>
            <input type="tel" id="student-phone" name="phone">
        </div>
        <div class="form-group">
            <label for="student-department">Khoa:</label>
            <select id="student-department" name="department" required>
                <option value="">Chọn khoa</option>
                ${departments.map(dept => `<option value="${dept}">${dept}</option>`).join('')}
            </select>
        </div>
        <div class="form-group">
            <label for="student-class">Lớp:</label>
            <select id="student-class" name="class" required>
                <option value="">Chọn lớp</option>
                ${classes.map(cls => `<option value="${cls.id}">${cls.name}</option>`).join('')}
            </select>
        </div>
        <div class="form-group">
            <label for="student-birthdate">Ngày sinh:</label>
            <input type="date" id="student-birthdate" name="birthDate">
        </div>
        <div class="form-group">
            <label for="student-address">Địa chỉ:</label>
            <textarea id="student-address" name="address" rows="3"></textarea>
        </div>
        <div class="form-group">
            <label for="student-status">Trạng thái:</label>
            <select id="student-status" name="status" required>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
            </select>
        </div>
        <div style="text-align: right; margin-top: 20px;">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('student-modal').classList.remove('active')">Hủy</button>
            <button type="submit" class="btn btn-primary">${isEdit ? 'Cập nhật' : 'Thêm mới'}</button>
        </div>
    `;

    // Fill form if editing
    if (isEdit) {
        const student = students.find(s => s.id === studentId);
        if (student) {
            Object.keys(student).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input) input.value = student[key];
            });
        }
    }

    // Handle form submission
    form.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const studentData = Object.fromEntries(formData);

        let success = false;
        if (isEdit) {
            updateStudent(studentId, studentData);
            success = true; // Assume update always succeeds
        } else {
            success = await addStudent(studentData);
        }

        if (success) {
            modal.classList.remove('active');
            loadStudents();
            updateStats();
            populateRegisterStudentSelect();
        }
    };

    modal.classList.add('active');
}

// Student CRUD operations
async function addStudent(studentData) {
    try {
        const res = await fetch('http://localhost:3000/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            showNotification(data.message || 'Không thể thêm sinh viên', 'error');
            return false;
        }
        const created = await res.json();
        students.push(created);
        saveData();
        showNotification('Thêm sinh viên thành công!', 'success');
        return true;
    } catch (e) {
        showNotification('Lỗi kết nối máy chủ khi thêm sinh viên', 'error');
        return false;
    }
}

function updateStudent(id, studentData) {
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
        students[index] = { ...students[index], ...studentData };
        saveData();
        showNotification('Cập nhật sinh viên thành công!', 'success');
    }
}

function deleteStudent(id) {
    showConfirmation('Bạn có chắc chắn muốn xóa sinh viên này?', () => {
        students = students.filter(s => s.id !== id);
        saveData();
        loadStudents();
        updateStats();
        showNotification('Xóa sinh viên thành công!', 'success');
    });
}

function viewStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;

    const modal = document.getElementById('student-view-modal');
    const contentDiv = document.getElementById('student-details-content');

    const statusText = student.status === 'active' ? 'Hoạt động' : 'Không hoạt động';
    const birthDate = student.birthDate ? new Date(student.birthDate).toLocaleDateString('vi-VN') : 'Chưa cập nhật';

    contentDiv.innerHTML = `
        <p><strong>MSSV:</strong> ${student.id}</p>
        <p><strong>Họ và Tên:</strong> ${student.name}</p>
        <p><strong>Email:</strong> ${student.email}</p>
        <p><strong>Ngày Sinh:</strong> ${birthDate}</p>
        <p><strong>Số điện thoại:</strong> ${student.phone || 'Chưa cập nhật'}</p>
        <p><strong>Địa chỉ:</strong> ${student.address || 'Chưa cập nhật'}</p>
        <p><strong>Khoa:</strong> ${student.department}</p>
        <p><strong>Lớp:</strong> ${student.class}</p>
        <p><strong>Trạng thái:</strong> ${statusText}</p>
    `;

    modal.classList.add('active');
}

function setupStudentViewModal() {
    const modal = document.getElementById('student-view-modal');
    const closeBtn = modal?.querySelector('.close');

    closeBtn?.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

function editStudent(id) {
    openStudentModal(id);
}

// Show notification
function showNotification(message, type = 'success') {
    const toast = document.getElementById('notification-toast');
    const messageP = document.getElementById('notification-message');
    if (!toast || !messageP) return;

    messageP.textContent = message;
    toast.className = 'toast show';
    if (type === 'error') {
        toast.classList.add('error');
    } else {
        toast.classList.add('success');
    }

    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

// Show confirmation modal
function showConfirmation(message, onConfirm) {
    const modal = document.getElementById('confirmation-modal');
    const messageP = document.getElementById('confirmation-message');
    const yesBtn = document.getElementById('confirm-yes-btn');
    const noBtn = document.getElementById('confirm-no-btn');

    if (!modal || !messageP || !yesBtn || !noBtn) return;

    messageP.textContent = message;
    modal.classList.add('active');

    // Use .cloneNode to remove previous event listeners
    const newYesBtn = yesBtn.cloneNode(true);
    yesBtn.parentNode.replaceChild(newYesBtn, yesBtn);

    const newNoBtn = noBtn.cloneNode(true);
    noBtn.parentNode.replaceChild(newNoBtn, noBtn);

    newYesBtn.onclick = () => {
        modal.classList.remove('active');
        onConfirm();
    };

    newNoBtn.onclick = () => {
        modal.classList.remove('active');
    };
}

// Course Management
function initCourseManagement() {
    loadCourses();
    setupCourseModal();
    setupCourseSearch();
    populateRegisterStudentSelect();
    setupCourseActions();
}

function loadCourses(filteredCourses = courses) {
    const tbody = document.getElementById('courses-tbody');
    if (!tbody) return;

    if (filteredCourses.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="empty-state">Không tìm thấy môn học nào.</td></tr>`;
        return;
    }

    tbody.innerHTML = filteredCourses.map(course => `
        <tr>
            <td>${course.id}</td>
            <td>${course.name}</td>
            <td>${course.credits}</td>
            <td>${course.department}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="registerSelectedStudent('${course.id}')" title="Đăng ký học phần"><i class="fas fa-plus-circle"></i></button>
                    <button class="action-btn edit" onclick="editCourse('${course.id}')"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" onclick="deleteCourse('${course.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function setupCourseSearch() {
    const searchInput = document.getElementById('course-search');
    searchInput?.addEventListener('input', () => {
        const searchValue = searchInput.value.toLowerCase();
        const filtered = courses.filter(c =>
            c.name.toLowerCase().includes(searchValue) ||
            c.id.toLowerCase().includes(searchValue)
        );
        loadCourses(filtered);
    });
}

function setupCourseModal() {
    const modal = document.getElementById('course-modal');

// Registration and course-related helpers
function populateRegisterStudentSelect() {
    const sel = document.getElementById('register-student-select');
    if (!sel) return;
    sel.innerHTML = '<option value="">-- Chọn sinh viên để đăng ký --</option>' +
        students.map(s => `<option value="${s.id}">${s.name} - ${s.id}</option>`).join('');
}

function setupCourseActions() {
    const creditsBtn = document.getElementById('view-credits-btn');
    const gradesBtn = document.getElementById('view-grades-btn');
    creditsBtn?.addEventListener('click', async () => {
        const studentId = document.getElementById('register-student-select')?.value;
        if (!studentId) return showNotification('Vui lòng chọn sinh viên.', 'error');
        try {
            const res = await fetch(`http://localhost:3000/api/students/${studentId}/credits`);
            const data = await res.json();
            openInfoModal('Tín chỉ đã đăng ký', `<p><strong>MSSV:</strong> ${studentId}</p><p><strong>Tổng tín chỉ:</strong> ${data.credits}</p>`);
        } catch(e) {
            showNotification('Không lấy được dữ liệu tín chỉ.', 'error');
        }
    });
    gradesBtn?.addEventListener('click', async () => {
        const studentId = document.getElementById('register-student-select')?.value;
        if (!studentId) return showNotification('Vui lòng chọn sinh viên.', 'error');
        try {
            const res = await fetch(`http://localhost:3000/api/students/${studentId}/grades`);
            const list = await res.json();
            if (!list.length) return openInfoModal('Điểm của sinh viên', '<p>Chưa có điểm.</p>');
            const rows = list.map(g => {
                const course = courses.find(c => c.id === g.courseId);
                const total = calculateTotalScore(g.attendance, g.midterm, g.final);
                return `<tr><td>${g.courseId}</td><td>${course?.name || ''}</td><td>${total}</td></tr>`;
            }).join('');
            openInfoModal('Điểm của sinh viên', `
                <table class="data-table"><thead><tr><th>Môn</th><th>Tên</th><th>Điểm tổng kết</th></tr></thead>
                <tbody>${rows}</tbody></table>`);
        } catch(e) {
            showNotification('Không lấy được dữ liệu điểm.', 'error');
        }
    });
}

async function registerSelectedStudent(courseId) {
    const studentId = document.getElementById('register-student-select')?.value;
    if (!studentId) return showNotification('Vui lòng chọn sinh viên trước khi đăng ký.', 'error');
    try {
        const res = await fetch('http://localhost:3000/api/registrations', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId, courseId })
        });
        const data = await res.json().catch(()=>({}));
        if (!res.ok) return showNotification(data.message || 'Đăng ký thất bại', 'error');
        showNotification('Đăng ký học phần thành công!', 'success');
    } catch(e) {
        showNotification('Lỗi kết nối máy chủ khi đăng ký.', 'error');
    }
}

// Info modal helpers
function setupInfoModal() {
    const modal = document.getElementById('info-modal');
    const closeBtn = modal?.querySelector('.close');
    closeBtn?.addEventListener('click', ()=> modal.classList.remove('active'));
    window.addEventListener('click', (e)=> { if (e.target === modal) modal.classList.remove('active'); });
}

function openInfoModal(title, html) {
    const modal = document.getElementById('info-modal');
    document.getElementById('info-modal-title').textContent = title;
    document.getElementById('info-modal-body').innerHTML = html;
    modal.classList.add('active');
}

    const addBtn = document.getElementById('add-course-btn');
    const closeBtn = modal?.querySelector('.close');

    addBtn?.addEventListener('click', () => openCourseModal());

    closeBtn?.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

function openCourseModal(courseId = null) {
    const modal = document.getElementById('course-modal');
    const modalTitle = document.getElementById('course-modal-title');
    const form = document.getElementById('course-form');
    if (!modal || !form) return;

    const isEdit = courseId !== null;
    modalTitle.textContent = isEdit ? 'Chỉnh sửa Môn học' : 'Thêm Môn học mới';

    form.innerHTML = `
        <div class="form-group">
            <label for="course-id">Mã Môn học:</label>
            <input type="text" id="course-id" name="id" required ${isEdit ? 'readonly' : ''}>
        </div>
        <div class="form-group">
            <label for="course-name">Tên Môn học:</label>
            <input type="text" id="course-name" name="name" required>
        </div>
        <div class="form-group">
            <label for="course-credits">Số tín chỉ:</label>
            <input type="number" id="course-credits" name="credits" required min="1">
        </div>
        <div class="form-group">
            <label for="course-department">Khoa:</label>
            <select id="course-department" name="department" required>
                <option value="">Chọn khoa</option>
                ${departments.map(dept => `<option value="${dept}">${dept}</option>`).join('')}
            </select>
        </div>
        <div style="text-align: right; margin-top: 20px;">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('course-modal').classList.remove('active')">Hủy</button>
            <button type="submit" class="btn btn-primary">${isEdit ? 'Cập nhật' : 'Thêm mới'}</button>
        </div>
    `;

    if (isEdit) {
        const course = courses.find(c => c.id === courseId);
        if (course) {
            form.querySelector('#course-id').value = course.id;
            form.querySelector('#course-name').value = course.name;
            form.querySelector('#course-credits').value = course.credits;
            form.querySelector('#course-department').value = course.department;
        }
    }

    form.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const courseData = {
            id: formData.get('id'),
            name: formData.get('name'),
            credits: parseInt(formData.get('credits')),
            department: formData.get('department'),
        };

        let success = false;
        if (isEdit) {
            updateCourse(courseId, courseData);
            success = true;
        } else {
            success = addCourse(courseData);
        }

        if (success) {
            modal.classList.remove('active');
            loadCourses();
            updateStats();
        }
    };

    modal.classList.add('active');
}

function addCourse(courseData) {
    // Check for unique ID
    if (courses.some(c => c.id === courseData.id)) {
        showNotification('Lỗi: Mã môn học đã tồn tại!', 'error');
        return false;
    }
    courses.push(courseData);
    saveData();
    showNotification('Thêm môn học thành công!', 'success');
    return true;
}

function updateCourse(id, courseData) {
    const index = courses.findIndex(c => c.id === id);
    if (index !== -1) {
        courses[index] = courseData;
        saveData();
        showNotification('Cập nhật môn học thành công!', 'success');
    }
}

function deleteCourse(id) {
    showConfirmation('Bạn có chắc chắn muốn xóa môn học này?', () => {
        courses = courses.filter(c => c.id !== id);
        saveData();
        loadCourses();
        updateStats();
        showNotification('Xóa môn học thành công!', 'success');
    });
}

function editCourse(id) {
    openCourseModal(id);
}


// Class Management
function initClassManagement() {
    loadClasses();
    setupClassModal();
    setupClassSearch();
}

function loadClasses(filteredClasses = classes) {
    const tbody = document.getElementById('classes-tbody');
    if (!tbody) return;

    if (filteredClasses.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="empty-state">Không tìm thấy lớp học nào.</td></tr>`;
        return;
    }

    tbody.innerHTML = filteredClasses.map(cls => `
        <tr>
            <td>${cls.id}</td>
            <td>${cls.name}</td>
            <td>${cls.department}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editClass('${cls.id}')"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" onclick="deleteClass('${cls.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function setupClassSearch() {
    const searchInput = document.getElementById('class-search');
    searchInput?.addEventListener('input', () => {
        const searchValue = searchInput.value.toLowerCase();
        const filtered = classes.filter(c =>
            c.name.toLowerCase().includes(searchValue) ||
            c.id.toLowerCase().includes(searchValue)
        );
        loadClasses(filtered);
    });
}

function setupClassModal() {
    const modal = document.getElementById('class-modal');
    const addBtn = document.getElementById('add-class-btn');
    const closeBtn = modal?.querySelector('.close');

    addBtn?.addEventListener('click', () => openClassModal());

    closeBtn?.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

function openClassModal(classId = null) {
    const modal = document.getElementById('class-modal');
    const modalTitle = document.getElementById('class-modal-title');
    const form = document.getElementById('class-form');
    if (!modal || !form) return;

    const isEdit = classId !== null;
    modalTitle.textContent = isEdit ? 'Chỉnh sửa Lớp học' : 'Thêm Lớp học mới';

    form.innerHTML = `
        <div class="form-group">
            <label for="class-id">Mã Lớp học:</label>
            <input type="text" id="class-id" name="id" required ${isEdit ? 'readonly' : ''}>
        </div>
        <div class="form-group">
            <label for="class-name">Tên Lớp học:</label>
            <input type="text" id="class-name" name="name" required>
        </div>
        <div class="form-group">
            <label for="class-department">Khoa:</label>
            <select id="class-department" name="department" required>
                <option value="">Chọn khoa</option>
                ${departments.map(dept => `<option value="${dept}">${dept}</option>`).join('')}
            </select>
        </div>
        <div style="text-align: right; margin-top: 20px;">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('class-modal').classList.remove('active')">Hủy</button>
            <button type="submit" class="btn btn-primary">${isEdit ? 'Cập nhật' : 'Thêm mới'}</button>
        </div>
    `;

    if (isEdit) {
        const cls = classes.find(c => c.id === classId);
        if (cls) {
            form.querySelector('#class-id').value = cls.id;
            form.querySelector('#class-name').value = cls.name;
            form.querySelector('#class-department').value = cls.department;
        }
    }

    form.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const classData = Object.fromEntries(formData.entries());

        let success = false;
        if (isEdit) {
            updateClass(classId, classData);
            success = true;
        } else {
            success = addClass(classData);
        }

        if (success) {
            modal.classList.remove('active');
            loadClasses();
            updateStats();
        }
    };

    modal.classList.add('active');
}

function addClass(classData) {
    if (classes.some(c => c.id === classData.id)) {
        showNotification('Lỗi: Mã lớp học đã tồn tại!', 'error');
        return false;
    }
    classes.push(classData);
    saveData();
    showNotification('Thêm lớp học thành công!', 'success');
    return true;
}

function updateClass(id, classData) {
    const index = classes.findIndex(c => c.id === id);
    if (index !== -1) {
        classes[index] = classData;
        saveData();
        showNotification('Cập nhật lớp học thành công!', 'success');
    }
}

function deleteClass(id) {
    showConfirmation('Bạn có chắc chắn muốn xóa lớp học này?', () => {
        classes = classes.filter(c => c.id !== id);
        saveData();
        loadClasses();
        updateStats();
        showNotification('Xóa lớp học thành công!', 'success');
    });
}

// Grade Management
function initGradeManagement() {
    setupGradeFilters();
    const loadBtn = document.getElementById('load-grades-btn');
    loadBtn?.addEventListener('click', loadGradesForTable);

    const saveBtn = document.getElementById('save-grades-btn');
    saveBtn?.addEventListener('click', saveGrades);
}

function setupGradeFilters() {
    const classFilter = document.getElementById('grade-class-filter');
    const courseFilter = document.getElementById('grade-course-filter');

    if (classFilter) {
        classFilter.innerHTML = '<option value="">Chọn lớp học</option>' +
            classes.map(cls => `<option value="${cls.id}">${cls.name}</option>`).join('');
    }

    if (courseFilter) {
        courseFilter.innerHTML = '<option value="">Chọn môn học</option>' +
            courses.map(course => `<option value="${course.id}">${course.name}</option>`).join('');
    }
}

function loadGradesForTable() {
    const classId = document.getElementById('grade-class-filter').value;
    const courseId = document.getElementById('grade-course-filter').value;
    const tableContainer = document.getElementById('grades-table-container');
    const tbody = document.getElementById('grades-tbody');

    if (!classId || !courseId) {
        showNotification('Vui lòng chọn lớp và môn học!', 'error');
        return;
    }

    const studentsInClass = students.filter(s => s.class === classId);
    if (studentsInClass.length === 0) {
        showNotification('Không có sinh viên nào trong lớp này.', 'info');
        tableContainer.style.display = 'none';
        return;
    }

    const className = classes.find(c => c.id === classId).name;
    const courseName = courses.find(c => c.id === courseId).name;
    document.getElementById('grades-table-title').textContent = `Bảng điểm lớp ${className} - Môn ${courseName}`;

    tbody.innerHTML = studentsInClass.map(student => {
        const grade = grades.find(g => g.studentId === student.id && g.courseId === courseId) || {};
        const totalScore = calculateTotalScore(grade.attendance, grade.midterm, grade.final);

        return `
            <tr data-student-id="${student.id}">
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td><input type="number" class="grade-input" name="attendance" value="${grade.attendance || ''}" min="0" max="10"></td>
                <td><input type="number" class="grade-input" name="midterm" value="${grade.midterm || ''}" min="0" max="10"></td>
                <td><input type="number" class="grade-input" name="final" value="${grade.final || ''}" min="0" max="10"></td>
                <td class="total-score">${totalScore}</td>
            </tr>
        `;
    }).join('');

    tableContainer.style.display = 'block';

    // Add event listeners to update total score and validate on input change
    document.querySelectorAll('.grade-input').forEach(input => {
        input.addEventListener('input', (e) => {
            const inputEl = e.target;
            const value = parseFloat(inputEl.value);

            // Validate input
            if (inputEl.value !== '' && (isNaN(value) || value < 0 || value > 10)) {
                inputEl.classList.add('invalid');
            } else {
                inputEl.classList.remove('invalid');
            }

            // Recalculate total
            const row = inputEl.closest('tr');
            const attendance = row.querySelector('[name="attendance"]').value;
            const midterm = row.querySelector('[name="midterm"]').value;
            const final = row.querySelector('[name="final"]').value;
            row.querySelector('.total-score').textContent = calculateTotalScore(attendance, midterm, final);
        });
    });
}

function calculateTotalScore(attendance, midterm, final) {
    const weights = { attendance: 0.1, midterm: 0.3, final: 0.6 }; // Example weights
    if (attendance === undefined || midterm === undefined || final === undefined) return 'N/A';

    const total = (parseFloat(attendance) * weights.attendance) +
                  (parseFloat(midterm) * weights.midterm) +
                  (parseFloat(final) * weights.final);

    return isNaN(total) ? 'N/A' : total.toFixed(2);
}

function saveGrades() {
    const invalidInputs = document.querySelectorAll('.grade-input.invalid');
    if (invalidInputs.length > 0) {
        showNotification('Lỗi: Vui lòng sửa các điểm không hợp lệ (0-10) trước khi lưu.', 'error');
        return;
    }

    const courseId = document.getElementById('grade-course-filter').value;
    const rows = document.querySelectorAll('#grades-tbody tr');

    rows.forEach(row => {
        const studentId = row.dataset.studentId;
        const newGrade = {
            studentId,
            courseId,
            attendance: parseFloat(row.querySelector('[name="attendance"]').value) || 0,
            midterm: parseFloat(row.querySelector('[name="midterm"]').value) || 0,
            final: parseFloat(row.querySelector('[name="final"]').value) || 0,
        };

        const gradeIndex = grades.findIndex(g => g.studentId === studentId && g.courseId === courseId);

        if (gradeIndex !== -1) {
            grades[gradeIndex] = newGrade;
        } else {
            grades.push(newGrade);
        }
    });

    saveData();
    showNotification('Lưu điểm thành công!', 'success');
}



// Profile Settings
function initProfileSettings() {
    loadProfileData();

    const form = document.getElementById('profile-form');
    form?.addEventListener('submit', saveProfileInfo);

    const changeAvatarBtn = document.getElementById('change-avatar-btn');
    const avatarUpload = document.getElementById('avatar-upload');
    changeAvatarBtn?.addEventListener('click', () => avatarUpload.click());
    avatarUpload?.addEventListener('change', handleAvatarChange);
}

function loadProfileData() {
    // Load user info into form
    document.getElementById('profile-name').value = userProfile.name;
    document.getElementById('profile-email').value = userProfile.email;
    document.getElementById('profile-dob').value = userProfile.dob;

    // Load avatar
    document.getElementById('profile-avatar-preview').src = userProfile.avatar;
    document.querySelector('.user-avatar').src = userProfile.avatar;
    document.querySelector('.user-menu span').textContent = userProfile.name;
}

async function saveProfileInfo(e) {
    e.preventDefault();
    const payload = {
        name: document.getElementById('profile-name').value,
        email: document.getElementById('profile-email').value,
        dob: document.getElementById('profile-dob').value,
        avatar: userProfile.avatar
    };
    try {
        const res = await fetch('http://localhost:3000/api/user-profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        userProfile = await res.json();
        document.querySelector('.user-menu span').textContent = userProfile.name;
        document.getElementById('profile-avatar-preview').src = userProfile.avatar || document.getElementById('profile-avatar-preview').src;
        document.querySelector('.user-avatar').src = userProfile.avatar || document.querySelector('.user-avatar').src;
        saveData();
        showNotification('Cập nhật thông tin thành công!', 'success');
    } catch(err) {
        showNotification('Lỗi: Không thể cập nhật hồ sơ.', 'error');
    }


function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const newAvatarSrc = event.target.result;
            userProfile.avatar = newAvatarSrc;
            saveData();

            // Update avatar previews
            document.getElementById('profile-avatar-preview').src = newAvatarSrc;
            document.querySelector('.user-avatar').src = newAvatarSrc;
            showNotification('Cập nhật ảnh đại diện thành công!', 'success');
        }
        reader.readAsDataURL(file);
    }
}

function editClass(id) {
    openClassModal(id);
}


// Initialize the application

// Reports Section
function initReports() {
    populateStudentSelector();
    const generateBtn = document.getElementById('generate-transcript-btn');
    generateBtn?.addEventListener('click', generateTranscript);
}

function populateStudentSelector() {
    const selector = document.getElementById('transcript-student-select');
    if (!selector) return;

    selector.innerHTML = '<option value="">-- Chọn sinh viên --</option>';
    students.forEach(student => {
        selector.innerHTML += `<option value="${student.id}">${student.name} - ${student.id}</option>`;
    });
}

function generateTranscript() {
    const studentId = document.getElementById('transcript-student-select').value;
    const container = document.getElementById('transcript-container');
    if (!studentId) {
        showNotification('Vui lòng chọn một sinh viên.', 'error');
        container.style.display = 'none';
        return;
    }

    const student = students.find(s => s.id === studentId);
    const studentGrades = grades.filter(g => g.studentId === studentId);

    // Populate header
    const headerDiv = document.getElementById('transcript-header');
    headerDiv.innerHTML = `
        <h2>Bảng điểm Sinh viên</h2>
        <p><strong>Họ và Tên:</strong> ${student.name}</p>
        <p><strong>MSSV:</strong> ${student.id}</p>
        <p><strong>Lớp:</strong> ${student.class}</p>
    `;

    // Populate table
    const tbody = document.getElementById('transcript-tbody');
    let totalCredits = 0;
    let totalScore = 0;
    tbody.innerHTML = '';

    if (studentGrades.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="empty-state">Sinh viên này chưa có điểm.</td></tr>`;
    } else {
        studentGrades.forEach(grade => {
            const course = courses.find(c => c.id === grade.courseId);
            if (!course) return;

            const finalScore = parseFloat(calculateTotalScore(grade.attendance, grade.midterm, grade.final));
            if (!isNaN(finalScore)) {
                totalCredits += course.credits;
                totalScore += finalScore * course.credits;
            }

            tbody.innerHTML += `
                <tr>
                    <td>${course.id}</td>
                    <td>${course.name}</td>
                    <td>${course.credits}</td>
                    <td>${isNaN(finalScore) ? 'N/A' : finalScore.toFixed(2)}</td>
                </tr>
            `;
        });
    }

    // Calculate GPA and populate footer
    const footerDiv = document.getElementById('transcript-footer');
    const gpa = totalCredits > 0 ? (totalScore / totalCredits).toFixed(2) : 'N/A';
    footerDiv.innerHTML = `
        <h3>Điểm Trung bình Tích lũy (GPA): ${gpa}</h3>
        <button class="btn btn-secondary" onclick="printTranscript()">In Bảng điểm</button>
    `;

    container.style.display = 'block';
}

function printTranscript() {
    const container = document.getElementById('transcript-container');
    const originalContent = document.body.innerHTML;
    const printContent = container.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    // Re-initialize all event listeners as they were lost
    runInitializers();
}

// Helper to re-run all initializers after printing
function runInitializers() {
    loadData(); // Reload data to restore state
    initDashboard();
    initStudentManagement();
    setupStudentActions();
    setupStudentViewModal();
    initCourseManagement();
    initClassManagement();
    initGradeManagement();
    initProfileSettings();
    initReports();
}


let gradeDistributionChartInstance = null; // To hold the chart instance

function populateStatsSelectors() {
    const classSelector = document.getElementById('stats-class-select');
    const courseSelector = document.getElementById('stats-course-select');

    if (classSelector) {
        classSelector.innerHTML = '<option value="">-- Chọn lớp --</option>';
        classes.forEach(cls => {
            classSelector.innerHTML += `<option value="${cls.id}">${cls.name}</option>`;
        });
    }

    if (courseSelector) {
        courseSelector.innerHTML = '<option value="">-- Chọn môn học --</option>';
        courses.forEach(course => {
            courseSelector.innerHTML += `<option value="${course.id}">${course.name}</option>`;
        });
    }
}

function generateClassStatistics() {
    const classId = document.getElementById('stats-class-select').value;
    const courseId = document.getElementById('stats-course-select').value;
    const container = document.getElementById('stats-container');

    if (!classId || !courseId) {
        showNotification('Vui lòng chọn lớp và môn học để xem thống kê.', 'error');
        container.style.display = 'none';
        return;
    }

    const studentsInClass = students.filter(s => s.class === classId);
    const gradesForCourse = studentsInClass.map(student => {
        const grade = grades.find(g => g.studentId === student.id && g.courseId === courseId);
        if (grade) {
            return parseFloat(calculateTotalScore(grade.attendance, grade.midterm, grade.final));
        }
        return null;
    }).filter(score => score !== null && !isNaN(score));

    if (gradesForCourse.length === 0) {
        showNotification('Không có dữ liệu điểm cho lớp và môn học này.', 'info');
        container.style.display = 'none';
        return;
    }

    // Calculate stats
    const avgScore = (gradesForCourse.reduce((a, b) => a + b, 0) / gradesForCourse.length).toFixed(2);
    const maxScore = Math.max(...gradesForCourse).toFixed(2);
    const minScore = Math.min(...gradesForCourse).toFixed(2);

    // Populate header
    const className = classes.find(c => c.id === classId).name;
    const courseName = courses.find(c => c.id === courseId).name;
    const headerDiv = document.getElementById('stats-header');
    headerDiv.innerHTML = `
        <h3>Thống kê điểm lớp ${className} - Môn ${courseName}</h3>
        <p>Điểm Trung bình: <strong>${avgScore}</strong> | Điểm Cao nhất: <strong>${maxScore}</strong> | Điểm Thấp nhất: <strong>${minScore}</strong></p>
    `;

    // Prepare data for chart
    const gradeDistribution = { 'Yếu (0-4)': 0, 'Trung bình (4-5.5)': 0, 'Khá (5.5-7)': 0, 'Giỏi (7-8.5)': 0, 'Xuất sắc (8.5-10)': 0 };
    gradesForCourse.forEach(score => {
        if (score < 4) gradeDistribution['Yếu (0-4)']++;
        else if (score < 5.5) gradeDistribution['Trung bình (4-5.5)']++;
        else if (score < 7) gradeDistribution['Khá (5.5-7)']++;
        else if (score < 8.5) gradeDistribution['Giỏi (7-8.5)']++;
        else gradeDistribution['Xuất sắc (8.5-10)']++;
    });

    // Render chart
    const ctx = document.getElementById('gradeDistributionChart').getContext('2d');
    if (gradeDistributionChartInstance) {
        gradeDistributionChartInstance.destroy(); // Destroy old chart before creating new one
    }
    gradeDistributionChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(gradeDistribution),
            datasets: [{
                label: 'Số lượng sinh viên',
                data: Object.values(gradeDistribution),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 205, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(54, 162, 235, 0.6)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Phổ điểm'
                }
            }
        }
    });

    container.style.display = 'block';
}
async function main() {
    // 1. Tải dữ liệu từ localStorage trước để ứng dụng có thể hoạt động offline
    loadData();

    // 2. Cố gắng tải dữ liệu mới nhất từ backend
    try {
        const endpoints = [
            'students', 'courses', 'classes', 'grades', 'user-profile', 'departments'
        ];
        const requests = endpoints.map(endpoint => fetch(`http://localhost:3000/api/${endpoint}`));

        const responses = await Promise.all(requests);

        // Kiểm tra xem tất cả các yêu cầu có thành công không
        for (const response of responses) {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }

        const data = await Promise.all(responses.map(res => res.json()));

        // 3. Cập nhật dữ liệu trên frontend
        [students, courses, classes, grades, userProfile, departments] = data;

        // 4. Lưu dữ liệu mới nhất vào localStorage để làm bộ đệm
        saveData();

        console.log('Tải toàn bộ dữ liệu từ backend thành công!');

    } catch (error) {
        console.error('Không thể tải dữ liệu từ backend, sử dụng dữ liệu từ localStorage:', error);
        showNotification('Lỗi: Không thể kết nối đến máy chủ. Đang sử dụng dữ liệu offline.', 'error');
    }

    // 4.5 Tự động thêm nhanh nếu dữ liệu còn ít
    await seedIfFewStudents(8);

    // 5. Khởi tạo và hiển thị giao diện người dùng với dữ liệu đã có
    runInitializers();
}

document.addEventListener('DOMContentLoaded', main);
