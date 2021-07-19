"use strict";
const taskerApp = (function () {

    class TaskerView {

        constructor(container) {

            this.container = container;

            // HomePage
            this.HomePageComponent = {
                id: "homepage",
                title: "Tasker",
                render: (className = "taskerPage", ...rest) => {
                    return `
                    <main class="${className}">
                        <div class="head">
                            <div class="head__day">${rest[0][0].day}</div>
                            <button class="head__setupButton">...</button>
                        </div>
                        <div class="tasks"></div>
                        <div class="lists">
                            <div class="listsTitle">Lists</div>
                        </div>
                        <button class="addButton">+</button>
                    </main>
                  `;
                }
            };

            this.router = {
                homepage: this.HomePageComponent,
                default: this.HomePageComponent,
            };
        }

        init() {
            return false;
        }

        renderContent(hashPageName, storageInfo) {
            let routeName = "default";

            if (hashPageName.length > 0) {
                routeName = hashPageName in this.router ? hashPageName : "error";
            }

            window.document.title = this.router[routeName].title;
            this.container.innerHTML = this.router[routeName].render(`${routeName}-page`, storageInfo);
        }

        createContent(storageInfo) {

            let divHeadDay = document.querySelector('.head__day');
            divHeadDay.innerHTML = storageInfo[0].day;

            let tasksList = document.createElement('ul');
            tasksList.setAttribute("class", "tasks__list");

            console.log(storageInfo);

            let tasks = storageInfo[0].tasks;
            for (let i = 0; i < tasks.length; i++) {
                let li = document.createElement('li');
                let input = document.createElement('input');
                input.setAttribute("type", "checkbox");
                input.setAttribute("data-parent", tasks[i].parent);

                let pText = document.createElement('p');
                let spanText = document.createElement('span');
                spanText.setAttribute("class", "taskText");
                spanText.innerHTML = tasks[i].text;
                pText.append(spanText);
                if (!!tasks[i].time) {
                    let spanTime = document.createElement('span');
                    spanTime.setAttribute("class", "taskTime");
                    spanTime.innerHTML = tasks[i].time;
                    pText.append(spanTime);
                }

                let spanColor = document.createElement('span');
                spanColor.setAttribute("class", `${tasks[i].parent}_color`);
                li.append(input);
                li.append(pText);
                li.append(spanColor);
                tasksList.append(li);
            }
            let divTasks = document.querySelector('.tasks');
            divTasks.append(tasksList);

            let listsList = document.createElement('ul');
            listsList.setAttribute("class", "lists__list");
            let lists = storageInfo[0].lists;
            for (let i = 0; i < lists.length; i++) {
                let li = document.createElement('li');

                let spanText = document.createElement('span');
                spanText.setAttribute("class", "listText");
                spanText.innerHTML = lists[i].category;

                let spanCountTask = document.createElement('span');
                spanCountTask.setAttribute("class", "listCountTask");
                spanCountTask.innerHTML = `${lists[i].count} ${lists[i].count < 2 ? "task" : "tasks"}`;

                li.append(spanText);
                li.append(spanCountTask);
                listsList.append(li);
            }
            let divLists = document.querySelector('.lists');
            divLists.append(listsList);
        }
    };

    class TaskerModel {

        constructor(view) {
            this.view = view;
        }

        init() {
            return false;
        }

        firstLoad() {
            let storageInfo = JSON.parse(window.localStorage.getItem("UserTaskInfo"));
            this.updateState(storageInfo);
            this.view.createContent(storageInfo);
        }

        updateState(storageInfo) {
            const hashPageName = window.location.hash.slice(1).toLowerCase();
            this.view.renderContent(hashPageName, storageInfo);
        }
    };

    class TaskerController {

        constructor(model, container) {
            this.model = model;
            this.container = container;
        }

        init() {
            if (window.localStorage.getItem("UserTaskInfo") === null) {
                let storage = [{
                    day: "Today",
                    tasks: [{
                            text: "Start making a presentation",
                            parent: "Work",
                            time: "",
                        },
                        {
                            text: "Pay for rent",
                            parent: "Shopping",
                            time: "7 pm",
                        },
                        {
                            text: "Buy a milk",
                            parent: "Shopping",
                            time: "",
                        },
                        {
                            text: "Don’t forget to pick up Mickael from school",
                            parent: "Inbox",
                            time: "",
                        },
                        {
                            text: "Buy a chocolate for Charlotte",
                            parent: "Family",
                            time: "",
                        }
                    ],
                    lists: [{
                            category: "Inbox",
                            count: 1,
                        },
                        {
                            category: "Work",
                            count: 1,
                        },
                        {
                            category: "Shopping",
                            count: 2,
                        },
                        {
                            category: "Family",
                            count: 1,
                        }
                    ],
                }, ];
                window.localStorage.setItem("UserTaskInfo", JSON.stringify(storage));
            }

            this.firstLoad();
        }

        firstLoad() {
            this.model.firstLoad();
            // this.model.updateState();
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