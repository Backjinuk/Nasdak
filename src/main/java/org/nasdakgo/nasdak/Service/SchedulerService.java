package org.nasdakgo.nasdak.Service;

import Utils.Delay;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;

@Log4j2
@Service
@RequiredArgsConstructor
public class SchedulerService {

    private final TaskScheduler taskScheduler;

    private final Map<String, ScheduledFuture<?>> schedulerMap = new ConcurrentHashMap<>();
    private final Map<String, ScheduledFuture<?>> timerMap = new ConcurrentHashMap<>();

    public void addScheduler(String scheduleId, Runnable task, Duration period) throws Exception {
        if(schedulerMap.get(scheduleId)!=null) throw new RuntimeException("The ID already exists.");

        ScheduledFuture<?> future = taskScheduler.scheduleAtFixedRate(task, period);

        schedulerMap.put(scheduleId, future);
    }

    public void removeScheduler(String scheduleId) {
        ScheduledFuture<?> future = schedulerMap.get(scheduleId);
        if(future!=null){
            future.cancel(true);
            log.info(scheduleId+"를 종료합니다.");
        }

        schedulerMap.remove(scheduleId);
    }

    public void addTimer(String timerId, Runnable task, Delay delay){
        this.addTimer(timerId, task, delay, true);
    }

    public void addTimer(String timerId, Runnable task, Delay delay, boolean isReset){
        if(isReset) this.removeTimer(timerId);

        ScheduledFuture<?> future = taskScheduler.schedule(getTaskForTimer(task, timerId), delay.getInstant());

        timerMap.put(timerId, future);
    }

    public void removeTimer(String timerId) {
        ScheduledFuture<?> future = timerMap.get(timerId);
        if(future!=null){
            future.cancel(true);
            log.info(timerId+"를 종료합니다.");
        }

        timerMap.remove(timerId);
    }

    private Runnable getTaskForTimer(Runnable task, String timerId){
        return ()->{
            task.run();
            this.removeTimer(timerId);
        };
    }

}