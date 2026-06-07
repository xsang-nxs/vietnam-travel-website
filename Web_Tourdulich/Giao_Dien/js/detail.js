// File: giao_dien/js/detail.js (chỉ chạy trên trang chi tiết tour, không ảnh hưởng đến các trang khác)
// =========================================================================
// HỆ THỐNG XỬ LÝ CHI TIẾT TOUR & LỊCH TRÌNH KHỞI HÀNH TỐI ƯU (detail.js)
// =========================================================================

document.addEventListener('DOMContentLoaded', async () => {
    const detailTitle = document.getElementById('detail-title');
    if (!detailTitle) return; 

    // 1. DATA KHÁCH SẠN DỰ KIẾN KHỞI TẠO
    const hotelsData = {
        "Hà Nội": [
            { name: "Sofitel Legend Metropole", star: "⭐⭐⭐⭐⭐" },
            { name: "Lotte Hotel Hanoi", star: "⭐⭐⭐⭐⭐" },
            { name: "JW Marriott Hotel", star: "⭐⭐⭐⭐⭐" },
            { name: "Apricot Hotel", star: "⭐⭐⭐⭐⭐" },
            { name: "La Siesta Premium", star: "⭐⭐⭐⭐" }
        ],
        "TP. Hồ Chí Minh": [
            { name: "Vinpearl Landmark 81", star: "⭐⭐⭐⭐⭐" },
            { name: "Caravelle Saigon", star: "⭐⭐⭐⭐⭐" },
            { name: "Rex Hotel Saigon", star: "⭐⭐⭐⭐⭐" },
            { name: "New World Saigon", star: "⭐⭐⭐⭐⭐" },
            { name: "Liberty Central", star: "⭐⭐⭐⭐" }
        ],
        "Đà Nẵng": [
            { name: "InterContinental Danang", star: "⭐⭐⭐⭐⭐" },
            { name: "Hyatt Regency Resort", star: "⭐⭐⭐⭐⭐" },
            { name: "Novotel Danang Premier", star: "⭐⭐⭐⭐⭐" },
            { name: "Furama Resort", star: "⭐⭐⭐⭐⭐" },
            { name: "Mường Thanh Luxury", star: "⭐⭐⭐⭐⭐" }
        ],
        "Phú Quốc": [
            { name: "JW Marriott Phu Quoc", star: "⭐⭐⭐⭐⭐" },
            { name: "Vinpearl Resort & Spa", star: "⭐⭐⭐⭐⭐" },
            { name: "Novotel Phu Quoc", star: "⭐⭐⭐⭐⭐" },
            { name: "Salinda Resort", star: "⭐⭐⭐⭐⭐" },
            { name: "Seashells Hotel", star: "⭐⭐⭐⭐⭐" }
        ],
        "Hạ Long": [
            { name: "Vinpearl Resort & Spa Hạ Long", star: "⭐⭐⭐⭐⭐" },
            { name: "FLC Halong Bay", star: "⭐⭐⭐⭐⭐" },
            { name: "Wyndham Legend", star: "⭐⭐⭐⭐⭐" },
            { name: "Mường Thanh Luxury Centre", star: "⭐⭐⭐⭐⭐" }
        ],
        "Ninh Bình": [
            { name: "Emeralda Resort Ninh Bình", star: "⭐⭐⭐⭐⭐" },
            { name: "Ninh Binh Hidden Charm", star: "⭐⭐⭐⭐" },
            { name: "Bai Dinh Garden Resort", star: "⭐⭐⭐⭐" },
            { name: "The Reed Hotel", star: "⭐⭐⭐⭐" }
        ],
        "Nha Trang": [
            { name: "Vinpearl Resort Nha Trang", star: "⭐⭐⭐⭐⭐" },
            { name: "InterContinental Nha Trang", star: "⭐⭐⭐⭐⭐" },
            { name: "Amiana Resort", star: "⭐⭐⭐⭐⭐" },
            { name: "Havana Nha Trang", star: "⭐⭐⭐⭐⭐" }
        ],
        "Hội An": [
            { name: "Four Seasons The Nam Hai", star: "⭐⭐⭐⭐⭐" },
            { name: "Vinpearl Resort & Spa Hội An", star: "⭐⭐⭐⭐⭐" },
            { name: "Almanity Hoi An Wellness", star: "⭐⭐⭐⭐" },
            { name: "Boutique Hoi An Resort", star: "⭐⭐⭐⭐" }
        ],
        "Huế": [
            { name: "Silk Path Grand Hue", star: "⭐⭐⭐⭐⭐" },
            { name: "Imperial Hotel Hue", star: "⭐⭐⭐⭐⭐" },
            { name: "Melia Vinpearl Hue", star: "⭐⭐⭐⭐⭐" }
        ],
        "Vũng Tàu": [
            { name: "The Imperial Hotel", star: "⭐⭐⭐⭐⭐" },
            { name: "Pullman Vung Tau", star: "⭐⭐⭐⭐⭐" },
            { name: "Malibu Hotel", star: "⭐⭐⭐⭐" }
        ],
        "Cần Giờ": [
            { name: "Vinpearl Hotel Cần Giờ", star: "⭐⭐⭐⭐⭐" },
            { name: "Victoria Can Gio Resort", star: "⭐⭐⭐⭐" },
            { name: "Mường Thanh Luxury Cần Giờ", star: "⭐⭐⭐⭐⭐" }
        ],
        "Quảng Trị": [
            { name: "Sài Gòn Đông Hà Hotel", star: "⭐⭐⭐⭐" },
            { name: "Mường Thanh Grand Quảng Trị", star: "⭐⭐⭐⭐" },
            { name: "Sepon Boutique Resort", star: "⭐⭐⭐⭐" },
            { name: "Khách sạn Golden Quảng Trị", star: "⭐⭐⭐" },
            { name: "T&T Hotel Đông Hà", star: "⭐⭐⭐" }
        ],
        "default": [
            { name: "Khách sạn tiêu chuẩn 5 Sao", star: "⭐⭐⭐⭐⭐" },
            { name: "Khách sạn tiêu chuẩn 4 Sao", star: "⭐⭐⭐⭐" },
            { name: "Resort đối tác cao cấp The3Coachrock", star: "⭐⭐⭐⭐⭐" },
            { name: "Boutique Hotel trung tâm", star: "⭐⭐⭐⭐" }
        ]
    };

    // 2. LẤY ID TỪ ĐƯỜNG DẪN URL LINK INTERNET
    const urlParams = new URLSearchParams(window.location.search);
    const urlId = urlParams.get('id');

    if (!urlId) {
        detailTitle.innerText = "Lỗi: Không tìm thấy ID tour!";
        return;
    }

    let toursData = [];
    try {
        const response = await fetch('http://localhost:3001/tours');
        if (!response.ok) throw new Error("Lỗi kết nối");
        toursData = await response.json();
    } catch (error) {
        detailTitle.innerText = "Lỗi kết nối máy chủ dữ liệu!";
        return;
    }

    const currentTour = toursData.find(t => String(t.id) === urlId || String(t.tourID) === urlId);
    if (!currentTour) {
        detailTitle.innerText = "Tour du lịch này hiện không tồn tại.";
        return;
    }

    const finalTourId = currentTour.id || currentTour.tourID || "TOUR";

    // =====================================================
    // HÀM LẤY ID SỐ TIẾP THEO CHO ĐÁNH GIÁ
    // Ví dụ: review cuối id = 5 => review mới id = 6
    // =====================================================
    async function getNextReviewId() {
        try {
            const response = await fetch('http://localhost:3001/reviews', {
                cache: 'no-store'
            });

            if (!response.ok) {
                throw new Error('Không thể tải danh sách đánh giá');
            }

            const reviews = await response.json();

            if (!Array.isArray(reviews) || reviews.length === 0) {
                return 1;
            }

            const numericIds = reviews
                .map(review => Number(review.id))
                .filter(id => Number.isInteger(id) && id > 0);

            if (numericIds.length === 0) {
                return 1;
            }

            return Math.max(...numericIds) + 1;

        } catch (error) {
            console.error('Lỗi lấy ID đánh giá tiếp theo:', error);

            // Dự phòng nếu API lỗi, vẫn tạo được ID số
            return Date.now();
        }
    }

    function getCurrentUserSafe() {
        try {
            return JSON.parse(localStorage.getItem('currentUser'));
        } catch (error) {
            return null;
        }
    }

    // =====================================================
    // XỬ LÝ CHỌN SAO VÀ GỬI ĐÁNH GIÁ TOUR
    // =====================================================

    let selectedRating = 5;

    function renderSelectedStars(rating) {
        const stars = document.querySelectorAll('#star-rating .star');
        const ratingText = document.getElementById('rating-text');

        stars.forEach(star => {
            const starValue = Number(star.dataset.rating);

            if (starValue <= rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });

        if (ratingText) {
            ratingText.innerText = `${rating} sao`;
        }
    }

    const stars = document.querySelectorAll('#star-rating .star');

    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = Number(star.dataset.rating);
            renderSelectedStars(selectedRating);
        });
    });

    renderSelectedStars(selectedRating);

    const reviewInput = document.getElementById('review-input');
    const submitReviewBtn = document.getElementById('submit-review');

    if (submitReviewBtn && reviewInput) {
        submitReviewBtn.addEventListener('click', async () => {
            const reviewText = reviewInput.value.trim();

            if (!reviewText) {
                Swal.fire(
                    'Thiếu nội dung!',
                    'Vui lòng nhập nội dung đánh giá trước khi gửi.',
                    'warning'
                );
                return;
            }

            if (reviewText.length < 5) {
                Swal.fire(
                    'Đánh giá quá ngắn!',
                    'Vui lòng viết đánh giá chi tiết hơn một chút.',
                    'warning'
                );
                return;
            }

            const currentUser = getCurrentUserSafe();
            const nextReviewId = await getNextReviewId();

            const reviewData = {
                id: nextReviewId,

                author: currentUser && currentUser.username
                    ? currentUser.username
                    : 'Người dùng ẩn danh',

                userId: currentUser && currentUser.id
                    ? currentUser.id
                    : null,

                tourId: finalTourId,
                tourTitle: currentTour.title || 'Tour du lịch',
                destination: currentTour.destination || 'Chưa cập nhật',

                text: reviewText,

                rating: selectedRating,
                stars: '⭐'.repeat(selectedRating) + '☆'.repeat(5 - selectedRating),

                createdAt: new Date().toLocaleString('vi-VN'),
                status: 'Hiển thị'
            };

            Swal.fire({
                title: 'Đang gửi đánh giá...',
                html: 'Vui lòng đợi trong giây lát...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                const response = await fetch('http://localhost:3001/reviews', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(reviewData)
                });

                if (!response.ok) {
                    throw new Error('Không thể lưu đánh giá');
                }

                Swal.fire(
                    'Cảm ơn bạn!',
                    `Bạn đã gửi đánh giá ${selectedRating} sao thành công.`,
                    'success'
                );

                reviewInput.value = '';
                selectedRating = 5;
                renderSelectedStars(selectedRating);

            } catch (error) {
                console.error('Lỗi gửi đánh giá:', error);
                Swal.fire(
                    'Lỗi hệ thống!',
                    'Không thể gửi đánh giá lên máy chủ. Hãy kiểm tra json-server.',
                    'error'
                );
            }
        });
    }

    // 3. ĐỔ DỮ LIỆU CHUẨN RA MÀN HÌNH CHÍNH
    detailTitle.innerText = currentTour.title;
    if(document.getElementById('detail-desc')) document.getElementById('detail-desc').innerText = currentTour.description || "";
    if(document.getElementById('detail-img')) document.getElementById('detail-img').src = currentTour.imageUrls || currentTour.image || "";
    if(document.getElementById('detail-id')) document.getElementById('detail-id').innerText = finalTourId;
    if(document.getElementById('detail-departure')) document.getElementById('detail-departure').innerText = currentTour.departureLocation || "Đang cập nhật";
    if(document.getElementById('detail-dest')) document.getElementById('detail-dest').innerText = currentTour.destination || "Đang cập nhật";
    if(document.getElementById('detail-duration')) document.getElementById('detail-duration').innerText = currentTour.durationDays || "Đang cập nhật";
    
    // BẢN SỬA ĐỔI: Hàm định dạng ngày tháng thông minh nhận diện đa luồng dữ liệu
    const formatDateLocal = (dateString) => {
        if (!dateString) return 'Liên hệ';
        let str = String(dateString).trim().replace(/-/g, '/');
        if (str.includes('T')) str = str.split('T')[0];
        const parts = str.split('/');
        if (parts.length === 3) {
            if (parts[0].length === 4) return `${parts[2]}/${parts[1]}/${parts[0]}`;
            return `${parts[0]}/${parts[1]}/${parts[2]}`;
        }
        return dateString;
    };
    const formatPriceLocal = (price) => price ? price.toLocaleString('vi-VN') + 'đ' : 'Đang cập nhật';

    if(document.getElementById('detail-date')) document.getElementById('detail-date').innerText = formatDateLocal(currentTour.startDate);
    if(document.getElementById('detail-seats')) document.getElementById('detail-seats').innerText = (currentTour.availableSeats || 0) + " chỗ";
    if(document.getElementById('detail-price')) document.getElementById('detail-price').innerText = formatPriceLocal(currentTour.price);
    
    if(document.getElementById('acc-services')) document.getElementById('acc-services').innerText = currentTour.hotelServices || "Đang cập nhật";
    if(document.getElementById('detail-services')) document.getElementById('detail-services').innerText = currentTour.hotelServices || "";

    // 4. HIỂN THỊ KHÁCH SẠN NGẪU NHIÊN 
    const dest = currentTour.destination || "default";
    const availableHotels = hotelsData[dest] || hotelsData["default"];
    const hIndex = parseInt(String(finalTourId).replace(/\D/g, '') || 0) % availableHotels.length;
    const chosenHotel = availableHotels[hIndex];

    const hotelBox = document.getElementById('detail-hotel-box');
    if (hotelBox && chosenHotel) {
        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(chosenHotel.name)}`;
        hotelBox.innerHTML = `
            <div class="hotel-card-mini">
                <div class="hotel-icon">🏨</div>
                <div class="hotel-info">
                    <span class="hotel-label">Nơi lưu trú dự kiến:</span>
                    <a href="${googleSearchUrl}" target="_blank" class="hotel-name" style="font-weight:bold; color:#1a4fa0;">${chosenHotel.name}</a>
                    <span class="hotel-star">${chosenHotel.star}</span>
                </div>
            </div>
        `;
    }

    // 5. HIỂN THỊ LỊCH TRÌNH CHUYẾN ĐI CHI TIẾT THEO NGÀY
    const itineraryUl = document.getElementById('detail-itinerary');
    if (itineraryUl && currentTour.itinerary) {
        itineraryUl.innerHTML = '';
        if (Array.isArray(currentTour.itinerary)) {
            currentTour.itinerary.forEach(day => { itineraryUl.innerHTML += `<li>${day}</li>`; });
        } else if (typeof currentTour.itinerary === 'string') {
            currentTour.itinerary.split('|').forEach(dayText => {
                if(dayText.trim() !== "") itineraryUl.innerHTML += `<li>${dayText.trim()}</li>`;
            });
        }
    }

// -----------------------------------------------------------------
// 6. HIỂN THỊ LỊCH KHỞI HÀNH THEO THÁNG NÀY / THÁNG SAU
// -----------------------------------------------------------------
try {
    const scheduleContainer = document.getElementById('schedule-container');
    const tabMonth1 = document.getElementById('tab-month-1');
    const tabMonth2 = document.getElementById('tab-month-2');

    if (scheduleContainer && currentTour.startDate) {

        // Parse ngày an toàn, chống lỗi năm 1906
        function parseTourDate(dateInput) {
            if (!dateInput) return new Date();

            let dateStr = String(dateInput).trim();

            if (dateStr.includes('T')) {
                dateStr = dateStr.split('T')[0];
            }

            dateStr = dateStr.replace(/-/g, '/');

            const parts = dateStr.split('/');

            if (parts.length === 3) {
                // Dạng yyyy/mm/dd
                if (parts[0].length === 4) {
                    return new Date(
                        Number(parts[0]),
                        Number(parts[1]) - 1,
                        Number(parts[2])
                    );
                }

                // Dạng dd/mm/yyyy
                return new Date(
                    Number(parts[2]),
                    Number(parts[1]) - 1,
                    Number(parts[0])
                );
            }

            const fallbackDate = new Date(dateInput);
            return isNaN(fallbackDate.getTime()) ? new Date() : fallbackDate;
        }

        function addDays(date, days) {
            const d = new Date(date);
            d.setDate(d.getDate() + days);
            return d;
        }

        function pad(n) {
            return n < 10 ? '0' + n : String(n);
        }

        function formatScheduleDate(date) {
            return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
        }

        function getWeeklyDatesByMonth(baseDate, targetMonth, targetYear) {
            const result = [];

            // Tạo nhiều mốc tuần để lọc, tránh bị thiếu ngày
            for (let i = 0; i < 12; i++) {
                const d = addDays(baseDate, i * 7);

                if (
                    d.getMonth() === targetMonth &&
                    d.getFullYear() === targetYear
                ) {
                    result.push(d);
                }
            }

            return result;
        }

        function getMonthInfo(type) {
            const baseDate = parseTourDate(currentTour.startDate);

            if (type === 'current') {
                return {
                    month: baseDate.getMonth(),
                    year: baseDate.getFullYear()
                };
            }

            const nextMonthDate = new Date(baseDate);
            nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

            return {
                month: nextMonthDate.getMonth(),
                year: nextMonthDate.getFullYear()
            };
        }

        function renderScheduleByType(type) {
            const baseDate = parseTourDate(currentTour.startDate);
            const monthInfo = getMonthInfo(type);

            const dates = getWeeklyDatesByMonth(
                baseDate,
                monthInfo.month,
                monthInfo.year
            );

            if (tabMonth1 && tabMonth2) {
                tabMonth1.classList.remove('active');
                tabMonth2.classList.remove('active');

                if (type === 'current') {
                    tabMonth1.classList.add('active');
                } else {
                    tabMonth2.classList.add('active');
                }
            }

            if (dates.length === 0) {
                scheduleContainer.innerHTML = `
                    <div style="padding: 20px; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; color: #718096; text-align: center;">
                        Chưa có lịch khởi hành trong tháng này.
                    </div>
                `;
                return;
            }

            scheduleContainer.innerHTML = dates.map((d, index) => {
                const dateStr = formatScheduleDate(d);
                const scheduleCode = `TRV-${finalTourId}X-${index + 1}`;

                return `
                    <div class="schedule-row" style="margin-bottom: 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; overflow:hidden; transition: 0.2s;">
                        <div class="schedule-summary" style="display: flex; justify-content: space-between; align-items: center; padding: 18px 20px;">
                            <div class="sch-left" style="display: flex; align-items: center; gap: 20px;">
                                <span class="date-pill" style="background: #edf2f7; padding: 8px 18px; border-radius: 20px; color: #1a4fa0; font-weight: bold; font-size:14px;">
                                    ${dateStr}
                                </span>
                                <span class="tour-code" style="color: #4a5568; font-size: 13px; font-weight:600;">
                                    🎫 Mã tour: ${scheduleCode}
                                </span>
                            </div>

                            <div class="sch-right" style="display: flex; align-items: center; gap: 25px;">
                                <span class="sch-price" style="font-weight: 800; font-size: 18px; color: #2d3748;">
                                    ${formatPriceLocal(currentTour.price)}
                                </span>

                                <button class="btn-choose" type="button"
                                    onclick="window.selectTourSchedule('${finalTourId}', '${scheduleCode}', '${dateStr}', ${currentTour.price}, '${currentTour.title.replace(/'/g, "\\'")}', event)"
                                    style="background: #3b82f6; color: white; border: none; padding: 8px 22px; border-radius: 20px; font-weight: bold; cursor: pointer; transition: 0.2s;">
                                    Chọn
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Gắn sự kiện click cho 2 nút
        if (tabMonth1) {
            tabMonth1.addEventListener('click', () => {
                renderScheduleByType('current');
            });
        }

        if (tabMonth2) {
            tabMonth2.addEventListener('click', () => {
                renderScheduleByType('next');
            });
        }

        // Mặc định mở tab Tháng này
        renderScheduleByType('current');
    }

    } catch (e) {
        console.error("Lỗi vẽ lịch khởi hành:", e);
    }

    // Tự động kích hoạt Accordion đóng mở
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.onclick = () => header.parentElement.classList.toggle('active');
    });

    // 7. THIẾT LẬP NÚT MUA TRỰC TIẾP Sidebar
    const btnBooking = document.getElementById('btn-booking');
    const btnAddToCart = document.getElementById('btn-add-to-cart');

    if (btnAddToCart) btnAddToCart.style.display = "block";
    if (btnBooking) {
        btnBooking.disabled = false;
        btnBooking.innerText = "ĐẶT TOUR NGAY";
        btnBooking.style.background = "#d32f2f";
    }

    if (currentTour.status === "sold_out") {
        if(btnBooking) {
            btnBooking.innerText = "ĐÃ HẾT CHỖ";
            btnBooking.style.background = '#a0aec0';
            btnBooking.disabled = true;
        }
        if(btnAddToCart) {
            btnAddToCart.disabled = true;
            btnAddToCart.style.opacity = "0.5";
            btnAddToCart.innerText = "🛒 HẾT CHỖ NHẬN";
        }
    } else {
        if (btnAddToCart) {
            btnAddToCart.addEventListener('click', () => {
                const tourItem = {
                    id: finalTourId,
                    title: currentTour.title,
                    price: currentTour.price,
                    image: currentTour.imageUrls || currentTour.image,
                    date: document.getElementById('detail-date') ? document.getElementById('detail-date').innerText : "Liên hệ",
                    type: 'tour',
                    qty: 1 
                };
                let cart = JSON.parse(localStorage.getItem('travelCart')) || [];
                cart.push(tourItem);
                localStorage.setItem('travelCart', JSON.stringify(cart));
                if (typeof updateCartBadge === 'function') updateCartBadge();
                Swal.fire({ title: 'Đã thêm vào giỏ!', text: `Tour ${tourItem.title} đã nằm trong giỏ hàng.`, icon: 'success', showConfirmButton: false, timer: 1500 });
            });
        }

        if (btnBooking) {
            btnBooking.addEventListener('click', () => {
                const tourItem = {
                    id: finalTourId,
                    title: currentTour.title,
                    price: currentTour.price,
                    image: currentTour.imageUrls || currentTour.image,
                    date: document.getElementById('detail-date') ? document.getElementById('detail-date').innerText : "Liên hệ",
                    type: 'tour',
                    qty: 1 
                };
                localStorage.setItem('checkoutData', JSON.stringify([tourItem]));
                localStorage.setItem('isCartCheckout', 'false');
                window.location.href = 'thanh-toan.html';
            });
        }
    }
});

// =========================================================================
// GẮN CÁC HÀM XỬ LÝ SỰ KIỆN CLICK CHỌN VÀO WINDOW ĐỂ CHẠY ĐỘNG TOÀN CỤC
// =========================================================================
window.selectTourSchedule = function(tourId, scheduleId, date, price, title, event) {
    const currentRow = event.target.closest('.schedule-row');
    if (!currentRow) return;

    // Quét tìm xem bảng chi tiết cũ có đang mở trên trang hay không
    const existingPanel = document.getElementById('dynamic-tour-detail-panel');
    
    // Nếu click lại đúng dòng đang mở -> Tiến hành ĐÓNG bảng lập tức
    if (existingPanel && existingPanel.parentElement === currentRow) {
        existingPanel.remove();
        currentRow.classList.remove('active-row');
        return;
    }

    // Nếu đang mở ở dòng khác -> Dọn sạch dòng cũ đi
    if (existingPanel) {
        const activeRow = document.querySelector('.active-row');
        if (activeRow) activeRow.classList.remove('active-row');
        existingPanel.remove();
    }

    // Kích hoạt bôi đậm viền xám dòng được chọn
    currentRow.classList.add('active-row');

    // Tạo bảng chi tiết Accordion trượt mở bên dưới
    const detailPanel = document.createElement('div');
    detailPanel.id = 'dynamic-tour-detail-panel';
    detailPanel.style.padding = '20px';
    detailPanel.style.backgroundColor = '#f8fafc';
    detailPanel.style.borderTop = '1px dashed #cbd5e0';
    detailPanel.style.borderLeft = '4px solid #b82025'; // Viền đỏ thương hiệu Vietravel
    detailPanel.style.animation = 'fadeInDown 0.3s ease';

    detailPanel.innerHTML = `
        <h3 style="color: #003c71; margin-bottom: 12px; font-size: 15px; font-weight: bold; text-align: left;">
            📌 CHI TIẾT HÀNH TRÌNH BẠN CHỌN KHỞI HÀNH
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 13.5px; color: #4a5568; text-align: left;">
            <div>
                <p style="margin-bottom: 6px;"><b>Tên Tour du lịch:</b> <span style="color:#b82025; font-weight:bold;">${title}</span></p>
                <p style="margin-bottom: 6px;"><b>Mã số lịch trình:</b> <code style="background:#e2e8f0; padding:2px 6px; border-radius:4px;">${scheduleId}</code></p>
                <p style="margin-bottom: 6px;"><b>Ngày khởi hành:</b> <span style="color:#1a4fa0; font-weight:bold;">${date}</span></p>
                <p style="margin-bottom: 6px; color: #38a169;"><b>Trạng thái:</b> 🟢 Đang nhận giữ chỗ</p>
            </div>
            <div style="text-align: right; display: flex; flex-direction: column; justify-content: center; align-items: flex-end;">
                <p style="margin-bottom: 8px;"><b>Giá bán (Trọn gói/Khách):</b> <span style="font-size: 20px; color: #b82025; font-weight: 900;">${Number(price).toLocaleString('vi-VN')}đ</span></p>
                <div style="margin-top: auto;">
                    <button type="button" onclick="window.proceedToCheckout('${tourId}', '${scheduleId}', '${date}', ${price}, '${title.replace(/'/g, "\\'")}')" 
                            style="background: #b82025; color: white; border: none; padding: 10px 24px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 13.5px; box-shadow: 0 4px 6px rgba(184,32,37,0.15); transition: 0.2s;">
                        Xác nhận đặt ngay ➔
                    </button>
                </div>
            </div>
        </div>
    `;

    // Chèn bảng chi tiết vào trong dòng lịch trình ngay phía sau cụm text tóm tắt
    currentRow.appendChild(detailPanel);
};

// HÀM GỬI GIỎ HÀNG SANG TRANG THANH TOÁN KHI BẤM NÚT XÁC NHẬN TRONG BẢNG CHI TIẾT
window.proceedToCheckout = function(tourId, scheduleId, date, price, title) {
    const tourItem = {
        id: tourId,
        scheduleCode: scheduleId,
        title: title,
        date: date,
        price: Number(price),
        type: 'tour',
        qty: 1
    };
    // Đồng bộ đẩy vào kho lưu trữ checkout dữ liệu sống
    localStorage.setItem('checkoutData', JSON.stringify([tourItem]));
    localStorage.setItem('isCartCheckout', 'false');

    // Tự động nhận diện điền thông tin người dùng nếu đã đăng nhập từ trước
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const pendingOrderInfo = {
        name: currentUser ? currentUser.username : "",
        email: currentUser ? currentUser.email : "",
        phone: currentUser ? currentUser.phone : "",
        finalTotal: Number(price).toLocaleString('vi-VN') + 'đ',
        passengers: { adult: 1, child: 0, toddler: 0, infant: 0 }
    };
    localStorage.setItem('pendingOrderInfo', JSON.stringify(pendingOrderInfo));

    // Thực thi lệnh điều hướng trang
    window.location.href = 'thanh-toan.html';
};

// Nhúng ngầm CSS Animation hỗ trợ bảng chi tiết xổ mở mượt mà óng ả
const styleAnimation = document.createElement('style');
styleAnimation.innerHTML = `
    @keyframes fadeInDown {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .active-row .schedule-summary { background-color: #f8fafc !important; border-bottom: 1px solid #e2e8f0; }
`;
document.head.appendChild(styleAnimation);
