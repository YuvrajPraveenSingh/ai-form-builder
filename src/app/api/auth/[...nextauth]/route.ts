
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db"; 


const handler = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!, 
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});
export { handler as GET, handler as POST };
