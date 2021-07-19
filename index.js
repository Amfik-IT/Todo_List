"use strict";
const taskerApp = (function () {

    class TaskerView {

        constructor(container) {

            this.container = container;

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
                        <div class="lists"></div>
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

            let tasksList = document.createElement('ul');
            tasksList.setAttribute("class", "tasks__list");
            let tasks = storageInfo[0].tasks;
            for (let i = 0; i < tasks.length; i++) {
                let li = document.createElement('li');
                li.innerHTML = tasks[i];
                tasksList.append(li);
            }
            let divTasks = document.querySelector('.tasks');
            divTasks.append(tasksList);

            let listsList = document.createElement('ul');
            listsList.setAttribute("class", "lists__list");
            let lists = storageInfo[0].lists;
            for (let i = 0; i < lists.length; i++) {
                let li = document.createElement('li');
                li.innerHTML = lists[i];
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
                    tasks: ["Start making a presentation", "Pay for rent", "Buy a milk", "Don’t forget to pick up Mickael from school", "Buy a chocolate for Charlotte"],
                    lists: ["Inbox", "Work", "Shopping", "Family"],
                }, ]
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