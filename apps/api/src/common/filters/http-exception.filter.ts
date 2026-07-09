import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { Prisma } from "@prisma/client";

type HttpResponse = {
  status: (statusCode: number) => {
    json: (body: unknown) => void;
  };
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<HttpResponse>();

    if (
      exception instanceof Prisma.PrismaClientKnownRequestError &&
      exception.code === "P2002"
    ) {
      const fields = Array.isArray(exception.meta?.target)
        ? exception.meta.target.filter((field): field is string => typeof field === "string")
        : [];

      response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        error: {
          message: "Ja existe um registro cadastrado com este valor.",
          fields
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const body =
      exception instanceof HttpException
        ? exception.getResponse()
        : "Erro interno inesperado";

    response.status(status).json({
      statusCode: status,
      error: typeof body === "string" ? body : body,
      timestamp: new Date().toISOString()
    });
  }
}
