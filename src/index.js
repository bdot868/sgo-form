import 'bootstrap/dist/css/bootstrap.min.css';
import SgoForm from './bs-components/Sgo';

const { render, useState } = wp.element;


render(<SgoForm />, document.getElementById(`sgo-app`));
