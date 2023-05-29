package com.sky.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class EmployeePageQueryDTO implements Serializable {

    private String name;    //员工姓名
    private int page;    //页码
    private int pageSize;    //每页显示记录数
}
