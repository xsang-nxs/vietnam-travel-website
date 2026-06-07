# Vietnam Travel Website

## 1. Giới thiệu dự án

Đây là website đặt tour du lịch Việt Nam được xây dựng phục vụ bài tập lớn môn Công nghệ Web. Hệ thống cho phép người dùng xem danh sách tour, tìm kiếm tour, xem chi tiết tour, thêm tour vào giỏ hàng, đặt tour, mô phỏng thanh toán, xuất hóa đơn và quản lý dữ liệu thông qua trang quản trị.

Dự án gồm 2 phần chính:

* **Frontend:** Giao diện người dùng được xây dựng bằng HTML, CSS và JavaScript.
* **Backend:** Sử dụng Node.js kết hợp JSON Server để mô phỏng API và lưu trữ dữ liệu.

---

## 2. Chức năng chính

### Phía người dùng

* Xem danh sách tour du lịch
* Xem chi tiết tour
* Tìm kiếm tour theo điểm đi, điểm đến
* Thêm tour vào giỏ hàng
* Đặt tour
* Mô phỏng thanh toán
* Xuất hóa đơn PDF
* Đăng nhập, đăng ký tài khoản
* Xem bài viết/blog du lịch
* Đánh giá và phản hồi

### Phía quản trị

* Quản lý tour
* Quản lý danh mục tour
* Quản lý người dùng
* Quản lý đơn đặt tour
* Quản lý bài viết/blog
* Quản lý đánh giá, phản hồi
* Theo dõi thông tin tổng quan trên dashboard

---

## 3. Công nghệ sử dụng

* HTML
* CSS
* JavaScript
* Node.js
* JSON Server
* json-server-auth
* Visual Studio Code
* Live Server

---

## 4. Cấu trúc thư mục

```text
vietnam-travel-website/
├── Web_Tourdulich/
│   ├── Giao_Dien/
│   │   ├── main.html
│   │   ├── admin.html
│   │   ├── auth.html
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   │
│   └── Tour_Backend/
│       ├── server.js
│       ├── db.json
│       ├── package.json
│       └── package-lock.json
│
├── report/
│   └── Bao_cao_web_tour.docx
│
├── README.md
└── .gitignore
```

---

## 5. Cách chạy dự án

### Bước 1: Tải source code về máy

Có thể tải bằng cách bấm nút **Code** trên GitHub, sau đó chọn **Download ZIP**.

Hoặc clone bằng lệnh:

```bash
git clone https://github.com/xsang-nxs/vietnam-travel-website.git
```

Sau đó mở thư mục dự án bằng Visual Studio Code.

---

### Bước 2: Chạy backend

Mở Terminal trong Visual Studio Code và chạy các lệnh sau:

```bash
cd Web_Tourdulich/Tour_Backend
npm install
node server.js
```

Nếu chạy thành công, backend sẽ hoạt động tại:

```text
http://localhost:3001
```

Lưu ý: Cửa sổ terminal chạy backend cần được giữ nguyên, không tắt trong quá trình sử dụng website.

---

### Bước 3: Chạy giao diện frontend

Sau khi backend đã chạy, mở thư mục:

```text
Web_Tourdulich/Giao_Dien
```

Tìm file:

```text
main.html
```

Click chuột phải vào file `main.html`, sau đó chọn:

```text
Open with Live Server
```

Website sẽ được mở trên trình duyệt.

---

## 6. Tài khoản và dữ liệu mẫu

Dữ liệu mẫu của hệ thống được lưu trong file:

```text
Web_Tourdulich/Tour_Backend/db.json
```

File này chứa dữ liệu về người dùng, tour, danh mục, đơn đặt tour, bài viết và đánh giá.

---

## 7. Báo cáo dự án

File báo cáo Word được lưu trong thư mục:

```text
report/
```

Tên file báo cáo:

```text
Bao_cao_web_tour.docx
```

---

## 8. Ghi chú

* Không upload thư mục `node_modules` lên GitHub.
* Khi tải project về máy mới, cần chạy `npm install` trong thư mục backend để cài lại các thư viện cần thiết.
* Frontend nên chạy bằng Live Server, không nên mở trực tiếp bằng đường dẫn `file:///`.
* Backend cần chạy trước để giao diện có thể lấy dữ liệu từ API.
