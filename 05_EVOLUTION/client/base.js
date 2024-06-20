class _plant {
    constructor(name, maxFood, food, growFood, maxShield, carnivorous) {
        this.name = name;
        this.continent;
        this.internals = [];
        this.maxFood = maxFood;
        this.food = food;
        this.growFood = growFood;
        this.maxShield = maxShield;
        this.shield = maxShield;
        this.carnivorous = carnivorous;
        this.id = -1;
    }
}
class _entity {
    constructor(name) {
        this.starvation = 0;
        this.necFood = 1;
        this.continent;
        this.internals = {};
        this.id = -1;
        this.owner = name;
    }
}

class _card {
    constructor(name, description, addStarv, addProps) {
        this.name = name;               /* card name */
        this.addStarv = addStarv;       /* adding extra starving value */
        this.prop = addProps;       /* adding properties to entity */
        this.description = description; /* card properties description */
    }
}

/* gamer class */
class _user {
    constructor() {
        this.ready = false; /* ends all turns until phase end */
        this.cards = [];    /* cards on hands */
        this.entity = [];   /* entities on field */
        this.lider = false; /* is gamew leader or not */
    }
    move() {
    };
}

/* all game cards, later will be in data base */
export let cards = [
new _card("Большой", "Может быть съедено только хищником со свойством БОЛЬШОЙ", 1, {name: "big", value: true}),
new _card("Быстрое", "", 0, {name: "fast", value: true}),
new _card("Взаимодействие", "", 0, {name: "communication", value: true}),
new _card("Водоплавающее", "", 0, {name: "swimming", value: true}),
new _card("Камуфляж", "Может быть атаковано только хищником со свойством ОСТРОЕ ЗРЕНИЕ", 0, {name: "camouflage", value: true}),
new _card("Мимикрия", "Когда животное атаковано первый раз, атака направляется на другое животное", 0, {name: "mimicry", value: true}),
new _card("Норное", "Когда животное накомлено, оно не может быть атаковано хищником", 0, {name: "burrow", value: true}),
new _card("Острое зрение", "Хищник с этим свойством может атаковать животное со свойством КАМУФЛЯЖ", 0, {name:"sharp vision", value: true}),
new _card("Отбрасывание хвоста", "", 0, {name:'tail loss', value: true}),
new _card("Падальщик", "", 0, {name:'scavenger', value: true}),
new _card("Паразит", "", 0, {name:'parasite', value: true}),
new _card("Пиратство", "", 0, {name:'piracy', value: true}),
new _card("Симбиоз", "", 0, {name:'symbiosis', value: true}),
new _card("Сотрудничество", "", 0, {name:'cooperation', value: true}),
new _card("Хищник", "", 0, {name:'carnivorous', value: true}),
new _card("Хищник", "", 0, {name:'carnivorous', value: true}),
new _card("Хищник", "", 0, {name:'carnivorous', value: true}),
new _card("Хищник", "", 0, {name:'carnivorous', value: true}),
new _card("Хищник", "", 0, {name:'carnivorous', value: true}),
new _card("Хищник", "", 0, {name:'carnivorous', value: true}),
new _card("Хищник", "", 0, {name:'carnivorous', value: true}),
new _card("Хищник", "", 0, {name:'carnivorous', value: true}),
new _card("Хищник", "", 0, {name:'carnivorous', value: true}),
];
export let plants = [
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Многолетник", 5, 3, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
new _plant("Однолетник", 3, 2, 1, 0, false),
]
export {_card, _user, _entity, _plant};
export function rand() {
    return Math.trunc(Math.abs(Math.trunc(Math.random() * Math.pow(47, Math.random() * 10)) / Math.trunc(Math.pow(20, Math.random())) - Math.trunc(Math.pow(1047, Math.random())))) % 2047;
}
export function grow(plant) {
    plant.food += plant.growFood;
    if (plant.food > plant.maxFood)
        plant.food = plant.maxFood;
    plant.shield = plant.maxShield;
}