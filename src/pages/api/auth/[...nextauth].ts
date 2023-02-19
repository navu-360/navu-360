import NextAuth from "next-auth";
import { authOptions } from "../../../auth/auth";

export default NextAuth(authOptions);
