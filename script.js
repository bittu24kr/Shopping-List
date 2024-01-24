const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const filterInput = document.getElementById('filter');
const editBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems(){
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach((item) => {
        addItemToDOM(item);
    })
}

function onAddItemSubmit(e) {
    e.preventDefault();
    const newItem = itemInput.value;
    if (newItem === '') {
        alert('Please add an item!');
        return;
    }
    
    if(isEditMode){
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeitemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-item');
        itemToEdit.remove();
        isEditMode=false;
        if(checkItemExists(newItem)){
            alert('item already exists!');
            itemInput.value = '';
            return;
        }

    }else{
        if(checkItemExists(newItem)){
            alert('item already exists!');
            itemInput.value = '';
            return;
        }
    }

    //add item to DOM
    addItemToDOM(newItem);
    //add item to Storage
    addItemToStorage(newItem);

    ClearUI();
    itemInput.value = '';
}

function createNewItem(value) {
    //create list
    const li = document.createElement('li');
    li.append(document.createTextNode(value));
    //create button and icon 
    const button = document.createElement('button');
    button.className = 'remove-item btn-link text-red';
    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-xmark';
    button.appendChild(icon);
    //append button in list
    li.appendChild(button);
    return li;
}

function addItemToDOM(item){
    itemList.appendChild(createNewItem(item));
    itemInput.value = '';
    ClearUI();
}

function addItemToStorage(item){
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.push(item);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage(){
    let itemsFromStorage = [];
    if(localStorage.getItem('items') != null){
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage;
}

function checkItemExists(item){
    const itemsFromStorage = getItemsFromStorage();

    if(itemsFromStorage.includes(item)){
        return true;
    }else{
        return false;
    }
}

function setItemToEdit(itemNew){

    itemList.querySelectorAll('li').forEach(item => {
        item.classList.remove('edit-mode');
    }); 
    const input = itemForm.querySelector('input');
    
    itemNew.classList.add('edit-mode');
    
    editBtn.innerHTML = '<i class ="fa-solid fa-pen"></i> Update Item';
    editBtn.style.backgroundColor = '#228B22';
    input.value = itemNew.textContent;
    isEditMode = true;


    console.log(editBtn);
}

function removeitemFromStorage(item){
    let itemsFromStorage = getItemsFromStorage();
    itemsFromStorage = itemsFromStorage.filter(i => i!=item);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function onClickItem(e){
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    }else{
        setItemToEdit(e.target);
    }
}


function removeItem(item) {
    if (confirm('Are you sure?')) {
        //remove from DOM
        item.remove();

        //remove from Local Storage
        removeitemFromStorage(item.textContent.trim());
        ClearUI();
    }
}

function filterItems(e) {
    const text = e.target.value.toLowerCase();
    const items = document.querySelectorAll('li');
    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if (itemName.indexOf(text) != -1) {
            item.style.display = 'flex';
        }
        else{
            item.style.display = 'none';
        }

    });

}

function clearItem() {

    if (confirm('Are you sure to Clear All items?')) {
        while (itemList.firstChild) {
            itemList.firstChild.remove();
        }
        localStorage.removeItem('items');
    }
    ClearUI();
}

function ClearUI() {
    itemInput.value = '';

    if (itemList.querySelectorAll('li').length === 0) {
        clearBtn.style.display = 'none';
        filterInput.style.display = 'none';
    }
    else {
        clearBtn.style.display = 'block';
        filterInput.style.display = 'block';
    }

    editBtn.innerHTML = '<i class "fa-solid fa-plus"></i> Add Item';
    editBtn.style.backgroundColor = '#333';
}

function inRun() {
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', clearItem);
    filterInput.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded',displayItems);

    ClearUI();
}
inRun();


