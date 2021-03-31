import React from 'react';
import './Table.css';
import ColumnForm from './ColumnForm';
import ButtonGroup from './ButtonGroup';
import Cell from './Cell';

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
		const colNum = parseInt(event.target.dataset.colnum);
		let newState = { sortColumn: colNum };
		if (colNum !== this.state.sortColumn) {
			newState.sortAscending = false;
		} else {
			newState.sortAscending = !this.state.sortAscending;
		}
		this.state.sheet.sortRows(colNum, newState.sortAscending);
		newState.sheet = this.state.sheet;
		this.setState(newState);
	}

	render() {
		let headers = [];
		headers.push(<th key="th_#" className="text-black-50">#</th>);
		for (let i = 0; i < this.state.sheet.columnNames.length; i++) {
			let th;
			let sort = '';
			if (i === this.state.sortColumn) {
				sort = (this.state.sortAscending) ? ' △' : ' ▽';
			}
			if (this.state.sheet.columnTypes[i] === 't') {
				th = <th key={'th_'+i} onClick={this.setColumnSort} data-colnum={i}>{this.state.sheet.columnNames[i]}{sort}</th>;
			} else if (this.state.sheet.columnTypes[i] === 'a') {
				th = <th key={'th_'+i} onClick={this.setColumnSort} data-colnum={i} className="text-primary">Average Score{sort}</th>;
			} else {
				th = <th key={'th_'+i} onClick={this.setColumnSort} data-colnum={i}>
					{this.state.sheet.columnNames[i]}
					<span className="text-primary"> (score)</span>
					{sort}
				</th>;
			}
			headers.push(th);
		}

		let rows = [];
		for (let r = 0; r < this.state.sheet.rows.length; r++) {
			let cells = [];
			for (let c = 0; c < this.state.sheet.columnNames.length; c++) {
				const name = this.state.sheet.columnNames[c];
				const type = this.state.sheet.columnTypes[c];
				const value = this.state.sheet.rows[r][name]['value'];
				const score = this.state.sheet.rows[r][name]['score'];
				cells.push(<Cell key={'r'+r+'c'+c} row={r} col={c} type={type} value={value} score={score}
				sheet={this.state.sheet} sheetUpdated={this.sheetUpdated}/>);
			}
			rows.push(
				<tr key={'tr_'+r}>
					<td>{r+1}</td>
					{cells}
				</tr>
			);
		}

		return (
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
							{rows}
						</tbody>
					</table>
				</div>
				<ButtonGroup key="buttonGroup" sheet={this.state.sheet} sheetUpdated={this.sheetUpdated}/>
				<p>Select "Large Number" to create a column that scores larger numbers higher. Select "Small Number" to create a column that scores smaller numbers higher. All scores are from 1 to 10 and are calculated based on that cell's percent rank in the column. Click on column headers to sort the rows by that column.</p>
			</div>
		);
	}
}
