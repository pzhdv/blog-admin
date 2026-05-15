/** 系统管理相关枚举 */

import type { EnumValue } from './util';

/**
 * 用户性别
 *
 * - 1: 男
 * - 2: 女
 */
export enum UserGender {
  /** 男 */
  MALE = 1,
  /** 女 */
  FEMALE = 2
}

export type UserGenderValue = EnumValue<typeof UserGender>;

/**
 * 菜单类型
 *
 * - 1: 目录
 * - 2: 菜单
 */
export enum MenuType {
  /** 目录 */
  DIRECTORY = 1,
  /** 菜单 */
  MENU = 2
}

export type MenuTypeValue = EnumValue<typeof MenuType>;

/**
 * 图标类型
 *
 * - 1: 图标库图标（Iconify）
 * - 2: 本地图标
 */
export enum IconType {
  /** 图标库图标（Iconify） */
  ICONIFY = 1,
  /** 本地图标 */
  LOCAL = 2
}

export type IconTypeValue = EnumValue<typeof IconType>;

/** 请求方式枚举 */
export enum RequestMethod {
  /** DELETE 删除 */
  DELETE = 'DELETE',
  /** GET 查询 */
  GET = 'GET',
  /** POST 新增 */
  POST = 'POST',
  /** PUT 修改 */
  PUT = 'PUT'
}

/** 请求方法值类型 */
export type RequestMethodValue = EnumValue<typeof RequestMethod>;
