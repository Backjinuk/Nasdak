package org.nasdakgo.nasdak.Config;

import lombok.extern.log4j.Log4j2;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Component
@Aspect
@Log4j2
public class LoggingAspect {

    @Around("controllerMethod() || serviceMethod()")
    public Object doBasicProfiling(ProceedingJoinPoint joinPoint) throws Throwable {
        log.info(joinPoint.getTarget().getClass().getSimpleName()+" start : "+joinPoint.getSignature().getName());
        Object result = joinPoint.proceed(joinPoint.getArgs());
        log.info(joinPoint.getTarget().getClass().getSimpleName()+" end : "+joinPoint.getSignature().getName());
        return result;
    }

    @Pointcut("within(org..Service..*)")
    public void inServiceLayer() {}

    @Pointcut("execution(* org..Service.*.*(..))")
    public void serviceMethod() {}

    @Pointcut("within(org..Controller..*)")
    public void inControllerLayer() {}

    @Pointcut("execution(* org..Controller.*.*(..))")
    public void controllerMethod() {}
}
