let items = [];
let adding = false;
let error = null;
let filter = 0;

function findById(id){
    return this.items.find(currentItem => currentItem.id === id);
};

function findAndUpdate(id, newData){
    let currentItem = this.findById(id);
    Object.assign(currentItem, newData);
};

function addItem(item){
    this.items.push(item);
}

function findAndDelete(id){
    this.items = this.items.filter(currentItem => currentItem.id !== id);
};
  
function toggleAdding(){
    console.log(this);
    this.adding = !this.adding;
};
  
function setError(error) {
    this.error = error;
};

export default{
    items,
    adding,
    error,
    filter,
    findById,
    findAndUpdate,
    addItem,
    findAndDelete,
    toggleAdding,
    setError
}