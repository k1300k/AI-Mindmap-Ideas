-- ==========================================
-- IdeaFlow Mindmap - Supabase Database Schema
-- ==========================================
-- 
-- 이 파일을 Supabase SQL Editor에서 실행하세요
-- 
-- 실행 방법:
-- 1. Supabase Dashboard 접속
-- 2. SQL Editor 탭 클릭
-- 3. "+ New query" 버튼 클릭
-- 4. 이 파일의 내용을 복사하여 붙여넣기
-- 5. "Run" 버튼 클릭
--
-- @version 2.0.0
-- @date 2025-11-14
-- ==========================================

-- ==========================================
-- 마인드맵 데이터 테이블
-- ==========================================

CREATE TABLE IF NOT EXISTS mindmaps (
  -- 기본 정보
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- 마인드맵 데이터
  title TEXT NOT NULL DEFAULT '새 마인드맵',
  data JSONB NOT NULL,
  
  -- 타임스탬프
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 코멘트 추가 (테이블 및 컬럼 설명)
-- ==========================================

COMMENT ON TABLE mindmaps IS '사용자별 마인드맵 데이터를 저장하는 테이블';
COMMENT ON COLUMN mindmaps.id IS '마인드맵 고유 식별자 (UUID)';
COMMENT ON COLUMN mindmaps.user_id IS '사용자 ID (auth.users 테이블 참조)';
COMMENT ON COLUMN mindmaps.title IS '마인드맵 제목';
COMMENT ON COLUMN mindmaps.data IS '마인드맵 전체 데이터 (nodes, connections, zoom, pan 등)';
COMMENT ON COLUMN mindmaps.created_at IS '생성 시각 (UTC)';
COMMENT ON COLUMN mindmaps.updated_at IS '최종 수정 시각 (UTC)';

-- ==========================================
-- 인덱스 생성 (성능 최적화)
-- ==========================================

-- 사용자별 마인드맵 조회 최적화
CREATE INDEX IF NOT EXISTS idx_mindmaps_user_id 
  ON mindmaps(user_id);

-- 최신 마인드맵 정렬 최적화
CREATE INDEX IF NOT EXISTS idx_mindmaps_updated_at 
  ON mindmaps(updated_at DESC);

-- 복합 인덱스 (사용자 + 수정일)
CREATE INDEX IF NOT EXISTS idx_mindmaps_user_updated 
  ON mindmaps(user_id, updated_at DESC);

-- ==========================================
-- Row Level Security (RLS) 활성화
-- ==========================================

ALTER TABLE mindmaps ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- RLS 정책 생성
-- ==========================================

-- 1. SELECT 정책: 사용자는 자신의 마인드맵만 조회 가능
DROP POLICY IF EXISTS "사용자는 자신의 마인드맵만 조회 가능" ON mindmaps;
CREATE POLICY "사용자는 자신의 마인드맵만 조회 가능"
  ON mindmaps
  FOR SELECT
  USING (auth.uid() = user_id);

-- 2. INSERT 정책: 사용자는 자신의 마인드맵만 생성 가능
DROP POLICY IF EXISTS "사용자는 자신의 마인드맵만 생성 가능" ON mindmaps;
CREATE POLICY "사용자는 자신의 마인드맵만 생성 가능"
  ON mindmaps
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. UPDATE 정책: 사용자는 자신의 마인드맵만 수정 가능
DROP POLICY IF EXISTS "사용자는 자신의 마인드맵만 수정 가능" ON mindmaps;
CREATE POLICY "사용자는 자신의 마인드맵만 수정 가능"
  ON mindmaps
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 4. DELETE 정책: 사용자는 자신의 마인드맵만 삭제 가능
DROP POLICY IF EXISTS "사용자는 자신의 마인드맵만 삭제 가능" ON mindmaps;
CREATE POLICY "사용자는 자신의 마인드맵만 삭제 가능"
  ON mindmaps
  FOR DELETE
  USING (auth.uid() = user_id);

-- ==========================================
-- 트리거 함수: updated_at 자동 업데이트
-- ==========================================

-- 기존 함수 삭제 (있다면)
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- 새 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 함수 설명
COMMENT ON FUNCTION update_updated_at_column() IS 'UPDATE 시 updated_at 컬럼을 자동으로 현재 시각(UTC)으로 업데이트';

-- ==========================================
-- 트리거 생성
-- ==========================================

-- 기존 트리거 삭제 (있다면)
DROP TRIGGER IF EXISTS update_mindmaps_updated_at ON mindmaps;

-- 새 트리거 생성
CREATE TRIGGER update_mindmaps_updated_at
  BEFORE UPDATE ON mindmaps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 샘플 데이터 (선택사항)
-- ==========================================

-- 주석을 제거하면 샘플 데이터가 삽입됩니다
-- 주의: 실제 사용 시에는 샘플 데이터를 삽입하지 마세요

/*
INSERT INTO mindmaps (user_id, title, data)
VALUES (
  auth.uid(), -- 현재 로그인한 사용자
  '샘플 마인드맵',
  '{
    "version": "2.0.0",
    "nodes": [
      {
        "id": "node-1",
        "content": "중앙 아이디어",
        "x": 400,
        "y": 300,
        "color": "#3B82F6",
        "size": "large"
      }
    ],
    "connections": [],
    "zoom": 1,
    "pan": { "x": 0, "y": 0 }
  }'::jsonb
);
*/

-- ==========================================
-- 유틸리티 함수 (선택사항)
-- ==========================================

-- 사용자의 마인드맵 개수 조회
CREATE OR REPLACE FUNCTION get_user_mindmap_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM mindmaps
    WHERE user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_user_mindmap_count(UUID) IS '특정 사용자의 마인드맵 개수 반환';

-- 마인드맵 검색 함수
CREATE OR REPLACE FUNCTION search_mindmaps(search_query TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT m.id, m.title, m.created_at, m.updated_at
  FROM mindmaps m
  WHERE m.user_id = auth.uid()
    AND (
      m.title ILIKE '%' || search_query || '%'
      OR m.data::text ILIKE '%' || search_query || '%'
    )
  ORDER BY m.updated_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION search_mindmaps(TEXT) IS '제목 또는 데이터 내용으로 마인드맵 검색';

-- ==========================================
-- 실시간 구독 활성화 안내
-- ==========================================

-- 다음 단계를 수행하세요:
-- 1. Supabase Dashboard > Database > Replication 이동
-- 2. 'mindmaps' 테이블 찾기
-- 3. "Realtime" 토글을 ON으로 변경
-- 4. 이제 실시간 데이터 동기화가 작동합니다!

-- ==========================================
-- 스키마 정보 확인 쿼리
-- ==========================================

-- 테이블 정보 확인
-- SELECT * FROM information_schema.tables WHERE table_name = 'mindmaps';

-- 컬럼 정보 확인
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'mindmaps'
-- ORDER BY ordinal_position;

-- 인덱스 정보 확인
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename = 'mindmaps';

-- RLS 정책 확인
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename = 'mindmaps';

-- ==========================================
-- 완료!
-- ==========================================

-- 설치가 완료되었습니다!
-- 
-- 다음 단계:
-- 1. Database > Replication에서 Realtime 활성화
-- 2. Authentication > Providers에서 Google, GitHub 인증 설정
-- 3. 애플리케이션에서 Supabase 연결 테스트
--
-- 문제가 발생하면 SUPABASE_SETUP.md 문서를 참고하세요.

SELECT 'Supabase 스키마 설치 완료! 🎉' AS message;
