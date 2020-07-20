import React from 'react';
import './Table.css';
import ColumnForm from './ColumnForm';
// import Cell from './Cell';

export default class Table extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sheet: props.sheet,
			sortColumn: props.sheet.columnNames.length - 1,
			sortAscending: false
		};
		this.sheetUpdated = this.sheetUpdated.bind(this);
		this.setColumnSort = this.setColumnSort.bind(this);
	}

	sheetUpdated() {
		this.setState({ sheet: this.state.sheet });
		this.props.sheetUpdated();
	}

	setColumnSort(event) {
		event.persist();
		console.log(event.target.dataset.colnum);
	}

	render () {
		let headers = [];
		headers.push(<th key="th#" className="text-black-50">#</th>);
		for (let i = 0; i < this.state.sheet.columnNames.length; i++) {
			if (this.state.sheet.columnTypes[i] === 't') {
				headers.push(<th key={'th'+i} onClick={this.setColumnSort} data-colnum={i}>{this.state.sheet.columnNames[i]}</th>);
			} else if (this.state.sheet.columnTypes[i] === 'a') {
				headers.push(<th key={'th'+i} onClick={this.setColumnSort} data-colnum={i} className="text-primary">Average Score</th>);
			} else {
				headers.push(<th key={'th'+i} onClick={this.setColumnSort} data-colnum={i}>
					{this.state.sheet.columnNames[i]}
					<span className="text-primary"> (score)</span>
				</th>);
			}
		}

		return(
			<div>
				<ColumnForm key="columnForm" sheet={this.state.sheet} sheetUpdated={this.sheetUpdated}/>
				<div className="table-responsive border table_box">
					<table className="table table-bordered table-hover">
						<thead className="thead-light">
							<tr>
								{headers}
							</tr>
						</thead>
						<tbody>

						</tbody>
					</table>
				</div>
				<h3>* input row for adding/deleting table rows/columns</h3>
			</div>
		);
	}
}
