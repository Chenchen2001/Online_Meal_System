package com.sky.vo;

import com.sky.entity.OrderDetail;
import com.sky.entity.Orders;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderVO extends Orders implements Serializable {

    /**
     * OrderVO 继承至 Orders
     * OrderVO extends Orders
     */

    private String orderDishes;   //订单菜品信息
    private List<OrderDetail> orderDetailList;    //订单详情
}
