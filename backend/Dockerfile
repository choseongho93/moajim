FROM python:3.12-slim

WORKDIR /app

# 의존성 먼저 설치 (레이어 캐시)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=8000
EXPOSE 8000

# Fly.io/Railway/컨테이너 공통: $PORT로 바인딩
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
