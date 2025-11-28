# Order Management API - Final Exam
Hệ thống quản lý đơn hàng đơn giản với ASP.NET Core Web API và HTML/CSS/JS.

## 📝🔗 Link đề bài

```
https://www.notion.so/thi-cu-i-k-L-p-tr-nh-Back-end-V-a-2b0e9f0ef23c811e82e8d589eef0bfad?source=copy_link
```

## 🚀 Cài đặt packages

```
dotnet add package Microsoft.EntityFrameworkCore --version 8.0.12
dotnet add package Microsoft.EntityFrameworkCore.SqlServer --version 8.0.12
dotnet add package Microsoft.EntityFrameworkCore.Tools --version 8.0.12
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 8.0.12
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore --version 8.0.12
dotnet add package Swashbuckle.AspNetCore --version 6.5.0
```

## 📋 Công nghệ sử dụng

**Back-end:**
- ASP.NET Core 8.0 Web API
- Entity Framework Core 8.0
- SQL Server 2022
- JWT Authentication
- Identity Framework

**Front-end:**
- HTML5, CSS3, JavaScript

## 🗄️ Database Schema

- **Products**: Quản lý sản phẩm
- **Customers**: Quản lý khách hàng
- **Orders**: Quản lý đơn hàng
- **OrderDetails**: Chi tiết đơn hàng
- **Identity Tables**: Quản lý user và roles

## 🚀 Hướng dẫn chạy project

### 1. Cài đặt môi trường
- .NET SDK 8.0
- SQL Server 2022
- Visual Studio Code

### 2. Clone project
```bash
git clone https://github.com/Hosihung-jihoon/OrderManagementAPI-FinalExam.git
cd OrderManagementAPI-FinalExam
```

### 3. Cấu hình Connection String
Sửa file `appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=OrderManagementDB;User Id=OrderAPIUser;Password=YOUR_PASSWORD;TrustServerCertificate=True;Encrypt=False;"
}
```

### 4. Tạo Database
```bash
dotnet ef database update
```

### 5. Chạy project
```bash
dotnet run
```

Truy cập: `http://localhost:5228/login.html`

### 6. Tài khoản test
- **Admin**: admin@test.com / Admin123

## 📦 Deploy lên IIS

1. Publish project:
```bash
dotnet publish -c Release -o C:\inetpub\OrderManagementAPI
```

2. Tạo Application Pool và Website trong IIS Manager
3. Truy cập: `http://localhost:8080`
