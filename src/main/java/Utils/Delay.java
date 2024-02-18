package Utils;

import lombok.Getter;

import java.time.Duration;
import java.time.Instant;

@Getter
public class Delay {

    protected Delay(){};

    private Instant instant;

    public static Delay ofDays(long delay){
        Delay d = new Delay();
        d.instant = Instant.now().plus(Duration.ofDays(delay));
        return d;
    }

    public static Delay ofHours(long delay){
        Delay d = new Delay();
        d.instant = Instant.now().plus(Duration.ofHours(delay));
        return d;
    }

    public static Delay ofMinutes(long delay){
        Delay d = new Delay();
        d.instant = Instant.now().plus(Duration.ofMinutes(delay));
        return d;
    }

    public static Delay ofSeconds(long delay){
        Delay d = new Delay();
        d.instant = Instant.now().plus(Duration.ofSeconds(delay));
        return d;
    }

    public static Delay ofMillis(long delay){
        Delay d = new Delay();
        d.instant = Instant.now().plus(Duration.ofMillis(delay));
        return d;
    }
}
