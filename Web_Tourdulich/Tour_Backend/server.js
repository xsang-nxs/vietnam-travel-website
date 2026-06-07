const jsonServer = require('json-server');
const auth = require('json-server-auth');
const bcrypt = require('bcryptjs');

const app = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

app.db = router.db;

const rules = auth.rewriter({
    users: 666,
    categories: 666,
    tours: 666,
    bookings: 666,
    attractions: 666,
    blogs: 666,
    reviews: 666,
});

app.use(middlewares);
app.use(jsonServer.bodyParser);
app.use(rules);

// Route quên mật khẩu phải đặt trước app.use(auth)
app.post('/forgot-password', async (req, res) => {
    try {
        const { account, newPassword } = req.body;

        if (!account || !newPassword) {
            return res.status(400).json({
                message: 'Thiếu Email/SĐT hoặc mật khẩu mới.'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: 'Mật khẩu mới phải có ít nhất 6 ký tự.'
            });
        }

        const db = router.db;
        const users = db.get('users').value() || [];

        const foundUser = users.find(user => {
            const userEmail = String(user.email || '').toLowerCase();
            const userPhone = String(user.phone || '');
            const inputAccount = String(account || '').toLowerCase();

            return userEmail === inputAccount || userPhone === account;
        });

        if (!foundUser) {
            return res.status(404).json({
                message: 'Không tìm thấy tài khoản với Email hoặc Số điện thoại này.'
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        db.get('users')
            .find({ id: foundUser.id })
            .assign({
                password: hashedPassword
            })
            .write();

        return res.status(200).json({
            message: 'Cập nhật mật khẩu thành công.'
        });

    } catch (error) {
        console.error('Lỗi forgot-password:', error);

        return res.status(500).json({
            message: 'Lỗi server khi cập nhật mật khẩu.'
        });
    }
});

app.use(auth);
app.use(router);

app.listen(3001, () => {
    console.log('Fake API Server đang chạy thành công tại http://localhost:3001');
});