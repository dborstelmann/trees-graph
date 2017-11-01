var graphql = require('graphql')
var GraphQLObjectType = graphql.GraphQLObjectType
var GraphQLBoolean = graphql.GraphQLBoolean
var GraphQLID = graphql.GraphQLID
var GraphQLString = graphql.GraphQLString
var GraphQLList = graphql.GraphQLList
var GraphQLNonNull = graphql.GraphQLNonNull
var GraphQLSchema = graphql.GraphQLSchema

// Mongoose Schema definition
// var TODO = mongoose.model('Todo', new Schema({
//     id: mongoose.Schema.Types.ObjectId,
//     text: String,
//     done: Boolean
// }))
//
// var COMPOSE_URI_DEFAULT = 'mongodb://localhost/graphql-todo'
//     mongoose.connect(process.env.MONGODB_URI || COMPOSE_URI_DEFAULT, function (error) {
//     if (error) console.error(error)
//     else console.log('mongo connected')
// })
/** END */

var TodoType = new GraphQLObjectType({
    name: 'todo',
    fields: () => ({
        id: {
            type: GraphQLID,
            description: 'Todo id'
        },
        text: {
            type: GraphQLString,
            description: 'Todo text'
        },
        done: {
            type: GraphQLBoolean,
            description: 'Flag for completed task'
        }
    })
})

var promiseListAll = () => {
    return new Promise((resolve, reject) => {
        TODO.find((err, todos) => {
            if (err) reject(err)
            else resolve(todos)
        })
    })
}

var QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        todos: {
            type: new GraphQLList(TodoType),
            resolve: () => {
                return promiseListAll()
            }
        }
    })
})

var MutationAdd = {
    type: TodoType,
    description: 'Add a Todo',
    args: {
        text: {
            name: 'Todo text',
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    resolve: (root, args) => {
        var newTodo = new TODO({
            text: args.text,
            done: false
        })
        newTodo.id = newTodo._id
        return new Promise((resolve, reject) => {
            newTodo.save(function (err) {
                if (err) reject(err)
                else resolve(newTodo)
            })
        })
    }
}

var MutationToggle = {
    type: TodoType,
    description: 'Toggle the todo',
    args: {
        id: {
            name: 'Todo Id',
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    resolve: (root, args) => {
        return new Promise((resolve, reject) => {
            TODO.findById(args.id, (err, todo) => {
                if (err) {
                    reject(err)
                    return
                }

                if (!todo) {
                    reject('Todo NOT found')
                    return
                } else {
                    todo.done = !todo.done
                    todo.save((err) => {
                        if (err) reject(err)
                        else resolve(todo)
                    })
                }
            })
        })
    }
}

var MutationRemove = {
    type: TodoType,
    description: 'Remove the todo',
    args: {
        id: {
            name: 'Todo Id',
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    resolve: (root, args) => {
        return new Promise((resolve, reject) => {
            TODO.findById(args.id, (err, todo) => {
                if (err) {
                    reject(err)
                } else if (!todo) {
                    reject('Todo NOT found')
                } else {
                    todo.remove((err) => {
                        if (err) reject(err)
                        else resolve(todo)
                    })
                }
            })
        })
    }
}

var MutationEdit = {
    type: TodoType,
    description: 'Edit a todo',
    args: {
        id: {
            name: 'Todo Id',
            type: new GraphQLNonNull(GraphQLString)
        },
        text: {
            name: 'Todo text',
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    resolve: (root, args) => {
        return new Promise((resolve, reject) => {
            TODO.findById(args.id, (err, todo) => {
                if (err) {
                    reject(err)
                    return
                }

                if (!todo) {
                    reject('Todo NOT found')
                    return
                }

                todo.text = args.text
                todo.save((err) => {
                    if (err) reject(err)
                    else resolve(todo)
                })
            })
        })
    }
}

// var MutationToggleAll = {
//   type: new GraphQLList(TodoType),
//   description: 'Toggle all todos',
//   args: {
//     checked: {
//       name: 'Todo Id',
//       type: new GraphQLNonNull(GraphQLBoolean)
//     }
//   },
//   resolve: (root, args) => {
//     return new Promise((resolve, reject) => {
//       TODO.find((err, todos) => {
//         if (err) {
//           reject(err)
//           return
//         }
//         TODO.update({
//           _id: {
//             $in: todos.map((todo) => todo._id)
//           }
//         }, {
//           completed: args.checked
//         }, {
//           multi: true
//         }, (err) => {
//           if (err) reject(err)
//           else promiseListAll().then(resolve, reject)
//         })
//       })
//     })
//   }
// }

// var MutationClearCompleted = {
//   type: new GraphQLList(TodoType),
//   description: 'Clear completed',
//   resolve: () => {
//     return new Promise((resolve, reject) => {
//       TODO.find({completed: true}, (err, todos) => {
//         if (err) {
//           reject(err)
//         } else {
//           TODO.remove({
//             _id: {
//               $in: todos.map((todo) => todo._id)
//             }
//           }, (err) => {
//             if (err) reject(err)
//             else resolve(todos)
//           })
//         }
//       })
//     })
//   }
// }


// var MutationType = new GraphQLObjectType({
//     name: 'Mutation',
//     fields: {
//         add: MutationAdd,
//         toggle: MutationToggle,
//         // toggleAll: MutationToggleAll,
//         remove: MutationRemove,
//         // clearCompleted: MutationClearCompleted,
//         edit: MutationEdit
//     }
// })

module.exports = new GraphQLSchema({
  // query: QueryType,
  // mutation: MutationType
})
