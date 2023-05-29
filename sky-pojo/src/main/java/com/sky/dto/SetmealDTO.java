package com.sky.dto;

import com.sky.entity.SetmealDish;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
public class SetmealDTO implements Serializable {

    private Long id;
    private Long categoryId;    //分类id
    private String name;    //套餐名称
    private BigDecimal price;    //套餐价格
    private Integer status;    //状态 0:停用 1:启用
    private String description;    //描述信息
    private String image;    //图片
    private List<SetmealDish> setmealDishes = new ArrayList<>();    //套餐菜品关系
}
