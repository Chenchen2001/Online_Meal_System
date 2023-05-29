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
public class UserReportVO implements Serializable {

    private String dateList;   //日期，以逗号分隔，例如：2022-10-01,2022-10-02,2022-10-03
    private String totalUserList;    //用户总量，以逗号分隔，例如：200,210,220
    private String newUserList;    //新增用户，以逗号分隔，例如：20,21,10
}
