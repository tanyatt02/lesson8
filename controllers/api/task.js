//const jwt = require('jsonwebtoken');
const models = require('../../models');
const task = require('../../models/task.js')
//const config = require('../../config/');

exports.getTasks = (req, res, next) => {
    task.list(req.body.name).then((rows) => {
        res.json({ tasks: rows });
    })
}

exports.createTask = (req, res, next) => {
    let todoItem = [req.body.name, req.body.done ? 1:0, req.body.title]
    console.log('todoItem insert = ', todoItem)
    task.insert(todoItem).then((rows) => {
        res.json({ Status: "Task created", newTaskId: rows.insertId});
    })
}

exports.update = (req, res, next) => {
    task.update([req.body.name,req.body.done ? 1:0, req.body.title, req.params.taskId]).then((rows) => {
        res.json({ Status: "Task description updated", affectedTasks: rows.affectedRows, changedTasks: rows.changedRows });
    })
}



exports.delete = (req, res, next) => {
    let params = [req.body.name, req.params.taskId];
    console.log('params delete = ', params)
    task.delete(params).then((rows) => {
        res.json({ Status: "Task deleted", deletedTasks: rows.affectedRows });
    })
}
