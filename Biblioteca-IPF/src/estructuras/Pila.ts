export class Pila<T> {
  #items: T[] = [];

  apilar(item: T): void {
    this.#items.push(item);
  }

  desapilar(): T | undefined {
    return this.#items.pop();
  }

  get tamanio(): number {
    return this.#items.length;
  }

  get tope(): T | undefined {
    return this.#items[this.#items.length - 1];
  }

  aArray(): T[] {
    return [...this.#items];
  }
}
