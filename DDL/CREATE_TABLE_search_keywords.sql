

CREATE TABLE IF NOT EXISTS public.search_keywords
(
    keyword_id integer NOT NULL DEFAULT nextval('search_keywords_keyword_id_seq'::regclass),
    keyword character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT search_keywords_pkey PRIMARY KEY (keyword_id)
);

