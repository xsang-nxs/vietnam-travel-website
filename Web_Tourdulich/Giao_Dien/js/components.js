// File: giao_dien/js/components.js (chứa các thành phần giao diện dùng chung cho toàn bộ website, như header, footer, và các hàm tiện ích)
// Tự động chèn thư viện icon FontAwesome 6.4.0 vào tất cả các trang
if (!document.querySelector('link[href*="font-awesome"]')) {
    const faLink = document.createElement('link');
    faLink.rel = 'stylesheet';
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(faLink);
}

// =========================================================================
// AUTOMATED TO LOAD SWEETALERT2 CDN TO ALL PAGES (TỰ ĐỘNG NHÚNG POPUP ĐẸP)
// =========================================================================
(function() {
    if (typeof Swal === 'undefined') {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
        document.head.appendChild(script);
    }
})();

// =========================================================================
// 1. CẤU HÌNH GIAO DIỆN HEADER 
// =========================================================================
const headerHTML = `
    <header class="header-modern">
        <div class="header-left">
            <a href="main.html" class="logo" style="text-decoration: none;">The3<span style="color:#d32f2f;">Coachrock</span></a>
        </div>

        <div class="header-right">
            <nav class="main-nav">
                <a href="main.html">Tour trọn gói</a>
                
                <div class="dropdown">
                    <a href="#" class="dropdown-toggle" id="service-toggle" style="display:flex; align-items:center; gap:5px;">
                        Dịch vụ cộng thêm <span style="font-size: 10px;">⌄</span>
                    </a>
                    <div class="dropdown-menu" id="service-menu">
                        <a href="ve-tham-quan.html">🎟️ Vé tham quan</a>
                        <a href="danh-gia-blog.html?tab=blog">📝 Đánh giá & Blog</a>
                    </div>
                </div>
            </nav>

            <div class="header-utils">
                <div class="location-dropdown">
                    <div class="util-item" id="loc-toggle-btn">
                        📍 <span id="header-loc-text">TP. Hồ Chí Minh</span> <span style="font-size: 10px;">⌄</span>
                    </div>
                    <div class="dropdown-menu dropdown-right location-menu" id="loc-menu-box">
                        <div class="loc-header">
                            <h4>Chọn địa điểm khởi hành</h4>
                            <p>Hãy chọn địa điểm để nhận gợi ý điểm đến phù hợp nhất</p>
                        </div>
                        <div class="loc-list">
                            <span class="loc-option" data-loc="TP. Hồ Chí Minh">TP. Hồ Chí Minh</span>
                            <span class="loc-option" data-loc="Hà Nội">Hà Nội</span>
                            <span class="loc-option" data-loc="Đà Nẵng">Đà Nẵng</span>
                            <span class="loc-option" data-loc="Cần Thơ">Cần Thơ</span>
                            <span class="loc-option" data-loc="Quảng Ninh">Quảng Ninh</span>
                            <span class="loc-option" data-loc="Huế">Huế</span>
                            <span class="loc-option" data-loc="" style="color: #1a4fa0; font-weight: bold;">Tất cả</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="header-actions">
                <div class="dropdown">
                    <button class="btn-login" id="login-toggle" type="button">
                        <span class="user-icon">👤</span> Đăng nhập
                    </button>
                    <div class="dropdown-menu dropdown-right" id="login-menu">
                        <a href="auth.html?mode=login">🔑 Đăng nhập</a>
                        <a href="auth.html?mode=register">📝 Đăng ký</a>
                    </div>
                </div>

                <div class="dropdown">
                    <button class="btn-icon" onclick="window.location.href='cart.html'" type="button" style="position: relative;">
                        🛒
                        <span id="header-cart-badge" style="display: none; position: absolute; top: -5px; right: -8px; background: #e53e3e; color: #fff; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 50%; border: 2px solid #fff;">0</span>
                    </button>
                    <div class="dropdown-menu dropdown-right cart-menu">
                        <div class="cart-header">Giỏ hàng của bạn</div>
                        <div class="cart-items" id="cart-dropdown-items" style="max-height: 300px; overflow-y: auto;">
                            <p class="empty-cart">Chưa có tour nào trong giỏ hàng</p>
                        </div>
                        <a href="cart.html" class="btn-view-cart">Xem chi tiết giỏ hàng</a>
                    </div>
                </div>
                <button class="btn-icon" type="button">☰</button>
            </div>
        </div>
    </header>
`;

// =========================================================================
// 2. CẤU HÌNH GIAO DIỆN FOOTER
// =========================================================================
const footerHTML = `
    <footer class="footer-pro-light">
        <div class="footer-pro-container">
            <div class="footer-pro-grid">
                <div class="footer-pro-col">
                    <div class="footer-logo-light">The3<span style="color:#d32f2f;">Coachrock</span></div>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        
                        <li style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 15px;">
                            <i class="fa-solid fa-location-dot" style="color: #b82025; font-size: 18px; margin-top: 3px; width: 20px; text-align: center;"></i>
                            <span style="color: #4a5568; font-size: 14.5px; line-height: 1.5;">
                                <strong>Trụ sở chính:</strong> 123 Đường Nguyễn Văn Cừ, Quận 1, TP. Hồ Chí Minh
                            </span>
                        </li>
                        
                        <li style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
                            <i class="fa-solid fa-phone" style="color: #b82025; font-size: 16px; width: 20px; text-align: center;"></i>
                            <span style="color: #4a5568; font-size: 14.5px;">
                                <strong>Hotline:</strong> 1900 1234 (Hỗ trợ 24/7)
                            </span>
                        </li>
                        
                        <li style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
                            <i class="fa-solid fa-envelope" style="color: #b82025; font-size: 16px; width: 20px; text-align: center;"></i>
                            <span style="color: #4a5568; font-size: 14.5px;">
                                <strong>Email:</strong> contact@the3coachrock.com
                            </span>
                        </li>

                    </ul>
                    <div class="footer-social-wrapper" style="display: flex; gap: 15px; margin-top: 15px;">
                        <a href="#" class="social-circle-btn" title="Facebook The3Coachrock"><i class="fa-brands fa-facebook-f"></i></a>
                        <a href="#" class="social-circle-btn" title="Instagram The3Coachrock"><i class="fa-brands fa-instagram"></i></a>
                        <a href="#" class="social-circle-btn" title="YouTube The3Coachrock"><i class="fa-brands fa-youtube"></i></a>
                        <a href="#" class="social-circle-btn" title="TikTok The3Coachrock"><i class="fa-brands fa-tiktok"></i></a>
                    </div>

                    <style>
                        .social-circle-btn {
                            width: 42px; 
                            height: 42px; 
                            background-color: #f1f5f9; 
                            color: #4a5568; 
                            border-radius: 50%;
                            display: flex; 
                            justify-content: center; 
                            align-items: center;
                            text-decoration: none; 
                            font-size: 18px; 
                            transition: all 0.3s ease;
                        }
                        .social-circle-btn:hover {
                            background-color: #1a4fa0; 
                            color: #ffffff;
                            transform: translateY(-4px);
                            box-shadow: 0 6px 15px rgba(26, 79, 160, 0.3); 
                        }
                    </style>
                </div>

                <div class="footer-pro-col">
                    <h4>Về chúng tôi</h4>
                    <ul style="pointer-events: none;">
                        <li><a href="#">Cách đặt chỗ</a></li>
                        <li><a href="#">Liên hệ chúng tôi</a></li>
                        <li><a href="#">Trợ giúp</a></li>
                        <li><a href="#">Tuyển dụng</a></li>
                    </ul>
                </div>

                <div class="footer-pro-col">
                    <h4>Dịch vụ</h4>
                    <ul style="pointer-events: none;">
                        <li><a href="#">Tour trọn gói</a></li>
                        <li><a href="#">Vé tham quan</a></li>
                        <li><a href="#">Cẩm nang du lịch</a></li>
                    </ul>
                </div>

                <div class="footer-pro-col">
                    <h4>Khác</h4>
                    <ul style="pointer-events: none;">
                        <li><a href="#">Chính sách bảo mật</a></li>
                        <li><a href="#">Điều khoản sử dụng</a></li>
                        <li><a href="#">Quy chế hoạt động</a></li>
                    </ul>
                </div>

                <div class="footer-payment-methods">
                        <h4 style="color: #000000; font-size: 16px; margin-bottom: 15px; font-weight: 800; text-transform: uppercase;">
                            Đối tác thanh toán
                        </h4>
                        
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; max-width: 300px;">
                            
                            <div class="bank-box" title="Thanh toán qua Mastercard"><i class="fa-brands fa-cc-mastercard" style="color: #ff5f00; font-size: 28px;"></i></div>
                            <div class="bank-box" title="Thanh toán qua Visa"><i class="fa-brands fa-cc-visa" style="color: #1434cb; font-size: 28px;"></i></div>
                            <div class="bank-box" title="Thanh toán qua JCB"><i class="fa-brands fa-cc-jcb" style="color: #0f4094; font-size: 28px;"></i></div>
                            
                            <div class="bank-box bank-text" style="color: #a50064; text-transform: lowercase; font-size: 14px;" title="Thanh toán qua MoMo">momo</div>
                            <div class="bank-box bank-text" style="color: #008fe5; font-size: 14px;" title="Thanh toán qua ZaloPay">ZaloPay</div>
                            <div class="bank-box bank-text" style="font-size: 15px;" title="Thanh toán qua VNPAY">
                                <span style="color: #ed1c24;">VN</span><span style="color: #005aab;">PAY</span>
                            </div>
                            
                        </div>
                    </div>

                    <style>
                        .bank-box {
                            background: #ffffff;
                            border: 1px solid #cbd5e0;
                            border-radius: 6px;
                            height: 42px; /* Tăng chiều cao lên một chút cho thoáng và sang hơn */
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                            transition: all 0.2s ease;
                            cursor: pointer;
                        }
                        .bank-box:hover {
                            border-color: #003c71;
                            box-shadow: 0 4px 8px rgba(0, 60, 113, 0.15);
                            transform: translateY(-2px);
                        }
                        .bank-text {
                            font-weight: 900;
                            text-align: center;
                            letter-spacing: -0.3px;
                            font-family: 'Arial Black', Impact, sans-serif;
                        }
                    </style>
            </div>

            <div class="footer-pro-divider">
                &copy; 2026 The3Coachrock. Bảo lưu mọi quyền. <br>
                Hệ thống đặt tour du lịch trực tuyến chuyên nghiệp.
            </div>
        </div>
    </footer>
`;

// =========================================================================
// 3. LOGIC ĐIỀU KHIỂN & ĐỒNG BỘ TRẠNG THÁI ĐĂNG NHẬP
// =========================================================================

// --- [ĐOẠN CODE MỚI THÊM VÀO ĐỂ FIX LỖI LIVE SERVER] ---
// Kiểm tra nếu là lần đầu tiên mở tab trình duyệt (chạy Live Server)
if (!sessionStorage.getItem('isTabJustOpened')) {
    localStorage.removeItem('currentUser'); // Xóa tài khoản cũ đi để đưa về Ẩn danh
    sessionStorage.setItem('isTabJustOpened', 'true'); // Đánh dấu là tab này đã mở rồi
}
// -------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    const headerEl = document.getElementById('header-component');
    const footerEl = document.getElementById('footer-component');
    
    if (headerEl) headerEl.innerHTML = headerHTML;
    if (footerEl) footerEl.innerHTML = footerHTML;

    // Lấy thông tin User sau khi đã chạy qua bộ lọc Live Server ở trên
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser && headerEl) {
        const loginContainer = headerEl.querySelector('.header-actions .dropdown');
        if (loginContainer) {
            loginContainer.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px; font-size: 14px; padding: 5px 0;">
                    <span onclick="window.location.href='profile.html'" style="font-weight: 600; color: #003c71; white-space: nowrap; cursor: pointer;" title="Xem hồ sơ cá nhân">
                        👋 Xin chào, <span style="color: #d32f2f; font-weight: bold; text-decoration: underline;">${currentUser.username}</span>
                    </span>
                    ${currentUser.role === 'admin' ? `
                        <a href="admin.html" style="text-decoration: none; color: #003c71; font-size: 13px; font-weight: bold; border-left: 1px solid #cbd5e0; padding-left: 10px; white-space: nowrap;">
                            💻 Quản trị
                        </a>
                    ` : ''}
                    <a href="#" id="global-btn-logout" style="text-decoration: none; color: #718096; font-size: 13px; font-weight: 600; border-left: 1px solid #cbd5e0; padding-left: 10px; white-space: nowrap; cursor: pointer;">
                        Đăng xuất
                    </a>
                </div>
            `;
        }
    }

    const serviceToggle = document.getElementById('service-toggle');
    const serviceMenu = document.getElementById('service-menu');
    const loginToggle = document.getElementById('login-toggle');
    const loginMenu = document.getElementById('login-menu');

    if (serviceToggle && serviceMenu) {
        serviceToggle.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation(); 
            serviceMenu.classList.toggle('show'); 
            if (loginMenu) loginMenu.classList.remove('show'); 
            const locMenuBox = document.getElementById('loc-menu-box');
            if (locMenuBox) locMenuBox.classList.remove('show');
        });
    }

    if (loginToggle && loginMenu) {
        loginToggle.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation(); 
            loginMenu.classList.toggle('show'); 
            if (serviceMenu) serviceMenu.classList.remove('show'); 
            const locMenuBox = document.getElementById('loc-menu-box');
            if (locMenuBox) locMenuBox.classList.remove('show');
        });
    }

    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.addEventListener('click', (e) => { e.stopPropagation(); });
    });

    document.addEventListener('click', () => {
        if (serviceMenu) serviceMenu.classList.remove('show');
        if (loginMenu) loginMenu.classList.remove('show');
        const locMenuBox = document.getElementById('loc-menu-box');
        if (locMenuBox) locMenuBox.classList.remove('show');
    });
});

// =========================================================================
// 4. THÔNG BÁO ĐĂNG XUẤT XỊN XÒ
// =========================================================================
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'global-btn-logout') {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: '<span style="color: #003c71; font-family: Montserrat; font-weight:800; font-size:22px;">ĐĂNG XUẤT THÀNH CÔNG!</span>',
                html: '<p style="color: #4a5568; font-size:14px; margin-top:10px;">Hệ thống đã ngắt kết nối an toàn. Bạn muốn đi tới trang <b>Đăng nhập</b> tài khoản khác hay tiếp tục khám phá với tư cách <b>Người xem ẩn danh</b>?</p>',
                icon: 'success',
                showCancelButton: true,
                confirmButtonColor: '#003c71',  
                cancelButtonColor: '#718096',   
                confirmButtonText: '🔑 Đăng nhập ngay',
                cancelButtonText: '🌐 Xem tiếp ẩn danh'
            }).then((result) => {
                if (result.isConfirmed) window.location.href = 'auth.html';
                else window.location.href = 'main.html';
            });
        } else {
            const duongDanLink = confirm('Đã đăng xuất thành công!\nBạn có muốn đi đến trang Đăng nhập không?');
            window.location.href = duongDanLink ? 'auth.html' : 'main.html';
        }
    }
});

// =========================================================================
// 5. CÁC HÀM TIỆN ÍCH DÙNG CHUNG CHO TOÀN BỘ WEBSITE (ĐÃ VÁ LỖI NGÀY THÁNG)
// =========================================================================
function formatPrice(price) {
    if (!price) return 'Đang cập nhật';
    return Number(price).toLocaleString('vi-VN') + 'đ';
}

// BẢN NÂNG CẤP: Vá triệt để lỗi sinh ra năm 190X
function formatDate(dateString) {
    if (!dateString) return 'Liên hệ';
    
    // 1. Nếu dính chữ T (chuỗi ISO) thì cắt bỏ giờ phút giây đi
    let str = String(dateString).trim();
    if (str.includes('T')) str = str.split('T')[0];
    
    // 2. Đồng nhất mọi dấu '-' thành '/'
    str = str.replace(/-/g, '/');
    
    const parts = str.split('/');
    if (parts.length === 3) {
        // Nếu định dạng đang là YYYY/MM/DD (phần tử đầu là năm có 4 số)
        if (parts[0].length === 4) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        // Nếu định dạng đã chuẩn DD/MM/YYYY rồi thì giữ nguyên
        else if (parts[2].length === 4) {
            return `${parts[0]}/${parts[1]}/${parts[2]}`;
        }
    }
    return str; // Trả về nguyên gốc nếu không nhận dạng được
}

// Cuộn lên đầu trang
document.addEventListener('DOMContentLoaded', () => {
    const fixedActions = document.getElementById('fixed-actions');
    const btnScrollTop = document.getElementById('btn-scroll-top');

    if (fixedActions && btnScrollTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) fixedActions.classList.add('show');
            else fixedActions.classList.remove('show');
        });
        btnScrollTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

// =========================================================================
// 6. HÀM QUẢN LÝ GIỎ HÀNG
// =========================================================================
function updateCartBadge() {
    const cartData = JSON.parse(localStorage.getItem('travelCart')) || [];
    const badge = document.getElementById('header-cart-badge');
    const dropdownItems = document.getElementById('cart-dropdown-items');

    if (cartData.length > 0) {
        if (badge) {
            badge.innerText = cartData.length;
            badge.style.display = 'inline-block';
        }
        if (dropdownItems) {
            dropdownItems.innerHTML = cartData.map(item => `
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding: 10px 0; font-size: 13px;">
                    <div style="max-width: 70%;">
                        <strong style="color: #1a4fa0; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.title}</strong>
                        <span style="color: #666;">Khởi hành: ${item.date}</span>
                    </div>
                    <span style="color: #d32f2f; font-weight: bold;">${(item.price * item.qty).toLocaleString('vi-VN')}đ</span>
                </div>
            `).join('');
        }
    } else {
        if (badge) badge.style.display = 'none';
        if (dropdownItems) dropdownItems.innerHTML = '<p class="empty-cart">Chưa có tour nào trong giỏ hàng</p>';
    }
}
document.addEventListener('DOMContentLoaded', () => { setTimeout(updateCartBadge, 100); });