# Thiết kế Kiến trúc Tích hợp OpenManus với Blackbox AI

## Tổng quan
Dự án tích hợp sẽ kết hợp OpenManus (mô hình AI agent mã nguồn mở) với Blackbox AI API để tạo ra một giao diện web thống nhất cho việc tương tác với AI.

## Kiến trúc Hệ thống

### 1. Frontend (React Web Interface)
- **Giao diện chat**: Cho phép người dùng nhập tin nhắn và nhận phản hồi
- **Cấu hình API**: Cho phép người dùng cấu hình API keys và endpoints
- **Lịch sử cuộc trò chuyện**: Lưu trữ và hiển thị lịch sử chat
- **Chế độ AI**: Chuyển đổi giữa OpenManus và Blackbox AI

### 2. Backend (Flask API Server)
- **API Gateway**: Điều phối các yêu cầu giữa frontend và các AI services
- **Blackbox Integration**: Tích hợp với Blackbox AI API
- **OpenManus Integration**: Tích hợp với OpenManus agent
- **Session Management**: Quản lý phiên làm việc và lịch sử chat
- **Configuration Management**: Quản lý cấu hình API keys và settings

### 3. AI Services Integration
- **Blackbox AI**: Sử dụng API để gọi các mô hình AI của Blackbox
- **OpenManus Agent**: Tích hợp OpenManus agent để thực hiện các tác vụ phức tạp
- **Hybrid Mode**: Cho phép AI black box điều khiển OpenManus agent

## Luồng Dữ liệu

1. **User Input** → Frontend → Backend API Gateway
2. **API Gateway** → Xác định loại yêu cầu (Blackbox/OpenManus/Hybrid)
3. **Processing** → Gọi service tương ứng
4. **Response** → Trả về kết quả qua API Gateway → Frontend → User

## Tính năng Chính

### 1. Chat Interface
- Giao diện chat thân thiện với người dùng
- Hỗ trợ markdown rendering
- Upload file (images, PDFs)
- Real-time response streaming

### 2. AI Mode Selection
- **Pure Blackbox**: Chỉ sử dụng Blackbox AI
- **Pure OpenManus**: Chỉ sử dụng OpenManus agent
- **Hybrid Mode**: Blackbox AI điều khiển OpenManus agent

### 3. Configuration Panel
- API key management
- Model selection
- Parameter tuning
- Server configuration

## Cấu trúc Thư mục Dự án

```
integrated-manus/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── public/
│   └── package.json
├── backend/                 # Flask backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── services/       # Business logic
│   │   ├── models/         # Data models
│   │   └── utils/          # Utility functions
│   ├── config/             # Configuration files
│   └── requirements.txt
├── openmanus/              # OpenManus integration
│   └── [OpenManus files]
└── docs/                   # Documentation
```

## API Endpoints

### Backend API Routes
- `POST /api/chat` - Gửi tin nhắn chat
- `GET /api/chat/history` - Lấy lịch sử chat
- `POST /api/config` - Cập nhật cấu hình
- `GET /api/config` - Lấy cấu hình hiện tại
- `POST /api/upload` - Upload file
- `GET /api/models` - Lấy danh sách models

## Công nghệ Sử dụng

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Axios for API calls
- React Router for navigation

### Backend
- Flask
- Flask-CORS for cross-origin requests
- Requests for HTTP calls
- SQLite for session storage
- Python-dotenv for environment variables

### Integration
- OpenManus agent system
- Blackbox AI API client
- WebSocket for real-time communication (optional)

