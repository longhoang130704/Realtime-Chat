# Sử dụng Node.js làm base image
FROM node:18-alpine

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json trước để cài đặt dependencies
COPY package*.json ./

# Cài đặt dependencies
RUN npm install --omit=dev

# Copy toàn bộ mã nguồn vào container
COPY . .

# Mở cổng 3000 (hoặc cổng bạn sử dụng)
EXPOSE 3000

# Chạy ứng dụng
CMD ["node", "index.js"]
