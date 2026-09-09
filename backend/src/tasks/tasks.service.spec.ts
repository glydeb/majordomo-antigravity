import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { EncryptionService } from '../auth/encryption.service.js';

describe('TasksService', () => {
  let service: TasksService;
  let prisma: PrismaService;
  let encryptionService: EncryptionService;

  const mockPrismaService = {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockEncryptionService = {
    encrypt: jest.fn(),
    decrypt: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: EncryptionService, useValue: mockEncryptionService },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prisma = module.get<PrismaService>(PrismaService);
    encryptionService = module.get<EncryptionService>(EncryptionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should encrypt title, description, dueDate and save', async () => {
      const userId = 'user-1';
      const dto = { title: 'Test Task', description: 'Desc', dueDate: '2023-12-01' };
      
      mockEncryptionService.encrypt
        .mockReturnValueOnce('enc-title')
        .mockReturnValueOnce('enc-desc')
        .mockReturnValueOnce('enc-date');
        
      mockPrismaService.task.create.mockResolvedValue({
        id: 'task-1', userId, status: 'Inbox', title: 'enc-title', description: 'enc-desc', dueDate: 'enc-date'
      });
      
      mockEncryptionService.decrypt
        .mockReturnValueOnce('Test Task')
        .mockReturnValueOnce('Desc')
        .mockReturnValueOnce('2023-12-01');

      const result = await service.create(userId, dto);
      
      expect(mockEncryptionService.encrypt).toHaveBeenCalledTimes(3);
      expect(mockPrismaService.task.create).toHaveBeenCalledWith({
        data: {
          userId,
          status: 'Inbox',
          title: 'enc-title',
          description: 'enc-desc',
          dueDate: 'enc-date'
        }
      });
      expect(result.title).toBe('Test Task');
    });
  });

  describe('findAllForUser', () => {
    it('should decrypt fetched tasks', async () => {
      const userId = 'user-1';
      mockPrismaService.task.findMany.mockResolvedValue([
        { id: '1', title: 'enc-t1', userId },
        { id: '2', title: 'enc-t2', userId }
      ]);
      mockEncryptionService.decrypt.mockReturnValue('decrypted');

      const result = await service.findAllForUser(userId);
      
      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith({ where: { userId } });
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('decrypted');
      expect(mockEncryptionService.decrypt).toHaveBeenCalledTimes(2);
    });
  });

  describe('findOne', () => {
    it('should find task, verify ownership and decrypt', async () => {
      const userId = 'user-1';
      mockPrismaService.task.findUnique.mockResolvedValue({ id: '1', title: 'enc', userId });
      mockEncryptionService.decrypt.mockReturnValue('decrypted');

      const result = await service.findOne('1', userId);
      expect(result.title).toBe('decrypted');
    });

    it('should throw NotFoundException if ownership mismatch', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue({ id: '1', title: 'enc', userId: 'other-user' });
      await expect(service.findOne('1', 'user-1')).rejects.toThrow('Task not found');
    });
  });

  describe('update', () => {
    it('should encrypt changed fields and update', async () => {
      const userId = 'user-1';
      mockPrismaService.task.findUnique.mockResolvedValue({ id: '1', userId });
      mockEncryptionService.encrypt.mockReturnValue('enc-new');
      mockPrismaService.task.update.mockResolvedValue({ id: '1', userId, title: 'enc-new' });
      mockEncryptionService.decrypt.mockReturnValue('decrypted');

      const result = await service.update('1', userId, { title: 'new title' });
      
      expect(mockEncryptionService.encrypt).toHaveBeenCalledWith('new title');
      expect(mockPrismaService.task.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { title: 'enc-new' }
      });
      expect(result.title).toBe('decrypted');
    });
  });

  describe('remove', () => {
    it('should verify ownership and delete', async () => {
      const userId = 'user-1';
      mockPrismaService.task.findUnique.mockResolvedValue({ id: '1', userId });
      mockPrismaService.task.delete.mockResolvedValue({ id: '1' });

      await service.remove('1', userId);
      expect(mockPrismaService.task.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});
