import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService, Todo } from './services/todo';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h1>Todo App Fullstack</h1>
      
      <div class="input-group">
        <input 
          [(ngModel)]="newTodoTitle" 
          placeholder="¿Qué necesitas hacer?" 
          (keyup.enter)="add()"
        />
        <button (click)="add()">Agregar</button>
      </div>

      <ul>
        <li *ngFor="let todo of todos">
          <span 
            [class.completed]="todo.isCompleted" 
            (click)="toggle(todo)">
            {{ todo.title }}
          </span>
          <button class="delete-btn" (click)="delete(todo.id!)">X</button>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .container { max-width: 500px; margin: 2rem auto; font-family: sans-serif; }
    .input-group { display: flex; gap: 10px; margin-bottom: 20px; }
    input { flex: 1; padding: 10px; font-size: 16px; }
    button { padding: 10px 20px; cursor: pointer; background: #007bff; color: white; border: none; }
    ul { list-style: none; padding: 0; }
    li { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #ccc; align-items: center; }
    span { cursor: pointer; flex: 1; }
    .completed { text-decoration: line-through; color: #888; }
    .delete-btn { background: #dc3545; padding: 5px 10px; margin-left: 10px; }
  `]
})
export class AppComponent implements OnInit {
  private todoService = inject(TodoService);
  
  todos: Todo[] = [];
  newTodoTitle = '';

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe(data => this.todos = data);
  }

  add() {
    if (!this.newTodoTitle.trim()) return;
    const newTodo: Todo = { title: this.newTodoTitle, isCompleted: false };
    
    this.todoService.addTodo(newTodo).subscribe(todo => {
      this.todos.push(todo);
      this.newTodoTitle = '';
    });
  }

  toggle(todo: Todo) {
    todo.isCompleted = !todo.isCompleted;
    this.todoService.updateTodo(todo).subscribe();
  }

  delete(id: number) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.todos = this.todos.filter(t => t.id !== id);
    });
  }
}