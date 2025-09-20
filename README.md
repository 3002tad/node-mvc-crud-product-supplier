# Product Supplier Management System

Hệ thống quản lý sản phẩm và nhà cung cấp được xây dựng với Node.js, MongoDB và Mongoose theo kiến trúc MVC.

## Tính năng

### Quản lý Nhà cung cấp (Suppliers)
- ✅ Xem danh sách tất cả nhà cung cấp
- ✅ Thêm nhà cung cấp mới
- ✅ Xem chi tiết nhà cung cấp
- ✅ Chỉnh sửa thông tin nhà cung cấp
- ✅ Xóa nhà cung cấp (chỉ khi không có sản phẩm)
- ✅ Xem danh sách sản phẩm của nhà cung cấp

### Quản lý Sản phẩm (Products)
- ✅ Xem danh sách tất cả sản phẩm
- ✅ Thêm sản phẩm mới
- ✅ Xem chi tiết sản phẩm
- ✅ Chỉnh sửa thông tin sản phẩm
- ✅ Xóa sản phẩm
- ✅ Liên kết sản phẩm với nhà cung cấp

### Tính năng khác
- ✅ Giao diện responsive với Bootstrap 5
- ✅ Validation dữ liệu
- ✅ Xử lý lỗi
- ✅ Mối quan hệ giữa Product và Supplier
- ✅ Dữ liệu mẫu để testing

## Cấu trúc dự án

```
node-mvc-crud-product-supplier/
├── models/
│   ├── Supplier.js          # Model cho nhà cung cấp
│   └── Product.js           # Model cho sản phẩm
├── controllers/
│   ├── supplierController.js # Controller cho nhà cung cấp
│   └── productController.js  # Controller cho sản phẩm
├── routes/
│   ├── supplierRoutes.js    # Routes cho nhà cung cấp
│   └── productRoutes.js     # Routes cho sản phẩm
├── views/
│   ├── partials/
│   │   ├── header.ejs       # Header template
│   │   └── footer.ejs       # Footer template
│   ├── suppliers/
│   │   ├── index.ejs        # Danh sách nhà cung cấp
│   │   ├── new.ejs          # Form thêm nhà cung cấp
│   │   ├── edit.ejs         # Form sửa nhà cung cấp
│   │   └── show.ejs         # Chi tiết nhà cung cấp
│   ├── products/
│   │   ├── index.ejs        # Danh sách sản phẩm
│   │   ├── new.ejs          # Form thêm sản phẩm
│   │   ├── edit.ejs         # Form sửa sản phẩm
│   │   └── show.ejs         # Chi tiết sản phẩm
│   ├── index.ejs            # Trang chủ
│   └── error.ejs            # Trang lỗi
├── public/
│   └── css/
│       └── style.css        # Custom CSS
├── app.js                   # File chính của ứng dụng
├── seed.js                  # File khởi tạo dữ liệu mẫu
├── package.json
└── README.md
```

## Cài đặt và chạy dự án

### 1. Yêu cầu hệ thống
- Node.js (v14 trở lên)
- MongoDB (v4.4 trở lên)
- npm hoặc yarn

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình MongoDB
Đảm bảo MongoDB đang chạy trên localhost:27017 hoặc cập nhật connection string trong:
- `app.js` (dòng 14)
- `seed.js` (dòng 7)

### 4. Khởi tạo dữ liệu mẫu (tùy chọn)
```bash
npm run seed
```

### 5. Chạy ứng dụng
```bash
# Chạy production
npm start

# Chạy development (với nodemon)
npm run dev
```

### 6. Truy cập ứng dụng
Mở trình duyệt và truy cập: http://localhost:3000

## Cấu trúc Database

### Suppliers Collection
```javascript
{
  _id: ObjectId,
  name: String (required, max 100 chars),
  address: String (required, max 255 chars),
  phone: String (required, phone format),
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String (required, max 100 chars),
  price: Number (required, min 0),
  quantity: Number (required, min 0),
  supplierId: ObjectId (required, ref: 'Supplier'),
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Suppliers
- `GET /suppliers` - Danh sách nhà cung cấp
- `GET /suppliers/new` - Form thêm nhà cung cấp
- `POST /suppliers` - Tạo nhà cung cấp mới
- `GET /suppliers/:id` - Chi tiết nhà cung cấp
- `GET /suppliers/:id/edit` - Form sửa nhà cung cấp
- `PUT /suppliers/:id` - Cập nhật nhà cung cấp
- `DELETE /suppliers/:id` - Xóa nhà cung cấp

### Products
- `GET /products` - Danh sách sản phẩm
- `GET /products/new` - Form thêm sản phẩm
- `POST /products` - Tạo sản phẩm mới
- `GET /products/:id` - Chi tiết sản phẩm
- `GET /products/:id/edit` - Form sửa sản phẩm
- `PUT /products/:id` - Cập nhật sản phẩm
- `DELETE /products/:id` - Xóa sản phẩm

## Công nghệ sử dụng

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose ODM
- **View Engine**: EJS
- **Frontend**: Bootstrap 5, Font Awesome
- **Middleware**: body-parser, method-override
- **Dev Tools**: nodemon

## Tính năng nổi bật

1. **Kiến trúc MVC**: Tách biệt rõ ràng Model, View, Controller
2. **Responsive Design**: Giao diện thân thiện trên mọi thiết bị
3. **Data Validation**: Kiểm tra dữ liệu đầu vào
4. **Error Handling**: Xử lý lỗi toàn diện
5. **Relationship Management**: Quản lý mối quan hệ 1-nhiều giữa Supplier và Product
6. **CRUD Operations**: Đầy đủ các thao tác Create, Read, Update, Delete
7. **Seed Data**: Dữ liệu mẫu để testing
8. **RESTful API**: Thiết kế API theo chuẩn REST

## Hướng dẫn phát triển

### Thêm tính năng mới
1. Tạo model trong `models/`
2. Tạo controller trong `controllers/`
3. Tạo routes trong `routes/`
4. Tạo views trong `views/`
5. Cập nhật `app.js` để import routes mới

### Thêm validation
Sử dụng Mongoose schema validation hoặc middleware validation

### Thêm authentication
Có thể tích hợp passport.js hoặc JWT

## Troubleshooting

### MongoDB connection error
- Kiểm tra MongoDB service đang chạy
- Kiểm tra connection string
- Kiểm tra firewall settings

### Port already in use
- Thay đổi PORT trong `.env` hoặc `app.js`
- Kill process đang sử dụng port: `lsof -ti:3000 | xargs kill`

### Package dependency issues
```bash
rm -rf node_modules package-lock.json
npm install
```

## License
MIT License

## Tác giả
Student Project - Product Supplier Management System