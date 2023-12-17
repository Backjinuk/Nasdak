//package Utils;//package Utils;
//
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.SignatureAlgorithm;
//import io.jsonwebtoken.io.Decoders;
//import io.jsonwebtoken.security.Keys;
//
//import java.nio.charset.StandardCharsets;
//import java.security.Key;
//import java.util.Date;
//
//public class JwtUtil {
//
//    public static String getUserName(String token, String secretKey){
//        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token)
//                .getBody().get("userName", String.class);
//    }
//
//    public static String createJwt(String userName, String secretKey, Long expireMs){
//        Claims claims = Jwts.claims();
//
//        claims.put("userName", userName);
//        byte[] keybytes = Decoders.BASE64.decode(secretKey);
//        Key key = Keys.hmacShaKeyFor(keybytes);
//
//        return Jwts.builder()
//                .setClaims(claims)
//                .setIssuedAt(new Date(System.currentTimeMillis()))
//                .setExpiration(new Date(System.currentTimeMillis() + expireMs))
//                .signWith(key)
//                .compact();
//    }
//
//    public static boolean isExpired(String token, String secretKey) {
//       return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token)
//                .getBody().getExpiration().before(new Date());
//    }
//}
