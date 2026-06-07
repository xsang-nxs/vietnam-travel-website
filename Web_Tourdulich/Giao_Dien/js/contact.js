// =========================================================================
// CONTACT.JS - XỬ LÝ FORM LIÊN HỆ THE3COACHROCK
// =========================================================================

const CONTACT_INFO = {
    address: '123 Đường Nguyễn Văn Cừ, Quận 1, TP. Hồ Chí Minh',
    hotline: '1900 1234 (Hỗ trợ 24/7)',
    email: 'contact@the3coachrock.com'
};

function showContactAlert(title, text, icon = 'info') {
    if (typeof Swal !== 'undefined') {
        return Swal.fire({
            title,
            text,
            icon,
            confirmButtonColor: '#1a4fa0',
            confirmButtonText: 'Đã hiểu'
        });
    }

    alert(`${title}\n${text}`);
    return Promise.resolve();
}

function getContactInputValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

function saveContactRequest(data) {
    const oldRequests = JSON.parse(localStorage.getItem('contactRequests')) || [];
    oldRequests.unshift(data);
    localStorage.setItem('contactRequests', JSON.stringify(oldRequests));
}

function validateContactForm(data) {
    if (!data.name || !data.email || !data.phone || !data.message) {
        return {
            valid: false,
            title: 'Thiếu thông tin!',
            message: 'Vui lòng nhập đầy đủ họ tên, email, số điện thoại và lời nhắn.'
        };
    }

    if (data.name.length < 2) {
        return {
            valid: false,
            title: 'Họ tên không hợp lệ!',
            message: 'Họ tên phải có ít nhất 2 ký tự.'
        };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(data.email)) {
        return {
            valid: false,
            title: 'Email không hợp lệ!',
            message: 'Vui lòng nhập đúng cấu trúc email. Ví dụ: contact@gmail.com'
        };
    }

    const phoneRegex = /^0\d{9}$/;

    if (!phoneRegex.test(data.phone)) {
        return {
            valid: false,
            title: 'Số điện thoại không hợp lệ!',
            message: 'Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng số 0. Ví dụ: 0901234567'
        };
    }

    if (data.message.length < 10) {
        return {
            valid: false,
            title: 'Lời nhắn quá ngắn!',
            message: 'Vui lòng nhập lời nhắn chi tiết hơn, tối thiểu 10 ký tự.'
        };
    }

    return {
        valid: true
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const addressEl = document.getElementById('contact-address');
    const hotlineEl = document.getElementById('contact-hotline');
    const emailEl = document.getElementById('contact-email');

    if (addressEl) addressEl.innerText = CONTACT_INFO.address;
    if (hotlineEl) hotlineEl.innerText = CONTACT_INFO.hotline;
    if (emailEl) emailEl.innerText = CONTACT_INFO.email;

    const contactForm = document.getElementById('contact-form');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const contactData = {
            id: 'CONTACT-' + Date.now(),
            name: getContactInputValue('contact-name-input'),
            email: getContactInputValue('contact-email-input'),
            phone: getContactInputValue('contact-phone-input'),
            subject: getContactInputValue('contact-subject-input') || 'Tư vấn đặt tour',
            message: getContactInputValue('contact-message-input'),
            createdAt: new Date().toLocaleString('vi-VN'),
            status: 'Chưa xử lý'
        };

        const check = validateContactForm(contactData);

        if (!check.valid) {
            showContactAlert(check.title, check.message, 'warning');
            return;
        }

        saveContactRequest(contactData);

        await showContactAlert(
            'Gửi yêu cầu thành công!',
            'Cảm ơn bạn đã liên hệ The3Coachrock. Chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất.',
            'success'
        );

        contactForm.reset();
    });
});