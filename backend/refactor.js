const fs = require('fs');
const path = require('path');

// Đường dẫn vào thư mục modules
const modulesDir = path.join(__dirname, 'src', 'modules');

if (!fs.existsSync(modulesDir)) {
  console.error("Không tìm thấy src/modules. Hãy chắc chắn bạn để file này ở thư mục gốc.");
  process.exit(1);
}

const modules = fs.readdirSync(modulesDir);

modules.forEach(moduleName => {
  const modulePath = path.join(modulesDir, moduleName);

  // Chỉ quét các thư mục bên trong modules
  if (fs.statSync(modulePath).isDirectory()) {
    
    // Khai báo quy tắc: đuôi file nào thì vào thư mục nấy
    const folders = {
      'entity.ts': '1models',
      'service.ts': '2services',
      'middleware.ts': '3middlewares',
      'controller.ts': '4controllers',
      'routes.ts': '5routes'
    };

    // 1. Tạo sẵn các thư mục được đánh số
    Object.values(folders).forEach(folder => {
      const dirToCreate = path.join(modulePath, folder);
      if (!fs.existsSync(dirToCreate)) {
        fs.mkdirSync(dirToCreate);
      }
    });

    // 2. Di chuyển các file vào đúng thư mục
    const files = fs.readdirSync(modulePath);
    files.forEach(file => {
      const filePath = path.join(modulePath, file);
      
      if (fs.statSync(filePath).isFile()) {
        for (const [ext, targetFolder] of Object.entries(folders)) {
          if (file.endsWith(`.${ext}`)) {
            const targetPath = path.join(modulePath, targetFolder, file);
            fs.renameSync(filePath, targetPath);
            console.log(`✅ Đã chuyển: ${file} -> ${moduleName}/${targetFolder}`);
            break;
          }
        }
      }
    });
    
    // 3. Xóa các thư mục rỗng (VD: nếu module không có file middleware thì xóa thư mục 3middlewares cho gọn)
    Object.values(folders).forEach(folder => {
      const dirToCheck = path.join(modulePath, folder);
      if (fs.existsSync(dirToCheck) && fs.readdirSync(dirToCheck).length === 0) {
        fs.rmdirSync(dirToCheck);
      }
    });
  }
});

console.log("🎉 Hoàn tất! Cấu trúc đã được dọn dẹp theo thứ tự.");