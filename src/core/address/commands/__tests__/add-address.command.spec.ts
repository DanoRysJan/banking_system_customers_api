import { AddAddressCommand } from '../add-address.command';

describe('AddAddressCommand', () => {
  it('should create an instance with correct properties', () => {
    const customerId = '123e4567-e89b-12d3-a456-426614174000';
    const street = '123 Main St';
    const city = 'New York';
    const state = 'NY';
    const postalCode = '10001';
    const country = 'USA';

    const command = new AddAddressCommand(
      customerId,
      street,
      city,
      state,
      postalCode,
      country,
    );

    expect(command).toBeDefined();
    expect(command.customerId).toBe(customerId);
    expect(command.street).toBe(street);
    expect(command.city).toBe(city);
    expect(command.state).toBe(state);
    expect(command.postalCode).toBe(postalCode);
    expect(command.country).toBe(country);
  });
});
