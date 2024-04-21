SELECT proname AS function_name
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace; -- Filter by schema if needed
