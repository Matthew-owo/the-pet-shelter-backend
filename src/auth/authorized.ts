import { Context } from "koa";

export const isAuthorized = (opts: {
  hasRole: Array<"user" | "employee">;
  allowSameUser?: boolean;
}) => {
  return async (ctx: Context, next: Function) => {
    const { uid, email, role } = ctx.state.currentUser;
    const { id } = ctx.params;

    if (opts.allowSameUser && id && uid === id) return await next();

    if (!role) return ctx.throw(403, "Forbidden");

    if (opts.hasRole.includes(role)) return await next();

    return ctx.throw(403, "Forbidden");
  };
};
