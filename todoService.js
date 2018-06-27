const { Record, OrderedMap } = require('immutable')
const omit = require('lodash/fp/omit')
const uuid = require('uuid')
const Boom = require('boom');

const TodoRecord = Record({
  id: '',
  text: '',
  completed: false,
})

const createTodo = text => TodoRecord({ text, id: uuid.v4() })
const delay = n => new Promise(resolve => setTimeout(resolve, n))

module.exports = function createTodoService() {
  let todos = OrderedMap()

  return {
    async addTodo(text) {
      await delay(50)
      const todo = createTodo(text)
      todos = todos.set(todo.id, todo)
      return todo.toJS()
    },
    async deleteTodo(id) {
      await delay(50)
      todos = todos.delete(id)
    },
    async editTodo(id, updates) {
      await delay(50)

      if (!todos.has(id)) {
        return Boom.notFound(`No todo with id: ${id}`)
      }
      
      try {
        todos = todos.mergeIn([id], omit(['id'], updates))
      } catch (e) {
        return Boom.badData('your data is bad and you should feel bad');
      }
      
      return todos.get(id).toJS()
    },
    async getTodos() {
      await delay(50)
      return todos.toList().toJS()
    },
  }
}
