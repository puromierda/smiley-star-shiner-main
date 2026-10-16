CREATE TABLE public.scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  photo text NOT NULL,
  analysis jsonb NOT NULL
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scans TO authenticated;
GRANT ALL ON public.scans TO service_role;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own scans select" ON public.scans FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own scans insert" ON public.scans FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own scans delete" ON public.scans FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX scans_user_idx ON public.scans(user_id, created_at DESC);

CREATE TABLE public.journeys (
  user_id uuid PRIMARY KEY DEFAULT auth.uid(),
  before_id uuid NOT NULL,
  after_id uuid,
  started_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.journeys TO authenticated;
GRANT ALL ON public.journeys TO service_role;
ALTER TABLE public.journeys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own journey all" ON public.journeys FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);