// =================================================================
// XAC-NHAN.JS - XỬ LÝ TRANG XÁC NHẬN THANH TOÁN TOUR
// =================================================================

// =======================================================
// HÀM TIỆN ÍCH CHUNG
// =======================================================

function safeJsonParse(value, fallback = null) {
    try {
        return JSON.parse(value);
    } catch (error) {
        return fallback;
    }
}

function setText(id, value, fallback = '...') {
    const el = document.getElementById(id);
    if (el) {
        el.innerText = value || fallback;
    }
}

function getText(id, fallback = 'Chưa cập nhật') {
    const el = document.getElementById(id);
    return el ? (el.innerText.trim() || fallback) : fallback;
}

function formatNowDateTime() {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hour}:${minute}`;
}

function safePdfText(value, fallback = 'Chưa cập nhật') {
    const text = String(value ?? '').trim();
    return text || fallback;
}

function safePdfFileName(value) {
    return String(value || 'HoaDon')
        .replace(/[^\w\-]+/g, '_')
        .replace(/_+/g, '_');
}

function getBestAddress(orderInfo) {
    return (
        orderInfo?.address ||
        orderInfo?.customerAddress ||
        orderInfo?.contactAddress ||
        orderInfo?.fullAddress ||
        orderInfo?.diaChi ||
        document.getElementById('conf-address')?.innerText ||
        'Chưa cập nhật'
    );
}

function getPaymentMethodTextFromUI() {
    const activeRadio = document.querySelector('input[name="payment_method"]:checked');

    if (!activeRadio) {
        return 'Thanh toán Online';
    }

    const type = activeRadio.getAttribute('data-type');

    if (type === 'vnpay') return 'VNPay (Quét QR)';
    if (type === 'vnpay_card') return 'Thẻ ATM (VNPay)';
    if (type === 'momo') return 'Ví MoMo';
    if (type === 'zalopay') return 'ZaloPay';
    if (type === 'visa') return 'Thẻ Visa';
    if (type === 'mastercard') return 'Mastercard';
    if (type === 'jcb') return 'Thẻ JCB';

    return 'Thanh toán Online';
}

function downloadPdfMakeFile(docDefinition, fileName) {
    return new Promise((resolve, reject) => {
        try {
            if (typeof pdfMake === 'undefined') {
                reject(new Error('Chưa tải thư viện pdfMake. Kiểm tra lại file xac-nhan.html đã import pdfMake chưa.'));
                return;
            }

            pdfMake.createPdf(docDefinition).download(fileName, () => {
                resolve();
            });

        } catch (error) {
            reject(error);
        }
    });
}

// =======================================================
// TẠO NỘI DUNG HÓA ĐƠN PDF BẰNG PDFMAKE
// =======================================================

function buildTourInvoiceDoc(data) {
    const orderCode = safePdfText(data.bookingCode, 'MA-TOUR');
    const createdAt = safePdfText(data.createdAt, new Date().toLocaleString('vi-VN'));
    const customerName = safePdfText(data.customerName, 'Khách hàng');
    const customerEmail = safePdfText(data.customerEmail);
    const customerPhone = safePdfText(data.customerPhone);
    const customerAddress = safePdfText(data.customerAddress);
    const paymentMethod = safePdfText(data.paymentMethod, 'Thanh toán Online');
    const tourTitle = safePdfText(data.tourTitle, 'Tour du lịch');
    const totalAmount = safePdfText(data.totalAmount, '0đ');

    return {
        pageSize: 'A4',
        pageMargins: [40, 36, 40, 40],

        defaultStyle: {
            font: 'Roboto',
            fontSize: 10,
            color: '#2d3748',
            lineHeight: 1.25
        },

        content: [
            {
                columns: [
                    {
                        width: '*',
                        stack: [
                            {
                                text: 'THE3COACHROCK',
                                fontSize: 24,
                                bold: true,
                                color: '#1a4fa0',
                                margin: [0, 0, 0, 2]
                            },
                            {
                                text: 'TOURIST & TRAVEL SERVICES',
                                fontSize: 9,
                                letterSpacing: 1.5,
                                color: '#4a5568'
                            }
                        ]
                    },
                    {
                        width: 190,
                        stack: [
                            {
                                text: 'HÓA ĐƠN ĐẶT TOUR',
                                alignment: 'right',
                                fontSize: 16,
                                bold: true,
                                color: '#b82025',
                                margin: [0, 2, 0, 4]
                            },
                            {
                                text: `Mã đơn: ${orderCode}`,
                                alignment: 'right',
                                fontSize: 10,
                                color: '#4a5568'
                            }
                        ]
                    }
                ]
            },

            {
                canvas: [
                    {
                        type: 'line',
                        x1: 0,
                        y1: 0,
                        x2: 515,
                        y2: 0,
                        lineWidth: 1,
                        lineColor: '#e2e8f0'
                    }
                ],
                margin: [0, 18, 0, 18]
            },

            {
                table: {
                    widths: ['50%', '50%'],
                    body: [
                        [
                            {
                                stack: [
                                    { text: 'THÔNG TIN KHÁCH HÀNG', style: 'sectionTitle' },
                                    {
                                        table: {
                                            widths: [95, '*'],
                                            body: [
                                                ['Họ tên:', { text: customerName, bold: true }],
                                                ['Điện thoại:', customerPhone],
                                                ['Email:', customerEmail],
                                                ['Địa chỉ:', customerAddress]
                                            ]
                                        },
                                        layout: 'noBorders'
                                    }
                                ],
                                margin: [12, 10, 12, 10]
                            },
                            {
                                stack: [
                                    { text: 'THÔNG TIN THANH TOÁN', style: 'sectionTitle' },
                                    {
                                        table: {
                                            widths: [95, '*'],
                                            body: [
                                                ['Ngày lập:', createdAt],
                                                ['Trạng thái:', { text: 'Chờ xác nhận', bold: true, color: '#d69e2e' }],
                                                ['Phương thức:', paymentMethod],
                                                ['Loại dịch vụ:', 'Đặt tour du lịch']
                                            ]
                                        },
                                        layout: 'noBorders'
                                    }
                                ],
                                margin: [12, 10, 12, 10]
                            }
                        ]
                    ]
                },
                layout: {
                    hLineWidth: () => 1,
                    vLineWidth: () => 1,
                    hLineColor: () => '#edf2f7',
                    vLineColor: () => '#edf2f7',
                    fillColor: () => '#ffffff'
                },
                margin: [0, 0, 0, 18]
            },

            {
                text: 'CHI TIẾT DỊCH VỤ',
                style: 'sectionTitle',
                margin: [0, 0, 0, 8]
            },

            {
                table: {
                    headerRows: 1,
                    widths: [30, '*', 80, 100],
                    body: [
                        [
                            { text: 'STT', style: 'tableHeader', alignment: 'center' },
                            { text: 'Tên dịch vụ', style: 'tableHeader' },
                            { text: 'Số lượng', style: 'tableHeader', alignment: 'center' },
                            { text: 'Thành tiền', style: 'tableHeader', alignment: 'right' }
                        ],
                        [
                            { text: '1', alignment: 'center' },
                            { text: tourTitle, bold: true, color: '#1a4fa0' },
                            { text: '01', alignment: 'center' },
                            { text: totalAmount, alignment: 'right', bold: true }
                        ],
                        [
                            {
                                text: 'Tổng thanh toán',
                                colSpan: 3,
                                alignment: 'right',
                                bold: true,
                                fontSize: 11,
                                fillColor: '#f8fafc',
                                margin: [0, 4, 0, 4]
                            },
                            {},
                            {},
                            {
                                text: totalAmount,
                                alignment: 'right',
                                bold: true,
                                color: '#b82025',
                                fontSize: 12,
                                fillColor: '#f8fafc',
                                margin: [0, 4, 0, 4]
                            }
                        ]
                    ]
                },
                layout: {
                    hLineWidth: () => 1,
                    vLineWidth: () => 1,
                    hLineColor: () => '#e2e8f0',
                    vLineColor: () => '#e2e8f0',
                    fillColor: (rowIndex) => rowIndex === 0 ? '#f1f5f9' : null
                },
                margin: [0, 0, 0, 18]
            },

            {
                stack: [
                    {
                        text: 'Ghi chú',
                        bold: true,
                        color: '#1a4fa0',
                        margin: [0, 0, 0, 4]
                    },
                    {
                        text: 'Quý khách vui lòng giữ hóa đơn này để đối chiếu thông tin khi cần hỗ trợ. Hóa đơn điện tử được tạo tự động từ hệ thống The3Coachrock.',
                        color: '#718096',
                        fontSize: 9
                    }
                ],
                margin: [0, 0, 0, 24]
            },

            {
                table: {
                    widths: ['*'],
                    body: [
                        [
                            {
                                text: 'Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ của The3Coachrock.',
                                alignment: 'center',
                                bold: true,
                                color: '#1a4fa0',
                                margin: [0, 10, 0, 10]
                            }
                        ]
                    ]
                },
                layout: {
                    hLineWidth: () => 0,
                    vLineWidth: () => 0,
                    fillColor: () => '#eaf2ff'
                }
            }
        ],

        footer: function (currentPage, pageCount) {
            return {
                columns: [
                    {
                        text: 'The3Coachrock - 123 Đường Nguyễn Văn Cừ, Quận 1, TP. Hồ Chí Minh',
                        margin: [40, 0, 0, 0],
                        fontSize: 8,
                        color: '#718096'
                    },
                    {
                        text: `Trang ${currentPage}/${pageCount}`,
                        alignment: 'right',
                        margin: [0, 0, 40, 0],
                        fontSize: 8,
                        color: '#718096'
                    }
                ]
            };
        },

        styles: {
            sectionTitle: {
                fontSize: 11,
                bold: true,
                color: '#1a4fa0',
                margin: [0, 0, 0, 8]
            },
            tableHeader: {
                bold: true,
                color: '#2d3748',
                fontSize: 10
            }
        }
    };
}

async function exportTourInvoicePDF(data, showSuccess = false) {
    const docDefinition = buildTourInvoiceDoc(data);
    const safeCode = safePdfFileName(data.bookingCode || 'Tour');
    const fileName = `Hoa-Don-Tour-${safeCode}.pdf`;

    await downloadPdfMakeFile(docDefinition, fileName);

    if (showSuccess) {
        Swal.fire({
            title: 'Tải thành công!',
            text: 'Hóa đơn đặt tour PDF đã được tải xuống máy của bạn.',
            icon: 'success',
            confirmButtonColor: '#2e7d32'
        });
    }
}

// =======================================================
// XỬ LÝ GIAO DIỆN THANH TOÁN QR / THẺ
// =======================================================

function updatePaymentUI() {
    const activeRadio = document.querySelector('input[name="payment_method"]:checked');

    if (!activeRadio) {
        return;
    }

    const method = activeRadio.value;
    const type = activeRadio.getAttribute('data-type');

    const displayArea = document.getElementById('payment-display-area');
    const areaQr = document.getElementById('area-qr');
    const areaCard = document.getElementById('area-card');
    const imgQr = document.getElementById('img-qr');
    const qrName = document.getElementById('qr-name');

    if (displayArea) {
        displayArea.style.display = 'block';
    }

    if (method === 'qr') {
        if (areaQr) areaQr.style.display = 'block';
        if (areaCard) areaCard.style.display = 'none';

        if (imgQr) {
            imgQr.src = 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg';
        }

        if (qrName) {
            if (type === 'momo') {
                qrName.innerText = 'QUÉT MÃ VÍ MOMO';
                qrName.style.color = '#a50064';
            } else if (type === 'zalopay') {
                qrName.innerText = 'QUÉT MÃ ZALOPAY';
                qrName.style.color = '#008fe5';
            } else {
                qrName.innerText = 'QUÉT MÃ VNPAY-QR';
                qrName.style.color = '#005aab';
            }
        }

    } else if (method === 'card') {
        if (areaQr) areaQr.style.display = 'none';
        if (areaCard) areaCard.style.display = 'block';
    }
}

// =======================================================
// DOM READY
// =======================================================

document.addEventListener('DOMContentLoaded', () => {
    const orderInfo = safeJsonParse(localStorage.getItem('pendingOrderInfo'));
    const checkoutItems = safeJsonParse(localStorage.getItem('checkoutData'));

    if (!orderInfo || !checkoutItems) {
        window.location.href = 'main.html';
        return;
    }

    const bestAddress = getBestAddress(orderInfo);

    const formattedDate = formatNowDateTime();
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const bookingCode = `3COACH-${randomCode}VN`;

    const tourTitle = Array.isArray(checkoutItems) && checkoutItems.length === 1
        ? (checkoutItems[0].title || 'Tour du lịch')
        : `Đơn hàng gồm ${Array.isArray(checkoutItems) ? checkoutItems.length : 0} dịch vụ`;

    // 1. Đổ dữ liệu liên lạc ra giao diện
    setText('conf-name', orderInfo.name, '...');
    setText('conf-email', orderInfo.email, '...');
    setText('conf-phone', orderInfo.phone, '...');
    setText('conf-address', bestAddress, 'Chưa cập nhật');
    setText('conf-total', orderInfo.finalTotal, '0đ');
    setText('final-pay-amount', orderInfo.finalTotal, '0đ');
    setText('conf-date', formattedDate, '...');
    setText('conf-code', bookingCode, '...');

    // 2. Đổ thông tin tour ở sidebar
    setText('sum-tour-title', tourTitle, 'Tour du lịch');

    const sumImg = document.getElementById('sum-tour-img');

    if (sumImg) {
        const placeholder = 'https://via.placeholder.com/80?text=No+Image';
        const finalImgUrl = orderInfo.tourImage || (checkoutItems[0] && checkoutItems[0].image) || placeholder;

        sumImg.src = finalImgUrl;

        sumImg.onerror = function () {
            this.onerror = null;
            this.src = placeholder;
        };
    }

    // 3. Kích hoạt giao diện chọn phương thức thanh toán
    document.querySelectorAll('input[name="payment_method"]').forEach(radio => {
        radio.addEventListener('change', updatePaymentUI);
    });

    updatePaymentUI();

    // =======================================================
    // 4. NÚT THANH TOÁN
    // Luồng đã sửa:
    // POST đơn thành công -> Hiện thông báo 4s -> Sau đó mới tải PDF
    // =======================================================

    const btnPay = document.getElementById('btn-process-payment');

    if (btnPay) {
        btnPay.addEventListener('click', async () => {
            const paymentMethodText = getPaymentMethodTextFromUI();

            const newBookingData = {
                id: bookingCode,
                createdAt: formattedDate,
                customerName: orderInfo.name || 'Khách ẩn danh',
                customerEmail: orderInfo.email || 'Chưa cập nhật',
                customerPhone: orderInfo.phone || 'Chưa cập nhật',
                customerAddress: bestAddress,
                paymentMethod: paymentMethodText,
                tourTitle: tourTitle,
                totalAmount: orderInfo.finalTotal || '0đ',
                passengers: orderInfo.passengers || {},
                status: 'Chờ xác nhận'
            };

            Swal.fire({
                title: 'Đang xử lý giao dịch...',
                html: 'Hệ thống đang ghi nhận đơn đặt tour của bạn...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                const response = await fetch('http://localhost:3001/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newBookingData)
                });

                if (!response.ok) {
                    throw new Error('Không thể lưu đơn đặt tour lên hệ thống.');
                }

                // Quan trọng:
                // KHÔNG tải PDF ở đây.
                // Phải hiện thông báo thành công trước.
                Swal.fire({
                    title: 'Thanh toán thành công! 🎉',
                    text: 'Đơn đặt tour của bạn đã được ghi nhận. Hệ thống sẽ tải hóa đơn PDF sau vài giây.',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 20000,
                    timerProgressBar: true,
                    allowOutsideClick: false
                }).then(async () => {
                    try {
                        await exportTourInvoicePDF({
                            bookingCode: bookingCode,
                            createdAt: formattedDate,
                            customerName: orderInfo.name || 'Khách hàng',
                            customerEmail: orderInfo.email || 'Chưa cập nhật',
                            customerPhone: orderInfo.phone || 'Chưa cập nhật',
                            customerAddress: bestAddress,
                            paymentMethod: paymentMethodText,
                            tourTitle: tourTitle,
                            totalAmount: orderInfo.finalTotal || '0đ'
                        });

                        localStorage.removeItem('pendingOrderInfo');
                        localStorage.removeItem('checkoutData');

                        if (localStorage.getItem('isCartCheckout') === 'true') {
                            localStorage.removeItem('travelCart');
                        }

                        localStorage.removeItem('isCartCheckout');

                        setTimeout(() => {
                            window.location.href = 'main.html';
                        }, 700);

                    } catch (pdfError) {
                        console.error('Lỗi tải hóa đơn PDF:', pdfError);

                        Swal.fire({
                            title: 'Đơn đã được ghi nhận!',
                            text: 'Đơn hàng đã lưu thành công nhưng hệ thống chưa tải được hóa đơn PDF.',
                            icon: 'warning',
                            confirmButtonColor: '#1a4fa0'
                        }).then(() => {
                            localStorage.removeItem('pendingOrderInfo');
                            localStorage.removeItem('checkoutData');
                            localStorage.removeItem('isCartCheckout');

                            window.location.href = 'main.html';
                        });
                    }
                });

            } catch (error) {
                console.error('Lỗi thanh toán:', error);

                Swal.fire({
                    title: 'Lỗi hệ thống!',
                    text: error.message || 'Không thể kết nối tới server. Vui lòng kiểm tra lại json-server.',
                    icon: 'error',
                    confirmButtonColor: '#b82025'
                });
            }
        });
    }

    // =======================================================
    // 5. NÚT TẢI HÓA ĐƠN CHỦ ĐỘNG
    // Nút này chỉ dùng khi em có nút "Tải hóa đơn"
    // Không được gắn nút Thanh toán vào hàm này.
    // =======================================================

    const btnInvoice = document.getElementById('btn-download-invoice-now');

    if (btnInvoice) {
        btnInvoice.addEventListener('click', () => {
            window.downloadPDF();
        });
    }
});

// =======================================================
// HÀM TẢI HÓA ĐƠN THỦ CÔNG
// Chỉ chạy khi bấm nút "Tải hóa đơn", không dùng cho nút thanh toán.
// =======================================================

window.downloadPDF = async function () {
    try {
        await exportTourInvoicePDF({
            bookingCode: getText('conf-code', 'MA-TOUR'),
            createdAt: getText('conf-date', new Date().toLocaleString('vi-VN')),
            customerName: getText('conf-name', 'Khách hàng'),
            customerEmail: getText('conf-email', 'Chưa cập nhật'),
            customerPhone: getText('conf-phone', 'Chưa cập nhật'),
            customerAddress: getText('conf-address', 'Chưa cập nhật'),
            paymentMethod: getPaymentMethodTextFromUI(),
            tourTitle: getText('sum-tour-title', 'Dịch vụ hành trình Tour du lịch'),
            totalAmount: getText('conf-total', '0đ')
        }, true);

    } catch (error) {
        console.error('Lỗi xuất hóa đơn tour:', error);

        Swal.fire({
            title: 'Lỗi xuất PDF!',
            text: error.message || 'Không thể tạo hóa đơn PDF.',
            icon: 'error',
            confirmButtonColor: '#b82025'
        });
    }
};