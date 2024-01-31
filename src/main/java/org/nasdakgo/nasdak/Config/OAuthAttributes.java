package org.nasdakgo.nasdak.Config;

import lombok.Data;
import org.nasdakgo.nasdak.Entity.SNSType;

import java.util.HashMap;
import java.util.Map;

@Data
public class OAuthAttributes {
    private Map<String, Object> attributes;
    private String nameAttributeKey;
    private SNSType type;
    private String snsId;
    private String email;
    private String phone;

    public OAuthAttributes(Map<String, Object> attributes, String nameAttributeKey, String snsId, SNSType type) {
        this.attributes = attributes;
        this.nameAttributeKey = nameAttributeKey;
        this.snsId = snsId;
        this.type = type;
    }

    public OAuthAttributes() {
    }

    // 해당 로그인인 서비스가 kakao인지 google인지 구분하여, 알맞게 매핑을 해주도록 합니다.
    // 여기서 registrationId는 OAuth2 로그인을 처리한 서비스 명("google","kakao","naver"..)이 되고,
    // userNameAttributeName은 해당 서비스의 map의 키값이 되는 값이됩니다. {google="sub", kakao="id", naver="response"}
    public static OAuthAttributes of(String registrationId, String userNameAttributeName, Map<String, Object> attributes) {
        return switch (registrationId) {
//            case "google" -> ofGoogle(userNameAttributeName, attributes);
            case "kakao" -> ofKakao(userNameAttributeName, attributes);
            case "naver" -> ofNaver(userNameAttributeName, attributes);
            default -> throw new RuntimeException();
        };
    }

    private static OAuthAttributes ofKakao(String userNameAttributeName, Map<String, Object> attributes) {
        Map<String, Object> kakao_account = (Map<String, Object>) attributes.get("kakao_account");  // 카카오로 받은 데이터에서 계정 정보가 담긴 kakao_account 값을 꺼낸다.
//        Map<String, Object> phone = (Map<String, Object>) kakao_account.get("phone");   // 마찬가지로 profile(nickname, image_url.. 등) 정보가 담긴 값을 꺼낸다.
        String snsId = attributes.get("id").toString();

        OAuthAttributes oAuthAttributes = new OAuthAttributes(attributes, userNameAttributeName, snsId, SNSType.KAKAO);
        if(kakao_account.containsKey("email")){
            oAuthAttributes.setEmail(kakao_account.get("email").toString());
        }
        return oAuthAttributes;
    }

    private static OAuthAttributes ofNaver(String userNameAttributeName, Map<String, Object> attributes) {
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");    // 네이버에서 받은 데이터에서 프로필 정보다 담긴 response 값을 꺼낸다.
        String snsId = response.get("id").toString();

        OAuthAttributes oAuthAttributes = new OAuthAttributes(attributes, userNameAttributeName, snsId, SNSType.NAVER);
        if(response.containsKey("email")){
            oAuthAttributes.setEmail(response.get("email").toString());
        }
        if(response.containsKey("mobile")){
            oAuthAttributes.setPhone(response.get("mobile").toString().replaceAll("-",""));
        }
        return oAuthAttributes;
    }

//    private static OAuthAttributes ofGoogle(String userNameAttributeName, Map<String, Object> attributes) {
//        OAuthAttributes oAuthAttributes = new OAuthAttributes(attributes,
//                userNameAttributeName);
//        return oAuthAttributes;
//    }

    public Map<String, Object> getAttributes(){
        Map<String, Object> map = new HashMap<>();
        map.put(nameAttributeKey, snsId);
        map.put("email", email);
        map.put("phone", phone);
        map.put("type", type);
        map.put("key", nameAttributeKey);
        return map;
    }

}
