import { z } from "zod";

import { OrderStatusEnum } from "@/core/domain/enums/OrderStatusEnum";
import { convertZodSchemaToDocsTemplate } from "@/drivers/webserver/utils/convertZodSchemaToDocsTemplate";
import { generateSchemaFromSampleObject } from "@/drivers/webserver/utils/generateSchemaFromSampleObject";

import { UpdateOrderStatusViewModel } from "../viewModel/UpdateOrderStatusViewModel";
import { tag } from "./constants";

export const updateOrderStatusPathParametersSchema = z.object({
  id: z.string(),
});

export const updateOrderStatusPayloadSchema = z.object({
  status: z.nativeEnum(OrderStatusEnum),
});

const responseExample: UpdateOrderStatusViewModel = {
  orderId: "123",
  status: "pending",
};

export const updateOrderStatusDocSchema = {
  tags: [tag],
  description: `Update ${tag} status`,
  params: convertZodSchemaToDocsTemplate({
    schema: updateOrderStatusPathParametersSchema,
  }),
  body: {
    type: "object",
    properties: {
      status: { type: "string", enum: Object.values(OrderStatusEnum) },
    },
  },
  response: {
    200: generateSchemaFromSampleObject(responseExample),
  },
};
