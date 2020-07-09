import { CacheStore } from '@/data/protocols/cache'
import { LocalSavePurchases } from '@/data/usecases/'
import { SavePurchases } from '@/domain/usecases/save-purchases';

class CacheStoreSpy implements CacheStore {
  deleteKey = '';
  insertKey = '';
  deleteCallsCount = 0;
  insertCallsCount = 0;
  insertValues: Array<SavePurchases.Params> = []

  delete (key: string): void {
    this.deleteKey = key;
    this.deleteCallsCount++;
  };

  insert (key: string, value: any): void {
    this.insertKey = key;
    this.insertCallsCount++;
    this.insertValues = value;
  };

  simulateDeleteError (): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => { throw new Error() });
  }
}

const mockPurchases = (): Array<SavePurchases.Params> => [{
  id: '1',
  date: new Date(),
  value: 50
},{
  id: '2',
  date: new Date(),
  value: 100
}]

type SutTypes = {
  sut: LocalSavePurchases
  cacheStore: CacheStoreSpy
}

const makeSut = (): SutTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalSavePurchases(cacheStore);
  return {
    cacheStore,
    sut
  }
}
describe('LocalSavePurchases', () => {
  test('Should not delete cache on sut.init', () => {
    const { cacheStore } = makeSut();
    new LocalSavePurchases(cacheStore);
    expect(cacheStore.deleteCallsCount).toBe(0);
  });

  test('Should delete old cache on sut.save', async () => {
    const { cacheStore, sut } = makeSut();
    await sut.save(mockPurchases());
    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.deleteKey).toBe('purchases');
  });

  test('Should not insert new Cache if delete fails', () => {
    const { cacheStore, sut } = makeSut();
    cacheStore.simulateDeleteError();
    const promise = sut.save(mockPurchases());
    expect(cacheStore.insertCallsCount).toBe(0);
    expect(promise).rejects.toThrow();
  });

  test('Should insert new Cache if delete success', async () => {
    const { cacheStore, sut } = makeSut();
    const purchases = mockPurchases();
    await sut.save(purchases);
    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.insertCallsCount).toBe(1);
    expect(cacheStore.insertKey).toBe('purchases');
    expect(cacheStore.insertValues).toEqual(purchases);
  });
});
