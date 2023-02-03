<script setup lang="ts">
</script>

<template>
  <pre>
    @ApiModelProperty("项目id")
    private Long fkProjectId;

    @ApiModelProperty("开发版名称")
    private String name;

    @ApiModelProperty("是否是建议使用的版本 1=是 0=不是")
    private Integer isSuggestUse;

    @ApiModelProperty("是否废弃 1=是 0=不是")
    private Integer isDiscard;

    @ApiModelProperty("是否不可用 0=可用 1=不可用")
    private Integer isDisabled;

    @ApiModelProperty("开发版描述")
    private String description;

    @ApiModelProperty("数据库用户名")
    private String databaseUsername;

    @ApiModelProperty("数据库密码")
    private String databasePassword;

    @ApiModelProperty("数据库名称")
    private String databaseName;

    @ApiModelProperty("数据库类型")
    private Integer databaseType;

    @ApiModelProperty("数据库host")
    private String databaseHost;

    @ApiModelProperty("数据库端口")
    private String databasePort;

    @ApiModelProperty("依赖的模块名称列表")
    private String moduleNames;
  </pre>
</template>

<style scoped>

</style>
