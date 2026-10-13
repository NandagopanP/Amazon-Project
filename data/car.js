class Car {
  #brand;
  #model;
  speed = 0;
  isTrunkOpen;

  constructor(brand, model){
    this.#brand = brand;
    this.#model = model;
  }
  displayInfo() {
    console.log(`Brand: ${this.#brand}, Model: ${this.#model}, Speed: ${this.speed} km/h, trunk open? ${this.isTrunkOpen}`);
  }

  go(){
    if(!this.isTrunkOpen){
    this.speed += 5;
    if(this.speed<0){
      console.log("Speed is less than 0")
    }else if(this.speed>100){
      console.log("OverSpeed!!")
    }
  }else{
    console.log("Cant move, Trunk is open")
  }
  
  }

  brake(){
    this.speed -= 5;
    if(this.speed<0){
      console.log("Speed is less than 0")
    }else if(this.speed>100){
      console.log("OverSpeed!!")
    }
  }

  openTrunk(){
    this.isTrunkOpen = true;
  }

  closeTrunk(){
    this.isTrunkOpen = false;
  }
}

class RaceCar extends Car {
  acceleration;

  constructor(brand, model, acceleration) {
    super(brand, model);
    this.acceleration = acceleration;
  }

  go() {
    this.speed = Math.min(300, this.speed + this.acceleration);
  }

  openTrunk() {
    console.log("Race cars don't have trunks!");
  }

  closeTrunk() {
    console.log("Race cars don't have trunks!");
  }
}

const car1 = new Car("Toyota", "Corolla");
const car2 = new RaceCar("Ferrari", "SF90", 50);


car1.go();
car1.go();
car2.brake();
car1.displayInfo();
car2.displayInfo();
car2.openTrunk();
car2.go();
car2.displayInfo();