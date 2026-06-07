// =========================================================================
// PROFILE.JS - FIX HIỂN THỊ THÔNG TIN, CHUYỂN TAB, ĐƠN HÀNG, THÔNG BÁO, ĐỔI MẬT KHẨU
// =========================================================================

const API_URL = 'http://localhost:3001';
let currentUser = null;

function safeAlert(title, text, icon = 'info') {
    if (typeof Swal !== 'undefined') {
        return Swal.fire(title, text, icon);
    }

    alert(`${title}\n${text}`);
    return Promise.resolve();
}

function showLoading(title, html = 'Vui lòng đợi trong giây lát...') {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title,
            html,
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });
    }
}

function getStoredUser() {
    try {
        return JSON.parse(localStorage.getItem('currentUser'));
    } catch (error) {
        return null;
    }
}

function saveSafeUserToStorage(user) {
    const safeUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        accessToken: user.accessToken
    };

    localStorage.setItem('currentUser', JSON.stringify(safeUser));
    return safeUser;
}

function getRoleLabel(role) {
    role = String(role || '').trim().toLowerCase();

    if (role === 'superadmin') return 'Super Admin';
    if (role === 'admin') return 'Quản trị viên';
    if (role === 'sale') return 'Nhân viên Sale';
    if (role === 'content') return 'Biên tập viên';

    return 'Thành viên';
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
}

function setValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
}

function escapeHTML(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

async function getFreshUser(storedUser) {
    if (!storedUser || !storedUser.id) return storedUser;

    try {
        const response = await fetch(`${API_URL}/users/${storedUser.id}`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            return storedUser;
        }

        const freshUser = await response.json();

        return {
            ...storedUser,
            id: freshUser.id,
            username: freshUser.username,
            email: freshUser.email,
            phone: freshUser.phone,
            role: freshUser.role
        };

    } catch (error) {
        console.error('Không thể lấy user mới nhất:', error);
        return storedUser;
    }
}

function renderProfileInfo(user) {
    setText('side-username', user.username || 'Thành viên');
    setText('side-role', getRoleLabel(user.role));

    setValue('p-email', user.email || '');
    setValue('p-phone', user.phone || '');

    const fullName = String(user.username || '').trim();
    const nameParts = fullName ? fullName.split(/\s+/) : [];

    if (nameParts.length >= 2) {
        const firstName = nameParts.pop();
        const lastName = nameParts.join(' ');

        setValue('p-lastName', lastName);
        setValue('p-firstName', firstName);
    } else {
        setValue('p-lastName', '');
        setValue('p-firstName', fullName);
    }

    const genderMale = document.getElementById('gender-male');
    const genderFemale = document.getElementById('gender-female');

    if (genderMale && genderFemale) {
        if (Number(user.id) % 2 === 0) {
            genderFemale.checked = true;
        } else {
            genderMale.checked = true;
        }
    }
}

// =========================================================================
// TAB PROFILE - CẦN GLOBAL ĐỂ onclick TRONG profile.html GỌI ĐƯỢC
// =========================================================================

function toggleSubMenu(menuId, btnElement) {
    const menu = document.getElementById(menuId);
    const arrow = btnElement ? btnElement.querySelector('.nav-arrow') : null;

    if (!menu) return;

    const isClosed = menu.style.display === 'none' || getComputedStyle(menu).display === 'none';

    if (isClosed) {
        menu.style.display = 'flex';
        if (arrow) arrow.innerText = '▲';
    } else {
        menu.style.display = 'none';
        if (arrow) arrow.innerText = '▼';
    }
}

function switchProfileTab(tabName, clickedBtn) {
    document.querySelectorAll('.profile-content-card').forEach(card => {
        card.style.display = 'none';
    });

    document.querySelectorAll('.profile-sub-item, .profile-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const targetTab = document.getElementById(`p-tab-${tabName}`);
    if (targetTab) {
        targetTab.style.display = 'block';
    }

    if (!clickedBtn) return;

    clickedBtn.classList.add('active');

    if (clickedBtn.classList.contains('profile-sub-item')) {
        const parentMenu = clickedBtn.closest('.profile-sub-menu');

        if (parentMenu) {
            parentMenu.style.display = 'flex';

            const parentBtn = parentMenu.previousElementSibling;
            if (parentBtn) {
                parentBtn.classList.add('active');

                const arrow = parentBtn.querySelector('.nav-arrow');
                if (arrow) arrow.innerText = '▲';
            }
        }
    }
}

window.toggleSubMenu = toggleSubMenu;
window.switchProfileTab = switchProfileTab;

// =========================================================================
// CẬP NHẬT HỒ SƠ
// =========================================================================

function bindProfileEditForm() {
    const profileEditForm = document.getElementById('profile-edit-form');
    if (!profileEditForm) return;

    profileEditForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const ho = document.getElementById('p-lastName').value.trim();
        const ten = document.getElementById('p-firstName').value.trim();
        const newFullName = `${ho} ${ten}`.trim();

        if (!newFullName) {
            safeAlert('Thiếu thông tin!', 'Vui lòng nhập họ tên.', 'warning');
            return;
        }

        showLoading('Đang đồng bộ dữ liệu...');

        try {
            const response = await fetch(`${API_URL}/users/${currentUser.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: newFullName })
            });

            if (!response.ok) throw new Error('Không thể cập nhật hồ sơ');

            currentUser.username = newFullName;
            currentUser = saveSafeUserToStorage(currentUser);
            renderProfileInfo(currentUser);

            safeAlert('Thành công!', 'Thông tin họ tên đã được cập nhật.', 'success');

        } catch (err) {
            console.error('Lỗi cập nhật hồ sơ:', err);
            safeAlert('Thất bại!', 'Máy chủ đang bận hoặc không thể cập nhật dữ liệu.', 'error');
        }
    });
}

// =========================================================================
// ĐỔI MẬT KHẨU
// =========================================================================

function bindPasswordChangeForm() {
    const passwordForm = document.getElementById('password-change-form');
    if (!passwordForm) return;

    passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const currentPass = document.getElementById('current-password').value.trim();
        const newPass = document.getElementById('new-password').value.trim();
        const confirmPass = document.getElementById('confirm-password').value.trim();

        if (!currentPass || !newPass || !confirmPass) {
            safeAlert(
                'Thiếu thông tin!',
                'Vui lòng nhập đầy đủ mật khẩu hiện tại, mật khẩu mới và xác nhận mật khẩu.',
                'warning'
            );
            return;
        }

        if (newPass.length < 6) {
            safeAlert('Mật khẩu quá ngắn!', 'Mật khẩu mới phải có ít nhất 6 ký tự.', 'warning');
            return;
        }

        if (newPass !== confirmPass) {
            safeAlert('Lỗi nhập liệu!', 'Mật khẩu mới và nhập lại mật khẩu không khớp nhau.', 'warning');
            return;
        }

        if (newPass === currentPass) {
            safeAlert('Lưu ý!', 'Mật khẩu mới phải khác mật khẩu hiện tại.', 'warning');
            return;
        }

        showLoading('Đang cập nhật mật khẩu...');

        try {
            const response = await fetch(`${API_URL}/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser.id,
                    currentPassword: currentPass,
                    newPassword: newPass
                })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                safeAlert(
                    'Đổi mật khẩu thất bại!',
                    data.message || 'Không thể đổi mật khẩu.',
                    'error'
                );
                return;
            }

            delete currentUser.password;
            currentUser = saveSafeUserToStorage(currentUser);

            safeAlert(
                'Thành công!',
                'Mật khẩu của bạn đã được thay đổi. Từ lần đăng nhập sau hãy dùng mật khẩu mới.',
                'success'
            ).then(() => passwordForm.reset());

        } catch (err) {
            console.error('Lỗi đổi mật khẩu:', err);
            safeAlert('Lỗi kết nối!', 'Không thể kết nối đến máy chủ bảo mật.', 'error');
        }
    });
}

// =========================================================================
// ĐƠN HÀNG CỦA TÔI
// =========================================================================

async function loadMyPersonalOrders(user) {
    const tourContainer = document.getElementById('my-tours-container');
    const ticketContainer = document.getElementById('my-tickets-container');

    if (!tourContainer || !ticketContainer) return;

    try {
        const [resTour, resTicket] = await Promise.all([
            fetch(`${API_URL}/bookings`, { cache: 'no-store' }),
            fetch(`${API_URL}/ticket_bookings`, { cache: 'no-store' })
        ]);

        const allTours = await resTour.json();
        const allTickets = await resTicket.json();

        const userPhone = String(user.phone || '').trim();
        const userEmail = String(user.email || '').trim().toLowerCase();

        const myTours = allTours.filter(order => {
            const orderPhone = String(order.customerPhone || order.phone || '').trim();
            const orderEmail = String(order.customerEmail || order.email || '').trim().toLowerCase();

            return (userPhone && orderPhone === userPhone) || (userEmail && orderEmail === userEmail);
        });

        const myTickets = allTickets.filter(ticket => {
            const ticketPhone = String(ticket.customerPhone || ticket.phone || '').trim();
            const ticketEmail = String(ticket.customerEmail || ticket.email || '').trim().toLowerCase();

            return (userPhone && ticketPhone === userPhone) || (userEmail && ticketEmail === userEmail);
        });

        renderMyTours(myTours, tourContainer);
        renderMyTickets(myTickets, ticketContainer);

    } catch (err) {
        console.error('Lỗi tải đơn hàng:', err);

        tourContainer.innerHTML = `
            <p style="color:#e53e3e; text-align:center; padding:20px;">
                Lỗi kết nối đồng bộ máy chủ!
            </p>
        `;

        ticketContainer.innerHTML = `
            <p style="color:#e53e3e; text-align:center; padding:20px;">
                Lỗi kết nối đồng bộ máy chủ!
            </p>
        `;
    }
}

function renderMyTours(myTours, tourContainer) {
    if (!myTours.length) {
        tourContainer.innerHTML = `
            <div style="text-align:center; padding:40px 20px;">
                <div style="font-size:50px; margin-bottom:15px; opacity:0.5;">🧳</div>
                <p style="color:#718096; font-size:15px;">Bạn chưa thực hiện đặt tour du lịch nào.</p>
            </div>
        `;
        return;
    }

    let html = '';

    [...myTours].reverse().forEach(t => {
        let statusClass = 'pending';

        if (t.status === 'Đã xác nhận' || t.status === 'confirmed') statusClass = 'success';
        if (t.status === 'Đã hủy' || t.status === 'cancelled') statusClass = 'cancelled';

        const total = t.totalAmount || (
            t.totalPrice ? Number(t.totalPrice).toLocaleString('vi-VN') + ' đ' : 'Liên hệ'
        );

        html += `
            <div class="order-card">
                <div class="order-header">
                    <span class="order-code">Mã đơn: <b>${escapeHTML(t.id || 'N/A')}</b></span>
                    <span class="order-status ${statusClass}">${escapeHTML(t.status || 'Đang xử lý')}</span>
                </div>

                <div class="order-body">
                    <div class="order-icon">🗺️</div>
                    <div class="order-info">
                        <h4>${escapeHTML(t.tourTitle || t.tourName || 'Tour du lịch The3Coachrock')}</h4>
                        <p>📅 Khởi hành: <b>${escapeHTML(t.startDate || t.date || 'Đang cập nhật')}</b></p>
                        <p>🕒 Ngày tạo đơn: ${escapeHTML(t.createdAt || t.bookingDate || 'Chưa ghi nhận')}</p>
                    </div>
                </div>

                <div class="order-footer">
                    <span style="color:#718096; font-size:13.5px;">Tổng thanh toán:</span>
                    <span class="order-total-price">${escapeHTML(total)}</span>
                </div>
            </div>
        `;
    });

    tourContainer.innerHTML = html;
}

function renderMyTickets(myTickets, ticketContainer) {
    if (!myTickets.length) {
        ticketContainer.innerHTML = `
            <div style="text-align:center; padding:40px 20px;">
                <div style="font-size:50px; margin-bottom:15px; opacity:0.5;">🎟️</div>
                <p style="color:#718096; font-size:15px;">Bạn chưa thực hiện đặt vé tham quan nào.</p>
            </div>
        `;
        return;
    }

    let html = '';

    [...myTickets].reverse().forEach(v => {
        let statusClass = 'pending';

        if (v.status === 'Đã xác nhận' || v.status === 'confirmed') statusClass = 'success';
        if (v.status === 'Đã hủy' || v.status === 'cancelled') statusClass = 'cancelled';

        html += `
            <div class="order-card">
                <div class="order-header">
                    <span class="order-code">Mã vé: <b>${escapeHTML(v.id || 'N/A')}</b></span>
                    <span class="order-status ${statusClass}">${escapeHTML(v.status || 'Đang xử lý')}</span>
                </div>

                <div class="order-body">
                    <div class="order-icon">🎫</div>
                    <div class="order-info">
                        <h4>Vé dịch vụ tham quan điểm đến</h4>
                        <p>🏷️ Chi tiết: <b>${escapeHTML(v.ticketDetails || 'Vé lẻ')}</b></p>
                        <p>🕒 Ngày mua: ${escapeHTML(v.createdAt || 'Chưa ghi nhận')}</p>
                    </div>
                </div>

                <div class="order-footer">
                    <span style="color:#718096; font-size:13.5px;">Tổng thanh toán:</span>
                    <span class="order-total-price">${escapeHTML(v.totalAmount || 'Liên hệ')}</span>
                </div>
            </div>
        `;
    });

    ticketContainer.innerHTML = html;
}

// =========================================================================
// THÔNG BÁO
// =========================================================================

function loadMyNotifications(user) {
    const notifContainer = document.getElementById('notification-list');
    if (!notifContainer) return;

    const notifications = [
        {
            title: '🎉 Đặt hàng thành công!',
            content: 'Đơn hàng của bạn đã được ghi nhận trên hệ thống The3Coachrock. Chúng tôi sẽ sớm xử lý và xác nhận qua email.',
            date: 'Vừa xong'
        },
        {
            title: '🔒 Bảo mật tài khoản',
            content: 'Bạn có thể đổi mật khẩu định kỳ để bảo vệ tài khoản tốt hơn.',
            date: '2 giờ trước'
        },
        {
            title: '🎁 Hoàn thiện hồ sơ',
            content: 'Hãy hoàn thiện hồ sơ cá nhân để nhận các ưu đãi dành riêng cho thành viên.',
            date: '3 ngày trước'
        }
    ];

    let html = '';

    notifications.forEach(n => {
        html += `
            <div class="notif-item">
                <div class="notif-title">${escapeHTML(n.title)}</div>
                <div class="notif-content">${escapeHTML(n.content)}</div>
                <div class="notif-date">🕒 ${escapeHTML(n.date)}</div>
            </div>
        `;
    });

    notifContainer.innerHTML = html;
}

// =========================================================================
// KHỞI TẠO
// =========================================================================

document.addEventListener('DOMContentLoaded', async () => {
    const storedUser = getStoredUser();

    if (!storedUser) {
        window.location.href = 'auth.html';
        return;
    }

    currentUser = await getFreshUser(storedUser);
    currentUser = saveSafeUserToStorage(currentUser);

    renderProfileInfo(currentUser);
    bindProfileEditForm();
    bindPasswordChangeForm();

    const btnPhone = document.getElementById('btn-change-phone');
    if (btnPhone) {
        btnPhone.addEventListener('click', () => {
            safeAlert('Tính năng bảo mật', 'Vui lòng liên hệ Admin để cập nhật số điện thoại mới.', 'info');
        });
    }

    const btnEmail = document.getElementById('btn-change-email');
    if (btnEmail) {
        btnEmail.addEventListener('click', () => {
            safeAlert('Tính năng bảo mật', 'Hệ thống khóa Email vì đây là định danh tài khoản cốt lõi.', 'info');
        });
    }

    loadMyPersonalOrders(currentUser);
    loadMyNotifications(currentUser);

    const defaultInfoBtn = document.querySelector('.profile-sub-item.active');
    switchProfileTab('info', defaultInfoBtn);
});