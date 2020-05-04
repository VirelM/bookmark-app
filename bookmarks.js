import store from './store.js';
import api from './api.js';

function generateStar(rating){
    let whitestar = 5 - rating;
    let stars = [];
    for(let i=0;i<rating;i++){
        stars.push('&#9733');
    }
    for(let i=0;i<whitestar;i++){
        stars.push('&#9734');
    }
    stars = stars.join(' ');
    return stars
}

function generateItemElement(item){
    let stars = generateStar(item.rating)
    return `<li class="js-expand" data-item-id="${item.id}"><p class="expand2">${item.title}<span>${stars}</span></p><p class="bookmarkTitle expand hidden">${item.title} <button class="js-delete">&#128465</button></p>
    <div class="expand hidden"><button class="visit" alt='visit bookmark button' type='button'>visit site</button> ${item.rating} ★</div>
    <p class="description expand hidden"> ${item.description} </p></li>`
}

const generateBookmarkItemsString = function (bookmarks) {
    const bookmarksAll = bookmarks.map((bookmark) => generateItemElement(bookmark));
    return bookmarksAll.join('');
};

function render(){
    let items = [...store.items];
    if(store.filter > 0){
        items = items.filter(item => 1 == item.rating);
        
    }
    
    

    const bookmarkListItemsString = generateBookmarkItemsString(items);

    $('.bookmarksList').html(bookmarkListItemsString);
    
}

function filterB(){
    $('select').change(function(){
        store.filter = $('select option:selected').val();
    })
    render();
}

function newBookmarkClick(){
    $('.newBookmark').click(function(){
        $('section').addClass('hidden');
        $('main').append(
            `<form id="js-form">
            <label>Add new bookmark:</label><br>
            <input type="text" name="inputUrl" class="inputUrl" placeholder="https://www.example.com/"><br><br>
            
            <div class="div">
                <input type="text" name="inputTitle" class="inputTitle" placeholder="title">
                <ul class="rating">
                    <li>
                        Rating
                    </li>
                    <li>
                        <input type="radio" id="5" name="star" value="5">
                        <label for="5">5 ★</label>
                    </li>
                    <li>
                        <input type="radio" id="4" name="star" value="4">
                        <label for="4">4 ★</label>
                    </li>
                    <li>
                        <input type="radio" id="3" name="star" value="3">
                        <label for="3">3 ★</label>
                    </li>
                    <li>
                        <input type="radio" id="2" name="star" value="5">
                        <label for="2">2 ★</label>
                    </li>
                    <li>
                        <input type="radio" id="1" name="star" value="1">
                        <label for="1">1 ★</label>
                    </li>
                </ul>
                <textarea name="description" rows="10" cols="40" placeholder="Add a description(Optional)"></textarea>
            </div>
            <div class="containerBtn">
                <button class="button" type="reset">Cancel</button>
                <button id="submitBtn" class="button" type="submit">Create</button>
            </div>
        </form>`
        );
    })
}
//action="https://thinkful-list-api.herokuapp.com/virel/bookmarks" method="POST"
function handleNewItemSubmit(){
    $('main').on('click','#submitBtn', function (event) {
        event.preventDefault();
        const newItemUrl = $('.inputUrl').val();
        $('.inputUrl').val("");
        const newItemTitle = $('.inputTitle').val();
        $('.inputTitle').val("");
        const newItemRating = $('input:radio[name=star]:checked').val();
        const newItemDescription = $('textarea').val();
        $('textarea').val("");
        api.createItem(newItemTitle,newItemUrl,newItemDescription,newItemRating)
            .then((newItem) => {
                store.addItem(newItem);
                console.log(newItem);
                $('#js-form').addClass('hidden');
                $('section').removeClass('hidden');
                render();
            })
            .catch(err => {
                store.setError(err.message);
                render();
            });
    });
  };

function getItemIdFromElement(item){
    return $(item)
      .data('item-id');
};

function getItemIdFromParentElement(item){
    console.log($(item).parent().parent().data('item-id'));
    return $(item).parent().parent().data('item-id');
};

function expand(id){
    $(`li[data-item-id=${id}]`).find('.expand2').toggleClass('hidden');
    $(`li[data-item-id=${id}]`).find(`.expand`).toggleClass('hidden');
}

function handleItemExpansion() {
    $('.bookmarksList').on('click', '.js-expand', event => {
        const id = getItemIdFromElement(event.currentTarget)
        let item = store.findById(id);
        expand(id);
        // api.updateItem(id, {expansion: !item.checked})
        //     .then(() => {
        //         store.findAndUpdate(id, {expansion: !item.expansion});
        //         render();
        //     })
        //     .catch(err => {
        //         store.setError(err.message);
        //         render();
        //     });
            
    });
};

function handleDeleteItemClicked() {
    $('main').on('click', '.js-delete', event => {
        event.preventDefault();
        const id = getItemIdFromParentElement(event.currentTarget);
        api.deleteItem(id)
            .then(() => {
            store.findAndDelete(id);
            render();
            })
        .catch(err => {
            store.setError(err.message);
            render();
        });
    });
};



function bindEventListeners(){
    newBookmarkClick();
    handleNewItemSubmit();
    handleItemExpansion();
    handleDeleteItemClicked();
    filterB();
}
export default{
    bindEventListeners,
    render
}