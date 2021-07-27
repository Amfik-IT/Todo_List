"use strict";
const taskerApp = (function () {

    class TaskerView {
        constructor(container) {
            this.container = container;
            this.openModal = false;

            this.HomePageComponent = {
                id: "homePage",
                title: "Tasker",
                render: (className = "tasker-page", ...rest) => {
                    return `
                    <main class="${className}">
                        <div class="header">
                            <div class="header__day"></div>
                            <a class="header__setup-button">
                            <span></span>
                            <span></span>
                            <span></span>
                            </a>
                        </div>
                        <div class="tasks"></div>
                        <div class="lists">
                            <div class="lists__title">Lists</div>
                        </div>
                        <div class="modal-add hidden"></div>
                        <div class="modal-add__buttons">
                                <a class="add-task" href="#createTask">Task</a>
                                <a class="add-list">List</a>
                        </div>
                        <a class="add-button"><img class="add-button__img" src="img/plus.svg" alt="add" title="add"></a>
                    </main>
                  `;
                }
            };

            this.CreateTask = {
                id: "createTask",
                title: "Tasker",
                render: (className = "create-task-page", ...rest) => {
                    return `
                    <main class="${className}">
                        <div>
                            <div class="create-task__header">
                                <a class="cancel-button" href="#homePage">Cancel</a>
                                <a class="done-button" href="#homePage">Done</a>
                            </div>
                            <div class="create-task__body">
                                <label>
                                    <input type="checkbox" class="custom-checkbox">
                                    <span class="task-checkbox"></span>
                                </label>
                                <div>
                                    <input type="text" class="input-text" placeholder="What do you want to do?">
                                </div>
                                <span class="inbox-color" style="background-color: #ebeff5"></span>
                            </div>
                        </div>
                        <div>
                            <div class="create-task__buttons">
                                <div>
                                    <a class="calendar-button"><img src="img/calendar.svg" alt="calendar" title="calendar"></a>
                                    <a class="clock-button"><img src="img/alarm.svg" alt="clock" title="clock"></a>
                                </div>
                                <div>
                                    <a class="category-button"><span class="category-button__text">Inbox</span><span class="inbox-color" style="background-color: #ebeff5"></span></a>
                                </div>
                            </div>
                            <div class="category-сhoose"></div>
                        </div>
                        
                    </main>
                  `;
                }
            };

            this.router = {
                homePage: this.HomePageComponent,
                createTask: this.CreateTask,
                default: this.HomePageComponent,
            };
        }

        init() {
            return false;
        }

        renderContent(hashPageName) {
            let routeName = "default";

            if (hashPageName.length > 0) {
                routeName = hashPageName in this.router ? hashPageName : "error";
            }

            window.document.title = this.router[routeName].title;
            this.container.innerHTML = this.router[routeName].render(`${routeName}-page`);
        }

        getCategoryList(storageInfo) {
            const сategoryList = document.createElement('ul');
            const lists = storageInfo[0].lists;
            сategoryList.setAttribute("class", "lists__list");

            lists.forEach((item) => {
                const li = document.createElement('li');
                const spanText = document.createElement('span');
                const spanCountTask = document.createElement('span');

                li.setAttribute("class", "lists__list-item");
                li.setAttribute("style", `background-color: ${item.color}`);
                li.setAttribute("data-category", `${item.category.toLowerCase()}`);
                spanText.setAttribute("class", "list-text");
                spanText.innerHTML = item.category;
                spanCountTask.setAttribute("class", "list-count-task");
                spanCountTask.innerHTML = `${item.count} ${item.count < 2 ? "task" : "tasks"}`;
                li.append(spanText);
                li.append(spanCountTask);
                сategoryList.append(li);
            })

            return сategoryList;
        }

        getTasksList(storageInfo) {
            const tasksList = document.createElement('ul');
            const tasks = storageInfo[0].tasks;
            tasksList.setAttribute("class", "tasks__list");

            tasks.forEach((item) => {
                const li = document.createElement('li');
                const input = document.createElement('input');
                const pText = document.createElement('p');
                const spanText = document.createElement('span');
                const spanColor = document.createElement('span');
                const label = document.createElement('label');

                li.setAttribute("class", "tasks__list-item");
                input.setAttribute("type", "checkbox");
                input.setAttribute("data-parent", item.parent);
                input.setAttribute("class", "custom-checkbox");
                input.setAttribute("id", `${item.id}`);
                input.checked = item.checked;
                spanText.setAttribute("class", "task-text");
                spanText.innerHTML = item.text;
                pText.append(spanText);

                if (!!item.time) {
                    const spanTime = document.createElement('span');
                    spanTime.setAttribute("class", "task-time");
                    spanTime.innerHTML = item.time;
                    pText.append(spanTime);
                }

                spanColor.setAttribute("class", `${item.parent.toLowerCase()}-color`);
                spanColor.setAttribute("style", `background-color: ${item.color}`);
                li.append(input);
                li.append(pText);
                li.append(spanColor);
                label.append(li);
                tasksList.append(label);
            })

            return tasksList;
        }

        createContent(storage) {
            const headerDay = document.querySelector('.header__day');
            const tasksList = this.getTasksList(storage);
            const tasks = document.querySelector('.tasks');
            const categoryList = this.getCategoryList(storage);
            const lists = document.querySelector('.lists');

            headerDay.innerHTML = storage[0].day;
            tasks.append(tasksList);
            lists.append(categoryList);
        }

        createCategoryContent(storage) {
            const elementChooseCategory = document.querySelector('.category-сhoose');
            const categoryList = this.getCategoryList(storage);
            elementChooseCategory.append(categoryList);
            const lisItems = document.querySelectorAll('.lists__list-item');
            
            lisItems.forEach((item) => item.dataset.category === "inbox" ? item.classList.add("selected") : null);
        }

        showCategoryList() {
            const elementCategoryChoose = document.querySelector('.category-сhoose');

            if (!elementCategoryChoose.style.height || elementCategoryChoose.style.height === "0px") {
                elementCategoryChoose.style.height = "310px";
            } else {
                elementCategoryChoose.style.height = "0px";
            }
        }

        visibleToggle() {
            const modalButton = document.querySelector('.add-button');
            const modal = document.querySelector(".modal-add");
            const plus = document.querySelector('.add-button__img');
            const modalAddButton = document.querySelector('.modal-add__buttons');
            
            if (this.openModal) {
                this.openModal = false;
                modalButton.style.backgroundColor = "#ffffff";
                plus.setAttribute("src", "img/plus.svg");
                plus.style.transform = 'rotate(0deg)';
                modalAddButton.style.right = "-100%"
                setTimeout(() => {
                    modal.classList.toggle("hidden");
                }, 600);
                modal.style.opacity = 0;
            } else {
                this.openModal = true;
                modalButton.style.backgroundColor = "#006CFF";
                plus.setAttribute("src", "img/plusOpen.svg");
                plus.style.transform = 'rotate(135deg)';
                modal.classList.toggle("hidden");
                modal.style.opacity = 1;
                modalAddButton.style.right = "16px"
            }
        }

        selectСategory(category) {
            const listItems = document.querySelectorAll('.lists__list-item');

            listItems.forEach((item) => {
                if (item.dataset.category !== category) {
                    item.classList.remove('selected');
                } else {
                    const span = document.querySelectorAll('span[class$="color"]');

                    span.forEach((spanItem) => {
                        spanItem.style.backgroundColor = item.style.backgroundColor;
                        spanItem.className = `${category.toLowerCase()}-color`;
                    })

                    item.classList.add('selected');
                    document.querySelector('.category-button__text').innerHTML = category;
                }
            })
        }
    };

    class TaskerModel {
        constructor(view) {
            this.view = view;
        }

        init() {
            const storage = localStorage.getItem("userData");

            if (storage === null) {
                let storageData = [{
                    day: "Today",
                    tasks: [{
                            id: 1,
                            text: "Start making a presentation",
                            parent: "Work",
                            color: "#61dea4",
                            time: "",
                            checked: false,
                        },
                        {
                            id: 2,
                            text: "Pay for rent",
                            parent: "Shopping",
                            color: "#f45e6d",
                            time: "7 pm",
                            checked: false,
                        },
                        {
                            id: 3,
                            text: "Buy a milk",
                            parent: "Shopping",
                            color: "#f45e6d",
                            time: "",
                            checked: false,
                        },
                        {
                            id: 4,
                            text: "Don’t forget to pick up Mickael from school",
                            parent: "Inbox",
                            color: "#ebeff5",
                            time: "",
                            checked: false,
                        },
                        {
                            id: 5,
                            text: "Buy a chocolate for Charlotte",
                            parent: "Family",
                            color: "#ffe761;",
                            time: "",
                            checked: false,
                        }
                    ],
                    lists: [{
                            category: "Inbox",
                            count: 1,
                            color: "#ebeff5"
                        },
                        {
                            category: "Work",
                            count: 1,
                            color: "#61dea4"
                        },
                        {
                            category: "Shopping",
                            count: 2,
                            color: "#f45e6d"
                        },
                        {
                            category: "Family",
                            count: 1,
                            color: "#ffe761;"
                        }
                    ],
                }, ];
                localStorage.setItem("userData", JSON.stringify(storageData));
            }

            this.updateState();
        }

        getData() {
            return JSON.parse(localStorage.getItem("userData"));
        }

        initialLoad() {
            const storage = this.getData();
            this.view.createContent(storage);
        }

        updateState() {
            const hashPageName = window.location.hash.slice(1);
            this.view.renderContent(hashPageName);

            if (!hashPageName || hashPageName === "homePage") this.initialLoad();
            if (hashPageName === "createTask") this.view.createCategoryContent(this.getData());
        }

        updateData(targetId) {
            const storage = this.getData();

            for(let i=0; i < storage[0].tasks.length; i++) {
                if (storage[0].tasks[i].id === targetId) {
                    storage[0].tasks[i].checked = !(storage[0].tasks[i].checked);
                };
            }
            localStorage.setItem("userData", JSON.stringify(storage));
        }

        visibleToggle() {
            this.view.visibleToggle();
        }

        show() {
            this.view.showCategoryList();
        }

        selectСategory(category) {
            this.view.selectСategory(category);
        }

        saveTask(infoTask) {
            const newData = this.getData();
            const categoryList = newData[0].lists;
            const id = newData[0].tasks.length + 1;
            const foundCategoryt = categoryList.find((item) => item.category.toLowerCase() === infoTask.category);

            if (!!foundCategoryt) {
                const task = {
                    id,
                    text: infoTask.message,
                    parent: infoTask.category,
                    checked: infoTask.checked,
                    color: foundCategoryt.color,
                    time: infoTask.time,
                }

                newData[0].tasks.push(task);
                foundCategoryt.count += 1;
            };

            localStorage.setItem("userData", JSON.stringify(newData));
        }
    };

    class TaskerController {
        constructor(model, container) {
            this.model = model;
            this.container = container;
        }

        init() {
            this.model.updateState();

            window.addEventListener("hashchange", () => this.model.updateState());

            this.container.addEventListener('click', (e) => {
                if (e.target.className === 'custom-checkbox') {
                    const targetId = Number(e.target.id);
                    this.updateData(targetId);
                };
                
                if (e.target.className === 'add-button' || e.target.className === "add-task" 
                    || e.target.className === "add-list" || e.target.className === "add-button__img") {
                    this.model.visibleToggle();
                };

                if (e.target.className === 'category-button__text') this.model.show();

                if (window.location.hash.slice(1) === 'createTask') {
                    const listItems = document.querySelectorAll('.lists__list-item');

                    listItems.forEach((item) => {
                        item.onclick = (e) => {
                            this.model.selectСategory(item.dataset.category);
                        }
                    });
                }

                if (e.target.className === 'done-button') this.saveTask();
            })
        }

        updateData(targetId) {
            this.model.updateData(targetId);
        }

        saveTask() {
            const infoTask = {
                message: document.querySelector('.input-text').value,
                category: document.querySelector('.category-button__text').innerHTML,
                checked: document.querySelector('.custom-checkbox').checked,
                time: "",
            }
            this.model.saveTask(infoTask);
        }
    };

    return {
        init: function () {
            const containerElem = document.getElementById("container");

            const appView = new TaskerView(containerElem);
            const appModel = new TaskerModel(appView);
            const appController = new TaskerController(appModel, containerElem);

            appView.init();
            appModel.init();
            appController.init();
        }
    };
})();

document.addEventListener("DOMContentLoaded", taskerApp.init());