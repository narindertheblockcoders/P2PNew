import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProviders from "next-auth/providers/credentials";
import jwt_decode from "jwt-decode";

export default NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 5500,
  },
  providers: [
    CredentialsProviders({
      name: "Custom Provider",
      async authorize(credentials) {
        let { email, password } = credentials;
        
        let data = { email: email, password: password };
        
        let response = await axios.post(
          "https://api.orthomatri.com/api/v1/auth/adminlogin",
          data
        );
        let user = response.data;
        let token = response.data.data
        var decoded = jwt_decode(token);
        // 
        let iat = decoded.id;
        
        if (!token) {
          throw new Error("Invalid token");
        }
        if (!(response.status == 200)) {
          throw new Error("Invalid Credentials" + email);
        }
        if (response.status == 200) {
          return (user = {
            name: token,
            email: iat,
          });
        }
      },
    }),
  ],
});
