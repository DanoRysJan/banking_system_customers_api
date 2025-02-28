export class AddAddressCommand {
  constructor(
    public readonly customerId: string,
    public readonly street: string,
    public readonly city: string,
    public readonly state: string,
    public readonly postalCode: string,
    public readonly country: string,
  ) {}
}
