import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const WsUserId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToWs();
  return request.getClient().user.id;
});
