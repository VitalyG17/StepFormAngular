export class ServerResponse {
  public id: number;
  public name: string;
  public costPerPerson: number;

  constructor(id: number, name: string, costPerPerson: number) {
    this.id = id;
    this.name = name;
    this.costPerPerson = costPerPerson;
  }
}
