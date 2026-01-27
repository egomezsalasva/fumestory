--
-- PostgreSQL database dump
--

\restrict 0GX9mFy36xJTuyrD8e9ehn3b7tsmaVhw3FrWKZDwk3uEDPOAzuTuv49z1F1w1JX

-- Dumped from database version 16.11 (Debian 16.11-1.pgdg13+1)
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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: krokodilisbad
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.categories OWNER TO krokodilisbad;

--
-- Name: categores_id_seq; Type: SEQUENCE; Schema: public; Owner: krokodilisbad
--

CREATE SEQUENCE public.categores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categores_id_seq OWNER TO krokodilisbad;

--
-- Name: categores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: krokodilisbad
--

ALTER SEQUENCE public.categores_id_seq OWNED BY public.categories.id;


--
-- Name: raw_materials; Type: TABLE; Schema: public; Owner: krokodilisbad
--

CREATE TABLE public.raw_materials (
    id integer NOT NULL,
    name text NOT NULL,
    category_id integer,
    notes jsonb DEFAULT '[]'::jsonb NOT NULL,
    prepared_dilution_percentages integer[] DEFAULT '{}'::integer[] NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    note_type text,
    CONSTRAINT raw_materials_note_type_check CHECK ((note_type = ANY (ARRAY['top'::text, 'mid'::text, 'base'::text])))
);


ALTER TABLE public.raw_materials OWNER TO krokodilisbad;

--
-- Name: raw_materials_id_seq; Type: SEQUENCE; Schema: public; Owner: krokodilisbad
--

CREATE SEQUENCE public.raw_materials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.raw_materials_id_seq OWNER TO krokodilisbad;

--
-- Name: raw_materials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: krokodilisbad
--

ALTER SEQUENCE public.raw_materials_id_seq OWNED BY public.raw_materials.id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: krokodilisbad
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categores_id_seq'::regclass);


--
-- Name: raw_materials id; Type: DEFAULT; Schema: public; Owner: krokodilisbad
--

ALTER TABLE ONLY public.raw_materials ALTER COLUMN id SET DEFAULT nextval('public.raw_materials_id_seq'::regclass);


--
-- Name: categories categores_name_key; Type: CONSTRAINT; Schema: public; Owner: krokodilisbad
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categores_name_key UNIQUE (name);


--
-- Name: categories categores_pkey; Type: CONSTRAINT; Schema: public; Owner: krokodilisbad
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categores_pkey PRIMARY KEY (id);


--
-- Name: raw_materials raw_materials_name_key; Type: CONSTRAINT; Schema: public; Owner: krokodilisbad
--

ALTER TABLE ONLY public.raw_materials
    ADD CONSTRAINT raw_materials_name_key UNIQUE (name);


--
-- Name: raw_materials raw_materials_pkey; Type: CONSTRAINT; Schema: public; Owner: krokodilisbad
--

ALTER TABLE ONLY public.raw_materials
    ADD CONSTRAINT raw_materials_pkey PRIMARY KEY (id);


--
-- Name: raw_materials raw_materials_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: krokodilisbad
--

ALTER TABLE ONLY public.raw_materials
    ADD CONSTRAINT raw_materials_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict 0GX9mFy36xJTuyrD8e9ehn3b7tsmaVhw3FrWKZDwk3uEDPOAzuTuv49z1F1w1JX

