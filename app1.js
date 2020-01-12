const TaskInput = document.querySelector("#TaskInput");
const AddTask = document.querySelector("#AddTask");
const filter = document.querySelector("#filterTask")
const ul = document.querySelector("#UlList");
const clearTask = document.querySelector("#clearTasks");
const filterTaskDisplay = document.querySelector("#filterTaskArea");

//Event Listeners
document.addEventListener("DOMContentLoaded", getTasks)//Document loaded
AddTask.addEventListener("click", addtask)
clearTask.addEventListener("click", clearTasks);
filter.addEventListener("keyup", filterTasks);

//helper functions

function addtask(e) {
    e.preventDefault()

    let checkbox = document.createElement('p');
    checkbox.style.display = "inline-block"
    checkbox.innerHTML = `<label>
    <input type="checkbox" onclick="check" />
    <span></span>
  </label>`
    let listItem = document.createElement('li');
    listItem.className = "collection-item";
    listItem.appendChild(checkbox);
    let p = document.createElement("p");
    p.appendChild(document.createTextNode(TaskInput.value))
    listItem.appendChild(p);
    let link = document.createElement("a");
    link.setAttribute("href", "#");
    link.className = "secondary-content";
    let editIcon = document.createElement("i");
    editIcon.className = "fas fa-edit fa-large";
    editIcon.setAttribute("onclick", editContent)
    link.appendChild(editIcon);
    let deleteIcon = document.createElement("i");
    deleteIcon.className = "fa fa-trash fa-lg";

    deleteIcon.setAttribute("onclick", "deleteTask()")
    link.appendChild(deleteIcon);
    listItem.appendChild(link);

    ul.appendChild(listItem);

    //store task in local storage
    storeTaskInLocalStorage(TaskInput.value, false)
    TaskInput.value = "";
    location.reload();
}
function deleteTask() {
    event.target.parentNode.parentNode.remove();

    //remove from local storage
    let tasks;
    if (localStorage.getItem("tasks") === null) {
        tasks = [];
    }
    else {
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }

    tasks.forEach(function (task, index) {
       
        if (task[0] == event.target.closest("li").firstChild.nextSibling.textContent) {
            tasks.splice(index, 1);
        }
    })
    localStorage.setItem("tasks", JSON.stringify(tasks))

}
function clearTasks() {
    while (ul.firstChild) {
        ul.firstChild.remove();
    }
    localStorage.removeItem("tasks");
}
function filterTasks(e) {
    e.preventDefault()

    //better to use a foreach for a nodelist
    ul.querySelectorAll(".collection-item").forEach(function (task) {

        if ((task.firstChild.nextSibling.textContent.toLowerCase()).search(filter.value.toLowerCase()) != -1) {
            task.style.display = "block";
        }
        else {
            task.style.display = "none";
        }

    })



}
function storeTaskInLocalStorage(taskInLS, checkBoxValueInLS) {   //store user tasks to LS
    let tasks;
    let TaskandCheck = [taskInLS, checkBoxValueInLS];
    if (localStorage.getItem("tasks") === null) {
        tasks = [];
    }
    else {
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }

    tasks.push(TaskandCheck);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function getTasks() {    //function maintains UI and data even when page is reloaded
    let tasks;
    if (localStorage.getItem("tasks") === null) {
        tasks = [];
    }
    else {
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    tasks.forEach(function (task) {


        let listItem = document.createElement('li');
        listItem.className = "collection-item";
        let checkbox = document.createElement('p');
        checkbox.style.display = "inline-block";
        let p = document.createElement("p");
        p.appendChild(document.createTextNode(task[0]));
        p.className = "para"
        p.style.display = "inline-block"
        listItem.addEventListener("click",function(){
            p.style.textOverflow="initial"
            p.style.overflow="auto"
           
        
        },true)  //true used to for event capturing
          document.addEventListener("click",function(){
            if(!(event.target==listItem))
              {
            p.style.textOverflow="ellipsis ellipsis"
            p.style.width="200px";
            p.style.whiteSpace="nowrap";
            p.style.overflow="hidden";
            p.style.padding="10px"
              }
        })
        
        p.style.maxWidth = "50%";
        if (task[1] == true) {
            checkbox.innerHTML = `<label>
        <input type="checkbox"  onclick="check()" checked/>
        <span></span>
      </label>`
            p.style.textDecorationLine = "line-through"
        }
        else {
            checkbox.innerHTML = `<label>
        <input type="checkbox"  onclick="check()" />
        <span></span>
      </label>`
        }
        listItem.appendChild(checkbox);

        listItem.appendChild(p);
        let link = document.createElement("a");
        link.setAttribute("href", "#");
        link.className = "secondary-content";
        let editIcon = document.createElement("i");

        editIcon.className = "fa fa-pencil-square-o fa-lg";
        editIcon.style.padding = "1%";
        editIcon.setAttribute("onclick", "editContent()")
        link.appendChild(editIcon);
        let deleteIcon = document.createElement("i");
        deleteIcon.className = "fa fa-trash fa-lg";

        deleteIcon.setAttribute("onclick", "deleteTask()")
        link.appendChild(deleteIcon);

        listItem.appendChild(link);
        ul.appendChild(listItem);

    })


}
function check() {           //strike and unstrike LI content based on user changing checkbox and update it to LS
    let checkboxValue = event.target;

    if (checkboxValue.checked) {
        console.log(event.target.closest("li"))
        event.target.closest("li").firstChild.nextSibling.style.textDecorationLine = "line-through"

    }
    else {
        event.target.closest("li").firstChild.nextSibling.style.textDecorationLine = "none"
        event.target.closest("li").style.opacity = "100";
    }
    let tasks;
    if (localStorage.getItem("tasks") === null) {
        tasks = [];
    }
    else {
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    let newTasks = []
    newTasks = tasks.map(function (task) {

        if (task[0].toLowerCase() == event.target.closest("li").firstChild.nextSibling.textContent.toLowerCase()) {
            task[1] = checkboxValue.checked;

        }
        return task
    })

    localStorage.setItem('tasks', JSON.stringify(newTasks));

}
function editContent() {
    let item = event.target.closest("li").firstChild.nextSibling; //para tag containing user text

    
    item.addEventListener("focusin", function () {       //to get text before user edits it
        previousText = document.activeElement.innerText;
    })
    item.contentEditable = "true";      //allow edit mode

    item.onblur = function () {       //disable edit mode after user goes out of focus and set modified content to LS
        item.contentEditable = "false";
        let tasks;
        if (localStorage.getItem("tasks") === null) {
            //do nothing
        }
        else {
            tasks = JSON.parse(localStorage.getItem("tasks"))
        }
        let modifiedTasks = []
        modifiedTasks = tasks.map(function (task) {
            if (previousText == task[0]) {
                task[0] = item.innerText
            }

            return task
        })
        localStorage.setItem("tasks", JSON.stringify(modifiedTasks))
        
    }
}