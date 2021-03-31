import React from 'react';
import Spreadsheet from './Spreadsheet';
import Table from './components/Table';
import Blah from './components/Blah';
import {BrowserRouter, Route, Link} from 'react-router-dom';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sheet: new Spreadsheet()
		};
		this.sheetUpdated = this.sheetUpdated.bind(this);
	}

	sheetUpdated() {
		this.setState({ sheet: this.state.sheet });
	}

	render() {
		return (
			<BrowserRouter>
			<div className="container-fluid">
				<h2>Data Comparison Spreadsheet Tool</h2>
				<Link to="/blah" className="btn btn-primary">blah</Link>
				<Route exact path="/blah" component={Blah}/>
				<Table key="Table" sheet={this.state.sheet} sheetUpdated={this.sheetUpdated}/>
			</div>
			</BrowserRouter>
		);
	}
}
