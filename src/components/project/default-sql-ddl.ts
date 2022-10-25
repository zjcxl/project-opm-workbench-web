export default `drop table if exists system_user;
create table if not exists system_user
(
    id               bigint(20)                           not null comment '主键id' primary key,
    account          varchar(50)                          null comment '账号',
    password         varchar(100)                         null comment '密码',
    is_disable       tinyint(1) default 0                 null comment '是否禁用 1=禁用 0=可用',
    state            tinyint(1) default 1                 null comment '账号状态 1=正常 2=审核 3=冻结',
    from_type        tinyint(1) default 0                 null comment '账号来源 0=未知 1=系统用户添加 2=个人注册',
    client_id        varchar(100)                         null comment '客户端id 为空标识都可以登录（多个用,分隔）',
    last_login       datetime                             null comment '最后一次登录时间',
    ban_end_time     datetime                             null comment '账号封禁结束时间',
    freeze_end_time  datetime                             null comment '账号冻结结束时间',
    remark           varchar(500)                         null comment '备注信息',
    create_user_id   bigint(20)                           null comment '创建人用户id',
    create_user_name varchar(50)                          null comment '创建人用户名',
    gmt_create       datetime   default current_timestamp null comment '创建时间',
    update_user_id   bigint(20)                           null comment '更新人用户id',
    update_user_name varchar(50)                          null comment '更新人用户名',
    gmt_modified     datetime   default current_timestamp null on update current_timestamp comment '更新时间',
    is_deleted       tinyint(1) default 0                 null comment '逻辑删除字段（0=存在 1=删除）',
    version          int        default 0                 null comment '数据版本号'
) comment '系统用户表' charset = utf8mb4;

drop table if exists system_user_info;
create table if not exists system_user_info
(
    id               bigint(20)                           not null comment '主键id' primary key,
    fk_user_id       bigint(20)                           null comment '用户id',
    name             varchar(50)                          null comment '名称',
    phone            varchar(20)                          null comment '手机号',
    email            varchar(50)                          null comment '邮箱',
    gender           tinyint(1)                           null comment '性别 1=男 2=女 0=保密',
    avatar           varchar(255)                         null comment '头像',
    introduction     varchar(500)                         null comment '介绍',
    remark           varchar(500)                         null comment '备注信息',
    create_user_id   bigint(20)                           null comment '创建人用户id',
    create_user_name varchar(50)                          null comment '创建人用户名',
    gmt_create       datetime   default current_timestamp null comment '创建时间',
    update_user_id   bigint(20)                           null comment '更新人用户id',
    update_user_name varchar(50)                          null comment '更新人用户名',
    gmt_modified     datetime   default current_timestamp null on update current_timestamp comment '更新时间',
    is_deleted       tinyint(1) default 0                 null comment '逻辑删除字段（0=存在 1=删除）',
    version          int        default 0                 null comment '数据版本号'
) comment '系统用户基本信息表' charset = utf8mb4;

create index fk_user_id on system_user_info (fk_user_id);
`
