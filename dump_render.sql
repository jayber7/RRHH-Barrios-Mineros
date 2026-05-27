--
-- PostgreSQL database dump
--

\restrict hN84d1qY29sk5cspGCY0cVFmSlsaWQrGqQ4A4Q3uTAmyHDNxmJRHAhydUqvXX7U

-- Dumped from database version 17.9 (Debian 17.9-1.pgdg12+1)
-- Dumped by pg_dump version 17.10 (Debian 17.10-1.pgdg12+1)

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: hitdev
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO hitdev;

--
-- Name: next_hr(integer); Type: FUNCTION; Schema: public; Owner: hitdev
--

CREATE FUNCTION public.next_hr(p_gestion integer DEFAULT NULL::integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_gestion INT;
    v_next INT;
BEGIN
    v_gestion := COALESCE(p_gestion, EXTRACT(YEAR FROM CURRENT_DATE)::INT);
    INSERT INTO secuencia_hr (gestion, ultimo_numero)
    VALUES (v_gestion, 1)
    ON CONFLICT (gestion)
    DO UPDATE SET ultimo_numero = secuencia_hr.ultimo_numero + 1
    RETURNING ultimo_numero INTO v_next;
    RETURN v_next;
END;
$$;


ALTER FUNCTION public.next_hr(p_gestion integer) OWNER TO hitdev;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: asistencia_diaria; Type: TABLE; Schema: public; Owner: hitdev
--

CREATE TABLE public.asistencia_diaria (
    id integer NOT NULL,
    asistencia_id integer,
    dia integer NOT NULL,
    valor character varying(10)
);


ALTER TABLE public.asistencia_diaria OWNER TO hitdev;

--
-- Name: asistencia_diaria_id_seq; Type: SEQUENCE; Schema: public; Owner: hitdev
--

CREATE SEQUENCE public.asistencia_diaria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asistencia_diaria_id_seq OWNER TO hitdev;

--
-- Name: asistencia_diaria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hitdev
--

ALTER SEQUENCE public.asistencia_diaria_id_seq OWNED BY public.asistencia_diaria.id;


--
-- Name: asistencia_mensual; Type: TABLE; Schema: public; Owner: hitdev
--

CREATE TABLE public.asistencia_mensual (
    id integer NOT NULL,
    personal_id integer,
    mes integer NOT NULL,
    anio integer NOT NULL,
    total_horas numeric(10,2) DEFAULT 0,
    total_atrasos_min integer DEFAULT 0,
    observaciones text,
    tipo_planilla character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.asistencia_mensual OWNER TO hitdev;

--
-- Name: asistencia_mensual_id_seq; Type: SEQUENCE; Schema: public; Owner: hitdev
--

CREATE SEQUENCE public.asistencia_mensual_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asistencia_mensual_id_seq OWNER TO hitdev;

--
-- Name: asistencia_mensual_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hitdev
--

ALTER SEQUENCE public.asistencia_mensual_id_seq OWNED BY public.asistencia_mensual.id;


--
-- Name: asistencia_rotaciones; Type: TABLE; Schema: public; Owner: hitdev
--

CREATE TABLE public.asistencia_rotaciones (
    id integer NOT NULL,
    personal_id integer,
    fecha_inicio date,
    fecha_fin date,
    rotacion_de character varying(150),
    rotacion_a character varying(150),
    tiempo_rotacion character varying(50),
    observaciones text
);


ALTER TABLE public.asistencia_rotaciones OWNER TO hitdev;

--
-- Name: asistencia_rotaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: hitdev
--

CREATE SEQUENCE public.asistencia_rotaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asistencia_rotaciones_id_seq OWNER TO hitdev;

--
-- Name: asistencia_rotaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hitdev
--

ALTER SEQUENCE public.asistencia_rotaciones_id_seq OWNED BY public.asistencia_rotaciones.id;


--
-- Name: biometrico_config; Type: TABLE; Schema: public; Owner: hitdev
--

CREATE TABLE public.biometrico_config (
    id integer NOT NULL,
    ip_address character varying(50),
    port integer,
    comms_key integer DEFAULT 0,
    ultimo_sync_usuarios timestamp without time zone,
    ultimo_sync_logs timestamp without time zone,
    estado character varying(20) DEFAULT 'DESCONECTADO'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.biometrico_config OWNER TO hitdev;

--
-- Name: biometrico_logs_raw; Type: TABLE; Schema: public; Owner: hitdev
--

CREATE TABLE public.biometrico_logs_raw (
    id integer NOT NULL,
    biometrico_id character varying(50) NOT NULL,
    "timestamp" timestamp without time zone,
    verificacion_tipo integer,
    estado_asistencia integer,
    device_ip character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.biometrico_logs_raw OWNER TO hitdev;

--
-- Name: biometrico_logs_raw_id_seq; Type: SEQUENCE; Schema: public; Owner: hitdev
--

CREATE SEQUENCE public.biometrico_logs_raw_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.biometrico_logs_raw_id_seq OWNER TO hitdev;

--
-- Name: biometrico_logs_raw_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hitdev
--

ALTER SEQUENCE public.biometrico_logs_raw_id_seq OWNED BY public.biometrico_logs_raw.id;


--
-- Name: cat_clasificaciones; Type: TABLE; Schema: public; Owner: hitdev
--

CREATE TABLE public.cat_clasificaciones (
    id integer NOT NULL,
    codigo character varying(20) NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.cat_clasificaciones OWNER TO hitdev;

--
-- Name: cat_clasificaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: hitdev
--

CREATE SEQUENCE public.cat_clasificaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cat_clasificaciones_id_seq OWNER TO hitdev;

--
-- Name: cat_clasificaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hitdev
--

ALTER SEQUENCE public.cat_clasificaciones_id_seq OWNED BY public.cat_clasificaciones.id;


--
-- Name: cat_etiquetas; Type: TABLE; Schema: public; Owner: hitdev
--

CREATE TABLE public.cat_etiquetas (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    color character varying(7) DEFAULT '#3b82f6'::character varying
);


ALTER TABLE public.cat_etiquetas OWNER TO hitdev;

--
-- Name: cat_etiquetas_id_seq; Type: SEQUENCE; Schema: public; Owner: hitdev
--

CREATE SEQUENCE public.cat_etiquetas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cat_etiquetas_id_seq OWNER TO hitdev;

--
-- Name: cat_etiquetas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hitdev
--

ALTER SEQUENCE public.cat_etiquetas_id_seq OWNED BY public.cat_etiquetas.id;


--
-- Name: cat_expediciones; Type: TABLE; Schema: public; Owner: hitdev
--

CREATE TABLE public.cat_expediciones (
    id integer NOT NULL,
    sigla character varying(5) NOT NULL,
    nombre character varying(50) NOT NULL
);


ALTER TABLE public.cat_expediciones OWNER TO hitdev;

--
-- Name: cat_expediciones_id_seq; Type: SEQUENCE; Schema: public; Owner: hitdev
--

CREATE SEQUENCE public.cat_expediciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cat_expediciones_id_seq OWNER TO hitdev;

--
-- Name: cat_expediciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hitdev
--

ALTER SEQUENCE public.cat_expediciones_id_seq OWNED BY public.cat_expediciones.id;


--
-- Name: cat_fuentes_financiamiento; Type: TABLE; Schema: public; Owner: hitdev
--

CREATE TABLE public.cat_fuentes_financiamiento (
    id integer NOT NULL,
    nombre_fuente character varying(100) NOT NULL
);


ALTER TABLE public.cat_fuentes_financiamiento OWNER TO hitdev;

--
-- Name: cat_fuentes_financiamiento_id_seq; Type: SEQUENCE; Schema: public; Owner: hitdev
--

CREATE SEQUENCE public.cat_fuentes_financiamiento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cat_fuentes_financiamiento_id_seq OWNER TO hitdev;

--
-- Name: cat_fuentes_financiamiento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hitdev
--

ALTER SEQUENCE public.cat_fuentes_financiamiento_id_seq OWNED BY public.cat_fuentes_financiamiento.id;


--
-- Name: cat_profesiones; Type: TABLE; Schema: public; Owner: hitdev
--

CREATE TABLE public.cat_profesiones (
    id integer NOT NULL,
    nombre_profesion character varying(100) NOT NULL
);


ALTER TABLE public.cat_profesiones OWNER TO hitdev;

--
-- Name: cat_profesiones_id_seq; Type: SEQUENCE; Schema: public; Owner: hitdev
--

CREATE SEQUENCE public.cat_profesiones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cat_profesiones_id_seq OWNER TO hitdev;

--
-- Name: cat_profesiones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hitdev
--

ALTER SEQUENCE public.cat_profesiones_id_seq OWNED BY public.cat_profesiones.id;


--
-- Name: cat_tipos_correspondencia; Type: TABLE; Schema: public; Owner: hitdev
--

CREATE TABLE public.cat_tipos_correspondencia (
    id integer NOT NULL,
    codigo character varying(10) NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.cat_tipos_correspondencia OWNER TO hitdev;

--
-- Name: cat_tipos_correspondencia_id_seq; Type: SEQUENCE; Schema: public; Owner: hitdev
--

CREATE SEQUENCE public.cat_tipos_correspondencia_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cat_tipos_correspondencia_id_seq OWNER TO hitdev;

--
-- Name: cat_tipos_correspondencia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hitdev
--

ALTER SEQUENCE public.cat_tipos_correspondencia_id_seq OWNED BY public.cat_tipos_correspondencia.id;


--
-- Name: cat_tipos_personal; Type: TABLE; Schema: public; Owner: hitdev
--

CREATE TABLE public.cat_tipos_personal (
    id integer NOT NULL,
    nombre_tipo character varying(50) NOT NULL
);


ALTER TABLE public.cat_tipos_personal OWNER TO hitdev;

--
-- Name: cat_tipos_personal_id_seq; Type: SEQUENCE; Schema: public; Owner: hitdev
--

CREATE SEQUENCE public.cat_tipos_personal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cat_tipos_personal_id_seq OWNER TO hitdev;

--
-- Name: cat_tipos_personal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hitdev
--

ALTER SEQUENCE public.cat_tipos_personal_id_seq OWNED BY public.cat_tipos_personal.id;


--
-- Name: cat_unidades_servicios; Type: TABLE; Schema: public; Owner: hitdev
--

CREATE TABLE public.cat_unidades_servicios (
    id integer NOT NULL,
    nombre_unidad character varying(150) NOT NULL
);


ALTER TABLE public.cat_unidades_servicios OWNER TO hitdev;

--
-- Name: cat_unidades_servicios_id_seq; Type: SEQUENCE; Schema: public; Owner: hitdev
--

CREATE SEQUENCE public.cat_unidades_servicios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cat_unidades_servicios_id_seq OWNER TO hitdev;

--
-- Name: cat_unidades_servicios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hitdev
--

ALTER SEQUENCE public.cat_unidades_servicios_id_seq OWNED BY public.cat_unidades_servicios.id;


--
-- Name: configuracion_cite; Type: TABLE; Schema: public; Owner: hitdev
--

CREATE TABLE public.configuracion_cite (
    id integer DEFAULT 1 NOT NULL,
    hospital_sigla character varying(10) DEFAULT 'HBM'::character varying NOT NULL,
    separador character varying(5) DEFAULT '/'::character varying NOT NULL,
    formato text DEFAULT '{SIGLA}/{AREA}/{TIPO}/N° {NRO}/{GESTION}'::text NOT NULL,
    gestion_actual integer DEFAULT 2026 NOT NULL,
    ultimo_numero integer DEFAULT 0 NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unica_fila CHECK ((id = 1))
);


ALTER TABLE public.configuracion_cite OWNER TO hitdev;

--
-- Name: correspondencia; Type: TABLE; Schema: public; Owner: hitdev
--

CREATE TABLE public.correspondencia (
    id integer NOT NULL,
    hr_correlativo integer NOT NULL,
    gestion integer DEFAULT 2026 NOT NULL,
    cite character varying(150),
    tipo_id integer,
    clasificacion_id integer,
    remitente_externo character varying(255),
    remitente_interno_id integer,
    destinatario_original character varying(255),
    referencia text NOT NULL,
    pdf_original character varying(500),
    pdf_comprimido character varying(500),
    folios integer,
    fecha_documento date NOT NULL,
    fecha_recepcion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    usuario_recepcion_id integer,
    estado character varying(20) DEFAULT 'recibido'::character varying,
    observaciones text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.correspondencia OWNER TO hitdev;

--
-- Name: correspondencia_etiquetas; Type: TABLE; Schema: public; Owner: hitdev
--

CREATE TABLE public.correspondencia_etiquetas (
    correspondencia_id integer NOT NULL,
    etiqueta_id integer NOT NULL
);


ALTER TABLE public.correspondencia_etiquetas OWNER TO hitdev;

--
-- Name: correspondencia_id_seq; Type: SEQUENCE; Schema: public; Owner: hitdev
--

CREATE SEQUENCE public.correspondencia_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.correspondencia_id_seq OWNER TO hitdev;

--
-- Name: correspondencia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hitdev
--

ALTER SEQUENCE public.correspondencia_id_seq OWNED BY public.correspondencia.id;


--
-- Name: derivaciones; Type: TABLE; Schema: public; Owner: hitdev
--

CREATE TABLE public.derivaciones (
    id integer NOT NULL,
    correspondencia_id integer,
    de_usuario_id integer,
    para_usuario_id integer,
    instruccion text,
    accion character varying(50) DEFAULT 'derivar'::character varying,
    respuesta text,
    documento_respuesta_pdf character varying(500),
    fecha_derivacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_respuesta timestamp without time zone,
    completada boolean DEFAULT false,
    orden integer DEFAULT 1
);


ALTER TABLE public.derivaciones OWNER TO hitdev;

--
-- Name: derivaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: hitdev
--

CREATE SEQUENCE public.derivaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.derivaciones_id_seq OWNER TO hitdev;

--
-- Name: derivaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hitdev
--

ALTER SEQUENCE public.derivaciones_id_seq OWNED BY public.derivaciones.id;


--
-- Name: establecimientos; Type: TABLE; Schema: public; Owner: hitdev
--

CREATE TABLE public.establecimientos (
    id integer NOT NULL,
    nombre_establecimiento character varying(150) NOT NULL,
    municipio character varying(100) DEFAULT 'Oruro'::character varying,
    red character varying(100) DEFAULT 'Red Urbana'::character varying
);


ALTER TABLE public.establecimientos OWNER TO hitdev;

--
-- Name: establecimientos_id_seq; Type: SEQUENCE; Schema: public; Owner: hitdev
--

CREATE SEQUENCE public.establecimientos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.establecimientos_id_seq OWNER TO hitdev;

--
-- Name: establecimientos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hitdev
--

ALTER SEQUENCE public.establecimientos_id_seq OWNED BY public.establecimientos.id;


--
-- Name: historial_movimientos; Type: TABLE; Schema: public; Owner: hitdev
--

CREATE TABLE public.historial_movimientos (
    id integer NOT NULL,
    personal_id integer,
    tipo_movimiento character varying(100),
    detalles_anteriores jsonb,
    detalles_nuevos jsonb,
    motivo text,
    fecha_movimiento timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.historial_movimientos OWNER TO hitdev;

--
-- Name: historial_movimientos_id_seq; Type: SEQUENCE; Schema: public; Owner: hitdev
--

CREATE SEQUENCE public.historial_movimientos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historial_movimientos_id_seq OWNER TO hitdev;

--
-- Name: historial_movimientos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hitdev
--

ALTER SEQUENCE public.historial_movimientos_id_seq OWNED BY public.historial_movimientos.id;


--
-- Name: permisos; Type: TABLE; Schema: public; Owner: hitdev
--

CREATE TABLE public.permisos (
    id integer NOT NULL,
    codigo character varying(50) NOT NULL,
    descripcion character varying(255),
    modulo character varying(50) DEFAULT 'general'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.permisos OWNER TO hitdev;

--
-- Name: permisos_id_seq; Type: SEQUENCE; Schema: public; Owner: hitdev
--

CREATE SEQUENCE public.permisos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permisos_id_seq OWNER TO hitdev;

--
-- Name: permisos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hitdev
--

ALTER SEQUENCE public.permisos_id_seq OWNED BY public.permisos.id;


--
-- Name: personal; Type: TABLE; Schema: public; Owner: hitdev
--

CREATE TABLE public.personal (
    id integer NOT NULL,
    ci character varying(20) NOT NULL,
    complemento character varying(5),
    exp_id integer,
    apellido_paterno character varying(100),
    apellido_materno character varying(100),
    apellido_casada character varying(100),
    primer_nombre character varying(100) NOT NULL,
    segundo_nombre character varying(100),
    tercer_nombre character varying(100),
    fecha_nacimiento date,
    profesion_id integer,
    telefono character varying(20),
    biometrico_id character varying(50),
    estado character varying(20) DEFAULT 'ACTIVO'::character varying,
    fecha_baja date
);


ALTER TABLE public.personal OWNER TO hitdev;

--
-- Name: personal_id_seq; Type: SEQUENCE; Schema: public; Owner: hitdev
--

CREATE SEQUENCE public.personal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.personal_id_seq OWNER TO hitdev;

--
-- Name: personal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hitdev
--

ALTER SEQUENCE public.personal_id_seq OWNED BY public.personal.id;


--
-- Name: rol_permisos; Type: TABLE; Schema: public; Owner: hitdev
--

CREATE TABLE public.rol_permisos (
    rol_id integer NOT NULL,
    permiso_id integer NOT NULL
);


ALTER TABLE public.rol_permisos OWNER TO hitdev;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: hitdev
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.roles OWNER TO hitdev;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: hitdev
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO hitdev;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hitdev
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: secuencia_hr; Type: TABLE; Schema: public; Owner: hitdev
--

CREATE TABLE public.secuencia_hr (
    gestion integer NOT NULL,
    ultimo_numero integer DEFAULT 0
);


ALTER TABLE public.secuencia_hr OWNER TO hitdev;

--
-- Name: usuario_roles; Type: TABLE; Schema: public; Owner: hitdev
--

CREATE TABLE public.usuario_roles (
    usuario_id integer NOT NULL,
    rol_id integer NOT NULL
);


ALTER TABLE public.usuario_roles OWNER TO hitdev;

--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: hitdev
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    personal_id integer,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    password_cambiado boolean DEFAULT false,
    google_id character varying(100),
    email character varying(100),
    activo boolean DEFAULT true,
    ultimo_acceso timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.usuarios OWNER TO hitdev;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: hitdev
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO hitdev;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hitdev
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: vinculos_laborales; Type: TABLE; Schema: public; Owner: hitdev
--

CREATE TABLE public.vinculos_laborales (
    id integer NOT NULL,
    personal_id integer,
    establecimiento_id integer,
    tipo_personal_id integer,
    fuente_financiamiento_id integer,
    identificador_laboral character varying(100),
    unidad_servicio character varying(150),
    cargo_actual character varying(150),
    carga_horaria character varying(10),
    fecha_ingreso date,
    fecha_institucionalizacion date,
    observaciones text,
    cargo_planilla character varying(150),
    cargo_escala character varying(150),
    nro_resumen_ejecutivo character varying(100),
    unidad_servicio_id integer,
    fecha_fin_contrato date
);


ALTER TABLE public.vinculos_laborales OWNER TO hitdev;

--
-- Name: vinculos_laborales_id_seq; Type: SEQUENCE; Schema: public; Owner: hitdev
--

CREATE SEQUENCE public.vinculos_laborales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vinculos_laborales_id_seq OWNER TO hitdev;

--
-- Name: vinculos_laborales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hitdev
--

ALTER SEQUENCE public.vinculos_laborales_id_seq OWNED BY public.vinculos_laborales.id;


--
-- Name: asistencia_diaria id; Type: DEFAULT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.asistencia_diaria ALTER COLUMN id SET DEFAULT nextval('public.asistencia_diaria_id_seq'::regclass);


--
-- Name: asistencia_mensual id; Type: DEFAULT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.asistencia_mensual ALTER COLUMN id SET DEFAULT nextval('public.asistencia_mensual_id_seq'::regclass);


--
-- Name: asistencia_rotaciones id; Type: DEFAULT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.asistencia_rotaciones ALTER COLUMN id SET DEFAULT nextval('public.asistencia_rotaciones_id_seq'::regclass);


--
-- Name: biometrico_logs_raw id; Type: DEFAULT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.biometrico_logs_raw ALTER COLUMN id SET DEFAULT nextval('public.biometrico_logs_raw_id_seq'::regclass);


--
-- Name: cat_clasificaciones id; Type: DEFAULT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.cat_clasificaciones ALTER COLUMN id SET DEFAULT nextval('public.cat_clasificaciones_id_seq'::regclass);


--
-- Name: cat_etiquetas id; Type: DEFAULT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.cat_etiquetas ALTER COLUMN id SET DEFAULT nextval('public.cat_etiquetas_id_seq'::regclass);


--
-- Name: cat_expediciones id; Type: DEFAULT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.cat_expediciones ALTER COLUMN id SET DEFAULT nextval('public.cat_expediciones_id_seq'::regclass);


--
-- Name: cat_fuentes_financiamiento id; Type: DEFAULT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.cat_fuentes_financiamiento ALTER COLUMN id SET DEFAULT nextval('public.cat_fuentes_financiamiento_id_seq'::regclass);


--
-- Name: cat_profesiones id; Type: DEFAULT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.cat_profesiones ALTER COLUMN id SET DEFAULT nextval('public.cat_profesiones_id_seq'::regclass);


--
-- Name: cat_tipos_correspondencia id; Type: DEFAULT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.cat_tipos_correspondencia ALTER COLUMN id SET DEFAULT nextval('public.cat_tipos_correspondencia_id_seq'::regclass);


--
-- Name: cat_tipos_personal id; Type: DEFAULT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.cat_tipos_personal ALTER COLUMN id SET DEFAULT nextval('public.cat_tipos_personal_id_seq'::regclass);


--
-- Name: cat_unidades_servicios id; Type: DEFAULT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.cat_unidades_servicios ALTER COLUMN id SET DEFAULT nextval('public.cat_unidades_servicios_id_seq'::regclass);


--
-- Name: correspondencia id; Type: DEFAULT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.correspondencia ALTER COLUMN id SET DEFAULT nextval('public.correspondencia_id_seq'::regclass);


--
-- Name: derivaciones id; Type: DEFAULT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.derivaciones ALTER COLUMN id SET DEFAULT nextval('public.derivaciones_id_seq'::regclass);


--
-- Name: establecimientos id; Type: DEFAULT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.establecimientos ALTER COLUMN id SET DEFAULT nextval('public.establecimientos_id_seq'::regclass);


--
-- Name: historial_movimientos id; Type: DEFAULT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.historial_movimientos ALTER COLUMN id SET DEFAULT nextval('public.historial_movimientos_id_seq'::regclass);


--
-- Name: permisos id; Type: DEFAULT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.permisos ALTER COLUMN id SET DEFAULT nextval('public.permisos_id_seq'::regclass);


--
-- Name: personal id; Type: DEFAULT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.personal ALTER COLUMN id SET DEFAULT nextval('public.personal_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Name: vinculos_laborales id; Type: DEFAULT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.vinculos_laborales ALTER COLUMN id SET DEFAULT nextval('public.vinculos_laborales_id_seq'::regclass);


--
-- Data for Name: asistencia_diaria; Type: TABLE DATA; Schema: public; Owner: hitdev
--

COPY public.asistencia_diaria (id, asistencia_id, dia, valor) FROM stdin;
436	61	11	12
437	61	12	36
438	61	14	12
439	61	16	36
440	61	18	12
441	61	19	36
442	61	21	12
443	61	22	36
444	61	24	36
445	61	26	12
446	61	27	12
447	61	28	36
448	61	30	12
449	62	10	12
450	62	11	30
451	62	13	12
452	62	14	36
453	62	16	12
454	62	17	30
455	62	20	36
456	62	22	36
457	62	24	12
458	62	25	12
459	62	26	36
460	62	28	12
461	62	29	36
462	63	2	30
463	63	4	24
464	63	6	30
465	63	8	24
466	63	10	30
467	63	12	30
468	63	14	30
469	63	16	30
470	63	18	24
471	63	20	24
472	63	22	12
473	63	23	24
474	63	25	6
475	63	26	24
476	63	28	12
477	63	29	36
478	64	1	36
479	64	4	24
480	64	6	12
481	64	7	36
482	64	9	12
483	64	10	30
484	64	13	36
485	64	15	12
486	64	16	36
487	64	19	36
488	64	21	12
489	64	22	36
490	64	24	12
491	64	25	30
492	64	27	12
493	64	28	30
494	65	1	12
495	65	2	24
496	65	4	6
497	65	5	12
498	65	7	12
499	65	8	36
500	65	10	12
501	65	11	24
502	65	13	12
503	65	14	36
504	65	16	12
505	65	17	36
506	65	20	36
507	65	22	12
508	65	23	36
509	65	25	6
510	65	26	36
511	65	28	12
512	65	29	36
513	66	1	36
514	66	3	36
515	66	7	48
516	66	9	30
517	66	13	36
518	66	15	30
519	66	17	36
520	66	19	36
521	66	21	36
522	66	23	12
523	66	24	6
524	66	27	36
525	66	29	12
526	66	30	36
527	67	1	12
528	67	4	12
529	67	8	12
530	67	11	12
531	67	15	12
532	67	17	6
533	67	18	12
534	67	22	12
535	67	24	12
536	67	25	12
537	67	29	12
538	68	1	6
539	68	2	6
540	68	3	F
541	68	6	6
542	68	7	6
543	68	8	6
544	68	9	6
545	68	10	6
546	68	13	6
547	68	14	6
548	68	15	6
549	68	16	6
550	68	17	6
551	68	20	6
552	68	21	6
553	68	22	6
554	68	23	6
555	68	24	6
556	68	27	6
557	68	28	6
558	68	29	6
559	68	30	6
560	69	3	12
561	69	5	18
562	69	6	6
563	69	7	12
564	69	8	6
565	69	10	12
566	69	13	6
567	69	14	12
568	69	18	12
569	69	20	6
570	69	21	6
571	69	24	12
572	69	27	6
573	70	1	12
574	70	6	12
575	70	9	12
576	70	12	6
577	70	13	12
578	70	15	12
579	70	21	12
580	70	23	12
581	70	24	12
582	70	28	12
583	70	30	12
584	71	2	12
585	71	3	12
586	71	4	6
587	71	6	6
588	71	9	12
589	71	10	6
590	71	11	6
591	71	13	12
592	71	14	6
593	71	16	6
594	71	17	6
595	71	18	6
596	71	19	6
597	71	20	6
598	71	21	6
599	71	22	6
600	71	23	12
601	71	24	6
602	71	25	6
603	71	26	6
604	71	28	6
605	71	29	6
606	71	30	6
607	72	1	12
608	72	7	12
609	72	8	12
610	72	9	6
611	72	12	12
612	72	15	12
613	72	16	6
614	72	22	12
615	72	23	6
616	72	24	6
617	72	26	12
618	72	29	12
619	72	30	6
620	73	2	12
621	73	4	12
622	73	6	12
623	73	10	12
624	73	11	24
625	73	13	12
626	73	19	12
627	73	20	12
628	73	25	12
629	73	27	12
630	74	2	12
631	74	3	6
632	74	8	12
633	74	10	12
634	74	16	12
635	74	19	12
636	74	22	12
637	74	23	12
638	74	27	12
639	74	29	12
640	74	30	12
641	75	1	6
642	75	2	6
643	75	3	F
644	75	6	6
645	75	7	6
646	75	8	6
647	75	9	6
648	75	10	6
649	75	13	6
650	75	14	6
651	75	15	6
652	75	16	6
653	75	17	6
654	75	20	6
655	75	21	6
656	75	22	6
657	75	23	6
658	75	24	6
659	75	27	6
660	75	28	6
661	75	29	6
662	75	30	6
663	76	2	12
664	76	5	12
665	76	9	12
666	76	11	12
667	76	12	12
668	76	13	12
669	76	16	12
670	76	17	6
671	76	23	12
672	76	25	12
673	76	30	12
\.


--
-- Data for Name: asistencia_mensual; Type: TABLE DATA; Schema: public; Owner: hitdev
--

COPY public.asistencia_mensual (id, personal_id, mes, anio, total_horas, total_atrasos_min, observaciones, tipo_planilla, created_at) FROM stdin;
1	110	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:20.119333
2	111	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:20.229201
3	112	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:20.276696
4	113	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:20.292618
5	114	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:20.31122
6	115	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:20.375523
7	116	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:20.402113
8	117	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:20.47068
9	118	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:20.497296
10	120	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:20.568499
11	121	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:20.588413
12	122	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:20.606593
13	123	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:20.67734
14	124	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:20.696365
15	125	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:20.767954
16	126	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:20.799565
17	127	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:20.879576
18	128	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:20.89593
19	129	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:20.965947
20	130	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:20.99467
21	131	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:21.070545
22	132	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:21.08659
23	133	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:21.103346
24	134	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:21.174795
25	135	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:21.189955
26	136	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:21.205413
27	138	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:21.282759
28	139	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:21.303452
29	140	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:21.319694
30	141	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:21.392171
61	142	4	2026	300.00	0	\N	RESIDENTE	2026-05-26 01:37:54.869765
62	143	4	2026	312.00	0	\N	RESIDENTE	2026-05-26 01:37:54.963791
63	144	4	2026	390.00	0	\N	RESIDENTE	2026-05-26 01:37:54.982508
64	145	4	2026	402.00	0	\N	RESIDENTE	2026-05-26 01:37:55.005834
65	147	4	2026	408.00	0	\N	RESIDENTE	2026-05-26 01:37:55.080064
66	148	4	2026	426.00	0	\N	RESIDENTE	2026-05-26 01:37:55.11061
67	149	4	2026	126.00	17	\N	RESIDENTE	2026-05-26 01:37:55.17566
68	150	4	2026	126.00	59	\N	RESIDENTE	2026-05-26 01:37:55.192512
69	151	4	2026	126.00	0	\N	RESIDENTE	2026-05-26 01:37:55.278206
70	152	4	2026	126.00	0	\N	RESIDENTE	2026-05-26 01:37:55.362588
71	153	4	2026	168.00	34	\N	RESIDENTE	2026-05-26 01:37:55.382199
72	154	4	2026	126.00	0	\N	RESIDENTE	2026-05-26 01:37:55.482974
73	155	4	2026	132.00	0	\N	RESIDENTE	2026-05-26 01:37:55.503715
74	156	4	2026	126.00	56	\N	RESIDENTE	2026-05-26 01:37:55.570167
75	157	4	2026	126.00	11	\N	RESIDENTE	2026-05-26 01:37:55.586146
76	158	4	2026	126.00	0	\N	RESIDENTE	2026-05-26 01:37:55.615259
77	149	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:55.693333
78	150	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:55.696439
79	151	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:55.699015
80	152	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:55.701453
81	153	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:55.704178
82	154	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:55.706713
83	155	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:55.709108
84	156	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:55.711759
85	157	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:55.714264
86	158	4	2026	0.00	0	\N	MINISTERIAL	2026-05-26 01:37:55.717287
\.


--
-- Data for Name: asistencia_rotaciones; Type: TABLE DATA; Schema: public; Owner: hitdev
--

COPY public.asistencia_rotaciones (id, personal_id, fecha_inicio, fecha_fin, rotacion_de, rotacion_a, tiempo_rotacion, observaciones) FROM stdin;
\.


--
-- Data for Name: biometrico_config; Type: TABLE DATA; Schema: public; Owner: hitdev
--

COPY public.biometrico_config (id, ip_address, port, comms_key, ultimo_sync_usuarios, ultimo_sync_logs, estado, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: biometrico_logs_raw; Type: TABLE DATA; Schema: public; Owner: hitdev
--

COPY public.biometrico_logs_raw (id, biometrico_id, "timestamp", verificacion_tipo, estado_asistencia, device_ip, created_at) FROM stdin;
\.


--
-- Data for Name: cat_clasificaciones; Type: TABLE DATA; Schema: public; Owner: hitdev
--

COPY public.cat_clasificaciones (id, codigo, nombre) FROM stdin;
1	SOL	Solicitud
2	INF	Informe
3	MEM	Memorándum
4	OFI	Oficio
5	CIR	Circular
6	NOT	Nota
7	RES	Resolución
8	ACT	Acta
\.


--
-- Data for Name: cat_etiquetas; Type: TABLE DATA; Schema: public; Owner: hitdev
--

COPY public.cat_etiquetas (id, nombre, color) FROM stdin;
1	Urgente	#ef4444
2	Confidencial	#dc2626
3	Reservado	#f59e0b
4	RRHH	#3b82f6
5	Dirección	#8b5cf6
6	Secretaría	#10b981
7	Administrativo	#6366f1
8	Personal	#ec4899
\.


--
-- Data for Name: cat_expediciones; Type: TABLE DATA; Schema: public; Owner: hitdev
--

COPY public.cat_expediciones (id, sigla, nombre) FROM stdin;
1	LP	La Paz
2	OR	Oruro
3	CB	Cochabamba
4	SC	Santa Cruz
5	BN	Beni
6	PA	Pando
7	TJ	Tarija
8	PT	Potosí
9	CH	Chuquisaca
\.


--
-- Data for Name: cat_fuentes_financiamiento; Type: TABLE DATA; Schema: public; Owner: hitdev
--

COPY public.cat_fuentes_financiamiento (id, nombre_fuente) FROM stdin;
1	TGN
2	HIPC
3	MINISTERIO
4	MUNICIPIO
\.


--
-- Data for Name: cat_profesiones; Type: TABLE DATA; Schema: public; Owner: hitdev
--

COPY public.cat_profesiones (id, nombre_profesion) FROM stdin;
1	BIOQUIMICO FARMACEUTICO
2	TECNICIO SUPERIOR EN LABORATORIO CLINICO
3	AUXILIAR DE ENFERMERIA
4	LICENCIDO. EN CONTADURIA PUBLICA
5	BIOQUIMICA
6	LICENCIADA. EN TRABAJO SOCIAL
7	LICENCIADA EN ENFERMERIA
8	MEDICO INTERNISTA
9	MEDICO CIRUJANO
10	MEDICO PEDIATRA
11	MEDICO ANESTESIOLOGO
12	MEDICO GENERAL
13	CIRUJANO GENERAL
14	TRABAJADOR MANUAL
15	ODONTOPEDIATRA
16	TECNICO SUPERIOR EN FISIOTERAPIA
17	MEDICO GINECOLOGO/OBSTETRA
18	TECNICO EN RADIOLOGIA
19	JEFE DE RR.HH.
20	CIRUJANO BUCAL
21	TECNICO SUPERIOR EN ENFERMERIA
22	LICENCIEDO EN NUTRICION
23	CONDUCTOR
24	BIOQUIMICA Y FARMACIA
25	MEDICO SALUBRISTA
26	ENDODONCISTA
27	LICENCIADA EN IMAGENOLOGIA
28	LICENCIADO EN ENFERMERIA
29	AUXILIAR DE ENFERMERIA,
30	EPIDEMIOLOGA
31	MEDICO GICOLOGO OBSTETRA
32	LICENCIADA EN FISIOTERAPIA
33	TECNICO SUPERIOR EN LABORATORIO
34	AUXILIAR ADMINISTRATIVO
35	COMUNICADOR SOCIAL
36	MEDICO TRAUMATOLOGO
37	INGENIERO COMERCIAL
38	AUXILIAR EN ENFERMERIA
39	MEDICO CARDIOLO
40	MEDICO GINECOLOGO OBSTETRA
41	ANESTESIOLOGA
42	MEDICO GENETISTA
43	TECNICO MEDIO EN ELECTRICIDAD
44	CHOFER
45	PROFESION
46	PERSONAL MANUAL
47	AUXILIAR DE OFICINA
48	LICENCIADA EN NUTRICION
49	ESTADISTICA
50	SERENO PORTERO
51	TECNICO EN ATENCION TEMPRANA
52	INGENIERO EN SISTEMAS
53	LICENCIADO  EN FISIOTERAPIA
54	MEDICO NEFROLOGO
55	ADMINISTRADOR
\.


--
-- Data for Name: cat_tipos_correspondencia; Type: TABLE DATA; Schema: public; Owner: hitdev
--

COPY public.cat_tipos_correspondencia (id, codigo, nombre) FROM stdin;
1	REC	Recepcionada
2	INT	Interna
3	EMIT	Emitida
\.


--
-- Data for Name: cat_tipos_personal; Type: TABLE DATA; Schema: public; Owner: hitdev
--

COPY public.cat_tipos_personal (id, nombre_tipo) FROM stdin;
1	ÍTEM
2	CONTRATO
3	CONSULTORÍA
\.


--
-- Data for Name: cat_unidades_servicios; Type: TABLE DATA; Schema: public; Owner: hitdev
--

COPY public.cat_unidades_servicios (id, nombre_unidad) FROM stdin;
1	SERVICIO DE AMBULANCIA
2	SERVICIO DE ANESTESIOLOGIA
3	SERVICIO DE ATENCION TEMPRANA
4	SERVICIO DE CIRUGIA GENERAL
5	SERVICIO DE COCINA
6	SERVICIO DE EMERGENCIAS
7	SERVICIO DE ESTADISTICA
8	SERVICIO DE FISIOTERAPIA
9	SERVICIO DE GINECOLOGIA
10	SERVICIO DE LAVANDERIA
11	SERVICIO DE LIMPIEZA
12	SERVICIO DE MATERNIDAD
13	SERVICIO DE MEDICINA INTERNA
14	SERVICIO DE NEONATOLOGIA
15	SERVICIO DE NUTRICION
16	SERVICIO DE PEDIATRIA
17	SERVICIO DE PLANCHADO
18	SERVICIO DE PORTERIA
19	SERVICIO DE QUIROFANO Y CENTRAL DE ESTERILIZACION
20	SERVICIO DE SISTEMAS
21	SERVICIO DE TERAPIA INTERMEDIA
22	SERVICIO DE TRAUMATOLOGIA
23	SERVICIO UNIDAD DE HEMODIALISIS
24	AUXILIAR DE OFICINA
\.


--
-- Data for Name: configuracion_cite; Type: TABLE DATA; Schema: public; Owner: hitdev
--

COPY public.configuracion_cite (id, hospital_sigla, separador, formato, gestion_actual, ultimo_numero, updated_at) FROM stdin;
1	HBM	/	{SIGLA}/{AREA}/{TIPO}/N° {NRO}/{GESTION}	2026	0	2026-05-26 06:26:50.419326
\.


--
-- Data for Name: correspondencia; Type: TABLE DATA; Schema: public; Owner: hitdev
--

COPY public.correspondencia (id, hr_correlativo, gestion, cite, tipo_id, clasificacion_id, remitente_externo, remitente_interno_id, destinatario_original, referencia, pdf_original, pdf_comprimido, folios, fecha_documento, fecha_recepcion, usuario_recepcion_id, estado, observaciones, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: correspondencia_etiquetas; Type: TABLE DATA; Schema: public; Owner: hitdev
--

COPY public.correspondencia_etiquetas (correspondencia_id, etiqueta_id) FROM stdin;
\.


--
-- Data for Name: derivaciones; Type: TABLE DATA; Schema: public; Owner: hitdev
--

COPY public.derivaciones (id, correspondencia_id, de_usuario_id, para_usuario_id, instruccion, accion, respuesta, documento_respuesta_pdf, fecha_derivacion, fecha_respuesta, completada, orden) FROM stdin;
\.


--
-- Data for Name: establecimientos; Type: TABLE DATA; Schema: public; Owner: hitdev
--

COPY public.establecimientos (id, nombre_establecimiento, municipio, red) FROM stdin;
1	HBM - Hospital Barrios Mineros	Oruro	Red Urbana
\.


--
-- Data for Name: historial_movimientos; Type: TABLE DATA; Schema: public; Owner: hitdev
--

COPY public.historial_movimientos (id, personal_id, tipo_movimiento, detalles_anteriores, detalles_nuevos, motivo, fecha_movimiento) FROM stdin;
\.


--
-- Data for Name: permisos; Type: TABLE DATA; Schema: public; Owner: hitdev
--

COPY public.permisos (id, codigo, descripcion, modulo, created_at) FROM stdin;
1	correspondencia.ver	Ver correspondencia	correspondencia	2026-05-26 06:26:40.831707
2	correspondencia.crear	Registrar nueva correspondencia	correspondencia	2026-05-26 06:26:41.006383
3	correspondencia.editar	Editar correspondencia	correspondencia	2026-05-26 06:26:41.181746
4	correspondencia.derivar	Derivar correspondencia	correspondencia	2026-05-26 06:26:41.355788
5	correspondencia.responder	Responder derivaciones	correspondencia	2026-05-26 06:26:41.531342
6	correspondencia.eliminar	Eliminar correspondencia	correspondencia	2026-05-26 06:26:41.706823
7	usuarios.ver	Ver usuarios del sistema	usuarios	2026-05-26 06:26:41.880292
8	usuarios.gestionar	Gestionar usuarios y roles	usuarios	2026-05-26 06:26:42.053862
9	config.ver	Ver configuración del sistema	config	2026-05-26 06:26:42.227859
10	config.editar	Editar configuración del sistema	config	2026-05-26 06:26:42.402283
\.


--
-- Data for Name: personal; Type: TABLE DATA; Schema: public; Owner: hitdev
--

COPY public.personal (id, ci, complemento, exp_id, apellido_paterno, apellido_materno, apellido_casada, primer_nombre, segundo_nombre, tercer_nombre, fecha_nacimiento, profesion_id, telefono, biometrico_id, estado, fecha_baja) FROM stdin;
1	4041280	\N	2	ABASTO	ZURITA	\N	ROSARIO	GABRIELA	\N	1985-04-30	1	72463271	\N	ACTIVO	\N
2	3058921	\N	2	ACHOCALLA	CHAMBI	\N	JANET	PATRICIA	\N	1967-04-27	2	68338029	\N	ACTIVO	\N
3	5759577	\N	2	AGUILAR	FLORES	\N	JANNETH	\N	\N	1985-12-01	3	72302047	\N	ACTIVO	\N
4	2763368	\N	2	ALBINO	OCSA	\N	FILOMENO	\N	\N	1964-08-01	4	71842857	\N	ACTIVO	\N
5	3508739	\N	2	ALCOCER	PLAZA	\N	NORKA	MARGOT	\N	1972-12-13	5	71853674	\N	ACTIVO	\N
6	4044935	\N	2	ANCASI	LLANQUE 	\N	RAUL	\N	\N	1985-12-10	1	67717505	\N	ACTIVO	\N
7	7304630	\N	2	ANTEZANA	ZORRILLA	\N	CECILIA	PAMELA	\N	1988-11-22	6	70745529	\N	ACTIVO	\N
8	3511182	\N	2	APAZA	MONTECINOS	\N	VIRGINIA	\N	\N	1972-12-04	7	72321209	\N	ACTIVO	\N
9	2723630	\N	2	ARANCIBIA	BAPTISTA	\N	FREDDY	ERNESTO	\N	1967-10-22	8	71889029	\N	ACTIVO	\N
10	3119782	\N	2	ARAUCO	PARDO	\N	DANITZA	MAURA	\N	1971-01-29	7	72344993	\N	ACTIVO	\N
11	4045090	\N	2	ARCAYNE	VASQUEZ	\N	VERONICA	LILIAN	\N	1980-03-27	7	73807167	\N	ACTIVO	\N
12	3066735	\N	2	ARIAS	MORALES	\N	SUSY	ROXANA	\N	1964-08-11	3	72341266	\N	ACTIVO	\N
13	7262601	\N	2	ARIAS 	NARVAEZ	\N	ROMANEE	\N	\N	1987-08-29	9	76155505	\N	ACTIVO	\N
14	5730027	\N	2	AUCA	CANAVIRI	\N	AYDEE	JEANNETTE	\N	1985-01-12	3	72336524	\N	ACTIVO	\N
15	628669	\N	2	AYALA	MEDRANO	\N	FERNANDO	FRANZ	\N	1955-03-29	10	72475000	\N	ACTIVO	\N
16	4058129	\N	2	AYAVIRI	GUTIERREZ	\N	MONICA	ROSARIO	\N	1978-10-14	3	75708111	\N	ACTIVO	\N
17	3989148	\N	8	BALCAZAR	MUÑOZ	\N	DAYLER	\N	\N	1977-12-26	11	63638507	\N	ACTIVO	\N
18	3536475	\N	2	BARCO	MAMANI 	\N	NELLY	JENAETTE	\N	1973-03-21	3	61817414	\N	ACTIVO	\N
19	3095705	\N	2	BELLOT	VIILLARROEL	\N	WILLAM	PEDRO	\N	1967-06-04	12	71858292	\N	ACTIVO	\N
20	3119164	\N	2	BLANCO	SALAZAR	\N	ZENAIDA	\N	\N	1970-06-23	3	71847765	\N	ACTIVO	\N
21	2624380	\N	1	CALLISAYA	NINA	\N	ANGELICA	GENOVEVA	\N	1966-01-04	7	76138893	\N	ACTIVO	\N
22	3511754	\N	2	CAMACHO	QUIROGA	\N	MANUEL	EDUARDO	\N	1973-10-23	13	71885153	\N	ACTIVO	\N
24	1284849	\N	8	CAMARGO	RESAMANO	\N	MAXIMA	\N	\N	1953-05-11	14	72347843	\N	ACTIVO	\N
25	4020213	\N	2	CANAVIRI	ORTIZ	\N	VERONICA	CLAUDIA	\N	1979-10-19	15	72464248	\N	ACTIVO	\N
26	4021048	\N	2	CARRION	TICONA	\N	OLGA	\N	\N	1977-11-12	3	71850639	\N	ACTIVO	\N
27	4582494	\N	4	CASTRO	VIDAURRE	\N	ROXANA	XIMENA	\N	1976-03-20	16	77157780	\N	ACTIVO	\N
28	2053912	\N	1	CHAIN	BRITO	\N	MARIA	ISABEL	ASUNTA	1964-05-19	17	71881237	\N	ACTIVO	\N
29	671712	\N	2	CHOQUE	ARANCIBIA	\N	GUSTAVO	ANDRES	\N	1957-01-01	18	70424384	\N	ACTIVO	\N
30	4077013	\N	2	CHOQUE	CHUCA	\N	ERICKA	DORIS	\N	1983-07-03	10	72336625	\N	ACTIVO	\N
31	3543499	\N	2	CHOQUE	LOZADA	\N	CINTHYA	CORAL	\N	1978-04-12	1	72301471	\N	ACTIVO	\N
32	3558054	\N	2	CHOQUE	ROMERO	\N	OSCAR	\N	\N	1978-12-26	8	76142614	\N	ACTIVO	\N
33	3557508	\N	2	CHOQUECALLATA	MACHICADO	\N	RUBEN	\N	\N	1967-06-08	17	71588313	\N	ACTIVO	\N
34	3553645	\N	2	CHUNGARA	YUGAR	\N	MARIO	WALTER	\N	1980-08-03	19	74159909	\N	ACTIVO	\N
35	3533998	\N	2	COLQUE	CARDENAS	\N	JUAN	CARLOS	\N	1974-10-22	20	72462560	\N	ACTIVO	\N
36	3505943	\N	2	COLQUE	SANCHEZ	\N	BORWING	CELSO	\N	1975-05-10	12	71887777	\N	ACTIVO	\N
37	4039637	\N	2	COLQUE	YANA	\N	MARIELA	\N	\N	1980-02-17	7	67205819	\N	ACTIVO	\N
38	3536432	\N	2	CONDOR BOLIVIA	LIMA	\N	JACOB	\N	\N	1978-05-03	11	77140076	\N	ACTIVO	\N
39	3530745	\N	2	CONDORI	CABRERA	\N	FELIX	\N	\N	1971-01-24	21	73844684	\N	ACTIVO	\N
40	5554532	\N	8	CONDORI	DIEGO	\N	CARLOS	\N	\N	1981-11-04	22	72419470	\N	ACTIVO	\N
41	2775390	\N	2	CONDORI	GONZALES	\N	TORIBIA	\N	\N	1961-04-27	7	71187240	\N	ACTIVO	\N
42	4029093	\N	2	COSME	ORAQUINA	\N	FREDDY	\N	\N	1976-01-22	23	71888301	\N	ACTIVO	\N
43	5743789	\N	2	CUIZARA	AYZA	\N	PATRICIA	\N	\N	1985-08-26	24	72357387	\N	ACTIVO	\N
44	3502389	\N	2	DELGADILLO	ELIO	\N	HUGO	DAVID	\N	1972-11-25	13	76135177	\N	ACTIVO	\N
45	3113311	\N	2	DIVENSTY	VASQUEZ	\N	RAUL	OSWALDO	\N	1970-10-26	14	77149807	\N	ACTIVO	\N
46	3537271	\N	2	DURAN	RAMIREZ	\N	CARMEN	DRISLEY	\N	1977-06-04	8	76154671	\N	ACTIVO	\N
47	3048173	\N	2	ESCOBAR	ALARCON	\N	ANA	MARIA	\N	1961-01-01	25	76154274	\N	ACTIVO	\N
48	3113947	\N	2	ESTRADA	AGUIRRE	\N	JORGE	ANTONIO	\N	1971-04-04	17	71848233	\N	ACTIVO	\N
49	4023887	\N	2	EUGENIO	CHOQUETOPA	\N	NOLBERTO	SEVERO	\N	1977-11-06	26	72462462	\N	ACTIVO	\N
50	5119060	\N	8	FERNANDEZ	ARCE	\N	GENDRY	\N	\N	1978-05-23	15	73839697	\N	ACTIVO	\N
51	2791641	\N	2	FERNANDEZ	AYMA	\N	GREGORIO	BERNARDO	\N	1968-03-12	12	67201381	\N	ACTIVO	\N
52	3527897	\N	2	GARCIA	DUCHEN	\N	JENNY	MARGOT	\N	1969-03-27	14	61810676	\N	ACTIVO	\N
53	3551795	\N	2	GARCIA	MITMAN	\N	PATRICIA	XIMENA	\N	1977-06-04	1	72406051	\N	ACTIVO	\N
54	5734784	\N	2	GONZALES	PUQUIMIA	\N	PELAGIA	\N	\N	1978-10-12	7	72479999	\N	ACTIVO	\N
55	3558626	\N	2	HERRERA	OPORTO	\N	RUBEN	\N	\N	1978-06-06	7	72317327	\N	ACTIVO	\N
56	3103866	\N	2	JIMENEZ	RIOS	\N	SORAYA	PAOLA	\N	1968-09-27	1	63656228	\N	ACTIVO	\N
57	4070580	\N	2	LIMA	BERDEJA	\N	SANDRA	\N	\N	1985-12-03	27	72320444	\N	ACTIVO	\N
58	5770433	\N	2	LIMA	LADINO	\N	MARTHA	\N	\N	1971-02-09	7	70423094	\N	ACTIVO	\N
59	2795678	\N	2	MACEDO	MAMANI	\N	AURELIA	\N	\N	1961-09-25	3	73842005	\N	ACTIVO	\N
60	3686508	\N	8	MALDONADO	CASTRO	\N	JOSE	LUIS	\N	1968-07-20	10	72306194	\N	ACTIVO	\N
61	3627922	\N	\N	MALDONADO	ORTUSTE	\N	JOSE	LUIS	\N	1972-10-06	26	73160731	\N	ACTIVO	\N
62	5756613	\N	2	MANCILLA	GUTIERREZ	\N	ROLANDO	SERGIO	\N	1984-06-02	28	73809574	\N	ACTIVO	\N
63	4054824	\N	2	MAMANI	FERNANDEZ	\N	ROXANA	\N	\N	\N	29	71462622	\N	ACTIVO	\N
64	7304264	\N	2	MAMANI	LUCANA	\N	MARIA	ELENA	\N	1985-08-30	3	67538926	\N	ACTIVO	\N
65	3096150	\N	2	MARTINEZ	IGNACIO	\N	CILDA	JULIA	\N	1953-08-17	21	71107575	\N	ACTIVO	\N
66	3524786	\N	2	MEDINA	HERVAS	\N	ALEX	SANDRO	\N	1975-06-29	12	72479977	\N	ACTIVO	\N
67	3693765	\N	8	MENCHACA	CHARUCSI	\N	NERY	\N	\N	1967-05-26	1	61839369	\N	ACTIVO	\N
68	3008246	\N	3	MENDOZA	REVOLLO	\N	JUAN	CARLOS	\N	1962-01-27	17	70410566	\N	ACTIVO	\N
69	4051917	\N	2	MIRANDA 	COLQUE	\N	IRMA	\N	\N	1979-12-10	7	60400104	\N	ACTIVO	\N
70	4065444	\N	2	MIRANDA 	GUARAYO	\N	ESTHER	\N	\N	1972-12-03	5	60432449	\N	ACTIVO	\N
71	3100068	\N	2	MONTAÑO	GARCIA	\N	ROSARIO	LUISA	\N	1966-08-25	3	72499079	\N	ACTIVO	\N
72	3111381/1P	\N	2	NOYA	MURGUIA	\N	JOSE	LUIS	\N	1973-06-19	12	72479292	\N	ACTIVO	\N
73	3554600	\N	2	OCAÑA 	OTALORA	\N	SILVIA	VERONICA	\N	1980-01-14	30	68331630	\N	ACTIVO	\N
74	3544753	\N	2	PACHECO	VIA	\N	GERALD	LUIS	\N	1977-06-26	31	73760029	\N	ACTIVO	\N
75	3555410	\N	2	PACO	VASQUEZ	\N	MARIELA	HEIDI	\N	1978-12-23	17	77155843	\N	ACTIVO	\N
76	7294833	\N	2	PALLY	RIVERO	\N	JUDITH	OLGA	\N	1988-09-14	14	62834743	\N	ACTIVO	\N
77	2792244	\N	2	PAREDES	CHOQUE	\N	MARIA	MAGDA	\N	1965-07-22	7	72346661	\N	ACTIVO	\N
78	4039571	\N	2	PARRA	MARZA	\N	HORTENCIA	\N	\N	2644-08-25	3	71856382	\N	ACTIVO	\N
79	4062995	\N	2	PEÑARRIETA	LIMA	\N	PATRICIA	LOURDES	\N	1982-07-29	32	70421732	\N	ACTIVO	\N
80	3559000	\N	2	QUILO	ALVAREZ	\N	ODALIS	PATRICIA	\N	1980-03-17	26	67221897	\N	ACTIVO	\N
81	3545398	\N	2	QUISPE	BAPTISTA	\N	GEOVANA	\N	\N	1973-08-27	7	72351197	\N	ACTIVO	\N
82	7392008	\N	2	QUISPE	RAMOS	\N	DANEB	WILLY	\N	1992-12-25	33	75703198	\N	ACTIVO	\N
83	3544591	\N	2	QUISPE	SALAZAR	\N	CRUZ	CAY	\N	1975-08-18	3	72326087	\N	ACTIVO	\N
84	3119247	\N	2	QUISPER	APAZA	\N	ROSEMERY	OLGA	\N	1971-05-29	7	65432606	\N	ACTIVO	\N
85	3538782	\N	2	RAMOS  	BENITO	\N	ROSE	MARY	\N	1974-09-14	7	72357697	\N	ACTIVO	\N
86	6561878	\N	8	RAMOS  	ZURITA	\N	MARTHA	CHARITO	\N	1984-10-12	3	67232256	\N	ACTIVO	\N
87	5065488	\N	2	REYNAGA	AGRADA	\N	MARCELA	DANIELA	\N	1988-04-29	10	65407079	\N	ACTIVO	\N
88	5071198	\N	2	ROCHA	CRESPO	\N	VLADIMIR	MARIO	\N	1976-11-24	10	72411133	\N	ACTIVO	\N
89	3071753	\N	2	RODRIGUEZ	ABASTO	\N	JULIO	CESAR	\N	1966-07-01	9	67217801	\N	ACTIVO	\N
90	2789414	\N	2	RODRIGUEZ	ALCONZ	\N	EFRAIN	\N	\N	1964-06-19	23	72327352	\N	ACTIVO	\N
91	3099836	\N	2	RODRIGUEZ	ALEJANDRO	\N	LOURDES	CAMILA	\N	1963-07-15	3	72453806	\N	ACTIVO	\N
92	3558303	\N	2	RODRIGUEZ	CORDERO	\N	MONICA	GEOVANNA	\N	1079-07-05	15	77144166	\N	ACTIVO	\N
93	3518340	\N	2	RODRIGUEZ	RAMIREZ	\N	ROSARIO	SILVIA	\N	1973-05-07	3	72309348	\N	ACTIVO	\N
94	3504500	\N	2	ROMERO 	CONDORI	\N	DANIEL	\N	\N	1072-04-10	9	71101683	\N	ACTIVO	\N
95	4051238	\N	2	ROSALES	RODRIGUEZ	\N	MARCELA	INGRID	\N	1981-02-06	9	69887741	\N	ACTIVO	\N
96	3111708	\N	2	SALAS	RICALDI	\N	BEATRIZ	MELVA	\N	1970-08-09	32	60424006	\N	ACTIVO	\N
97	3713175	\N	8	SALVATIERRA	BAUTISTA	\N	VIRGINIA	\N	\N	1973-06-04	3	71856739	\N	ACTIVO	\N
98	3510204	\N	2	SILES	MANCILLA	\N	EDGAR	ANDRES	\N	1978-07-21	13	72459997	\N	ACTIVO	\N
99	3098563	\N	\N	TAPIA	ALA	\N	HENRY	GABRIEL	\N	1967-01-15	12	72498855	\N	ACTIVO	\N
100	4037112	\N	2	TAPIA	BENITO	\N	ALDO	ALEX	\N	\N	13	72490292	\N	ACTIVO	\N
101	3119368	\N	2	VASQUEZ	CALDERON	\N	MARITZA	PAULA	\N	1970-04-02	7	71887556	\N	ACTIVO	\N
102	3091064	\N	2	VILCAEZ	CARRASCO	\N	DILMA	EUSEBIA	\N	1963-08-14	7	72309114	\N	ACTIVO	\N
103	5738212	\N	2	VILLCA	LAMAS	\N	HILDA	RAFAELA	\N	1971-05-04	1	71883388	\N	ACTIVO	\N
104	5067810	\N	2	VILLCA	MAMANI	\N	GLADYS	\N	\N	1980-09-17	3	73849924	\N	ACTIVO	\N
105	3546588	\N	3	VILLEGAS	PRADO	\N	MARY	ISABEL	\N	1950-01-01	3	72310368	\N	ACTIVO	\N
106	4040248	\N	2	YUCRA	CANO	\N	MIRIAM	ROXANA	\N	1975-04-18	7	73819532	\N	ACTIVO	\N
107	4047424	\N	2	YUCRA	CHOQUE	\N	MARISOL	\N	\N	1978-10-15	3	75880375	\N	ACTIVO	\N
108	4077081	\N	2	YUCRA	FLORES	\N	GRACIELA	\N	\N	1984-08-10	15	71852954	\N	ACTIVO	\N
109	3541053	\N	2	YUCRA	LOPEZ	\N	ROSA	\N	\N	1974-08-21	3	72315115	\N	ACTIVO	\N
110	3525864	\N	2	ACOSTA	RUIZ	\N	SANDRA	MABEL	\N	1973-09-07	3	73842832	\N	ACTIVO	\N
111	4069075	\N	2	AGUILAR	TOLA	\N	SILVIA	\N	\N	1989-05-09	34	69603819	\N	ACTIVO	\N
112	7303214	\N	2	APAZA	MAMANI	\N	IVANA	NEYSA	\N	1989-08-03	10	73841224	\N	ACTIVO	\N
113	3093704	\N	2	ARENAS	TERRAZAS	\N	BRIGIDA	ROXANA	\N	1969-10-08	14	63643749	\N	ACTIVO	\N
114	7261279	\N	2	AVILA	MENDIETA	\N	DANIEL	\N	\N	1988-07-14	35	60401878	\N	ACTIVO	\N
115	7452191	\N	\N	BELTRAN	POZO	\N	LOLA	\N	\N	1996-11-15	34	60413964	\N	ACTIVO	\N
116	5764295	\N	2	BLACUTT	ROCHA	\N	FRANZ	CRISTIAN	\N	1988-08-24	36	72470655	\N	ACTIVO	\N
117	5746616	\N	2	CASTRO	GUARAYO	\N	JENNY	\N	\N	1986-12-25	11	61844076	\N	ACTIVO	\N
118	4057830	\N	2	CHALLAPA	BARRIOS	\N	CHRISTIAN	RONALD	\N	1983-06-22	13	72473004	\N	ACTIVO	\N
119	5748623	\N	2	CENTELLAS	AJATA	\N	MARISABEL	\N	\N	1985-09-08	7	73816844	\N	ACTIVO	\N
120	3510115	\N	2	DURAN	CALSINA	\N	EDWIN	APOLINAR	\N	1970-07-16	34	71850654	\N	ACTIVO	\N
121	5748668	\N	2	FACIO	ORIHUELA	\N	VIRGINIA	\N	\N	1985-05-21	7	72353778	\N	ACTIVO	\N
122	5748710	\N	2	FERNANDEZ	FIGUEREDO	\N	JOSE	CARLOS	\N	1987-09-18	37	65426456	\N	ACTIVO	\N
123	5068645	\N	2	FLORES	COLLARANA	\N	DAYSI	\N	\N	1979-07-19	7	72484371	\N	ACTIVO	\N
124	7266965	\N	2	GUZMAN	MOLINA	\N	PAMELA	IBLIN	\N	1988-04-18	12	73561888	\N	ACTIVO	\N
125	3096037	\N	2	IBARRA	MAMANI	\N	NANCY	LOURDES	\N	1963-07-04	14	79418398	\N	ACTIVO	\N
126	4053756	\N	2	IQUIZA	BENITEZ	\N	PAOLA	IRENE	\N	1979-10-20	38	754235668	\N	ACTIVO	\N
127	5762414	\N	2	JAMACHI	GUZMAN	\N	SILVIA	EUGENIA	\N	1884-12-01	3	72350670	\N	ACTIVO	\N
128	5742527	\N	2	LOPEZ	FLORES	\N	ISRAEL	GERSON	\N	1986-08-21	13	72484239	\N	ACTIVO	\N
129	7291586	\N	2	LUIZAGA	GOMEZ	\N	CECILIA	ISABEL	\N	1993-11-17	39	62977116	\N	ACTIVO	\N
130	5771565	\N	2	MAMANI	MAGNE	\N	WALTER	\N	\N	1991-09-04	34	73805693	\N	ACTIVO	\N
131	6477224	\N	\N	MAMANI	MAMANI	\N	DANIEL	\N	\N	1986-12-20	40	69591998	\N	ACTIVO	\N
132	5728930	\N	2	MARCHANT	RAMIREZ 	\N	LORENA	\N	\N	2288-09-28	41	76141919	\N	ACTIVO	\N
133	1913928	\N	\N	MEDRANO	SERRATE	\N	GARRY	ALEXANDER	\N	1974-05-21	42	70533599	\N	ACTIVO	\N
134	7319837	\N	2	NEGRON	CHOQUETICLLA	\N	JOSE	ARMANDO	\N	1995-06-10	12	61660228	\N	ACTIVO	\N
135	3548339	\N	2	OCAÑA	APAZA	\N	EFRAIN	\N	\N	1977-10-10	28	71106597	\N	ACTIVO	\N
136	3118528	\N	2	PACHECO	PEREZ	\N	FRANZ	WILLAMS	\N	1970-11-15	43	71851031	\N	ACTIVO	\N
137	9213679	\N	1	RONDO 	APAZA	\N	CESIA	KEREN	\N	1999-05-02	34	72312193	\N	ACTIVO	\N
138	5060612	\N	2	TORRICO	ROCHA	\N	KATHIA	\N	\N	1983-11-09	17	79403997	\N	ACTIVO	\N
139	7287100	\N	2	VALERO 	SOTO	\N	ALEXANDER	\N	\N	1991-09-04	8	72311885	\N	ACTIVO	\N
140	3540846	\N	2	VALVERDE	JORGE	\N	JOSE	MARIA	\N	1975-09-14	44	64416731	\N	ACTIVO	\N
141	5763422	\N	2	VILLARROEL	ROJAS	\N	ARELY	\N	\N	1987-04-16	39	74144690	\N	ACTIVO	\N
142	5772242	\N	2	AQUINO	CHOQUE	\N	ANA	LAURA	\N	1991-02-19	9	73820030	\N	ACTIVO	\N
143	7329638	\N	2	BERBETTY	GONGORA	\N	STEPHANIE	\N	\N	1996-07-05	9	75700982	\N	ACTIVO	\N
144	3545600	\N	2	BERNAL	HUANCA	\N	KARINA	\N	\N	1987-03-09	9	74152444	\N	ACTIVO	\N
145	7297350	\N	2	HERRERA	MAMANI	\N	HELEN	NICKELE	\N	2024-03-09	9	75713914	\N	ACTIVO	\N
146	7318425	\N	2	MIRANDA	DIAZ	\N	LILIANA	LAURA	\N	1995-07-15	9	69599999	\N	ACTIVO	\N
147	12677857	\N	2	RODRIGUEZ	PINTO	\N	LESLY	JANNET	\N	1998-08-21	9	76148782	\N	ACTIVO	\N
148	7426998	\N	2	ZORRILLA	SALVATIERRA	\N	PAMELA	ANEL	\N	1994-09-23	9	68316069	\N	ACTIVO	\N
149	4059599	\N	\N	ESCALERA	COLQUE	\N	EMILY	EVELYN	\N	1996-06-25	9	70412596	\N	ACTIVO	\N
150	5769241	\N	\N	FORONDA	ZULETA	\N	SERGIO	DAVID	\N	1988-11-04	9	72482971	\N	ACTIVO	\N
151	14078903	\N	\N	MENDEZ	MEDINA	\N	JUAN	PABLO	\N	1987-08-08	9	61815181	\N	ACTIVO	\N
152	7331102	\N	\N	MEZA	RUIZ	\N	CATHERINE	ANDREA	\N	1995-03-17	9	79405148	\N	ACTIVO	\N
153	7336752	\N	\N	MONTAÑO	DURAN	\N	PABLO	ANDRE	\N	1994-08-23	9	60430115	\N	ACTIVO	\N
154	7336759	\N	\N	REQUENA	UREÑA	\N	MARCELO	DIEGO	\N	1992-12-27	9	72300055	\N	ACTIVO	\N
155	7455009	\N	\N	SANCHEZ	ESCALERA	\N	MARIEL	NANCY	\N	1993-12-08	9	63653638	\N	ACTIVO	\N
156	7270795	\N	\N	TORREZ	VARGAS	\N	LUIS	MIGUEL	RODRIGO	1989-10-03	9	76153908	\N	ACTIVO	\N
157	5727301	\N	\N	TRIBEÑO	GUERRERO	\N	LUIS	ALEJANDRO	\N	1985-03-19	9	73840177\r\n76136831	\N	ACTIVO	\N
158	74000015	\N	\N	ZENTENO	ROSSELL	\N	JANINA	GAHEL	\N	1995-08-17	9	74119877	\N	ACTIVO	\N
159	5749760	\N	2	ACHACOLLO	MARTINEZ	\N	LOURDES	\N	\N	1985-10-11	7	78607773	\N	ACTIVO	\N
160	7287813	\N	2	ADRIAN	MAMANI	\N	GEOVANNA	\N	\N	1991-06-24	7	67221627	\N	ACTIVO	\N
161	4058321	\N	2	AGUILAR	CALLE	\N	CAROLAY	MELVINA	\N	1982-11-10	38	60426619	\N	ACTIVO	\N
162	3070786	\N	2	ALEJANDRO	CHOQUE	\N	SINFOROSA	\N	\N	1978-11-06	46	68599998	\N	ACTIVO	\N
163	7338561	\N	2	ALMANZA	RAMIREZ	\N	ALEX	ALEJANDRO	\N	1989-01-24	38	76150580	\N	ACTIVO	\N
164	4065840	\N	2	APAZA	BAPTISTA	\N	FELICIA	\N	\N	1979-01-07	7	72351815	\N	ACTIVO	\N
165	7289935	\N	2	APAZA 	RIOS	\N	CARLA	JAQUELINE	\N	1992-07-08	10	77156064	\N	ACTIVO	\N
166	5069077	\N	2	AQUINO 	QUILO	\N	MILENKA	ANEMI	\N	1981-07-20	46	76135372	\N	ACTIVO	\N
167	73934691	\N	2	BARRIOS	MAMANI	\N	JADBER	DANIEL	\N	2006-04-12	46	62761328	\N	ACTIVO	\N
168	7269199	\N	2	BAZAN	AYAVIRI	\N	JIMENA	\N	\N	1990-09-25	47	72495623	\N	ACTIVO	\N
169	7267245	\N	2	BLACUT	BERNABE	\N	MABEL	CRISTINA	\N	1989-05-05	7	72308618	\N	ACTIVO	\N
170	7414949	\N	2	BLANCO	CHAMBI	\N	HOSELINE	ROSSIO	\N	1993-04-02	7	67222800	\N	ACTIVO	\N
171	4056624	\N	2	BLANCO	CONDORI 	\N	JUAN	JOSE	\N	1982-09-29	11	64150666	\N	ACTIVO	\N
172	5771122	\N	2	BLANCO	MAMANI	\N	GABRIELA	\N	\N	1985-11-12	7	68321555	\N	ACTIVO	\N
173	3521362	\N	2	BURGOA	PEREZ	\N	JENNY	\N	\N	1976-03-13	46	74475767	\N	ACTIVO	\N
174	5728339	\N	2	CAMARA	SAAVEDRA	\N	HELMUT	ARIEL	\N	1983-10-04	46	73838436	\N	ACTIVO	\N
175	7312997	\N	2	CALCINA	\N	\N	ANGELICA	\N	\N	1989-06-17	47	77147450	\N	ACTIVO	\N
176	5775052	\N	2	CALLE	MOLLER	\N	BERONICA	\N	\N	1987-11-01	7	72354206	\N	ACTIVO	\N
177	5774376	\N	2	CHAVEZ	MONTAN 	\N	KARINA	MABEL	\N	1988-03-04	7	75424809	\N	ACTIVO	\N
178	10928438	\N	2	CHOQUE	CHAMBI	\N	GABY	\N	\N	1992-11-06	48	65542665	\N	ACTIVO	\N
179	7296784	\N	2	CHOQUE	HUAYLLAS	\N	PAOLA	FERNANDA	\N	1989-03-21	7	77144525	\N	ACTIVO	\N
180	5771541	\N	2	CHOQUE 	MACHICADO	\N	DANIELA	\N	\N	1987-08-31	46	75401972	\N	ACTIVO	\N
181	7336795	\N	2	CHOQUE 	ZARATE	\N	CELIA	\N	\N	1989-11-05	38	65409929	\N	ACTIVO	\N
182	7425434	\N	2	COAQUIRA	LOPEZ	\N	NORMA	\N	\N	1995-01-02	7	68296998	\N	ACTIVO	\N
183	7313706	\N	2	CONDORI	MARTINEZ	\N	NAHIR	MONICA	\N	1999-10-25	32	72311772	\N	ACTIVO	\N
184	5739635	\N	2	CUEVAS	CANQUI	\N	JULIA	\N	\N	1982-04-12	7	75708865	\N	ACTIVO	\N
185	3518940	\N	2	ESPINOZA	MAIZMAN	\N	ROSARIO	DEL 	PILAR	1973-03-05	7	72351206	\N	ACTIVO	\N
186	6945343	\N	2	ESPINOZA	MENDOZA	\N	PERCY	\N	\N	\N	7	62473973	\N	ACTIVO	\N
187	7314228	\N	2	ESPINOZA	RIOS	\N	CELINDA	\N	\N	1998-05-22	7	71858488	\N	ACTIVO	\N
188	7388998	\N	2	FERNANDEZ	TORREZ	\N	EDILSON	\N	\N	2002-08-03	46	74914778	\N	ACTIVO	\N
189	7289169	\N	2	FLORES	FLORES	\N	EDWIN	ELMER	\N	1988-09-29	44	63656968	\N	ACTIVO	\N
190	7264919	\N	2	GARCIA	ZEBALLOS	\N	BORIS	\N	\N	1981-08-28	46	60421656	\N	ACTIVO	\N
191	3557184	\N	2	GORDILLO	BAZAN	\N	ABSAEL	MARCELO	\N	1979-01-02	10	69619694	\N	ACTIVO	\N
192	7337834	\N	2	GOMEZ	GAMBOA	\N	STEYCY	KAREN	\N	1990-09-19	36	72325415	\N	ACTIVO	\N
193	7263159	\N	2	HUANACO	CHOQUE	\N	PAOLA	ROXANA	\N	1990-04-29	49	68331698	\N	ACTIVO	\N
194	5764961	\N	2	HUACARA	APAZA	\N	ANGELINA	\N	\N	1984-04-12	46	75705721	\N	ACTIVO	\N
195	7260322	\N	2	HUAYLLANI	VELIZ	\N	VERONICA	\N	\N	1988-01-13	38	74141217	\N	ACTIVO	\N
196	4079258	\N	2	HUAYTA 	CHOQUE	\N	LIDIA	\N	\N	1972-12-04	46	73835592	\N	ACTIVO	\N
197	7350597	\N	2	HUAYTA 	MAMANI	\N	RONALD	\N	\N	2000-09-06	38	75416541	\N	ACTIVO	\N
198	7318463	\N	2	LIMA	ANCACHI	\N	ZULEMA	\N	\N	1995-10-22	7	67250843	\N	ACTIVO	\N
199	4054160	\N	2	LIMA	MAURICIO	\N	CRISTINA	\N	\N	1978-06-15	38	73812280	\N	ACTIVO	\N
200	5764393	\N	2	LOPEZ	MENDOZA	\N	DIONICIO	\N	\N	1986-10-09	7	68315552	\N	ACTIVO	\N
201	5737224	\N	2	LOPEZ	ARAOZ	\N	PAOLA	AMPARO	\N	1991-06-03	32	75425129	\N	ACTIVO	\N
202	5757550	\N	2	MACHACA	CARO	\N	SABINA	\N	\N	1985-06-06	7	71846210	\N	ACTIVO	\N
204	7290066	\N	2	MAMANI	APAZA	\N	SILVIA	\N	\N	1996-09-14	46	77145334	\N	ACTIVO	\N
205	12901784	\N	2	MAMANI	HERRERA	\N	JANNETH	ROSARIO	\N	1999-01-06	50	67253435	\N	ACTIVO	\N
206	7342728	\N	2	MAMANI	HUARITA	\N	ROXANA	\N	\N	1993-10-11	7	72460446	\N	ACTIVO	\N
207	7390538	\N	2	MAMANI	QUENA	\N	JOSEFINA	\N	\N	1993-12-31	14	71188840	\N	ACTIVO	\N
208	7262334	\N	2	MARTINEZ	CHOQUE	\N	ELIZABETH	\N	\N	1987-08-17	7	65403487	\N	ACTIVO	\N
209	5737452	\N	2	MARTINEZ	GUAYGUA	\N	MIRIAM	ELIZABETH	\N	1991-03-27	8	67206636	\N	ACTIVO	\N
210	7286845	\N	2	MENDOZA	CRUZ	\N	LIZA	LAURA	\N	1989-04-23	38	77152163	\N	ACTIVO	\N
211	5069217	\N	2	MEJIA	MAMANI	\N	ALICIA	MARISOL	\N	1982-03-20	38	70414235	\N	ACTIVO	\N
212	5748005	\N	2	MIRANDA	HUANCA	\N	ANA MARIA	\N	\N	1986-04-25	38	72305298	\N	ACTIVO	\N
213	4041615	\N	2	PACHECO	GONZALES	\N	DANIEL	\N	\N	1978-10-05	8	73829873	\N	ACTIVO	\N
214	5746683	\N	2	PAYLLO	VIRACOCHEA	\N	ROXANA	\N	\N	1985-05-30	7	68338688	\N	ACTIVO	\N
215	5733961	\N	2	PAZ	ARAMAYO	VDA DE CORDOVA	ALIDA	KATHYA	\N	1982-11-25	51	61819214	\N	ACTIVO	\N
216	7337629	\N	2	QUELCA	MAMANI	\N	JHANETH	MAGALY	\N	1991-07-28	7	73840904	\N	ACTIVO	\N
217	8645115	\N	2	RAFAEL	COLQUE	\N	BLENDA	ISABEL	\N	1994-12-18	7	73847870	\N	ACTIVO	\N
218	7323973	\N	2	RAMIREZ	CHOQUE	\N	LOURDES	MAGALY	\N	2535-03-04	7	72331923	\N	ACTIVO	\N
219	7285097	\N	2	RAMOS	CHOQUE	\N	MARIBEL	JHANET	\N	1991-12-02	7	69597227	\N	ACTIVO	\N
220	5763340	\N	2	REVOLLO	MURIEL	\N	ROBY	\N	\N	1980-02-16	44	73823743	\N	ACTIVO	\N
221	7273327	\N	2	RIOS	CHAMBI	\N	DANITZA	MAYRA	\N	1992-12-14	12	71859123	\N	ACTIVO	\N
222	7352745	\N	2	ROJAS	PEREZ	\N	VERONICA	\N	\N	2000-08-10	46	75703869	\N	ACTIVO	\N
223	5529528	\N	2	ROQUE 	MAMANI	\N	RENE	\N	\N	1982-04-20	38	71183758	\N	ACTIVO	\N
224	2763201	\N	2	ROCHA	RAMOS	\N	ESTEBAN	FRANCISCO	\N	1962-12-26	44	74322517	\N	ACTIVO	\N
225	7286925	\N	2	ROMERO	VASQUEZ	\N	NELLY	DEL 	ROSARIO	1989-10-11	52	75412638	\N	ACTIVO	\N
226	7357565	\N	2	ROQUE 	TACURI	\N	WILLIAMS	\N	\N	1996-12-23	53	60427138	\N	ACTIVO	\N
227	7268990	\N	2	SANCHEZ	CHOQUE	\N	KARLA	DAYSI	\N	1988-06-16	7	74153818	\N	ACTIVO	\N
228	7260347	\N	2	SILVA	ALTAMIRANO	\N	HUGO	RODRIGO	\N	1989-01-04	44	63667973	\N	ACTIVO	\N
229	5758215	\N	2	SOZA	BRACAMONTE	\N	MARLEN	PAULA	\N	1986-06-02	46	72331779	\N	ACTIVO	\N
230	3114603	\N	2	TANGARA	ALONZO	\N	ELENA	LEOPOLDA	\N	1967-11-15	38	74106658	\N	ACTIVO	\N
231	7348898	\N	2	TAPIA	DOMINGUEZ	\N	CARLOS	DAMIAN	\N	1992-05-07	47	69586895	\N	ACTIVO	\N
232	9381930	\N	2	TICONA	CHURQUI	\N	GRISELDA	LIDIA	\N	2002-09-03	38	64760572	\N	ACTIVO	\N
233	4066268	\N	2	TOLA	COPA 	\N	LUCIA	BERTA	\N	2644-08-27	7	74127213	\N	ACTIVO	\N
234	4051324	\N	2	TORREZ	MARTINEZ 	\N	VERONICA	\N	\N	1981-03-20	38	68281942	\N	ACTIVO	\N
235	7333578	\N	2	VEIZAN	VARGAS	\N	CESIA	JHAMIN	\N	1996-04-23	7	65417444	\N	ACTIVO	\N
236	5744082	\N	2	VICENTE	MAMANI	\N	MARCO	\N	\N	1984-04-11	44	74125505	\N	ACTIVO	\N
238	7353096	\N	2	YAVI	YAVI	\N	DANIELA	CARMEN	\N	1992-10-06	7	68320169	\N	ACTIVO	\N
239	72732620	\N	2	ZUBIETA	HUAYLLA 	\N	ALEJANDRA	\N	\N	2003-04-17	49	72307407	\N	ACTIVO	\N
240	5731768	\N	2	BAPTISTA	ESCOBAR	\N	MIRNA	NIDYA	\N	1985-08-03	7	68284505	\N	ACTIVO	\N
241	7275869	\N	2	MAMANI	NINA	\N	RUBI	FABIOLA	\N	1993-01-21	7	67233051	\N	ACTIVO	\N
242	5774771	O	2	PACO	MENESES	\N	CLAUDIA	ZUMAY	\N	\N	54	72490929	\N	ACTIVO	\N
243	7306862	\N	2	PEREYRA	SEQUEIROS	\N	DIANE	PAMELA	\N	1990-06-02	55	75705400	\N	ACTIVO	\N
244	7414112	\N	2	POMA 	COTAÑA	\N	JHOSELYN	\N	\N	1994-05-06	7	78613294	\N	ACTIVO	\N
245	7353503	\N	2	SOLANO 	SANCHEZ	\N	WENDY	BRENDA	\N	1995-08-22	7	70413684	\N	ACTIVO	\N
246	7281259	\N	2	ZEBALLOS	CHOCAMANI	\N	DIONICIA	\N	\N	1989-03-24	54	73824897	\N	ACTIVO	\N
\.


--
-- Data for Name: rol_permisos; Type: TABLE DATA; Schema: public; Owner: hitdev
--

COPY public.rol_permisos (rol_id, permiso_id) FROM stdin;
1	1
1	2
1	3
1	4
1	5
1	6
1	7
1	8
1	9
1	10
2	1
2	2
2	3
2	4
2	5
2	6
3	1
3	4
3	5
4	1
4	4
4	5
5	1
5	5
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: hitdev
--

COPY public.roles (id, nombre, descripcion, created_at) FROM stdin;
1	ADMIN	Administrador del sistema - acceso total	2026-05-26 06:26:39.957281
2	SECRETARIO	Secretaría - registra y deriva correspondencia	2026-05-26 06:26:40.135898
3	DIRECTOR	Director del hospital	2026-05-26 06:26:40.309281
4	JEFE_RRHH	Jefe de Recursos Humanos	2026-05-26 06:26:40.483569
5	AUXILIAR	Auxiliar de oficina	2026-05-26 06:26:40.657748
\.


--
-- Data for Name: secuencia_hr; Type: TABLE DATA; Schema: public; Owner: hitdev
--

COPY public.secuencia_hr (gestion, ultimo_numero) FROM stdin;
\.


--
-- Data for Name: usuario_roles; Type: TABLE DATA; Schema: public; Owner: hitdev
--

COPY public.usuario_roles (usuario_id, rol_id) FROM stdin;
1	1
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: hitdev
--

COPY public.usuarios (id, personal_id, username, password_hash, password_cambiado, google_id, email, activo, ultimo_acceso, created_at, updated_at) FROM stdin;
1	\N	admin	$2b$10$12jdNO9Ak3yl6wL0WN5NdOoeff8hThM.4VPTGB2f0OViADnU1x90y	t	\N	admin@hospital.gob.bo	t	2026-05-26 16:28:45.795564	2026-05-26 06:26:50.92285	2026-05-26 06:28:27.336834
\.


--
-- Data for Name: vinculos_laborales; Type: TABLE DATA; Schema: public; Owner: hitdev
--

COPY public.vinculos_laborales (id, personal_id, establecimiento_id, tipo_personal_id, fuente_financiamiento_id, identificador_laboral, unidad_servicio, cargo_actual, carga_horaria, fecha_ingreso, fecha_institucionalizacion, observaciones, cargo_planilla, cargo_escala, nro_resumen_ejecutivo, unidad_servicio_id, fecha_fin_contrato) FROM stdin;
1	1	1	1	2	42004	\N	BIOQUIMICO	MT	2013-12-02	2013-12-02	\N	BIOQUIMICO	BIOQUIMICO	8	\N	\N
2	2	1	1	1	9461	\N	BIOTECNOLOGA	TC	2002-06-01	\N	\N	AUXILIAR DE ENFERMERIA	AUXILIAR DE ENFERMERIA	14	\N	\N
3	3	1	1	1	9244	\N	AUXILIAR DE ENFERMERIA	TC	2014-01-02	2014-04-10	\N	AUXILIAR DE ENFERMERIA	AUXILIAR DE ENFERMERIA	14	\N	\N
4	4	1	1	1	75159	\N	ADMINISTRADOR	TC	2018-08-01	2018-08-01	\N	AUXILIAR DE OFICINA	TRABAJADOR. MANUAL II	36	\N	\N
5	5	1	1	1	74605	\N	TECNICO EN LABORATORIO	TC	2007-09-14	1999-01-01	\N	AUXILIAR LABORATORIO	AUXILIAR LABORATORIO	14	\N	\N
6	6	1	1	1	74941	\N	BIOQUIMICO FARMACEUTICO	TC	2014-10-22	\N	\N	ODONTOLOGO	BIOQUIMICO	7	\N	\N
7	7	1	1	1	75108	\N	TRABAJADORA SOCIAL	TC	2014-11-16	\N	\N	LICENCIADA EN ENFERMERIA	TRABAJADORA SOCIAL	9	\N	\N
8	8	1	1	1	15088	\N	LICENCIADA EN ENFERMERIA	TC	2008-07-23	\N	\N	ENFERMERA GRADUADA	ENFERMERA GRADUADA	10	\N	\N
9	9	1	1	1	74563	\N	MEDICO INTERNISTA                  	TC	2007-02-01	\N	\N	MEDICO ESPECIALISTA.	MEDICO	3	\N	\N
10	10	1	1	1	25678	\N	JEFA DE ENFERMERAS	TC	2000-04-01	2002-07-29	\N	ENFERMERA GRADUADA	ENFERMERA GRADUADA	10	\N	\N
11	11	1	1	1	54018	\N	LICENCIADA EN ENFERMERIA	TC	2011-06-07	2011-06-07	\N	LICENCIADA EN ENFERMERIA	LICENCIADA EN ENFERMERIA	9	\N	\N
12	12	1	1	1	25691	\N	AUXILIAR DE ENFERMERIA	TC	1998-09-01	\N	\N	AUXILIAR DE ENFERMERIA	AUXILIAR DE ENFERMERIA	14	\N	\N
13	13	1	1	1	64107	\N	MEDICO DE PLANTA	MT	2017-08-01	\N	\N	MEDICO M/T	MEDEDICO M/T ESPECIALISTA	2	\N	\N
14	14	1	1	1	74610	\N	AUXILIAR. DE ENFERMERIA	TC	2012-03-01	\N	\N	AUXILIAR DE ENFERMERIA	AUXILIAR DE ENFERMERIA	14	\N	\N
15	15	1	1	1	9144	\N	PEDIATRA	TC	1997-10-06	\N	\N	MEDICO ESPECIALISTA	MEDICO ESPECIALISTA	3	\N	\N
16	16	1	1	1	9535	\N	AUXILIAR DE ENFERMERIA	TC	2008-03-17	\N	\N	AUXILIAR DE ENFERMERIA	AUXILIAR DE ENFERMERIA	14	\N	\N
17	17	1	1	1	74867	\N	MEDICO ANESTESIOLOGO	TC	2018-01-02	2020-07-02	\N	MEDICO ESPECIALISTA	MEDICO ESPECIALISTA	3	\N	\N
18	18	1	1	1	9429	\N	AUXILIAR DE ENFERMERIA	TC	1995-07-14	\N	\N	AUXILIAR DE ENFERMERIA	AUXILIAR DE ENFERMERIA	14	\N	\N
19	19	1	1	1	9420	\N	MEDICO TRANSFUCIONISTA	TC	1999-04-01	\N	\N	JEFE MEDICO	MEDICO	1	\N	\N
20	20	1	1	1	64022	\N	AUXILIAR DE ENFERMERIA	TC	2004-02-01	\N	\N	AUXILIAR DE ENFERMERIA	AUXILIAR DE ENFERMERIA	14	\N	\N
21	21	1	1	\N	4040	\N	LICENCIADA EN ENFERMERIA	TC	2006-07-02	2006-06-01	\N	LICENCIADA EN ENFERMERIA	LICENCIADA EN ENFERMERIA	9	\N	\N
22	22	1	1	1	42001	\N	CIRUGIA GENERAL	MT	2006-06-06	2009-02-02	\N	MEDICO M/T II	MEDICO M/T II	4	\N	\N
23	24	1	1	1	9279	\N	TRABAJADOR MANUAL   	TC	1999-02-01	\N	\N	TRABAJADOR MANUAL	TRABAJADOR MANUAL	37	\N	\N
24	25	1	1	\N	4032	\N	ODONTOPEDIATRA	TC	2006-07-02	2006-07-01	\N	ODONTOLOGO	ODONTOLOGO	5	\N	\N
25	26	1	1	2	40058	\N	AUXILIAR DE ENFERMERIA	TC	2002-05-01	2002-05-01	\N	AUXILIAR DE ENFERMERIA	AUXILIAR DE ENFERMERIA	14	\N	\N
26	27	1	1	1	74618	\N	FISIOTERAPEUTA	TC	2007-09-14	2010-04-30	\N	AUXILIAR FISIOTERAPEUTA	AUXILIAR FISIOTERAPEUTA	16	\N	\N
27	28	1	1	\N	4112	\N	GINECOLOGO/OBSTETRA	TC	2018-01-02	2018-01-02	\N	MEDICO	MEDICO	1	\N	\N
28	29	1	1	2	41006	\N	RADIOLOGO	TC	2006-06-23	2006-06-23	\N	TECNICO RX	TECNICO RX	14	\N	\N
29	30	1	1	\N	4028	\N	MEDICO PEDIATRA	M/T	2023-01-10	\N	\N	MEDICO	MEDICO	4	\N	\N
30	31	1	1	2	42003	\N	BIOQUIMICO	TC	2005-01-01	\N	\N	BIOQUIMICO	BIOQUIMICO	7	\N	\N
31	32	1	1	1	74939	\N	MEDICO INTERNISTA 	TC	2012-03-15	2017-04-10	\N	MEDICO	MEDICO	1	\N	\N
32	33	1	1	1	74998	\N	GINECOLOGO/OBSTETRA	TC	1997-08-01	\N	\N	MEDICO ESPECIALISTA	MEDICO ESPECIALISTA	3	\N	\N
33	34	1	1	1	9331	\N	JEFE DE RR.HH.	TC	2023-06-02	\N	\N	TEC. ADMINISTRATIVO II	TEC. ADMINISTRATIVO II	24	\N	\N
34	35	1	1	1	74548	\N	CIRUJANO BUCAL	TC	2005-09-01	2005-09-05	\N	ODONTOLOGO	ODONTOLOGO	5	\N	\N
35	36	1	1	2	41000	\N	MEDICO PLANTA	TC	2002-10-02	\N	\N	MEDICO	MEDICO	1	\N	\N
36	37	1	1	1	74776	\N	LICENCIADA EN ENFERMERIA	TC	2011-01-03	\N	\N	LICENCIADA EN ENFERMERIA	LICENCIADA EN ENFERMERIA	9	\N	\N
37	38	1	1	2	40022	\N	ANESTECIOLOGO	TC	2015-03-16	\N	\N	MEDICO	MEDICO	1	\N	\N
38	39	1	1	1	74129	\N	SERVICIO DE ADMISIONES	TC	1997-12-01	\N	\N	AUXILIAR DE ENFERMERIA	AUXILIAR DE ENFERMERIA	14	\N	\N
39	40	1	1	1	74642	\N	LICENCIEDO EN NUTRICION	TC	2009-10-14	\N	\N	LICENCIADO EN ENFERMERIA	LICENCIADO EN ENFERMERIA	9	\N	\N
40	41	1	1	2	40036	\N	LICENCIADA EN ENFERMERIA	TC	1992-05-01	\N	\N	LICENCIADA EN ENFERMERIA	LICENCIADA EN ENFERMERIA	9	\N	\N
41	42	1	1	1	9452	\N	CONDUCTOR	TC	2012-04-16	\N	\N	CONDUCTOR	CHOFER III	32	\N	\N
42	43	1	1	1	74881	\N	BIOQUIMICA Y FARMACIA	TC	2014-10-22	\N	TRASNFERIDA DE C.S. TOLEDO INICIA SU TRABAJO EL 01/04/2026	BIOQUIMICA Y FARMACIA	BIOQUIMICA Y FARMACIA	5	\N	\N
43	44	1	1	1	74625	\N	CIRUJANO GENERAL	TC	2009-02-19	2009-02-19	\N	MEDICO	MEDICO	1	\N	\N
44	45	1	1	1	9551	\N	TRABAJADOR MANUAL	TC	2016-05-03	\N	\N	TRABAJADOR MANUAL	TRABAJADOR MANUAL	37	\N	\N
45	46	1	1	1	74505	\N	MEDICO INTERNISTA	TC	2010-01-07	\N	\N	MEDICO ESPECIALISTA	MEDICO ESPECIALISTA	3	\N	\N
46	47	1	1	1	25661	\N	PLANIFICADORA	TC	1993-04-05	\N	\N	MEDICO	MEDICO	1	\N	\N
47	48	1	1	1	9176	\N	GINECOLOGO/OBSTETRA	MT	2015-09-21	\N	\N	MEDICO M/T II	MEDICO M/T II	2	\N	\N
48	49	1	1	1	74707	\N	ENDODONCISTA	TC	2012-09-11	2012-09-11	\N	ODONTOLOGO	ODONTOLOGO	5	\N	\N
49	50	1	1	1	74762	\N	ODONTOPEDIATRA	TC	2014-03-23	\N	\N	ODONONTOLOGO	ODONONTOLOGO	6	\N	\N
50	51	1	1	1	74693	\N	MEDICO PLANTA	TC	2006-03-16	\N	TRABAJO HASTA EL 30 DE ABRIL DE 2026 (SE ACOGIO A LA JUBILACION)	MEDICO ESPECIALISTA	MEDICO ESPECIALISTA	3	\N	\N
51	52	1	1	1	15087	\N	TRABAJADOR MANUAL	TC	2007-08-14	2007-08-14	\N	AUXILIAR ADMINISTRATIVO	AUXILIAR ADMINISTRATIVO	37	\N	\N
52	53	1	1	\N	4087	\N	FARMACEUTICO	TC	2009-01-02	2009-01-02	\N	BIOQUIMICO	BIOQUIMICO	7	\N	\N
53	54	1	1	1	9501	\N	LICENCIADA EN ENFERMERIA	TC	2019-12-10	\N	\N	SOCIOLOGO	LICENCIADA EN ENFERMERIA	9	\N	\N
54	55	1	1	1	74895	\N	LICENCIADA EN ENFERMERIA	TC	2010-09-15	\N	\N	LICENCIADA EN ENFERMERIA	LICENCIADA EN ENFERMERIA	9	\N	\N
55	56	1	1	1	74834	\N	FARMACEUTICO	MT	2014-10-22	2014-10-22	\N	ODONTOLOGO	BIOQUIMICA	8	\N	\N
56	57	1	1	1	74840	\N	RADIOLOGA	TC	2014-01-02	\N	\N	TECNICO RX	TECNICO RX	14	\N	\N
57	58	1	1	1	25195	\N	LICENCIADA EN ENFERMERIA	TC	2000-11-01	\N	\N	LICENCIADA EN ENFERMERIA	LICENCIADA EN ENFERMERIA	9	\N	\N
58	59	1	1	1	9571	\N	AUXILIAR DE ENFERMERIA	TC	1992-01-02	\N	\N	AUXILIAR DE ENFERMERIA	AUXILIAR DE ENFERMERIA	14	\N	\N
59	60	1	1	1	54013	\N	PEDIATRA	MT	2015-09-21	\N	\N	MEDICO	MEDICO	2	\N	\N
60	61	1	1	1	74705	\N	ENDODONCISTA	TC	2012-09-11	2012-11-11	\N	ODONTOLOGO	ODONTOLOGO	5	\N	\N
61	62	1	1	1	74898	\N	LICENCIADO EN ENFERMERIA	TC	2014-02-06	\N	\N	LICENCIADO EN ENFERMERIA	LICENCIADO EN ENFERMERIA	9	\N	\N
62	63	1	1	1	74727	\N	AUXILIAR DE ENFERMERIA	TC	2009-10-01	\N	\N	AUXILIAR DE ENFERMERIA	AUXILIAR DE ENFERMERIA	14	\N	\N
63	64	1	1	1	64117	\N	AUXILIAR DE ENFERMERIA	TC	2017-08-02	\N	\N	AUXILIAR DE ENFERMERIA	AUXILIAR DE ENFERMERIA	11	\N	\N
64	65	1	1	1	9563	\N	AUXILIAR DE ENFERMERIA	TC	2001-02-01	\N	\N	AUXILIAR DE ENFERMERIA	AUXILIAR DE ENFERMERIA	14	\N	\N
65	66	1	1	1	74546	\N	MEDICO PLANTA	TC	2007-03-01	2007-03-01	\N	MEDICO ESPECIALISTA	MEDICO ESPECIALISTA	3	\N	\N
66	67	1	1	\N	4085	\N	BIOQUIMICO	TC	2014-12-06	2007-01-02	\N	BIOQUIMICO	BIOQUIMICO	7	\N	\N
67	68	1	1	2	40013	\N	GINECOLOGO OBSTETRA	TC	2002-05-01	\N	\N	MEDICO	MEDICO	1	\N	\N
68	69	1	1	1	74812	\N	LICENCIADA EN ENFERMERIA	TC	2013-06-01	\N	\N	LICENCIADA EN ENFERMERIA	LICENCIADA EN ENFERMERIA	13	\N	\N
69	70	1	1	1	74576	\N	BIOQUIMICO	TC	2007-09-20	\N	\N	BIOQUIMICO	BIOQUIMICO	7	\N	\N
70	71	1	1	2	40062	\N	AUXILIAR DE ENFERMERIA	TC	2002-05-01	2002-05-01	\N	AUXILIAR DE ENFERMERIA	AUXILIAR DE ENFERMERIA	14	\N	\N
71	72	1	1	1	74632	\N	MEDICO PLANTA	TC	2009-01-02	2009-05-06	\N	MEDICO	MEDICO	1	\N	\N
72	73	1	1	1	74931	\N	EPIDEMIOLOGA	TC	2014-09-14	\N	\N	MEDICO	MEDICO	1	\N	\N
73	74	1	1	1	75000	\N	MEDICO GICOLOGO OBSTETRA	TC	2016-10-11	2020-06-19	\N	MEDICO ESPECIALISTA	MEDICO ESPECIALISTA	3	\N	\N
74	75	1	1	1	74864	\N	GINECOLOGO OBSTETRA	TC	2016-01-19	2017-04-03	\N	MEDICO ESPECIALISTA	MEDICO ESPECIALISTA	3	\N	\N
75	76	1	1	1	9297	\N	TRABAJADOR MANUAL	TC	2008-08-04	\N	\N	TRAB MANU. I	TRAB. MANU. I	37	\N	\N
76	77	1	1	1	74774	\N	LICENCIADA EN ENFERMERIA	TC	2011-01-03	\N	\N	LICENCIADA EN ENFERMERIA	LICENCIADA EN ENFERMERIA	9	\N	\N
77	78	1	1	1	74524	\N	AUXILIAR DE ENFERMERIA	TC	2007-02-01	\N	\N	AUXILIAR DE ENFERMERIA	AUXILIAR DE ENFERMERIA	14	\N	\N
78	79	1	1	1	74916	\N	FISIOTERAPEUTA	TC	2014-08-08	2014-05-07	\N	ESTADISTICA III	ESTADISTICA III	16	\N	\N
79	80	1	1	1	74946	\N	ENDODONCISTA	TC	2014-09-15	\N	\N	ODONTOLOGO	ODONTOLOGO	5	\N	\N
80	81	1	1	1	74891	\N	LICENCIADA EN ENFERMERIA	TC	2011-09-19	\N	\N	LICENCIADA EN ENFERMERIA	LICENCIADA EN ENFERMERIA	9	\N	\N
81	82	1	1	1	74677	\N	TECNICO SUPERIOR EN LABORATORIO	TC	2021-08-08	\N	\N	AUXILIAR DE ENFERMERIA	AUXILIAR DE ENFERMERIA	14	\N	\N
82	83	1	1	1	74119	\N	AUXILIAR DE ENFERMERIA	TC	2005-08-01	2005-05-01	\N	AUXILIAR DE ENFERMERIA	AUXILIAR DE ENFERMERIA	14	\N	\N
83	84	1	1	1	74709	\N	LICENCIADA EN ENFERMERIA	TC	2017-10-01	2009-10-08	\N	LICENCIADA EN ENFERMERIA	LICENCIADA EN ENFERMERIA	9	\N	\N
84	85	1	1	1	15076	\N	LICENCIADA EN ENFERMERIA	TC	2011-01-17	\N	\N	ENFERMERA GRADUADA	ENFERMERA GRADUADA	10	\N	\N
85	86	1	1	1	74787	\N	AUXILIAR DE ENFERMERIA	TC	2007-11-15	\N	\N	AUXILIAR DE ENFERMERIA	AUXILIAR DE ENFERMERIA	14	\N	\N
86	87	1	1	1	74798	\N	MEDICO PEDIATRA	TC	2023-05-10	\N	\N	MEDICO ESPECIALISTA	MEDICO ESPECIALISTA	3	\N	\N
87	88	1	1	1	9146	\N	PEDIATRA	TC	2013-04-01	2017-04-03	\N	MEDICO ESPECIALISTA	MEDICO ESPECIALISTA	3	\N	\N
88	89	1	1	1	74938	\N	MEDICO ECOGRAFISTA	TC	2014-10-01	\N	\N	MEDICO	MEDICO	1	\N	\N
89	90	1	1	1	9264	\N	CONDUCTOR	TC	1989-12-01	\N	\N	CONDUCTOR	CHOFER III	32	\N	\N
90	91	1	1	1	6774	\N	AUXILIAR DE ENFERMERIA	TC	1999-05-07	\N	\N	AUXILIAR DE ENFERMERIA	AUXILIAR DE ENFERMERIA	14	\N	\N
91	92	1	1	1	74574	\N	ODONTOPEDIATRA	TC	2006-11-30	\N	\N	ODONTOLOGO	ODONTOLOGO	5	\N	\N
92	93	1	1	1	74559	\N	AUXILIAR DE ENFERMERIA	TC	2018-09-03	2006-11-08	\N	AUXILIAR DE ENFERMERIA	AUXILIAR DE ENFERMERIA	14	\N	\N
93	94	1	1	1	15097	\N	MEDICO AUDITOR	TC	2002-07-01	2009-12-29	\N	MEDICO ESPECIALISTA	MEDICO ESPECIALISTA	3	\N	\N
94	95	1	1	1	15131	\N	DIRECTORA	TC	2025-05-22	\N	\N	MEDICO GENERAL	MEDICO	1	\N	\N
95	96	1	1	1	74746	\N	FISIOTERAPEUTA	TC	2009-10-01	\N	\N	AUXILIAR FISIOTERAPEUTA	AUXILIAR FISIOTERAPEUTA	16	\N	\N
96	97	1	1	1	9575	\N	AUXILIAR DE ENFERMERIA	TC	2000-02-01	2000-02-01	\N	AUXILIAR DE ENFERMERIA	AUXILIAR DE ENFERMERIA	14	\N	\N
97	98	1	1	1	54003	\N	CIRUJANO GENERAL	TC	2002-11-15	2010-05-25	\N	MEDICO	MEDICO	1	\N	\N
98	99	1	1	1	9436	\N	MEDICO GENERAL	TC	2001-10-01	2006-07-03	\N	MEDICO	MEDICO	1	\N	\N
99	100	1	1	1	74626	\N	CIRUJANO GENERAL	TC	2014-12-10	2017-04-03	\N	MEDICO	MEDICO	1	\N	\N
100	101	1	1	\N	4053	\N	LICENCIADA EN ENFERMERIA	TC	2006-07-20	\N	\N	LICENCIADA EN ENFERMERIA	LICENCIADA EN ENFERMERIA	9	\N	\N
101	102	1	1	\N	4092	\N	LICENCIADA EN ENFERMERIA	TC	2003-08-19	\N	\N	LICENCIADA EN ENFERMERIA	LICENCIADA EN ENFERMERIA	9	\N	\N
102	103	1	1	1	74549	\N	FARMACEUTICA	TC	2020-01-20	\N	\N	BIOQUIMICO	BIOQUIMICO	7	\N	\N
103	104	1	1	1	74661	\N	AUXILIAR DE ENFERMERIA	TC	2008-10-08	2008-10-08	\N	AUXILIAR DE ENFERMERIA	AUXILIAR DE ENFERMERIA	14	\N	\N
104	105	1	1	1	26140	\N	AUXILIAR DE ENFERMERIA	TC	1999-06-01	\N	\N	AUXILIAR DE ENFERMERIA	AUXILIAR DE ENFERMERIA	14	\N	\N
105	106	1	1	\N	4093	\N	LICENCIADA EN ENFERMERIA	TC	1999-04-30	2009-01-02	\N	LICENCIADA EN ENFERMERIA	LICENCIADA EN ENFERMERIA	9	\N	\N
106	107	1	1	1	74598	\N	AUXILIAR DE ENFERMERIA	TC	2007-10-01	\N	\N	AUXILIAR DE ENFERMERIA	AUXILIAR DE ENFERMERIA	14	\N	\N
107	108	1	1	1	74877	\N	ODONTOPEDIATRA	TC	2015-09-21	\N	\N	ODONTOLOGO	ODONTOLOGO	5	\N	\N
108	109	1	1	1	54024	\N	AUXILIAR DE ENFERMERIA	TC	2001-08-01	\N	\N	AUXILIAR DE ENFERMERIA	AUXILIAR DE ENFERMERIA	14	\N	\N
109	110	1	1	3	462	\N	AUXILIAR DE ENFERMERIA	TC	2023-01-10	\N	\N	\N	\N	\N	\N	\N
110	111	1	1	3	499	\N	AUXILIAR DE OFICINA	TC	2004-01-09	\N	\N	\N	\N	\N	\N	\N
111	112	1	1	3	5776	\N	MEDICO PEDIATRA	TC	2024-04-01	\N	\N	\N	\N	\N	\N	\N
112	113	1	1	3	504	\N	TRABAJADOR MANUAL   	TC	2024-07-12	\N	\N	\N	\N	\N	\N	\N
113	114	1	1	3	502	\N	ADMISIONES	TC	2024-06-07	\N	\N	\N	\N	\N	\N	\N
114	115	1	1	3	189	\N	AUXILIAR ADMINISTRATIVO	TC	2024-12-07	\N	\N	\N	\N	\N	\N	\N
115	116	1	1	3	425	\N	MEDICO TRAUMATOLOGO	TC	2024-01-12	\N	\N	\N	\N	\N	\N	\N
116	117	1	1	3	34554	\N	MEDICO ANESTESIOLOGO	TC	2025-11-07	\N	\N	\N	\N	\N	\N	\N
117	118	1	1	3	34	\N	CIRUJANO GENERAL	TC	2020-06-30	\N	\N	\N	\N	\N	\N	\N
118	119	1	1	3	80445	\N	LICENCIADA EN ENFERMERIA	TC	2025-09-17	\N	\N	\N	\N	\N	\N	\N
119	120	1	1	3	516	\N	ADMISIONES	TC	2025-04-01	\N	\N	\N	\N	\N	\N	\N
120	121	1	1	3	5129	\N	LICENCIADA EN ENFERMERIA	TC	2017-01-03	\N	\N	\N	\N	\N	\N	\N
121	122	1	1	3	487	\N	INGENIERO COMERCIAL	TC	2024-11-04	\N	\N	\N	\N	\N	\N	\N
122	123	1	1	3	70921	\N	LICENCIADA EN ENFERMERIA	TC	2023-05-02	\N	\N	\N	\N	\N	\N	\N
123	124	1	1	3	4615	\N	MEDICO PLANTA	TC	2015-09-07	\N	\N	\N	\N	\N	\N	\N
124	125	1	1	3	193	\N	TRABAJADOR MANUAL   	TC	2015-09-21	\N	\N	\N	\N	\N	\N	\N
125	126	1	1	3	80505	\N	AUXILIAR ADMINISTRATIVO	TC	2025-08-14	\N	\N	\N	\N	\N	\N	\N
126	127	1	1	3	389	\N	TECNICO MEDIO EN ENFERMERIA	TC	2024-11-15	\N	\N	\N	\N	\N	\N	\N
127	128	1	1	3	70231	\N	CIRUJANO GENERAL	TC	2020-03-25	\N	\N	\N	\N	\N	\N	\N
128	129	1	1	3	5462	\N	MEDICO CARDIOLO	TC	2024-08-02	\N	\N	\N	\N	\N	\N	\N
129	130	1	1	3	80519	\N	AUXILIAR ADMINISTRATIVO	TC	2025-05-29	\N	\N	\N	\N	\N	\N	\N
130	131	1	1	3	3958	\N	MEDICO GINECOLOGO OBSTETRA	TC	2024-07-05	\N	\N	\N	\N	\N	\N	\N
131	132	1	1	3	2588	\N	ANESTESIOLOGA	TC	2024-12-22	\N	\N	\N	\N	\N	\N	\N
132	133	1	1	3	738	\N	GENETISTA	TC	2013-03-05	\N	\N	\N	\N	\N	\N	\N
133	134	1	1	3	74098	\N	MEDICO GENERAL	TC	2023-07-25	\N	\N	\N	\N	\N	\N	\N
134	135	1	1	3	71352	\N	LICENCIAD EN ENFERMERIA	TC	2024-08-12	\N	\N	\N	\N	\N	\N	\N
135	136	1	1	3	511	\N	TECNICO MEDIO EN ELECTRICIDAD	TC	2024-02-17	\N	\N	\N	\N	\N	\N	\N
136	137	1	1	3	514	\N	AUXILIAR ADMINISTRATIVO	TC	2024-12-06	\N	\N	\N	\N	\N	\N	\N
137	138	1	1	3	74202	\N	GINECOLOGO/OBSTETRA	TC	2020-03-25	\N	\N	\N	\N	\N	\N	\N
138	139	1	1	3	5838	\N	MEDICO INTERNISTA	TC	2024-08-02	\N	\N	\N	\N	\N	\N	\N
139	140	1	1	3	494	\N	CHOFER	TC	2022-09-26	\N	\N	\N	\N	\N	\N	\N
140	141	1	1	3	70227	\N	ANANESTESIOLOGA	TC	2020-03-25	\N	\N	\N	\N	\N	\N	\N
141	142	1	3	3	\N	\N	MEDICO RESIDENTE PEDIATRIA	TC	2026-04-10	\N	\N	\N	\N	\N	\N	\N
142	143	1	3	3	\N	\N	MEDICO RESIDENTE CIRUGIA GENERAL	TC	2026-04-10	\N	\N	\N	\N	\N	\N	\N
143	144	1	1	3	9446	\N	MEDICO RESIDENTE GINECOLOGIA	TC	2024-03-01	\N	\N	\N	\N	\N	\N	\N
144	145	1	1	3	9439	\N	MEDICO RESIDENTE CIRUGIA GENERAL	TC	2024-03-01	\N	\N	\N	\N	\N	\N	\N
145	146	1	3	3	\N	\N	MEDICO RESIDENTE GINECOLOGIA	TC	2026-04-10	\N	\N	\N	\N	\N	\N	\N
146	147	1	1	3	60421	\N	MEDICO RESIDENTE PEDIATRIA	TC	2025-03-01	\N	\N	\N	\N	\N	\N	\N
147	148	1	1	3	66263	\N	MEDICO RESIDENTE GINECOLOGIA	TC	2025-03-01	\N	\N	\N	\N	\N	\N	\N
148	149	1	1	3	55004	\N	MEDICO ESPECIALISTA  EN ANESTESIOLOGIA	TC	2025-06-02	\N	\N	\N	\N	\N	\N	\N
149	150	1	1	3	55083	\N	MEDICO ESPECIALISTA  EN MEDICINA CRITICA Y TERAPIA INTENSIVA	TC	2025-06-02	\N	\N	\N	\N	\N	\N	\N
150	151	1	1	3	55022	\N	MEDICO ESPECIALISTA  EN CIRUGIA GENERAL	TC	2025-06-02	\N	\N	\N	\N	\N	\N	\N
151	152	1	1	3	55100	\N	MEDICO ESPECIALISTA  EN PEDIATRIA	TC	2025-06-02	\N	\N	\N	\N	\N	\N	\N
152	153	1	1	3	55093	\N	MEDICO ESPECIALISTA  EN MEDICINA INTERNA	TC	2025-06-02	\N	\N	\N	\N	\N	\N	\N
153	154	1	1	3	55119	\N	MEDICO ESPECIALISTA  EN TRAUMATOLOGIA Y ORTOPEDIA	TC	2025-06-02	\N	\N	\N	\N	\N	\N	\N
154	155	1	1	3	55074	\N	MEDICO ESPECIALISTA  EN GINECOLOGIA Y OBSTETRICIA	TC	2025-06-02	\N	\N	\N	\N	\N	\N	\N
155	156	1	1	3	55099	\N	MEDICO ESPECIALISTA  EN PEDIATRIA	TC	2025-06-02	\N	\N	\N	\N	\N	\N	\N
156	157	1	1	3	55080	\N	MEDICO ESPECIALISTA  EN IMAGENOLOGIA	TC	2025-06-02	\N	\N	\N	\N	\N	\N	\N
157	158	1	1	3	55006	\N	MEDICO ESPECIALISTA  EN ANESTESIOLOGIA	TC	2025-06-02	\N	\N	\N	\N	\N	\N	\N
158	159	1	2	4	U. DE SALUD Nº 001/2026	SERVICIO DE QUIROFANO Y CENTRAL DE ESTERILIZACION	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
159	160	1	2	4	U. DE SALUD Nº 002/2026	SERVICIO DE CIRUGIA GENERAL	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
160	161	1	2	4	U. DE SALUD Nº 001/2026	SERVICIO DE CIRUGIA GENERAL	AUXILIAR EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
161	162	1	2	4	CONTRATO PROYECTO	SERVICIO DE LIMPIEZA	PERSONAL MANUAL	TC	\N	\N	\N	\N	\N	\N	\N	\N
162	163	1	2	4	U. DE SALUD Nº 018/2026	SERVICIO DE QUIROFANO Y CENTRAL DE ESTERILIZACION	AUXILIAR EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
163	164	1	2	4	U. DE SALUD Nº 003/2026	SERVICIO DE CIRUGIA GENERAL	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
164	165	1	2	4	U. DE SALUD Nº 016/2026	SERVICIO DE PEDIATRIA	MEDICO PEDIATRA	TC	\N	\N	\N	\N	\N	\N	\N	\N
165	166	1	2	4	U. DE SALUD Nº 006/2026	SERVICIO DE LIMPIEZA	PERSONAL MANUAL	TC	\N	\N	\N	\N	\N	\N	\N	\N
166	167	1	2	4	CONTRATO PROYECTO	SERVICIO DE LIMPIEZA	PERSONAL MANUAL	TC	\N	\N	\N	\N	\N	\N	\N	\N
167	168	1	2	4	U. DE SALUD Nº 006/2026	AUXILIAR DE OFICINA	AUXILIAR DE OFICINA 	TC	\N	\N	\N	\N	\N	\N	\N	\N
168	169	1	2	4	U. DE SALUD Nº 004/2026	SERVICIO DE NEONATOLOGIA	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
169	170	1	2	4	U. DE SALUD Nº 005/2026	SERVICIO DE TERAPIA INTERMEDIA	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
170	171	1	2	4	U. DE SALUD Nº 002/2026	SERVICIO DE ANESTESIOLOGIA	MEDICO ANESTESIOLOGO	TC	\N	\N	\N	\N	\N	\N	\N	\N
171	172	1	2	4	U. DE SALUD Nº 006/2026	SERVICIO DE MATERNIDAD 	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
172	173	1	2	4	U. DE SALUD Nº 006/2026	SERVICIO DE LAVANDERIA	PERSONAL MANUAL	TC	\N	\N	\N	\N	\N	\N	\N	\N
173	174	1	2	4	U. DE SALUD Nº 006/2026	SERVICIO DE LAVANDERIA	PERSONAL MANUAL	TC	\N	\N	\N	\N	\N	\N	\N	\N
174	175	1	2	4	U. DE SALUD Nº 004/2026	AUXILIAR DE OFICINA	AUXILIAR DE OFICINA 	TC	\N	\N	\N	\N	\N	\N	\N	\N
175	176	1	2	4	U. DE SALUD Nº 007/2026	SERVICIO DE NEONATOLOGIA	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
176	177	1	2	4	U. DE SALUD Nº 009/2026	SERVICIO DE MEDICINA INTERNA	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
177	178	1	2	4	U. DE SALUD Nº 004/2026	SERVICIO DE NUTRICION	LICENCIADA EN NUTRICION	TC	\N	\N	\N	\N	\N	\N	\N	\N
178	179	1	2	4	U. DE SALUD Nº 010/2026	SERVICIO DE EMERGENCIAS 	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
179	180	1	2	4	U. DE SALUD Nº 006/2026	SERVICIO DE COCINA	PERSONAL MANUAL	TC	\N	\N	\N	\N	\N	\N	\N	\N
180	181	1	2	4	U. DE SALUD Nº 024/2026	SERVICIO DE PEDIATRIA	AUXILIAR EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
181	182	1	2	4	U. DE SALUD Nº 011/2026	SERVICIO DE CIRUGIA GENERAL	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
182	183	1	2	4	U. DE SALUD Nº 008/2026	SERVICIO DE FISIOTERAPIA	LICENCIADA EN FISIOTERAPIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
183	184	1	2	4	U. DE SALUD Nº 013/2026	SERVICIO DE GINECOLOGIA	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
184	185	1	2	4	U. DE SALUD Nº 014/2026	SERVICIO DE MEDICINA INTERNA	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
185	186	1	2	4	U. DE SALUD Nº 015/2026	SERVICIO DE EMERGENCIAS 	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
186	187	1	2	4	U. DE SALUD Nº 016/2026	SERVICIO DE GINECOLOGIA	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
187	188	1	2	4	U. DE SALUD Nº 006/2026	SERVICIO DE LIMPIEZA	PERSONAL MANUAL	TC	\N	\N	\N	\N	\N	\N	\N	\N
188	189	1	2	4	U. DE SALUD Nº 009/2026	SERVICIO DE AMBULANCIA	CHOFER	TC	\N	\N	\N	\N	\N	\N	\N	\N
189	190	1	2	4	U. DE SALUD Nº 006/2026	SERVICIO DE LIMPIEZA	PERSONAL MANUAL	TC	\N	\N	\N	\N	\N	\N	\N	\N
190	191	1	2	4	U. DE SALUD Nº 018/2026	SERVICIO DE PEDIATRIA	MEDICO PEDIATRA	TC	\N	\N	\N	\N	\N	\N	\N	\N
191	192	1	2	4	U. DE SALUD Nº 019/2026	SERVICIO DE TRAUMATOLOGIA	MEDICO TRAUMATOLOGO	TC	\N	\N	\N	\N	\N	\N	\N	\N
192	193	1	2	4	U. DE SALUD Nº 002/2026	SERVICIO DE ESTADISTICA	ESTADISTICA	TC	\N	\N	\N	\N	\N	\N	\N	\N
193	194	1	2	4	U. DE SALUD Nº 006/2026	SERVICIO DE COCINA	PERSONAL MANUAL	TC	\N	\N	\N	\N	\N	\N	\N	\N
194	195	1	2	4	U. DE SALUD Nº 023/2026	SERVICIO DE MATERNIDAD 	AUXILIAR EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
195	196	1	2	4	CONTRATO PROYECTO	SERVICIO DE LIMPIEZA	PERSONAL MANUAL	TC	\N	\N	\N	\N	\N	\N	\N	\N
196	197	1	2	4	U. DE SALUD Nº 025/2026	SERVICIO DE PEDIATRIA	AUXILIAR EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
197	198	1	2	4	U. DE SALUD Nº 018/2026	SERVICIO DE PEDIATRIA	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
198	199	1	2	4	U. DE SALUD Nº 003/2026	SERVICIO DE MEDICINA INTERNA	AUXILIAR EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
199	200	1	2	4	U. DE SALUD Nº 019/2026	SERVICIO DE MEDICINA INTERNA	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
200	201	1	2	4	U. DE SALUD Nº 009/2026	SERVICIO DE FISIOTERAPIA	LICENCIADA EN FISIOTERAPIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
201	202	1	2	4	U. DE SALUD Nº 020/2026	SERVICIO DE PEDIATRIA	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
202	204	1	2	4	U. DE SALUD Nº 006/2026	SERVICIO DE PLANCHADO	PERSONAL MANUAL	TC	\N	\N	\N	\N	\N	\N	\N	\N
203	205	1	2	4	U. DE SALUD Nº 014/2026	SERVICIO DE PORTERIA	SERENO PORTERO	TC	\N	\N	\N	\N	\N	\N	\N	\N
204	206	1	2	4	U. DE SALUD Nº 022/2026	SERVICIO DE GINECOLOGIA	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
205	207	1	3	4	\N	SERVICIO DE LIMPIEZA	TRABAJADOR MANUAL	TC	\N	\N	\N	\N	\N	\N	\N	\N
206	208	1	2	4	U. DE SALUD Nº 024/2026	SERVICIO DE NEONATOLOGIA	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
207	209	1	2	4	U. DE SALUD Nº 013/2026	SERVICIO DE MEDICINA INTERNA	MEDICO INTERNISTA	TC	\N	\N	\N	\N	\N	\N	\N	\N
208	210	1	2	4	U. DE SALUD Nº 037/2026	SERVICIO DE NEONATOLOGIA	AUXILIAR EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
209	211	1	2	4	U. DE SALUD Nº 012/2026	SERVICIO DE CIRUGIA GENERAL	AUXILIAR EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
210	212	1	2	4	U. DE SALUD Nº 006/2026	SERVICIO DE MEDICINA INTERNA	AUXILIAR EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
211	213	1	2	4	U. DE SALUD Nº 014/2026	SERVICIO DE MEDICINA INTERNA	MEDICO INTERNISTA	TC	\N	\N	\N	\N	\N	\N	\N	\N
212	214	1	3	4	\N	SERVICIO DE PEDIATRIA	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
213	215	1	2	4	U. DE SALUD Nº 002/2026	SERVICIO DE ATENCION TEMPRANA	TECNICO EN ATENCION TEMPRANA	TC	\N	\N	\N	\N	\N	\N	\N	\N
214	216	1	2	4	U. DE SALUD Nº 027/2026	SERVICIO DE PEDIATRIA	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
215	217	1	2	4	U. DE SALUD Nº 028/2026	SERVICIO DE TERAPIA INTERMEDIA	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
216	218	1	2	4	U. DE SALUD Nº 029/2026	SERVICIO DE QUIROFANO Y CENTRAL DE ESTERILIZACION	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
217	219	1	2	4	U. DE SALUD Nº 030/2026	SERVICIO DE QUIROFANO Y CENTRAL DE ESTERILIZACION	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
218	220	1	2	4	U. DE SALUD Nº 007/2026	SERVICIO DE AMBULANCIA	CHOFER	TC	\N	\N	\N	\N	\N	\N	\N	\N
219	221	1	2	4	U. DE SALUD Nº 002/2026	SERVICIO DE EMERGENCIAS 	MEDICO GENERAL	TC	\N	\N	\N	\N	\N	\N	\N	\N
220	222	1	2	4	U. DE SALUD Nº 006/2026	SERVICIO DE LAVANDERIA	PERSONAL MANUAL	TC	\N	\N	\N	\N	\N	\N	\N	\N
221	223	1	2	4	U. DE SALUD Nº 009/2026	SERVICIO DE QUIROFANO Y CENTRAL DE ESTERILIZACION	AUXILIAR EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
222	224	1	2	4	U. DE SALUD Nº 010/2026	SERVICIO DE AMBULANCIA	CHOFER	TC	\N	\N	\N	\N	\N	\N	\N	\N
223	225	1	2	4	U. DE SALUD Nº 012/2026	SERVICIO DE SISTEMAS	INGENIERO EN SISTEMAS	TC	\N	\N	\N	\N	\N	\N	\N	\N
224	226	1	2	4	U. DE SALUD Nº 007/2026	SERVICIO DE FISIOTERAPIA	LICENCIADO  EN FISIOTERAPIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
225	227	1	2	4	U. DE SALUD Nº 031/2026	SERVICIO DE TERAPIA INTERMEDIA	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
226	228	1	2	4	U. DE SALUD Nº 002/2026	SERVICIO DE AMBULANCIA	CHOFER	TC	\N	\N	\N	\N	\N	\N	\N	\N
227	229	1	2	4	U. DE SALUD Nº 006/2026	SERVICIO DE LAVANDERIA	PERSONAL MANUAL	TC	\N	\N	\N	\N	\N	\N	\N	\N
228	230	1	2	4	U. DE SALUD Nº 020/2026	SERVICIO DE PEDIATRIA	AUXILIAR EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
229	231	1	2	4	U. DE SALUD Nº 003/2026	AUXILIAR DE OFICINA	AUXILIAR DE OFICINA 	TC	\N	\N	\N	\N	\N	\N	\N	\N
230	232	1	2	4	U. DE SALUD Nº 004/2026	SERVICIO DE PEDIATRIA	AUXILIAR EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
231	233	1	2	4	U. DE SALUD Nº 033/2026	SERVICIO DE MATERNIDAD 	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
232	234	1	2	4	U. DE SALUD Nº 012/2026	SERVICIO DE NEONATOLOGIA	AUXILIAR EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
233	235	1	2	4	U. DE SALUD Nº 034/2026	SERVICIO DE NEONATOLOGIA	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
234	236	1	2	4	U. DE SALUD Nº 011/2026	SERVICIO DE AMBULANCIA	CHOFER	TC	\N	\N	\N	\N	\N	\N	\N	\N
235	238	1	2	4	U. DE SALUD Nº 035/2026	SERVICIO DE TERAPIA INTERMEDIA	LICENCIADA EN ENFERMERIA	TC	\N	\N	\N	\N	\N	\N	\N	\N
236	239	1	2	4	U. DE SALUD Nº 001/2026	SERVICIO DE ESTADISTICA	ESTADISTICA	TC	\N	\N	\N	\N	\N	\N	\N	\N
237	240	1	2	4	CONTRATO PROYECTO	SERVICIO UNIDAD DE HEMODIALISIS 	LICENCIADA EN ENFERMERIA 	TC	\N	\N	\N	\N	\N	\N	\N	\N
238	241	1	2	4	U. DE SALUD Nº 023/2026	SERVICIO UNIDAD DE HEMODIALISIS 	LICENCIADA EN ENFERMERIA 	TC	\N	\N	\N	\N	\N	\N	\N	\N
239	242	1	2	4	U. DE SALUD Nº 021/2026	SERVICIO UNIDAD DE HEMODIALISIS 	MEDICO NEFROLOGO	TC	\N	\N	\N	\N	\N	\N	\N	\N
240	243	1	2	4	U. DE SALUD Nº 009/2026	SERVICIO UNIDAD DE HEMODIALISIS 	ADMINISTRADOR	TC	\N	\N	\N	\N	\N	\N	\N	\N
241	244	1	2	4	U. DE SALUD Nº 026/2026	SERVICIO UNIDAD DE HEMODIALISIS 	LICENCIADA EN ENFERMERIA 	TC	\N	\N	\N	\N	\N	\N	\N	\N
242	245	1	2	4	U. DE SALUD Nº 032/2026	SERVICIO UNIDAD DE HEMODIALISIS 	LICENCIADA EN ENFERMERIA 	TC	\N	\N	\N	\N	\N	\N	\N	\N
243	246	1	2	4	U. DE SALUD Nº 020/2026	SERVICIO UNIDAD DE HEMODIALISIS 	MEDICO NEFROLOGO	TC	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Name: asistencia_diaria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hitdev
--

SELECT pg_catalog.setval('public.asistencia_diaria_id_seq', 673, true);


--
-- Name: asistencia_mensual_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hitdev
--

SELECT pg_catalog.setval('public.asistencia_mensual_id_seq', 86, true);


--
-- Name: asistencia_rotaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hitdev
--

SELECT pg_catalog.setval('public.asistencia_rotaciones_id_seq', 1, false);


--
-- Name: biometrico_logs_raw_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hitdev
--

SELECT pg_catalog.setval('public.biometrico_logs_raw_id_seq', 1, false);


--
-- Name: cat_clasificaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hitdev
--

SELECT pg_catalog.setval('public.cat_clasificaciones_id_seq', 8, true);


--
-- Name: cat_etiquetas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hitdev
--

SELECT pg_catalog.setval('public.cat_etiquetas_id_seq', 8, true);


--
-- Name: cat_expediciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hitdev
--

SELECT pg_catalog.setval('public.cat_expediciones_id_seq', 9, true);


--
-- Name: cat_fuentes_financiamiento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hitdev
--

SELECT pg_catalog.setval('public.cat_fuentes_financiamiento_id_seq', 4, true);


--
-- Name: cat_profesiones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hitdev
--

SELECT pg_catalog.setval('public.cat_profesiones_id_seq', 55, true);


--
-- Name: cat_tipos_correspondencia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hitdev
--

SELECT pg_catalog.setval('public.cat_tipos_correspondencia_id_seq', 3, true);


--
-- Name: cat_tipos_personal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hitdev
--

SELECT pg_catalog.setval('public.cat_tipos_personal_id_seq', 3, true);


--
-- Name: cat_unidades_servicios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hitdev
--

SELECT pg_catalog.setval('public.cat_unidades_servicios_id_seq', 24, true);


--
-- Name: correspondencia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hitdev
--

SELECT pg_catalog.setval('public.correspondencia_id_seq', 1, false);


--
-- Name: derivaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hitdev
--

SELECT pg_catalog.setval('public.derivaciones_id_seq', 1, false);


--
-- Name: establecimientos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hitdev
--

SELECT pg_catalog.setval('public.establecimientos_id_seq', 1, true);


--
-- Name: historial_movimientos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hitdev
--

SELECT pg_catalog.setval('public.historial_movimientos_id_seq', 1, false);


--
-- Name: permisos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hitdev
--

SELECT pg_catalog.setval('public.permisos_id_seq', 10, true);


--
-- Name: personal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hitdev
--

SELECT pg_catalog.setval('public.personal_id_seq', 246, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hitdev
--

SELECT pg_catalog.setval('public.roles_id_seq', 5, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hitdev
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 1, true);


--
-- Name: vinculos_laborales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hitdev
--

SELECT pg_catalog.setval('public.vinculos_laborales_id_seq', 243, true);


--
-- Name: asistencia_diaria asistencia_diaria_pkey; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.asistencia_diaria
    ADD CONSTRAINT asistencia_diaria_pkey PRIMARY KEY (id);


--
-- Name: asistencia_mensual asistencia_mensual_personal_id_mes_anio_tipo_planilla_key; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.asistencia_mensual
    ADD CONSTRAINT asistencia_mensual_personal_id_mes_anio_tipo_planilla_key UNIQUE (personal_id, mes, anio, tipo_planilla);


--
-- Name: asistencia_mensual asistencia_mensual_pkey; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.asistencia_mensual
    ADD CONSTRAINT asistencia_mensual_pkey PRIMARY KEY (id);


--
-- Name: asistencia_rotaciones asistencia_rotaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.asistencia_rotaciones
    ADD CONSTRAINT asistencia_rotaciones_pkey PRIMARY KEY (id);


--
-- Name: biometrico_config biometrico_config_pkey; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.biometrico_config
    ADD CONSTRAINT biometrico_config_pkey PRIMARY KEY (id);


--
-- Name: biometrico_logs_raw biometrico_logs_raw_biometrico_id_timestamp_key; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.biometrico_logs_raw
    ADD CONSTRAINT biometrico_logs_raw_biometrico_id_timestamp_key UNIQUE (biometrico_id, "timestamp");


--
-- Name: biometrico_logs_raw biometrico_logs_raw_pkey; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.biometrico_logs_raw
    ADD CONSTRAINT biometrico_logs_raw_pkey PRIMARY KEY (id);


--
-- Name: cat_clasificaciones cat_clasificaciones_codigo_key; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.cat_clasificaciones
    ADD CONSTRAINT cat_clasificaciones_codigo_key UNIQUE (codigo);


--
-- Name: cat_clasificaciones cat_clasificaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.cat_clasificaciones
    ADD CONSTRAINT cat_clasificaciones_pkey PRIMARY KEY (id);


--
-- Name: cat_etiquetas cat_etiquetas_nombre_key; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.cat_etiquetas
    ADD CONSTRAINT cat_etiquetas_nombre_key UNIQUE (nombre);


--
-- Name: cat_etiquetas cat_etiquetas_pkey; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.cat_etiquetas
    ADD CONSTRAINT cat_etiquetas_pkey PRIMARY KEY (id);


--
-- Name: cat_expediciones cat_expediciones_pkey; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.cat_expediciones
    ADD CONSTRAINT cat_expediciones_pkey PRIMARY KEY (id);


--
-- Name: cat_fuentes_financiamiento cat_fuentes_financiamiento_pkey; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.cat_fuentes_financiamiento
    ADD CONSTRAINT cat_fuentes_financiamiento_pkey PRIMARY KEY (id);


--
-- Name: cat_profesiones cat_profesiones_pkey; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.cat_profesiones
    ADD CONSTRAINT cat_profesiones_pkey PRIMARY KEY (id);


--
-- Name: cat_tipos_correspondencia cat_tipos_correspondencia_codigo_key; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.cat_tipos_correspondencia
    ADD CONSTRAINT cat_tipos_correspondencia_codigo_key UNIQUE (codigo);


--
-- Name: cat_tipos_correspondencia cat_tipos_correspondencia_pkey; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.cat_tipos_correspondencia
    ADD CONSTRAINT cat_tipos_correspondencia_pkey PRIMARY KEY (id);


--
-- Name: cat_tipos_personal cat_tipos_personal_pkey; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.cat_tipos_personal
    ADD CONSTRAINT cat_tipos_personal_pkey PRIMARY KEY (id);


--
-- Name: cat_unidades_servicios cat_unidades_servicios_nombre_unidad_key; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.cat_unidades_servicios
    ADD CONSTRAINT cat_unidades_servicios_nombre_unidad_key UNIQUE (nombre_unidad);


--
-- Name: cat_unidades_servicios cat_unidades_servicios_pkey; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.cat_unidades_servicios
    ADD CONSTRAINT cat_unidades_servicios_pkey PRIMARY KEY (id);


--
-- Name: configuracion_cite configuracion_cite_pkey; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.configuracion_cite
    ADD CONSTRAINT configuracion_cite_pkey PRIMARY KEY (id);


--
-- Name: correspondencia_etiquetas correspondencia_etiquetas_pkey; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.correspondencia_etiquetas
    ADD CONSTRAINT correspondencia_etiquetas_pkey PRIMARY KEY (correspondencia_id, etiqueta_id);


--
-- Name: correspondencia correspondencia_hr_correlativo_gestion_key; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.correspondencia
    ADD CONSTRAINT correspondencia_hr_correlativo_gestion_key UNIQUE (hr_correlativo, gestion);


--
-- Name: correspondencia correspondencia_pkey; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.correspondencia
    ADD CONSTRAINT correspondencia_pkey PRIMARY KEY (id);


--
-- Name: derivaciones derivaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.derivaciones
    ADD CONSTRAINT derivaciones_pkey PRIMARY KEY (id);


--
-- Name: establecimientos establecimientos_pkey; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.establecimientos
    ADD CONSTRAINT establecimientos_pkey PRIMARY KEY (id);


--
-- Name: historial_movimientos historial_movimientos_pkey; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.historial_movimientos
    ADD CONSTRAINT historial_movimientos_pkey PRIMARY KEY (id);


--
-- Name: permisos permisos_codigo_key; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.permisos
    ADD CONSTRAINT permisos_codigo_key UNIQUE (codigo);


--
-- Name: permisos permisos_pkey; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.permisos
    ADD CONSTRAINT permisos_pkey PRIMARY KEY (id);


--
-- Name: personal personal_ci_key; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.personal
    ADD CONSTRAINT personal_ci_key UNIQUE (ci);


--
-- Name: personal personal_pkey; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.personal
    ADD CONSTRAINT personal_pkey PRIMARY KEY (id);


--
-- Name: rol_permisos rol_permisos_pkey; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.rol_permisos
    ADD CONSTRAINT rol_permisos_pkey PRIMARY KEY (rol_id, permiso_id);


--
-- Name: roles roles_nombre_key; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_key UNIQUE (nombre);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: secuencia_hr secuencia_hr_pkey; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.secuencia_hr
    ADD CONSTRAINT secuencia_hr_pkey PRIMARY KEY (gestion);


--
-- Name: usuario_roles usuario_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT usuario_roles_pkey PRIMARY KEY (usuario_id, rol_id);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_username_key; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key UNIQUE (username);


--
-- Name: vinculos_laborales vinculos_laborales_pkey; Type: CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.vinculos_laborales
    ADD CONSTRAINT vinculos_laborales_pkey PRIMARY KEY (id);


--
-- Name: personal_biometrico_id_key; Type: INDEX; Schema: public; Owner: hitdev
--

CREATE UNIQUE INDEX personal_biometrico_id_key ON public.personal USING btree (biometrico_id) WHERE (biometrico_id IS NOT NULL);


--
-- Name: asistencia_diaria asistencia_diaria_asistencia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.asistencia_diaria
    ADD CONSTRAINT asistencia_diaria_asistencia_id_fkey FOREIGN KEY (asistencia_id) REFERENCES public.asistencia_mensual(id) ON DELETE CASCADE;


--
-- Name: asistencia_mensual asistencia_mensual_personal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.asistencia_mensual
    ADD CONSTRAINT asistencia_mensual_personal_id_fkey FOREIGN KEY (personal_id) REFERENCES public.personal(id) ON DELETE CASCADE;


--
-- Name: asistencia_rotaciones asistencia_rotaciones_personal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.asistencia_rotaciones
    ADD CONSTRAINT asistencia_rotaciones_personal_id_fkey FOREIGN KEY (personal_id) REFERENCES public.personal(id);


--
-- Name: correspondencia correspondencia_clasificacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.correspondencia
    ADD CONSTRAINT correspondencia_clasificacion_id_fkey FOREIGN KEY (clasificacion_id) REFERENCES public.cat_clasificaciones(id);


--
-- Name: correspondencia_etiquetas correspondencia_etiquetas_correspondencia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.correspondencia_etiquetas
    ADD CONSTRAINT correspondencia_etiquetas_correspondencia_id_fkey FOREIGN KEY (correspondencia_id) REFERENCES public.correspondencia(id) ON DELETE CASCADE;


--
-- Name: correspondencia_etiquetas correspondencia_etiquetas_etiqueta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.correspondencia_etiquetas
    ADD CONSTRAINT correspondencia_etiquetas_etiqueta_id_fkey FOREIGN KEY (etiqueta_id) REFERENCES public.cat_etiquetas(id) ON DELETE CASCADE;


--
-- Name: correspondencia correspondencia_remitente_interno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.correspondencia
    ADD CONSTRAINT correspondencia_remitente_interno_id_fkey FOREIGN KEY (remitente_interno_id) REFERENCES public.usuarios(id);


--
-- Name: correspondencia correspondencia_tipo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.correspondencia
    ADD CONSTRAINT correspondencia_tipo_id_fkey FOREIGN KEY (tipo_id) REFERENCES public.cat_tipos_correspondencia(id);


--
-- Name: correspondencia correspondencia_usuario_recepcion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.correspondencia
    ADD CONSTRAINT correspondencia_usuario_recepcion_id_fkey FOREIGN KEY (usuario_recepcion_id) REFERENCES public.usuarios(id);


--
-- Name: derivaciones derivaciones_correspondencia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.derivaciones
    ADD CONSTRAINT derivaciones_correspondencia_id_fkey FOREIGN KEY (correspondencia_id) REFERENCES public.correspondencia(id) ON DELETE CASCADE;


--
-- Name: derivaciones derivaciones_de_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.derivaciones
    ADD CONSTRAINT derivaciones_de_usuario_id_fkey FOREIGN KEY (de_usuario_id) REFERENCES public.usuarios(id);


--
-- Name: derivaciones derivaciones_para_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.derivaciones
    ADD CONSTRAINT derivaciones_para_usuario_id_fkey FOREIGN KEY (para_usuario_id) REFERENCES public.usuarios(id);


--
-- Name: historial_movimientos historial_movimientos_personal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.historial_movimientos
    ADD CONSTRAINT historial_movimientos_personal_id_fkey FOREIGN KEY (personal_id) REFERENCES public.personal(id) ON DELETE CASCADE;


--
-- Name: personal personal_exp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.personal
    ADD CONSTRAINT personal_exp_id_fkey FOREIGN KEY (exp_id) REFERENCES public.cat_expediciones(id);


--
-- Name: personal personal_profesion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.personal
    ADD CONSTRAINT personal_profesion_id_fkey FOREIGN KEY (profesion_id) REFERENCES public.cat_profesiones(id);


--
-- Name: rol_permisos rol_permisos_permiso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.rol_permisos
    ADD CONSTRAINT rol_permisos_permiso_id_fkey FOREIGN KEY (permiso_id) REFERENCES public.permisos(id) ON DELETE CASCADE;


--
-- Name: rol_permisos rol_permisos_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.rol_permisos
    ADD CONSTRAINT rol_permisos_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: usuario_roles usuario_roles_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT usuario_roles_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: usuario_roles usuario_roles_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT usuario_roles_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: usuarios usuarios_personal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_personal_id_fkey FOREIGN KEY (personal_id) REFERENCES public.personal(id) ON DELETE SET NULL;


--
-- Name: vinculos_laborales vinculos_laborales_establecimiento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.vinculos_laborales
    ADD CONSTRAINT vinculos_laborales_establecimiento_id_fkey FOREIGN KEY (establecimiento_id) REFERENCES public.establecimientos(id);


--
-- Name: vinculos_laborales vinculos_laborales_fuente_financiamiento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.vinculos_laborales
    ADD CONSTRAINT vinculos_laborales_fuente_financiamiento_id_fkey FOREIGN KEY (fuente_financiamiento_id) REFERENCES public.cat_fuentes_financiamiento(id);


--
-- Name: vinculos_laborales vinculos_laborales_personal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.vinculos_laborales
    ADD CONSTRAINT vinculos_laborales_personal_id_fkey FOREIGN KEY (personal_id) REFERENCES public.personal(id) ON DELETE CASCADE;


--
-- Name: vinculos_laborales vinculos_laborales_tipo_personal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.vinculos_laborales
    ADD CONSTRAINT vinculos_laborales_tipo_personal_id_fkey FOREIGN KEY (tipo_personal_id) REFERENCES public.cat_tipos_personal(id);


--
-- Name: vinculos_laborales vinculos_laborales_unidad_servicio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hitdev
--

ALTER TABLE ONLY public.vinculos_laborales
    ADD CONSTRAINT vinculos_laborales_unidad_servicio_id_fkey FOREIGN KEY (unidad_servicio_id) REFERENCES public.cat_unidades_servicios(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO hitdev;


--
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO hitdev;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO hitdev;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO hitdev;


--
-- PostgreSQL database dump complete
--

\unrestrict hN84d1qY29sk5cspGCY0cVFmSlsaWQrGqQ4A4Q3uTAmyHDNxmJRHAhydUqvXX7U

