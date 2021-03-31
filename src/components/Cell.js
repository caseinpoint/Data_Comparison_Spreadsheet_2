import React from 'react';

export default class Cell extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			inputValue: undefined,
			isEditing: false
		};
		this.handleDoubleClick = this.handleDoubleClick.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleDoubleClick(event) {
		this.setState({ isEditing: true, inputValue: this.props.value });
	}

	handleInputChange(event) {
		let value = event.target.value;
		if (this.props.type !== 't') value = parseFloat(value);
		this.setState({ inputValue: value });
	}

	handleSubmit(event) {
		event.preventDefault();
		let value = this.state.inputValue;
		if (this.props.type === '+' || this.props.type === '-') {
			value = parseFloat(value);
		}
		this.props.sheet.setValue(this.props.row, this.props.col, value);
		this.setState({ isEditing: false });
		this.props.sheetUpdated();
	}

	render() {
		if (this.state.isEditing) {
			let type = (this.props.type === 't') ? 'text' : 'number';
			return(<td className="px-0 py-1"><form className="input-group" onSubmit={this.handleSubmit}>
				<input type={type} className="form-control" value={this.state.inputValue} onChange={this.handleInputChange}
				step="any" required autoFocus/>
				<div className="input-group-append">
					<button type="submit" className="btn btn-outline-success">Set</button>
				</div>
			</form></td>);
		} else {
			switch (this.props.type) {
				case 't':
					return (<td onDoubleClick={this.handleDoubleClick}>
						{this.props.value}
					</td>);
				case 'a':
					return (<td className="text-primary">
						{this.props.value.toFixed(3)}
					</td>);
				default:
					return (<td onDoubleClick={this.handleDoubleClick}>
						<div className="row">
							<div className="col-6">{this.props.value}</div>
							<div className="col-6 text-primary">{this.props.score.toFixed(2)}</div>
						</div>
					</td>);
			}
		}
	}
}
