import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import fs from 'fs';
import path from 'path';

const files = [
  'src/3pages/ProductDetailPage/ProductDetailPage.module.css',
  'src/3pages/ProfilePage/ProfilePage.module.css',
  'src/3pages/admin/AdminDashboard.module.css',
  'src/3pages/admin/ProductEditor.module.css',
  'src/3pages/admin/UserManagement.module.css',
  'src/3pages/AboutPage/AboutPage.module.css',
  'src/3pages/ContactPage/ContactPage.module.css',
  'src/3pages/BlogListPage/BlogListPage.module.css',
  'src/3pages/BlogDetailPage/BlogDetailPage.module.css',
  'src/3pages/admin/BlogEditor.module.css'
];

async function check() {
  let report = '';
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const css = fs.readFileSync(file, 'utf8');
    try {
      await postcss([tailwindcss]).process(css, { from: file });
      report += `${file} is OK\n`;
    } catch (err) {
      report += `Error in ${file}: ${err.message}\n`;
    }
  }
  fs.writeFileSync('report.txt', report);
}

check();
