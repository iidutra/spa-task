import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import { post, request, update, deleteTask, createTag } from '../services/api';
import 'react-calendar/dist/Calendar.css';
import NavBar from './NavBar'; // Ajuste o caminho conforme necessário
import '../styles/Style.css';
import '../styles/Home.css';

const getFilteredTasksByViewMode = (tasks, mode, currentDate) => {
  const current = new Date(currentDate);
  const startOfWeek = new Date(current.setDate(current.getDate() - current.getDay()));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  switch (mode) {
    case 'day':
      return tasks.filter(task => new Date(task.date).toDateString() === current.toDateString());
    case 'week':
      return tasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate >= startOfWeek && taskDate <= endOfWeek;
      });
    case 'month':
      return tasks.filter(task => new Date(task.date).getMonth() === current.getMonth());
    default:
      return tasks;
  }
};

const getFilteredTasksByTags = (tasks, selectedTagNames) => {
  if (selectedTagNames.length === 0) {
    return tasks;
  }
  return tasks.filter(task =>
    task.tags.some(tag => selectedTagNames.includes(tag.name))
  );
};


function Home() {
  const [date, setDate] = useState(new Date());
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('month');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagsForNewTask, setTagsForNewTask] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [tasksToDisplay, setTasksToDisplay] = useState([]);
  const [newTag, setNewTag] = useState('');


  const [input, setInput] = useState({
    title: '',
    description: '',
    date: '',
    hour: '',
    tag: [],
    duration: ''
  });
  const [controll, setControll] = useState(false)

  const handleAddTag = async () => {
    if (newTag.trim()) {
      try {
        const createdTag = await createTag(newTag);
        setTags([...tags, createdTag]);
        setNewTag('');
        alert('Tag criada com sucesso!');
      } catch (error) {
        alert(`Erro ao adicionar tag: ${error.message}`);
      }
    } else {
      alert('Por favor, insira um nome para a tag.');
    }
  };


  const fetchHolidays = async () => {
    const country = 'BR';
    const year = new Date().getFullYear();

    try {
      const response = await request(`https://date.nager.at/Api/v2/PublicHolidays/${year}/${country}`);
      setHolidays(response);
    } catch (error) {
      console.error('Erro ao buscar os feriados:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const tasksResponse = await request('/tasks');
        setList(tasksResponse);
        const tagsResponse = await request('/tags');
        setTags(tagsResponse);
      } catch (error) {
        console.error('Erro ao buscar as tarefas ou tags:', error);
      }
    };

    loadData();
    fetchHolidays();
  }, []);

  const applyAllFilters = () => {
    let filteredTasks = getFilteredTasksByViewMode(list, viewMode, date);
    filteredTasks = filteredTasks.filter(task => task.title.toLowerCase().includes(searchTerm));
    return getFilteredTasksByTags(filteredTasks, selectedTags);
  }

  useEffect(() => {
    const filtered = applyAllFilters();
    setTasksToDisplay(filtered);
  }, [list, viewMode, date, searchTerm, selectedTags]);

  const isHoliday = (taskDate) => {
    // Assumindo que a data da tarefa está no formato YYYY-MM-DD
    const holiday = holidays.find(holiday => holiday.date === taskDate);
    return holiday ? holiday.localName : null;
  };

  const tasksFilteredByTitle = list.filter(task => 
    task.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const tasksFilteredByTitleAndTags = getFilteredTasksByTags(tasksFilteredByTitle, selectedTags);

  const handleChangeDate = date => {
    setDate(date);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    setInput(input => ({
      ...input,
      date: `${year}-${month + 1}-${day}`
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleTagChange = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
    setInput(input => ({
      ...input,
      tags: selectedValues
    }));
    setTagsForNewTask(selectedValues);
  };

  const handleChange = ({ target }) => {
    setInput({ ...input, [target.name]: target.value });
  };

  const postOrUpdateItem = async (e) => {
    e.preventDefault();

    const taskData = {
      ...input,
      tags: tagsForNewTask.map(tagId => {
        const tag = tags.find(t => t._id === tagId);
        return tag ? { _id: tagId, name: tag.name } : null;
      }),
    };

    try {
      if (input.id) {
        // Atualiza a tarefa existente
        const updatedTask = await update(`/tasks/${input.id}`, taskData);
        setList(currentList =>
          currentList.map(task =>
            task._id === input.id ? { ...task, ...updatedTask } : task
          )
        );
      } else {
        // Cria uma nova tarefa
        const newTask = await post('/tasks', taskData);
        setList(currentList => [...currentList, { ...newTask, tags: taskData.tags }]);
      }
      // Redefine o estado do formulário após a operação de postagem ou atualização
      setInput({
        id: null,
        title: '',
        description: '',
        date: '',
        hour: '',
        duration: '',
        tags: []
      });
      setSelectedTags([]);
      setControll(false);

    } catch (error) {
      console.error('Erro ao criar/atualizar a tarefa:', error.response || error.message);
    }
  };


  const updateTask = (task) => {
    setInput({
      id: task._id,
      title: task.title,
      description: task.description,
      date: task.date,
      hour: task.hour,
      tags: task.tags.map(tag => tag._id),
      duration: task.duration
    });
    setControll(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(`/tasks/${taskId}`);
      // Se a deleção foi bem-sucedida, atualize o estado para remover a tarefa da lista
      setList(currentTasks => currentTasks.filter(task => task._id !== taskId));
      // Opcionalmente, mostre uma mensagem ao usuário
      alert('Tarefa deletada com sucesso!');
    } catch (error) {
      // Trate o erro apropriadamente
      console.error('Erro ao deletar a tarefa', error);
      alert('Erro ao deletar a tarefa: ' + error.message);
    }
  };




  return (
    <>
      <NavBar />
      <div className="body-bg">
        <div className="container">

          <div className="flex-row">
            <div className="flex-column">
              <div className="calendar-container">
                <Calendar onChange={handleChangeDate} value={date} />
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Pesquisar pelo título..."
                    onChange={handleSearchChange}
                    className="mt-3 input"
                  />
                </div>
                <div className="form-group">
                  <select
                    className="mt-3 input"
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                  >
                    <option value="day">Dia</option>
                    <option value="week">Semana</option>
                    <option value="month">Mês</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex-column">

              <div className="flex-row">
                <div className="flex-column">
                  <form onSubmit={postOrUpdateItem}>
                    <h2>{controll ? 'Editar Tarefa' : 'Adicionar Tarefa'}</h2>

                    <div className="input-group">
                      <label>
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={input.title}
                        onChange={handleChange}
                        placeholder="Title"
                      />
                    </div>

                    <div className="input-group">
                      <label>
                        Description
                      </label>
                      <input
                        as="textarea"
                        name="description"
                        value={input.description}
                        onChange={handleChange}
                        placeholder="Description"
                        style={{ height: '100px' }} // You can adjust the height as needed
                      />
                    </div>
                    <div className="input-group">
                      <label>
                        Date
                      </label>
                      <input
                        type="text"
                        name="date"
                        value={input.date}
                        onChange={handleChange}
                        placeholder="Date"
                      />
                    </div>

                    <div className="input-group">
                      <label>
                        Hour
                      </label>
                      <input
                        type="text"
                        name="hour"
                        value={input.hour}
                        onChange={handleChange}
                        placeholder="Hour"
                      />
                    </div>

                    <div className="input-group">
                      <label>
                        Tags
                      </label>
                      <select
                        multiple
                        name="tags"
                        value={selectedTags}
                        onChange={handleTagChange}
                        className="basic-multi-select"
                      >
                        {tags.map(tag => (
                          <option key={tag._id} value={tag._id}>{tag.name}</option>
                        ))}
                      </select>
                    </div>


                    <div className="input-group">
                      <label>
                        Duration
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={input.duration}
                        onChange={handleChange}
                        placeholder="Duration"
                      />
                    </div>
                    <div className="input-group">

                      <button className='button' type="submit">
                        {controll ? 'Atualizar' : 'Salvar'}
                      </button>
                    </div>
                  </form>
                </div >
              </div>
            </div >
          </div>
          {/* Lista */}
          <div className="flex-row">
            {tasksToDisplay.length > 0 ? (
              tasksToDisplay.map(item => {
                const holidayName = isHoliday(item.date); // item.date deve estar no formato YYYY-MM-DD
                return (
                  <div className="flex-column" key={item._id}>
                    <div className={holidayName ? 'holiday' : ''}>
                      <div className="card">
                        <h1>{item.title}</h1>
                        <div>
                          <h4>Description:</h4> {item.description}
                        </div>
                        <div>
                          <h4>Date:</h4> {item.date}
                        </div>
                        <div>
                          <h4>Hour:</h4> {item.hour}
                        </div>
                        <div>
                          <h4>Tags:</h4> {item.tags.map(tag => tag.name).join(', ')}
                        </div>
                        <div>
                          <h4>Duration:</h4> {item.duration}
                        </div>
                        {holidayName && (
                          <div>
                            <h4>Holiday:</h4> {holidayName}
                          </div>
                        )}
                        <button className="button-primary" onClick={() => handleDeleteTask(item._id)}>
                          Delete
                        </button>

                        {' '}
                        <button
                          className="button-secondary"
                          onClick={() => updateTask(item)} // Passa a tarefa atual para a função
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex-column">
                <p>Nenhuma tarefa encontrada.</p>
              </div>
            )}
          </div  >
        </div >
      </div>
    </>
  )
}

export default Home;