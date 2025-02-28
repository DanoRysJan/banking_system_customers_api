import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepositoryImpl } from '../user.repository.impl';
import { User } from '../../../../user/domain/models/user.entity';

describe('UserRepositoryImpl', () => {
  let repository: UserRepositoryImpl;
  let mockRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepositoryImpl,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    repository = module.get<UserRepositoryImpl>(UserRepositoryImpl);
    mockRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const user = new User();
      user.id = userId;
      jest.spyOn(mockRepository, 'findOneBy').mockResolvedValue(user);

      const result = await repository.findById(userId);
      expect(result).toEqual(user);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
    });

    it('should return null if user not found', async () => {
      jest.spyOn(mockRepository, 'findOneBy').mockResolvedValue(null);

      const result = await repository.findById('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('findByUsername', () => {
    it('should return a user if found by username', async () => {
      const username = 'johndoe';
      const user = new User();
      user.username = username;
      jest.spyOn(mockRepository, 'findOneBy').mockResolvedValue(user);

      const result = await repository.findByUsername(username);
      expect(result).toEqual(user);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ username });
    });
  });

  describe('findByEmail', () => {
    it('should return a user if found by email', async () => {
      const email = 'test@example.com';
      const user = new User();
      user.email = email;
      jest.spyOn(mockRepository, 'findOneBy').mockResolvedValue(user);

      const result = await repository.findByEmail(email);
      expect(result).toEqual(user);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ email });
    });
  });

  describe('create', () => {
    it('should create and save a user', async () => {
      const userData = { username: 'newuser', email: 'new@example.com' };
      const user = new User();
      Object.assign(user, userData);

      jest.spyOn(mockRepository, 'create').mockReturnValue(user);
      jest.spyOn(mockRepository, 'save').mockResolvedValue(user);

      const result = await repository.create(userData);
      expect(result).toEqual(user);
      expect(mockRepository.create).toHaveBeenCalledWith(userData);
      expect(mockRepository.save).toHaveBeenCalledWith(user);
    });
  });
});
