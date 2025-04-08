import { Person } from './index';

describe('Tests for Person', () => {
  let person: Person;

  beforeEach(() => {
    person = new Person('TestName', 'TestLastName', 40, 40, 1.65);
  });

  it('Attributes', () => {
    expect(person.name).toEqual('TestName');
    expect(person.lastName).toEqual('TestLastName');
    expect(person.age).toEqual(40);
  });

  describe('Tests for calcIMC', () => {
    it('should return the string: "down"', () => {
      // Arrange
      person.weight = 40;
      person.height = 1.65;

      // Act
      const rta = person.calcIMC();

      // Assert
      expect(rta).toEqual('down');
    });

    it('should return the string: "normal"', () => {
      // Arrange
      person.weight = 58;
      person.height = 1.65;

      // Act
      const rta = person.calcIMC();

      // Assert
      expect(rta).toEqual('normal');
    });

    it('should return the string: "overweight"', () => {
      // Arrange
      person.weight = 75;
      person.height = 1.7;

      // Act
      const rta = person.calcIMC();

      // Assert
      expect(rta).toEqual('overweight');
    });

    it('should return the string: "overweight level 1"', () => {
      // Arrange
      person.weight = 90;
      person.height = 1.75;

      // Act
      const rta = person.calcIMC();

      // Assert
      expect(rta).toEqual('overweight level 1');
    });

    it('should return the string: "overweight level 2"', () => {
      // Arrange
      person.weight = 100;
      person.height = 1.75;

      // Act
      const rta = person.calcIMC();

      // Assert
      expect(rta).toEqual('overweight level 2');
    });

    it('should return the string: "overweight level 3"', () => {
      // Arrange
      person.weight = 120;
      person.height = 1.7;

      // Act
      const rta = person.calcIMC();

      // Assert
      expect(rta).toEqual('overweight level 3');
    });

    it('should return the string: "not found"', () => {
      // Arrange
      person.weight = 120;
      person.height = 0;

      // Act
      const rta = person.calcIMC();

      // Assert
      expect(rta).toEqual('not found');
    });
  });
});
