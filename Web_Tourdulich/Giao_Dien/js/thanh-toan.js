// Bộ não xử lý của trang thanh toán động (thanh-toan.js)

let checkoutItems = []; // Danh sách các tour đang được thanh toán
let baseCheckoutPrice = 0; // Tổng tiền gốc của đơn hàng
let passengerCounts = { adult: 1, child: 0, toddler: 0, infant: 0 }; 

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. TẢI DỮ LIỆU TỪ CÂY CẦU NỐI 'checkoutData'
    checkoutItems = JSON.parse(localStorage.getItem('checkoutData')) || [];
    
    if (checkoutItems.length === 0) {
        Swal.fire({
            title: 'Lỗi đơn hàng!',
            text: 'Không tìm thấy dữ liệu thanh toán. Vui lòng chọn tour lại.',
            icon: 'error',
            confirmButtonColor: '#1a4fa0'
        }).then(() => { window.location.href = 'main.html'; });
        return;
    }

    // 2. TÍNH TỔNG TIỀN GỐC CỦA TẤT CẢ CÁC MÓN TRONG ĐƠN HÀNG
    baseCheckoutPrice = checkoutItems.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);

    // 3. ĐỔ DỮ LIỆU VÀO SIDEBAR TÓM TẮT PHỤ THUỘC VÀO SỐ LƯỢNG MÓN
    if (checkoutItems.length === 1) {
        // Nếu chỉ có 1 tour (Từ nút Đặt Ngay)
        document.getElementById('sum-tour-title').innerText = checkoutItems[0].title;
        document.getElementById('sum-tour-img').src = checkoutItems[0].image || 'https://via.placeholder.com/80';
        document.getElementById('sum-tour-code').innerText = `Mã đơn: TRV-${checkoutItems[0].id}X-CHECKOUT`;
    } else {
        // Nếu có nhiều tour (Từ Giỏ hàng)
        document.getElementById('sum-tour-title').innerText = `Đơn hàng gồm ${checkoutItems.length} dịch vụ`;
        document.getElementById('sum-tour-img').src = checkoutItems[0].image || 'https://via.placeholder.com/80';
        document.getElementById('sum-tour-code').innerText = `Mã đơn: MULTI-${checkoutItems.length}-ITEMS`;
    }

    // Khởi chạy giao diện động
    renderPassengerInputs();
    recalculateCheckoutPrices();

    // 5. NÚT TIẾP TỤC SANG BƯỚC THANH TOÁN
    const btnFinalPay = document.getElementById('btn-final-pay');
    if (btnFinalPay) {
        btnFinalPay.addEventListener('click', () => {
            const name = document.getElementById('contact-name').value.trim();
            const phone = document.getElementById('contact-phone').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            // 1. LẤY THÊM DỮ LIỆU TỪ Ô ĐỊA CHỈ
            const addressInput = document.getElementById('contact-address');
            const address = addressInput ? addressInput.value.trim() : 'Chưa cập nhật';
            const chkTerms = document.getElementById('chk-terms').checked;

            if (!name || !phone || !email) {
                Swal.fire('Thiếu thông tin!', 'Vui lòng điền đầy đủ các ô có dấu (*) đỏ.', 'warning');
                return;
            }

            // Kiểm tra email bắt buộc đúng dạng ...@gmail.com
            const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

            if (!gmailRegex.test(email)) {
                Swal.fire({
                    title: 'Email không hợp lệ!',
                    text: 'Email phải đúng cấu trúc và kết thúc bằng @gmail.com. Ví dụ: nguyenvana@gmail.com',
                    icon: 'warning',
                    confirmButtonText: 'Nhập lại'
                });

                document.getElementById('contact-email').focus();
                return;
            }

            // Kiểm tra số điện thoại Việt Nam: bắt đầu bằng 0 và đủ 10 số
            const phoneRegex = /^0\d{9}$/;

            if (!phoneRegex.test(phone)) {
                Swal.fire({
                    title: 'Số điện thoại không hợp lệ!',
                    text: 'Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng số 0. Ví dụ: 0901234567',
                    icon: 'warning',
                    confirmButtonText: 'Nhập lại'
                });

                document.getElementById('contact-phone').focus();
                return;
            }

            if (!chkTerms) {
                Swal.fire('Chính sách!', 'Bạn phải tích đồng ý với các điều khoản.', 'warning');
                return;
            }

            const rawImage = checkoutItems[0].image || '';
            const validImage = (rawImage.startsWith('http') || rawImage.startsWith('.') || rawImage.includes('/')) ? rawImage : 'https://via.placeholder.com/80?text=Error';
           // 2. GÓI ĐỊA CHỈ VÀO BỘ NHỚ
            const orderInfo = {
                name: name,
                phone: phone,
                email: email,
                address: address, // Đã bổ sung địa chỉ
                passengers: passengerCounts,
                finalTotal: document.getElementById('final-total-price').innerText,
                tourImage: validImage 
            };
            localStorage.setItem('pendingOrderInfo', JSON.stringify(orderInfo));
            
            // CHUYỂN HƯỚNG SANG TRANG SỐ 2 (XÁC NHẬN)
            window.location.href = 'xac-nhan.html';
        });
    }
});

// =========================================================================
// HÀM TĂNG GIẢM SỐ LƯỢNG KHÁCH
// =========================================================================
window.updatePassengerQty = function(type, delta) {
    passengerCounts[type] += delta;
    if (type === 'adult' && passengerCounts['adult'] < 1) passengerCounts['adult'] = 1;
    if (type !== 'adult' && passengerCounts[type] < 0) passengerCounts[type] = 0;

    document.getElementById(`qty-${type}`).innerText = passengerCounts[type];
    renderPassengerInputs();
    recalculateCheckoutPrices();
};

// =========================================================================
// HÀM TỰ ĐỘNG SINH Ô NHẬP TÊN HÀNH KHÁCH THEO THỜI GIAN THỰC
// =========================================================================
function renderPassengerInputs() {
    const container = document.getElementById('dynamic-passenger-inputs');
    if (!container) return;
    container.innerHTML = ''; 

    let index = 1;
    for (let i = 1; i <= passengerCounts.adult; i++) {
        container.insertAdjacentHTML('beforeend', createPassengerRowHtml(`Người lớn #${i}`, index++));
    }
    for (let i = 1; i <= passengerCounts.child; i++) {
        container.insertAdjacentHTML('beforeend', createPassengerRowHtml(`Trẻ em #${i}`, index++, false));
    }
    for (let i = 1; i <= passengerCounts.toddler; i++) {
        container.insertAdjacentHTML('beforeend', createPassengerRowHtml(`Trẻ nhỏ #${i}`, index++, false));
    }
    for (let i = 1; i <= passengerCounts.infant; i++) {
        container.insertAdjacentHTML('beforeend', createPassengerRowHtml(`Em bé #${i}`, index++, false));
    }
}

function createPassengerRowHtml(label, globalIndex, isAdult = true) {
    return `
        <div class="passenger-input-row">
            <span class="passenger-title-tag">#${globalIndex} ${label}</span>
            <input type="text" placeholder="Họ và tên *" style="flex: 1; padding: 10px 12px; font-size:13px;" required>
            ${isAdult ? `
                <div class="switch-box">
                    <span>Phòng đơn</span>
                    <label class="switch">
                        <input type="checkbox" class="surcharge-switch" onclick="recalculateCheckoutPrices()">
                        <span class="slider"></span>
                    </label>
                </div>
            ` : ''}
        </div>
    `;
}

// =========================================================================
// HÀM TỰ ĐỘNG TÍNH TOÁN BẢNG GIÁ THEO ĐỘ TUỔI VÀ ĐƠN HÀNG MULTI
// =========================================================================
window.recalculateCheckoutPrices = function(discountAmount = 0) {
    // Dùng tổng tiền gốc của tất cả các tour làm cơ sở nhân hệ số
    const pAdult = baseCheckoutPrice; 
    const pChild = Math.round((baseCheckoutPrice * 0.85) / 1000) * 1000;  
    const pToddler = Math.round((baseCheckoutPrice * 0.5) / 1000) * 1000; 
    const pInfant = 400000;   
    const pSurchargeUnit = 1200000; 

    const activeSwitches = document.querySelectorAll('.surcharge-switch:checked').length;
    const totalSurchargeCost = activeSwitches * pSurchargeUnit;

    const costAdult = passengerCounts.adult * pAdult;
    const costChild = passengerCounts.child * pChild;
    const costToddler = passengerCounts.toddler * pToddler;
    const costInfant = passengerCounts.infant * pInfant;

    let finalTotal = costAdult + costChild + costToddler + costInfant + totalSurchargeCost - discountAmount;
    if (finalTotal < 0) finalTotal = 0; 

    const rowsContainer = document.getElementById('price-detail-rows');
    if (rowsContainer) {
        rowsContainer.innerHTML = `
            <div class="cost-row-detail"><span>Người lớn (${passengerCounts.adult} x ${pAdult.toLocaleString()}đ):</span> <b>${costAdult.toLocaleString()}đ</b></div>
            ${passengerCounts.child > 0 ? `<div class="cost-row-detail"><span>Trẻ em (${passengerCounts.child} x ${pChild.toLocaleString()}đ):</span> <b>${costChild.toLocaleString()}đ</b></div>` : ''}
            ${passengerCounts.toddler > 0 ? `<div class="cost-row-detail"><span>Trẻ nhỏ (${passengerCounts.toddler} x ${pToddler.toLocaleString()}đ):</span> <b>${costToddler.toLocaleString()}đ</b></div>` : ''}
            ${passengerCounts.infant > 0 ? `<div class="cost-row-detail"><span>Em bé (${passengerCounts.infant} x ${pInfant.toLocaleString()}đ):</span> <b>${costInfant.toLocaleString()}đ</b></div>` : ''}
            ${totalSurchargeCost > 0 ? `<div class="cost-row-detail"><span>Phụ thu phòng đơn (${activeSwitches} x ${pSurchargeUnit.toLocaleString()}đ):</span> <b style="color:#1a4fa0;">+${totalSurchargeCost.toLocaleString()}đ</b></div>` : ''}
            ${discountAmount > 0 ? `<div class="cost-row-detail"><span>Mã giảm giá (VIETRAVEL100):</span> <b style="color:#2e7d32;">-${discountAmount.toLocaleString()}đ</b></div>` : ''}
        `;
    }

    document.getElementById('cart-subtotal') ? document.getElementById('cart-subtotal').innerText = finalTotal.toLocaleString('vi-VN') + 'đ' : null;
    document.getElementById('final-total-price').innerText = finalTotal.toLocaleString('vi-VN') + 'đ';
}