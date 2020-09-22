export default interface ICacheProvider {
  save(key: string, value: any): Promise<void>;
  // <T> means that recover receives a Type argument
  recover<T>(key: string): Promise<T | null>;
  // Invalidade (delete) cache
  invalidate(key: string): Promise<void>;
  // Invalide (delete) all caches that start with a given prefix
  invalidatePrefix(prefix: string): Promise<void>;
}
