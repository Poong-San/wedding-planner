import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// 허용된 이메일 목록 (쉼표 구분 환경변수)
function getAllowedEmails(): string[] {
  const raw = process.env.ALLOWED_EMAILS || "";
  return raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      const allowed = getAllowedEmails();
      // ALLOWED_EMAILS가 비어있으면 모두 차단
      if (allowed.length === 0) return false;
      const email = user.email?.toLowerCase() || "";
      return allowed.includes(email);
    },
    async session({ session, token }) {
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
});
