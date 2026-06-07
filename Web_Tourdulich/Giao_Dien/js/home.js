// File: giao_dien/js/home.js (chỉ chạy trên trang chủ main.html, không ảnh hưởng đến các trang khác)
document.addEventListener('DOMContentLoaded', async () => {
    const tourGrid = document.getElementById('tour-grid');
    if (!tourGrid) return; // Nếu không tìm thấy tour-grid (không phải trang chủ) thì ngừng chạy

    // 1. KHO DỮ LIỆU ẢNH VÀ BANNER DÀNH RIÊNG CHO TRANG CHỦ
    const diverseImages = {
        "Hà Nội": ["https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=600", "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=600", "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=600"],
        "TP. Hồ Chí Minh": ["https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=600", "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=600", "https://images.unsplash.com/photo-1540448051910-09cf84e38cb6?q=80&w=600"],
        "Đà Nẵng": ["https://images.unsplash.com/photo-1555921015-c262060f0bc4?q=80&w=600", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600", "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=600"],
        "Phú Quốc": ["https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=600", "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=600", "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?q=80&w=600"],
        "Hạ Long": ["https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600", "https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?q=80&w=600", "https://images.unsplash.com/photo-1505993597083-3cb431f04762?q=80&w=600"],
        "Ninh Bình": ["https://images.unsplash.com/photo-1559506691-8488e00181b9?q=80&w=600", "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600", "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600"],
        "Vũng Tàu": ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600", "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=600"],
        "Cần Giờ": ["https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600", "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600"],
        "Huế": ["https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=600", "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600"],
        "default": ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600", "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=600", "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?q=80&w=600", "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600"]
    };
    const bannerData = {
        "Hà Nội": { title: "HÀ NỘI", desc: "Khám phá vẻ đẹp Thủ đô ngàn năm văn hiến...", image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1440" },
        "TP. Hồ Chí Minh": { title: "TP. HỒ CHÍ MINH", desc: "Thành phố mang tên Bác năng động, sầm uất...", image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1440" },
        "Đà Nẵng": { title: "ĐÀ NẴNG", desc: "Thành phố đáng sống nhất Việt Nam vẫy gọi...", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1440" },
        "Cần Thơ": { title: "CẦN THƠ", desc: "Về thăm thủ phủ miền Tây sông nước...", image: "https://images.unsplash.com/photo-1542360663-8f40838b8d7a?q=80&w=1440" },
        "Nha Trang": { title: "NHA TRANG", desc: "Thiên đường nghỉ dưỡng biển đảo...", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1440" },
        "Quảng Ninh": { title: "QUẢNG NINH", desc: "Chiêm ngưỡng kỳ quan thiên nhiên thế giới...", image: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1440" },
        "default": { title: "Khám Phá Việt Nam", desc: "Hàng ngàn tour du lịch chất lượng đang chờ đón bạn", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1440" }
    };
    const fallbackImg = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600";

    // 2. FETCH DỮ LIỆU TOUR TỪ BACKEND
    let toursData = [];
    try {
        const response = await fetch('http://localhost:3001/tours');
        if (!response.ok) throw new Error("Lỗi API");
        toursData = await response.json();
    } catch (error) {
        tourGrid.innerHTML = `<h3 style="color:red; grid-column: span 3; text-align:center;">Lỗi kết nối Server! Vui lòng bật backend.</h3>`;
        return;
    }

    let currentDisplayedTours = toursData;

    // 3. CÁC HÀM XỬ LÝ (Render, Lọc, Sắp xếp)
    const renderTours = (tours) => {
        tourGrid.innerHTML = ""; 
        const countText = document.getElementById('result-count-text');
        if(countText) countText.innerText = `${tours.length} chương trình tour`;
        
        if(tours.length === 0) {
            tourGrid.innerHTML = `<div style="grid-column: span 3; text-align: center; padding: 40px; color: #666; font-size: 18px;">Rất tiếc, không tìm thấy tour phù hợp!</div>`;
            return;
        }

        tours.slice(0, 50).forEach(tour => {
            const isSoldOut = tour.status === "sold_out";
            const cardClass = isSoldOut ? "tour-card sold-out" : "tour-card";
            
            const destImages = diverseImages[tour.destination] || diverseImages["default"];
            const imgIndex = parseInt(String(tour.tourID).replace(/\D/g, '') || Math.floor(Math.random() * 100)) % destImages.length;
            
            const btnHTML = isSoldOut ? `<span class="btn btn-disabled">Hết chỗ</span>` : `<a href="chi-tiet-tour.html?id=${tour.id}" class="btn btn-primary">Xem chi tiết</a>`;

            tourGrid.innerHTML += `
                <div class="${cardClass}">
                    <div class="tour-img-wrap">
                        <span class="badge">${tour.category || "Tiết kiệm"}</span>
                        <img src="${destImages[imgIndex]}" alt="${tour.title}" class="tour-img" loading="lazy" onerror="this.onerror=null; this.src='${fallbackImg}';">
                    </div>
                    <div class="tour-content">
                        <h3 class="tour-title" title="${tour.title}">${tour.title}</h3>
                        <div class="tour-meta">
                            <span>📍 <b>Từ:</b> ${tour.departureLocation} ➡ <b>Đến:</b> ${tour.destination}</span>
                            <span>⏱ <b>Thời gian:</b> ${tour.durationDays}</span>
                            <span>📅 <b>Khởi hành:</b> ${formatDate(tour.startDate)}</span>
                        </div>
                        <div class="tour-footer">
                            <span class="price">${formatPrice(tour.price)}</span>
                            ${btnHTML}
                        </div>
                    </div>
                </div>
            `;
        });
    };

    const applySortAndRender = (tours) => {
        const sortValue = document.getElementById('sort-select').value;
        let sorted = [...tours];
        if (sortValue === 'price-asc') sorted.sort((a, b) => a.price - b.price);
        else if (sortValue === 'price-desc') sorted.sort((a, b) => b.price - a.price);
        else if (sortValue === 'date-asc') sorted.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        renderTours(sorted);
    };

    applySortAndRender(currentDisplayedTours);

    // 4. BẮT SỰ KIỆN NÚT BẤM
    document.getElementById('sort-select').addEventListener('change', () => applySortAndRender(currentDisplayedTours));
    
    document.getElementById('btn-search-tours')?.addEventListener('click', () => {
        const depVal = document.getElementById('search-departure').value.toLowerCase().trim();
        const destVal = document.getElementById('search-destination').value.toLowerCase().trim();
        currentDisplayedTours = toursData.filter(tour => {
            return (depVal === "" || tour.departureLocation.toLowerCase().includes(depVal)) && 
                   (destVal === "" || tour.destination.toLowerCase().includes(destVal));
        });
        applySortAndRender(currentDisplayedTours);
    });

    document.getElementById('view-grid')?.addEventListener('click', () => {
        tourGrid.classList.remove('list-view');
        document.getElementById('view-grid').classList.add('active');
        document.getElementById('view-list').classList.remove('active');
    });

    document.getElementById('view-list')?.addEventListener('click', () => {
        tourGrid.classList.add('list-view');
        document.getElementById('view-list').classList.add('active');
        document.getElementById('view-grid').classList.remove('active');
    });

    // 5. XỬ LÝ MENU ĐỊA ĐIỂM Ở HEADER
    const locMenuBox = document.getElementById('loc-menu-box');
    document.getElementById('loc-toggle-btn')?.addEventListener('click', (e) => {
        e.stopPropagation(); locMenuBox.classList.toggle('show');
    });

    document.querySelectorAll('.loc-option').forEach(option => {
        option.addEventListener('click', (e) => {
            if (locMenuBox) locMenuBox.classList.remove('show');
            const selectedCity = e.target.getAttribute('data-loc');
            
            document.getElementById('header-loc-text').innerText = selectedCity === "" ? "Tất cả" : selectedCity;
            
            const bannerInfo = bannerData[selectedCity] || bannerData["default"];
            document.getElementById('hero-title').innerText = bannerInfo.title;
            document.getElementById('hero-desc').innerText = bannerInfo.desc;
            document.getElementById('hero-section').style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${bannerInfo.image}')`;

            currentDisplayedTours = toursData.filter(tour => selectedCity === "" || tour.departureLocation.toLowerCase().includes(selectedCity.toLowerCase()));
            applySortAndRender(currentDisplayedTours);
        });
    });
});