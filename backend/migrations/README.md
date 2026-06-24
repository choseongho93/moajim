# migrations

Postgres 마이그레이션. 현재는 비어 있음 — 부동산(`/property`) 서비스를 만들 때
법정동/실거래/공시지가 등 스키마를 `001_*.sql` 부터 추가한다.

적용:
```bash
psql "postgresql://USER:PASS@HOST:5432/DB" -f 001_xxx.sql
# 또는 backend/.env 에 AUTO_MIGRATE=true 설정 시 앱 시작 때 자동 적용
```
