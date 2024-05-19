import { DomainEvents } from "@/core/domain/base/events/DomainEvents";
import { PaginationParams } from "@/core/domain/base/PaginationParams";
import { PaginationResponse } from "@/core/domain/base/PaginationResponse";
import { Order } from "@/core/domain/entities/Order";
import { OrderStatus } from "@/core/domain/valueObjects/OrderStatus";
import { IOrderComboItemRepository } from "@/core/interfaces/repositories/IOrderComboItemRepository";
import { IOrderRepository } from "@/core/interfaces/repositories/IOrderRepository";

export class InMemoryOrderRepository implements IOrderRepository {
  public items: Order[] = [];

  constructor(private orderComboItemRepository: IOrderComboItemRepository) {}

  async findManyByStatuses(statuses: OrderStatus[]): Promise<Order[]> {
    const filteredItems = this.items.filter((p) =>
      statuses.some((status) => p.status.name === status.name)
    );

    return filteredItems;
  }

  async findMany(
    { page, size }: PaginationParams,
    status?: OrderStatus,
    userId?: string
  ): Promise<PaginationResponse<Order>> {
    const filteredItems = this.items.filter(
      (p) =>
        (status ? p.status === status : true) &&
        (userId ? p.userId?.toString() === userId : true)
    );

    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / size);

    const data = filteredItems.slice((page - 1) * size, page * size);

    return new PaginationResponse<Order>({
      data,
      totalItems,
      currentPage: page,
      pageSize: size,
      totalPages,
    });
  }

  async findManyByUserId(
    params: PaginationParams,
    userId: string
  ): Promise<PaginationResponse<Order>> {
    const filteredItems = this.items.filter(
      (order) => order.userId?.toString() === userId
    );

    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / params.size);

    const data = filteredItems.slice(
      (params.page - 1) * params.size,
      params.page * params.size
    );

    return new PaginationResponse<Order>({
      data,
      totalItems,
      currentPage: params.page,
      pageSize: params.size,
      totalPages,
    });
  }

  async findById(id: string): Promise<Order | null> {
    const answer = this.items.find((a) => a.id.toString() === id);

    return answer ?? null;
  }

  async create(order: Order): Promise<Order> {
    this.items.push(order);

    this.orderComboItemRepository.createMany(order.combos.getItems());

    DomainEvents.dispatchEventsForAggregate(order.id);

    return order;
  }

  async update(order: Order): Promise<Order> {
    const index = this.items.findIndex((a) => a.id === order.id);

    if (index === -1) {
      throw new Error("Order not found");
    }

    this.items[index] = order;

    DomainEvents.dispatchEventsForAggregate(order.id);

    return order;
  }
}
