// =========================================================================
// AUTH.JS - ĐĂNG NHẬP / ĐĂNG KÝ / ẨN DANH / QUÊN MẬT KHẨU
// =========================================================================

const API_URL = 'http://localhost:3001';

const $ = (id) => document.getElementById(id);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^0\d{9}$/;

function showAlert(title, text, icon = 'info') {
    if (typeof Swal !== 'undefined') {
        return Swal.fire({ title, text, icon, confirmButtonColor: '#003c71' });
    }

    alert(`${title}\n${text}`);
    return Promise.resolve();
}

function showLoading(title, text) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title,
            html: text,
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });
    }
}

async function fetchJson(url, options = {}) {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || 'Có lỗi xảy ra khi kết nối máy chủ.');
    }

    return data;
}

function getInputValue(id) {
    return $(id)?.value?.trim() || '';
}

function getPasswordValue(id) {
    return $(id)?.value || '';
}

function validateEmail(email) {
    return EMAIL_REGEX.test(email);
}

function validatePhone(phone) {
    return PHONE_REGEX.test(phone);
}

function validateEmailOrPhone(value) {
    return validateEmail(value) || validatePhone(value);
}

function getNextUserId(users) {
    if (!Array.isArray(users) || users.length === 0) return '1';

    const numericIds = users
        .map(user => Number(user.id))
        .filter(id => Number.isInteger(id) && id > 0);

    return numericIds.length ? String(Math.max(...numericIds) + 1) : String(users.length + 1);
}

function saveLoginUser(user, accessToken) {
    localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        accessToken: accessToken || ''
    }));

    localStorage.removeItem('guestMode');
}

function resetForgotPasswordForm() {
    ['forgot-account', 'forgot-new-password', 'forgot-confirm-password'].forEach(id => {
        if ($(id)) $(id).value = '';
    });
}

// =========================================================================
// ĐĂNG NHẬP ẨN DANH
// =========================================================================

window.continueAsGuest = function () {
    localStorage.removeItem('currentUser');
    localStorage.setItem('guestMode', 'true');
    window.location.href = 'main.html';
};

// =========================================================================
// POPUP QUÊN MẬT KHẨU
// =========================================================================

window.openForgotPasswordBox = function () {
    $('forgot-password-overlay')?.classList.add('show');
};

window.closeForgotPasswordBox = function () {
    $('forgot-password-overlay')?.classList.remove('show');
    resetForgotPasswordForm();
};

document.addEventListener('click', (event) => {
    const overlay = $('forgot-password-overlay');

    if (overlay && overlay.classList.contains('show') && event.target === overlay) {
        closeForgotPasswordBox();
    }
});

// =========================================================================
// ĐĂNG KÝ
// =========================================================================

async function handleRegister(event) {
    event.preventDefault();

    const username = getInputValue('register-name');
    const email = getInputValue('register-email');
    const phone = getInputValue('register-phone');
    const password = getPasswordValue('register-password');

    if (!username || !email || !phone || !password) {
        showAlert('Thiếu thông tin!', 'Vui lòng nhập đầy đủ họ tên, email, số điện thoại và mật khẩu.', 'warning');
        return;
    }

    if (!validateEmail(email)) {
        showAlert('Email không hợp lệ!', 'Vui lòng nhập đúng định dạng email. Ví dụ: user@gmail.com', 'warning');
        return;
    }

    if (!validatePhone(phone)) {
        showAlert('Số điện thoại không hợp lệ!', 'Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng số 0. Ví dụ: 0912345678', 'warning');
        return;
    }

    if (password.length < 6) {
        showAlert('Mật khẩu quá ngắn!', 'Mật khẩu phải có ít nhất 6 ký tự.', 'warning');
        return;
    }

    showLoading('Đang đăng ký...', 'Vui lòng đợi trong giây lát...');

    try {
        const existingUsers = await fetchJson(`${API_URL}/users`, { cache: 'no-store' });

        const isExist = existingUsers.some(user =>
            String(user.email || '').toLowerCase() === email.toLowerCase() ||
            String(user.phone || '') === phone
        );

        if (isExist) {
            showAlert('Đăng ký thất bại!', 'Email hoặc số điện thoại này đã được đăng ký.', 'error');
            return;
        }

        const newUserData = {
            id: getNextUserId(existingUsers),
            username,
            email,
            phone,
            password,
            role: 'user'
        };

        await fetchJson(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUserData)
        });

        Swal.fire({
            title: 'Đăng ký thành công!',
            text: 'Tài khoản đã được tạo. Bạn có thể đăng nhập ngay bây giờ.',
            icon: 'success',
            confirmButtonColor: '#003c71'
        }).then(() => {
            $('register-form')?.reset();

            if (typeof toggleForm === 'function') {
                toggleForm('login');
            }
        });

    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        showAlert('Lỗi kết nối!', 'Không thể kết nối đến json-server. Hãy kiểm tra lại server đang chạy ở cổng 3001.', 'error');
    }
}

// =========================================================================
// ĐĂNG NHẬP
// =========================================================================

async function getEmailFromLoginInput(loginInput) {
    if (!validatePhone(loginInput)) return loginInput;

    const users = await fetchJson(`${API_URL}/users?phone=${encodeURIComponent(loginInput)}`, {
        cache: 'no-store'
    });

    if (!Array.isArray(users) || users.length === 0) {
        throw new Error('Không tìm thấy tài khoản với số điện thoại này.');
    }

    return users[0].email;
}

async function handleLogin(event) {
    event.preventDefault();

    const loginInput = getInputValue('login-account');
    const loginPassword = getPasswordValue('login-password');

    if (!loginInput || !loginPassword) {
        showAlert('Thiếu thông tin!', 'Vui lòng nhập email hoặc số điện thoại và mật khẩu.', 'warning');
        return;
    }

    try {
        const loginEmail = await getEmailFromLoginInput(loginInput);

        const data = await fetchJson(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: loginEmail, password: loginPassword })
        });

        const matchedUser = data.user;

        if (!matchedUser) {
            throw new Error('Không tìm thấy thông tin người dùng.');
        }

        saveLoginUser(matchedUser, data.accessToken);

        const userRole = String(matchedUser.role || '').trim().toLowerCase();
        const adminRoles = ['admin', 'superadmin', 'sale', 'content'];
        const isAdmin = adminRoles.includes(userRole);

        Swal.fire({
            title: isAdmin ? 'Xác thực thành công!' : 'Đăng nhập thành công!',
            text: isAdmin ? 'Đang chuyển hướng vào hệ thống quản trị...' : 'Chào mừng bạn quay trở lại.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            window.location.href = isAdmin ? 'admin.html' : 'main.html';
        });

    } catch (error) {
        console.error('Lỗi đăng nhập:', error);

        Swal.fire({
            title: 'Đăng nhập thất bại!',
            text: error.message || 'Sai email/số điện thoại hoặc mật khẩu.',
            icon: 'error',
            confirmButtonColor: '#b82025',
            confirmButtonText: 'Kiểm tra lại'
        });
    }
}

// =========================================================================
// QUÊN MẬT KHẨU
// =========================================================================

async function handleForgotPassword() {
    const account = getInputValue('forgot-account');
    const newPassword = getPasswordValue('forgot-new-password');
    const confirmPassword = getPasswordValue('forgot-confirm-password');

    if (!account || !newPassword || !confirmPassword) {
        showAlert('Thiếu thông tin!', 'Vui lòng nhập đầy đủ Email/SĐT, mật khẩu mới và xác nhận mật khẩu.', 'warning');
        return;
    }

    if (!validateEmailOrPhone(account)) {
        showAlert('Thông tin tài khoản không hợp lệ!', 'Vui lòng nhập đúng Email hoặc Số điện thoại gồm 10 số và bắt đầu bằng 0.', 'warning');
        return;
    }

    if (newPassword.length < 6) {
        showAlert('Mật khẩu quá ngắn!', 'Mật khẩu mới phải có ít nhất 6 ký tự.', 'warning');
        return;
    }

    if (newPassword !== confirmPassword) {
        showAlert('Mật khẩu không khớp!', 'Mật khẩu mới và xác nhận mật khẩu mới phải giống nhau.', 'warning');
        return;
    }

    showLoading('Đang cập nhật mật khẩu...', 'Vui lòng đợi trong giây lát...');

    try {
        await fetchJson(`${API_URL}/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ account, newPassword })
        });

        Swal.fire({
            title: 'Cập nhật thành công!',
            text: 'Mật khẩu mới đã được lưu. Bạn có thể đăng nhập lại bằng mật khẩu mới.',
            icon: 'success',
            confirmButtonColor: '#1a4fa0'
        }).then(() => {
            closeForgotPasswordBox();
        });

    } catch (error) {
        console.error('Lỗi quên mật khẩu:', error);
        showAlert('Cập nhật thất bại!', error.message || 'Không thể đổi mật khẩu. Vui lòng kiểm tra lại server.', 'error');
    }
}

// =========================================================================
// KHỞI TẠO SỰ KIỆN
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    $('register-form')?.addEventListener('submit', handleRegister);
    $('login-form')?.addEventListener('submit', handleLogin);
    $('btn-reset-password')?.addEventListener('click', handleForgotPassword);
});