export class Cola<T> {
  #items: { [key: number]: T } = {};
  #frente: number = 0;
  #final: number = 0;

  encolar(item: T): void {
    this.#items[this.#final] = item;
    this.#final++;
  }

  desencolar(): T | undefined {
    if (this.tamanio === 0) return undefined;
    const item = this.#items[this.#frente];
    delete this.#items[this.#frente];
    this.#frente++;
    return item;
  }

  get tamanio(): number {
    return this.#final - this.#frente;
  }

  alFrente(): T | undefined {
    return this.tamanio > 0 ? this.#items[this.#frente] : undefined;
  }

  aArray(): T[] {
    const array: T[] = [];
    for (let i = this.#frente; i < this.#final; i++) {
      array.push(this.#items[i]);
    }
    return array;
  }
}
