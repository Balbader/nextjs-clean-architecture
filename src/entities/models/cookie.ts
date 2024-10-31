/**
 * Cookie Entity Model
 * 
 * This file defines the core Cookie entity as part of the Clean Architecture pattern.
 * It represents the most basic and pure business rules and data structures for cookies
 * in our application. As an entity model, it is independent of any frameworks, databases,
 * or external concerns. This model can be used across different use cases and is not
 * affected by changes to outer layers of the application.
 * 
 * The Cookie type represents the fundamental structure of a cookie with its name,
 * value, and associated attributes that control its behavior in the browser.
 */

type CookieAttributes = {
  secure?: boolean;
  path?: string;
  domain?: string;
  sameSite?: 'lax' | 'strict' | 'none';
  httpOnly?: boolean;
  maxAge?: number;
  expires?: Date;
};

export type Cookie = {
  name: string;
  value: string;
  attributes: CookieAttributes;
};
