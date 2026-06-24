-- 법정동 코드 테이블
CREATE TABLE IF NOT EXISTS dongs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lawd_cd TEXT NOT NULL,          -- 시/군/구 코드 (5자리)
  dong_name TEXT NOT NULL,         -- 법정동명
  dong_code TEXT NOT NULL,         -- 법정동 코드 (10자리)
  city TEXT NOT NULL,              -- 시/도명
  district TEXT NOT NULL,          -- 시/군/구명
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성 (빠른 조회를 위해)
CREATE INDEX IF NOT EXISTS idx_dongs_lawd_cd ON dongs(lawd_cd);
CREATE INDEX IF NOT EXISTS idx_dongs_city_district ON dongs(city, district);

-- 아파트 단지 테이블
CREATE TABLE IF NOT EXISTS apartments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lawd_cd TEXT NOT NULL,          -- 시/군/구 코드
  dong_name TEXT NOT NULL,         -- 법정동명
  apt_name TEXT NOT NULL,          -- 아파트명
  city TEXT NOT NULL,              -- 시/도명
  district TEXT NOT NULL,          -- 시/군/구명
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_apts_lawd_cd_dong ON apartments(lawd_cd, dong_name);
CREATE INDEX IF NOT EXISTS idx_apts_city_district ON apartments(city, district);

-- 유니크 제약조건 (중복 방지)
CREATE UNIQUE INDEX IF NOT EXISTS idx_dongs_unique ON dongs(lawd_cd, dong_name);
CREATE UNIQUE INDEX IF NOT EXISTS idx_apts_unique ON apartments(lawd_cd, dong_name, apt_name);
