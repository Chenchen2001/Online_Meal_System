package com.sky.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

@Configuration
@Slf4j
public class Knife4jConfiguration {

    /**
     * 通过knife4j生成接口文档：管理端接口文件
     *
     * @return
     */
    @Bean
    public Docket docket1() {
        ApiInfo apiInfo = new ApiInfoBuilder().title("苍穹外卖项目接口文档").version("2.0").description("苍穹外卖项目接口文档").build();

        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo)
                .groupName("01-管理端接口文档") //分组名称
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.sky.controller.admin")) //设置扫描包范围
                .paths(PathSelectors.any())
                .build();
    }


    /**
     * 通过knife4j生成接口文档：用户端接口文档
     *
     * @return
     */
    @Bean
    public Docket docket2() {
        ApiInfo apiInfo = new ApiInfoBuilder().title("苍穹外卖项目接口文档").version("2.0").description("苍穹外卖项目接口文档").build();

        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo)
                .groupName("02-用户端接口文档") //分组名称
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.sky.controller.user")) //设置扫描包范围
                .paths(PathSelectors.any())
                .build();
    }

}
