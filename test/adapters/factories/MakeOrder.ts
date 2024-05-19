/* eslint-disable default-param-last */

import { UniqueEntityId } from "@/core/domain/base/entities/UniqueEntityId";
import { Order, OrderProps } from "@/core/domain/entities/Order";
import { OrderStatusEnum } from "@/core/domain/enums/OrderStatusEnum";
import { PaymentMethodEnum } from "@/core/domain/enums/PaymentMethodEnum";
import { OrderStatus } from "@/core/domain/valueObjects/OrderStatus";
import { PaymentMethod } from "@/core/domain/valueObjects/PaymentMethod";
import { faker } from "@faker-js/faker";

import { makeUser } from "./MakeUser";

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityId
): Order {
  const user = makeUser();

  const newOrder = new Order(
    {
      userId: new UniqueEntityId(user.id.toString()),
      status: new OrderStatus({ name: OrderStatusEnum.IN_PREPARATION }),
      paymentMethod: new PaymentMethod({ name: PaymentMethodEnum.QR_CODE }),
      totalPrice: faker.number.float(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...override,
    },
    id
  );

  return newOrder;
}
