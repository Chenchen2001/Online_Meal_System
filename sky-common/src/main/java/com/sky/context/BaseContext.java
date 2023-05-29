package com.sky.context;

/**
 * 维护线程变量ThreadLocal的工具类
 */
public class BaseContext {

    public static ThreadLocal<Long> threadLocal = new ThreadLocal<>();

    /**
     * 先当前线程中存数据
     *
     * @param id
     */
    public static void setCurrentId(Long id) {
        threadLocal.set(id);
    }

    /**
     * 从当前线程中获取数据
     *
     * @return
     */
    public static Long getCurrentId() {
        return threadLocal.get();
    }

    /**
     * 从当前线程中移除数据
     */
    public static void removeCurrentId() {
        threadLocal.remove();
    }

}
