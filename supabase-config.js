const SUPABASE_URL = "https://gblrvlheofmpfhwcdtza.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_5JBPZj8aQAOD6CkS40aQQQ_Reg1294g";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);