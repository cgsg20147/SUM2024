let id = 0;
class _plant {
    constructor(continent, maxFood, food, growFood, maxShield, carnivorous) {
        this.continent = continent;
        this.internals = [];
        this.maxFood = maxFood;
        this.food = food;
        this.growFood = growFood;
        this.maxShield = maxShield;
        this.shield = maxShield;
        this.carnivorous = carnivorous;
        this.id = id++;
    }
    grow() {
        this.food += this.growFood;
        if (this.food > this.maxFood)
            this.food = this.maxFood;
        this.shield = this.maxShield;
    }
}
class _entity {
    constructor() {
        this.starvation = 0;
        this.necFood = 1;
        this.continent;
        this.internals = [];
        this.id = id;
    }
}

class _card {
    constructor(name, description, addStarv, addProps) {
        this.name = name;               /* card name */
        this.addStarv = addStarv;       /* adding extra starving value */
        this.addProps = addProps;       /* adding properties to entity */
        this.description = description; /* card properties description */
    }
    /* setting new property to entity function */
    set(entity) {
        for (let i = 0; i < this.addProps.length; i++)
            entity[this.addProps[i].name] = this.addProps[i].prop
        entity.internals[this.name] = {props: this.addProps, description: this.description};
        entity.necFood += this.addStarv;
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
new _card("Большой", "Может быть съедено только хищником со свойством БОЛЬШОЙ", 1, {name: "big", prop: true}),
new _card("Быстрое", "", 0, {name: "fast", prop: () => {return (Math.random() % 6 + 1 > 3 ? true : false)}}),
new _card("Взаимодействие", "", 0, {name: "communication", prop: () => {}}),
new _card("Водоплавающее", "", 0, {name: "swimming", prop: true}),
new _card("Камуфляж", "", 0, {name: "camouflage", prop: true}),
new _card("Мимикрия", "", 0, {name: "mimicry", prop: "choose"}),
new _card("Норное", "", 0, {name: "burrow", prop: "state"}),
new _card("Острое зрение", "", 0, {name:"sharp vision", prop: true}),
new _card("Отбрасывание хвоста", "", 0, {name:'tail loss', prop: "choose"}),
new _card("Падальщик", "", 0, {name:'scavenger', prop: "choose"}),
new _card("Паразит", "", 0, {name:'parasite', prop: true}),
new _card("Пиратство", "", 0, {name:'piracy', prop: "choose"}),
new _card("Симбиоз", "", 0, {name:'symbiosis', prop: true}),
new _card("Сотрудничество", "", 0, {name:'cooperation', prop: () => {}}),
];
export let plants = [

]
export {_card, _user, _entity, _plant};
export function rand() {
    return Math.abs(Math.trunc(Math.random * Number(new Date())) >> Math.trunc(Math.pow(20, Math.random)) - Math.trunc(Math.pow(1047, Math.random))) % 2047;
}