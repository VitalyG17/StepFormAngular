export class ServerResponse {
  public id: number;
  public name: string;
  public costPerPerson: number;
  public cost: number;

  constructor(id: number, name: string, costPerPerson: number, cost: number) {
    this.id = id;
    this.name = name;
    this.costPerPerson = costPerPerson;
    this.cost = cost;
  }
}
