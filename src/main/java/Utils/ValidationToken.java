package Utils;

import java.time.LocalDateTime;

public class ValidationToken {

    private final String code;
    private final LocalDateTime localDateTime = LocalDateTime.now();

    public ValidationToken(String code){
        this.code = code;
    }

    public boolean validateToken(String code){
        boolean tokenValidation = this.code.equals(code);
        boolean timeValidation = validateTime();
        return tokenValidation && timeValidation;
    }

    public boolean validateTime(){
        long expiresMinutes = 5;
        return !LocalDateTime.now().isAfter(localDateTime.plusMinutes(expiresMinutes));
    }

    public boolean validateToken(String code, LocalDateTime now){
        boolean tokenValidation = this.code.equals(code);
        boolean timeValidation = validateTime(now);
        return tokenValidation && timeValidation;
    }

    public boolean validateTime(LocalDateTime now){
        long expiresMinutes = 5;
        return !now.isAfter(localDateTime.plusMinutes(expiresMinutes));
    }

    public boolean validateCode(String code) {
        return this.code.equals(code);
    }
}
