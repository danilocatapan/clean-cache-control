import { CacheStore } from '@/data/protocols/cache'
import { LocalSavePurchases } from '@/data/usecases/'

class CacheStoreSpy implements CacheStore {
  key = '';
  deleteCallsCount = 0;
  insertCallsCount = 0;

  delete (key: string): void {
    this.key = key;
    this.deleteCallsCount++
  }
}

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
    await sut.save();
    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.key).toBe('purchases');
  });

  test('Should not insert new Cache if delete fails', async () => {
    const { cacheStore, sut } = makeSut();
    jest.spyOn(cacheStore, 'delete').mockImplementationOnce(() => { throw new Error() });
    const promise = sut.save();
    expect(cacheStore.insertCallsCount).toBe(0);
    expect(promise).rejects.toThrow()
  });

});
