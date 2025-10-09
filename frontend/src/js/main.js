import '../style/reset.css';
import '../style/style.css';
import DOMController from './DOMController.js';

const domController = new DOMController();
await domController.updateTodoList();
await domController.updateTagList();
domController.addEventListeners();
