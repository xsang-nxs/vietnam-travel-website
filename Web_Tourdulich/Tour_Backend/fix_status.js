const fs = require('fs');

// 1. Đọc dữ liệu từ db.json
const rawData = fs.readFileSync('db.json', 'utf8');
const db = JSON.parse(rawData);

// 2. Chuyển TẤT CẢ các tour về trạng thái 'active' (Còn chỗ) trước
db.tours.forEach(tour => {
    tour.status = "active";
});

// 3. Hàm tạo danh sách các vị trí ngẫu nhiên không bị trùng lặp
function getRandomIndexes(totalItems, count) {
    const indexes = new Set();
    while(indexes.size < count) {
        indexes.add(Math.floor(Math.random() * totalItems));
    }
    return Array.from(indexes);
}

// 4. Chọn ngẫu nhiên 15 tour làm 'sold_out' và 10 tour làm 'inactive'
const totalTours = db.tours.length;
const randomPositions = getRandomIndexes(totalTours, 25); // Lấy 25 vị trí ngẫu nhiên

for (let i = 0; i < randomPositions.length; i++) {
    const index = randomPositions[i];
    if (i < 15) {
        // 15 vị trí đầu tiên thành Hết chỗ
        db.tours[index].status = "sold_out";
    } else {
        // 10 vị trí tiếp theo thành Tạm ngưng
        db.tours[index].status = "inactive";
    }
}

// 5. Ghi đè lại dữ liệu
fs.writeFileSync('db.json', JSON.stringify(db, null, 2), 'utf8');

console.log(`Đã hoàn thành! Đã chuyển 15 tour thành "sold_out" và 10 tour thành "inactive". Phần lớn còn lại là "active".`);