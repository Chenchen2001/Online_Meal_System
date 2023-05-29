package com.sky.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class PasswordEditDTO implements Serializable {

    private Long empId; //员工id
    private String oldPassword;    //旧密码
    private String newPassword;    //新密码
}
