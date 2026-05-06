-- Roadmap feature requests + per-user upvotes.
-- Prerequisites: neon_auth."user"(id) exists.
-- Toggle behavior is implemented at API level: insert vote row to upvote, delete vote row to remove.
-- Apply once. Re-running will error unless objects/policies are dropped first.

-- ---------------------------------------------------------------------------
-- roadmap_features
-- ---------------------------------------------------------------------------
CREATE TABLE public.roadmap_features (
	id bigserial PRIMARY KEY,
	title text NOT NULL UNIQUE,
	is_active boolean NOT NULL DEFAULT true,
	created_at timestamp with time zone DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- roadmap_feature_votes
-- ---------------------------------------------------------------------------
CREATE TABLE public.roadmap_feature_votes (
	feature_id bigint NOT NULL,
	user_id uuid NOT NULL,
	created_at timestamp with time zone DEFAULT now(),
	CONSTRAINT roadmap_feature_votes_pkey PRIMARY KEY (feature_id, user_id),
	CONSTRAINT roadmap_feature_votes_feature_id_fkey
		FOREIGN KEY (feature_id) REFERENCES public.roadmap_features(id) ON DELETE CASCADE,
	CONSTRAINT roadmap_feature_votes_user_id_fkey
		FOREIGN KEY (user_id) REFERENCES neon_auth."user"(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- Seed initial roadmap entries from current marketing page list
-- ---------------------------------------------------------------------------
INSERT INTO public.roadmap_features (title) VALUES
	('Add Compositions Agent'),
	('Add Formulas Agent'),
	('Add Blind Scent Test To Dilutions'),
	('Add Dilution Total Weight'),
	('Toggle Auto-remove Weight From Dilution Total On Formula Creation'),
	('Add rating 1/10 to guest feedback'),
	('Add optional label to compositions'),
	('Add CAS number to raw materials'),
	('Toggle aggregate guest feedback notes on table view')
ON CONFLICT (title) DO NOTHING;

-- ---------------------------------------------------------------------------
-- RLS: roadmap_features (readable), roadmap_feature_votes (user-owned writes)
-- ---------------------------------------------------------------------------
ALTER TABLE public.roadmap_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_feature_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY roadmap_features_select_all ON public.roadmap_features
	FOR SELECT
	TO neondb_owner
	USING (true);

CREATE POLICY roadmap_feature_votes_select_all ON public.roadmap_feature_votes
	FOR SELECT
	TO neondb_owner
	USING (true);

CREATE POLICY roadmap_feature_votes_insert_own ON public.roadmap_feature_votes
	FOR INSERT
	TO neondb_owner
	WITH CHECK (user_id = (current_setting('app.current_user_id', true))::uuid);

CREATE POLICY roadmap_feature_votes_delete_own ON public.roadmap_feature_votes
	FOR DELETE
	TO neondb_owner
	USING (user_id = (current_setting('app.current_user_id', true))::uuid);

ALTER TABLE public.roadmap_features FORCE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_feature_votes FORCE ROW LEVEL SECURITY;