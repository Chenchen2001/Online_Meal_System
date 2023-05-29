package com.sky.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * 套餐菜品关系
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SetmealDish implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;
    private Long setmealId;    //套餐id
    private Long dishId;    //菜品id
    private String name;    //菜品名称 （冗余字段）
    private BigDecimal price;    //菜品原价
    private Integer copies;    //份数
}
