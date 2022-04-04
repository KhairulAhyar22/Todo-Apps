//buat array books variable custom event
const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener("DOMContentLoaded", function(){
    const submitForm = document.getElementById("inputBook");
    submitForm.addEventListener("submit", function(Event){
        Event.preventDefault();
        addBook();
    });

    if (isStorageExist()){
        loadDataBook ();
    };
});
/*Function ini untuk mendapatkan Inputan dan push ke array*/
function addBook(){
    const inputTitle = document.getElementById("inputBookTitle").value;
    const inputAuthor = document.getElementById("inputBookAuthor").value;
    const inputYear = document.getElementById("inputBookYear").value;
    const getID = getid();

    const bookObject = getBookObject(getID, inputTitle, inputAuthor, inputYear, false);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
};

function getid(){
    return +new Date();
}

function getBookObject(id, title, author, year, isCompeleted){
    return{
        id, 
        title, 
        author, 
        year, 
        isCompeleted
    }
}

//Custum even 
document.addEventListener(RENDER_EVENT, function(){ 
    const incompleteBook = document.getElementById("incompleteBookshelfList");
    incompleteBook.innerText = "";

    const completedBook = document.getElementById("completeBookshelfList");
    completedBook.innerText = "";

    for (itemBook of books){
        const elemenBook = makeBook(itemBook);
    
    if(itemBook.isCompeleted == false)
        incompleteBook.append(elemenBook);
    else 
        completedBook.append(elemenBook);
    }
});
//Nomor 3.Buat elemen ke web, tempat nilai ditampilkan
function makeBook(bookObject){
    const bookTitle = document.createElement("h3");
    bookTitle.innerText = bookObject.title;

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = "Pengarang : "+bookObject.author;

    const bookYear = document.createElement("p");
    bookYear.innerText = "Tahun Terbit: "+bookObject.year;
    const textArticle = document.createElement("article");

    textArticle.classList.add("book_item");
    textArticle.append(bookTitle, bookAuthor, bookYear);

    if (bookObject.isCompeleted == true){
        const undoButton = document.createElement("button");
        undoButton.classList.add("yellow");
        undoButton.innerText = "Tandai Belum Baca";

        undoButton.addEventListener("click", function(){
            undoTaskToCompleted(bookObject.id);
            saveData();
        });
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("red");
        deleteButton.innerText = "Hapus"; 
        //function click delete dengan method confirm
        deleteButton.addEventListener("click", function () {
            let confirmation = confirm ("Apakah Anda Yakin Akan Hapus? ");
            if (confirmation == true){
                removeTaskToCompleted(bookObject.id);
                saveData();
                alert("File Telah Dihapus");
            } else {
                alert("Anda Menekan Tombol Batal");
            }
        });
        textArticle.append(undoButton, deleteButton);
    }else{
        const checkButton = document.createElement("button");
        checkButton.classList.add("yellow");
        checkButton.innerText = "Selesai di Baca";

        checkButton.addEventListener("click", function () {
            addTaskToCompleted(bookObject.id);
            saveData();
        });
        const keyBook = document.createElement("button");
        keyBook.classList.add("brown");
        keyBook.innerText = "Kunci";
        
        keyBook.addEventListener("click", function () {
            undoTaskToCompleted(bookObject.id);
            saveData();
        });
        textArticle.append(checkButton, keyBook);
    }
    return textArticle;
}

// untuk mengubah nilai menjadi true dan untuk tombol check
function addTaskToCompleted(bookid){
    const bookTarget = findBook(bookid);
    if(bookTarget == null) return;

    bookTarget.isCompeleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
}
function findBook(bookid){
    for (itemBook of books){
        if(itemBook.id === bookid){
            return itemBook;
        }
    }
    return null
}
// untuk mengubah nilai menjadi false dan untuk tombol undo
function undoTaskToCompleted(bookid){
    const bookTarget = findBook(bookid);
    if(bookTarget == null) return;

    bookTarget.isCompeleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
}
function removeTaskToCompleted(bookid){
    const bookTarget = findBookTarget(bookid);
    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
}
function findBookTarget(bookid){
    for(index in books){
        if (books[index].id === bookid){
            return index
        }
    }
    return -1
}
//buat variabel event custom dan itemstorage/key
const SAVED_EVENT = "savebook";
const LOCAL_KEY ="bookapp"

function isStorageExist(){
    if(typeof(Storage) === undefined){
        alert("Browser Kamu Tidak Mendukung Local Storage");
        return false
    }
    return true
}
function saveData(){
    if(isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(LOCAL_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}
document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(LOCAL_KEY));
});
//MENAMPILKAN DATA TERSIMPAN SAAT BARU LOAD
function loadDataBook (){
    const dataStringLocal = localStorage.getItem(LOCAL_KEY);
    let dataJsonLocal = JSON.parse(dataStringLocal);

    if (dataJsonLocal !== null){
        for (data of dataJsonLocal){
            books.push(data);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}
