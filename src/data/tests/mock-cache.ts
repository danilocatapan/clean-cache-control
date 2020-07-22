import { CacheStore } from '@/data/protocols/cache';
import { SavePurchases } from '@/domain/usecases';

export class CacheStoreSpy implements CacheStore {
  deleteKey = '';
  insertKey = '';
  deleteCallsCount = 0;
  insertCallsCount = 0;
  insertValues: Array<SavePurchases.Params> = [];

  delete(key: string): void {
    this.deleteKey = key;
    this.deleteCallsCount++;
  }

  insert(key: string, value: any): void {
    this.insertKey = key;
    this.insertCallsCount++;
    this.insertValues = value;
  }

  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
      throw new Error();
    });
  }

  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
      throw new Error();
    });
  }
}
