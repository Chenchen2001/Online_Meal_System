package com.sky.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class CategoryPageQueryDTO implements Serializable {

    private int page;       //页码
    private int pageSize;    //每页记录数
    private String name;    //分类名称
    private Integer type;    //分类类型 1菜品分类  2套餐分类
}
