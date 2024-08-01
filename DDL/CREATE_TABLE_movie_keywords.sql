CREATE TABLE IF NOT EXISTS public.movie_keywords
(
    movie_id integer NOT NULL,
    keyword_id integer NOT NULL,
    CONSTRAINT movie_keywords_pkey PRIMARY KEY (movie_id, keyword_id),
    CONSTRAINT movie_keywords_keyword_id_fkey FOREIGN KEY (keyword_id)
        REFERENCES public.search_keywords (keyword_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT movie_keywords_movie_id_fkey FOREIGN KEY (movie_id)
        REFERENCES public.movies (movie_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);
