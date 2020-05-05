import store from "./store.js";

const BASE_URL = 'https://thinkful-list-api.herokuapp.com/virel/bookmarks';

function listApiFetch(...args) {
    let error;
    return fetch(...args)
        .then(res => {
        if (!res.ok) {
          // Valid HTTP response but non-2xx status - let's create an error!
            error = { code: res.status };
        }
        // In either case, parse the JSON stream:
        return res.json();
        })

        .then(data => {
        // If error was flagged, reject the Promise with the error object
        if (error) {
            error.message = data.message;
            return Promise.reject(error);
        }
        // Otherwise give back the data as resolved Promise
        return data;
        })
}

function getItems(){
    return listApiFetch(BASE_URL)

};

function createItem(title,url,description,rating){
    let newItem = {
        "title": title,
        "url":url,
        "desc":description,
        "rating":rating
    };
    let newItemString = JSON.stringify(newItem);
    console.log(newItem);
    return listApiFetch(BASE_URL,{
        method:'POST',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: newItemString
    }) 
};


function updateItem(id, updateData) {
    return listApiFetch(`${BASE_URL}/${id}`,{
        method: 'PATCH',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify(updateData)
    }) 
};

function deleteItem(id) {
    return listApiFetch(`${BASE_URL}/${id}`,{
        method:'DELETE',
        headers: new Headers({'Content-Type': 'application/json'})
    }) 
};

export default{
    getItems,
    createItem,
    updateItem,
    deleteItem
}