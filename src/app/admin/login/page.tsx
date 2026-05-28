import { redirect } from "next/navigation";

// Admin sign-in now uses the same email+password / Google OAuth flow as
// students. This route is kept only so existing bookmarks/links to
// /admin/login don't 404.
export default function AdminLoginRedirect() {
  redirect("/auth/login?redirect=/admin");
}
