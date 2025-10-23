import '../style/reset.css';
import '../style/style.scss';
import DomController from './DomController.js';

const domController = new DomController();

await domController.renderHomePage();
