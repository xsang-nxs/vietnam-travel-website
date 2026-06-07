// Bộ não xử lý của trang giỏ hàng (Cart.js)

document.addEventListener('DOMContentLoaded', () => {
    // Gọi hàm render để kiểm tra và nạp dữ liệu giỏ hàng ngay khi mở trang
    renderCartPage();

   // Lắng nghe nút bấm tiến hành đặt hàng cuối cùng (Thay thế khối code cũ)
    const btnSubmit = document.getElementById('btn-submit-order');
    if (btnSubmit) {
        btnSubmit.addEventListener('click', () => {
            const cart = JSON.parse(localStorage.getItem('travelCart')) || [];
            if (cart.length === 0) return;

            // Copy toàn bộ Giỏ hàng sang bộ nhớ Thanh toán 'checkoutData'
            localStorage.setItem('checkoutData', JSON.stringify(cart));
            // Đánh dấu đây là thanh toán từ Giỏ hàng
            localStorage.setItem('isCartCheckout', 'true');
            
            // Chuyển hướng sang trang thanh toán
            window.location.href = 'thanh-toan.html';
        });
    
    }
});

// =========================================================================
// HÀM RENDER CHÍNH CỦA TRANG GIỎ HÀNG
// =========================================================================
function renderCartPage() {
    // 1. Mở bộ nhớ lấy danh sách sản phẩm ra
    const cart = JSON.parse(localStorage.getItem('travelCart')) || [];
    
    const mainGrid = document.getElementById('cart-main-grid');
    const emptyBox = document.getElementById('cart-empty-box');
    const itemsContainer = document.getElementById('cart-items-list');
    const countText = document.getElementById('cart-count-text');

    // 2. PHÂN LUỒNG TRẠNG THÁI GIỎ HÀNG
    if (cart.length === 0) {
        // Nếu không có đồ -> Ẩn lưới, Hiện hộp báo trống
        if(mainGrid) mainGrid.style.display = 'none';
        if(emptyBox) emptyBox.style.display = 'block';
        if(countText) countText.innerText = 'Bạn chưa chọn dịch vụ nào.';
        return;
    }

    // Nếu có đồ -> Hiện lưới, Ẩn báo trống
    if(mainGrid) mainGrid.style.display = 'grid';
    if(emptyBox) emptyBox.style.display = 'none';
    if(countText) countText.innerText = `Bạn đang có ${cart.length} dịch vụ trong danh sách chuẩn bị thanh toán.`;

    // 3. VẼ DANH SÁCH SẢN PHẨM RA HTML
    if (itemsContainer) {
        itemsContainer.innerHTML = cart.map((item, index) => {
            // Tính số tiền tạm tính cho từng hàng hóa (Giá gốc nhân số lượng)
            const rowSubtotal = (item.price || 0) * (item.qty || 1);
            
            // Phân loại nhãn hiển thị đối tượng (Khách/Vé) dựa vào loại hình lưu trữ
            const labelType = (item.type === 'tour') ? 'Khách người lớn' : 'Vé';

            return `
                <div class="cart-item-row">
                    <div class="item-img-wrap">
                        <img src="${item.image || 'https://via.placeholder.com/140x95?text=No+Image'}" 
                            alt="Thumb"
                            onerror="this.onerror=null;this.src='https://via.placeholder.com/140x95?text=No+Image';">
                    </div>

                    <div class="item-details">
                        <a href="chi-tiet-tour.html?id=${item.id}" class="item-title">${item.title}</a>
                        <div class="item-meta">
                            <span>📅 Ngày khởi hành/sử dụng: <b>${item.date}</b></span>
                        </div>
                        
                        <div class="item-qty-zone">
                            <span style="font-size: 14px; color:#4a5568;">Số lượng:</span>
                            <button class="btn-cart-qty" onclick="changeCartQty(${index}, -1)">-</button>
                            <span class="cart-qty-number">${item.qty}</span>
                            <button class="btn-cart-qty" onclick="changeCartQty(${index}, 1)">+</button>
                        </div>
                    </div>

                    <div class="item-price-zone">
                        <button class="btn-remove-item" onclick="deleteCartItem(${index})" title="Xóa dịch vụ này">✕</button>
                        <span class="unit-price">Đơn giá: ${(item.price || 0).toLocaleString('vi-VN')}đ</span>
                        <span class="subtotal-price">${rowSubtotal.toLocaleString('vi-VN')}đ</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    // 4. TÍNH TOÁN TỔNG TIỀN CHO CỘT BÊN PHẢI
    calculateCartTotal(cart);
}

// =========================================================================
// CÁC HÀM PHỤ TRỢ: TĂNG GIẢM, XÓA, TÍNH TỔNG TỔNG TIỀN
// =========================================================================

// 1. Hàm tăng giảm số lượng trực tiếp trong giỏ
window.changeCartQty = function(index, delta) {
    let cart = JSON.parse(localStorage.getItem('travelCart')) || [];
    if(!cart[index]) return;

    cart[index].qty = (cart[index].qty || 1) + delta;
    
    // Khóa chặn: Số lượng không được nhỏ hơn 1
    if (cart[index].qty < 1) cart[index].qty = 1;

    // Lưu lại vào bộ nhớ và vẽ lại màn hình
    localStorage.setItem('travelCart', JSON.stringify(cart));
    renderCartPage();

    // Giật chấm đỏ giỏ hàng ở Header chạy theo
    if (typeof updateCartBadge === 'function') updateCartBadge();
};

// 2. Hàm Xóa mặt hàng kèm popup SweetAlert2 chuyên nghiệp
window.deleteCartItem = function(index) {
    let cart = JSON.parse(localStorage.getItem('travelCart')) || [];
    if(!cart[index]) return;

    Swal.fire({
        title: 'Gỡ dịch vụ này?',
        text: `Bạn muốn xóa [ ${cart[index].title} ] khỏi danh sách thanh toán?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e53e3e',
        cancelButtonColor: '#718096',
        confirmButtonText: 'Đồng ý xóa',
        cancelButtonText: 'Hủy bỏ',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            cart.splice(index, 1); // Cắt bỏ phần tử
            localStorage.setItem('travelCart', JSON.stringify(cart)); // Lưu lại
            renderCartPage(); // Cập nhật màn hình
            
            // Giật chấm đỏ giỏ hàng ở Header chạy theo
            if (typeof updateCartBadge === 'function') updateCartBadge();
        }
    });
};

// 3. Hàm cộng dồn tính tổng tiền
function calculateCartTotal(cart) {
    let total = 0;
    cart.forEach(item => {
        total += (item.price || 0) * (item.qty || 1);
    });

    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total-price');

    if(subtotalEl) subtotalEl.innerText = total.toLocaleString('vi-VN') + 'đ';
    if(totalEl) totalEl.innerText = total.toLocaleString('vi-VN') + 'đ';
}