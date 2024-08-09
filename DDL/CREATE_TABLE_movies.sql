CREATE TABLE public.movies
(
    movie_id integer NOT NULL DEFAULT nextval('movies_movie_id_seq1'::regclass),
    title character varying(255) COLLATE pg_catalog."default",
    director character varying(255) COLLATE pg_catalog."default",
    year integer,
    rating numeric(2,1),
    description text COLLATE pg_catalog."default",
    genre character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT movies_pkey1 PRIMARY KEY (movie_id)
);

