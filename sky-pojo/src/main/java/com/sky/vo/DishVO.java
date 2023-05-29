package com.sky.vo;

import com.sky.entity.DishFlavor;
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
public class DishVO implements Serializable {

    private Long id;
    private String name;  //菜品名称
    private Long categoryId;    //菜品分类id
    private BigDecimal price;    //菜品价格
    private String image;    //图片
    private String description;    //描述信息
    private Integer status;    //0 停售 1 起售
    private LocalDateTime updateTime;    //更新时间
    private String categoryName;    //分类名称
    private List<DishFlavor> flavors = new ArrayList<>();    //菜品关联的口味
    //private Integer copies;
}
