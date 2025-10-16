import '../style/reset.css';
import '../style/style.scss';
import DOMController from './DOMController.js';

const domController = new DOMController();
await domController.renderHomePage();
