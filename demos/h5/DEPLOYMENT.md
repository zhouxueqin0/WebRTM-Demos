# H5 Demo 部署指南 - 企业微信集成

本文档介绍如何将 H5 Demo 部署到服务器并集成到企业微信中。

---

## 📋 前置要求

- Node.js v22.21.1+
- npm
- 一台服务器（支持 HTTPS）
- 企业微信管理员权限

---

## 🚀 步骤 1：构建生产版本

### 1.1 配置环境变量

```bash
cd demos/h5

# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填入你的 Agora 配置
# VITE_APP_ID=your_app_id_here
# VITE_APP_CERT=your_app_cert_here
```

### 1.2 安装依赖

```bash
npm install
```

### 1.3 构建项目

```bash
npm run build
```

构建完成后，生产文件会输出到 `dist/` 目录。

---

## 🌐 步骤 2：部署到服务器

### 方案 A：使用 Nginx（推荐）

#### 2.1 上传文件到服务器

```bash
# 将 dist/ 目录上传到服务器
scp -r dist/* user@your-server:/var/www/rtm-demo/
```

#### 2.2 配置 Nginx

创建 Nginx 配置文件 `/etc/nginx/sites-available/rtm-demo`：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 重定向到 HTTPS（企业微信要求）
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL 证书配置
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # SSL 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 网站根目录
    root /var/www/rtm-demo;
    index index.html;

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript
               application/x-javascript application/xml+rss
               application/javascript application/json;
}
```

#### 2.3 启用配置并重启 Nginx

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/rtm-demo /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

---

### 方案 B：使用 Vercel（快速部署）

#### 2.1 安装 Vercel CLI

```bash
npm i -g vercel
```

#### 2.2 部署

```bash
cd demos/h5

# 登录 Vercel
vercel login

# 部署
vercel

# 生产环境部署
vercel --prod
```

#### 2.3 配置环境变量

在 Vercel 控制台：

1. 进入项目设置
2. 找到 Environment Variables
3. 添加：
   - `VITE_APP_ID`: 你的 Agora App ID
   - `VITE_APP_CERT`: 你的 Agora App Certificate

---

### 方案 C：使用阿里云 OSS + CDN

#### 2.1 上传到 OSS

```bash
# 安装 ossutil
# 参考：https://help.aliyun.com/document_detail/120075.html

# 配置 OSS
ossutil config

# 上传文件
cd demos/h5
ossutil cp -r dist/ oss://your-bucket-name/rtm-demo/ --update
```

#### 2.2 配置 CDN

1. 在阿里云控制台创建 CDN 加速域名
2. 源站类型选择 OSS
3. 开启 HTTPS（必须）
4. 配置缓存规则

#### 2.3 配置 SPA 路由

在 OSS 控制台：

1. 基础设置 → 静态页面
2. 默认首页：`index.html`
3. 默认 404 页：`index.html`

---

## 📱 步骤 3：集成到企业微信

### 3.1 创建企业微信应用

1. 登录企业微信管理后台：https://work.weixin.qq.com/
2. 进入「应用管理」→「应用」→「创建应用」
3. 填写应用信息：
   - 应用名称：RTM SDK Demo
   - 应用 Logo：上传图标
   - 可见范围：选择需要使用的部门/成员

### 3.2 配置应用主页

1. 进入应用详情
2. 找到「网页授权及 JS-SDK」
3. 设置「可信域名」：

   ```
   your-domain.com
   ```

   （不要加 https:// 和路径）

4. 设置「应用主页」：
   ```
   https://your-domain.com
   ```

### 3.3 配置网页授权

如果需要获取企业微信用户信息：

1. 在应用详情中找到「网页授权及 JS-SDK」
2. 设置「授权回调域」：

   ```
   your-domain.com
   ```

3. 记录以下信息（后续开发可能需要）：
   - CorpID（企业 ID）
   - AgentID（应用 ID）
   - Secret（应用密钥）

### 3.4 测试访问

1. 在企业微信手机端打开「工作台」
2. 找到刚创建的应用
3. 点击进入，应该能看到 H5 页面

---

## 🔧 常见问题

### Q1: 页面显示空白

**原因**：可能是路由配置问题

**解决**：

- 检查 Nginx 配置中的 `try_files` 是否正确
- 确保所有路由都指向 `index.html`

### Q2: 提示"请在 HTTPS 环境下使用"

**原因**：RTM SDK 需要 HTTPS

**解决**：

- 确保服务器配置了 SSL 证书
- 使用 Let's Encrypt 免费证书：
  ```bash
  sudo apt-get install certbot python3-certbot-nginx
  sudo certbot --nginx -d your-domain.com
  ```

### Q3: 企业微信中无法访问

**原因**：可信域名未配置

**解决**：

1. 检查企业微信应用的「可信域名」配置
2. 确保域名不包含 `https://` 和路径
3. 等待配置生效（可能需要几分钟）

### Q4: 静态资源 404

**原因**：构建路径配置问题

**解决**：
检查 `vite.config.ts` 中的 `base` 配置：

```typescript
export default defineConfig({
  base: "/", // 如果部署在子目录，改为 '/rtm-demo/'
  // ...
});
```

### Q5: 环境变量未生效

**原因**：构建时未读取到环境变量

**解决**：

1. 确保 `.env` 文件在 `demos/h5/` 目录下
2. 环境变量必须以 `VITE_` 开头
3. 修改后需要重新构建：`npm run build`

### Q6: 企业微信中页面加载慢

**原因**：资源未压缩或缓存

**解决**：

1. 启用 Gzip 压缩（见 Nginx 配置）
2. 配置静态资源缓存
3. 使用 CDN 加速
4. 优化图片大小

---

## 📊 性能优化建议

### 1. 启用 Gzip 压缩

已在 Nginx 配置中包含，可减少 70% 传输大小。

### 2. 配置 CDN

使用阿里云 CDN、腾讯云 CDN 或 Cloudflare 加速静态资源。

### 3. 图片优化

```bash
# 压缩图片
npm install -g imagemin-cli
imagemin src/assets/*.png --out-dir=dist/assets
```

### 4. 代码分割

Vite 已自动进行代码分割，无需额外配置。

### 5. 预加载关键资源

在 `index.html` 中添加：

```html
<link rel="preload" href="/assets/main.js" as="script" />
<link rel="preload" href="/assets/main.css" as="style" />
```

---

## 🔒 安全建议

### 1. 环境变量保护

- ⚠️ 不要将 `.env` 文件提交到 Git
- ✅ 使用服务器环境变量或构建时注入

### 2. HTTPS 强制

- ✅ 所有请求强制使用 HTTPS
- ✅ 配置 HSTS 头：
  ```nginx
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  ```

### 3. CSP 配置

在 Nginx 中添加内容安全策略：

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;
```

### 4. 防止点击劫持

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
```

---

## 📞 技术支持

如有问题，请参考：

- Agora RTM 文档：https://docs.agora.io/cn/Real-time-Messaging/landing-page
- 企业微信开发文档：https://developer.work.weixin.qq.com/document/
- Vite 文档：https://vitejs.dev/

---

**最后更新**：2026-01-30
