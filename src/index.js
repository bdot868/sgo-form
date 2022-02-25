import 'bootstrap/dist/css/bootstrap.min.css';
import SgoForm from './Sgo';

const { render, useState } = wp.element;


render(<SgoForm />, document.getElementById(`sgo-app`));
