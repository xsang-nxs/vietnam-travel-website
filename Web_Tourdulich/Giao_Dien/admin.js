const API_URL = 'http://localhost:3001';

// Tinh doanh thu từ chuỗi định dạng tiền tệ, ví dụ "1.000.000 đ" -> 1000000
function parseMoneyToNumber(value) {
    if (typeof value === 'number') {
        return value;
    }

    if (!value) {
        return 0;
    }

    const onlyNumber = String(value).replace(/[^\d]/g, '');

    return onlyNumber ? Number(onlyNumber) : 0;
}

function formatVND(value) {
    return Number(value || 0).toLocaleString('vi-VN') + ' đ';
}

// =========================================================================
// 0. CẤU HÌNH PHÂN QUYỀN RBAC
// =========================================================================

const MENU_MAP = {
    users: 'menu-users',
    categories: 'menu-categories',
    tours: 'menu-tours',
    bookings: 'menu-bookings',
    'ticket-bookings': 'menu-ticket-bookings',
    blogs: 'menu-blogs',
    reviews: 'menu-reviews'
};

const ROLE_CONFIG = {
    superadmin: {
        label: 'Giám đốc hệ thống',
        defaultTab: 'users',
        allowedTabs: [
            'users',
            'categories',
            'tours',
            'bookings',
            'ticket-bookings',
            'blogs',
            'reviews',
            'order-detail'
        ]
    },

    admin: {
        label: 'Quản trị viên',
        defaultTab: 'users',
        allowedTabs: [
            'users',
            'categories',
            'tours',
            'bookings',
            'ticket-bookings',
            'blogs',
            'reviews',
            'order-detail'
        ]
    },

    sale: {
        label: 'Nhân viên Sale',
        defaultTab: 'tours',
        allowedTabs: [
            'tours',
            'bookings',
            'ticket-bookings',
            'order-detail'
        ]
    },

    content: {
        label: 'Biên tập viên Content',
        defaultTab: 'categories',
        allowedTabs: [
            'categories',
            'blogs',
            'reviews'
        ]
    }
};

function getCurrentAdminUser() {
    try {
        return JSON.parse(localStorage.getItem('currentUser'));
    } catch (error) {
        return null;
    }
}

function normalizeRole(role) {
    return String(role || '').trim().toLowerCase();
}

function getRoleConfig(role) {
    role = normalizeRole(role);
    return ROLE_CONFIG[role] || null;
}

function getAllowedTabsByRole(role) {
    const config = getRoleConfig(role);
    return config ? config.allowedTabs : [];
}

function getDefaultTabByRole(role) {
    const config = getRoleConfig(role);
    return config ? config.defaultTab : 'users';
}

function canAccessTab(tabName) {
    const currentUser = getCurrentAdminUser();

    if (!currentUser) {
        return false;
    }

    const role = normalizeRole(currentUser.role);
    const allowedTabs = getAllowedTabsByRole(role);

    return allowedTabs.includes(tabName);
}

function clearLegacyAdminTabStorage() {
    localStorage.removeItem('activeAdminTab');
}

function hideAllTabsAndMenus() {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
        tab.classList.remove('active');
    });

    document.querySelectorAll('.menu-item').forEach(btn => {
        btn.classList.remove('active');
    });
}

function setupAdminPermissions() {
    const currentUser = getCurrentAdminUser();

    if (!currentUser) {
        window.location.href = 'auth.html';
        return null;
    }

    const role = normalizeRole(currentUser.role);
    const config = getRoleConfig(role);

    if (role === 'user' || role === 'customer') {
        alert('Bạn là khách hàng, không có quyền truy cập trang quản trị!');
        window.location.href = 'main.html';
        return null;
    }

    if (!config) {
        alert('Tài khoản này chưa được phân quyền hợp lệ!');
        localStorage.removeItem('currentUser');
        window.location.href = 'auth.html';
        return null;
    }

    clearLegacyAdminTabStorage();

    const displayName = document.getElementById('admin-display-name');
    if (displayName) {
        displayName.innerText = currentUser.username || 'Nhân viên';
    }

    const badge = document.querySelector('.role-badge');
    if (badge) {
        badge.innerText = config.label;
    }

    Object.keys(MENU_MAP).forEach(tabName => {
        const menuElement = document.getElementById(MENU_MAP[tabName]);

        if (!menuElement) return;

        menuElement.classList.remove('active');

        if (config.allowedTabs.includes(tabName)) {
            menuElement.style.display = 'flex';
        } else {
            menuElement.style.display = 'none';
        }
    });

    return currentUser;
}

function switchTab(tabName, event) {
    const currentUser = getCurrentAdminUser();

    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }

    const role = normalizeRole(currentUser.role);
    const defaultTab = getDefaultTabByRole(role);

    if (!canAccessTab(tabName)) {
        tabName = defaultTab;
    }

    let targetTab = document.getElementById(`tab-${tabName}`);

    if (!targetTab) {
        tabName = defaultTab;
        targetTab = document.getElementById(`tab-${tabName}`);
    }

    hideAllTabsAndMenus();

    if (targetTab) {
        targetTab.style.display = 'block';
        targetTab.classList.add('active');
    }

    const activeMenuId = MENU_MAP[tabName];
    const activeMenu = activeMenuId ? document.getElementById(activeMenuId) : null;

    if (activeMenu && activeMenu.style.display !== 'none') {
        activeMenu.classList.add('active');
    }

    localStorage.setItem(`activeAdminTab_${role}`, tabName);

    if (tabName === 'users') loadUsers();
    if (tabName === 'categories') loadCategories();
    if (tabName === 'tours') loadTours();
    if (tabName === 'bookings') loadBookings();
    if (tabName === 'ticket-bookings') loadTicketBookings();
    if (tabName === 'blogs') loadBlogs();
    if (tabName === 'reviews') loadReviews();
}

function requireTabPermission(tabName) {
    if (canAccessTab(tabName)) {
        return true;
    }

    const currentUser = getCurrentAdminUser();
    const role = currentUser ? normalizeRole(currentUser.role) : '';
    const defaultTab = getDefaultTabByRole(role);

    Swal.fire(
        'Không có quyền!',
        'Tài khoản của bạn không được phép truy cập chức năng này.',
        'warning'
    );

    switchTab(defaultTab);
    return false;
}

function getRoleLabel(role) {
    role = normalizeRole(role);

    if (role === 'superadmin') return 'Super Admin';
    if (role === 'admin') return 'Admin';
    if (role === 'sale') return 'Sale';
    if (role === 'content') return 'Content';
    if (role === 'user' || role === 'customer') return 'Thành viên';

    return role || 'Chưa phân quyền';
}

function escapeHTML(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function populateRoleSelect() {
    const roleSelect = document.getElementById('form-role');

    if (!roleSelect) return;

    roleSelect.innerHTML = `
        <option value="user">Thành viên / Customer</option>
        <option value="admin">Admin</option>
        <option value="superadmin">Super Admin</option>
        <option value="sale">Nhân viên Sale</option>
        <option value="content">Nhân viên Content</option>
    `;
}

// =========================================================================
// 1. QUẢN LÝ USERS
// =========================================================================

async function loadUsers() {
    if (!requireTabPermission('users')) return;

    try {
        const response = await fetch(`${API_URL}/users`, { cache: 'no-store' });
        const users = await response.json();

        const tbody = document.getElementById('user-list-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        users.forEach(user => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${escapeHTML(user.id)}</td>
                <td><b>${escapeHTML(user.username || 'Chưa cập nhật')}</b></td>
                <td>${escapeHTML(user.email || 'Chưa cập nhật')}</td>
                <td>${escapeHTML(user.phone || 'Chưa cập nhật')}</td>
                <td>
                    <code style="background:#f1f5f9; padding:4px 8px; border-radius:4px; font-weight:bold; color:#718096; font-family:monospace;">
                        ••••••••
                    </code>
                </td>
                <td><span class="role-badge">${escapeHTML(getRoleLabel(user.role))}</span></td>
                <td style="text-align:center;">
                    <span class="action-link-edit" onclick="openEditUserModal('${user.id}')">Sửa</span>
                    <span class="action-link-delete" onclick="deleteUser('${user.id}')">Xóa</span>
                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error('Lỗi loadUsers:', error);
        Swal.fire('Lỗi!', 'Không thể tải danh sách người dùng.', 'error');
    }
}

function openAddUserModal() {
    if (!requireTabPermission('users')) return;

    populateRoleSelect();

    document.getElementById('modal-title').innerText = 'Thêm tài khoản mới';
    document.getElementById('user-form').reset();
    document.getElementById('form-user-id').value = '';

    const passwordInput = document.getElementById('form-password');
    if (passwordInput) {
        passwordInput.value = '';
        passwordInput.required = true;
        passwordInput.placeholder = 'Nhập mật khẩu cho tài khoản mới...';
    }

    document.getElementById('user-modal').style.display = 'flex';
}

async function openEditUserModal(id) {
    if (!requireTabPermission('users')) return;

    try {
        populateRoleSelect();

        const response = await fetch(`${API_URL}/users/${id}`);
        const user = await response.json();

        document.getElementById('modal-title').innerText = 'Cập nhật tài khoản';
        document.getElementById('form-user-id').value = user.id;
        document.getElementById('form-username').value = user.username || '';
        document.getElementById('form-email').value = user.email || '';
        document.getElementById('form-phone').value = user.phone || '';
        document.getElementById('form-role').value = normalizeRole(user.role || 'user');

        const passwordInput = document.getElementById('form-password');
        if (passwordInput) {
            passwordInput.value = '';
            passwordInput.required = false;
            passwordInput.placeholder = 'Để trống nếu không đổi mật khẩu';
        }

        document.getElementById('user-modal').style.display = 'flex';

    } catch (error) {
        console.error('Lỗi openEditUserModal:', error);
        Swal.fire('Lỗi!', 'Không thể tải thông tin tài khoản.', 'error');
    }
}

function closeUserModal() {
    document.getElementById('user-modal').style.display = 'none';
}

async function saveUser(event) {
    event.preventDefault();

    if (!requireTabPermission('users')) return;

    const userId = document.getElementById('form-user-id').value.trim();

    const username = document.getElementById('form-username').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const phone = document.getElementById('form-phone').value.trim();
    const password = document.getElementById('form-password').value.trim();
    const role = document.getElementById('form-role').value;

    if (!username || !email || !phone) {
        Swal.fire('Thiếu thông tin!', 'Vui lòng nhập họ tên, email và số điện thoại.', 'warning');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        Swal.fire('Email không hợp lệ!', 'Vui lòng nhập đúng định dạng email.', 'warning');
        return;
    }

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone)) {
        Swal.fire('Số điện thoại không hợp lệ!', 'Số điện thoại phải có 10 số và bắt đầu bằng số 0.', 'warning');
        return;
    }

    try {
        let response;

        if (!userId) {
            if (!password || password.length < 6) {
                Swal.fire('Mật khẩu không hợp lệ!', 'Mật khẩu phải có ít nhất 6 ký tự.', 'warning');
                return;
            }

            const newUser = {
                username,
                email,
                phone,
                password,
                role
            };

            response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

        } else {
            const updateData = {
                username,
                email,
                phone,
                role
            };

            response = await fetch(`${API_URL}/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });

            if (response.ok && password) {
                await Swal.fire(
                    'Lưu ý!',
                    'Thông tin tài khoản đã cập nhật. Nếu muốn đổi mật khẩu, bạn nên dùng API reset mật khẩu riêng để password được hash an toàn.',
                    'info'
                );
            }
        }

        if (response.ok) {
            closeUserModal();
            Swal.fire('Thành công!', 'Thông tin tài khoản đã được cập nhật.', 'success');
            await loadUsers();
        } else {
            const err = await response.json().catch(() => null);
            Swal.fire('Thất bại!', err?.message || 'Không thể lưu tài khoản.', 'error');
        }

    } catch (error) {
        console.error('Lỗi saveUser:', error);
        Swal.fire('Lỗi kết nối!', 'Không thể kết nối đến backend.', 'error');
    }
}

function deleteUser(id) {
    if (!requireTabPermission('users')) return;

    Swal.fire({
        title: 'Xác nhận xóa tài khoản?',
        text: `Tài khoản ID: ${id} sẽ bị xóa khỏi hệ thống.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b82025',
        cancelButtonColor: '#718096',
        confirmButtonText: 'Đồng ý xóa',
        cancelButtonText: 'Hủy bỏ'
    }).then(async result => {
        if (!result.isConfirmed) return;

        try {
            const response = await fetch(`${API_URL}/users/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                Swal.fire('Đã xóa!', 'Tài khoản đã được xóa.', 'success');
                await loadUsers();
            } else {
                Swal.fire('Thất bại!', 'Không thể xóa tài khoản.', 'error');
            }

        } catch (error) {
            console.error('Lỗi deleteUser:', error);
            Swal.fire('Lỗi kết nối!', 'Không thể kết nối đến backend.', 'error');
        }
    });
}

// =========================================================================
// 2. QUẢN LÝ DANH MỤC
// =========================================================================

async function loadCategories() {
    if (!requireTabPermission('categories')) return;

    try {
        const response = await fetch(`${API_URL}/categories`, { cache: 'no-store' });
        const categories = await response.json();

        const tbody = document.getElementById('category-list-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        categories.forEach(cat => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${escapeHTML(cat.id)}</td>
                <td><b>${escapeHTML(cat.name || 'Chưa cập nhật')}</b></td>
                <td>${escapeHTML(cat.description || 'Đang cập nhật...')}</td>
                <td style="text-align:center;">
                    <span class="action-link-edit" onclick="openEditCategoryModal('${cat.id}')">Sửa</span>
                    <span class="action-link-delete" onclick="deleteCategory('${cat.id}')">Xóa</span>
                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error('Lỗi loadCategories:', error);
        Swal.fire('Lỗi!', 'Không thể tải danh mục.', 'error');
    }
}

function openCategoryModal() {
    if (!requireTabPermission('categories')) return;

    document.getElementById('category-modal-title').innerText = 'Thêm danh mục mới';
    document.getElementById('category-form').reset();
    document.getElementById('form-category-id').value = '';
    document.getElementById('category-modal').style.display = 'flex';
}

async function openEditCategoryModal(id) {
    if (!requireTabPermission('categories')) return;

    try {
        const response = await fetch(`${API_URL}/categories/${id}`);
        const cat = await response.json();

        document.getElementById('category-modal-title').innerText = 'Cập nhật danh mục';
        document.getElementById('form-category-id').value = cat.id;
        document.getElementById('form-category-name').value = cat.name || '';
        document.getElementById('form-category-desc').value = cat.description || '';
        document.getElementById('category-modal').style.display = 'flex';

    } catch (error) {
        console.error('Lỗi openEditCategoryModal:', error);
        Swal.fire('Lỗi!', 'Không thể tải thông tin danh mục.', 'error');
    }
}

function closeCategoryModal() {
    document.getElementById('category-modal').style.display = 'none';
}

async function saveCategory(event) {
    event.preventDefault();

    if (!requireTabPermission('categories')) return;

    const catId = document.getElementById('form-category-id').value.trim();

    const catData = {
        name: document.getElementById('form-category-name').value.trim(),
        description: document.getElementById('form-category-desc').value.trim()
    };

    if (!catData.name) {
        Swal.fire('Thiếu thông tin!', 'Vui lòng nhập tên danh mục.', 'warning');
        return;
    }

    try {
        let response;

        if (!catId) {
            response = await fetch(`${API_URL}/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(catData)
            });
        } else {
            response = await fetch(`${API_URL}/categories/${catId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(catData)
            });
        }

        if (response.ok) {
            closeCategoryModal();
            Swal.fire('Thành công!', 'Cập nhật danh mục thành công.', 'success');
            await loadCategories();
        } else {
            Swal.fire('Thất bại!', 'Không thể lưu danh mục.', 'error');
        }

    } catch (error) {
        console.error('Lỗi saveCategory:', error);
        Swal.fire('Lỗi kết nối!', 'Không thể kết nối đến backend.', 'error');
    }
}

function deleteCategory(id) {
    if (!requireTabPermission('categories')) return;

    Swal.fire({
        title: 'Xác nhận xóa danh mục?',
        text: 'Danh mục này sẽ bị xóa khỏi hệ thống.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b82025',
        cancelButtonColor: '#718096',
        confirmButtonText: 'Đồng ý xóa',
        cancelButtonText: 'Hủy bỏ'
    }).then(async result => {
        if (!result.isConfirmed) return;

        try {
            const response = await fetch(`${API_URL}/categories/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                Swal.fire('Đã xóa!', 'Danh mục đã được xóa.', 'success');
                await loadCategories();
            } else {
                Swal.fire('Thất bại!', 'Không thể xóa danh mục.', 'error');
            }

        } catch (error) {
            console.error('Lỗi deleteCategory:', error);
            Swal.fire('Lỗi kết nối!', 'Không thể kết nối đến backend.', 'error');
        }
    });
}

// =========================================================================
// 3. QUẢN LÝ TOUR
// =========================================================================

async function loadTours() {
    if (!requireTabPermission('tours')) return;

    try {
        const response = await fetch(`${API_URL}/tours`, { cache: 'no-store' });
        const tours = await response.json();

        const tbody = document.getElementById('tour-list-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        tours.forEach(tour => {
            let statusHtml = '<span style="color:#a0aec0; font-weight:bold;">Tạm ngưng</span>';

            if (tour.status === 'active') {
                statusHtml = '<span style="color:#38a169; font-weight:bold;">Còn chỗ</span>';
            } else if (tour.status === 'sold_out') {
                statusHtml = '<span style="color:#e53e3e; font-weight:bold;">Hết chỗ</span>';
            }

            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${escapeHTML(tour.id)}</td>
                <td><b>${escapeHTML(tour.title || tour.name || 'Chưa cập nhật')}</b></td>
                <td>${Number(tour.price || 0).toLocaleString('vi-VN')} đ</td>
                <td>${statusHtml}</td>
                <td style="text-align:center;">
                    <span class="action-link-edit" onclick="openEditTourModal('${tour.id}')">Sửa</span>
                    <span class="action-link-delete" onclick="deleteTour('${tour.id}')">Xóa</span>
                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error('Lỗi loadTours:', error);
        Swal.fire('Lỗi!', 'Không thể tải danh sách tour.', 'error');
    }
}

function openTourModal() {
    if (!requireTabPermission('tours')) return;

    document.getElementById('tour-modal-title').innerText = 'Thêm Tour mới';
    document.getElementById('tour-form').reset();
    document.getElementById('form-tour-id').value = '';
    document.getElementById('tour-modal').style.display = 'flex';
}

async function openEditTourModal(id) {
    if (!requireTabPermission('tours')) return;

    try {
        const response = await fetch(`${API_URL}/tours/${id}`);
        const tour = await response.json();

        document.getElementById('tour-modal-title').innerText = 'Cập nhật Tour';
        document.getElementById('form-tour-id').value = tour.id;
        document.getElementById('form-tour-title').value = tour.title || tour.name || '';
        document.getElementById('form-tour-price').value = tour.price || 0;
        document.getElementById('form-tour-status').value = tour.status || 'active';
        document.getElementById('tour-modal').style.display = 'flex';

    } catch (error) {
        console.error('Lỗi openEditTourModal:', error);
        Swal.fire('Lỗi!', 'Không thể tải thông tin tour.', 'error');
    }
}

function closeTourModal() {
    document.getElementById('tour-modal').style.display = 'none';
}

async function saveTour(event) {
    event.preventDefault();

    if (!requireTabPermission('tours')) return;

    const tourId = document.getElementById('form-tour-id').value.trim();

    const tourData = {
        title: document.getElementById('form-tour-title').value.trim(),
        price: Number(document.getElementById('form-tour-price').value),
        status: document.getElementById('form-tour-status').value
    };

    if (!tourData.title || !tourData.price) {
        Swal.fire('Thiếu thông tin!', 'Vui lòng nhập tên tour và giá tour.', 'warning');
        return;
    }

    try {
        let response;

        if (!tourId) {
            response = await fetch(`${API_URL}/tours`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tourData)
            });
        } else {
            response = await fetch(`${API_URL}/tours/${tourId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tourData)
            });
        }

        if (response.ok) {
            closeTourModal();
            Swal.fire('Thành công!', 'Cập nhật tour thành công.', 'success');
            await loadTours();
        } else {
            Swal.fire('Thất bại!', 'Không thể lưu tour.', 'error');
        }

    } catch (error) {
        console.error('Lỗi saveTour:', error);
        Swal.fire('Lỗi kết nối!', 'Không thể kết nối đến backend.', 'error');
    }
}

function deleteTour(id) {
    if (!requireTabPermission('tours')) return;

    Swal.fire({
        title: 'Xác nhận xóa Tour?',
        text: 'Tour này sẽ bị xóa khỏi hệ thống.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b82025',
        cancelButtonColor: '#718096',
        confirmButtonText: 'Đồng ý xóa',
        cancelButtonText: 'Hủy bỏ'
    }).then(async result => {
        if (!result.isConfirmed) return;

        try {
            const response = await fetch(`${API_URL}/tours/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                Swal.fire('Đã xóa!', 'Tour đã được xóa.', 'success');
                await loadTours();
            } else {
                Swal.fire('Thất bại!', 'Không thể xóa tour.', 'error');
            }

        } catch (error) {
            console.error('Lỗi deleteTour:', error);
            Swal.fire('Lỗi kết nối!', 'Không thể kết nối đến backend.', 'error');
        }
    });
}

// =========================================================================
// 4. QUẢN LÝ ĐƠN HÀNG TOUR
// =========================================================================

async function loadBookings() {
    if (!requireTabPermission('bookings')) return;

    try {
        const response = await fetch(`${API_URL}/bookings`, { cache: 'no-store' });
        const bookings = await response.json();

        // Tính tổng doanh thu tất cả đơn hàng
        const totalBookingRevenue = bookings.reduce((sum, booking) => {
            const amount =
                booking.totalAmount ??
                booking.totalPrice ??
                booking.total ??
                booking.price ??
                0;

            return sum + parseMoneyToNumber(amount);
        }, 0);

        // Hiển thị tổng số đơn và tổng doanh thu
        const bookingCountEl = document.getElementById('booking-total-count');
        const bookingRevenueEl = document.getElementById('booking-total-revenue');

        if (bookingCountEl) {
            bookingCountEl.innerText = bookings.length;
        }

        if (bookingRevenueEl) {
            bookingRevenueEl.innerText = formatVND(totalBookingRevenue);
        }

        const tbody = document.getElementById('booking-list-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        bookings.reverse().forEach((booking, index) => {
            let statusHtml = '<span style="color:#d69e2e; font-weight:bold; background:#fff9db; padding:4px 8px; border-radius:4px;">Chờ xác nhận</span>';

            if (booking.status === 'confirmed' || booking.status === 'Đã xác nhận') {
                statusHtml = '<span style="color:#38a169; font-weight:bold; background:#e6fffa; padding:4px 8px; border-radius:4px;">Đã xác nhận</span>';
            } else if (booking.status === 'cancelled' || booking.status === 'Đã hủy') {
                statusHtml = '<span style="color:#e53e3e; font-weight:bold; background:#fff5f5; padding:4px 8px; border-radius:4px;">Đã hủy</span>';
            }

            let displayPrice = booking.totalAmount || booking.totalPrice || '0 đ';
            if (typeof displayPrice === 'number') {
                displayPrice = displayPrice.toLocaleString('vi-VN') + ' đ';
            }

            const tourName = booking.tourTitle || booking.tourName || 'Không xác định';

            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td><b style="color:#1a4fa0;">${escapeHTML(booking.id)}</b></td>
                <td>
                    <b>${escapeHTML(booking.customerName || 'Khách ẩn danh')}</b><br>
                    <small style="color:#718096;">${escapeHTML(booking.customerEmail || '')}</small>
                </td>
                <td>${escapeHTML(booking.customerPhone || booking.phone || 'Chưa cập nhật')}</td>
                <td>${escapeHTML(booking.createdAt || booking.bookingDate || 'Chưa cập nhật')}</td>
                <td>
                    <span style="display:block; max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${escapeHTML(tourName)}">
                        ${escapeHTML(tourName)}
                    </span>
                </td>
                <td style="color:#b82025; font-weight:bold;">${escapeHTML(displayPrice)}</td>
                <td>${statusHtml}</td>
                <td style="text-align:center;">
                    <button class="btn-primary" onclick="showOrderDetail('${booking.id}')" style="background:transparent; border:1px solid #718096; color:#4a5568; padding:6px 12px; font-weight:bold; border-radius:6px; cursor:pointer;">
                        <i>👁</i> Xem
                    </button>
                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error('Lỗi loadBookings:', error);
        Swal.fire('Lỗi!', 'Không thể tải danh sách đơn hàng.', 'error');
    }
}

async function showOrderDetail(id) {
    if (!requireTabPermission('order-detail')) return;

    try {
        const response = await fetch(`${API_URL}/bookings/${id}`);
        const booking = await response.json();

        renderOrderDetailPage(booking);
        switchTab('order-detail');

    } catch (error) {
        console.error('Lỗi showOrderDetail:', error);
        Swal.fire('Lỗi!', 'Không thể tải chi tiết đơn hàng.', 'error');
    }
}

function renderOrderDetailPage(orderData) {
    if (!orderData) return;

    let displayPrice = orderData.totalAmount || orderData.totalPrice || '0 đ';
    if (typeof displayPrice === 'number') {
        displayPrice = displayPrice.toLocaleString('vi-VN') + ' đ';
    }

    let mappedStatus = 'pending';
    if (orderData.status === 'confirmed' || orderData.status === 'Đã xác nhận') mappedStatus = 'confirmed';
    if (orderData.status === 'cancelled' || orderData.status === 'Đã hủy') mappedStatus = 'cancelled';

    document.getElementById('detail-order-id').innerText = orderData.id || '...';
    document.getElementById('detail-order-date').innerText = 'Ngày đặt: ' + (orderData.createdAt || orderData.bookingDate || 'Chưa cập nhật');

    document.getElementById('detail-order-status').value = mappedStatus;
    document.getElementById('detail-order-status').onchange = () => updateBookingStatus(orderData.id);

    document.getElementById('detail-payment-method').innerText = orderData.paymentMethod || 'Thanh toán Online';
    document.getElementById('detail-total-amount').innerText = displayPrice;
    document.getElementById('detail-order-notes').innerText = orderData.notes || 'Không có ghi chú';

    document.getElementById('customer-info-name').innerText = orderData.customerName || 'Chưa cập nhật';
    document.getElementById('customer-info-phone').innerText = orderData.customerPhone || orderData.phone || 'Chưa cập nhật';
    document.getElementById('customer-info-email').innerText = orderData.customerEmail || orderData.email || 'Chưa cập nhật';
    document.getElementById('customer-info-address').innerText = orderData.customerAddress || orderData.address || 'Chưa cập nhật';

    const tourContainer = document.getElementById('ordered-tour-container');
    if (tourContainer) {
        tourContainer.innerHTML = `
            <div class="product-item" style="display:flex; gap:15px; align-items:center; border:1px solid #edf2f7; padding:15px; border-radius:8px;">
                <div class="product-img"><i style="font-size:30px; color:#edf2f7;">🗺️</i></div>
                <div class="product-detail" style="flex:1;">
                    <b style="color:#2d3748;">${escapeHTML(orderData.tourTitle || orderData.tourName || 'Hành trình tour')}</b><br>
                    <span style="font-size:13px; color:#4a5568;">Tổng giá trị: ${escapeHTML(displayPrice)}</span>
                </div>
                <div class="product-summary" style="text-align:right; width:120px;">
                    <b style="color:#b82025">${escapeHTML(displayPrice)}</b>
                </div>
            </div>
        `;
    }

    if (document.getElementById('order-subtotal')) document.getElementById('order-subtotal').innerText = displayPrice;
    if (document.getElementById('order-shipping-fee')) document.getElementById('order-shipping-fee').innerText = '0 đ';
    if (document.getElementById('order-grand-total')) document.getElementById('order-grand-total').innerText = displayPrice;

    if (document.getElementById('detail-shipping-service')) document.getElementById('detail-shipping-service').innerText = 'Giao E-Ticket Điện tử';
    if (document.getElementById('detail-delivery-est')) document.getElementById('detail-delivery-est').innerText = 'Gửi qua Email khi duyệt';

    renderOrderTimeline(orderData.id, mappedStatus);

    const cancelBtn = document.getElementById('btn-cancel-booking-from-detail');
    if (cancelBtn) {
        cancelBtn.style.display = mappedStatus !== 'cancelled' ? 'inline-block' : 'none';
        cancelBtn.onclick = () => deleteBookingFromDetail(orderData.id);
    }
}

async function updateBookingStatus(id) {
    if (!requireTabPermission('bookings')) return;

    const newStatusEng = document.getElementById('detail-order-status').value;
    const isCancelled = newStatusEng === 'cancelled';

    let statusVN = 'Chờ xác nhận';
    if (newStatusEng === 'confirmed') statusVN = 'Đã xác nhận';
    if (newStatusEng === 'cancelled') statusVN = 'Đã hủy';

    Swal.fire({
        title: isCancelled ? 'Hủy đơn hàng?' : 'Xác nhận duyệt?',
        text: `Bạn muốn chuyển đơn hàng ID: ${id} sang trạng thái "${statusVN}"?`,
        icon: isCancelled ? 'warning' : 'question',
        showCancelButton: true,
        confirmButtonColor: isCancelled ? '#e53e3e' : '#2b6cb0',
        cancelButtonColor: '#718096',
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ'
    }).then(async result => {
        if (!result.isConfirmed) {
            showOrderDetail(id);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/bookings/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: statusVN })
            });

            if (response.ok) {
                Swal.fire('Thành công!', 'Đã cập nhật trạng thái đơn hàng.', 'success');
                showOrderDetail(id);
            } else {
                Swal.fire('Lỗi!', 'Cập nhật thất bại.', 'error');
            }

        } catch (error) {
            console.error('Lỗi updateBookingStatus:', error);
            Swal.fire('Lỗi kết nối!', 'Không thể kết nối đến backend.', 'error');
        }
    });
}

function deleteBookingFromDetail(id) {
    if (!requireTabPermission('bookings')) return;

    Swal.fire({
        title: 'Cảnh báo!',
        text: `Bạn có chắc muốn xóa vĩnh viễn đơn hàng ID: ${id} không?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e53e3e',
        cancelButtonColor: '#718096',
        confirmButtonText: 'Có, xóa luôn!',
        cancelButtonText: 'Đóng'
    }).then(async result => {
        if (!result.isConfirmed) return;

        try {
            const response = await fetch(`${API_URL}/bookings/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                Swal.fire('Đã xóa!', 'Đơn hàng đã được xóa khỏi hệ thống.', 'success');
                switchTab('bookings');
            } else {
                Swal.fire('Thất bại!', 'Không thể xóa đơn hàng.', 'error');
            }

        } catch (error) {
            console.error('Lỗi deleteBookingFromDetail:', error);
            Swal.fire('Lỗi kết nối!', 'Không thể kết nối đến backend.', 'error');
        }
    });
}

// =========================================================================
// 5. QUẢN LÝ VÉ THAM QUAN
// =========================================================================

async function loadTicketBookings() {
    if (!requireTabPermission('ticket-bookings')) return;

    try {
        const response = await fetch(`${API_URL}/ticket_bookings`, { cache: 'no-store' });
        const ticketBookings = await response.json();

        // Tính tổng doanh thu tất cả đơn vé tham quan
        const totalTicketRevenue = ticketBookings.reduce((sum, booking) => {
            const amount =
                booking.totalAmount ??
                booking.totalPrice ??
                booking.total ??
                booking.price ??
                0;
            return sum + parseMoneyToNumber(amount);
        }, 0);

        // Hiển thị tổng số đơn vé và tổng doanh thu vé
        const ticketCountEl = document.getElementById('ticket-total-count');
        const ticketRevenueEl = document.getElementById('ticket-total-revenue');

        if (ticketCountEl) {
            ticketCountEl.innerText = ticketBookings.length;
        }
        if (ticketRevenueEl) {
            ticketRevenueEl.innerText = formatVND(totalTicketRevenue);
        }
        const tbody = document.getElementById('ticket-booking-list-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (!ticketBookings.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align:center; color:#a0aec0; padding:25px;">
                        Hệ thống chưa ghi nhận đơn đặt vé tham quan nào.
                    </td>
                </tr>
            `;
            return;
        }
        ticketBookings.reverse().forEach((booking, index) => {
            let statusClass = 'pill-pending';
            if (booking.status === 'Đã xác nhận') statusClass = 'pill-confirmed';
            if (booking.status === 'Đã hủy') statusClass = 'pill-cancelled';

            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td><b style="color:#b82025;">${escapeHTML(booking.id)}</b></td>
                <td>
                    <b>${escapeHTML(booking.customerName || 'Khách ẩn danh')}</b><br>
                    <small style="color:#718096;">${escapeHTML(booking.customerEmail || '')}</small>
                </td>
                <td>${escapeHTML(booking.customerPhone || 'Chưa cập nhật')}</td>
                <td>${escapeHTML(booking.createdAt || 'Chưa cập nhật')}</td>
                <td>
                    <span style="display:block; max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500;" title="${escapeHTML(booking.ticketDetails || '')}">
                        ${escapeHTML(booking.ticketDetails || 'Không xác định')}
                    </span>
                </td>
                <td style="color:#b82025; font-weight:bold;">${escapeHTML(booking.totalAmount || 'Liên hệ')}</td>
                <td><span class="status-pill ${statusClass}">${escapeHTML(booking.status || 'Chờ xác nhận')}</span></td>
                <td style="text-align:center;">
                    <button class="btn-primary" onclick="viewTicketDetails('${booking.id}')" style="background:transparent; border:1px solid #718096; color:#4a5568; padding:6px 12px; font-weight:bold; border-radius:6px; cursor:pointer;">
                        <i>👁</i> Xem
                    </button>
                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error('Lỗi loadTicketBookings:', error);
        Swal.fire('Lỗi!', 'Không thể tải danh sách vé tham quan.', 'error');
    }
}

async function viewTicketDetails(ticketId) {
    if (!requireTabPermission('ticket-bookings')) return;

    try {
        const response = await fetch(`${API_URL}/ticket_bookings/${ticketId}`);
        if (!response.ok) throw new Error('Không tìm thấy dữ liệu vé');

        const ticket = await response.json();

        let statusHtml = `<span style="background:#fff9db; color:#d69e2e; padding:4px 10px; border-radius:12px; font-weight:bold; font-size:13px;">${escapeHTML(ticket.status || 'Chờ xác nhận')}</span>`;

        if (ticket.status === 'Đã xác nhận' || ticket.status === 'confirmed') {
            statusHtml = `<span style="background:#e6fffa; color:#38a169; padding:4px 10px; border-radius:12px; font-weight:bold; font-size:13px;">Đã xác nhận</span>`;
        }

        if (ticket.status === 'Đã hủy' || ticket.status === 'cancelled') {
            statusHtml = `<span style="background:#fff5f5; color:#e53e3e; padding:4px 10px; border-radius:12px; font-weight:bold; font-size:13px;">Đã hủy</span>`;
        }

        const paymentMethod = ticket.paymentMethod || ticket.payment || 'Thanh toán trực tuyến VNPay / Chuyển khoản';

        Swal.fire({
            title: '<h3 style="color:#003c71; font-weight:bold; margin:0; font-size:22px;">CHI TIẾT VÉ THAM QUAN</h3>',
            html: `
                <div style="text-align:left; font-size:14.5px; line-height:1.8; color:#2d3748; margin-top:15px; padding:15px; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0;">
                    <p><b>Mã số vé:</b> <span style="color:#b82025; font-weight:bold;">${escapeHTML(ticket.id)}</span></p>
                    <p><b>Khách hàng:</b> ${escapeHTML(ticket.customerName || ticket.name || 'Đang cập nhật')}</p>
                    <p><b>Số điện thoại:</b> ${escapeHTML(ticket.customerPhone || ticket.phone || 'Đang cập nhật')}</p>
                    <p><b>Email liên hệ:</b> ${escapeHTML(ticket.customerEmail || ticket.email || 'Đang cập nhật')}</p>
                    <p><b>Ngày đặt:</b> ${escapeHTML(ticket.createdAt || ticket.bookingDate || 'Chưa ghi nhận')}</p>

                    <hr style="border:0; border-top:1px dashed #cbd5e0; margin:15px 0;">

                    <p><b>Thông tin chi tiết vé:</b></p>
                    <p style="color:#1a4fa0; font-weight:bold; font-size:16px;">${escapeHTML(ticket.ticketDetails || ticket.details || 'Vé dịch vụ tham quan')}</p>

                    <hr style="border:0; border-top:1px dashed #cbd5e0; margin:15px 0;">

                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-weight:600;">Tổng thanh toán:</span>
                        <span style="color:#b82025; font-weight:900; font-size:18px;">
                            ${escapeHTML(ticket.totalAmount || (ticket.totalPrice ? ticket.totalPrice.toLocaleString('vi-VN') + ' đ' : 'Liên hệ'))}
                        </span>
                    </div>

                    <div style="background:#fff; padding:10px; border-radius:6px; margin-top:15px; border:1px solid #edf2f7;">
                        <p style="font-size:13px;"><b>Phương thức thanh toán:</b><br>💳 ${escapeHTML(paymentMethod)}</p>
                        <p style="font-size:13px;"><b>Trạng thái đơn:</b><br>${statusHtml}</p>
                    </div>
                </div>
            `,
            icon: 'info',
            iconColor: '#1a4fa0',
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: 'Đóng cửa sổ',
            denyButtonText: '✔️ Duyệt vé',
            cancelButtonText: '❌ Hủy vé',
            confirmButtonColor: '#718096',
            denyButtonColor: '#38a169',
            cancelButtonColor: '#e53e3e',
            width: '500px'
        }).then(result => {
            if (result.isDenied) {
                updateTicketStatus(ticketId, 'Đã xác nhận');
            } else if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
                updateTicketStatus(ticketId, 'Đã hủy');
            }
        });

    } catch (error) {
        console.error('Lỗi viewTicketDetails:', error);
        Swal.fire('Lỗi truy xuất', 'Không thể lấy thông tin vé này.', 'error');
    }
}

async function updateTicketStatus(id, newStatus) {
    if (!requireTabPermission('ticket-bookings')) return;

    Swal.fire({
        title: 'Xác nhận thao tác?',
        text: `Bạn có chắc muốn chuyển trạng thái đơn vé ${id} sang "${newStatus}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: newStatus === 'Đã xác nhận' ? '#003c71' : '#e53e3e',
        cancelButtonColor: '#718096',
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ'
    }).then(async result => {
        if (!result.isConfirmed) return;

        try {
            const response = await fetch(`${API_URL}/ticket_bookings/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                Swal.fire('Thành công!', `Đơn vé đã được chuyển thành: ${newStatus}`, 'success');
                await loadTicketBookings();
            } else {
                Swal.fire('Lỗi!', 'Không thể cập nhật trạng thái vé.', 'error');
            }

        } catch (error) {
            console.error('Lỗi updateTicketStatus:', error);
            Swal.fire('Lỗi kết nối!', 'Không thể kết nối đến backend.', 'error');
        }
    });
}

// =========================================================================
// 6. TIMELINE ĐƠN HÀNG
// =========================================================================

function renderOrderTimeline(id, currentStatus) {
    const timelineContainer = document.getElementById('order-status-timeline');
    if (!timelineContainer) return;

    timelineContainer.innerHTML = '';

    const timelineSteps = [
        { status: 'placed', title: 'Đã đặt hàng', description: 'Hệ thống đã nhận yêu cầu.' },
        { status: 'pending', title: 'Chờ xác nhận', description: 'Yêu cầu đang được kiểm duyệt.' },
        { status: 'confirmed', title: 'Đã xác nhận', description: 'Đơn hàng đã được duyệt thành công.' }
    ];

    let reachedCurrent = false;

    timelineSteps.forEach(step => {
        if (step.status === currentStatus) reachedCurrent = true;

        const isActive = step.status === 'placed' || step.status === currentStatus || reachedCurrent;

        let iconHtml = '⚪';
        if (step.status === 'placed') iconHtml = '✔️';
        if (step.status === 'pending') iconHtml = '⏳';
        if (step.status === 'confirmed') iconHtml = '✅';

        const timelineItem = document.createElement('div');

        timelineItem.innerHTML = `
            <div class="timeline-point" style="display:grid; grid-template-columns:30px auto; gap:10px; position:relative;">
                <div class="timeline-icon" style="font-size:16px; position:relative; z-index:2;">${iconHtml}</div>
                <div class="timeline-content" style="padding-bottom:20px;">
                    <b style="font-size:14px; color:${isActive ? '#2d3748' : '#cbd5e0'};">${step.title}</b><br>
                    <span style="font-size:13px; color:${isActive ? '#4a5568' : '#cbd5e0'};">${step.description}</span>
                </div>
            </div>
        `;

        timelineContainer.appendChild(timelineItem);
    });

    if (currentStatus === 'cancelled') {
        const cancelItem = document.createElement('div');
        cancelItem.innerHTML = `
            <div class="timeline-point" style="display:grid; grid-template-columns:30px auto; gap:10px; position:relative;">
                <div class="timeline-icon" style="font-size:16px; position:relative; z-index:2;">❌</div>
                <div class="timeline-content" style="padding-bottom:20px;">
                    <b style="font-size:14px; color:#e53e3e;">Đã hủy</b><br>
                    <span style="font-size:13px; color:#e53e3e;">Đơn hàng đã bị hủy bỏ.</span>
                </div>
            </div>
        `;
        timelineContainer.appendChild(cancelItem);
    }
}

// =========================================================================
// 7. QUẢN LÝ BLOG
// =========================================================================

async function loadBlogs() {
    if (!requireTabPermission('blogs')) return;

    try {
        const response = await fetch(`${API_URL}/blogs`, { cache: 'no-store' });
        const blogs = await response.json();

        const tbody = document.getElementById('blog-list-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        blogs.forEach(blog => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${escapeHTML(blog.id)}</td>
                <td><img src="${escapeHTML(blog.img || '')}" style="width:60px; height:40px; object-fit:cover; border-radius:4px;"></td>
                <td><b style="color:#1a4fa0;">${escapeHTML(blog.title || 'Chưa cập nhật')}</b></td>
                <td><span style="background:#eaf2ff; color:#1a4fa0; padding:3px 8px; border-radius:4px; font-size:12px;">${escapeHTML(blog.tag || 'Blog')}</span></td>
                <td>${escapeHTML(blog.date || 'Chưa cập nhật')}</td>
                <td style="text-align:center;">
                    <span class="action-link-edit" onclick="openEditBlogModal('${blog.id}')">Sửa</span>
                    <span class="action-link-delete" onclick="deleteBlog('${blog.id}')">Xóa</span>
                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error('Lỗi loadBlogs:', error);
        Swal.fire('Lỗi!', 'Không thể tải danh sách bài viết.', 'error');
    }
}

function openBlogModal() {
    if (!requireTabPermission('blogs')) return;

    document.getElementById('blog-modal-title').innerText = 'Thêm Bài viết mới';
    document.getElementById('blog-form').reset();
    document.getElementById('form-blog-id').value = '';
    document.getElementById('blog-modal').style.display = 'flex';
}

async function openEditBlogModal(id) {
    if (!requireTabPermission('blogs')) return;

    try {
        const response = await fetch(`${API_URL}/blogs/${id}`);
        const blog = await response.json();

        document.getElementById('blog-modal-title').innerText = 'Cập nhật Bài viết';
        document.getElementById('form-blog-id').value = blog.id;
        document.getElementById('form-blog-title').value = blog.title || '';
        document.getElementById('form-blog-tag').value = blog.tag || '';
        document.getElementById('form-blog-date').value = blog.date || '';
        document.getElementById('form-blog-img').value = blog.img || '';
        document.getElementById('form-blog-desc').value = blog.desc || '';
        document.getElementById('blog-modal').style.display = 'flex';

    } catch (error) {
        console.error('Lỗi openEditBlogModal:', error);
        Swal.fire('Lỗi!', 'Không thể tải thông tin bài viết.', 'error');
    }
}

function closeBlogModal() {
    document.getElementById('blog-modal').style.display = 'none';
}

async function saveBlog(event) {
    event.preventDefault();

    if (!requireTabPermission('blogs')) return;

    const blogId = document.getElementById('form-blog-id').value.trim();

    const blogData = {
        title: document.getElementById('form-blog-title').value.trim(),
        tag: document.getElementById('form-blog-tag').value.trim(),
        date: document.getElementById('form-blog-date').value.trim(),
        img: document.getElementById('form-blog-img').value.trim(),
        desc: document.getElementById('form-blog-desc').value.trim()
    };

    if (!blogData.title) {
        Swal.fire('Thiếu thông tin!', 'Vui lòng nhập tiêu đề bài viết.', 'warning');
        return;
    }

    try {
        let response;

        if (!blogId) {
            response = await fetch(`${API_URL}/blogs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(blogData)
            });
        } else {
            response = await fetch(`${API_URL}/blogs/${blogId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(blogData)
            });
        }

        if (response.ok) {
            closeBlogModal();
            Swal.fire('Thành công!', 'Cập nhật bài viết thành công.', 'success');
            await loadBlogs();
        } else {
            Swal.fire('Thất bại!', 'Không thể lưu bài viết.', 'error');
        }

    } catch (error) {
        console.error('Lỗi saveBlog:', error);
        Swal.fire('Lỗi kết nối!', 'Không thể kết nối đến backend.', 'error');
    }
}

function deleteBlog(id) {
    if (!requireTabPermission('blogs')) return;

    Swal.fire({
        title: 'Xóa bài viết?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b82025',
        cancelButtonColor: '#718096',
        confirmButtonText: 'Đồng ý xóa',
        cancelButtonText: 'Hủy bỏ'
    }).then(async result => {
        if (!result.isConfirmed) return;

        try {
            const response = await fetch(`${API_URL}/blogs/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                Swal.fire('Đã xóa!', 'Bài viết đã bị gỡ.', 'success');
                await loadBlogs();
            } else {
                Swal.fire('Thất bại!', 'Không thể xóa bài viết.', 'error');
            }

        } catch (error) {
            console.error('Lỗi deleteBlog:', error);
            Swal.fire('Lỗi kết nối!', 'Không thể kết nối đến backend.', 'error');
        }
    });
}

// =========================================================================
// 8. QUẢN LÝ ĐÁNH GIÁ
// =========================================================================

async function loadReviews() {
    if (!requireTabPermission('reviews')) return;

    try {
        const response = await fetch(`${API_URL}/reviews`, { cache: 'no-store' });
        const reviews = await response.json();

        const tbody = document.getElementById('review-list-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        reviews.forEach(r => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${escapeHTML(r.id)}</td>
                <td><b>${escapeHTML(r.author || 'Khách hàng')}</b></td>
                <td><span style="color:#b82025; font-weight:bold;">${escapeHTML(r.tourTitle || r.destination || 'Chưa cập nhật')}</span></td>
                <td style="color:#d69e2e; font-size:12px;">${escapeHTML(r.stars || '⭐⭐⭐⭐⭐')}</td>
                <td>
                    <span style="display:block; max-width:250px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                        ${escapeHTML(r.text || '')}
                    </span>
                </td>
                <td style="text-align:center;">
                    <span class="action-link-edit" onclick="openEditReviewModal('${r.id}')">Sửa</span>
                    <span class="action-link-delete" onclick="deleteReview('${r.id}')">Xóa</span>
                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error('Lỗi loadReviews:', error);
        Swal.fire('Lỗi!', 'Không thể tải danh sách đánh giá.', 'error');
    }
}

function openReviewModal() {
    if (!requireTabPermission('reviews')) return;

    document.getElementById('review-modal-title').innerText = 'Thêm Đánh giá mới';
    document.getElementById('review-form').reset();
    document.getElementById('form-review-id').value = '';
    document.getElementById('review-modal').style.display = 'flex';
}

async function openEditReviewModal(id) {
    if (!requireTabPermission('reviews')) return;

    try {
        const response = await fetch(`${API_URL}/reviews/${id}`);
        const r = await response.json();

        document.getElementById('review-modal-title').innerText = 'Cập nhật Đánh giá';
        document.getElementById('form-review-id').value = r.id;
        document.getElementById('form-review-author').value = r.author || '';
        document.getElementById('form-review-tour').value = r.tourTitle || r.destination || '';
        document.getElementById('form-review-stars').value = r.stars || '⭐⭐⭐⭐⭐';
        document.getElementById('form-review-text').value = r.text || '';
        document.getElementById('review-modal').style.display = 'flex';

    } catch (error) {
        console.error('Lỗi openEditReviewModal:', error);
        Swal.fire('Lỗi!', 'Không thể tải thông tin đánh giá.', 'error');
    }
}

function closeReviewModal() {
    document.getElementById('review-modal').style.display = 'none';
}

async function saveReview(event) {
    event.preventDefault();

    if (!requireTabPermission('reviews')) return;

    const reviewId = document.getElementById('form-review-id').value.trim();

    const reviewData = {
        author: document.getElementById('form-review-author').value.trim(),
        destination: document.getElementById('form-review-tour').value.trim(),
        tourTitle: document.getElementById('form-review-tour').value.trim(),
        stars: document.getElementById('form-review-stars').value,
        text: document.getElementById('form-review-text').value.trim()
    };

    if (!reviewData.author || !reviewData.text) {
        Swal.fire('Thiếu thông tin!', 'Vui lòng nhập tên khách hàng và nội dung đánh giá.', 'warning');
        return;
    }

    try {
        let response;

        if (!reviewId) {
            response = await fetch(`${API_URL}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewData)
            });
        } else {
            response = await fetch(`${API_URL}/reviews/${reviewId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewData)
            });
        }

        if (response.ok) {
            closeReviewModal();
            Swal.fire('Thành công!', 'Cập nhật đánh giá thành công.', 'success');
            await loadReviews();
        } else {
            Swal.fire('Thất bại!', 'Không thể lưu đánh giá.', 'error');
        }

    } catch (error) {
        console.error('Lỗi saveReview:', error);
        Swal.fire('Lỗi kết nối!', 'Không thể kết nối đến backend.', 'error');
    }
}

function deleteReview(id) {
    if (!requireTabPermission('reviews')) return;

    Swal.fire({
        title: 'Xóa đánh giá?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b82025',
        cancelButtonColor: '#718096',
        confirmButtonText: 'Đồng ý xóa',
        cancelButtonText: 'Hủy bỏ'
    }).then(async result => {
        if (!result.isConfirmed) return;

        try {
            const response = await fetch(`${API_URL}/reviews/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                Swal.fire('Đã xóa!', 'Đánh giá đã bị gỡ.', 'success');
                await loadReviews();
            } else {
                Swal.fire('Thất bại!', 'Không thể xóa đánh giá.', 'error');
            }

        } catch (error) {
            console.error('Lỗi deleteReview:', error);
            Swal.fire('Lỗi kết nối!', 'Không thể kết nối đến backend.', 'error');
        }
    });
}

// =========================================================================
// 9. PDF ADMIN
// =========================================================================

function generateAdminTourPDF() {
    if (!requireTabPermission('bookings')) return;

    document.getElementById('pdf-adm-id').innerText = document.getElementById('detail-order-id').innerText;
    document.getElementById('pdf-adm-date').innerText = document.getElementById('detail-order-date').innerText.replace('Ngày đặt: ', '');
    document.getElementById('pdf-adm-name').innerText = document.getElementById('customer-info-name').innerText;
    document.getElementById('pdf-adm-phone').innerText = document.getElementById('customer-info-phone').innerText;
    document.getElementById('pdf-adm-email').innerText = document.getElementById('customer-info-email').innerText;

    const tourTitleEl = document.querySelector('#ordered-tour-container .product-detail b');
    document.getElementById('pdf-adm-tour').innerText = tourTitleEl ? tourTitleEl.innerText : 'Hành trình đặt tour du lịch';

    document.getElementById('pdf-adm-method').innerText = document.getElementById('detail-payment-method').innerText;
    document.getElementById('pdf-adm-total').innerText = document.getElementById('detail-total-amount').innerText;

    const element = document.getElementById('pdf-admin-template');
    const orderId = document.getElementById('detail-order-id').innerText || 'Don-Hang';

    const options = {
        margin: 0.4,
        filename: `Ve-Dien-Tu-Admin-${orderId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    element.style.display = 'block';

    html2pdf().set(options).from(element).save().then(() => {
        element.style.display = 'none';
        Swal.fire('Thành công!', 'Đã xuất file PDF thành công.', 'success');
    });
}

// =========================================================================
// 10. KHỞI TẠO TRANG ADMIN
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const uForm = document.getElementById('user-form');
    if (uForm) uForm.onsubmit = saveUser;

    const cForm = document.getElementById('category-form');
    if (cForm) cForm.onsubmit = saveCategory;

    const tForm = document.getElementById('tour-form');
    if (tForm) tForm.onsubmit = saveTour;

    const bForm = document.getElementById('blog-form');
    if (bForm) bForm.onsubmit = saveBlog;

    const rForm = document.getElementById('review-form');
    if (rForm) rForm.onsubmit = saveReview;

    const currentUser = setupAdminPermissions();

    if (!currentUser) {
        return;
    }

    const role = normalizeRole(currentUser.role);
    const defaultTab = getDefaultTabByRole(role);

    switchTab(defaultTab);

    const btnAdminLogout = document.querySelector('.logout-btn');

    if (btnAdminLogout) {
        btnAdminLogout.addEventListener('click', event => {
            event.preventDefault();

            Swal.fire({
                title: '<span style="color:#003c71; font-family:Montserrat; font-weight:800; font-size:22px;">XÁC NHẬN ĐĂNG XUẤT?</span>',
                html: '<p style="color:#4a5568; font-size:14px; margin-top:10px;">Bạn có chắc chắn muốn rời khỏi phiên làm việc này không?</p>',
                icon: 'warning',
                iconColor: '#d32f2f',
                showCancelButton: true,
                confirmButtonColor: '#003c71',
                cancelButtonColor: '#718096',
                confirmButtonText: '🔑 Đồng ý, đăng xuất',
                cancelButtonText: '❌ Hủy bỏ'
            }).then(result => {
                if (result.isConfirmed) {
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('activeAdminTab');
                    localStorage.removeItem('activeAdminTab_superadmin');
                    localStorage.removeItem('activeAdminTab_admin');
                    localStorage.removeItem('activeAdminTab_sale');
                    localStorage.removeItem('activeAdminTab_content');

                    Swal.fire({
                        title: 'Thành công!',
                        text: 'Đang chuyển về trang đăng nhập...',
                        icon: 'success',
                        timer: 1000,
                        showConfirmButton: false
                    }).then(() => {
                        window.location.href = 'auth.html';
                    });
                }
            });
        });
    }
});

// Hàm điều hướng về trang chính (main.html) với kiểm tra quyền truy cập
function goToMainPage() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }

    const role = String(currentUser.role || '').trim().toLowerCase();

    if (
        role === 'admin' ||
        role === 'superadmin' ||
        role === 'sale' ||
        role === 'content'
    ) {
        window.location.href = 'main.html';
        return;
    }

    Swal.fire(
        'Không có quyền!',
        'Chỉ tài khoản quản trị, sale hoặc content mới có thể dùng nút này.',
        'warning'
    );
}