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
public class OrderStatisticsVO implements Serializable {

    private Integer toBeConfirmed; //待接单数量
    private Integer confirmed;    //待派送数量
    private Integer deliveryInProgress;    //派送中数量
}
