export default function logout() {
  sessionStorage.removeItem("userNo");
  sessionStorage.removeItem("userId");
  sessionStorage.removeItem("snsType");
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("userDto");
  sessionStorage.removeItem("kakao_06a030f7f03c18b697e34eb62b59e642");
}
