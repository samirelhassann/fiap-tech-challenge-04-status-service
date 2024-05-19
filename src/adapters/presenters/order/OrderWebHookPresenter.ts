import { FastifyReply, FastifyRequest } from "fastify";

import { orderWebhookPayloadSchema } from "@/adapters/controllers/orderStatus/schema/OrderWebHookSchema";
import {
  OrderWebHookUseCaseRequestDTO,
  OrderWebHookUseCaseResponseDTO,
} from "@/core/useCases/orderStatus/dto/OrderWebHookUseCaseDTO";

import { ErrorHandlingPresenter } from "../base/ErrorHandlingPresenter";
import { IControllerPresenter } from "../base/IControllerPresenter";

export class OrderWebHookPresenter
  extends ErrorHandlingPresenter
  implements
    IControllerPresenter<
      OrderWebHookUseCaseRequestDTO,
      OrderWebHookUseCaseResponseDTO,
      void
    >
{
  convertToUseCaseDTO(req: FastifyRequest): OrderWebHookUseCaseRequestDTO {
    const { resource: platformOrderId } = orderWebhookPayloadSchema.parse(
      req.body
    );

    return {
      platformOrderId,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  async sendResponse(res: FastifyReply) {
    return res.status(200).send();
  }
}
