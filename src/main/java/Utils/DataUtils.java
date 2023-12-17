package Utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DataUtils {

    private static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm";

    // 현재 날짜와 시간을 yyyy-MM-dd HH:mm 형식으로 문자열로 변환
    public static String getCurrentDateTimeAsString() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern(DATE_TIME_FORMAT));
    }

    // 주어진 날짜와 시간을 yyyy-MM-dd HH:mm 형식으로 문자열로 변환
    public static String formatDateTime(LocalDateTime dateTime) {
        return dateTime.format(DateTimeFormatter.ofPattern(DATE_TIME_FORMAT));
    }

    // 주어진 문자열을 yyyy-MM-dd HH:mm 형식으로 LocalDateTime으로 파싱
    public static LocalDateTime parseDateTime(String dateTimeString) {
        return LocalDateTime.parse(dateTimeString, DateTimeFormatter.ofPattern(DATE_TIME_FORMAT));
    }
}