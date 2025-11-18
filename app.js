// 任务管理应用
class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.render();
    }

    // 从localStorage加载任务
    loadTasks() {
        const saved = localStorage.getItem('azure-tasks');
        return saved ? JSON.parse(saved) : [];
    }

    // 保存任务到localStorage
    saveTasks() {
        localStorage.setItem('azure-tasks', JSON.stringify(this.tasks));
    }

    // 添加新任务
    addTask(text) {
        if (text.trim() === '') return;
        
        const newTask = {
            id: Date.now(),
            text: text.trim(),
            completed: false,
            createdAt: new Date().toLocaleString('zh-CN')
        };
        
        this.tasks.unshift(newTask);
        this.saveTasks();
        this.render();
    }

    // 切换任务完成状态
    toggleTask(id) {
        this.tasks = this.tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        this.saveTasks();
        this.render();
    }

    // 删除任务
    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.render();
    }

    // 清除已完成任务
    clearCompleted() {
        this.tasks = this.tasks.filter(task => !task.completed);
        this.saveTasks();
        this.render();
    }

    // 清除所有任务
    clearAll() {
        if (confirm('确定要删除所有任务吗？')) {
            this.tasks = [];
            this.saveTasks();
            this.render();
        }
    }

    // 渲染任务列表
    render() {
        const taskList = document.getElementById('taskList');
        const totalTasks = document.getElementById('totalTasks');
        const completedTasks = document.getElementById('completedTasks');

        // 更新统计
        totalTasks.textContent = this.tasks.length;
        completedTasks.textContent = this.tasks.filter(task => task.completed).length;

        // 渲染任务列表
        if (this.tasks.length === 0) {
            taskList.innerHTML = `
                <div class="task-item" style="text-align: center; color: #666;">
                    📝 还没有任务，添加一个吧！
                </div>
            `;
            return;
        }

        taskList.innerHTML = this.tasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    ${task.completed ? 'checked' : ''}
                    onchange="taskManager.toggleTask(${task.id})"
                >
                <span class="task-text">${task.text}</span>
                <small style="color: #999; margin-left: 10px;">${task.createdAt}</small>
                <button onclick="taskManager.deleteTask(${task.id})" 
                        style="margin-left: auto; background: #dc3545; padding: 5px 10px; font-size: 12px;">
                    删除
                </button>
            </div>
        `).join('');
    }
}

// 初始化任务管理器
const taskManager = new TaskManager();

// 全局函数 - 供HTML调用
function addTask() {
    const input = document.getElementById('taskInput');
    taskManager.addTask(input.value);
    input.value = '';
    input.focus();
}

function clearCompleted() {
    taskManager.clearCompleted();
}

function clearAll() {
    taskManager.clearAll();
}

// 回车键添加任务
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('任务管理器已启动 - 部署在 Azure Static Web Apps');
});