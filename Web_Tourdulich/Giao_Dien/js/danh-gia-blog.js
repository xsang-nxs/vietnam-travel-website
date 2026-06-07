// =========================================================================
// SCRIPT XỬ LÝ ĐỘNG DỮ LIỆU ĐÁNH GIÁ VÀ BÀI VIẾT BLOG (ĐỒNG BỘ DB.JSON)
// =========================================================================

const BACKEND_URL = 'http://localhost:3001';

function escapeHTML(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function renderStarsByRating(review) {
    let rating = Number(review.rating);

    // Nếu db.json chưa có rating nhưng có stars dạng "★★★★☆"
    if ((!rating || isNaN(rating)) && review.stars) {
        rating = String(review.stars).split('★').length - 1;
    }

    // Nếu vẫn không có thì mặc định 5 sao
    if (!rating || isNaN(rating)) {
        rating = 5;
    }

    rating = Math.max(1, Math.min(5, rating));

    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

document.addEventListener('DOMContentLoaded', async () => {
    // 1. TỰ ĐỘNG ĐỌC PARAMETER ĐƯỜNG DẪN ĐỂ NHẢY SANG TAB TƯƠNG ỨNG
    const urlParams = new URLSearchParams(window.location.search);
    const modeTab = urlParams.get('tab');
    
    if (modeTab === 'review') {
        switchMainTab('review');
    } else {
        switchMainTab('blog');
    }

    // 2. KÉO DỮ LIỆU BLOG TỪ MÁY CHỦ DB.JSON VÀ RENDER
    await renderBlogList();

    // 3. KÉO DỮ LIỆU ĐÁNH GIÁ VÀ DANH SÁCH ĐỊA ĐIỂM TỪ MÁY CHỦ DB.JSON VÀ RENDER
    await loadToursAndReviews();
});

// =========================================================================
// HÀM CHUYỂN TAB MƯỢT MÀ TOÀN CỤC
// =========================================================================
function switchMainTab(tabName) {
    document.querySelectorAll('.tab-section-content').forEach(sec => sec.style.display = 'none');
    document.querySelectorAll('.tab-nav-btn').forEach(btn => btn.classList.remove('active'));

    const activeSec = document.getElementById(`section-${tabName}`);
    const activeBtn = document.getElementById(`btn-tab-${tabName}`);
    
    if(activeSec) activeSec.style.display = 'block';
    if(activeBtn) activeBtn.classList.add('active');
}

// =========================================================================
// HÀM KẾT XUẤT DANH SÁCH BÀI VIẾT BLOG TỪ DB.JSON
// =========================================================================
// Biến toàn cục lưu trữ danh sách Blog để gọi lại mà không cần tải lại API
let globalBlogData = [];

// =========================================================================
// HÀM KẾT XUẤT DANH SÁCH BÀI VIẾT BLOG TỪ DB.JSON
// =========================================================================
async function renderBlogList() {
    const container = document.getElementById('blog-list-container');
    if (!container) return;

    try {
        const response = await fetch(`${BACKEND_URL}/blogs`);
        if (!response.ok) throw new Error("Lỗi API Blogs");
        let blogs = await response.json();

        // Đảo ngược mảng và lưu vào biến toàn cục
        globalBlogData = blogs.reverse();

        if (globalBlogData.length === 0) {
            container.innerHTML = `<p style="color:#718096; text-align:center; grid-column: 1 / -1; padding:30px; background:#fff; border-radius:12px;">Admin chưa đăng tải bài viết Cẩm nang du lịch nào.</p>`;
            return;
        }

        // Bổ sung onclick="viewBlogDetail('${b.id}')" vào mỗi card và trỏ chuột (cursor: pointer)
        container.innerHTML = globalBlogData.map(b => `
            <div class="blog-card" style="cursor: pointer;" onclick="viewBlogDetail('${b.id}')" title="Nhấn để đọc chi tiết">
                <div class="blog-img-box"><img src="${b.img}" alt="Blog image" onerror="this.src='https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500'"></div>
                <div class="blog-body">
                    <span class="blog-tag">${b.tag || 'Cẩm nang'}</span>
                    <h3>${b.title}</h3>
                    <p>${b.desc}</p>
                    <div class="blog-footer">
                        <span>✍️ Admin The3Coachrock</span>
                        <span>📅 ${b.date || 'Gần đây'}</span>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error("Lỗi khi tải blog:", error);
        container.innerHTML = `<p style="color:#e53e3e; text-align:center; grid-column: 1 / -1; padding:20px;">Lỗi kết nối máy chủ API khi tải bài viết.</p>`;
    }
}

// =========================================================================
// HÀM XEM CHI TIẾT 1 BÀI VIẾT CỤ THỂ
// =========================================================================
function viewBlogDetail(blogId) {
    // Tìm bài viết trong bộ nhớ tạm
    const blog = globalBlogData.find(b => String(b.id) === String(blogId));
    if (!blog) return;

    // Ẩn lưới danh sách, Hiện giao diện đọc chi tiết
    document.getElementById('blog-list-container').style.display = 'none';
    document.getElementById('blog-detail-container').style.display = 'block';

    // Đổ dữ liệu vào thanh Breadcrumb
    // Đã thêm dấu // để vô hiệu hóa dòng này vì em đã xóa bc-tag ở HTML
    // document.getElementById('bc-tag').innerText = blog.tag || 'Non Nước Việt Nam'; 
    
    document.getElementById('bc-title').innerText = blog.title;

    // Đổ dữ liệu vào nội dung bài
    document.getElementById('article-title').innerText = blog.title;
    document.getElementById('article-date').innerText = blog.date || 'Cập nhật gần đây';
    
    const coverImg = document.getElementById('article-img');
    coverImg.src = blog.img;
    coverImg.onerror = () => coverImg.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1000';

    // Xử lý tạo nội dung bài viết chi tiết
    const longContent = blog.content ? blog.content : `<p>${blog.desc}</p>`;

    document.getElementById('article-content').innerHTML = `
        <p style="font-weight: bold; font-size: 18px; margin-bottom: 30px; color: #1a4fa0; line-height: 1.6; border-left: 4px solid #b82025; padding-left: 15px;">${blog.desc}</p>
        ${longContent}
    `;

    // Cuộn màn hình lên trên cùng cho dễ đọc
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =========================================================================
// HÀM NÚT QUAY LẠI DANH SÁCH BÀI VIẾT
// =========================================================================
function backToBlogList() {
    document.getElementById('blog-detail-container').style.display = 'none';
    document.getElementById('blog-list-container').style.display = 'grid'; // Hiển thị lại dạng lưới
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
// =========================================================================
// HÀM TẢI ĐÁNH GIÁ (REVIEWS) VÀ LỌC THEO ĐỊA ĐIỂM TỪ DB.JSON
// =========================================================================
async function loadToursAndReviews() {
    const selectFilter = document.getElementById('review-tour-filter');
    const reviewContainer = document.getElementById('review-list-container');
    if(!selectFilter || !reviewContainer) return;

    try {
        // TẢI SONG SONG DANH SÁCH TOUR (Để lấy điểm đến) VÀ DANH SÁCH ĐÁNH GIÁ
        const [toursRes, reviewsRes] = await Promise.all([
            fetch(`${BACKEND_URL}/tours`),
            fetch(`${BACKEND_URL}/reviews`)
        ]);

        const tours = await toursRes.json();
        let allReviews = await reviewsRes.json();

        // 1. TẠO BỘ LỌC ĐỊA ĐIỂM THÔNG MINH
        // Lấy tất cả địa điểm từ bảng tours và bảng reviews gộp lại (để chống sót)
        let rawDestinations = tours.map(t => t.destination).concat(allReviews.map(r => r.destination));
        // Lọc bỏ trùng lặp và loại bỏ các dữ liệu rác
        const destinations = [...new Set(rawDestinations)].filter(d => d && d !== "Khác" && d !== "Đang cập nhật");

        selectFilter.innerHTML = '<option value="all">🔍 Xem tất cả địa điểm</option>';
        destinations.forEach(dest => {
            const opt = document.createElement('option');
            opt.value = dest;
            opt.innerText = `📍 Điểm đến: ${dest}`;
            selectFilter.appendChild(opt);
        });

        // Đảo ngược để nhận xét mới nhất mà admin vừa duyệt hiện lên đầu
        allReviews = allReviews.reverse();

        // 2. HÀM KẾT XUẤT VÀ LỌC ĐÁNH GIÁ
        const renderReviews = (filterDestination) => {
            const filtered = filterDestination === 'all' 
                ? allReviews 
                : allReviews.filter(r => r.destination === filterDestination || r.tourTitle === filterDestination);
            
            if(filtered.length === 0) {
                reviewContainer.innerHTML = `<p style="color:#718096; text-align:center; padding:30px; background:#fff; border-radius:12px;">Hiện chưa có đánh giá nào cho địa điểm này.</p>`;
                return;
            }

            reviewContainer.innerHTML = filtered.map(r => {
                const starsHTML = renderStarsByRating(r);
                const author = r.author || 'Người dùng ẩn danh';
                const targetTour = r.tourTitle || r.destination || 'Chưa rõ';

                return `
                    <div class="review-card">
                        <div class="rev-header">
                            <div class="rev-user">
                                <div class="rev-avatar">
                                    ${escapeHTML(author.charAt(0).toUpperCase())}
                                </div>

                                <div>
                                    <div class="rev-name">
                                        ${escapeHTML(author)}
                                    </div>

                                    <span class="rev-tour-target">
                                        🗺️ Hành trình: ${escapeHTML(targetTour)}
                                    </span>
                                </div>
                            </div>

                            <div class="rev-stars" title="${Number(r.rating || 5)} sao">
                                ${starsHTML}
                            </div>
                        </div>

                        <div class="rev-content">
                            “ ${escapeHTML(r.text || '')} ”
                        </div>
                    </div>
                `;
            }).join('');
        };

        // Lần đầu vào tự động hiển thị tất cả
        renderReviews('all');

        // Lắng nghe sự kiện người dùng chọn Dropdown Địa điểm
        selectFilter.addEventListener('change', (e) => {
            renderReviews(e.target.value);
        });

    } catch (err) {
        console.error(err);
        reviewContainer.innerHTML = `<p style="color:#e53e3e; text-align:center; padding:20px;">Lỗi kết nối máy chủ API. Vui lòng kiểm tra file db.json.</p>`;
    }
}