package org.nasdakgo.nasdak.Config;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class LoggingAspect {

    @Around("controllerMethod() || serviceMethod()")
    public Object doBasicProfiling(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println(joinPoint.getTarget().getClass().getSimpleName()+" start : "+joinPoint.getSignature().getName());
        Object result = joinPoint.proceed(joinPoint.getArgs());
        System.out.println(joinPoint.getTarget().getClass().getSimpleName()+" end : "+joinPoint.getSignature().getName());
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
