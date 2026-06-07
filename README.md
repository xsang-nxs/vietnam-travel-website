# Website đặt tour du lịch Việt Nam

Đây là bài tập lớn môn **Công nghệ Web**, đề tài **“Website đặt tour du lịch Việt Nam”**.

Project tập trung vào việc xây dựng một website hỗ trợ người dùng tra cứu thông tin tour du lịch, xem chi tiết tour, đặt tour, mô phỏng thanh toán và quản lý dữ liệu thông qua trang quản trị. Hệ thống được xây dựng theo mô hình frontend kết hợp backend mô phỏng API bằng Node.js và JSON Server.

---

## Mục tiêu đề tài

Đề tài được xây dựng nhằm hỗ trợ quản lý và đặt tour du lịch trực tuyến, bao gồm:

* Hiển thị danh sách tour du lịch.
* Tìm kiếm tour theo điểm khởi hành và điểm đến.
* Xem thông tin chi tiết của từng tour.
* Thêm tour vào giỏ hàng.
* Đặt tour và mô phỏng thanh toán.
* Xuất hóa đơn/thông tin đặt tour.
* Quản lý tour, danh mục, người dùng, đơn đặt tour và bài viết.
* Xây dựng giao diện website thân thiện, dễ sử dụng.
* Áp dụng HTML, CSS, JavaScript và Node.js vào xây dựng website hoàn chỉnh.

---

## Công nghệ sử dụng

* HTML
* CSS
* JavaScript
* Node.js
* JSON Server
* json-server-auth
* Visual Studio Code
* Live Server
* GitHub

---

## Cấu trúc thư mục

```text
vietnam-travel-website
│
├── Web_Tourdulich
│   │
│   ├── Giao_Dien
│   │   ├── main.html
│   │   ├── admin.html
│   │   ├── auth.html
│   │   ├── cart.html
│   │   ├── detail.html
│   │   ├── profile.html
│   │   ├── ticket.html
│   │   ├── blog.html
│   │   ├── css
│   │   ├── js
│   │   └── images
│   │
│   └── Tour_Backend
│       ├── server.js
│       ├── db.json
│       ├── webdata.json
│       ├── package.json
│       └── package-lock.json
│
├── report
│   └── Bao_cao_web_tour.docx
│
├── README.md
└── .gitignore
```

---

## Chức năng chính của website

### 1. Phía người dùng

Website cho phép người dùng thực hiện các chức năng cơ bản như:

* Xem danh sách tour du lịch.
* Xem chi tiết tour.
* Tìm kiếm tour theo điểm đi và điểm đến.
* Thêm tour vào giỏ hàng.
* Quản lý giỏ hàng.
* Đặt tour.
* Mô phỏng thanh toán.
* Xem thông tin đặt tour sau khi thanh toán.
* Xuất hóa đơn/thông tin xác nhận đặt tour.
* Đăng ký tài khoản.
* Đăng nhập tài khoản.
* Xem bài viết/blog du lịch.
* Gửi đánh giá, phản hồi.

### 2. Phía quản trị

Trang quản trị hỗ trợ quản lý dữ liệu của hệ thống, bao gồm:

* Quản lý tour du lịch.
* Quản lý danh mục tour.
* Quản lý người dùng.
* Quản lý đơn đặt tour.
* Quản lý bài viết/blog.
* Quản lý đánh giá và phản hồi.
* Theo dõi thông tin tổng quan trên dashboard.

---

## Dữ liệu của hệ thống

Dữ liệu được lưu trong file:

```text
Web_Tourdulich/Tour_Backend/db.json
```

File này chứa dữ liệu mẫu cho website, bao gồm:

* Người dùng
* Danh mục tour
* Danh sách tour
* Đơn đặt tour
* Vé tham quan
* Bài viết/blog
* Đánh giá/phản hồi

Backend sử dụng JSON Server để mô phỏng API, giúp frontend có thể lấy dữ liệu, thêm dữ liệu, sửa dữ liệu và xóa dữ liệu trong quá trình chạy thử website.

---

## Cách chạy project

Trước khi chạy project, cần cài đặt:

* Node.js
* Visual Studio Code
* Extension Live Server trong Visual Studio Code

---

## Bước 1: Tải source code về máy

Có thể tải project bằng cách bấm nút **Code** trên GitHub, sau đó chọn:

```text
Download ZIP
```

Hoặc clone project bằng lệnh:

```bash
git clone https://github.com/xsang-nxs/vietnam-travel-website.git
```

Sau khi tải về, mở thư mục project bằng Visual Studio Code.

---

## Bước 2: Chạy backend

Mở Terminal trong Visual Studio Code và di chuyển vào thư mục backend:

```bash
cd Web_Tourdulich/Tour_Backend
```

Cài đặt các thư viện cần thiết:

```bash
npm install
```

Sau đó chạy server:

```bash
node server.js
```

Nếu chạy thành công, backend sẽ hoạt động tại địa chỉ:

```text
http://localhost:3001
```

Lưu ý: Cần giữ nguyên cửa sổ Terminal đang chạy backend, không được tắt trong quá trình sử dụng website.

---

## Bước 3: Chạy frontend

Sau khi backend đã chạy thành công, mở thư mục:

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

Khi đó website sẽ được mở trên trình duyệt.

Không nên mở trực tiếp bằng đường dẫn dạng:

```text
file:///...
```

Nên mở bằng Live Server để website hoạt động ổn định hơn.

---

## Cách mở các trang chính

Sau khi mở `main.html` bằng Live Server, có thể truy cập các trang chính của website như sau:

```text
main.html        Trang chủ
auth.html        Trang đăng nhập / đăng ký
detail.html      Trang chi tiết tour
cart.html        Trang giỏ hàng
ticket.html      Trang vé tham quan
blog.html        Trang bài viết du lịch
profile.html     Trang thông tin cá nhân
admin.html       Trang quản trị
```

Trang chính nên mở đầu tiên là:

```text
Web_Tourdulich/Giao_Dien/main.html
```

---

## Cách mở báo cáo

File báo cáo của bài tập lớn được lưu trong thư mục:

```text
report
```

Tên file báo cáo:

```text
Bao_cao_web_tour.docx
```

Có thể tải trực tiếp file này trên GitHub hoặc mở bằng Microsoft Word sau khi clone/download project về máy.

---

## Một số API chính

Backend chạy tại:

```text
http://localhost:3001
```

Một số API được sử dụng trong project:

```text
/users
/categories
/tours
/bookings
/ticket_bookings
/attractions
/blogs
/reviews
```

Các API này được dùng để cung cấp dữ liệu cho giao diện người dùng và trang quản trị.

---

## Một số lỗi thường gặp khi chạy project

### 1. Lỗi npm bị chặn trong PowerShell

Nếu chạy `npm install` bị lỗi:

```text
npm.ps1 cannot be loaded because running scripts is disabled on this system
```

Có thể dùng lệnh:

```bash
npm.cmd install
```

Hoặc mở quyền tạm thời cho PowerShell bằng lệnh:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Sau đó chạy lại:

```bash
npm install
```

---

### 2. Giao diện không tải được dữ liệu tour

Nguyên nhân thường gặp là chưa chạy backend.

Cần chạy backend trước bằng lệnh:

```bash
cd Web_Tourdulich/Tour_Backend
node server.js
```

Sau đó mới mở `main.html` bằng Live Server.

---

### 3. Không nên upload thư mục node_modules

Thư mục `node_modules` không được upload lên GitHub vì dung lượng lớn.

Khi tải project về máy mới, chỉ cần chạy:

```bash
npm install
```

là các thư viện sẽ được cài đặt lại.

---

## Ghi chú

* Backend cần chạy trước frontend.
* Frontend nên mở bằng Live Server.
* Dữ liệu mẫu nằm trong file `db.json`.
* Báo cáo nằm trong thư mục `report`.
* Project sử dụng JSON Server để mô phỏng backend, phù hợp với mục đích học tập và demo bài tập lớn.

---

## Thành viên thực hiện

* Nguyễn Xuân Sáng
* Phạm Thùy Dương
* Trần Thúy Quỳnh
