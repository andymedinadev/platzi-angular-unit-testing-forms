export class Person {
  constructor(
    public name: string,
    public lastName: string,
    public age: number,
    public weight: number,
    public height: number
  ) {}

  calcIMC(): string {
    const imc = this.weight / (this.height * this.height);
    const roundedIMC = Math.round(imc);

    if (roundedIMC < 0 || roundedIMC === Infinity) {
      return 'not found';
    }

    if (roundedIMC <= 18) {
      return 'down';
    } else if (roundedIMC <= 24) {
      return 'normal';
    } else if (roundedIMC <= 26) {
      return 'overweight';
    } else if (roundedIMC <= 29) {
      return 'overweight level 1';
    } else if (roundedIMC <= 39) {
      return 'overweight level 2';
    } else {
      return 'overweight level 3';
    }
  }
}
