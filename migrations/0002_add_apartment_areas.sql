-- 아파트 단지별 평형(전용면적) 테이블
CREATE TABLE IF NOT EXISTS apartment_areas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lawd_cd TEXT NOT NULL,
  dong_name TEXT NOT NULL,
  apt_name TEXT NOT NULL,
  area TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_areas_apt ON apartment_areas(lawd_cd, dong_name, apt_name);
CREATE UNIQUE INDEX IF NOT EXISTS idx_areas_unique ON apartment_areas(lawd_cd, dong_name, apt_name, area);
