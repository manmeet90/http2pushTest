class Person{
    constructor(fname, lname, age){
        this.fname = fname;
        this.lname = lname;
        this.age = age;
    }

    getInfo(){
        return `Hi I am ${this.fname} ${this.lname} age ${this.age} yrs.`;
    }
}