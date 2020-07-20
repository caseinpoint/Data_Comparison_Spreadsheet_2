import React from 'react';

export default class ColumnForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sheet: props.sheet,
			newColName: '',
			newColText: true,
			newColBig: false,
			newColSmall: false,
			errorText: ''
		};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleInputChange(event) {
		let state = {};
		if (event.target.type === 'text') {
			state.errorText = '';
			if (/_/.test(event.target.value) === true) {
				state.errorText = 'Underscores are reserved for system use.';
			} else if (event.target.value.length > 32) {
				state.errorText = 'Column names are limited to 32 characters.'
			} else {
				state.newColName = event.target.value;
			}
		} else {
			state.newColText = false;
			state.newColBig = false;
			state.newColSmall = false;
			state[event.target.id] = event.target.checked;
		}
		this.setState(state);
	}

	handleSubmit(event) {
		event.preventDefault();
		if (this.state.newColName.length === 0) {
			this.setState({ errorText: 'Column name is required.'});
		} else if (this.state.sheet.columnNames.includes(this.state.newColName)) {
			this.setState({ errorText: 'Duplicate column name.'});
		} else {
			const name = this.state.newColName;
			let type = 't';
			if (this.state.newColBig === true) {
				type = '+';
			} else if (this.state.newColSmall === true) {
				type = '-';
			}
			this.state.sheet.addColumn(name, type);
			this.setState({
				sheet: this.state.sheet,
				newColName: '',
				newColText: true,
				newColBig: false,
				newColSmall: false,
				errorText: '',
			});
			this.props.sheetUpdated();
		}
	}

	render() {
		return (
			<form className="form-inline border py-1 px-3" onSubmit={this.handleSubmit}>
				<input type="text" className="form-control" name="newColName" value={this.state.newColName}
				placeholder="New Column Name" onChange={this.handleInputChange}/>
				<div className="form-check">
					<input type="radio" className="form-check-input ml-3" name="newColType" id="newColText"
					checked={this.state.newColText} onChange={this.handleInputChange}/>
					<label className="form-check-label">Text</label>
					<input type="radio" className="form-check-input ml-1" name="newColType" id="newColBig"
					checked={this.state.newColBig} onChange={this.handleInputChange}/>
					<label className="form-check-label">Large Number</label>
					<input type="radio" className="form-check-input ml-1" name="newColType" id="newColSmall"
					checked={this.state.newColSmall} onChange={this.handleInputChange}/>
					<label className="form-check-label">Small Number</label>
				</div>
				<button className="btn btn-primary ml-3" type="submit">Add Column</button>
				<p className="text-danger">{this.state.errorText}</p>
			</form>
		);
	}
}
