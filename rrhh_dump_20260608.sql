--
-- PostgreSQL database dump
--

\restrict Jqp4JO3EZT7LWXsB3HWP1Hf921pEY91yCvmhbzSUllY3eE2k0QVy95HxkYTecEi

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
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: hitdev
--

COMMENT ON SCHEMA public IS '';


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: hitdev
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


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

\unrestrict Jqp4JO3EZT7LWXsB3HWP1Hf921pEY91yCvmhbzSUllY3eE2k0QVy95HxkYTecEi

