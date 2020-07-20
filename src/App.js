import React from 'react';
import Spreadsheet from './Spreadsheet';
import Table from './components/Table';

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
			<div className="container-fluid">
				<h2>Data Comparison Spreadsheet Tool</h2>
				<Table key="Table" sheet={this.state.sheet} sheetUpdated={this.sheetUpdated}/>
			</div>
		);
	}
}
