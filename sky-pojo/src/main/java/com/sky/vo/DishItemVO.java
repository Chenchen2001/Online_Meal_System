package com.sky.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DishItemVO implements Serializable {

    private String name;  //菜品名称
    private Integer copies;    //份数
    private String image;    //菜品图片
    private String description;    //菜品描述
}
