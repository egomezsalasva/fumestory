--
-- PostgreSQL database dump
--

\restrict aNwYtcHG4zPhYWCSdOCkzr0WxZoIwksM9KFCXSARSA4peoab11essBbfGte4GWM

-- Dumped from database version 17.10 (322a063)
-- Dumped by pg_dump version 17.6 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: neon_auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA neon_auth;


--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.account (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" uuid NOT NULL,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamp with time zone,
    "refreshTokenExpiresAt" timestamp with time zone,
    scope text,
    password text,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: invitation; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.invitation (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "organizationId" uuid NOT NULL,
    email text NOT NULL,
    role text,
    status text NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "inviterId" uuid NOT NULL
);


--
-- Name: jwks; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.jwks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "publicKey" text NOT NULL,
    "privateKey" text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "expiresAt" timestamp with time zone
);


--
-- Name: member; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.member (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "organizationId" uuid NOT NULL,
    "userId" uuid NOT NULL,
    role text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL
);


--
-- Name: organization; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.organization (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    logo text,
    "createdAt" timestamp with time zone NOT NULL,
    metadata text
);


--
-- Name: project_config; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.project_config (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    endpoint_id text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    trusted_origins jsonb NOT NULL,
    social_providers jsonb NOT NULL,
    email_provider jsonb,
    email_and_password jsonb,
    allow_localhost boolean NOT NULL,
    plugin_configs jsonb,
    webhook_config jsonb
);


--
-- Name: session; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.session (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    token text NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "userId" uuid NOT NULL,
    "impersonatedBy" text,
    "activeOrganizationId" text
);


--
-- Name: user; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth."user" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "emailVerified" boolean NOT NULL,
    image text,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    role text,
    banned boolean,
    "banReason" text,
    "banExpires" timestamp with time zone
);


--
-- Name: verification; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.verification (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name text NOT NULL
);


--
-- Name: categores_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categores_id_seq OWNED BY public.categories.id;


--
-- Name: compositions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.compositions (
    id integer NOT NULL,
    owner_id uuid NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT compositions_type_check CHECK ((type = ANY (ARRAY['trial'::text, 'accord'::text, 'perfume'::text])))
);

ALTER TABLE ONLY public.compositions FORCE ROW LEVEL SECURITY;


--
-- Name: compositions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.compositions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: compositions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.compositions_id_seq OWNED BY public.compositions.id;


--
-- Name: dilutions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dilutions (
    id integer NOT NULL,
    raw_material_id integer NOT NULL,
    percentage integer NOT NULL,
    dilution_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    available boolean DEFAULT true,
    batch_weight_grams numeric(10,5),
    CONSTRAINT dilutions_batch_weight_grams_check CHECK (((batch_weight_grams IS NULL) OR (batch_weight_grams > (0)::numeric)))
);

ALTER TABLE ONLY public.dilutions FORCE ROW LEVEL SECURITY;


--
-- Name: dilutions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dilutions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dilutions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dilutions_id_seq OWNED BY public.dilutions.id;


--
-- Name: feedback; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feedback (
    id integer NOT NULL,
    dilution_id integer NOT NULL,
    person_name character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    rating smallint,
    CONSTRAINT feedback_rating_check CHECK (((rating IS NULL) OR ((rating >= 0) AND (rating <= 5))))
);

ALTER TABLE ONLY public.feedback FORCE ROW LEVEL SECURITY;


--
-- Name: feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.feedback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.feedback_id_seq OWNED BY public.feedback.id;


--
-- Name: feedback_notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feedback_notes (
    feedback_id integer NOT NULL,
    note_id integer NOT NULL
);

ALTER TABLE ONLY public.feedback_notes FORCE ROW LEVEL SECURITY;


--
-- Name: formula_dilutions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.formula_dilutions (
    id integer NOT NULL,
    formula_id integer NOT NULL,
    dilution_id integer NOT NULL,
    weight_grams numeric(10,5) NOT NULL,
    percentage numeric(5,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT formula_dilutions_percentage_check CHECK (((percentage > (0)::numeric) AND (percentage <= (100)::numeric))),
    CONSTRAINT formula_dilutions_weight_grams_check CHECK ((weight_grams > (0)::numeric))
);

ALTER TABLE ONLY public.formula_dilutions FORCE ROW LEVEL SECURITY;


--
-- Name: formula_dilutions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.formula_dilutions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: formula_dilutions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.formula_dilutions_id_seq OWNED BY public.formula_dilutions.id;


--
-- Name: formulas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.formulas (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    composition_id integer NOT NULL,
    mods text NOT NULL
);

ALTER TABLE ONLY public.formulas FORCE ROW LEVEL SECURITY;


--
-- Name: formulas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.formulas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: formulas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.formulas_id_seq OWNED BY public.formulas.id;


--
-- Name: notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notes (
    id integer NOT NULL,
    name text NOT NULL
);


--
-- Name: notes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notes_id_seq OWNED BY public.notes.id;


--
-- Name: raw_material_notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.raw_material_notes (
    id integer NOT NULL,
    raw_material_id integer NOT NULL,
    note_id integer NOT NULL
);

ALTER TABLE ONLY public.raw_material_notes FORCE ROW LEVEL SECURITY;


--
-- Name: raw_material_notes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.raw_material_notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: raw_material_notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.raw_material_notes_id_seq OWNED BY public.raw_material_notes.id;


--
-- Name: raw_materials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.raw_materials (
    id integer NOT NULL,
    name text NOT NULL,
    category_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    note_type text,
    label character varying(10) NOT NULL,
    owner_id uuid,
    material_nature text NOT NULL,
    CONSTRAINT raw_materials_nature_check CHECK ((material_nature = ANY (ARRAY['Natural'::text, 'Synthetic'::text]))),
    CONSTRAINT raw_materials_note_type_check CHECK ((note_type = ANY (ARRAY['High'::text, 'Mid(Heart)'::text, 'Base'::text])))
);

ALTER TABLE ONLY public.raw_materials FORCE ROW LEVEL SECURITY;


--
-- Name: raw_materials_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.raw_materials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: raw_materials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.raw_materials_id_seq OWNED BY public.raw_materials.id;


--
-- Name: roadmap_feature_votes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roadmap_feature_votes (
    feature_id bigint NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.roadmap_feature_votes FORCE ROW LEVEL SECURITY;


--
-- Name: roadmap_features; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roadmap_features (
    id bigint NOT NULL,
    title text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY public.roadmap_features FORCE ROW LEVEL SECURITY;


--
-- Name: roadmap_features_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roadmap_features_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roadmap_features_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roadmap_features_id_seq OWNED BY public.roadmap_features.id;


--
-- Name: user_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_settings (
    user_id uuid NOT NULL,
    settings jsonb DEFAULT '{}'::jsonb NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY public.user_settings FORCE ROW LEVEL SECURITY;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categores_id_seq'::regclass);


--
-- Name: compositions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compositions ALTER COLUMN id SET DEFAULT nextval('public.compositions_id_seq'::regclass);


--
-- Name: dilutions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dilutions ALTER COLUMN id SET DEFAULT nextval('public.dilutions_id_seq'::regclass);


--
-- Name: feedback id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback ALTER COLUMN id SET DEFAULT nextval('public.feedback_id_seq'::regclass);


--
-- Name: formula_dilutions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.formula_dilutions ALTER COLUMN id SET DEFAULT nextval('public.formula_dilutions_id_seq'::regclass);


--
-- Name: formulas id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.formulas ALTER COLUMN id SET DEFAULT nextval('public.formulas_id_seq'::regclass);


--
-- Name: notes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notes ALTER COLUMN id SET DEFAULT nextval('public.notes_id_seq'::regclass);


--
-- Name: raw_material_notes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.raw_material_notes ALTER COLUMN id SET DEFAULT nextval('public.raw_material_notes_id_seq'::regclass);


--
-- Name: raw_materials id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.raw_materials ALTER COLUMN id SET DEFAULT nextval('public.raw_materials_id_seq'::regclass);


--
-- Name: roadmap_features id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roadmap_features ALTER COLUMN id SET DEFAULT nextval('public.roadmap_features_id_seq'::regclass);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: invitation invitation_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.invitation
    ADD CONSTRAINT invitation_pkey PRIMARY KEY (id);


--
-- Name: jwks jwks_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.jwks
    ADD CONSTRAINT jwks_pkey PRIMARY KEY (id);


--
-- Name: member member_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.member
    ADD CONSTRAINT member_pkey PRIMARY KEY (id);


--
-- Name: organization organization_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.organization
    ADD CONSTRAINT organization_pkey PRIMARY KEY (id);


--
-- Name: organization organization_slug_key; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.organization
    ADD CONSTRAINT organization_slug_key UNIQUE (slug);


--
-- Name: project_config project_config_endpoint_id_key; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.project_config
    ADD CONSTRAINT project_config_endpoint_id_key UNIQUE (endpoint_id);


--
-- Name: project_config project_config_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.project_config
    ADD CONSTRAINT project_config_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- Name: session session_token_key; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.session
    ADD CONSTRAINT session_token_key UNIQUE (token);


--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: verification verification_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.verification
    ADD CONSTRAINT verification_pkey PRIMARY KEY (id);


--
-- Name: categories categores_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categores_name_key UNIQUE (name);


--
-- Name: categories categores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categores_pkey PRIMARY KEY (id);


--
-- Name: compositions compositions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compositions
    ADD CONSTRAINT compositions_pkey PRIMARY KEY (id);


--
-- Name: dilutions dilutions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dilutions
    ADD CONSTRAINT dilutions_pkey PRIMARY KEY (id);


--
-- Name: feedback_notes feedback_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_notes
    ADD CONSTRAINT feedback_notes_pkey PRIMARY KEY (feedback_id, note_id);


--
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id);


--
-- Name: formula_dilutions formula_dilutions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.formula_dilutions
    ADD CONSTRAINT formula_dilutions_pkey PRIMARY KEY (id);


--
-- Name: formulas formulas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.formulas
    ADD CONSTRAINT formulas_pkey PRIMARY KEY (id);


--
-- Name: notes notes_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_name_key UNIQUE (name);


--
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- Name: raw_material_notes raw_material_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.raw_material_notes
    ADD CONSTRAINT raw_material_notes_pkey PRIMARY KEY (id);


--
-- Name: raw_material_notes raw_material_notes_raw_material_id_note_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.raw_material_notes
    ADD CONSTRAINT raw_material_notes_raw_material_id_note_id_key UNIQUE (raw_material_id, note_id);


--
-- Name: raw_materials raw_materials_label_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.raw_materials
    ADD CONSTRAINT raw_materials_label_key UNIQUE (label);


--
-- Name: raw_materials raw_materials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.raw_materials
    ADD CONSTRAINT raw_materials_pkey PRIMARY KEY (id);


--
-- Name: roadmap_feature_votes roadmap_feature_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roadmap_feature_votes
    ADD CONSTRAINT roadmap_feature_votes_pkey PRIMARY KEY (feature_id, user_id);


--
-- Name: roadmap_features roadmap_features_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roadmap_features
    ADD CONSTRAINT roadmap_features_pkey PRIMARY KEY (id);


--
-- Name: roadmap_features roadmap_features_title_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roadmap_features
    ADD CONSTRAINT roadmap_features_title_key UNIQUE (title);


--
-- Name: user_settings user_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT user_settings_pkey PRIMARY KEY (user_id);


--
-- Name: account_userId_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX "account_userId_idx" ON neon_auth.account USING btree ("userId");


--
-- Name: invitation_email_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX invitation_email_idx ON neon_auth.invitation USING btree (email);


--
-- Name: invitation_organizationId_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX "invitation_organizationId_idx" ON neon_auth.invitation USING btree ("organizationId");


--
-- Name: member_organizationId_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX "member_organizationId_idx" ON neon_auth.member USING btree ("organizationId");


--
-- Name: member_userId_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX "member_userId_idx" ON neon_auth.member USING btree ("userId");


--
-- Name: organization_slug_uidx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE UNIQUE INDEX organization_slug_uidx ON neon_auth.organization USING btree (slug);


--
-- Name: session_userId_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX "session_userId_idx" ON neon_auth.session USING btree ("userId");


--
-- Name: verification_identifier_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX verification_identifier_idx ON neon_auth.verification USING btree (identifier);


--
-- Name: compositions_owner_name_uidx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX compositions_owner_name_uidx ON public.compositions USING btree (owner_id, name);


--
-- Name: formulas_composition_mods_uidx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX formulas_composition_mods_uidx ON public.formulas USING btree (composition_id, mods);


--
-- Name: raw_materials_owner_name_uidx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX raw_materials_owner_name_uidx ON public.raw_materials USING btree (owner_id, name);


--
-- Name: account account_userId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.account
    ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES neon_auth."user"(id) ON DELETE CASCADE;


--
-- Name: invitation invitation_inviterId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.invitation
    ADD CONSTRAINT "invitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES neon_auth."user"(id) ON DELETE CASCADE;


--
-- Name: invitation invitation_organizationId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.invitation
    ADD CONSTRAINT "invitation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES neon_auth.organization(id) ON DELETE CASCADE;


--
-- Name: member member_organizationId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.member
    ADD CONSTRAINT "member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES neon_auth.organization(id) ON DELETE CASCADE;


--
-- Name: member member_userId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.member
    ADD CONSTRAINT "member_userId_fkey" FOREIGN KEY ("userId") REFERENCES neon_auth."user"(id) ON DELETE CASCADE;


--
-- Name: session session_userId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.session
    ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES neon_auth."user"(id) ON DELETE CASCADE;


--
-- Name: compositions compositions_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compositions
    ADD CONSTRAINT compositions_owner_fkey FOREIGN KEY (owner_id) REFERENCES neon_auth."user"(id);


--
-- Name: dilutions dilutions_raw_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dilutions
    ADD CONSTRAINT dilutions_raw_material_id_fkey FOREIGN KEY (raw_material_id) REFERENCES public.raw_materials(id) ON DELETE CASCADE;


--
-- Name: feedback feedback_dilution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_dilution_id_fkey FOREIGN KEY (dilution_id) REFERENCES public.dilutions(id) ON DELETE CASCADE;


--
-- Name: feedback_notes feedback_notes_feedback_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_notes
    ADD CONSTRAINT feedback_notes_feedback_id_fkey FOREIGN KEY (feedback_id) REFERENCES public.feedback(id) ON DELETE CASCADE;


--
-- Name: feedback_notes feedback_notes_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_notes
    ADD CONSTRAINT feedback_notes_note_id_fkey FOREIGN KEY (note_id) REFERENCES public.notes(id) ON DELETE CASCADE;


--
-- Name: formula_dilutions formula_dilutions_dilution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.formula_dilutions
    ADD CONSTRAINT formula_dilutions_dilution_id_fkey FOREIGN KEY (dilution_id) REFERENCES public.dilutions(id);


--
-- Name: formula_dilutions formula_dilutions_formula_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.formula_dilutions
    ADD CONSTRAINT formula_dilutions_formula_id_fkey FOREIGN KEY (formula_id) REFERENCES public.formulas(id) ON DELETE CASCADE;


--
-- Name: formulas formulas_composition_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.formulas
    ADD CONSTRAINT formulas_composition_id_fkey FOREIGN KEY (composition_id) REFERENCES public.compositions(id) ON DELETE CASCADE;


--
-- Name: raw_material_notes raw_material_notes_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.raw_material_notes
    ADD CONSTRAINT raw_material_notes_note_id_fkey FOREIGN KEY (note_id) REFERENCES public.notes(id) ON DELETE CASCADE;


--
-- Name: raw_material_notes raw_material_notes_raw_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.raw_material_notes
    ADD CONSTRAINT raw_material_notes_raw_material_id_fkey FOREIGN KEY (raw_material_id) REFERENCES public.raw_materials(id) ON DELETE CASCADE;


--
-- Name: raw_materials raw_materials_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.raw_materials
    ADD CONSTRAINT raw_materials_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: raw_materials raw_materials_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.raw_materials
    ADD CONSTRAINT raw_materials_owner_fkey FOREIGN KEY (owner_id) REFERENCES neon_auth."user"(id);


--
-- Name: roadmap_feature_votes roadmap_feature_votes_feature_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roadmap_feature_votes
    ADD CONSTRAINT roadmap_feature_votes_feature_id_fkey FOREIGN KEY (feature_id) REFERENCES public.roadmap_features(id) ON DELETE CASCADE;


--
-- Name: roadmap_feature_votes roadmap_feature_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roadmap_feature_votes
    ADD CONSTRAINT roadmap_feature_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES neon_auth."user"(id) ON DELETE CASCADE;


--
-- Name: user_settings user_settings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT user_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES neon_auth."user"(id) ON DELETE RESTRICT;


--
-- Name: compositions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.compositions ENABLE ROW LEVEL SECURITY;

--
-- Name: compositions compositions_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY compositions_delete_own ON public.compositions FOR DELETE TO neondb_owner USING ((owner_id = (current_setting('app.current_user_id'::text, true))::uuid));


--
-- Name: compositions compositions_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY compositions_insert_own ON public.compositions FOR INSERT TO neondb_owner WITH CHECK ((owner_id = (current_setting('app.current_user_id'::text, true))::uuid));


--
-- Name: compositions compositions_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY compositions_select_own ON public.compositions FOR SELECT TO neondb_owner USING ((owner_id = (current_setting('app.current_user_id'::text, true))::uuid));


--
-- Name: compositions compositions_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY compositions_update_own ON public.compositions FOR UPDATE TO neondb_owner USING ((owner_id = (current_setting('app.current_user_id'::text, true))::uuid)) WITH CHECK ((owner_id = (current_setting('app.current_user_id'::text, true))::uuid));


--
-- Name: dilutions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.dilutions ENABLE ROW LEVEL SECURITY;

--
-- Name: dilutions dilutions_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY dilutions_delete_own ON public.dilutions FOR DELETE TO neondb_owner USING ((EXISTS ( SELECT 1
   FROM public.raw_materials rm
  WHERE ((rm.id = dilutions.raw_material_id) AND (rm.owner_id = (current_setting('app.current_user_id'::text, true))::uuid)))));


--
-- Name: dilutions dilutions_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY dilutions_insert_own ON public.dilutions FOR INSERT TO neondb_owner WITH CHECK ((EXISTS ( SELECT 1
   FROM public.raw_materials rm
  WHERE ((rm.id = dilutions.raw_material_id) AND (rm.owner_id = (current_setting('app.current_user_id'::text, true))::uuid)))));


--
-- Name: dilutions dilutions_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY dilutions_select_own ON public.dilutions FOR SELECT TO neondb_owner USING ((EXISTS ( SELECT 1
   FROM public.raw_materials rm
  WHERE ((rm.id = dilutions.raw_material_id) AND (rm.owner_id = (current_setting('app.current_user_id'::text, true))::uuid)))));


--
-- Name: dilutions dilutions_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY dilutions_update_own ON public.dilutions FOR UPDATE TO neondb_owner USING ((EXISTS ( SELECT 1
   FROM public.raw_materials rm
  WHERE ((rm.id = dilutions.raw_material_id) AND (rm.owner_id = (current_setting('app.current_user_id'::text, true))::uuid))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.raw_materials rm
  WHERE ((rm.id = dilutions.raw_material_id) AND (rm.owner_id = (current_setting('app.current_user_id'::text, true))::uuid)))));


--
-- Name: feedback; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

--
-- Name: feedback feedback_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY feedback_delete_own ON public.feedback FOR DELETE TO neondb_owner USING ((EXISTS ( SELECT 1
   FROM (public.dilutions d
     JOIN public.raw_materials rm ON ((rm.id = d.raw_material_id)))
  WHERE ((d.id = feedback.dilution_id) AND (rm.owner_id = (current_setting('app.current_user_id'::text, true))::uuid)))));


--
-- Name: feedback feedback_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY feedback_insert_own ON public.feedback FOR INSERT TO neondb_owner WITH CHECK ((EXISTS ( SELECT 1
   FROM (public.dilutions d
     JOIN public.raw_materials rm ON ((rm.id = d.raw_material_id)))
  WHERE ((d.id = feedback.dilution_id) AND (rm.owner_id = (current_setting('app.current_user_id'::text, true))::uuid)))));


--
-- Name: feedback_notes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.feedback_notes ENABLE ROW LEVEL SECURITY;

--
-- Name: feedback_notes feedback_notes_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY feedback_notes_delete_own ON public.feedback_notes FOR DELETE TO neondb_owner USING ((EXISTS ( SELECT 1
   FROM ((public.feedback f
     JOIN public.dilutions d ON ((d.id = f.dilution_id)))
     JOIN public.raw_materials rm ON ((rm.id = d.raw_material_id)))
  WHERE ((f.id = feedback_notes.feedback_id) AND (rm.owner_id = (current_setting('app.current_user_id'::text, true))::uuid)))));


--
-- Name: feedback_notes feedback_notes_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY feedback_notes_insert_own ON public.feedback_notes FOR INSERT TO neondb_owner WITH CHECK ((EXISTS ( SELECT 1
   FROM ((public.feedback f
     JOIN public.dilutions d ON ((d.id = f.dilution_id)))
     JOIN public.raw_materials rm ON ((rm.id = d.raw_material_id)))
  WHERE ((f.id = feedback_notes.feedback_id) AND (rm.owner_id = (current_setting('app.current_user_id'::text, true))::uuid)))));


--
-- Name: feedback_notes feedback_notes_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY feedback_notes_select_own ON public.feedback_notes FOR SELECT TO neondb_owner USING ((EXISTS ( SELECT 1
   FROM ((public.feedback f
     JOIN public.dilutions d ON ((d.id = f.dilution_id)))
     JOIN public.raw_materials rm ON ((rm.id = d.raw_material_id)))
  WHERE ((f.id = feedback_notes.feedback_id) AND (rm.owner_id = (current_setting('app.current_user_id'::text, true))::uuid)))));


--
-- Name: feedback_notes feedback_notes_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY feedback_notes_update_own ON public.feedback_notes FOR UPDATE TO neondb_owner USING ((EXISTS ( SELECT 1
   FROM ((public.feedback f
     JOIN public.dilutions d ON ((d.id = f.dilution_id)))
     JOIN public.raw_materials rm ON ((rm.id = d.raw_material_id)))
  WHERE ((f.id = feedback_notes.feedback_id) AND (rm.owner_id = (current_setting('app.current_user_id'::text, true))::uuid))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM ((public.feedback f
     JOIN public.dilutions d ON ((d.id = f.dilution_id)))
     JOIN public.raw_materials rm ON ((rm.id = d.raw_material_id)))
  WHERE ((f.id = feedback_notes.feedback_id) AND (rm.owner_id = (current_setting('app.current_user_id'::text, true))::uuid)))));


--
-- Name: feedback feedback_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY feedback_select_own ON public.feedback FOR SELECT TO neondb_owner USING ((EXISTS ( SELECT 1
   FROM (public.dilutions d
     JOIN public.raw_materials rm ON ((rm.id = d.raw_material_id)))
  WHERE ((d.id = feedback.dilution_id) AND (rm.owner_id = (current_setting('app.current_user_id'::text, true))::uuid)))));


--
-- Name: feedback feedback_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY feedback_update_own ON public.feedback FOR UPDATE TO neondb_owner USING ((EXISTS ( SELECT 1
   FROM (public.dilutions d
     JOIN public.raw_materials rm ON ((rm.id = d.raw_material_id)))
  WHERE ((d.id = feedback.dilution_id) AND (rm.owner_id = (current_setting('app.current_user_id'::text, true))::uuid))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM (public.dilutions d
     JOIN public.raw_materials rm ON ((rm.id = d.raw_material_id)))
  WHERE ((d.id = feedback.dilution_id) AND (rm.owner_id = (current_setting('app.current_user_id'::text, true))::uuid)))));


--
-- Name: formula_dilutions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.formula_dilutions ENABLE ROW LEVEL SECURITY;

--
-- Name: formula_dilutions formula_dilutions_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY formula_dilutions_delete_own ON public.formula_dilutions FOR DELETE TO neondb_owner USING ((EXISTS ( SELECT 1
   FROM (public.formulas f
     JOIN public.compositions c ON ((c.id = f.composition_id)))
  WHERE ((f.id = formula_dilutions.formula_id) AND (c.owner_id = (current_setting('app.current_user_id'::text, true))::uuid)))));


--
-- Name: formula_dilutions formula_dilutions_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY formula_dilutions_insert_own ON public.formula_dilutions FOR INSERT TO neondb_owner WITH CHECK ((EXISTS ( SELECT 1
   FROM (public.formulas f
     JOIN public.compositions c ON ((c.id = f.composition_id)))
  WHERE ((f.id = formula_dilutions.formula_id) AND (c.owner_id = (current_setting('app.current_user_id'::text, true))::uuid)))));


--
-- Name: formula_dilutions formula_dilutions_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY formula_dilutions_select_own ON public.formula_dilutions FOR SELECT TO neondb_owner USING ((EXISTS ( SELECT 1
   FROM (public.formulas f
     JOIN public.compositions c ON ((c.id = f.composition_id)))
  WHERE ((f.id = formula_dilutions.formula_id) AND (c.owner_id = (current_setting('app.current_user_id'::text, true))::uuid)))));


--
-- Name: formula_dilutions formula_dilutions_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY formula_dilutions_update_own ON public.formula_dilutions FOR UPDATE TO neondb_owner USING ((EXISTS ( SELECT 1
   FROM (public.formulas f
     JOIN public.compositions c ON ((c.id = f.composition_id)))
  WHERE ((f.id = formula_dilutions.formula_id) AND (c.owner_id = (current_setting('app.current_user_id'::text, true))::uuid))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM (public.formulas f
     JOIN public.compositions c ON ((c.id = f.composition_id)))
  WHERE ((f.id = formula_dilutions.formula_id) AND (c.owner_id = (current_setting('app.current_user_id'::text, true))::uuid)))));


--
-- Name: formulas; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.formulas ENABLE ROW LEVEL SECURITY;

--
-- Name: formulas formulas_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY formulas_delete_own ON public.formulas FOR DELETE TO neondb_owner USING ((EXISTS ( SELECT 1
   FROM public.compositions c
  WHERE ((c.id = formulas.composition_id) AND (c.owner_id = (current_setting('app.current_user_id'::text, true))::uuid)))));


--
-- Name: formulas formulas_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY formulas_insert_own ON public.formulas FOR INSERT TO neondb_owner WITH CHECK ((EXISTS ( SELECT 1
   FROM public.compositions c
  WHERE ((c.id = formulas.composition_id) AND (c.owner_id = (current_setting('app.current_user_id'::text, true))::uuid)))));


--
-- Name: formulas formulas_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY formulas_select_own ON public.formulas FOR SELECT TO neondb_owner USING ((EXISTS ( SELECT 1
   FROM public.compositions c
  WHERE ((c.id = formulas.composition_id) AND (c.owner_id = (current_setting('app.current_user_id'::text, true))::uuid)))));


--
-- Name: formulas formulas_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY formulas_update_own ON public.formulas FOR UPDATE TO neondb_owner USING ((EXISTS ( SELECT 1
   FROM public.compositions c
  WHERE ((c.id = formulas.composition_id) AND (c.owner_id = (current_setting('app.current_user_id'::text, true))::uuid))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.compositions c
  WHERE ((c.id = formulas.composition_id) AND (c.owner_id = (current_setting('app.current_user_id'::text, true))::uuid)))));


--
-- Name: raw_material_notes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.raw_material_notes ENABLE ROW LEVEL SECURITY;

--
-- Name: raw_material_notes raw_material_notes_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY raw_material_notes_delete_own ON public.raw_material_notes FOR DELETE TO neondb_owner USING ((EXISTS ( SELECT 1
   FROM public.raw_materials rm
  WHERE ((rm.id = raw_material_notes.raw_material_id) AND (rm.owner_id = (current_setting('app.current_user_id'::text, true))::uuid)))));


--
-- Name: raw_material_notes raw_material_notes_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY raw_material_notes_insert_own ON public.raw_material_notes FOR INSERT TO neondb_owner WITH CHECK ((EXISTS ( SELECT 1
   FROM public.raw_materials rm
  WHERE ((rm.id = raw_material_notes.raw_material_id) AND (rm.owner_id = (current_setting('app.current_user_id'::text, true))::uuid)))));


--
-- Name: raw_material_notes raw_material_notes_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY raw_material_notes_select_own ON public.raw_material_notes FOR SELECT TO neondb_owner USING ((EXISTS ( SELECT 1
   FROM public.raw_materials rm
  WHERE ((rm.id = raw_material_notes.raw_material_id) AND (rm.owner_id = (current_setting('app.current_user_id'::text, true))::uuid)))));


--
-- Name: raw_material_notes raw_material_notes_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY raw_material_notes_update_own ON public.raw_material_notes FOR UPDATE TO neondb_owner USING ((EXISTS ( SELECT 1
   FROM public.raw_materials rm
  WHERE ((rm.id = raw_material_notes.raw_material_id) AND (rm.owner_id = (current_setting('app.current_user_id'::text, true))::uuid))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.raw_materials rm
  WHERE ((rm.id = raw_material_notes.raw_material_id) AND (rm.owner_id = (current_setting('app.current_user_id'::text, true))::uuid)))));


--
-- Name: raw_materials; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.raw_materials ENABLE ROW LEVEL SECURITY;

--
-- Name: raw_materials raw_materials_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY raw_materials_delete_own ON public.raw_materials FOR DELETE TO neondb_owner USING ((owner_id = (current_setting('app.current_user_id'::text, true))::uuid));


--
-- Name: raw_materials raw_materials_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY raw_materials_insert_own ON public.raw_materials FOR INSERT TO neondb_owner WITH CHECK ((owner_id = (current_setting('app.current_user_id'::text, true))::uuid));


--
-- Name: raw_materials raw_materials_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY raw_materials_select_own ON public.raw_materials FOR SELECT TO neondb_owner USING ((owner_id = (current_setting('app.current_user_id'::text, true))::uuid));


--
-- Name: raw_materials raw_materials_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY raw_materials_update_own ON public.raw_materials FOR UPDATE TO neondb_owner USING ((owner_id = (current_setting('app.current_user_id'::text, true))::uuid)) WITH CHECK ((owner_id = (current_setting('app.current_user_id'::text, true))::uuid));


--
-- Name: roadmap_feature_votes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.roadmap_feature_votes ENABLE ROW LEVEL SECURITY;

--
-- Name: roadmap_feature_votes roadmap_feature_votes_delete_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY roadmap_feature_votes_delete_own ON public.roadmap_feature_votes FOR DELETE TO neondb_owner USING ((user_id = (current_setting('app.current_user_id'::text, true))::uuid));


--
-- Name: roadmap_feature_votes roadmap_feature_votes_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY roadmap_feature_votes_insert_own ON public.roadmap_feature_votes FOR INSERT TO neondb_owner WITH CHECK ((user_id = (current_setting('app.current_user_id'::text, true))::uuid));


--
-- Name: roadmap_feature_votes roadmap_feature_votes_select_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY roadmap_feature_votes_select_all ON public.roadmap_feature_votes FOR SELECT TO neondb_owner USING (true);


--
-- Name: roadmap_features; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.roadmap_features ENABLE ROW LEVEL SECURITY;

--
-- Name: roadmap_features roadmap_features_select_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY roadmap_features_select_all ON public.roadmap_features FOR SELECT TO neondb_owner USING (true);


--
-- Name: user_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: user_settings user_settings_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY user_settings_insert_own ON public.user_settings FOR INSERT TO neondb_owner WITH CHECK ((user_id = (current_setting('app.current_user_id'::text, true))::uuid));


--
-- Name: user_settings user_settings_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY user_settings_select_own ON public.user_settings FOR SELECT TO neondb_owner USING ((user_id = (current_setting('app.current_user_id'::text, true))::uuid));


--
-- Name: user_settings user_settings_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY user_settings_update_own ON public.user_settings FOR UPDATE TO neondb_owner USING ((user_id = (current_setting('app.current_user_id'::text, true))::uuid)) WITH CHECK ((user_id = (current_setting('app.current_user_id'::text, true))::uuid));


--
-- PostgreSQL database dump complete
--

\unrestrict aNwYtcHG4zPhYWCSdOCkzr0WxZoIwksM9KFCXSARSA4peoab11essBbfGte4GWM

