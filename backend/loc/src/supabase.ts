require("dotenv").config();
import { createClient } from "@supabase/supabase-js";
const supabaseUri = process.env.SUPABASE_URI;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = async () => {
  try {
    if (!supabaseKey) {
      console.error("SECRET_KEY is undefined. Check the .env");
      return;
    }

    if (!supabaseUri) {
      console.error("SECRET_URI is undefined. Check the .env");
      return;
    }

    const supabaseClient = createClient(supabaseUri, supabaseKey);
    console.log("Connected to Supabase Successful");
    return supabaseClient;
  } catch (error) {
    console.log(error);
  }
};

export default supabase;
