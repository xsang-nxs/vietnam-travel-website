// =======================================================
// HÀM TIỆN ÍCH CHUNG
// =======================================================

function safeTicketJsonParse(value, fallback = null) {
    try {
        return JSON.parse(value);
    } catch (error) {
        return fallback;
    }
}

function safeTicketPdfText(value, fallback = 'Chưa cập nhật') {
    const text = String(value ?? '').trim();
    return text || fallback;
}

function safeTicketPdfFileName(value) {
    return String(value || 'ETicket')
        .replace(/[^\w\-]+/g, '_')
        .replace(/_+/g, '_');
}

function setTicketTextContent(id, value, fallback = '...') {
    const el = document.getElementById(id);
    if (el) {
        el.innerText = value || fallback;
    }
}

function formatTicketNowDateTime() {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hour}:${minute}`;
}

function getBestTicketAddress(orderInfo) {
    return (
        orderInfo?.address ||
        orderInfo?.customerAddress ||
        orderInfo?.contactAddress ||
        orderInfo?.fullAddress ||
        orderInfo?.diaChi ||
        document.getElementById('v-address')?.innerText ||
        'Chưa cập nhật'
    );
}

function getTicketPaymentMethodTextFromUI() {
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

function downloadTicketPdfMakeFile(docDefinition, fileName) {
    return new Promise((resolve, reject) => {
        try {
            if (typeof pdfMake === 'undefined') {
                reject(new Error('Chưa tải thư viện pdfMake. Hãy kiểm tra lại xac-nhan-ve.html đã import pdfMake chưa.'));
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
// PDFMAKE - XUẤT VÉ THAM QUAN / E-TICKET CHUYÊN NGHIỆP
// =======================================================

function buildTicketInvoiceDoc(data) {
    const ticketCode = safeTicketPdfText(data.ticketCode, 'MA-VE');
    const createdAt = safeTicketPdfText(data.createdAt, new Date().toLocaleString('vi-VN'));
    const customerName = safeTicketPdfText(data.customerName, 'Khách hàng');
    const customerEmail = safeTicketPdfText(data.customerEmail);
    const customerPhone = safeTicketPdfText(data.customerPhone);
    const customerAddress = safeTicketPdfText(data.customerAddress);
    const paymentMethod = safeTicketPdfText(data.paymentMethod, 'Thanh toán Online');
    const ticketDetails = Array.isArray(data.tickets) ? data.tickets : [];
    const totalAmount = safeTicketPdfText(data.totalAmount, '0đ');

    const ticketRows = ticketDetails.length > 0
        ? ticketDetails.map((ticket, index) => [
            { text: String(index + 1), alignment: 'center' },
            {
                text: safeTicketPdfText(ticket.title, 'Vé tham quan'),
                bold: true,
                color: '#1a4fa0'
            },
            {
                text: safeTicketPdfText(ticket.type, 'Người lớn'),
                alignment: 'center'
            },
            {
                text: String(ticket.qty || 1),
                alignment: 'center'
            }
        ])
        : [[
            { text: '1', alignment: 'center' },
            {
                text: safeTicketPdfText(data.ticketDetails, 'Dịch vụ vé tham quan'),
                bold: true,
                color: '#1a4fa0'
            },
            { text: 'Vé', alignment: 'center' },
            { text: '1', alignment: 'center' }
        ]];

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
                                text: 'VÉ ĐIỆN TỬ',
                                alignment: 'right',
                                fontSize: 17,
                                bold: true,
                                color: '#b82025',
                                margin: [0, 2, 0, 4]
                            },
                            {
                                text: `Mã vé: ${ticketCode}`,
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
                                    {
                                        text: 'THÔNG TIN NGƯỜI NHẬN VÉ',
                                        style: 'sectionTitle'
                                    },
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
                                    {
                                        text: 'THÔNG TIN THANH TOÁN',
                                        style: 'sectionTitle'
                                    },
                                    {
                                        table: {
                                            widths: [95, '*'],
                                            body: [
                                                ['Ngày xuất vé:', createdAt],
                                                ['Trạng thái:', { text: 'Chờ xác nhận', bold: true, color: '#d69e2e' }],
                                                ['Phương thức:', paymentMethod],
                                                ['Loại dịch vụ:', 'Vé tham quan']
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
                text: 'CHI TIẾT VÉ THAM QUAN',
                style: 'sectionTitle',
                margin: [0, 0, 0, 8]
            },

            {
                table: {
                    headerRows: 1,
                    widths: [30, '*', 90, 70],
                    body: [
                        [
                            { text: 'STT', style: 'tableHeader', alignment: 'center' },
                            { text: 'Tên vé / dịch vụ', style: 'tableHeader' },
                            { text: 'Loại vé', style: 'tableHeader', alignment: 'center' },
                            { text: 'Số lượng', style: 'tableHeader', alignment: 'center' }
                        ],
                        ...ticketRows,
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
                                alignment: 'center',
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
                        text: 'Hướng dẫn sử dụng vé',
                        bold: true,
                        color: '#1a4fa0',
                        margin: [0, 0, 0, 4]
                    },
                    {
                        ul: [
                            'Vui lòng xuất trình E-ticket này khi sử dụng dịch vụ.',
                            'Thông tin vé cần trùng khớp với thông tin người nhận vé.',
                            'Vé điện tử được tạo tự động từ hệ thống The3Coachrock.'
                        ],
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
                                text: 'Cảm ơn quý khách đã sử dụng dịch vụ vé tham quan của The3Coachrock.',
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

async function exportTicketInvoicePDF(data, showSuccess = false) {
    const docDefinition = buildTicketInvoiceDoc(data);
    const safeCode = safeTicketPdfFileName(data.ticketCode || 'ETicket');
    const fileName = `ETicket-DichVu-${safeCode}.pdf`;

    await downloadTicketPdfMakeFile(docDefinition, fileName);

    if (showSuccess) {
        Swal.fire({
            title: 'Tải thành công!',
            text: 'Mã E-ticket PDF đã được tải xuống thiết bị của bạn.',
            icon: 'success',
            confirmButtonColor: '#2e7d32'
        });
    }
}

// =================================================================
// DOM READY
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    const orderInfo = safeTicketJsonParse(localStorage.getItem('pendingTicketOrderInfo'));
    const checkoutTickets = safeTicketJsonParse(localStorage.getItem('checkoutTicketsData'));

    if (!orderInfo || !checkoutTickets) {
        window.location.href = 'main.html';
        return;
    }

    const bestTicketAddress = getBestTicketAddress(orderInfo);

    // 1. ĐỔ THÔNG TIN KHÁCH HÀNG RA GIAO DIỆN
    setTicketTextContent('v-name', orderInfo.name, '...');
    setTicketTextContent('v-email', orderInfo.email, '...');
    setTicketTextContent('v-phone', orderInfo.phone, '...');
    setTicketTextContent('v-address', bestTicketAddress, 'Chưa cập nhật');

    setTicketTextContent('v-total', orderInfo.finalTotal, '0đ');
    setTicketTextContent('v-final-pay', orderInfo.finalTotal, '0đ');

    // 2. NGÀY GIỜ VÀ MÃ VÉ
    const formattedDate = formatTicketNowDateTime();
    setTicketTextContent('v-date', formattedDate, '...');

    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const ticketCode = `TICKET-${randomCode}VN`;
    setTicketTextContent('v-code', ticketCode, '...');

    setTicketTextContent(
        'v-sidebar-title',
        `Đơn hàng gồm ${checkoutTickets.length} mã vé điện tử`,
        'Đơn hàng vé điện tử'
    );

    // =======================================================
    // 3. GIAO DIỆN THANH TOÁN QR / THẺ
    // =======================================================

    function updatePaymentUI() {
        const activeRadio = document.querySelector('input[name="payment_method"]:checked');
        if (!activeRadio) return;

        const method = activeRadio.value;
        const type = activeRadio.getAttribute('data-type');

        const displayArea = document.getElementById('payment-display-area');
        const areaQr = document.getElementById('area-qr');
        const areaCard = document.getElementById('area-card');
        const imgQr = document.getElementById('img-qr');
        const qrName = document.getElementById('qr-name');

        if (displayArea) displayArea.style.display = 'block';

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
                    qrName.innerText = 'QUÉT MÃ VNPAY QR';
                    qrName.style.color = '#005aab';
                }
            }

        } else if (method === 'card') {
            if (areaQr) areaQr.style.display = 'none';
            if (areaCard) areaCard.style.display = 'block';
        }
    }

    document.querySelectorAll('input[name="payment_method"]').forEach(radio => {
        radio.addEventListener('change', updatePaymentUI);
    });

    updatePaymentUI();

    // =======================================================
    // 4. THANH TOÁN VÉ VÀ ĐẨY LÊN API ADMIN
    // =======================================================

    const btnTicketPay = document.getElementById('btn-ticket-pay');

    if (btnTicketPay) {
        btnTicketPay.addEventListener('click', async () => {
            const paymentMethodText = getTicketPaymentMethodTextFromUI();

            const ticketDetailsStr = checkoutTickets
                .map(t => `${t.title} (${t.qty} x ${t.type})`)
                .join(', ');

            const newTicketBookingData = {
                id: ticketCode,
                createdAt: formattedDate,
                customerName: orderInfo.name || 'Khách hàng',
                customerEmail: orderInfo.email || 'Chưa cập nhật',
                customerPhone: orderInfo.phone || 'Chưa cập nhật',
                customerAddress: bestTicketAddress,
                ticketDetails: ticketDetailsStr,
                totalAmount: orderInfo.finalTotal || '0đ',
                paymentMethod: paymentMethodText,
                status: 'Chờ xác nhận'
            };

            Swal.fire({
                title: 'Đang kết xuất vé điện tử...',
                html: 'Hệ thống đang ghi nhận thông tin mã vé lên máy chủ...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                const response = await fetch('http://localhost:3001/ticket_bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newTicketBookingData)
                });

                if (!response.ok) {
                    throw new Error('Lỗi API lưu vé');
                }

                await exportTicketInvoicePDF({
                    ticketCode: ticketCode,
                    createdAt: formattedDate,
                    customerName: orderInfo.name || 'Khách hàng',
                    customerEmail: orderInfo.email || 'Chưa cập nhật',
                    customerPhone: orderInfo.phone || 'Chưa cập nhật',
                    customerAddress: bestTicketAddress,
                    paymentMethod: paymentMethodText,
                    tickets: checkoutTickets,
                    ticketDetails: ticketDetailsStr,
                    totalAmount: orderInfo.finalTotal || '0đ'
                });

                Swal.fire({
                    title: 'Đặt Vé Thành Công! 🎉',
                    text: 'Mã E-ticket của bạn đã được kích hoạt và file PDF đã được tải về máy thành công.',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 4000,
                    timerProgressBar: true,
                    allowOutsideClick: false
                }).then(() => {
                    localStorage.removeItem('pendingTicketOrderInfo');
                    localStorage.removeItem('checkoutTicketsData');

                    window.location.href = 'main.html';
                });

            } catch (error) {
                console.error(error);

                Swal.fire(
                    'Lỗi kết nối!',
                    'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại json-server.',
                    'error'
                );
            }
        });
    }
});

// =======================================================
// HÀM ĐỘC LẬP: XUẤT VÉ PDF BẰNG PDFMAKE
// =======================================================

window.downloadTicketPDF = async function () {
    try {
        const getText = (id, fallback = 'Chưa cập nhật') => {
            const el = document.getElementById(id);
            return el ? (el.innerText.trim() || fallback) : fallback;
        };

        const checkoutTickets = safeTicketJsonParse(localStorage.getItem('checkoutTicketsData'), []) || [];

        await exportTicketInvoicePDF({
            ticketCode: getText('v-code', 'MA-VE'),
            createdAt: getText('v-date', new Date().toLocaleString('vi-VN')),
            customerName: getText('v-name', 'Khách hàng'),
            customerEmail: getText('v-email', 'Chưa cập nhật'),
            customerPhone: getText('v-phone', 'Chưa cập nhật'),
            customerAddress: getText('v-address', 'Chưa cập nhật'),
            paymentMethod: getTicketPaymentMethodTextFromUI(),
            tickets: checkoutTickets,
            ticketDetails: checkoutTickets
                .map(t => `${t.title} (${t.qty} x ${t.type})`)
                .join(', '),
            totalAmount: getText('v-final-pay', '0đ')
        }, true);

    } catch (error) {
        console.error('Lỗi xuất vé PDF:', error);

        Swal.fire(
            'Lỗi xuất PDF!',
            error.message || 'Không thể tạo vé điện tử PDF.',
            'error'
        );
    }
};