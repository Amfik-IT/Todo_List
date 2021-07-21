"use strict";
const taskerApp = (function () {

    class TaskerView {
        constructor(container) {
            this.container = container;
            this.openModal = false;

            this.HomePageComponent = {
                id: "homepage",
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
                        <div class="modal-add hidden">
                            <div class="modal-add-buttons">
                                <a class="add-task" href="#createtask">Task</a>
                                <a class="add-list">List</a>
                            </div>
                        </div>
                        <a class="add-button">+</a>
                    </main>
                  `;
                }
            };

            this.CreateTask = {
                id: "createtask",
                title: "Tasker",
                render: (className = "create-task-page", ...rest) => {
                    return `
                    <main class="${className}">
                        <div class="head-create-task">
                            <a class="cancel-butoon" href="#homepage">Cancel</a>
                            <a class="done-butoon" href="#homepage">Done</a>
                        </div>
                        <div class="task">
                            <input type="checkbox" class="custom-checkbox">
                            <div>
                                <input type="text" class="input-text" placeholder="What do you want to do?">
                            </div>
                            <span class="category-color"></span>
                        </div>
                        <div class="create-task-buttons">
                            <div>
                                <a class="calendar-butoon"><img src="img/calendar.svg" alt="calendar" title="calendar"></a>
                                <a class="clock-butoon"><img src="img/alarm.svg" alt="clock" title="clock"></a>
                            </div>
                            <div>
                                <a class="category-butoon">Inbox <span class="Inbox-color" style="background-color: #ebeff5"></span></a>
                            </div>
                        </div>
                    </main>
                  `;
                }
            };

            this.router = {
                homepage: this.HomePageComponent,
                createtask: this.CreateTask,
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
                spanColor.setAttribute("class", `${tasks[i].parent}-color`);
                spanColor.setAttribute("style", `background-color: ${tasks[i].color}`);
                li.append(input);
                li.append(pText);
                li.append(spanColor);

                let label = document.createElement('label');
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
            
            if (this.openModal) {
                this.openModal = false;
                modalButton.style.transform = 'rotate(0deg)';
                setTimeout(() => {
                    modal.classList.toggle("hidden");
                }, 600);
                modal.style.opacity = 0;
            } else {
                this.openModal = true;
                modalButton.style.transform = 'rotate(135deg)';
                modal.classList.toggle("hidden");
                modal.style.opacity = 1;
            }
        }
    };

    class TaskerModel {
        constructor(view) {
            this.view = view;
        }

        init() {
            this.updateState();
        }

        initialLoad() {
            let storageInfo = JSON.parse(window.localStorage.getItem("userTaskInfo"));
            this.view.createContent(storageInfo);
        }

        updateState() {
            const hashPageName = window.location.hash.slice(1).toLowerCase();
            this.view.renderContent(hashPageName);
            if (hashPageName === "" || hashPageName === "homepage") this.initialLoad();
        }

        updateData(targetId) {
            let storage = JSON.parse(window.localStorage.getItem("userTaskInfo"));
            for(let i=0; i<storage[0].tasks.length; i++) {
                let chek = storage[0].tasks[i].checked;
                
                if (storage[0].tasks[i].id === targetId) {
                    storage[0].tasks[i].checked = !chek;
                };
            }
            localStorage.setItem("userTaskInfo", JSON.stringify(storage));
        }

        visibleToggle() {
            this.view.visibleToggle();
        }
    };

    class TaskerController {
        constructor(model, container) {
            this.model = model;
            this.container = container;
        }

        init() {
            const storageData = localStorage.getItem("userTaskInfo");
            if (storageData === null) {
                let storage = [{
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
                localStorage.setItem("userTaskInfo", JSON.stringify(storage));
            }

            this.model.updateState();

            window.addEventListener("hashchange", () => this.model.updateState());

            
            this.container.addEventListener('click', (e) => {
                let target = e.target;
                if (target.className === 'custom-checkbox') {
                    let targetId = Number(target.id);
                    this.updateData(targetId);
                };
                
                if (target.className === 'add-button' || target.className === "add-task" || target.className === "add-list") {
                    this.model.visibleToggle();
                };
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