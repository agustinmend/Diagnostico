using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace TodoBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodoController : ControllerBase
{
    // Simulación de Base de Datos en Memoria
    private static List<TodoItem> _todos = new()
    {
        new TodoItem { Id = 1, Title = "Aprender Angular", IsCompleted = false },
        new TodoItem { Id = 2, Title = "Hacer Backend en C#", IsCompleted = true }
    };

    [HttpGet]
    public ActionResult<IEnumerable<TodoItem>> Get()
    {
        return Ok(_todos);
    }

    [HttpPost]
    public ActionResult<TodoItem> Post(TodoItem todo)
    {
        todo.Id = _todos.Count > 0 ? _todos.Max(t => t.Id) + 1 : 1;
        _todos.Add(todo);
        return CreatedAtAction(nameof(Get), new { id = todo.Id }, todo);
    }

    [HttpPut("{id}")]
    public IActionResult Put(int id, TodoItem updatedTodo)
    {
        var todo = _todos.FirstOrDefault(t => t.Id == id);
        if (todo == null) return NotFound();

        todo.Title = updatedTodo.Title;
        todo.IsCompleted = updatedTodo.IsCompleted;
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var todo = _todos.FirstOrDefault(t => t.Id == id);
        if (todo == null) return NotFound();

        _todos.Remove(todo);
        return NoContent();
    }
}