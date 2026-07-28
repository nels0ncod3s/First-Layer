import { supabase } from "$lib/supabase";

export async function signup(email, password) {
  return await supabase.auth.signUp({
    email,
    password,
  });
}

export async function login(email, password) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function logout() {
  return await supabase.auth.signOut();
}

export async function requestPasswordReset(email) {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/confirm?next=/reset-password`,
  });
}

export async function updatePassword(password) {
  return await supabase.auth.updateUser({ password });
}

export async function getSession() {
  return await supabase.auth.getSession();
}

// Verifies the 6-digit code from the "Confirm signup" email (requires the
// template to use {{ .Token }} instead of the default {{ .ConfirmationURL }}
// — see SUPABASE_OTP_SETUP.md). On success this establishes a real session,
// same as clicking a confirmation link would have.
export async function verifySignupOtp(email, token) {
  return await supabase.auth.verifyOtp({ email, token, type: "signup" });
}

export async function resendSignupOtp(email) {
  return await supabase.auth.resend({ type: "signup", email });
}
