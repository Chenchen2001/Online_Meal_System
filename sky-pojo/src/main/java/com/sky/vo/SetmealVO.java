package com.sky.vo;

import com.sky.entity.SetmealDish;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SetmealVO implements Serializable {

    private Long id;
    private Long categoryId;    //分类id
    private String name;    //套餐名称
    private BigDecimal price;    //套餐价格
    private Integer status;    //状态 0:停用 1:启用
    private String description;    //描述信息
    private String image;    //图片
    private LocalDateTime updateTime;    //更新时间
    private String categoryName;    //分类名称
    private List<SetmealDish> setmealDishes = new ArrayList<>();    //套餐和菜品的关联关系
}
