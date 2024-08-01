CREATE TABLE IF NOT EXISTS public.movies
(
    movie_id integer NOT NULL DEFAULT nextval('movies_movie_id_seq'::regclass),
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    director character varying(255) COLLATE pg_catalog."default",
    year integer,
    rating numeric,
    description text COLLATE pg_catalog."default",
    CONSTRAINT movies_pkey PRIMARY KEY (movie_id)
);

