import { useState } from 'react';
import './App.css';
import InputField from './components/InputField';
import { Todo } from './model';
import TodoList from './components/TodoList';
import { DragDropContext, OnDragEndResponder } from '@hello-pangea/dnd';

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>('');

  const [todos, setTodos] = useState<Todo[]>([]);

  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (todo) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          todo: todo,
          isDone: false,
        },
      ]);

      setTodo('');
    }
  };

  const onDragEnd: OnDragEndResponder = (result) => {
    // console.log(result);

    const { source, destination } = result;

    /**DOCU:
     * If the result doesn't have a destination (null), do nothing:
        result = {
          "draggableId": "1695366820010",
          "type": "DEFAULT",
          "source": {
            "index": 0,
            "droppableId": "ActiveTasks"
          },
          "reason": "DROP",
          "mode": "FLUID",
          "destination": null,
          "combine": null
        }
     */
    if (!destination) return;

    /**DOCU:
     * If the result's destination is the same as the source, do nothing:
        result = {
          "draggableId": "1695366820010",
          "type": "DEFAULT",
          "source": {
            "index": 0,
            "droppableId": "ActiveTasks"
          },
          "reason": "DROP",
          "mode": "FLUID",
          "destination": {
            "droppableId": "ActiveTasks",
            "index": 0
          },
          "combine": null
        }
      */
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    let add;
    let active = todos;
    let complete = completedTodos;

    /**DOCU:
     * If the source and destination are different, then handle the drag and drop.
     
      result = {
        "draggableId": "1695367420515",
        "type": "DEFAULT",
        "source": {
          "index": 0,
          "droppableId": "ActiveTasks"
        },
        "reason": "DROP",
        "mode": "FLUID",
        "destination": {
          "droppableId": "CompletedTasks",
          "index": 0
        },
        "combine": null
      }
     */
    if (source.droppableId === 'ActiveTasks') {
      add = active[source.index];
      active.splice(source.index, 1);
    } else {
      add = complete[source.index];
      complete.splice(source.index, 1);
    }

    if (destination.droppableId === 'ActiveTasks') {
      active.splice(destination.index, 0, add);
    } else {
      complete.splice(destination.index, 0, add);
    }

    setCompletedTodos(complete);
    setTodos(active);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='App'>
        <span className='heading'>Taskify</span>

        <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />

        <TodoList
          todos={todos}
          setTodos={setTodos}
          completedTodos={completedTodos}
          setCompletedTodos={setCompletedTodos}
        />
      </div>
    </DragDropContext>
  );
};

export default App;
