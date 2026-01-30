# GitHub Pages Setup Guide

Hướng dẫn thiết lập GitHub Pages cho project này.

## Bước 1: Enable GitHub Pages trong Repository Settings

1. Vào repository trên GitHub
2. Click vào **Settings** tab
3. Scroll xuống phần **Pages** ở sidebar bên trái
4. Trong phần **Source**, chọn:
   - **Source**: `GitHub Actions`
5. Save changes

## Bước 2: Push code lên GitHub

```bash
git add .
git commit -m "Setup GitHub Pages workflow"
git push origin main
```

## Bước 3: Kiểm tra Deployment

1. Vào tab **Actions** trên GitHub repository
2. Bạn sẽ thấy workflow "Deploy to GitHub Pages" đang chạy
3. Đợi workflow hoàn thành (thường mất 2-3 phút)
4. Sau khi hoàn thành, vào tab **Settings > Pages** để xem URL của site

## URL của Site

Nếu repository name là `project_3D_developer_portfolio`:
- URL sẽ là: `https://[username].github.io/project_3D_developer_portfolio/`

Nếu repository name là `[username].github.io`:
- URL sẽ là: `https://[username].github.io/`

## Lưu ý

- Workflow sẽ tự động chạy khi bạn push code lên branch `main` hoặc `master`
- Nếu repository name khác `project_3D_developer_portfolio`, bạn cần cập nhật `base` path trong `vite.config.js`
- File `.nojekyll` đã được tạo để đảm bảo GitHub Pages không xử lý file như Jekyll

## Troubleshooting

### Nếu site không load được:

1. Kiểm tra base path trong `vite.config.js` có đúng với repository name không
2. Kiểm tra workflow có chạy thành công không trong tab **Actions**
3. Đảm bảo file `.nojekyll` đã được commit

### Nếu assets không load:

- Kiểm tra base path trong `vite.config.js`
- Đảm bảo tất cả assets sử dụng relative paths hoặc paths bắt đầu với base path
