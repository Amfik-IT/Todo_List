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
                        <div class="head">
                            <div class="head__day"></div>
                            <a class="head__setup-button">
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
                        <div class="modal-category">
                            <a class="modal-category__close-button"></a>
                            <div class="modal-category__header">
                                <div class="modal-category__header-text">
                                    <span class="modal-category__header-category"></span>
                                    <span class="modal-category__header-count"></span>
                                </div>
                                <a class="edit-button"><img class="shape"></a>
                            </div>
                            <div class="modal-category__main">
                                <ul class="modal-category__main-tasks"></ul>
                            </div>
                        </div>
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
                        <div class="create-task__buttons">
                            <div>
                                <a class="calendar-button"><img src="img/calendar.svg" alt="calendar" title="calendar"></a>
                                <a class="clock-button"><img src="img/alarm.svg" alt="clock" title="clock"></a>
                            </div>
                            <div>
                                <a class="category-button"><span class="category-button__text">Inbox</span><span class="inbox-color" style="background-color: #ebeff5"></span></a>
                            </div>
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

        createContent(storageInfo) {
            let divHeadDay = document.querySelector('.head__day');
            divHeadDay.innerHTML = storageInfo[0].day;
            let tasksList = document.createElement('ul');
            tasksList.setAttribute("class", "tasks__list");
            let tasks = storageInfo[0].tasks;

            for (let i = 0; i < tasks.length; i++) {
                let li = document.createElement('li');
                li.setAttribute("class", "tasks__list-item");
                let input = document.createElement('input');
                input.setAttribute("type", "checkbox");
                input.setAttribute("data-parent", tasks[i].parent);
                input.setAttribute("class", "custom-checkbox");
                input.setAttribute("id", `${tasks[i].id}`);
                input.checked = tasks[i].checked;

                let pText = document.createElement('p');
                let spanText = document.createElement('span');
                spanText.setAttribute("class", "task-text");
                spanText.innerHTML = tasks[i].text;
                pText.append(spanText);

                if (!!tasks[i].time) {
                    let spanTime = document.createElement('span');
                    spanTime.setAttribute("class", "task-time");
                    spanTime.innerHTML = tasks[i].time;
                    pText.append(spanTime);
                }

                let spanColor = document.createElement('span');
                spanColor.setAttribute("class", `${tasks[i].parent.toLowerCase()}-color`);
                spanColor.setAttribute("style", `background-color: ${tasks[i].color}`);
                li.append(input);
                li.append(pText);
                li.append(spanColor);

                let label = document.createElement('label');
                label.setAttribute("data-category", tasks[i].parent.toLowerCase());
                label.append(li);
                tasksList.append(label);
            }

            let divTasks = document.querySelector('.tasks');
            divTasks.append(tasksList);

            let listsList = document.createElement('ul');
            listsList.setAttribute("class", "lists__list");
            let lists = storageInfo[0].lists;

            for (let i = 0; i < lists.length; i++) {
                let li = document.createElement('li');
                li.setAttribute("class", "lists__list-item");
                li.setAttribute("style", `background-color: ${lists[i].color}`);
                li.setAttribute("data-category", `${lists[i].category.toLowerCase()}`);

                let spanText = document.createElement('span');
                spanText.setAttribute("class", "list-text");
                spanText.innerHTML = lists[i].category;

                let spanCountTask = document.createElement('span');
                spanCountTask.setAttribute("class", "list-count-task");
                spanCountTask.innerHTML = `${lists[i].count} ${lists[i].count < 2 ? "task" : "tasks"}`;

                li.append(spanText);
                li.append(spanCountTask);
                listsList.append(li);
            }

            let divLists = document.querySelector('.lists');
            divLists.append(listsList);
        }

        visibleToggle() {
            let modalButton = document.querySelector('.add-button');
            let modal = document.querySelector(".modal-add");
            let plus = document.querySelector('.add-button__img');
            let modalAddButton = document.querySelector('.modal-add__buttons');
            
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

        openModalCategory(tascksArr, categoryInfo) {
            const modal = document.querySelector('.modal-category');
            const ul = document.querySelector('.modal-category__main-tasks');
            ul.innerHTML = "";
            
            tascksArr.forEach((item) => {
                const label = document.createElement('label');
                const li = document.createElement('li');
                const p = document.createElement('p');
                const span = document.createElement('span');

                label.setAttribute('for', `${item.id}`);
                li.setAttribute('class', 'tasks__list-item');
                span.classList.add('task-text');
                span.setAttribute('data-id', `${item.id}`);

                if (item.checked) {
                    span.classList.add('check');
                }

                span.innerHTML = item.text;
                p.append(span);

                if (item.time) {
                    const spanTime = document.createElement('span');
                    spanTime.setAttribute('class', 'task-time');
                    spanTime.innerHTML = item.time;
                    p.append(spanTime);
                }

                li.append(p);
                label.append(li);
                ul.append(label);
            });

            document.querySelector('.modal-category__header-category').innerHTML = categoryInfo[0].category;
            document.querySelector('.modal-category__header-count').innerHTML = `${categoryInfo[0].count} ${categoryInfo[0].count < 2 ? "task" : "tasks"}`;
            document.querySelector('.shape').setAttribute('src', `${categoryInfo[0].category === "Work" 
            || categoryInfo[0].category === "Shopping" ? "img/shapeWhite.svg" : "img/shapeBlack.svg"}`);
            modal.style.backgroundColor = `${categoryInfo[0].color}`;
            modal.setAttribute('data-category', `${categoryInfo[0].category.toLowerCase()}`);
            modal.classList.remove('close')
            modal.classList.add('open');

        }

        modalTaskCheck(id) {
            document.querySelector(`[data-id='${id}']`).classList.toggle('check');
        }

        closeModalCategory() {
            const modal = document.querySelector('.modal-category');
            modal.classList.remove('open');
            modal.classList.add('close');
        }
    };

    class TaskerModel {
        constructor(view) {
            this.view = view;
        }

        init() {
            const storage = localStorage.getItem("userInfo");

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
                            color: "#ffe761",
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
                            color: "#ffe761"
                        }
                    ],
                }, ];
                localStorage.setItem("userInfo", JSON.stringify(storageData));
            }

            this.updateState();
        }

        getData() {
            return JSON.parse(localStorage.getItem("userData"));
        }

        initialLoad() {
            const storage = JSON.parse(localStorage.getItem("userInfo"));
            this.view.createContent(storage);
        }

        updateState() {
            const hashPageName = window.location.hash.slice(1);
            this.view.renderContent(hashPageName);

            if (!hashPageName || hashPageName === "homePage") this.initialLoad();
        }

        updateData(targetId) {
            const storage = JSON.parse(localStorage.getItem("userInfo"));

            for(let i=0; i < storage[0].tasks.length; i++) {
                if (storage[0].tasks[i].id === targetId) {
                    storage[0].tasks[i].checked = !(storage[0].tasks[i].checked);
                };
            }
            localStorage.setItem("userInfo", JSON.stringify(storage));
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

        saveTask(infoTasck) {
            const newData = this.getData();
            const categoryList = newData[0].lists;
            const id = newData[0].tasks.length + 1;
            const task = {
                id,
                text: infoTasck.message,
                parent: infoTasck.category,
                checked: infoTasck.checked,
                color: categoryList.find((item) => item.category.toLowerCase() === infoTasck.category).color,
                time: infoTasck.time,
            }
            let categoryCount = null;
            const foundCategoryCount = categoryList.find((item) => item.category.toLowerCase() === infoTasck.category);
            if (!!foundCategoryCount) { 
                categoryCount = foundCategoryCount.count + 1; 
            };

            newData[0].tasks.push(task);
            newData[0].lists.find((item) => item.category.toLowerCase() === infoTasck.category).count = categoryCount;
            localStorage.setItem("userData", JSON.stringify(newData));
        }

        openModalCategory(category) {
            const tascksArr = this.getData()[0].tasks.filter((item) => item.parent.toLowerCase() === category);
            const categoryInfo = this.getData()[0].lists.filter((item) => item.category.toLowerCase() === category);
            this.view.openModalCategory(tascksArr, categoryInfo);
        }

        modalTaskCheck(id) {
            this.view.modalTaskCheck(id);
        }

        closeModalCategory() {
            this.view.closeModalCategory();
        }
    };

    class TaskerController {
        constructor(model, container) {
            this.model = model;
            this.container = container;
        }

        init() {
            this.model.updateState();

            window.addEventListener("hashchange", () => {
                this.model.updateState();
                const listItems = document.querySelectorAll('.lists__list-item');

                listItems.forEach((item) => {
                    item.onclick = () => {
                        this.model.openModalCategory(item.dataset.category);
                    }
                })
            });

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

                if (!window.location.hash.slice(1) || window.location.hash.slice(1) === "homePage") {
                    const listItems = document.querySelectorAll('.lists__list-item');
                    const labels = document.querySelectorAll('[for]');

                    listItems.forEach((item) => {
                        item.onclick = () => {
                            this.model.openModalCategory(item.dataset.category);
                        }
                    })

                    labels.forEach((item) => {
                        item.onclick = (e) => {
                            this.model.modalTaskCheck(item.htmlFor);
                        }
                    })
                } 
                
                document.querySelector('.modal-category__close-button').onclick = () => {
                    this.model.closeModalCategory();
                }
            })
            
            const listItems = document.querySelectorAll('.lists__list-item');

            listItems.forEach((item) => {
                item.onclick = () => {
                    this.model.openModalCategory(item.dataset.category);
                }
            })
        }

        updateData(targetId) {
            this.model.updateData(targetId);
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