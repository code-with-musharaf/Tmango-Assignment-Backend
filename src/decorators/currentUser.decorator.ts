import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const user: string = ctx.switchToHttp().getRequest()?.user ?? null;
    return user;
  },
);
