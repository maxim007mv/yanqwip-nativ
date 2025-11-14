--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: agent_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agent_messages (
    id integer NOT NULL,
    user_id integer NOT NULL,
    role character varying(32) NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone NOT NULL
);


ALTER TABLE public.agent_messages OWNER TO postgres;

--
-- Name: agent_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.agent_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.agent_messages_id_seq OWNER TO postgres;

--
-- Name: agent_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.agent_messages_id_seq OWNED BY public.agent_messages.id;


--
-- Name: amenities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.amenities (
    amenity_id integer NOT NULL,
    amenity_name character varying(50) NOT NULL,
    amenity_type character varying(30),
    description text
);


ALTER TABLE public.amenities OWNER TO postgres;

--
-- Name: amenities_amenity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.amenities_amenity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.amenities_amenity_id_seq OWNER TO postgres;

--
-- Name: amenities_amenity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.amenities_amenity_id_seq OWNED BY public.amenities.amenity_id;


--
-- Name: cuisines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cuisines (
    cuisine_id integer NOT NULL,
    cuisine_name character varying(100) NOT NULL,
    cuisine_code character varying(50)
);


ALTER TABLE public.cuisines OWNER TO postgres;

--
-- Name: cuisines_cuisine_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cuisines_cuisine_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cuisines_cuisine_id_seq OWNER TO postgres;

--
-- Name: cuisines_cuisine_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cuisines_cuisine_id_seq OWNED BY public.cuisines.cuisine_id;


--
-- Name: generation_jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.generation_jobs (
    id character varying(36) NOT NULL,
    user_id integer,
    status character varying(32) NOT NULL,
    error_message text,
    partial boolean NOT NULL,
    route_id integer,
    payload_json text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.generation_jobs OWNER TO postgres;

--
-- Name: natural_features; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.natural_features (
    feature_id integer NOT NULL,
    feature_type character varying(50) NOT NULL,
    feature_name character varying(50) NOT NULL
);


ALTER TABLE public.natural_features OWNER TO postgres;

--
-- Name: natural_features_feature_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.natural_features_feature_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.natural_features_feature_id_seq OWNER TO postgres;

--
-- Name: natural_features_feature_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.natural_features_feature_id_seq OWNED BY public.natural_features.feature_id;


--
-- Name: place_amenities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.place_amenities (
    place_amenity_id integer NOT NULL,
    place_id integer NOT NULL,
    amenity_id integer NOT NULL,
    amenity_value character varying(50) DEFAULT 'yes'::character varying
);


ALTER TABLE public.place_amenities OWNER TO postgres;

--
-- Name: place_amenities_place_amenity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.place_amenities_place_amenity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.place_amenities_place_amenity_id_seq OWNER TO postgres;

--
-- Name: place_amenities_place_amenity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.place_amenities_place_amenity_id_seq OWNED BY public.place_amenities.place_amenity_id;


--
-- Name: place_cuisines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.place_cuisines (
    place_cuisine_id integer NOT NULL,
    place_id integer NOT NULL,
    cuisine_id integer NOT NULL,
    is_main boolean DEFAULT false
);


ALTER TABLE public.place_cuisines OWNER TO postgres;

--
-- Name: place_cuisines_place_cuisine_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.place_cuisines_place_cuisine_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.place_cuisines_place_cuisine_id_seq OWNER TO postgres;

--
-- Name: place_cuisines_place_cuisine_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.place_cuisines_place_cuisine_id_seq OWNED BY public.place_cuisines.place_cuisine_id;


--
-- Name: place_natural_features; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.place_natural_features (
    place_feature_id integer NOT NULL,
    place_id integer NOT NULL,
    feature_id integer NOT NULL
);


ALTER TABLE public.place_natural_features OWNER TO postgres;

--
-- Name: place_natural_features_place_feature_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.place_natural_features_place_feature_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.place_natural_features_place_feature_id_seq OWNER TO postgres;

--
-- Name: place_natural_features_place_feature_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.place_natural_features_place_feature_id_seq OWNED BY public.place_natural_features.place_feature_id;


--
-- Name: place_photos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.place_photos (
    photo_id integer NOT NULL,
    place_id integer NOT NULL,
    photo_url text NOT NULL,
    is_main boolean DEFAULT false,
    photo_order integer DEFAULT 0
);


ALTER TABLE public.place_photos OWNER TO postgres;

--
-- Name: place_photos_photo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.place_photos_photo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.place_photos_photo_id_seq OWNER TO postgres;

--
-- Name: place_photos_photo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.place_photos_photo_id_seq OWNED BY public.place_photos.photo_id;


--
-- Name: place_reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.place_reviews (
    review_id integer NOT NULL,
    place_id integer NOT NULL,
    rating integer NOT NULL,
    review_text text,
    author_name character varying(100),
    user_id integer,
    CONSTRAINT check_rating CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.place_reviews OWNER TO postgres;

--
-- Name: place_reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.place_reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.place_reviews_review_id_seq OWNER TO postgres;

--
-- Name: place_reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.place_reviews_review_id_seq OWNED BY public.place_reviews.review_id;


--
-- Name: place_sports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.place_sports (
    place_sport_id integer NOT NULL,
    place_id integer NOT NULL,
    sport_id integer NOT NULL
);


ALTER TABLE public.place_sports OWNER TO postgres;

--
-- Name: place_sports_place_sport_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.place_sports_place_sport_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.place_sports_place_sport_id_seq OWNER TO postgres;

--
-- Name: place_sports_place_sport_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.place_sports_place_sport_id_seq OWNED BY public.place_sports.place_sport_id;


--
-- Name: place_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.place_tags (
    place_tag_id integer NOT NULL,
    place_id integer NOT NULL,
    tag_id integer NOT NULL
);


ALTER TABLE public.place_tags OWNER TO postgres;

--
-- Name: place_tags_place_tag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.place_tags_place_tag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.place_tags_place_tag_id_seq OWNER TO postgres;

--
-- Name: place_tags_place_tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.place_tags_place_tag_id_seq OWNED BY public.place_tags.place_tag_id;


--
-- Name: place_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.place_types (
    place_type_id integer NOT NULL,
    type_name character varying(50) NOT NULL,
    type_code character varying(20),
    description text
);


ALTER TABLE public.place_types OWNER TO postgres;

--
-- Name: place_types_place_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.place_types_place_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.place_types_place_type_id_seq OWNER TO postgres;

--
-- Name: place_types_place_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.place_types_place_type_id_seq OWNED BY public.place_types.place_type_id;


--
-- Name: places; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.places (
    place_id integer NOT NULL,
    name character varying(255) NOT NULL,
    address text,
    description text,
    latitude numeric(10,7) NOT NULL,
    longitude numeric(10,7) NOT NULL,
    phone character varying(50),
    website character varying(500),
    opening_hours text,
    place_type_id integer NOT NULL,
    price_category_id integer,
    is_active boolean DEFAULT true,
    osm_type character varying(20),
    osm_id bigint,
    access_type character varying(20),
    CONSTRAINT check_latitude CHECK (((latitude >= ('-90'::integer)::numeric) AND (latitude <= (90)::numeric))),
    CONSTRAINT check_longitude CHECK (((longitude >= ('-180'::integer)::numeric) AND (longitude <= (180)::numeric)))
);


ALTER TABLE public.places OWNER TO postgres;

--
-- Name: places_place_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.places_place_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.places_place_id_seq OWNER TO postgres;

--
-- Name: places_place_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.places_place_id_seq OWNED BY public.places.place_id;


--
-- Name: price_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_categories (
    price_category_id integer NOT NULL,
    price_category_name character varying(50) NOT NULL
);


ALTER TABLE public.price_categories OWNER TO postgres;

--
-- Name: price_categories_price_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.price_categories_price_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.price_categories_price_category_id_seq OWNER TO postgres;

--
-- Name: price_categories_price_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.price_categories_price_category_id_seq OWNED BY public.price_categories.price_category_id;


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    token_hash character varying(128) NOT NULL,
    user_id integer NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone NOT NULL
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.refresh_tokens_id_seq OWNER TO postgres;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


--
-- Name: routes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.routes (
    id integer NOT NULL,
    user_id integer,
    title character varying(255) NOT NULL,
    summary text,
    steps_json text NOT NULL,
    deepseek_response text NOT NULL,
    yandex_url character varying(512),
    created_at timestamp without time zone NOT NULL
);


ALTER TABLE public.routes OWNER TO postgres;

--
-- Name: routes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.routes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.routes_id_seq OWNER TO postgres;

--
-- Name: routes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.routes_id_seq OWNED BY public.routes.id;


--
-- Name: sports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sports (
    sport_id integer NOT NULL,
    sport_name character varying(50) NOT NULL,
    sport_code character varying(30)
);


ALTER TABLE public.sports OWNER TO postgres;

--
-- Name: sports_sport_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sports_sport_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sports_sport_id_seq OWNER TO postgres;

--
-- Name: sports_sport_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sports_sport_id_seq OWNED BY public.sports.sport_id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    tag_id integer NOT NULL,
    tag_name character varying(50) NOT NULL,
    description text
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- Name: tags_tag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tags_tag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tags_tag_id_seq OWNER TO postgres;

--
-- Name: tags_tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tags_tag_id_seq OWNED BY public.tags.tag_id;


--
-- Name: user_favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_favorites (
    user_id integer NOT NULL,
    place_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_favorites OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    full_name character varying(255),
    hashed_password character varying(255) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    phone character varying(20),
    avatar_url text,
    date_of_birth date,
    about_me text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: v_places_full; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_places_full AS
 SELECT p.place_id,
    p.name,
    p.address,
    p.latitude,
    p.longitude,
    p.phone,
    p.website,
    p.opening_hours,
    pt.type_name,
    pt.type_code,
    pc.price_category_name,
    p.is_active
   FROM ((public.places p
     JOIN public.place_types pt ON ((p.place_type_id = pt.place_type_id)))
     LEFT JOIN public.price_categories pc ON ((p.price_category_id = pc.price_category_id)));


ALTER VIEW public.v_places_full OWNER TO postgres;

--
-- Name: v_restaurants_with_cuisines; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_restaurants_with_cuisines AS
 SELECT p.place_id,
    p.name,
    p.address,
    p.phone,
    p.website,
    p.opening_hours,
    string_agg((c.cuisine_name)::text, ', '::text ORDER BY (c.cuisine_name)::text) AS cuisines
   FROM (((public.places p
     JOIN public.place_types pt ON ((p.place_type_id = pt.place_type_id)))
     LEFT JOIN public.place_cuisines pc ON ((p.place_id = pc.place_id)))
     LEFT JOIN public.cuisines c ON ((pc.cuisine_id = c.cuisine_id)))
  WHERE (((pt.type_code)::text = ANY ((ARRAY['restaurant'::character varying, 'cafe'::character varying, 'coffee_shop'::character varying])::text[])) AND (p.is_active = true))
  GROUP BY p.place_id, p.name, p.address, p.phone, p.website, p.opening_hours;


ALTER VIEW public.v_restaurants_with_cuisines OWNER TO postgres;

--
-- Name: agent_messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_messages ALTER COLUMN id SET DEFAULT nextval('public.agent_messages_id_seq'::regclass);


--
-- Name: amenities amenity_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.amenities ALTER COLUMN amenity_id SET DEFAULT nextval('public.amenities_amenity_id_seq'::regclass);


--
-- Name: cuisines cuisine_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuisines ALTER COLUMN cuisine_id SET DEFAULT nextval('public.cuisines_cuisine_id_seq'::regclass);


--
-- Name: natural_features feature_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.natural_features ALTER COLUMN feature_id SET DEFAULT nextval('public.natural_features_feature_id_seq'::regclass);


--
-- Name: place_amenities place_amenity_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_amenities ALTER COLUMN place_amenity_id SET DEFAULT nextval('public.place_amenities_place_amenity_id_seq'::regclass);


--
-- Name: place_cuisines place_cuisine_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_cuisines ALTER COLUMN place_cuisine_id SET DEFAULT nextval('public.place_cuisines_place_cuisine_id_seq'::regclass);


--
-- Name: place_natural_features place_feature_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_natural_features ALTER COLUMN place_feature_id SET DEFAULT nextval('public.place_natural_features_place_feature_id_seq'::regclass);


--
-- Name: place_photos photo_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_photos ALTER COLUMN photo_id SET DEFAULT nextval('public.place_photos_photo_id_seq'::regclass);


--
-- Name: place_reviews review_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_reviews ALTER COLUMN review_id SET DEFAULT nextval('public.place_reviews_review_id_seq'::regclass);


--
-- Name: place_sports place_sport_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_sports ALTER COLUMN place_sport_id SET DEFAULT nextval('public.place_sports_place_sport_id_seq'::regclass);


--
-- Name: place_tags place_tag_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_tags ALTER COLUMN place_tag_id SET DEFAULT nextval('public.place_tags_place_tag_id_seq'::regclass);


--
-- Name: place_types place_type_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_types ALTER COLUMN place_type_id SET DEFAULT nextval('public.place_types_place_type_id_seq'::regclass);


--
-- Name: places place_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.places ALTER COLUMN place_id SET DEFAULT nextval('public.places_place_id_seq'::regclass);


--
-- Name: price_categories price_category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_categories ALTER COLUMN price_category_id SET DEFAULT nextval('public.price_categories_price_category_id_seq'::regclass);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- Name: routes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.routes ALTER COLUMN id SET DEFAULT nextval('public.routes_id_seq'::regclass);


--
-- Name: sports sport_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sports ALTER COLUMN sport_id SET DEFAULT nextval('public.sports_sport_id_seq'::regclass);


--
-- Name: tags tag_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags ALTER COLUMN tag_id SET DEFAULT nextval('public.tags_tag_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: agent_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.agent_messages (id, user_id, role, content, created_at) FROM stdin;
1	2	user	привет	2025-11-11 09:28:34.221008
2	2	assistant	Привет! Чем могу помочь по Москве? 😊\n\nУточни, пожалуйста:\n- Интересуют достопримечательности?\n- Ищешь маршрут?\n- Нужны советы по транспорту или еде?	2025-11-11 09:28:34.221023
3	2	user	Парки для прогулки	2025-11-14 02:33:56.6058
4	2	assistant	Отличный выбор! Вот лучшие парки Москвы для прогулки, разделенные по стилю:\n\n**Классические и знаменитые:**\n*   **Парк Горького** — центр притяжения, красивые набережные, прокат велосипедов, кафе.\n*   **ВДНХ** — грандиозная архитектура, фонтаны, музеи, Останкинская башня рядом.\n*   **Коломенское** — царская усадьба с древними церквями и видами на Москву-реку.\n\n**Спокойные и живописные:**\n*   **Парк «Царицыно»** — пруды, дворец в готическом стиле, тенистые аллеи.\n*   **Парк «Сокольники»** — огромная территория, рощи, идеально для велопрогулок.\n*   **Ботанический сад / ВДНХ (парк «Останкино»)** — ухоженные аллеи, японский сад, тишина.\n\n**Современные и благоустроенные:**\n*   **Парк «Зарядье»** — уникальные ландшафты, «Парящий мост», флорариум.\n*   **Музеон** — парк искусств у «Красного Октября», скульптуры и отличные виды на Кремль.\n\n**Какой тип отдыха вам ближе: спокойный или активный?** Помогу составить оптимальный маршрут.	2025-11-14 02:33:56.605814
5	2	user	Парки для прогулки	2025-11-14 02:53:46.841619
6	2	assistant	Отличный выбор! Вот лучшие парки Москвы для прогулки, разделенные по стилю:\n\n**Классические и знаменитые:**\n*   **Парк Горького** — центр притяжения, красивые набережные, прокат велосипедов, кафе.\n*   **ВДНХ** — грандиозная архитектура, фонтаны, музеи, Останкинская башня рядом.\n*   **Коломенское** — царская усадьба с древними церквями и видами на Москву-реку.\n\n**Спокойные и живописные:**\n*   **Парк «Царицыно»** — пруды, дворец в готическом стиле, тенистые аллеи.\n*   **Парк «Сокольники»** — огромная территория, рощи, идеально для велопрогулок.\n*   **Ботанический сад / ВДНХ (парк «Останкино»)** — ухоженные аллеи, японский сад, тишина.\n\n**Современные и благоустроенные:**\n*   **Парк «Зарядье»** — уникальные ландшафты, «Парящий мост», флорариум.\n*   **Музеон** — парк искусств у «Красного Октября», скульптуры и отличные виды на Кремль.\n\n**Какой тип отдыха вам ближе: спокойный или активный?** Помогу составить оптимальный маршрут.	2025-11-14 02:53:46.84218
\.


--
-- Data for Name: amenities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.amenities (amenity_id, amenity_name, amenity_type, description) FROM stdin;
1	wheelchair	accessibility	\N
2	wifi	internet	\N
3	internet_access	internet	\N
4	wlan	internet	\N
5	outdoor_seating	seating	\N
6	parking	parking	\N
7	card_payment	payment	\N
8	takeaway	service	\N
9	delivery	service	\N
10	reservation	service	\N
11	toilets	facility	\N
12	bench	facility	\N
13	drinking_water	facility	\N
\.


--
-- Data for Name: cuisines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cuisines (cuisine_id, cuisine_name, cuisine_code) FROM stdin;
1	Нет кухни	\N
2	Русская кухня	russian
3	Грузинская кухня	georgian
4	Американская кухня	american
5	Европейская кухня	european
6	Итальянская кухня	italian
7	Азиатская кухня	asian
8	Японская кухня	japanese
9	Китайская кухня	chinese
10	Кофе	coffee_shop
11	Сэндвичи	sandwich
12	Фастфуд	fast_food
13	Вегетарианская	vegetarian
14	Веганская	vegan
15	Современная русская кухня	modern_russian
\.


--
-- Data for Name: generation_jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.generation_jobs (id, user_id, status, error_message, partial, route_id, payload_json, created_at, updated_at) FROM stdin;
868041b4-5f00-4e44-b77b-af46401be97c	\N	done	\N	f	\N	{"route_id":"483c9208-f0cd-492e-8b20-3ccfe3a6d4eb","title":"Романтическая прогулка по историческому центру Москвы","summary":{"intro":"Этот маршрут проведёт вас по самым живописным уголкам центра Москвы, где история переплетается с романтикой. Идеально для неспешной прогулки с фотосессией на фоне архитектурных шедевров.","transport":"Весь маршрут рассчитан на пешую прогулку - удобная обувь будет вашим лучшим спутником","budget":"Экономный вариант: вход в музеи бесплатный или по минимальной стоимости, питание в демократичных кафе","food":"По пути будут встречаться уютные кофейни и булочные, где можно перекусить","tips":"Возьмите с собой фотоаппарат или зарядите телефон - архитектурные детали особняков того стоят! Лучшее время для фото - утренние часы, когда свет особенно мягкий","weather_plan":"Маршрут проходит по улицам, но при плохой погоде можно заглянуть в музеи и галереи по пути"},"steps":[{"title":"Прогулка по Остоженке","description":"Начнём с одной из самых красивых улиц Москвы - Остоженки. Здесь вы увидите великолепные особняки XIX века, включая Особняк Абрикосовых и Особняк Всеволожских. Идеальное место для романтических фото на фоне исторической архитектуры","start_time":"10:00","end_time":"11:00","duration_minutes":60,"address":"улица Остоженка","website":"","coordinates":{"lat":55.741,"lon":37.5975}},{"title":"Особняк Абрикосовых","description":"Полюбуйтесь одним из самых изящных особняков Москвы, построенным в стиле модерн. Фасад здания украшен изысканными лепными деталями - прекрасный фон для памятных фотографий. Особняк принадлежал знаменитой семье кондитеров Абрикосовых","start_time":"11:00","end_time":"11:30","duration_minutes":30,"address":"улица Остоженка, 51 с1","website":"","coordinates":{"lat":55.7408,"lon":37.5969}},{"title":"Особняк Всеволожских","description":"Ещё один архитектурный шедевр на этой же улице. Особняк в стиле неоклассицизма поражает своей гармонией и изяществом. Прогуляйтесь вокруг здания - каждый ракурс открывает новые детали для фото","start_time":"11:30","end_time":"12:00","duration_minutes":30,"address":"улица Остоженка, 49 с1","website":"","coordinates":{"lat":55.7409,"lon":37.5972}}],"yandex_url":"https://yandex.ru/maps/213/moscow/?ll=37.597500%2C55.741000&z=16","created_at":"2025-11-11T09:22:03.328600","raw_response":"```json\\n{\\n    \\"title\\": \\"Романтическая прогулка по историческому центру Москвы\\",\\n    \\"summary\\": {\\n        \\"intro\\": \\"Этот маршрут проведёт вас по самым живописным уголкам центра Москвы, где история переплетается с романтикой. Идеально для неспешной прогулки с фотосессией на фоне архитектурных шедевров.\\",\\n        \\"transport\\": \\"Весь маршрут рассчитан на пешую прогулку - удобная обувь будет вашим лучшим спутником\\",\\n        \\"budget\\": \\"Экономный вариант: вход в музеи бесплатный или по минимальной стоимости, питание в демократичных кафе\\",\\n        \\"food\\": \\"По пути будут встречаться уютные кофейни и булочные, где можно перекусить\\",\\n        \\"tips\\": \\"Возьмите с собой фотоаппарат или зарядите телефон - архитектурные детали особняков того стоят! Лучшее время для фото - утренние часы, когда свет особенно мягкий\\",\\n        \\"weather_plan\\": \\"Маршрут проходит по улицам, но при плохой погоде можно заглянуть в музеи и галереи по пути\\"\\n    },\\n    \\"steps\\": [\\n        {\\n            \\"title\\": \\"Прогулка по Остоженке\\",\\n            \\"description\\": \\"Начнём с одной из самых красивых улиц Москвы - Остоженки. Здесь вы увидите великолепные особняки XIX века, включая Особняк Абрикосовых и Особняк Всеволожских. Идеальное место для романтических фото на фоне исторической архитектуры\\",\\n            \\"start_time\\": \\"10:00\\",\\n            \\"end_time\\": \\"11:00\\",\\n            \\"duration_minutes\\": 60,\\n            \\"address\\": \\"улица Остоженка\\",\\n            \\"website\\": \\"\\",\\n            \\"coordinates\\": {\\"lat\\": 55.7410, \\"lon\\": 37.5975}\\n        },\\n        {\\n            \\"title\\": \\"Особняк Абрикосовых\\",\\n            \\"description\\": \\"Полюбуйтесь одним из самых изящных особняков Москвы, построенным в стиле модерн. Фасад здания украшен изысканными лепными деталями - прекрасный фон для памятных фотографий. Особняк принадлежал знаменитой семье кондитеров Абрикосовых\\",\\n            \\"start_time\\": \\"11:00\\",\\n            \\"end_time\\": \\"11:30\\",\\n            \\"duration_minutes\\": 30,\\n            \\"address\\": \\"улица Остоженка, 51 с1\\",\\n            \\"website\\": \\"\\",\\n            \\"coordinates\\": {\\"lat\\": 55.7408, \\"lon\\": 37.5969}\\n        },\\n        {\\n            \\"title\\": \\"Особняк Всеволожских\\",\\n            \\"description\\": \\"Ещё один архитектурный шедевр на этой же улице. Особняк в стиле неоклассицизма поражает своей гармонией и изяществом. Прогуляйтесь вокруг здания - каждый ракурс открывает новые детали для фото\\",\\n            \\"start_time\\": \\"11:30\\",\\n            \\"end_time\\": \\"12:00\\",\\n            \\"duration_minutes\\": 30,\\n            \\"address\\": \\"улица Остоженка, 49 с1\\",\\n            \\"website\\": \\"\\",\\n            \\"coordinates\\": {\\"lat\\": 55.7409, \\"lon\\": 37.5972}\\n        }\\n    ],\\n    \\"yandex_url\\": \\"https://yandex.ru/maps/213/moscow/?ll=37.597500%2C55.741000&z=16\\"\\n}\\n```"}	2025-11-11 09:21:31.361327	2025-11-11 09:22:03.336796
61219656-ae30-4f45-a3d0-655733e45c4f	2	done	\N	f	\N	{"route_id":"c99863be-3e64-451b-9708-25baf3151850","title":"Романтическая прогулка по историческому центру Москвы","summary":{"intro":"Идеальный маршрут для влюблённых пар, сочетающий архитектурные красоты, уютные кафе и живописные уголки старой Москвы. Прогулка пройдёт по тихим переулкам Остоженки и окрестностям, где сохранилась атмосфера старого города.","transport":"Пешая прогулка от метро \\"Парк Культуры\\" или \\"Кропоткинская\\"","budget":"Экономный вариант: основные расходы только на кафе и небольшие сувениры","food":"Остановка в уютном кафе с демократичными ценами и приятной атмосферой","tips":"Возьмите с собой фотоаппарат - здесь много фотогеничных мест. Для романтической атмосферы лучше приходить в будние дни, когда меньше туристов.","weather_plan":"Маршрут хорош в любую погоду: в солнечный день можно наслаждаться архитектурой, в дождь - укрыться в одном из уютных кафе"},"steps":[{"title":"Прогулка по Остоженке","description":"Начнём нашу романтическую прогулку с одной из самых красивых улиц Москвы. Остоженка сохранила очарование старого города - здесь вы увидите изящные особняки XIX века, уютные дворики и аутентичную московскую атмосферу. Идеальное место для первых совместных фотографий.","start_time":"10:00","end_time":"11:00","duration_minutes":60,"address":"улица Остоженка","website":"","coordinates":{"lat":55.7376,"lon":37.5977}},{"title":"Особняк Абрикосовых","description":"Полюбуйтесь одним из самых красивых зданий Москвы - изящным особняком в стиле модерн, построенным для семьи известных кондитеров Абрикосовых. Фасад украшен изысканной лепниной и витражами. Отличный фон для романтических снимков!","start_time":"11:00","end_time":"11:30","duration_minutes":30,"address":"улица Остоженка, 51 с1","website":"","coordinates":{"lat":55.7372,"lon":37.5973}},{"title":"Особняк Всеволожских","description":"Ещё один архитектурный шедевр напротив - изящный особняк в классическом стиле. Пройдитесь по тихому переулку, почувствуйте атмосферу старой московской аристократии. Здесь особенно тихо и уютно, идеально для неспешной прогулки вдвоём.","start_time":"11:30","end_time":"12:00","duration_minutes":30,"address":"улица Остоженка, 49 с1","website":"","coordinates":{"lat":55.7373,"lon":37.5971}},{"title":"Кофе-пауза в уютном кафе","description":"После архитектурных впечатлений зайдите в одно из местных кафе на Остоженке или в соседних переулках. Здесь много демократичных заведений с отличным кофе и домашней выпечкой. Идеальное место для душевной беседы за чашечкой ароматного напитка.","start_time":"12:00","end_time":"13:00","duration_minutes":60,"address":"Окрестности Остоженки","website":"","coordinates":{"lat":55.7375,"lon":37.598}}],"yandex_url":"https://yandex.ru/maps/213/moscow/?ll=37.597700%2C55.737600&mode=routes&rtext=55.737600%2C37.597700~55.737200%2C37.597300~55.737300%2C37.597100~55.737500%2C37.598000&rtt=pd&ruri=~~~&z=16","created_at":"2025-11-11T09:29:42.503162","raw_response":"```json\\n{\\n    \\"title\\": \\"Романтическая прогулка по историческому центру Москвы\\",\\n    \\"summary\\": {\\n        \\"intro\\": \\"Идеальный маршрут для влюблённых пар, сочетающий архитектурные красоты, уютные кафе и живописные уголки старой Москвы. Прогулка пройдёт по тихим переулкам Остоженки и окрестностям, где сохранилась атмосфера старого города.\\",\\n        \\"transport\\": \\"Пешая прогулка от метро \\\\\\"Парк Культуры\\\\\\" или \\\\\\"Кропоткинская\\\\\\"\\",\\n        \\"budget\\": \\"Экономный вариант: основные расходы только на кафе и небольшие сувениры\\",\\n        \\"food\\": \\"Остановка в уютном кафе с демократичными ценами и приятной атмосферой\\",\\n        \\"tips\\": \\"Возьмите с собой фотоаппарат - здесь много фотогеничных мест. Для романтической атмосферы лучше приходить в будние дни, когда меньше туристов.\\",\\n        \\"weather_plan\\": \\"Маршрут хорош в любую погоду: в солнечный день можно наслаждаться архитектурой, в дождь - укрыться в одном из уютных кафе\\"\\n    },\\n    \\"steps\\": [\\n        {\\n            \\"title\\": \\"Прогулка по Остоженке\\",\\n            \\"description\\": \\"Начнём нашу романтическую прогулку с одной из самых красивых улиц Москвы. Остоженка сохранила очарование старого города - здесь вы увидите изящные особняки XIX века, уютные дворики и аутентичную московскую атмосферу. Идеальное место для первых совместных фотографий.\\",\\n            \\"start_time\\": \\"10:00\\",\\n            \\"end_time\\": \\"11:00\\",\\n            \\"duration_minutes\\": 60,\\n            \\"address\\": \\"улица Остоженка\\",\\n            \\"website\\": \\"\\",\\n            \\"coordinates\\": {\\n                \\"lat\\": 55.7376,\\n                \\"lon\\": 37.5977\\n            }\\n        },\\n        {\\n            \\"title\\": \\"Особняк Абрикосовых\\",\\n            \\"description\\": \\"Полюбуйтесь одним из самых красивых зданий Москвы - изящным особняком в стиле модерн, построенным для семьи известных кондитеров Абрикосовых. Фасад украшен изысканной лепниной и витражами. Отличный фон для романтических снимков!\\",\\n            \\"start_time\\": \\"11:00\\",\\n            \\"end_time\\": \\"11:30\\",\\n            \\"duration_minutes\\": 30,\\n            \\"address\\": \\"улица Остоженка, 51 с1\\",\\n            \\"website\\": \\"\\",\\n            \\"coordinates\\": {\\n                \\"lat\\": 55.7372,\\n                \\"lon\\": 37.5973\\n            }\\n        },\\n        {\\n            \\"title\\": \\"Особняк Всеволожских\\",\\n            \\"description\\": \\"Ещё один архитектурный шедевр напротив - изящный особняк в классическом стиле. Пройдитесь по тихому переулку, почувствуйте атмосферу старой московской аристократии. Здесь особенно тихо и уютно, идеально для неспешной прогулки вдвоём.\\",\\n            \\"start_time\\": \\"11:30\\",\\n            \\"end_time\\": \\"12:00\\",\\n            \\"duration_minutes\\": 30,\\n            \\"address\\": \\"улица Остоженка, 49 с1\\",\\n            \\"website\\": \\"\\",\\n            \\"coordinates\\": {\\n                \\"lat\\": 55.7373,\\n                \\"lon\\": 37.5971\\n            }\\n        },\\n        {\\n            \\"title\\": \\"Кофе-пауза в уютном кафе\\",\\n            \\"description\\": \\"После архитектурных впечатлений зайдите в одно из местных кафе на Остоженке или в соседних переулках. Здесь много демократичных заведений с отличным кофе и домашней выпечкой. Идеальное место для душевной беседы за чашечкой ароматного напитка.\\",\\n            \\"start_time\\": \\"12:00\\",\\n            \\"end_time\\": \\"13:00\\",\\n            \\"duration_minutes\\": 60,\\n            \\"address\\": \\"Окрестности Остоженки\\",\\n            \\"website\\": \\"\\",\\n            \\"coordinates\\": {\\n                \\"lat\\": 55.7375,\\n                \\"lon\\": 37.5980\\n            }\\n        }\\n    ],\\n    \\"yandex_url\\": \\"https://yandex.ru/maps/213/moscow/?ll=37.597700%2C55.737600&mode=routes&rtext=55.737600%2C37.597700~55.737200%2C37.597300~55.737300%2C37.597100~55.737500%2C37.598000&rtt=pd&ruri=~~~&z=16\\"\\n}\\n```"}	2025-11-11 09:28:56.250965	2025-11-11 09:29:42.519274
2c7643a4-9f06-4b13-a6db-0e2e75e92422	\N	running	\N	f	\N	{"start_time":"10:00","duration":"2-3","walk_type":"romantic","start_point":"Центр города","budget":"economy","preferences":"photo","activities":"museum","food":"","transport":"walking","limitations":"","context":"{\\"city\\":\\"Москва\\",\\"budget\\":\\"economy\\",\\"categories\\":[\\"museum\\"]}"}	2025-11-11 10:04:55.41154	2025-11-11 10:04:55.472158
ba15a0be-a23a-4523-ad83-0ea205d042d4	\N	done	\N	f	\N	{"route_id":"d7d21120-c4a4-430d-8957-d8c4181f2ad4","title":"Романтическая прогулка по скрытым уголкам Остоженки","summary":{"intro":"Маршрут для влюбленных пар, которые хотят насладиться атмосферой старой Москвы, сделать красивые фото и посетить уютные места без лишних трат","transport":"Пешая прогулка от метро Парк Культуры или Кропоткинская","budget":"Экономный вариант - основные расходы только на кофе и перекусы","food":"Уютные кафе с демократичными ценами в районе Остоженки","tips":"Возьмите с собой фотоаппарат - здесь много живописных уголков. Лучшее время для фото - утренние часы, когда мягкий свет","weather_plan":"Маршрут полностью пешеходный, подходит для любой погоды - есть где укрыться в случае дождя"},"steps":[{"title":"Утренний кофе в атмосферном дворике","description":"Начните день с ароматного кофе в одном из уютных кафе на Остоженке. Рекомендуем поискать места во дворах - там обычно тише и романтичнее. Идеальное место для первых фотографий дня за чашечкой капучино","start_time":"10:00","end_time":"11:00","duration_minutes":60,"address":"ул. Остоженка, окрестности метро Парк Культуры","website":"","coordinates":{"lat":55.736,"lon":37.5936}},{"title":"Прогулка по особнякам Остоженки","description":"Неспешная прогулка мимо знаменитых особняков Абрикосовых и Всеволожских. Эти архитектурные жемчужины создают неповторимую атмосферу старой Москвы. Отличный бэкграунд для романтических фото и видео","start_time":"11:00","end_time":"12:00","duration_minutes":60,"address":"ул. Остоженка, 49-51","website":"","coordinates":{"lat":55.7375,"lon":37.5942}},{"title":"Тихие переулки Замоскворечья","description":"Спуститесь к набережной и прогуляйтесь по малолюдным переулкам Замоскворечья. Здесь сохранилась аутентичная атмосфера купеческой Москвы. Идеальное место для спокойной беседы и красивых кадров","start_time":"12:00","end_time":"13:00","duration_minutes":60,"address":"Большой Овчинниковский переулок и окрестности","website":"","coordinates":{"lat":55.7415,"lon":37.6278}}],"yandex_url":"https://yandex.ru/maps/213/moscow/?ll=37.617700%2C55.755819&mode=routes&rtext=55.736000%2C37.593600~55.737500%2C37.594200~55.741500%2C37.627800&rtt=pd&ruri=~~~&z=14","created_at":"2025-11-11T10:07:44.167753","raw_response":"```json\\n{\\n    \\"title\\": \\"Романтическая прогулка по скрытым уголкам Остоженки\\",\\n    \\"summary\\": {\\n        \\"intro\\": \\"Маршрут для влюбленных пар, которые хотят насладиться атмосферой старой Москвы, сделать красивые фото и посетить уютные места без лишних трат\\",\\n        \\"transport\\": \\"Пешая прогулка от метро Парк Культуры или Кропоткинская\\",\\n        \\"budget\\": \\"Экономный вариант - основные расходы только на кофе и перекусы\\",\\n        \\"food\\": \\"Уютные кафе с демократичными ценами в районе Остоженки\\",\\n        \\"tips\\": \\"Возьмите с собой фотоаппарат - здесь много живописных уголков. Лучшее время для фото - утренние часы, когда мягкий свет\\",\\n        \\"weather_plan\\": \\"Маршрут полностью пешеходный, подходит для любой погоды - есть где укрыться в случае дождя\\"\\n    },\\n    \\"steps\\": [\\n        {\\n            \\"title\\": \\"Утренний кофе в атмосферном дворике\\",\\n            \\"description\\": \\"Начните день с ароматного кофе в одном из уютных кафе на Остоженке. Рекомендуем поискать места во дворах - там обычно тише и романтичнее. Идеальное место для первых фотографий дня за чашечкой капучино\\",\\n            \\"start_time\\": \\"10:00\\",\\n            \\"end_time\\": \\"11:00\\",\\n            \\"duration_minutes\\": 60,\\n            \\"address\\": \\"ул. Остоженка, окрестности метро Парк Культуры\\",\\n            \\"website\\": \\"\\",\\n            \\"coordinates\\": {\\n                \\"lat\\": 55.7360,\\n                \\"lon\\": 37.5936\\n            }\\n        },\\n        {\\n            \\"title\\": \\"Прогулка по особнякам Остоженки\\",\\n            \\"description\\": \\"Неспешная прогулка мимо знаменитых особняков Абрикосовых и Всеволожских. Эти архитектурные жемчужины создают неповторимую атмосферу старой Москвы. Отличный бэкграунд для романтических фото и видео\\",\\n            \\"start_time\\": \\"11:00\\",\\n            \\"end_time\\": \\"12:00\\",\\n            \\"duration_minutes\\": 60,\\n            \\"address\\": \\"ул. Остоженка, 49-51\\",\\n            \\"website\\": \\"\\",\\n            \\"coordinates\\": {\\n                \\"lat\\": 55.7375,\\n                \\"lon\\": 37.5942\\n            }\\n        },\\n        {\\n            \\"title\\": \\"Тихие переулки Замоскворечья\\",\\n            \\"description\\": \\"Спуститесь к набережной и прогуляйтесь по малолюдным переулкам Замоскворечья. Здесь сохранилась аутентичная атмосфера купеческой Москвы. Идеальное место для спокойной беседы и красивых кадров\\",\\n            \\"start_time\\": \\"12:00\\",\\n            \\"end_time\\": \\"13:00\\",\\n            \\"duration_minutes\\": 60,\\n            \\"address\\": \\"Большой Овчинниковский переулок и окрестности\\",\\n            \\"website\\": \\"\\",\\n            \\"coordinates\\": {\\n                \\"lat\\": 55.7415,\\n                \\"lon\\": 37.6278\\n            }\\n        }\\n    ],\\n    \\"yandex_url\\": \\"https://yandex.ru/maps/213/moscow/?ll=37.617700%2C55.755819&mode=routes&rtext=55.736000%2C37.593600~55.737500%2C37.594200~55.741500%2C37.627800&rtt=pd&ruri=~~~&z=14\\"\\n}\\n```"}	2025-11-11 10:07:11.827145	2025-11-11 10:07:44.174278
f1c817bb-3c16-40d3-98b2-43ff84e4703a	2	done	\N	f	\N	{"route_id":"6911d0d4-2da4-44f0-8c88-37b713b72e64","title":"Романтическое путешествие по скрытым жемчужинам Москвы","summary":{"intro":"Этот маршрут проведёт вас по самым уютным и романтичным уголкам центра Москвы, где история переплетается с искусством, а тихие переулки хранят тайны старинных особняков.","transport":"Пешие прогулки между точками маршрута, метро для более дальних перемещений","budget":"Средний бюджет: входные билеты в музеи, обед в кафе, возможны дополнительные расходы на сувениры","food":"По пути встретятся уютные кафе и рестораны для романтического обеда","tips":"Возьмите с собой фотоаппарат - архитектура особняков и атмосфера переулков того стоят. Рекомендую бронировать билеты в музеи онлайн.","weather_plan":"Маршрут в основном проходит по крытым помещениям, но захватите зонт на случай дождя при переходе между локациями"},"steps":[{"title":"Утренняя прогулка по Остоженке","description":"Начнём день с прогулки по одной из самых красивых улиц Москвы. Полюбуйтесь фасадами Особняка Абрикосовых и Особняка Всеволожских - эти здания словно переносят в эпоху модерна. Идеальное место для первых романтических фотографий.","start_time":"10:00","end_time":"11:00","duration_minutes":60,"address":"улица Остоженка, 49-51","website":"","coordinates":{"lat":55.7392,"lon":37.5978}},{"title":"Музей русского импрессионизма","description":"Всего в 10 минутах ходьбы вас ждёт современный музей с потрясающей коллекцией. Идеальное место для ценителей искусства - уютная атмосфера, прекрасное освещение и шедевры русских художников создадут романтическое настроение.","start_time":"11:10","end_time":"12:40","duration_minutes":90,"address":"Ленинградский проспект, 15, стр. 11","website":"https://www.rusimp.su","coordinates":{"lat":55.7916,"lon":37.5583}},{"title":"Обед в уютном дворике","description":"Прогуляйтесь до тихого переулка, где спряталось кафе с атмосферным двориком. Идеальное место для романтического обеда - домашняя кухня, уютная обстановка и приглушённый свет.","start_time":"12:50","end_time":"14:00","duration_minutes":70,"address":"Большой Афанасьевский переулок, 41","website":"","coordinates":{"lat":55.7478,"lon":37.5936}},{"title":"Музей-квартира Елены Гнесиной","description":"Маленький, но невероятно атмосферный музей в старинном особняке. Сохранилась оригинальная обстановка, а камерные концерты в музыкальном салоне создают по-настоящему романтическую атмосферу.","start_time":"14:15","end_time":"15:30","duration_minutes":75,"address":"Поварская улица, 38","website":"https://gnesina-museum.com","coordinates":{"lat":55.7562,"lon":37.5908}},{"title":"Вечерний киносеанс в историческом зале","description":"Завершим день в одном из самых атмосферных кинотеатров Москвы. 'Художественный' на Арбатской площади - старейший кинотеатр города с особой романтической аурой. Идеальное место для просмотра фильма вдвоём.","start_time":"16:00","end_time":"18:00","duration_minutes":120,"address":"Арбатская площадь, 14","website":"https://kinoarbat.ru","coordinates":{"lat":55.7525,"lon":37.6047}}],"yandex_url":"https://yandex.ru/maps/213/moscow/?ll=37.6173%2C55.7558&mode=routes&rtext=55.7392%2C37.5978~55.7916%2C37.5583~55.7478%2C37.5936~55.7562%2C37.5908~55.7525%2C37.6047&rtt=auto&ruri=~&z=13","created_at":"2025-11-11T10:16:56.692164","raw_response":"```json\\n{\\n    \\"title\\": \\"Романтическое путешествие по скрытым жемчужинам Москвы\\",\\n    \\"summary\\": {\\n        \\"intro\\": \\"Этот маршрут проведёт вас по самым уютным и романтичным уголкам центра Москвы, где история переплетается с искусством, а тихие переулки хранят тайны старинных особняков.\\",\\n        \\"transport\\": \\"Пешие прогулки между точками маршрута, метро для более дальних перемещений\\",\\n        \\"budget\\": \\"Средний бюджет: входные билеты в музеи, обед в кафе, возможны дополнительные расходы на сувениры\\",\\n        \\"food\\": \\"По пути встретятся уютные кафе и рестораны для романтического обеда\\",\\n        \\"tips\\": \\"Возьмите с собой фотоаппарат - архитектура особняков и атмосфера переулков того стоят. Рекомендую бронировать билеты в музеи онлайн.\\",\\n        \\"weather_plan\\": \\"Маршрут в основном проходит по крытым помещениям, но захватите зонт на случай дождя при переходе между локациями\\"\\n    },\\n    \\"steps\\": [\\n        {\\n            \\"title\\": \\"Утренняя прогулка по Остоженке\\",\\n            \\"description\\": \\"Начнём день с прогулки по одной из самых красивых улиц Москвы. Полюбуйтесь фасадами Особняка Абрикосовых и Особняка Всеволожских - эти здания словно переносят в эпоху модерна. Идеальное место для первых романтических фотографий.\\",\\n            \\"start_time\\": \\"10:00\\",\\n            \\"end_time\\": \\"11:00\\",\\n            \\"duration_minutes\\": 60,\\n            \\"address\\": \\"улица Остоженка, 49-51\\",\\n            \\"website\\": \\"\\",\\n            \\"coordinates\\": {\\n                \\"lat\\": 55.7392,\\n                \\"lon\\": 37.5978\\n            }\\n        },\\n        {\\n            \\"title\\": \\"Музей русского импрессионизма\\",\\n            \\"description\\": \\"Всего в 10 минутах ходьбы вас ждёт современный музей с потрясающей коллекцией. Идеальное место для ценителей искусства - уютная атмосфера, прекрасное освещение и шедевры русских художников создадут романтическое настроение.\\",\\n            \\"start_time\\": \\"11:10\\",\\n            \\"end_time\\": \\"12:40\\",\\n            \\"duration_minutes\\": 90,\\n            \\"address\\": \\"Ленинградский проспект, 15, стр. 11\\",\\n            \\"website\\": \\"https://www.rusimp.su\\",\\n            \\"coordinates\\": {\\n                \\"lat\\": 55.7916,\\n                \\"lon\\": 37.5583\\n            }\\n        },\\n        {\\n            \\"title\\": \\"Обед в уютном дворике\\",\\n            \\"description\\": \\"Прогуляйтесь до тихого переулка, где спряталось кафе с атмосферным двориком. Идеальное место для романтического обеда - домашняя кухня, уютная обстановка и приглушённый свет.\\",\\n            \\"start_time\\": \\"12:50\\",\\n            \\"end_time\\": \\"14:00\\",\\n            \\"duration_minutes\\": 70,\\n            \\"address\\": \\"Большой Афанасьевский переулок, 41\\",\\n            \\"website\\": \\"\\",\\n            \\"coordinates\\": {\\n                \\"lat\\": 55.7478,\\n                \\"lon\\": 37.5936\\n            }\\n        },\\n        {\\n            \\"title\\": \\"Музей-квартира Елены Гнесиной\\",\\n            \\"description\\": \\"Маленький, но невероятно атмосферный музей в старинном особняке. Сохранилась оригинальная обстановка, а камерные концерты в музыкальном салоне создают по-настоящему романтическую атмосферу.\\",\\n            \\"start_time\\": \\"14:15\\",\\n            \\"end_time\\": \\"15:30\\",\\n            \\"duration_minutes\\": 75,\\n            \\"address\\": \\"Поварская улица, 38\\",\\n            \\"website\\": \\"https://gnesina-museum.com\\",\\n            \\"coordinates\\": {\\n                \\"lat\\": 55.7562,\\n                \\"lon\\": 37.5908\\n            }\\n        },\\n        {\\n            \\"title\\": \\"Вечерний киносеанс в историческом зале\\",\\n            \\"description\\": \\"Завершим день в одном из самых атмосферных кинотеатров Москвы. 'Художественный' на Арбатской площади - старейший кинотеатр города с особой романтической аурой. Идеальное место для просмотра фильма вдвоём.\\",\\n            \\"start_time\\": \\"16:00\\",\\n            \\"end_time\\": \\"18:00\\",\\n            \\"duration_minutes\\": 120,\\n            \\"address\\": \\"Арбатская площадь, 14\\",\\n            \\"website\\": \\"https://kinoarbat.ru\\",\\n            \\"coordinates\\": {\\n                \\"lat\\": 55.7525,\\n                \\"lon\\": 37.6047\\n            }\\n        }\\n    ],\\n    \\"yandex_url\\": \\"https://yandex.ru/maps/213/moscow/?ll=37.6173%2C55.7558&mode=routes&rtext=55.7392%2C37.5978~55.7916%2C37.5583~55.7478%2C37.5936~55.7562%2C37.5908~55.7525%2C37.6047&rtt=auto&ruri=~&z=13\\"\\n}\\n```"}	2025-11-11 10:16:13.755931	2025-11-11 10:16:56.696223
\.


--
-- Data for Name: natural_features; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.natural_features (feature_id, feature_type, feature_name) FROM stdin;
1	water	pond
2	water	lake
3	water	canal
4	water	river
5	water	reservoir
\.


--
-- Data for Name: place_amenities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.place_amenities (place_amenity_id, place_id, amenity_id, amenity_value) FROM stdin;
\.


--
-- Data for Name: place_cuisines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.place_cuisines (place_cuisine_id, place_id, cuisine_id, is_main) FROM stdin;
1	201	5	f
2	236	11	f
3	366	3	f
4	388	7	f
5	438	3	f
6	484	6	f
7	1210	2	f
8	984	2	f
9	979	2	f
10	890	2	f
11	876	2	f
12	815	2	f
13	812	2	f
14	777	2	f
15	734	2	f
16	702	2	f
17	696	2	f
18	657	2	f
19	541	2	f
20	1353	3	f
21	1331	3	f
22	1254	3	f
23	1241	3	f
24	1218	3	f
25	1151	3	f
26	1148	3	f
27	1119	3	f
28	1077	3	f
29	1059	3	f
30	969	3	f
31	951	3	f
32	936	3	f
33	929	3	f
34	907	3	f
35	680	3	f
36	670	3	f
37	659	3	f
38	631	3	f
39	595	3	f
40	554	3	f
41	576	4	f
42	1225	6	f
43	1178	6	f
44	1161	6	f
45	1097	6	f
46	1084	6	f
47	1069	6	f
48	1067	6	f
49	1046	6	f
50	1007	6	f
51	983	6	f
52	982	6	f
53	978	6	f
54	968	6	f
55	700	6	f
56	590	6	f
57	1367	7	f
58	1091	7	f
59	1053	7	f
60	1026	7	f
61	1000	7	f
62	881	7	f
63	863	7	f
64	803	7	f
65	745	7	f
66	714	7	f
67	691	7	f
68	636	7	f
69	1048	8	f
70	988	8	f
71	878	8	f
72	807	8	f
73	793	8	f
74	726	8	f
75	618	8	f
76	1189	9	f
77	1162	9	f
78	889	9	f
79	1365	10	f
80	1362	10	f
81	1359	10	f
82	1358	10	f
83	1356	10	f
84	1355	10	f
85	1351	10	f
86	1350	10	f
87	1348	10	f
88	1343	10	f
89	1341	10	f
90	1338	10	f
91	1335	10	f
92	1334	10	f
93	1333	10	f
94	1332	10	f
95	1329	10	f
96	1328	10	f
97	1327	10	f
98	1326	10	f
99	1325	10	f
100	1324	10	f
101	1322	10	f
102	1321	10	f
103	1319	10	f
104	1316	10	f
105	1313	10	f
106	1312	10	f
107	1311	10	f
108	1310	10	f
109	1309	10	f
110	1308	10	f
111	1304	10	f
112	1303	10	f
113	1301	10	f
114	1300	10	f
115	1298	10	f
116	1297	10	f
117	1296	10	f
118	1291	10	f
119	1285	10	f
120	1282	10	f
121	1281	10	f
122	1280	10	f
123	1279	10	f
124	1278	10	f
125	1277	10	f
126	1276	10	f
127	1275	10	f
128	1274	10	f
129	1272	10	f
130	1271	10	f
131	1269	10	f
132	1267	10	f
133	1266	10	f
134	1265	10	f
135	1264	10	f
136	1262	10	f
137	1259	10	f
138	1258	10	f
139	1257	10	f
140	1256	10	f
141	1253	10	f
142	1251	10	f
143	1249	10	f
144	1248	10	f
145	1246	10	f
146	1244	10	f
147	1240	10	f
148	1239	10	f
149	1237	10	f
150	1233	10	f
151	1232	10	f
152	1228	10	f
153	1224	10	f
154	1221	10	f
155	1220	10	f
156	1219	10	f
157	1217	10	f
158	1216	10	f
159	1215	10	f
160	1214	10	f
161	1209	10	f
162	1208	10	f
163	1204	10	f
164	1174	10	f
165	1200	10	f
166	1194	10	f
167	1192	10	f
168	1190	10	f
169	1188	10	f
170	1187	10	f
171	1185	10	f
172	1183	10	f
173	1182	10	f
174	1181	10	f
175	1180	10	f
176	1176	10	f
177	1175	10	f
179	1172	10	f
180	1171	10	f
181	1170	10	f
182	1166	10	f
183	1159	10	f
184	1156	10	f
185	1149	10	f
186	1145	10	f
187	1141	10	f
188	1140	10	f
189	1138	10	f
190	1137	10	f
191	1136	10	f
192	1130	10	f
193	1129	10	f
194	1128	10	f
195	1127	10	f
196	1126	10	f
197	1125	10	f
198	1124	10	f
199	1123	10	f
200	1118	10	f
201	1117	10	f
202	1115	10	f
203	1114	10	f
204	1112	10	f
205	1108	10	f
206	1107	10	f
207	1106	10	f
208	1103	10	f
209	1102	10	f
210	1098	10	f
211	1094	10	f
212	1088	10	f
213	1082	10	f
214	1080	10	f
215	1078	10	f
216	1074	10	f
217	1073	10	f
218	1070	10	f
219	1068	10	f
220	1066	10	f
221	1064	10	f
222	1063	10	f
223	1057	10	f
224	1056	10	f
225	1054	10	f
226	1049	10	f
227	1043	10	f
228	1039	10	f
229	1038	10	f
230	1035	10	f
231	1034	10	f
232	1033	10	f
233	1025	10	f
234	1023	10	f
235	1022	10	f
236	1020	10	f
237	1016	10	f
238	1015	10	f
239	1011	10	f
240	1003	10	f
241	1001	10	f
242	997	10	f
243	993	10	f
244	992	10	f
245	991	10	f
246	986	10	f
247	981	10	f
248	980	10	f
249	977	10	f
250	976	10	f
251	975	10	f
252	973	10	f
253	963	10	f
254	962	10	f
255	960	10	f
256	956	10	f
257	955	10	f
258	954	10	f
259	953	10	f
260	952	10	f
261	950	10	f
262	949	10	f
263	948	10	f
264	944	10	f
265	942	10	f
266	941	10	f
267	935	10	f
268	933	10	f
269	932	10	f
270	930	10	f
271	928	10	f
272	926	10	f
273	925	10	f
274	921	10	f
275	920	10	f
276	918	10	f
277	917	10	f
278	914	10	f
279	913	10	f
280	911	10	f
281	908	10	f
282	892	10	f
283	888	10	f
284	887	10	f
285	886	10	f
286	885	10	f
287	884	10	f
288	882	10	f
289	875	10	f
290	873	10	f
291	872	10	f
292	871	10	f
293	868	10	f
294	865	10	f
295	864	10	f
296	860	10	f
297	857	10	f
298	856	10	f
299	854	10	f
300	853	10	f
301	852	10	f
302	844	10	f
303	843	10	f
304	838	10	f
305	837	10	f
306	836	10	f
307	834	10	f
308	831	10	f
309	828	10	f
310	827	10	f
311	823	10	f
312	820	10	f
313	819	10	f
314	818	10	f
315	817	10	f
316	816	10	f
317	810	10	f
318	809	10	f
319	808	10	f
320	806	10	f
321	801	10	f
322	799	10	f
323	792	10	f
324	791	10	f
325	790	10	f
326	787	10	f
327	784	10	f
328	783	10	f
329	781	10	f
330	779	10	f
331	778	10	f
332	774	10	f
333	771	10	f
334	770	10	f
335	769	10	f
336	768	10	f
337	766	10	f
338	763	10	f
339	762	10	f
340	757	10	f
341	756	10	f
342	754	10	f
343	750	10	f
344	747	10	f
345	746	10	f
346	741	10	f
347	740	10	f
348	736	10	f
349	732	10	f
350	731	10	f
351	730	10	f
352	729	10	f
353	725	10	f
354	723	10	f
355	722	10	f
356	717	10	f
357	716	10	f
358	711	10	f
359	710	10	f
360	707	10	f
361	703	10	f
362	701	10	f
363	699	10	f
364	698	10	f
365	695	10	f
366	693	10	f
367	690	10	f
368	688	10	f
369	686	10	f
370	683	10	f
371	682	10	f
372	678	10	f
373	674	10	f
374	672	10	f
375	668	10	f
376	667	10	f
377	664	10	f
378	662	10	f
379	658	10	f
380	654	10	f
381	653	10	f
382	652	10	f
383	650	10	f
384	649	10	f
385	647	10	f
386	640	10	f
387	639	10	f
388	633	10	f
389	630	10	f
390	629	10	f
391	628	10	f
392	627	10	f
393	626	10	f
394	625	10	f
395	623	10	f
396	622	10	f
397	620	10	f
398	614	10	f
399	613	10	f
400	611	10	f
401	610	10	f
402	605	10	f
403	604	10	f
404	602	10	f
405	598	10	f
406	597	10	f
407	596	10	f
408	591	10	f
409	588	10	f
410	586	10	f
411	585	10	f
412	584	10	f
413	579	10	f
414	578	10	f
415	574	10	f
416	573	10	f
417	570	10	f
418	568	10	f
419	567	10	f
420	565	10	f
421	564	10	f
422	561	10	f
423	560	10	f
424	555	10	f
425	552	10	f
426	551	10	f
427	544	10	f
428	543	10	f
429	542	10	f
430	539	10	f
431	538	10	f
432	534	10	f
433	533	10	f
434	528	10	f
435	524	10	f
436	523	10	f
437	520	10	f
438	1032	11	f
439	521	11	f
793	1783	2	f
794	2535	2	f
795	2511	2	f
796	2504	2	f
797	2425	2	f
798	2413	2	f
799	2381	2	f
800	2280	2	f
801	2262	2	f
802	2239	2	f
803	2196	2	f
804	2184	2	f
805	2179	2	f
806	1986	2	f
807	2140	2	f
808	2062	2	f
809	2060	2	f
810	2054	2	f
811	2034	2	f
812	1999	2	f
814	1939	2	f
815	1896	2	f
816	1890	2	f
817	1881	2	f
818	2559	3	f
819	2546	3	f
820	2523	3	f
821	2515	3	f
822	2500	3	f
823	2490	3	f
824	2481	3	f
825	2477	3	f
826	2461	3	f
827	2457	3	f
828	2452	3	f
829	2444	3	f
830	2440	3	f
831	2431	3	f
832	2427	3	f
833	2419	3	f
834	2417	3	f
835	2395	3	f
836	2391	3	f
837	2388	3	f
838	2383	3	f
839	2376	3	f
840	2373	3	f
841	2349	3	f
842	2337	3	f
843	2334	3	f
844	2298	3	f
845	2291	3	f
846	2274	3	f
847	2273	3	f
848	2259	3	f
849	2251	3	f
850	2240	3	f
851	2231	3	f
852	2229	3	f
853	2228	3	f
854	2205	3	f
855	2204	3	f
856	2202	3	f
857	2197	3	f
858	2187	3	f
859	2176	3	f
860	2153	3	f
861	2116	3	f
862	2096	3	f
863	2074	3	f
864	2059	3	f
865	2057	3	f
866	2055	3	f
867	2053	3	f
868	2018	3	f
869	2017	3	f
870	2007	3	f
871	2001	3	f
872	1995	3	f
873	1970	3	f
874	1957	3	f
875	1923	3	f
876	1918	3	f
877	1917	3	f
878	1888	3	f
879	1886	3	f
880	1880	3	f
881	1874	3	f
882	1868	3	f
883	1867	3	f
884	1866	3	f
885	1858	3	f
886	2528	4	f
887	2000	5	f
888	2556	6	f
889	2549	6	f
890	2543	6	f
891	2533	6	f
892	2527	6	f
893	2517	6	f
894	2512	6	f
895	2506	6	f
896	2503	6	f
897	2498	6	f
898	2494	6	f
899	2475	6	f
900	2466	6	f
901	2465	6	f
902	2463	6	f
903	2448	6	f
904	2445	6	f
905	2410	6	f
906	2405	6	f
907	2403	6	f
908	2382	6	f
909	2369	6	f
910	2364	6	f
911	2360	6	f
912	2357	6	f
913	2352	6	f
914	2335	6	f
915	2327	6	f
916	2324	6	f
917	2313	6	f
918	2300	6	f
919	2293	6	f
920	2277	6	f
921	2272	6	f
922	2271	6	f
923	2246	6	f
924	2244	6	f
925	2230	6	f
926	2223	6	f
927	2221	6	f
928	2201	6	f
929	2200	6	f
930	2191	6	f
931	2190	6	f
932	2188	6	f
933	2185	6	f
934	2168	6	f
935	2167	6	f
936	2160	6	f
937	2150	6	f
938	2139	6	f
939	2133	6	f
940	2132	6	f
941	2121	6	f
942	2117	6	f
943	2102	6	f
944	2100	6	f
945	2091	6	f
946	2088	6	f
947	2072	6	f
948	2066	6	f
949	2064	6	f
950	2052	6	f
951	2046	6	f
952	2044	6	f
953	2043	6	f
954	1884	6	f
955	2012	6	f
956	2003	6	f
957	1998	6	f
958	1991	6	f
959	1989	6	f
960	1975	6	f
961	1967	6	f
962	1960	6	f
963	1951	6	f
964	1932	6	f
965	1922	6	f
966	1915	6	f
967	1903	6	f
968	1895	6	f
970	1865	6	f
971	1859	6	f
972	1857	6	f
973	1856	6	f
974	2561	7	f
975	2553	7	f
976	2090	7	f
977	2036	7	f
978	2033	7	f
979	1980	7	f
980	1955	7	f
981	1947	7	f
982	1924	7	f
983	1901	7	f
984	1898	7	f
985	1876	7	f
986	2537	8	f
987	2467	8	f
988	2384	8	f
989	2333	8	f
990	2308	8	f
991	2304	8	f
992	2275	8	f
993	2257	8	f
994	2232	8	f
995	2169	8	f
996	2123	8	f
997	2086	8	f
998	2085	8	f
999	2084	8	f
1000	1976	8	f
1001	1964	8	f
1002	1928	8	f
1003	1908	8	f
1004	1855	8	f
1005	2551	9	f
1006	2433	9	f
1007	2371	9	f
1008	2331	9	f
1009	2322	9	f
1010	2243	9	f
1011	2238	9	f
1012	2164	9	f
1013	2492	10	f
1014	2441	10	f
1015	2411	10	f
1016	2269	10	f
1017	2219	10	f
1018	2047	10	f
1019	2025	10	f
1020	1994	10	f
1021	1979	10	f
\.


--
-- Data for Name: place_natural_features; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.place_natural_features (place_feature_id, place_id, feature_id) FROM stdin;
1	1704	1
2	1705	1
3	1706	1
\.


--
-- Data for Name: place_photos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.place_photos (photo_id, place_id, photo_url, is_main, photo_order) FROM stdin;
\.


--
-- Data for Name: place_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.place_reviews (review_id, place_id, rating, review_text, author_name, user_id) FROM stdin;
\.


--
-- Data for Name: place_sports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.place_sports (place_sport_id, place_id, sport_id) FROM stdin;
1	1388	1
2	1389	1
3	1390	1
4	1391	1
5	1392	1
6	1393	1
7	1394	1
8	1395	1
9	1396	1
10	1397	1
11	1398	1
12	1399	1
13	1400	1
14	1401	1
15	1402	1
16	1403	1
17	1404	1
18	1405	1
19	1406	1
20	1407	1
21	1408	1
22	1409	1
23	1410	1
24	1411	1
25	1412	1
26	1413	1
27	1414	1
28	1415	1
29	1416	1
30	1417	1
31	1418	1
32	1419	1
33	1420	1
34	1421	1
35	1422	1
36	1423	1
37	1424	1
38	1425	1
39	1426	1
40	1427	1
41	1428	1
42	1429	1
43	1430	1
44	1431	1
45	1432	1
46	1433	1
47	1434	1
48	1435	1
49	1436	1
50	1437	1
51	1438	1
52	1439	1
53	1440	1
54	1441	1
55	1403	4
\.


--
-- Data for Name: place_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.place_tags (place_tag_id, place_id, tag_id) FROM stdin;
\.


--
-- Data for Name: place_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.place_types (place_type_id, type_name, type_code, description) FROM stdin;
1	Парк	park	Парковая зона для отдыха и прогулок
2	Мост	bridge	Архитектурное сооружение для пересечения водных преград
3	Канатная дорога	cable_car	Подвесная транспортная система с панорамным видом
4	Музей	museum	Культурное учреждение для выставок и экспозиций
5	Бар	bar	Заведение для отдыха и употребления напитков
6	Паб	pub	Традиционное питейное заведение с неформальной атмосферой
7	Ресторан	restaurant	Заведение общественного питания с широким меню
8	Кафе	cafe	Небольшое заведение для легких закусок и напитков
9	Кофейня	coffee_shop	Специализированное заведение для любителей кофе
10	Достопримечательность	attraction	Популярное место культурного или исторического значения
11	Театр	theatre	Культурное учреждение для театральных представлений
12	Кинотеатр	cinema	Заведение для показа фильмов на большом экране
13	Дом культуры	community_centre	Многофункциональный центр для культурных мероприятий
14	Центр искусств	arts_centre	Пространство для творческих выставок и перформансов
15	Фитнес-центр	fitness_centre	Спортивный комплекс с тренажерами и групповыми занятиями
16	Спортзал	gym	Помещение для силовых тренировок и фитнеса
17	Стадион	stadium	Крупное спортивное сооружение для соревнований
18	Водоём	water_body	Природный или искусственный водный объект
19	Пруд	pond	Небольшой стоячий водоём естественного или искусственного происхождения
20	Озеро	lake	Крупный естественный водоём с пресной водой
21	Канал	canal	Искусственный водный путь для судоходства или ирригации
22	Детская площадка	playground	Оборудованная зона для игр и развлечений детей
23	Верёвочный парк	rope_park	Приключенческий комплекс с веревочными трассами на высоте
24	Библиотека	library	Учреждение для хранения книг и предоставления доступа к знаниям
25	Читальный зал	reading_room	Тихое пространство для чтения и работы с литературой
26	Сквер	square	Небольшая городская озелененная зона для отдыха
27	Спортивная площадка	sports_pitch	Открытая площадка для различных видов спорта
28	Хоккейная коробка	ice_rink	Огороженная ледовая или роликовая площадка для хоккея
29	Скейт-парк	skate_park	Специализированная площадка с рампами для скейтбординга и роликов
\.


--
-- Data for Name: places; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.places (place_id, name, address, description, latitude, longitude, phone, website, opening_hours, place_type_id, price_category_id, is_active, osm_type, osm_id, access_type) FROM stdin;
1369	Киноклуб «Фитиль»	\N	\N	55.7318160	37.5940050	+7 495 2870211	http://www.fitil-club.ru	\N	12	\N	t	node	2400977903	\N
1370	Художественный	Арбатская площадь, 14	\N	55.7524010	37.6020330	\N	https://cinema1909.ru/	Mo-Su 00:00-03:00,09:00-24:00	12	\N	t	way	35814561	\N
1371	Кинозал Домжур	\N	\N	55.7539030	37.6015530	+7 495 6915698	http://www.arbatkino.ru	\N	12	\N	t	node	2451843150	\N
1372	Музеон	\N	\N	55.7372560	37.6098880	\N	\N	\N	12	\N	t	way	355094030	\N
1373	Люмьер-холл	\N	\N	55.7409920	37.6097790	\N	\N	\N	12	\N	t	node	4235272602	\N
1374	Кино Хауз	\N	\N	55.7404970	37.6106020	+7 499 9555676	https://msk.kinohouse.me/	\N	12	\N	t	node	5198807692	\N
1375	Романов Синема	\N	\N	55.7543220	37.6096130	+7 495 6096454	http://www.romanov-cinema.ru	\N	12	\N	t	node	2562927544	\N
1376	Каро Эрмитаж	улица Каретный Ряд, вл3	\N	55.7700260	37.6104010	+7 909 9878025	https://karofilm.ru/theatres?id=36	\N	12	\N	t	way	503292670	\N
1377	Москва	\N	\N	55.7570280	37.6174060	+7 495 7301031	http://cinema.moscow	\N	12	\N	t	node	3218033069	\N
1378	ГУМ Кинозал	\N	\N	55.7551620	37.6213950	\N	\N	\N	12	\N	t	node	5194624041	\N
1379	Формула кино	\N	\N	55.7601080	37.6241490	\N	\N	Mo-Su 10:00-03:00	12	\N	t	node	3441521464	\N
1380	Пять звезд на Павелецкой	\N	\N	55.7329290	37.6372470	\N	http://www.5zvezd.ru	\N	12	\N	t	node	560539620	\N
1381	Пять звезд на Новокузнецкой	Большой Овчинниковский переулок, 16	\N	55.7447630	37.6297300	+7 495 9169169;+7 495 5102888	http://www.5zvezd.ru/	\N	12	\N	t	node	795888754	\N
1382	Loft Cinema	\N	\N	55.7648410	37.6314560	\N	\N	Mo-Su 11:00-04:00	12	\N	t	node	3616859093	\N
1383	Кино Хауз	\N	\N	55.7661910	37.6322420	\N	https://msk.kinohouse.me	\N	12	\N	t	node	11809152330	\N
1384	Иллюзион	\N	\N	55.7480150	37.6450220	\N	\N	\N	12	\N	t	node	781048859	\N
1385	Едва Знакомы	\N	\N	55.7658610	37.6479970	\N	\N	\N	12	\N	t	node	13246112883	\N
18	Особняк Абрикосовых	улица Остоженка, 51 с1	\N	55.7372970	37.5956110	\N	\N	\N	10	\N	t	way	76633316	\N
19	Особняк Всеволожских	улица Остоженка, 49 с1	\N	55.7376620	37.5956890	\N	\N	\N	10	\N	t	relation	1850015	\N
20	Арка главного входа в ЦПКиО им. Горького	улица Крымский Вал, 9	\N	55.7314380	37.6034230	\N	\N	\N	10	\N	t	relation	6913335	\N
21	Белые палаты на улице Пречистенке	улица Пречистенка, 3 с1	\N	55.7438960	37.5998800	\N	\N	\N	10	\N	t	way	45818589	\N
22	Белокаменные палаты XVII века	улица Пречистенка, 12/2 с8	\N	55.7441270	37.5981960	\N	\N	\N	10	\N	t	way	129212993	\N
23	Усадьба Давыдова	улица Пречистенка, 17/8 с5	\N	55.7416660	37.5945280	\N	\N	\N	10	\N	t	way	412738928	\N
24	Усадьба Замятина-Третьякова	Гоголевский бульвар, 6 с1	\N	55.7455980	37.6014970	\N	\N	\N	10	\N	t	relation	2156225	\N
25	Усадьба Морозова на Пречистенке	улица Пречистенка, 21/1	\N	55.7409230	37.5927960	\N	\N	\N	10	\N	t	relation	8914102	\N
26	Усадьба Хрущёвых-Селезнёвых	улица Пречистенка, 12/2 с1	\N	55.7436120	37.5976500	\N	\N	\N	10	\N	t	relation	9464684	\N
27	Дом великана	\N	\N	55.7506240	37.5948660	+7 495 2012516	https://domvelikana.ru	Mo-Su 11:00-24:00	10	\N	t	node	3801742364	\N
28	Дом вверх дном	\N	\N	55.7505850	37.5947330	+7 495 2012516	https://domvverhdnom.com	Mo-Su 11:00-24:00	10	\N	t	node	4762121986	\N
29	Усадьба Лопухиных	Малый Знаменский переулок, 3/5 с4	\N	55.7466840	37.6032890	\N	\N	\N	10	\N	t	way	32693359	\N
30	Усадьба Вяземских-Долгоруковых	Малый Знаменский переулок, 3/5 с1	\N	55.7477170	37.6030370	\N	\N	\N	10	\N	t	way	32693719	\N
31	Усадьба Апраксиных-Бутурлиных	улица Знаменка, 12/2 с3	\N	55.7508040	37.6050650	\N	\N	\N	10	\N	t	way	47853856	\N
32	Хрустальная часовня	\N	\N	55.7470260	37.6008220	\N	\N	\N	10	\N	t	way	161305820	\N
33	Дом Пороховщикова	Староконюшенный переулок, 36	\N	55.7498030	37.5947510	\N	\N	\N	10	\N	t	way	274909164	\N
35	Усадьба Цурикова	Гоголевский бульвар, 12 с1	\N	55.7473910	37.6004740	\N	\N	\N	10	\N	t	relation	2156516	\N
36	Пушкинский дуб	\N	\N	55.7597730	37.6007320	\N	\N	\N	10	\N	t	node	4262313478	\N
37	Особняк С. П. Рябушинского	Малая Никитская улица, 6/2 с5	\N	55.7581720	37.5963490	\N	\N	\N	10	\N	t	way	46932330	\N
38	Городская усадьба Черкасской — Баскакова	Большая Никитская улица, 44 с2	\N	55.7577980	37.5928470	\N	\N	\N	10	\N	t	way	131491830	\N
39	Палаты Арасланова	Брюсов переулок, 1	\N	55.7570970	37.6047420	\N	\N	\N	10	\N	t	way	253241659	\N
40	Фонтан-ротонда «Наталья и Александр»	\N	\N	55.7576080	37.5975570	\N	\N	\N	10	\N	t	way	465453187	\N
41	Особняк Арсения Морозова	улица Воздвиженка, 16 с1	\N	55.7532490	37.6036280	\N	\N	\N	10	\N	t	relation	5371125	\N
42	Усадьба Шаховского-Краузе-Осиповых	улица Воздвиженка, 18/9	\N	55.7533080	37.6026690	\N	\N	\N	10	\N	t	relation	5371134	\N
43	Особняк Шехтеля	Ермолаевский переулок, 28	\N	55.7662640	37.5953870	\N	\N	\N	10	\N	t	way	52582025	\N
44	В. В. Маяковскому	\N	\N	55.7696210	37.5956490	\N	\N	\N	10	\N	t	node	566683529	\N
45	Парк скульптур	\N	\N	55.7358650	37.6081770	\N	\N	\N	10	\N	t	way	412964634	\N
46	Золотая Царицына палата	\N	\N	55.7507000	37.6163680	\N	\N	\N	10	\N	t	node	2368886170	\N
48	Арсенал	\N	Арсенал строился в 1702—1736 годах. Пострадал в Великом московском пожаре 1737 года, в 1786—1796 годах восстановлен Матвеем Казаковым. Взорван отступавшими наполеоновскими войсками в 1812 году, восстановлен в 1815—1828 годах.	55.7537430	37.6161990	\N	\N	\N	10	\N	t	relation	51497	\N
49	Благовещенский собор	\N	\N	55.7500030	37.6169040	\N	\N	\N	10	\N	t	relation	1359251	\N
1386	Каро Фильм	\N	\N	55.7578950	37.6588870	+7 903 6222355	https://karofilm.ru/theatres?id=3	Mo-Su 10:00-04:00	12	\N	t	node	524512029	\N
1387	Кинопаркинг «Депо Три вокзала»	\N	\N	55.7740280	37.6626790	\N	https://kinoteatr.ru/depo-cinemapark/#	\N	12	\N	t	node	11096369799	\N
1408	Fitneo	\N	\N	55.7630240	37.6138680	+7 495 7448676	http://www.fitneo-msk.ru	\N	15	\N	t	node	4764559286	\N
1921	№ 13	\N	\N	55.7600660	37.5964780	+7 495 6955888	\N	\N	7	\N	t	node	7040344939	\N
50	Троицкая башня	\N	\N	55.7522750	37.6145260	\N	\N	\N	10	\N	t	relation	1360627	\N
51	Боровицкая башня	\N	\N	55.7489000	37.6125270	\N	\N	\N	10	\N	t	relation	1360630	\N
52	Оружейная башня	\N	\N	55.7493870	37.6127130	\N	\N	\N	10	\N	t	relation	1360631	\N
53	Московский Кремль	\N	\N	55.7516180	37.6178230	\N	\N	\N	10	\N	t	relation	1360641	\N
54	Водовзводная башня	\N	\N	55.7480810	37.6136050	\N	\N	\N	10	\N	t	relation	1360648	\N
55	Комендантская башня	\N	\N	55.7506130	37.6135850	\N	\N	\N	10	\N	t	relation	1360655	\N
56	Собор Успения Пресвятой Богородицы	\N	\N	55.7509250	37.6170600	\N	\N	\N	10	\N	t	relation	3028585	\N
57	Кутафья башня	\N	\N	55.7525240	37.6127740	\N	\N	\N	10	\N	t	relation	3061015	\N
58	Манеж	Манежная площадь, 1	Перестроен после пожара 2004 года	55.7534640	37.6123260	+7 495 6459277	http://moscowmanege.ru	\N	10	\N	t	relation	3062892	\N
59	Благовещенская башня	\N	\N	55.7486890	37.6151860	\N	\N	\N	10	\N	t	relation	3229300	\N
60	Дом Пашкова	улица Воздвиженка, 3/5 с1	\N	55.7499400	37.6083690	\N	\N	\N	10	\N	t	relation	5969167	\N
61	Красное крыльцо	\N	\N	55.7503710	37.6167900	\N	\N	\N	10	\N	t	relation	8011729	\N
62	Грот «Руины»	\N	\N	55.7537640	37.6153710	\N	\N	\N	10	\N	t	node	1666070895	\N
63	Подводный обитаемый аппарат «Аргус»	\N	\N	55.7559190	37.6123440	\N	\N	\N	10	\N	t	node	4646606685	\N
64	Серпентенит	\N	\N	55.7557690	37.6127180	\N	\N	\N	10	\N	t	node	6450775484	\N
65	Угольный комбайн	\N	\N	55.7558120	37.6126480	\N	\N	\N	10	\N	t	node	6450775585	\N
66	Палаты Троекуровых	Георгиевский переулок, 4-6 с2	\N	55.7584810	37.6157020	\N	\N	\N	10	\N	t	way	46512994	\N
69	Угловая Арсенальная башня	\N	\N	55.7551400	37.6165270	\N	\N	\N	10	\N	t	relation	1360653	\N
70	Средняя Арсенальная башня	\N	\N	55.7537110	37.6155850	\N	\N	\N	10	\N	t	relation	1360654	\N
71	Часы мира	\N	\N	55.7558480	37.6146410	\N	\N	\N	10	\N	t	relation	1362329	\N
73	Аллея городов-героев и городов воинской славы	\N	\N	55.7545550	37.6157560	\N	\N	\N	10	\N	t	relation	16492514	\N
74	Могила Неизвестного Солдата	\N	\N	55.7548370	37.6160500	\N	\N	\N	10	\N	t	relation	16492515	\N
75	А. С. Пушкину	\N	\N	55.7653350	37.6054860	\N	\N	\N	10	\N	t	node	416562790	\N
76	Нарышкинские палаты	улица Петровка, 28 с6	\N	55.7664580	37.6154290	\N	\N	\N	10	\N	t	relation	3138566	\N
77	Флигель городской усадьбы П. А. Алянчиковой	Успенский переулок, 14 с2	\N	55.7690300	37.6101820	\N	\N	\N	10	\N	t	way	46846671	\N
78	Парковый павильон усадьбы Гагариных	\N	\N	55.7693740	37.6110680	\N	\N	\N	10	\N	t	way	496384216	\N
79	Усадьба Гагариных	Страстной бульвар, 15/29	\N	55.7684190	37.6113520	\N	\N	\N	10	\N	t	relation	6478948	\N
80	Главный дом городской усадьбы П. А. Алянчиковой	\N	\N	55.7691960	37.6096460	\N	\N	\N	10	\N	t	relation	6478949	\N
81	Особняк Новиковых	улица Большая Полянка, 45	\N	55.7332300	37.6200080	\N	\N	\N	10	\N	t	way	163742857	\N
82	Царь-пушка	\N	\N	55.7514670	37.6179210	\N	\N	\N	10	\N	t	node	311999396	\N
83	Царь-колокол	\N	\N	55.7507670	37.6184370	\N	\N	\N	10	\N	t	node	311999397	\N
84	Кремлёвские куранты	\N	\N	55.7525130	37.6213580	\N	\N	\N	10	\N	t	node	1994968044	\N
85	Заповедное посольство	\N	\N	55.7517750	37.6282160	\N	\N	\N	10	\N	t	node	5022259605	\N
86	Берёзовая роща	\N	\N	55.7519180	37.6258670	\N	\N	\N	10	\N	t	node	5026362356	\N
87	Смешанный лес	\N	\N	55.7510050	37.6262960	\N	\N	\N	10	\N	t	node	5026362357	\N
88	Берёзовая роща	\N	\N	55.7512120	37.6280760	\N	\N	\N	10	\N	t	node	5026362359	\N
89	Хвойный лес	\N	\N	55.7506310	37.6270740	\N	\N	\N	10	\N	t	node	5026362362	\N
90	Прибрежный лес	\N	\N	55.7501640	37.6259060	\N	\N	\N	10	\N	t	node	5026362363	\N
91	Степь	\N	\N	55.7505630	37.6285320	\N	\N	\N	10	\N	t	node	5026362365	\N
92	Мономахов трон	\N	\N	55.7508310	37.6171030	\N	\N	\N	10	\N	t	way	1251726004	\N
93	Собор Михаила Архангела	\N	\N	55.7501710	37.6177990	\N	\N	\N	10	\N	t	relation	1359243	\N
95	Успенская звонница	\N	\N	55.7508860	37.6180420	\N	\N	\N	10	\N	t	relation	1359278	\N
97	Первая безымянная башня	\N	\N	55.7494940	37.6189330	\N	\N	\N	10	\N	t	relation	1360642	\N
98	Константино-Еленинская башня	\N	\N	55.7511660	37.6223300	\N	\N	\N	10	\N	t	relation	1360645	\N
99	Беклемишевская башня	\N	\N	55.7497260	37.6232030	\N	\N	\N	10	\N	t	relation	1360651	\N
100	Спасская башня	\N	\N	55.7525290	37.6213810	\N	\N	\N	10	\N	t	relation	1360656	\N
101	Петровская башня	\N	\N	55.7496940	37.6220030	\N	\N	\N	10	\N	t	relation	1360660	\N
102	Набатная башня	\N	\N	55.7518140	37.6218500	\N	\N	\N	10	\N	t	relation	1360661	\N
103	Царская башня	\N	\N	55.7522400	37.6215500	\N	\N	\N	10	\N	t	relation	1360663	\N
104	Красная площадь	\N	\N	55.7536050	37.6206120	\N	\N	\N	10	\N	t	relation	1577673	\N
106	Собор Василия Блаженного	Красная площадь, 2	\N	55.7524690	37.6230970	+7 495 6983304	http://www.shm.ru/	Mo-Su 11:00-17:00	10	\N	t	relation	3030568	\N
107	Тайницкая башня	\N	\N	55.7493360	37.6178580	\N	\N	\N	10	\N	t	relation	3229147	\N
108	Вторая безымянная башня	\N	\N	55.7496040	37.6203230	\N	\N	\N	10	\N	t	relation	3229567	\N
110	Старый Английский Двор	улица Варварка, 4А	\N	55.7523230	37.6268630	+7 985 0071797	www.russianmuseums.info/M425	Tu-Su 10:00-21:00	10	\N	t	relation	19075670	\N
111	Нулевой километр	\N	\N	55.7558470	37.6177040	\N	\N	\N	10	\N	t	node	583204619	\N
112	Артиллерийский двор	\N	\N	55.7558010	37.6188590	\N	\N	\N	10	\N	t	node	5812210388	\N
114	Никольская башня	\N	\N	55.7545150	37.6178110	\N	\N	\N	10	\N	t	relation	1359372	\N
115	Сенатская башня	\N	\N	55.7535020	37.6195650	\N	\N	\N	10	\N	t	relation	1359374	\N
118	Лобное место	Красная площадь	\N	55.7532230	37.6225040	\N	\N	\N	10	\N	t	relation	3226496	\N
119	Мавзолей В. И. Ленина	\N	\N	55.7537210	37.6199020	\N	http://www.fso.gov.ru/info/p12.html	Tu-Su 10:00-13:00; Fr off	10	\N	t	relation	3272726	\N
120	Государственный универсальный магазин (ГУМ)	Красная площадь, 3	\N	55.7547030	37.6214890	+7 495 7884343	https://www.gum.ru/	Mo-Su 10:00-22:00	10	\N	t	relation	3330565	\N
121	Птичья башня	\N	\N	55.7588310	37.6225150	\N	\N	\N	10	\N	t	relation	5967883	\N
122	Правильная палата	\N	\N	55.7575080	37.6220710	\N	\N	\N	10	\N	t	relation	9303002	\N
123	Палаты тверского подворья	улица Кузнецкий Мост, 17 с2	\N	55.7626450	37.6249010	\N	\N	\N	10	\N	t	way	52475408	\N
124	Палаты в Овчинниках	Средний Овчинниковский переулок, 10 с1	\N	55.7444490	37.6310530	\N	\N	\N	10	\N	t	way	53854158	\N
125	Ледяная пещера	\N	\N	55.7516270	37.6291210	\N	\N	Mo-Su 14:00-20:00	10	\N	t	node	5020405213	\N
126	Большой амфитеатр	\N	\N	55.7512740	37.6300700	\N	\N	\N	10	\N	t	node	5022259606	\N
127	Луг	\N	\N	55.7512130	37.6294480	\N	\N	\N	10	\N	t	node	5026362353	\N
128	Луг	\N	\N	55.7520640	37.6304430	\N	\N	\N	10	\N	t	node	5026362354	\N
129	Северные ландшафты	\N	\N	55.7519510	37.6291630	\N	\N	\N	10	\N	t	node	5026362355	\N
130	Малый амфитеатр	\N	\N	55.7506180	37.6308780	\N	\N	\N	10	\N	t	node	5026362367	\N
131	Стеклянная кора	\N	\N	55.7512310	37.6311520	\N	\N	\N	10	\N	t	node	5026362370	\N
132	Видовой холм	\N	\N	55.7510760	37.6312560	\N	\N	\N	10	\N	t	node	5026362371	\N
133	Китайгородская стена	\N	\N	55.7512130	37.6324790	\N	\N	\N	10	\N	t	node	5026362372	\N
134	Парящий мост	\N	\N	55.7495030	37.6294050	\N	\N	24/7	10	\N	t	node	13068170801	\N
135	Китайгородская стена	\N	\N	55.7514280	37.6325700	\N	\N	\N	10	\N	t	way	35552032	\N
136	Китайгородская стена	\N	\N	55.7526040	37.6330090	\N	\N	\N	10	\N	t	way	549322019	\N
137	Опекунский совет	улица Солянка, 12-14	\N	55.7519630	37.6398560	\N	\N	\N	10	\N	t	relation	17361977	\N
138	Аллея правителей	\N	\N	55.7565480	37.6364250	\N	\N	\N	10	\N	t	node	5052540897	\N
139	Остатки фундамента храма Николая Чудотворца в Столпах	\N	\N	55.7597660	37.6361090	\N	\N	24/7	10	\N	t	node	5978239883	\N
140	Палаты Сверчковых	Сверчков переулок, 8 с3	XVII век. Памятник архитектуры. Охраняется государством.	55.7598780	37.6402650	\N	\N	\N	10	\N	t	way	41087037	\N
141	Красная руина	\N	\N	55.7585080	37.6360720	\N	\N	\N	10	\N	t	way	539112215	\N
143	Китайгородская стена	\N	\N	55.7530100	37.6331720	\N	\N	\N	10	\N	t	way	1426481065	\N
144	Станок-качалка	\N	\N	55.7664970	37.6358490	\N	\N	\N	10	\N	t	node	11809152311	\N
145	Главный дом усадьбы Головиных	Потаповский переулок, 8/12 с2	\N	55.7606930	37.6408190	\N	\N	\N	10	\N	t	way	45777816	\N
146	Жилой дом на Котельнической набережной	\N	\N	55.7470840	37.6426540	\N	\N	\N	10	\N	t	node	266720662	\N
147	Палаты Шуйских	Подкопаевский переулок, 5	\N	55.7543800	37.6426630	\N	\N	\N	10	\N	t	way	46096643	\N
148	Открытый фрагмент стены Белого города	\N	\N	55.7582750	37.6462750	\N	\N	24/7	10	\N	t	way	275902058	\N
149	Палаты Мазепы	Колпачный переулок, 10/7 с3	\N	55.7563470	37.6416720	\N	\N	\N	10	\N	t	relation	9037250	\N
151	Дворец Юсуповых	Большой Харитоньевский переулок, 21 с4	\N	55.7662700	37.6495590	\N	\N	\N	10	\N	t	way	52769675	\N
152	Дом-яйцо	улица Машкова, 1	\N	55.7627940	37.6491480	\N	\N	\N	10	\N	t	relation	9830039	\N
153	Новоспасский монастырь	\N	\N	55.7317500	37.6566140	\N	http://www.novospasskiymon.ru/	\N	10	\N	t	relation	7295268	\N
154	Городская усадьба Полежаевых и Зубовых	улица Александра Солженицына, 9 с1	\N	55.7427300	37.6568960	\N	\N	\N	10	\N	t	relation	3951750	\N
155	Бельведер	\N	\N	55.7675750	37.6587780	\N	\N	\N	10	\N	t	way	337042398	\N
156	Казанский вокзал	Комсомольская площадь, 2	\N	55.7735570	37.6564150	+7 800 7750000	http://kazansky.dzvr.ru/	\N	10	\N	t	relation	1309225	\N
157	WineState	\N	\N	55.7371830	37.6003690	\N	https://winestate.ru/	Mo-Su 10:00-22:00	5	\N	t	node	5694957121	\N
158	Заправка	\N	\N	55.7333050	37.6016770	+7 985 5400353	\N	Mo-Th 12:00-22:00; Fr-Su 12:00-23:00	5	\N	t	node	6918453204	\N
159	Дискурс	\N	\N	55.7379020	37.5935610	\N	\N	\N	5	\N	t	node	11202741388	\N
160	Вышка	\N	\N	55.7427820	37.6007320	\N	\N	\N	5	\N	t	node	1704413776	\N
161	Ещё вина	\N	\N	55.7444470	37.6005890	\N	\N	Mo-Su 11:00-23:00	5	\N	t	node	5249589204	\N
162	Берг-коллегия	\N	\N	55.7398960	37.5962820	\N	https://berg-bar.ru	\N	5	\N	t	node	6253712929	\N
163	Cavina	\N	\N	55.7402860	37.5936890	\N	https://www.cavinabar.ru/	Mo-Su 12:00-24:00	5	\N	t	node	9359328171	\N
164	Инта	\N	\N	55.7418270	37.5991140	\N	\N	\N	5	\N	t	node	10844712676	\N
165	Балалаечная	\N	\N	55.7503880	37.5950700	+7 495 7409061	\N	Mo-Su 12:00-24:00	5	\N	t	node	3069190032	\N
166	Dictatura Æstetica	\N	\N	55.7466540	37.5990680	+7 495 6977989	\N	Mo-Su 00:00-03:00,12:00-24:00	5	\N	t	node	3551766614	\N
167	Дежурная	\N	\N	55.7525810	37.5972880	+7 926 6418646	\N	24/7	5	\N	t	node	5260252120	\N
168	Оптимист	\N	\N	55.7520160	37.5972870	+7 999 8776068	\N	Mo-Su 13:00-24:00	5	\N	t	node	5856250880	\N
169	Single	\N	\N	55.7520740	37.5971670	+7 927 9068966	\N	\N	5	\N	t	node	7756869039	\N
170	На троих	\N	\N	55.7517970	37.5972370	\N	\N	\N	5	\N	t	node	9176377585	\N
171	Свои	\N	\N	55.7519980	37.5975320	\N	https://barsvoiarbat.ru/	\N	5	\N	t	node	9535262851	\N
172	Hot Bird	\N	\N	55.7523170	37.5970980	\N	https://hotbirds.ru/	\N	5	\N	t	node	9535262852	\N
173	Hitachi	\N	\N	55.7526480	37.5981590	\N	\N	Th,Fr 18:00-24:00; Sa 00:00-02:00,18:00-24:00; Su 00:00-02:00	5	\N	t	node	9696184622	\N
174	Пташка	\N	\N	55.7497850	37.5929940	+7 991 2301341	\N	Mo-Su 14:00-24:00	5	\N	t	node	9851586958	\N
175	Евгенич	\N	\N	55.7516060	37.5972960	+7 495 0218261	\N	Mo-Su 00:00-06:00,12:00-24:00	5	\N	t	node	10630964697	\N
176	Танцульки	\N	\N	55.7519690	37.5968110	+7 999 9995151	\N	\N	5	\N	t	node	11470176186	\N
177	Ester	\N	\N	55.7570510	37.6029750	+7 495 1089922	http://esterbistro.ru/	Mo-Su 12:00-24:00	5	\N	t	node	2321295669	\N
178	Винный базар	\N	\N	55.7557160	37.6003440	+7 495 6451955	\N	Mo-Su 13:00-01:00	5	\N	t	node	4223734917	\N
179	Iggy	\N	\N	55.7571050	37.5996650	\N	\N	Mo-Su 12:00-24:00	5	\N	t	node	5540105744	\N
180	Давид	\N	\N	55.7569400	37.5981600	+7 499 3915161	\N	Mo-Su 12:00-24:00	5	\N	t	node	6279475843	\N
181	Prolive	Никитский бульвар, 12	\N	55.7555550	37.6004620	+7 903 0105276;+7 965 1611699	https://prolivemsk.ru/	Su-Th 12:00-24:00; Fr, Sa 12:00-05:00	5	\N	t	node	6550999195	\N
182	Duke's	\N	\N	55.7559410	37.6001690	\N	\N	24/7	5	\N	t	node	7099701414	\N
401	Настенька	\N	\N	55.7545170	37.6347760	\N	\N	\N	5	\N	t	node	12576850819	\N
183	На вина!	\N	\N	55.7570200	37.5997440	+7 495 0032909	http://navina.me/	Mo-Su 13:00-24:00	5	\N	t	node	7141020140	\N
184	Geisha Superman	\N	\N	55.7589540	37.5987500	+7 985 5346209	\N	PH,Mo-Su 17:00-06:00	5	\N	t	node	7928680592	\N
185	Исси и Биси	\N	\N	55.7589610	37.5984390	\N	\N	Mo 00:00-06:00; Fr 18:00-24:00; Sa,Su 00:00-06:00,18:00-24:00	5	\N	t	node	12277383028	\N
186	Noor Electro	Тверская улица, 23/12	\N	55.7669620	37.6007610	+7 903 1367686	https://www.noorbar.com/	Mo-We 15:00-03:00; Th-Su 12:00-06:00	5	\N	t	node	2441527290	\N
187	Davidoff Малая Бронная	\N	\N	55.7630980	37.5947580	+7 495 6267067	http://www.davidoff-bronnaya.ru	Mo-Su 11:00-23:00	5	\N	t	node	2523286145	\N
188	LonelyTreeEvents	\N	\N	55.7608500	37.5982190	\N	\N	\N	5	\N	t	node	3425534949	\N
189	Киану	\N	\N	55.7636570	37.5940980	+7 495 2281884	\N	Mo-Su 12:00-23:00	5	\N	t	node	3519312330	\N
190	Berlin	\N	\N	55.7668700	37.5971370	+7 495 2220393	\N	Th 18:00-24:00; Fr 00:00-03:00,18:00-24:00; Sa 00:00-06:00,18:00-24:00; Su 00:00-06:00	5	\N	t	node	4775040929	\N
191	Наше кафе	\N	\N	55.7669840	37.6000260	+7 495 5185234	\N	\N	5	\N	t	node	5434230654	\N
192	The Bix	\N	\N	55.7629410	37.5968700	\N	\N	Tu 18:00-24:00; We-Sa 00:00-03:00,18:00-24:00; Su 00:00-03:00	5	\N	t	node	5764529709	\N
193	Happy End	Спиридоньевский переулок, 9 с1	\N	55.7624920	37.5946200	+7 499 7046969	https://www.happyend.moscow/	Mo-We,Su 12:00-24:00; Th-Sa 12:00-03:00	5	\N	t	node	5819733654	\N
194	Вишневый сад	\N	\N	55.7633580	37.5953640	\N	\N	Mo-Fr 00:00-05:00,16:00-24:00; Sa,Su 00:00-05:00,14:00-24:00	5	\N	t	node	5856251086	\N
195	Sous Sol	\N	\N	55.7651140	37.5946740	+7 903 293 66 00	http://soussol.ru/	Mo-Su 12:00-23:00	5	\N	t	node	8399252697	\N
196	Davno	\N	\N	55.7632930	37.5969020	+7 985 7703939	https://bardavno.com/	Mo-Su 12:00-23:00	5	\N	t	node	8449309117	\N
197	The Hat	\N	\N	55.7666520	37.6028520	+7 985 2575040	https://hatgroup.ru	Fr-Sa 18:00-04:00; Mo-Th,Su 18:00-01:00	5	\N	t	node	9394367229	\N
198	Последняя капля	\N	\N	55.7650710	37.6023580	\N	http://xn--80ahcvceleihp6oae.xn--p1ai/	\N	5	\N	t	node	10763832321	\N
199	Воробушек	\N	\N	55.7624280	37.5940270	\N	\N	We-Su 18:00-24:00	5	\N	t	node	12173718111	\N
200	IVAN	\N	\N	55.7677550	37.5983130	+7 963 7855545	https://ivanbar.ru/	\N	5	\N	t	node	2737112897	\N
201	We Cidreria	\N	\N	55.7679620	37.5986920	+7 925 3461072	http://we-cidreria.ru/	Fr,Sa 12:00-02:00, Su-Th 12:00-24:00	5	\N	t	node	2968621821	\N
202	Pivbar	\N	\N	55.7699840	37.5971950	+7 929 6730541	\N	Mo-Su 12:00-24:00	5	\N	t	node	3336224898	\N
203	13°	\N	\N	55.7723650	37.5969700	+7 915 2069449	https://13winebar.com/	Mo-Fr 09:00-23:00; Sa-Su 10:00-23:00	5	\N	t	node	4027973865	\N
204	Share house	Оружейный переулок, 3 с2	\N	55.7709270	37.5968010	+7 916 2974252	\N	Su-Th 15:00-24:00; Fr, Sa 15:00-02:00	5	\N	t	node	5927588586	\N
205	Dry & Wet	\N	\N	55.7680750	37.5976460	+7 929 6080378	http://dcwp.moscow/	Tu-Th 17:00-24:00; Fr,Sa 00:00-03:00,17:00-24:00; Su 00:00-03:00	5	\N	t	node	6297927363	\N
206	Шесть-you-Шесть	\N	\N	55.7700860	37.5974020	+7 495 1396627	http://ryumochnaya.ru/	Mo-Fr 17:00-03:00, Sa,Su 17:00-05:00	5	\N	t	node	7756869046	\N
207	Babes Never Die	\N	\N	55.7700550	37.5973380	+7 903 6277337	\N	24/7	5	\N	t	node	7925452991	\N
208	Valdo	\N	\N	55.7700230	37.5972740	+7 499 7040328	\N	Mo-Su 12:00-24:00	5	\N	t	node	7925452992	\N
209	Руки вверх	\N	\N	55.7677140	37.6010630	\N	https://rvbar.ru/	\N	5	\N	t	node	9394367241	\N
210	Бардо	\N	\N	55.7680900	37.5931930	\N	\N	\N	5	\N	t	node	9670054001	\N
211	Хет-трик	\N	\N	55.7712000	37.5975540	\N	\N	\N	5	\N	t	node	9991531594	\N
212	Апрель	\N	\N	55.7725960	37.5971470	\N	\N	\N	5	\N	t	node	10998416517	\N
213	Segreto	\N	\N	55.7675490	37.5984910	\N	https://segretobar.ru/	\N	5	\N	t	node	11425792249	\N
214	Довлатов	\N	\N	55.7719020	37.6048980	\N	https://dovlatovbar.ru/	\N	5	\N	t	node	11851428587	\N
215	Божью cпаси Коровку	\N	\N	55.7720200	37.5975740	\N	\N	\N	5	\N	t	node	11923050945	\N
216	Шашлычная	\N	\N	55.7706880	37.5964780	\N	\N	\N	5	\N	t	node	12451659833	\N
217	Wunderbar	\N	\N	55.7416470	37.6098610	+7 495 2337378	http://wunderbarmoscow.ru	We,Th 12:00-24:00; Fr,Sa 18:00-06:00	5	\N	t	node	2914203133	\N
218	Танцы	\N	\N	55.7388470	37.6054370	+7 (985) 119-47-09	http://dancesfoodpeople.ru	Su-Th 14:00-00:00; Fr-Sa 14:00-04:00	5	\N	t	node	4304619003	\N
219	Dictatura Æstetica	\N	\N	55.7403600	37.6086880	+7 495 9919946	\N	Mo-Su 00:00-03:00,15:00-24:00	5	\N	t	node	4575209428	\N
220	Караоке Pro	\N	\N	55.7422270	37.6163690	+7 499 7053333	\N	Mo-Su 00:00-06:00,10:00-24:00	5	\N	t	node	6617755705	\N
221	Howard Loves Craft	Болотная набережная, 7 с3	\N	55.7403480	37.6104670	+7 906 7691609	http://howardlovescraft.ru/	Mo-Su 12:00-24:00	5	\N	t	node	6660933585	\N
222	Крым	Болотная набережная, 3 с1	\N	55.7397200	37.6101290	\N	\N	\N	5	\N	t	node	8494363419	\N
223	Тропа	\N	\N	55.7403910	37.6103330	\N	\N	\N	5	\N	t	node	10763832317	\N
224	Rule	Староваганьковский переулок, 19 с7	\N	55.7512980	37.6070210	+7 985 1680819	http://ruletaproom.tilda.ws	Sa-Th 16:00-24:00; Fr 16:00-02:00	5	\N	t	node	3711746884	\N
225	Двойка	\N	\N	55.7511960	37.6065460	\N	\N	Mo-Fr 18:00-24:00; Sa,Su 00:00-03:00,18:00-24:00	5	\N	t	node	6253712940	\N
226	Дума	\N	\N	55.7567220	37.6106070	+7 495 6921119	http://clubduma.ru	Mo-Fr 09:00-06:00; Sa,Su 11:00-06:00	5	\N	t	node	1145199296	\N
227	Hidden	\N	\N	55.7600100	37.6140100	+7 495 6925015	http://www.hiddenbar.ru	Mo-Su 12:00-06:00	5	\N	t	node	2512438477	\N
228	Брюс	\N	\N	55.7578710	37.6059160	+7 495 9697389	\N	Mo-Su 17:00-24:00	5	\N	t	node	4170034989	\N
229	Гетнатун	\N	\N	55.7546430	37.6065160	+7 495 9337127	http://www.getnatoun.ru/	Mo-Fr 11:00-22:00; Sa 12:00-21:00	5	\N	t	node	6693512579	\N
230	Моя рьяnaya babyшка леmиm v cinгапур	\N	\N	55.7566110	37.6059120	\N	\N	\N	5	\N	t	node	9851586948	\N
231	Нах	\N	\N	55.7591210	37.6108440	\N	\N	\N	5	\N	t	node	10691274552	\N
232	Гадкий койот	\N	\N	55.7623070	37.6129230	+7 495 9957150	http://www.coyoteugly.ru	Mo-Su 19:00-06:00; Fr,Sa 18:00-06:00	5	\N	t	node	2330001851	\N
233	Kosmoхомяк	\N	\N	55.7654160	37.6112280	\N	\N	\N	5	\N	t	node	2512540617	\N
234	Под мухой	\N	\N	55.7655460	37.6092820	+7 495 6502779	https://www.facebook.com/podmuhoy	\N	5	\N	t	node	2528507344	\N
235	Let's Rock	улица Кузнецкий Мост, 4	\N	55.7608340	37.6163320	+7 495 6928392	\N	24/7	5	\N	t	node	2559854555	\N
236	Энтузиаст	\N	\N	55.7638500	37.6140860	+7 499 3407852	https://www.facebook.com/enthusiastmoscow	Mo-Su 12:00-23:00	5	\N	t	node	2572609855	\N
237	Эхо	Пушкинская площадь, 2	Караоке клуб	55.7662000	37.6082110	+7 495 9121083	http://www.echo-karaoke.ru	Mo-Su 17:00-06:00	5	\N	t	node	2835536940	\N
238	Все твои друзья	Малый Гнездниковский переулок, 12/27	\N	55.7626780	37.6067980	+7 985 9916610	\N	Mo-Su 12:00-06:00	5	\N	t	node	2977551021	\N
239	Beermarket	\N	\N	55.7650600	37.6085220	+7 905 7414141	\N	Mo,Su 11:00-21:30; Tu-Sa 11:00-23:00	5	\N	t	node	3109151679	\N
240	Craft republic	Малый Гнездниковский переулок, 9 с7	\N	55.7626140	37.6063430	+7 495 6298984;+7 965 1126671	https://craftrepublic.ru	Su-We 12:00-24:00; Th 14:00-02:00; Fr, Sa 14:00-04:00	5	\N	t	node	3183738183	\N
241	Молодость	\N	\N	55.7639390	37.6072400	\N	\N	We-Sa 20:00-24:00	5	\N	t	node	3220029921	\N
242	Хлеб и вино	\N	\N	55.7641170	37.6076760	+7 495 1220044	http://xleb-vino.ru	Mo-Su 11:00-24:00	5	\N	t	node	3689700051	\N
243	Kot шрёdiнгера	\N	\N	55.7653670	37.6112840	+7 968 4592210	https://www.kotbar.ru	Tu 18:00-24:00; We-Sa 00:00-02:00,18:00-24:00; Su 00:00-02:00	5	\N	t	node	3860850317	\N
244	Neon Monkey	\N	\N	55.7654690	37.6113750	+7 966 1351063	\N	Tu-Fr 18:00-24:00; Sa 00:00-03:00,18:00-24:00; Su 00:00-03:00	5	\N	t	node	4937003309	\N
245	Вода	\N	\N	55.7647640	37.6157970	+7 495 2814670	\N	Mo 00:00-01:00; Th 18:00-24:00; Fr 00:00-01:00,18:00-24:00; Sa,Su 00:00-03:00,18:00-24:00	5	\N	t	node	5124241207	\N
246	Дневник	\N	\N	55.7633530	37.6140900	\N	http://dnevnik.bar/	Mo-Fr 12:00-24:00; Sa,Su 00:00-03:00,12:00-24:00	5	\N	t	node	5177028398	\N
247	Север	\N	\N	55.7648250	37.6085550	\N	\N	Mo-Su 11:00-24:00	5	\N	t	node	5630658588	\N
248	Beer & Fries	\N	\N	55.7651570	37.6081480	\N	\N	Mo-Su 12:00-24:00	5	\N	t	node	6253712922	\N
249	StandUp Store	\N	\N	55.7655390	37.6158090	+7 977 5071900	https://standupstore.ru/	Mo-Su 18:00-24:00	5	\N	t	node	6274827873	\N
250	Журавли	\N	\N	55.7629110	37.6155650	+7 926 6741021	\N	Mo-Th 18:00-23:45; Fr 18:00-24:00; Sa,Su 00:00-03:00,18:00-24:00	5	\N	t	node	6426593650	\N
251	Ровесник	\N	\N	55.7623630	37.6059680	+7 968 9018572	\N	Mo-Th,Su 14:00-00:00; Fr-Sa 14:00-06:00	5	\N	t	node	6533864850	\N
252	Sol x Magneto	\N	\N	55.7639050	37.6073410	+7 495 0700013	\N	Mo-Fr 00:00-01:00,12:00-24:00; Sa,Su 00:00-06:00,12:00-24:00	5	\N	t	node	6718177977	\N
253	Door 2310	\N	\N	55.7662740	37.6147840	\N	\N	\N	5	\N	t	node	6959964053	\N
254	Shortlist	\N	\N	55.7655890	37.6161810	+7 929 9105477	\N	Mo-Fr 00:00-01:00,12:00-24:00; Sa,Su 00:00-03:00,12:00-24:00	5	\N	t	node	7002878684	\N
255	Круглый шар	\N	\N	55.7637650	37.6141110	\N	\N	\N	5	\N	t	node	7727342347	\N
256	ToTo	\N	\N	55.7637100	37.6138840	\N	\N	Mo-Su 09:00-23:00	5	\N	t	node	7846871528	\N
257	Новое пространство	\N	\N	55.7668700	37.6113170	\N	\N	Mo-Fr 16:00-24:00; Sa,Su 00:00-02:00,16:00-24:00	5	\N	t	node	8818387699	\N
258	BaD SeM	\N	\N	55.7648540	37.6156990	\N	\N	Th,Fr 15:00-24:00; Sa,Su 00:00-03:00,15:00-24:00	5	\N	t	node	8883948738	\N
259	Tverskoy	\N	\N	55.7640310	37.6074620	\N	https://tverskoybar.ru/	Mo-Th 12:00-24:00; Fr 17:00-24:00; Sa 00:00-06:00,17:00-24:00; Su 00:00-06:00,12:00-24:00	5	\N	t	node	9272767915	\N
260	Fest Bar	\N	\N	55.7650050	37.6083360	+7 499 3908685	https://fest.bar/	Fr-Sa 12:00-05:00; Mo-Th,Su 12:00-24:00	5	\N	t	node	9315524913	\N
261	Piri-piri	\N	\N	55.7662720	37.6151530	\N	\N	\N	5	\N	t	node	9535137456	\N
262	On The Rocks	\N	\N	55.7660440	37.6078360	\N	\N	\N	5	\N	t	node	11291523423	\N
263	Perfumist	\N	\N	55.7633420	37.6151110	\N	\N	We,Th 17:00-24:00; Fr 18:00-24:00; Sa 00:00-03:00,18:00-24:00; Su 00:00-03:00,17:00-24:00	5	\N	t	node	11360292834	\N
264	Под ведьмачьим мечом	Камергерский переулок, 5/7	\N	55.7605120	37.6147500	\N	\N	\N	5	\N	t	node	12278348554	\N
265	Нить	\N	\N	55.7656670	37.6107180	\N	\N	\N	5	\N	t	node	12755520643	\N
266	Lobo Loco	\N	\N	55.7654460	37.6111930	\N	\N	\N	5	\N	t	node	12803115730	\N
267	Легендар	\N	\N	55.7673800	37.6065900	\N	https://legendar.moscow	\N	5	\N	t	node	1696214669	\N
268	Винный базар	Петровский бульвар, 15 с1	\N	55.7682090	37.6159610	+7 495 6991860	http://vinniybazar.ru	13:00-01:00	5	\N	t	node	4731801418	\N
269	Black Hat	\N	\N	55.7730130	37.6108290	+7 965 3051514	\N	Mo-Su 12:00-24:00	5	\N	t	node	5607126656	\N
270	Практика	\N	\N	55.7677430	37.6065220	+7 926 0096565	http://darvingroup.com/praktika	Mo-Fr 12:00-24:00; Sa,Su 00:00-02:00,12:00-24:00	5	\N	t	node	5630658593	\N
271	Винил и вино	\N	\N	55.7727450	37.6096870	\N	https://vinyl.wine	Mo-Fr 11:00-24:00; Sa,Su 00:00-05:00,11:00-24:00	5	\N	t	node	6898004644	\N
272	Jawsspot	\N	\N	55.7673070	37.6073430	+7 903 5667878	\N	\N	5	\N	t	node	7299186132	\N
273	Тебураси	\N	\N	55.7676390	37.6079190	+7 969 1254000	\N	Mo-Fr 16:00-24:00; Sa,Su 00:00-02:00,16:00-24:00	5	\N	t	node	7702262566	\N
274	Brodo	\N	\N	55.7678560	37.6144800	+7 926 4100180	\N	Mo-Su 12:00-24:00	5	\N	t	node	7995085880	\N
275	Фальстарт	\N	\N	55.7673580	37.6074270	\N	\N	Mo-Fr 00:00-03:00,18:00-24:00; Sa,Su 00:00-05:00,18:00-24:00	5	\N	t	node	8898052501	\N
276	Marie Laveau	\N	\N	55.7680870	37.6141270	\N	\N	Mo 00:00-01:00; We 15:00-24:00; Th,Fr 00:00-01:00,15:00-24:00; Sa,Su 00:00-03:00,15:00-24:00	5	\N	t	node	9505492638	\N
277	Перепел	\N	\N	55.7729170	37.6095140	+7 965 1801118	\N	Mo-Th 12:00-24:00; Fr 12:00-06:00; Sa 15:00-06:00; Su 15:00-24:00	5	\N	t	node	9589806868	\N
278	Правда?	\N	\N	55.7730780	37.6131160	+7 915 0372636	https://pravdamsk.ru	\N	5	\N	t	node	12003166105	\N
279	Жига Дрыга	\N	\N	55.7328500	37.6271230	+7 495 9510940	http://www.drigabar.ru	Su-We 11:00-24:00; Th-Sa 11:00-06:00	5	\N	t	node	3573306105	\N
280	Кнорозов	\N	\N	55.7329990	37.6277110	\N	\N	Mo-Su 00:00-02:00,18:00-24:00	5	\N	t	node	8599923384	\N
281	Singer	\N	\N	55.7345360	37.6272020	+7 495 1819522	https://singer.bar/	Mo-Su 18:00-06:00	5	\N	t	node	8635426734	\N
282	Nebar	\N	\N	55.7324350	37.6268340	\N	https://moscow.nebar.ru/	\N	5	\N	t	node	9066995602	\N
283	Море пива	\N	\N	55.7385900	37.6268140	\N	\N	\N	5	\N	t	node	10807769307	\N
284	Концерт	\N	\N	55.7443370	37.6274790	+7 495 9594418	\N	\N	5	\N	t	node	2582449803	\N
285	Хон Гиль Дон	\N	\N	55.7443560	37.6270320	+7 985 4866454	\N	Mo-Fr 00:00-01:00,13:00-24:00; Sa,Su 00:00-06:00,13:00-24:00	5	\N	t	node	3326292138	\N
286	Mitzva Bar	\N	\N	55.7455550	37.6271370	+7 495 5324224	https://mitzva.bar/	Mo-Th 18:00-03:00; Fr 15:00-05:00; Sa 15:00-05:00; Su 15:00-03:00	5	\N	t	node	3522041789	\N
287	Parka	Пятницкая улица, 22	\N	55.7414410	37.6283860	+7 926 1606313	https://barparka.ru	Mo-Su 12:00-06:00	5	\N	t	node	4027973845	\N
288	Моряк и чайка	\N	\N	55.7414540	37.6287330	+7 966 1277763	https://морякичайка.рф	24/7	5	\N	t	node	4271549718	\N
289	Prscco	Пятницкая улица, 24	\N	55.7413620	37.6283840	+7 915 3060931	https://prscco.com	Su-Th 12:00-03:00, Fr,Sa 12:00-06:00	5	\N	t	node	5642207625	\N
290	Кабинет психолога	\N	\N	55.7403000	37.6280570	+7 925 8824871	\N	Mo-Th 14:00-23:45; Fr 12:00-24:00; Sa 00:00-05:00,12:00-24:00; Su 00:00-05:00,14:00-23:45	5	\N	t	node	6709761076	\N
291	Lure	\N	\N	55.7454910	37.6265560	+7 967 0118811	https://lureoysterbar.ru	Mo-Su 12:00-24:00	5	\N	t	node	8747432552	\N
292	Salden’s Taphouse	Пятницкая улица, 3/4 с1	\N	55.7455230	37.6270230	+7 965 142-23-33	https://www.saldenstaphouse.ru/pyatnickaya	Mo-Th,Su 12:00-24:00; Fr-Sa 12:00-02:00	5	\N	t	node	8818387698	\N
293	Машенька и негрони	\N	\N	55.7452810	37.6267310	\N	\N	Mo 00:00-05:00; Tu 17:00-24:00; We-Su 00:00-05:00,17:00-24:00	5	\N	t	node	8950580001	\N
294	Шашлычная	\N	\N	55.7425310	37.6282600	\N	\N	\N	5	\N	t	node	11208741900	\N
295	Cider 11-13	\N	\N	55.7455510	37.6265080	\N	\N	\N	5	\N	t	node	11360292829	\N
296	Бухта	\N	\N	55.7416210	37.6253920	\N	\N	We,Th 18:00-23:45; Fr 18:00-24:00; Sa 00:00-01:00,18:00-24:00; Su 00:00-01:00,18:00-23:45	5	\N	t	node	12170719210	\N
297	Брюзга	\N	\N	55.7427570	37.6282150	\N	\N	\N	5	\N	t	node	12292422347	\N
298	Lobby	\N	\N	55.7526440	37.6260990	\N	https://lobby.moscow	Mo-Su 12:00-22:00; Th-Sa 12:00-24:00	5	\N	t	node	7723860123	\N
299	Mandarin Combustible	\N	\N	55.7583730	37.6259440	+7 495 7450700	https://www.facebook.com/MandarinCombustible	Mo-Su 12:00-06:00	5	\N	t	node	2461848987	\N
300	Ciderella	\N	\N	55.7569530	37.6219420	+7 495 6984225	\N	24/7	5	\N	t	node	2793797961	\N
301	Papa's	\N	\N	55.7581720	37.6248080	+7 495 7559554	http://papas.ru	24/7	5	\N	t	node	2794581619	\N
302	Разведка	\N	\N	55.7579950	37.6274120	+7 499 8257700	http://razvedka.bar/	Su-Th 12:00-24:00, Fr,Sa 12:00-04:00	5	\N	t	node	3034464785	\N
303	Спица	Никольская улица, 25	\N	55.7592410	37.6250450	+7 985 3392757	\N	Mo-Su 12:00-24:00	5	\N	t	node	4557354215	\N
304	Контрразведка	\N	\N	55.7580450	37.6273530	+7 495 2803501	https://kontrazvedka.bar/	Su-Th 12:00-24:00, Fr,Sa 12:00-05:00	5	\N	t	node	7012442294	\N
305	Барка	\N	\N	55.7542430	37.6261940	\N	\N	\N	5	\N	t	node	7332260278	\N
306	Двойная жизнь Вероники	\N	\N	55.7579250	37.6263510	\N	\N	Mo-Th 14:00-24:00, Fr,Sa 14:00-04:00; Su off	5	\N	t	node	8974935717	\N
307	Bali Bar	\N	\N	55.7591850	37.6248450	\N	\N	\N	5	\N	t	node	10557552981	\N
308	Шаляпин	\N	\N	55.7587520	37.6214420	\N	\N	\N	5	\N	t	node	11308443518	\N
309	Клава	\N	\N	55.7641160	37.6174810	+7 495 6268563	\N	Mo-Su 17:00-06:00	5	\N	t	node	2084476715	\N
310	My Big Love	\N	\N	55.7651670	37.6216080	+7 999 9888888	https://mybiglove.ru	Mo-Su 12:00-24:00	5	\N	t	node	2737112891	\N
311	Зеленая собака	\N	\N	55.7616770	37.6170890	\N	https://www.zelenaya-sobaka.ru/	Tu-Fr 18:00-24:00; Sa,Su 00:00-06:00,18:00-24:00	5	\N	t	node	3578172170	\N
312	Наука и жизнь	\N	\N	55.7608610	37.6230700	\N	\N	Su-Th 15:00-03:00, Fr,Sa 15:00-06:00	5	\N	t	node	3958305620	\N
313	Настоишная	\N	\N	55.7616360	37.6237270	\N	https://nastoishnaya.ru/	\N	5	\N	t	node	4856123022	\N
314	Teddy Bar	\N	\N	55.7601900	37.6244840	\N	\N	\N	5	\N	t	node	5607341659	\N
315	Meow	\N	\N	55.7625620	37.6257810	\N	http://meowbar.ru/	Mo-Fr 17:00-04:00; Sa-Su 12:00-04:00	5	\N	t	node	6236743385	\N
316	Do Not Disturb	\N	\N	55.7641250	37.6176880	+7 916 4888955	\N	Tu-Fr 18:00-24:00; Sa 00:00-03:00,18:00-24:00; Su 00:00-03:00	5	\N	t	node	7040344938	\N
317	Антикварный	\N	\N	55.7646500	37.6218260	+7 925 1212255	\N	Mo-Su 13:00-23:00	5	\N	t	node	8261786220	\N
318	MO	\N	\N	55.7641520	37.6182210	\N	https://www.instagram.com/barmo.moscow/	Mo-Fr 12:00-24:00; Sa,Su 00:00-05:00,12:00-24:00	5	\N	t	node	8926435295	\N
319	Мальчики&Девочки	\N	\N	55.7609010	37.6225560	\N	\N	\N	5	\N	t	node	9885958896	\N
320	Собаки в тумане	\N	\N	55.7670880	37.6199930	+7 (915) 066-16-90	https://www.stereopeoplegroup.ru/dogsinthefog20	\N	5	\N	t	node	9993649697	\N
321	Стендап клуб на Трубной	\N	\N	55.7662770	37.6262090	\N	https://standupclub.ru/	\N	5	\N	t	node	10577662266	\N
322	Шесть-you-Шесть	\N	\N	55.7670960	37.6198850	+7 495 1396627	http://ryumochnaya.ru/	17:00-05:00	5	\N	t	node	11362855390	\N
323	Свобода-2	\N	\N	55.7620280	37.6238890	\N	https://svoboda-2.ru/	Mo-Fr 00:00-01:00,16:00-24:00; Sa,Su 00:00-02:00,16:00-24:00	5	\N	t	node	11401774630	\N
324	Моряк и чайка	\N	\N	55.7620110	37.6230880	+7 966 1277763	https://морякичайка.рф	24/7	5	\N	t	node	12600046592	\N
325	Billie	\N	\N	55.7665870	37.6206190	\N	https://billie.moscow/	\N	5	\N	t	node	13058069115	\N
326	Mendeleev	\N	\N	55.7641490	37.6176280	\N	https://mendeleev.bar	\N	5	\N	t	node	13227581567	\N
327	Петров и Васечка	\N	\N	55.7710230	37.6223630	+7 968 7707770	\N	Mo-Th 18:00-24:00; Fr 18:00-03:00; Sa 15:00-03:00; Su 15:00-24:00	5	\N	t	node	3408621604	\N
328	Голова	\N	\N	55.7693650	37.6249730	+7 916 5134069	\N	Th 18:00-24:00; Fr 00:00-01:00,18:00-24:00; Sa 00:00-04:00,18:00-24:00; Su 00:00-04:00	5	\N	t	node	4275640335	\N
329	Úность	\N	\N	55.7692840	37.6205210	\N	https://unostmsk.ru/	Mo-Fr 12:00-24:00; Sa,Su 00:00-06:00,12:00-24:00	5	\N	t	node	4883893475	\N
330	Варка	\N	\N	55.7692540	37.6207510	+7 966 1415111	\N	18:00-05:00	5	\N	t	node	5642207215	\N
331	Цирк	\N	\N	55.7721630	37.6194160	+7 916 3054945	\N	Mo-Fr 12:00-24:00; Sa,Su 00:00-01:00,12:00-24:00	5	\N	t	node	6593150006	\N
332	Кабинет 3.14	\N	\N	55.7718140	37.6258000	\N	\N	Th 20:00-24:00; Fr,Sa 00:00-03:00,20:00-24:00; Su 00:00-03:00	5	\N	t	node	6918453213	\N
333	El borracho	\N	\N	55.7693650	37.6247470	\N	\N	Mo-Th,Su 14:00-24:00; Fr-Sa 14:00-02:00	5	\N	t	node	7133530132	\N
334	Коктейльная	\N	\N	55.7730720	37.6200730	+7 964 5070033	\N	Mo-Fr 12:00-24:00; Sa-Su 15:00-24:00	5	\N	t	node	8281977380	\N
335	Камин	\N	\N	55.7729320	37.6288030	+7 916 7184476	\N	Mo 00:00-02:00; We 20:00-24:00; Th-Su 00:00-02:00,20:00-24:00	5	\N	t	node	10004787240	\N
336	Практика	\N	\N	55.7732350	37.6186610	\N	http://darvingroup.com/praktika	\N	5	\N	t	node	10557552946	\N
337	Spichki	\N	\N	55.7692540	37.6206600	\N	\N	\N	5	\N	t	node	11425792260	\N
338	Right Hops	\N	\N	55.7712230	37.6204630	\N	\N	\N	5	\N	t	node	12883288234	\N
339	Берег	\N	\N	55.7710760	37.6204640	\N	\N	\N	5	\N	t	node	12883288239	\N
340	Elsewhere	\N	\N	55.7731700	37.6195950	\N	\N	\N	5	\N	t	node	13031259474	\N
341	Шашлычная	\N	\N	55.7323030	37.6353940	\N	\N	\N	5	\N	t	node	9354087756	\N
342	Супердом	\N	\N	55.7355070	37.6323380	\N	\N	\N	5	\N	t	node	11470173749	\N
343	Дорогая, я перезвоню...	Пятницкий переулок, 2	\N	55.7434890	37.6298240	+7 926 9286725	http://www.darlingbars.ru	Mo-Th 17:00-24:00, Fr,Sa 17:00-05:00, Su 17:00-24:00	5	\N	t	node	1394760548	\N
344	Underdog	\N	\N	55.7403050	37.6303690	+7 926 0135434	\N	Mo-Su 12:00-24:00	5	\N	t	node	3917239406	\N
345	Oh my David	\N	\N	55.7425020	37.6313680	\N	\N	\N	5	\N	t	node	6743808180	\N
346	Южная рюмочная	\N	\N	55.7424510	37.6314770	+7 909 1667742	\N	Mo-Th 00:00-02:00,16:00-24:00; Fr 00:00-02:00,14:00-24:00; Sa 00:00-04:00,14:00-24:00; Su 00:00-04:00,16:00-24:00	5	\N	t	node	7332260280	\N
1388	Golden mile	\N	\N	55.7369250	37.6003780	\N	\N	\N	15	\N	t	node	5323864089	\N
347	Курорт	\N	\N	55.7406720	37.6290520	+7 915 2432431	https://restoran.cafe/moskva/restaurants/kurort-na-piatnitskoi	Fr-Sa 12:00-05:00; Mo-Th,Su 12:00-00:00	5	\N	t	node	9096907518	\N
348	Настоечная на Кузне	\N	\N	55.7426120	37.6297280	+7 980 1518374	http://nastoechnay.ru	Mo 12:00-24:00; Tu-Sa 00:00-02:00,12:00-24:00; Su 00:00-02:00,14:00-24:00	5	\N	t	node	10059318938	\N
349	Буду поздно	\N	\N	55.7449520	37.6310140	+7 (955) 899-59-75	\N	We-Th 16:00-23:00; Fr-Sa 16:00-03:00	5	\N	t	node	10548686709	\N
350	Пороселло	\N	\N	55.7545570	37.6347410	+7 495 6235969	\N	Mo-Th 08:00-24:00, Fr 08:00-02:00, Sa 10:00-02:00, Su 10:00-24:00	5	\N	t	node	2173107290	\N
351	Китайский летчик Джао Да	\N	\N	55.7548270	37.6345190	+7 495 6245611	http://www.jao-da.ru/	Mo-Su 12:00-06:00	5	\N	t	node	2173107291	\N
352	Bourbon Street	\N	\N	55.7586980	37.6326260	+7 495 9676792	http://www.bourbonstreet.ru	24/7	5	\N	t	node	2174859929	\N
353	Lumberjack	\N	\N	55.7563150	37.6352080	+7 967 0610006	https://www.facebook.com/lumberjackbarmoscow	Su-Th 15:00-24:00, Fr,Sa 15:00-03:00	5	\N	t	node	2432685770	\N
354	We Cidreria	\N	\N	55.7562470	37.6329420	+7 999 8059874	http://we-cidreria.ru/	Mo-Th,Su 12:00-24:00; Fr-Sa 12:00-02:00	5	\N	t	node	2511414925	\N
355	Jimmy Poy	\N	\N	55.7564680	37.6325320	+7 495 6241003	http://www.jimmypoy.ru	\N	5	\N	t	node	2891289180	\N
356	Liberty	\N	\N	55.7531270	37.6351080	+7 495 7846868	http://clubliberty.ru	24/7	5	\N	t	node	3239524995	\N
357	1929	\N	\N	55.7532730	37.6348060	+7 495 7846828	http://bar1929.ru	\N	5	\N	t	node	3239524997	\N
358	10 by Ten	\N	\N	55.7579010	37.6368450	+7 926 000 28 80	\N	Mo-Fr 12:00-24:00; Sa,Su 00:00-05:00,12:00-24:00	5	\N	t	node	3314146979	\N
359	Лора Крафт	\N	\N	55.7586960	37.6389420	+7 929 6815878	\N	Mo-Su 09:00-23:00; Fr,Sa 09:00-24:00	5	\N	t	node	3844250923	\N
360	Штольня	улица Солянка, 2/6 с1	\N	55.7540710	37.6368610	\N	\N	\N	5	\N	t	node	4298533593	\N
361	Los Bandidos	\N	\N	55.7572760	37.6324450	+7 903 2854004	\N	Mo-Su 16:00-06:00	5	\N	t	node	4450367660	\N
362	KillFish	\N	\N	55.7572800	37.6334440	\N	http://killfish.ru	Mo-Fr 00:00-05:00,12:00-24:00; Sa,Su 00:00-06:00,12:00-24:00	5	\N	t	node	4455268825	\N
363	Sporco	Большой Спасоглинищевский переулок, 9/1 с10	\N	55.7550160	37.6371110	+7 985 9729496;+7 499 3905288	https://sporco.pizza/	Su-Th 13:00-24:00; Fr, Sa 13:00-01:00	5	\N	t	node	5143746670	\N
364	Veladora	\N	\N	55.7582470	37.6400410	+7 495 3578548	\N	Mo-Th 00:00-02:00,18:00-24:00; Fr-Su 00:00-05:00,18:00-24:00	5	\N	t	node	5249589168	\N
365	Metafora	\N	\N	55.7575940	37.6358750	+7 926 0746190	http://metafora.bar/	Su-Th 18:00-03:00; Fr-Sa 18:00-05:00	5	\N	t	node	5625448023	\N
366	Megobari	\N	\N	55.7578100	37.6363900	+7 964 7004007	http://megobari.wine/	Mo-Su 11:00-24:00	5	\N	t	node	5628777516	\N
367	Bambule	\N	\N	55.7544060	37.6377510	+7 926 6538805	http://bambule.ru	Fr-Sa 08:00-06:00; Mo-Th,Su 08:00-24:00	5	\N	t	node	5678235238	\N
368	Дело не в вине	\N	\N	55.7579790	37.6363250	+7 915 043 86 17	https://delonevvine.ru/	Mo-Fr 15:00-24:00; Sa,Su 00:00-02:00,15:00-24:00	5	\N	t	node	6168057559	\N
369	Колбаса	\N	\N	55.7544000	37.6371810	+7 977 7418979	http://bar-kolbasa.ru/	Mo-Fr 12:00-24:00; Sa 00:00-05:00,12:00-24:00; Su 00:00-05:00,14:00-24:00	5	\N	t	node	6372216285	\N
370	Рюмочная мечты	\N	\N	55.7549520	37.6372450	+7 925 0699956	\N	Mo-Th 16:00-00:00; Fr-Sa 16:00-03:00; Su 16:00-00:00	5	\N	t	node	6375839796	\N
371	Beer Happens Junior	\N	\N	55.7546010	37.6347060	+7 495 2202357	\N	Su-Th 12:00-24:00; Fr-Sa 00:00-02:00	5	\N	t	node	6611639018	\N
372	Michelada	\N	\N	55.7572640	37.6341820	+7 495 0980485	\N	Mo-Th 12:00-24:00, Fr 12:00-02:00, Sa 10:00-02:00, Su 10:00-24:00	5	\N	t	node	6680039787	\N
373	Слоны и мамонты	\N	\N	55.7582230	37.6363570	+7 925 8724954	http://slonymamonti.ru/	Mo-Fr 12:00-24:00; Sa 00:00-04:00,12:00-24:00; Su 00:00-02:00,12:00-24:00	5	\N	t	node	7126208979	\N
374	Bad Crown	\N	\N	55.7544660	37.6373440	\N	\N	Th-Su 17:00-24:00	5	\N	t	node	7254671586	\N
375	Вова's бар	\N	\N	55.7574600	37.6369200	\N	\N	\N	5	\N	t	node	7647049835	\N
376	Настоишная	\N	\N	55.7556490	37.6335760	\N	https://nastoishnaya.ru/	Mo-Th 12:00-24:00, Fr 12:00-05:00, Sa 16:00-05:00, Su 16:00-24:00	5	\N	t	node	8052435131	\N
377	Земля, прощай!	\N	\N	55.7579320	37.6369900	\N	https://avia-bar.club/	\N	5	\N	t	node	8261680881	\N
378	Моряк и чайка	\N	\N	55.7574900	37.6340100	+7 966 1277764	https://морякичайка.рф/maroseyka	24/7	5	\N	t	node	9169909263	\N
379	Zionist	\N	\N	55.7577740	37.6392040	+7 495 2666740	https://zionist-bar.ru	Mo-Su 14:00-02:00	5	\N	t	node	9315524906	\N
380	Really	\N	\N	55.7585620	37.6341570	\N	\N	\N	5	\N	t	node	9416530668	\N
381	Hop Gun	\N	\N	55.7569400	37.6346790	\N	\N	Mo-Fr 12:00-24:00; Sa,Su 00:00-03:00,12:00-24:00	5	\N	t	node	9670197407	\N
382	Silеncio	\N	\N	55.7539780	37.6382820	\N	\N	\N	5	\N	t	node	9839056221	\N
383	Пестики-тычинки	Большой Спасоглинищевский переулок, 3 с5	\N	55.7564330	37.6352420	\N	\N	Mo-Th 14:00-24:00; Fr 14:00-02:00; Sa 15:00-02:00; Su 15:00-24:00	5	\N	t	node	9846673102	\N
384	Botafogo	\N	\N	55.7544400	37.6379400	\N	\N	Th 19:00-24:00; Fr,Sa 00:00-03:00,19:00-24:00; Su 00:00-03:00	5	\N	t	node	9851586971	\N
385	Pub Lo Picasso	\N	\N	55.7531810	37.6337000	\N	\N	\N	5	\N	t	node	9969318122	\N
386	Beer&Art	\N	\N	55.7537260	37.6383420	\N	\N	\N	5	\N	t	node	9991531595	\N
387	Тайная комната	\N	\N	55.7544340	37.6380250	\N	\N	\N	5	\N	t	node	9991531596	\N
388	Chow-Chow	\N	\N	55.7546660	37.6378410	\N	\N	Mo-Su 12:00-24:00	5	\N	t	node	9993649699	\N
389	Станция Маросейка	\N	\N	55.7574910	37.6366070	\N	https://stantsiya.bar/	\N	5	\N	t	node	10691274553	\N
390	Ginstitute	\N	\N	55.7543170	37.6378020	+7 495 3638109	\N	Su, We-Th 16:20-00:00; Fr-Sa 16:20-03:00	5	\N	t	node	10922175025	\N
391	Tabi	\N	\N	55.7543850	37.6379690	\N	\N	Mo-Fr 18:00-24:00; Sa,Su 00:00-02:00,18:00-24:00	5	\N	t	node	10998416518	\N
392	Было - не было	\N	\N	55.7580720	37.6347960	\N	\N	\N	5	\N	t	node	11015821649	\N
393	Коза	\N	\N	55.7587950	37.6294290	\N	https://kozabar.ru/	\N	5	\N	t	node	11098015363	\N
394	Модники	\N	\N	55.7578440	37.6348300	\N	\N	We-Fr 18:00-24:00; Sa,Su 00:00-03:00,18:00-24:00	5	\N	t	node	11258399320	\N
395	Уе!бар	\N	\N	55.7574550	37.6339750	\N	https://yebar.ru/	\N	5	\N	t	node	11358722125	\N
396	Grafa	\N	\N	55.7560960	37.6350480	+7 995 5009693	https://www.winegrafa.ru/	Mo-Su 12:00-24:00	5	\N	t	node	11470173753	\N
397	Hanky 3/7	\N	\N	55.7587870	37.6402160	\N	\N	\N	5	\N	t	node	12259515513	\N
398	The Line	\N	\N	55.7572210	37.6338000	\N	\N	\N	5	\N	t	node	12292422346	\N
399	Белая Стрекоза	\N	\N	55.7578700	37.6363300	\N	http://belaya-strekoza-karaoke.ru/maroseika	\N	5	\N	t	node	12507761919	\N
400	Культурно Коротко	\N	\N	55.7539170	37.6361530	\N	\N	\N	5	\N	t	node	12507761920	\N
402	Ночные ведьмы	\N	\N	55.7584300	37.6390290	\N	\N	\N	5	\N	t	node	13002684537	\N
403	Salden's Taphouse	Мясницкая улица, 32/1 с1	\N	55.7655740	37.6389760	+7 967 142-23-33	https://www.saldenstaphouse.ru/taphousemyasnickaya	Mo-Th,Su 12:00-24:00; Fr-Sa 12:00-02:00	5	\N	t	node	255742645	\N
404	Loft Bar	\N	\N	55.7648280	37.6316130	+7 495 6242838	http://loftbar.ru	\N	5	\N	t	node	1768626669	\N
405	Рок'н'ролл	\N	\N	55.7665140	37.6304030	\N	\N	24/7	5	\N	t	node	2143204166	\N
406	Martinez	\N	\N	55.7666970	37.6307960	+7 495 7608192	http://www.martinezbar.ru	Tu-Th 17:00-02:00; Fr,Sa 17:00-06:00	5	\N	t	node	2143204172	\N
407	Crazy Daisy	\N	\N	55.7657090	37.6356720	+7 495 6413444	http://farrockway.com	Mo-Su 18:00-06:00	5	\N	t	node	2196651535	\N
408	Крапива	\N	\N	55.7614670	37.6407720	+7 495 2264825	http://krapivabar.ru	Mo-Th 12:00-23:00; Fr 12:00-24:00; Sa 12:00-05:00; Su 12:00-05:00	5	\N	t	node	2428194686	\N
409	DeFAQto	\N	\N	55.7661830	37.6314380	+7 495 6244497	http://www.defaqto.ru	Mo-Su 12:00-06:00	5	\N	t	node	2523286146	\N
410	Широкую на Широкую	\N	\N	55.7615100	37.6362350	+7 499 4082827	\N	Mo-Fr 00:00-02:00,11:00-24:00; Sa,Su 00:00-06:00,11:00-24:00	5	\N	t	node	4243489454	\N
411	Делай культуру	\N	\N	55.7651460	37.6317850	+7 926 3661333	\N	Mo-Fr 15:00-24:00; Sa,Su 00:00-02:00,14:00-24:00	5	\N	t	node	5218841573	\N
412	Во сколько начинается аперитив?	\N	\N	55.7615260	37.6360960	+7 499 4991430	\N	Mo-Fr 14:00-24:00; Sa,Su 00:00-02:00,14:00-24:00	5	\N	t	node	6225717514	\N
413	Свобода	\N	\N	55.7625240	37.6374520	+7 964 7869022	https://rumkasvobodi.ru/	Mo-Fr 12:00-24:00; Sa,Su 00:00-04:00,12:00-24:00	5	\N	t	node	6225900477	\N
414	Wine Door	\N	\N	55.7626000	37.6353220	+7 903 7312909	\N	Mo-Su 12:00-24:00	5	\N	t	node	6225900483	\N
415	Рюмка	\N	\N	55.7652450	37.6397640	+7 925 2241060	\N	Mo-Fr 00:00-02:00,14:00-24:00; Sa,Su 00:00-06:00,14:00-24:00	5	\N	t	node	6627660766	\N
416	Сосна и Липа	\N	\N	55.7631570	37.6369050	\N	\N	Mo-Su 17:00-23:00; Sa 15:00-23:00	5	\N	t	node	6700935385	\N
417	Кебар нон-стоп	\N	\N	55.7653040	37.6396210	\N	\N	Mo-Su 11:00-24:00	5	\N	t	node	6743833486	\N
418	Kisski	\N	\N	55.7669550	37.6321430	\N	https://kisskibar.ru	\N	5	\N	t	node	6992646415	\N
419	Испанский стыд	\N	\N	55.7615500	37.6360190	+7 499 4991430	\N	Th-Su 18:00-24:00	5	\N	t	node	7040344927	\N
420	The Nest	\N	\N	55.7669660	37.6324320	+7 916 1586944	\N	Th 20:00-24:00; Fr,Sa 00:00-03:00,20:00-24:00; Su 00:00-03:00	5	\N	t	node	7299186136	\N
421	Зич	\N	\N	55.7628510	37.6357040	\N	\N	\N	5	\N	t	node	7710236399	\N
422	MadWineBar	\N	\N	55.7624750	37.6357910	+7 499 3806303	https://madwinebar.com/	Mo-Fr 12:00-24:00; Sa,Su 15:00-24:00	5	\N	t	node	8644681541	\N
423	Кривоколенный 9с3	\N	\N	55.7629130	37.6378180	\N	\N	Mo-Su 19:00-24:00	5	\N	t	node	9521461096	\N
424	Nebar	\N	\N	55.7619090	37.6333370	\N	https://moscow.nebar.ru/	\N	5	\N	t	node	9885958901	\N
425	Лампопо	\N	\N	55.7663080	37.6307020	\N	\N	Mo-Su 00:00-04:00,12:00-24:00	5	\N	t	node	10582642071	\N
426	Бистро de Torino	\N	\N	55.7608100	37.6320590	\N	https://torinobistro.ru/	Mo-Su 12:00-24:00	5	\N	t	node	10782497911	\N
427	Dream	\N	\N	55.7634350	37.6354020	\N	\N	\N	5	\N	t	node	10796867509	\N
428	Rock'N'Roll Bar & Cafe	улица Сретенка, 1	\N	55.7665910	37.6306740	\N	https://rocknrollbar.ru	\N	5	\N	t	node	11781057377	\N
429	Semenov	\N	\N	55.7639430	37.6290780	\N	\N	\N	5	\N	t	node	12803115722	\N
430	Neighborhood	\N	\N	55.7606160	37.6322050	\N	https://neighborhood-bar.clients.site/	Mo-Su 13:00-24:00	5	\N	t	node	13050910980	\N
431	Fitz	\N	\N	55.7607810	37.6322760	\N	\N	\N	5	\N	t	node	13050910981	\N
432	Номер 15	\N	\N	55.7691470	37.6318550	+7 916 6225096	\N	Mo-Su 12:00-24:00	5	\N	t	node	4786527219	\N
433	PR11	\N	\N	55.7674790	37.6314380	+7 967 0629669	https://pr11.ru/	Mo-Fr 14:00-24:00; Sa,Su 00:00-04:00,14:00-24:00	5	\N	t	node	5552577512	\N
434	Blush	\N	\N	55.7704280	37.6340970	+7 965 1803133	\N	Mo-Su 12:00-24:00	5	\N	t	node	5773618237	\N
435	Шашлычная	\N	\N	55.7716360	37.6325530	\N	\N	Mo-Fr 00:00-03:00,13:00-24:00; Sa,Su 00:00-06:00,13:00-24:00	5	\N	t	node	7853996285	\N
436	Коллеги	\N	\N	55.7698190	37.6328130	\N	\N	\N	5	\N	t	node	7912792239	\N
437	Insider	\N	\N	55.7695160	37.6327590	+7 925 4004070	http://insiderbar.ru/	Th-Sa 19:00-03:00	5	\N	t	node	8375416010	\N
438	Megobari	\N	\N	55.7710810	37.6322630	\N	http://megobari.wine/	\N	5	\N	t	node	9529904717	\N
439	Ликвидация	\N	\N	55.7674170	37.6313900	\N	\N	Mo-Fr 00:00-02:00,12:00-24:00; Sa,Su 00:00-06:00,12:00-24:00	5	\N	t	node	9535137452	\N
440	Jojo	\N	\N	55.7714670	37.6325810	\N	\N	Mo-Th 11:00-23:00; Fr 11:00-24:00; Sa 00:00-03:00,11:00-24:00; Su 00:00-03:00,11:00-23:00	5	\N	t	node	9851586961	\N
441	Butler	\N	\N	55.7699210	37.6326220	\N	https://butler-gr.com/	Mo-Su 00:00-01:30,19:00-24:00	5	\N	t	node	9995076024	\N
442	We Cidreria	\N	\N	55.7712230	37.6326210	+7 925 4298399	http://we-cidreria.ru/	Tu-Th 12:00-24:00; Fr,Sa 12:00-02:00	5	\N	t	node	11433238470	\N
443	City Space Bar	Космодамианская набережная, 52/6	\N	55.7334270	37.6438480	+7 495 2215357	https://www.cityspacebar.com/	\N	5	\N	t	node	3523987249	\N
444	Undr Bar	\N	\N	55.7410630	37.6525860	+7 966 0960806	\N	Mo-Su 12:00-24:00	5	\N	t	node	6221254082	\N
445	Алёша и графин	Верхняя Радищевская улица, 15 c1	\N	55.7434350	37.6520480	+7 968 4284900	\N	Su-Th 12:00-24:00; Fr, Sa 12:00-02:00	5	\N	t	node	7806292240	\N
446	Hardday	\N	\N	55.7445520	37.6493480	\N	\N	\N	5	\N	t	node	8603694018	\N
447	Кузен Самди	\N	\N	55.7413370	37.6527920	\N	\N	Mo-Su 00:00-05:00,17:00-24:00	5	\N	t	node	12170719207	\N
448	Powerhouse Moscow	Гончарная улица, 7/4 с1	\N	55.7457590	37.6462860	+7 495 6980550	https://www.facebook.com/powerhouse.moscow	Mo-Th,Su 17:00-05:00; Fr-Sa 12:00-05:00	5	\N	t	way	151077519	\N
449	ХоБа	\N	\N	55.7496640	37.6472070	\N	http://barhoba.ru/	\N	5	\N	t	node	11207731305	\N
450	Голландский бар	\N	\N	55.7502740	37.6472320	+7 967 0257462	\N	Mo-Su 11:00-23:00	5	\N	t	node	11936659869	\N
451	Орбита	\N	\N	55.7504970	37.6434670	\N	https://orbita.bar	\N	5	\N	t	node	13072230743	\N
452	Голландский бар	\N	\N	55.7496580	37.6470790	\N	\N	\N	5	\N	t	node	13092684359	\N
454	Милк	улица Покровка, 16/16 с1	\N	55.7585920	37.6462570	+7 495 6232594	https://imaginecafe.ru/	\N	5	\N	t	node	677322342	\N
455	Beer Harbour	\N	\N	55.7599220	37.6469350	+7 495 2112861	\N	Mo-Fr 11:00-24:00; Sa 00:00-03:00,13:00-24:00; Su 00:00-03:00,13:00-23:00	5	\N	t	node	2697604895	\N
456	Mono Bar	\N	\N	55.7575180	37.6464230	+7 495 9160247	http://www.monobar.ru	Mo-Su 18:00-06:00	5	\N	t	node	2934288672	\N
457	Зинзивер	Покровский бульвар, 2/14	\N	55.7588160	37.6455300	+7 916 8505959;+7 915 3294822	\N	Mo-Th 14:00-02:00; Fr 14:00-04:00; Sa, Su 12:00-04:00	5	\N	t	node	3336312818	\N
458	Kill Fish	\N	\N	55.7589590	37.6443250	+7 929 5903780	https://killfish.ru/	Fr-Sa 14:00-23:00;Mo-Th,Su 15:00-23:00	5	\N	t	node	3521802831	\N
459	Marion	\N	\N	55.7586710	37.6421780	+7 925 2608292	\N	\N	5	\N	t	node	4676873971	\N
460	Пока никто не видит	\N	\N	55.7598440	37.6451880	+7 926 9623840	\N	Th 20:00-01:00; Fr-Sa 20:00-06:00	5	\N	t	node	4948887076	\N
461	Дом, В Котором	улица Покровка, 14/2 с3	Дом, В Котором / PUB	55.7585710	37.6453770	\N	\N	Su-Th 15:00-24:00, Fr,Sa 15:00-02:00	5	\N	t	node	6845435108	\N
462	I Like Wine	\N	\N	55.7592310	37.6458500	+7 495 9288859	http://ilikewine.ru	Mo-Th 12:00-02:00, Fr 12:00-06:00, Sa 10:00-06:00, Su 10:00-02:00	5	\N	t	node	6985840744	\N
463	Сюр	\N	\N	55.7547390	37.6428020	\N	\N	Mo-Su 11:00-23:00; Fr,Sa 11:00-24:00	5	\N	t	node	7666472019	\N
464	Йорик убил Хамлета	\N	\N	55.7589810	37.6457330	+7 963 716 17 16	\N	Mo-Fr 12:00-23:00; Sa,Su 14:00-23:00	5	\N	t	node	8228715390	\N
465	69 pints	\N	\N	55.7598040	37.6452170	\N	http://69pints.ru/	Mo-Fr 00:00-01:00,14:00-24:00; Sa,Su 00:00-04:00,14:00-24:00	5	\N	t	node	8696831201	\N
466	Клуб	\N	\N	55.7576510	37.6461040	\N	\N	\N	5	\N	t	node	8729061662	\N
467	Alpaca	\N	\N	55.7593950	37.6414410	\N	\N	We-Su 17:00-24:00	5	\N	t	node	9492061629	\N
468	Ясно	\N	\N	55.7547310	37.6429920	\N	\N	\N	5	\N	t	node	9603558845	\N
469	Горнист	\N	\N	55.7539230	37.6416360	\N	\N	\N	5	\N	t	node	9885958892	\N
470	Моряк и чайка	\N	\N	55.7592030	37.6456540	+7 966 1277769	https://морякичайка.рф	24/7	5	\N	t	node	10123955950	\N
471	Винфак	Большой Трёхсвятительский переулок, 2 c1	\N	55.7550700	37.6453960	\N	https://vinfak.ru	\N	5	\N	t	node	10261246208	\N
472	Origami	\N	\N	55.7547210	37.6454880	\N	\N	\N	5	\N	t	node	10261265909	\N
473	Escapist	\N	\N	55.7546870	37.6453350	\N	\N	Mo-Fr 16:00-24:00; Sa,Su 00:00-02:00,16:00-24:00	5	\N	t	node	10782474098	\N
474	8 шаров	\N	\N	55.7547920	37.6429630	\N	\N	\N	5	\N	t	node	10782497922	\N
475	If	\N	\N	55.7547680	37.6453100	\N	\N	\N	5	\N	t	node	11176186689	\N
476	Репей	\N	\N	55.7550200	37.6444070	\N	\N	\N	5	\N	t	node	11262223825	\N
477	Laowai	\N	\N	55.7550130	37.6429300	\N	\N	\N	5	\N	t	node	11425792242	\N
478	Парфюм	\N	\N	55.7586040	37.6460760	\N	\N	\N	5	\N	t	node	11565395380	\N
479	Подкоп	\N	\N	55.7536520	37.6416700	+7 925 8685668	https://barpodkop.ru	Fr-Sa 12:00-02:00; Mo-Th,Su 12:00-00:00	5	\N	t	node	11843797399	\N
480	Бульвар	\N	\N	55.7529320	37.6476490	\N	\N	\N	5	\N	t	node	12042544825	\N
481	Nouge	\N	\N	55.7589780	37.6435800	\N	\N	\N	5	\N	t	node	12292422345	\N
482	Beer&Brut	\N	\N	55.7600700	37.6491980	+7 965 2502626	\N	Mo-Su 10:00-24:00	5	\N	t	node	3400988355	\N
483	ГлавПивМаг	Пятницкий переулок, 2	\N	55.7608440	37.6460850	+7 968 7935647	http://glavpivmag.com	Mo-Su 10:00-05:00	5	\N	t	node	3642902911	\N
484	Beermood	\N	\N	55.7604870	37.6464660	+7 962 3653999	https://www.barbeermood.ru/	Mo-Fr 11:00-24:00; Sa,Su 00:00-02:00,11:00-24:00	5	\N	t	node	4314109437	\N
485	Leda	\N	\N	55.7662590	37.6510830	\N	\N	\N	5	\N	t	node	4659823569	\N
486	Практика	\N	\N	55.7622020	37.6423900	\N	\N	\N	5	\N	t	node	8752581945	\N
487	Лахесис	\N	\N	55.7601370	37.6469350	+7 985 9600860	\N	Mo-Fr 00:00-01:00,18:00-24:00; Sa,Su 00:00-06:00,18:00-24:00	5	\N	t	node	10557552961	\N
488	Шум	\N	\N	55.7691750	37.6463960	\N	\N	\N	5	\N	t	node	820839902	\N
489	Сергеич	\N	\N	55.7695670	37.6495040	+7 962 9545667	https://sergeich.bar/	Mo-Su 12:00-24:00	5	\N	t	node	1533796513	\N
490	Джемо	\N	\N	55.7712620	37.6507890	\N	\N	\N	5	\N	t	node	2940618756	\N
491	Ладно	\N	\N	55.7682310	37.6427250	\N	\N	Mo 00:00-01:00,12:00-24:00; Tu-Th 12:00-24:00; Fr 13:00-24:00; Sa,Su 00:00-01:00,13:00-24:00	5	\N	t	node	7301998882	\N
492	Сама невинность	\N	\N	55.7683390	37.6472000	\N	https://sama-nevinnost.ru/	Mo-Su 13:00-24:00	5	\N	t	node	11265530365	\N
493	Wine Circle	\N	\N	55.7715280	37.6492850	\N	\N	Mo-Su 10:00-22:00	5	\N	t	node	11401774629	\N
494	Летучая мышь	\N	\N	55.7702350	37.6482420	\N	\N	\N	5	\N	t	node	11470173755	\N
495	Мясницкий ряд	\N	\N	55.7681720	37.6457250	\N	https://myasnitskiybar.ru/	\N	5	\N	t	node	12576850821	\N
496	Варка	\N	\N	55.7421160	37.6552840	+7 966 3845404	\N	Mo-We,Su 14:00-24:00; Th 14:00-02:00, Fr-Sa 14:00-04:00	5	\N	t	node	3461857895	\N
497	Косой Маркс	\N	\N	55.7416450	37.6560070	+7 926 3274458	https://instagram.com/kosoimarks	Mo-Su 08:00-24:00	5	\N	t	node	4968768400	\N
498	Method	Товарищеский переулок, 4 с5	\N	55.7416260	37.6597970	+7 903 1632243	http://methodbeer.ru/	Su-Th 14:00-24:00; Fr, Sa 14:00-02:00	5	\N	t	node	5922051385	\N
499	Место встреч	\N	\N	55.7421780	37.6555330	\N	\N	\N	5	\N	t	node	6036620487	\N
500	Craftland	\N	\N	55.7439490	37.6614590	\N	\N	Mo-Th,Su 15:00-23:00; Fr-Sa 15:00-02:00	5	\N	t	node	6593150004	\N
501	Analog	Товарищеский переулок, 4 с5	\N	55.7414680	37.6599790	+7 977 6640402	https://www.facebook.com/analog.moscow	Tu-Th 18:00-00:00; Fr-Sa 18:00-03:00	5	\N	t	node	6845432609	\N
502	Интеллигенция 2.0	\N	\N	55.7437740	37.6616960	+79688171171	\N	Mo-Su 18:00-24:00	5	\N	t	node	8883948736	\N
503	На ковёр	\N	\N	55.7443900	37.6630020	+7 495 8594829	\N	Mo-Tu,Su 17:00-24:00; We-Th 17:00-02:00; Fr-Sa 17:00-04:00	5	\N	t	node	9885958899	\N
504	Брюзга	\N	\N	55.7400720	37.6619290	\N	\N	Mo,Su 00:00-05:00,12:00-24:00; Tu-Sa 12:00-24:00	5	\N	t	node	10717624756	\N
505	Башня дедушки Мерлина	\N	\N	55.7473550	37.6549010	\N	\N	\N	5	\N	t	node	11663276902	\N
506	Symposy	Нижний Сусальный переулок, 5 с4	\N	55.7598050	37.6629720	+7 495 9833590	\N	Mo-Sa 12:00-24:00	5	\N	t	node	4056663674	\N
507	Barrel	\N	\N	55.7559050	37.6646980	+7 495 8032653	\N	Mo-Su 11:00-23:00	5	\N	t	node	5271859475	\N
508	Волковская пивоварня	\N	\N	55.7592230	37.6633110	+7 495 1366311	http://www.wolfsbrewery.ru/	Mo-Fr 12:00-24:00; Sa 00:00-02:00,12:00-24:00; Su 00:00-02:00,12:00-23:00	5	\N	t	node	5642207624	\N
509	Drunk Punk	\N	\N	55.7605500	37.6624710	\N	\N	Mo-Su 00:00-01:00,14:00-24:00	5	\N	t	node	4457908217	\N
510	Kill Fish	\N	\N	55.7615420	37.6631080	+7 926 7272110	https://killfish.ru/	Mo-Su 14:00-05:00	5	\N	t	node	4546201431	\N
511	Крым	\N	\N	55.7628580	37.6538490	\N	\N	\N	5	\N	t	node	5721223059	\N
512	Bigati	\N	\N	55.7637100	37.6574930	+7 977 6742304	\N	Mo-Su 12:00-23:00	5	\N	t	node	6110646951	\N
513	15й шар	\N	\N	55.7624230	37.6608730	\N	\N	\N	5	\N	t	node	7884512741	\N
514	Настоишная	\N	\N	55.7617130	37.6627960	\N	\N	Mo-Th 12:00-24:00, Fr 12:00-05:00, Sa 12:00-05:00, Su 16:00-24:00	5	\N	t	node	9773243473	\N
515	Довлатов	\N	\N	55.7635680	37.6560780	\N	https://dovlatovbar.ru/	Mo-Su 12:00-06:00	5	\N	t	node	10820363343	\N
516	Pims	\N	\N	55.7603780	37.6622270	\N	\N	10:00-22:00	5	\N	t	node	12809254774	\N
517	Коктейльный спортбар	\N	\N	55.7626460	37.6574890	\N	\N	Su-Th 14:00-00:00; Fr-Sa 14:00-01:00	5	\N	t	node	12809930273	\N
518	Каюк-Компания	\N	\N	55.7713100	37.6556340	\N	https://kaukcom.ru	\N	5	\N	t	node	7823119764	\N
519	Chago	\N	\N	55.7699400	37.6599750	\N	\N	\N	5	\N	t	node	12450764508	\N
520	Les	\N	\N	55.7367710	37.5944270	\N	https://www.lescoffee.ru	\N	8	\N	t	node	2929095283	\N
521	Prime	\N	\N	55.7379470	37.5951390	+7 495 6642363	http://www.prime-star.ru/	Mo-Sa 07:30-21:00	8	\N	t	node	4300725890	\N
522	Campus	\N	\N	55.7377500	37.6035980	\N	\N	\N	8	\N	t	node	4764989681	\N
523	Kaffebröd	\N	\N	55.7349320	37.6033040	\N	\N	\N	8	\N	t	node	5097189837	\N
524	Old grinder	\N	\N	55.7379790	37.5929890	\N	\N	Mo-Fr 08:00-21:00; Sa,Su 10:00-20:00	8	\N	t	node	6068450788	\N
525	Conversation	\N	\N	55.7385950	37.5958780	+7 985 3888518	https://friends-forever.ru/conversation-ostozhenka	Mo-Su 08:00-23:00	8	\N	t	node	6757537886	\N
526	Баскин Роббинс	\N	\N	55.7328710	37.6048500	\N	https://baskinrobbins.ru	\N	8	\N	t	node	9418378521	\N
527	The little door	\N	\N	55.7366060	37.6009610	\N	\N	\N	8	\N	t	node	9456022817	\N
528	Vera	\N	\N	55.7375840	37.6028460	\N	\N	\N	8	\N	t	node	9991178556	\N
529	Кулинарная лавка братьев Караваевых	\N	\N	55.7428180	37.6002710	+7 495 6237185	https://www.karavaevi.ru	Mo-Su 08:00-23:00	8	\N	t	node	2423627147	\N
530	MoreКот	улица Остоженка, 3/14	\N	55.7435780	37.6018140	\N	https://morekotocafe.ru/	\N	8	\N	t	node	2815697235	\N
531	Воронеж	\N	\N	55.7445450	37.6009800	+7 495 6950641	http://www.voronej.com	Mo-Su 08:00-24:00	8	\N	t	node	3737537203	\N
532	Хлеб Насущный	\N	\N	55.7436900	37.6016800	+7 495 9661552	https://hlebnasushny.ru/	Mo-Fr 07:00-22:00; Sa, Su 08:00-23:00	8	\N	t	node	4632424964	\N
533	Шоколадница	\N	\N	55.7450360	37.6005370	+7 905 5887487	http://shoko.ru	24/7	8	\N	t	node	5075654023	\N
534	Шоколадница	\N	\N	55.7392700	37.5962810	+7 903 7278182	http://shoko.ru	Mo-Fr 08:00-23:00; Sa-Su 09:00-23:00	8	\N	t	node	6384348096	\N
535	Брусника	\N	кулинария-кондитерская	55.7447910	37.5950890	+7 495 6970489	http://brusnikacafe.ru/	Mo-Su 08:00-23:00	8	\N	t	node	7130832893	\N
536	Niqa	\N	\N	55.7387590	37.5970650	+7 926 6265228	https://niqa.ru/	Mo-Su 10:00-22:00	8	\N	t	node	7197024841	\N
537	Mastersuit	\N	\N	55.7425680	37.5962640	\N	\N	Mo-Su 10:00-22:00	8	\N	t	node	8531885859	\N
538	Surf Coffee	\N	\N	55.7439010	37.6019430	+7 916 4872616	https://www.surfcoffee.ru/	Mo-Fr 08:00-22:00; Sa-Su 10:00-22:00	8	\N	t	node	9338120811	\N
539	Кофейня на Остоженке	\N	\N	55.7418430	37.5989500	\N	https://coffeeostozhenka.clients.site/	\N	8	\N	t	node	12236419981	\N
540	Лицей	\N	\N	55.7397960	37.5962110	\N	\N	\N	8	\N	t	node	13228042084	\N
541	Му-Му	\N	\N	55.7520460	37.5988330	\N	http://www.cafemumu.ru	Mo-Su 09:00-23:00	8	\N	t	node	1352896439	\N
542	Шоколадница	\N	\N	55.7517710	37.5988300	+7 915 4742707	http://shoko.ru	Mo-Su 08:00-23:00	8	\N	t	node	1435552729	\N
543	Шоколадница	\N	\N	55.7499910	37.5936840	+7 985 3162592	http://shoko.ru	Mo-Fr 08:00-23:00; Sa-Su 09:00-23:00	8	\N	t	node	1437398658	\N
544	Шоколадница	\N	\N	55.7525370	37.6035520	+7 915 4921542	http://shoko.ru	24/7	8	\N	t	node	1952538415	\N
545	Карло	\N	\N	55.7507470	37.5958900	\N	\N	\N	8	\N	t	node	2798956269	\N
546	Хлеб Насущный	улица Арбат, 6	\N	55.7516270	37.5974120	+7 495 9849182	https://hlebnasushny.ru/	Fr 07:00-23:00;Mo-Th 07:00-22:00;Sa 08:00-23:00;Su 08:00-22:00	8	\N	t	node	3522044395	\N
547	Кулинарная лавка братьев Караваевых	\N	\N	55.7507880	37.5993450	+7 495 691-29-57	https://www.karavaevi.ru	Mo-Su 08:00-23:00	8	\N	t	node	3574451193	\N
548	Бамбук и капуста	\N	\N	55.7508150	37.5970960	+7 499 3432006	http://www.bambusta.ru	\N	8	\N	t	node	3632408393	\N
549	Буфет № 11	\N	\N	55.7518130	37.6016610	\N	\N	Mo-Fr 09:30-15:00,15:40-17:00	8	\N	t	node	3736091405	\N
550	Cinnabon	улица Арбат, 22/2 с4	2 этажа	55.7500840	37.5931690	+7 499 5798865	https://cinnabonrussia.com/	Mo-Su 10:00-22:00	8	\N	t	node	4299108914	\N
551	Jeffrey's Coffee	\N	\N	55.7496880	37.5943860	+7 495 4113967	http://jeffreyscoffee.ru	Mo-Fr 08:30-23:00; Sa,Su 10:00-23:00	8	\N	t	node	4299108916	\N
552	Даблби	\N	\N	55.7513260	37.5965240	\N	http://double-b.ru	Mo-Fr 08:00-22:00; Sa-Su 10:00-22:00	8	\N	t	node	4464720792	\N
553	Брусника	\N	кулинария-кондитерская	55.7474030	37.5978890	+7 495 6970489	http://brusnikacafe.ru/	Mo-Su 08:00-23:00	8	\N	t	node	4527996490	\N
554	Хинкальная	\N	\N	55.7480450	37.5993560	+7 495 6970966	\N	Mo-Su 11:00-23:00	8	\N	t	node	4551366004	\N
555	Кафе Дель Парко	\N	\N	55.7503750	37.5939240	\N	\N	Mo-Su 08:00-22:00	8	\N	t	node	4713897689	\N
556	Kebab house	улица Арбат, 22/2 с1	\N	55.7500460	37.5930400	+7 929 9960202	\N	Mo-Su 12:00-24:00	8	\N	t	node	4825730521	\N
557	Cats & Coffee	\N	\N	55.7523520	37.5988120	+7 903 7956796	\N	Mo-Su 10:00-21:00	8	\N	t	node	5416334438	\N
558	Грабли	улица Арбат, 1	\N	55.7516820	37.5984530	+7 495 725-58-01	https://grabli.ru/	Fr-Sa 09:00-23:00; Mo-Th,Su 09:00-22:00	8	\N	t	node	5715660596	\N
559	Ки-До	\N	\N	55.7474470	37.5976420	+7 962 9119233	https://kido.ru/	Mo-Su 12:00-24:00	8	\N	t	node	5952157404	\N
560	Cofix	\N	\N	55.7527050	37.5983010	+7 800 3508418	https://cofix.global	Mo-Fr 07:00-22:00; Sa-Su 08:00-22:00	8	\N	t	node	6545995111	\N
561	Surf Coffee	\N	\N	55.7524100	37.5973410	+7 995 3001624	https://www.surfcoffee.ru/	Mo-Fr 08:00-23:00; Sa,Su 10:00-23:00	8	\N	t	node	6545995124	\N
562	PhoBo	\N	\N	55.7512930	37.5972820	\N	https://phobo.cafe	Mo-Su 11:00-23:00	8	\N	t	node	7074571275	\N
563	Гоголь-моголь	\N	\N	55.7472270	37.5990730	\N	\N	Mo-Fr 08:00-23:00; Sa-Su 09:00-23:00	8	\N	t	node	7167325896	\N
564	Альпака и кофе	\N	\N	55.7471250	37.5950200	\N	\N	Mo-Fr 09:00-20:00; Sa,Su 11:00-21:00	8	\N	t	node	7726971085	\N
565	Кофепорт	\N	\N	55.7516770	37.6001100	\N	https://www.coffeeport.ru	Mo-Fr 08:00-19:00; Sa,Su 09:00-21:00	8	\N	t	node	7928680586	\N
566	Жажда вкуса	\N	\N	55.7504410	37.5943650	\N	\N	\N	8	\N	t	node	8569179517	\N
567	Eleven	\N	\N	55.7524620	37.6021250	+7 495 1898828	https://eleven.lucky-group.rest/	Mo-Su 08:00-23:00	8	\N	t	node	8610912648	\N
568	Stars Coffee	\N	\N	55.7522510	37.5949220	+7 495 6440320	https://stars-coffee.ru/	\N	8	\N	t	node	8841944132	\N
569	Pims	\N	\N	55.7524090	37.6017250	\N	https://pimstea.com/	\N	8	\N	t	node	10261265916	\N
570	Cofix	\N	\N	55.7515600	37.5980190	+7 800 3508418	https://cofix.global	Mo-Fr 07:30-22:00; Sa-Su 09:00-22:00	8	\N	t	node	10557552985	\N
571	Север-Метрополь	\N	\N	55.7518550	37.5991620	\N	\N	Mo-Fr 08:00-22:00; Sa,Su 09:00-22:00	8	\N	t	node	10630964696	\N
2357	Romanico	\N	\N	55.7398630	37.6329510	\N	\N	\N	7	\N	t	node	8974834305	\N
572	РомБаба	\N	\N	55.7521780	37.5937670	\N	https://rbbmos.ru/	Mo-Su 08:00-21:00	8	\N	t	node	10717624758	\N
573	A-House x Gt.Coffee	\N	\N	55.7483680	37.5975200	\N	\N	\N	8	\N	t	node	11851428597	\N
574	Московское время	\N	\N	55.7461780	37.6006260	\N	\N	\N	8	\N	t	node	12179179916	\N
575	Кафетериус	\N	\N	55.7572820	37.5949510	+7 495 7787015	http://nikitskaya.cafeterius.ru/	Mo-Fr 08:00-23:00; Sa,Su 10:00-23:00	8	\N	t	node	610282694	\N
576	Breakfast	\N	\N	55.7579100	37.5973730	+7 916 6408636	http://www.friends-forever.ru/	Mo-Su 08:00-23:00	8	\N	t	node	2378986425	\N
577	Скворец	\N	\N	55.7594180	37.5975210	\N	\N	Mo-Fr 09:00-22:00; Sa,Su 10:00-23:00	8	\N	t	node	3501463294	\N
578	Skuratov Coffee	Калашный переулок, 5	\N	55.7551070	37.6014700	+7 926 471-99-45	https://skuratovcoffee.ru	Mo-Su 06:55-23:05	8	\N	t	node	3876413469	\N
579	Шоколадница	\N	\N	55.7571900	37.6016820	+7 925 3643324	https://shoko.ru/	Fr-Sa 08:00-23:00; Mo-Th 08:00-22:00; Su 10:00-22:00	8	\N	t	node	4604812937	\N
580	Newtone	2/3 с3	Кинокафе	55.7548000	37.5977150	+7 495 1321714	http://newtone.me	Mo-Su 00:00-05:00,12:00-24:00	8	\N	t	node	4728996932	\N
581	Conversation	\N	\N	55.7573560	37.5992310	+7 985 4437344	http://www.friends-forever.ru/	Mo-Su 08:00-24:00	8	\N	t	node	4924401913	\N
582	Scrocchiarella	\N	\N	55.7551660	37.6007860	+7 925 7430904	http://scrocchiarella.ru	Mo-Th 09:00-23:00; Fr 09:00-24:00; Sa,Su 10:00-24:00	8	\N	t	node	5506691329	\N
583	Favorite cake	\N	\N	55.7570760	37.5991280	+7 926 3713629	\N	Mo-Su 08:00-22:00	8	\N	t	node	5773235117	\N
584	Granvillano	\N	\N	55.7541230	37.5999310	+7 985 0732969	http://granvillano.ru/	We-Sa 10:00-19:00; Su 10:00-18:00	8	\N	t	node	5983989404	\N
585	ABC coffee roasters	\N	\N	55.7571550	37.6006030	+7 495 2261022	\N	Mo-Su 08:00-22:00	8	\N	t	node	6221254083	\N
586	Naiv	\N	\N	55.7568080	37.5963330	\N	\N	Mo-Su 09:00-21:00	8	\N	t	node	6348232456	\N
587	Laffa Laffa	\N	\N	55.7596060	37.5974000	+7 495 975 55 45	\N	Mo-Su 11:30-23:30	8	\N	t	node	6897918962	\N
588	Rockets	\N	\N	55.7582130	37.5979750	\N	\N	Mo-Su 09:00-23:00	8	\N	t	node	8261786224	\N
589	Niqa	\N	\N	55.7600650	37.6013370	+7 926 2799663	https://niqa.ru/	Mo-Su 09:00-24:00	8	\N	t	node	8951721427	\N
590	Kulek	\N	\N	55.7571460	37.5990760	\N	https://kulekfood.ru	\N	8	\N	t	node	9079512637	\N
591	Dobryakova bakery	\N	\N	55.7560950	37.6025340	+7 926 5919955	\N	Mo-Fr 08:00-20:00; Sa,Su 10:00-21:00	8	\N	t	node	9183991394	\N
592	Левантская хижина	\N	\N	55.7550680	37.6008550	\N	\N	\N	8	\N	t	node	9991531589	\N
593	Николай	\N	\N	55.7566960	37.6039950	\N	http://bar-bufet.ru	\N	8	\N	t	node	10049008320	\N
594	Mos	\N	\N	55.7529940	37.5931440	+7 915 4958999	https://mos-lounge.ru/lounge/noviy-arbat/	Mo-Fr 11:00-05:00; Sa-Su 12:00-05:00	8	\N	t	node	10281368757	\N
595	Хинкали Мишлен	\N	\N	55.7553660	37.6006230	\N	https://hinkalimichelin.tilda.ws	Mo-Su 12:00-24:00	8	\N	t	node	10611572512	\N
596	Moris Brew	\N	\N	55.7589490	37.5981690	\N	\N	\N	8	\N	t	node	10998416514	\N
597	Даблби	\N	\N	55.7567910	37.6032010	\N	https://www.double-b.ru	\N	8	\N	t	node	12576850846	\N
598	Moris Brew	\N	\N	55.7566060	37.5983290	\N	\N	Mo-Fr 07:30-22:00; Sa,Su 08:30-22:00	8	\N	t	node	13002684536	\N
599	Пушкинъ	Тверской бульвар, 26/5	Кондитерская	55.7634110	37.6046700	+7 495 6044280	http://www.cafe-pushkin.ru	Mo-Su 11:00-21:00	8	\N	t	node	623350694	\N
600	Чебуречная СССР	\N	\N	55.7641970	37.6026660	+7 495 6945476	http://chcccp.narod.ru	Mo-Su 08:00-23:00	8	\N	t	node	2357105718	\N
601	Ess-Thetik	\N	\N	55.7623310	37.5955380	+7 495 6911771	http://www.essthetik.ru	Mo-Su 10:00-24:00	8	\N	t	node	2477705649	\N
602	Волшебнутый кофе	\N	\N	55.7654240	37.5974270	\N	\N	Mo-Su 10:00-22:00	8	\N	t	node	2562992861	\N
603	Кулинарная лавка братьев Караваевых	\N	\N	55.7611130	37.6028930	+7 495 629-84-44	https://www.karavaevi.ru	Mo-Su 08:00-23:00	8	\N	t	node	2613521747	\N
604	Шоколадница	\N	\N	55.7659020	37.6027540	+7 985 3699860	http://shoko.ru	Mo-Fr 07:00-23:00; Sa-Su 08:00-23:00	8	\N	t	node	2968661159	\N
605	Coffee Kiss	\N	\N	55.7635930	37.5941760	\N	\N	\N	8	\N	t	node	3048861948	\N
606	David B Café	\N	\N	55.7640120	37.5985110	+7 916 9172773	\N	Mo-Fr 09:00-21:00; Sa-Su 10:00-21:00	8	\N	t	node	3386070839	\N
607	Циники	\N	\N	55.7625650	37.5995870	+7 915 2706701	https://cynicmenu.ru/	Mo-Fr 08:00-23:00; Sa,Su 10:00-23:00	8	\N	t	node	3547086581	\N
608	Cake Me	\N	\N	55.7670190	37.5934700	+7 495 9557629	http://cakemecafe.ru	Mo-Fr 08:00-23:00; Sa,Su 11:00-23:00	8	\N	t	node	4976250665	\N
609	Брусника	\N	кулинария-кондитерская	55.7610480	37.5984520	+7 495 6914507	http://brusnikacafe.ru/	Mo-Su 08:00-23:00	8	\N	t	node	5089267632	\N
610	Brooklyn coffee	\N	\N	55.7610760	37.6030390	\N	\N	Mo-Fr 07:30-20:00; Sa,Su 09:00-19:00	8	\N	t	node	5249589175	\N
611	Новатор	\N	\N	55.7657390	37.5935520	\N	http://novatorcoffee.ru/	\N	8	\N	t	node	6111673114	\N
612	Atelier de tartelettes	\N	\N	55.7627270	37.5957580	+7 495 6914890	\N	Mo-Su 10:00-22:00	8	\N	t	node	6521488967	\N
613	Cofix	\N	\N	55.7643220	37.6028850	+7 800 3508418	https://cofix.global	Mo-Fr 07:30-22:30; Sa 08:30-22:30; Su 09:30-22:30	8	\N	t	node	6803061109	\N
614	Mátes	\N	\N	55.7616640	37.5960160	\N	https://mates-group.ru/	Mo-Fr 08:00-22:00; Sa,Su 10:00-22:00	8	\N	t	node	7395264686	\N
615	Angel Cakes	\N	\N	55.7638070	37.5957000	\N	\N	Mo-Su 08:30-23:00	8	\N	t	node	7912792234	\N
616	Valiko	\N	\N	55.7631440	37.5969080	\N	http://valiko.life/	Mo-Fr 08:00-21:00; Sa,Su 08:00-22:00	8	\N	t	node	8261786221	\N
617	Raw to go	\N	\N	55.7632430	37.5932660	+7 925 0144634	\N	Mo-Su 10:00-22:00	8	\N	t	node	9178567407	\N
618	Kaido	\N	\N	55.7631180	37.5944030	\N	\N	Mo-Su 11:00-23:00	8	\N	t	node	10048956006	\N
619	Momo Art Cafe	\N	\N	55.7647130	37.6014700	\N	\N	\N	8	\N	t	node	11663260568	\N
620	Holder	\N	\N	55.7646950	37.5954630	\N	\N	08:00-21:00	8	\N	t	node	12811752238	\N
621	French Kiss	\N	Магазин шоколада	55.7351310	37.6128100	+7 926 9964414	http://www.frenchkiss.ru/	Mo-Su 09:30-22:30	8	\N	t	node	1140804624	\N
622	Cezve Coffee	\N	\N	55.7341270	37.6054910	\N	https://cezvecoffee.ru/	Mo-Su 10:00-22:00	8	\N	t	node	2468908587	\N
623	Crop	\N	\N	55.7342810	37.6070440	\N	https://crop-coffee.ru/	\N	8	\N	t	node	3727080994	\N
624	Пит Брэд	улица Малая Якиманка, 24	\N	55.7374740	37.6165440	+7 925 4637747	\N	Mo-Fr 08:00-20:00; Sa-Su 11:00-20:00; PH 11:00-19:00	8	\N	t	node	3953754943	\N
625	Cannibal Coffee	\N	\N	55.7363230	37.6144930	\N	\N	Mo-Fr 08:00-21:00; Sa,Su 09:00-21:00	8	\N	t	node	6428738094	\N
626	Flip	\N	\N	55.7361600	37.6133840	\N	\N	Mo-Fr 08:00-21:00; Sa,Su 10:00-21:00	8	\N	t	node	9176377578	\N
627	Даблби	\N	\N	55.7315400	37.6116910	\N	https://www.double-b.ru	Mo-Fr 08:00-21:00; Sa,Su 10:00-21:00	8	\N	t	node	9521850017	\N
628	Бабушка бобра	\N	\N	55.7373300	37.6151670	\N	\N	\N	8	\N	t	node	10998416510	\N
629	Cosmic Latte	\N	\N	55.7333200	37.6100070	\N	\N	Mo-Fr 08:00-21:00; Sa,Su 09:00-21:00	8	\N	t	node	11308443520	\N
630	Surf Coffee	\N	\N	55.7321780	37.6117620	+7 925 4186899	https://www.surfcoffee.ru/	Mo-Fr 08:00-22:00; Sa-Su 09:00-22:00	8	\N	t	node	12281813009	\N
631	Оджахури	\N	\N	55.7352050	37.6128350	+7 915 0581010	https://www.ojakhuri.ru	Mo-Su 11:00-23:00	8	\N	t	node	12581558735	\N
632	Pho City	\N	\N	55.7354140	37.6138580	\N	https://phocity.ru/	\N	8	\N	t	node	13016208873	\N
633	Special	\N	\N	55.7350120	37.6125300	\N	\N	\N	8	\N	t	node	13050910991	\N
634	Caffe'del Parco	\N	\N	55.7379640	37.6086240	\N	\N	\N	8	\N	t	way	261869501	\N
635	Пышка Доната	\N	\N	55.7404920	37.6087310	+7 499 4086993	http://p-donata.ru	Mo-Su 11:00-22:00	8	\N	t	node	2703187722	\N
636	Чихо	\N	\N	55.7411320	37.6095520	+7 495 2353590	https://chiho.ru	Fr 11:00-00:00, Sa 12:00-00:00, Su 12:00-23:00; Mo-Th 11:00-23:00	8	\N	t	node	3302500819	\N
637	Православная трапеза	\N	\N	55.7438990	37.6061740	\N	\N	\N	8	\N	t	node	3727080999	\N
638	Рич Бро	\N	\N	55.7393590	37.6136050	\N	\N	Mo-Fr 08:30-22:00; Su 11:00-21:00; Sa 11:00-24:00+	8	\N	t	node	4144981276	\N
639	311	\N	\N	55.7403780	37.6096860	\N	\N	\N	8	\N	t	node	4437784590	\N
640	Даблби	\N	\N	55.7410920	37.6090350	\N	http://double-b.ru	Mo-Fr 08:30-22:00; Sa,Su 10:00-22:00	8	\N	t	node	5105704322	\N
641	Бургер & фрайс	\N	\N	55.7420460	37.6163160	+7 495 6441701 ext. 19572	https://miratorg.ru/	Mo-Su 10:00-22:00	8	\N	t	node	6267536955	\N
642	PoBratski	\N	\N	55.7399790	37.6091620	\N	\N	\N	8	\N	t	node	8729030217	\N
643	Донер Хауз	\N	\N	55.7403580	37.6098550	\N	\N	\N	8	\N	t	node	8729030317	\N
644	В кустах	\N	\N	55.7412570	37.6097390	\N	\N	\N	8	\N	t	node	8729039018	\N
645	Блэк	\N	\N	55.7396260	37.6117350	\N	\N	\N	8	\N	t	node	8871980519	\N
646	Valiko	\N	\N	55.7424700	37.6115250	\N	\N	\N	8	\N	t	node	9111957194	\N
647	Saga	\N	\N	55.7423390	37.6100480	\N	\N	Mo-Fr 09:00-22:00; Sa,Su 10:00-22:00	8	\N	t	node	9315524911	\N
648	Стейк & Бургер	\N	\N	55.7422720	37.6164870	+7 495 6441701-31282;+7 800 5502719	https://miratorg.ru/burger-n-fries/	Mo-Su 10:00-22:00	8	\N	t	node	9529223837	\N
649	Второй бар	\N	\N	55.7424990	37.6128690	\N	\N	\N	8	\N	t	node	9993649702	\N
650	Кофе и вино	\N	\N	55.7403790	37.6090830	\N	\N	Mo-Fr 09:00-19:00	8	\N	t	node	10123955943	\N
651	Vina Pho	\N	\N	55.7401540	37.6100560	\N	\N	\N	8	\N	t	node	10763832314	\N
652	Остановка	\N	\N	55.7428920	37.6125820	\N	\N	\N	8	\N	t	node	10982726681	\N
653	Даблби	\N	\N	55.7393880	37.6148830	\N	https://www.double-b.ru	\N	8	\N	t	node	11851428600	\N
654	Coffee Point	\N	\N	55.7397200	37.6119620	+7 916 0428191	\N	Fr 08:00-18:00; Mo-Th 08:00-19:00	8	\N	t	node	11889177637	\N
655	Yaffo	\N	\N	55.7388320	37.6105680	\N	\N	\N	8	\N	t	node	12170719205	\N
656	Øliv Pizza	\N	\N	55.7411030	37.6102180	\N	https://oliv-pizza.clients.site/	11:00-23:00	8	\N	t	node	12576850832	\N
657	Пельмени & Пельмени	\N	\N	55.7473110	37.6081920	\N	\N	\N	8	\N	t	node	2733381437	\N
658	Costa Coffee	\N	\N	55.7470040	37.6073360	+7 499 9950216	http://www.costacoffee.ru	Mo-Fr 07:30-23:00; Sa,Su 08:30-23:00	8	\N	t	node	2775416973	\N
659	Старик Хинкалыч	\N	\N	55.7470620	37.6074100	\N	\N	\N	8	\N	t	node	3183738186	\N
660	Волконский	\N	\N	55.7526010	37.6057770	+7 926 3516133	http://wolkonsky.com/	Mo-Fr 08:00-22:00; Sa-Su 09:00-22:00	8	\N	t	node	3628161795	\N
661	Триумф	\N	\N	55.7472830	37.6076930	+7 495 6973123	\N	Mo-Su 09:00-24:00	8	\N	t	node	3953754944	\N
662	Даблби	\N	\N	55.7471200	37.6074750	\N	http://double-b.ru	Mo-Fr 08:00-22:00; Sa-Su 10:00-22:00	8	\N	t	node	3989633676	\N
663	Кулинарная лавка братьев Караваевых	\N	\N	55.7528750	37.6065120	\N	https://www.karavaevi.ru	Mo-Su 08:00-23:00	8	\N	t	node	4935383387	\N
664	Fine	\N	\N	55.7471800	37.6078950	\N	\N	Mo-Fr 09:00-23:00; Sa-Su 10:00-23:00	8	\N	t	node	7299186135	\N
665	Antipa	\N	\N	55.7477680	37.6056220	\N	\N	Mo-Fr 08:00-20:00; Sa,Su 09:00-20:00	8	\N	t	node	7912792233	\N
666	Блюм	\N	\N	55.7533530	37.6050730	\N	\N	\N	8	\N	t	node	3628162397	\N
667	Here'n'now	\N	\N	55.7535230	37.6056620	\N	\N	Mo-Fr 08:00-21:00; Sa,Su 09:00-21:00	8	\N	t	node	4385687866	\N
668	Coffeeport	\N	\N	55.7537300	37.6057470	+7 800 7770218	http://www.coffeeport.ru	Mo-Fr 08:00-18:30; Sa-Su off	8	\N	t	node	4423985177	\N
669	Брусника	\N	кулинария-кондитерская	55.7536270	37.6057050	+7 495 6262231	http://brusnikacafe.ru/	Mo-Su 08:00-23:00	8	\N	t	node	4423985178	\N
670	Аджария	\N	\N	55.7597470	37.6098740	\N	\N	\N	8	\N	t	node	4453628430	\N
671	Foodland	\N	\N	55.7568510	37.6119850	\N	\N	\N	8	\N	t	node	4558120390	\N
672	Surf Coffee	\N	\N	55.7586700	37.6129190	+7 915 1486478	https://www.surfcoffee.ru/	Mo-Fr 08:00-22:00; Sa-Su 10:00-22:00	8	\N	t	node	4724332091	\N
673	Территория мороженого	\N	\N	55.7579940	37.6124810	+7 499 3900572	http://icecream-chl.ru/	Mo-Su 09:00-23:00	8	\N	t	node	4867416682	\N
674	Cofix	\N	\N	55.7554680	37.6140440	+7 800 3508418	https://www.cofix.global	Mo-Su 09:00-22:00	8	\N	t	node	4936299476	\N
675	БуфетЪ Чайковский	\N	\N	55.7571250	37.6052860	\N	https://brizolcafe.ru/	Mo-Su 10:00-23:00	8	\N	t	node	6347418554	\N
676	Мёд и Ревень	\N	\N	55.7549750	37.6061850	+7 495 1369875	\N	Mo-Su 09:00-23:00	8	\N	t	node	6372330047	\N
677	ShakeUp	\N	\N	55.7547850	37.6131780	\N	\N	\N	8	\N	t	node	6555766085	\N
678	Cofix	\N	\N	55.7583110	37.6133630	+7 800 3508418	https://cofix.global	Mo-Fr 08:00-22:00; Sa-Su 10:00-22:00	8	\N	t	node	7442048645	\N
679	Eat&talk	\N	\N	55.7530210	37.6108290	\N	\N	24/7	8	\N	t	node	9983557916	\N
680	Старик Хинкалыч	\N	\N	55.7576680	37.6086190	\N	\N	\N	8	\N	t	node	10816349818	\N
681	A-fitness rest	\N	\N	55.7549600	37.6059060	+7 965 1196311	\N	Mo-Fr 08:00-22:00; Sa-Su 09:00-21:00	8	\N	t	node	11083589891	\N
682	Cofix	\N	\N	55.7555190	37.6147650	+7 800 3508418	https://cofix.global	Mo-Su 10:00-23:00	8	\N	t	node	11185663645	\N
683	Cofix	\N	\N	55.7558420	37.6150820	+7 800 3508418	https://cofix.global	Mo-Su 10:00-22:00	8	\N	t	node	11185663650	\N
684	Layerz	\N	\N	55.7546640	37.6064720	\N	\N	Mo-Su 08:00-22:00	8	\N	t	node	11199323336	\N
685	SIP coffee	Газетный переулок, 3-5 с1	\N	55.7571830	37.6080210	\N	\N	Mo-Fr 08:00-22:00; Sa-Su 10:00-22:00	8	\N	t	node	11228611904	\N
686	Cofix	\N	\N	55.7591800	37.6109260	+7 800 3508418	https://cofix.global	Mo-Fr 08:00-22:00; Sa-Su 10:00-22:00	8	\N	t	node	11279897182	\N
687	Время антракта	\N	\N	55.7579990	37.6119630	\N	\N	Mo-Su 12:00-24:00	8	\N	t	node	11401774626	\N
688	Cafe la Gare	\N	\N	55.7547130	37.6096370	\N	\N	\N	8	\N	t	node	12537227893	\N
689	Манежка.Ru	\N	\N	55.7563800	37.6159350	\N	www.cafe-manejka.ru	\N	8	\N	t	relation	6228004	\N
690	Кофе Хауз	\N	\N	55.7557710	37.6147550	+7 925 6010002;+7 964 5777342	https://coffeehouse.ru	Mo-Su 10:00-22:00	8	\N	t	relation	6228013	\N
691	Чайхана Лаззат	\N	\N	55.7553380	37.6140740	\N	\N	\N	8	\N	t	relation	6228017	\N
692	Дворный Пивик	\N	\N	55.7553720	37.6137340	+7 495 7378366	\N	\N	8	\N	t	relation	6228022	\N
693	Шоколадница	\N	\N	55.7561840	37.6157540	+7 915 3843594	http://shoko.ru	Mo-Su 10:00-22:00	8	\N	t	relation	6228031	\N
694	Tutti Frutti	\N	\N	55.7563040	37.6163350	\N	www.tuttifruttirussia.com	\N	8	\N	t	relation	6228038	\N
695	Даблби	\N	\N	55.7667100	37.6107620	\N	https://www.double-b.ru	Mo-Fr 09:00-22:00; Sa-Su 10:00-22:00	8	\N	t	node	813972077	\N
696	Му-Му	\N	\N	55.7629900	37.6069220	+7 985 1788555	https://www.cafemumu.ru/	Mo-Su 09:00-23:00	8	\N	t	node	1272879662	\N
697	Чайная высота	\N	\N	55.7603650	37.6112870	\N	http://cha108.ru/	Mo-Su 12:00-24:00	8	\N	t	node	2145730005	\N
698	Циферблат	\N	\N	55.7632800	37.6079590	\N	https://pushkin.ziferblat.net/	\N	8	\N	t	node	2355162696	\N
699	Prime	\N	\N	55.7603630	37.6143270	+7 495 6642363	http://www.prime-star.ru/	Mo-Fr 07:00-22:00;Sa-Su 08:00-22:00	8	\N	t	node	2481375927	\N
700	Kulek	\N	\N	55.7602520	37.6146970	\N	https://kulekfood.ru	\N	8	\N	t	node	2512437540	\N
701	Prime	\N	\N	55.7625560	37.6077950	+7 495 6642363	http://www.prime-star.ru/	Mo-Fr 07:00-22:00;Sa-Su 08:00-22:00	8	\N	t	node	2698065720	\N
702	Лепим и варим	Столешников переулок, 9/1	\N	55.7633070	37.6150580	+7 926 4244022	https://lepimivarim.ru	Mo-Su 10:00-22:00	8	\N	t	node	3860850325	\N
703	Coffeeport	\N	\N	55.7617180	37.6052790	+7 800 7770218	http://www.coffeeport.ru	Mo-Fr 08:00-18:30; Sa-Su off	8	\N	t	node	4310202375	\N
704	Burger Heroes	\N	\N	55.7660740	37.6079060	+7 916 4436659	https://burgerheroes.ru	Fr-Sa 11:00-05:30; Mo-Th,Su 11:00-23:45	8	\N	t	node	4598315947	\N
705	Сыто Piano	\N	\N	55.7634320	37.6067660	+7 977 8006081	http://sito-piano.ru/	Mo-Su 00:00-06:00,11:00-24:00	8	\N	t	node	4777794833	\N
706	Хищnик	\N	\N	55.7602650	37.6147970	+7 495 7848239	http://hishnikburgers.net/	Su-Th 11:30-24:00, Fr,Sa 11:30-02:00	8	\N	t	node	5020466778	\N
707	Алёнка	Страстной бульвар, 2	\N	55.7651530	37.6071320	\N	\N	Mo-Su 08:00-22:00	8	\N	t	node	5298221029	\N
708	Patisserie Francois Bodrero	\N	\N	55.7653470	37.6159590	+7 495 1991998	http://bodrero.ru	\N	8	\N	t	node	5765822454	\N
709	Трапезная	\N	\N	55.7669420	37.6157510	\N	\N	Mo-Su 09:00-17:30	8	\N	t	node	5767477253	\N
710	Грамотный Кофе	\N	\N	55.7660100	37.6090930	+7 926 6092120	http://literatecoffee.ru/	Mo-Fr 08:00-22:00; Sa,Su 10:00-22:00	8	\N	t	node	5822202653	\N
711	Jeffrey's Coffee	\N	\N	55.7658600	37.6162110	+7 495 3858711	http://jeffreyscoffee.ru	Mo-Th 08:30-23:00; Fr 08:30-06:00; Sa 10:00-06:00; Su 10:00-23:00	8	\N	t	node	6043511685	\N
712	Салют	\N	вело-кафе	55.7669510	37.6124770	\N	\N	Mo-Su 08:00-23:00	8	\N	t	node	6684323745	\N
713	Jeffreys coffeeshop	\N	\N	55.7656950	37.6096020	+7 968 4018507	https://jeffreys.ru/	Mo-Th 08:00-23:00; Fr 08:00-24:00; Sa 00:00-05:00,09:30-23:00; Su 09:30-23:00	8	\N	t	node	7044063682	\N
714	Nudles	\N	\N	55.7623420	37.6130100	\N	\N	Mo-Su 00:00-06:00,12:00-24:00	8	\N	t	node	7914317414	\N
715	Pizzamento	\N	\N	55.7640700	37.6075550	+7 985 0024545	https://pizzamento.ru	Mo-Su 12:00-24:00	8	\N	t	node	9724414217	\N
716	Surf Coffee	\N	\N	55.7662790	37.6105520	+7 993 3375686	https://www.surfcoffee.ru/	Mo-Fr 08:00-23:00; Sa-Su 10:00-23:00	8	\N	t	node	9854240561	\N
717	Les	\N	\N	55.7671660	37.6139040	+7 926 1775113	https://www.lescoffee.ru	\N	8	\N	t	node	10261265921	\N
718	Кулинарная лавка братьев Караваевых	\N	\N	55.7655390	37.6107060	+7 495 623-71-85	https://www.karavaevi.ru	Mo-Su 08:00-23:00	8	\N	t	node	10820363340	\N
719	Frank by Баста	\N	\N	55.7602130	37.6145840	+7 495 2281808	https://frankmeat.ru/	Fr-Sa 12:00-03:00; Mo-Th,Su 12:00-24:00	8	\N	t	node	11007736109	\N
720	Cyclo	\N	\N	55.7633510	37.6068370	\N	\N	\N	8	\N	t	node	11362399763	\N
721	Синица	\N	\N	55.7627330	37.6054900	\N	\N	\N	8	\N	t	node	11396850094	\N
722	Murph	\N	\N	55.7655890	37.6106480	\N	https://murph.clients.site/	\N	8	\N	t	node	11470176177	\N
723	Kalina	\N	\N	55.7635180	37.6093990	\N	\N	\N	8	\N	t	node	12035920111	\N
724	Чехов A.P.t	\N	\N	55.7611530	37.6058120	+7 985 2684878	https://chexovapt.moscow	Fr-Sa 12:00-23:00; Mo-Th,Su 11:00-21:00	8	\N	t	node	12059265114	\N
725	Jinju	\N	\N	55.7633170	37.6144420	\N	\N	Mo-Su 09:30-20:00	8	\N	t	node	12277383023	\N
726	J'pan	\N	\N	55.7612460	37.6148670	\N	https://jpan.moscow/	Mo-Su 10:00-24:00	8	\N	t	node	12346246238	\N
727	Cheхов A.P. t	\N	\N	55.7612710	37.6057590	+79851324113	https://chexovapt.moscow/	Mo-Su 11:00-21:00; Fr,Sa 11:00-23:00	8	\N	t	node	12429496327	\N
728	Pims	Тверская улица, 15	\N	55.7621800	37.6082440	+7 968 9012876	https://pimstea.com/	Mo-Th 11:00-22:00; Fr-Su 11:00-23:00	8	\N	t	node	12576850831	\N
729	Stars Selected	\N	\N	55.7602590	37.6140220	\N	https://stars-coffee.ru/	\N	8	\N	t	node	12803115718	\N
730	Монастырская кофейня	\N	\N	55.7668640	37.6149290	\N	\N	\N	8	\N	t	node	13173173974	\N
731	Doza	\N	\N	55.7680550	37.6146120	\N	\N	\N	8	\N	t	node	3152358380	\N
732	Crosby Coffee Company	\N	\N	55.7673480	37.6088570	+7 965 1839958	https://crosbycoffee.ru/	Mo-Fr 08:00-18:00	8	\N	t	node	4027973846	\N
733	Клуб чайной культуры	\N	\N	55.7715890	37.6061100	+7 495 6502458	http://www.chaiclub.ru	\N	8	\N	t	node	4888321940	\N
734	Горбуфет Пельменная	\N	\N	55.7673670	37.6061150	+7 916 9637962	\N	Mo-Fr 00:00-02:00,12:00-24:00; Sa,Su 00:00-03:00,12:00-24:00	8	\N	t	node	5089481078	\N
735	Kook	\N	\N	55.7682350	37.6157030	+7 915 1301372	https://kook.taplink.ws	Mo-Su 12:00-24:00	8	\N	t	node	5131137105	\N
736	Заря	\N	\N	55.7681750	37.6148780	\N	https://zaryacoffee.ru/	Mo-Su 08:45-23:00; Sa 10:00-23:00	8	\N	t	node	5938286986	\N
737	Эрмитаж	\N	\N	55.7697770	37.6099590	+7 495 9988639	\N	\N	8	\N	t	node	6863127862	\N
738	Supernova	\N	\N	55.7729850	37.6103740	+7 985 3564626	https://supernovapizza.ru	Mo-Su 12:00-23:00	8	\N	t	node	6918453197	\N
739	Кулинарная лавка братьев Караваевых	\N	\N	55.7694700	37.6052220	+7 495 1217036	https://www.karavaevi.ru	Mo-Su 08:00-23:00	8	\N	t	node	7027167008	\N
740	History	\N	\N	55.7738910	37.6154370	\N	\N	\N	8	\N	t	node	7034470967	\N
741	In the 60's	\N	\N	55.7722300	37.6093900	\N	\N	Mo-Su 10:00-21:00	8	\N	t	node	7259146911	\N
742	МамаМай	\N	\N	55.7723930	37.6059530	\N	https://mamamai.ru/	Mo-Fr 11:00-24:00; Sa,Su 12:00-24:00	8	\N	t	node	7259146915	\N
743	Русалочка суши	\N	\N	55.7675040	37.6077170	\N	\N	Mo-Su 12:00-24:00	8	\N	t	node	8638112139	\N
744	Complex Burger	\N	\N	55.7729790	37.6102780	\N	https://complexburger.ru	10:00-24:00	8	\N	t	node	8855084933	\N
802	Осока	\N	\N	55.7413770	37.6222640	\N	\N	Mo-Su 12:00-22:00	8	\N	t	node	10123955945	\N
745	Чихо	\N	\N	55.7672480	37.6066320	+7 495 2088529	https://chiho.ru	Fr 11:00-24:00; Mo-Th 11:00-23:00; Sa 12:00-24:00; Su 12:00-23:00	8	\N	t	node	9296210796	\N
746	Street pie	\N	\N	55.7683960	37.6070620	\N	\N	\N	8	\N	t	node	9993649698	\N
747	CofeFest	\N	\N	55.7683720	37.6080140	+7 495 2121059;+7 968 0209923	https://cofefest.ru/	Mo-Fr 08:00-20:00; Sa 09:00-17:00	8	\N	t	node	10576689460	\N
748	Переплет	\N	\N	55.7710940	37.6130230	\N	\N	10:00-22:00	8	\N	t	node	11258399304	\N
749	Klubique	\N	\N	55.7727200	37.6102800	\N	\N	\N	8	\N	t	node	12277383025	\N
750	Подъезд	\N	\N	55.7724500	37.6063360	\N	\N	\N	8	\N	t	node	12364795702	\N
751	Мокко	\N	\N	55.7731110	37.6148300	\N	\N	9:00-21:00	8	\N	t	node	12395666301	\N
752	Shedu	\N	\N	55.7730380	37.6114220	\N	\N	\N	8	\N	t	node	12628139701	\N
753	Турецкое кафе	Садовая-Самотёчная улица, 6 с1	\N	55.7730970	37.6137220	\N	\N	08:00-20:00	8	\N	t	node	13159486901	\N
754	1554	улица Каретный Ряд, 3 c16	\N	55.7708690	37.6105300	\N	\N	\N	8	\N	t	relation	6741554	\N
755	Николай	Пятницкая улица, 53	\N	55.7350990	37.6279270	+7 495 9535523	http://bar-bufet.ru	Mo-Su 09:00-23:00	8	\N	t	node	2516300021	\N
756	Шоколадница	\N	\N	55.7371910	37.6188270	+7 985 3104828	http://shoko.ru	Mo 07:00-22:00; Sa 09:00-23:00; Su 09:00-22:00; Tu-Fr 07:00-23:00	8	\N	t	node	3534111752	\N
757	Делюсь душой	\N	\N	55.7352660	37.6279520	+7 903 6138551	\N	Mo-Fr 08:00-22:00; Sa-Su 09:00-22:00	8	\N	t	node	4994512898	\N
758	Кулинарная лавка братьев Караваевых	\N	\N	55.7346690	37.6191960	+7 495 623-71-85	https://www.karavaevi.ru	Mo-Su 08:00-23:00	8	\N	t	node	5041988677	\N
759	Береке	\N	\N	55.7318540	37.6244170	\N	\N	\N	8	\N	t	node	5765863661	\N
760	Yumbaker	\N	\N	55.7322960	37.6267100	\N	https://now.yumbaker.ru/	Mo-Su 08:00-20:00	8	\N	t	node	6354793285	\N
761	Трапезная	\N	\N	55.7384080	37.6241880	\N	\N	Mo-Fr 10:00-18:00; Sa-Su 10:00-17:00	8	\N	t	node	6745952685	\N
762	Эрна	\N	\N	55.7328750	37.6183570	\N	\N	Mo 08:00-19:30; Tu-Fr 08:00-21:00; Sa,Su 09:30-21:00	8	\N	t	node	7197024837	\N
763	Правда Кофе	\N	\N	55.7365760	37.6187810	+7 800 5557862	http://pravda-coffee.ru	\N	8	\N	t	node	7935652917	\N
764	Сиеста	\N	\N	55.7347440	37.6192060	\N	https://siesta-cafe.ru	Mo-Fr 08:00-22:00; Sa,Su 10:00-22:00	8	\N	t	node	7939877374	\N
765	Нитка	\N	\N	55.7356400	37.6240910	+79065373146	https://nitkatea.com	Mo-Su 10:00-21:00	8	\N	t	node	8145999717	\N
766	Аэроплан	\N	\N	55.7326890	37.6274780	\N	https://aeroplan.coffee/	Mo-Su 08:00-20:00	8	\N	t	node	8531885858	\N
767	Nicepricecafe	Пятницкая улица, 54 с2	\N	55.7338800	37.6274200	\N	https://nicepricecafe.ru/	\N	8	\N	t	node	8564051917	\N
768	The Coffee club	\N	\N	55.7381980	37.6246390	\N	\N	Mo-Su 08:00-22:00	8	\N	t	node	8593478647	\N
769	The Waterfront	улица Большая Полянка, 51А/9	\N	55.7319640	37.6206730	\N	\N	Mo-Fr 07:59-21:00; Sa-Su 08:59-21:00	8	\N	t	node	9505492639	\N
770	Bach coffee	\N	\N	55.7341310	37.6274800	\N	\N	Mo-Su 08:00-22:00	8	\N	t	node	10123955940	\N
771	Истанбул	\N	\N	55.7343350	37.6275020	\N	\N	\N	8	\N	t	node	10123955951	\N
772	Волконский	\N	\N	55.7328400	37.6185770	+7 926 3166028	https://wolkonsky.com	Mo-Fr 08:00-21:00; Sa-Su 08:00-20:00	8	\N	t	node	10281347990	\N
773	Грезы	\N	\N	55.7338090	37.6274050	\N	\N	\N	8	\N	t	node	10807769328	\N
774	Формат	\N	\N	55.7371190	37.6258460	\N	\N	\N	8	\N	t	node	11037022044	\N
775	Holi	\N	\N	55.7367160	37.6258400	\N	https://www.holiyoga.ru	Mo-Su 09:00-21:00	8	\N	t	node	11037022046	\N
776	Ra'men	\N	\N	55.7373900	37.6283480	+7 985 2263333;+7 985 9900734	https://ramen.moscow	Mo-Su 12:00-00:00	8	\N	t	node	11304357759	\N
777	Грабли	\N	\N	55.7413230	37.6287260	+7 495 5450830	http://grabli.ru/	Fr-Sa 09:00-23:00; Mo-Th,Su 09:00-22:00	8	\N	t	node	463257309	\N
778	Шоколадница	\N	\N	55.7409520	37.6276450	+7 915 4738165	https://shoko.ru/	Mo-Su 07:30-24:00	8	\N	t	node	893110503	\N
779	Coffee Bean	Пятницкая улица, 5	\N	55.7452040	37.6272490	+7 495 9536726	https://www.coffeebean.ru/	Mo-Sa 08:00-23:00; Su 09:00-22:00	8	\N	t	node	1455775678	\N
780	Штолле	Пятницкая улица, 3/4 с1	\N	55.7454700	37.6270760	+7 495 6444045-16	https://msk.stolle.ru	Mo-Su 08:00-21:00	8	\N	t	node	2516300025	\N
781	Coffeshop Company	\N	\N	55.7409380	37.6224190	\N	\N	24/7	8	\N	t	node	2574236440	\N
782	Сок	\N	\N	55.7415240	37.6214750	+7 495 9537963	https://sokcafe.ru/	Mo-Su 11:00-23:00	8	\N	t	node	2574236452	\N
783	Cofix	\N	\N	55.7440200	37.6276760	+7 800 3508418	https://cofix.global	Mo-Su 07:00-22:00	8	\N	t	node	2582449797	\N
784	Кофе ON	\N	\N	55.7424940	37.6248550	+7 495 9535662	http://www.kofe-on.ru	24/7	8	\N	t	node	2797808840	\N
785	Пеперон	\N	\N	55.7449160	37.6247750	\N	https://peperon.ru/	\N	8	\N	t	node	2973091642	\N
786	Кулинарная лавка братьев Караваевых	\N	\N	55.7446730	37.6248550	+7 495 951-62-04	https://www.karavaevi.ru	Mo-Su 08:00-23:00	8	\N	t	node	2973091643	\N
787	Даблби	\N	\N	55.7409040	37.6228050	\N	https://www.double-b.ru	Mo-Fr 08:00-23:00; Sa,Su 09:00-23:00	8	\N	t	node	3615331574	\N
788	Burger Heroes	\N	\N	55.7416410	37.6252730	+7 967 0911973	https://burgerheroes.ru	Mo-Su 12:00-23:45	8	\N	t	node	3732989639	\N
789	Кофе остров	\N	\N	55.7427460	37.6251890	\N	\N	\N	8	\N	t	node	4754436174	\N
790	Перезвон	\N	\N	55.7448020	37.6271400	\N	\N	Mo-Su 09:00-21:00	8	\N	t	node	4999666352	\N
791	Кофейо	Большой Толмачёвский переулок, 5 с11	\N	55.7403630	37.6207500	+7 968 0304673	\N	Mo-Su 08:00-20:00	8	\N	t	node	6586931506	\N
792	Seadog	\N	\N	55.7445660	37.6248880	\N	\N	Mo-Fr 08:00-22:00; Sa,Su 10:00-22:00	8	\N	t	node	6977323285	\N
793	Hachiko	\N	\N	55.7415350	37.6287290	+7 991 7673534	https://hachikomoscow.ru	24/7	8	\N	t	node	7174769185	\N
794	Волконский	\N	\N	55.7388460	37.6284660	+7 903 1618729	http://wolkonsky.com/	Mo-Fr 07:30-22:00; Sa,Su 08:00-22:00	8	\N	t	node	7191715287	\N
795	Frank by Баста	\N	\N	55.7438410	37.6277860	+7 495 2281808	https://frankmeat.ru/	Fr-Sa 12:00-03:00; Mo-Th,Su 12:00-24:00	8	\N	t	node	8747432550	\N
796	Bread&Meat	\N	\N	55.7450820	37.6268920	\N	https://breadandmeat.ru/	Mo-Fr 12:00-24:00; Sa,Su 00:00-02:00,12:00-24:00	8	\N	t	node	8747432551	\N
797	Булка	\N	\N	55.7406810	37.6228440	+7 495 2307017	http://www.bulkabakery.ru	Mo-Fr 07:30-23:00; Sa,Su 08:30-23:00	8	\N	t	node	8898052504	\N
798	Комедия дель арте	\N	\N	55.7406160	37.6228560	\N	\N	Mo-Su 10:00-23:00	8	\N	t	node	8974834302	\N
799	ABC Coffee Roasters	\N	\N	55.7410670	37.6234310	\N	\N	Mo-Fr 08:00-22:00; Sa-Su 10:00-22:00	8	\N	t	node	9846772767	\N
800	Блин бери	\N	\N	55.7410330	37.6228860	\N	https://блинбери.рф	\N	8	\N	t	node	9911218717	\N
801	Code Coffee	\N	\N	55.7430200	37.6174150	\N	\N	\N	8	\N	t	node	9991531574	\N
803	Чихо	\N	\N	55.7439350	37.6281110	+7 495 2051183	https://chiho.ru	Mo-Th 11:00-23:00, Fr 11:00-24:00, Sa 12:00-24:00, Su 12:00-23:00	8	\N	t	node	10557552980	\N
804	Кулинарная лавка братьев Караваевых	\N	\N	55.7442650	37.6278920	+7 495 623-71-85	https://www.karavaevi.ru	Mo-Su 08:00-23:00	8	\N	t	node	10915726978	\N
805	Пушистая братва	\N	\N	55.7388360	37.6181790	\N	\N	\N	8	\N	t	node	11046337606	\N
806	Moris Brew	\N	\N	55.7420890	37.6251820	\N	\N	\N	8	\N	t	node	11425792238	\N
807	J'pan	\N	\N	55.7446840	37.6272600	+7 919 1390374	https://jpan.moscow/	Mo-Th, Su 10:00-23:00; Sa, Su 10:00-00:00	8	\N	t	node	12064486671	\N
808	Гюго	\N	\N	55.7454800	37.6285290	\N	https://gugocoffee.clients.site/	\N	8	\N	t	node	12364783802	\N
809	Prime	\N	\N	55.7469450	37.6266390	+7 495 6642363	https://www.prime-star.ru	Fr 08:00-17:00;Mo-Th 08:00-19:00	8	\N	t	node	5378834122	\N
810	Coffee Inn	Садовническая улица, 8	\N	55.7476220	37.6276760	\N	https://coinn.ru/	Mo-Su 08:00-22:00	8	\N	t	node	6589574057	\N
811	Blau	\N	\N	55.7470140	37.6278720	+7 985 3693980	\N	Mo-Su 10:00-23:00	8	\N	t	node	7806292229	\N
812	Трапезная	\N	Церковная трапезная с комплексными обедами	55.7525570	37.6275030	\N	\N	Mo-Su 11:00-16:00	8	\N	t	node	11594548899	\N
813	Гастрономический центр Зарядье	\N	\N	55.7503970	37.6285830	+7 495 5310950	https://zaryadyegastrocenter.ru/	Mo-Su 12:00-21:00	8	\N	t	way	513659941	\N
814	Надин	\N	\N	55.7589840	37.6173420	\N	\N	Mo-Fr 09:00-21:00; Sa,Su 10:00-21:00	8	\N	t	node	906872238	\N
815	Фестивальное	\N	\N	55.7544220	37.6228180	\N	\N	\N	8	\N	t	node	1074714681	\N
816	Гурмэ	\N	\N	55.7568790	37.6218490	\N	\N	Mo-Su 08:00-22:00	8	\N	t	node	2793797962	\N
817	Cofix	\N	\N	55.7568130	37.6212520	+7 800 3508418	https://cofix.global	Mo-Fr 08:00-22:00; Sa-Su 09:00-22:00	8	\N	t	node	4086863190	\N
818	Sobranie Cafe	улица Большая Дмитровка, 1	\N	55.7586030	37.6171680	\N	\N	Mo-Fr 08:00-23:00; Sa,Su 09:00-23:00	8	\N	t	node	4428871589	\N
819	Шоколадница	\N	\N	55.7566500	37.6192740	+7 926 5656834	http://shoko.ru	Mo-Fr 10:00-22:00; Sa-Su 10:00-23:00	8	\N	t	node	4924375710	\N
820	Surf Coffee	\N	\N	55.7582140	37.6253140	+7 916 4877278	https://www.surfcoffee.ru/	Mo-Fr 08:00-23:00; Sa,Su 10:00-23:00	8	\N	t	node	6260710741	\N
821	Трапезная	\N	\N	55.7558490	37.6228190	\N	\N	Mo-Su 09:00-22:00	8	\N	t	node	7011710233	\N
822	Breakfast Club	\N	\N	55.7579940	37.6249150	\N	\N	\N	8	\N	t	node	7832285778	\N
823	Prosvet	\N	\N	55.7546360	37.6256040	+7 925 6063659	\N	Mo-Fr 10:00-22:00; Sa-Su 10:30-22:00	8	\N	t	node	7918468685	\N
824	Пушкинъ	\N	Кондитерская	55.7546580	37.6212910	\N	http://www.cafe-pushkin.ru	\N	8	\N	t	node	8971731416	\N
825	Место притяжения	\N	\N	55.7568300	37.6212190	\N	\N	\N	8	\N	t	node	9379347117	\N
826	Каппо Хироки Аракава	\N	\N	55.7572820	37.6171370	\N	https://www.hiroki.ru/	\N	8	\N	t	node	9603558825	\N
827	Surf Coffee	\N	\N	55.7573280	37.6183130	+7 985 1119164	https://www.surfcoffee.ru/	Mo-Fr 08:00-23:00; Sa-Su 10:00-23:00	8	\N	t	node	9854240562	\N
828	Кофеин	Никольская улица, 11-13 с5	\N	55.7570420	37.6220900	+7 909 9459108	https://www.gkvinegret.ru	Fr-Sa 08:00-23:00; Mo-Th,Su 08:00-22:00	8	\N	t	node	9898070638	\N
829	Niqa	\N	\N	55.7599800	37.6241670	\N	\N	\N	8	\N	t	node	10296614910	\N
830	Kurnik	\N	\N	55.7551530	37.6220300	\N	\N	\N	8	\N	t	node	12292422363	\N
831	Prime	Никольская, 25	\N	55.7590770	37.6249790	+7 495 6642363	http://www.prime-star.ru/	Mo-Fr 07:00-22:00; Sa, Su 08:00-22:00	8	\N	t	node	12638805824	\N
832	Met Tea	\N	\N	55.7584830	37.6245560	\N	\N	\N	8	\N	t	node	13192943636	\N
833	Фестивальное 2	\N	\N	55.7550910	37.6210990	\N	\N	10:00-22:00	8	\N	t	node	13192943643	\N
834	Кофеин	\N	\N	55.7560630	37.6204750	\N	\N	\N	8	\N	t	node	13192943648	\N
835	Пивбар 6/9	\N	\N	55.7611540	37.6240420	+7 495 6257833	http://кафекукушка.рф	\N	8	\N	t	node	1111717651	\N
836	Prime	\N	\N	55.7619740	37.6227990	+7 495 6642363	http://www.prime-star.ru/	Mo-Fr 07:00-23:00;Sa-Su 08:00-23:00	8	\N	t	node	2473512081	\N
837	Balanch	\N	\N	55.7619890	37.6268510	\N	https://balanchcafe.ru/	\N	8	\N	t	node	2513308820	\N
838	Шоколадница	\N	\N	55.7621290	37.6223720	+7 925 3447745	http://shoko.ru	24/7	8	\N	t	node	2601648651	\N
839	Сыто Piano	\N	\N	55.7656930	37.6209300	+7 495 6285275	http://sito-piano.ru	Mo-Su 11:00-24:00	8	\N	t	node	2675826163	\N
840	Монастырская выпечка	\N	\N	55.7650330	37.6239160	\N	\N	\N	8	\N	t	node	3587257493	\N
841	Кулинарная лавка братьев Караваевых	\N	\N	55.7648800	37.6202810	\N	https://www.karavaevi.ru	Mo-Su 08:00-23:00	8	\N	t	node	4497027689	\N
842	Грабли	\N	\N	55.7601390	37.6258710	+7 499 2700702	https://grabli.ru	Mo-Su 10:00-22:00	8	\N	t	node	4550925493	\N
843	Surf Coffee	\N	\N	55.7641930	37.6202110	+7 985 3151350	https://www.surfcoffee.ru/	Mo-Fr 08:00-23:00; Sa-Su 10:00-23:00	8	\N	t	node	4566906111	\N
844	Шоколадница	\N	\N	55.7601630	37.6257850	+7 926 9943201	https://shoko.ru/	Mo-Su 10:00-22:00	8	\N	t	node	5720245346	\N
845	Хищник	\N	\N	55.7619250	37.6233400	\N	http://hishnikburgers.net/	Su-Th 11:30-24:00, Fr,Sa 11:30-02:00	8	\N	t	node	6005863539	\N
846	Bistrot & Boutique No. 7	\N	\N	55.7525410	37.6462330	\N	\N	Mo-Su 10:00-23:00	8	\N	t	node	5856250881	\N
847	Волшебная страна Ангария	\N	\N	55.7602320	37.6249070	+7 495 9958500	https://angariakids.cafe/	Mo-Su 10:00-22:00	8	\N	t	node	6178998873	\N
848	Циферблат	\N	\N	55.7620420	37.6259840	+7 962 9646786	https://ziferblat.net/	24/7	8	\N	t	node	6193233301	\N
849	Pinzeria by Bontempi	Рождественский бульвар, 1	\N	55.7667930	37.6242560	+7 495 2017660	https://pinzeria.ru/ru/	Mo-Su 10:00-23:00	8	\N	t	node	6243772485	\N
850	Frank by Баста	\N	\N	55.7611940	37.6233710	+7 495 2281808;+7 925 1579991	https://frankmeat.ru/	Su-Th 12:00-01:00, Fr,Sa 12:00-03:00	8	\N	t	node	6521488968	\N
851	Mac&cheese	\N	\N	55.7603270	37.6248240	\N	\N	\N	8	\N	t	node	6638710185	\N
852	Cofix	\N	\N	55.7616830	37.6237820	+7 800 3508418	https://cofix.global	Mo-Fr 07:00-22:00; Sa-Su 08:00-22:00	8	\N	t	node	7370160403	\N
853	Вареничная №1	улица Рождественка, 5/7	\N	55.7613730	37.6233600	\N	\N	\N	8	\N	t	node	8046498183	\N
854	OMG!Coffee	\N	\N	55.7620190	37.6242010	\N	http://www.omgcoffee.net	Mo-Su 09:00-23:00	8	\N	t	node	8963324744	\N
855	Бублик	\N	\N	55.7619530	37.6226700	\N	\N	Mo-Fr 07:30-22:30; Sa,Su 08:30-22:30	8	\N	t	node	10123955953	\N
856	Cofix	\N	\N	55.7603800	37.6248180	+7 800 3508418	https://cofix.global	Mo-Su 10:00-22:00	8	\N	t	node	11185663649	\N
857	Star Hit	\N	\N	55.7619930	37.6229560	\N	https://starhitcafe.ru/	\N	8	\N	t	node	11362399751	\N
858	Нитка	\N	\N	55.7665720	37.6219990	\N	https://nitkatea.com	\N	8	\N	t	node	11565395372	\N
859	КидБург	\N	\N	55.7603330	37.6252270	+7 968 1936057	https://moscow.cafe.kidburg.ru/	Mo-Su 10:00-22:00	8	\N	t	node	11866008673	\N
860	Flight Coffee	\N	\N	55.7669130	37.6251520	\N	\N	Mo-Fr 09:00-21:00; Sa,Su 10:00-22:00	8	\N	t	node	12173718110	\N
861	Rимляне	\N	\N	55.7652730	37.6205050	\N	\N	\N	8	\N	t	node	12292422344	\N
862	Patisserie Francois Bodrero	\N	\N	55.7610650	37.6233790	+7 495 1991998	http://bodrero.ru	\N	8	\N	t	node	12309870486	\N
863	Чихо	\N	\N	55.7668070	37.6240910	+7 495 2972758	https://chiho.ru	Fr-Sa 10:00-00:00; Mo-Th,Su 10:00-23:00	8	\N	t	node	12497761497	\N
864	Дринкит	\N	\N	55.7650960	37.6203810	\N	\N	\N	8	\N	t	node	13173173972	\N
865	Espresso Bar	\N	\N	55.7664770	37.6234880	\N	https://espressobar.ru/	\N	8	\N	t	node	13188564136	\N
866	Fettucciamo	\N	\N	55.7609190	37.6233780	\N	https://fettucciamo.ru/	Mo-Su 12:00-23:00	8	\N	t	node	13193075869	\N
867	Фаворит	\N	\N	55.7725440	37.6278220	+7 495 2087084	\N	\N	8	\N	t	node	1697882465	\N
868	Шоколадница	\N	\N	55.7708110	37.6206760	+7 985 7797439	http://shoko.ru	24/7	8	\N	t	node	2134693227	\N
869	Пипл & паста	\N	\N	55.7729910	37.6207760	+7 495 6997712	\N	Mo-Sa 11:00-23:00; Su 12:00-23:00	8	\N	t	node	2135437865	\N
870	Кулинарная лавка братьев Караваевых	\N	\N	55.7704570	37.6259820	+7 495 607-16-72	https://www.karavaevi.ru	Mo-Su 08:00-23:00	8	\N	t	node	3188482362	\N
871	Prime	\N	\N	55.7702950	37.6207360	+7 495 6642363;+7 495 6637233	http://www.prime-star.ru	Mo-Fr 07:00-22:00; Sa-Su 08:00-22:00	8	\N	t	node	3338763465	\N
872	Tabera	\N	\N	55.7707100	37.6284930	\N	https://www.tabera.ru/	\N	8	\N	t	node	3598897494	\N
873	Prime	\N	\N	55.7733770	37.6207760	+7 495 6642363;+7 495 6637233	https://www.prime-star.ru	Mo-Fr 07:00-22:00; Sa-Su 08:00-22:00	8	\N	t	node	3998566806	\N
874	Миллениум	\N	\N	55.7685350	37.6245480	\N	\N	Mo-Fr 09:00-22:00	8	\N	t	node	4116009489	\N
875	Black Milk	\N	\N	55.7704800	37.6242630	\N	http://blackmilkcoffee.ru/	Mo-Fr 08:00-23:00; Sa,Su 10:00-23:00	8	\N	t	node	4275640334	\N
876	Пушкарёв	Пушкарёв переулок, 9	\N	55.7689630	37.6274980	+7 495 7374555	https://pushkarev.cafe	Mo-Su 10:00-24:00	8	\N	t	node	4344518803	\N
877	Марс	\N	\N	55.7689070	37.6268970	\N	\N	Mo-Su 12:00-22:00	8	\N	t	node	5403382937	\N
878	J'pan	\N	\N	55.7705160	37.6248250	+7 916 4808558	\N	Mo-Th,Su 11:00-23:00; Fr-Sa 11:00-24:00	8	\N	t	node	5773618236	\N
879	Ra'men	\N	\N	55.7721780	37.6196050	+7 985 2263333;+7 985 5508152	https://ramen.moscow	Fr-Sa 12:00-02:00; Mo-Th,Su 12:00-24:00	8	\N	t	node	6593150007	\N
880	Pho №1	\N	\N	55.7694100	37.6207980	\N	\N	Mo-Th 11:00-22:00; Fr-Su 11:00-23:00	8	\N	t	node	6681612733	\N
881	Бентомания	\N	\N	55.7679610	37.6270210	+7 495 7670709	https://www.bentomania.ru/	Mo-Su 11:00-23:00	8	\N	t	node	7134085655	\N
882	From Berlin	\N	\N	55.7732940	37.6193560	\N	\N	Mo-Su 09:00-23:00; Fr,Sa 09:00-24:00	8	\N	t	node	8179706250	\N
883	Абу Гош	\N	\N	55.7719800	37.6248950	\N	http://abugosh.ru	Mo-Su 09:00-23:00	8	\N	t	node	8821995822	\N
884	Letters	\N	\N	55.7728280	37.6269760	\N	\N	Mo-Su 08:30-21:00	8	\N	t	node	9176377580	\N
885	SeDelice	\N	\N	55.7722960	37.6207820	+7 968 6232884	https://sedelice.ru/	Mo-Fr 07:00-22:00; Sa 08:00-22:00; Su 09:00-21:00	8	\N	t	node	9589806895	\N
886	Stars Coffee	\N	\N	55.7733600	37.6203580	\N	https://stars-coffee.ru/	Mo-Fr 08:00-22:00; Sa-Su 09:00-22:00	8	\N	t	node	11880983269	\N
887	Coffee Point	\N	\N	55.7685440	37.6241610	+7 916 0428191	\N	Fr 08:00-18:00; Mo-Th 08:00-19:00	8	\N	t	node	11889177642	\N
888	Surf Coffee	\N	\N	55.7707000	37.6254840	+7 926 3012626	https://www.surfcoffee.ru	Mo-Fr 08:00-22:00; Sa-Su 10:00-22:00	8	\N	t	node	12059168155	\N
889	Чихо	\N	\N	55.7712970	37.6201190	+7 495 2980895	https://chiho.ru	Mo-Sa 10:00-22:00; Su 11:00-22:00	8	\N	t	node	12497796201	\N
890	Лепим и варим	\N	\N	55.7709980	37.6202150	+7 926 4244022	https://lepimivarim.ru	Mo-Sa 10:00-22:00; Su 11:00-22:00	8	\N	t	node	12600053775	\N
891	Дымов	\N	\N	55.7713000	37.6202330	\N	\N	\N	8	\N	t	node	12883288233	\N
892	Ritmo	\N	\N	55.7712260	37.6203220	\N	\N	\N	8	\N	t	node	12883288235	\N
893	Glukoza	\N	\N	55.7710740	37.6203270	\N	\N	\N	8	\N	t	node	12883288237	\N
894	Кухня Кипра	\N	\N	55.7710000	37.6203300	\N	\N	\N	8	\N	t	node	12883288238	\N
895	Bazaar Kebab	\N	\N	55.7709970	37.6204770	\N	\N	\N	8	\N	t	node	12883288240	\N
896	Pims	\N	\N	55.7712480	37.6206500	\N	https://pimstea.com/	\N	8	\N	t	node	12920901760	\N
897	365 детокс	\N	\N	55.7712100	37.6206520	\N	\N	\N	8	\N	t	node	12920901761	\N
898	Крутые желтки	\N	\N	55.7712990	37.6203720	\N	\N	\N	8	\N	t	node	13132967490	\N
899	Холистик	\N	\N	55.7712270	37.6200510	\N	\N	\N	8	\N	t	node	13132967491	\N
900	HochuPho	\N	\N	55.7712040	37.6199280	\N	\N	\N	8	\N	t	node	13132967492	\N
901	Дни недели	\N	\N	55.7722570	37.6223970	\N	\N	\N	8	\N	t	node	13183780212	\N
902	Воккер	\N	\N	55.7711020	37.6199250	\N	\N	\N	8	\N	t	node	13197423794	\N
903	Satoshi	\N	\N	55.7710350	37.6199280	\N	\N	\N	8	\N	t	node	13197423795	\N
904	Mo	\N	\N	55.7709980	37.6200640	\N	\N	\N	8	\N	t	node	13197423796	\N
905	Raw to go	\N	\N	55.7710650	37.6200630	\N	\N	\N	8	\N	t	node	13197423797	\N
906	Sanur	\N	\N	55.7364320	37.6406000	\N	\N	Mo-Su 07:30-22:00	8	\N	t	node	3476270852	\N
907	Мацони	\N	\N	55.7333560	37.6344610	\N	\N	Mo-Su 11:00-23:00	8	\N	t	node	3548273987	\N
908	Surf Coffee	\N	\N	55.7383490	37.6301640	+7 916 4443823	https://www.surfcoffee.ru/	Mo-Fr 08:00-22:00; Sa-Su 09:00-22:00	8	\N	t	node	4111555690	\N
909	Айва	\N	\N	55.7317330	37.6407360	\N	\N	Mo-Su 08:00-24:00	8	\N	t	node	4478263989	\N
910	Кулинарная лавка братьев Караваевых	\N	\N	55.7378030	37.6350220	+7 495 933-01-70	https://www.karavaevi.ru	Mo-Su 08:00-23:00	8	\N	t	node	4568155389	\N
911	Путь	\N	\N	55.7372930	37.6307840	\N	\N	Mo-Su 09:00-22:00	8	\N	t	node	5022604894	\N
912	Сытый Гусь	\N	\N	55.7349090	37.6400120	\N	\N	Mo-Fr 08:00-19:00	8	\N	t	node	5634903354	\N
913	Bro.we	\N	\N	55.7345750	37.6381980	\N	\N	Mo-Th 08:00-21:00; Fr 08:00-22:00; Sa,Su 09:00-22:00	8	\N	t	node	6524133286	\N
914	Cofix	\N	\N	55.7330620	37.6399680	+7 800 3508418	https://cofix.global	Mo-Fr 07:30-23:00; Sa-Su 09:00-21:00	8	\N	t	node	6937873685	\N
915	Terrapieno	\N	\N	55.7372960	37.6400560	+7 965 3359583	\N	Mo-Su 12:00-22:00	8	\N	t	node	7756869014	\N
916	Шоколадный бункер	\N	\N	55.7344060	37.6302390	\N	\N	\N	8	\N	t	node	7836083003	\N
917	Ska vi Fika?	\N	\N	55.7377090	37.6351920	\N	https://skavifika.ru/	\N	8	\N	t	node	7935652955	\N
918	Cofix	\N	\N	55.7318390	37.6358690	+7 800 3508418	https://cofix.global	Mo-Fr 07:00-22:30; Sa-Su 08:00-22:00	8	\N	t	node	8068588422	\N
919	Иван-Чайное купе	\N	\N	55.7374910	37.6399610	\N	https://ivan-chainoe-kupe.ru/	Mo-Su 10:00-18:00	8	\N	t	node	8397377876	\N
920	Аэроплан	\N	\N	55.7373650	37.6400320	\N	https://aeroplan.coffee/	Mo-Su 08:00-20:00	8	\N	t	node	8599923385	\N
921	Cometodeema	\N	\N	55.7338720	37.6377950	\N	\N	Mo-Fr 09:00-21:00; Sa,Su 10:00-21:00	8	\N	t	node	8615176250	\N
922	Шербет	\N	\N	55.7374640	37.6315270	\N	\N	\N	8	\N	t	node	8750547988	\N
923	Котеешная № 1	\N	Котокафе	55.7363670	37.6314970	\N	\N	\N	8	\N	t	node	8986317894	\N
924	Место огонь	\N	\N	55.7321590	37.6357080	\N	\N	Mo-Su 10:00-23:00	8	\N	t	node	9176377613	\N
925	Так сказала моя мама	\N	\N	55.7373180	37.6407660	\N	\N	\N	8	\N	t	node	9315524903	\N
926	SeDelice	\N	\N	55.7331030	37.6402210	+7 968 6232884	https://sedelice.ru/	\N	8	\N	t	node	9505958741	\N
927	Пловный аул	\N	\N	55.7321790	37.6357850	\N	\N	Mo-Su 10:00-23:00	8	\N	t	node	9692640154	\N
928	Tabera	\N	\N	55.7349600	37.6338650	\N	https://www.tabera.ru/	\N	8	\N	t	node	9735886203	\N
929	ProХинкали	\N	\N	55.7323530	37.6353590	\N	\N	\N	8	\N	t	node	10123955952	\N
930	SeDelice	\N	\N	55.7315010	37.6372430	+7 968 6232884	https://sedelice.ru/	\N	8	\N	t	node	10827624649	\N
931	S-cafe	\N	\N	55.7356160	37.6348430	\N	\N	Mo-Fr 08:00-21:00; Sa-Su 09:00-21:00	8	\N	t	node	12261193601	\N
932	Б. 28	\N	\N	55.7326470	37.6368110	\N	http://b23coffee.tilda.ws/	\N	8	\N	t	node	12509054701	\N
933	Сила Кофе	\N	\N	55.7325160	37.6408090	\N	\N	\N	8	\N	t	node	13241099933	\N
934	Лаферм	\N	\N	55.7395500	37.6304200	\N	\N	\N	8	\N	t	node	1367901766	\N
935	Алоха	\N	\N	55.7430990	37.6300850	\N	\N	\N	8	\N	t	node	1394776516	\N
936	Вай Мэ!	\N	\N	55.7427980	37.6298380	\N	https://www.vaimecafe.com/	Su-Th 10:30-22:30; Fr,Sa 10:30-24:00	8	\N	t	node	2935371999	\N
937	Брусника	\N	кулинария-кондитерская	55.7405100	37.6344730	\N	http://brusnikacafe.ru/	Mo-Fr 09:00-18:00	8	\N	t	node	3156163384	\N
938	Sixties	Большой Овчинниковский переулок, 16	\N	55.7445200	37.6304380	\N	\N	Mo-Su 10:00-23:00	8	\N	t	node	3339601855	\N
939	Шыкыдым	Большой Овчинниковский переулок, 16	\N	55.7445330	37.6299120	\N	\N	Mo-Su 10:00-23:00	8	\N	t	node	3339601856	\N
940	Бистро	\N	\N	55.7435200	37.6296230	\N	\N	Mo-Fr 09:00-20:00; Sa 09:00-19:00	8	\N	t	node	3575458265	\N
941	Prime	Пятницкая улица, 29	\N	55.7408910	37.6289910	+7 495 6642363	http://www.prime-star.ru/	Mo-Fr 07:00-22:00; Sa-Su 08:00-22:00	8	\N	t	node	4047545990	\N
942	Даблби	\N	\N	55.7411130	37.6347990	\N	http://double-b.ru	\N	8	\N	t	node	4313134889	\N
943	Happy people	\N	\N	55.7411400	37.6302970	+7 495 5451152	http://www.anticafe-hp.ru	Mo-Su 12:00-24:00	8	\N	t	node	4983945287	\N
944	Кофеварня	Озерковская набережная, 22/24	Coffee Shop	55.7408180	37.6377480	\N	\N	Mo-Fr 08:30-22:00	8	\N	t	node	5161593995	\N
945	Mosque cafe	Большая Татарская улица, 28 с1	Кафе при мечети	55.7389490	37.6325860	\N	\N	\N	8	\N	t	node	5448137021	\N
946	Coffee Point	\N	\N	55.7400230	37.6359570	+7 916 0428191	\N	Fr 08:00-18:00; Mo-Th 08:00-19:00	8	\N	t	node	5601606385	\N
947	Мустафа Кебаб	\N	\N	55.7399850	37.6328630	+7 495 098 04 39	https://mustafakebab.ru/	Mo-Su 08:00-23:00	8	\N	t	node	6043748901	\N
948	Правда Кофе	Большая Татарская улица, 26	\N	55.7394530	37.6332400	+7 800 5557862	http://pravda-coffee.ru	Mo-Fr 07:30-21:00; Sa-Su 08:00-22:00	8	\N	t	node	6140344472	\N
949	Univer Club	\N	\N	55.7404490	37.6360730	\N	\N	\N	8	\N	t	node	6552978985	\N
950	Cofee & Dreams	\N	\N	55.7431100	37.6388070	\N	\N	\N	8	\N	t	node	6847080185	\N
951	Старик Хинкалыч	\N	\N	55.7431120	37.6298570	\N	\N	Mo-Su 11:00-23:00	8	\N	t	node	7164893979	\N
952	Daily Green	\N	\N	55.7426840	37.6348060	+7 495 7739477	\N	Mo-Fr 09:00-22:00; Sa-Su 10:00-22:00	8	\N	t	node	7248687785	\N
953	Surf Coffee	\N	\N	55.7448090	37.6368780	+7 995 3010369	https://www.surfcoffee.ru/	Mo-Fr 08:00-21:00; Sa,Su 10:00-21:00	8	\N	t	node	7756872933	\N
954	Prime	\N	\N	55.7446620	37.6307570	+7 495 6642363	https://www.prime-star.ru	Mo-Fr 07:30-20:00	8	\N	t	node	7830023206	\N
955	Joja	\N	\N	55.7401330	37.6300180	\N	\N	Mo-Fr 07:30-22:00; Sa,Su 09:00-23:00	8	\N	t	node	8750547989	\N
956	Surf Coffee	\N	\N	55.7431770	37.6300960	+7 915 0830135	https://www.surfcoffee.ru/	Mo-Fr 08:00-22:00; Sa-Su 10:00-22:00	8	\N	t	node	9061985074	\N
957	Cheeseberry	\N	\N	55.7402190	37.6326910	\N	\N	\N	8	\N	t	node	9670163417	\N
958	M&M	\N	\N	55.7403740	37.6325660	\N	\N	Mo-Su 10:00-23:00	8	\N	t	node	9822506817	\N
959	Viki Cake	\N	\N	55.7420920	37.6338110	\N	\N	Mo-Fr 09:00-22:00	8	\N	t	node	9833079281	\N
960	Даблби	\N	\N	55.7444680	37.6336400	\N	https://www.double-b.ru	\N	8	\N	t	node	11258399322	\N
961	Старая Грузия	\N	\N	55.7528060	37.6456200	\N	http://muzaik.ru/	Mo-Su 11:00-23:00	8	\N	t	node	6990965219	\N
962	Дринкит	Новокузнецкая, 4/12с2	\N	55.7392060	37.6296650	\N	https://www.drinkitcoffee.world/ru	Mo-Fr 07:30-21:00; Sa,Su 09:00-21:00	8	\N	t	node	13018831884	\N
963	Шоколадница	\N	\N	55.7573640	37.6316440	+7 985 3104632	http://shoko.ru	24/7	8	\N	t	node	510113927	\N
964	Кулинарная лавка братьев Караваевых	\N	\N	55.7536980	37.6373390	+7 495 6252661	https://www.karavaevi.ru	Mo-Su 08:00-23:00	8	\N	t	node	2184565601	\N
965	Брусника	\N	кулинария-кондитерская	55.7576270	37.6363390	+7 926 0015161	http://brusnikacafe.ru/	Mo-Su 08:00-23:00	8	\N	t	node	2515602413	\N
966	Bubble Mania	\N	\N	55.7576480	37.6366410	\N	http://www.bubblemania.ru	Mo-Su 10:00-23:00	8	\N	t	node	3203085313	\N
967	Patisserie Francois Bodrero	\N	\N	55.7577030	37.6369490	+7 495 1991998	http://bodrero.ru	Mo,Tu 08:00-22:00; We-Fr 08:00-23:00; Sa 10:00-23:00; Su 10:00-22:00	8	\N	t	node	3203118528	\N
968	Farro	\N	\N	55.7584520	37.6393240	+7 495 0980308	http://farropastabar.com/	Mo-Su 11:00-23:00; Fr,Sa 11:00-24:00	8	\N	t	node	3744711926	\N
969	Хинкали Point	\N	\N	55.7546010	37.6376790	+7 495 2239332	http://www.xpointcafe.ru	Mo-Su 10:00-23:00	8	\N	t	node	3775151214	\N
970	Папа Вейдер	Большой Златоустинский переулок, 3/5 с1	\N	55.7592400	37.6324360	+7 929 6291553	http://papavader.ru	\N	8	\N	t	node	4007742108	\N
971	Scrocchiarella	\N	\N	55.7586790	37.6396070	+7 495 2803218	http://scrocchiarella.ru	Mo-Sa 09:00-24:00; Su 10:00-24:00	8	\N	t	node	4071758307	\N
972	Burger Heroes	\N	\N	55.7573560	37.6340360	+7 916 1862286	https://burgerheroes.ru	Mo-Su 12:00-23:45	8	\N	t	node	4598315946	\N
973	Black Milk	\N	\N	55.7566560	37.6393250	\N	http://blackmilkcoffee.ru/	\N	8	\N	t	node	4603721003	\N
974	Магнолия	\N	\N	55.7582000	37.6393000	\N	\N	24/7	8	\N	t	node	4723933852	\N
975	Cofix	\N	\N	55.7540560	37.6367640	+7 800 3508418	https://cofix.global	Mo-Fr 07:30-22:30; Sa-Su 09:00-22:30	8	\N	t	node	5059352927	\N
976	Шоколадница	\N	\N	55.7543650	37.6369070	+7 926 9922487	http://shoko.ru	24/7	8	\N	t	node	5306374535	\N
1034	Lifetime	\N	\N	55.7646000	37.6291460	+7 925 3368128	\N	\N	8	\N	t	node	5907862269	\N
977	Surf Coffee	\N	\N	55.7539950	37.6374710	+7 929 6970816	https://www.surfcoffee.ru/	Mo-Fr 08:00-22:30; Sa,Su 10:00-22:30	8	\N	t	node	5472868921	\N
978	Casa Leone	\N	\N	55.7566380	37.6323650	+7 495 7922202	https://gelatomoscow.ru	Mo-Su 10:00-23:00	8	\N	t	node	5482167830	\N
979	Грабли	\N	\N	55.7537790	37.6378140	+7 495 0250204	https://grabli.ru/	Mo-Su 08:00-23:00	8	\N	t	node	5897135395	\N
980	Котофейня	\N	\N	55.7574640	37.6371620	+7 495 1155238	http://www.catcoffeeshop.ru/	Mo-Su 10:00-20:00	8	\N	t	node	5904932546	\N
981	Кофе Бюро	\N	\N	55.7532860	37.6337260	+7 495 7880608	https://coffeeburo.business.site/	Mo-Fr 08:00-22:00; Sa,Su 10:00-22:00	8	\N	t	node	6111673119	\N
982	Senti Menti	\N	\N	55.7543450	37.6375930	\N	\N	\N	8	\N	t	node	6898919186	\N
983	Джаст'а паста	\N	\N	55.7540340	37.6369100	+7 495 1391935	\N	Mo-Su 12:00-24:00	8	\N	t	node	7041014889	\N
984	Лепим и варим	\N	\N	55.7577280	37.6349970	+7 926 4244022	https://lepimivarim.ru	24/7	8	\N	t	node	7090779770	\N
985	Охотка	\N	\N	55.7575330	37.6366600	+7 915 1174435	http://okhotka.ru/	Mo-Th 11:00-23:00; Fr 11:00-24:00; Sa 12:00-24:00; Su 12:00-23:00	8	\N	t	node	7702262565	\N
986	Coffee Cona	\N	\N	55.7544420	37.6364980	\N	\N	\N	8	\N	t	node	7710236403	\N
987	Skrepka!	\N	\N	55.7588480	37.6397180	\N	\N	Mo-Th,Su 12:00-24:00; Fr-Sa 12:00-01:00	8	\N	t	node	9354087758	\N
988	J'pan	\N	\N	55.7545190	37.6374770	+7 915 1301368	\N	Mo-Su 10:00-23:00	8	\N	t	node	9394367239	\N
989	Vivian's	\N	\N	55.7547090	37.6346170	+7 916 9217744	https://vivianscafe.ru	Fr-Sa 09:00-02:00; Mo-Th,Su 09:00-23:00	8	\N	t	node	9472608317	\N
990	La Virgen	\N	\N	55.7586430	37.6295070	\N	\N	Mo-Fr 13:00-24:00; Sa,Su 00:00-01:00,13:00-24:00	8	\N	t	node	9735886194	\N
991	Siyai	\N	\N	55.7575390	37.6349690	\N	\N	\N	8	\N	t	node	10767176643	\N
992	Smart Coffee lab	\N	\N	55.7580600	37.6361650	\N	https://smartroaster.ru/	Mo-Fr 08:00-23:00; Sa,Su 10:00-23:00	8	\N	t	node	11007120645	\N
993	Nofilters	\N	\N	55.7583850	37.6297350	\N	https://nofilters.ru/	\N	8	\N	t	node	11098015360	\N
994	Пита & Сувлаки	\N	\N	55.7548840	37.6344620	\N	https://pitasuvlaki.moscow/	\N	8	\N	t	node	11258399310	\N
995	Ланч плэйс	\N	\N	55.7594480	37.6374100	+79165809495	\N	Mo-Fr 09:00-17:00	8	\N	t	node	11357651069	\N
996	Лан Ма	\N	\N	55.7586650	37.6402160	\N	https://lan-ma.ru/	11:00-05:00	8	\N	t	node	11387649877	\N
997	Cofix	\N	\N	55.7547470	37.6346290	+7 800 3508418	https://cofix.global	Mo-Fr 07:00-22:00; Sa 08:00-22:00; Su 09:00-21:00	8	\N	t	node	11459483315	\N
998	Bagel	\N	\N	55.7560050	37.6347240	\N	\N	\N	8	\N	t	node	11470173752	\N
999	Rockstar Dogs	\N	\N	55.7540220	37.6383890	\N	\N	\N	8	\N	t	node	11470173754	\N
1000	Чихо	\N	\N	55.7587510	37.6407600	+7 977 5867174	https://chiho.ru	Fr 11:00-24:00; Mo-Th 11:00-23:00; Sa 12:00-24:00; Su 12:00-23:00	8	\N	t	node	11470176176	\N
1001	Самолёт кофе	\N	\N	55.7535880	37.6381250	\N	\N	\N	8	\N	t	node	11799791615	\N
1002	Tea Palace	\N	\N	55.7538930	37.6360480	\N	\N	\N	8	\N	t	node	11851428588	\N
1003	Masa Madre	\N	\N	55.7541340	37.6386720	\N	\N	\N	8	\N	t	node	11932841605	\N
1004	Pims	\N	\N	55.7539830	37.6364560	\N	https://pimstea.com/	\N	8	\N	t	node	12119071454	\N
1005	Met Tea	\N	\N	55.7539490	37.6363000	\N	\N	\N	8	\N	t	node	12119071456	\N
1006	Фо Оань	\N	\N	55.7571870	37.6321940	\N	\N	\N	8	\N	t	node	12292422362	\N
1007	Kulek	\N	\N	55.7585060	37.6395160	\N	https://kulekfood.ru	Mo-Su 12:00-24:00	8	\N	t	node	12302394236	\N
1008	Kokoro	\N	\N	55.7575700	37.6354790	\N	\N	\N	8	\N	t	node	12714360991	\N
1009	Автомойка	\N	\N	55.7574430	37.6397690	\N	\N	\N	8	\N	t	node	12901766397	\N
1010	Кулинарная лавка братьев Караваевых	Милютинский переулок, 19/4 с2	\N	55.7658950	37.6322390	+7 495 628-35-38	https://www.karavaevi.ru	Mo-Su 08:00-23:00	8	\N	t	node	941304673	\N
1011	Шоколадница	\N	\N	55.7634790	37.6359140	+7 985 3104567	https://shoko.ru/	24/7	8	\N	t	node	1849508570	\N
1012	Погребок	\N	\N	55.7617810	37.6341870	\N	\N	\N	8	\N	t	node	1866421306	\N
1013	БлинБери	\N	\N	55.7647340	37.6396850	\N	\N	\N	8	\N	t	node	1902195003	\N
1014	Сандал	\N	\N	55.7668800	37.6327990	\N	\N	\N	8	\N	t	node	2121260246	\N
1015	Surf Coffee	\N	\N	55.7624090	37.6348970	\N	https://www.surfcoffee.ru/	\N	8	\N	t	node	2174859933	\N
1016	Даблби	\N	\N	55.7615430	37.6315640	\N	https://www.double-b.ru	Mo-Fr 08:00-21:00; Sa,Su 10:00-21:00	8	\N	t	node	2330493523	\N
1017	Frank by Баста	\N	\N	55.7628270	37.6351860	+7 495 2281808	https://frankmeat.ru/	Fr-Sa 12:00-02:00; Mo-Th,Su 12:00-24:00	8	\N	t	node	2509793556	\N
1018	Рамен Клаб	\N	\N	55.7608520	37.6324890	+7 926 0485171	http://vk.com/ramen_club	Mo-We 11:00-21:00; Th,Fr 11:00-22:00; Sa 12:00-22:00; Su 12:00-21:00	8	\N	t	node	2615983176	\N
1019	Лубянка	\N	\N	55.7644550	37.6290420	+7 495 6239314	http://www.lubyankacafe.ru	\N	8	\N	t	node	2638346469	\N
1020	Surf Coffee	\N	\N	55.7609870	37.6322740	+7 916 6936764	https://www.surfcoffee.ru/	Mo-Fr 08:00-23:00; Sa,Su 10:00-23:00	8	\N	t	node	2922999455	\N
1021	Волконский	\N	\N	55.7650750	37.6389460	+7 926 9815550;+7 968 5345160	http://wolkonsky.com/	Mo-Fr 07:30-21:00; Sa,Su 10:00-21:00	8	\N	t	node	2956991671	\N
1022	Шоколадница	\N	\N	55.7648140	37.6395080	+7 499 9909631	http://shoko.ru	Mo-Su 08:00-23:00	8	\N	t	node	2956991676	\N
1023	КК 12/10	\N	\N	55.7619110	37.6357840	\N	\N	Mo-Fr 08:00-23:00; Sa,Su 10:00-23:00	8	\N	t	node	3013850340	\N
1024	Экслибрис	\N	\N	55.7649690	37.6342000	+7 495 6255855	http://www.exlibriscafe.ru	Mo-Su 11:00-23:00	8	\N	t	node	3203938830	\N
1025	Убежище	Архангельский переулок, 7 с1	\N	55.7611410	37.6375510	+7 495 2155714	https://timeclub24.ru/vault	24/7	8	\N	t	node	3392676568	\N
1026	Чихо	\N	\N	55.7635530	37.6336690	+7 910 0159865	https://chiho.ru	Fr 11:00-24:00; Mo-Th 11:00-23:00; Sa 12:00-24:00; Su 12:00-23:00	8	\N	t	node	3451035808	\N
1027	Checkpoint	\N	\N	55.7635260	37.6345720	\N	https://www.chpoint.ru	\N	8	\N	t	node	3630754593	\N
1028	Зеленая дверь	\N	\N	55.7655450	37.6320910	\N	\N	24/7	8	\N	t	node	3630806893	\N
1029	Кулинарная лавка братьев Караваевых	\N	\N	55.7612430	37.6326930	+7 495 6217793	https://www.karavaevi.ru	Mo-Su 08:00-23:00	8	\N	t	node	4077015689	\N
1030	Wooden Door	\N	\N	55.7618890	37.6322170	+7 495 7489338	http://wdndoor.com	Mo-Fr 12:00-24:00; Sa,Su 00:00-06:00,12:00-24:00	8	\N	t	node	4220233990	\N
1031	Чайных Дел Мастерская	Армянский переулок, 3-5 с10	\N	55.7609560	37.6355070	+7 926 3953872	https://teaworks.ru/	Mo-Su 12:00-23:00	8	\N	t	node	4269953020	\N
1032	Prime	\N	\N	55.7628200	37.6405030	+7 495 6642363	http://www.prime-star.ru	Mo-Th 08:00-19:00; Fr 08:00-18:00	8	\N	t	node	4575268910	\N
1033	Prime	\N	\N	55.7656230	37.6389620	+7 495 6642363	http://www.prime-star.ru/	Mo-Su 08:00-22:00	8	\N	t	node	5398915512	\N
1035	ABC coffee roasters	\N	\N	55.7613490	37.6315710	\N	http://www.abc-roasters.com/	Mo-Fr 08:00-22:00; Sa,Su 10:00-22:00	8	\N	t	node	6312359299	\N
1036	Несвятые святые	\N	\N	55.7662160	37.6290840	+7 495 3749299	\N	Mo-Su 09:00-20:00	8	\N	t	node	6375839820	\N
1037	Фо Вьет	\N	\N	55.7653690	37.6394600	\N	\N	\N	8	\N	t	node	6627660765	\N
1038	Cofix	\N	\N	55.7651980	37.6386690	+7 800 3508418	https://cofix.global	Mo-Su 08:00-22:00	8	\N	t	node	6795518093	\N
1039	Cofix	\N	\N	55.7632830	37.6352540	+7 800 3508418	https://cofix.global	Mo-Su 08:00-23:00	8	\N	t	node	7054535097	\N
1040	Ладо	\N	\N	55.7628020	37.6374110	+7 495 7848226	\N	Mo-Fr 12:00-24:00; Sa,Su 00:00-02:00,12:00-24:00	8	\N	t	node	7056592929	\N
1041	Burger Heroes	\N	\N	55.7661420	37.6400100	+7 963 6704562	https://burgerheroes.ru	Mo-Fr 12:00-24:00, Sa,Su 13:00-24:00	8	\N	t	node	7095783570	\N
1042	Film.bar	\N	\N	55.7616350	37.6404840	\N	\N	Mo-Su 12:00-21:00	8	\N	t	node	7710236400	\N
1043	Cream Soda	\N	\N	55.7630620	37.6350380	\N	\N	Mo-Fr 08:00-23:00; Sa-Su 09:00-23:00	8	\N	t	node	7806292246	\N
1044	Prime	\N	\N	55.7625120	37.6348790	+7 495 6642363	https://www.prime-star.ru/	Mo-Fr 08:00-22:00; Sa-Su 09:00-22:00	8	\N	t	node	7829967871	\N
1045	Gorilla by Баста	\N	\N	55.7616670	37.6328560	+7 910 0011112	https://gorillabybasta.ru/	Mo-Su 11:30-24:00	8	\N	t	node	7891064792	\N
1046	Fettucciamo	\N	\N	55.7608920	37.6323770	\N	\N	\N	8	\N	t	node	8641687682	\N
1047	Cinnabon	улица Сретенка, 1	\N	55.7665250	37.6311490	\N	https://cinnabonrussia.com	\N	8	\N	t	node	8808563271	\N
1048	J'pan	\N	\N	55.7620080	37.6341480	+7 917 5315508	https://jpan.moscow/	Mo-Th, Su 10:00-23:00; Fr, Sa 10:00-00:00	8	\N	t	node	9315524901	\N
1049	Дядька	\N	\N	55.7656850	37.6323500	\N	\N	Mo-Fr 09:00-22:00; Sa,Su 10:00-22:00	8	\N	t	node	9359328169	\N
1050	Cafe13	\N	\N	55.7628050	37.6331600	\N	https://cafe13.ru/	\N	8	\N	t	node	9416530644	\N
1051	YourCoffeePlace	\N	\N	55.7623480	37.6335840	\N	\N	\N	8	\N	t	node	9838012870	\N
1052	Yumms	\N	\N	55.7613750	37.6363550	\N	\N	Mo-Su 12:00-23:00	8	\N	t	node	9851586950	\N
1053	Cho	\N	\N	55.7620870	37.6336920	\N	\N	Mo-Su 12:00-24:00	8	\N	t	node	9991531581	\N
1054	YCP	\N	\N	55.7631880	37.6334650	\N	\N	Mo-Fr 09:00-22:00; Sa-Su 10:00-22:00	8	\N	t	node	10120583009	\N
1055	So far kebab	\N	\N	55.7621420	37.6337880	\N	\N	Su-Th 11:00-23:00; Fr,Sa 11:00-24:00	8	\N	t	node	10246305966	\N
1056	Skuratov Coffee	\N	\N	55.7622790	37.6340290	\N	https://skuratovcoffee.ru	Mo-Su 06:55-22:05	8	\N	t	node	10557552956	\N
1057	CofeFest	\N	\N	55.7609900	37.6397230	+7 495 2121059;+7 968 0209923	https://cofefest.ru/	Mo-Fr 08:00-17:30	8	\N	t	node	10576689488	\N
1058	Ossu	\N	\N	55.7669700	37.6320030	\N	\N	\N	8	\N	t	node	10691274574	\N
1059	Старик Хинкалыч	\N	\N	55.7617160	37.6329400	\N	\N	\N	8	\N	t	node	10763790391	\N
1060	Ska vi FIKA?	\N	\N	55.7619070	37.6327590	\N	\N	\N	8	\N	t	node	10779210717	\N
1061	Pims	\N	\N	55.7630310	37.6350070	\N	https://pimstea.com/	\N	8	\N	t	node	10855781656	\N
1062	Ra'men	\N	\N	55.7617680	37.6330800	+7 985 2263333;+7 985 2303031	https://ramen.moscow	Mo-Su 12:00-24:00	8	\N	t	node	10855781666	\N
1063	SeDelice	\N	\N	55.7654830	37.6386230	+7 968 6232884	https://sedelice.ru/	\N	8	\N	t	node	11121952757	\N
1064	SeDelice	\N	\N	55.7657610	37.6353030	+7 968 6232884	https://sedelice.ru/	\N	8	\N	t	node	11121952758	\N
1065	Kook	\N	\N	55.7617950	37.6331290	+7 915 0927467	https://kook.taplink.ws	Mo-Su 12:00-00:00	8	\N	t	node	11304357758	\N
1066	Prime	\N	\N	55.7621900	37.6344640	+7 495 6642363	http://www.prime-star.ru/	Mo-Fr 08:00-22:00; Sa,Su 09:00-22:00	8	\N	t	node	11313909034	\N
1067	Здрасьте! Нам по пасте!	\N	\N	55.7608410	37.6302380	\N	\N	Mo-Su 10:00-22:00	8	\N	t	node	11313909044	\N
1068	Stars Coffee	\N	\N	55.7646790	37.6397900	+7 991 5555222	https://stars-coffee.ru/	\N	8	\N	t	node	11425792248	\N
1069	Bimba	\N	\N	55.7620010	37.6335210	\N	\N	\N	8	\N	t	node	11470173759	\N
1070	Дринкит	\N	\N	55.7668020	37.6337930	\N	https://drinkit.ru/	\N	8	\N	t	node	11747666250	\N
1071	Pho City	\N	\N	55.7661350	37.6333530	\N	https://phocity.ru/	\N	8	\N	t	node	11809152316	\N
1072	Кофемания Bez Tarelok	Мясницкая улица, 11	\N	55.7615590	37.6326540	+7 (499) 495 44 29	https://beztarelok.ru/	Mo-Th, Su 09:00-22:00. Fr-St 09:00-23:00	8	\N	t	node	12252249932	\N
1073	Meteorite	\N	\N	55.7622600	37.6354750	\N	https://meteoriteplace.com/	\N	8	\N	t	node	12277383024	\N
1074	Шоколадница	\N	\N	55.7717450	37.6325630	\N	\N	\N	8	\N	t	node	1398513037	\N
1075	Волконский	\N	\N	55.7715210	37.6322480	+7 495 6071980	http://wolkonsky.com/	Mo-Su 07:30-23:00	8	\N	t	node	1814969473	\N
1076	Чебуречная СССР	\N	\N	55.7705590	37.6322430	\N	http://chebureky.ru	\N	8	\N	t	node	4021706828	\N
1077	Натахтари	\N	\N	55.7696870	37.6324010	+7 495 6434323	https://www.cafenatahtari.ru/	Mo-Su 11:00-24:00	8	\N	t	node	4309385689	\N
1078	Эспрессиум	\N	\N	55.7717460	37.6368880	+7 968 3745563	https://www.facebook.com/espressium	Mo-Fr 08:00-22:00; Sa-Su 10:00-22:00	8	\N	t	node	4350554979	\N
1079	Bodrero	\N	\N	55.7676510	37.6314960	+7 495 1991998	\N	Mo-Fr 08:00-22:00; Sa,Su 10:00-22:00	8	\N	t	node	4856123023	\N
1080	LISObon	\N	\N	55.7700250	37.6334450	+7 916 9203838	https://www.instagram.com/liso_bon/	Mo-Su 08:00-23:00	8	\N	t	node	5331800121	\N
1081	Эклерная Клер	\N	\N	55.7704840	37.6334850	\N	https://eklernayakler.ru/	Mo-Su 09:00-21:00	8	\N	t	node	5906743559	\N
1082	Переговорка	\N	\N	55.7678650	37.6303560	\N	https://peregovorka.mrbarista.pro/	\N	8	\N	t	node	7137599502	\N
1083	Музей кофеграфии	\N	\N	55.7695150	37.6304140	\N	https://artcafe-museum.ru	Mo-Su 09:00-21:00	8	\N	t	node	7878432485	\N
1084	Литали	\N	\N	55.7740820	37.6397110	+7 495 4898855	https://cafe-litaly.ru/	24/7	8	\N	t	node	8001369879	\N
1085	Пинки&Кофе	\N	\N	55.7714650	37.6371450	+7 963 7128884	\N	Mo-Fr 07:30-21:00; Sa,Su 09:00-21:00	8	\N	t	node	8282135349	\N
1086	Lila Pastry	\N	\N	55.7694630	37.6324920	+7 495 607 10 01	https://gt.life/	Mo-Su 09:00-22:00	8	\N	t	node	8449309120	\N
1087	Антикафе Сфера	\N	\N	55.7718470	37.6365970	+7 495 6077725	anticafesfera.ru	Mo-Su 11:00-24:00	8	\N	t	node	8677638959	\N
1088	Bitter Drop	Большая Сухаревская площадь, 16/18 с1	\N	55.7717100	37.6372510	\N	\N	Mo-Fr 07:30-22:00; Sa-Su 08:00-22:00	8	\N	t	node	8677638980	\N
1089	Охотка	\N	\N	55.7713490	37.6325900	+7 495 2059872;+7 495 2059872	http://okhotka.ru/	Mo-Fr 11:30-22:30; Sa,Su 12:30-22:30	8	\N	t	node	8818387700	\N
1090	Urban eats	\N	\N	55.7679520	37.6348660	+7 495 5108343	\N	Mo-Fr 09:00-21:00; Sa 11:00-21:00	8	\N	t	node	9014759317	\N
1091	Чихо	\N	\N	55.7709100	37.6322720	+7 495 2059828	https://chiho.ru	Fr 11:00-24:00; Mo-Th 11:00-23:00; Sa 12:00-24:00; Su 12:00-23:00	8	\N	t	node	9851586986	\N
1092	Wooden Door	\N	\N	55.7714220	37.6371310	+7 495 7489338	\N	Mo-Su 12:00-24:00; Fr,Sa 12:00-06:00	8	\N	t	node	11360362639	\N
1093	Frank by Баста	\N	\N	55.7698860	37.6324660	+7 495 2281808	https://frankmeat.ru/	Fr-Sa 12:00-03:00; Mo-Th,Su 12:00-24:00	8	\N	t	node	11804942757	\N
1094	Surf Coffee	\N	\N	55.7711500	37.6322630	\N	https://www.surfcoffee.ru/	\N	8	\N	t	node	11851428616	\N
1095	Мидийное место	\N	\N	55.7706570	37.6322270	+7 991 5190280	https://www.midiynoe-mesto.ru	Fr-Sa 12:00-24:00; Mo-Th,Su 12:00-23:00	8	\N	t	node	11881025169	\N
1096	Pims	\N	\N	55.7712670	37.6322560	\N	https://pimstea.com/	\N	8	\N	t	node	12783350001	\N
1097	Kulek	\N	\N	55.7708170	37.6322650	\N	https://kulekfood.ru	\N	8	\N	t	node	13239150670	\N
1098	Prime	\N	\N	55.7349830	37.6423500	+7 495 6642363	http://www.prime-star.ru/	Mo-Fr 07:30-20:00	8	\N	t	node	2481793222	\N
1099	СушиТун	\N	\N	55.7321260	37.6470790	\N	\N	\N	8	\N	t	node	3134923409	\N
1100	Paul	\N	\N	55.7354290	37.6425720	\N	\N	\N	8	\N	t	node	4198784794	\N
1101	6 a.m.	\N	\N	55.7375070	37.6413340	\N	\N	Mo 09:00-20:00; Tu-Th 09:00-22:00; Fr 09:00-23:00; Sa 10:00-23:00; Su 10:00-20:00	8	\N	t	node	7756869016	\N
1102	Prime	\N	\N	55.7357900	37.6410560	+7 495 6642363	https://www.prime-star.ru/	Mo-Fr 08:00-19:00	8	\N	t	node	7829967693	\N
1103	Prime	\N	\N	55.7327390	37.6443240	+7 495 6642363	https://www.prime-star.ru	Mo-Fr 07:30-20:00	8	\N	t	node	7829977776	\N
1104	Will taste	\N	\N	55.7378000	37.6415910	+7 995 1514503	\N	Mo-Su 09:00-21:00	8	\N	t	node	9354058208	\N
1105	Ёж и устрица	\N	\N	55.7371190	37.6494270	+7 995 1162424	https://ezhiustrica.ru/	Mo-Su 12:00-24:00	8	\N	t	node	11083605381	\N
1106	Coffee Point	\N	\N	55.7352390	37.6424430	+7 916 0428191	\N	Fr 08:00-18:00; Mo-Th 08:00-19:00	8	\N	t	node	11889177648	\N
1107	Joja Coffee	\N	\N	55.7386150	37.6518580	\N	\N	\N	8	\N	t	node	13155858394	\N
1108	Grass2Glass	\N	\N	55.7378620	37.6415630	\N	\N	08:00-22:00	8	\N	t	node	13176871069	\N
1109	rockets. concept store	\N	\N	55.7359400	37.6423520	\N	\N	\N	8	\N	t	node	13177922810	\N
1110	аё	\N	\N	55.7374830	37.6487330	\N	\N	24/7	8	\N	t	way	340437214	\N
1111	Мечта	Садовническая улица, 84 с7	\N	55.7343360	37.6424630	+7 495 6335888	https://www.mechta-cafe.ru/	24/7	8	\N	t	relation	11326392	\N
1112	Prime	\N	\N	55.7425360	37.6521800	+7 495 6642363	https://www.prime-star.ru/	Mo-Fr 07:00-21:00; Sa-Su 09:00-20:00	8	\N	t	node	4323567453	\N
1113	Lights	\N	\N	55.7418470	37.6526790	+7 495 5325160	http://lightscafe.ru/	Mo-Fr 08:00-23:00; Sa,Su 10:00-23:00	8	\N	t	node	4476978889	\N
1114	Prime	\N	\N	55.7425150	37.6472550	+7 495 6642363	https://www.prime-star.ru/	Fr 08:00-17:00;Mo-Th 08:00-19:00	8	\N	t	node	7830036828	\N
1115	Surf Coffee	\N	\N	55.7436950	37.6512980	+7 925 3234285	https://www.surfcoffee.ru/	Mo-Fr 07:45-22:00; Sa-Su 10:00-22:00	8	\N	t	node	9335798712	\N
1116	Бико	\N	\N	55.7424280	37.6522610	\N	\N	Mo-Fr 07:00-21:00; Sa-Su 08:00-20:00	8	\N	t	node	9802371102	\N
1117	CofeFest	\N	\N	55.7456810	37.6524160	+7 495 2121059;+7 968 0220736	https://cofefest.ru/	Mo-Fr 08:00-19:00; Sa-Su 09:00-17:00	8	\N	t	node	10576689506	\N
1118	CofeFest	\N	\N	55.7431460	37.6496820	+7 495 2121059;+7 968 0220736	https://cofefest.ru/	Mo-Fr 08:00-19:00	8	\N	t	node	10576689507	\N
1119	Старик Хинкалыч	\N	\N	55.7437430	37.6512090	\N	\N	11:00-23:00	8	\N	t	node	11358722126	\N
1120	Чайхана	\N	\N	55.7409190	37.6524750	\N	\N	\N	8	\N	t	node	12188233699	\N
1121	Мангал Холл	\N	\N	55.7416700	37.6528530	\N	https://mangal-holl.clients.site/	Mo-Su 10:00-23:00	8	\N	t	node	12188244404	\N
1122	Хата Суриката	\N	\N	55.7395030	37.6517970	\N	\N	11:00-23:00	8	\N	t	node	13155858391	\N
1123	Кофе Станция	\N	\N	55.7391040	37.6527210	\N	\N	\N	8	\N	t	node	13158198757	\N
1124	Краткость	\N	\N	55.7422940	37.6497800	\N	\N	09:00-21:00	8	\N	t	node	13248240204	\N
1125	Prime	\N	\N	55.7504790	37.6529180	+7 495 6642363	http://www.prime-star.ru/	Mo-Th 07:00-19:00; Fr 07:00-18:00	8	\N	t	node	2481375926	\N
1126	ProjectorCoffee	\N	\N	55.7528680	37.6475770	\N	\N	Mo-Fr 08:00-22:00; Sa,Su 10:00-22:00	8	\N	t	node	7206254158	\N
1127	Gog	\N	\N	55.7472150	37.6468310	\N	https://instagram.com/gog.coffee	\N	8	\N	t	node	8513527117	\N
1128	Eastbrew	\N	\N	55.7477470	37.6446300	\N	\N	10:00-20:00	8	\N	t	node	9603558841	\N
1129	CofeFest	\N	\N	55.7460130	37.6505860	+7 495 2121059;+7 968 0220736	https://cofefest.ru/	Mo-Fr 08:00-19:00; Sa-Su 09:00-17:00	8	\N	t	node	10576689508	\N
1130	Кофе & завтраки	\N	\N	55.7528180	37.6460880	\N	\N	\N	8	\N	t	node	11332734269	\N
1131	Хинкал есть	\N	\N	55.7476410	37.6519270	\N	\N	\N	8	\N	t	node	12073411508	\N
1132	+47	\N	\N	55.7508760	37.6436190	+7 (901) 468-27-73	\N	\N	8	\N	t	node	12260921601	\N
1133	Чайная высота	\N	\N	55.7599550	37.6479800	+7 495 2255996;+7 800 1007108;+7 963 7700554	http://cha108.ru	Mo-Su 11:00-24:00	8	\N	t	node	2184524101	\N
1134	Булка	\N	\N	55.7595460	37.6463760	+7 495 6249557	http://www.bulkabakery.ru	Mo-Fr 07:30-23:00; Sa,Su 08:30-23:00	8	\N	t	node	2463830621	\N
1135	Maestrello	\N	\N	55.7587750	37.6458730	+7 495 6234411;+7 915 4882443	\N	Su-Th 11:00-23:00; Fr-Sa 11:00-24:00	8	\N	t	node	2615983168	\N
1136	Сыр & кофе	\N	\N	55.7533970	37.6432960	+7 965 1586592	\N	Mo-Th 10:00-22:00; Fr,Sa 10:00-24:00; Su 11:00-22:00	8	\N	t	node	5144047127	\N
1137	Cofix	\N	\N	55.7589950	37.6454200	+7 800 3508418	https://cofix.global	Fr-Sa 07:00-24:00; Mo-Th 07:00-23:00; Su 09:00-23:00	8	\N	t	node	5247146609	\N
1138	Эль Кафе	\N	\N	55.7565120	37.6501560	\N	http://www.el-cafe.ru/	Mo-Fr 08:00-20:00; Sa,Su 10:00-20:00	8	\N	t	node	5443944457	\N
1139	Red Brick	\N	\N	55.7558640	37.6440660	+7 495 6642150	http://caferedbrick.com/	Mo-Su 08:00-23:00	8	\N	t	node	5511434057	\N
1140	ABC coffee roasters	\N	\N	55.7590090	37.6421620	+7 495 2221036	http://www.abc-roasters.com/	Mo-Fr 08:00-22:00; Sa, Su 10:00-22:00	8	\N	t	node	5979516307	\N
1141	On Sight	\N	\N	55.7587720	37.6475140	\N	\N	Mo-Su 10:00-22:00	8	\N	t	node	6918453218	\N
1142	Jeffreys coffeeshop	\N	\N	55.7540810	37.6497330	\N	https://jeffreys.ru/	Mo-Sa 08:30-21:00;Su 11:00-19:00	8	\N	t	node	7437460032	\N
1143	Corner Coffee	\N	\N	55.7550790	37.6477900	\N	\N	Mo-Fr 08:00-21:00; Sa-Su 09:00-21:00	8	\N	t	node	7794969088	\N
1144	Сыто Piano	\N	\N	55.7586450	37.6414820	+7 977 8003701	http://sito-piano.ru	Mo-Su 00:00-06:00,11:00-24:00	8	\N	t	node	8045210658	\N
1145	Pear-6	Покровский бульвар, 11	\N	55.7540270	37.6501690	+7 916 7373388	\N	Mo-Sa 08:00-23:00; Su 10:00-18:00	8	\N	t	node	8368127759	\N
1146	StandUp Cafe	\N	\N	55.7590990	37.6456360	\N	https://www.standupcafe.ru/	Su-Th 15:00-24:00, Fr,Sa 15:00-05:00	8	\N	t	node	8644649073	\N
1147	Taam hummus bar	\N	\N	55.7598000	37.6470120	\N	\N	Mo-Su 10:00-23:00	8	\N	t	node	8644649083	\N
1148	Я тебя люля	\N	\N	55.7586170	37.6459890	\N	\N	Mo-Su 12:00-24:00	8	\N	t	node	8758899729	\N
1149	Tintoretto	\N	\N	55.7599220	37.6527700	\N	\N	Mo-Su 10:00-22:00	8	\N	t	node	8954185136	\N
1150	Ramen Ten	\N	\N	55.7585980	37.6412020	\N	https://ramenten.ru/	Mo-Su 11:00-23:00	8	\N	t	node	9169909264	\N
1151	Хинкали у Нино	\N	\N	55.7585800	37.6410920	\N	http://hinkalinino.ru/	Mo-Su 11:00-23:00	8	\N	t	node	9169909265	\N
1152	Jinju	\N	\N	55.7590950	37.6428070	\N	https://jinju.clients.site	\N	8	\N	t	node	9176377606	\N
1153	KOM	\N	\N	55.7599820	37.6528620	\N	\N	We-Su 13:00-23:00	8	\N	t	node	9176401519	\N
1154	РомБаба	\N	\N	55.7587100	37.6418420	\N	https://rbbmos.ru/	Mo-Su 08:00-21:00	8	\N	t	node	9195833272	\N
1155	Kebab Ø18	\N	\N	55.7586890	37.6459350	\N	https://kebab-18.clients.site/	\N	8	\N	t	node	9198111277	\N
1156	Surf Coffee	\N	\N	55.7586980	37.6417670	+7 925 6757985	https://www.surfcoffee.ru/	Mo-Fr 08:00-23:00; Sa-Su 10:00-23:00	8	\N	t	node	9397041406	\N
1157	Белые Облака	\N	\N	55.7586610	37.6415620	+7 991 709-15-85	https://cafebelyeoblaka.ru/	Mo-Su 10:00-22:00	8	\N	t	node	9628243584	\N
1158	Закуток	\N	\N	55.7550260	37.6446550	\N	\N	\N	8	\N	t	node	9851586954	\N
1159	Эклер	\N	\N	55.7550200	37.6448040	\N	\N	\N	8	\N	t	node	9851586955	\N
1160	Квартира 37	\N	\N	55.7550760	37.6446980	\N	\N	\N	8	\N	t	node	9851586956	\N
1161	Аренда	\N	\N	55.7550670	37.6444320	\N	\N	Mo-Su 12:00-23:00	8	\N	t	node	9851586957	\N
1162	Чифанька	\N	\N	55.7550630	37.6429950	\N	\N	Mo-Fr 12:00-24:00; Sa,Su 00:00-03:00,12:00-24:00	8	\N	t	node	9885958903	\N
1163	Ø36	\N	\N	55.7549830	37.6429220	\N	\N	\N	8	\N	t	node	10763832306	\N
1164	Viet quan	\N	\N	55.7586840	37.6417130	\N	\N	Mo-Su 11:00-23:00	8	\N	t	node	10767176631	\N
1165	Блины у камина	\N	\N	55.7592340	37.6491960	+7 903 7933334	https://blini-u-kamina.tilda.ws/	Mo-Fr 10:00-22:00; Sa,Su 11:00-22:00	8	\N	t	node	11265530351	\N
1166	Остров Пасхи	\N	\N	55.7598380	37.6489090	\N	\N	\N	8	\N	t	node	11360292819	\N
1167	Мастерская	\N	\N	55.7550740	37.6454910	\N	\N	\N	8	\N	t	node	11592763909	\N
1168	Брусника	\N	Внутри ВШЭ	55.7553210	37.6459170	\N	\N	\N	8	\N	t	node	11634229396	\N
1169	Pir&Rog	\N	\N	55.7548720	37.6490560	+7 915 3005005	https://pirrog.ru/	Mo-Su 10:00-22:00	8	\N	t	node	11927657133	\N
1170	Мама варит кофе	\N	\N	55.7588010	37.6423700	\N	https://mamavaritcoffee.ru/	\N	8	\N	t	node	12173718112	\N
1171	Окофе	\N	\N	55.7588470	37.6426420	\N	\N	\N	8	\N	t	node	12173718113	\N
1172	Много кофе	\N	\N	55.7546330	37.6443990	\N	\N	Mo-Su 10:00-22:00	8	\N	t	node	12282701931	\N
1173	Nova	\N	\N	55.7597430	37.6476470	\N	\N	\N	8	\N	t	node	12309783483	\N
1174	Кооператив «Чёрный»	Лялин переулок, 5 с1	\N	55.7600200	37.6518320	\N	http://chernyi.coffee	Mo 08:00-19:00; Tu-Fr 08:00-23:00; Sa-Su 10:00-23:00	8	\N	t	way	668790439	\N
1175	Black Milk	\N	\N	55.7621120	37.6425060	+7 916 1558377	http://blackmilkcoffee.ru/	Mo-Fr 08:00-23:00; Sa,Su 10:00-23:00	8	\N	t	node	2196651539	\N
1176	Kiosk 1936	\N	\N	55.7619460	37.6426610	\N	\N	Mo-Su 09:00-22:00	8	\N	t	node	2957828499	\N
1177	Stolovaya	\N	\N	55.7618870	37.6520250	\N	\N	Mo-Fr 12:00-24:00; Sa,Su 00:00-02:00,12:00-24:00	8	\N	t	node	3204791768	\N
1178	Don Giulio Pasticceria	\N	\N	55.7600770	37.6486510	+7 495 6245652	http://www.dongiulio.ru	Mo-Su 10:00-21:00	8	\N	t	node	3987695495	\N
1179	Буфет Паштет	\N	\N	55.7607810	37.6512570	\N	\N	Mo-Su 12:00-00:00	8	\N	t	node	4200155694	\N
1180	FOB's	\N	\N	55.7634650	37.6428940	\N	\N	Mo-Fr 08:00-22:00; Sa,Su 09:00-23:00	8	\N	t	node	4344518800	\N
1181	Грамотный Кофе	\N	\N	55.7601310	37.6467930	\N	http://literatecoffee.ru/	Mo-Fr 10:00-22:00; Sa,Su 10:00-20:00	8	\N	t	node	4745899895	\N
1182	That place	\N	\N	55.7615580	37.6429810	\N	\N	\N	8	\N	t	node	4975713192	\N
1183	Дела кофейные	\N	\N	55.7625680	37.6482180	+7 906 0330909	\N	Mo-Fr 07:00-21:00; Sa,Su 09:00-21:00	8	\N	t	node	5410324006	\N
1184	Брусника	\N	кулинария-кондитерская	55.7621190	37.6447120	+7 495 6914507	http://brusnikacafe.ru/	Mo-Su 08:00-23:00	8	\N	t	node	5609943020	\N
1185	Гнездо	8 с2	\N	55.7601290	37.6510490	+7 495 2121470	https://timeclub24.ru/gnezdo	24/7	8	\N	t	node	5966027387	\N
1186	Red Black Family	\N	\N	55.7620070	37.6489330	+7 967 2847989	\N	Mo-Su 10:00-22:00	8	\N	t	node	6625058424	\N
1187	Ни свет ни заря	\N	\N	55.7621560	37.6518010	\N	\N	Mo-Fr 08:00-23:00; Sa,Su 10:00-23:00	8	\N	t	node	7083143213	\N
1188	Полдень	\N	\N	55.7605300	37.6472030	\N	\N	Mo-Su 09:00-21:00	8	\N	t	node	9067064021	\N
1189	CVC	\N	\N	55.7623260	37.6422190	\N	\N	\N	8	\N	t	node	9359076618	\N
1190	Surf Coffee	\N	\N	55.7608050	37.6499410	+7 980 1296026	https://www.surfcoffee.ru/	Mo-Fr 08:00-22:00; Sa,Su 09:00-22:00	8	\N	t	node	9822923064	\N
1191	Шоколадное ателье	\N	\N	55.7619580	37.6521930	\N	https://eklernayakler.ru/	Mo-Su 09:00-21:00	8	\N	t	node	9989248250	\N
1192	Jinju	\N	\N	55.7619000	37.6485300	\N	\N	Mo-Su 09:30-20:00	8	\N	t	node	9991531573	\N
1193	Френдс	\N	\N	55.7605880	37.6496170	\N	https://friendsmsk.ru/	Mo-Su 09:00-24:00	8	\N	t	node	10717624777	\N
1194	Sare art	\N	\N	55.7658940	37.6479850	\N	\N	\N	8	\N	t	node	10845859069	\N
1195	Tricky	\N	\N	55.7668490	37.6423270	\N	\N	\N	8	\N	t	node	11672860780	\N
1196	Лицей	\N	\N	55.7602280	37.6514060	+7 915 1386840	\N	Mo-Fr 08:00-21:00; Sa-Su 09:00-22:00	8	\N	t	node	12244464201	\N
1197	Crazy Cook	\N	\N	55.7609490	37.6506660	\N	https://crazycook.pizza	\N	8	\N	t	node	12803115732	\N
1198	Рябчик	\N	\N	55.7606970	37.6473530	\N	\N	\N	8	\N	t	node	13016208846	\N
1199	Aaark	\N	\N	55.7616180	37.6496020	\N	\N	Mo-Su 09:00-21:00	8	\N	t	node	13016208872	\N
1200	Чапа	\N	\N	55.7642890	37.6452310	\N	\N	\N	8	\N	t	node	13070320943	\N
1202	Com	\N	\N	55.7682800	37.6446180	\N	\N	\N	8	\N	t	node	302501273	\N
1203	Алтаргана	\N	\N	55.7673460	37.6522940	+7 499 9755639;+7 915 4924830	https://altargana-moscow.ru/	Mo-Su 12:00-24:00	8	\N	t	node	820839905	\N
1204	Prime	\N	\N	55.7718110	37.6489650	+7 495 6642363	http://www.prime-star.ru/	Mo-Fr 08:00-21:00	8	\N	t	node	1673222263	\N
1205	Венская кофейня	\N	\N	55.7717540	37.6488130	\N	\N	\N	8	\N	t	node	1673222270	\N
1206	Offer	\N	\N	55.7696130	37.6448870	\N	\N	\N	8	\N	t	node	2196651672	\N
1207	MFCafe	\N	\N	55.7717700	37.6484510	\N	\N	Mo-Su 08:00-18:00	8	\N	t	node	2437747338	\N
1208	Даблби	\N	\N	55.7729190	37.6521780	\N	http://double-b.ru	Mo-Fr 08:00-22:00; Sa,Su 10:00-21:45	8	\N	t	node	4386309387	\N
1209	Coffee Clever	\N	\N	55.7702640	37.6414910	+7 977 3670736	\N	Mo-Fr 07:45-20:00; Sa,Su 10:00-20:00	8	\N	t	node	6166442785	\N
1210	Свежъ	\N	\N	55.7725170	37.6519010	+7 495 7860579;+7 916 5878324	https://svezh.cafe/	Mo-Fr 08:00-19:00	8	\N	t	node	6338703185	\N
1211	Джи Пи Вингс	\N	\N	55.7678980	37.6467670	\N	\N	Mo-Sa 09:00-22:00	8	\N	t	node	6609203957	\N
1212	Кофе с тобой	\N	\N	55.7711810	37.6515340	\N	\N	Mo-Fr 07:00-20:00; Sa, Su 08:00-19:00	8	\N	t	node	6698967431	\N
1213	Пшеница	\N	\N	55.7711890	37.6511760	+7 495 6476315	\N	09:00-20:00	8	\N	t	node	6699339262	\N
1214	Инсайт	\N	\N	55.7674050	37.6508680	\N	\N	Mo-Su 08:00-20:00	8	\N	t	node	6731638978	\N
1215	Introvert	\N	\N	55.7682620	37.6424900	\N	\N	Mo-Su 10:00-22:00	8	\N	t	node	6779217174	\N
1216	Prime	\N	\N	55.7684240	37.6468510	+7 495 6642363	http://www.prime-star.ru	Mo-Fr 08:00-20:00	8	\N	t	node	7080708916	\N
1217	Prime	\N	\N	55.7695060	37.6500530	+7 495 6642363	http://www.prime-star.ru/	Mo-Fr 08:00-22:00;Sa-Su 09:00-22:00	8	\N	t	node	7129381006	\N
1218	Старик Хинкалыч	\N	\N	55.7676560	37.6467460	\N	\N	\N	8	\N	t	node	7923018384	\N
1219	Лунго	\N	\N	55.7673410	37.6506340	\N	\N	Mo-Fr 08:00-20:00; Sa,Su 10:00-20:00	8	\N	t	node	8377845113	\N
1220	Buno cup	\N	\N	55.7710060	37.6486740	\N	https://taplink.cc/bunocup.moscow	\N	8	\N	t	node	8495964473	\N
1221	SeDelice	\N	\N	55.7680150	37.6476780	+7 968 6232884	https://sedelice.ru/	Mo-Fr 07:00-22:00; Sa 08:00-22:00; Su 09:00-21:00	8	\N	t	node	8495964552	\N
1222	Свои	\N	\N	55.7699820	37.6417890	+7 905 7762424	\N	Mo-Fr 08:00-18:00	8	\N	t	node	8677638965	\N
1223	Пять звёзд	\N	\N	55.7694840	37.6412150	+7 965 1246523	http://pzmmoscow.ru/	Mo-Fr 08:30-17:00	8	\N	t	node	8677638966	\N
1224	Cofix	\N	\N	55.7704270	37.6510290	+7 800 3508418	https://cofix.global	24/7	8	\N	t	node	9786011812	\N
1225	Di Bruno	\N	\N	55.7706990	37.6491250	+7 495 1969833;+7 916 1154168	http://di-bruno.shop/ru/	\N	8	\N	t	node	10261265920	\N
1226	Cups & Hugs	\N	\N	55.7711450	37.6484590	\N	\N	\N	8	\N	t	node	11042750812	\N
1227	Бик кафе	\N	\N	55.7701160	37.6505160	\N	\N	\N	8	\N	t	node	11254957537	\N
1228	Surf Coffee	\N	\N	55.7714180	37.6489980	+7 967 1266932	https://www.surfcoffee.ru/	Mo-Fr 08:00-22:00; Sa-Su 10:00-22:00	8	\N	t	node	11401774628	\N
1229	Линдфорс	\N	\N	55.7740800	37.6506760	+7 495 6077731	http://www.lindfors.ru	Mo-Fr 08:00-21:00; Sa,Su 10:00-21:00	8	\N	t	node	11435856877	\N
1230	Gussi	\N	\N	55.7738830	37.6500910	\N	\N	\N	8	\N	t	node	11637189569	\N
1231	Бадьян и корица	\N	\N	55.7694410	37.6477170	\N	\N	\N	8	\N	t	node	12000647871	\N
1232	Табера	\N	\N	55.7693940	37.6479260	\N	\N	\N	8	\N	t	node	12000647872	\N
1233	Surf Coffee	\N	\N	55.7712910	37.6440390	+7 910 4490798	https://www.surfcoffee.ru/	Mo-Fr 08:00-22:00; Sa-Su 10:00-22:00	8	\N	t	node	13016208868	\N
1234	Верона	\N	\N	55.7343770	37.6616780	\N	\N	Mo-Su 09:00-23:00	8	\N	t	node	4142818369	\N
1235	Тирольские пироги	Воронцовская улица, 48	\N	55.7328640	37.6639480	+7 495 6326618	https://tirolpirog.ru/	Mo-Su 08:00-22:00	8	\N	t	node	4142825993	\N
1236	Штолле	Марксистская улица, 5	\N	55.7376510	37.6631340	\N	https://msk.stolle.ru	Mo-Fr 08:00-22:00; Sa 09:00-21:00; Su 09:00-20:00	8	\N	t	node	4607891189	\N
1237	Шоколадница	\N	\N	55.7319340	37.6641170	+7 915 4926984	https://shoko.ru	Mo-Fr 08:00-22:00; Sa-Su 09:00-22:00	8	\N	t	node	6717889946	\N
1238	Сушисет	\N	\N	55.7375010	37.6539310	+74951505522	https://setsushi.ru/	Mo-Su 11:00-23:00	8	\N	t	node	9687694617	\N
1239	Monteview	\N	\N	55.7374640	37.6554200	\N	\N	Mo-Fr 08:00-22:00; Sa,Su 10:00-22:00	8	\N	t	node	10763832328	\N
1240	Черёмуха	\N	\N	55.7383550	37.6551640	\N	\N	Mo-Fr 08:00-22:00; Sa,Su 09:00-22:00	8	\N	t	node	11425792252	\N
1241	Суло	\N	\N	55.7356810	37.6578880	\N	\N	\N	8	\N	t	node	13084893965	\N
1242	Вилка	\N	\N	55.7381440	37.6548610	\N	\N	\N	8	\N	t	node	13092684327	\N
1243	Птичка	\N	\N	55.7365250	37.6629830	\N	\N	Mo-Fr 08:00-19:00; Sa-Su 08:00-18:00	8	\N	t	node	13155858387	\N
1244	OnePrice Coffee	\N	\N	55.7328830	37.6639000	\N	\N	\N	8	\N	t	node	13162330973	\N
1245	Торты & Кофе	\N	\N	55.7330500	37.6632770	\N	\N	\N	8	\N	t	node	13162330989	\N
1246	La Vie Café	\N	\N	55.7359320	37.6605150	\N	\N	\N	8	\N	t	node	13162330995	\N
1247	Русский АвангъАрдъ	\N	\N	55.7364420	37.6631270	\N	\N	\N	8	\N	t	node	13188923161	\N
1248	Costo do Cafe	\N	\N	55.7360180	37.6638340	\N	\N	\N	8	\N	t	node	13198084672	\N
1249	Шоколадница	\N	\N	55.7388110	37.6530060	+7 985 3162275	https://shoko.ru/	Mo-Fr 07:00-23:00; Sa-Su 09:00-23:00	8	\N	t	node	444765729	\N
1250	Ханой Фуд	Марксистская улица, 3 с1	\N	55.7386630	37.6609500	\N	https://hanoj-fud-marksistskaja-ulitsa.clients.site/	\N	8	\N	t	node	1305562170	\N
1251	Prime	\N	\N	55.7456870	37.6635390	+7 495 6642363;+7 495 6637233	http://www.prime-star.ru	Mo-Fr 07:00-20:00	8	\N	t	node	2481793231	\N
1252	Блины	\N	\N	55.7392110	37.6559540	\N	\N	Mo-Th,Su 11:00-23:00; Fr-Sa 11:00-24:00	8	\N	t	node	3509117850	\N
1253	ЕТО	Большой Дровяной переулок, 18	\N	55.7455880	37.6585340	\N	\N	Mo-Sa 09:00-18:00	8	\N	t	node	4243200017	\N
1254	Мегрелия	\N	\N	55.7397990	37.6540600	+7 925 1132311	https://megrelia.ru	Fr-Sa 11:00-00:00; Mo-Th,Su 11:00-23:00	8	\N	t	node	4311488223	\N
1255	Coffee Point	\N	\N	55.7457460	37.6637420	+7 916 0428191	\N	Fr 08:00-18:00; Mo-Th 08:00-19:00	8	\N	t	node	4895883013	\N
1256	Cofix	Таганская улица, 2	\N	55.7409510	37.6579120	+7 800 3508418	https://cofix.global	Mo-Fr 07:00-22:00; Sa-Su 08:00-22:00	8	\N	t	node	5412755022	\N
1257	Coffeebara	Таганская улица, 32/1 с1	\N	55.7395230	37.6649010	\N	\N	Mo-Fr 08:00-21:00; Sa-Su 10:00-21:00	8	\N	t	node	5763611813	\N
1258	Какао Дом	\N	\N	55.7403370	37.6628350	\N	\N	\N	8	\N	t	node	5915088873	\N
1259	Prime	Марксистская улица, 16	\N	55.7388420	37.6591410	+7 495 6642363	http://www.prime-star.ru/	Mo-Fr 08:00-19:00	8	\N	t	node	6061573703	\N
1260	Mr. Croissant	\N	\N	55.7417710	37.6558960	+7 800 7073549	http://www.mrcroissant.ru	Mo-Su 10:00-22:00	8	\N	t	node	6093132163	\N
1261	Монтероссо	\N	\N	55.7405350	37.6541880	+7 495 7923230	http://monterossocafe.ru/	\N	8	\N	t	node	6200361836	\N
1262	Skuratov Coffee	Верхняя Радищевская улица, 19/3 с2	\N	55.7433410	37.6533810	+7 925 7035949	https://skuratovcoffee.ru	Mo-Su 06:55-22:05	8	\N	t	node	6221254078	\N
1263	Чайный паб Сэр Пуэр	переулок Маяковского, 3	\N	55.7393450	37.6604100	+7 495 1034195	https://sirpuer.com	Mo-Su 10:00-21:00	8	\N	t	node	6420457588	\N
1264	White Fox	\N	\N	55.7437620	37.6564250	\N	\N	\N	8	\N	t	node	6822775186	\N
1265	Гринери	\N	\N	55.7399390	37.6620420	\N	https://greenery-cafe.ru/	Mo-Su 09:00-20:00	8	\N	t	node	8731799335	\N
1266	Here'n'Now	Таганская улица, 17-23	\N	55.7400420	37.6635620	\N	\N	Mo-Fr 08:00-22:00; Sa-Su 09:00-21:30	8	\N	t	node	8731799340	\N
1267	Шоколадница	\N	\N	55.7418660	37.6533450	+7 909 9570186	https://shoko.ru	24/7	8	\N	t	node	9749466052	\N
1268	Ни Свет Ни Заря	\N	\N	55.7440100	37.6564650	\N	\N	\N	8	\N	t	node	9749580253	\N
1269	Твой кофе	\N	\N	55.7438240	37.6568560	\N	\N	\N	8	\N	t	node	9802088162	\N
1270	Burger Heroes	\N	\N	55.7421740	37.6529730	+7 967 0911967	https://burgerheroes.ru	Mo-Th,Su 11:00-23:00; Fr-Sa 11:00-23:45	8	\N	t	node	9802371103	\N
1271	Tine	\N	\N	55.7401190	37.6617160	\N	\N	Mo-Fr 09:00-22:00; Sa,Su 10:00-22:00	8	\N	t	node	10261265912	\N
1272	Хоуми	\N	\N	55.7421800	37.6603360	\N	\N	Mo-Fr 08:00-20:00; Sa-Su 09:00-20:00	8	\N	t	node	10570749371	\N
1273	Time Club Ковчег	\N	\N	55.7453370	37.6539310	+7 495 212-91-14	https://timeclub24.ru/ark	24/7	8	\N	t	node	11298091603	\N
1274	Cofix	\N	\N	55.7426000	37.6533060	+7 800 3508418	https://cofix.global	Mo-Fr 07:00-23:00; Sa-Su 08:00-23:00	8	\N	t	node	11843754146	\N
1275	Cofix	\N	\N	55.7421570	37.6532340	+7 800 3508418	https://cofix.global	Mo-Su 07:00-22:00	8	\N	t	node	11843754149	\N
1276	Surf Coffee	\N	\N	55.7417630	37.6554410	+7 910 0131259	https://www.surfcoffee.ru	Mo-Fr 08:00-22:30; Sa-Su 09:30-22:30	8	\N	t	node	12169975923	\N
1277	YesNoMilk	\N	\N	55.7407910	37.6583650	\N	\N	\N	8	\N	t	node	12755520651	\N
1278	Кофенёвый штрудель	\N	\N	55.7410160	37.6590500	\N	\N	\N	8	\N	t	node	13082093134	\N
1279	Правда Кофе	\N	\N	55.7398350	37.6540230	\N	\N	\N	8	\N	t	node	13092684335	\N
1280	Skuratov Coffee Roasters	\N	\N	55.7435500	37.6536170	\N	\N	\N	8	\N	t	node	13092684342	\N
1281	Surf Coffee	\N	\N	55.7413870	37.6572780	\N	\N	\N	8	\N	t	node	13248246354	\N
1282	Stars Coffee	\N	\N	55.7417630	37.6555780	+7 991 5555222	https://stars-coffee.ru/	\N	8	\N	t	relation	19062926	\N
1283	Баклажан	\N	\N	55.7474090	37.6560650	\N	\N	\N	8	\N	t	node	3006951333	\N
1284	Кулинарная лавка братьев Караваевых	\N	\N	55.7472920	37.6564230	+7 495 915-38-94	https://www.karavaevi.ru	Mo-Su 08:00-23:00	8	\N	t	node	3006953833	\N
1285	Спешиlove	\N	\N	55.7490790	37.6552160	\N	\N	Mo-Fr 08:00-22:00; Sa-Su 10:00-22:00	8	\N	t	node	3509241707	\N
1286	Daily Food	\N	\N	55.7460560	37.6639630	\N	https://dailyfoodrussia.ru/	\N	8	\N	t	node	3639071092	\N
1287	Пан Запекан	\N	\N	55.7462470	37.6548770	\N	\N	Mo-Su 07:30-22:00	8	\N	t	node	4314160634	\N
1288	Chef's	\N	\N	55.7507500	37.6529970	\N	\N	\N	8	\N	t	node	4916438925	\N
1289	Приятного аппетита	\N	\N	55.7509770	37.6546180	\N	\N	Mo-Fr 09:30-17:00	8	\N	t	node	4971171721	\N
1290	iSoul Зелень	\N	\N	55.7459910	37.6587360	+7 903 1931100	http://isoulclub.ru/menyu-kafe/	Mo-Su 07:00-23:00	8	\N	t	node	5366016487	\N
1291	ВоблакеВкуса	\N	\N	55.7483500	37.6551710	\N	\N	12:00-23:00	8	\N	t	node	6160699478	\N
1292	Vero	\N	\N	55.7472070	37.6549520	\N	http://delivery-pizzavero.ru	Mo-Su 11:00-23:00	8	\N	t	node	10998416513	\N
1293	Буфетоф	\N	\N	55.7467460	37.6548740	\N	https://bufetofcatering.ru/	Mo-Fr 08:00-20:00; Sa,Su 09:00-19:00	8	\N	t	node	11824983915	\N
1294	Секрет вкуса	\N	\N	55.7511030	37.6639320	\N	\N	\N	8	\N	t	node	12193379385	\N
1295	Jules Zang	\N	\N	55.7513570	37.6637210	\N	https://taplink.cc/jules_zang	Mo 08:00-16:00; Tu-Su 08:00-20:00	8	\N	t	node	12193379386	\N
1296	Кофе Хауз	\N	\N	55.7576430	37.6586650	\N	https://coffeehouse.ru	\N	8	\N	t	node	524512031	\N
1297	Шоколадница	\N	\N	55.7596880	37.6571710	+7 915 4738491	http://shoko.ru	24/7	8	\N	t	node	2121495419	\N
1298	Кофепровод	\N	\N	55.7586970	37.6542130	\N	\N	Mo-Su 07:00-09:00,20:30-23:00	8	\N	t	node	3522044394	\N
1299	Hanoi	\N	\N	55.7545810	37.6557100	\N	\N	\N	8	\N	t	node	3689700045	\N
1300	Даблби	\N	\N	55.7579590	37.6584440	\N	http://double-b.ru	Mo-Su 10:00-23:00	8	\N	t	node	4466031400	\N
1301	Prime	\N	\N	55.7585880	37.6572200	+7 495 6642363	http://www.prime-star.ru	Mo-Fr 07:00-21:00;Sa-Su 08:00-21:00	8	\N	t	node	4632221069	\N
1302	Компот	\N	\N	55.7537980	37.6626110	\N	\N	\N	8	\N	t	node	4728996980	\N
1303	Here'n'Now	\N	\N	55.7538190	37.6617360	\N	\N	Mo-Fr 08:00-19:00; Sa 09:00-19:00	8	\N	t	node	4736659866	\N
1304	Грамотный кофе	\N	\N	55.7569730	37.6531640	\N	http://literatecoffee.ru/	Tu-Sa 10:00-22:00; Su 10:00-20:00	8	\N	t	node	5919285536	\N
1305	Трапезная	\N	\N	55.7535970	37.6542690	\N	\N	Mo-Su 07:30-22:00	8	\N	t	node	5955463978	\N
1306	Пересвет	\N	\N	55.7559740	37.6555520	\N	\N	Mo-Fr 10:00-18:00	8	\N	t	node	5955465345	\N
1307	Пицца Паоло	\N	\N	55.7597140	37.6597110	+7 499 5530040-79	http://pizzapaolo.ru/	Mo-Su 10:00-23:00	8	\N	t	node	6021825263	\N
1308	Cofix	\N	\N	55.7552190	37.6606800	+7 800 3508418	https://cofix.global	Mo-Fr 07:00-22:00; Sa-Su 08:00-22:00	8	\N	t	node	6669881589	\N
1309	Prime	\N	\N	55.7537540	37.6626500	+7 495 6642363	https://www.prime-star.ru/	Fr 07:30-18:00;Mo-Th 07:30-19:00	8	\N	t	node	7829979782	\N
1310	Kava	\N	\N	55.7545520	37.6555690	\N	\N	\N	8	\N	t	node	10100641631	\N
1311	Шоколадница	\N	\N	55.7573530	37.6585200	+7 915 4738457	https://shoko.ru	Mo-Su 10:00-23:00	8	\N	t	node	11668775715	\N
1312	Surf Coffee	\N	\N	55.7574420	37.6584820	+7 903 1090307	https://www.surfcoffee.ru	Mo-Su 10:00-23:00	8	\N	t	node	12059168153	\N
1313	Москвич	\N	\N	55.7571850	37.6572130	\N	\N	\N	8	\N	t	node	13227852851	\N
1314	Котофейня	\N	Котокафе	55.7572390	37.6569590	\N	\N	Mo-Fr 11:00-22:00; Sa-Su 10:00-22:00	8	\N	t	node	13227852852	\N
1315	Бейрут	\N	\N	55.7642670	37.6531340	+7 495 6255910	https://beirutcafe.ru	Mo-Su 12:00-24:00	8	\N	t	node	2477010115	\N
1316	Prime	\N	\N	55.7616390	37.6584450	+7 495 6642363	http://www.prime-star.ru/	Mo-Fr 07:30-20:00	8	\N	t	node	2481758854	\N
1317	Николай	Старая Басманная улица, 5 с1	\N	55.7644770	37.6570610	+7 495 6415595	http://bar-bufet.ru	Mo-Su 10:00-23:00	8	\N	t	node	2516300022	\N
1318	Хвоя	\N	\N	55.7665510	37.6608150	\N	\N	Mo-Su 11:00-22:00	8	\N	t	node	4198332832	\N
1319	Prime	\N	\N	55.7607760	37.6625820	+7 495 6642363	http://www.prime-star.ru/	Mo-Fr 07:30-20:00	8	\N	t	node	4546201419	\N
1320	Кулинарная лавка братьев Караваевых	\N	\N	55.7610080	37.6626470	+7 495 623-71-85	https://www.karavaevi.ru	Mo-Su 08:00-23:00	8	\N	t	node	4546201422	\N
1321	Кофе Хауз	\N	\N	55.7605130	37.6623000	\N	\N	Mo-Fr 07:00-21:00; Sa,Su 11:00-21:00	8	\N	t	node	4640025589	\N
1322	OMG!Coffee	\N	\N	55.7604940	37.6640900	+7 499 3977758	http://www.omgcoffee.net	Mo-Su 09:00-21:00	8	\N	t	node	4869721694	\N
1323	Общага	\N	\N	55.7633970	37.6608070	\N	\N	\N	8	\N	t	node	5176365682	\N
1324	Школьник	\N	\N	55.7617250	37.6567700	\N	\N	Mo-Su 08:00-22:00	8	\N	t	node	5199976326	\N
1325	Другая кофейня	\N	\N	55.7663970	37.6625720	\N	\N	Mo-Fr 08:30-22:00; Sa,Su 10:00-22:00	8	\N	t	node	5270961321	\N
1326	Япоkofe	\N	\N	55.7627890	37.6545270	\N	\N	Mo-Su 10:00-22:00	8	\N	t	node	5754225232	\N
1327	Uon Coffee	\N	\N	55.7613280	37.6569850	+7 916 8000636	\N	\N	8	\N	t	node	6738963228	\N
1328	Hav.Palass	\N	\N	55.7646960	37.6539350	\N	\N	Mo-Fr 08:30-21:00; Sa,Su 10:00-21:00	8	\N	t	node	7710941985	\N
1329	Дринкит	\N	\N	55.7606220	37.6637530	\N	https://apps.apple.com/ru/app/%D0%B4%D1%80%D0%B8%D0%BD%D0%BA%D0%B8%D1%82-%D0%BA%D0%BE%D1%84%D0%B5-%D0%B8-%D0%B5%D0%B4%D0%B0/id1495622004?mt=8	Mo-Fr 07:30-20:00	8	\N	t	node	7734616157	\N
1330	Публика	\N	\N	55.7664690	37.6635040	\N	\N	\N	8	\N	t	node	8975373548	\N
1331	Мегрули	\N	\N	55.7632590	37.6546620	\N	\N	Mo-Su 11:00-23:00	8	\N	t	node	9198111261	\N
1332	Soul Coffee	\N	\N	55.7650480	37.6542500	\N	\N	Mo-Fr 08:00-20:00; Sa,Su 09:00-20:00	8	\N	t	node	9717899256	\N
1333	Табак & кофейня	\N	\N	55.7649330	37.6556640	\N	\N	\N	8	\N	t	node	9757195236	\N
1334	Surf Coffee	\N	\N	55.7601470	37.6619920	+7 933 3635969	https://www.surfcoffee.ru/	Mo-Fr 08:00-22:00; Sa-Su 09:00-22:00	8	\N	t	node	10086975824	\N
1335	Bodro Coffee	\N	\N	55.7608010	37.6624890	\N	https://bodro.coffee/	Mo-Fr 08:00-20:00; Sa,Su 09:00-20:00	8	\N	t	node	10086975825	\N
1336	Erna Hoffman	\N	\N	55.7643910	37.6575960	\N	\N	\N	8	\N	t	node	11084062658	\N
1337	Pho-house	\N	\N	55.7644390	37.6577390	\N	\N	\N	8	\N	t	node	11084062659	\N
1338	Soul.mo	\N	\N	55.7630320	37.6576800	\N	\N	\N	8	\N	t	node	11084075322	\N
1339	Пан круассан	\N	\N	55.7612610	37.6628090	\N	\N	Mo-Fr 07:00-21:00; Sa,Su 08:00-21:00	8	\N	t	node	11909735315	\N
1340	Мякоть	\N	\N	55.7603400	37.6621750	\N	https://miakot.ru/	\N	8	\N	t	node	12451266978	\N
1341	Amov	\N	\N	55.7634860	37.6601650	\N	\N	Mo-Fr 08:00-22:00; Sa,Su 09:00-22:00	8	\N	t	node	12551246417	\N
1342	Jinju	улица Земляной Вал, 23 с1	\N	55.7601260	37.6581740	+7 936 166 66 33	https://jinju.clients.site	Mo-Fr 08:00-23:59; Sa-Su 09:00-23:59	8	\N	t	node	12781979501	\N
1343	Правда кофе	\N	\N	55.7605950	37.6623740	\N	\N	Mo-Fr 08:00-22:00; Sa,Su 09:00-21:00	8	\N	t	node	12809256632	\N
1344	CoffeeNat	\N	\N	55.7607610	37.6641510	\N	\N	\N	8	\N	t	node	12809351179	\N
1345	Sito	\N	\N	55.7661240	37.6608800	\N	\N	\N	8	\N	t	way	1064100918	\N
1346	А. Ф. Кони	\N	\N	55.7697610	37.6553650	+7 499 2657808	https://af-koni.ru/	\N	8	\N	t	node	1685948136	\N
1347	Меркато	\N	\N	55.7685590	37.6593990	\N	\N	\N	8	\N	t	node	3441398604	\N
1348	Латте	\N	\N	55.7673160	37.6601380	\N	\N	\N	8	\N	t	node	3611232494	\N
1349	Самарканд	\N	\N	55.7733030	37.6565920	\N	\N	Mo-Su 08:00-23:00	8	\N	t	node	5209036324	\N
1350	Правда Кофе	\N	\N	55.7698210	37.6607420	+7 800 5551966	http://pravda-coffee.ru	Mo-Fr 08:00-22:00; Sa,Su 09:00-21:00	8	\N	t	node	5283244154	\N
1351	Кофе Хауз	\N	\N	55.7737300	37.6559860	\N	\N	\N	8	\N	t	node	5460731523	\N
1352	Шаурмания	\N	\N	55.7741270	37.6556370	\N	\N	24/7	8	\N	t	node	5460731524	\N
1353	Хинкальная	\N	\N	55.7697660	37.6573580	+7 925 1342727	https://xinkalnaya1.ru	Mo-Su 10:00-22:00	8	\N	t	node	5660870482	\N
1354	StarHit	\N	\N	55.7735490	37.6550470	+7 916 9857991	\N	Mo-Su 07:00-23:00	8	\N	t	node	5837965685	\N
1355	Шоколадница	\N	\N	55.7737610	37.6558770	+7 909 9921029	https://shoko.ru	24/7	8	\N	t	node	7131586139	\N
1356	Cofix	\N	\N	55.7737970	37.6557950	+7 800 3508418	https://www.cofix.global	Mo-Su 08:00-22:00	8	\N	t	node	7131586142	\N
1357	Тхань	Новорязанская улица, 25 с1	\N	55.7724010	37.6642660	+7 965 2399345	\N	\N	8	\N	t	node	7724213685	\N
1358	Cofan	\N	\N	55.7697900	37.6596620	\N	\N	Mo-Fr 08:00-23:00; Sa,Su 09:00-22:00	8	\N	t	node	8954185140	\N
1359	Crosby Coffee	\N	\N	55.7693780	37.6589720	+7 999 8010168	https://crosbycoffee.ru	Mo-Fr 08:00-20:00; Sa-Su 09:00-21:00	8	\N	t	node	9835639430	\N
1360	Frank by Баста	\N	\N	55.7726810	37.6627150	+7 495 2281808	https://frankmeat.ru/	Fr-Sa 10:00-02:00; Mo-Th,Su 10:00-23:00	8	\N	t	node	10922175040	\N
1361	Дайсы, миплы, два стола	\N	\N	55.7688430	37.6573540	\N	\N	\N	8	\N	t	node	11208630347	\N
1362	Coffee Time	\N	\N	55.7722490	37.6643840	\N	\N	Mo-Sa 07:30-18:30	8	\N	t	node	11457505515	\N
1363	Щи	\N	\N	55.7742400	37.6550470	+7 936 1868488	\N	24/7	8	\N	t	node	11482410972	\N
1364	Кулинарная лавка братьев Караваевых	\N	\N	55.7725250	37.6620310	+7 495 1217036	https://www.karavaevi.ru	Mo-Su 08:00-23:00	8	\N	t	node	11876981964	\N
1365	Кофемол	\N	\N	55.7699510	37.6607440	\N	\N	\N	8	\N	t	node	11971996572	\N
1366	Tsomi	\N	\N	55.7728530	37.6630640	+7 964 7001007	https://tsomi.ru	Fr-Sa 10:00-02:00; Mo-Th,Su 10:00-23:00	8	\N	t	node	12170022153	\N
1367	Чихо	\N	\N	55.7727730	37.6632090	+7 495 2056796	https://chiho.ru	Fr-Sa 10:00-02:00; Mo-Th,Su 10:00-23:00	8	\N	t	node	12497761498	\N
1368	Атмосфера	\N	\N	55.7701650	37.6607670	\N	\N	\N	8	\N	t	node	13138314016	\N
1389	Dr. Loder	\N	\N	55.7401340	37.5980700	\N	http://www.loder.ru/	\N	15	\N	t	node	1212056547	\N
1390	Pro Trener	\N	\N	55.7428250	37.5986270	+7 495 1503473	http://pro-trener.ru/	\N	15	\N	t	node	6023226146	\N
1391	Ньюфит Арбат	\N	\N	55.7484340	37.5947160	+7 964 5582696	http://www.new-fit.ru	Mo-Su 09:00-22:00	15	\N	t	node	4950376553	\N
1392	Kultura. Fit	улица Арбат, 6/2	\N	55.7518290	37.5972230	\N	\N	Mo-Su 07:00-22:00	15	\N	t	node	13104157601	\N
1393	Smart Fits	\N	\N	55.7557180	37.5963980	+7 495 1206503	http://smart-fits.ru/	Mo-Fr 08:00-21:00; Sa,Su 09:00-21:00	15	\N	t	node	5241764087	\N
1394	Boom Cycle	\N	\N	55.7646000	37.5951610	+7 495 3208585	http://boomcycle.ru	\N	15	\N	t	node	5294751843	\N
1395	Фитнес-студия персонального тренинга Оксаны Щежиной	Старопименовский переулок, 4 с2	Персональные тренировки и тренировки в мини группах - это идеальная среда для самосовершенствования.	55.7686780	37.6010890	+7 915 0560578	https://oxanafit.ru/	09:00-22:00	15	\N	t	node	4281242876	\N
1396	Pro Trener	\N	\N	55.7673470	37.5976950	\N	https://pro-trener.ru/	Mo-Su 07:00-23:00	15	\N	t	node	11290965170	\N
1397	Физкультурно-оздоровительный комплекс	\N	\N	55.7320120	37.6075320	\N	\N	\N	15	\N	t	node	4394658402	\N
1398	World Class	\N	\N	55.7315440	37.6163180	+7 495 7880000	https://spa.worldclass.ru/	Mo-Su 10:00-22:00	15	\N	t	node	7942487110	\N
1399	TerraSport Коперник	\N	\N	55.7383290	37.6138310	8 (495) 225-80-80	https://kopernikfitness.ru/	24/7	15	\N	t	node	9999587117	\N
1400	Crossfit&Fightclub	\N	\N	55.7413520	37.6090730	\N	\N	Mo-Fr 07:00-23:00; Sa,Su 10:00-19:00	15	\N	t	node	6868568776	\N
1401	A-fitness	\N	\N	55.7549110	37.6063090	+7 495 1344435	https://msk.afitness.ru/	Mo 06:30-24:00; Tu-Fr 00:00-01:00,06:30-24:00; Sa 00:00-01:00,08:30-24:00; Su 08:30-24:00	15	\N	t	node	922268626	\N
1402	World Class	\N	\N	55.7541610	37.6093430	+7 495 7279001	https://www.worldclass.ru/	Mo-Fr 00:00-01:00,07:00-24:00; Sa,Su 00:00-01:00,09:00-24:00	15	\N	t	node	5518182497	\N
1403	Top Pilates	\N	\N	55.7575870	37.6068180	+7 495 1366658	http://www.top-pilates.ru	Mo-Fr 07:30-22:00; Sa 09:00-19:00	15	\N	t	node	6347418486	\N
1404	Intuition	Романов переулок, 3/6	\N	55.7540510	37.6068590	+7 905 7510205	https://intuiti-on.ru/	Mo-Su 07:00-24:00	15	\N	t	node	6418209316	\N
1405	Здоровье и спорт	\N	\N	55.7566190	37.6062490	+7 977 7997327	http://zdorsport.ru/	Mo-Fr 09:00-21:00	15	\N	t	node	6883694879	\N
1406	Reboot	\N	\N	55.7531840	37.6098280	+7 495 1288931	https://reboot.ru/	Mo-Fr 07:00-22:00; Sa-Su 10:00-19:30	15	\N	t	node	11304366470	\N
1407	Les Trois Santes	\N	\N	55.7661090	37.6112350	+7 495 2418904	http://sante-fitness.ru	Mo-Fr 06:30-24:00; Sa,Su 08:00-24:00	15	\N	t	node	4763136749	\N
1409	X-Fit Столешников	улица Большая Дмитровка, 13	\N	55.7621840	37.6134380	+7 495 1865052	\N	Mo-Fr 07:00-24:00; Sa-Su 08:00-23:00	15	\N	t	node	7914317420	\N
1410	MyFitlab	Страстной бульвар, 10 к1	\N	55.7662390	37.6113130	+7 499 6817313	https://myfitlab.ru/clubs/pushkinskaya	06:30-24:00	15	\N	t	node	9958963889	\N
1411	World Class	\N	\N	55.7734280	37.6065930	+7 495 7880000	https://www.worldclass.ru/	Mo-Fr 7:00-24:00;Sa-Su 9:00-24:00	15	\N	t	node	5863435086	\N
1412	X-Fit Ленком	улица Малая Дмитровка, 6	\N	55.7679080	37.6065850	+7 495 1410769	https://lenkom.xfit.ru/	Mo-Fr 07:00-24:00; Sa-Su 08:00-23:00	15	\N	t	node	7966361477	\N
1413	BeFit	\N	\N	55.7684620	37.6144400	\N	https://befitstudio.ru	\N	15	\N	t	node	12705696999	\N
1414	TopStretching	\N	\N	55.7437360	37.6284350	+7 800 5004877-11	https://topstretching.com/	Mo,Fr 09:00-22:00; Sa-Su 10:00-18:00; Tu-Th 08:00-22:00	15	\N	t	node	6449522001	\N
1415	WLB	Овчинниковская набережная, 6 с3	\N	55.7457860	37.6279570	+7 985 8325920	http://infernorussia.ru	Mo-Su 07:30-22:00	15	\N	t	node	6183536887	\N
1416	L.a.b space	\N	\N	55.7467500	37.6285330	+7 495 4199754;+7 966 3127779	https://labspacefit.ru/	Mo-Fr 08:00-21:00; Sa-Su 09:00-17:00	15	\N	t	node	11482403565	\N
1417	5fit	\N	\N	55.7670950	37.6256470	\N	\N	\N	15	\N	t	node	5515177542	\N
1418	Kometa.Black	\N	\N	55.7659190	37.6212650	\N	https://kometa.fit/	\N	15	\N	t	node	9779357301	\N
1419	Pure mind	\N	\N	55.7694570	37.6279470	\N	\N	\N	15	\N	t	node	12518113074	\N
1420	ТемаФитнес	\N	\N	55.7378870	37.6398270	+7 495 2310445	https://www.temafitness.ru/	Mo-Fr 07:00-23:00; Sa,Su 09:00-22:00	15	\N	t	node	8085917177	\N
1421	Йога-Практика	Большая Татарская улица, 7 к3	\N	55.7419200	37.6354970	+7 495 9919130	http://www.yoga.ru/centers/moskva/873/	Mo-Su 07:30-22:00	15	\N	t	node	4585067898	\N
1422	Party fitness	\N	\N	55.7405880	37.6356740	\N	\N	\N	15	\N	t	node	9696959117	\N
1423	Ddx	\N	\N	55.7442290	37.6303520	+7 495 2555000	https://www.ddxfitness.ru	Mo-Su 06:00-00:00	15	\N	t	node	11138735101	\N
1424	EMS Fit X Body	\N	\N	55.7588560	37.6394470	\N	\N	\N	15	\N	t	node	5375508321	\N
1425	Sculpt	\N	\N	55.7617600	37.6402140	+7 926 8240704	https://sculptstudio.ru/	Mo-Su 08:00-20:55	15	\N	t	node	2428194688	\N
1426	Activum Style	\N	\N	55.7628730	37.6369030	+7 977 8058696	https://activium.ru/	Mo-Su 09:00-22:00	15	\N	t	node	6225567568	\N
1427	Barre Addict	\N	\N	55.7620730	37.6375210	+7 903 2035491	http://barreaddict.ru/	Mo-Sa 10:00-22:00	15	\N	t	node	6225900459	\N
1428	Авангард	\N	\N	55.7698040	37.6404170	+7 926 9103222	\N	Mo-Su 12:00-22:00	15	\N	t	node	8677638974	\N
1429	Reshape	\N	\N	55.7679090	37.6320270	+7 926 1523613	https://reshape.global/	\N	15	\N	t	node	12472823959	\N
1430	Sunny Gym	\N	\N	55.7364570	37.6451160	+7 495 9517181	http://www.sunnygym.ru	Mo-Fr 07:00-23:00; Sa-Su 09:00-21:00	15	\N	t	node	5134985421	\N
1431	X-Fit Чистые пруды	улица Жуковского, 14 с1	\N	55.7623250	37.6469230	+7 495 1410741	https://chistyeprudy.xfit.ru/	Mo-Fr 07:00-24:00; Sa,Su 08:00-23:00	15	\N	t	node	4332637893	\N
1432	Mind Body Studio	\N	\N	55.7652930	37.6474200	+7 495 9333969	https://worldclass.studio/	Mo-Fr 08:00-21:00;Sa-Su 09:00-19:00	15	\N	t	node	5058629823	\N
1433	Fit-n-Go	\N	\N	55.7349380	37.6606980	\N	\N	\N	15	\N	t	node	6720404428	\N
1434	World Class	Николоямская улица, 36 с1	\N	55.7469870	37.6576680	+7 495 7880000	https://www.worldclass.ru/	Mo-Fr 7:00-24:00;Sa-Su 9:00-24:00	15	\N	t	node	6342038145	\N
1435	Fit-n-Go	\N	\N	55.7561020	37.6556080	\N	\N	Mo-Su 09:00-22:00	15	\N	t	node	5955465346	\N
1436	Crocus Fitness	\N	\N	55.7534030	37.6569610	\N	http://crocusfitness.com/	\N	15	\N	t	node	6802180456	\N
1437	UFC GYM Атриум	\N	\N	55.7578880	37.6592490	+7 495 2553924	https://ufcgymrussia.ru/	Mo-Fr 07:00-24:00;Sa-Su 09:00-24:00	15	\N	t	node	7942478142	\N
1438	just fit	\N	\N	55.7599270	37.6642150	\N	\N	\N	15	\N	t	node	12812340276	\N
1439	Тонус	\N	\N	55.7665850	37.6630570	\N	\N	\N	15	\N	t	node	4924727710	\N
1440	World Class	\N	\N	55.7618400	37.6582610	+7 495 7880000	\N	Mo-Fr 7:00-24:00;Sa-Su 9:00-24:00	15	\N	t	node	7165875162	\N
1441	Ньюфит Комсомольская	\N	\N	55.7721890	37.6620410	+7 985 2275556	http://www.new-fit.ru	Mo-Su 07:30-22:00	15	\N	t	node	4948359021	\N
1442	Библиотека №3 имени Н.А. Добролюбова	Большой Афанасьевский переулок, 35/37	Отдел семейного чтения	55.7493600	37.5961080	\N	\N	\N	24	\N	t	node	5056154804	\N
1443	Научная библиотека им. Н. В. Гоголя	Никитский бульвар, 7	\N	55.7536790	37.5998630	\N	\N	Tu-Sa 10:00-22:00; Su 10:00-20:00	24	\N	t	relation	5371133	\N
1444	Российская государственная библиотека	улица Воздвиженка, 3/5	\N	55.7516630	37.6095340	+7 800 1005790	http://www.rsl.ru	Mo-Fr 09:00-20:00; Sa 09:00-18:00; Su off	24	\N	t	node	3170285115	\N
1445	Библиотека по естественным наукам РАН	\N	\N	55.7493070	37.6059520	+7 495 6912289	https://www.benran.ru/	Mo-Th 10:00-17:00; Fr 10:00-14:00	24	\N	t	way	104226023	\N
1446	Центр восточной литературы РГБ	Моховая улица, 6-8	\N	55.7501770	37.6099190	\N	\N	\N	24	\N	t	relation	3064775	\N
1447	Фонды факультетов МГУ	Моховая улица, 9 с9	\N	55.7535550	37.6109340	\N	\N	\N	24	\N	t	way	31496976	\N
1448	Библиотека им. А.П.Чехова	\N	\N	55.7658920	37.6090630	+7 495 6928397	http://www.chehovka.ru/	Mo-Fr 11:00-19:00	24	\N	t	node	2402553940	\N
1449	Центральная научная библиотека Союза театральных деятелей	\N	\N	55.7661380	37.6100700	\N	\N	Mo-Fr 11:00-19:00	24	\N	t	node	3050575050	\N
1450	Российская государственная библиотека искусств	улица Большая Дмитровка, 8 с2	\N	55.7608480	37.6154840	\N	http://www.liart.ru	Mo-We,Fr 11:00-19:00; Sa 11:00-18:00; Th 11:00-21:00	24	\N	t	relation	2669483	\N
1451	Библиотека киноискусства имени С. М. Эйзенштейна	\N	\N	55.7728080	37.6086810	+7 495 6994178	https://eisenstein.ru/	Tu-Sa 10:00-22:00; Su 10:00-20:00	24	\N	t	node	4073854990	\N
1452	Научная педагогическая библиотека им. К.Д. Ушинского	Большой Толмачёвский переулок, 3	\N	55.7400960	37.6218080	+7 495 9513624	http://www.gnpbu.ru	Mo-Fr 09:30-18:00	24	\N	t	node	4280524655	\N
1453	Российская государственная библиотека искусств	\N	\N	55.7641700	37.6186330	\N	http://www.liart.ru	\N	24	\N	t	node	4837009260	\N
1454	Библиотека № 13 имени Н.Г. Чернышевского	\N	\N	55.7383470	37.6334030	+7 495 9516078	\N	Mo-Sa 10:00-22:00; Su 10:00-20:00	24	\N	t	node	3159130367	\N
1455	Центральная детская библиотека №14	\N	\N	55.7364180	37.6341210	+7 495 9535406	\N	Tu-Sa 10:00-21:00; Su 10:00-20:00	24	\N	t	node	4945836155	\N
1456	Библиотека им. Н.Г. Чернышевского	\N	Детский отдел	55.7451540	37.6388360	\N	\N	Tu-Sa 10:00-21:00; Su 10:00-20:00	24	\N	t	node	4621935278	\N
1457	Президентская библиотека им. Б. Н. Ельцина. Резервный центр в Москве	\N	\N	55.7533560	37.6351400	+7 495 6208091	https://www.prlib.ru	\N	24	\N	t	node	6720584986	\N
1458	Государственная публичная историческая библиотека России	\N	\N	55.7561010	37.6400110	+7 495 6280522;+7 495 6254831	http://www.shpl.ru	Mo-Fr 09:00-22:00; Sa 10:00-18:00; Fr[-1] off	24	\N	t	relation	8412435	\N
1459	Библиотека-читальня им. И. С. Тургенева	Бобров переулок, 6 с1	\N	55.7651430	37.6343570	+7 495 6258247	https://turgenev.ru/	Tu-Sa 10:00-22:00; Su 10:00-20:00	24	\N	t	way	52829438	\N
1460	Научно-медицинская библиотека	\N	\N	55.7731120	37.6338180	\N	\N	Mo-Su 08:00-20:00	24	\N	t	node	6793335328	\N
1461	Российская государственная библиотека искусств	\N	\N	55.7484300	37.6476100	\N	\N	\N	24	\N	t	node	13092684353	\N
1462	Всероссийская государственная библиотека иностранной литературы имени М. И. Рудомино	Николоямская улица, 1	\N	55.7485100	37.6480870	+7 495 9153641	https://libfl.ru	Mo-Fr 11:00-21:00 open; Sa,Su,PH -1 day 11:00-19:00 open; Th[-1] closed санитарный день; PH closed; 2018 Dec 26-2019 Mar 25 closed закрыто на ремонт	24	\N	t	relation	55214	\N
1463	Библиотека №18 имени В.А. Жуковского	Дурасовский переулок, 9	Отдел обменно-репозитарного хранения и внестационарного дифференцированного обслуживания	55.7547930	37.6510300	+7 495 9179678	https://cbscao.ru/about-cbscao/biblioteki/item/biblioteka-18-imeni-v-a-zhukovskogo-otdel-obmenno-repozitarnogo-khraneniya-i-vnestatsionarnogo-differentsirovannogo-obsluzhivaniya-2	Mo-Fr 14:00-18:00 open обслуживание пользователей; Tu[-1] closed санитарный день; Sa-Su,PH closed	24	\N	t	node	5056154806	\N
1464	Детская библиотека-филиал № 6	\N	\N	55.7611790	37.6464640	+7 495 9163306;+7 495 9175303	https://cbscao.ru/about-cbscao/biblioteki/item/biblioteka-19-imeni-f-m-dostoevskogo-otdel-detskikh-initsiativ-2	Tu-Sa 10:00-21:00 open; Su 10:00-20:00 open; Mo closed; Tu[-1] closed санитарный день	24	\N	t	node	1546832168	\N
1465	Библиотека имени Достоевского	\N	\N	55.7602770	37.6466790	+7 495 9173156	https://dostoevskylib.ru/	Tu-Sa 10:00-22:00; Su 10:00-20:00	24	\N	t	node	2469978337	\N
1466	Центральная научная сельскохозяйственная библиотека	\N	\N	55.7716750	37.6472850	\N	www.cnshb.ru	\N	24	\N	t	node	8515930492	\N
1467	Библиотека №16	Новоспасский переулок, 5	Отдел Библиотека префекта ЦАО	55.7339800	37.6542430	\N	\N	\N	24	\N	t	node	5056154818	\N
1468	Центральная библиотека №15 имени В.О. Ключевского	\N	\N	55.7427430	37.6637330	\N	\N	\N	24	\N	t	node	3010222019	\N
1469	Нотно-музыкальная библиотека №17 им. П.И. Юргенсона	\N	\N	55.7497210	37.6614200	+7 495 9112289	https://cbscao.ru/about-cbscao/biblioteki/item/notno-muzykalnaya-biblioteka-17-imeni-p-i-yurgensona-2	Mo off; Tu-Sa 10:00-22:00; Su 10:00-20:00; Tu[-1] off санитарный день	24	\N	t	node	3019853264	\N
1470	Библиотека №18 имени В.А. Жуковского	Лялин переулок, 24/26 с2	\N	55.7568990	37.6532060	+7 495 9163511;+7 495 9173520	https://cbscao.ru/about-cbscao/biblioteki/item/biblioteka-18-imeni-v-a-zhukovskogo-2	Tu-Sa 10:00-22:00; Su 10:00-20:00; Tu[-1] closed санитарный день; Mo,PH closed	24	\N	t	node	5056154805	\N
1471	Центр научно-технической информации РЖД	\N	\N	55.7694040	37.6545510	\N	\N	\N	24	\N	t	node	5556919621	\N
1645	Грановитая палата	\N	\N	55.7505090	37.6166630	\N	\N	\N	4	\N	t	relation	7679578	\N
1574	Дом-музей И. С. Тургенева	улица Остоженка, 37	\N	55.7387180	37.5961510	\N	http://www.pushkinmuseum.ru/?q=content/muzey-turgeneva	We-Su 10:00-18:00; Th 13:00-21:00	4	\N	t	way	76618921	\N
1575	Парк искусств Музеон	Крымский вал, 2	\N	55.7356090	37.6067560	+7 985 3822732	https://www.park-gorkogo.ru/muzeon	24/7	4	\N	t	relation	3224482	\N
1576	Музей Москвы	\N	\N	55.7365800	37.5931900	+7 495 7390008	https://www.mosmuseum.ru/	Tu-Su 10:00-20:00; Th 11:00-21:00	4	\N	t	relation	6011324	\N
1577	Государственный музей А.С.Пушкина	улица Пречистенка, 12/2	\N	55.7440690	37.5968990	+7 495 6375674	http://www.pushkinmuseum.ru/	Tu-We,Fr-Su 10:00-18:00; Th 13:00-21:00	4	\N	t	node	273355916	\N
1578	Государственный музей Л.Н. Толстого	\N	\N	55.7428120	37.5969690	+7 499 7669328	http://tolstoymuseum.ru/museums/museum_branchs/prechistenka	Tu-Su 10:00-18:00; Th 12:00-20:00	4	\N	t	node	2798179186	\N
1579	Государственный музей Л. Н. Толстого	\N	\N	55.7423930	37.5974460	\N	\N	\N	4	\N	t	node	6054425459	\N
1581	Музей шахмат Российской шахматной федерации	\N	\N	55.7477910	37.6004300	\N	http://ruchess.ru/chess_in_museums/museums/museum_tsdsh	\N	4	\N	t	node	3794298653	\N
1582	Музей международного нумизматического клуба	\N	\N	55.7493960	37.5973030	\N	https://coinmuseum.ru/	\N	4	\N	t	node	5581175521	\N
1583	Музей истории телесных наказаний	\N	\N	55.7502450	37.5945940	+7 985 9691404	http://torturemuseum.tilda.ws/	Mo-Su 12:00-22:00	4	\N	t	node	6977883849	\N
1584	Усадьба князей Голицыных	улица Волхонка, 14 с5	\N	55.7464250	37.6041150	\N	http://www.arts-museum.ru/museum/buildings/postimpress/index.php	\N	4	\N	t	way	32693356	\N
1585	Дом Бурганова	Большой Афанасьевский переулок, 15 с9	\N	55.7465390	37.5972310	+7 495 6950429	http://burganov.ru/	Tu-We,Fr-Su 11:00-19:00; Th 11:00-21:00	4	\N	t	way	173172365	\N
1586	Музей изобразительных искусств им. Пушкина	улица Волхонка, 12 с1	\N	55.7472670	37.6051820	+7 495 6979578	\N	\N	4	\N	t	relation	2421978	\N
1587	Мемориальный музей-квартира А. Н. Толстого	\N	\N	55.7585380	37.5966940	\N	\N	\N	4	\N	t	node	2219502268	\N
1588	Московский музей современного искусства	\N	\N	55.7595640	37.5992680	\N	http://www.mmoma.ru	\N	4	\N	t	node	2594744195	\N
1589	Музей искусства народов Востока	\N	\N	55.7563930	37.5998950	+7 495 6910212	https://www.orientmuseum.ru	Tu 11:00-19:30; Fr-Su 11:00-19:30; We-Th 12:00-20:30	4	\N	t	node	2613597034	\N
1590	Мемориальная квартира Святослава Рихтера	\N	\N	55.7599630	37.5974070	+7 495 6958346	http://www.sviatoslav-richter.ru	We-Sa 14:00-20:00; Su 12:00-18:00	4	\N	t	node	4491847389	\N
1591	Мемориальный музей-квартира А. М. Горького	\N	\N	55.7582420	37.5963000	+7 495 6905130	http://www.museum.ru/M402	We-Su 11:00-17:30	4	\N	t	node	4692951498	\N
1592	Art4	\N	\N	55.7578440	37.6029830	+7 499 1365656	http://www.art4.ru/	Mo-Fr 11:00-19:00	4	\N	t	node	5527925431	\N
1593	Дом-музей К. С. Станиславского	Леонтьевский переулок, 6	\N	55.7589490	37.6028200	+7 495 6292855	\N	We,Fr 12:00-19:00; Th-Su 11:00-18:00	4	\N	t	way	205731716	\N
1594	Дом-музей М. Ю. Лермонтова	улица Малая Молчановка, 2	\N	55.7535740	37.5941810	+7 495 6915298	http://goslitmuz.ru/ru/lervontov-museum	Tu-Su 10:00-18:00; Th 14:00-20:00	4	\N	t	way	300426887	\N
1595	Дом-музей М. Н. Ермоловой	Тверской бульвар, 11	\N	55.7599180	37.5995430	+7 495 6905416	http://www.gctm.ru/branches/dme	We-Su 12:00-18:30; Th 13:00-20:30	4	\N	t	way	312412195	\N
1596	Музей Н. В. Гоголя	Никитский бульвар, 7А	\N	55.7541450	37.5998140	+7 495 6905881	http://www.domgogolya.ru/	Tu,We,Fr 12:00-19:00; Th 14:00-21:00; Sa-Su 12:00-18:00	4	\N	t	relation	5371132	\N
1597	Государственный музей М. А. Булгакова	\N	\N	55.7670280	37.5939440	+7 495 6995366	http://bulgakovmuseum.ru	Tu-Su 12:00-19:00	4	\N	t	node	3361538621	\N
1598	Музей-мастерская Людмилы Гурченко	Трёхпрудный переулок, 11/13 с1	\N	55.7657050	37.5949870	\N	\N	\N	4	\N	t	node	5538400321	\N
1599	Мемориальный музей-квартира А.И. Сумбатова-Южина	\N	\N	55.7642800	37.5985980	\N	http://www.maly.ru/yuzhin	\N	4	\N	t	node	6294334620	\N
1600	Нехорошая квартира	\N	\N	55.7670480	37.5939050	\N	\N	\N	4	\N	t	node	11741417323	\N
1601	Музей-квартира М.М. Плисецкой	\N	\N	55.7670820	37.6002340	\N	\N	Mo-Tu off; We-Su 11:00-20:00	4	\N	t	node	12855637229	\N
1602	Государственный центральный музей современной истории России	Тверская улица, 21	\N	55.7661560	37.6016090	+7 495 6995458	http://sovrhistory.ru	Tu,Th-Su 11:00-19:00; We 12:00-21:00	4	\N	t	relation	16685841	\N
1603	Музей русской гармоники А. Мирека	\N	\N	55.7718220	37.5945540	+7 499 2516730	http://www.mosmuseum.ru/museum-menu-mireka.html	Tu,We 10:00-17:30; Th 10:00-20:30; Fr-Su 10:00-16:30	4	\N	t	node	3325191509	\N
1604	Российский национальный музей музыки	улица Фадеева, 4	\N	55.7744980	37.5997440	\N	https://music-museum.ru	\N	4	\N	t	way	24776578	\N
1605	Новая Третьяковка	\N	\N	55.7348090	37.6062270	+7 495 9570727	https://www.tretyakovgallery.ru/for-visitors/museums/novaya-tretyakovka/	Mo off; Tu,We,Sa 10:00-18:00; Th,Fr,Su 10:00-21:00	4	\N	t	node	2468882311	\N
1606	Музей Павла и Сергея Третьяковых	\N	\N	55.7376270	37.6115290	+7 929 515 82 94	https://www.tretyakovgallery.ru/exhibitions/o/muzey-pavla-i-sergeya-tretyakovykh	We-Su 10:00-18:00	4	\N	t	node	9610774317	\N
1608	Дом на набережной	\N	\N	55.7451870	37.6119660	+7 495 9594936	http://www.museum.ru/m427	Tu-Sa 13:00-21:00	4	\N	t	node	1592025111	\N
1609	Музей восстания машин	\N	\N	55.7409470	37.6093690	\N	https://msk.musbot.ru/	Mo-Su 11:00-21:00	4	\N	t	node	8662419217	\N
1610	По сусекам	\N	вт–ср: группы по предварительной записи	55.7437690	37.6108670	+7 916 676 43 68	https://posusecam.ru/	Th-Su 12:00-20:00	4	\N	t	node	9905840317	\N
1612	Московский дом Ахматовой	\N	\N	55.7571300	37.6106750	+7 495 9264114	\N	Tu-Sa 10:00-20:00	4	\N	t	node	2587146329	\N
1613	Музей-квартира Н.С. Голованова	Брюсов переулок, 7	\N	55.7583600	37.6058440	+7 495 6056515-1176	https://music-museum.ru	Tu-Sa 11:00-19:00; Th,Fr 13:00-21:00	4	\N	t	node	5181397887	\N
1614	Мемориальный музей-квартира Тимирязева Климента Аркадьевича	\N	\N	55.7541430	37.6095020	+7 495 6958064	\N	\N	4	\N	t	node	10572977039	\N
1615	Государственный геологический музей им. В. И. Вернадского	Моховая улица, 11 с11	\N	55.7559570	37.6125820	+7 495 6920943	https://www.sgm.ru/	Tu-Fr 11:00-19:00; Sa,Su 12:00-19:00	4	\N	t	way	31482144	\N
1616	Зоологический музей МГУ	Большая Никитская улица, 6	Здание зоологического музея -- одно из первых в Москве, построенное специально под музей.	55.7558770	37.6094680	+7 495 6293948;+7 495 6294435	http://zmmu.msu.ru	Tu-We 10:00-17:00; Th 13:00-20:00; Fr-Su 10:00-17:00; Tu[-1] off	4	\N	t	way	31482160	\N
1617	Исторический музей	Красная площадь, 1	\N	55.7553230	37.6177250	\N	http://www.shm.ru	\N	4	\N	t	relation	5963922	\N
1618	Музей С. С. Прокофьева	\N	\N	55.7601510	37.6144130	+7 495 6920567	https://music-museum.ru/museums/the-prokofiev-museum.html	We-Sa 11:00-19:00; Th 12:00-21:00; Su 11:00-18:00	4	\N	t	node	1161887242	\N
1619	Музей-квартира В. Э. Мейерхольда	\N	\N	55.7600860	37.6099180	+7 495 6295322	https://www.gctm.ru/branch/mkm	We-Su 12:00-19:00	4	\N	t	node	2590877091	\N
1620	Музей-мастерская народного художника СССР Д.А. Налбандяна	8 к2	\N	55.7626270	37.6111320	+7 495 6292872	https://mmoma.ru/	We-Su 12:00-19:00	4	\N	t	node	5073205788	\N
1621	Музей-квартира А. Б. Гольденвейзера	Тверская улица, 17	\N	55.7632310	37.6070260	\N	http://glinka.museum/contacts/muzey-kvartira-a-b-goldenveyzera-.php	\N	4	\N	t	node	5181346005	\N
1622	Центр Гиляровского	\N	\N	55.7634730	37.6153460	+7 495 6373135	http://mosmuseum.ru/association/gilyarovskogo/	Tu-Su 10:00-20:00; Th 11:00-21:00	4	\N	t	node	5543842449	\N
1623	Музей-квартира Александра Солженицына	12 с8	\N	55.7637510	37.6094050	+7 495 6920401	https://www.domrz.ru/solzhenitsyn-museum/	We,Fr-Su 12:00-19:00; Th 14:00-21:00	4	\N	t	node	6232167786	\N
1624	Музей МХАТ	\N	\N	55.7600970	37.6134760	+7 495 6925187;+7 495 6928329;+7 495 6292442;+7 49	https://museummhat.ru	\N	4	\N	t	node	9397686740	\N
1625	Творческая мастерская С.Т. Конёнкова	\N	\N	55.7640260	37.6053070	+7 495 6296139	\N	\N	4	\N	t	node	11323317893	\N
1626	Музей Николая Островского	\N	\N	55.7643160	37.6065220	+7 903 1188932	https://ostrovsky-museum.ru/	Tu-Su 09:00-20:00	4	\N	t	node	11831304488	\N
1627	Музей кино	\N	\N	55.7727890	37.6088160	\N	https://museikino.ru	\N	4	\N	t	node	12451669493	\N
1628	Всероссийский музей декоративно-прикладного и народного искусства	\N	\N	55.7745490	37.6102450	+7-495-6090146	https://damuseum.ru/	Tu-Su 10:00-18:00; Th 10:00-21:00; Sa 12:00-20:00	4	\N	t	relation	12265556	\N
1629	Рудно-петрографический музей	\N	\N	55.7376380	37.6212790	+7 499 2308292	http://igem.ru/muzei/muzei.html	Mo-Fr 11:00-17:00; PH Off	4	\N	t	node	11780094310	\N
1630	Музей Русского Афона	1-й Хвостов переулок, 3 с1	\N	55.7348490	37.6183080	\N	http://templeofnikita.moseparh.ru/muzej-russkij-afon/	Mo-Su 10:00-17:00	4	\N	t	node	11916294313	\N
1631	Музей В.А. Тропинина и московских художников его времени	Щетининский переулок, 10 с1	\N	55.7337990	37.6227880	+7 495 9591103	https://www.museum-tropinina.ru/	Th 13:00-21:00; Tu-We,Fr-Su 10:00-18:00	4	\N	t	way	164210810	\N
1632	Дом-музей А.Н. Островского	\N	\N	55.7387980	37.6263810	+7 495 9538684	http://www.gctm.ru/branches/dmo	We-Su 12:00-18:30; Th 13:00-20:30	4	\N	t	node	1359123836	\N
1633	Музей Игоря Талькова	\N	\N	55.7436560	37.6262590	\N	http://www.talkov.su/museum.php	We-Sa 12:00-18:00; Su 12:00-17:00	4	\N	t	node	3503097494	\N
1634	Театральная галерея на Малой Ордынке	\N	\N	55.7387310	37.6258700	+7 495 9531245	http://bakhrushin.theatre.ru/branches/mo	We,Th 13:00-21:00; Fr-Su 12:00-19:00	4	\N	t	node	4139540604	\N
1635	Музей ОСАО «Ингосстрах»	\N	\N	55.7430910	37.6265750	+7 967 1505287	\N	\N	4	\N	t	node	4749731883	\N
1636	Кадашевская слобода	\N	\N	55.7430160	37.6229030	+7 925 1311906	http://museumkadashi.com	\N	4	\N	t	node	5054946060	\N
1637	Стрелецкие палаты	\N	\N	55.7411620	37.6224040	\N	http://www.museumrvio.ru/streltsy-chamber/	\N	4	\N	t	node	5754225235	\N
1638	Московский музей Рахманинова	улица Большая Ордынка, 6/2 с1	\N	55.7442310	37.6242060	\N	\N	\N	4	\N	t	node	12803628465	\N
1639	Третьяковская галерея. Инженерный корпус	Лаврушинский переулок, 12	\N	55.7408750	37.6206440	\N	https://www.tretyakovgallery.ru/for-visitors/museums/inzhenernyy-korpus/	Tu-Su 10:00-18:00; Th-Sa 10:00-21:00	4	\N	t	way	53548436	\N
1640	Филиал Государственного музея Л.Н. Толстого	Пятницкая улица, 12 с1	\N	55.7433460	37.6278810	\N	\N	\N	4	\N	t	way	79980545	\N
1641	Третьяковская галерея на Кадашёвской набережной	Кадашёвская набережная, 12	\N	55.7429850	37.6188300	\N	\N	\N	4	\N	t	way	642091604	\N
1642	Третьяковская галерея	Лаврушинский переулок, 10	\N	55.7413620	37.6201820	+7 495 9570727	https://www.tretyakovgallery.ru/for-visitors/museums/tretyakovskaya-galereya/	Tu-Su 10:00-18:00; Th-Sa 10:00-21:00	4	\N	t	relation	1907261	\N
1643	Подземный музей	\N	\N	55.7500060	37.6288120	\N	\N	\N	4	\N	t	node	5022259604	\N
1644	Патриаршие палаты	\N	\N	55.7511530	37.6166850	\N	\N	\N	4	\N	t	relation	1359248	\N
1646	Дом бояр Романовых	улица Варварка, 10	\N	55.7527390	37.6291160	+7 495 6981256	http://www.shm.ru/museum/pbr/	\N	4	\N	t	relation	19077852	\N
1647	Археологический выставочный комплекс Старый Гостиный двор	\N	\N	55.7538790	37.6277980	\N	https://dkn.mos.ru/popularization/the-old-gostiny-dvor/	\N	4	\N	t	node	3501032524	\N
1648	Центральный музей МЧС России	\N	\N	55.7595450	37.6222910	\N	\N	\N	4	\N	t	node	5507326929	\N
1649	Музей Отечественной войны 1812 года	площадь Революции, 2/3	\N	55.7562720	37.6186900	+7 495 6924019	https://shm.ru/museum/mov	Su-Th 10:00-18:00; Fr-Sa 10:00-21:00	4	\N	t	node	6055217813	\N
1650	Музей археологии Москвы	1А	\N	55.7563280	37.6171790	\N	https://mosmuseum.ru/association/archeology	\N	4	\N	t	node	6061084594	\N
1651	Оружейный подвал	\N	\N	55.7569370	37.6217780	+7 916 5384951	https://podval-museum.ru/	Mo-Fr 11:00-20:00; Sa-Su 10:00-20:00	4	\N	t	node	12309870570	\N
1653	Музей детства	\N	\N	55.7603940	37.6249680	\N	\N	Mo-Su 10:00-22:00	4	\N	t	node	3441521467	\N
1654	Музей экслибриса и миниатюрной книги	\N	\N	55.7609080	37.6229450	\N	https://knigoluby.ru/	Mo-Fr 10:00-17:00	4	\N	t	node	6008487169	\N
1655	Музей советских игровых автоматов	\N	\N	55.7644080	37.6237620	\N	http://www.15kop.ru	Mo-Su 11:00-21:00	4	\N	t	node	7887532120	\N
1656	Выставочный зал Московского союза художников	\N	\N	55.7613360	37.6237910	+7 495 6247952	https://artanum.ru/	Mo-Su 12:00-19:00	4	\N	t	node	12600924997	\N
1657	Московский дом художника	улица Кузнецкий Мост, 11 с1	\N	55.7622490	37.6222190	+7 495 6242450	http://www.mdx.ru/	Mo-Sa 11:00-19:00	4	\N	t	relation	2669510	\N
1658	Государственный центральный театральный музей им. А. А. Бахрушина	\N	\N	55.7317890	37.6380940	\N	\N	\N	4	\N	t	node	273356351	\N
1659	Московский музей образования	\N	\N	55.7360350	37.6298230	\N	\N	Mo-Su 11:00-17:00; Fr off; Th[1] off	4	\N	t	node	3503058809	\N
1660	РотФронт	\N	\N	55.7339130	37.6319680	\N	https://www.uniconf.ru/about/museums/rot-front/	\N	4	\N	t	node	4994579237	\N
1661	Бункер-703	\N	\N	55.7343440	37.6302820	+79265588707	https://bunker703.ru/	\N	4	\N	t	node	7804955746	\N
1662	Российский музей леса	5-й Монетчиковский переулок, 4	Новодел. Здание реконструирует утраченный при пожаре особняк XIX века.	55.7327900	37.6336930	\N	http://museum.forest.ru/inf.html	We-Th 11:00-19:00; Fr-Su 10:00-18:00	4	\N	t	way	53830818	\N
1663	Особняк-Небылица	Озерковский переулок, 1/18	\N	55.7410200	37.6376380	\N	https://москва-небылица.рф/	\N	4	\N	t	node	12891738501	\N
1664	Мемориальная музей-квартира Г.М. Кржижановского	\N	\N	55.7462900	37.6333280	\N	http://www.sovr.ru/contact/krzhizhanovsky/	Mo,We,Fr 10:00-18:00; Tu,Th,Sa 11:00-19:00	4	\N	t	node	6303242526	\N
1666	Музей В.В. Маяковского	\N	\N	55.7594890	37.6294800	+7 495 6219075	http://mayakovsky.museum	\N	4	\N	t	node	1106845052	\N
1667	Музей Императорского православного палестинского общества	\N	\N	55.7551260	37.6381340	+7 495 7975595	https://www.ippo.ru/about/centre/1/1/	We,Fr 13:00-18:00; Sa 13:00-17:00	4	\N	t	node	3500887936	\N
1668	Музей Ю.В. Никулина	\N	\N	55.7578000	37.6330770	\N	https://www.fond-nikulin.ru/o-muzee.html	Mo-Fr 10:00-18:00	4	\N	t	node	3500891969	\N
1669	Музей Златоустовского монастыря	\N	\N	55.7590460	37.6341100	+7 977 8524629	\N	Mo 18:00-20:00; Su 12:00-14:00	4	\N	t	node	6990965187	\N
1670	РОСИЗО	\N	\N	55.7567230	37.6366480	\N	https://rosizo.ru/	Tu-Su 11:00-20:00; Th-Sa 11:00-21:00	4	\N	t	node	9978554504	\N
1671	Музей книги	\N	\N	55.7604290	37.6406680	\N	\N	\N	4	\N	t	node	2511951122	\N
1672	Музей рециклинга и экологичного образа жизни	\N	Музей рециклинга и экологичного образа жизни знакомит посетителей с проблемой образования отходов и загрязнения окружающей среды.	55.7618470	37.6403380	+7 499 4904258	https://ecosborka.ru/muzej-reciklinga	Mo-Th 14:00-21:00; Fr 11:00-21:00; Sa-Su 11:00-20:00	4	\N	t	node	10263479155	\N
1673	Музей ПАО Лукойл	\N	\N	55.7665730	37.6354400	+7 968 8021040	https://museum.lukoil.ru/ru	\N	4	\N	t	node	11809152313	\N
1674	Огни Москвы	Армянский переулок, 3	\N	55.7608580	37.6354790	+7 495 624 73 74	http://ognimos.ru	Su-We 10:00-18:00; Th, Sa 12:00-20:00; Fr 12:00-22:00	4	\N	t	way	204855051	\N
1675	Музей скорой помощи	\N	\N	55.7737620	37.6373170	\N	https://mos03.ru/rubrics/about-the-museum/informatsiya-o-muzee-ssinmp-im-a-s-puchkova/	\N	4	\N	t	node	5108493980	\N
1676	Музей истории органов внутренних дел Москвы	\N	\N	55.7672570	37.6317870	+7 495 6231694	\N	\N	4	\N	t	node	7147335439	\N
1677	Музей русского лубка и наивного искусства	Малый Головин переулок, 10 с1	\N	55.7690110	37.6344020	+7 495 6085221	https://naive-museum.ru/	We,Fr 12:00-19:00; Th 12:00-21:00; Sa-Su 12:00-18:00	4	\N	t	way	36358910	\N
1678	Дом-музей и экспедиционный штаб Федора Конюхова	\N	\N	55.7354620	37.6437880	\N	\N	\N	4	\N	t	node	10015992717	\N
1679	Я Музей	\N	\N	55.7353050	37.6426370	\N	\N	\N	4	\N	t	node	13176871061	\N
1680	Музей холодной войны (экспозиционный комплекс Бункер-42)	5-й Котельнический переулок, 11	\N	55.7416460	37.6491080	+7 495 5000553	http://www.bunker42.com	24/7	4	\N	t	node	1733057309	\N
1681	Дом Высоцкого на Таганке	\N	Museum to Vladimir Vysotsky (1938 - 1980), famous Russian bard, actor and poet.	55.7444770	37.6518180	+7 495 9152979	www.visotsky.ru	Tu-We,Fr 11:00-18:00; Sa-Su 11:00-17:00; Th 13:00-21:00	4	\N	t	node	2715045290	\N
1682	Музей русского зарубежья	\N	\N	55.7427960	37.6508730	\N	https://www.domrz.ru/exposition/	\N	4	\N	t	node	10796949181	\N
1683	Центральный пограничный музей ФСБ России	\N	\N	55.7508200	37.6455570	+7 495 9173104	www.svrpu.ru	\N	4	\N	t	node	2250142414	\N
1684	Музей-квартира Г. С. Улановой	\N	\N	55.7466120	37.6418980	\N	https://www.gctm.ru/branches/mku/	\N	4	\N	t	node	3500852153	\N
1685	Галерея Гари Татинцяна	\N	\N	55.7500260	37.6499990	+7 495 6454404	https://tatintsian.com/	Tu-Fr 12:00-20:00; Sa 12:00-18:00	4	\N	t	node	4887671022	\N
1686	Собрание	улица Солянка, 16	\N	55.7506090	37.6417430	\N	https://mus-col.com/	\N	4	\N	t	node	5906743571	\N
1687	Российский музей медицины	\N	\N	55.7519590	37.6492170	+74959177834	https://medmuseum.ru/ru/	Mo-Fr 10:00-18:00	4	\N	t	node	8664353717	\N
1688	Музей русской иконы	Гончарная улица, 3 с3	\N	55.7463160	37.6454390	+7 495 2215283	http://www.russikona.ru	Mo-Tu,Sa-Su 11:00-19:00; Th-Fr 11:00-21:00	4	\N	t	way	151077489	\N
1689	Музей уникальных кукол	\N	Среда - экскурсионный день, в 12:00 и в 16:00 экскурсии для всех желающих, четверг - воскресенье 11:00 - 19:00, перерыв 14:00 - 14:30. В дни школьных каникул музей открыт ежедневно, кроме понедельника, с 11:00 до 19:00.	55.7593070	37.6445090	+7 495 6256405	http://dollmuseum.ru	We 12:00-17:00; Th-Su 11:00-14:00,14:30-19:00	4	\N	t	node	3206046372	\N
1690	Музей-квартира А.М. Васнецова	\N	\N	55.7637960	37.6487270	+7 495 6089045	https://www.tretyakovgallery.ru/ru/visitors/address/flatamvasn/	Tu-Sa 10:00-17:00	4	\N	t	node	3502941745	\N
1691	Усыпальница бояр Романовых	\N	\N	55.7318120	37.6563240	\N	\N	\N	4	\N	t	node	3484120452	\N
1692	Музей эмоций	\N	\N	55.7590260	37.6646060	\N	https://museumofemotions.ru/	Mo-Su 11:00-21:00	4	\N	t	node	7734616141	\N
1693	Artdynamics	\N	\N	55.7606760	37.6642760	\N	\N	\N	4	\N	t	node	7734616137	\N
1694	Дом-музей Матвея Муравьева-Апостола	Старая Басманная улица, 23/9 с1	\N	55.7672700	37.6646230	+7 916 5184725	https://ma-housemuseum.ru/	We 14:00-20:00; Sa 14:00-19:00	4	\N	t	way	35693441	\N
1697	Четыре времени года	\N	\N	55.7543760	37.6135740	\N	\N	\N	10	\N	t	way	1219452672	\N
1698	Купола	\N	\N	55.7549060	37.6134570	\N	\N	\N	10	\N	t	relation	1362324	\N
1700	Купола	\N	\N	55.7551360	37.6137150	\N	\N	\N	10	\N	t	relation	6233740	\N
1701	Купола	\N	\N	55.7546600	37.6131810	\N	\N	\N	10	\N	t	relation	6233741	\N
1702	Театральный	\N	\N	55.7592370	37.6191210	\N	\N	\N	10	\N	t	way	417580495	\N
1703	Адам и Ева	\N	\N	55.7419490	37.6290080	\N	\N	\N	10	\N	t	way	75655995	\N
1704	Патриаршие пруды	\N	\N	55.7638680	37.5921490	\N	\N	\N	19	\N	t	relation	6897199	\N
1705	Чистый пруд	\N	\N	55.7610580	37.6446520	\N	\N	\N	19	\N	t	relation	9051984	\N
1706	Новоспасский пруд	\N	\N	55.7314660	37.6545030	\N	\N	\N	19	\N	t	way	23359303	\N
1707	Сквер Тургенева	\N	\N	55.7382630	37.5958350	\N	\N	\N	1	\N	t	way	289507858	\N
1708	Парк Горького	Крымский вал, 9	\N	55.7300590	37.6021940	\N	http://www.park-gorkogo.com	24/7	1	\N	t	relation	2791365	\N
1709	Сквер Громыко	\N	\N	55.7343360	37.5946390	\N	\N	\N	1	\N	t	relation	6107816	\N
1710	Гоголевский бульвар	\N	\N	55.7479100	37.6006590	\N	\N	\N	1	\N	t	relation	1791081	\N
1711	Сквер Киселева	\N	\N	55.7525290	37.5971270	\N	\N	\N	1	\N	t	way	307795782	\N
1713	Сад скульптур	\N	\N	55.7473880	37.5959070	\N	\N	\N	1	\N	t	relation	7891546	\N
1714	сквер им. Муслима Магомаева	\N	\N	55.7600020	37.6052080	\N	\N	\N	1	\N	t	way	174929171	\N
1715	Сквер ТАСС	\N	\N	55.7576730	37.5994690	\N	\N	\N	1	\N	t	way	1339778351	\N
1717	Сквер Булгакова	\N	\N	55.7632370	37.5960060	\N	\N	\N	1	\N	t	way	211651325	\N
1718	Сад Аквариум	\N	\N	55.7676740	37.5954500	\N	\N	\N	1	\N	t	relation	1257787	\N
1719	Новопушкинский сквер	\N	\N	55.7643640	37.6037450	\N	\N	\N	1	\N	t	relation	3571217	\N
1720	Пушкинский сквер	\N	\N	55.7655960	37.6059540	\N	\N	\N	1	\N	t	relation	3571611	\N
1721	Патриаршие пруды	\N	\N	55.7640250	37.5922600	\N	\N	\N	1	\N	t	relation	6897180	\N
1723	Садово-триумфальный сквер	\N	\N	55.7716500	37.6007740	\N	\N	\N	1	\N	t	relation	1416090	\N
1726	Репинский сквер	\N	\N	55.7451630	37.6176670	\N	\N	\N	1	\N	t	relation	13629175	\N
1727	Тайницкий Сад	\N	\N	55.7502890	37.6178730	\N	\N	\N	1	\N	t	relation	1360677	\N
1728	Александровский сад	\N	\N	55.7516320	37.6137970	\N	\N	\N	1	\N	t	relation	1362325	\N
1729	Сквер Антоновой	\N	\N	55.7469720	37.6061570	\N	\N	\N	1	\N	t	relation	13946841	\N
1731	сквер Мстислава Ростроповича	\N	\N	55.7590060	37.6067440	\N	\N	\N	1	\N	t	way	205734958	\N
1732	сквер Строителей Москвы	\N	\N	55.7557230	37.6077060	\N	\N	\N	1	\N	t	way	251330231	\N
1734	Нарышкинский сквер	\N	\N	55.7673920	37.6111740	\N	\N	\N	1	\N	t	way	23378656	\N
1736	Сквер Майи Плисецкой и Родиона Щедрина	\N	\N	55.7618300	37.6146540	\N	\N	\N	1	\N	t	way	243423040	\N
1739	Тверской сквер	\N	\N	55.7739560	37.6074410	\N	\N	\N	1	\N	t	relation	4662868	\N
1740	Сад «Эрмитаж»	\N	Памятник садово-паркового искусства. Сад Эрмитаж. XIX-XXI в.в. Охраняется государством. Год основания 1894	55.7707520	37.6091470	+7 495 6990849	http://mosgorsad.ru	24/7	1	\N	t	relation	6741551	\N
1741	Парк «Екатерининская больница»	\N	Объект культурного наследия (произведение садово-паркового искусства) регионального значения. XIX в. Охраняется государством.	55.7693430	37.6114630	\N	\N	Sa-Su 08:00-21:00; PH 08:00-21:00	1	\N	t	relation	7251259	\N
1742	Образцов-парк	\N	\N	55.7744600	37.6142680	\N	\N	\N	1	\N	t	relation	13670812	\N
1743	Сквер Ислама Каримова	\N	\N	55.7345630	37.6199270	\N	\N	\N	1	\N	t	relation	9484528	\N
1744	Сквер Шмелёва	\N	\N	55.7407370	37.6222100	\N	\N	\N	1	\N	t	relation	13627433	\N
1747	Большой Кремлёвский сквер	\N	\N	55.7511850	37.6200750	\N	\N	\N	1	\N	t	relation	1360699	\N
1748	парк «Зарядье»	\N	\N	55.7509330	37.6290670	+7 495 5310500	https://www.zaryadyepark.ru/	24/7	1	\N	t	relation	1555621	\N
1750	Сквер у памятника Карлу Марксу	\N	\N	55.7581630	37.6196640	\N	\N	\N	1	\N	t	relation	7193002	\N
1751	Музейный парк	\N	\N	55.7588600	37.6279570	\N	\N	\N	1	\N	t	relation	7750047	\N
1752	сквер Цветной Бульвар	\N	\N	55.7702920	37.6218850	\N	\N	\N	1	\N	t	relation	2985852	\N
1753	Самотёчный бульвар	\N	\N	55.7758280	37.6192430	\N	\N	\N	1	\N	t	relation	5290727	\N
1754	сквер Ополченцев Замоскворечья	\N	\N	55.7343110	37.6342560	\N	\N	\N	1	\N	t	relation	7672227	\N
1755	Павелецкий парк	\N	\N	55.7310340	37.6388770	\N	\N	\N	1	\N	t	relation	13238897	\N
1757	Ильинский сквер	\N	\N	55.7556880	37.6324530	\N	\N	\N	1	\N	t	relation	1268321	\N
1758	Парк Горка	\N	\N	55.7559370	37.6360600	\N	\N	\N	1	\N	t	relation	7458555	\N
1759	Сквер Мандельштама	\N	\N	55.7551330	37.6389280	\N	\N	\N	1	\N	t	relation	7520849	\N
1761	Сквер Полководцев	\N	\N	55.7622420	37.6390720	\N	\N	\N	1	\N	t	relation	7400861	\N
1762	Устьинский сквер	\N	\N	55.7493320	37.6431300	\N	\N	\N	1	\N	t	relation	3571213	\N
1763	Морозовский сад	\N	\N	55.7555480	37.6438890	\N	\N	\N	1	\N	t	relation	7151077	\N
1764	Милютинский парк	\N	\N	55.7562830	37.6469400	\N	\N	07:00-21:30	1	\N	t	relation	7621467	\N
1765	Даниловская аллейка	\N	\N	55.7568950	37.6424120	\N	\N	\N	1	\N	t	relation	16345621	\N
1766	Сквер Генерала армии А.В.Хрулёва	\N	\N	55.7657220	37.6482780	\N	\N	\N	1	\N	t	way	758586236	\N
1767	Сквер «Огородная слобода»	\N	\N	55.7649120	37.6427460	\N	\N	\N	1	\N	t	relation	7997754	\N
1768	Сквер у Красных Ворот	\N	\N	55.7680870	37.6491690	\N	\N	\N	1	\N	t	way	251140386	\N
1769	Лермонтовский сквер	\N	\N	55.7695020	37.6517950	\N	\N	\N	1	\N	t	relation	10583889	\N
1770	Детский Таганский парк	\N	\N	55.7412270	37.6624530	\N	\N	Mo-Su 07:00-23:00	1	\N	t	way	340463450	\N
1771	Парк усадьбы Усачёвых-Найдёновых	\N	\N	55.7514160	37.6592750	\N	\N	\N	1	\N	t	relation	1840616	\N
1772	Сквер у Сивякова переулка	\N	\N	55.7495040	37.6570620	\N	\N	\N	1	\N	t	relation	3963767	\N
1773	Верхний Сыромятнический сквер	\N	\N	55.7550920	37.6596040	\N	\N	\N	1	\N	t	relation	4170256	\N
1774	Чкаловский сквер	\N	\N	55.7634810	37.6572540	\N	\N	\N	1	\N	t	way	175084614	\N
1775	Сад им. Н. Э. Баумана	\N	\N	55.7675670	37.6596550	\N	http://www.sadbaumana.ru	Mo-Su 06:00-24:00	1	\N	t	relation	2377386	\N
1776	Ласточкино гнездо	\N	\N	55.7629560	37.6548940	\N	\N	\N	1	\N	t	relation	7793088	\N
1779	КидБург	\N	\N	55.7601370	37.6250140	+7 499 1137292	https://kidburg.ru/	Fr-Su 10:00-22:00; Mo-Th 10:00-20:00	22	\N	t	node	11016554435	\N
1780	Маша и медведь	\N	\N	55.7560860	37.6500700	\N	\N	\N	22	\N	t	way	563078491	\N
1781	Пушкинская школа № 1500 Дошкольное отделение	\N	\N	55.7698580	37.6495630	\N	\N	\N	22	\N	t	way	158036921	\N
1782	Детский городок	\N	\N	55.7676550	37.6602930	\N	\N	\N	22	\N	t	way	337042437	\N
1783	Жигули	улица Новый Арбат, 11 с1	\N	55.7522410	37.5967490	+7 495 9849156	http://www.zhiguli.su	Su-Th 12:00-02:00; Fr-Sa 12:00-04:00	6	\N	t	node	3342282885	\N
1784	Abbey Players	\N	\N	55.7526780	37.5981410	+7 495 0980048	https://abbeyplayerstheatre.ru	Mo-Fr 12:00-24:00; Sa,Su 00:00-06:00,12:00-24:00	6	\N	t	node	6959964049	\N
1785	Busby	\N	\N	55.7554700	37.6005390	+7 968 8577573	\N	\N	6	\N	t	node	813972222	\N
1786	Big Jim’s	\N	\N	55.7573200	37.6024980	+7 495 1392577	http://bjpub.ru/	Fr-Sa 12:00-06:00; Mo-Th,Su 12:00-24:00	6	\N	t	node	3656471078	\N
1787	Crafter	\N	\N	55.7651240	37.6023560	+7 968 0298842	http://www.crafterbar.ru	Mo-Su 12:00-24:00	6	\N	t	node	3744149102	\N
1788	ye olde Flying Inn	\N	\N	55.7702970	37.5963350	\N	\N	\N	6	\N	t	node	1936864926	\N
1789	Tweed & Stout	\N	\N	55.7710010	37.5964840	\N	\N	Mo-Su 12:00-23:00	6	\N	t	node	5642207216	\N
1790	Borrachitos	\N	\N	55.7676620	37.6024820	+7 926 1297805	\N	Mo-Fr 16:00-24:00; Sa,Su 00:00-01:00,16:00-24:00	6	\N	t	node	5730559771	\N
1791	Трубы горят	улица Малая Якиманка, 24	\N	55.7373240	37.6167160	\N	https://www.instagram.com/bar_truby_goryat/	Su-Th 14:00-24:00, Fr,Sa 14:00-02:00	6	\N	t	node	8794643439	\N
1792	Sally O'Brien's	\N	\N	55.7417740	37.6164280	\N	\N	\N	6	\N	t	node	1417517782	\N
1793	Вильям Басс	\N	\N	55.7400110	37.6159770	+7 495 778 18 74;+7 901 517 40 17	http://www.rmcom.ru/page-william-bass	Mo-Th 12:00-00:00; Fr 12:00-02:00; Sa-Su 12:00-00:00	6	\N	t	node	2412093665	\N
1794	St.Peters & St.Anton	\N	\N	55.7564090	37.6097460	+7 495 6266801	http://www.realpub.ru	\N	6	\N	t	node	2575496531	\N
1795	69 pints	\N	\N	55.7580690	37.6122060	+7 916 9210148	\N	Mo-Su 11:00-23:00	6	\N	t	node	2586900329	\N
1796	Beer&Balls	\N	\N	55.7531940	37.6103960	\N	https://beerballs.ru/	Mo-Th 11:00-23:00; Fr 11:00-24:00; Sa 00:00-01:00,11:00-24:00; Su 00:00-01:00,11:00-23:00	6	\N	t	node	12537235128	\N
1797	Chelsea	\N	\N	55.7624120	37.6063870	+7 495 6296688	http://chelsea-pub.ru	24/7	6	\N	t	node	2461679570	\N
1798	Tap&Barrel	\N	\N	55.7623910	37.6131910	+7 495 6362904	http://tbpub.ru	Mo-Su 12:00-24:00; Fr,Sa 12:00-06:00	6	\N	t	node	3183761039	\N
1799	The Cross Keys	\N	\N	55.7672040	37.6061640	+7 495 6362955	http://crosskeyspub.ru/	Mo-Fr 12:00-24:00; Sa,Su 00:00-06:00,12:00-24:00	6	\N	t	node	4521575849	\N
1800	Connolly station	\N	\N	55.7622390	37.6127440	+7 499 6782144	\N	Fr-Sa 12:00-03:00; Tu-Th 12:00-01:00; Su-Mo 12:00-24:00	6	\N	t	node	4557354216	\N
1801	8 градусов	\N	\N	55.7651490	37.6084040	\N	https://bar8.ru/	Mo-Su 00:00-02:00,16:00-24:00	6	\N	t	node	7775914286	\N
1802	Buddy McDaniel	\N	\N	55.7718070	37.6049400	\N	https://mcdaniel.ru/	\N	6	\N	t	node	2531873560	\N
1803	Paulaner Wirtshaus	\N	\N	55.7348330	37.6197130	+7 495 3804806	http://paulaner-brauhaus.ru	Su-Th 12:00-24:00; Fr-Sa 12:00-02:00	6	\N	t	node	8104894082	\N
1804	Молли Гвинн'з	Пятницкая улица, 24	\N	55.7411810	37.6283760	+7 495 9595852	http://www.rmcom.ru/page-molly-gwynns	Mo-Th 12:00-24:00; Fr-Sa 12:00-02:00; Su 12:00-24:00	6	\N	t	node	745271763	\N
1805	Punch & Judy	\N	\N	55.7445690	37.6273470	+7 495 0980004	http://pjpub.ru	Fr,Sa 12:00-06:00; Mo-Su 12:00-24:00	6	\N	t	node	1142038127	\N
1806	Black Harp	\N	\N	55.7429450	37.6275890	+7 985 7502110	http://blackharppub.ru/	Mo-Fr 16:00-24:00; Sa,Su 00:00-02:00,16:00-24:00	6	\N	t	node	4676902691	\N
1807	Подозрительные лица	\N	\N	55.7456660	37.6264150	+7 495 9200977	\N	Mo-Fr 13:00-23:00; Sa,Su 14:00-23:00	6	\N	t	node	4884458841	\N
1808	Oldschool	\N	\N	55.7564760	37.6271330	+7 495 6257980	http://ospub.ru/	24/7	6	\N	t	node	2214457504	\N
1809	Дублинец	\N	\N	55.7576170	37.6243600	+7 495 9660906	https://dublinerpub.ru/	Mo,Tu 12:00-24:00; We-Fr 00:00-01:00,12:00-24:00; Sa,Su 00:00-03:00,12:00-24:00	6	\N	t	node	6258395545	\N
1810	Union Jack	\N	\N	55.7653030	37.6216640	+7 495 6211963	http://unionj.su	Mo-Su 12:00-23:00	6	\N	t	node	1756961154	\N
1811	Kuzmost	\N	\N	55.7618410	37.6240630	+7 495 6240710;+7 999 8177804	https://pubmoscow.ru/kuzmost_pub	Fr-Sa 12:00-02:00; Mo-Th,Su 12:00-24:00	6	\N	t	node	2992105965	\N
1812	Mandy’s Apothecary	\N	\N	55.7619970	37.6260360	+7 926 4114104	\N	Mo-Fr 00:00-02:00,12:00-24:00; Sa,Su 00:00-04:00,12:00-24:00	6	\N	t	node	3002643691	\N
1813	Sean O'Neill	\N	\N	55.7620530	37.6218380	+7 495 6320131	\N	Su,Mo 12:00-24:00, Tu-Th 12:00-01:00, Fr,Sa 12:00-03:00	6	\N	t	node	3028683361	\N
1814	The White Hart	\N	\N	55.7621920	37.6203590	+7 495 6362855	http://whitehart.ru	Su-Th 12:00-24:00, Fr,Sa 12:00-06:00	6	\N	t	node	3234457059	\N
1815	Harat's	\N	\N	55.7608880	37.6227280	+7 499 4000323	https://moscow.harats.com	\N	6	\N	t	node	9885958895	\N
1816	Свинья и роза	\N	\N	55.7689660	37.6248710	+7 905 7640444	http://www.pigandrose.me/	Mo-Fr 11:00-24:00; Sa,Su 00:00-02:00,11:00-24:00	6	\N	t	node	3410453523	\N
1865	Il Forno	\N	\N	55.7439630	37.6020240	+7 495 6952998	http://www.ilforno.ru	Mo-Fr 08:00-24:00; Sa,Su 11:00-24:00	7	\N	t	node	2229548551	\N
1817	На кранах	\N	\N	55.7718200	37.6194290	+7 915 1773787	https://instagram.com/nakranakh	Sa 14:00-06:00; Su 14:00-24:00; Mo-Th 12:00-24:00; Fr 12:00-03:00	6	\N	t	node	3818709630	\N
1818	Michael Collins	\N	\N	55.7719850	37.6199680	\N	\N	Mo,Tu 12:00-24:00; We-Fr 00:00-01:00,12:00-24:00; Sa,Su 00:00-03:00,12:00-24:00	6	\N	t	node	6111673099	\N
1819	Red Lion	\N	\N	55.7742010	37.6179390	\N	https://redlionpub.ru/	Mo,Tu 12:00-24:00; We-Su 00:00-05:00,12:00-24:00	6	\N	t	node	9696184621	\N
1820	Белфаст	Средний Овчинниковский переулок, 1 с13	Ирландский деревенский паб	55.7452540	37.6307190	+7 926 9471287	http://www.belfast-pub.ru/	Mo-Th 12:00-24:00, Fr 12:00-02:00, Sa 15:00-02:00, Su 15:00-24:00	6	\N	t	node	1352490952	\N
1821	Гроссбир	Большой Овчинниковский переулок, 18	\N	55.7436280	37.6302440	+7 499 2388832	https://grossbeer.ru/	Mo-Fr 11:00-24:00; Sa-Su 12:00-24:00	6	\N	t	node	1394761600	\N
1822	O'Donoghue's	\N	\N	55.7408480	37.6291050	+7 495 0980338	https://odpub.ru	Fr 12:00-06:00, Sa 12:00-03:00; Mo-Th,Su 12:00-24:00	6	\N	t	node	4457908220	\N
1823	Золотая Вобла	\N	\N	55.7583360	37.6398180	+7 495 6281519	http://vobla.ru	24/7	6	\N	t	node	830154263	\N
1824	Dark Patrick's	\N	\N	55.7599620	37.6315770	+7 495 6213797	http://dp-pub.ru	Su-Th 12:00-24:00, Fr,Sa 12:00-03:00	6	\N	t	node	2290923325	\N
1825	Piggy	\N	\N	55.7537800	37.6372230	+7 916 4121188	\N	13:00-02:00	6	\N	t	node	4475440190	\N
1826	Pauwel Kwak	\N	\N	55.7578980	37.6390710	+7 495 1048440	http://kwakpub.ru	Mo-Su 12:00-24:00	6	\N	t	node	4648522689	\N
1827	Птицаcиница	Большой Спасоглинищевский переулок, 3 с5	\N	55.7564140	37.6352580	+7 926 8642099;+7 968 5705258	\N	Mo-Th 14:00-24:00; Fr 14:00-04:00; Sa 16:00-04:00; Su 16:00-24:00	6	\N	t	node	4897566992	\N
1828	Left Bank	\N	\N	55.7577530	37.6337610	+7 495 7923959	http://lbpub.ru	Fr-Sa 12:00-06:00; Mo-Th,Su 12:00-24:00	6	\N	t	node	4897760845	\N
1829	The black swan	улица Солянка, 1/2	\N	55.7544760	37.6379270	+7 926 6633630	http://blackswanpub.tilda.ws	Fr-Sa 12:00-06:00; Mo-Th,Su 12:00-24:00	6	\N	t	node	5730559774	\N
1830	The Backyard Pub	\N	\N	55.7565100	37.6351660	\N	https://backyardpub.ru/	Mo-Su 14:00-24:00	6	\N	t	node	7710236412	\N
1831	Mollie's Pub	\N	\N	55.7625160	37.6344050	+7 495 6244696	http://www.molliespub.ru	Mo,Su 12:00-24:00; Tu-Th 00:00-01:00,12:00-24:00; Fr,Sa 00:00-03:00,12:00-24:00	6	\N	t	node	1098868819	\N
1832	Козловица	\N	\N	55.7670130	37.6316830	+7 495 6216164	https://www.kozlovica.ru/	Mo-Su 12:00-22:00	6	\N	t	node	1724246610	\N
1833	Волчья стая	Мясницкая улица, 38 с1	\N	55.7661560	37.6399330	+7 906 7302282	\N	Mo-Th 12:00-24:00, Fr 12:00-06:00, Sa 13:00-06:00, Su 13:00-24:00	6	\N	t	node	2400135090	\N
1834	Lion's Head Pub	\N	\N	55.7628880	37.6348300	+7 495 6362818	https://lhpub.ru	Su-Th 12:00-24:00, Fr,Sa 12:00-06:00	6	\N	t	node	2509793563	\N
1835	Beer Gik	\N	\N	55.7620810	37.6348530	+7 925 4525035	\N	Mo-Su 12:00-23:00	6	\N	t	node	5124243222	\N
1836	Clovelly	\N	\N	55.7669030	37.6325790	+7 909 6744320	https://theclovelly.ru/	Mo-Fr 12:00-24:00; Sa,Su 00:00-02:00,12:00-24:00	6	\N	t	node	9991531584	\N
1837	Bobby Dazzler	\N	\N	55.7675890	37.6352740	+7 495 6080383	http://www.bobbydazzler.ru	Mo-Th 11:00-24:00; Fr 11:00-03:00; Sa 13:00-06:00; Su 13:00-24:00	6	\N	t	node	1098460309	\N
1838	2:2	улица Сретенка, 16/2	\N	55.7683890	37.6323810	+7 495 6212927	http://22pub.ru/	\N	6	\N	t	node	4231626328	\N
1839	Beerside	\N	\N	55.7723620	37.6382480	+7 495 3638615	https://beersidegastropub.com/	Mo-Fr 12:00-24:00; Sa,Su 00:00-02:00,14:00-24:00	6	\N	t	node	8001377391	\N
1840	Harat's	\N	\N	55.7693080	37.6319020	+7 495 0980078	https://moscow.harats.com	Mo-Su 00:00-06:00,12:00-24:00	6	\N	t	node	9057239193	\N
1841	Crab pub	\N	\N	55.7329110	37.6437070	+7 495 7740401	http://crabpub.ru	\N	6	\N	t	node	4457908215	\N
1842	Раковая на Таганке	\N	\N	55.7355800	37.6498840	\N	https://vk.com/public135260474	Mo-Th,Su 12:00-01:00; Fr-Sa 12:00-02:00	6	\N	t	node	5260252116	\N
1843	Полная кружка	\N	\N	55.7423850	37.6522930	\N	https://polnayakruzhka.ru/	Mo-Su 12:00-23:55	6	\N	t	node	1521698873	\N
1844	Джон Донн	\N	\N	55.7433180	37.6524060	+7 495 9153414	http://www.john-donne.ru	\N	6	\N	t	node	2451696167	\N
1845	Pub no pub	\N	\N	55.7414050	37.6528410	+7 495 7245904	http://pubnopub.ru/	Mo-Su 12:00-06:00	6	\N	t	node	12188244403	\N
1846	О'Коннелл'с паб	\N	\N	55.7589970	37.6463010	+7 985 2963090	http://oconnells.ru	Su-Th 12:00-23:00; Fr-Sa 12:00-05:00	6	\N	t	node	2693211442	\N
1847	Harat's	\N	\N	55.7587270	37.6419420	+7 499 4000323	https://moscow.harats.com	Mo-Su 12:00-06:00	6	\N	t	node	5203271238	\N
1848	Клаштер	\N	\N	55.7600030	37.6460880	+7 495 6285944	http://www.klashterbar.ru	Mo-Fr 11:00-24:00; Sa,Su 12:00-24:00	6	\N	t	node	7206956348	\N
1849	Smith's	\N	\N	55.7416590	37.6559350	\N	\N	\N	6	\N	t	node	5219873323	\N
1850	Harat's	\N	\N	55.7406700	37.6542950	+7 495 0980410	https://moscow.harats.com	Mo-Su 12:00-06:00	6	\N	t	node	6200361894	\N
1851	Сильвер'с	\N	\N	55.7647810	37.6547300	+7 495 9171770	\N	Mo-Su 10:00-24:00	6	\N	t	node	3679274769	\N
1852	Speaker	\N	\N	55.7633550	37.6548770	\N	\N	\N	6	\N	t	node	4363078369	\N
1853	Арма крафт	\N	\N	55.7607330	37.6639650	\N	\N	Mo-Fr 13:00-24:00; Sa,Su 00:00-02:00,14:00-24:00	6	\N	t	node	5536074121	\N
1854	Buddy McDaniel	\N	\N	55.7638130	37.6559470	+7 499 4558620	https://mcdaniel.ru/	24/7	6	\N	t	node	9198111262	\N
1855	Сейджи	\N	\N	55.7318880	37.5930900	+7 499 2467624	http://www.seiji.ru	Mo-Su 12:00-23:00	7	\N	t	node	1760700321	\N
1856	Академия	\N	\N	55.7379350	37.6019060	+7 495 7374047	http://semifreddo-group.com/ru/venue/academiya-on-butikovskiy	Mo-Fr 08:00-24:00; Sa,Su 10:00-24:00	7	\N	t	node	2465580144	\N
1857	Accenti	\N	\N	55.7376360	37.5931190	+7 499 2461515	http://www.accenti.ru	Mo-Su 12:00-24:00	7	\N	t	node	2562767934	\N
1858	MixCafe	\N	\N	55.7346680	37.5955280	+7 499 2464085	http://www.park.mix-cafe.com	Mo-Su 11:00-23:00	7	\N	t	node	4092709207	\N
1859	Piazza Italiana	\N	\N	55.7380330	37.6040180	\N	https://www.piazza-italiana.ru/	Mo-Su 12:00-23:30	7	\N	t	node	4745186443	\N
1860	Чё? Харчо!	улица Крымский Вал, 9ст2	\N	55.7320210	37.6027040	+74996088989	https://che-harcho.ru/rus/moscow/main	Mo-Fr 12:00-00:00, Sa-Su 11:00-00:00	7	\N	t	node	9901875670	\N
1861	Sansa	\N	\N	55.7364150	37.6006790	+7 926 4099949	https://sansa.rest/	\N	7	\N	t	node	9997588052	\N
1862	Remy Kitchen Bakery	\N	\N	55.7367240	37.6013710	+7 985 1829600	https://remykitchenbakery.ru/	Mo-Su 08:00-24:00	7	\N	t	node	13228042093	\N
1863	Yoko	Соймоновский проезд, 5/2	\N	55.7433210	37.6044130	+7 495 6371370	http://novikovgroup.ru/restaurants/yoko	Mo-Su 12:00-24:00; Fr,Sa 12:00-06:00	7	\N	t	node	815405665	\N
1864	Vаниль	\N	\N	55.7441200	37.6022620	+7 495 6371082	http://novikovgroup.ru/restaurants/vanil	Mo-Fr 08:00-24:00; Sa,Su 10:00-24:00	7	\N	t	node	815405715	\N
1866	Тифлисский дворик	\N	\N	55.7397780	37.5956280	+7 495 6951056	http://www.tiflis.ru	\N	7	\N	t	node	2229548553	\N
1867	Эларджи	\N	\N	55.7444050	37.5960070	+7 495 6277897	\N	Mo-Su 12:00-24:00	7	\N	t	node	2330483588	\N
1868	Генацвале VIP	\N	\N	55.7419570	37.5986150	+7 495 6950393	http://www.restoran-genatsvale.ru/	Mo-Su 12:00-24:00	7	\N	t	node	2432251096	\N
1869	Жеральдин	\N	\N	55.7390250	37.5974190	+7 495 6951202	http://www.geraldine.ru	Mo-Su 12:00-23:00	7	\N	t	node	2562816606	\N
1870	Свои 3.3	\N	\N	55.7451450	37.5972110	\N	https://svoi33.ru	\N	7	\N	t	node	2562968844	\N
1871	Kefi	\N	\N	55.7404760	37.5932440	+7 903 9688897	https://kefi.rest/	Mo-Su 12:00-06:00	7	\N	t	node	2918758157	\N
1872	Воронеж	\N	\N	55.7445790	37.6011030	+7 495 6950641	http://www.voronej.com	Mo-Su 12:00-24:00	7	\N	t	node	3752620043	\N
1873	Андерсон	\N	\N	55.7449660	37.5976650	+7 499 2716165	http://cafe-anderson.ru	Mo-Fr 09:00-23:00; Sa,Su 10:00-23:00	7	\N	t	node	4632424966	\N
1874	Есть хинкали, пить вино	\N	\N	55.7408720	37.5982750	+7 495 9755535	\N	Mo-Su 11:00-24:00	7	\N	t	node	5613517125	\N
1875	Maer	\N	\N	55.7430700	37.6024350	+7 977 9912345	\N	Mo-Su 12:00-24:00	7	\N	t	node	7141020137	\N
1876	Kiyomi	\N	\N	55.7418130	37.6008550	\N	https://kiyomi.lucky-group.rest/	\N	7	\N	t	node	7820796385	\N
1877	12	\N	\N	55.7455730	37.6012730	\N	\N	Mo-Fr 09:00-24:00, Sa,Su 10:00-24:00	7	\N	t	node	8261786219	\N
1878	Bardot	\N	\N	55.7431500	37.6011390	+7 925 7585353	\N	Mo-Su 09:00-23:00	7	\N	t	node	8615176248	\N
1879	Linbistro	\N	\N	55.7390930	37.5961850	+7 499 2261627	\N	Mo-Su 12:00-23:00	7	\N	t	node	9354087721	\N
1880	Bagebi	\N	\N	55.7411740	37.5931120	+7 495 799 19 34	http://www.bagebi.ru/	\N	7	\N	t	node	9490290256	\N
1881	Айна	\N	\N	55.7417840	37.5991470	\N	https://ainarest.ru/	Mo-Su 11:45-24:00	7	\N	t	node	9505492635	\N
1882	Grande	\N	\N	55.7429510	37.6009050	\N	https://grandefriendsforever.ru/	Mo-Su 08:00-23:00	7	\N	t	node	10763790376	\N
1883	Мультикультура	\N	\N	55.7417150	37.5936590	+7 903 2632777	https://multicultura.ru/	\N	7	\N	t	node	11202742391	\N
1884	IL Патио	улица Волхонка, 15/17	\N	55.7454310	37.6047720	+7 495 7884488	http://www.rosinter.ru/	Mo-Fr 08:00-24:00; Sa,Su 10:00-24:00	7	\N	t	relation	9949261	\N
1885	Чемодан	\N	\N	55.7486690	37.5994630	+7 495 6953819	http://www.chemodan-msk.ru	Mo-Su 12:00-24:00	7	\N	t	node	813972115	\N
1886	Генацвале	\N	\N	55.7517970	37.5968270	+7 495 6979453	http://www.restoran-genatsvale.ru	\N	7	\N	t	node	1436380440	\N
1887	California Diner	\N	\N	55.7505340	37.5954120	+7 499 5798004	http://californiadiner.ru/	24/7	7	\N	t	node	2572814351	\N
1888	Легенда	\N	\N	55.7508990	37.5955920	\N	\N	\N	7	\N	t	node	3024369344	\N
1889	Mesopotamia	\N	\N	55.7519600	37.5984420	+7 495 9133212	http://mezopotamyarestaurant.ru	Mo-Su 00:00-01:00,10:00-24:00	7	\N	t	node	3059605541	\N
1890	Вареничная №1	улица Арбат, 29	\N	55.7499040	37.5933880	+7 499 2411211	http://www.varenichnaya.ru	Mo-Su 11:00-23:00	7	\N	t	node	3069977165	\N
1891	Kostèr Сити	\N	\N	55.7526320	37.6037560	\N	https://koster-city.ru/	\N	7	\N	t	node	3186283501	\N
1892	Pinzeria by Bontempi	Большой Знаменский переулок, 2 с3	\N	55.7460980	37.6020450	+7 499 678-30-09	https://pinzeria.ru/	Mo-Su 12:00-23:00	7	\N	t	node	3247029593	\N
1893	Одуван	\N	\N	55.7505850	37.5998870	+7 495 6453872	http://oduvan-farm.com/	Mo-Su 06:45-24:00	7	\N	t	node	5230991776	\N
1894	Taksim	\N	\N	55.7506450	37.5956560	\N	\N	Mo-Su 00:00-02:00,11:00-24:00	7	\N	t	node	5906743563	\N
1895	Il pizzaiolo	\N	\N	55.7498460	37.5932010	+7 499 2410127	http://ilpizzaiolo.ru/	Su-Th 10:00-23:00; Fr,Sa 10:00-24:00	7	\N	t	node	6680035284	\N
1896	Niki	\N	\N	55.7525100	37.6020260	\N	\N	\N	7	\N	t	node	8610912647	\N
1897	Brasserie Lambic	\N	\N	55.7508460	37.5997280	+7 495 7558775	https://lambic.ru	Mo-Su 12:00-24:00	7	\N	t	node	8610962676	\N
1898	Александр	\N	\N	55.7465760	37.5983200	+7 495 1347711	https://cafealexander.ru/	Mo-Su 11:00-23:00	7	\N	t	node	9701344306	\N
1899	Баба Марта	\N	\N	55.7515070	37.5978610	\N	\N	Mo-Su 12:00-23:00	7	\N	t	node	10557552986	\N
1900	Jackueline	\N	\N	55.7514910	37.6000830	\N	http://jacqueline.rest/	\N	7	\N	t	node	12082833061	\N
1901	Том и Ям	\N	\N	55.7519120	37.5994030	\N	https://томиям.рф/msk	Mo-Su 11:00-23:00	7	\N	t	node	12758431006	\N
1902	Эрато	\N	\N	55.7521950	37.5939050	\N	https://erato-rest.ru/	Mo-Su 12:00-24:00	7	\N	t	node	13050940604	\N
1903	Палаццо Дукале	\N	\N	55.7585260	37.5983280	+7 495 7896404	http://palazzodukale.ru/	\N	7	\N	t	node	813972359	\N
1904	Жан-Жак	\N	\N	55.7552840	37.6006940	+7 495 6903886	http://jan-jak.com	Mo-Su 00:00-06:00,09:00-24:00	7	\N	t	node	813972443	\N
1905	Русский паб	\N	\N	55.7590950	37.6004290	+7 495 7446361	http://ruspub.ru/	Mo-Su 12:00-24:00	7	\N	t	node	813972467	\N
1906	Домжур	\N	\N	55.7540490	37.6014530	+7 495 6915633	https://www.domjour.com/	Mo-Su 12:00-24:00	7	\N	t	node	813972498	\N
1907	Квартира 44	\N	\N	55.7574630	37.6027220	+7 495 6917503;+7 916 4522802	http://kv44.ru/	\N	7	\N	t	node	2084480195	\N
1908	Lucky	\N	\N	55.7572960	37.5995710	+7 495 1897888	\N	Mo-Su 12:00-24:00, Fr,Sa 00:00-02:00	7	\N	t	node	2214781348	\N
1909	Якитория	\N	\N	55.7529630	37.5941590	+7 495 6904311	https://yakitoriya.ru	Mo-Su 10:00-05:00	7	\N	t	node	2440580211	\N
1910	Иерусалим	\N	\N	55.7600490	37.5980550	+7 495 6906266	https://facebook.com/Ресторан-Иерусалим-на-Бронной-471447292940362/	Mo-Su 11:00-24:00; Fr 11:00-18:00; Sa off	7	\N	t	node	2567134863	\N
1911	Калашный	\N	\N	55.7541850	37.6026260	\N	https://kalashny.beer/	\N	7	\N	t	node	2615222194	\N
1912	Tokyo	\N	\N	55.7570650	37.6028320	+7 495 1815222	\N	Mo-Su 12:00-24:00	7	\N	t	node	2616127199	\N
1913	Юг22	\N	\N	55.7570160	37.6033210	+7 495 260 70 07	https://yug22.ru	Fr-Sa 10:00-02:00; Mo-Th,Su 10:00-24:00	7	\N	t	node	2616127207	\N
1914	Friends Forever	\N	\N	55.7579540	37.5969960	+7 916 7982989	https://friends-forever.ru/	Mo-Su 08:00-23:00	7	\N	t	node	3186204755	\N
1915	The Nappe Bistro	\N	\N	55.7559280	37.5945460	+7 495 6971241	https://www.nappebistro.ru/	Mo-Su 07:30-24:00	7	\N	t	node	3405469761	\N
1916	Whisky rooms	\N	\N	55.7590840	37.6031280	+7 495 5326508	http://whiskyrooms.ru	Mo-Su 15:00-23:00	7	\N	t	node	3783311133	\N
1917	Есть хинкали, пить вино	\N	\N	55.7597070	37.5972590	+7 495 9755535	\N	Mo-Su 11:00-24:00	7	\N	t	node	3946173967	\N
1918	Didi	\N	\N	55.7597690	37.6012250	+7 499 9900928	https://didirest.ru/	Mo-Su 12:00-24:00	7	\N	t	node	4557354217	\N
1919	Remy Kitchen Bakery	\N	\N	55.7588200	37.5984690	+7 985 1829600	https://remykitchenbakery.ru/	Mo-Su 11:00-24:00	7	\N	t	node	4865324722	\N
1920	Luwo	\N	\N	55.7567260	37.6037470	\N	\N	Mo-Fr 09:00-24:00; Sa,Su 00:00-02:00,09:00-24:00	7	\N	t	node	5773235114	\N
1922	Loro	\N	\N	55.7572080	37.6002820	+7 495 8189818	https://www.loro.lucky-group.ru/	Mo-Fr 12:00-24:00; Sa,Su 00:00-02:00,12:00-24:00	7	\N	t	node	7056592928	\N
1923	Есть хинкали, пить вино	\N	\N	55.7539550	37.5990400	+7 495 9755535-4	\N	Mo-Su 11:00-24:00	7	\N	t	node	7259141981	\N
1924	Koji	\N	\N	55.7570480	37.5997030	+7 495 8187788	https://koji.lucky-group.ru/	Mo-Fr 12:00-24:00; Sa,Su 00:00-02:00,12:00-24:00	7	\N	t	node	8179706253	\N
1925	She	Большая Никитская улица, 15 с1	\N	55.7567440	37.6035920	+7 (495) 136-00-00	https://she.wrf.su/	Mo-Th,Su 08:00-24:00; Fr-Sa 08:00-02:00	7	\N	t	node	8361371739	\N
1926	ЛЕС	\N	\N	55.7593350	37.5991430	+7 925 8870183	https://les.wine/	Mo-Su 10:00-24:00	7	\N	t	node	8944182514	\N
1927	Maya	\N	\N	55.7571530	37.6021170	+7 495 1898989;+7 916 8393300	https://maya.lucky-group.rest/	Fr 12:00-02:00, Sa 09:00-02:00, Su 09:00-24:00; Mo-Th 12:00-24:00	7	\N	t	node	9696184624	\N
1928	Jun	\N	\N	55.7571340	37.6020930	\N	\N	\N	7	\N	t	node	10691274554	\N
1929	МоцАрт	\N	\N	55.7579770	37.6041880	\N	\N	Mo-Su 07:00-23:00	7	\N	t	node	10998416515	\N
1930	Mr. Ливанец	\N	\N	55.7580300	37.6042500	\N	http://www.mrlivanets.ru	Mo-Su 12:00-24:00	7	\N	t	node	11425792237	\N
1931	Басма	\N	\N	55.7533580	37.5981690	\N	\N	Mo-Su 09:00-23:00	7	\N	t	node	11470176175	\N
1932	Brera	\N	\N	55.7572880	37.6010810	\N	\N	\N	7	\N	t	node	12264053351	\N
1933	Share	\N	\N	55.7575230	37.6038280	+7 (495) 105-92-77	\N	Su-Th 08:00-00:00; Fr-Sa 10:00-02:00	7	\N	t	node	12269890502	\N
1934	Marble	\N	\N	55.7548760	37.6010270	\N	\N	\N	7	\N	t	node	12507761921	\N
1935	Турандот	Тверской бульвар, 26/5	\N	55.7630490	37.6042920	+7 495 7390011	https://www.turandot-palace.ru/	\N	7	\N	t	node	623350670	\N
1936	Brix	\N	\N	55.7643710	37.5961100	+7 495 9259594	\N	Mo-Su 12:00-24:00	7	\N	t	node	2084476718	\N
1937	Santi	\N	\N	55.7642700	37.5955250	\N	https://santi.lucky-group.rest	\N	7	\N	t	node	2378986427	\N
1938	Grand Cru	\N	\N	55.7629210	37.5949660	+7 495 5106565 ext. 6582	http://www.grandcru.ru	Mo-Su 12:00-24:00	7	\N	t	node	2463980851	\N
1939	Мари Ванна	\N	\N	55.7626780	37.5956300	+7 495 6506500;+7 916 4514654	http://www.marivanna.ru/msk	Mo-Su 09:00-24:00	7	\N	t	node	2463980854	\N
1940	Рыбный базар	\N	\N	55.7656970	37.5975620	+7 495 6505444	http://www.rbazar.ru	\N	7	\N	t	node	2522118963	\N
1941	Сценарио	Тверская улица, 22А	\N	55.7670320	37.6019040	+7 495 6995675	http://scenario-cafe.ru	Mo-Su 09:00-24:00	7	\N	t	node	2523343458	\N
1942	Море	\N	\N	55.7644120	37.5963890	+7 925 501 88 88	\N	Mo-Su 11:00-23:00	7	\N	t	node	2658288316	\N
1943	Sattva	\N	\N	55.7666700	37.6022970	+7 499 9910816	https://sattva.moscow/tverskaya	Mo-Su 08:00-23:00	7	\N	t	node	2858256942	\N
1944	Pinch	\N	\N	55.7634150	37.5971360	+7 495 6919988	\N	Mo-Su 00:00-00:30,12:00-24:00	7	\N	t	node	3293297149	\N
1945	Хмель & Эль	\N	\N	55.7648590	37.5984990	+7 495 6503057	http://hmel-el.ru	Mo-Su 12:00-24:00	7	\N	t	node	3312002402	\N
1946	Де Пари	\N	\N	55.7635130	37.6008950	\N	\N	\N	7	\N	t	node	3425182961	\N
1947	Gutai	\N	\N	55.7634070	37.5943970	+7 495 6268573	\N	Mo-Su 12:00-24:00	7	\N	t	node	3639254642	\N
1948	Tilda	\N	\N	55.7644070	37.6009090	+7 916 4027049	\N	Mo-Su 12:00-24:00	7	\N	t	node	3656613963	\N
1949	Margarita bistro	\N	\N	55.7637940	37.5939290	+7 495 8189988	https://margarita.lucky-group.rest/	Mo-Su 12:00-24:00	7	\N	t	node	3742832794	\N
1950	Форте	\N	Музыкальный клуб	55.7628830	37.6010930	+7 495 6940881	http://www.forteclub.com	Mo-Su 14:00-24:00	7	\N	t	node	3744149104	\N
1951	Il pizzaiolo	\N	\N	55.7657760	37.6029860	\N	http://ilpizzaiolo.ru	Su-Th 10:00-23:00, Fr,Sa 10:00-24:00	7	\N	t	node	3744711929	\N
1952	Bellis	\N	\N	55.7663220	37.6041660	+7 495 7982722	http://bellisbar.ru	Mo-Su 00:00-06:00,15:00-24:00	7	\N	t	node	3809925862	\N
1953	Max's Beef for Money	\N	\N	55.7619590	37.5986410	+7 985 7660578	\N	Tu 17:00-23:00; We-Su 12:30-23:00	7	\N	t	node	4114628801	\N
1954	Loona	\N	\N	55.7623640	37.6036650	+ 7 495 1509100	\N	Mo-Su,PH 09:00-24:00	7	\N	t	node	4124049237	\N
1955	Cutfish	\N	\N	55.7640080	37.5954910	+7 926 9367876	\N	Mo-Su 12:00-24:00	7	\N	t	node	4155689928	\N
1956	Мясо & Рыба	Тверская улица, 23/12	\N	55.7666390	37.5999010	+7 495 6090908	http://meat-and-fish.ru/	24/7	7	\N	t	node	4328148505	\N
1957	Mama Tuta	\N	\N	55.7633540	37.5944620	\N	\N	Mo-Su 12:00-23:00	7	\N	t	node	4426336157	\N
1958	Шануар	\N	\N	55.7627930	37.6040550	\N	\N	Mo-Su 12:00-24:00	7	\N	t	node	4615859572	\N
1959	Mela	\N	\N	55.7628020	37.5959180	\N	\N	\N	7	\N	t	node	4724750788	\N
1960	Butler	\N	\N	55.7660950	37.5956920	+7 495 1504586	\N	Mo-Su 12:00-24:00	7	\N	t	node	4829441348	\N
1961	Bro&N	\N	\N	55.7635310	37.5938620	+7 495 6500050	http://novikovgroup.ru/restaurants/bron/	Mo-Su 11:00-23:00	7	\N	t	node	4924401918	\N
1962	Mollusca	\N	\N	55.7641360	37.5953530	+7 495 2972222	\N	Mo-Su 12:00-24:00	7	\N	t	node	5126470639	\N
1963	Клешни и ракушки	\N	\N	55.7655650	37.5976910	+7 495 6505444	http://www.rbazar.ru/raki	Mo-Su 12:00-24:00	7	\N	t	node	5293645436	\N
1964	Shiba	\N	\N	55.7635550	37.5970160	+7 495 2767067	\N	Mo-Su 12:00-24:00	7	\N	t	node	5613517126	\N
1965	Borough	\N	Раклет-бар	55.7668230	37.5970070	\N	https://boroughrest.ru/	14:00-02:00	7	\N	t	node	5856251085	\N
1966	Pino	\N	\N	55.7626160	37.5949700	+7 901 1879040	\N	Mo-Su 12:00-24:00	7	\N	t	node	7192026285	\N
1967	Maritozzo	\N	\N	55.7633010	37.5945120	+7 499 3995090	\N	Mo-Su 12:00-23:00	7	\N	t	node	7806292244	\N
1968	Simach в Недальнем	\N	\N	55.7605320	37.6002950	+7 965 4387086	\N	Mo-Su 12:00-24:00	7	\N	t	node	7816984494	\N
1969	Narval	\N	\N	55.7653150	37.6021430	+7 926 650 22 25	http://narval.rest/	Mo-Su 07:00-23:00	7	\N	t	node	8125172628	\N
1970	Тенили	\N	\N	55.7669560	37.5973540	+7 495 367 10 20	http://tenili.ru/	Mo-Su 12:00-23:00	7	\N	t	node	8244825697	\N
1971	Хорошая девочка	\N	\N	55.7607920	37.5965620	+7 499 1104222	https://msc.xdevochka.rest/ru	Mo-Su 10:00-24:00	7	\N	t	node	8353759717	\N
1972	Tsunami	\N	\N	55.7670140	37.5975080	\N	https://tsunami.rest/	Mo-Fr 12:00-24:00; Sa,Su 00:00-02:00,12:00-24:00	7	\N	t	node	8766165069	\N
1973	AVA	\N	\N	55.7627950	37.5947910	+7 495 7897739	http://ava.rest/	Mo-Su 13:00-23:00	7	\N	t	node	9111957190	\N
1974	Onest	\N	\N	55.7603540	37.5970010	+7 985 470 7030	\N	Mo-Su 12:00-24:00	7	\N	t	node	9176377609	\N
1975	Аист	\N	\N	55.7602890	37.5969190	+7 499 9407040	http://www.aistcafe.ru/	Mo-Fr 09:00+; Sa-Su 10:00+	7	\N	t	node	9176377610	\N
1976	Oshi	\N	\N	55.7630100	37.5948630	+7 495 8448843	\N	Mo-Su 09:00-24:00	7	\N	t	node	9195454940	\N
1977	Pinzeria by Bontempi	\N	\N	55.7642290	37.6021400	\N	https://pinzeria.ru/ru/	Mo-Su 10:00-22:00	7	\N	t	node	9294605899	\N
1978	Patriki	\N	\N	55.7628870	37.5946770	\N	\N	\N	7	\N	t	node	9670053967	\N
2089	Los Pollos Bandidos	\N	\N	55.7551720	37.6136490	+7 910 4045577	\N	\N	7	\N	t	relation	6228053	\N
1979	Кофемания Chef’s	\N	\N	55.7629120	37.5957390	+7 (499) 495 40 81	https://coffeemania.ru/restaurants/chefs	Mo-Su 08:00-00:00	7	\N	t	node	10696460894	\N
1980	Narnia	\N	\N	55.7600720	37.5973360	\N	\N	Mo-Su 09:00-23:00	7	\N	t	node	11265530358	\N
1981	Πάφος	\N	\N	55.7638020	37.6026040	+7 495 1201116	https://pafos.rest/	Fr-Sa 09:00-02:00; Mo-Th,Su 09:00-24:00	7	\N	t	node	11323317892	\N
1982	Афина	\N	\N	55.7601200	37.5974550	\N	\N	\N	7	\N	t	node	11831343861	\N
1983	Louis the Claw	\N	\N	55.7624780	37.5942330	+7 936 2601069	\N	\N	7	\N	t	node	11971469430	\N
1984	Про Восток	\N	\N	55.7668840	37.6032510	\N	https://provostok.rest/	\N	7	\N	t	node	12573968954	\N
1985	Grassa	\N	\N	55.7635650	37.5981680	\N	https://grassa.rest/	\N	7	\N	t	node	12803115728	\N
1986	Пушкинъ	Тверской бульвар, 26А	\N	55.7637010	37.6050030	+7 495 7390033	http://www.cafe-pushkin.ru	24/7	7	\N	t	way	52890562	\N
1987	Павильон. Пруд. Патрики	Большой Патриарший переулок, 7 с1	\N	55.7634200	37.5927740	+7 916 0005000	https://erwin-pavilion.rest/	Mo-Su 12:00-24:00	7	\N	t	way	52909877	\N
1988	El Idilio	\N	\N	55.7676360	37.5980870	+7 495 6504804	https://elidilio.ru/	Mo-Su 12:00-23:00	7	\N	t	node	614945569	\N
1989	Positano	\N	\N	55.7701580	37.5984650	+7 495 7280000	\N	Mo-Su 12:00-24:00	7	\N	t	node	813653482	\N
1990	Клешни и хвосты	\N	\N	55.7703080	37.5988160	\N	https://kleshnihvosti.ru/	\N	7	\N	t	node	813653889	\N
1991	IL Патио	\N	\N	55.7702090	37.5961580	+7 965 319-24-20	https://ilpatio.ru/	Mo-Th 10:00-23:00, Fr 10:00-24:00, Sa 11:00-24:00, Su 11:00-23:00	7	\N	t	node	1113593209	\N
1992	Чайковский	\N	\N	55.7691440	37.5962430	+7 495 6999241	http://novikovgroup.ru/restaurants/chaykovskiy	Mo-Fr 08:00-24:00; Sa-Su 10:00-24:00	7	\N	t	node	1413216527	\N
1993	Мали-Београд	\N	\N	55.7711960	37.6026990	\N	\N	\N	7	\N	t	node	1719472333	\N
1994	Кофемания	\N	\N	55.7675780	37.6008040	+7 495 2130411	http://coffeemania.ru/	Mon-Tue, Sun 08:00-23:00; Wed-Sat 08:00-00:00	7	\N	t	node	2451930647	\N
1995	Чанахи	\N	\N	55.7686420	37.6037260	+7 495 6506811	https://www.chanakhi.ru/	Mo-Su 11:30-24:00	7	\N	t	node	2522202228	\N
1996	Листва	\N	\N	55.7736590	37.5988180	+7 925 4645555	https://listvarest.ru/	Fr-Sa 12:00-02:00; Mo-Th,Su 12:00-24:00	7	\N	t	node	2572750676	\N
1997	Чайхона №1	1-я Тверская-Ямская улица, 7	\N	55.7715510	37.5929600	+7 499 2516761	http://chaihona1.ru	Mo-Su 12:00-06:00	7	\N	t	node	2600662682	\N
1998	Венеция	\N	\N	55.7716000	37.5988110	+7 499 2502888	http://www.trattoria-venezia.ru	Mo-Su 11:00-23:00	7	\N	t	node	2628393711	\N
1999	Chekhonte	\N	\N	55.7672200	37.6014460	+7 495 7876211	\N	Mo-Su 06:30-23:00	7	\N	t	node	2967468685	\N
2000	Ленский	\N	\N	55.7674180	37.6047260	+7 495 1112100	\N	\N	7	\N	t	node	3048937257	\N
2001	Чайковский в Тифлисе	\N	\N	55.7689980	37.5964940	+7 495 6999012	http://novikovgroup.ru/restaurants/chaykovskiy	Mo-Fr 17:00-24:00; Sa,Su 12:00-24:00	7	\N	t	node	3254966493	\N
2002	Сэлэнгэ	\N	\N	55.7703440	37.6047690	\N	\N	12:00-24:00	7	\N	t	node	4521741413	\N
2003	Osteria Unica	\N	\N	55.7676040	37.5984810	+7 495 1010057	\N	Mo-Su 12:00-24:00	7	\N	t	node	4908808386	\N
2004	Довлатов	\N	\N	55.7705380	37.6012900	+7 495 9681727	https://www.dovlatov.restaurant	Mo-Su 13:00-23:00	7	\N	t	node	5630658611	\N
2005	Mama Juana	\N	\N	55.7702280	37.5939030	+7 939 8880077	https://mamajuana-restaurant.ru/	Mo-Th 08:00-23:00; Fr 08:00-24:00; Sa 00:00-03:00,11:00-24:00; Su 00:00-03:00,11:00-23:00	7	\N	t	node	5630658617	\N
2006	Пилзнер	\N	\N	55.7714330	37.5931690	\N	http://www.pilsner.ru	Mo-Su 11:00-23:00	7	\N	t	node	6434070066	\N
2007	Джонджоли	Тверская улица, 30/2с1	\N	55.7698910	37.5978450	+7 495 1355500;+7 968 5957316	https://ch1ef.ru/restaurant/jonjoli	Mo-Su 11:00-24:00	7	\N	t	node	7188772994	\N
2008	Masters & Margaritas	\N	\N	55.7701370	37.5975050	+7 915 1100593	https://restobarmm.ru/	Su-We 12:00-24:00, Th-Sa 12:00-02:00	7	\N	t	node	7703054287	\N
2009	Lalaland	\N	\N	55.7720790	37.6003140	\N	\N	Mo-Su 18:00-06:00	7	\N	t	node	10557552990	\N
2010	QLO	\N	\N	55.7686800	37.5977290	\N	\N	Mo-Su 10:00-24:00	7	\N	t	node	10691274547	\N
2011	Maria	\N	\N	55.7690530	37.5962940	\N	\N	\N	7	\N	t	node	11906794619	\N
2012	Джанни	\N	\N	55.7384410	37.6149140	+7 495 9952152	\N	Mo-Su 10:00-24:00	7	\N	t	node	2518591867	\N
2013	Без повода	улица Большая Якиманка, 50	\N	55.7322300	37.6108990	+7 499 9408364	\N	Mo-Su 11:00-24:00	7	\N	t	node	2723747584	\N
2014	Pancho Villa	\N	\N	55.7318400	37.6116920	+7 499 2385413	http://www.panchovilla.ru	\N	7	\N	t	node	3526774274	\N
2015	Коперник	\N	\N	55.7383420	37.6134860	+7 985 0998899	http://cafekopernik.ru/	Mo-Fr 08:00-22:00; Sa,Su 09:00-23:00	7	\N	t	node	3971026968	\N
2016	Cevicheria	\N	\N	55.7385900	37.6051940	+7 495 1322377	\N	12:00-23:00; Fr,Sa 12:00-02:00	7	\N	t	node	4607984514	\N
2017	Мерани	\N	\N	55.7372290	37.6164680	\N	\N	\N	7	\N	t	node	8883948739	\N
2018	Высота 5642	\N	\N	55.7364930	37.6135990	\N	https://novikovgroup.ru/restaurants/5642Restaurant/5642Visota_58.html	\N	7	\N	t	node	9315555918	\N
2019	Voo	\N	\N	55.7379280	37.6157850	\N	\N	\N	7	\N	t	node	12259515515	\N
2020	Шардам	\N	\N	55.7373320	37.6090730	+7 903 0102877	\N	\N	7	\N	t	way	55695693	\N
2021	Галилея	\N	\N	55.7451400	37.6115410	\N	\N	\N	7	\N	t	node	1606487785	\N
2022	Стрелка	\N	\N	55.7425900	37.6093170	+7 495 7717416	http://www.strelka.com/bar/?lang=ru	Mo-Th 09:00-24:00; Fr 09:00-03:00; Sa 12:00-03:00; Su 12:00-24:00	7	\N	t	node	2411252954	\N
2023	Река	Берсеневская набережная, 6	\N	55.7404540	37.6089750	+7 495 6699969	http://rekaclub.ru	\N	7	\N	t	node	2503578614	\N
2024	Кому жить хорошо	\N	\N	55.7402180	37.6060510	+7 495 6951639	http://комужитьхорошо.рф	Mo-Su 12:00-06:00	7	\N	t	node	2562944498	\N
2025	Кофемания	\N	\N	55.7417630	37.6157370	+7 499 9401984	http://coffeemania.ru/	Mo-Su 08:00-23:00	7	\N	t	node	2600548990	\N
2026	Чайхона № 1	улица Большая Полянка, 1/3	\N	55.7423450	37.6166500	+7 499 7053333	http://chaihona1.ru	Mo-Su 11:00-06:00	7	\N	t	node	2600662680	\N
2027	Fantomas Chateau & Rooftop	\N	\N	55.7400240	37.6094650	+7 495 5854146	\N	Mo-Su 13:00-24:00	7	\N	t	node	3184286091	\N
2028	Mushrooms	улица Большая Якиманка, 22	\N	55.7387360	37.6150650	+7 495 7252578	https://www.mushroomsmoscow.ru/ru/	Mo-Su 10:00-24:00	7	\N	t	node	3946173960	\N
2029	Guests in thе city	\N	\N	55.7390750	37.6055650	\N	https://guests-rest.ru/	\N	7	\N	t	node	4256189407	\N
2030	Lui	\N	\N	55.7431890	37.6101150	\N	\N	Mo-Su 12:00-24:00	7	\N	t	node	4375522645	\N
2031	The Waiters	\N	\N	55.7402120	37.6123960	+7 495 7378008	https://vk.com/thewaiters	Th 15:00-24:00; Fr 00:00-01:00,17:00-24:00; Sa 00:00-05:00,17:00-24:00; Su 00:00-05:00	7	\N	t	node	4500262907	\N
2032	Магадан. Веранда	\N	\N	55.7418000	37.6095260	+7 905 5731034	\N	Mo-Fr 00:00-03:00,12:00-24:00; Sa,Su 00:00-06:00,12:00-24:00	7	\N	t	node	5764529698	\N
2033	Medusa	\N	\N	55.7409860	37.6092750	+7 499 7020780	https://pinskiy.co/restaurant/medusa	Mo-Th 12:00-24:00; Fr 13:00-24:00; Sa 00:00-02:00,13:00-24:00; Su 00:00-02:00,12:00-24:00	7	\N	t	node	6533864853	\N
2034	Спецбуфет No.2	\N	\N	55.7444620	37.6128820	+7 963 6121818	http://specbufet.ru	Mo-Su 12:00-24:00	7	\N	t	node	6565965385	\N
2035	Zabaaava	\N	\N	55.7396890	37.6058200	+7 495 5177773	http://www.zabaaava.ru/	Mo-Su 12:00-23:00; Fr,Sa 12:00-24:00	7	\N	t	node	7213882858	\N
2036	Menza	\N	\N	55.7402750	37.6101390	\N	http://www.menza-lapsha.ru	\N	7	\N	t	node	9851586987	\N
2037	ГЭС-2	\N	\N	55.7423420	37.6126570	+7 999 5441515	\N	Mo-Su 12:00-23:00	7	\N	t	node	10763790371	\N
2038	Kilim	\N	\N	55.7423230	37.6091460	\N	https://kilim.rest/	\N	7	\N	t	node	12537227891	\N
2040	Ритм & Блюз	\N	\N	55.7511320	37.6069190	+7 495 9677391	https://rhythm-blues-cafe.ru/	Mo-Fr 12:00-24:00; Sa-Su 12:00-06:00	7	\N	t	node	2800398004	\N
2041	Муфлон	\N	\N	55.7513550	37.6074030	\N	\N	Mo-Su 12:00-23:00	7	\N	t	node	4165442419	\N
2042	Café 1892	\N	\N	55.7511230	37.6103220	+7 495 7809609	\N	Mo-Fr 07:00-11:00,12:00-23:00; Sa,Su 08:00-23:00	7	\N	t	node	5220093363	\N
2043	Il pizzaiolo	\N	\N	55.7485860	37.6087950	+7 495 6972515	http://ilpizzaiolo.ru	Mo-Su 10:00-23:00; Fr,Sa 10:00-24:00	7	\N	t	node	6680035282	\N
2044	Il Letterato	\N	\N	55.7522170	37.6116090	+7 495 6099924	https://www.il-letterato.ru	Mo-Su 10:00-23:00	7	\N	t	node	7784865585	\N
2045	Корчма	Моховая улица, 8 с1	\N	55.7506390	37.6101650	+7 499 3507744;+7 903 7965141	https://korchma.ru	Fr-Sa 09:00-02:00; Mo-Th,Su 09:00-24:00	7	\N	t	way	82821059	\N
2046	Ave, pasta!	\N	\N	55.7594200	37.6088800	+7 495 2357040	\N	Mo-Su 12:00-22:00	7	\N	t	node	1145199255	\N
2047	Кофемания	\N	\N	55.7565430	37.6049270	+7 495 6519757	http://coffeemania.ru/	24/7	7	\N	t	node	1146881784	\N
2048	ВьетКафе	\N	\N	55.7572490	37.6081030	+7 495 6290830	http://www.vietcafe.ru	Mo-Su 00:00-06:00,11:00-24:00	7	\N	t	node	1161652566	\N
2049	Вареничная №1	\N	\N	55.7598930	37.6136880	\N	http://www.varenichnaya.ru	\N	7	\N	t	node	1161887096	\N
2050	Якитория	\N	\N	55.7599180	37.6116820	+7 495 6925350	https://www.yakitoriya.ru	Mo-Su 11:00-24:00	7	\N	t	node	2145729979	\N
2051	Novikov	\N	\N	55.7570990	37.6135140	+7 495 7975720	\N	Mo-Su 12:00-24:00	7	\N	t	node	2416154110	\N
2052	Академия	\N	\N	55.7594720	37.6129580	+7 495 6929649	http://www.academiya.ru	Mo-Fr 08:00-24:00; Sa,Su 10:00-24:00	7	\N	t	node	2465559327	\N
2053	Хинкали - хачапури	\N	\N	55.7576860	37.6114430	\N	https://taplink.cc/khachapuri	\N	7	\N	t	node	2542238883	\N
2054	Чеховъ	\N	\N	55.7599350	37.6130000	+7 495 6290616	http://www.cafe-chekhov.ru	Mo-Su 12:00-24:00	7	\N	t	node	2587098859	\N
2055	Meama	\N	\N	55.7573510	37.6082300	+ 7 495 015 15 51	\N	Mo-Su 11:30-23:30	7	\N	t	node	2587282154	\N
2056	Ugolёk	\N	\N	55.7564240	37.6066760	+7 495 6290211	https://www.facebook.com/pages/Ugol%D1%91k/395718663865113	Mo-Su 13:00-24:00	7	\N	t	node	2587658952	\N
2057	БиблIQтека	\N	\N	55.7590490	37.6056880	+7 495 1179710	\N	Mo-Su 12:00-24:00	7	\N	t	node	2588978258	\N
2058	Союз Композиторов	\N	\N	55.7594590	37.6091060	+7 495 6296563	http://www.ucclub.ru	\N	7	\N	t	node	2609191809	\N
2059	эZо	\N	\N	55.7599340	37.6138010	+7 967 0227707	https://ezo-restoran.ru/	Mo-Su 10:00-24:00	7	\N	t	node	2675578287	\N
2060	Белуга	\N	\N	55.7566150	37.6140370	+7 495 9010336	\N	Mo-Su 12:00-24:00	7	\N	t	node	3054509349	\N
2061	Dolmama	\N	\N	55.7538710	37.6097840	+7 495 7821998	http://www.dolmama.ru	Mo-Fr 10:00-24:00; Sa,Su 11:00-24:00	7	\N	t	node	3068070871	\N
2062	Dr. Живаго	\N	\N	55.7568330	37.6143690	+7 499 9220100	http://www.drzhivago.ru	24/7	7	\N	t	node	3104234130	\N
2063	O2 Lounge	\N	\N	55.7571420	37.6128960	+7 495 2258888	\N	Mo-Su 00:00-02:00,12:00-24:00	7	\N	t	node	3348761189	\N
2064	Capo	\N	\N	55.7597560	37.6157770	\N	https://caporest.ru/	\N	7	\N	t	node	3599930093	\N
2065	Mexican Club	\N	\N	55.7572420	37.6168000	+7 495 7888255	http://www.mexicoclub.ru	Mo-Su 10:00-23:00	7	\N	t	node	3615331571	\N
2066	Quadrum	\N	\N	55.7567890	37.6168420	+7 499 2777100	\N	\N	7	\N	t	node	3615331573	\N
2067	Северяне	Большая Никитская улица, 12	\N	55.7564900	37.6064200	+7 499 3488332	http://severyane.moscow	Su-Th 09:00-24:00; Fr-Sa 09:00-01:00	7	\N	t	node	4027973852	\N
2068	Sartoria Lamberti	\N	\N	55.7574920	37.6130350	+7 495 7950025	https://www.sartorialamberti.com	Mo-Su 06:30-23:00	7	\N	t	node	7002878683	\N
2069	Kislovsky	\N	\N	55.7534300	37.6056190	+7 495 6916769	http://www.kislovsky-restaurant.ru/	Mo-Su 07:30-24:00	7	\N	t	node	7914319813	\N
2070	Krasota	\N	\N	55.7541570	37.6084690	+7 495 7874787	https://krasota.wrf.su/	Mo-Su 13:00-00:00	7	\N	t	node	8196087180	\N
2071	Гвидон	Большая Никитская улица, 5	\N	55.7554130	37.6086860	+7 495 2580888	https://gvidon.wrf.su	Mo-Th,Su 12:00-24:00; Fr-Sa 12:00-02:00	7	\N	t	node	8941720623	\N
2072	Остерия Марио	\N	\N	55.7558960	37.6146720	+7 495 7907090-201	http://osteriamario.ru	Mo-Su 10:00-22:00	7	\N	t	node	8971732526	\N
2073	Muse	\N	\N	55.7567440	37.6052700	+7 967 2709372	\N	Mo-Su 12:00-23:30	7	\N	t	node	9176377605	\N
2074	Жарим по-грузински	\N	\N	55.7599680	37.6139110	\N	\N	Mo-Su 12:00-24:00	7	\N	t	node	9272767912	\N
2075	Что вы ели?	\N	\N	55.7541200	37.6099410	\N	\N	Mo-Su 10:00-23:00	7	\N	t	node	9991531583	\N
2076	Ikra	Большая Никитская улица, 5	\N	55.7552800	37.6091830	+7 499 6732255	https://ikra.wrf.su/moscow	Tu-Sa 12:00-22:00	7	\N	t	node	10055609618	\N
2077	El Pimpi	\N	\N	55.7565520	37.6061780	\N	https://elpimpi.rest	\N	7	\N	t	node	10557552950	\N
2078	Селёдочная	\N	\N	55.7546450	37.6136370	\N	https://seledochnaya.ru/	\N	7	\N	t	node	10998416507	\N
2079	Mamie	\N	\N	55.7567200	37.6054060	\N	https://mamie.lucky-group.rest	\N	7	\N	t	node	11258399305	\N
2080	Тайская тема	\N	\N	55.7592490	37.6109670	\N	\N	\N	7	\N	t	node	11279897185	\N
2081	Mon Viet	\N	\N	55.7592730	37.6109900	\N	\N	\N	7	\N	t	node	11279897186	\N
2082	Mollusca Rouge	\N	\N	55.7566890	37.6055620	\N	https://rouge.mollusca.ru/	\N	7	\N	t	node	11308443521	\N
2083	Il Ristorante	\N	\N	55.7562420	37.6064710	\N	https://stelladimoscahotel.com/il-ristorante/	Mo-Su 07:00-23:00	7	\N	t	node	11801716880	\N
2084	Tajiri Go	\N	\N	55.7540040	37.6085110	\N	\N	\N	7	\N	t	node	12264053354	\N
2085	Uchiwa	\N	\N	55.7540780	37.6085910	\N	\N	\N	7	\N	t	node	12264053355	\N
2086	Ayu	\N	\N	55.7540740	37.6084570	\N	\N	\N	7	\N	t	node	12264053356	\N
2087	BQ	\N	\N	55.7558430	37.6155850	+7 495 2580995	http://barbqcafe.ru	24/7	7	\N	t	relation	6211171	\N
2088	Остерия Марио	\N	\N	55.7561410	37.6160320	+7 495 2257488	www.osteriamario.ru	\N	7	\N	t	relation	6228037	\N
2090	Yamkee	\N	\N	55.7548160	37.6135870	\N	www.yamkee.com	\N	7	\N	t	relation	6228243	\N
2091	Венеция	\N	\N	55.7652180	37.6083320	+7 495 6945862	http://www.trattoria-venezia.ru	Mo-Fr 11:00-23:00; Sa,Su 12:00-23:00	7	\N	t	node	813972449	\N
2092	Padron	\N	\N	55.7672160	37.6084770	\N	https://padron-rest.ru	Mo-Su 12:00-24:00	7	\N	t	node	813972637	\N
2093	The Бык	\N	\N	55.7664110	37.6104280	+7 495 9881717-2	https://thebull.ru/	Mo-Su 11:00-23:00	7	\N	t	node	940002572	\N
2094	Tehnikum	\N	\N	55.7607900	37.6148400	+7 499 1367336	https://tehnikumbistro.ru/rus/	Mo-Fr 09:00-24:00; Sa,Su 00:00-02:00,09:00-24:00	7	\N	t	node	1098001563	\N
2095	Молоко	\N	\N	55.7611370	37.6145530	+7 495 6920309	\N	24/7	7	\N	t	node	2432685772	\N
2096	Хачапури	\N	\N	55.7632360	37.6052990	+7 985 7643118	http://www.hacha.ru	Mo-Fr 10:00-24:00; Sa,Su 11:00-24:00	7	\N	t	node	2463980858	\N
2097	Бирхаус	\N	\N	55.7641260	37.6079580	+7 495 6290847	http://www.beerbar.ru	\N	7	\N	t	node	2512899042	\N
2098	Бали	\N	\N	55.7656710	37.6115800	+7 495 7390991;+7 967 1436644	http://www.balimoscow.ru	\N	7	\N	t	node	2528507337	\N
2099	Армения	\N	\N	55.7640840	37.6053130	+7 495 6291954	\N	Mo-Su 09:00-23:00	7	\N	t	node	2560871014	\N
2100	Венеция	\N	\N	55.7634150	37.6149220	+7 495 6213535	http://www.trattoria-venezia.ru	Mo-Fr 11:00-24:00; Sa,Su 12:00-24:00	7	\N	t	node	2628393710	\N
2101	Vasilchuki Chaihona №1	\N	\N	55.7660490	37.6073620	+7 495 2340233	http://chaihona.ru/	Mo-Su 10:30-06:00	7	\N	t	node	2694460681	\N
2102	Gusto	\N	\N	55.7603120	37.6142000	+7 495 6506922	http://www.gusto-moscow.ru	\N	7	\N	t	node	3056419709	\N
2103	Театр Корша	\N	\N	55.7659530	37.6131920	+7 495 6945038	http://www.korsh.net	\N	7	\N	t	node	3183761042	\N
2104	Краснодар	\N	\N	55.7616160	37.6141130	+7 495 0239393	http://krasnodarrest.ru/	Mo-Su 12:00-24:00	7	\N	t	node	3252076686	\N
2105	Пальмира	\N	\N	55.7666580	37.6069670	+7 495 6990107	http://cafepalmyra.ru	Mo-Su 09:00-24:00	7	\N	t	node	3552337976	\N
2106	Mr. Ливанец	\N	\N	55.7631310	37.6095700	+7 495 6929923	http://www.mrlivanets.ru	Su-Th 12:00-24:00, Fr,Sa 12:00-02:00	7	\N	t	node	3674742938	\N
2107	Кузнецкий Мост, 20	\N	\N	55.7619210	37.6118870	+7 495 6237888	http://www.kuznetskymost20.ru	Mo-Su 11:00-23:00	7	\N	t	node	3723256785	\N
2108	Yura	\N	\N	55.7649670	37.6068200	+7 495 5877725	https://www.standarthotel.com/restaurants-and-bars/	Mo-Su 07:00-11:00,12:00-23:00	7	\N	t	node	4130512540	\N
2109	Lambic Seafood	\N	\N	55.7627830	37.6069070	+7 495 6299191	https://seafoodbastards.ru/	\N	7	\N	t	node	4453628425	\N
2110	Клубный дом Svoy	\N	\N	55.7667470	37.6136400	\N	https://svoy.moscow/	Mo-Su 12:00-00:00	7	\N	t	node	4549593693	\N
2111	Seven	\N	\N	55.7621920	37.6162090	+7 495 9438813	http://sevenrest.ru	Mo-Fr 08:00-24:00; Sa,Su 10:00-24:00	7	\N	t	node	4818624561	\N
2112	Sempre	\N	\N	55.7634350	37.6128020	\N	http://www.sempre.life	Mo-Su 12:00-24:00	7	\N	t	node	4908808387	\N
2113	Марчеллис	улица Большая Дмитровка, 5/6	\N	55.7603310	37.6149130	+7 903 1308920	\N	Su-Th 11:00-00:00, Fr-Sa 11:00-06:00	7	\N	t	node	4957159123	\N
2114	Twins Garden	\N	\N	55.7661360	37.6107570	+7 499 1123300	\N	Mo-Su 12:00-24:00	7	\N	t	node	5240078595	\N
2115	Айва	\N	\N	55.7649910	37.6077660	+7 495 1145577	http://chaihona-aiva.ru/	24/7	7	\N	t	node	5630658587	\N
2116	Вино, Танцы, Хачапури	\N	\N	55.7620810	37.6122950	+7 495 2550959	\N	Mo-Fr 12:00-24:00; Sa,Su 00:00-06:00,12:00-24:00	7	\N	t	node	5721223076	\N
2117	Мама будет рада	\N	\N	55.7663470	37.6071900	+7 964 7715785	http://mama-budet-rada.ru/	Mo-Su 11:00-24:00	7	\N	t	node	6138956757	\N
2118	Онегин	\N	\N	55.7653220	37.6082140	\N	\N	\N	7	\N	t	node	6277177505	\N
2119	Козловна	Пушкинская площадь, 2	\N	55.7662550	37.6083470	+7 495 6509333	http://kozlovna.ru/	Mo-Fr 12:00-24:00; Sa,Su 00:00-01:00,12:00-24:00	7	\N	t	node	6277177512	\N
2120	Brasserie Lambic	\N	\N	55.7670960	37.6081280	+7 495 9666169	https://lambic.ru	Mo-Fr 12:00-24:00; Sa,Su 00:00-03:00,12:00-24:00	7	\N	t	node	6373695783	\N
2121	Вилла Паста	\N	\N	55.7652080	37.6110400	+7 495 6505261	http://villa-pasta.ru	Su-Th 08:00-24:00; Fr,Sa 12:00	7	\N	t	node	6804187965	\N
2122	True Cost	\N	\N	55.7622350	37.6134450	+7 495 4452999	https://true-cost.ru/	Mo-Th,Su 12:00-24:00; Fr-Sa 12:00-05:00	7	\N	t	node	6918453209	\N
2123	Coba	\N	\N	55.7670610	37.6062090	\N	http://cobarest.ru	\N	7	\N	t	node	7666472023	\N
2124	Mollusca	\N	\N	55.7615700	37.6145390	+7 (495) 297-11-11	http://mollusca.ru	Mo-Su 11:00-00:00	7	\N	t	node	7853963184	\N
2125	Одесса-мама	\N	\N	55.7638890	37.6071360	+7 926 764 00 18	http://www.cafeodessa.ru	Mo-Su 11:00-23:00	7	\N	t	node	8075865427	\N
2126	Галки	\N	\N	55.7648710	37.6088410	\N	http://galki.moscow/	Mo-Su 12:00-24:00	7	\N	t	node	8112999692	\N
2127	Kaif Provenance	\N	\N	55.7623190	37.6134230	+7 495 2666966	https://kaif.moscow/	Mo-Su 00:00-05:00,12:00-24:00	7	\N	t	node	8439699523	\N
2128	Bro&N	\N	\N	55.7601070	37.6142870	+7 495 6500050	http://novikovgroup.ru/restaurants/bron/	Mo-Fr 09:00-24:00; Sa,Su 11:00-24:00	7	\N	t	node	8520342165	\N
2129	Моремания	\N	\N	55.7663630	37.6105070	+7 495 1500551	http://moremania.info	Mo-Sa 11:00-23:00; Su 11:00-22:00	7	\N	t	node	9048205436	\N
2130	Petter	\N	\N	55.7656250	37.6157380	+7 925 6171133	https://petter.su/	Mo-Th 11:00-23:00; Fr 11:00-24:00; Sa 00:00-04:00,11:00-24:00; Su 00:00-04:00,11:00-23:00	7	\N	t	node	9354087747	\N
2131	Вареничная №1	\N	\N	55.7635510	37.6066180	+7 965 1935353	http://www.varenichnaya.ru	Mo-Su 10:00-24:00	7	\N	t	node	10139386482	\N
2132	Garda	\N	\N	55.7646830	37.6164590	\N	\N	\N	7	\N	t	node	10557552960	\N
2133	Il Matto	\N	\N	55.7617120	37.6140240	\N	\N	Mo-Su 12:00-24:00	7	\N	t	node	11358722148	\N
2134	Коктейль-Холл	\N	\N	55.7616150	37.6107690	+7 495 229 36 63	https://xn----itbmcaibauf3b2b3f.xn--p1ai/	Mo-We,Su 12:00-24:00; Th-Sa 12:00-06:00	7	\N	t	node	11470173750	\N
2135	L'Atelier	\N	\N	55.7656980	37.6160980	\N	https://latelierpetrovka.com/	Mo-Su 12:00-23:00	7	\N	t	node	11663276907	\N
2136	Тхали и Карри	28/17	\N	55.7642570	37.6057570	+7 905 5911166	http://thali.me	Mo-Su 11:00-00:00	7	\N	t	node	11871651569	\N
2137	Таксим	\N	\N	55.7604270	37.6151860	\N	https://taksim.ru/	\N	7	\N	t	node	12259515519	\N
2138	Дадати	\N	\N	55.7641000	37.6155350	\N	https://dadati.ru/	\N	7	\N	t	node	12277383022	\N
2139	ExtraVirgin	\N	\N	55.7658670	37.6099410	\N	https://www.evgrill.ru/	\N	7	\N	t	node	12638459301	\N
2140	Mishka	\N	\N	55.7620330	37.6137300	\N	\N	\N	7	\N	t	node	13016208844	\N
2141	The Pivo	\N	\N	55.7661940	37.6105910	+7 495 9881717	https://thepivo.ru/	Mo-Su 12:00-23:00	7	\N	t	node	13077968453	\N
2142	Atlantica Bistro	улица Большая Дмитровка, 23	\N	55.7657550	37.6100750	\N	https://atlanticabistro.ru/	\N	7	\N	t	node	13124848701	\N
2194	Братья Третьяковы	\N	\N	55.7416520	37.6208520	\N	\N	\N	7	\N	t	node	3536208949	\N
2144	Ла Маре	\N	\N	55.7678740	37.6139500	+7 495 6940930	http://www.la-maree.ru	12:00-24:00	7	\N	t	node	813972248	\N
2145	Saviv	\N	\N	55.7681690	37.6139140	\N	https://saviv.ru/	\N	7	\N	t	node	813972630	\N
2146	Счастье	\N	\N	55.7674180	37.6074570	+7 495 6995444	https://schastye.com/	Mo-Fr 10:00-24:00; Sa,Su 00:00-06:00,10:00-24:00	7	\N	t	node	2136783163	\N
2147	Бутчер	\N	\N	55.7716230	37.6050360	+7 495 6096414	http://bisonsteak.ru	Mo-Su 12:00-24:00	7	\N	t	node	2317414996	\N
2148	Extra Virgin	\N	\N	55.7677530	37.6052610	+7 495 9163608	https://www.evgrill.ru/	Mo-Su 12:00-24:00	7	\N	t	node	2317414998	\N
2149	Delicatessen	\N	\N	55.7725660	37.6108990	+7 495 6993952	https://www.facebook.com/DelicatessenMoscow	Tu-Fr 12:00-24:00; Sa 00:00-02:00,12:00-24:00; Su 00:00-02:00,12:00-22:00	7	\N	t	node	2463830620	\N
2150	Gini	\N	\N	55.7690730	37.6162890	+7 925 9816427	https://ginirest.ru/	\N	7	\N	t	node	2470195930	\N
2151	Arts palace	\N	\N	55.7692630	37.6072830	+7 495 8531265	http://www.artspalace.ru/	\N	7	\N	t	node	2506826065	\N
2152	32.05	\N	\N	55.7707190	37.6084610	+7 905 7033205	http://veranda3205.ru	Mo-Su 11:00-03:00	7	\N	t	node	2568201202	\N
2153	Сахли	\N	\N	55.7706540	37.6164050	+7 495 6994503	http://sahli.ru	12:00-23:00	7	\N	t	node	2583844083	\N
2154	One Chef Studio	\N	\N	55.7681820	37.6147590	\N	\N	Mo-Su 12:00-23:00	7	\N	t	node	4198332831	\N
2155	Клёво	\N	\N	55.7678540	37.6135040	+7 495 7901596	https://klevo.rest/	Mo-Su 12:00-24:00	7	\N	t	node	4720464701	\N
2156	Bébé de la mer	\N	\N	55.7680460	37.6147500	+7 985 4357777	\N	Mo-Su 12:00-24:00	7	\N	t	node	5111409611	\N
2157	Чайхона №1	\N	\N	55.7698310	37.6099670	+7 495 2333300	https://chaihona1.ru/	Mo-Su 11:00-24:00	7	\N	t	node	6777109722	\N
2158	Библиайтека	Большой Путинковский переулок, 5	\N	55.7673030	37.6075210	+7 495 6486878	http://bibliiteka.ru/	11:44-05:00	7	\N	t	node	6947600568	\N
2159	Subzero	\N	\N	55.7680390	37.6148550	+7 495 9226438	\N	Mo-Su 12:00-23:00	7	\N	t	node	7810748093	\N
2160	Avero mio	\N	\N	55.7686060	37.6133140	\N	https://averomio.ru/	09:00-24:00	7	\N	t	node	9125066130	\N
2161	Steam Lounge	\N	\N	55.7674320	37.6052420	+7 915 1501186	https://steam-pushkinskaya.ru	Mo-Su 07:30-23:00	7	\N	t	node	9176377584	\N
2162	Kale XV	\N	\N	55.7682220	37.6158470	\N	\N	\N	7	\N	t	node	9490290271	\N
2163	Chekhoff	\N	\N	55.7689290	37.6055380	+7 495 9807000	\N	24/7	7	\N	t	node	9492709729	\N
2164	Золотой дракон	\N	\N	55.7693470	37.6163710	\N	http://www.goldendragon.ru/	Mo-Su 11:00-23:00	7	\N	t	node	9726743629	\N
2165	Lele	\N	\N	55.7725800	37.6072300	+7 499 940 08 92	\N	Mo-Fr 12:00-23:00; Sa,Su 10:00-23:00	7	\N	t	node	9851586980	\N
2166	Nothing fancy	улица Петровка, 30/7	Nothing Fancy — это проект с завтраками, боулами и джус-баром от Анри Бера, Стивена Шармы и шефа Романа Киселёва (Rene, Solids). В меню сделан акцент на здоровый comfort-food, плюс соки и смузи.	55.7680730	37.6143750	+7 915 058 71 96	https://nothingfancy.ru/moscow	Mo-Su 08:30-21:00	7	\N	t	node	12118333801	\N
2167	Salone	\N	\N	55.7712210	37.6056120	+7 929 9261199	https://atelierfamily.ru	Fr-Sa 12:00-02:00; Mo-Th,Su 12:00-24:00	7	\N	t	node	12378173299	\N
2168	Санто Джованни	\N	\N	55.7687250	37.6131980	+7 926 999 91 40	https://cafesanta.ru/	Mo-Th 09:00-23:00; Fr 09:00-24:00; Sa 11:00-24:00; Su 11:00-23:00	7	\N	t	node	13144231636	\N
2169	Тануки	Пятницкая улица, 53	\N	55.7348170	37.6279230	+7 495 2232223	https://tanukifamily.ru/tanuki/	Fr-Sa 11:00-02:00; Mo-Th,Su 11:00-24:00	7	\N	t	node	595386996	\N
2170	Квартира 44	\N	\N	55.7375420	37.6172120	+7 499 2388224;+7 916 4524506	http://www.kv44.ru	\N	7	\N	t	node	2463858068	\N
2171	Асадор	\N	\N	55.7349980	37.6245970	+7 495 9531564	http://asador.ru	Mo-Su 12:00-24:00	7	\N	t	node	2567764279	\N
2172	Квартира 44	\N	\N	55.7354940	37.6254130	\N	http://www.kv44.ru	Mo-Su 12:00-24:00	7	\N	t	node	2881588169	\N
2173	Сомбреро	\N	\N	55.7321350	37.6204480	+7 495 9593737	http://www.sombrero.su	Mo-Su 12:00-24:00; Th-Sa 12:00-06:00	7	\N	t	node	2914300514	\N
2174	Brasserie Lambic	\N	\N	55.7314870	37.6243610	+7 495 1501456	https://lambic.ru	Mo-Su 12:00-24:00	7	\N	t	node	3069275264	\N
2175	Бобры и утки	\N	\N	55.7336320	37.6273830	+7 495 6490051	http://bobryiutki.ru	24/7	7	\N	t	node	3161224871	\N
2176	Хинкалoff	\N	\N	55.7386010	37.6287260	+7 495 9536933	http://www.hinkaloff.com	Mo-Su 11:00-23:00	7	\N	t	node	3161224872	\N
2177	Tacobar	\N	\N	55.7329840	37.6276580	+7 495 5653013	https://tacobar.ru	\N	7	\N	t	node	4298837989	\N
2178	Черетто Море	\N	\N	55.7346180	37.6275090	+7 495 9514080	\N	Mo-Su 12:00-24:00	7	\N	t	node	5609946322	\N
2179	Абрамовъ	\N	\N	55.7379470	37.6188370	+7 495 9539654	http://abramov.rest	Mo-Su 11:00-24:00	7	\N	t	node	6253416853	\N
2180	Drinks@Dinners	\N	\N	55.7369300	37.6278490	+7 499 3505160	https://www.drinks-dinners.ru/	Mo-Su 12:00-24:00	7	\N	t	node	6297927361	\N
2181	Рихтер	\N	\N	55.7378570	37.6277490	\N	\N	Mo-Su 08:00-23:00	7	\N	t	node	6312240737	\N
2182	На Казачьем	\N	\N	55.7351170	37.6236250	+7 495 6631777	\N	Mo-Su 07:00-23:00	7	\N	t	node	6402527122	\N
2183	В ус не дул	\N	\N	55.7337930	37.6273020	+7 495 1457654	https://vusnedul.com/	\N	7	\N	t	node	10807769329	\N
2184	Обломов	1-й Монетчиковский переулок, 5	\N	55.7322410	37.6282760	+7 495 9536828;+7 495 9536620	http://restoblomov.ru/	Mo-Su 12:00-24:00	7	\N	t	way	111587797	\N
2185	Остерия Марио	\N	\N	55.7416270	37.6287240	+7 495 7907090-220	http://osteriamario.ru	Mo-Th 10:00-23:00; Fr 10:00-24:00; Sa 00:00-03:00,10:00-24:00; Su 00:00-03:00,10:00-23:00	7	\N	t	node	831119630	\N
2186	Сунжа	\N	\N	55.7389840	37.6281090	+7 495 9512972	\N	Mo-Su 10:00-24:00	7	\N	t	node	1242276656	\N
2187	Джонджоли	Пятницкая улица, 29	\N	55.7410370	37.6283560	+7 495 1355500;+7 495 9595454;+7 925 9512661	https://ch1ef.ru/restaurants/jonjoli	Mo-Su 11:00-24:00	7	\N	t	node	2451461128	\N
2188	Tutta la Vita	Ордынский тупик, 6	\N	55.7410750	37.6247000	+7 495 1145020;+7 495 7821870	https://www.tuttalavita.ru	24/7	7	\N	t	node	2453466095	\N
2189	Эссе	\N	\N	55.7411700	37.6289090	+7 495 9516404	http://jazzesse.ru	\N	7	\N	t	node	2456226695	\N
2190	Дориан Грей	\N	\N	55.7431830	37.6178030	+7 499 2386401	http://doriangray.ru	Mo-Fr 09:00-19:00	7	\N	t	node	2600543491	\N
2191	Вилла Паста	Пятницкая улица, 26	\N	55.7409070	37.6283430	+7 495 9531647;+7 495 9531660	http://villa-pasta.ru	24/7	7	\N	t	node	2674838659	\N
2192	Бьёрн	\N	\N	55.7455970	37.6269160	+7 495 9539059	http://bjorn.rest	Mo-Su 12:00-24:00	7	\N	t	node	3218033065	\N
2193	Бор	\N	\N	55.7444330	37.6278070	+7 936 5552525	http://bor.rest/	Mo-Fr 09:00-24:00; Sa-Su 10:00-24:00	7	\N	t	node	3218033066	\N
2195	Рёберная № 1	\N	\N	55.7409600	37.6274400	\N	https://rebernaya1.ru/	\N	7	\N	t	node	3958305622	\N
2196	Вареничная №1	\N	\N	55.7409650	37.6273070	+7 903 7560334	http://www.varenichnaya.ru	Mo-Su 11:00-23:00	7	\N	t	node	4051080605	\N
2197	Есть хинкали, пить вино	\N	\N	55.7445640	37.6268660	+7 495 9755535	\N	Mo-Su 11:00-24:00	7	\N	t	node	4546201455	\N
2198	Masters & Margaritas	\N	\N	55.7450750	37.6273580	+7 915 1899463	http://mmbar.ru/	Mo-Su 08:30-23:00; Fr,Sa 08:30-24:00	7	\N	t	node	5609946323	\N
2199	Sadu	\N	\N	55.7392100	37.6178370	+7 495 6428318	\N	Mo-Su 00:00-01:00,07:00-11:00,12:00-24:00	7	\N	t	node	6449483068	\N
2200	Пепе неро	\N	\N	55.7449330	37.6218410	+7 495 2878720	\N	\N	7	\N	t	node	7989050385	\N
2201	Baci & Abbracci by Francesco Voce	\N	\N	55.7398920	37.6186650	+7 495 1087595;+7 925 6782128	https://bacieabbracci.moscow/	Mo-Su 12:00-23:00	7	\N	t	node	7995085883	\N
2202	Мзиури	\N	\N	55.7409740	37.6266340	+7 495 0980336	https://mziurirest.ru/	Mo-Su 10:00-24:00	7	\N	t	node	8561050717	\N
2203	Корчма	\N	\N	55.7429600	37.6281720	+7 499 3507744;+7 499 6730407	https://korchma.ru	Fr-Sa 09:00-02:00; Mo-Th,Su 09:00-00:00	7	\N	t	node	9540480417	\N
2204	Хачапури и вино	\N	\N	55.7454160	37.6270690	\N	http://hachapuriivino.ru/	\N	7	\N	t	node	9854240558	\N
2205	Shota	\N	\N	55.7444150	37.6274340	\N	https://llgroup.ru/restaurants/shota	Mo-Su 11:00-24:00	7	\N	t	node	12182096388	\N
2206	Black Angus	\N	\N	55.7410250	37.6287160	+7 495 1414567	http://blackangus.rest/	\N	7	\N	t	node	12264053353	\N
2207	True Cost	\N	\N	55.7409010	37.6288950	+7 495 4452999	https://true-cost.ru	Fr-Sa 12:00-05:00; Mo-Th,Su 12:00-24:00	7	\N	t	node	12298901273	\N
2208	Восход	\N	\N	55.7504140	37.6270960	\N	\N	\N	7	\N	t	node	5020405212	\N
2209	Кольчуга	\N	\N	55.7528110	37.6272990	+7 495 6981616	http://kolchugarest.ru	Mo-Sa 12:00-24:00	7	\N	t	node	5164091535	\N
2210	Ambassador	\N	\N	55.7485070	37.6262610	+7 495 0055444	\N	\N	7	\N	t	node	6747196910	\N
2211	Балчуг Гриль	\N	\N	55.7483120	37.6257460	\N	\N	\N	7	\N	t	node	6747196911	\N
2212	Sofia	\N	\N	55.7469270	37.6229970	+7 495 5320623	\N	Mo-Su 12:00-24:00	7	\N	t	node	7235041236	\N
2213	Touch	\N	\N	55.7464660	37.6284100	+7 495 0550644	https://touch.rest	Mo-Su 12:00-23:00	7	\N	t	node	9045032867	\N
2214	Wine place	\N	\N	55.7477250	37.6259050	\N	\N	Mo-Su 12:00-24:00	7	\N	t	node	10634683400	\N
2215	Москвичи	\N	\N	55.7485710	37.6271560	\N	\N	\N	7	\N	t	node	11425792255	\N
2216	Старая Башня	Театральная площадь, 5 с1	\N	55.7568570	37.6205030	+7 495 6984008	http://www.oldtower.ru	Mo-Su 12:00-23:00	7	\N	t	node	1346733548	\N
2217	Casa Agave	\N	\N	55.7560750	37.6275040	+7 495 6245766	http://casa-agave.ru	Mo-Su 09:00-24:00	7	\N	t	node	2214457503	\N
2218	Кофемания	\N	\N	55.7547750	37.6215850	+7 495 6203395	http://coffeemania.ru/	Mo-Su 10:00-22:00	7	\N	t	node	2451930643	\N
2219	Кофемания	\N	\N	55.7586060	37.6265080	+7 495 9602295	http://coffeemania.ru/	Mo-Fr 08:00-24:00; Sa-Su 10:00-24:00	7	\N	t	node	2451930645	\N
2220	Страна которой нет	\N	\N	55.7581700	37.6179010	+7 495 7375401	http://novikovgroup.ru/restaurants/strana-kotoroy-net/	Mo-Th 09:00-24:00; Fr 09:00-01:00; Sa 12:00-01:00; Su 12:00-24:00	7	\N	t	node	2453046115	\N
2221	A Tavola	\N	\N	55.7587890	37.6260880	+7 495 9677776	\N	\N	7	\N	t	node	2460565633	\N
2222	Baccarat Cristal Room	\N	\N	55.7587150	37.6243680	+7 495 9333389	http://baccaratcristalroom.ru	Mo-Su 11:00-22:00	7	\N	t	node	2460993066	\N
2223	La Bottega Siciliana	\N	\N	55.7576160	37.6184200	+7 495 6600383	\N	Mo-Su 12:00-24:00	7	\N	t	node	2462945360	\N
2224	Метрополь	\N	\N	55.7588320	37.6211710	\N	\N	\N	7	\N	t	node	2463345566	\N
2225	Bon App	\N	\N	55.7591070	37.6249960	+7 495 2044917	http://www.bonapp.ru	Mo-Fr 10:00-24:00; Sa,Su 11:00-24:00	7	\N	t	node	2465638864	\N
2226	Кабинет	\N	\N	55.7589190	37.6174200	+7 495 6928263	http://www.cabinet-cafe.ru	Mo-Th 09:00-24:00; Fr 09:00-03:00; Sa 11:00-03:00; Su 11:00-24:00	7	\N	t	node	2478289044	\N
2227	Peshi	\N	\N	55.7573350	37.6169660	+7 495 1335909	http://peshirestoran.ru	Mo-Su 12:00-23:00	7	\N	t	node	2561452076	\N
2228	Высота 5642	\N	\N	55.7559630	37.6276130	+7 495 6213064	https://novikovgroup.ru/restaurants/5642Restaurant/5642Visota_58.html	Mo-Su 12:00-24:00	7	\N	t	node	2659476278	\N
2229	Натахтари	\N	\N	55.7570710	37.6283280	+7 495 9249444	http://cafenatahtari.ru	Mo-Su 11:00-24:00	7	\N	t	node	2659485274	\N
2230	Il Pittore	\N	\N	55.7578880	37.6248830	+7 495 7898078	http://ilpittore.ru	\N	7	\N	t	node	2794581617	\N
2231	Хинкальная	\N	\N	55.7558350	37.6237600	+7 495 6284118	http://kafekhinkalnaya.ru	Mo-Su 12:00-23:00	7	\N	t	node	2891277220	\N
2232	Coba	\N	\N	55.7580880	37.6272960	+7 495 7443646	http://cobarest.ru	Mo-Su 12:00-24:00	7	\N	t	node	3034464783	\N
2233	Русское географическое общество	\N	\N	55.7578440	37.6267750	+7 495 7600898	http://rgo-restoran.ru	Mo-Su 12:00-23:00	7	\N	t	node	3120409483	\N
2234	Bosco Café	\N	\N	55.7547900	37.6201910	+7 495 6203182;+7 495 6600550	https://boscofamily.ru	Mo-Su 10:00-22:00	7	\N	t	node	3150353746	\N
2235	Savva	\N	\N	55.7583790	37.6210480	+7 499 2701061	http://savvarest.ru	Mo-Su 08:00-24:00	7	\N	t	node	3501463293	\N
2236	Юлина кухня	\N	\N	55.7572630	37.6171920	+7 495 7899250	http://jvkitchen.ru	Mo-Su 12:00-24:00	7	\N	t	node	3641279492	\N
2237	Москва	\N	\N	55.7570000	37.6175170	+7 495 6658473	\N	Mo-Su 11:00-24:00	7	\N	t	node	3689700049	\N
2238	Мандарин. Лапша и утки	\N	\N	55.7581680	37.6256310	+7 495 7717204	http://ducksandnoodles.ru	Mo-Su 12:00-06:00	7	\N	t	node	3808185868	\N
2239	Вареничная №1	\N	\N	55.7566150	37.6214790	+7 962 9884163	http://www.varenichnaya.ru	Mo-Su 10:00-24:00	7	\N	t	node	3809925867	\N
2240	Ткемали	\N	\N	55.7582030	37.6271180	+7 495 9831070	http://tkemalirest.ru/	Su-Th 09:00-24:00, Fr,Sa 09:00-01:00	7	\N	t	node	3814060860	\N
2241	Рыбы нет	\N	\N	55.7590180	37.6253270	+7 495 2584206	http://novikovgroup.ru/restaurants/ryby-net	Mo-Su 12:00-24:00	7	\N	t	node	3838934520	\N
2242	Wine and Crab	\N	\N	55.7584370	37.6238120	+7 495 6217329	http://www.winecrab.ru	Mo-Su 12:00-24:00	7	\N	t	node	4328148503	\N
2243	Royal	\N	\N	55.7543290	37.6261090	+7 968 8108103	http://www.china-rest.com	Mo-Su 11:00-23:00	7	\N	t	node	4403223578	\N
2244	Solo	\N	\N	55.7561460	37.6274400	+7 495 2951517	https://novikovgroup.ru/restaurants/solo/	Su-Th 12:00-24:00, Fr,Sa 12:00-01:00	7	\N	t	node	5035455222	\N
2245	Магадан	\N	\N	55.7546240	37.6247310	\N	https://magadanrest.ru/	\N	7	\N	t	node	5164091525	\N
2246	Il pizzaiolo	\N	\N	55.7567570	37.6216800	+7 495 6067409	http://ilpizzaiolo.ru	Su-Th 10:00-23:00; Fr,Sa 10:00-24:00	7	\N	t	node	5164091540	\N
2247	Pizzamento	\N	\N	55.7600270	37.6248420	+7 925 4554545	http://www.pizzamento.ru/	Mo-Su 10:00-22:00	7	\N	t	node	5260314980	\N
2355	Yak house	\N	\N	55.7448460	37.6297750	+7 925 2797000	\N	Mo-Su 12:00-23:00	7	\N	t	node	4720464706	\N
2248	Замечательные люди	\N	\N	55.7558510	37.6281690	+7 495 6066893	https://wonderfulpeople.ru/	Mo-Su 12:00-24:00	7	\N	t	node	5335838828	\N
2249	Вареничная №1	\N	\N	55.7573810	37.6212480	+7 499 7556063	http://www.varenichnaya.ru	Mo-Su 10:00-24:00	7	\N	t	node	5473052037	\N
2250	Красная площадь, дом 1	\N	\N	55.7553620	37.6182190	\N	\N	\N	7	\N	t	node	6012079979	\N
2251	Сорока	\N	\N	55.7577400	37.6230640	+7 495 6282284	http://sorokakafe.ru	\N	7	\N	t	node	6262633360	\N
2252	Brasserie Lambic	\N	\N	55.7563080	37.6272820	+7 495 6255547	https://lambic.ru	Mo-Su 12:00-24:00	7	\N	t	node	6533864848	\N
2253	Barbosco	\N	\N	55.7540230	37.6216840	+7 495 6273703	https://barbosco.com	Mo-Fr 10:00-24:00; Sa,Su 00:00-03:00,10:00-24:00	7	\N	t	node	8052435130	\N
2254	Реберная № 1	\N	\N	55.7572180	37.6209210	+7 499 391 62 78	\N	Mo-Th 12:00-23:00; Fr 12:00-24:00; Sa 11:00-24:00; Su 11:00-23:00	7	\N	t	node	8261664819	\N
2255	Tehnikum	\N	\N	55.7579490	37.6238720	+7 495 1367336	https://www.tehnikumbistro.ru/rus/	Mo-Su 12:00-24:00	7	\N	t	node	8550417573	\N
2256	Conservatory	\N	\N	55.7598350	37.6217480	+7 495 783 1298	\N	\N	7	\N	t	node	9083346717	\N
2257	Тоттори	\N	\N	55.7573000	37.6283640	+7 499 6780866	https://tottori.ru/	Mo-Su 11:00-23:00	7	\N	t	node	9535137455	\N
2258	Варварка III	\N	\N	55.7530030	37.6275090	\N	\N	\N	7	\N	t	node	10691274563	\N
2259	Хачапури	\N	\N	55.7571500	37.6207880	\N	http://www.hacha.ru	\N	7	\N	t	node	11308443514	\N
2260	Varvarka 3	\N	\N	55.7537410	37.6262260	+7 (495) 698 16 16	https://varvarka3.ru/	Mo-Sa 12:00-00:00	7	\N	t	node	12273425606	\N
2261	The Бык	\N	\N	55.7551100	37.6223960	+7 495 9881717	https://thebull.ru	Mo-Su 12:00-23:00	7	\N	t	node	12378180801	\N
2262	Manul	\N	\N	55.7580050	37.6180940	\N	https://manulmoscow.ru	\N	7	\N	t	node	12507761927	\N
2263	Sanduny	\N	\N	55.7642310	37.6210870	\N	\N	\N	7	\N	t	node	2228515337	\N
2264	Джаганнат	улица Кузнецкий Мост, 11	\N	55.7621620	37.6226100	+7 495 6283580	http://jagannath.ru	Mo 08:00-23:00; Tu-Fr 08:00-24:00; Sa 10:00-24:00; Su 10:00-23:00	7	\N	t	node	2260787406	\N
2265	Bolshoi	\N	\N	55.7613700	37.6183910	+7 495 7898652	https://www.facebook.com/bolshoi.restaurant	Mo-Su 12:00-24:00	7	\N	t	node	2356983191	\N
2266	Гудман	Неглинная улица, 20	\N	55.7666110	37.6227780	+7 495 6401749	https://goodman.ru/	Mo-Su 12:00-24:00	7	\N	t	node	2446451441	\N
2267	Белое солнце пустыни	\N	\N	55.7661300	37.6204640	+7 495 6252596	http://www.bsp-rest.ru/	\N	7	\N	t	node	2446830337	\N
2268	Узбекистан	\N	\N	55.7658450	37.6201960	+7 495 6230585	http://www.uzbek-rest.ru	\N	7	\N	t	node	2446830338	\N
2269	Кофемания	\N	\N	55.7667240	37.6219080	+7 495 2298459	http://coffeemania.ru/	24/7	7	\N	t	node	2451930646	\N
2270	Гриль Хаус	\N	\N	55.7618720	37.6267250	\N	https://grille-house.com/	12:00-24:00	7	\N	t	node	2452855290	\N
2271	Il Forno	\N	\N	55.7614950	37.6204800	+7 495 6219080	http://www.ilforno.ru	Mo-Su 11:00-24:00	7	\N	t	node	2465538116	\N
2272	Куршевель	\N	\N	55.7618230	37.6186410	+7 495 7248833	http://ginza.ru/restaurant/Courchevel	Mo-Su 21:00-06:00; Fr,Sa 21:00-08:00	7	\N	t	node	2470195944	\N
2273	Ткемали	\N	\N	55.7609180	37.6223090	+7 495 9882656	http://tkemalirest.ru	Mo-Su 12:00-24:00	7	\N	t	node	2523343456	\N
2274	Хинкальная	\N	\N	55.7630360	37.6197870	+7 495 2761500	http://kafekhinkalnaya.ru	24/7	7	\N	t	node	2538711171	\N
2275	Fumisawa Sushi	\N	\N	55.7619750	37.6173680	+7 495 7751969	http://novikovgroup.ru/restaurants/Fumisawa	Mo-Su 12:00-24:00	7	\N	t	node	2538776988	\N
2276	Чайхона №1	улица Петровские Линии, 2/18	\N	55.7639710	37.6182690	+7 495 7900032	http://chaihona1.ru	Mo-Su 11:00-06:00	7	\N	t	node	2600662676	\N
2277	Capo dei Capi	\N	\N	55.7622710	37.6203510	+7 495 6362735	https://capodeicapi.ru/	Su-Th 12:00-24:00, Fr,Sa 12:00-06:00	7	\N	t	node	2995663542	\N
2278	Marrakesh	\N	\N	55.7619450	37.6203670	+7 495 9661818	\N	Mo-Su 00:00-06:00	7	\N	t	node	2995663543	\N
2279	Bruno	\N	\N	55.7638530	37.6202170	\N	https://bruno.lucky-group.rest	\N	7	\N	t	node	2995684777	\N
2280	Романов	\N	\N	55.7633380	37.6197670	+7 495 6286026	\N	\N	7	\N	t	node	2995684780	\N
2281	Chips	\N	\N	55.7618570	37.6184430	+7 495 6286867	http://novikovgroup.ru/restaurants/chips	Mo-Su 12:00-24:00; Th-Sa 12:00-06:00	7	\N	t	node	2998660309	\N
2282	Шашлыкофф	\N	\N	55.7620910	37.6254330	+7 495 7923930	https://shashlikoff.com	Mo-Th,Su 10:00-24:00; Fr-Sa 10:00-03:00	7	\N	t	node	3002643692	\N
2283	Савой	\N	\N	55.7606240	37.6232920	\N	http://savoy.ru/restaurants/restaurant-savoy	Mo-Su 12:00-24:00	7	\N	t	node	3032477094	\N
2284	Арарат	\N	\N	55.7601110	37.6214370	+7 495 7831234	\N	Mo-Su 12:00-24:00	7	\N	t	node	3787744557	\N
2285	Spaten House	\N	\N	55.7624150	37.6272390	\N	\N	Mo-Su 12:00-24:00	7	\N	t	node	3956705982	\N
2286	Ketch Up	\N	\N	55.7611360	37.6171690	+7 499 7555665	http://ketchupburgers.ru	Su-Th 11:00-23:00, Fr,Sa 11:00-06:00	7	\N	t	node	4701822603	\N
2287	Горыныч	\N	\N	55.7667870	37.6239790	+7 495 9373811	http://gorynich.com/	Mo-We,Su 08:00-24:00; Th-Sa 08:00-02:00	7	\N	t	node	5422226541	\N
2288	Dante	улица Кузнецкий Мост, 3 с2	\N	55.7614820	37.6174860	+7 903 7804040	http://dante.moscow/	Su-Th 11:00-24:00; Fr-Sa 11:00-02:00	7	\N	t	node	5533109621	\N
2289	Buro	\N	\N	55.7610540	37.6191660	+7 495 2767678	http://www.burotsum.com/	Mo-Su 12:00-24:00	7	\N	t	node	5581166520	\N
2290	Шико	\N	\N	55.7622620	37.6275960	\N	\N	\N	7	\N	t	node	6005863545	\N
2291	Грузинские каникулы	\N	\N	55.7622510	37.6277880	+7 903 2453844	http://gruzinskie-kanikuli.ru/	Mo-Fr 10:00-24:00; Sa,Su 00:00-06:00,12:00-24:00	7	\N	t	node	6005863546	\N
2292	Не путай берега	\N	\N	55.7666920	37.6240240	+7 915 4496182	\N	Mo-Su 09:00-23:00	7	\N	t	node	6267536954	\N
2293	Pasta Queen	\N	\N	55.7620300	37.6258520	+7 495 0066010	https://pastaqueen.ru/	Mo-Fr 12:00-24:00; Sa,Su 00:00-03:00,12:00-24:00	7	\N	t	node	6378471334	\N
2294	Жаровня. Чайхона	\N	\N	55.7602130	37.6247510	\N	\N	Mo-Su 12:00-23:00	7	\N	t	node	6918453206	\N
2295	The Greeks	\N	\N	55.7628780	37.6197970	\N	\N	Mo-Su 12:00-24:00	7	\N	t	node	7042277287	\N
2296	Bosco	\N	\N	55.7625650	37.6198040	+7 495 6213117;+7 495 6600550	https://boscofamily.ru/brands/articoli-salon-spa.html	Mo-Su 10:00-22:00	7	\N	t	node	7370160406	\N
2297	Loomi	\N	\N	55.7612900	37.6205940	+7 495 2767082	\N	Mo-Su 11:00-24:00	7	\N	t	node	7727342350	\N
2298	Джонджоли	Неглинная улица, 10	\N	55.7618900	37.6205520	+7 495 1355500;+7 495 6236263;+7 926 0791224	https://ch1ef.ru/restaurants/jonjoli	Mo-Su 10:00-24:00	7	\N	t	node	8210180918	\N
2299	Субботица	\N	\N	55.7623030	37.6279730	\N	https://www.subbotitsa.ru/	\N	7	\N	t	node	8746266873	\N
2300	Остерия Марио	\N	\N	55.7603680	37.6243360	+7 495 7907090-214	http://osteriamario.ru	Mo-Su 10:00-22:00	7	\N	t	node	8971732521	\N
2356	Grey	\N	\N	55.7393110	37.6382930	\N	\N	\N	7	\N	t	node	8274641917	\N
2301	Поколение	\N	\N	55.7658880	37.6257870	\N	https://pokolenie-moscow.com/	Fr 18:00-24:00; Sa,Su 00:00-02:15,12:00-24:00	7	\N	t	node	8975544395	\N
2302	Londri	\N	\N	55.7627060	37.6171710	+7 495 189 88 89	\N	Mo-Fr 12:00-24:00; Sa,Su 00:00-02:00,12:00-24:00	7	\N	t	node	9195454942	\N
2303	Soma	\N	\N	55.7669160	37.6203150	\N	\N	Mo-Fr 12:00-24:00; Sa,Su 00:00-02:00,12:00-24:00	7	\N	t	node	9993649696	\N
2304	Ikura	\N	\N	55.7666540	37.6243920	+7 495 1985858	https://ikura.rest/	Mo-Th,Su 12:00-00:00; Fr-Sa 12:00-02:00	7	\N	t	node	11824537678	\N
2305	Ёж и Устрица	\N	\N	55.7607070	37.6222720	+7 936 5552288	https://ezhiustrica.ru/	Mo-Su 12:00-24:00	7	\N	t	node	11843797420	\N
2306	Miss you	\N	\N	55.7628470	37.6179180	\N	\N	\N	7	\N	t	node	11851428592	\N
2307	Avrora	\N	\N	55.7671940	37.6233290	\N	https://avrora.rest/	\N	7	\N	t	node	12438940101	\N
2308	Oshi	\N	\N	55.7641200	37.6175740	\N	\N	\N	7	\N	t	node	13016208864	\N
2309	Brassery Кузнецкий млст	Kuznetskiy Most Street, 6/3 с3	\N	55.7612320	37.6174370	+74957302233	https://brasseriemost.rest/	Mo-Su 08:00-00:00	7	\N	t	node	13120657901	\N
2310	Люсьен Оливье	\N	\N	55.7669760	37.6208360	\N	https://nebufet.ru/	11:00-22:00	7	\N	t	node	13161899705	\N
2311	Tajj Mahal	\N	\N	55.7607890	37.6240390	\N	\N	\N	7	\N	t	node	13193075867	\N
2312	Корчма	Садовая-Самотёчная улица, 13/14 с2	\N	55.7742260	37.6174870	+7 495 6882666;+7 499 3507744	https://korchma.ru	Fr-Sa 10:00-02:00; Mo-Th,Su 10:00-24:00	7	\N	t	node	813653264	\N
2313	Probka	\N	\N	55.7688740	37.6228550	+7 495 9959045	http://probka.org/restaurants/msk/probka-na-tsvetnom	Mo-Fr 09:00-24:30; Sa-Su 10:00-24:30	7	\N	t	node	2071843577	\N
2314	Lavash	\N	\N	55.7693130	37.6206490	\N	http://www.restoranlavash.ru	Mo-Su 11:00-24:00	7	\N	t	node	2135437852	\N
2315	Бутчер	\N	\N	55.7686510	37.6229030	+7 499 7056923	http://bisonsteak.ru	Mo-Su 12:00-24:00	7	\N	t	node	2511446248	\N
2316	Пироги, вино и гусь	\N	\N	55.7725710	37.6207710	+7 499 2720922	http://pvgoose.com	Mo-Su 10:00-23:00	7	\N	t	node	2705589541	\N
2317	Folk	\N	\N	55.7680570	37.6230300	\N	\N	Fr-Su 18:00-24:00	7	\N	t	node	2774677691	\N
2318	Anchovy's Club	\N	\N	55.7680230	37.6248270	\N	\N	Mo-Fr 12:00-24:00; Sa,Su 00:00-02:00,12:00-24:00	7	\N	t	node	3300339744	\N
2319	Bistro Trompette	\N	\N	55.7705750	37.6255490	\N	\N	\N	7	\N	t	node	3387503177	\N
2320	Chère Maman	\N	\N	55.7708260	37.6254590	+7 939 851 39 42	https://cheremaman.ru/	Mo-Fr 09:00-23:00; Sa-Su 11:00-23:00	7	\N	t	node	3387503179	\N
2321	Гнездо глухаря	\N	\N	55.7723080	37.6223950	+7 495 6501439	http://gnezdogluharya.ru	\N	7	\N	t	node	3784948862	\N
2322	Wu Shu	\N	\N	55.7707960	37.6252060	+7 901 1477538	https://wu-shu.moscow/	Mo-Su 12:00-24:00	7	\N	t	node	3893310161	\N
2323	Valenok	\N	\N	55.7689120	37.6204730	+7 499 2900215	https://www.novikovgroup.ru/restaurants/valenok	\N	7	\N	t	node	4053661921	\N
2324	Мария Санта	\N	\N	55.7694200	37.6250230	+7 919 7644440	http://www.mariasanta.ru	Mo-Su 11:00-24:00	7	\N	t	node	4243064030	\N
2325	Atlantica Bistro	\N	\N	55.7699390	37.6207440	\N	https://atlanticabistro.ru/	Mo-Su 08:00-24:00	7	\N	t	node	4786529035	\N
2326	Wine time	\N	\N	55.7684220	37.6241470	+7 495 2520890	http://www.winetimemoscow.ru	Mo-Su 12:00-24:00	7	\N	t	node	4865954824	\N
2327	Sono	\N	\N	55.7733050	37.6195460	+7 933 2059579	https://sonomoscow.ru/	Su-Th 11:00-24:00	7	\N	t	node	5216004765	\N
2328	Рыба моя	\N	\N	55.7676030	37.6231280	+7 495 1208853	http://perelmanpeople.com/restoran/riba-moya/	Mo-Su 12:00-23:00	7	\N	t	node	5678235237	\N
2329	Fish Проект	\N	\N	55.7705050	37.6270730	\N	https://fishproekt.ru/	Mo-Su 11:00-23:00	7	\N	t	node	5952157401	\N
2330	Илиадис	\N	\N	55.7742390	37.6182250	+7 499 9930113	\N	Mo-Su 18:00-23:00	7	\N	t	node	6235850339	\N
2331	J. Z. Peking Duck	\N	\N	55.7720540	37.6200620	+7 962 9978727	https://jzpekingduck.ru/	Mo-Su 12:00-23:00	7	\N	t	node	6805220386	\N
2332	Smoke BBQ	Трубная улица, 18	\N	55.7695670	37.6253130	+7 926 0415372	https://smokebbq.ru/msk	Fr-Sa 09:00-24:00; Mo-Th,Su 09:00-23:00	7	\N	t	node	7133530133	\N
2333	Тануки	\N	\N	55.7688470	37.6208110	+7 499 6492223	https://tanukifamily.ru/tanuki/	Mo-Su 11:30-24:00	7	\N	t	node	7918395284	\N
2334	Хачапури и вино	\N	\N	55.7697210	37.6254460	\N	http://hachapuriivino.ru/	Mo-Su 10:00-23:00	7	\N	t	node	8659258001	\N
2335	Found	\N	\N	55.7712820	37.6206540	+7 495 2150835	\N	Mo-Su 11:00-23:00; Fr,Sa 11:00-24:00	7	\N	t	node	8951550937	\N
2336	Вареничная №1	\N	\N	55.7697580	37.6207840	+7 499 7556063	http://www.varenichnaya.ru	\N	7	\N	t	node	9885958897	\N
2337	Вертели	\N	\N	55.7711890	37.6253810	\N	https://verteli.ru	Mo-Th,Su 11:00-23:00; Fr-Sa 11:00-24:00	7	\N	t	node	10313027309	\N
2338	Le Pigeon	\N	\N	55.7679790	37.6230450	\N	\N	\N	7	\N	t	node	10717624779	\N
2339	AVA Bistro	\N	\N	55.7672350	37.6232300	\N	\N	Mo-Su 09:00-23:00	7	\N	t	node	11663276905	\N
2340	Old Money	\N	\N	55.7740030	37.6179000	\N	https://oldmoney.moscow/	\N	7	\N	t	node	12318376332	\N
2341	Bawo	\N	\N	55.7706540	37.6258720	\N	http://baworest.ru/	\N	7	\N	t	node	12783350015	\N
2342	Эль Гаучо	улица Зацепский Вал, 6	\N	55.7327690	37.6393260	+7 495 9532876	https://www.elgaucho.ru/	Mo-Su 11:30-23:30	7	\N	t	node	1512519830	\N
2343	Moments	\N	\N	55.7334260	37.6388860	+7 499 5301768	https://www.facebook.com/momentswinebar	Mo-Fr 09:00-23:00; Sa,Su 11:00-23:00	7	\N	t	node	1542051324	\N
2344	TownHouse	\N	\N	55.7360850	37.6350780	+7 495 7205303	\N	Mo-Su 06:30-23:00	7	\N	t	node	3183738184	\N
2345	Снеди Феди	Садовническая набережная, 75	\N	55.7369330	37.6402900	+7 495 2355001	\N	Mo-Fr 09:00-19:00	7	\N	t	node	3989633675	\N
2346	Рамен-Клаб	Садовническая набережная, 75	\N	55.7365790	37.6405030	+7 929 5363534	http://www.ramenclub.ru	Mo-Sa 10:30-21:00; Su 12:00-20:00	7	\N	t	node	4786529026	\N
2347	Бутчер	Садовническая набережная, 75	\N	55.7361510	37.6407640	+7 495 7742635	http://bisonsteak.ru	Mo-Su 12:00-24:00	7	\N	t	node	4786529028	\N
2348	Казан Чай Бар	\N	\N	55.7378310	37.6323420	+7 495 9799119	http://kazancafe.tatar	Mo-Su 10:00-22:00	7	\N	t	node	4991374057	\N
2349	Джонджоли	улица Зацепский Вал, 2 с3	\N	55.7334250	37.6406650	+7 495 1355500;+7 916 1495653	https://ch1ef.ru/restaurants/jonjoli	Mo-Su 09:00-24:00	7	\N	t	node	7811949012	\N
2350	Хуго	\N	\N	55.7371390	37.6401780	+7 916 6884763	\N	Mo-Su 12:00-23:00	7	\N	t	node	8085917178	\N
2351	Мясо & Паста	\N	\N	55.7339870	37.6364780	+7 495 1501475	http://meat-pasta.ru/	24/7	7	\N	t	node	9680063592	\N
2352	Non Solo	\N	\N	55.7433480	37.6385770	+7 495 0235262	https://nonsolo.ru/	10:00-06:00	7	\N	t	node	2339811280	\N
2353	Козловица	\N	\N	55.7409070	37.6291230	+7 495 2582823	http://www.kozlovica.ru	\N	7	\N	t	node	2456226690	\N
2354	Luma	\N	\N	55.7411560	37.6292480	\N	https://luma.rest	\N	7	\N	t	node	2483391737	\N
2358	Community	\N	\N	55.7459670	37.6381840	+7 499 8110811	\N	Mo-Su 12:00-24:00	7	\N	t	node	5260252118	\N
2359	Green Lounge	\N	\N	55.7466400	37.6306590	\N	\N	\N	7	\N	t	node	6303242565	\N
2360	Лето Италия	\N	\N	55.7463500	37.6291180	\N	https://www.letoitaly.ru/	\N	7	\N	t	node	12755520652	\N
2361	Садовническая	Садовническая улица, 20 с1	\N	55.7467410	37.6307420	+7 495 9516438;+7 495 9535526;+7 495 9537373;+7 90	https://hotelsadovnicheskaya.ru/	24/7	7	\N	t	relation	9355954	\N
2362	Па-паэлья	\N	\N	55.7621410	37.6350470	+7 926 6035323	\N	Mo-Su 11:00-23:00	7	\N	t	node	778886785	\N
2363	Лига пап	\N	\N	55.7653260	37.6309260	\N	https://liga-pap.ru/	\N	7	\N	t	node	941301023	\N
2364	Паста и Баста	\N	\N	55.7662070	37.6320300	+7 495 6245252	\N	12:00-24:00	7	\N	t	node	941301026	\N
2365	Chang	\N	\N	55.7620470	37.6352220	\N	https://changcafe.ru	Mo-Su 11:00-23:00	7	\N	t	node	1866421304	\N
2366	Beverly Hills Diner	\N	\N	55.7665120	37.6310500	+7 495 6254221	https://www.bhdiner.ru	24/7	7	\N	t	node	2402541808	\N
2367	Шербет	\N	\N	55.7637240	37.6356850	+7 495 6214687	http://www.scherbet.ru	24/7	7	\N	t	node	2509793566	\N
2368	Brasserie Lambic	\N	\N	55.7665410	37.6406700	+7 495 6282882	https://lambic.ru	Mo-Su 12:00-24:00	7	\N	t	node	2520788385	\N
2369	Бенвенуто	Сретенский бульвар, 6/1 с1	\N	55.7660690	37.6341930	+7 495 6233300	http://www.benvenuto.su	Mo-Fr 11:00-23:00; Sa,Su 12:00-23:00	7	\N	t	node	2527546664	\N
2370	Тибет	\N	\N	55.7651340	37.6355010	+7 495 2872021	http://tibethimalaya.ru	24/7	7	\N	t	node	2634830897	\N
2371	Китайская грамота	\N	\N	55.7666750	37.6304180	+7 495 6254757	http://chinagramota.ru	Mo-Su 12:00-24:00	7	\N	t	node	2722998326	\N
2372	Одесса-мама	\N	\N	55.7617970	37.6356900	+7 964 6471110	http://www.cafeodessa.ru	Mo-Su 12:00-23:00	7	\N	t	node	2808143347	\N
2373	Хачапури	\N	\N	55.7616800	37.6358960	+7 985 7649858	http://www.hacha.ru	Mo-Su 12:00-23:30	7	\N	t	node	2835544579	\N
2374	Rакия бар	\N	\N	55.7663000	37.6299560	+7 495 6281944	https://ракиябар.рф/	Mo-Fr 12:00-24:00; Sa,Su 00:00-03:00,12:00-24:00	7	\N	t	node	3587204096	\N
2375	Аляска	\N	\N	55.7653560	37.6343050	+7 977 4369367	https://alaska-bar.com/	Mo-Fr 12:00-24:00; Sa,Su 00:00-02:00,12:00-24:00	7	\N	t	node	3615462512	\N
2376	Хинкальная	\N	\N	55.7663060	37.6304060	\N	\N	\N	7	\N	t	node	3655165725	\N
2377	Брянский бык	\N	\N	55.7654130	37.6310000	+7 495 6230848	http://bbyk.ru	Mo-Su 11:00-24:00	7	\N	t	node	3656471080	\N
2378	Sölna	\N	\N	55.7612000	37.6359680	\N	\N	\N	7	\N	t	node	4598315951	\N
2379	Пробка	\N	\N	55.7623060	37.6351010	+7 495 9661591	http://probkabar.ru/	Su-Th 12:00-24:00, Fr,Sa 12:00-02:00	7	\N	t	node	4607984508	\N
2380	Козловна	\N	\N	55.7619490	37.6340460	+7 495 1112411	http://kozlovna.ru/	Su-Th 12:00-24:00, Fr,Sa 12:00-01:00	7	\N	t	node	5418615760	\N
2381	Вареничная №1	\N	\N	55.7629560	37.6353300	+7 926 8050994	http://www.varenichnaya.ru	Mo-Th 10:00-23:00; Fr 10:00-24:00; Sa 11:00-24:00; Su 11:00-23:00	7	\N	t	node	6354094385	\N
2382	Roberto	\N	\N	55.7663010	37.6301430	+7 495 6210915	https://ristoranteroberto2001.ru/	Mo-Su 12:00-24:00	7	\N	t	node	6375839821	\N
2383	Чичико	\N	\N	55.7669080	37.6408260	+7 903 9748700	\N	Mo-Fr 11:00-23:00; Sa,Su 11:00-24:00	7	\N	t	node	6388772386	\N
2384	Izumi	\N	\N	55.7662250	37.6400600	+7 495 6215510	https://izumi-moscow.ru/	Su-Th 11:00-00:00; Fr-Sa 11:00-05:00	7	\N	t	node	6918453199	\N
2385	Steak It Easy	\N	\N	55.7608520	37.6316460	\N	http://steakiteasy.ru	Mo-Su 10:00-24:00	7	\N	t	node	7853996291	\N
2386	Flâner	\N	\N	55.7624200	37.6365300	+7 996 9644488	https://flanermoscow.ru/	Mo-Fr 09:00-24:00; Sa,Su 00:00-01:00,10:00-24:00	7	\N	t	node	8327574109	\N
2387	Сандро	\N	\N	55.7649180	37.6362070	+7 495 7746242	https://sanrest.ru/	Mo-Su 12:00-24:00	7	\N	t	node	9490290257	\N
2388	Хинкали & Vino	\N	\N	55.7631200	37.6350940	\N	\N	Mo-Su 10:00-00:00	7	\N	t	node	9851586972	\N
2389	Ocean Basket	\N	\N	55.7615050	37.6325600	\N	\N	\N	7	\N	t	node	10728501648	\N
2390	Штейгер	\N	\N	55.7619860	37.6386210	\N	https://steiger.rest	\N	7	\N	t	node	13050910992	\N
2391	Babacha	\N	\N	55.7716570	37.6379160	+7 925 3776787	https://babacha.ru	Mo-Su 11:00-00:00	7	\N	t	node	815105230	\N
2392	Graff Lounge	\N	\N	55.7725210	37.6376810	+7 495 2210393	http://graff-lounge.ru	Mo-Su 12:00-23:00	7	\N	t	node	1445387363	\N
2393	Хинкальная на Спасской	\N	\N	55.7737740	37.6395430	+7 495 5424337	\N	Mo-Fr 11:00-23:00; Sa,Su 12:00-23:00	7	\N	t	node	1448626615	\N
2394	Magnus Locus	\N	\N	55.7741430	37.6331950	+7 495 6500000	https://magnuslocus.ru/	Mo-Su 12:00-24:00	7	\N	t	node	2564696409	\N
2395	Долма	\N	\N	55.7678260	37.6318900	+7 985 9226321	http://restoran-dolma.ru/	Mo-Su 11:00-24:00	7	\N	t	node	2700041506	\N
2396	Beer Happens	\N	\N	55.7705080	37.6332190	+7 985 0825747	http://beerhappens.ru	Su-Th 12:00-24:00; Fr-Sa 00:00-02:00	7	\N	t	node	3859593136	\N
2397	Jam Club Андрея Макаревича	\N	\N	55.7684210	37.6316760	\N	https://jamclub.moscow/	We-Fr 18:00-23:00; Sa,Su 12:00-23:00	7	\N	t	node	4274126189	\N
2398	Soul & Spirits	\N	\N	55.7703220	37.6326150	\N	\N	\N	7	\N	t	node	6267536951	\N
2399	Дом культур	\N	\N	55.7708740	37.6321740	\N	https://domkultur.ru/	Mo-Th 12:00-23:00; Fr 12:00-24:00; Sa 00:00-05:00,12:00-24:00; Su 00:00-05:00,12:00-23:00	7	\N	t	node	6312240735	\N
2400	Marmo	\N	\N	55.7674470	37.6324880	\N	https://marmo.rest/	Mo-Su 12:00-23:00	7	\N	t	node	8261786218	\N
2401	Кочевники	\N	\N	55.7673190	37.6314170	+7 495 2227150	\N	Mo-Su 11:00-24:00	7	\N	t	node	8261786223	\N
2402	Riesling Boyz	\N	\N	55.7684290	37.6320820	+7 925 255 33 34	https://rieslingboyz.ru/	Mo-Su 10:00-23:00	7	\N	t	node	8323630101	\N
2403	Lila	\N	\N	55.7695360	37.6325360	+7 495 607 10 01	https://gt.life/	Mo-Su 12:00-23:00	7	\N	t	node	9272767931	\N
2404	Olluco	\N	\N	55.7702250	37.6375290	\N	\N	Tu-Su 17:00-24:00	7	\N	t	node	9315524905	\N
2405	Maurizio	\N	\N	55.7705320	37.6329600	+7 495 1977423	https://www.maurizio.ru/	Mo-Su 12:00-24:00	7	\N	t	node	9892930532	\N
2406	Кот Бегемот	\N	\N	55.7740880	37.6330460	\N	https://begemotkot.ru/	Mo-Su 12:00-24:00	7	\N	t	node	11401774625	\N
2407	Сыто Пьяно	\N	\N	55.7708210	37.6319400	\N	https://sito-piano.ru/	\N	7	\N	t	node	12498004216	\N
2408	Пилзнер	\N	\N	55.7334920	37.6411400	+7 495 9518633	http://www.pilsner.ru	\N	7	\N	t	node	1376660352	\N
2409	Correa's	Садовническая улица, 82 с2	\N	55.7355600	37.6424280	+7 495 9692113	http://www.correas.ru	Mo-Fr 08:00-23:00; Sa,Su 09:00-23:00	7	\N	t	node	1568894170	\N
2410	Barmalini	\N	\N	55.7349910	37.6427920	+7 495 7213182	http://barmalini.ru/	Mo-Fr 12:00-24:00; Sa,Su 10:00-22:00	7	\N	t	node	2339679828	\N
2411	Кофемания	\N	\N	55.7348100	37.6427930	+7 495 7213182	http://coffeemania.ru/	Mo-Fr 07:45-24:00; Sa-Su 10:00-24:00	7	\N	t	node	2451930641	\N
2412	У Бурчо	\N	\N	55.7347630	37.6416370	+7 495 7394574	http://www.burcho.ru	Mo-Su 10:00-24:00	7	\N	t	node	2465638867	\N
2413	Acapella	\N	\N	55.7331050	37.6444380	+7 495 2215358	\N	Mo-Su 07:00-23:00	7	\N	t	node	2515602412	\N
2414	Кремлевский экспресс	\N	\N	55.7321340	37.6469340	\N	\N	\N	7	\N	t	node	3134924668	\N
2415	Pinzeria by Bontempi	Шлюзовая набережная, 4	\N	55.7318470	37.6443800	+7 495 2017550	https://pinzeria.ru/ru/	Su-Th 12:00-23:00; Fr-Sa 12:00-24:00	7	\N	t	node	5466776800	\N
2416	Le carré	\N	\N	55.7371320	37.6423100	+7 495 3749744	https://lecarre.rest/	Mo-Su 12:00-23:00	7	\N	t	node	7299186137	\N
2417	Babo’s	\N	\N	55.7373460	37.6490250	\N	\N	\N	7	\N	t	node	12264053361	\N
2418	Шеф Kebab	\N	\N	55.7373210	37.6492280	\N	\N	\N	7	\N	t	node	13186194352	\N
2419	Пуримания	\N	\N	55.7372900	37.6498100	\N	\N	24/7	7	\N	t	node	13186194356	\N
2420	Аруба	\N	\N	55.7396120	37.6518740	\N	\N	12:00-24:00	7	\N	t	node	1707897400	\N
2421	Жан-Жак	\N	\N	55.7432700	37.6524850	+7 495 9151078	http://jan-jak.com	Mo-Su 00:00-06:00,08:00-24:00	7	\N	t	node	2451673876	\N
2422	Travel Cafe	\N	\N	55.7444560	37.6495500	+7 495 9157376	http://cafe-travel.ru	\N	7	\N	t	node	3326157027	\N
2423	Зарубежье	\N	\N	55.7429820	37.6517860	+7 495 9153416	http://www.zarub-rest.ru	Mo-Su 12:00-24:00	7	\N	t	node	3326157031	\N
2424	Рыба Мечты	\N	\N	55.7402920	37.6409510	+7 495 1270888	http://dreamfish.moscow/	Mo-Su 12:00-24:00	7	\N	t	node	5403382418	\N
2425	Клуб Высоцкий	улица Высоцкого, 3	\N	55.7446090	37.6515690	+7 495 9150434;+7 499 7649030	http://www.club-vysotsky.ru	Su-We 11:30-24:00; Th-Fr 11:30-05:00; Sa 14:00-05:00	7	\N	t	node	5485828821	\N
2426	Brasserie Lambic	\N	\N	55.7433830	37.6521860	+7 495 9151056	https://lambic.ru	Mo-Fr 12:00-24:00; Sa,Su 00:00-03:00,12:00-24:00	7	\N	t	node	7806292241	\N
2427	Babacha	\N	\N	55.7424250	37.6518200	\N	\N	\N	7	\N	t	node	7900100686	\N
2428	Harvey & Monica	\N	\N	55.7416200	37.6461630	+7 495 7788099	http://harveyandmonica.ru/	Mo-Fr 10:00-24:00; Sa,Su 00:00-01:00,10:00-24:00	7	\N	t	node	8507909770	\N
2429	Будвар	\N	\N	55.7410780	37.6477570	\N	http://www.budwar.ru/	Mo-Su 12:00-23:00	7	\N	t	node	8629519099	\N
2430	Экспедиция	\N	\N	55.7517470	37.6417510	\N	\N	\N	7	\N	t	node	795880842	\N
2431	Дарбази	\N	\N	55.7471960	37.6510350	+7 495 9153632	http://darbazirest.ru/	Mo-Su 12:00-24:00	7	\N	t	node	2504832583	\N
2432	Латук	Яузская улица	\N	55.7503410	37.6435110	+7 495 698-56-65	\N	12:00-22:00	7	\N	t	node	3218033067	\N
2433	Цин Дао	\N	\N	55.7495640	37.6448790	+7 964 5328865	\N	Mo-Su 11:00-23:00	7	\N	t	node	4988054437	\N
2434	Signature art	\N	\N	55.7481550	37.6445510	\N	https://signature-art.clients.site/	Mo-Th 08:00-23:00; Fr 08:00-24:00; Sa 09:00-24:00; Su 09:00-23:00	7	\N	t	node	5514300387	\N
2435	Restaurant by Deep Fried Friends	\N	\N	55.7463390	37.6468860	+7 495 9661881	\N	Mo-Su 00:00-03:00,18:00-24:00	7	\N	t	node	9272767955	\N
2436	Хитровка	\N	\N	55.7519830	37.6418580	+7 925 0004434	https://restaurant.hitrovkahotel.com/	Mo-Su 00:00-05:00,07:00-11:00,13:00-24:00	7	\N	t	node	9858758469	\N
2437	Yauza	\N	\N	55.7515200	37.6447650	+7 (999) 348-50-66	\N	Su-Th 12:00-00:00; Fr-Sa 12:00-02:00	7	\N	t	node	12260925301	\N
2438	Лолита	\N	\N	55.7475650	37.6462550	\N	https://loleetarest.com/	Mo-Su 12:00-23:00; Fr,Sa 12:00-24:00	7	\N	t	node	12905290710	\N
2439	Пилзнер	\N	\N	55.7593350	37.6448730	+7 495 6247003	http://www.pilsner.ru	Mo-Su 12:00-24:00	7	\N	t	node	677322340	\N
2440	Ткемали	\N	\N	55.7540940	37.6411610	+7 985 7707777	http://tkemalirest.ru	\N	7	\N	t	node	795880515	\N
2441	Кофемания	\N	\N	55.7592090	37.6461340	+7 495 6239793	http://coffeemania.ru/	24/7	7	\N	t	node	1685948322	\N
2442	Forbest	\N	\N	55.7530070	37.6451870	+7 495 5142001	\N	Mo-Su 12:00-24:00	7	\N	t	node	1705988222	\N
2443	Белорусская хата	\N	\N	55.7591200	37.6430130	+7 495 6247444	http://bel-hata.ru	Mo-Su 12:00-24:00	7	\N	t	node	2186929460	\N
2444	Saperavi	\N	\N	55.7587950	37.6409450	+7 495 7901155	http://www.saperavicafe.com	Mo-Su 11:00-24:00; Th-Sa 11:00-01:00	7	\N	t	node	2408969174	\N
2445	De Laura	\N	\N	55.7587710	37.6421990	\N	https://delaura.ru	\N	7	\N	t	node	2873680704	\N
2446	Freya	\N	\N	55.7588970	37.6504600	+7 903 7744442	\N	Mo-Su 12:00-23:00	7	\N	t	node	2984349075	\N
2447	Булошная	\N	\N	55.7596110	37.6520350	+7 495 9173295	http://www.buloshnaya.ru	Mo-Su 10:00-23:00	7	\N	t	node	2984349076	\N
2448	ExtraVirgin	\N	\N	55.7594250	37.6455320	+7 495 9163608	https://www.evgrill.ru/	Mo-Su 12:00-24:00	7	\N	t	node	3127690258	\N
2449	Svet	\N	\N	55.7545130	37.6422930	\N	https://svetshow.ru	\N	7	\N	t	node	5148595033	\N
2450	Dizengof99	Покровский бульвар, 8 с1	\N	55.7572550	37.6467410	+7 499 3911417	https://www.dizengof99.com/	Mo-Th,Su 10:00-23:00; Fr-Sa 10:00-24:00	7	\N	t	node	5448078612	\N
2451	Ketch Up	\N	\N	55.7590520	37.6443070	\N	http://ketchupburgers.ru	Su-Th 11:00-23:00; Fr,Sa 11:00-24:00	7	\N	t	node	5721223060	\N
2452	Хачапури и вино	\N	\N	55.7596930	37.6473990	\N	http://hachapuriivino.ru/	Mo-Fr 00:00-02:00,08:00-24:00; Sa,Su 00:00-02:00,10:00-24:00	7	\N	t	node	6297927353	\N
2453	Эрмитаж	\N	\N	55.7545170	37.6500810	\N	\N	11:00-23:00	7	\N	t	node	6326667421	\N
2454	Blanc	\N	\N	55.7559550	37.6431580	+7 977 8293200	\N	Mo-Su 11:00-23:00	7	\N	t	node	6533864857	\N
2455	Coperto	\N	\N	55.7560900	37.6489350	+7 916 6993144	http://www.coperto.ru/	Mo-Sa 08:00-23:00; Su 10:00-23:00	7	\N	t	node	7682711585	\N
2456	Caffé Mandy’s	\N	\N	55.7599110	37.6466520	+7 495 5325171	https://caffemandys.ru/	Mo-Su 12:00-24:00	7	\N	t	node	8766165072	\N
2457	Hedonist	\N	\N	55.7574440	37.6465400	+7 495 2357030	\N	Mo-Su 12:00-23:00	7	\N	t	node	8874733201	\N
2458	Mesto 20/1	улица Покровка, 20/1	\N	55.7583290	37.6472710	+7 991 3119384	\N	Mo-Su 11:00-24:00	7	\N	t	node	9198111276	\N
2459	Fish Культура	\N	\N	55.7596550	37.6471470	\N	\N	Mo-Fr 12:00-24:00; Sa,Su 00:00-02:00,12:00-24:00	7	\N	t	node	9991531576	\N
2460	Дом 16	\N	\N	55.7532000	37.6463360	+7 495 0857716	\N	Mo-Su 11:00-24:00	7	\N	t	node	10922175028	\N
2461	Вах вах!	улица Покровка, 20/1	\N	55.7581870	37.6473290	+7 495 2054488	https://friendsmsk.ru/	09:00-24:00	7	\N	t	node	11276045391	\N
2462	Mates	\N	\N	55.7587770	37.6433050	+7 980 0750924	https://bistro-pokrovka.mates-group.ru/	Mo-Su 09:00-22:00	7	\N	t	node	12039490176	\N
2463	Tre Santi	\N	\N	55.7550790	37.6454650	+7 985 3469954	https://tresanti.moscow	Su-Th 12:00-23:00; Fr-Sa 12:00-00:00	7	\N	t	node	12277383020	\N
2464	Shulman Kitchen	\N	\N	55.7550730	37.6448260	\N	\N	\N	7	\N	t	node	12537227890	\N
2465	Траттория Semplice	\N	\N	55.7639260	37.6460190	+7 495 6231510	http://semplice.su	\N	7	\N	t	node	1001464570	\N
2466	Andy's Friends	\N	\N	55.7636030	37.6424210	+7 926 3407557	http://andyscafe.ru	Mo-Su 12:00-24:00	7	\N	t	node	2196651544	\N
2467	Ю-Мэ	\N	\N	55.7616510	37.6516860	+7 495 6217840	http://www.u-me.ru	Su-Th 11:30-23:30, PH,Fr,Sa 11:30-00:30	7	\N	t	node	2196651560	\N
2468	Светлый	\N	\N	55.7661860	37.6507400	+7 495 7414508	http://svetliy-moscow.ru	Mo-Su 12:00-06:00	7	\N	t	node	2453046110	\N
2469	Старик и море	\N	\N	55.7606810	37.6439180	\N	https://simo.rest/	Mo-Su 08:00-23:00	7	\N	t	node	2537213194	\N
2470	Авокадо	\N	\N	55.7610470	37.6434980	+7 495 6217719	http://www.avocadocafe.ru	Mo-Sa 10:00-23:00; Su 12:00-23:00	7	\N	t	node	2542238884	\N
2471	Flør	\N	\N	55.7605400	37.6468250	+7 915 2775344	http://www.florgroup.ru/flor	Mo 12:00-23:00; Tu-Su 11:00-23:00; Th-Sa 11:00-24:00	7	\N	t	node	3293297152	\N
2472	Хаос	\N	\N	55.7602040	37.6494810	\N	\N	\N	7	\N	t	node	7061533903	\N
2473	Munterra	\N	\N	55.7665950	37.6514510	+7 495 9337766	https://munterra.ru/	Fr-Sa 12:00-06:00;Mo-Th,Su 12:00-03:00	7	\N	t	node	8752581963	\N
2474	Études	\N	\N	55.7614980	37.6514770	+7 910 4574465	https://etudes-cafe.ru	Mo-Fr 12:00-24:00; Sa,Su 00:00-02:00,12:00-24:00	7	\N	t	node	9315524908	\N
2475	Osteria by Mandy's	\N	\N	55.7615960	37.6422420	\N	\N	Mo-Su 12:00-23:00	7	\N	t	node	11090076739	\N
2476	Шатёр	Чистопрудный бульвар, 12А	\N	55.7607410	37.6446590	+7 915 4004141;+7 495 7907898	http://cafeshater.ru	\N	7	\N	t	relation	9051985	\N
2477	Metekhi	\N	\N	55.7727130	37.6498120	+7 495 2592463;+7 925 6539927	https://metekhi.rest	Mo-Su 11:30-24:00	7	\N	t	node	1209017720	\N
2478	Капри	\N	\N	55.7693720	37.6415640	+7 495 6075253	\N	\N	7	\N	t	node	1452434586	\N
2479	Якитория	\N	\N	55.7692920	37.6498860	+7 495 7829650	https://yakitoriya.ru/	Mo-Su 10:00-24:00	7	\N	t	node	1527894517	\N
2480	Киноплов	\N	\N	55.7707280	37.6470920	\N	\N	\N	7	\N	t	node	1535403661	\N
2481	Мтеби	\N	\N	55.7709750	37.6519950	\N	https://mtebi-rest.ru/	Mo-Su 11:00-23:00; Fr,Sa 11:00-24:00	7	\N	t	node	1573000624	\N
2482	ПивТрест	\N	\N	55.7682190	37.6444900	+7 495 9212222	http://pivtrest.com/	Mo-Fr 10:00+; Sa-Su 11:00+	7	\N	t	node	1839127546	\N
2483	Brasserie Belge 0.33	Садовая-Спасская улица, 17/2	\N	55.7700050	37.6468470	+7 495 6077553	https://brasserie033.ru/	Mo-Su 12:00-23:00	7	\N	t	node	3213965861	\N
2484	Moni	\N	\N	55.7707350	37.6464600	+7 963 6700604	http://www.monicafe.ru	Mo-Th 11:00-24:00; Fr,Sa 00:00-06:00,11:00-24:00; Su 00:00-06:00	7	\N	t	node	3528128353	\N
2485	Урюк	Мясницкая улица, 47	\N	55.7689700	37.6451710	+7 499 9518220	https://uryuk.me/msk	Mo-We 08:00-24:00; Th-Fr 08:00-05:00; Sa-Su 12:00-24:00	7	\N	t	node	4386309404	\N
2486	Бакинский дворик 2	\N	\N	55.7681720	37.6420190	+7 495 6212612	http://bakinskiydvorik2.ru/	Mo-Th 00:00-01:00,09:00-24:00; Fr-Su 00:00-03:00,09:00-24:00	7	\N	t	node	5408431378	\N
2487	Орда	\N	\N	55.7684260	37.6430960	+7-925-1490177	https://orda-moscow.ru/	Mo-Fr 08:00-24:00; Sa,Su 12:00-24:00	7	\N	t	node	6312240734	\N
2488	Midsummer	\N	\N	55.7683720	37.6455210	+7 977 1880474	\N	\N	7	\N	t	node	6898004642	\N
2489	La veranda	\N	\N	55.7680650	37.6452600	\N	\N	\N	7	\N	t	node	7080708915	\N
2490	Тбилисимо	\N	\N	55.7706240	37.6490130	+7 999 5750300	\N	Mo-Su 11:00-23:00	7	\N	t	node	10261265917	\N
2491	Настойкин	\N	\N	55.7705170	37.6420220	\N	\N	\N	7	\N	t	node	10844712678	\N
2492	Кофемания	\N	\N	55.7708930	37.6434930	+7 499 9401984	http://coffeemania.ru/	Mo-Su 08:00-00:00	7	\N	t	node	13016208869	\N
2493	Пражка	\N	\N	55.7340210	37.6630430	+7 495 781-26-99	https://prazkarest.ru/	Mo-Su 12:00-24:00	7	\N	t	node	1778780475	\N
2494	Сесто Сенсо	\N	\N	55.7342310	37.6569220	\N	\N	10:00-23:00	7	\N	t	node	3481829142	\N
2495	Му-Му	\N	Раздача на третьем этаже	55.7317270	37.6637870	\N	https://www.cafemumu.ru	Mo-Fr 09:00-22:00; Sa-Su 10:00-22:00	7	\N	t	node	4235874146	\N
2496	Старина Мюллер	\N	\N	55.7343220	37.6626140	+7 495 7972092	https://www.muller.ru/	Mo-Sa 11:00-24:00; Su 12:00-23:00	7	\N	t	node	4322910589	\N
2497	Гамбринус	Марксистская улица, 20 с1	\N	55.7385130	37.6596900	+7 499 3808777	https://gambrinus.ru/	Mo-Fr 11:00-24:00; Sa,Su 12:00-24:00	7	\N	t	node	6042611288	\N
2498	Труффальдино	Марксистская улица, 20 с1	\N	55.7384280	37.6598290	+7 495 6705202	http://truffaldino.ru/	Mo-Fr 11:00-24:00; Sa,Su 12:00-24:00	7	\N	t	node	6042611289	\N
2499	Скандинавия	\N	\N	55.7369060	37.6592460	\N	\N	\N	7	\N	t	node	7963608192	\N
2500	Хинкали хачапури	\N	\N	55.7370230	37.6591040	\N	https://хинкалихачапури.рф/	12:00-24:00	7	\N	t	node	12576850852	\N
2501	Ла Лара	\N	\N	55.7371140	37.6583600	\N	\N	\N	7	\N	t	node	13084893970	\N
2502	Колбасофф	Таганская улица, 21	\N	55.7399860	37.6638750	+7 495 210-32-10	https://kolbasoff.ru/	Su-Th 12:00-24:00; Fr 12:00-02:00	7	\N	t	node	595517187	\N
2503	IL Патио	\N	\N	55.7416740	37.6558650	+7 906 0293513	http://ilpatio.ru	Mo-Th 08:00-24:00; Fr 08:00-02:00; Sa 10:00-02:00; Su 10:00-24:00	7	\N	t	node	1376665385	\N
2504	Гусятникоff	\N	\N	55.7419940	37.6565240	+7 495 6327558	http://gusyatnikoff.ru	\N	7	\N	t	node	1707897396	\N
2505	Планета	\N	\N	55.7416270	37.6560950	+7 945 7354076	http://www.planetacafe.ru	Mo-Su 12:00-24:00	7	\N	t	node	1707897399	\N
2506	Пронто	\N	\N	55.7412370	37.6584350	\N	\N	Mo-Su 10:00-02:00	7	\N	t	node	1707899369	\N
2507	Чайхана Халва	\N	\N	55.7403590	37.6547390	\N	\N	\N	7	\N	t	node	3509117851	\N
2508	Нияма	\N	\N	55.7408460	37.6546610	+7 495 9614507	http://www.niyama.ru	Mo-Su 10:00-23:00	7	\N	t	node	4311488220	\N
2509	Пицца-Пи	\N	\N	55.7408330	37.6544970	+7 495 9614507	http://pizzapi.ru	Mo-Su 00:00-06:00,11:00-24:00	7	\N	t	node	4311488221	\N
2510	Brooms	\N	\N	55.7421960	37.6556140	+7 495 7405647	http://broomsbar.ru/	Mo-Fr 08:00-24:00; Sa,Su 00:00-02:00,10:00-24:00	7	\N	t	node	5613517127	\N
2511	Вареничная №1	\N	\N	55.7430370	37.6531250	\N	http://www.varenichnaya.ru	Th-Sa 10:00-24:00; Su-We 10:00-23:00	7	\N	t	node	6399556221	\N
2512	Карло	\N	\N	55.7431600	37.6530740	\N	\N	Mo-Su 11:00-24:00	7	\N	t	node	6399556222	\N
2513	Shagal	\N	\N	55.7445500	37.6546100	+7 495 7771353	https://shagal-restaurant.com/	Mo-Su 06:30-24:00	7	\N	t	node	8052435127	\N
2514	Раковарня	\N	\N	55.7414550	37.6569210	\N	\N	\N	7	\N	t	node	9469170718	\N
2515	Хинкали & Vino	\N	\N	55.7416670	37.6558920	\N	\N	Mo-Su 10:00-00:00	7	\N	t	node	9469194017	\N
2516	True cost	\N	\N	55.7402210	37.6539260	+7 495 4452999	https://true-cost.ru	Mo-Th,Su 12:00-00:00; Fr-Sa 12:00-05:00	7	\N	t	node	9833985456	\N
2517	Lauren Parker	\N	\N	55.7449290	37.6614440	\N	\N	Mo-Su 12:00-24:00	7	\N	t	node	10557552996	\N
2518	Спутник	\N	\N	55.7442530	37.6570790	\N	\N	\N	7	\N	t	node	13205089522	\N
2519	Pho City	\N	\N	55.7470080	37.6544750	\N	\N	\N	7	\N	t	node	2409793015	\N
2520	Дядя Геральт	\N	\N	55.7473710	37.6550450	\N	https://geralt-tavern.ru/	\N	7	\N	t	node	2575721890	\N
2521	Рукав	\N	\N	55.7488070	37.6570600	+7 499 2718874	http://caferukav.ru	Mo-Su 12:00-24:00	7	\N	t	node	3702089270	\N
2522	Югославия	\N	\N	55.7467560	37.6591370	\N	\N	12:00-23:00	7	\N	t	node	4243211003	\N
2523	Мзиани	Николоямская улица, 28/60	\N	55.7469090	37.6549740	\N	\N	\N	7	\N	t	node	4314160631	\N
2524	Нью-Йорк Пицца и Гриль	\N	\N	55.7506420	37.6543110	\N	\N	Mo-Th 09:00-22:00; Fr 09:00-23:00; Sa 11:00-23:00; Su 10:00-22:00	7	\N	t	node	4916473024	\N
2525	The Rooms	\N	\N	55.7470840	37.6582730	\N	\N	\N	7	\N	t	node	9786046621	\N
2526	Манки	\N	\N	55.7469950	37.6581930	+7 499 1103335;+7 499 1106463	https://mghotels.ru/hotel/theroomshotel	24/7	7	\N	t	node	11513742851	\N
2527	IL Патио	\N	\N	55.7567780	37.6587210	+7 495 970-11-90	https://ilpatio.ru/	Mo-We,Su 10:00-24:00	7	\N	t	node	524512018	\N
2528	TGI Fridays	\N	\N	55.7573340	37.6587520	+7 965 3192395	https://www.tgifridays.ru/	Mo-Su 11:00-24:00	7	\N	t	node	524512022	\N
2529	Цурцум	4-й Сыромятнический переулок	\N	55.7557400	37.6647310	+7 495 7838948	\N	Mo-Fr 10:00-23:00; Sa 10:00-24:00; Su 10:00-23:00	7	\N	t	node	1262584582	\N
2530	Этаж Прojект	\N	\N	55.7568650	37.6595710	\N	\N	24/7	7	\N	t	node	1890912015	\N
2531	Джаганнат	\N	\N	55.7586980	37.6572200	+7 495 9178662;+7 495 9171833;+7 495 9171262	http://jagannath.ru	Mo-Su 10:00-23:00	7	\N	t	node	2473478813	\N
2532	Brasserie Lambic	\N	\N	55.7545740	37.6540120	+7 495 2230155	https://lambic.ru	12:00-24:00	7	\N	t	node	2520788384	\N
2533	Luciano	\N	\N	55.7570970	37.6587570	+7 495 7909390	http://lucianomoscow.ru/ku/main	Mo-Su 09:00-24:00	7	\N	t	node	2541226793	\N
2534	Дикий	\N	\N	55.7575160	37.6590400	+7 985 2227545	http://wildbar.ru	Mo-Fr 12:00-24:00; Sa,Su 00:00-04:00,12:00-24:00	7	\N	t	node	3904532221	\N
2535	Вареничная №1	\N	\N	55.7567140	37.6588690	+7 906 0294223	http://www.varenichnaya.ru	Mo-Su 10:00-23:00	7	\N	t	node	6679499171	\N
2536	Vasilchuki Chaihona №1	\N	\N	55.7569740	37.6587590	+7 495 2340233	https://chaihona.ru/	Mo-Su 10:00-23:00	7	\N	t	node	8237711143	\N
2537	Тануки	\N	\N	55.7580570	37.6572460	+7 499 649-22-23	https://tanukifamily.ru/tanuki/	24/7	7	\N	t	node	9272767922	\N
2538	Tehnikum	\N	\N	55.7577900	37.6587910	+7 495 7909390	https://tehnikumbistro.ru/	Mo-Su 10:00-23:00	7	\N	t	node	10239784822	\N
2539	Edoko	\N	\N	55.7575730	37.6584400	+7 495 9265892	https://edoko.ru	Mo-Su 10:00-23:00	7	\N	t	node	11545796687	\N
2540	Zafferano	\N	\N	55.7567510	37.6597050	+7 495 9265892	https://zafferanorest.ru	Mo-Su 10:00-23:00	7	\N	t	node	11545796692	\N
2541	Торро Гриль	\N	\N	55.7578700	37.6585180	+7 495 6651407;+7 966 3043387	https://www.torrogrill.ru/	Mo-We 12:00-23:00; Th-Su 12:00-00:00	7	\N	t	node	12059265113	\N
2542	The Бык	\N	\N	55.7573920	37.6586270	+7 495 9881717	https://thebull.ru	Mo-Su 12:00-23:00	7	\N	t	node	12759233304	\N
2543	Florentini	Старая Басманная улица, 9 с1	\N	55.7648320	37.6577610	+7 495 6080350	http://www.florentinicafe.ru	\N	7	\N	t	node	2300564957	\N
2544	Хинкальная №1	\N	\N	55.7645530	37.6572830	\N	\N	\N	7	\N	t	node	2516300024	\N
2545	Аддис-Абеба	\N	\N	55.7623600	37.6567100	+7 495 9162432	\N	Mo-Su 11:00-24:00	7	\N	t	node	2774677693	\N
2546	Оджахури	\N	\N	55.7643300	37.6552040	+7 495 6216002	http://www.ojakhuri.ru	Su-Th 12:00-24:00, Fr,Sa 12:00-02:00	7	\N	t	node	3876413474	\N
2547	Хинкальная	\N	\N	55.7604680	37.6624110	\N	https://hinkaliarma.ru	Mo-Su 11:00-24:00	7	\N	t	node	4639966292	\N
2548	Бакинский бульвар	\N	\N	55.7602190	37.6567870	+7 499 3478272	http://bbulvar.ru	24/7	7	\N	t	node	4745818788	\N
2549	Osteria Mario	\N	\N	55.7613260	37.6581020	+7 495 7907090-208	http://osteriamario.ru	Mo-Fr 10:00-23:00; Sa,Su 12:00-23:00	7	\N	t	node	7851352391	\N
2550	Temple Bar	\N	\N	55.7601540	37.6640080	\N	https://www.templebar.ru/	Su-Th 12:00-24:00, Fr,Sa 12:00-02:00	7	\N	t	node	9013589049	\N
2551	Золотой дракон	\N	\N	55.7616640	37.6627570	\N	http://www.goldendragon.ru/	Mo-Su 11:00-23:00	7	\N	t	node	10086975829	\N
2552	Nomo	\N	\N	55.7618090	37.6594150	\N	\N	Su-Th 12:00-03:00; Fr-Sa 12:00-05:00	7	\N	t	node	12809930260	\N
2553	Japmen	\N	\N	55.7621560	37.6592730	\N	\N	\N	7	\N	t	node	12809930261	\N
2554	.оригинал	\N	\N	55.7627210	37.6590940	\N	\N	\N	7	\N	t	node	12809930262	\N
2555	Brunnen	\N	\N	55.7615870	37.6596430	\N	\N	\N	7	\N	t	node	12918082333	\N
2556	IL Патио	\N	\N	55.7734840	37.6551010	+7 499 7887484	https://ilpatio.ru/	\N	7	\N	t	node	3211452779	\N
2557	+39	\N	\N	55.7699400	37.6617520	\N	\N	\N	7	\N	t	node	9902442220	\N
2558	Meraki	\N	\N	55.7731720	37.6617310	+7 495 2211110	https://meraki.rest	Fr-Sa 10:00-24:00; Mo-Th,Su 10:00-23:00	7	\N	t	node	10782497921	\N
2559	Старый город	\N	\N	55.7722410	37.6600770	\N	https://www.oldcity.moscow/	Mo-Su 11:00-23:00	7	\N	t	node	10922438353	\N
2560	Сыроварня	\N	\N	55.7728780	37.6618900	+7 800 7075076	https://syrovarnya.com/depo	Su-Tu,Th,We 09:00-23:00; Fr-Sa 09:00-23:55	7	\N	t	node	11096375305	\N
2561	Chin-Chin	\N	\N	55.7732500	37.6625360	\N	\N	\N	7	\N	t	node	11362855388	\N
2562	Центр оперного пения Галины Вишневской	\N	\N	55.7402720	37.5975780	\N	http://opera-centre.ru/	\N	11	\N	t	node	3691407122	\N
2563	Театральный дом «Старый Арбат»	\N	\N	55.7494140	37.5982660	\N	https://www.old-arbat.narod.ru/	\N	11	\N	t	node	3691431210	\N
2564	Эрмитаж	\N	\N	55.7517220	37.5965950	+7 495 6506742	http://ermistage.ru/	Tu-Su 12:00-19:00	11	\N	t	node	4870484675	\N
2565	Театр-кафе	\N	\N	55.7472650	37.5936600	+7 902 9868888	http://www.teatr-cafe.ru	\N	11	\N	t	node	5332088826	\N
2566	Аркадия	Староконюшенный переулок, 37	\N	55.7489530	37.5945710	\N	http://puppetshow.ru/ru/	\N	11	\N	t	node	9017432033	\N
2567	Театр им. Вл. Маяковского	Большая Никитская улица, 19/13	\N	55.7568220	37.6018190	+7 495 6904232	http://www.mayakovsky.ru/	Mo-Su 11:00-21:00	11	\N	t	node	1684243150	\N
2568	У Никитских ворот	\N	\N	55.7569320	37.5993030	+7 495 6958219	http://teatrunikitskihvorot.ru/	Mo-Fr 16:00-20:00; Sa-Su 11:00-20:00	11	\N	t	node	2214781351	\N
2569	АпАРТе	\N	\N	55.7586970	37.6003020	+7 495 6974560	http://www.aparte.ru	\N	11	\N	t	node	2540997892	\N
2570	Центр драматургии и режиссуры на Поварской	\N	\N	55.7545010	37.5949940	+7 495 6901758	http://teatrcdr.ru/	\N	11	\N	t	node	3428608229	\N
2571	Концертный зал имени Н.Я. Мясковского	\N	\N	55.7565950	37.6039270	\N	http://www.mosconsv.ru/ru/venue.aspx?id=1726	\N	11	\N	t	node	3939325509	\N
2572	Музыкальный театр «Амадей»	\N	\N	55.7585630	37.5962910	+7 925 8463377	http://www.amadei.ru/	\N	11	\N	t	node	4692951475	\N
2573	Большой зал Консерватории	\N	\N	55.7561560	37.6039550	\N	https://www.mosconsv.ru/ru/venue.aspx?id=1710	\N	11	\N	t	node	5661645051	\N
2574	Около дома Станиславского	Вознесенский переулок, 9 с3	\N	55.7583110	37.6043890	+7 495 6902557	http://okolo.ru/	Mo 11:00-18:00; Tu-We 11:00-21:00; Th 11:00-22:00; Fr-Su 13:00-22:00	11	\N	t	way	32903277	\N
2575	Геликон-опера	Большая Никитская улица, 19/16	\N	55.7568410	37.6007960	+7 495 6918570	http://www.helikon.ru/	Mo-Su 12:00-22:00	11	\N	t	way	162058125	\N
2576	Театр на Бронной	Малая Бронная улица, 4 с2	\N	55.7595920	37.5980120	+7 495 6901948	http://mbronnaya.ru/	\N	11	\N	t	relation	9341259	\N
2577	Электротеатр Станиславский	Тверская улица, 23	\N	55.7667610	37.6010720	+7 495 6997224	https://electrotheatre.ru/	Mo-Su 11:00-22:00	11	\N	t	node	529550649	\N
2578	Московский драматический театр имени А. С. Пушкина	\N	\N	55.7622170	37.6018250	+7 495 6941289	https://teatrpushkin.ru/	\N	11	\N	t	node	1194227708	\N
2579	Киноспектакль	\N	\N	55.7639810	37.5944960	+7 903 6249242	http://vk.com/kinospektakl	\N	11	\N	t	node	3656613984	\N
2580	Театр имени М.А. Булгакова	\N	\N	55.7671760	37.5936600	+7 495 7759461	http://dombulgakova.ru	\N	11	\N	t	node	4976250668	\N
2581	Бэби театр	Большой Патриарший переулок, 10	\N	55.7630180	37.5929110	\N	https://u-skazki.com/	\N	11	\N	t	node	9017466834	\N
2582	Практика	\N	\N	55.7656550	37.5948000	+7 495 6090930	http://www.praktikatheatre.ru	\N	11	\N	t	node	11741643601	\N
2583	МХАТ им. Горького	Тверской бульвар, 22	\N	55.7614990	37.6037220	+7 495 6977399	http://www.mxat-teatr.ru/	Tu-Su 10:00-22:00	11	\N	t	way	47675276	\N
2584	Филиал Театра имени А. С. Пушкина	Сытинский переулок, 3 с5	\N	55.7638910	37.6015780	+7 495 6501896	http://teatrpushkin.ru/	\N	11	\N	t	way	47680392	\N
2585	Московский театр юного зрителя	Мамоновский переулок, 10	\N	55.7662610	37.5998250	+7 495 6999917;+7 495 6994995	http://www.moscowtyz.ru	\N	11	\N	t	way	52583222	\N
2586	КомедиантЪ	\N	\N	55.7672280	37.5936790	+7 495 6995366	http://teatr-komediant.ru	\N	11	\N	t	node	4976250666	\N
2587	307-я студия	Тверская улица, 28	\N	55.7695980	37.5988340	\N	\N	\N	11	\N	t	node	9020272637	\N
2588	Театр имени Моссовета	Большая Садовая улица, 16 с1	\N	55.7680620	37.5968010	\N	https://mossoveta.ru/	Mo-Fr 12:00-20:00; Sa-Su 12:00-19:00	11	\N	t	relation	16682982	\N
2589	Театр сатиры	Триумфальная площадь, 2 с1	\N	55.7683580	37.5953990	+7 495 6996305	http://satire.ru/	Mo-Su 10:00-22:00	11	\N	t	relation	16682983	\N
2590	Концертный зал им. П. И. Чайковского	Тверская улица, 31/4	\N	55.7689070	37.5963140	+7 495 2325353	http://meloman.ru/hall/koncertnyj-zal-chajkovskogo	\N	11	\N	t	relation	16682984	\N
2591	Театр Эстрады	\N	\N	55.7448360	37.6112980	+7 495 9590550	\N	\N	11	\N	t	node	619910548	\N
2592	Театр им. М. Н. Ермоловой	\N	\N	55.7578370	37.6125720	+7 495 6290594	https://www.ermolova.ru/	\N	11	\N	t	node	529550639	\N
2593	Концертный зал На Кисловке	\N	\N	55.7539810	37.6061650	\N	http://www.mosconsv.ru/ru/venue.aspx?id=1797	\N	11	\N	t	node	2575566194	\N
2594	Рахманиновский зал Консерватории	\N	\N	55.7563770	37.6055290	\N	https://www.mosconsv.ru/ru/venue.aspx?id=1724	\N	11	\N	t	node	5661645052	\N
2595	Малый зал Консерватории	\N	\N	55.7564640	37.6050740	\N	https://www.mosconsv.ru/ru/venue.aspx?id=1711	\N	11	\N	t	node	5661645053	\N
2596	Арт-платформа	\N	\N	55.7593310	37.6152940	+7 985 6008067	https://art-platforma.moscow/	\N	11	\N	t	node	12346246262	\N
2597	Московская оперетта	улица Большая Дмитровка, 6	\N	55.7602260	37.6162950	+7 495 6925982	http://mosoperetta.ru/	\N	11	\N	t	way	46513023	\N
2598	Российский государственный академический молодежный театр	Театральная площадь, 2	\N	55.7591790	37.6174670	+7 495 6920069	https://ramt.ru/	Mo-Su 11:00-20:00	11	\N	t	relation	365169	\N
2599	Московский художественный театр им. А. П. Чехова	Камергерский переулок, 3 с1	\N	55.7605250	37.6130000	+7 495 6926748	http://www.mxat.ru/	\N	11	\N	t	relation	2669481	\N
2600	Большой театр (Новая сцена)	\N	\N	55.7598040	37.6169630	+7 495 4555555	https://www.bolshoi.ru/	\N	11	\N	t	relation	6204093	\N
2601	Учебный театр Школы-студии МХАТ	\N	\N	55.7602170	37.6137060	\N	\N	\N	11	\N	t	node	1161887164	\N
2602	ГИТИС-Театр	\N	\N	55.7633900	37.6054900	+7 495 6298661	http://www.gitis-teatr.ru/	Mo-Sa 18:00-21:00	11	\N	t	node	1624799589	\N
2603	Театральный центр «На Страстном»	\N	\N	55.7663240	37.6107380	+7 495 6941346	https://nastrastnom.ru/	\N	11	\N	t	node	1967006318	\N
2604	Боярские палаты СТД РФ	\N	\N	55.7666330	37.6112010	+7 495 6504293	\N	\N	11	\N	t	node	4763136812	\N
2606	Московский театр мюзикла	Пушкинская площадь, 2	\N	55.7662470	37.6075360	\N	https://teamuz.ru/	\N	11	\N	t	way	46837169	\N
2607	Государственный театр наций	Петровский переулок, 3	\N	55.7659940	37.6127080	+7 495 6296033	http://theatreofnations.ru/	Mo-Fr 11:00-20:00; Sa-Su 12:00-19:00	11	\N	t	way	47138160	\N
2608	Музыкальный театр им. Станиславского и Немировича-Данченко	улица Большая Дмитровка, 17	\N	55.7645830	37.6105120	+7 495 6502393	https://stanmus.ru/	\N	11	\N	t	relation	456961	\N
2611	Театр кукол имени С. В. Образцова	\N	\N	55.7740100	37.6144650	+7 495 6995979	http://www.puppet.ru/	Mo-Su 10:00-18:00	11	\N	t	node	1196600438	\N
2612	Детский музыкальный театр юного актера	\N	\N	55.7681970	37.6067550	+7 495 6251959	https://dmtya.ru/	Tu-Su 11:00-19:00	11	\N	t	node	2506826092	\N
2613	Сфера	\N	\N	55.7702580	37.6086910	+7 495 6999645	http://www.spheratheatre.ru/	Tu-Fr 13:00-19:30; Sa-Su 12:00-18:30	11	\N	t	node	2568132718	\N
2614	Балет Москва	\N	\N	55.7716890	37.6089930	+7 495 1097050	https://baletmoskva.ru/	\N	11	\N	t	node	3691354726	\N
2615	Ленком	улица Малая Дмитровка, 6	\N	55.7677960	37.6071380	+7 495 6999668	https://www.lenkom.ru/	Mo-Su 11:30-19:30	11	\N	t	way	52597841	\N
2616	Новая Опера	улица Каретный Ряд, 3 с2	\N	55.7715950	37.6089490	+7 495 6940868	http://www.novayaopera.ru/	Tu-Su 11:00-20:00	11	\N	t	relation	6741553	\N
2617	Театр Луны	\N	\N	55.7336470	37.6258090	+7 495 9531317	http://www.lunatheatre.ru	\N	11	\N	t	node	2868787302	\N
2618	Дом Рахманинова	\N	\N	55.7442780	37.6240830	\N	\N	\N	11	\N	t	node	12803628466	\N
2619	Большой театр. Камерная сцена им. Б. А. Покровского	Никольская улица, 17	\N	55.7580470	37.6235010	+7 495 6067008	http://www.opera-pokrovsky.ru/	Tu-Fr 19:00-22:00; Sa-Su 18:00-22:00	11	\N	t	node	1123362163	\N
2620	Малый театр	Театральный проезд, 1	\N	55.7597750	37.6205710	+7 499 2375057	http://maly.ru/	Tu-Su 11:00-23:00	11	\N	t	relation	85762	\N
2623	Театр на Трубной	\N	\N	55.7669350	37.6210450	+7 495 111 2222	https://neglinka29.ru/	\N	11	\N	t	node	302501119	\N
2624	Москонцерт на Пушечной	\N	\N	55.7606490	37.6229330	+7 495 621-00-22	https://mosconcert.com/	\N	11	\N	t	node	5389347763	\N
2625	Большой театр	Театральная площадь, 1	\N	55.7601300	37.6186120	+7 495 4555555	https://www.bolshoi.ru/	\N	11	\N	t	node	6061084593	\N
2628	Московский цирк Никулина	Цветной бульвар, 13	\N	55.7704200	37.6199940	+7 495 6258970	https://www.circusnikulin.ru/	\N	11	\N	t	relation	86444	\N
2629	Театр на Цветном	Цветной бульвар, 11 с2	\N	55.7701170	37.6203950	\N	https://teatrnacvetnom.ru/	\N	11	\N	t	relation	17271861	\N
2630	Народный драматический театр	Вишняковский переулок, 12 с.1	\N	55.7360550	37.6298540	\N	https://www.teatr-mgdu.ru/contacts/	\N	11	\N	t	node	9019909925	\N
2631	TLF	\N	\N	55.7360310	37.6297510	\N	http://tlf.msk.ru/	\N	11	\N	t	node	9020139271	\N
2632	Глас	\N	\N	55.7388810	37.6341870	+7 495 9593893	http://www.theatreglas.ru/	Mo-Su 11:00-19:00	11	\N	t	node	2588781506	\N
2633	Концертный зал «Зарядье»	улица Варварка, вл6 с4	\N	55.7511270	37.6312490	+7 499 2220000	https://zaryadyehall.com/	Mo-Su 14:00-20:00	11	\N	t	relation	7555555	\N
2634	Crave	\N	\N	55.7564370	37.6335750	\N	https://crave.ru	\N	11	\N	t	node	11407268632	\N
2635	Московский театр русской драмы	\N	\N	55.7659890	37.6348060	\N	http://www.rus-drama.ru/	\N	11	\N	t	node	3428265295	\N
2636	Et Cetera	Фролов переулок, 2	\N	55.7650160	37.6358770	+7 495 7817811	http://et-cetera.ru/	Mo-Su 11:00-20:30	11	\N	t	relation	14732079	\N
2637	Школа драматического искусства	\N	\N	55.7700920	37.6319830	+7 495 6329344	http://sdart.ru/	Mo 10:00-18:00; Tu-Su 10:00-22:00	11	\N	t	node	2140395744	\N
2638	Театр Маяковского. Сцена на Сретенке	\N	\N	55.7690420	37.6304340	+7 499 6780304	http://www.mayakovsky.ru/	Tu-Fr 12:00-21:00; Sa-Su 12:00-20:00	11	\N	t	node	3118185244	\N
2639	Театральный центр Вишнёвый сад	\N	\N	55.7725930	37.6308800	+7 499 4869950	https://vishnevii-sad.ru/	\N	11	\N	t	node	4044815173	\N
2640	Московский театр Олега Табакова. Новая сцена «На Сухаревке»	\N	\N	55.7735870	37.6307410	+7 499 2080000	https://tabakov.ru/	Mo-Su 11:00-20:00	11	\N	t	node	4402445231	\N
2641	Компас центр	\N	\N	55.7678830	37.6301300	+7 499 3501022	http://teatrkompas.ru/	\N	11	\N	t	node	7137599501	\N
2642	Московский международный Дом музыки	Космодамианская набережная, 52 с8	\N	55.7331930	37.6466200	+7 495 7301011	http://www.mmdm.ru	\N	11	\N	t	way	35983847	\N
2643	Студия.project	\N	\N	55.7444990	37.6520620	\N	https://www.teatrstudija.ru/	\N	11	\N	t	node	9020112008	\N
2644	Smile :) Театр	\N	\N	55.7525270	37.6417920	+7 495 6496863	http://www.smile-theater.ru/	Mo-Su 10:00-22:00	11	\N	t	node	3755165655	\N
2645	Театр им. Алехандро Валенсио	Подколокольный переулок, 8 с1	\N	55.7527500	37.6418610	\N	https://www.valensio.com/	\N	11	\N	t	node	9020227903	\N
2646	Экспромт	\N	\N	55.7612110	37.6471770	+7 495 6210116	https://teatr-expromt.ru/	Fr,Su 11:00-21:00; Sa 11:00-18:00	11	\N	t	node	2479463230	\N
2647	Московский театр Олега Табакова	\N	\N	55.7643200	37.6458780	+7 495 6244647	http://www.tabakov.ru/	Mo-Su 12:00-22:00	11	\N	t	node	3541533018	\N
2648	Детский музыкальный театр юного актера	\N	\N	55.7613920	37.6474530	+7 495 6253237	https://dmtya.ru/	\N	11	\N	t	node	8644649086	\N
2649	Mosspectacle	\N	\N	55.7610330	37.6526430	+7 925 0639949	https://mosspectacle.ru	\N	11	\N	t	node	9989248251	\N
2650	Современник	Чистопрудный бульвар, 19 с1	\N	55.7617830	37.6458640	+7 495 6216473	http://www.sovremennik.ru/	Mo-Su 12:00-19:30	11	\N	t	way	42503311	\N
2651	Студия театрального искусства	\N	\N	55.7454240	37.6612510	+7 495 6467455	http://sti.ru/	Mo-Su 11:00-22:30	11	\N	t	node	1369881406	\N
2652	Московский детский Сказочный театр	\N	\N	55.7411130	37.6644560	+7 495 9127554	http://skazkateatr.ru/	\N	11	\N	t	node	3006979104	\N
2653	Содружество актёров Таганки	\N	\N	55.7431760	37.6536010	+7 495 9151024	http://www.taganka-sat.ru/	Mo-Su 12:00-19:00	11	\N	t	node	3325926893	\N
2654	Театр на Таганке	\N	\N	55.7427960	37.6539420	+7 495 915-10-07	http://tagankateatr.ru/	Tu-Su 10:00-23:00	11	\N	t	node	3325926895	\N
2655	АпАРТе	\N	\N	55.7441720	37.6615860	+7 495 6974560	https://www.aparte.ru/	Tu-Su 12:00-23:00	11	\N	t	node	4546616714	\N
2656	Московский театр русской драмы под руководством Михаила Щепенко	улица Земляной Вал, 64/17	Камерная сцена	55.7457080	37.6546570	+7 495 9157521	http://www.rus-drama.ru/	Mo-Su 11:00-23:00	11	\N	t	way	232638592	\N
2657	Московский открытый театр кукол	Пестовский переулок, 2	\N	55.7452870	37.6597240	+7 495 9155432	https://puppetmo.ru/	Tu-Su 10:00-18:00	11	\N	t	way	296889188	\N
2659	Циники	\N	\N	55.7529570	37.6643110	\N	\N	\N	11	\N	t	node	13227852861	\N
2660	Театр на Покровке	\N	\N	55.7634720	37.6551460	+7 495 9170263	http://www.napokrovke.ru/	Mo 10:00-18:00; Tu-Su 10:00-21:00	11	\N	t	node	2196651653	\N
2661	Внутри	\N	\N	55.7623270	37.6609370	+7 495 111 78 78	https://vnutri.space/	\N	11	\N	t	node	12449610493	\N
2662	Русская песня (Малая сцена)	Садовая-Черногрязская улица, 5/9 с2	\N	55.7668240	37.6538970	+7 499 9755409	http://folkteatr.ru/	Mo-Su 12:00-20:00	11	\N	t	way	56449083	\N
2663	Театр имени Гоголя	улица Казакова, 8	\N	55.7620680	37.6619600	\N	https://teatrgogolya.ru/	\N	11	\N	t	relation	19084051	\N
2664	Домик Фанни Белл	\N	\N	55.7690750	37.6594930	\N	https://funnybell.ru/whoisfunnybell/kontakti/domik_fanni_bell-_v_sadu_im_baumana/	\N	11	\N	t	node	9773243426	\N
2665	Среда 21	\N	\N	55.7690700	37.6592700	+7-499-4500151	https://sreda21.ru/	\N	11	\N	t	node	9773243427	\N
2666	Театр на Новой Басманной	\N	\N	55.7700180	37.6636900	\N	\N	\N	11	\N	t	node	11850237503	\N
\.


--
-- Data for Name: price_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_categories (price_category_id, price_category_name) FROM stdin;
1	budget
2	medium
3	premium
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (id, token_hash, user_id, expires_at, created_at) FROM stdin;
1	49edd27fe8abc4b98fe662dc2330612dfeaf422f5ec06d2f037ac8b7a4e85bb8	2	2025-11-25 09:28:12.187541	2025-11-11 09:28:12.190543
2	aeb55ac4c36f4d7b054afa92ecc2dae59132fb49a3b0eeca59e6ae1895be28ab	2	2025-11-25 09:28:12.22851	2025-11-11 09:28:12.229471
3	885d12d1f581b85078de2e1002d7c50e73430daacad8a9990526d37c417b1012	2	2025-11-25 10:15:50.070118	2025-11-11 10:15:50.083867
4	358f86223b8034c602a1b5ff59b99e099ac8809c4d1d49f9046859a984956e04	2	2025-11-28 02:31:42.367945	2025-11-14 02:31:42.373759
5	91a3c4ff998d18dc477aa69b5f80aba2aeae7c9ed111cfb1ebed6c117982a9ec	3	2025-11-28 03:22:12.704165	2025-11-14 03:22:12.707807
\.


--
-- Data for Name: routes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.routes (id, user_id, title, summary, steps_json, deepseek_response, yandex_url, created_at) FROM stdin;
\.


--
-- Data for Name: sports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sports (sport_id, sport_name, sport_code) FROM stdin;
1	Фитнес	fitness
2	Тренажерный зал	gym
3	Йога	yoga
4	Пилатес	pilates
5	Бокс	boxing
6	Единоборства	martial_arts
7	Плавание	swimming
8	Баскетбол	basketball
9	Футбол	football
10	Теннис	tennis
11	Кроссфит	crossfit
12	Хоккей	ice_hockey
13	Скейтбординг	skateboard
14	Роликовые коньки	roller_skating
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tags (tag_id, tag_name, description) FROM stdin;
1	романтика	Подходит для романтических свиданий и создания особой атмосферы
2	атмосферное	Уютная и приятная обстановка, располагающая к отдыху
3	тихое место	Спокойная локация вдали от шума и суеты
4	скрытое место	Малоизвестная локация, известная узкому кругу
5	для пары	Идеальное место для времяпрепровождения вдвоем
6	семейное	Подходит для посещения всей семьей с детьми
7	для друзей	Отличное место для встречи компанией
8	деловой	Подходит для деловых встреч и переговоров
9	для детей	Специально оборудовано для детского досуга
10	детские развлечения	Развлекательная программа и активности для детей
11	для прогулки	Благоустроенная территория для пеших прогулок
12	для фото	Живописное место с отличными возможностями для фотосессий
13	активный отдых	Возможность заняться спортом и активными видами досуга
14	необычное	Уникальное место с нестандартной концепцией или дизайном
15	культурное	Объект культурного наследия или место культурных событий
16	исторический	Место с богатой историей и исторической ценностью
17	панорама	Открывается панорамный вид на город или природу
18	место для учёбы	Тихая обстановка для работы, учебы и концентрации
19	гастрономический	Особое внимание к качеству кухни и кулинарному опыту
20	завтраки	Предлагаются завтраки или ранее открытие
21	бизнес-ланч	Доступно специальное предложение бизнес-ланча
22	навынос	Возможность заказать еду с собой
23	ночная жизнь	Работает в вечернее и ночное время с развлекательной программой
24	живая музыка	Регулярные выступления музыкантов и живая музыка
25	терраса	Наличие открытой террасы или летней площадки
\.


--
-- Data for Name: user_favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_favorites (user_id, place_id, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, full_name, hashed_password, created_at, phone, avatar_url, date_of_birth, about_me) FROM stdin;
1	test@test.com	\N	$2b$12$/LktGF7r.Zow2LKdVD0F7.ouFOY5PBgk3Nfg7e.cY2c2OH0QCqOwS	2025-11-09 20:38:59.533042	\N	\N	\N	\N
2	damirxxl_XXl@mail.ru	damir	0b282797abc423b786547bca1f88802c7824e082c2ba9377e6d67649d1230307	2025-11-11 09:28:12.128529	\N	\N	\N	\N
3	test_db_check@example.com	Test User	85777f270ad7cf2a790981bbae3c4e484a1dc55e24a77390d692fbf1cffa12fa	2025-11-14 03:22:12.676488	\N	\N	\N	\N
\.


--
-- Name: agent_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.agent_messages_id_seq', 6, true);


--
-- Name: amenities_amenity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.amenities_amenity_id_seq', 13, true);


--
-- Name: cuisines_cuisine_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cuisines_cuisine_id_seq', 15, true);


--
-- Name: natural_features_feature_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.natural_features_feature_id_seq', 5, true);


--
-- Name: place_amenities_place_amenity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.place_amenities_place_amenity_id_seq', 1, false);


--
-- Name: place_cuisines_place_cuisine_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.place_cuisines_place_cuisine_id_seq', 1021, true);


--
-- Name: place_natural_features_place_feature_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.place_natural_features_place_feature_id_seq', 3, true);


--
-- Name: place_photos_photo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.place_photos_photo_id_seq', 1, false);


--
-- Name: place_reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.place_reviews_review_id_seq', 1, false);


--
-- Name: place_sports_place_sport_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.place_sports_place_sport_id_seq', 55, true);


--
-- Name: place_tags_place_tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.place_tags_place_tag_id_seq', 2, true);


--
-- Name: place_types_place_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.place_types_place_type_id_seq', 29, true);


--
-- Name: places_place_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.places_place_id_seq', 2666, true);


--
-- Name: price_categories_price_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.price_categories_price_category_id_seq', 3, true);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.refresh_tokens_id_seq', 5, true);


--
-- Name: routes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.routes_id_seq', 1, false);


--
-- Name: sports_sport_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sports_sport_id_seq', 14, true);


--
-- Name: tags_tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tags_tag_id_seq', 25, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: agent_messages agent_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_messages
    ADD CONSTRAINT agent_messages_pkey PRIMARY KEY (id);


--
-- Name: amenities amenities_amenity_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.amenities
    ADD CONSTRAINT amenities_amenity_name_key UNIQUE (amenity_name);


--
-- Name: amenities amenities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.amenities
    ADD CONSTRAINT amenities_pkey PRIMARY KEY (amenity_id);


--
-- Name: cuisines cuisines_cuisine_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuisines
    ADD CONSTRAINT cuisines_cuisine_name_key UNIQUE (cuisine_name);


--
-- Name: cuisines cuisines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuisines
    ADD CONSTRAINT cuisines_pkey PRIMARY KEY (cuisine_id);


--
-- Name: generation_jobs generation_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.generation_jobs
    ADD CONSTRAINT generation_jobs_pkey PRIMARY KEY (id);


--
-- Name: natural_features natural_features_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.natural_features
    ADD CONSTRAINT natural_features_pkey PRIMARY KEY (feature_id);


--
-- Name: place_amenities place_amenities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_amenities
    ADD CONSTRAINT place_amenities_pkey PRIMARY KEY (place_amenity_id);


--
-- Name: place_cuisines place_cuisines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_cuisines
    ADD CONSTRAINT place_cuisines_pkey PRIMARY KEY (place_cuisine_id);


--
-- Name: place_natural_features place_natural_features_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_natural_features
    ADD CONSTRAINT place_natural_features_pkey PRIMARY KEY (place_feature_id);


--
-- Name: place_photos place_photos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_photos
    ADD CONSTRAINT place_photos_pkey PRIMARY KEY (photo_id);


--
-- Name: place_reviews place_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_reviews
    ADD CONSTRAINT place_reviews_pkey PRIMARY KEY (review_id);


--
-- Name: place_sports place_sports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_sports
    ADD CONSTRAINT place_sports_pkey PRIMARY KEY (place_sport_id);


--
-- Name: place_tags place_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_tags
    ADD CONSTRAINT place_tags_pkey PRIMARY KEY (place_tag_id);


--
-- Name: place_types place_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_types
    ADD CONSTRAINT place_types_pkey PRIMARY KEY (place_type_id);


--
-- Name: place_types place_types_type_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_types
    ADD CONSTRAINT place_types_type_code_key UNIQUE (type_code);


--
-- Name: place_types place_types_type_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_types
    ADD CONSTRAINT place_types_type_name_key UNIQUE (type_name);


--
-- Name: places places_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.places
    ADD CONSTRAINT places_pkey PRIMARY KEY (place_id);


--
-- Name: price_categories price_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_categories
    ADD CONSTRAINT price_categories_pkey PRIMARY KEY (price_category_id);


--
-- Name: price_categories price_categories_price_category_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_categories
    ADD CONSTRAINT price_categories_price_category_name_key UNIQUE (price_category_name);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: routes routes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.routes
    ADD CONSTRAINT routes_pkey PRIMARY KEY (id);


--
-- Name: sports sports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sports
    ADD CONSTRAINT sports_pkey PRIMARY KEY (sport_id);


--
-- Name: sports sports_sport_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sports
    ADD CONSTRAINT sports_sport_name_key UNIQUE (sport_name);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (tag_id);


--
-- Name: tags tags_tag_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_tag_name_key UNIQUE (tag_name);


--
-- Name: natural_features unique_natural_feature; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.natural_features
    ADD CONSTRAINT unique_natural_feature UNIQUE (feature_type, feature_name);


--
-- Name: places unique_osm; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.places
    ADD CONSTRAINT unique_osm UNIQUE (osm_type, osm_id);


--
-- Name: place_amenities unique_place_amenity; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_amenities
    ADD CONSTRAINT unique_place_amenity UNIQUE (place_id, amenity_id);


--
-- Name: place_cuisines unique_place_cuisine; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_cuisines
    ADD CONSTRAINT unique_place_cuisine UNIQUE (place_id, cuisine_id);


--
-- Name: place_natural_features unique_place_feature; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_natural_features
    ADD CONSTRAINT unique_place_feature UNIQUE (place_id, feature_id);


--
-- Name: place_sports unique_place_sport; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_sports
    ADD CONSTRAINT unique_place_sport UNIQUE (place_id, sport_id);


--
-- Name: place_tags unique_place_tag; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_tags
    ADD CONSTRAINT unique_place_tag UNIQUE (place_id, tag_id);


--
-- Name: user_favorites user_favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT user_favorites_pkey PRIMARY KEY (user_id, place_id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_place_amenities_amenity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_place_amenities_amenity ON public.place_amenities USING btree (amenity_id);


--
-- Name: idx_place_amenities_place; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_place_amenities_place ON public.place_amenities USING btree (place_id);


--
-- Name: idx_place_cuisines_cuisine; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_place_cuisines_cuisine ON public.place_cuisines USING btree (cuisine_id);


--
-- Name: idx_place_cuisines_main; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_place_cuisines_main ON public.place_cuisines USING btree (place_id, is_main);


--
-- Name: idx_place_cuisines_place; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_place_cuisines_place ON public.place_cuisines USING btree (place_id);


--
-- Name: idx_place_natural_features_feature; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_place_natural_features_feature ON public.place_natural_features USING btree (feature_id);


--
-- Name: idx_place_natural_features_place; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_place_natural_features_place ON public.place_natural_features USING btree (place_id);


--
-- Name: idx_place_photos_main; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_place_photos_main ON public.place_photos USING btree (place_id, is_main);


--
-- Name: idx_place_photos_place; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_place_photos_place ON public.place_photos USING btree (place_id);


--
-- Name: idx_place_reviews_place; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_place_reviews_place ON public.place_reviews USING btree (place_id);


--
-- Name: idx_place_reviews_rating; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_place_reviews_rating ON public.place_reviews USING btree (rating);


--
-- Name: idx_place_sports_place; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_place_sports_place ON public.place_sports USING btree (place_id);


--
-- Name: idx_place_sports_sport; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_place_sports_sport ON public.place_sports USING btree (sport_id);


--
-- Name: idx_place_tags_place; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_place_tags_place ON public.place_tags USING btree (place_id);


--
-- Name: idx_place_tags_tag; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_place_tags_tag ON public.place_tags USING btree (tag_id);


--
-- Name: idx_places_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_places_active ON public.places USING btree (is_active);


--
-- Name: idx_places_location_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_places_location_active ON public.places USING btree (latitude, longitude, is_active);


--
-- Name: idx_places_location_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_places_location_type ON public.places USING btree (latitude, longitude, place_type_id);


--
-- Name: idx_places_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_places_name ON public.places USING btree (name);


--
-- Name: idx_places_osm; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_places_osm ON public.places USING btree (osm_type, osm_id);


--
-- Name: idx_places_price; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_places_price ON public.places USING btree (price_category_id);


--
-- Name: idx_places_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_places_type ON public.places USING btree (place_type_id);


--
-- Name: idx_places_type_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_places_type_active ON public.places USING btree (place_type_id, is_active);


--
-- Name: ix_agent_messages_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_agent_messages_id ON public.agent_messages USING btree (id);


--
-- Name: ix_generation_jobs_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_generation_jobs_id ON public.generation_jobs USING btree (id);


--
-- Name: ix_generation_jobs_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_generation_jobs_status ON public.generation_jobs USING btree (status);


--
-- Name: ix_refresh_tokens_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_refresh_tokens_id ON public.refresh_tokens USING btree (id);


--
-- Name: ix_refresh_tokens_token_hash; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_refresh_tokens_token_hash ON public.refresh_tokens USING btree (token_hash);


--
-- Name: ix_routes_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_routes_id ON public.routes USING btree (id);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: agent_messages agent_messages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_messages
    ADD CONSTRAINT agent_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_favorites fk_place; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT fk_place FOREIGN KEY (place_id) REFERENCES public.places(place_id) ON DELETE CASCADE;


--
-- Name: place_amenities fk_place_amenity_amenity; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_amenities
    ADD CONSTRAINT fk_place_amenity_amenity FOREIGN KEY (amenity_id) REFERENCES public.amenities(amenity_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: place_amenities fk_place_amenity_place; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_amenities
    ADD CONSTRAINT fk_place_amenity_place FOREIGN KEY (place_id) REFERENCES public.places(place_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: place_cuisines fk_place_cuisine_cuisine; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_cuisines
    ADD CONSTRAINT fk_place_cuisine_cuisine FOREIGN KEY (cuisine_id) REFERENCES public.cuisines(cuisine_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: place_cuisines fk_place_cuisine_place; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_cuisines
    ADD CONSTRAINT fk_place_cuisine_place FOREIGN KEY (place_id) REFERENCES public.places(place_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: place_natural_features fk_place_feature_feature; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_natural_features
    ADD CONSTRAINT fk_place_feature_feature FOREIGN KEY (feature_id) REFERENCES public.natural_features(feature_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: place_natural_features fk_place_feature_place; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_natural_features
    ADD CONSTRAINT fk_place_feature_place FOREIGN KEY (place_id) REFERENCES public.places(place_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: place_photos fk_place_photo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_photos
    ADD CONSTRAINT fk_place_photo FOREIGN KEY (place_id) REFERENCES public.places(place_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: place_reviews fk_place_review; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_reviews
    ADD CONSTRAINT fk_place_review FOREIGN KEY (place_id) REFERENCES public.places(place_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: place_sports fk_place_sport_place; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_sports
    ADD CONSTRAINT fk_place_sport_place FOREIGN KEY (place_id) REFERENCES public.places(place_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: place_sports fk_place_sport_sport; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_sports
    ADD CONSTRAINT fk_place_sport_sport FOREIGN KEY (sport_id) REFERENCES public.sports(sport_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: place_tags fk_place_tag_place; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_tags
    ADD CONSTRAINT fk_place_tag_place FOREIGN KEY (place_id) REFERENCES public.places(place_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: place_tags fk_place_tag_tag; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place_tags
    ADD CONSTRAINT fk_place_tag_tag FOREIGN KEY (tag_id) REFERENCES public.tags(tag_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: places fk_place_type; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.places
    ADD CONSTRAINT fk_place_type FOREIGN KEY (place_type_id) REFERENCES public.place_types(place_type_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: places fk_price_category; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.places
    ADD CONSTRAINT fk_price_category FOREIGN KEY (price_category_id) REFERENCES public.price_categories(price_category_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: user_favorites fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: generation_jobs generation_jobs_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.generation_jobs
    ADD CONSTRAINT generation_jobs_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.routes(id) ON DELETE SET NULL;


--
-- Name: generation_jobs generation_jobs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.generation_jobs
    ADD CONSTRAINT generation_jobs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: routes routes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.routes
    ADD CONSTRAINT routes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

