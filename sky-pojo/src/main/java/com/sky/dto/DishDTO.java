package com.sky.dto;

import com.sky.entity.DishFlavor;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
public class DishDTO implements Serializable {

    private Long id;
    private String name;    //菜品名称
    private Long categoryId;    //菜品分类id
    private BigDecimal price;    //菜品价格
    private String image;    //图片
    private String description;    //描述信息
    private Integer status;    //0 停售 1 起售
    private List<DishFlavor> flavors = new ArrayList<>();    //口味
}
