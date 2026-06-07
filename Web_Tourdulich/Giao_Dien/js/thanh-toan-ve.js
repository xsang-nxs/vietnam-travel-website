// Bộ não xử lý trang điền thông tin vé (thanh-toan-ve.js)

document.addEventListener('DOMContentLoaded', () => {
    // 1. LẤY DỮ LIỆU VÉ TỪ LOCALSTORAGE
    const checkoutTickets = JSON.parse(localStorage.getItem('checkoutTicketsData')) || [];
    
    if (checkoutTickets.length === 0) {
        Swal.fire('Giỏ vé trống!', 'Vui lòng quay lại chọn vé tham quan.', 'warning')
            .then(() => { window.location.href = 've-tham-quan.html'; });
        return;
    }

    // 2. IN DANH SÁCH VÉ RA SIDEBAR BÊN PHẢI
    const listContainer = document.getElementById('ticket-summary-list');
    let totalAllTickets = 0;

    if (listContainer) {
        listContainer.innerHTML = checkoutTickets.map(ticket => {
            const rowTotal = ticket.price * ticket.qty;
            totalAllTickets += rowTotal;

            // Định dạng ngày sang tiếng Việt
            const d = new Date(ticket.date);
            const dateStr = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

            return `
                <div style="padding: 12px 0; border-bottom: 1px dashed #eee; font-size: 13px; line-height: 1.5;">
                    <strong style="color: #1a4fa0; display: block; font-size: 14px; margin-bottom: 4px;">${ticket.title}</strong>
                    <div style="display: flex; justify-content: space-between; color: #666; margin-bottom: 4px;">
                        <span>Ngày sử dụng: ${dateStr}</span>
                        <span>Đối tượng: ${ticket.type}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-weight: bold;">
                        <span>SL: ${ticket.qty} x ${ticket.price.toLocaleString()}đ</span>
                        <span style="color: #d32f2f;">${rowTotal.toLocaleString()}đ</span>
                    </div>
                </div>
            `;
        }).join('');

        // Cập nhật giá tổng
        document.getElementById('ticket-final-price').innerText = totalAllTickets.toLocaleString('vi-VN') + 'đ';
    }

    // 3. XỬ LÝ NÚT CHUYỂN SANG BƯỚC XÁC NHẬN (BƯỚC 2)
    const btnNext = document.getElementById('btn-ticket-next');
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            const name = document.getElementById('ticket-user-name').value.trim();
            const phone = document.getElementById('ticket-user-phone').value.trim();
            const email = document.getElementById('ticket-user-email').value.trim();
            const address = document.getElementById('ticket-user-address').value.trim();
            const chkTerms = document.getElementById('ticket-chk-terms').checked;

            if (!name || !phone || !email) {
                Swal.fire('Thiếu thông tin!', 'Vui lòng nhập các ô bắt buộc (*)', 'warning');
                return;
            }

            // Kiểm tra email đúng cấu trúc cơ bản
            // Ví dụ hợp lệ: duong@gmail.com, abc@yahoo.com, user123@outlook.com
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                Swal.fire({
                    title: 'Email không hợp lệ!',
                    text: 'Vui lòng nhập đúng cấu trúc email. Ví dụ: duong@gmail.com',
                    icon: 'warning',
                    confirmButtonText: 'Nhập lại'
                });

                document.getElementById('ticket-user-email').focus();
                return;
            }

            // Kiểm tra số điện thoại: bắt đầu bằng 0 và đủ 10 số
            const phoneRegex = /^0\d{9}$/;

            if (!phoneRegex.test(phone)) {
                Swal.fire({
                    title: 'Số điện thoại không hợp lệ!',
                    text: 'Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng số 0. Ví dụ: 0393742171',
                    icon: 'warning',
                    confirmButtonText: 'Nhập lại'
                });

                document.getElementById('ticket-user-phone').focus();
                return;
            }

            if (!chkTerms) {
                Swal.fire('Điều khoản!', 'Bạn phải đồng ý với điều khoản mua vé.', 'warning');
                return;
            }

            // Đóng gói thông tin khách hàng mua vé
            const ticketOrderInfo = {
                name: name,
                phone: phone,
                email: email,
                address: address,
                finalTotal: totalAllTickets.toLocaleString('vi-VN') + 'đ'
            };

            localStorage.setItem('pendingTicketOrderInfo', JSON.stringify(ticketOrderInfo));
            
            // Chuyển sang trang hóa đơn cuối cùng của vé
            window.location.href = 'xac-nhan-ve.html';
        });
    }
});