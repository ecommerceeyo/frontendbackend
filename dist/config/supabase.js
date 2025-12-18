"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSupabaseConfigured = exports.STORAGE_BUCKET = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase credentials not configured. Storage uploads will fall back to local storage.');
}
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
exports.STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'images';
const isSupabaseConfigured = () => {
    return !!(supabaseUrl && supabaseServiceKey && supabaseUrl !== 'https://your-project.supabase.co');
};
exports.isSupabaseConfigured = isSupabaseConfigured;
exports.default = exports.supabase;
//# sourceMappingURL=supabase.js.map