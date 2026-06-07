let globalAttractionsDb = [];

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. TẢI DỮ LIỆU TỪ DB.JSON
    try {
        // Đảm bảo tên file backend của em là attractions hay acctractions thì sửa ở đây nhé!
        const response = await fetch('http://localhost:3001/attractions');
        if(!response.ok) throw new Error("Lỗi kết nối API");
        globalAttractionsDb = await response.json();
    } catch (error) {
        console.error("Chưa bật backend Server:", error);
    }

    const dateInput = document.getElementById('ticket-date-input');
    const locInput = document.getElementById('ticket-location-input');

    // 2. KHỞI TẠO NGÀY MẶC ĐỊNH
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;
        
        dateInput.value = todayStr;
        updateDisplayDateText(todayStr); 
    }

    renderAttractionData("VinWonders Phú Quốc");

    // Lắng nghe sự kiện đổi ngày ở thanh Tìm Kiếm
    if (dateInput) {
        dateInput.addEventListener('change', (e) => {
            const selectedDate = e.target.value;
            if (selectedDate) {
                updateDisplayDateText(selectedDate);
                const currentLoc = locInput.value ? locInput.value : "VinWonders Phú Quốc";
                renderAttractionData(currentLoc); // Render lại để cập nhật ngày vào thẻ Lưu ý
            }
        });
    }

    // 3. LOGIC DROPDOWN ĐỊA ĐIỂM
    const locGroup = document.getElementById('ticket-loc-group');
    const brandDropdown = document.getElementById('suggested-brands');
    const brandItems = document.querySelectorAll('.brand-item');
    const destItems = document.querySelectorAll('.dest-item');

    if (locGroup && brandDropdown) {
        locGroup.addEventListener('click', (e) => {
            e.stopPropagation();
            brandDropdown.classList.toggle('show');
        });
    }

    brandItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation(); 
            brandItems.forEach(b => b.classList.remove('active'));
            item.classList.add('active');

            const targetId = item.getAttribute('data-target');
            document.querySelectorAll('.dest-grid').forEach(grid => grid.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
        });
    });

    destItems.forEach(dest => {
        dest.addEventListener('click', (e) => {
            e.stopPropagation();
            let rawText = dest.innerHTML.split('<br>')[0].trim(); 
            if (locInput) {
                locInput.value = rawText;
                locInput.style.color = '#1a4fa0';
                locInput.style.fontWeight = 'bold';
            }
            brandDropdown.classList.remove('show');
        });
    });

    document.addEventListener('click', () => {
        if(brandDropdown) brandDropdown.classList.remove('show');
    });

    // 4. BẤM NÚT TÌM KIẾM CHÍNH
    const btnSearch = document.getElementById('btn-search-attraction');
    if (btnSearch) {
        btnSearch.addEventListener('click', () => {
            let selectedLoc = locInput.value || "VinWonders Phú Quốc";
            let selectedDate = dateInput.value;

            if (!selectedDate) {
                const today = new Date();
                selectedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                dateInput.value = selectedDate;
            }

            updateDisplayDateText(selectedDate);
            renderAttractionData(selectedLoc);
        });
    }

    // NÚT XEM THÊM VĂN BẢN
    const btnReadMore = document.getElementById('btn-read-more');
    const descContent = document.getElementById('attraction-desc-content');
    if (btnReadMore && descContent) {
        btnReadMore.addEventListener('click', () => {
            if (descContent.classList.contains('desc-collapsed')) {
                descContent.classList.replace('desc-collapsed', 'desc-expanded');
                btnReadMore.innerText = "Thu gọn ‹";
            } else {
                descContent.classList.replace('desc-expanded', 'desc-collapsed');
                btnReadMore.innerText = "Xem thêm ›";
            }
        });
    }
});

// =========================================================================
// CÁC HÀM XỬ LÝ GIAO DIỆN & RENDER DỮ LIỆU ĐỘNG
// =========================================================================

function updateDisplayDateText(dateStr) {
    const dParts = dateStr.split('-');
    if (dParts.length === 3) {
        const displayDate = `${dParts[2]}/${dParts[1]}/${dParts[0]}`;
        const titleEl = document.getElementById('page-attraction-date');
        if (titleEl) titleEl.innerText = `Ngày áp dụng: ${displayDate}`;
    }
}

// In dữ liệu Địa điểm và Vé ra màn hình (ĐÃ TÍCH HỢP NHẬN DIỆN TRẺ EM/NGƯỜI LỚN)
function renderAttractionData(locationName) {
    const data = globalAttractionsDb.find(item => item.name === locationName);
    if (!data) return;

    document.getElementById('page-attraction-title').innerText = data.name;
    document.getElementById('info-attraction-title').innerText = data.name;
    
    const descContent = document.getElementById('attraction-desc-content');
    if(descContent) {
        descContent.innerHTML = data.descHTML;
        descContent.className = 'desc-collapsed'; 
    }
    const btnReadMore = document.getElementById('btn-read-more');
    if(btnReadMore) btnReadMore.innerText = "Xem thêm ›";

    const mapEl = document.getElementById('attraction-map');
    if (mapEl) mapEl.src = data.mapUrl;

    const container = document.getElementById('ticket-packages-wrap');
    if (container) {
        const rawDate = document.getElementById('ticket-date-input').value;
        const dParts = rawDate.split('-');
        const displayDate = `${dParts[2]}/${dParts[1]}/${dParts[0]}`;

        container.style.opacity = 0;
        setTimeout(() => {
            container.innerHTML = '';
            data.packages.forEach(pkg => {
                
                // --- THUẬT TOÁN NHẬN DIỆN LOẠI KHÁCH HÀNG TỪ TÊN VÉ ---
                let customerType = "Người lớn";
                let customerDesc = "(Cao trên 140cm)";
                const lowerTitle = pkg.title.toLowerCase();

                if (lowerTitle.includes("trẻ em") || lowerTitle.includes("trẻ nhỏ")) {
                    customerType = "Trẻ em";
                    customerDesc = "(Dưới 1m4)";
                } else if (lowerTitle.includes("cao tuổi") || lowerTitle.includes("người già")) {
                    customerType = "Người cao tuổi";
                    customerDesc = "(Từ 60 tuổi)";
                }
                // -------------------------------------------------------

                const card = document.createElement('div');
                card.className = 'ticket-row-card';
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                        <div class="package-info-left">
                            <span class="package-title">${pkg.title}</span>
                            ${pkg.hasCombo ? '<span class="badge-combo">Combo</span>' : ''}
                        </div>
                        <div class="package-price-right">
                            <div class="price-tag-wrap">
                                <span class="price-number">${pkg.price.toLocaleString('vi-VN')}đ</span>
                                <span class="price-unit">/ khách</span>
                            </div>
                            <button class="btn-select-ticket" onclick="toggleTicketDetail(this)">Chọn</button>
                        </div>
                    </div>
                    
                    <div class="ticket-detail-expand">
                        <div class="ticket-detail-grid">
                            <div class="detail-col">
                                <h5>Giá vé:</h5>
                                <div class="price-box">
                                    <span>${customerType} <small style="color:#888;">${customerDesc}</small></span>
                                    <strong>${pkg.price.toLocaleString('vi-VN')}đ</strong>
                                </div>
                                <h5>Lưu ý:</h5>
                                <div class="note-box">
                                    Sử dụng vào ngày đã chọn: <b>${displayDate}</b><br>
                                    Có hiệu lực từ: 00:00 ${displayDate} - 23:59 ${displayDate}
                                </div>
                            </div>
                            <div class="detail-col">
                                <h5>Chọn số lượng:</h5>
                                <div class="qty-selector">
                                    <span>${customerType}</span>
                                    <div class="qty-controls">
                                        <button class="btn-qty" onclick="changeQty(this, -1, ${pkg.price})">-</button>
                                        <span class="qty-number">1</span>
                                        <button class="btn-qty" onclick="changeQty(this, 1, ${pkg.price})">+</button>
                                    </div>
                                </div>
                                <div class="subtotal-row">
                                    <span>Tạm tính:</span>
                                    <span class="subtotal-val">${pkg.price.toLocaleString('vi-VN')}đ</span>
                                </div>
                                <div class="action-buttons">
                                    <button class="btn-cancel" onclick="toggleTicketDetail(this)">Hủy</button>
                                    <button class="btn-confirm" onclick="confirmTicket('${pkg.title}', this, ${pkg.price}, '${customerType}')">Xác nhận</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
            container.style.transition = "opacity 0.3s ease";
            container.style.opacity = 1;
        }, 100); 
    }
}

// =========================================================================
// HỆ THỐNG XỬ LÝ GIỎ HÀNG VÀ POPUP (ĐÃ TÍCH HỢP SWEETALERT2)
// =========================================================================

window.toggleTicketDetail = function(btn) {
    const card = btn.closest('.ticket-row-card');
    card.classList.toggle('expanded');
    
    const mainBtn = card.querySelector('.btn-select-ticket');
    if (card.classList.contains('expanded')) {
        mainBtn.style.display = 'none';
    } else {
        mainBtn.style.display = 'block';
        card.querySelector('.qty-number').innerText = '1';
        const basePrice = parseInt(card.querySelector('.price-number').innerText.replace(/\D/g, ''));
        card.querySelector('.subtotal-val').innerText = basePrice.toLocaleString('vi-VN') + 'đ';
    }
};

window.changeQty = function(btn, delta, unitPrice) {
    const qtySpan = btn.parentElement.querySelector('.qty-number');
    let currentQty = parseInt(qtySpan.innerText);
    
    currentQty += delta;
    if (currentQty < 1) currentQty = 1; 
    
    qtySpan.innerText = currentQty;
    const subtotalSpan = btn.closest('.detail-col').querySelector('.subtotal-val');
    subtotalSpan.innerText = (currentQty * unitPrice).toLocaleString('vi-VN') + 'đ';
};

// --- GIỎ HÀNG THU NHỎ ---
let cartTickets = []; 

// Đưa vé vào giỏ (Thêm Popup Success)
window.confirmTicket = function(title, btn, unitPrice, customerType) {
    const qtyStr = btn.closest('.detail-col').querySelector('.qty-number').innerText;
    const qty = parseInt(qtyStr);
    const dateStr = document.getElementById('ticket-date-input').value; 
    
    // Đẩy dữ liệu vào mảng, lưu cả loại khách hàng (type)
    cartTickets.push({ title: title, qty: qty, price: unitPrice, date: dateStr, type: customerType });
    renderCartSummary();
    toggleTicketDetail(btn);
    
    // Bật Popup cực đẹp thay cho alert mặc định
    Swal.fire({
        title: 'Đã thêm vào giỏ!',
        text: `Bạn đã chọn ${qty} vé ${title}.`,
        icon: 'success',
        confirmButtonColor: '#1a4fa0',
        timer: 2000, // Tự động đóng sau 2 giây
        showConfirmButton: false
    });
};

function renderCartSummary() {
    const container = document.getElementById('summary-items-container');
    const btnCheckout = document.getElementById('btn-checkout');
    const totalPriceEl = document.getElementById('summary-total-price');
    const sumHeader = document.querySelector('.summary-header');
    const sumBody = document.getElementById('summary-body');
    
    if (btnCheckout) {
    // Xóa bỏ onclick cũ nếu có và gắn sự kiện click mới
    btnCheckout.onclick = null; 
    btnCheckout.addEventListener('click', () => {
        if (cartTickets.length === 0) return;

        // 1. Lưu danh sách vé đã chọn vào bộ nhớ tạm chuyên biệt cho VÉ
        localStorage.setItem('checkoutTicketsData', JSON.stringify(cartTickets));
        
        // 2. Chuyển hướng thẳng sang trang thanh toán vé riêng biệt
        window.location.href = 'thanh-toan-ve.html';
        });
    }

    if (cartTickets.length === 0) {
        container.innerHTML = '<div style="padding: 15px; color: #888; font-size: 14px; text-align: center;">Chưa có vé nào được chọn</div>';
        btnCheckout.className = 'btn-checkout disabled';
        btnCheckout.innerText = 'Chọn vé';
        btnCheckout.disabled = true;
        totalPriceEl.innerText = '0đ';
        sumHeader.classList.remove('open');
        sumBody.style.display = 'none';
    } else {
        let total = 0;
        container.innerHTML = cartTickets.map((item, index) => {
            total += item.price * item.qty;
            const d = new Date(item.date);
            const days = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
            const dateStrFormat = `${days[d.getDay()]}, ${d.getDate()} thg ${d.getMonth()+1}, ${d.getFullYear()}`;
            
            return `
                <div class="summary-item">
                    <span class="sum-title">${item.title}</span>
                    <div class="sum-meta">
                        <span>${dateStrFormat}</span>
                        <button class="btn-delete-item" onclick="deleteCartItem(${index})">🗑 Xóa</button>
                    </div>
                    <div class="sum-qty-price">
                        <span>${item.type}</span>
                        <span>${item.qty} x ${item.price.toLocaleString('vi-VN')}đ</span>
                    </div>
                </div>
            `;
        }).join('');
        
        totalPriceEl.innerText = total.toLocaleString('vi-VN') + 'đ';
        btnCheckout.className = 'btn-checkout active';
        btnCheckout.innerText = 'Đặt ngay';
        btnCheckout.disabled = false;
        
        sumHeader.classList.add('open');
        sumBody.style.display = 'block';
    }
}

// Xóa vé (Thay thế bằng Popup Cảnh báo của SweetAlert2)
window.deleteCartItem = function(index) {
    Swal.fire({
        title: 'Xóa vé tham quan?',
        text: "Bạn có chắc chắn muốn xóa vé này khỏi giỏ hàng không?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e53e3e',
        cancelButtonColor: '#718096',
        confirmButtonText: 'Đồng ý xóa',
        cancelButtonText: 'Hủy bỏ',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            cartTickets.splice(index, 1); 
            renderCartSummary(); 
            // Có thể thêm 1 popup nhỏ "Đã xóa thành công" nếu thích
        }
    });
};

window.toggleSummaryBody = function() {
    const sumHeader = document.querySelector('.summary-header');
    const sumBody = document.getElementById('summary-body');
    if (cartTickets.length > 0) {
        sumHeader.classList.toggle('open');
        sumBody.style.display = sumHeader.classList.contains('open') ? 'block' : 'none';
    }
};